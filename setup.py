"""
setup.py — environment installer for the Instant Meshes extension.

Called by Modly with:
    python setup.py '<json_args>'

json_args:
    {
        "python_exe": "/usr/bin/python3",
        "ext_dir":    "/path/to/extension"
    }
"""

import io
import json
import os
import stat
import subprocess
import sys
import urllib.request
import zipfile


DOWNLOAD_URLS = {
    'win32':  'https://instant-meshes.s3.eu-central-1.amazonaws.com/Release/instant-meshes-windows.zip',
    'darwin': 'https://instant-meshes.s3.eu-central-1.amazonaws.com/instant-meshes-macos.zip',
    'linux':  'https://instant-meshes.s3.eu-central-1.amazonaws.com/instant-meshes-linux.zip',
}

EXE_NAME = 'instant-meshes.exe' if sys.platform == 'win32' else 'instant-meshes'


def log(msg):
    print(msg, flush=True)


def download_binary(ext_dir):
    platform = sys.platform
    url = DOWNLOAD_URLS.get(platform)
    if not url:
        log(f'Unsupported platform: {platform}')
        sys.exit(1)

    bin_dir = os.path.join(ext_dir, 'bin')
    os.makedirs(bin_dir, exist_ok=True)

    exe_path = os.path.join(bin_dir, EXE_NAME)
    if os.path.isfile(exe_path):
        log(f'Binary already present: {exe_path}')
        return

    log(f'Downloading Instant Meshes for {platform}…')
    log(f'  {url}')

    with urllib.request.urlopen(url) as resp:
        data = resp.read()

    log('Extracting binary…')
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        # Find the executable inside the zip (any .exe on Windows, any binary on Unix)
        candidates = [
            n for n in zf.namelist()
            if not n.endswith('/')
            and ('instant' in n.lower() or 'meshes' in n.lower())
            and (
                n.lower().endswith('.exe') if sys.platform == 'win32'
                else not n.lower().endswith(('.dll', '.dylib', '.so', '.txt', '.md'))
            )
        ]

        if not candidates:
            # Fallback: take the largest file (likely the binary)
            candidates = sorted(
                [n for n in zf.namelist() if not n.endswith('/')],
                key=lambda n: zf.getinfo(n).file_size,
                reverse=True,
            )[:1]

        if not candidates:
            log('Could not locate executable in zip.')
            sys.exit(1)

        chosen = candidates[0]
        log(f'  Extracting: {chosen} -> {exe_path}')
        with zf.open(chosen) as src, open(exe_path, 'wb') as dst:
            dst.write(src.read())

    # Make executable on Unix
    if sys.platform != 'win32':
        current = os.stat(exe_path).st_mode
        os.chmod(exe_path, current | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

    log(f'Binary ready: {exe_path}')


def main():
    if len(sys.argv) < 2:
        log("Usage: python setup.py '<json>'")
        sys.exit(1)

    try:
        args = json.loads(sys.argv[1])
    except Exception as exc:
        log(f'JSON parse error: {exc}')
        sys.exit(1)

    ext_dir = args.get('ext_dir', os.path.dirname(os.path.abspath(__file__)))
    log(f'Extension: {ext_dir}')

    # 1. Download Instant Meshes binary
    download_binary(ext_dir)

    # 2. npm install
    shell = sys.platform == 'win32'
    log('Installing npm dependencies…')
    try:
        subprocess.check_call(['npm', 'install', '--prefer-offline'],
                              cwd=ext_dir, shell=shell)
        log('Dependencies installed.')
    except subprocess.CalledProcessError as exc:
        log(f'npm install failed: {exc}')
        sys.exit(1)

    # 3. Compile TypeScript
    log('Compiling TypeScript…')
    try:
        subprocess.check_call(['npx', 'tsc'], cwd=ext_dir, shell=shell)
        log('Compilation done — processor.js ready.')
    except subprocess.CalledProcessError as exc:
        log(f'TypeScript compilation failed: {exc}')
        sys.exit(1)

    log('Setup complete.')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        log(f'Unexpected error: {exc}')
        sys.exit(1)
