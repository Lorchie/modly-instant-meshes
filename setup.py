"""
setup.py — environment installer for the Clean & Remesh extension.

Called by Modly at install time:
    python setup.py '{"python_exe":"...","ext_dir":"...","gpu_sm":86,"cuda_version":124}'
"""
import io
import json
import os
import platform
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


def log(msg: str) -> None:
    print(msg, flush=True)


def pip(venv: str, *args: str) -> None:
    is_win  = platform.system() == 'Windows'
    pip_exe = os.path.join(venv, 'Scripts/pip.exe' if is_win else 'bin/pip')
    result  = subprocess.run([pip_exe, *args], capture_output=True, text=True)
    if result.stdout.strip():
        log(result.stdout.strip())
    if result.returncode != 0:
        if result.stderr.strip():
            log(f'[pip error] {result.stderr.strip()}')
        raise RuntimeError(f'pip failed (exit {result.returncode})')


def download_binary(ext_dir: str) -> None:
    url = DOWNLOAD_URLS.get(sys.platform)
    if not url:
        log(f'[setup] Unsupported platform: {sys.platform} — skipping binary download.')
        return

    exe_path = os.path.join(ext_dir, 'bin', EXE_NAME)
    if os.path.isfile(exe_path):
        log('[setup] Binary already present — skipping download.')
        return

    os.makedirs(os.path.dirname(exe_path), exist_ok=True)
    log(f'[setup] Downloading Instant Meshes for {sys.platform}…')

    with urllib.request.urlopen(url) as resp:
        data = resp.read()

    log('[setup] Extracting binary…')
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        is_win     = sys.platform == 'win32'
        candidates = [
            n for n in zf.namelist()
            if not n.endswith('/')
            and ('instant' in n.lower() or 'meshes' in n.lower())
            and (n.lower().endswith('.exe') if is_win
                 else not n.lower().endswith(('.dll', '.dylib', '.so', '.txt', '.md')))
        ]
        if not candidates:
            candidates = sorted(
                [n for n in zf.namelist() if not n.endswith('/')],
                key=lambda n: zf.getinfo(n).file_size,
                reverse=True,
            )[:1]

        if not candidates:
            log('[setup] Could not find executable in zip — skipping.')
            return

        with zf.open(candidates[0]) as src, open(exe_path, 'wb') as dst:
            dst.write(src.read())

    if sys.platform != 'win32':
        os.chmod(exe_path, os.stat(exe_path).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

    log(f'[setup] Binary ready: {exe_path}')


def main() -> None:
    if len(sys.argv) < 2:
        log("Usage: python setup.py '<json>'")
        sys.exit(1)

    args    = json.loads(sys.argv[1])
    py_exe  = args['python_exe']
    ext_dir = args.get('ext_dir', os.path.dirname(os.path.abspath(__file__)))

    log(f'[setup] Extension: {ext_dir}')

    # 1. Create venv
    venv = os.path.join(ext_dir, 'venv')
    if not os.path.isdir(venv):
        log('[setup] Creating venv…')
        subprocess.check_call([py_exe, '-m', 'venv', venv])
    else:
        log('[setup] Venv already exists.')

    # 2. Install dependencies
    log('[setup] Installing dependencies…')
    pip(venv, 'install', '--upgrade', 'pip')
    pip(venv, 'install', 'trimesh', 'numpy')
    log('[setup] Dependencies installed.')

    # 3. Download binary (skipped if already present in repo)
    download_binary(ext_dir)

    log('[setup] Setup complete.')


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f'[setup] Error: {e}', flush=True)
        sys.exit(1)
