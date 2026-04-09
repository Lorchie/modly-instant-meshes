"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __glob = (map) => (path2) => {
  var fn = map[path2];
  if (fn) return fn();
  throw new Error("Module not found in bundle: " + path2);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/property-graph/dist/property-graph.cjs
var require_property_graph = __commonJS({
  "node_modules/property-graph/dist/property-graph.cjs"(exports2) {
    var EventDispatcher = class {
      constructor() {
        this._listeners = {};
      }
      addEventListener(type, listener) {
        const listeners = this._listeners;
        if (listeners[type] === void 0) {
          listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
          listeners[type].push(listener);
        }
        return this;
      }
      removeEventListener(type, listener) {
        if (this._listeners === void 0) return this;
        const listeners = this._listeners;
        const listenerArray = listeners[type];
        if (listenerArray !== void 0) {
          const index = listenerArray.indexOf(listener);
          if (index !== -1) {
            listenerArray.splice(index, 1);
          }
        }
        return this;
      }
      dispatchEvent(event) {
        if (this._listeners === void 0) return this;
        const listeners = this._listeners;
        const listenerArray = listeners[event.type];
        if (listenerArray !== void 0) {
          const array = listenerArray.slice(0);
          for (let i = 0, l = array.length; i < l; i++) {
            array[i].call(this, event);
          }
        }
        return this;
      }
      dispose() {
        for (const key in this._listeners) {
          delete this._listeners[key];
        }
      }
    };
    var GraphEdge = class extends EventDispatcher {
      constructor(_name, _parent, _child, _attributes) {
        if (_attributes === void 0) {
          _attributes = {};
        }
        super();
        this._name = void 0;
        this._parent = void 0;
        this._child = void 0;
        this._attributes = void 0;
        this._disposed = false;
        this._name = _name;
        this._parent = _parent;
        this._child = _child;
        this._attributes = _attributes;
        if (!_parent.isOnGraph(_child)) {
          throw new Error("Cannot connect disconnected graphs.");
        }
      }
      /** Name. */
      getName() {
        return this._name;
      }
      /** Owner node. */
      getParent() {
        return this._parent;
      }
      /** Resource node. */
      getChild() {
        return this._child;
      }
      /**
       * Sets the child node.
       *
       * @internal Only {@link Graph} implementations may safely call this method directly. Use
       * 	{@link Property.swap} or {@link Graph.swapChild} instead.
       */
      setChild(child) {
        this._child = child;
        return this;
      }
      /** Attributes of the graph node relationship. */
      getAttributes() {
        return this._attributes;
      }
      /** Destroys a (currently intact) edge, updating both the graph and the owner. */
      dispose() {
        if (this._disposed) return;
        this._disposed = true;
        this.dispatchEvent({
          type: "dispose",
          target: this
        });
        super.dispose();
      }
      /** Whether this link has been destroyed. */
      isDisposed() {
        return this._disposed;
      }
    };
    var Graph = class extends EventDispatcher {
      constructor() {
        super(...arguments);
        this._emptySet = /* @__PURE__ */ new Set();
        this._edges = /* @__PURE__ */ new Set();
        this._parentEdges = /* @__PURE__ */ new Map();
        this._childEdges = /* @__PURE__ */ new Map();
      }
      /** Returns a list of all parent->child edges on this graph. */
      listEdges() {
        return Array.from(this._edges);
      }
      /** Returns a list of all edges on the graph having the given node as their child. */
      listParentEdges(node) {
        return Array.from(this._childEdges.get(node) || this._emptySet);
      }
      /** Returns a list of parent nodes for the given child node. */
      listParents(node) {
        return this.listParentEdges(node).map((edge) => edge.getParent());
      }
      /** Returns a list of all edges on the graph having the given node as their parent. */
      listChildEdges(node) {
        return Array.from(this._parentEdges.get(node) || this._emptySet);
      }
      /** Returns a list of child nodes for the given parent node. */
      listChildren(node) {
        return this.listChildEdges(node).map((edge) => edge.getChild());
      }
      disconnectParents(node, filter) {
        let edges = this.listParentEdges(node);
        if (filter) {
          edges = edges.filter((edge) => filter(edge.getParent()));
        }
        edges.forEach((edge) => edge.dispose());
        return this;
      }
      /**
       * Creates a {@link GraphEdge} connecting two {@link GraphNode} instances. Edge is returned
       * for the caller to store.
       * @param a Owner
       * @param b Resource
       */
      createEdge(name, a, b, attributes) {
        return this._registerEdge(new GraphEdge(name, a, b, attributes));
      }
      /**********************************************************************************************
       * Internal.
       */
      /** @hidden */
      _registerEdge(edge) {
        this._edges.add(edge);
        const parent = edge.getParent();
        if (!this._parentEdges.has(parent)) this._parentEdges.set(parent, /* @__PURE__ */ new Set());
        this._parentEdges.get(parent).add(edge);
        const child = edge.getChild();
        if (!this._childEdges.has(child)) this._childEdges.set(child, /* @__PURE__ */ new Set());
        this._childEdges.get(child).add(edge);
        edge.addEventListener("dispose", () => this._removeEdge(edge));
        return edge;
      }
      /**
       * Removes the {@link GraphEdge} from the {@link Graph}. This method should only
       * be invoked by the onDispose() listener created in {@link _registerEdge()}. The
       * public method of removing an edge is {@link GraphEdge.dispose}.
       */
      _removeEdge(edge) {
        this._edges.delete(edge);
        this._parentEdges.get(edge.getParent()).delete(edge);
        this._childEdges.get(edge.getChild()).delete(edge);
        return this;
      }
    };
    function isRef(value) {
      return value instanceof GraphEdge;
    }
    function isRefList(value) {
      return Array.isArray(value) && value[0] instanceof GraphEdge;
    }
    function isRefMap(value) {
      return !!(isPlainObject(value) && getFirstValue(value) instanceof GraphEdge);
    }
    function getFirstValue(value) {
      for (const key in value) {
        return value[key];
      }
    }
    function isPlainObject(value) {
      return Boolean(value) && Object.getPrototypeOf(value) === Object.prototype;
    }
    var $attributes = /* @__PURE__ */ Symbol("attributes");
    var $immutableKeys = /* @__PURE__ */ Symbol("immutableKeys");
    var GraphNode = class _GraphNode extends EventDispatcher {
      /**
       * Internal graph used to search and maintain references.
       * @hidden
       */
      /**
       * Attributes (literal values and GraphNode references) associated with this instance. For each
       * GraphNode reference, the attributes stores a {@link GraphEdge}. List and Map references are
       * stored as arrays and dictionaries of edges.
       * @internal
       */
      /**
       * Attributes included with `getDefaultAttributes` are considered immutable, and cannot be
       * modifed by `.setRef()`, `.copy()`, or other GraphNode methods. Both the edges and the
       * properties will be disposed with the parent GraphNode.
       *
       * Currently, only single-edge references (getRef/setRef) are supported as immutables.
       *
       * @internal
       */
      constructor(graph) {
        super();
        this._disposed = false;
        this.graph = void 0;
        this[$attributes] = void 0;
        this[$immutableKeys] = void 0;
        this.graph = graph;
        this[$immutableKeys] = /* @__PURE__ */ new Set();
        this[$attributes] = this._createAttributes();
      }
      /**
       * Returns default attributes for the graph node. Subclasses having any attributes (either
       * literal values or references to other graph nodes) must override this method. Literal
       * attributes should be given their default values, if any. References should generally be
       * initialized as empty (Ref → null, RefList → [], RefMap → {}) and then modified by setters.
       *
       * Any single-edge references (setRef) returned by this method will be considered immutable,
       * to be owned by and disposed with the parent node. Multi-edge references (addRef, removeRef,
       * setRefMap) cannot be returned as default attributes.
       */
      getDefaults() {
        return {};
      }
      /**
       * Constructs and returns an object used to store a graph nodes attributes. Compared to the
       * default Attributes interface, this has two distinctions:
       *
       * 1. Slots for GraphNode<T> objects are replaced with slots for GraphEdge<this, GraphNode<T>>
       * 2. GraphNode<T> objects provided as defaults are considered immutable
       *
       * @internal
       */
      _createAttributes() {
        const defaultAttributes = this.getDefaults();
        const attributes = {};
        for (const key in defaultAttributes) {
          const value = defaultAttributes[key];
          if (value instanceof _GraphNode) {
            const ref = this.graph.createEdge(key, this, value);
            ref.addEventListener("dispose", () => value.dispose());
            this[$immutableKeys].add(key);
            attributes[key] = ref;
          } else {
            attributes[key] = value;
          }
        }
        return attributes;
      }
      /** @internal Returns true if two nodes are on the same {@link Graph}. */
      isOnGraph(other) {
        return this.graph === other.graph;
      }
      /** Returns true if the node has been permanently removed from the graph. */
      isDisposed() {
        return this._disposed;
      }
      /**
       * Removes both inbound references to and outbound references from this object. At the end
       * of the process the object holds no references, and nothing holds references to it. A
       * disposed object is not reusable.
       */
      dispose() {
        if (this._disposed) return;
        this.graph.listChildEdges(this).forEach((edge) => edge.dispose());
        this.graph.disconnectParents(this);
        this._disposed = true;
        this.dispatchEvent({
          type: "dispose"
        });
      }
      /**
       * Removes all inbound references to this object. At the end of the process the object is
       * considered 'detached': it may hold references to child resources, but nothing holds
       * references to it. A detached object may be re-attached.
       */
      detach() {
        this.graph.disconnectParents(this);
        return this;
      }
      /**
       * Transfers this object's references from the old node to the new one. The old node is fully
       * detached from this parent at the end of the process.
       *
       * @hidden
       */
      swap(old, replacement) {
        for (const attribute in this[$attributes]) {
          const value = this[$attributes][attribute];
          if (isRef(value)) {
            const ref = value;
            if (ref.getChild() === old) {
              this.setRef(attribute, replacement, ref.getAttributes());
            }
          } else if (isRefList(value)) {
            const refs = value;
            const ref = refs.find((ref2) => ref2.getChild() === old);
            if (ref) {
              const refAttributes = ref.getAttributes();
              this.removeRef(attribute, old).addRef(attribute, replacement, refAttributes);
            }
          } else if (isRefMap(value)) {
            const refMap = value;
            for (const key in refMap) {
              const ref = refMap[key];
              if (ref.getChild() === old) {
                this.setRefMap(attribute, key, replacement, ref.getAttributes());
              }
            }
          }
        }
        return this;
      }
      /**********************************************************************************************
       * Literal attributes.
       */
      /** @hidden */
      get(attribute) {
        return this[$attributes][attribute];
      }
      /** @hidden */
      set(attribute, value) {
        this[$attributes][attribute] = value;
        return this.dispatchEvent({
          type: "change",
          attribute
        });
      }
      /**********************************************************************************************
       * Ref: 1:1 graph node references.
       */
      /** @hidden */
      getRef(attribute) {
        const ref = this[$attributes][attribute];
        return ref ? ref.getChild() : null;
      }
      /** @hidden */
      setRef(attribute, value, attributes) {
        if (this[$immutableKeys].has(attribute)) {
          throw new Error('Cannot overwrite immutable attribute, "' + attribute + '".');
        }
        const prevRef = this[$attributes][attribute];
        if (prevRef) prevRef.dispose();
        if (!value) return this;
        const ref = this.graph.createEdge(attribute, this, value, attributes);
        ref.addEventListener("dispose", () => {
          delete this[$attributes][attribute];
          this.dispatchEvent({
            type: "change",
            attribute
          });
        });
        this[$attributes][attribute] = ref;
        return this.dispatchEvent({
          type: "change",
          attribute
        });
      }
      /**********************************************************************************************
       * RefList: 1:many graph node references.
       */
      /** @hidden */
      listRefs(attribute) {
        const refs = this[$attributes][attribute];
        return refs.map((ref) => ref.getChild());
      }
      /** @hidden */
      addRef(attribute, value, attributes) {
        const ref = this.graph.createEdge(attribute, this, value, attributes);
        const refs = this[$attributes][attribute];
        refs.push(ref);
        ref.addEventListener("dispose", () => {
          let index;
          while ((index = refs.indexOf(ref)) !== -1) {
            refs.splice(index, 1);
          }
          this.dispatchEvent({
            type: "change",
            attribute
          });
        });
        return this.dispatchEvent({
          type: "change",
          attribute
        });
      }
      /** @hidden */
      removeRef(attribute, value) {
        const refs = this[$attributes][attribute];
        const pruned = refs.filter((ref) => ref.getChild() === value);
        pruned.forEach((ref) => ref.dispose());
        return this;
      }
      /**********************************************************************************************
       * RefMap: Named 1:many (map) graph node references.
       */
      /** @hidden */
      listRefMapKeys(key) {
        return Object.keys(this[$attributes][key]);
      }
      /** @hidden */
      listRefMapValues(key) {
        return Object.values(this[$attributes][key]).map((ref) => ref.getChild());
      }
      /** @hidden */
      getRefMap(attribute, key) {
        const refMap = this[$attributes][attribute];
        return refMap[key] ? refMap[key].getChild() : null;
      }
      /** @hidden */
      setRefMap(attribute, key, value, metadata) {
        const refMap = this[$attributes][attribute];
        const prevRef = refMap[key];
        if (prevRef) prevRef.dispose();
        if (!value) return this;
        metadata = Object.assign(metadata || {}, {
          key
        });
        const ref = this.graph.createEdge(attribute, this, value, {
          ...metadata,
          key
        });
        ref.addEventListener("dispose", () => {
          delete refMap[key];
          this.dispatchEvent({
            type: "change",
            attribute,
            key
          });
        });
        refMap[key] = ref;
        return this.dispatchEvent({
          type: "change",
          attribute,
          key
        });
      }
      /**********************************************************************************************
       * Events.
       */
      /**
       * Dispatches an event on the GraphNode, and on the associated
       * Graph. Event types on the graph are prefixed, `"node:[type]"`.
       */
      dispatchEvent(event) {
        super.dispatchEvent({
          ...event,
          target: this
        });
        this.graph.dispatchEvent({
          ...event,
          target: this,
          type: "node:" + event.type
        });
        return this;
      }
    };
    exports2.$attributes = $attributes;
    exports2.$immutableKeys = $immutableKeys;
    exports2.EventDispatcher = EventDispatcher;
    exports2.Graph = Graph;
    exports2.GraphEdge = GraphEdge;
    exports2.GraphNode = GraphNode;
    exports2.isRef = isRef;
    exports2.isRefList = isRefList;
    exports2.isRefMap = isRefMap;
  }
});

// node_modules/@gltf-transform/core/dist/core.cjs
var require_core = __commonJS({
  "node_modules/@gltf-transform/core/dist/core.cjs"(exports2) {
    var t = require_property_graph();
    function e(t2) {
      if (t2 && t2.t) return t2;
      var e2 = /* @__PURE__ */ Object.create(null);
      return t2 && Object.keys(t2).forEach(function(r2) {
        if ("default" !== r2) {
          var n2 = Object.getOwnPropertyDescriptor(t2, r2);
          Object.defineProperty(e2, r2, n2.get ? n2 : { enumerable: true, get: function() {
            return t2[r2];
          } });
        }
      }), e2.default = t2, e2;
    }
    var r = "v3.10.1";
    var n = "@glb.bin";
    var s;
    var i;
    var o;
    var u;
    var a;
    exports2.PropertyType = void 0, (s = exports2.PropertyType || (exports2.PropertyType = {})).ACCESSOR = "Accessor", s.ANIMATION = "Animation", s.ANIMATION_CHANNEL = "AnimationChannel", s.ANIMATION_SAMPLER = "AnimationSampler", s.BUFFER = "Buffer", s.CAMERA = "Camera", s.MATERIAL = "Material", s.MESH = "Mesh", s.PRIMITIVE = "Primitive", s.PRIMITIVE_TARGET = "PrimitiveTarget", s.NODE = "Node", s.ROOT = "Root", s.SCENE = "Scene", s.SKIN = "Skin", s.TEXTURE = "Texture", s.TEXTURE_INFO = "TextureInfo", exports2.VertexLayout = void 0, (i = exports2.VertexLayout || (exports2.VertexLayout = {})).INTERLEAVED = "interleaved", i.SEPARATE = "separate", (function(t2) {
      t2.ARRAY_BUFFER = "ARRAY_BUFFER", t2.ELEMENT_ARRAY_BUFFER = "ELEMENT_ARRAY_BUFFER", t2.INVERSE_BIND_MATRICES = "INVERSE_BIND_MATRICES", t2.OTHER = "OTHER", t2.SPARSE = "SPARSE";
    })(o || (o = {})), exports2.TextureChannel = void 0, (u = exports2.TextureChannel || (exports2.TextureChannel = {}))[u.R = 4096] = "R", u[u.G = 256] = "G", u[u.B = 16] = "B", u[u.A = 1] = "A", exports2.Format = void 0, (a = exports2.Format || (exports2.Format = {})).GLTF = "GLTF", a.GLB = "GLB";
    var c = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
    var h;
    var f = "undefined" != typeof Float32Array ? Float32Array : Array;
    function l(t2) {
      return Math.hypot(t2[0], t2[1], t2[2]);
    }
    function d(t2, e2, r2) {
      var n2 = e2[0], s2 = e2[1], i2 = e2[2], o2 = r2[3] * n2 + r2[7] * s2 + r2[11] * i2 + r2[15];
      return t2[0] = (r2[0] * n2 + r2[4] * s2 + r2[8] * i2 + r2[12]) / (o2 = o2 || 1), t2[1] = (r2[1] * n2 + r2[5] * s2 + r2[9] * i2 + r2[13]) / o2, t2[2] = (r2[2] * n2 + r2[6] * s2 + r2[10] * i2 + r2[14]) / o2, t2;
    }
    function p(t2) {
      const e2 = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] }, r2 = t2.propertyType === exports2.PropertyType.NODE ? [t2] : t2.listChildren();
      for (const t3 of r2) t3.traverse((t4) => {
        const r3 = t4.getMesh();
        if (!r3) return;
        const n2 = g(r3, t4.getWorldMatrix());
        v(n2.min, e2), v(n2.max, e2);
      });
      return e2;
    }
    Math.hypot || (Math.hypot = function() {
      for (var t2 = 0, e2 = arguments.length; e2--; ) t2 += arguments[e2] * arguments[e2];
      return Math.sqrt(t2);
    }), h = new f(3), f != Float32Array && (h[0] = 0, h[1] = 0, h[2] = 0);
    var m = p;
    function g(t2, e2) {
      const r2 = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
      for (const n2 of t2.listPrimitives()) {
        const t3 = n2.getAttribute("POSITION");
        if (!t3) continue;
        let s2 = [0, 0, 0], i2 = [0, 0, 0];
        for (let n3 = 0; n3 < t3.getCount(); n3++) s2 = t3.getElement(n3, s2), i2 = d(i2, s2, e2), v(i2, r2);
      }
      return r2;
    }
    function v(t2, e2) {
      for (let r2 = 0; r2 < 3; r2++) e2.min[r2] = Math.min(t2[r2], e2.min[r2]), e2.max[r2] = Math.max(t2[r2], e2.max[r2]);
    }
    var x = class {
      static createBufferFromDataURI(t2) {
        if ("undefined" == typeof Buffer) {
          const e2 = atob(t2.split(",")[1]), r2 = new Uint8Array(e2.length);
          for (let t3 = 0; t3 < e2.length; t3++) r2[t3] = e2.charCodeAt(t3);
          return r2;
        }
        {
          const e2 = t2.split(",")[1], r2 = t2.indexOf("base64") >= 0;
          return Buffer.from(e2, r2 ? "base64" : "utf8");
        }
      }
      static encodeText(t2) {
        return "undefined" != typeof TextEncoder ? new TextEncoder().encode(t2) : Buffer.from(t2);
      }
      static decodeText(t2) {
        return "undefined" != typeof TextDecoder ? new TextDecoder().decode(t2) : Buffer.from(t2).toString("utf8");
      }
      static concat(t2) {
        let e2 = 0;
        for (const r3 of t2) e2 += r3.byteLength;
        const r2 = new Uint8Array(e2);
        let n2 = 0;
        for (const e3 of t2) r2.set(e3, n2), n2 += e3.byteLength;
        return r2;
      }
      static pad(t2, e2) {
        void 0 === e2 && (e2 = 0);
        const r2 = this.padNumber(t2.byteLength);
        if (r2 === t2.byteLength) return t2;
        const n2 = new Uint8Array(r2);
        if (n2.set(t2), 0 !== e2) for (let s2 = t2.byteLength; s2 < r2; s2++) n2[s2] = e2;
        return n2;
      }
      static padNumber(t2) {
        return 4 * Math.ceil(t2 / 4);
      }
      static equals(t2, e2) {
        if (t2 === e2) return true;
        if (t2.byteLength !== e2.byteLength) return false;
        let r2 = t2.byteLength;
        for (; r2--; ) if (t2[r2] !== e2[r2]) return false;
        return true;
      }
      static toView(t2, e2, r2) {
        return void 0 === e2 && (e2 = 0), void 0 === r2 && (r2 = Infinity), new Uint8Array(t2.buffer, t2.byteOffset + e2, Math.min(t2.byteLength, r2));
      }
      static assertView(t2) {
        if (t2 && !ArrayBuffer.isView(t2)) throw new Error(`Method requires Uint8Array parameter; received "${typeof t2}".`);
        return t2;
      }
    };
    var w = class {
      static hexToFactor(t2, e2) {
        t2 = Math.floor(t2);
        const r2 = e2;
        return r2[0] = (t2 >> 16 & 255) / 255, r2[1] = (t2 >> 8 & 255) / 255, r2[2] = (255 & t2) / 255, this.convertSRGBToLinear(e2, e2);
      }
      static factorToHex(t2) {
        const e2 = [...t2], [r2, n2, s2] = this.convertLinearToSRGB(t2, e2);
        return 255 * r2 << 16 ^ 255 * n2 << 8 ^ 255 * s2 << 0;
      }
      static convertSRGBToLinear(t2, e2) {
        const r2 = t2, n2 = e2;
        for (let t3 = 0; t3 < 3; t3++) n2[t3] = r2[t3] < 0.04045 ? 0.0773993808 * r2[t3] : Math.pow(0.9478672986 * r2[t3] + 0.0521327014, 2.4);
        return e2;
      }
      static convertLinearToSRGB(t2, e2) {
        const r2 = t2, n2 = e2;
        for (let t3 = 0; t3 < 3; t3++) n2[t3] = r2[t3] < 31308e-7 ? 12.92 * r2[t3] : 1.055 * Math.pow(r2[t3], 0.41666) - 0.055;
        return e2;
      }
    };
    var y = class _y {
      match(t2) {
        return t2.length >= 8 && 137 === t2[0] && 80 === t2[1] && 78 === t2[2] && 71 === t2[3] && 13 === t2[4] && 10 === t2[5] && 26 === t2[6] && 10 === t2[7];
      }
      getSize(t2) {
        const e2 = new DataView(t2.buffer, t2.byteOffset);
        return x.decodeText(t2.slice(12, 16)) === _y.PNG_FRIED_CHUNK_NAME ? [e2.getUint32(32, false), e2.getUint32(36, false)] : [e2.getUint32(16, false), e2.getUint32(20, false)];
      }
      getChannels(t2) {
        return 4;
      }
    };
    y.PNG_FRIED_CHUNK_NAME = "CgBI";
    var b = class {
      static registerFormat(t2, e2) {
        this.impls[t2] = e2;
      }
      static getMimeType(t2) {
        for (const e2 in this.impls) if (this.impls[e2].match(t2)) return e2;
        return null;
      }
      static getSize(t2, e2) {
        return this.impls[e2] ? this.impls[e2].getSize(t2) : null;
      }
      static getChannels(t2, e2) {
        return this.impls[e2] ? this.impls[e2].getChannels(t2) : null;
      }
      static getVRAMByteLength(t2, e2) {
        if (!this.impls[e2]) return null;
        if (this.impls[e2].getVRAMByteLength) return this.impls[e2].getVRAMByteLength(t2);
        let r2 = 0;
        const n2 = this.getSize(t2, e2);
        if (!n2) return null;
        for (; n2[0] > 1 || n2[1] > 1; ) r2 += n2[0] * n2[1] * 4, n2[0] = Math.max(Math.floor(n2[0] / 2), 1), n2[1] = Math.max(Math.floor(n2[1] / 2), 1);
        return r2 += 4, r2;
      }
      static mimeTypeToExtension(t2) {
        return "image/jpeg" === t2 ? "jpg" : t2.split("/").pop();
      }
      static extensionToMimeType(t2) {
        return "jpg" === t2 ? "image/jpeg" : t2 ? `image/${t2}` : "";
      }
    };
    function T(t2, e2) {
      if (e2 > t2.byteLength) throw new TypeError("Corrupt JPG, exceeded buffer limits");
      if (255 !== t2.getUint8(e2)) throw new TypeError("Invalid JPG, marker table corrupted");
      return t2;
    }
    b.impls = { "image/jpeg": new class {
      match(t2) {
        return t2.length >= 3 && 255 === t2[0] && 216 === t2[1] && 255 === t2[2];
      }
      getSize(t2) {
        let e2, r2, n2 = new DataView(t2.buffer, t2.byteOffset + 4);
        for (; n2.byteLength; ) {
          if (e2 = n2.getUint16(0, false), T(n2, e2), r2 = n2.getUint8(e2 + 1), 192 === r2 || 193 === r2 || 194 === r2) return [n2.getUint16(e2 + 7, false), n2.getUint16(e2 + 5, false)];
          n2 = new DataView(t2.buffer, n2.byteOffset + e2 + 2);
        }
        throw new TypeError("Invalid JPG, no size found");
      }
      getChannels(t2) {
        return 3;
      }
    }(), "image/png": new y() };
    var A = class {
      static basename(t2) {
        const e2 = t2.split(/[\\/]/).pop();
        return e2.substring(0, e2.lastIndexOf("."));
      }
      static extension(t2) {
        if (t2.startsWith("data:image/")) {
          const e2 = t2.match(/data:(image\/\w+)/)[1];
          return b.mimeTypeToExtension(e2);
        }
        return t2.startsWith("data:model/gltf+json") ? "gltf" : t2.startsWith("data:model/gltf-binary") ? "glb" : t2.startsWith("data:application/") ? "bin" : t2.split(/[\\/]/).pop().split(/[.]/).pop();
      }
    };
    function E(t2) {
      return "[object Object]" === Object.prototype.toString.call(t2);
    }
    function S(t2) {
      if (false === E(t2)) return false;
      const e2 = t2.constructor;
      if (void 0 === e2) return true;
      const r2 = e2.prototype;
      return false !== E(r2) && false !== Object.prototype.hasOwnProperty.call(r2, "isPrototypeOf");
    }
    var M;
    var I;
    exports2.Verbosity = void 0, (I = exports2.Verbosity || (exports2.Verbosity = {}))[I.SILENT = 4] = "SILENT", I[I.ERROR = 3] = "ERROR", I[I.WARN = 2] = "WARN", I[I.INFO = 1] = "INFO", I[I.DEBUG = 0] = "DEBUG";
    var P = class _P {
      constructor(t2) {
        this.verbosity = void 0, this.verbosity = t2;
      }
      debug(t2) {
        this.verbosity <= _P.Verbosity.DEBUG && console.debug(t2);
      }
      info(t2) {
        this.verbosity <= _P.Verbosity.INFO && console.info(t2);
      }
      warn(t2) {
        this.verbosity <= _P.Verbosity.WARN && console.warn(t2);
      }
      error(t2) {
        this.verbosity <= _P.Verbosity.ERROR && console.error(t2);
      }
    };
    function R(t2, e2, r2) {
      var n2 = e2[0], s2 = e2[1], i2 = e2[2], o2 = e2[3], u2 = e2[4], a2 = e2[5], c2 = e2[6], h2 = e2[7], f2 = e2[8], l2 = e2[9], d2 = e2[10], p2 = e2[11], m2 = e2[12], g2 = e2[13], v2 = e2[14], x2 = e2[15], w2 = r2[0], y2 = r2[1], b2 = r2[2], T2 = r2[3];
      return t2[0] = w2 * n2 + y2 * u2 + b2 * f2 + T2 * m2, t2[1] = w2 * s2 + y2 * a2 + b2 * l2 + T2 * g2, t2[2] = w2 * i2 + y2 * c2 + b2 * d2 + T2 * v2, t2[3] = w2 * o2 + y2 * h2 + b2 * p2 + T2 * x2, t2[4] = (w2 = r2[4]) * n2 + (y2 = r2[5]) * u2 + (b2 = r2[6]) * f2 + (T2 = r2[7]) * m2, t2[5] = w2 * s2 + y2 * a2 + b2 * l2 + T2 * g2, t2[6] = w2 * i2 + y2 * c2 + b2 * d2 + T2 * v2, t2[7] = w2 * o2 + y2 * h2 + b2 * p2 + T2 * x2, t2[8] = (w2 = r2[8]) * n2 + (y2 = r2[9]) * u2 + (b2 = r2[10]) * f2 + (T2 = r2[11]) * m2, t2[9] = w2 * s2 + y2 * a2 + b2 * l2 + T2 * g2, t2[10] = w2 * i2 + y2 * c2 + b2 * d2 + T2 * v2, t2[11] = w2 * o2 + y2 * h2 + b2 * p2 + T2 * x2, t2[12] = (w2 = r2[12]) * n2 + (y2 = r2[13]) * u2 + (b2 = r2[14]) * f2 + (T2 = r2[15]) * m2, t2[13] = w2 * s2 + y2 * a2 + b2 * l2 + T2 * g2, t2[14] = w2 * i2 + y2 * c2 + b2 * d2 + T2 * v2, t2[15] = w2 * o2 + y2 * h2 + b2 * p2 + T2 * x2, t2;
    }
    M = P, P.Verbosity = exports2.Verbosity, P.DEFAULT_INSTANCE = new M(M.Verbosity.INFO);
    var N = class _N {
      static identity(t2) {
        return t2;
      }
      static eq(t2, e2, r2) {
        if (void 0 === r2 && (r2 = 1e-5), t2.length !== e2.length) return false;
        for (let n2 = 0; n2 < t2.length; n2++) if (Math.abs(t2[n2] - e2[n2]) > r2) return false;
        return true;
      }
      static decodeNormalizedInt(t2, e2) {
        switch (e2) {
          case 5126:
            return t2;
          case 5123:
            return t2 / 65535;
          case 5121:
            return t2 / 255;
          case 5122:
            return Math.max(t2 / 32767, -1);
          case 5120:
            return Math.max(t2 / 127, -1);
          default:
            throw new Error("Invalid component type.");
        }
      }
      static denormalize(t2, e2) {
        return _N.decodeNormalizedInt(t2, e2);
      }
      static encodeNormalizedInt(t2, e2) {
        switch (e2) {
          case 5126:
            return t2;
          case 5123:
            return Math.round(65535 * t2);
          case 5121:
            return Math.round(255 * t2);
          case 5122:
            return Math.round(32767 * t2);
          case 5120:
            return Math.round(127 * t2);
          default:
            throw new Error("Invalid component type.");
        }
      }
      static normalize(t2, e2) {
        return _N.encodeNormalizedInt(t2, e2);
      }
      static decompose(t2, e2, r2, n2) {
        let s2 = l([t2[0], t2[1], t2[2]]);
        const i2 = l([t2[4], t2[5], t2[6]]), o2 = l([t2[8], t2[9], t2[10]]);
        var u2, a2, c2, h2, d2, p2, m2, g2, v2, x2, w2, y2, b2, T2, A2, E2, S2;
        ((a2 = (u2 = t2)[0]) * (m2 = u2[5]) - (c2 = u2[1]) * (p2 = u2[4])) * ((y2 = u2[10]) * (S2 = u2[15]) - (b2 = u2[11]) * (E2 = u2[14])) - (a2 * (g2 = u2[6]) - (h2 = u2[2]) * p2) * ((w2 = u2[9]) * S2 - b2 * (A2 = u2[13])) + (a2 * (v2 = u2[7]) - (d2 = u2[3]) * p2) * (w2 * E2 - y2 * A2) + (c2 * g2 - h2 * m2) * ((x2 = u2[8]) * S2 - b2 * (T2 = u2[12])) - (c2 * v2 - d2 * m2) * (x2 * E2 - y2 * T2) + (h2 * v2 - d2 * g2) * (x2 * A2 - w2 * T2) < 0 && (s2 = -s2), e2[0] = t2[12], e2[1] = t2[13], e2[2] = t2[14];
        const M2 = t2.slice(), I2 = 1 / s2, P2 = 1 / i2, R2 = 1 / o2;
        M2[0] *= I2, M2[1] *= I2, M2[2] *= I2, M2[4] *= P2, M2[5] *= P2, M2[6] *= P2, M2[8] *= R2, M2[9] *= R2, M2[10] *= R2, (function(t3, e3) {
          var r3 = new f(3);
          !(function(t4, e4) {
            var r4 = e4[4], n4 = e4[5], s4 = e4[6], i4 = e4[8], o4 = e4[9], u4 = e4[10];
            t4[0] = Math.hypot(e4[0], e4[1], e4[2]), t4[1] = Math.hypot(r4, n4, s4), t4[2] = Math.hypot(i4, o4, u4);
          })(r3, e3);
          var n3 = 1 / r3[0], s3 = 1 / r3[1], i3 = 1 / r3[2], o3 = e3[0] * n3, u3 = e3[1] * s3, a3 = e3[2] * i3, c3 = e3[4] * n3, h3 = e3[5] * s3, l2 = e3[6] * i3, d3 = e3[8] * n3, p3 = e3[9] * s3, m3 = e3[10] * i3, g3 = o3 + h3 + m3, v3 = 0;
          g3 > 0 ? (v3 = 2 * Math.sqrt(g3 + 1), t3[3] = 0.25 * v3, t3[0] = (l2 - p3) / v3, t3[1] = (d3 - a3) / v3, t3[2] = (u3 - c3) / v3) : o3 > h3 && o3 > m3 ? (v3 = 2 * Math.sqrt(1 + o3 - h3 - m3), t3[3] = (l2 - p3) / v3, t3[0] = 0.25 * v3, t3[1] = (u3 + c3) / v3, t3[2] = (d3 + a3) / v3) : h3 > m3 ? (v3 = 2 * Math.sqrt(1 + h3 - o3 - m3), t3[3] = (d3 - a3) / v3, t3[0] = (u3 + c3) / v3, t3[1] = 0.25 * v3, t3[2] = (l2 + p3) / v3) : (v3 = 2 * Math.sqrt(1 + m3 - o3 - h3), t3[3] = (u3 - c3) / v3, t3[0] = (d3 + a3) / v3, t3[1] = (l2 + p3) / v3, t3[2] = 0.25 * v3);
        })(r2, M2), n2[0] = s2, n2[1] = i2, n2[2] = o2;
      }
      static compose(t2, e2, r2, n2) {
        const s2 = n2, i2 = e2[0], o2 = e2[1], u2 = e2[2], a2 = e2[3], c2 = i2 + i2, h2 = o2 + o2, f2 = u2 + u2, l2 = i2 * c2, d2 = i2 * h2, p2 = i2 * f2, m2 = o2 * h2, g2 = o2 * f2, v2 = u2 * f2, x2 = a2 * c2, w2 = a2 * h2, y2 = a2 * f2, b2 = r2[0], T2 = r2[1], A2 = r2[2];
        return s2[0] = (1 - (m2 + v2)) * b2, s2[1] = (d2 + y2) * b2, s2[2] = (p2 - w2) * b2, s2[3] = 0, s2[4] = (d2 - y2) * T2, s2[5] = (1 - (l2 + v2)) * T2, s2[6] = (g2 + x2) * T2, s2[7] = 0, s2[8] = (p2 + w2) * A2, s2[9] = (g2 - x2) * A2, s2[10] = (1 - (l2 + m2)) * A2, s2[11] = 0, s2[12] = t2[0], s2[13] = t2[1], s2[14] = t2[2], s2[15] = 1, s2;
      }
    };
    function O(t2, e2) {
      if (!!t2 != !!e2) return false;
      const r2 = t2.getChild(), n2 = e2.getChild();
      return r2 === n2 || r2.equals(n2);
    }
    function C(t2, e2) {
      if (!!t2 != !!e2) return false;
      if (t2.length !== e2.length) return false;
      for (let r2 = 0; r2 < t2.length; r2++) {
        const n2 = t2[r2], s2 = e2[r2];
        if (n2.getChild() !== s2.getChild() && !n2.getChild().equals(s2.getChild())) return false;
      }
      return true;
    }
    function F(t2, e2) {
      if (!!t2 != !!e2) return false;
      const r2 = Object.keys(t2), n2 = Object.keys(e2);
      if (r2.length !== n2.length) return false;
      for (const r3 in t2) {
        const n3 = t2[r3], s2 = e2[r3];
        if (!!n3 != !!s2) return false;
        const i2 = n3.getChild(), o2 = s2.getChild();
        if (i2 !== o2 && !i2.equals(o2)) return false;
      }
      return true;
    }
    function U(t2, e2) {
      if (t2 === e2) return true;
      if (!!t2 != !!e2 || !t2 || !e2) return false;
      if (t2.length !== e2.length) return false;
      for (let r2 = 0; r2 < t2.length; r2++) if (t2[r2] !== e2[r2]) return false;
      return true;
    }
    function B(t2, e2) {
      if (t2 === e2) return true;
      if (!!t2 != !!e2) return false;
      if (!S(t2) || !S(e2)) return t2 === e2;
      const r2 = t2, n2 = e2;
      let s2, i2 = 0, o2 = 0;
      for (s2 in r2) i2++;
      for (s2 in n2) o2++;
      if (i2 !== o2) return false;
      for (s2 in r2) {
        const t3 = r2[s2], e3 = n2[s2];
        if (j(t3) && j(e3)) {
          if (!U(t3, e3)) return false;
        } else if (S(t3) && S(e3)) {
          if (!B(t3, e3)) return false;
        } else if (t3 !== e3) return false;
      }
      return true;
    }
    function j(t2) {
      return Array.isArray(t2) || ArrayBuffer.isView(t2);
    }
    var L = /* @__PURE__ */ new Set();
    var D = function() {
      let t2 = "";
      for (let e2 = 0; e2 < 6; e2++) t2 += "23456789abdegjkmnpqrvwxyzABDEGJKMNPQRVWXYZ".charAt(Math.floor(42 * Math.random()));
      return t2;
    };
    var _ = function() {
      for (let t2 = 0; t2 < 999; t2++) {
        const t3 = D();
        if (!L.has(t3)) return L.add(t3), t3;
      }
      return "";
    };
    var k = "https://null.example";
    var z = class {
      static dirname(t2) {
        const e2 = t2.lastIndexOf("/");
        return -1 === e2 ? "./" : t2.substring(0, e2 + 1);
      }
      static basename(t2) {
        return A.basename(new URL(t2, k).pathname);
      }
      static extension(t2) {
        return A.extension(new URL(t2, k).pathname);
      }
      static resolve(t2, e2) {
        if (!this.isRelativePath(e2)) return e2;
        const r2 = t2.split("/"), n2 = e2.split("/");
        r2.pop();
        for (let t3 = 0; t3 < n2.length; t3++) "." !== n2[t3] && (".." === n2[t3] ? r2.pop() : r2.push(n2[t3]));
        return r2.join("/");
      }
      static isAbsoluteURL(t2) {
        return this.PROTOCOL_REGEXP.test(t2);
      }
      static isRelativePath(t2) {
        return !/^(?:[a-zA-Z]+:)?\//.test(t2);
      }
    };
    z.DEFAULT_INIT = {}, z.PROTOCOL_REGEXP = /^[a-zA-Z]+:\/\//;
    var G = (t2) => t2;
    var J = /* @__PURE__ */ new Set();
    var $ = class extends t.GraphNode {
      constructor(e2, r2) {
        void 0 === r2 && (r2 = ""), super(e2), this[t.$attributes].name = r2, this.init(), this.dispatchEvent({ type: "create" });
      }
      getGraph() {
        return this.graph;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { name: "", extras: {} });
      }
      set(t2, e2) {
        return Array.isArray(e2) && (e2 = e2.slice()), super.set(t2, e2);
      }
      getName() {
        return this.get("name");
      }
      setName(t2) {
        return this.set("name", t2);
      }
      getExtras() {
        return this.get("extras");
      }
      setExtras(t2) {
        return this.set("extras", t2);
      }
      clone() {
        return new (0, this.constructor)(this.graph).copy(this, G);
      }
      copy(e2, r2) {
        void 0 === r2 && (r2 = G);
        for (const e3 in this[t.$attributes]) {
          const r3 = this[t.$attributes][e3];
          if (r3 instanceof t.GraphEdge) this[t.$immutableKeys].has(e3) || r3.dispose();
          else if (t.isRefList(r3)) for (const t2 of r3) t2.dispose();
          else if (t.isRefMap(r3)) for (const t2 in r3) r3[t2].dispose();
        }
        for (const n2 in e2[t.$attributes]) {
          const s2 = this[t.$attributes][n2], i2 = e2[t.$attributes][n2];
          if (i2 instanceof t.GraphEdge) this[t.$immutableKeys].has(n2) ? s2.getChild().copy(r2(i2.getChild()), r2) : this.setRef(n2, r2(i2.getChild()), i2.getAttributes());
          else if (t.isRefList(i2)) for (const t2 of i2) this.addRef(n2, r2(t2.getChild()), t2.getAttributes());
          else if (t.isRefMap(i2)) for (const t2 in i2) {
            const e3 = i2[t2];
            this.setRefMap(n2, t2, r2(e3.getChild()), e3.getAttributes());
          }
          else this[t.$attributes][n2] = S(i2) ? JSON.parse(JSON.stringify(i2)) : Array.isArray(i2) || i2 instanceof ArrayBuffer || ArrayBuffer.isView(i2) ? i2.slice() : i2;
        }
        return this;
      }
      equals(e2, r2) {
        if (void 0 === r2 && (r2 = J), this === e2) return true;
        if (this.propertyType !== e2.propertyType) return false;
        for (const n2 in this[t.$attributes]) {
          if (r2.has(n2)) continue;
          const s2 = this[t.$attributes][n2], i2 = e2[t.$attributes][n2];
          if (t.isRef(s2) || t.isRef(i2)) {
            if (!O(s2, i2)) return false;
          } else if (t.isRefList(s2) || t.isRefList(i2)) {
            if (!C(s2, i2)) return false;
          } else if (t.isRefMap(s2) || t.isRefMap(i2)) {
            if (!F(s2, i2)) return false;
          } else if (S(s2) || S(i2)) {
            if (!B(s2, i2)) return false;
          } else if (j(s2) || j(i2)) {
            if (!U(s2, i2)) return false;
          } else if (s2 !== i2) return false;
        }
        return true;
      }
      detach() {
        return this.graph.disconnectParents(this, (t2) => "Root" !== t2.propertyType), this;
      }
      listParents() {
        return this.graph.listParents(this);
      }
    };
    var V = class extends $ {
      getDefaults() {
        return Object.assign(super.getDefaults(), { extensions: {} });
      }
      getExtension(t2) {
        return this.getRefMap("extensions", t2);
      }
      setExtension(t2, e2) {
        return e2 && e2.i(this), this.setRefMap("extensions", t2, e2);
      }
      listExtensions() {
        return this.listRefMapValues("extensions");
      }
    };
    var q = class _q extends V {
      constructor() {
        super(...arguments), this.u = N.identity, this.h = N.identity;
      }
      init() {
        this.propertyType = exports2.PropertyType.ACCESSOR;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { array: null, type: _q.Type.SCALAR, componentType: _q.ComponentType.FLOAT, normalized: false, sparse: false, buffer: null });
      }
      copy(t2, e2) {
        return void 0 === e2 && (e2 = G), super.copy(t2, e2), this.u = t2.u, this.h = t2.h, this;
      }
      static getElementSize(t2) {
        switch (t2) {
          case _q.Type.SCALAR:
            return 1;
          case _q.Type.VEC2:
            return 2;
          case _q.Type.VEC3:
            return 3;
          case _q.Type.VEC4:
          case _q.Type.MAT2:
            return 4;
          case _q.Type.MAT3:
            return 9;
          case _q.Type.MAT4:
            return 16;
          default:
            throw new Error("Unexpected type: " + t2);
        }
      }
      static getComponentSize(t2) {
        switch (t2) {
          case _q.ComponentType.BYTE:
          case _q.ComponentType.UNSIGNED_BYTE:
            return 1;
          case _q.ComponentType.SHORT:
          case _q.ComponentType.UNSIGNED_SHORT:
            return 2;
          case _q.ComponentType.UNSIGNED_INT:
          case _q.ComponentType.FLOAT:
            return 4;
          default:
            throw new Error("Unexpected component type: " + t2);
        }
      }
      getMinNormalized(t2) {
        const e2 = this.getElementSize();
        this.getMin(t2);
        for (let r2 = 0; r2 < e2; r2++) t2[r2] = this.h(t2[r2]);
        return t2;
      }
      getMin(t2) {
        const e2 = this.get("array"), r2 = this.getCount(), n2 = this.getElementSize();
        for (let e3 = 0; e3 < n2; e3++) t2[e3] = Infinity;
        for (let s2 = 0; s2 < r2 * n2; s2 += n2) for (let r3 = 0; r3 < n2; r3++) {
          const n3 = e2[s2 + r3];
          Number.isFinite(n3) && (t2[r3] = Math.min(t2[r3], n3));
        }
        return t2;
      }
      getMaxNormalized(t2) {
        const e2 = this.getElementSize();
        this.getMax(t2);
        for (let r2 = 0; r2 < e2; r2++) t2[r2] = this.h(t2[r2]);
        return t2;
      }
      getMax(t2) {
        const e2 = this.get("array"), r2 = this.getCount(), n2 = this.getElementSize();
        for (let e3 = 0; e3 < n2; e3++) t2[e3] = -Infinity;
        for (let s2 = 0; s2 < r2 * n2; s2 += n2) for (let r3 = 0; r3 < n2; r3++) {
          const n3 = e2[s2 + r3];
          Number.isFinite(n3) && (t2[r3] = Math.max(t2[r3], n3));
        }
        return t2;
      }
      getCount() {
        const t2 = this.get("array");
        return t2 ? t2.length / this.getElementSize() : 0;
      }
      getType() {
        return this.get("type");
      }
      setType(t2) {
        return this.set("type", t2);
      }
      getElementSize() {
        return _q.getElementSize(this.get("type"));
      }
      getComponentSize() {
        return this.get("array").BYTES_PER_ELEMENT;
      }
      getComponentType() {
        return this.get("componentType");
      }
      getNormalized() {
        return this.get("normalized");
      }
      setNormalized(t2) {
        return this.set("normalized", t2), t2 ? (this.h = (t3) => N.decodeNormalizedInt(t3, this.get("componentType")), this.u = (t3) => N.encodeNormalizedInt(t3, this.get("componentType"))) : (this.h = N.identity, this.u = N.identity), this;
      }
      getScalar(t2) {
        const e2 = this.getElementSize();
        return this.h(this.get("array")[t2 * e2]);
      }
      setScalar(t2, e2) {
        return this.get("array")[t2 * this.getElementSize()] = this.u(e2), this;
      }
      getElement(t2, e2) {
        const r2 = this.getElementSize(), n2 = this.get("array");
        for (let s2 = 0; s2 < r2; s2++) e2[s2] = this.h(n2[t2 * r2 + s2]);
        return e2;
      }
      setElement(t2, e2) {
        const r2 = this.getElementSize(), n2 = this.get("array");
        for (let s2 = 0; s2 < r2; s2++) n2[t2 * r2 + s2] = this.u(e2[s2]);
        return this;
      }
      getSparse() {
        return this.get("sparse");
      }
      setSparse(t2) {
        return this.set("sparse", t2);
      }
      getBuffer() {
        return this.getRef("buffer");
      }
      setBuffer(t2) {
        return this.setRef("buffer", t2);
      }
      getArray() {
        return this.get("array");
      }
      setArray(t2) {
        return this.set("componentType", t2 ? (function(t3) {
          switch (t3.constructor) {
            case Float32Array:
              return _q.ComponentType.FLOAT;
            case Uint32Array:
              return _q.ComponentType.UNSIGNED_INT;
            case Uint16Array:
              return _q.ComponentType.UNSIGNED_SHORT;
            case Uint8Array:
              return _q.ComponentType.UNSIGNED_BYTE;
            case Int16Array:
              return _q.ComponentType.SHORT;
            case Int8Array:
              return _q.ComponentType.BYTE;
            default:
              throw new Error("Unknown accessor componentType.");
          }
        })(t2) : _q.ComponentType.FLOAT), this.set("array", t2), this;
      }
      getByteLength() {
        const t2 = this.get("array");
        return t2 ? t2.byteLength : 0;
      }
    };
    q.Type = { SCALAR: "SCALAR", VEC2: "VEC2", VEC3: "VEC3", VEC4: "VEC4", MAT2: "MAT2", MAT3: "MAT3", MAT4: "MAT4" }, q.ComponentType = { BYTE: 5120, UNSIGNED_BYTE: 5121, SHORT: 5122, UNSIGNED_SHORT: 5123, UNSIGNED_INT: 5125, FLOAT: 5126 };
    var W = class extends V {
      init() {
        this.propertyType = exports2.PropertyType.ANIMATION;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { channels: [], samplers: [] });
      }
      addChannel(t2) {
        return this.addRef("channels", t2);
      }
      removeChannel(t2) {
        return this.removeRef("channels", t2);
      }
      listChannels() {
        return this.listRefs("channels");
      }
      addSampler(t2) {
        return this.addRef("samplers", t2);
      }
      removeSampler(t2) {
        return this.removeRef("samplers", t2);
      }
      listSamplers() {
        return this.listRefs("samplers");
      }
    };
    var H = class extends V {
      init() {
        this.propertyType = exports2.PropertyType.ANIMATION_CHANNEL;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { targetPath: null, targetNode: null, sampler: null });
      }
      getTargetPath() {
        return this.get("targetPath");
      }
      setTargetPath(t2) {
        return this.set("targetPath", t2);
      }
      getTargetNode() {
        return this.getRef("targetNode");
      }
      setTargetNode(t2) {
        return this.setRef("targetNode", t2);
      }
      getSampler() {
        return this.getRef("sampler");
      }
      setSampler(t2) {
        return this.setRef("sampler", t2);
      }
    };
    H.TargetPath = { TRANSLATION: "translation", ROTATION: "rotation", SCALE: "scale", WEIGHTS: "weights" };
    var Y = class _Y extends V {
      init() {
        this.propertyType = exports2.PropertyType.ANIMATION_SAMPLER;
      }
      getDefaultAttributes() {
        return Object.assign(super.getDefaults(), { interpolation: _Y.Interpolation.LINEAR, input: null, output: null });
      }
      getInterpolation() {
        return this.get("interpolation");
      }
      setInterpolation(t2) {
        return this.set("interpolation", t2);
      }
      getInput() {
        return this.getRef("input");
      }
      setInput(t2) {
        return this.setRef("input", t2, { usage: o.OTHER });
      }
      getOutput() {
        return this.getRef("output");
      }
      setOutput(t2) {
        return this.setRef("output", t2, { usage: o.OTHER });
      }
    };
    Y.Interpolation = { LINEAR: "LINEAR", STEP: "STEP", CUBICSPLINE: "CUBICSPLINE" };
    var Z = class extends V {
      init() {
        this.propertyType = exports2.PropertyType.BUFFER;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { uri: "" });
      }
      getURI() {
        return this.get("uri");
      }
      setURI(t2) {
        return this.set("uri", t2);
      }
    };
    var K = class _K extends V {
      init() {
        this.propertyType = exports2.PropertyType.CAMERA;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { type: _K.Type.PERSPECTIVE, znear: 0.1, zfar: 100, aspectRatio: null, yfov: 2 * Math.PI * 50 / 360, xmag: 1, ymag: 1 });
      }
      getType() {
        return this.get("type");
      }
      setType(t2) {
        return this.set("type", t2);
      }
      getZNear() {
        return this.get("znear");
      }
      setZNear(t2) {
        return this.set("znear", t2);
      }
      getZFar() {
        return this.get("zfar");
      }
      setZFar(t2) {
        return this.set("zfar", t2);
      }
      getAspectRatio() {
        return this.get("aspectRatio");
      }
      setAspectRatio(t2) {
        return this.set("aspectRatio", t2);
      }
      getYFov() {
        return this.get("yfov");
      }
      setYFov(t2) {
        return this.set("yfov", t2);
      }
      getXMag() {
        return this.get("xmag");
      }
      setXMag(t2) {
        return this.set("xmag", t2);
      }
      getYMag() {
        return this.get("ymag");
      }
      setYMag(t2) {
        return this.set("ymag", t2);
      }
    };
    K.Type = { PERSPECTIVE: "perspective", ORTHOGRAPHIC: "orthographic" };
    var Q = class extends $ {
      i(t2) {
        if (!this.parentTypes.includes(t2.propertyType)) throw new Error(`Parent "${t2.propertyType}" invalid for child "${this.propertyType}".`);
      }
    };
    Q.EXTENSION_NAME = void 0;
    var X = class _X extends V {
      init() {
        this.propertyType = exports2.PropertyType.TEXTURE_INFO;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { texCoord: 0, magFilter: null, minFilter: null, wrapS: _X.WrapMode.REPEAT, wrapT: _X.WrapMode.REPEAT });
      }
      getTexCoord() {
        return this.get("texCoord");
      }
      setTexCoord(t2) {
        return this.set("texCoord", t2);
      }
      getMagFilter() {
        return this.get("magFilter");
      }
      setMagFilter(t2) {
        return this.set("magFilter", t2);
      }
      getMinFilter() {
        return this.get("minFilter");
      }
      setMinFilter(t2) {
        return this.set("minFilter", t2);
      }
      getWrapS() {
        return this.get("wrapS");
      }
      setWrapS(t2) {
        return this.set("wrapS", t2);
      }
      getWrapT() {
        return this.get("wrapT");
      }
      setWrapT(t2) {
        return this.set("wrapT", t2);
      }
    };
    X.WrapMode = { CLAMP_TO_EDGE: 33071, MIRRORED_REPEAT: 33648, REPEAT: 10497 }, X.MagFilter = { NEAREST: 9728, LINEAR: 9729 }, X.MinFilter = { NEAREST: 9728, LINEAR: 9729, NEAREST_MIPMAP_NEAREST: 9984, LINEAR_MIPMAP_NEAREST: 9985, NEAREST_MIPMAP_LINEAR: 9986, LINEAR_MIPMAP_LINEAR: 9987 };
    var { R: tt, G: et, B: rt, A: nt } = exports2.TextureChannel;
    var st = class _st extends V {
      init() {
        this.propertyType = exports2.PropertyType.MATERIAL;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { alphaMode: _st.AlphaMode.OPAQUE, alphaCutoff: 0.5, doubleSided: false, baseColorFactor: [1, 1, 1, 1], baseColorTexture: null, baseColorTextureInfo: new X(this.graph, "baseColorTextureInfo"), emissiveFactor: [0, 0, 0], emissiveTexture: null, emissiveTextureInfo: new X(this.graph, "emissiveTextureInfo"), normalScale: 1, normalTexture: null, normalTextureInfo: new X(this.graph, "normalTextureInfo"), occlusionStrength: 1, occlusionTexture: null, occlusionTextureInfo: new X(this.graph, "occlusionTextureInfo"), roughnessFactor: 1, metallicFactor: 1, metallicRoughnessTexture: null, metallicRoughnessTextureInfo: new X(this.graph, "metallicRoughnessTextureInfo") });
      }
      getDoubleSided() {
        return this.get("doubleSided");
      }
      setDoubleSided(t2) {
        return this.set("doubleSided", t2);
      }
      getAlpha() {
        return this.get("baseColorFactor")[3];
      }
      setAlpha(t2) {
        const e2 = this.get("baseColorFactor").slice();
        return e2[3] = t2, this.set("baseColorFactor", e2);
      }
      getAlphaMode() {
        return this.get("alphaMode");
      }
      setAlphaMode(t2) {
        return this.set("alphaMode", t2);
      }
      getAlphaCutoff() {
        return this.get("alphaCutoff");
      }
      setAlphaCutoff(t2) {
        return this.set("alphaCutoff", t2);
      }
      getBaseColorFactor() {
        return this.get("baseColorFactor");
      }
      setBaseColorFactor(t2) {
        return this.set("baseColorFactor", t2);
      }
      getBaseColorHex() {
        return w.factorToHex(this.get("baseColorFactor"));
      }
      setBaseColorHex(t2) {
        const e2 = this.get("baseColorFactor").slice();
        return this.set("baseColorFactor", w.hexToFactor(t2, e2));
      }
      getBaseColorTexture() {
        return this.getRef("baseColorTexture");
      }
      getBaseColorTextureInfo() {
        return this.getRef("baseColorTexture") ? this.getRef("baseColorTextureInfo") : null;
      }
      setBaseColorTexture(t2) {
        return this.setRef("baseColorTexture", t2, { channels: tt | et | rt | nt, isColor: true });
      }
      getEmissiveFactor() {
        return this.get("emissiveFactor");
      }
      setEmissiveFactor(t2) {
        return this.set("emissiveFactor", t2);
      }
      getEmissiveHex() {
        return w.factorToHex(this.get("emissiveFactor"));
      }
      setEmissiveHex(t2) {
        const e2 = this.get("emissiveFactor").slice();
        return this.set("emissiveFactor", w.hexToFactor(t2, e2));
      }
      getEmissiveTexture() {
        return this.getRef("emissiveTexture");
      }
      getEmissiveTextureInfo() {
        return this.getRef("emissiveTexture") ? this.getRef("emissiveTextureInfo") : null;
      }
      setEmissiveTexture(t2) {
        return this.setRef("emissiveTexture", t2, { channels: tt | et | rt, isColor: true });
      }
      getNormalScale() {
        return this.get("normalScale");
      }
      setNormalScale(t2) {
        return this.set("normalScale", t2);
      }
      getNormalTexture() {
        return this.getRef("normalTexture");
      }
      getNormalTextureInfo() {
        return this.getRef("normalTexture") ? this.getRef("normalTextureInfo") : null;
      }
      setNormalTexture(t2) {
        return this.setRef("normalTexture", t2, { channels: tt | et | rt });
      }
      getOcclusionStrength() {
        return this.get("occlusionStrength");
      }
      setOcclusionStrength(t2) {
        return this.set("occlusionStrength", t2);
      }
      getOcclusionTexture() {
        return this.getRef("occlusionTexture");
      }
      getOcclusionTextureInfo() {
        return this.getRef("occlusionTexture") ? this.getRef("occlusionTextureInfo") : null;
      }
      setOcclusionTexture(t2) {
        return this.setRef("occlusionTexture", t2, { channels: tt });
      }
      getRoughnessFactor() {
        return this.get("roughnessFactor");
      }
      setRoughnessFactor(t2) {
        return this.set("roughnessFactor", t2);
      }
      getMetallicFactor() {
        return this.get("metallicFactor");
      }
      setMetallicFactor(t2) {
        return this.set("metallicFactor", t2);
      }
      getMetallicRoughnessTexture() {
        return this.getRef("metallicRoughnessTexture");
      }
      getMetallicRoughnessTextureInfo() {
        return this.getRef("metallicRoughnessTexture") ? this.getRef("metallicRoughnessTextureInfo") : null;
      }
      setMetallicRoughnessTexture(t2) {
        return this.setRef("metallicRoughnessTexture", t2, { channels: et | rt });
      }
    };
    st.AlphaMode = { OPAQUE: "OPAQUE", MASK: "MASK", BLEND: "BLEND" };
    var it = class extends V {
      init() {
        this.propertyType = exports2.PropertyType.MESH;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { weights: [], primitives: [] });
      }
      addPrimitive(t2) {
        return this.addRef("primitives", t2);
      }
      removePrimitive(t2) {
        return this.removeRef("primitives", t2);
      }
      listPrimitives() {
        return this.listRefs("primitives");
      }
      getWeights() {
        return this.get("weights");
      }
      setWeights(t2) {
        return this.set("weights", t2);
      }
    };
    var ot = class extends V {
      constructor() {
        super(...arguments), this.l = null, this.p = /* @__PURE__ */ new Set();
      }
      init() {
        this.propertyType = exports2.PropertyType.NODE;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { translation: [0, 0, 0], rotation: [0, 0, 0, 1], scale: [1, 1, 1], weights: [], camera: null, mesh: null, skin: null, children: [] });
      }
      copy(t2, e2) {
        if (void 0 === e2 && (e2 = G), e2 === G) throw new Error("Node cannot be copied.");
        return super.copy(t2, e2);
      }
      getTranslation() {
        return this.get("translation");
      }
      getRotation() {
        return this.get("rotation");
      }
      getScale() {
        return this.get("scale");
      }
      setTranslation(t2) {
        return this.set("translation", t2);
      }
      setRotation(t2) {
        return this.set("rotation", t2);
      }
      setScale(t2) {
        return this.set("scale", t2);
      }
      getMatrix() {
        return N.compose(this.get("translation"), this.get("rotation"), this.get("scale"), []);
      }
      setMatrix(t2) {
        const e2 = this.get("translation").slice(), r2 = this.get("rotation").slice(), n2 = this.get("scale").slice();
        return N.decompose(t2, e2, r2, n2), this.set("translation", e2).set("rotation", r2).set("scale", n2);
      }
      getWorldTranslation() {
        const t2 = [0, 0, 0];
        return N.decompose(this.getWorldMatrix(), t2, [0, 0, 0, 1], [1, 1, 1]), t2;
      }
      getWorldRotation() {
        const t2 = [0, 0, 0, 1];
        return N.decompose(this.getWorldMatrix(), [0, 0, 0], t2, [1, 1, 1]), t2;
      }
      getWorldScale() {
        const t2 = [1, 1, 1];
        return N.decompose(this.getWorldMatrix(), [0, 0, 0], [0, 0, 0, 1], t2), t2;
      }
      getWorldMatrix() {
        const t2 = [];
        for (let e3 = this; null != e3; e3 = e3.l) t2.push(e3);
        let e2;
        const r2 = t2.pop().getMatrix();
        for (; e2 = t2.pop(); ) R(r2, r2, e2.getMatrix());
        return r2;
      }
      addChild(e2) {
        if (e2.l && e2.l.removeChild(e2), e2.p.size) for (const t2 of e2.p) t2.removeChild(e2);
        this.addRef("children", e2), e2.l = this;
        const r2 = this[t.$attributes].children;
        return r2[r2.length - 1].addEventListener("dispose", () => e2.l = null), this;
      }
      removeChild(t2) {
        return this.removeRef("children", t2);
      }
      listChildren() {
        return this.listRefs("children");
      }
      getParent() {
        return this.l ? this.l : this.listParents().find((t2) => t2.propertyType === exports2.PropertyType.SCENE) || null;
      }
      getParentNode() {
        return this.l;
      }
      getMesh() {
        return this.getRef("mesh");
      }
      setMesh(t2) {
        return this.setRef("mesh", t2);
      }
      getCamera() {
        return this.getRef("camera");
      }
      setCamera(t2) {
        return this.setRef("camera", t2);
      }
      getSkin() {
        return this.getRef("skin");
      }
      setSkin(t2) {
        return this.setRef("skin", t2);
      }
      getWeights() {
        return this.get("weights");
      }
      setWeights(t2) {
        return this.set("weights", t2);
      }
      traverse(t2) {
        t2(this);
        for (const e2 of this.listChildren()) e2.traverse(t2);
        return this;
      }
    };
    var ut = class _ut extends V {
      init() {
        this.propertyType = exports2.PropertyType.PRIMITIVE;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { mode: _ut.Mode.TRIANGLES, material: null, indices: null, attributes: {}, targets: [] });
      }
      getIndices() {
        return this.getRef("indices");
      }
      setIndices(t2) {
        return this.setRef("indices", t2, { usage: o.ELEMENT_ARRAY_BUFFER });
      }
      getAttribute(t2) {
        return this.getRefMap("attributes", t2);
      }
      setAttribute(t2, e2) {
        return this.setRefMap("attributes", t2, e2, { usage: o.ARRAY_BUFFER });
      }
      listAttributes() {
        return this.listRefMapValues("attributes");
      }
      listSemantics() {
        return this.listRefMapKeys("attributes");
      }
      getMaterial() {
        return this.getRef("material");
      }
      setMaterial(t2) {
        return this.setRef("material", t2);
      }
      getMode() {
        return this.get("mode");
      }
      setMode(t2) {
        return this.set("mode", t2);
      }
      listTargets() {
        return this.listRefs("targets");
      }
      addTarget(t2) {
        return this.addRef("targets", t2);
      }
      removeTarget(t2) {
        return this.removeRef("targets", t2);
      }
    };
    ut.Mode = { POINTS: 0, LINES: 1, LINE_LOOP: 2, LINE_STRIP: 3, TRIANGLES: 4, TRIANGLE_STRIP: 5, TRIANGLE_FAN: 6 };
    var at = class extends $ {
      init() {
        this.propertyType = exports2.PropertyType.PRIMITIVE_TARGET;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { attributes: {} });
      }
      getAttribute(t2) {
        return this.getRefMap("attributes", t2);
      }
      setAttribute(t2, e2) {
        return this.setRefMap("attributes", t2, e2, { usage: o.ARRAY_BUFFER });
      }
      listAttributes() {
        return this.listRefMapValues("attributes");
      }
      listSemantics() {
        return this.listRefMapKeys("attributes");
      }
    };
    var ct = class extends V {
      init() {
        this.propertyType = exports2.PropertyType.SCENE;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { children: [] });
      }
      copy(t2, e2) {
        if (void 0 === e2 && (e2 = G), e2 === G) throw new Error("Scene cannot be copied.");
        return super.copy(t2, e2);
      }
      addChild(e2) {
        e2.l && e2.l.removeChild(e2), this.addRef("children", e2), e2.p.add(this);
        const r2 = this[t.$attributes].children;
        return r2[r2.length - 1].addEventListener("dispose", () => e2.p.delete(this)), this;
      }
      removeChild(t2) {
        return this.removeRef("children", t2);
      }
      listChildren() {
        return this.listRefs("children");
      }
      traverse(t2) {
        for (const e2 of this.listChildren()) e2.traverse(t2);
        return this;
      }
    };
    var ht = class extends V {
      init() {
        this.propertyType = exports2.PropertyType.SKIN;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { skeleton: null, inverseBindMatrices: null, joints: [] });
      }
      getSkeleton() {
        return this.getRef("skeleton");
      }
      setSkeleton(t2) {
        return this.setRef("skeleton", t2);
      }
      getInverseBindMatrices() {
        return this.getRef("inverseBindMatrices");
      }
      setInverseBindMatrices(t2) {
        return this.setRef("inverseBindMatrices", t2, { usage: o.INVERSE_BIND_MATRICES });
      }
      addJoint(t2) {
        return this.addRef("joints", t2);
      }
      removeJoint(t2) {
        return this.removeRef("joints", t2);
      }
      listJoints() {
        return this.listRefs("joints");
      }
    };
    var ft = class extends V {
      init() {
        this.propertyType = exports2.PropertyType.TEXTURE;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { image: null, mimeType: "", uri: "" });
      }
      getMimeType() {
        return this.get("mimeType") || b.extensionToMimeType(A.extension(this.get("uri")));
      }
      setMimeType(t2) {
        return this.set("mimeType", t2);
      }
      getURI() {
        return this.get("uri");
      }
      setURI(t2) {
        this.set("uri", t2);
        const e2 = b.extensionToMimeType(A.extension(t2));
        return e2 && this.set("mimeType", e2), this;
      }
      getImage() {
        return this.get("image");
      }
      setImage(t2) {
        return this.set("image", x.assertView(t2));
      }
      getSize() {
        const t2 = this.get("image");
        return t2 ? b.getSize(t2, this.getMimeType()) : null;
      }
    };
    var lt = class extends V {
      init() {
        this.propertyType = exports2.PropertyType.ROOT;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { asset: { generator: `glTF-Transform ${r}`, version: "2.0" }, defaultScene: null, accessors: [], animations: [], buffers: [], cameras: [], materials: [], meshes: [], nodes: [], scenes: [], skins: [], textures: [] });
      }
      constructor(t2) {
        super(t2), this.m = /* @__PURE__ */ new Set(), t2.addEventListener("node:create", (t3) => {
          this.g(t3.target);
        });
      }
      clone() {
        throw new Error("Root cannot be cloned.");
      }
      copy(t2, e2) {
        if (void 0 === e2 && (e2 = G), e2 === G) throw new Error("Root cannot be copied.");
        this.set("asset", { ...t2.get("asset") }), this.setName(t2.getName()), this.setExtras({ ...t2.getExtras() }), this.setDefaultScene(t2.getDefaultScene() ? e2(t2.getDefaultScene()) : null);
        for (const r2 of t2.listRefMapKeys("extensions")) {
          const n2 = t2.getExtension(r2);
          this.setExtension(r2, e2(n2));
        }
        return this;
      }
      g(t2) {
        return t2 instanceof ct ? this.addRef("scenes", t2) : t2 instanceof ot ? this.addRef("nodes", t2) : t2 instanceof K ? this.addRef("cameras", t2) : t2 instanceof ht ? this.addRef("skins", t2) : t2 instanceof it ? this.addRef("meshes", t2) : t2 instanceof st ? this.addRef("materials", t2) : t2 instanceof ft ? this.addRef("textures", t2) : t2 instanceof W ? this.addRef("animations", t2) : t2 instanceof q ? this.addRef("accessors", t2) : t2 instanceof Z && this.addRef("buffers", t2), this;
      }
      getAsset() {
        return this.get("asset");
      }
      listExtensionsUsed() {
        return Array.from(this.m);
      }
      listExtensionsRequired() {
        return this.listExtensionsUsed().filter((t2) => t2.isRequired());
      }
      T(t2) {
        return this.m.add(t2), this;
      }
      S(t2) {
        return this.m.delete(t2), this;
      }
      listScenes() {
        return this.listRefs("scenes");
      }
      setDefaultScene(t2) {
        return this.setRef("defaultScene", t2);
      }
      getDefaultScene() {
        return this.getRef("defaultScene");
      }
      listNodes() {
        return this.listRefs("nodes");
      }
      listCameras() {
        return this.listRefs("cameras");
      }
      listSkins() {
        return this.listRefs("skins");
      }
      listMeshes() {
        return this.listRefs("meshes");
      }
      listMaterials() {
        return this.listRefs("materials");
      }
      listTextures() {
        return this.listRefs("textures");
      }
      listAnimations() {
        return this.listRefs("animations");
      }
      listAccessors() {
        return this.listRefs("accessors");
      }
      listBuffers() {
        return this.listRefs("buffers");
      }
    };
    var dt = "undefined" != typeof Symbol ? Symbol.iterator || (Symbol.iterator = /* @__PURE__ */ Symbol("Symbol.iterator")) : "@@iterator";
    function pt(t2, e2, r2) {
      if (!t2.s) {
        if (r2 instanceof mt) {
          if (!r2.s) return void (r2.o = pt.bind(null, t2, e2));
          1 & e2 && (e2 = r2.s), r2 = r2.v;
        }
        if (r2 && r2.then) return void r2.then(pt.bind(null, t2, e2), pt.bind(null, t2, 2));
        t2.s = e2, t2.v = r2;
        const n2 = t2.o;
        n2 && n2(t2);
      }
    }
    var mt = /* @__PURE__ */ (function() {
      function t2() {
      }
      return t2.prototype.then = function(e2, r2) {
        const n2 = new t2(), s2 = this.s;
        if (s2) {
          const t3 = 1 & s2 ? e2 : r2;
          if (t3) {
            try {
              pt(n2, 1, t3(this.v));
            } catch (t4) {
              pt(n2, 2, t4);
            }
            return n2;
          }
          return this;
        }
        return this.o = function(t3) {
          try {
            const s3 = t3.v;
            1 & t3.s ? pt(n2, 1, e2 ? e2(s3) : s3) : r2 ? pt(n2, 1, r2(s3)) : pt(n2, 2, s3);
          } catch (t4) {
            pt(n2, 2, t4);
          }
        }, n2;
      }, t2;
    })();
    function gt(t2) {
      return t2 instanceof mt && 1 & t2.s;
    }
    var vt = class _vt {
      static fromGraph(t2) {
        return _vt.M.get(t2) || null;
      }
      constructor() {
        this.I = new t.Graph(), this.P = new lt(this.I), this.N = P.DEFAULT_INSTANCE, _vt.M.set(this.I, this);
      }
      getRoot() {
        return this.P;
      }
      getGraph() {
        return this.I;
      }
      getLogger() {
        return this.N;
      }
      setLogger(t2) {
        return this.N = t2, this;
      }
      clone() {
        return new _vt().setLogger(this.N).merge(this);
      }
      merge(t2) {
        for (const e3 of t2.getRoot().listExtensionsUsed()) {
          const t3 = this.createExtension(e3.constructor);
          e3.isRequired() && t3.setRequired(true);
        }
        const e2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Map();
        e2.add(t2.P), r2.set(t2.P, this.P);
        for (const n3 of t2.I.listEdges()) for (const t3 of [n3.getParent(), n3.getChild()]) {
          if (e2.has(t3)) continue;
          let n4;
          n4 = t3.propertyType === exports2.PropertyType.TEXTURE_INFO ? t3 : new (0, t3.constructor)(this.I), r2.set(t3, n4), e2.add(t3);
        }
        const n2 = (t3) => {
          const e3 = r2.get(t3);
          if (!e3) throw new Error("Could resolve property.");
          return e3;
        };
        for (const t3 of e2) {
          const e3 = r2.get(t3);
          if (!e3) throw new Error("Could resolve property.");
          e3.propertyType !== exports2.PropertyType.TEXTURE_INFO && e3.copy(t3, n2);
        }
        return this;
      }
      transform() {
        try {
          const e2 = this;
          var t2 = [].slice.call(arguments);
          const r2 = t2.map((t3) => t3.name), n2 = (function(t3, e3, r3) {
            if ("function" == typeof t3[dt]) {
              var n3, s2, i2, o2 = t3[dt]();
              if ((function t4(r4) {
                try {
                  for (; !(n3 = o2.next()).done; ) if ((r4 = e3(n3.value)) && r4.then) {
                    if (!gt(r4)) return void r4.then(t4, i2 || (i2 = pt.bind(null, s2 = new mt(), 2)));
                    r4 = r4.v;
                  }
                  s2 ? pt(s2, 1, r4) : s2 = r4;
                } catch (t5) {
                  pt(s2 || (s2 = new mt()), 2, t5);
                }
              })(), o2.return) {
                var u2 = function(t4) {
                  try {
                    n3.done || o2.return();
                  } catch (t5) {
                  }
                  return t4;
                };
                if (s2 && s2.then) return s2.then(u2, function(t4) {
                  throw u2(t4);
                });
                u2();
              }
              return s2;
            }
            if (!("length" in t3)) throw new TypeError("Object is not iterable");
            for (var a2 = [], c2 = 0; c2 < t3.length; c2++) a2.push(t3[c2]);
            return (function(t4, e4, r4) {
              var n4, s3, i3 = -1;
              return (function r5(o3) {
                try {
                  for (; ++i3 < t4.length; ) if ((o3 = e4(i3)) && o3.then) {
                    if (!gt(o3)) return void o3.then(r5, s3 || (s3 = pt.bind(null, n4 = new mt(), 2)));
                    o3 = o3.v;
                  }
                  n4 ? pt(n4, 1, o3) : n4 = o3;
                } catch (t5) {
                  pt(n4 || (n4 = new mt()), 2, t5);
                }
              })(), n4;
            })(a2, function(t4) {
              return e3(a2[t4]);
            });
          })(t2, function(t3) {
            return Promise.resolve(t3(e2, { stack: r2 })).then(function() {
            });
          });
          return Promise.resolve(n2 && n2.then ? n2.then(function() {
            return e2;
          }) : e2);
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      createExtension(t2) {
        const e2 = t2.EXTENSION_NAME;
        return this.getRoot().listExtensionsUsed().find((t3) => t3.extensionName === e2) || new t2(this);
      }
      createScene(t2) {
        return void 0 === t2 && (t2 = ""), new ct(this.I, t2);
      }
      createNode(t2) {
        return void 0 === t2 && (t2 = ""), new ot(this.I, t2);
      }
      createCamera(t2) {
        return void 0 === t2 && (t2 = ""), new K(this.I, t2);
      }
      createSkin(t2) {
        return void 0 === t2 && (t2 = ""), new ht(this.I, t2);
      }
      createMesh(t2) {
        return void 0 === t2 && (t2 = ""), new it(this.I, t2);
      }
      createPrimitive() {
        return new ut(this.I);
      }
      createPrimitiveTarget(t2) {
        return void 0 === t2 && (t2 = ""), new at(this.I, t2);
      }
      createMaterial(t2) {
        return void 0 === t2 && (t2 = ""), new st(this.I, t2);
      }
      createTexture(t2) {
        return void 0 === t2 && (t2 = ""), new ft(this.I, t2);
      }
      createAnimation(t2) {
        return void 0 === t2 && (t2 = ""), new W(this.I, t2);
      }
      createAnimationChannel(t2) {
        return void 0 === t2 && (t2 = ""), new H(this.I, t2);
      }
      createAnimationSampler(t2) {
        return void 0 === t2 && (t2 = ""), new Y(this.I, t2);
      }
      createAccessor(t2, e2) {
        return void 0 === t2 && (t2 = ""), void 0 === e2 && (e2 = null), e2 || (e2 = this.getRoot().listBuffers()[0]), new q(this.I, t2).setBuffer(e2);
      }
      createBuffer(t2) {
        return void 0 === t2 && (t2 = ""), new Z(this.I, t2);
      }
    };
    vt.M = /* @__PURE__ */ new WeakMap();
    var xt = class {
      constructor(t2) {
        this.extensionName = "", this.prereadTypes = [], this.prewriteTypes = [], this.readDependencies = [], this.writeDependencies = [], this.document = void 0, this.required = false, this.properties = /* @__PURE__ */ new Set(), this.O = void 0, this.document = t2, t2.getRoot().T(this), this.O = (t3) => {
          const e3 = t3, r2 = e3.target;
          r2 instanceof Q && r2.extensionName === this.extensionName && ("node:create" === e3.type && this.C(r2), "node:dispose" === e3.type && this.F(r2));
        };
        const e2 = t2.getGraph();
        e2.addEventListener("node:create", this.O), e2.addEventListener("node:dispose", this.O);
      }
      dispose() {
        this.document.getRoot().S(this);
        const t2 = this.document.getGraph();
        t2.removeEventListener("node:create", this.O), t2.removeEventListener("node:dispose", this.O);
        for (const t3 of this.properties) t3.dispose();
      }
      static register() {
      }
      isRequired() {
        return this.required;
      }
      setRequired(t2) {
        return this.required = t2, this;
      }
      listProperties() {
        return Array.from(this.properties);
      }
      C(t2) {
        return this.properties.add(t2), this;
      }
      F(t2) {
        return this.properties.delete(t2), this;
      }
      install(t2, e2) {
        return this;
      }
      preread(t2, e2) {
        return this;
      }
      prewrite(t2, e2) {
        return this;
      }
    };
    xt.EXTENSION_NAME = void 0;
    var wt = class {
      constructor(t2) {
        this.jsonDoc = void 0, this.buffers = [], this.bufferViews = [], this.bufferViewBuffers = [], this.accessors = [], this.textures = [], this.textureInfos = /* @__PURE__ */ new Map(), this.materials = [], this.meshes = [], this.cameras = [], this.nodes = [], this.skins = [], this.animations = [], this.scenes = [], this.jsonDoc = t2;
      }
      setTextureInfo(t2, e2) {
        this.textureInfos.set(t2, e2), void 0 !== e2.texCoord && t2.setTexCoord(e2.texCoord), void 0 !== e2.extras && t2.setExtras(e2.extras);
        const r2 = this.jsonDoc.json.textures[e2.index];
        if (void 0 === r2.sampler) return;
        const n2 = this.jsonDoc.json.samplers[r2.sampler];
        void 0 !== n2.magFilter && t2.setMagFilter(n2.magFilter), void 0 !== n2.minFilter && t2.setMinFilter(n2.minFilter), void 0 !== n2.wrapS && t2.setWrapS(n2.wrapS), void 0 !== n2.wrapT && t2.setWrapT(n2.wrapT);
      }
    };
    var yt = { logger: P.DEFAULT_INSTANCE, extensions: [], dependencies: {} };
    var bt = class {
      static read(t2, e2) {
        void 0 === e2 && (e2 = yt);
        const r2 = { ...yt, ...e2 }, { json: s2 } = t2, i2 = new vt().setLogger(r2.logger);
        this.validate(t2, r2);
        const o2 = new wt(t2), u2 = s2.asset, a2 = i2.getRoot().getAsset();
        u2.copyright && (a2.copyright = u2.copyright), u2.extras && (a2.extras = u2.extras), void 0 !== s2.extras && i2.getRoot().setExtras({ ...s2.extras });
        const h2 = s2.extensionsUsed || [], f2 = s2.extensionsRequired || [];
        for (const t3 of r2.extensions) if (h2.includes(t3.EXTENSION_NAME)) {
          const e3 = i2.createExtension(t3).setRequired(f2.includes(t3.EXTENSION_NAME));
          for (const t4 of e3.readDependencies) e3.install(t4, r2.dependencies[t4]);
        }
        const l2 = s2.buffers || [];
        i2.getRoot().listExtensionsUsed().filter((t3) => t3.prereadTypes.includes(exports2.PropertyType.BUFFER)).forEach((t3) => t3.preread(o2, exports2.PropertyType.BUFFER)), o2.buffers = l2.map((t3) => {
          const e3 = i2.createBuffer(t3.name);
          return t3.extras && e3.setExtras(t3.extras), t3.uri && 0 !== t3.uri.indexOf("__") && e3.setURI(t3.uri), e3;
        }), o2.bufferViewBuffers = (s2.bufferViews || []).map((e3, r3) => {
          if (!o2.bufferViews[r3]) {
            const s3 = t2.json.buffers[e3.buffer];
            o2.bufferViews[r3] = x.toView(s3.uri ? t2.resources[s3.uri] : t2.resources[n], e3.byteOffset || 0, e3.byteLength);
          }
          return o2.buffers[e3.buffer];
        });
        const d2 = s2.accessors || [];
        o2.accessors = d2.map((t3) => {
          const e3 = i2.createAccessor(t3.name, o2.bufferViewBuffers[t3.bufferView]).setType(t3.type);
          return t3.extras && e3.setExtras(t3.extras), void 0 !== t3.normalized && e3.setNormalized(t3.normalized), void 0 === t3.bufferView || e3.setArray(Tt(t3, o2)), e3;
        });
        const p2 = s2.images || [], m2 = s2.textures || [];
        i2.getRoot().listExtensionsUsed().filter((t3) => t3.prereadTypes.includes(exports2.PropertyType.TEXTURE)).forEach((t3) => t3.preread(o2, exports2.PropertyType.TEXTURE)), o2.textures = p2.map((e3) => {
          const r3 = i2.createTexture(e3.name);
          if (e3.extras && r3.setExtras(e3.extras), void 0 !== e3.bufferView) {
            const i3 = s2.bufferViews[e3.bufferView], o3 = t2.json.buffers[i3.buffer], u3 = i3.byteOffset || 0, a3 = (o3.uri ? t2.resources[o3.uri] : t2.resources[n]).slice(u3, u3 + i3.byteLength);
            r3.setImage(a3);
          } else void 0 !== e3.uri && (r3.setImage(t2.resources[e3.uri]), 0 !== e3.uri.indexOf("__") && r3.setURI(e3.uri));
          if (void 0 !== e3.mimeType) r3.setMimeType(e3.mimeType);
          else if (e3.uri) {
            const t3 = A.extension(e3.uri);
            r3.setMimeType(b.extensionToMimeType(t3));
          }
          return r3;
        }), o2.materials = (s2.materials || []).map((t3) => {
          const e3 = i2.createMaterial(t3.name);
          t3.extras && e3.setExtras(t3.extras), void 0 !== t3.alphaMode && e3.setAlphaMode(t3.alphaMode), void 0 !== t3.alphaCutoff && e3.setAlphaCutoff(t3.alphaCutoff), void 0 !== t3.doubleSided && e3.setDoubleSided(t3.doubleSided);
          const r3 = t3.pbrMetallicRoughness || {};
          if (void 0 !== r3.baseColorFactor && e3.setBaseColorFactor(r3.baseColorFactor), void 0 !== t3.emissiveFactor && e3.setEmissiveFactor(t3.emissiveFactor), void 0 !== r3.metallicFactor && e3.setMetallicFactor(r3.metallicFactor), void 0 !== r3.roughnessFactor && e3.setRoughnessFactor(r3.roughnessFactor), void 0 !== r3.baseColorTexture) {
            const t4 = r3.baseColorTexture;
            e3.setBaseColorTexture(o2.textures[m2[t4.index].source]), o2.setTextureInfo(e3.getBaseColorTextureInfo(), t4);
          }
          if (void 0 !== t3.emissiveTexture) {
            const r4 = t3.emissiveTexture;
            e3.setEmissiveTexture(o2.textures[m2[r4.index].source]), o2.setTextureInfo(e3.getEmissiveTextureInfo(), r4);
          }
          if (void 0 !== t3.normalTexture) {
            const r4 = t3.normalTexture;
            e3.setNormalTexture(o2.textures[m2[r4.index].source]), o2.setTextureInfo(e3.getNormalTextureInfo(), r4), void 0 !== t3.normalTexture.scale && e3.setNormalScale(t3.normalTexture.scale);
          }
          if (void 0 !== t3.occlusionTexture) {
            const r4 = t3.occlusionTexture;
            e3.setOcclusionTexture(o2.textures[m2[r4.index].source]), o2.setTextureInfo(e3.getOcclusionTextureInfo(), r4), void 0 !== t3.occlusionTexture.strength && e3.setOcclusionStrength(t3.occlusionTexture.strength);
          }
          if (void 0 !== r3.metallicRoughnessTexture) {
            const t4 = r3.metallicRoughnessTexture;
            e3.setMetallicRoughnessTexture(o2.textures[m2[t4.index].source]), o2.setTextureInfo(e3.getMetallicRoughnessTextureInfo(), t4);
          }
          return e3;
        });
        const g2 = s2.meshes || [];
        i2.getRoot().listExtensionsUsed().filter((t3) => t3.prereadTypes.includes(exports2.PropertyType.PRIMITIVE)).forEach((t3) => t3.preread(o2, exports2.PropertyType.PRIMITIVE)), o2.meshes = g2.map((t3) => {
          const e3 = i2.createMesh(t3.name);
          return t3.extras && e3.setExtras(t3.extras), void 0 !== t3.weights && e3.setWeights(t3.weights), (t3.primitives || []).forEach((r3) => {
            const n2 = i2.createPrimitive();
            r3.extras && n2.setExtras(r3.extras), void 0 !== r3.material && n2.setMaterial(o2.materials[r3.material]), void 0 !== r3.mode && n2.setMode(r3.mode);
            for (const [t4, e4] of Object.entries(r3.attributes || {})) n2.setAttribute(t4, o2.accessors[e4]);
            void 0 !== r3.indices && n2.setIndices(o2.accessors[r3.indices]);
            const s3 = t3.extras && t3.extras.targetNames || [];
            (r3.targets || []).forEach((t4, e4) => {
              const r4 = s3[e4] || e4.toString(), u3 = i2.createPrimitiveTarget(r4);
              for (const [e5, r5] of Object.entries(t4)) u3.setAttribute(e5, o2.accessors[r5]);
              n2.addTarget(u3);
            }), e3.addPrimitive(n2);
          }), e3;
        }), o2.cameras = (s2.cameras || []).map((t3) => {
          const e3 = i2.createCamera(t3.name).setType(t3.type);
          if (t3.extras && e3.setExtras(t3.extras), t3.type === K.Type.PERSPECTIVE) {
            const r3 = t3.perspective;
            e3.setYFov(r3.yfov), e3.setZNear(r3.znear), void 0 !== r3.zfar && e3.setZFar(r3.zfar), void 0 !== r3.aspectRatio && e3.setAspectRatio(r3.aspectRatio);
          } else {
            const r3 = t3.orthographic;
            e3.setZNear(r3.znear).setZFar(r3.zfar).setXMag(r3.xmag).setYMag(r3.ymag);
          }
          return e3;
        });
        const v2 = s2.nodes || [];
        i2.getRoot().listExtensionsUsed().filter((t3) => t3.prereadTypes.includes(exports2.PropertyType.NODE)).forEach((t3) => t3.preread(o2, exports2.PropertyType.NODE)), o2.nodes = v2.map((t3) => {
          const e3 = i2.createNode(t3.name);
          if (t3.extras && e3.setExtras(t3.extras), void 0 !== t3.translation && e3.setTranslation(t3.translation), void 0 !== t3.rotation && e3.setRotation(t3.rotation), void 0 !== t3.scale && e3.setScale(t3.scale), void 0 !== t3.matrix) {
            const r3 = [0, 0, 0], n2 = [0, 0, 0, 1], s3 = [1, 1, 1];
            N.decompose(t3.matrix, r3, n2, s3), e3.setTranslation(r3), e3.setRotation(n2), e3.setScale(s3);
          }
          return void 0 !== t3.weights && e3.setWeights(t3.weights), e3;
        }), o2.skins = (s2.skins || []).map((t3) => {
          const e3 = i2.createSkin(t3.name);
          t3.extras && e3.setExtras(t3.extras), void 0 !== t3.inverseBindMatrices && e3.setInverseBindMatrices(o2.accessors[t3.inverseBindMatrices]), void 0 !== t3.skeleton && e3.setSkeleton(o2.nodes[t3.skeleton]);
          for (const r3 of t3.joints) e3.addJoint(o2.nodes[r3]);
          return e3;
        }), v2.map((t3, e3) => {
          const r3 = o2.nodes[e3];
          (t3.children || []).forEach((t4) => r3.addChild(o2.nodes[t4])), void 0 !== t3.mesh && r3.setMesh(o2.meshes[t3.mesh]), void 0 !== t3.camera && r3.setCamera(o2.cameras[t3.camera]), void 0 !== t3.skin && r3.setSkin(o2.skins[t3.skin]);
        }), o2.animations = (s2.animations || []).map((t3) => {
          const e3 = i2.createAnimation(t3.name);
          t3.extras && e3.setExtras(t3.extras);
          const r3 = (t3.samplers || []).map((t4) => {
            const r4 = i2.createAnimationSampler().setInput(o2.accessors[t4.input]).setOutput(o2.accessors[t4.output]).setInterpolation(t4.interpolation || Y.Interpolation.LINEAR);
            return t4.extras && r4.setExtras(t4.extras), e3.addSampler(r4), r4;
          });
          return (t3.channels || []).forEach((t4) => {
            const n2 = i2.createAnimationChannel().setSampler(r3[t4.sampler]).setTargetPath(t4.target.path);
            void 0 !== t4.target.node && n2.setTargetNode(o2.nodes[t4.target.node]), t4.extras && n2.setExtras(t4.extras), e3.addChannel(n2);
          }), e3;
        });
        const w2 = s2.scenes || [];
        return i2.getRoot().listExtensionsUsed().filter((t3) => t3.prereadTypes.includes(exports2.PropertyType.SCENE)).forEach((t3) => t3.preread(o2, exports2.PropertyType.SCENE)), o2.scenes = w2.map((t3) => {
          const e3 = i2.createScene(t3.name);
          return t3.extras && e3.setExtras(t3.extras), (t3.nodes || []).map((t4) => o2.nodes[t4]).forEach((t4) => e3.addChild(t4)), e3;
        }), void 0 !== s2.scene && i2.getRoot().setDefaultScene(o2.scenes[s2.scene]), i2.getRoot().listExtensionsUsed().forEach((t3) => t3.read(o2)), d2.forEach((t3, e3) => {
          const r3 = o2.accessors[e3], n2 = !!t3.sparse, s3 = !t3.bufferView && !r3.getArray();
          (n2 || s3) && r3.setSparse(true).setArray((function(t4, e4) {
            const r4 = c[t4.componentType], n3 = q.getElementSize(t4.type);
            let s4;
            s4 = void 0 !== t4.bufferView ? Tt(t4, e4) : new r4(t4.count * n3);
            const i3 = t4.sparse;
            if (!i3) return s4;
            const o3 = i3.count, u3 = { ...t4, ...i3.indices, count: o3, type: "SCALAR" }, a3 = { ...t4, ...i3.values, count: o3 }, h3 = Tt(u3, e4), f3 = Tt(a3, e4);
            for (let t5 = 0; t5 < u3.count; t5++) for (let e5 = 0; e5 < n3; e5++) s4[h3[t5] * n3 + e5] = f3[t5 * n3 + e5];
            return s4;
          })(t3, o2));
        }), i2;
      }
      static validate(t2, e2) {
        const r2 = t2.json;
        if ("2.0" !== r2.asset.version) throw new Error(`Unsupported glTF version, "${r2.asset.version}".`);
        if (r2.extensionsRequired) {
          for (const t3 of r2.extensionsRequired) if (!e2.extensions.find((e3) => e3.EXTENSION_NAME === t3)) throw new Error(`Missing required extension, "${t3}".`);
        }
        if (r2.extensionsUsed) for (const t3 of r2.extensionsUsed) e2.extensions.find((e3) => e3.EXTENSION_NAME === t3) || e2.logger.warn(`Missing optional extension, "${t3}".`);
      }
    };
    function Tt(t2, e2) {
      const r2 = e2.bufferViews[t2.bufferView], n2 = e2.jsonDoc.json.bufferViews[t2.bufferView], s2 = c[t2.componentType], i2 = q.getElementSize(t2.type), o2 = s2.BYTES_PER_ELEMENT;
      if (void 0 !== n2.byteStride && n2.byteStride !== i2 * o2) return (function(t3, e3) {
        const r3 = e3.bufferViews[t3.bufferView], n3 = e3.jsonDoc.json.bufferViews[t3.bufferView], s3 = c[t3.componentType], i3 = q.getElementSize(t3.type), o3 = s3.BYTES_PER_ELEMENT, u3 = t3.byteOffset || 0, a2 = new s3(t3.count * i3), h2 = new DataView(r3.buffer, r3.byteOffset, r3.byteLength), f2 = n3.byteStride;
        for (let e4 = 0; e4 < t3.count; e4++) for (let r4 = 0; r4 < i3; r4++) {
          const n4 = u3 + e4 * f2 + r4 * o3;
          let s4;
          switch (t3.componentType) {
            case q.ComponentType.FLOAT:
              s4 = h2.getFloat32(n4, true);
              break;
            case q.ComponentType.UNSIGNED_INT:
              s4 = h2.getUint32(n4, true);
              break;
            case q.ComponentType.UNSIGNED_SHORT:
              s4 = h2.getUint16(n4, true);
              break;
            case q.ComponentType.UNSIGNED_BYTE:
              s4 = h2.getUint8(n4);
              break;
            case q.ComponentType.SHORT:
              s4 = h2.getInt16(n4, true);
              break;
            case q.ComponentType.BYTE:
              s4 = h2.getInt8(n4);
              break;
            default:
              throw new Error(`Unexpected componentType "${t3.componentType}".`);
          }
          a2[e4 * i3 + r4] = s4;
        }
        return a2;
      })(t2, e2);
      const u2 = r2.byteOffset + (t2.byteOffset || 0);
      return new s2(r2.buffer.slice(u2, u2 + t2.count * i2 * o2));
    }
    var At;
    !(function(t2) {
      t2[t2.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", t2[t2.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER";
    })(At || (At = {}));
    var Et = class {
      constructor(t2, e2, r2) {
        this.U = void 0, this.jsonDoc = void 0, this.options = void 0, this.accessorIndexMap = /* @__PURE__ */ new Map(), this.animationIndexMap = /* @__PURE__ */ new Map(), this.bufferIndexMap = /* @__PURE__ */ new Map(), this.cameraIndexMap = /* @__PURE__ */ new Map(), this.skinIndexMap = /* @__PURE__ */ new Map(), this.materialIndexMap = /* @__PURE__ */ new Map(), this.meshIndexMap = /* @__PURE__ */ new Map(), this.nodeIndexMap = /* @__PURE__ */ new Map(), this.imageIndexMap = /* @__PURE__ */ new Map(), this.textureDefIndexMap = /* @__PURE__ */ new Map(), this.textureInfoDefMap = /* @__PURE__ */ new Map(), this.samplerDefIndexMap = /* @__PURE__ */ new Map(), this.sceneIndexMap = /* @__PURE__ */ new Map(), this.imageBufferViews = [], this.otherBufferViews = /* @__PURE__ */ new Map(), this.otherBufferViewsIndexMap = /* @__PURE__ */ new Map(), this.extensionData = {}, this.bufferURIGenerator = void 0, this.imageURIGenerator = void 0, this.logger = void 0, this.j = /* @__PURE__ */ new Map(), this.accessorUsageGroupedByParent = /* @__PURE__ */ new Set(["ARRAY_BUFFER"]), this.accessorParents = /* @__PURE__ */ new Map(), this.U = t2, this.jsonDoc = e2, this.options = r2;
        const n2 = t2.getRoot(), s2 = n2.listBuffers().length, i2 = n2.listTextures().length;
        this.bufferURIGenerator = new St(s2 > 1, () => r2.basename || "buffer"), this.imageURIGenerator = new St(i2 > 1, (e3) => (function(t3, e4) {
          const r3 = t3.getGraph().listParentEdges(e4).find((e5) => e5.getParent() !== t3.getRoot());
          return r3 ? r3.getName().replace(/texture$/i, "") : "";
        })(t2, e3) || r2.basename || "texture"), this.logger = t2.getLogger();
      }
      createTextureInfoDef(t2, e2) {
        const r2 = { magFilter: e2.getMagFilter() || void 0, minFilter: e2.getMinFilter() || void 0, wrapS: e2.getWrapS(), wrapT: e2.getWrapT() }, n2 = JSON.stringify(r2);
        this.samplerDefIndexMap.has(n2) || (this.samplerDefIndexMap.set(n2, this.jsonDoc.json.samplers.length), this.jsonDoc.json.samplers.push(r2));
        const s2 = { source: this.imageIndexMap.get(t2), sampler: this.samplerDefIndexMap.get(n2) }, i2 = JSON.stringify(s2);
        this.textureDefIndexMap.has(i2) || (this.textureDefIndexMap.set(i2, this.jsonDoc.json.textures.length), this.jsonDoc.json.textures.push(s2));
        const o2 = { index: this.textureDefIndexMap.get(i2) };
        return 0 !== e2.getTexCoord() && (o2.texCoord = e2.getTexCoord()), Object.keys(e2.getExtras()).length > 0 && (o2.extras = e2.getExtras()), this.textureInfoDefMap.set(e2, o2), o2;
      }
      createPropertyDef(t2) {
        const e2 = {};
        return t2.getName() && (e2.name = t2.getName()), Object.keys(t2.getExtras()).length > 0 && (e2.extras = t2.getExtras()), e2;
      }
      createAccessorDef(t2) {
        const e2 = this.createPropertyDef(t2);
        return e2.type = t2.getType(), e2.componentType = t2.getComponentType(), e2.count = t2.getCount(), this.U.getGraph().listParentEdges(t2).some((t3) => "attributes" === t3.getName() && "POSITION" === t3.getAttributes().key || "input" === t3.getName()) && (e2.max = t2.getMax([]).map(Math.fround), e2.min = t2.getMin([]).map(Math.fround)), t2.getNormalized() && (e2.normalized = t2.getNormalized()), e2;
      }
      createImageData(t2, e2, r2) {
        if (this.options.format === exports2.Format.GLB) this.imageBufferViews.push(e2), t2.bufferView = this.jsonDoc.json.bufferViews.length, this.jsonDoc.json.bufferViews.push({ buffer: 0, byteOffset: -1, byteLength: e2.byteLength });
        else {
          const n2 = b.mimeTypeToExtension(r2.getMimeType());
          t2.uri = this.imageURIGenerator.createURI(r2, n2), this.jsonDoc.resources[t2.uri] = e2;
        }
      }
      getAccessorUsage(t2) {
        const e2 = this.j.get(t2);
        if (e2) return e2;
        if (t2.getSparse()) return o.SPARSE;
        for (const e3 of this.U.getGraph().listParentEdges(t2)) {
          const { usage: t3 } = e3.getAttributes();
          if (t3) return t3;
          e3.getParent().propertyType !== exports2.PropertyType.ROOT && this.logger.warn(`Missing attribute ".usage" on edge, "${e3.getName()}".`);
        }
        return o.OTHER;
      }
      addAccessorToUsageGroup(t2, e2) {
        const r2 = this.j.get(t2);
        if (r2 && r2 !== e2) throw new Error(`Accessor with usage "${r2}" cannot be reused as "${e2}".`);
        return this.j.set(t2, e2), this;
      }
      listAccessorUsageGroups() {
        const t2 = {};
        for (const [e2, r2] of Array.from(this.j.entries())) t2[r2] = t2[r2] || [], t2[r2].push(e2);
        return t2;
      }
    };
    Et.BufferViewTarget = At, Et.BufferViewUsage = o, Et.USAGE_TO_TARGET = { [o.ARRAY_BUFFER]: At.ARRAY_BUFFER, [o.ELEMENT_ARRAY_BUFFER]: At.ELEMENT_ARRAY_BUFFER };
    var St = class {
      constructor(t2, e2) {
        this.multiple = void 0, this.basename = void 0, this.counter = {}, this.multiple = t2, this.basename = e2;
      }
      createURI(t2, e2) {
        if (t2.getURI()) return t2.getURI();
        if (this.multiple) {
          const r2 = this.basename(t2);
          return this.counter[r2] = this.counter[r2] || 1, `${r2}_${this.counter[r2]++}.${e2}`;
        }
        return `${this.basename(t2)}.${e2}`;
      }
    };
    var { BufferViewUsage: Mt } = Et;
    var { UNSIGNED_INT: It, UNSIGNED_SHORT: Pt, UNSIGNED_BYTE: Rt } = q.ComponentType;
    var Nt = class {
      static write(t2, e2) {
        const s2 = t2.getRoot(), i2 = { asset: { generator: `glTF-Transform ${r}`, ...s2.getAsset() }, extras: { ...s2.getExtras() } }, o2 = { json: i2, resources: {} }, u2 = new Et(t2, o2, e2), a2 = e2.logger || P.DEFAULT_INSTANCE, h2 = new Set(e2.extensions.map((t3) => t3.EXTENSION_NAME)), f2 = t2.getRoot().listExtensionsUsed().filter((t3) => h2.has(t3.extensionName)), l2 = t2.getRoot().listExtensionsRequired().filter((t3) => h2.has(t3.extensionName));
        f2.length < t2.getRoot().listExtensionsUsed().length && a2.warn("Some extensions were not registered for I/O, and will not be written.");
        for (const t3 of f2) for (const r2 of t3.writeDependencies) t3.install(r2, e2.dependencies[r2]);
        function d2(t3, e3, r2, n2) {
          const s3 = [];
          let o3 = 0;
          for (const e4 of t3) {
            const t4 = u2.createAccessorDef(e4);
            t4.bufferView = i2.bufferViews.length;
            const r3 = e4.getArray(), n3 = x.pad(x.toView(r3));
            t4.byteOffset = o3, o3 += n3.byteLength, s3.push(n3), u2.accessorIndexMap.set(e4, i2.accessors.length), i2.accessors.push(t4);
          }
          const a3 = { buffer: e3, byteOffset: r2, byteLength: x.concat(s3).byteLength };
          return n2 && (a3.target = n2), i2.bufferViews.push(a3), { buffers: s3, byteLength: o3 };
        }
        function p2(t3, e3, r2) {
          const n2 = t3[0].getCount();
          let s3 = 0;
          for (const e4 of t3) {
            const t4 = u2.createAccessorDef(e4);
            t4.bufferView = i2.bufferViews.length, t4.byteOffset = s3;
            const r3 = e4.getElementSize(), n3 = e4.getComponentSize();
            s3 += x.padNumber(r3 * n3), u2.accessorIndexMap.set(e4, i2.accessors.length), i2.accessors.push(t4);
          }
          const o3 = n2 * s3, a3 = new ArrayBuffer(o3), c2 = new DataView(a3);
          for (let e4 = 0; e4 < n2; e4++) {
            let r3 = 0;
            for (const n3 of t3) {
              const t4 = n3.getElementSize(), i3 = n3.getComponentSize(), o4 = n3.getComponentType(), u3 = n3.getArray();
              for (let n4 = 0; n4 < t4; n4++) {
                const a4 = e4 * s3 + r3 + n4 * i3, h3 = u3[e4 * t4 + n4];
                switch (o4) {
                  case q.ComponentType.FLOAT:
                    c2.setFloat32(a4, h3, true);
                    break;
                  case q.ComponentType.BYTE:
                    c2.setInt8(a4, h3);
                    break;
                  case q.ComponentType.SHORT:
                    c2.setInt16(a4, h3, true);
                    break;
                  case q.ComponentType.UNSIGNED_BYTE:
                    c2.setUint8(a4, h3);
                    break;
                  case q.ComponentType.UNSIGNED_SHORT:
                    c2.setUint16(a4, h3, true);
                    break;
                  case q.ComponentType.UNSIGNED_INT:
                    c2.setUint32(a4, h3, true);
                    break;
                  default:
                    throw new Error("Unexpected component type: " + o4);
                }
              }
              r3 += x.padNumber(t4 * i3);
            }
          }
          return i2.bufferViews.push({ buffer: e3, byteOffset: r2, byteLength: o3, byteStride: s3, target: Et.BufferViewTarget.ARRAY_BUFFER }), { byteLength: o3, buffers: [new Uint8Array(a3)] };
        }
        function m2(t3, e3, r2) {
          const n2 = [];
          let s3 = 0;
          const o3 = /* @__PURE__ */ new Map();
          let h3 = -Infinity;
          for (const e4 of t3) {
            const t4 = u2.createAccessorDef(e4);
            i2.accessors.push(t4), u2.accessorIndexMap.set(e4, i2.accessors.length - 1);
            const r3 = [], n3 = [], s4 = [], f4 = new Array(e4.getElementSize()).fill(0);
            for (let t5 = 0, i3 = e4.getCount(); t5 < i3; t5++) if (e4.getElement(t5, s4), !N.eq(s4, f4, 0)) {
              h3 = Math.max(t5, h3), r3.push(t5);
              for (let t6 = 0; t6 < s4.length; t6++) n3.push(s4[t6]);
            }
            const l4 = r3.length, d4 = { accessorDef: t4, count: l4 };
            if (o3.set(e4, d4), 0 === l4) continue;
            if (l4 > e4.getCount() / 3) {
              const t5 = (100 * r3.length / e4.getCount()).toFixed(1);
              a2.warn(`Sparse accessor with many non-zero elements (${t5}%) may increase file size.`);
            }
            const p4 = c[e4.getComponentType()];
            d4.indices = r3, d4.values = new p4(n3);
          }
          if (!Number.isFinite(h3)) return { buffers: n2, byteLength: s3 };
          const f3 = h3 < 255 ? Uint8Array : h3 < 65535 ? Uint16Array : Uint32Array, l3 = h3 < 255 ? Rt : h3 < 65535 ? Pt : It, d3 = { buffer: e3, byteOffset: r2 + s3, byteLength: 0 };
          for (const e4 of t3) {
            const t4 = o3.get(e4);
            if (0 === t4.count) continue;
            t4.indicesByteOffset = d3.byteLength;
            const r3 = x.pad(x.toView(new f3(t4.indices)));
            n2.push(r3), s3 += r3.byteLength, d3.byteLength += r3.byteLength;
          }
          i2.bufferViews.push(d3);
          const p3 = i2.bufferViews.length - 1, m3 = { buffer: e3, byteOffset: r2 + s3, byteLength: 0 };
          for (const e4 of t3) {
            const t4 = o3.get(e4);
            if (0 === t4.count) continue;
            t4.valuesByteOffset = m3.byteLength;
            const r3 = x.pad(x.toView(t4.values));
            n2.push(r3), s3 += r3.byteLength, m3.byteLength += r3.byteLength;
          }
          i2.bufferViews.push(m3);
          const g3 = i2.bufferViews.length - 1;
          for (const e4 of t3) {
            const t4 = o3.get(e4);
            0 !== t4.count && (t4.accessorDef.sparse = { count: t4.count, indices: { bufferView: p3, byteOffset: t4.indicesByteOffset, componentType: l3 }, values: { bufferView: g3, byteOffset: t4.valuesByteOffset } });
          }
          return { buffers: n2, byteLength: s3 };
        }
        const g2 = /* @__PURE__ */ new Map();
        for (const e3 of t2.getGraph().listEdges()) {
          if (e3.getParent() === s2) continue;
          const t3 = e3.getChild();
          if (t3 instanceof q) {
            const r2 = g2.get(t3) || [];
            r2.push(e3), g2.set(t3, r2);
          }
        }
        if (i2.accessors = [], i2.bufferViews = [], i2.samplers = [], i2.textures = [], i2.images = s2.listTextures().map((t3, e3) => {
          const r2 = u2.createPropertyDef(t3);
          t3.getMimeType() && (r2.mimeType = t3.getMimeType());
          const n2 = t3.getImage();
          return n2 && u2.createImageData(r2, n2, t3), u2.imageIndexMap.set(t3, e3), r2;
        }), f2.filter((t3) => t3.prewriteTypes.includes(exports2.PropertyType.ACCESSOR)).forEach((t3) => t3.prewrite(u2, exports2.PropertyType.ACCESSOR)), s2.listAccessors().forEach((t3) => {
          const e3 = u2.accessorUsageGroupedByParent, r2 = u2.accessorParents;
          if (u2.accessorIndexMap.has(t3)) return;
          const n2 = g2.get(t3) || [], s3 = u2.getAccessorUsage(t3);
          if (u2.addAccessorToUsageGroup(t3, s3), e3.has(s3)) {
            const e4 = n2[0].getParent(), s4 = r2.get(e4) || /* @__PURE__ */ new Set();
            s4.add(t3), r2.set(e4, s4);
          }
        }), f2.filter((t3) => t3.prewriteTypes.includes(exports2.PropertyType.BUFFER)).forEach((t3) => t3.prewrite(u2, exports2.PropertyType.BUFFER)), (s2.listAccessors().length > 0 || s2.listTextures().length > 0 || u2.otherBufferViews.size > 0) && 0 === s2.listBuffers().length) throw new Error("Buffer required for Document resources, but none was found.");
        i2.buffers = [], s2.listBuffers().forEach((t3, r2) => {
          const s3 = u2.createPropertyDef(t3), a3 = u2.accessorUsageGroupedByParent, c2 = u2.accessorParents, h3 = t3.listParents().filter((t4) => t4 instanceof q), f3 = new Set(h3), l3 = [], g3 = i2.buffers.length;
          let v3 = 0;
          const w2 = u2.listAccessorUsageGroups();
          for (const t4 in w2) if (a3.has(t4)) for (const r3 of Array.from(c2.values())) {
            const n2 = Array.from(r3).filter((t5) => f3.has(t5)).filter((e3) => u2.getAccessorUsage(e3) === t4);
            if (n2.length) if (t4 !== Mt.ARRAY_BUFFER || e2.vertexLayout === exports2.VertexLayout.INTERLEAVED) {
              const e3 = t4 === Mt.ARRAY_BUFFER ? p2(n2, g3, v3) : d2(n2, g3, v3);
              v3 += e3.byteLength, l3.push(...e3.buffers);
            } else for (const t5 of n2) {
              const e3 = p2([t5], g3, v3);
              v3 += e3.byteLength, l3.push(...e3.buffers);
            }
          }
          else {
            const e3 = w2[t4].filter((t5) => f3.has(t5));
            if (!e3.length) continue;
            const r3 = t4 === Mt.ELEMENT_ARRAY_BUFFER ? Et.BufferViewTarget.ELEMENT_ARRAY_BUFFER : void 0, n2 = t4 === Mt.SPARSE ? m2(e3, g3, v3) : d2(e3, g3, v3, r3);
            v3 += n2.byteLength, l3.push(...n2.buffers);
          }
          if (u2.imageBufferViews.length && 0 === r2) {
            for (let t4 = 0; t4 < u2.imageBufferViews.length; t4++) if (i2.bufferViews[i2.images[t4].bufferView].byteOffset = v3, v3 += u2.imageBufferViews[t4].byteLength, l3.push(u2.imageBufferViews[t4]), v3 % 8) {
              const t5 = 8 - v3 % 8;
              v3 += t5, l3.push(new Uint8Array(t5));
            }
          }
          if (u2.otherBufferViews.has(t3)) for (const e3 of u2.otherBufferViews.get(t3)) i2.bufferViews.push({ buffer: g3, byteOffset: v3, byteLength: e3.byteLength }), u2.otherBufferViewsIndexMap.set(e3, i2.bufferViews.length - 1), v3 += e3.byteLength, l3.push(e3);
          if (v3) {
            let r3;
            e2.format === exports2.Format.GLB ? r3 = n : (r3 = u2.bufferURIGenerator.createURI(t3, "bin"), s3.uri = r3), s3.byteLength = v3, o2.resources[r3] = x.concat(l3);
          }
          i2.buffers.push(s3), u2.bufferIndexMap.set(t3, r2);
        }), s2.listAccessors().find((t3) => !t3.getBuffer()) && a2.warn("Skipped writing one or more Accessors: no Buffer assigned."), i2.materials = s2.listMaterials().map((t3, e3) => {
          const r2 = u2.createPropertyDef(t3);
          if (t3.getAlphaMode() !== st.AlphaMode.OPAQUE && (r2.alphaMode = t3.getAlphaMode()), t3.getAlphaMode() === st.AlphaMode.MASK && (r2.alphaCutoff = t3.getAlphaCutoff()), t3.getDoubleSided() && (r2.doubleSided = true), r2.pbrMetallicRoughness = {}, N.eq(t3.getBaseColorFactor(), [1, 1, 1, 1]) || (r2.pbrMetallicRoughness.baseColorFactor = t3.getBaseColorFactor()), N.eq(t3.getEmissiveFactor(), [0, 0, 0]) || (r2.emissiveFactor = t3.getEmissiveFactor()), 1 !== t3.getRoughnessFactor() && (r2.pbrMetallicRoughness.roughnessFactor = t3.getRoughnessFactor()), 1 !== t3.getMetallicFactor() && (r2.pbrMetallicRoughness.metallicFactor = t3.getMetallicFactor()), t3.getBaseColorTexture()) {
            const e4 = t3.getBaseColorTexture(), n2 = t3.getBaseColorTextureInfo();
            r2.pbrMetallicRoughness.baseColorTexture = u2.createTextureInfoDef(e4, n2);
          }
          if (t3.getEmissiveTexture()) {
            const e4 = t3.getEmissiveTexture(), n2 = t3.getEmissiveTextureInfo();
            r2.emissiveTexture = u2.createTextureInfoDef(e4, n2);
          }
          if (t3.getNormalTexture()) {
            const e4 = t3.getNormalTexture(), n2 = t3.getNormalTextureInfo(), s3 = u2.createTextureInfoDef(e4, n2);
            1 !== t3.getNormalScale() && (s3.scale = t3.getNormalScale()), r2.normalTexture = s3;
          }
          if (t3.getOcclusionTexture()) {
            const e4 = t3.getOcclusionTexture(), n2 = t3.getOcclusionTextureInfo(), s3 = u2.createTextureInfoDef(e4, n2);
            1 !== t3.getOcclusionStrength() && (s3.strength = t3.getOcclusionStrength()), r2.occlusionTexture = s3;
          }
          if (t3.getMetallicRoughnessTexture()) {
            const e4 = t3.getMetallicRoughnessTexture(), n2 = t3.getMetallicRoughnessTextureInfo();
            r2.pbrMetallicRoughness.metallicRoughnessTexture = u2.createTextureInfoDef(e4, n2);
          }
          return u2.materialIndexMap.set(t3, e3), r2;
        }), i2.meshes = s2.listMeshes().map((t3, e3) => {
          const r2 = u2.createPropertyDef(t3);
          let n2 = null;
          return r2.primitives = t3.listPrimitives().map((t4) => {
            const e4 = { attributes: {} };
            e4.mode = t4.getMode();
            const r3 = t4.getMaterial();
            r3 && (e4.material = u2.materialIndexMap.get(r3)), Object.keys(t4.getExtras()).length && (e4.extras = t4.getExtras());
            const s3 = t4.getIndices();
            s3 && (e4.indices = u2.accessorIndexMap.get(s3));
            for (const r4 of t4.listSemantics()) e4.attributes[r4] = u2.accessorIndexMap.get(t4.getAttribute(r4));
            for (const r4 of t4.listTargets()) {
              const t5 = {};
              for (const e5 of r4.listSemantics()) t5[e5] = u2.accessorIndexMap.get(r4.getAttribute(e5));
              e4.targets = e4.targets || [], e4.targets.push(t5);
            }
            return t4.listTargets().length && !n2 && (n2 = t4.listTargets().map((t5) => t5.getName())), e4;
          }), t3.getWeights().length && (r2.weights = t3.getWeights()), n2 && (r2.extras = r2.extras || {}, r2.extras.targetNames = n2), u2.meshIndexMap.set(t3, e3), r2;
        }), i2.cameras = s2.listCameras().map((t3, e3) => {
          const r2 = u2.createPropertyDef(t3);
          if (r2.type = t3.getType(), r2.type === K.Type.PERSPECTIVE) {
            r2.perspective = { znear: t3.getZNear(), zfar: t3.getZFar(), yfov: t3.getYFov() };
            const e4 = t3.getAspectRatio();
            null !== e4 && (r2.perspective.aspectRatio = e4);
          } else r2.orthographic = { znear: t3.getZNear(), zfar: t3.getZFar(), xmag: t3.getXMag(), ymag: t3.getYMag() };
          return u2.cameraIndexMap.set(t3, e3), r2;
        }), i2.nodes = s2.listNodes().map((t3, e3) => {
          const r2 = u2.createPropertyDef(t3);
          return N.eq(t3.getTranslation(), [0, 0, 0]) || (r2.translation = t3.getTranslation()), N.eq(t3.getRotation(), [0, 0, 0, 1]) || (r2.rotation = t3.getRotation()), N.eq(t3.getScale(), [1, 1, 1]) || (r2.scale = t3.getScale()), t3.getWeights().length && (r2.weights = t3.getWeights()), u2.nodeIndexMap.set(t3, e3), r2;
        }), i2.skins = s2.listSkins().map((t3, e3) => {
          const r2 = u2.createPropertyDef(t3), n2 = t3.getInverseBindMatrices();
          n2 && (r2.inverseBindMatrices = u2.accessorIndexMap.get(n2));
          const s3 = t3.getSkeleton();
          return s3 && (r2.skeleton = u2.nodeIndexMap.get(s3)), r2.joints = t3.listJoints().map((t4) => u2.nodeIndexMap.get(t4)), u2.skinIndexMap.set(t3, e3), r2;
        }), s2.listNodes().forEach((t3, e3) => {
          const r2 = i2.nodes[e3], n2 = t3.getMesh();
          n2 && (r2.mesh = u2.meshIndexMap.get(n2));
          const s3 = t3.getCamera();
          s3 && (r2.camera = u2.cameraIndexMap.get(s3));
          const o3 = t3.getSkin();
          o3 && (r2.skin = u2.skinIndexMap.get(o3)), t3.listChildren().length > 0 && (r2.children = t3.listChildren().map((t4) => u2.nodeIndexMap.get(t4)));
        }), i2.animations = s2.listAnimations().map((t3, e3) => {
          const r2 = u2.createPropertyDef(t3), n2 = /* @__PURE__ */ new Map();
          return r2.samplers = t3.listSamplers().map((t4, e4) => {
            const r3 = u2.createPropertyDef(t4);
            return r3.input = u2.accessorIndexMap.get(t4.getInput()), r3.output = u2.accessorIndexMap.get(t4.getOutput()), r3.interpolation = t4.getInterpolation(), n2.set(t4, e4), r3;
          }), r2.channels = t3.listChannels().map((t4) => {
            const e4 = u2.createPropertyDef(t4);
            return e4.sampler = n2.get(t4.getSampler()), e4.target = { node: u2.nodeIndexMap.get(t4.getTargetNode()), path: t4.getTargetPath() }, e4;
          }), u2.animationIndexMap.set(t3, e3), r2;
        }), i2.scenes = s2.listScenes().map((t3, e3) => {
          const r2 = u2.createPropertyDef(t3);
          return r2.nodes = t3.listChildren().map((t4) => u2.nodeIndexMap.get(t4)), u2.sceneIndexMap.set(t3, e3), r2;
        });
        const v2 = s2.getDefaultScene();
        return v2 && (i2.scene = s2.listScenes().indexOf(v2)), i2.extensionsUsed = f2.map((t3) => t3.extensionName), i2.extensionsRequired = l2.map((t3) => t3.extensionName), f2.forEach((t3) => t3.write(u2)), (function(t3) {
          const e3 = [];
          for (const r2 in t3) {
            const n2 = t3[r2];
            (Array.isArray(n2) && 0 === n2.length || null === n2 || "" === n2 || n2 && "object" == typeof n2 && 0 === Object.keys(n2).length) && e3.push(r2);
          }
          for (const r2 of e3) delete t3[r2];
        })(i2), o2;
      }
    };
    var Ot;
    !(function(t2) {
      t2[t2.JSON = 1313821514] = "JSON", t2[t2.BIN = 5130562] = "BIN";
    })(Ot || (Ot = {}));
    var Ct = class {
      constructor() {
        this.N = P.DEFAULT_INSTANCE, this.m = /* @__PURE__ */ new Set(), this.L = {}, this.D = exports2.VertexLayout.INTERLEAVED, this.lastReadBytes = 0, this.lastWriteBytes = 0;
      }
      setLogger(t2) {
        return this.N = t2, this;
      }
      registerExtensions(t2) {
        for (const e2 of t2) this.m.add(e2), e2.register();
        return this;
      }
      registerDependencies(t2) {
        return Object.assign(this.L, t2), this;
      }
      setVertexLayout(t2) {
        return this.D = t2, this;
      }
      read(t2) {
        try {
          const e2 = this, r2 = e2.readJSON;
          return Promise.resolve(e2.readAsJSON(t2)).then(function(t3) {
            return Promise.resolve(r2.call(e2, t3));
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      readAsJSON(t2) {
        try {
          const e2 = this;
          return Promise.resolve(e2.readURI(t2, "view")).then(function(r2) {
            e2.lastReadBytes = r2.byteLength;
            const n2 = Ft(r2) ? e2._(r2) : { json: JSON.parse(x.decodeText(r2)), resources: {} };
            return Promise.resolve(e2.k(n2, e2.dirname(t2))).then(function() {
              return e2.J(n2), n2;
            });
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      readJSON(t2) {
        try {
          const e2 = this;
          return t2 = e2.$(t2), e2.J(t2), Promise.resolve(bt.read(t2, { extensions: Array.from(e2.m), dependencies: e2.L, logger: e2.N }));
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      binaryToJSON(t2) {
        try {
          const e2 = this, r2 = e2._(x.assertView(t2));
          e2.J(r2);
          const n2 = r2.json;
          if (n2.buffers && n2.buffers.some((t3) => (function(t4, e3) {
            return void 0 !== e3.uri && !(e3.uri in t4.resources);
          })(r2, t3))) throw new Error("Cannot resolve external buffers with binaryToJSON().");
          if (n2.images && n2.images.some((t3) => (function(t4, e3) {
            return void 0 !== e3.uri && !(e3.uri in t4.resources) && void 0 === e3.bufferView;
          })(r2, t3))) throw new Error("Cannot resolve external images with binaryToJSON().");
          return Promise.resolve(r2);
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      readBinary(t2) {
        try {
          const e2 = this, r2 = e2.readJSON;
          return Promise.resolve(e2.binaryToJSON(x.assertView(t2))).then(function(t3) {
            return r2.call(e2, t3);
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      writeJSON(t2, e2) {
        void 0 === e2 && (e2 = {});
        try {
          const r2 = this;
          if (e2.format === exports2.Format.GLB && t2.getRoot().listBuffers().length > 1) throw new Error("GLB must have 0\u20131 buffers.");
          return Promise.resolve(Nt.write(t2, { format: e2.format || exports2.Format.GLTF, basename: e2.basename || "", logger: r2.N, vertexLayout: r2.D, dependencies: { ...r2.L }, extensions: Array.from(r2.m) }));
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      writeBinary(t2) {
        try {
          return Promise.resolve(this.writeJSON(t2, { format: exports2.Format.GLB })).then(function(t3) {
            let { json: e2, resources: r2 } = t3;
            const n2 = new Uint32Array([1179937895, 2, 12]), s2 = JSON.stringify(e2), i2 = x.pad(x.encodeText(s2), 32), o2 = x.toView(new Uint32Array([i2.byteLength, 1313821514])), u2 = x.concat([o2, i2]);
            n2[n2.length - 1] += u2.byteLength;
            const a2 = Object.values(r2)[0];
            if (!a2 || !a2.byteLength) return x.concat([x.toView(n2), u2]);
            const c2 = x.pad(a2, 0), h2 = x.toView(new Uint32Array([c2.byteLength, 5130562])), f2 = x.concat([h2, c2]);
            return n2[n2.length - 1] += f2.byteLength, x.concat([x.toView(n2), u2, f2]);
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      k(t2, e2) {
        try {
          const r2 = this, n2 = [...t2.json.images || [], ...t2.json.buffers || []].map(function(n3) {
            try {
              const s2 = n3.uri;
              return !s2 || s2.match(/data:/) ? Promise.resolve() : Promise.resolve(r2.readURI(r2.resolve(e2, s2), "view")).then(function(e3) {
                t2.resources[s2] = e3, r2.lastReadBytes += t2.resources[s2].byteLength;
              });
            } catch (t3) {
              return Promise.reject(t3);
            }
          });
          return Promise.resolve(Promise.all(n2)).then(function() {
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      J(t2) {
        function e2(e3) {
          if (e3.uri) {
            if (e3.uri in t2.resources) x.assertView(t2.resources[e3.uri]);
            else if (e3.uri.match(/data:/)) {
              const r2 = `__${_()}.${A.extension(e3.uri)}`;
              t2.resources[r2] = x.createBufferFromDataURI(e3.uri), e3.uri = r2;
            }
          }
        }
        (t2.json.images || []).forEach((t3) => {
          if (void 0 === t3.bufferView && void 0 === t3.uri) throw new Error("Missing resource URI or buffer view.");
          e2(t3);
        }), (t2.json.buffers || []).forEach(e2);
      }
      $(t2) {
        const { images: e2, buffers: r2 } = t2.json;
        return t2 = { json: { ...t2.json }, resources: { ...t2.resources } }, e2 && (t2.json.images = e2.map((t3) => ({ ...t3 }))), r2 && (t2.json.buffers = r2.map((t3) => ({ ...t3 }))), t2;
      }
      _(t2) {
        if (!Ft(t2)) throw new Error("Invalid glTF 2.0 binary.");
        const e2 = new Uint32Array(t2.buffer, t2.byteOffset + 12, 2);
        if (e2[1] !== Ot.JSON) throw new Error("Missing required GLB JSON chunk.");
        const r2 = e2[0], s2 = x.decodeText(x.toView(t2, 20, r2)), i2 = JSON.parse(s2), o2 = 20 + r2;
        if (t2.byteLength <= o2) return { json: i2, resources: {} };
        const u2 = new Uint32Array(t2.buffer, t2.byteOffset + o2, 2);
        if (u2[1] !== Ot.BIN) throw new Error("Expected GLB BIN in second chunk.");
        const a2 = x.toView(t2, o2 + 8, u2[0]);
        return { json: i2, resources: { [n]: a2 } };
      }
    };
    function Ft(t2) {
      if (t2.byteLength < 3 * Uint32Array.BYTES_PER_ELEMENT) return false;
      const e2 = new Uint32Array(t2.buffer, t2.byteOffset, 3);
      return 1179937895 === e2[0] && 2 === e2[1];
    }
    function Ut(t2, e2, r2) {
      if (!t2.s) {
        if (r2 instanceof Bt) {
          if (!r2.s) return void (r2.o = Ut.bind(null, t2, e2));
          1 & e2 && (e2 = r2.s), r2 = r2.v;
        }
        if (r2 && r2.then) return void r2.then(Ut.bind(null, t2, e2), Ut.bind(null, t2, 2));
        t2.s = e2, t2.v = r2;
        const n2 = t2.o;
        n2 && n2(t2);
      }
    }
    var Bt = /* @__PURE__ */ (function() {
      function t2() {
      }
      return t2.prototype.then = function(e2, r2) {
        const n2 = new t2(), s2 = this.s;
        if (s2) {
          const t3 = 1 & s2 ? e2 : r2;
          if (t3) {
            try {
              Ut(n2, 1, t3(this.v));
            } catch (t4) {
              Ut(n2, 2, t4);
            }
            return n2;
          }
          return this;
        }
        return this.o = function(t3) {
          try {
            const s3 = t3.v;
            1 & t3.s ? Ut(n2, 1, e2 ? e2(s3) : s3) : r2 ? Ut(n2, 1, r2(s3)) : Ut(n2, 2, s3);
          } catch (t4) {
            Ut(n2, 2, t4);
          }
        }, n2;
      }, t2;
    })();
    function jt(t2, e2, r2) {
      if (!t2.s) {
        if (r2 instanceof Lt) {
          if (!r2.s) return void (r2.o = jt.bind(null, t2, e2));
          1 & e2 && (e2 = r2.s), r2 = r2.v;
        }
        if (r2 && r2.then) return void r2.then(jt.bind(null, t2, e2), jt.bind(null, t2, 2));
        t2.s = e2, t2.v = r2;
        const n2 = t2.o;
        n2 && n2(t2);
      }
    }
    var Lt = /* @__PURE__ */ (function() {
      function t2() {
      }
      return t2.prototype.then = function(e2, r2) {
        const n2 = new t2(), s2 = this.s;
        if (s2) {
          const t3 = 1 & s2 ? e2 : r2;
          if (t3) {
            try {
              jt(n2, 1, t3(this.v));
            } catch (t4) {
              jt(n2, 2, t4);
            }
            return n2;
          }
          return this;
        }
        return this.o = function(t3) {
          try {
            const s3 = t3.v;
            1 & t3.s ? jt(n2, 1, e2 ? e2(s3) : s3) : r2 ? jt(n2, 1, r2(s3)) : jt(n2, 2, s3);
          } catch (t4) {
            jt(n2, 2, t4);
          }
        }, n2;
      }, t2;
    })();
    Object.defineProperty(exports2, "Graph", { enumerable: true, get: function() {
      return t.Graph;
    } }), Object.defineProperty(exports2, "GraphEdge", { enumerable: true, get: function() {
      return t.GraphEdge;
    } }), exports2.Accessor = q, exports2.Animation = W, exports2.AnimationChannel = H, exports2.AnimationSampler = Y, exports2.Buffer = Z, exports2.BufferUtils = x, exports2.COPY_IDENTITY = G, exports2.Camera = K, exports2.ColorUtils = w, exports2.ComponentTypeToTypedArray = c, exports2.DenoIO = class extends Ct {
      constructor(t2) {
        super(), this.V = void 0, this.V = t2;
      }
      readURI(t2, e2) {
        try {
          switch (e2) {
            case "view":
              return Promise.resolve(Deno.readFile(t2));
            case "text":
              return Promise.resolve(Deno.readTextFile(t2));
          }
          return Promise.resolve();
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      resolve(t2, e2) {
        return this.V.resolve(t2, decodeURIComponent(e2));
      }
      dirname(t2) {
        return this.V.dirname(t2);
      }
    }, exports2.Document = vt, exports2.ExtensibleProperty = V, exports2.Extension = xt, exports2.ExtensionProperty = Q, exports2.FileUtils = A, exports2.GLB_BUFFER = n, exports2.HTTPUtils = z, exports2.ImageUtils = b, exports2.Logger = P, exports2.Material = st, exports2.MathUtils = N, exports2.Mesh = it, exports2.Node = ot, exports2.NodeIO = class extends Ct {
      constructor(t2, e2) {
        void 0 === t2 && (t2 = null), void 0 === e2 && (e2 = z.DEFAULT_INIT), super(), this.q = void 0, this.W = void 0, this.H = void 0, this.Y = false, this.q = t2, this.W = e2, this.H = this.init();
      }
      init() {
        try {
          const t2 = this;
          return t2.H ? Promise.resolve(t2.H) : Promise.all([Promise.resolve().then(function() {
            return e(require("fs"));
          }), Promise.resolve().then(function() {
            return e(require("path"));
          })]).then((e2) => {
            let [r2, n2] = e2;
            t2.Z = r2.promises, t2.V = n2;
          });
        } catch (t2) {
          return Promise.reject(t2);
        }
      }
      setAllowHTTP(t2) {
        if (t2 && !this.q) throw new Error("NodeIO requires a Fetch API implementation for HTTP requests.");
        return this.Y = t2, this;
      }
      readURI(t2, e2) {
        try {
          const r2 = this;
          return Promise.resolve(r2.init()).then(function() {
            return (function() {
              if (z.isAbsoluteURL(t2)) {
                if (!r2.Y || !r2.q) throw new Error("Network request blocked. Allow HTTP requests explicitly, if needed.");
                return Promise.resolve(r2.q(t2, r2.W)).then(function(t3) {
                  return (function(t4, e3) {
                    var r3, n2 = -1;
                    t: {
                      for (var s2 = 0; s2 < e3.length; s2++) {
                        var i2 = e3[s2][0];
                        if (i2) {
                          var o2 = i2();
                          if (o2 && o2.then) break t;
                          if (o2 === t4) {
                            n2 = s2;
                            break;
                          }
                        } else n2 = s2;
                      }
                      if (-1 !== n2) {
                        do {
                          for (var u2 = e3[n2][1]; !u2; ) n2++, u2 = e3[n2][1];
                          var a2 = u2();
                          if (a2 && a2.then) {
                            r3 = true;
                            break t;
                          }
                          var c2 = e3[n2][2];
                          n2++;
                        } while (c2 && !c2());
                        return a2;
                      }
                    }
                    const h2 = new Bt(), f2 = Ut.bind(null, h2, 2);
                    return (r3 ? a2.then(l2) : o2.then(function r4(o3) {
                      for (; ; ) {
                        if (o3 === t4) {
                          n2 = s2;
                          break;
                        }
                        if (++s2 === e3.length) {
                          if (-1 !== n2) break;
                          return void Ut(h2, 1, a3);
                        }
                        if (i2 = e3[s2][0]) {
                          if ((o3 = i2()) && o3.then) return void o3.then(r4).then(void 0, f2);
                        } else n2 = s2;
                      }
                      do {
                        for (var u3 = e3[n2][1]; !u3; ) n2++, u3 = e3[n2][1];
                        var a3 = u3();
                        if (a3 && a3.then) return void a3.then(l2).then(void 0, f2);
                        var c3 = e3[n2][2];
                        n2++;
                      } while (c3 && !c3());
                      Ut(h2, 1, a3);
                    })).then(void 0, f2), h2;
                    function l2(t5) {
                      for (; ; ) {
                        var r4 = e3[n2][2];
                        if (!r4 || r4()) break;
                        n2++;
                        for (var s3 = e3[n2][1]; !s3; ) n2++, s3 = e3[n2][1];
                        if ((t5 = s3()) && t5.then) return void t5.then(l2).then(void 0, f2);
                      }
                      Ut(h2, 1, t5);
                    }
                  })(e2, [[function() {
                    return "view";
                  }, function() {
                    return Promise.resolve(t3.arrayBuffer()).then(function(t4) {
                      return new Uint8Array(t4);
                    });
                  }], [function() {
                    return "text";
                  }, function() {
                    return t3.text();
                  }]]);
                });
              }
              switch (e2) {
                case "view":
                  return r2.Z.readFile(t2);
                case "text":
                  return r2.Z.readFile(t2, "utf8");
              }
            })();
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      resolve(t2, e2) {
        return z.isAbsoluteURL(t2) || z.isAbsoluteURL(e2) ? z.resolve(t2, e2) : this.V.resolve(t2, decodeURIComponent(e2));
      }
      dirname(t2) {
        return z.isAbsoluteURL(t2) ? z.dirname(t2) : this.V.dirname(t2);
      }
      write(t2, e2) {
        try {
          const r2 = this;
          return Promise.resolve(r2.init()).then(function() {
            const n2 = !!t2.match(/\.glb$/);
            return Promise.resolve(n2 ? r2.K(t2, e2) : r2.X(t2, e2)).then(function() {
            });
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      X(t2, e2) {
        try {
          const r2 = this;
          return r2.lastWriteBytes = 0, Promise.resolve(r2.writeJSON(e2, { format: exports2.Format.GLTF, basename: A.basename(t2) })).then(function(e3) {
            let { json: n2, resources: s2 } = e3;
            const { Z: i2, V: o2 } = r2, u2 = o2.dirname(t2), a2 = JSON.stringify(n2, null, 2);
            return r2.lastWriteBytes += a2.length, Promise.resolve(i2.writeFile(t2, a2)).then(function() {
              const t3 = Object.keys(s2).map(function(t4) {
                try {
                  if (z.isAbsoluteURL(t4)) {
                    if ("bin" === z.extension(t4)) throw new Error(`Cannot write buffer to path "${t4}".`);
                    return Promise.resolve();
                  }
                  const e4 = Buffer.from(s2[t4]), n3 = o2.join(u2, decodeURIComponent(t4));
                  return Promise.resolve(i2.mkdir(o2.dirname(n3), { recursive: true })).then(function() {
                    return Promise.resolve(i2.writeFile(n3, e4)).then(function() {
                      r2.lastWriteBytes += e4.byteLength;
                    });
                  });
                } catch (t5) {
                  return Promise.reject(t5);
                }
              });
              return Promise.resolve(Promise.all(t3)).then(function() {
              });
            });
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      K(t2, e2) {
        try {
          const r2 = this, n2 = Buffer, s2 = n2.from;
          return Promise.resolve(r2.writeBinary(e2)).then(function(e3) {
            const i2 = s2.call(n2, e3);
            return Promise.resolve(r2.Z.writeFile(t2, i2)).then(function() {
              r2.lastWriteBytes = i2.byteLength;
            });
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
    }, exports2.PlatformIO = Ct, exports2.Primitive = ut, exports2.PrimitiveTarget = at, exports2.Property = $, exports2.ReaderContext = wt, exports2.Root = lt, exports2.Scene = ct, exports2.Skin = ht, exports2.Texture = ft, exports2.TextureInfo = X, exports2.VERSION = r, exports2.WebIO = class extends Ct {
      constructor(t2) {
        void 0 === t2 && (t2 = z.DEFAULT_INIT), super(), this.W = void 0, this.W = t2;
      }
      readURI(t2, e2) {
        try {
          return Promise.resolve(fetch(t2, this.W)).then(function(t3) {
            return (function(t4, e3) {
              var r2, n2 = -1;
              t: {
                for (var s2 = 0; s2 < e3.length; s2++) {
                  var i2 = e3[s2][0];
                  if (i2) {
                    var o2 = i2();
                    if (o2 && o2.then) break t;
                    if (o2 === t4) {
                      n2 = s2;
                      break;
                    }
                  } else n2 = s2;
                }
                if (-1 !== n2) {
                  do {
                    for (var u2 = e3[n2][1]; !u2; ) n2++, u2 = e3[n2][1];
                    var a2 = u2();
                    if (a2 && a2.then) {
                      r2 = true;
                      break t;
                    }
                    var c2 = e3[n2][2];
                    n2++;
                  } while (c2 && !c2());
                  return a2;
                }
              }
              const h2 = new Lt(), f2 = jt.bind(null, h2, 2);
              return (r2 ? a2.then(l2) : o2.then(function r3(o3) {
                for (; ; ) {
                  if (o3 === t4) {
                    n2 = s2;
                    break;
                  }
                  if (++s2 === e3.length) {
                    if (-1 !== n2) break;
                    return void jt(h2, 1, a3);
                  }
                  if (i2 = e3[s2][0]) {
                    if ((o3 = i2()) && o3.then) return void o3.then(r3).then(void 0, f2);
                  } else n2 = s2;
                }
                do {
                  for (var u3 = e3[n2][1]; !u3; ) n2++, u3 = e3[n2][1];
                  var a3 = u3();
                  if (a3 && a3.then) return void a3.then(l2).then(void 0, f2);
                  var c3 = e3[n2][2];
                  n2++;
                } while (c3 && !c3());
                jt(h2, 1, a3);
              })).then(void 0, f2), h2;
              function l2(t5) {
                for (; ; ) {
                  var r3 = e3[n2][2];
                  if (!r3 || r3()) break;
                  n2++;
                  for (var s3 = e3[n2][1]; !s3; ) n2++, s3 = e3[n2][1];
                  if ((t5 = s3()) && t5.then) return void t5.then(l2).then(void 0, f2);
                }
                jt(h2, 1, t5);
              }
            })(e2, [[function() {
              return "view";
            }, function() {
              return Promise.resolve(t3.arrayBuffer()).then(function(t4) {
                return new Uint8Array(t4);
              });
            }], [function() {
              return "text";
            }, function() {
              return t3.text();
            }]]);
          });
        } catch (t3) {
          return Promise.reject(t3);
        }
      }
      resolve(t2, e2) {
        return z.resolve(t2, e2);
      }
      dirname(t2) {
        return z.dirname(t2);
      }
    }, exports2.WriterContext = Et, exports2.bounds = m, exports2.getBounds = p, exports2.uuid = _;
  }
});

// node_modules/iota-array/iota.js
var require_iota = __commonJS({
  "node_modules/iota-array/iota.js"(exports2, module2) {
    "use strict";
    function iota(n) {
      var result = new Array(n);
      for (var i = 0; i < n; ++i) {
        result[i] = i;
      }
      return result;
    }
    module2.exports = iota;
  }
});

// node_modules/is-buffer/index.js
var require_is_buffer = __commonJS({
  "node_modules/is-buffer/index.js"(exports2, module2) {
    module2.exports = function(obj) {
      return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
    };
    function isBuffer(obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    }
    function isSlowBuffer(obj) {
      return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
    }
  }
});

// node_modules/ndarray/ndarray.js
var require_ndarray = __commonJS({
  "node_modules/ndarray/ndarray.js"(exports2, module2) {
    var iota = require_iota();
    var isBuffer = require_is_buffer();
    var hasTypedArrays = typeof Float64Array !== "undefined";
    function compare1st(a, b) {
      return a[0] - b[0];
    }
    function order() {
      var stride = this.stride;
      var terms = new Array(stride.length);
      var i;
      for (i = 0; i < terms.length; ++i) {
        terms[i] = [Math.abs(stride[i]), i];
      }
      terms.sort(compare1st);
      var result = new Array(terms.length);
      for (i = 0; i < result.length; ++i) {
        result[i] = terms[i][1];
      }
      return result;
    }
    function compileConstructor(dtype, dimension) {
      var className = ["View", dimension, "d", dtype].join("");
      if (dimension < 0) {
        className = "View_Nil" + dtype;
      }
      var useGetters = dtype === "generic";
      if (dimension === -1) {
        var code = "function " + className + "(a){this.data=a;};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return -1};proto.size=0;proto.dimension=-1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function(){return new " + className + "(this.data);};proto.get=proto.set=function(){};proto.pick=function(){return null};return function construct_" + className + "(a){return new " + className + "(a);}";
        var procedure = new Function(code);
        return procedure();
      } else if (dimension === 0) {
        var code = "function " + className + "(a,d) {this.data = a;this.offset = d};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return this.offset};proto.dimension=0;proto.size=1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function " + className + "_copy() {return new " + className + "(this.data,this.offset)};proto.pick=function " + className + "_pick(){return TrivialArray(this.data);};proto.valueOf=proto.get=function " + className + "_get(){return " + (useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]") + "};proto.set=function " + className + "_set(v){return " + (useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v") + "};return function construct_" + className + "(a,b,c,d){return new " + className + "(a,d)}";
        var procedure = new Function("TrivialArray", code);
        return procedure(CACHED_CONSTRUCTORS[dtype][0]);
      }
      var code = ["'use strict'"];
      var indices = iota(dimension);
      var args = indices.map(function(i2) {
        return "i" + i2;
      });
      var index_str = "this.offset+" + indices.map(function(i2) {
        return "this.stride[" + i2 + "]*i" + i2;
      }).join("+");
      var shapeArg = indices.map(function(i2) {
        return "b" + i2;
      }).join(",");
      var strideArg = indices.map(function(i2) {
        return "c" + i2;
      }).join(",");
      code.push(
        "function " + className + "(a," + shapeArg + "," + strideArg + ",d){this.data=a",
        "this.shape=[" + shapeArg + "]",
        "this.stride=[" + strideArg + "]",
        "this.offset=d|0}",
        "var proto=" + className + ".prototype",
        "proto.dtype='" + dtype + "'",
        "proto.dimension=" + dimension
      );
      code.push(
        "Object.defineProperty(proto,'size',{get:function " + className + "_size(){return " + indices.map(function(i2) {
          return "this.shape[" + i2 + "]";
        }).join("*"),
        "}})"
      );
      if (dimension === 1) {
        code.push("proto.order=[0]");
      } else {
        code.push("Object.defineProperty(proto,'order',{get:");
        if (dimension < 4) {
          code.push("function " + className + "_order(){");
          if (dimension === 2) {
            code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})");
          } else if (dimension === 3) {
            code.push(
              "var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);if(s0>s1){if(s1>s2){return [2,1,0];}else if(s0>s2){return [1,2,0];}else{return [1,0,2];}}else if(s0>s2){return [2,0,1];}else if(s2>s1){return [0,1,2];}else{return [0,2,1];}}})"
            );
          }
        } else {
          code.push("ORDER})");
        }
      }
      code.push(
        "proto.set=function " + className + "_set(" + args.join(",") + ",v){"
      );
      if (useGetters) {
        code.push("return this.data.set(" + index_str + ",v)}");
      } else {
        code.push("return this.data[" + index_str + "]=v}");
      }
      code.push("proto.get=function " + className + "_get(" + args.join(",") + "){");
      if (useGetters) {
        code.push("return this.data.get(" + index_str + ")}");
      } else {
        code.push("return this.data[" + index_str + "]}");
      }
      code.push(
        "proto.index=function " + className + "_index(",
        args.join(),
        "){return " + index_str + "}"
      );
      code.push("proto.hi=function " + className + "_hi(" + args.join(",") + "){return new " + className + "(this.data," + indices.map(function(i2) {
        return ["(typeof i", i2, "!=='number'||i", i2, "<0)?this.shape[", i2, "]:i", i2, "|0"].join("");
      }).join(",") + "," + indices.map(function(i2) {
        return "this.stride[" + i2 + "]";
      }).join(",") + ",this.offset)}");
      var a_vars = indices.map(function(i2) {
        return "a" + i2 + "=this.shape[" + i2 + "]";
      });
      var c_vars = indices.map(function(i2) {
        return "c" + i2 + "=this.stride[" + i2 + "]";
      });
      code.push("proto.lo=function " + className + "_lo(" + args.join(",") + "){var b=this.offset,d=0," + a_vars.join(",") + "," + c_vars.join(","));
      for (var i = 0; i < dimension; ++i) {
        code.push(
          "if(typeof i" + i + "==='number'&&i" + i + ">=0){d=i" + i + "|0;b+=c" + i + "*d;a" + i + "-=d}"
        );
      }
      code.push("return new " + className + "(this.data," + indices.map(function(i2) {
        return "a" + i2;
      }).join(",") + "," + indices.map(function(i2) {
        return "c" + i2;
      }).join(",") + ",b)}");
      code.push("proto.step=function " + className + "_step(" + args.join(",") + "){var " + indices.map(function(i2) {
        return "a" + i2 + "=this.shape[" + i2 + "]";
      }).join(",") + "," + indices.map(function(i2) {
        return "b" + i2 + "=this.stride[" + i2 + "]";
      }).join(",") + ",c=this.offset,d=0,ceil=Math.ceil");
      for (var i = 0; i < dimension; ++i) {
        code.push(
          "if(typeof i" + i + "==='number'){d=i" + i + "|0;if(d<0){c+=b" + i + "*(a" + i + "-1);a" + i + "=ceil(-a" + i + "/d)}else{a" + i + "=ceil(a" + i + "/d)}b" + i + "*=d}"
        );
      }
      code.push("return new " + className + "(this.data," + indices.map(function(i2) {
        return "a" + i2;
      }).join(",") + "," + indices.map(function(i2) {
        return "b" + i2;
      }).join(",") + ",c)}");
      var tShape = new Array(dimension);
      var tStride = new Array(dimension);
      for (var i = 0; i < dimension; ++i) {
        tShape[i] = "a[i" + i + "]";
        tStride[i] = "b[i" + i + "]";
      }
      code.push(
        "proto.transpose=function " + className + "_transpose(" + args + "){" + args.map(function(n, idx) {
          return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)";
        }).join(";"),
        "var a=this.shape,b=this.stride;return new " + className + "(this.data," + tShape.join(",") + "," + tStride.join(",") + ",this.offset)}"
      );
      code.push("proto.pick=function " + className + "_pick(" + args + "){var a=[],b=[],c=this.offset");
      for (var i = 0; i < dimension; ++i) {
        code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){c=(c+this.stride[" + i + "]*i" + i + ")|0}else{a.push(this.shape[" + i + "]);b.push(this.stride[" + i + "])}");
      }
      code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}");
      code.push("return function construct_" + className + "(data,shape,stride,offset){return new " + className + "(data," + indices.map(function(i2) {
        return "shape[" + i2 + "]";
      }).join(",") + "," + indices.map(function(i2) {
        return "stride[" + i2 + "]";
      }).join(",") + ",offset)}");
      var procedure = new Function("CTOR_LIST", "ORDER", code.join("\n"));
      return procedure(CACHED_CONSTRUCTORS[dtype], order);
    }
    function arrayDType(data) {
      if (isBuffer(data)) {
        return "buffer";
      }
      if (hasTypedArrays) {
        switch (Object.prototype.toString.call(data)) {
          case "[object Float64Array]":
            return "float64";
          case "[object Float32Array]":
            return "float32";
          case "[object Int8Array]":
            return "int8";
          case "[object Int16Array]":
            return "int16";
          case "[object Int32Array]":
            return "int32";
          case "[object Uint8Array]":
            return "uint8";
          case "[object Uint16Array]":
            return "uint16";
          case "[object Uint32Array]":
            return "uint32";
          case "[object Uint8ClampedArray]":
            return "uint8_clamped";
          case "[object BigInt64Array]":
            return "bigint64";
          case "[object BigUint64Array]":
            return "biguint64";
        }
      }
      if (Array.isArray(data)) {
        return "array";
      }
      return "generic";
    }
    var CACHED_CONSTRUCTORS = {
      "float32": [],
      "float64": [],
      "int8": [],
      "int16": [],
      "int32": [],
      "uint8": [],
      "uint16": [],
      "uint32": [],
      "array": [],
      "uint8_clamped": [],
      "bigint64": [],
      "biguint64": [],
      "buffer": [],
      "generic": []
    };
    function wrappedNDArrayCtor(data, shape, stride, offset) {
      if (data === void 0) {
        var ctor = CACHED_CONSTRUCTORS.array[0];
        return ctor([]);
      } else if (typeof data === "number") {
        data = [data];
      }
      if (shape === void 0) {
        shape = [data.length];
      }
      var d = shape.length;
      if (stride === void 0) {
        stride = new Array(d);
        for (var i = d - 1, sz = 1; i >= 0; --i) {
          stride[i] = sz;
          sz *= shape[i];
        }
      }
      if (offset === void 0) {
        offset = 0;
        for (var i = 0; i < d; ++i) {
          if (stride[i] < 0) {
            offset -= (shape[i] - 1) * stride[i];
          }
        }
      }
      var dtype = arrayDType(data);
      var ctor_list = CACHED_CONSTRUCTORS[dtype];
      while (ctor_list.length <= d + 1) {
        ctor_list.push(compileConstructor(dtype, ctor_list.length - 1));
      }
      var ctor = ctor_list[d + 1];
      return ctor(data, shape, stride, offset);
    }
    module2.exports = wrappedNDArrayCtor;
  }
});

// node_modules/sharp/lib/is.js
var require_is = __commonJS({
  "node_modules/sharp/lib/is.js"(exports2, module2) {
    "use strict";
    var defined = function(val) {
      return typeof val !== "undefined" && val !== null;
    };
    var object = function(val) {
      return typeof val === "object";
    };
    var plainObject = function(val) {
      return Object.prototype.toString.call(val) === "[object Object]";
    };
    var fn = function(val) {
      return typeof val === "function";
    };
    var bool = function(val) {
      return typeof val === "boolean";
    };
    var buffer = function(val) {
      return val instanceof Buffer;
    };
    var typedArray = function(val) {
      if (defined(val)) {
        switch (val.constructor) {
          case Uint8Array:
          case Uint8ClampedArray:
          case Int8Array:
          case Uint16Array:
          case Int16Array:
          case Uint32Array:
          case Int32Array:
          case Float32Array:
          case Float64Array:
            return true;
        }
      }
      return false;
    };
    var arrayBuffer = function(val) {
      return val instanceof ArrayBuffer;
    };
    var string = function(val) {
      return typeof val === "string" && val.length > 0;
    };
    var number = function(val) {
      return typeof val === "number" && !Number.isNaN(val);
    };
    var integer = function(val) {
      return Number.isInteger(val);
    };
    var inRange = function(val, min, max) {
      return val >= min && val <= max;
    };
    var inArray = function(val, list) {
      return list.includes(val);
    };
    var invalidParameterError = function(name, expected, actual) {
      return new Error(
        `Expected ${expected} for ${name} but received ${actual} of type ${typeof actual}`
      );
    };
    module2.exports = {
      defined,
      object,
      plainObject,
      fn,
      bool,
      buffer,
      typedArray,
      arrayBuffer,
      string,
      number,
      integer,
      inRange,
      inArray,
      invalidParameterError
    };
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports2, module2) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module2.exports = debug;
  }
});

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/semver/internal/constants.js"(exports2, module2) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module2.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports2, module2) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports2 = module2.exports = {};
    var re = exports2.re = [];
    var safeRe = exports2.safeRe = [];
    var src = exports2.src = [];
    var safeSrc = exports2.safeSrc = [];
    var t = exports2.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports2, module2) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module2.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports2, module2) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/semver/classes/semver.js"(exports2, module2) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module2.exports = SemVer;
  }
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "node_modules/semver/functions/parse.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module2.exports = parse;
  }
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "node_modules/semver/functions/coerce.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module2.exports = coerce;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/semver/functions/compare.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module2.exports = compare;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/semver/functions/gte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module2.exports = gte;
  }
});

// node_modules/detect-libc/lib/process.js
var require_process = __commonJS({
  "node_modules/detect-libc/lib/process.js"(exports2, module2) {
    "use strict";
    var isLinux = () => process.platform === "linux";
    var report = null;
    var getReport = () => {
      if (!report) {
        if (isLinux() && process.report) {
          const orig = process.report.excludeNetwork;
          process.report.excludeNetwork = true;
          report = process.report.getReport();
          process.report.excludeNetwork = orig;
        } else {
          report = {};
        }
      }
      return report;
    };
    module2.exports = { isLinux, getReport };
  }
});

// node_modules/detect-libc/lib/filesystem.js
var require_filesystem = __commonJS({
  "node_modules/detect-libc/lib/filesystem.js"(exports2, module2) {
    "use strict";
    var fs2 = require("fs");
    var LDD_PATH = "/usr/bin/ldd";
    var SELF_PATH = "/proc/self/exe";
    var MAX_LENGTH = 2048;
    var readFileSync = (path2) => {
      const fd = fs2.openSync(path2, "r");
      const buffer = Buffer.alloc(MAX_LENGTH);
      const bytesRead = fs2.readSync(fd, buffer, 0, MAX_LENGTH, 0);
      fs2.close(fd, () => {
      });
      return buffer.subarray(0, bytesRead);
    };
    var readFile = (path2) => new Promise((resolve, reject) => {
      fs2.open(path2, "r", (err, fd) => {
        if (err) {
          reject(err);
        } else {
          const buffer = Buffer.alloc(MAX_LENGTH);
          fs2.read(fd, buffer, 0, MAX_LENGTH, 0, (_, bytesRead) => {
            resolve(buffer.subarray(0, bytesRead));
            fs2.close(fd, () => {
            });
          });
        }
      });
    });
    module2.exports = {
      LDD_PATH,
      SELF_PATH,
      readFileSync,
      readFile
    };
  }
});

// node_modules/detect-libc/lib/elf.js
var require_elf = __commonJS({
  "node_modules/detect-libc/lib/elf.js"(exports2, module2) {
    "use strict";
    var interpreterPath = (elf) => {
      if (elf.length < 64) {
        return null;
      }
      if (elf.readUInt32BE(0) !== 2135247942) {
        return null;
      }
      if (elf.readUInt8(4) !== 2) {
        return null;
      }
      if (elf.readUInt8(5) !== 1) {
        return null;
      }
      const offset = elf.readUInt32LE(32);
      const size = elf.readUInt16LE(54);
      const count = elf.readUInt16LE(56);
      for (let i = 0; i < count; i++) {
        const headerOffset = offset + i * size;
        const type = elf.readUInt32LE(headerOffset);
        if (type === 3) {
          const fileOffset = elf.readUInt32LE(headerOffset + 8);
          const fileSize = elf.readUInt32LE(headerOffset + 32);
          return elf.subarray(fileOffset, fileOffset + fileSize).toString().replace(/\0.*$/g, "");
        }
      }
      return null;
    };
    module2.exports = {
      interpreterPath
    };
  }
});

// node_modules/detect-libc/lib/detect-libc.js
var require_detect_libc = __commonJS({
  "node_modules/detect-libc/lib/detect-libc.js"(exports2, module2) {
    "use strict";
    var childProcess = require("child_process");
    var { isLinux, getReport } = require_process();
    var { LDD_PATH, SELF_PATH, readFile, readFileSync } = require_filesystem();
    var { interpreterPath } = require_elf();
    var cachedFamilyInterpreter;
    var cachedFamilyFilesystem;
    var cachedVersionFilesystem;
    var command = "getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true";
    var commandOut = "";
    var safeCommand = () => {
      if (!commandOut) {
        return new Promise((resolve) => {
          childProcess.exec(command, (err, out) => {
            commandOut = err ? " " : out;
            resolve(commandOut);
          });
        });
      }
      return commandOut;
    };
    var safeCommandSync = () => {
      if (!commandOut) {
        try {
          commandOut = childProcess.execSync(command, { encoding: "utf8" });
        } catch (_err) {
          commandOut = " ";
        }
      }
      return commandOut;
    };
    var GLIBC = "glibc";
    var RE_GLIBC_VERSION = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i;
    var MUSL = "musl";
    var isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
    var familyFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return GLIBC;
      }
      if (Array.isArray(report.sharedObjects)) {
        if (report.sharedObjects.some(isFileMusl)) {
          return MUSL;
        }
      }
      return null;
    };
    var familyFromCommand = (out) => {
      const [getconf, ldd1] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return GLIBC;
      }
      if (ldd1 && ldd1.includes(MUSL)) {
        return MUSL;
      }
      return null;
    };
    var familyFromInterpreterPath = (path2) => {
      if (path2) {
        if (path2.includes("/ld-musl-")) {
          return MUSL;
        } else if (path2.includes("/ld-linux-")) {
          return GLIBC;
        }
      }
      return null;
    };
    var getFamilyFromLddContent = (content) => {
      content = content.toString();
      if (content.includes("musl")) {
        return MUSL;
      }
      if (content.includes("GNU C Library")) {
        return GLIBC;
      }
      return null;
    };
    var familyFromFilesystem = async () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var familyFromFilesystemSync = () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var familyFromInterpreter = async () => {
      if (cachedFamilyInterpreter !== void 0) {
        return cachedFamilyInterpreter;
      }
      cachedFamilyInterpreter = null;
      try {
        const selfContent = await readFile(SELF_PATH);
        const path2 = interpreterPath(selfContent);
        cachedFamilyInterpreter = familyFromInterpreterPath(path2);
      } catch (e) {
      }
      return cachedFamilyInterpreter;
    };
    var familyFromInterpreterSync = () => {
      if (cachedFamilyInterpreter !== void 0) {
        return cachedFamilyInterpreter;
      }
      cachedFamilyInterpreter = null;
      try {
        const selfContent = readFileSync(SELF_PATH);
        const path2 = interpreterPath(selfContent);
        cachedFamilyInterpreter = familyFromInterpreterPath(path2);
      } catch (e) {
      }
      return cachedFamilyInterpreter;
    };
    var family = async () => {
      let family2 = null;
      if (isLinux()) {
        family2 = await familyFromInterpreter();
        if (!family2) {
          family2 = await familyFromFilesystem();
          if (!family2) {
            family2 = familyFromReport();
          }
          if (!family2) {
            const out = await safeCommand();
            family2 = familyFromCommand(out);
          }
        }
      }
      return family2;
    };
    var familySync = () => {
      let family2 = null;
      if (isLinux()) {
        family2 = familyFromInterpreterSync();
        if (!family2) {
          family2 = familyFromFilesystemSync();
          if (!family2) {
            family2 = familyFromReport();
          }
          if (!family2) {
            const out = safeCommandSync();
            family2 = familyFromCommand(out);
          }
        }
      }
      return family2;
    };
    var isNonGlibcLinux = async () => isLinux() && await family() !== GLIBC;
    var isNonGlibcLinuxSync = () => isLinux() && familySync() !== GLIBC;
    var versionFromFilesystem = async () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromFilesystemSync = () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return report.header.glibcVersionRuntime;
      }
      return null;
    };
    var versionSuffix = (s) => s.trim().split(/\s+/)[1];
    var versionFromCommand = (out) => {
      const [getconf, ldd1, ldd2] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return versionSuffix(getconf);
      }
      if (ldd1 && ldd2 && ldd1.includes(MUSL)) {
        return versionSuffix(ldd2);
      }
      return null;
    };
    var version = async () => {
      let version2 = null;
      if (isLinux()) {
        version2 = await versionFromFilesystem();
        if (!version2) {
          version2 = versionFromReport();
        }
        if (!version2) {
          const out = await safeCommand();
          version2 = versionFromCommand(out);
        }
      }
      return version2;
    };
    var versionSync = () => {
      let version2 = null;
      if (isLinux()) {
        version2 = versionFromFilesystemSync();
        if (!version2) {
          version2 = versionFromReport();
        }
        if (!version2) {
          const out = safeCommandSync();
          version2 = versionFromCommand(out);
        }
      }
      return version2;
    };
    module2.exports = {
      GLIBC,
      MUSL,
      family,
      familySync,
      isNonGlibcLinux,
      isNonGlibcLinuxSync,
      version,
      versionSync
    };
  }
});

// node_modules/sharp/lib/platform.js
var require_platform = __commonJS({
  "node_modules/sharp/lib/platform.js"(exports2, module2) {
    "use strict";
    var detectLibc = require_detect_libc();
    var env = process.env;
    module2.exports = function() {
      const arch = env.npm_config_arch || process.arch;
      const platform = env.npm_config_platform || process.platform;
      const libc = process.env.npm_config_libc || /* istanbul ignore next */
      (detectLibc.isNonGlibcLinuxSync() ? detectLibc.familySync() : "");
      const libcId = platform !== "linux" || libc === detectLibc.GLIBC ? "" : libc;
      const platformId = [`${platform}${libcId}`];
      if (arch === "arm") {
        const fallback = process.versions.electron ? "7" : "6";
        platformId.push(`armv${env.npm_config_arm_version || process.config.variables.arm_version || fallback}`);
      } else if (arch === "arm64") {
        platformId.push(`arm64v${env.npm_config_arm_version || "8"}`);
      } else {
        platformId.push(arch);
      }
      return platformId.join("-");
    };
  }
});

// node_modules/sharp/package.json
var require_package = __commonJS({
  "node_modules/sharp/package.json"(exports2, module2) {
    module2.exports = {
      name: "sharp",
      description: "High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP, GIF, AVIF and TIFF images",
      version: "0.32.6",
      author: "Lovell Fuller <npm@lovell.info>",
      homepage: "https://github.com/lovell/sharp",
      contributors: [
        "Pierre Inglebert <pierre.inglebert@gmail.com>",
        "Jonathan Ong <jonathanrichardong@gmail.com>",
        "Chanon Sajjamanochai <chanon.s@gmail.com>",
        "Juliano Julio <julianojulio@gmail.com>",
        "Daniel Gasienica <daniel@gasienica.ch>",
        "Julian Walker <julian@fiftythree.com>",
        "Amit Pitaru <pitaru.amit@gmail.com>",
        "Brandon Aaron <hello.brandon@aaron.sh>",
        "Andreas Lind <andreas@one.com>",
        "Maurus Cuelenaere <mcuelenaere@gmail.com>",
        "Linus Unneb\xE4ck <linus@folkdatorn.se>",
        "Victor Mateevitsi <mvictoras@gmail.com>",
        "Alaric Holloway <alaric.holloway@gmail.com>",
        "Bernhard K. Weisshuhn <bkw@codingforce.com>",
        "Chris Riley <criley@primedia.com>",
        "David Carley <dacarley@gmail.com>",
        "John Tobin <john@limelightmobileinc.com>",
        "Kenton Gray <kentongray@gmail.com>",
        "Felix B\xFCnemann <Felix.Buenemann@gmail.com>",
        "Samy Al Zahrani <samyalzahrany@gmail.com>",
        "Chintan Thakkar <lemnisk8@gmail.com>",
        "F. Orlando Galashan <frulo@gmx.de>",
        "Kleis Auke Wolthuizen <info@kleisauke.nl>",
        "Matt Hirsch <mhirsch@media.mit.edu>",
        "Matthias Thoemmes <thoemmes@gmail.com>",
        "Patrick Paskaris <patrick@paskaris.gr>",
        "J\xE9r\xE9my Lal <kapouer@melix.org>",
        "Rahul Nanwani <r.nanwani@gmail.com>",
        "Alice Monday <alice0meta@gmail.com>",
        "Kristo Jorgenson <kristo.jorgenson@gmail.com>",
        "YvesBos <yves_bos@outlook.com>",
        "Guy Maliar <guy@tailorbrands.com>",
        "Nicolas Coden <nicolas@ncoden.fr>",
        "Matt Parrish <matt.r.parrish@gmail.com>",
        "Marcel Bretschneider <marcel.bretschneider@gmail.com>",
        "Matthew McEachen <matthew+github@mceachen.org>",
        "Jarda Kot\u011B\u0161ovec <jarda.kotesovec@gmail.com>",
        "Kenric D'Souza <kenric.dsouza@gmail.com>",
        "Oleh Aleinyk <oleg.aleynik@gmail.com>",
        "Marcel Bretschneider <marcel.bretschneider@gmail.com>",
        "Andrea Bianco <andrea.bianco@unibas.ch>",
        "Rik Heywood <rik@rik.org>",
        "Thomas Parisot <hi@oncletom.io>",
        "Nathan Graves <nathanrgraves+github@gmail.com>",
        "Tom Lokhorst <tom@lokhorst.eu>",
        "Espen Hovlandsdal <espen@hovlandsdal.com>",
        "Sylvain Dumont <sylvain.dumont35@gmail.com>",
        "Alun Davies <alun.owain.davies@googlemail.com>",
        "Aidan Hoolachan <ajhoolachan21@gmail.com>",
        "Axel Eirola <axel.eirola@iki.fi>",
        "Freezy <freezy@xbmc.org>",
        "Daiz <taneli.vatanen@gmail.com>",
        "Julian Aubourg <j@ubourg.net>",
        "Keith Belovay <keith@picthrive.com>",
        "Michael B. Klein <mbklein@gmail.com>",
        "Jordan Prudhomme <jordan@raboland.fr>",
        "Ilya Ovdin <iovdin@gmail.com>",
        "Andargor <andargor@yahoo.com>",
        "Paul Neave <paul.neave@gmail.com>",
        "Brendan Kennedy <brenwken@gmail.com>",
        "Brychan Bennett-Odlum <git@brychan.io>",
        "Edward Silverton <e.silverton@gmail.com>",
        "Roman Malieiev <aromaleev@gmail.com>",
        "Tomas Szabo <tomas.szabo@deftomat.com>",
        "Robert O'Rourke <robert@o-rourke.org>",
        "Guillermo Alfonso Varela Chouci\xF1o <guillevch@gmail.com>",
        "Christian Flintrup <chr@gigahost.dk>",
        "Manan Jadhav <manan@motionden.com>",
        "Leon Radley <leon@radley.se>",
        "alza54 <alza54@thiocod.in>",
        "Jacob Smith <jacob@frende.me>",
        "Michael Nutt <michael@nutt.im>",
        "Brad Parham <baparham@gmail.com>",
        "Taneli Vatanen <taneli.vatanen@gmail.com>",
        "Joris Dugu\xE9 <zaruike10@gmail.com>",
        "Chris Banks <christopher.bradley.banks@gmail.com>",
        "Ompal Singh <ompal.hitm09@gmail.com>",
        "Brodan <christopher.hranj@gmail.com",
        "Ankur Parihar <ankur.github@gmail.com>",
        "Brahim Ait elhaj <brahima@gmail.com>",
        "Mart Jansink <m.jansink@gmail.com>",
        "Lachlan Newman <lachnewman007@gmail.com>"
      ],
      scripts: {
        install: "(node install/libvips && node install/dll-copy && prebuild-install) || (node install/can-compile && node-gyp rebuild && node install/dll-copy)",
        clean: "rm -rf node_modules/ build/ vendor/ .nyc_output/ coverage/ test/fixtures/output.*",
        test: "npm run test-lint && npm run test-unit && npm run test-licensing && npm run test-types",
        "test-lint": "semistandard && cpplint",
        "test-unit": "nyc --reporter=lcov --reporter=text --check-coverage --branches=100 mocha",
        "test-licensing": 'license-checker --production --summary --onlyAllow="Apache-2.0;BSD;ISC;MIT"',
        "test-leak": "./test/leak/leak.sh",
        "test-types": "tsd",
        "docs-build": "node docs/build && node docs/search-index/build",
        "docs-serve": "cd docs && npx serve",
        "docs-publish": "cd docs && npx firebase-tools deploy --project pixelplumbing --only hosting:pixelplumbing-sharp"
      },
      main: "lib/index.js",
      types: "lib/index.d.ts",
      files: [
        "binding.gyp",
        "install/**",
        "lib/**",
        "src/**"
      ],
      repository: {
        type: "git",
        url: "git://github.com/lovell/sharp"
      },
      keywords: [
        "jpeg",
        "png",
        "webp",
        "avif",
        "tiff",
        "gif",
        "svg",
        "jp2",
        "dzi",
        "image",
        "resize",
        "thumbnail",
        "crop",
        "embed",
        "libvips",
        "vips"
      ],
      dependencies: {
        color: "^4.2.3",
        "detect-libc": "^2.0.2",
        "node-addon-api": "^6.1.0",
        "prebuild-install": "^7.1.1",
        semver: "^7.5.4",
        "simple-get": "^4.0.1",
        "tar-fs": "^3.0.4",
        "tunnel-agent": "^0.6.0"
      },
      devDependencies: {
        "@types/node": "*",
        async: "^3.2.4",
        cc: "^3.0.1",
        "exif-reader": "^1.2.0",
        "extract-zip": "^2.0.1",
        icc: "^3.0.0",
        "jsdoc-to-markdown": "^8.0.0",
        "license-checker": "^25.0.1",
        mocha: "^10.2.0",
        "mock-fs": "^5.2.0",
        nyc: "^15.1.0",
        prebuild: "^12.0.0",
        semistandard: "^16.0.1",
        tsd: "^0.29.0"
      },
      license: "Apache-2.0",
      config: {
        libvips: "8.14.5",
        integrity: {
          "darwin-arm64v8": "sha512-1QZzICfCJd4wAO0P6qmYI5e5VFMt9iCE4QgefI8VMMbdSzjIXA9L/ARN6pkMQPZ3h20Y9RtJ2W1skgCsvCIccw==",
          "darwin-x64": "sha512-sMIKMYXsdU9FlIfztj6Kt/SfHlhlDpP0Ups7ftVFqwjaszmYmpI9y/d/q3mLb4jrzuSiSUEislSWCwBnW7MPTw==",
          "linux-arm64v8": "sha512-CD8owELzkDumaom+O3jJ8fKamILAQdj+//KK/VNcHK3sngUcFpdjx36C8okwbux9sml/T7GTB/gzpvReDrAejQ==",
          "linux-armv6": "sha512-wk6IPHatDFVWKJy7lI1TJezHGHPQut1wF2bwx256KlZwXUQU3fcVcMpV1zxXjgLFewHq2+uhyMkoSGBPahWzlA==",
          "linux-armv7": "sha512-HEZC9KYtkmBK5rUR2MqBhrVarnQVZ/TwLUeLkKq0XuoM2pc/eXI6N0Fh5NGEFwdXI2XE8g1ySf+OYS6DDi+xCQ==",
          "linux-x64": "sha512-SlFWrITSW5XVUkaFPQOySAaSGXnhkGJCj8X2wGYYta9hk5piZldQyMp4zwy0z6UeRu1qKTKtZvmq28W3Gnh9xA==",
          "linuxmusl-arm64v8": "sha512-ga9iX7WUva3sG/VsKkOD318InLlCfPIztvzCZKZ2/+izQXRbQi8VoXWMHgEN4KHACv45FTl7mJ/8CRqUzhS8wQ==",
          "linuxmusl-x64": "sha512-yeaHnpfee1hrZLok2l4eFceHzlfq8gN3QOu0R4Mh8iMK5O5vAUu97bdtxeZZeJJvHw8tfh2/msGi0qysxKN8bw==",
          "win32-arm64v8": "sha512-kR91hy9w1+GEXK56hLh51+hBCBo7T+ijM4Slkmvb/2PsYZySq5H7s61n99iDYl6kTJP2y9sW5Xcvm3uuXDaDgg==",
          "win32-ia32": "sha512-HrnofEbzHNpHJ0vVnjsTj5yfgVdcqdWshXuwFO2zc8xlEjA83BvXZ0lVj9MxPxkxJ2ta+/UlLr+CFzc5bOceMw==",
          "win32-x64": "sha512-BwKckinJZ0Fu/EcunqiLPwOLEBWp4xf8GV7nvmVuKKz5f6B+GxoA2k9aa2wueqv4r4RJVgV/aWXZWFKOIjre/Q=="
        },
        runtime: "napi",
        target: 7
      },
      engines: {
        node: ">=14.15.0"
      },
      funding: {
        url: "https://opencollective.com/libvips"
      },
      binary: {
        napi_versions: [
          7
        ]
      },
      semistandard: {
        env: [
          "mocha"
        ]
      },
      cc: {
        linelength: "120",
        filter: [
          "build/include"
        ]
      },
      tsd: {
        directory: "test/types/"
      }
    };
  }
});

// node_modules/sharp/lib/libvips.js
var require_libvips = __commonJS({
  "node_modules/sharp/lib/libvips.js"(exports2, module2) {
    "use strict";
    var fs2 = require("fs");
    var os = require("os");
    var path2 = require("path");
    var spawnSync2 = require("child_process").spawnSync;
    var semverCoerce = require_coerce();
    var semverGreaterThanOrEqualTo = require_gte();
    var platform = require_platform();
    var { config } = require_package();
    var env = process.env;
    var minimumLibvipsVersionLabelled = env.npm_package_config_libvips || /* istanbul ignore next */
    config.libvips;
    var minimumLibvipsVersion = semverCoerce(minimumLibvipsVersionLabelled).version;
    var spawnSyncOptions = {
      encoding: "utf8",
      shell: true
    };
    var vendorPath = path2.join(__dirname, "..", "vendor", minimumLibvipsVersion, platform());
    var mkdirSync = function(dirPath) {
      try {
        fs2.mkdirSync(dirPath, { recursive: true });
      } catch (err) {
        if (err.code !== "EEXIST") {
          throw err;
        }
      }
    };
    var cachePath = function() {
      const npmCachePath = env.npm_config_cache || /* istanbul ignore next */
      (env.APPDATA ? path2.join(env.APPDATA, "npm-cache") : path2.join(os.homedir(), ".npm"));
      mkdirSync(npmCachePath);
      const libvipsCachePath = path2.join(npmCachePath, "_libvips");
      mkdirSync(libvipsCachePath);
      return libvipsCachePath;
    };
    var integrity = function(platformAndArch) {
      return env[`npm_package_config_integrity_${platformAndArch.replace("-", "_")}`] || config.integrity[platformAndArch];
    };
    var log = function(item) {
      if (item instanceof Error) {
        console.error(`sharp: Installation error: ${item.message}`);
      } else {
        console.log(`sharp: ${item}`);
      }
    };
    var isRosetta = function() {
      if (process.platform === "darwin" && process.arch === "x64") {
        const translated = spawnSync2("sysctl sysctl.proc_translated", spawnSyncOptions).stdout;
        return (translated || "").trim() === "sysctl.proc_translated: 1";
      }
      return false;
    };
    var globalLibvipsVersion = function() {
      if (process.platform !== "win32") {
        const globalLibvipsVersion2 = spawnSync2("pkg-config --modversion vips-cpp", {
          ...spawnSyncOptions,
          env: {
            ...env,
            PKG_CONFIG_PATH: pkgConfigPath()
          }
        }).stdout;
        return (globalLibvipsVersion2 || "").trim();
      } else {
        return "";
      }
    };
    var hasVendoredLibvips = function() {
      return fs2.existsSync(vendorPath);
    };
    var removeVendoredLibvips = function() {
      fs2.rmSync(vendorPath, { recursive: true, maxRetries: 3, force: true });
    };
    var pkgConfigPath = function() {
      if (process.platform !== "win32") {
        const brewPkgConfigPath = spawnSync2(
          'which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2',
          spawnSyncOptions
        ).stdout || "";
        return [
          brewPkgConfigPath.trim(),
          env.PKG_CONFIG_PATH,
          "/usr/local/lib/pkgconfig",
          "/usr/lib/pkgconfig",
          "/usr/local/libdata/pkgconfig",
          "/usr/libdata/pkgconfig"
        ].filter(Boolean).join(":");
      } else {
        return "";
      }
    };
    var useGlobalLibvips = function() {
      if (Boolean(env.SHARP_IGNORE_GLOBAL_LIBVIPS) === true) {
        return false;
      }
      if (isRosetta()) {
        log("Detected Rosetta, skipping search for globally-installed libvips");
        return false;
      }
      const globalVipsVersion = globalLibvipsVersion();
      return !!globalVipsVersion && /* istanbul ignore next */
      semverGreaterThanOrEqualTo(globalVipsVersion, minimumLibvipsVersion);
    };
    module2.exports = {
      minimumLibvipsVersion,
      minimumLibvipsVersionLabelled,
      cachePath,
      integrity,
      log,
      globalLibvipsVersion,
      hasVendoredLibvips,
      removeVendoredLibvips,
      pkgConfigPath,
      useGlobalLibvips,
      mkdirSync
    };
  }
});

// node_modules/sharp/build/Release/sharp-win32-x64.node
var require_sharp_win32_x64 = __commonJS({
  "node_modules/sharp/build/Release/sharp-win32-x64.node"() {
  }
});

// require("../build/Release/sharp-*.node") in node_modules/sharp/lib/sharp.js
var globRequire_build_Release_sharp_node;
var init_ = __esm({
  'require("../build/Release/sharp-*.node") in node_modules/sharp/lib/sharp.js'() {
    globRequire_build_Release_sharp_node = __glob({
      "../build/Release/sharp-win32-x64.node": () => require_sharp_win32_x64()
    });
  }
});

// node_modules/sharp/lib/sharp.js
var require_sharp = __commonJS({
  "node_modules/sharp/lib/sharp.js"(exports2, module2) {
    "use strict";
    init_();
    var platformAndArch = require_platform()();
    try {
      module2.exports = globRequire_build_Release_sharp_node(`../build/Release/sharp-${platformAndArch}.node`);
    } catch (err) {
      const help = ["", 'Something went wrong installing the "sharp" module', "", err.message, "", "Possible solutions:"];
      if (/dylib/.test(err.message) && /Incompatible library version/.test(err.message)) {
        help.push('- Update Homebrew: "brew update && brew upgrade vips"');
      } else {
        const [platform, arch] = platformAndArch.split("-");
        if (platform === "linux" && /Module did not self-register/.test(err.message)) {
          help.push("- Using worker threads? See https://sharp.pixelplumbing.com/install#worker-threads");
        }
        help.push(
          '- Install with verbose logging and look for errors: "npm install --ignore-scripts=false --foreground-scripts --verbose sharp"',
          `- Install for the current ${platformAndArch} runtime: "npm install --platform=${platform} --arch=${arch} sharp"`
        );
      }
      help.push(
        "- Consult the installation documentation: https://sharp.pixelplumbing.com/install"
      );
      if (process.platform === "win32" || /symbol/.test(err.message)) {
        const loadedModule = Object.keys(require.cache).find((i) => /[\\/]build[\\/]Release[\\/]sharp(.*)\.node$/.test(i));
        if (loadedModule) {
          const [, loadedPackage] = loadedModule.match(/node_modules[\\/]([^\\/]+)[\\/]/);
          help.push(`- Ensure the version of sharp aligns with the ${loadedPackage} package: "npm ls sharp"`);
        }
      }
      throw new Error(help.join("\n"));
    }
  }
});

// node_modules/sharp/lib/constructor.js
var require_constructor = __commonJS({
  "node_modules/sharp/lib/constructor.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var stream = require("stream");
    var is = require_is();
    require_libvips().hasVendoredLibvips();
    require_sharp();
    var debuglog = util.debuglog("sharp");
    var Sharp = function(input, options) {
      if (arguments.length === 1 && !is.defined(input)) {
        throw new Error("Invalid input");
      }
      if (!(this instanceof Sharp)) {
        return new Sharp(input, options);
      }
      stream.Duplex.call(this);
      this.options = {
        // resize options
        topOffsetPre: -1,
        leftOffsetPre: -1,
        widthPre: -1,
        heightPre: -1,
        topOffsetPost: -1,
        leftOffsetPost: -1,
        widthPost: -1,
        heightPost: -1,
        width: -1,
        height: -1,
        canvas: "crop",
        position: 0,
        resizeBackground: [0, 0, 0, 255],
        useExifOrientation: false,
        angle: 0,
        rotationAngle: 0,
        rotationBackground: [0, 0, 0, 255],
        rotateBeforePreExtract: false,
        flip: false,
        flop: false,
        extendTop: 0,
        extendBottom: 0,
        extendLeft: 0,
        extendRight: 0,
        extendBackground: [0, 0, 0, 255],
        extendWith: "background",
        withoutEnlargement: false,
        withoutReduction: false,
        affineMatrix: [],
        affineBackground: [0, 0, 0, 255],
        affineIdx: 0,
        affineIdy: 0,
        affineOdx: 0,
        affineOdy: 0,
        affineInterpolator: this.constructor.interpolators.bilinear,
        kernel: "lanczos3",
        fastShrinkOnLoad: true,
        // operations
        tintA: 128,
        tintB: 128,
        flatten: false,
        flattenBackground: [0, 0, 0],
        unflatten: false,
        negate: false,
        negateAlpha: true,
        medianSize: 0,
        blurSigma: 0,
        sharpenSigma: 0,
        sharpenM1: 1,
        sharpenM2: 2,
        sharpenX1: 2,
        sharpenY2: 10,
        sharpenY3: 20,
        threshold: 0,
        thresholdGrayscale: true,
        trimBackground: [],
        trimThreshold: 0,
        gamma: 0,
        gammaOut: 0,
        greyscale: false,
        normalise: false,
        normaliseLower: 1,
        normaliseUpper: 99,
        claheWidth: 0,
        claheHeight: 0,
        claheMaxSlope: 3,
        brightness: 1,
        saturation: 1,
        hue: 0,
        lightness: 0,
        booleanBufferIn: null,
        booleanFileIn: "",
        joinChannelIn: [],
        extractChannel: -1,
        removeAlpha: false,
        ensureAlpha: -1,
        colourspace: "srgb",
        colourspaceInput: "last",
        composite: [],
        // output
        fileOut: "",
        formatOut: "input",
        streamOut: false,
        withMetadata: false,
        withMetadataOrientation: -1,
        withMetadataDensity: 0,
        withMetadataIcc: "",
        withMetadataStrs: {},
        resolveWithObject: false,
        // output format
        jpegQuality: 80,
        jpegProgressive: false,
        jpegChromaSubsampling: "4:2:0",
        jpegTrellisQuantisation: false,
        jpegOvershootDeringing: false,
        jpegOptimiseScans: false,
        jpegOptimiseCoding: true,
        jpegQuantisationTable: 0,
        pngProgressive: false,
        pngCompressionLevel: 6,
        pngAdaptiveFiltering: false,
        pngPalette: false,
        pngQuality: 100,
        pngEffort: 7,
        pngBitdepth: 8,
        pngDither: 1,
        jp2Quality: 80,
        jp2TileHeight: 512,
        jp2TileWidth: 512,
        jp2Lossless: false,
        jp2ChromaSubsampling: "4:4:4",
        webpQuality: 80,
        webpAlphaQuality: 100,
        webpLossless: false,
        webpNearLossless: false,
        webpSmartSubsample: false,
        webpPreset: "default",
        webpEffort: 4,
        webpMinSize: false,
        webpMixed: false,
        gifBitdepth: 8,
        gifEffort: 7,
        gifDither: 1,
        gifInterFrameMaxError: 0,
        gifInterPaletteMaxError: 3,
        gifReuse: true,
        gifProgressive: false,
        tiffQuality: 80,
        tiffCompression: "jpeg",
        tiffPredictor: "horizontal",
        tiffPyramid: false,
        tiffBitdepth: 8,
        tiffTile: false,
        tiffTileHeight: 256,
        tiffTileWidth: 256,
        tiffXres: 1,
        tiffYres: 1,
        tiffResolutionUnit: "inch",
        heifQuality: 50,
        heifLossless: false,
        heifCompression: "av1",
        heifEffort: 4,
        heifChromaSubsampling: "4:4:4",
        jxlDistance: 1,
        jxlDecodingTier: 0,
        jxlEffort: 7,
        jxlLossless: false,
        rawDepth: "uchar",
        tileSize: 256,
        tileOverlap: 0,
        tileContainer: "fs",
        tileLayout: "dz",
        tileFormat: "last",
        tileDepth: "last",
        tileAngle: 0,
        tileSkipBlanks: -1,
        tileBackground: [255, 255, 255, 255],
        tileCentre: false,
        tileId: "https://example.com/iiif",
        tileBasename: "",
        timeoutSeconds: 0,
        linearA: [],
        linearB: [],
        // Function to notify of libvips warnings
        debuglog: (warning) => {
          this.emit("warning", warning);
          debuglog(warning);
        },
        // Function to notify of queue length changes
        queueListener: function(queueLength) {
          Sharp.queue.emit("change", queueLength);
        }
      };
      this.options.input = this._createInputDescriptor(input, options, { allowStream: true });
      return this;
    };
    Object.setPrototypeOf(Sharp.prototype, stream.Duplex.prototype);
    Object.setPrototypeOf(Sharp, stream.Duplex);
    function clone() {
      const clone2 = this.constructor.call();
      clone2.options = Object.assign({}, this.options);
      if (this._isStreamInput()) {
        this.on("finish", () => {
          this._flattenBufferIn();
          clone2.options.bufferIn = this.options.bufferIn;
          clone2.emit("finish");
        });
      }
      return clone2;
    }
    Object.assign(Sharp.prototype, { clone });
    module2.exports = Sharp;
  }
});

// node_modules/color-name/index.js
var require_color_name = __commonJS({
  "node_modules/color-name/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// node_modules/is-arrayish/index.js
var require_is_arrayish = __commonJS({
  "node_modules/is-arrayish/index.js"(exports2, module2) {
    module2.exports = function isArrayish(obj) {
      if (!obj || typeof obj === "string") {
        return false;
      }
      return obj instanceof Array || Array.isArray(obj) || obj.length >= 0 && (obj.splice instanceof Function || Object.getOwnPropertyDescriptor(obj, obj.length - 1) && obj.constructor.name !== "String");
    };
  }
});

// node_modules/simple-swizzle/index.js
var require_simple_swizzle = __commonJS({
  "node_modules/simple-swizzle/index.js"(exports2, module2) {
    "use strict";
    var isArrayish = require_is_arrayish();
    var concat = Array.prototype.concat;
    var slice = Array.prototype.slice;
    var swizzle = module2.exports = function swizzle2(args) {
      var results = [];
      for (var i = 0, len = args.length; i < len; i++) {
        var arg = args[i];
        if (isArrayish(arg)) {
          results = concat.call(results, slice.call(arg));
        } else {
          results.push(arg);
        }
      }
      return results;
    };
    swizzle.wrap = function(fn) {
      return function() {
        return fn(swizzle(arguments));
      };
    };
  }
});

// node_modules/color-string/index.js
var require_color_string = __commonJS({
  "node_modules/color-string/index.js"(exports2, module2) {
    var colorNames = require_color_name();
    var swizzle = require_simple_swizzle();
    var hasOwnProperty = Object.hasOwnProperty;
    var reverseNames = /* @__PURE__ */ Object.create(null);
    for (name in colorNames) {
      if (hasOwnProperty.call(colorNames, name)) {
        reverseNames[colorNames[name]] = name;
      }
    }
    var name;
    var cs = module2.exports = {
      to: {},
      get: {}
    };
    cs.get = function(string) {
      var prefix = string.substring(0, 3).toLowerCase();
      var val;
      var model;
      switch (prefix) {
        case "hsl":
          val = cs.get.hsl(string);
          model = "hsl";
          break;
        case "hwb":
          val = cs.get.hwb(string);
          model = "hwb";
          break;
        default:
          val = cs.get.rgb(string);
          model = "rgb";
          break;
      }
      if (!val) {
        return null;
      }
      return { model, value: val };
    };
    cs.get.rgb = function(string) {
      if (!string) {
        return null;
      }
      var abbr = /^#([a-f0-9]{3,4})$/i;
      var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
      var rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
      var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
      var keyword = /^(\w+)$/;
      var rgb = [0, 0, 0, 1];
      var match;
      var i;
      var hexAlpha;
      if (match = string.match(hex)) {
        hexAlpha = match[2];
        match = match[1];
        for (i = 0; i < 3; i++) {
          var i2 = i * 2;
          rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
        }
        if (hexAlpha) {
          rgb[3] = parseInt(hexAlpha, 16) / 255;
        }
      } else if (match = string.match(abbr)) {
        match = match[1];
        hexAlpha = match[3];
        for (i = 0; i < 3; i++) {
          rgb[i] = parseInt(match[i] + match[i], 16);
        }
        if (hexAlpha) {
          rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
        }
      } else if (match = string.match(rgba)) {
        for (i = 0; i < 3; i++) {
          rgb[i] = parseInt(match[i + 1], 0);
        }
        if (match[4]) {
          if (match[5]) {
            rgb[3] = parseFloat(match[4]) * 0.01;
          } else {
            rgb[3] = parseFloat(match[4]);
          }
        }
      } else if (match = string.match(per)) {
        for (i = 0; i < 3; i++) {
          rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
        }
        if (match[4]) {
          if (match[5]) {
            rgb[3] = parseFloat(match[4]) * 0.01;
          } else {
            rgb[3] = parseFloat(match[4]);
          }
        }
      } else if (match = string.match(keyword)) {
        if (match[1] === "transparent") {
          return [0, 0, 0, 0];
        }
        if (!hasOwnProperty.call(colorNames, match[1])) {
          return null;
        }
        rgb = colorNames[match[1]];
        rgb[3] = 1;
        return rgb;
      } else {
        return null;
      }
      for (i = 0; i < 3; i++) {
        rgb[i] = clamp(rgb[i], 0, 255);
      }
      rgb[3] = clamp(rgb[3], 0, 1);
      return rgb;
    };
    cs.get.hsl = function(string) {
      if (!string) {
        return null;
      }
      var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
      var match = string.match(hsl);
      if (match) {
        var alpha = parseFloat(match[4]);
        var h = (parseFloat(match[1]) % 360 + 360) % 360;
        var s = clamp(parseFloat(match[2]), 0, 100);
        var l = clamp(parseFloat(match[3]), 0, 100);
        var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, s, l, a];
      }
      return null;
    };
    cs.get.hwb = function(string) {
      if (!string) {
        return null;
      }
      var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
      var match = string.match(hwb);
      if (match) {
        var alpha = parseFloat(match[4]);
        var h = (parseFloat(match[1]) % 360 + 360) % 360;
        var w = clamp(parseFloat(match[2]), 0, 100);
        var b = clamp(parseFloat(match[3]), 0, 100);
        var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, w, b, a];
      }
      return null;
    };
    cs.to.hex = function() {
      var rgba = swizzle(arguments);
      return "#" + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : "");
    };
    cs.to.rgb = function() {
      var rgba = swizzle(arguments);
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ")" : "rgba(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ", " + rgba[3] + ")";
    };
    cs.to.rgb.percent = function() {
      var rgba = swizzle(arguments);
      var r = Math.round(rgba[0] / 255 * 100);
      var g = Math.round(rgba[1] / 255 * 100);
      var b = Math.round(rgba[2] / 255 * 100);
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + r + "%, " + g + "%, " + b + "%)" : "rgba(" + r + "%, " + g + "%, " + b + "%, " + rgba[3] + ")";
    };
    cs.to.hsl = function() {
      var hsla = swizzle(arguments);
      return hsla.length < 4 || hsla[3] === 1 ? "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)" : "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + hsla[3] + ")";
    };
    cs.to.hwb = function() {
      var hwba = swizzle(arguments);
      var a = "";
      if (hwba.length >= 4 && hwba[3] !== 1) {
        a = ", " + hwba[3];
      }
      return "hwb(" + hwba[0] + ", " + hwba[1] + "%, " + hwba[2] + "%" + a + ")";
    };
    cs.to.keyword = function(rgb) {
      return reverseNames[rgb.slice(0, 3)];
    };
    function clamp(num, min, max) {
      return Math.min(Math.max(min, num), max);
    }
    function hexDouble(num) {
      var str = Math.round(num).toString(16).toUpperCase();
      return str.length < 2 ? "0" + str : str;
    }
  }
});

// node_modules/color-convert/conversions.js
var require_conversions = __commonJS({
  "node_modules/color-convert/conversions.js"(exports2, module2) {
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
    var convert = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    module2.exports = convert;
    for (const model of Object.keys(convert)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert[model];
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", { value: channels });
      Object.defineProperty(convert[model], "labels", { value: labels });
    }
    convert.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Infinity;
      let currentClosestKeyword;
      for (const keyword of Object.keys(cssKeywords)) {
        const value = cssKeywords[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb) {
      let r = rgb[0] / 255;
      let g = rgb[1] / 255;
      let b = rgb[2] / 255;
      r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
      g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
      b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      const xyz = convert.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t2;
      let t3;
      let val;
      if (s === 0) {
        val = l * 255;
        return [val, val, val];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (~~(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map((char) => {
          return char + char;
        }).join("");
      }
      const integer = parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let grayscale;
      let hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hsv = convert.gray.hsl;
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      const val = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (val << 16) + (val << 8) + val;
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [val / 255 * 100];
    };
  }
});

// node_modules/color-convert/route.js
var require_route = __commonJS({
  "node_modules/color-convert/route.js"(exports2, module2) {
    var conversions = require_conversions();
    function buildGraph() {
      const graph = {};
      const models = Object.keys(conversions);
      for (let len = models.length, i = 0; i < len; i++) {
        graph[models[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions[current]);
        for (let len = adjacents.length, i = 0; i < len; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      const path2 = [graph[toModel].parent, toModel];
      let fn = conversions[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path2.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path2;
      return fn;
    }
    module2.exports = function(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models = Object.keys(graph);
      for (let len = models.length, i = 0; i < len; i++) {
        const toModel = models[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// node_modules/color-convert/index.js
var require_color_convert = __commonJS({
  "node_modules/color-convert/index.js"(exports2, module2) {
    var conversions = require_conversions();
    var route = require_route();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    models.forEach((fromModel) => {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
      const routes = route(fromModel);
      const routeModels = Object.keys(routes);
      routeModels.forEach((toModel) => {
        const fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module2.exports = convert;
  }
});

// node_modules/color/index.js
var require_color = __commonJS({
  "node_modules/color/index.js"(exports2, module2) {
    var colorString = require_color_string();
    var convert = require_color_convert();
    var skippedModels = [
      // To be honest, I don't really feel like keyword belongs in color convert, but eh.
      "keyword",
      // Gray conflicts with some method names, and has its own method defined.
      "gray",
      // Shouldn't really be in color-convert either...
      "hex"
    ];
    var hashedModelKeys = {};
    for (const model of Object.keys(convert)) {
      hashedModelKeys[[...convert[model].labels].sort().join("")] = model;
    }
    var limiters = {};
    function Color(object, model) {
      if (!(this instanceof Color)) {
        return new Color(object, model);
      }
      if (model && model in skippedModels) {
        model = null;
      }
      if (model && !(model in convert)) {
        throw new Error("Unknown model: " + model);
      }
      let i;
      let channels;
      if (object == null) {
        this.model = "rgb";
        this.color = [0, 0, 0];
        this.valpha = 1;
      } else if (object instanceof Color) {
        this.model = object.model;
        this.color = [...object.color];
        this.valpha = object.valpha;
      } else if (typeof object === "string") {
        const result = colorString.get(object);
        if (result === null) {
          throw new Error("Unable to parse color from string: " + object);
        }
        this.model = result.model;
        channels = convert[this.model].channels;
        this.color = result.value.slice(0, channels);
        this.valpha = typeof result.value[channels] === "number" ? result.value[channels] : 1;
      } else if (object.length > 0) {
        this.model = model || "rgb";
        channels = convert[this.model].channels;
        const newArray = Array.prototype.slice.call(object, 0, channels);
        this.color = zeroArray(newArray, channels);
        this.valpha = typeof object[channels] === "number" ? object[channels] : 1;
      } else if (typeof object === "number") {
        this.model = "rgb";
        this.color = [
          object >> 16 & 255,
          object >> 8 & 255,
          object & 255
        ];
        this.valpha = 1;
      } else {
        this.valpha = 1;
        const keys = Object.keys(object);
        if ("alpha" in object) {
          keys.splice(keys.indexOf("alpha"), 1);
          this.valpha = typeof object.alpha === "number" ? object.alpha : 0;
        }
        const hashedKeys = keys.sort().join("");
        if (!(hashedKeys in hashedModelKeys)) {
          throw new Error("Unable to parse color from object: " + JSON.stringify(object));
        }
        this.model = hashedModelKeys[hashedKeys];
        const { labels } = convert[this.model];
        const color = [];
        for (i = 0; i < labels.length; i++) {
          color.push(object[labels[i]]);
        }
        this.color = zeroArray(color);
      }
      if (limiters[this.model]) {
        channels = convert[this.model].channels;
        for (i = 0; i < channels; i++) {
          const limit = limiters[this.model][i];
          if (limit) {
            this.color[i] = limit(this.color[i]);
          }
        }
      }
      this.valpha = Math.max(0, Math.min(1, this.valpha));
      if (Object.freeze) {
        Object.freeze(this);
      }
    }
    Color.prototype = {
      toString() {
        return this.string();
      },
      toJSON() {
        return this[this.model]();
      },
      string(places) {
        let self = this.model in colorString.to ? this : this.rgb();
        self = self.round(typeof places === "number" ? places : 1);
        const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
        return colorString.to[self.model](args);
      },
      percentString(places) {
        const self = this.rgb().round(typeof places === "number" ? places : 1);
        const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
        return colorString.to.rgb.percent(args);
      },
      array() {
        return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
      },
      object() {
        const result = {};
        const { channels } = convert[this.model];
        const { labels } = convert[this.model];
        for (let i = 0; i < channels; i++) {
          result[labels[i]] = this.color[i];
        }
        if (this.valpha !== 1) {
          result.alpha = this.valpha;
        }
        return result;
      },
      unitArray() {
        const rgb = this.rgb().color;
        rgb[0] /= 255;
        rgb[1] /= 255;
        rgb[2] /= 255;
        if (this.valpha !== 1) {
          rgb.push(this.valpha);
        }
        return rgb;
      },
      unitObject() {
        const rgb = this.rgb().object();
        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;
        if (this.valpha !== 1) {
          rgb.alpha = this.valpha;
        }
        return rgb;
      },
      round(places) {
        places = Math.max(places || 0, 0);
        return new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);
      },
      alpha(value) {
        if (value !== void 0) {
          return new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);
        }
        return this.valpha;
      },
      // Rgb
      red: getset("rgb", 0, maxfn(255)),
      green: getset("rgb", 1, maxfn(255)),
      blue: getset("rgb", 2, maxfn(255)),
      hue: getset(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (value) => (value % 360 + 360) % 360),
      saturationl: getset("hsl", 1, maxfn(100)),
      lightness: getset("hsl", 2, maxfn(100)),
      saturationv: getset("hsv", 1, maxfn(100)),
      value: getset("hsv", 2, maxfn(100)),
      chroma: getset("hcg", 1, maxfn(100)),
      gray: getset("hcg", 2, maxfn(100)),
      white: getset("hwb", 1, maxfn(100)),
      wblack: getset("hwb", 2, maxfn(100)),
      cyan: getset("cmyk", 0, maxfn(100)),
      magenta: getset("cmyk", 1, maxfn(100)),
      yellow: getset("cmyk", 2, maxfn(100)),
      black: getset("cmyk", 3, maxfn(100)),
      x: getset("xyz", 0, maxfn(95.047)),
      y: getset("xyz", 1, maxfn(100)),
      z: getset("xyz", 2, maxfn(108.833)),
      l: getset("lab", 0, maxfn(100)),
      a: getset("lab", 1),
      b: getset("lab", 2),
      keyword(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        return convert[this.model].keyword(this.color);
      },
      hex(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        return colorString.to.hex(this.rgb().round().color);
      },
      hexa(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        const rgbArray = this.rgb().round().color;
        let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
        if (alphaHex.length === 1) {
          alphaHex = "0" + alphaHex;
        }
        return colorString.to.hex(rgbArray) + alphaHex;
      },
      rgbNumber() {
        const rgb = this.rgb().color;
        return (rgb[0] & 255) << 16 | (rgb[1] & 255) << 8 | rgb[2] & 255;
      },
      luminosity() {
        const rgb = this.rgb().color;
        const lum = [];
        for (const [i, element] of rgb.entries()) {
          const chan = element / 255;
          lum[i] = chan <= 0.04045 ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
        }
        return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
      },
      contrast(color2) {
        const lum1 = this.luminosity();
        const lum2 = color2.luminosity();
        if (lum1 > lum2) {
          return (lum1 + 0.05) / (lum2 + 0.05);
        }
        return (lum2 + 0.05) / (lum1 + 0.05);
      },
      level(color2) {
        const contrastRatio = this.contrast(color2);
        if (contrastRatio >= 7) {
          return "AAA";
        }
        return contrastRatio >= 4.5 ? "AA" : "";
      },
      isDark() {
        const rgb = this.rgb().color;
        const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 1e4;
        return yiq < 128;
      },
      isLight() {
        return !this.isDark();
      },
      negate() {
        const rgb = this.rgb();
        for (let i = 0; i < 3; i++) {
          rgb.color[i] = 255 - rgb.color[i];
        }
        return rgb;
      },
      lighten(ratio) {
        const hsl = this.hsl();
        hsl.color[2] += hsl.color[2] * ratio;
        return hsl;
      },
      darken(ratio) {
        const hsl = this.hsl();
        hsl.color[2] -= hsl.color[2] * ratio;
        return hsl;
      },
      saturate(ratio) {
        const hsl = this.hsl();
        hsl.color[1] += hsl.color[1] * ratio;
        return hsl;
      },
      desaturate(ratio) {
        const hsl = this.hsl();
        hsl.color[1] -= hsl.color[1] * ratio;
        return hsl;
      },
      whiten(ratio) {
        const hwb = this.hwb();
        hwb.color[1] += hwb.color[1] * ratio;
        return hwb;
      },
      blacken(ratio) {
        const hwb = this.hwb();
        hwb.color[2] += hwb.color[2] * ratio;
        return hwb;
      },
      grayscale() {
        const rgb = this.rgb().color;
        const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
        return Color.rgb(value, value, value);
      },
      fade(ratio) {
        return this.alpha(this.valpha - this.valpha * ratio);
      },
      opaquer(ratio) {
        return this.alpha(this.valpha + this.valpha * ratio);
      },
      rotate(degrees) {
        const hsl = this.hsl();
        let hue = hsl.color[0];
        hue = (hue + degrees) % 360;
        hue = hue < 0 ? 360 + hue : hue;
        hsl.color[0] = hue;
        return hsl;
      },
      mix(mixinColor, weight) {
        if (!mixinColor || !mixinColor.rgb) {
          throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
        }
        const color1 = mixinColor.rgb();
        const color2 = this.rgb();
        const p = weight === void 0 ? 0.5 : weight;
        const w = 2 * p - 1;
        const a = color1.alpha() - color2.alpha();
        const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
        const w2 = 1 - w1;
        return Color.rgb(
          w1 * color1.red() + w2 * color2.red(),
          w1 * color1.green() + w2 * color2.green(),
          w1 * color1.blue() + w2 * color2.blue(),
          color1.alpha() * p + color2.alpha() * (1 - p)
        );
      }
    };
    for (const model of Object.keys(convert)) {
      if (skippedModels.includes(model)) {
        continue;
      }
      const { channels } = convert[model];
      Color.prototype[model] = function(...args) {
        if (this.model === model) {
          return new Color(this);
        }
        if (args.length > 0) {
          return new Color(args, model);
        }
        return new Color([...assertArray(convert[this.model][model].raw(this.color)), this.valpha], model);
      };
      Color[model] = function(...args) {
        let color = args[0];
        if (typeof color === "number") {
          color = zeroArray(args, channels);
        }
        return new Color(color, model);
      };
    }
    function roundTo(number, places) {
      return Number(number.toFixed(places));
    }
    function roundToPlace(places) {
      return function(number) {
        return roundTo(number, places);
      };
    }
    function getset(model, channel, modifier) {
      model = Array.isArray(model) ? model : [model];
      for (const m of model) {
        (limiters[m] || (limiters[m] = []))[channel] = modifier;
      }
      model = model[0];
      return function(value) {
        let result;
        if (value !== void 0) {
          if (modifier) {
            value = modifier(value);
          }
          result = this[model]();
          result.color[channel] = value;
          return result;
        }
        result = this[model]().color[channel];
        if (modifier) {
          result = modifier(result);
        }
        return result;
      };
    }
    function maxfn(max) {
      return function(v) {
        return Math.max(0, Math.min(max, v));
      };
    }
    function assertArray(value) {
      return Array.isArray(value) ? value : [value];
    }
    function zeroArray(array, length) {
      for (let i = 0; i < length; i++) {
        if (typeof array[i] !== "number") {
          array[i] = 0;
        }
      }
      return array;
    }
    module2.exports = Color;
  }
});

// node_modules/sharp/lib/input.js
var require_input = __commonJS({
  "node_modules/sharp/lib/input.js"(exports2, module2) {
    "use strict";
    var color = require_color();
    var is = require_is();
    var sharp = require_sharp();
    var align = {
      left: "low",
      center: "centre",
      centre: "centre",
      right: "high"
    };
    function _inputOptionsFromObject(obj) {
      const { raw, density, limitInputPixels, ignoreIcc, unlimited, sequentialRead, failOn, failOnError, animated, page, pages, subifd } = obj;
      return [raw, density, limitInputPixels, ignoreIcc, unlimited, sequentialRead, failOn, failOnError, animated, page, pages, subifd].some(is.defined) ? { raw, density, limitInputPixels, ignoreIcc, unlimited, sequentialRead, failOn, failOnError, animated, page, pages, subifd } : void 0;
    }
    function _createInputDescriptor(input, inputOptions, containerOptions) {
      const inputDescriptor = {
        failOn: "warning",
        limitInputPixels: Math.pow(16383, 2),
        ignoreIcc: false,
        unlimited: false,
        sequentialRead: true
      };
      if (is.string(input)) {
        inputDescriptor.file = input;
      } else if (is.buffer(input)) {
        if (input.length === 0) {
          throw Error("Input Buffer is empty");
        }
        inputDescriptor.buffer = input;
      } else if (is.arrayBuffer(input)) {
        if (input.byteLength === 0) {
          throw Error("Input bit Array is empty");
        }
        inputDescriptor.buffer = Buffer.from(input, 0, input.byteLength);
      } else if (is.typedArray(input)) {
        if (input.length === 0) {
          throw Error("Input Bit Array is empty");
        }
        inputDescriptor.buffer = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
      } else if (is.plainObject(input) && !is.defined(inputOptions)) {
        inputOptions = input;
        if (_inputOptionsFromObject(inputOptions)) {
          inputDescriptor.buffer = [];
        }
      } else if (!is.defined(input) && !is.defined(inputOptions) && is.object(containerOptions) && containerOptions.allowStream) {
        inputDescriptor.buffer = [];
      } else {
        throw new Error(`Unsupported input '${input}' of type ${typeof input}${is.defined(inputOptions) ? ` when also providing options of type ${typeof inputOptions}` : ""}`);
      }
      if (is.object(inputOptions)) {
        if (is.defined(inputOptions.failOnError)) {
          if (is.bool(inputOptions.failOnError)) {
            inputDescriptor.failOn = inputOptions.failOnError ? "warning" : "none";
          } else {
            throw is.invalidParameterError("failOnError", "boolean", inputOptions.failOnError);
          }
        }
        if (is.defined(inputOptions.failOn)) {
          if (is.string(inputOptions.failOn) && is.inArray(inputOptions.failOn, ["none", "truncated", "error", "warning"])) {
            inputDescriptor.failOn = inputOptions.failOn;
          } else {
            throw is.invalidParameterError("failOn", "one of: none, truncated, error, warning", inputOptions.failOn);
          }
        }
        if (is.defined(inputOptions.density)) {
          if (is.inRange(inputOptions.density, 1, 1e5)) {
            inputDescriptor.density = inputOptions.density;
          } else {
            throw is.invalidParameterError("density", "number between 1 and 100000", inputOptions.density);
          }
        }
        if (is.defined(inputOptions.ignoreIcc)) {
          if (is.bool(inputOptions.ignoreIcc)) {
            inputDescriptor.ignoreIcc = inputOptions.ignoreIcc;
          } else {
            throw is.invalidParameterError("ignoreIcc", "boolean", inputOptions.ignoreIcc);
          }
        }
        if (is.defined(inputOptions.limitInputPixels)) {
          if (is.bool(inputOptions.limitInputPixels)) {
            inputDescriptor.limitInputPixels = inputOptions.limitInputPixels ? Math.pow(16383, 2) : 0;
          } else if (is.integer(inputOptions.limitInputPixels) && is.inRange(inputOptions.limitInputPixels, 0, Number.MAX_SAFE_INTEGER)) {
            inputDescriptor.limitInputPixels = inputOptions.limitInputPixels;
          } else {
            throw is.invalidParameterError("limitInputPixels", "positive integer", inputOptions.limitInputPixels);
          }
        }
        if (is.defined(inputOptions.unlimited)) {
          if (is.bool(inputOptions.unlimited)) {
            inputDescriptor.unlimited = inputOptions.unlimited;
          } else {
            throw is.invalidParameterError("unlimited", "boolean", inputOptions.unlimited);
          }
        }
        if (is.defined(inputOptions.sequentialRead)) {
          if (is.bool(inputOptions.sequentialRead)) {
            inputDescriptor.sequentialRead = inputOptions.sequentialRead;
          } else {
            throw is.invalidParameterError("sequentialRead", "boolean", inputOptions.sequentialRead);
          }
        }
        if (is.defined(inputOptions.raw)) {
          if (is.object(inputOptions.raw) && is.integer(inputOptions.raw.width) && inputOptions.raw.width > 0 && is.integer(inputOptions.raw.height) && inputOptions.raw.height > 0 && is.integer(inputOptions.raw.channels) && is.inRange(inputOptions.raw.channels, 1, 4)) {
            inputDescriptor.rawWidth = inputOptions.raw.width;
            inputDescriptor.rawHeight = inputOptions.raw.height;
            inputDescriptor.rawChannels = inputOptions.raw.channels;
            inputDescriptor.rawPremultiplied = !!inputOptions.raw.premultiplied;
            switch (input.constructor) {
              case Uint8Array:
              case Uint8ClampedArray:
                inputDescriptor.rawDepth = "uchar";
                break;
              case Int8Array:
                inputDescriptor.rawDepth = "char";
                break;
              case Uint16Array:
                inputDescriptor.rawDepth = "ushort";
                break;
              case Int16Array:
                inputDescriptor.rawDepth = "short";
                break;
              case Uint32Array:
                inputDescriptor.rawDepth = "uint";
                break;
              case Int32Array:
                inputDescriptor.rawDepth = "int";
                break;
              case Float32Array:
                inputDescriptor.rawDepth = "float";
                break;
              case Float64Array:
                inputDescriptor.rawDepth = "double";
                break;
              default:
                inputDescriptor.rawDepth = "uchar";
                break;
            }
          } else {
            throw new Error("Expected width, height and channels for raw pixel input");
          }
        }
        if (is.defined(inputOptions.animated)) {
          if (is.bool(inputOptions.animated)) {
            inputDescriptor.pages = inputOptions.animated ? -1 : 1;
          } else {
            throw is.invalidParameterError("animated", "boolean", inputOptions.animated);
          }
        }
        if (is.defined(inputOptions.pages)) {
          if (is.integer(inputOptions.pages) && is.inRange(inputOptions.pages, -1, 1e5)) {
            inputDescriptor.pages = inputOptions.pages;
          } else {
            throw is.invalidParameterError("pages", "integer between -1 and 100000", inputOptions.pages);
          }
        }
        if (is.defined(inputOptions.page)) {
          if (is.integer(inputOptions.page) && is.inRange(inputOptions.page, 0, 1e5)) {
            inputDescriptor.page = inputOptions.page;
          } else {
            throw is.invalidParameterError("page", "integer between 0 and 100000", inputOptions.page);
          }
        }
        if (is.defined(inputOptions.level)) {
          if (is.integer(inputOptions.level) && is.inRange(inputOptions.level, 0, 256)) {
            inputDescriptor.level = inputOptions.level;
          } else {
            throw is.invalidParameterError("level", "integer between 0 and 256", inputOptions.level);
          }
        }
        if (is.defined(inputOptions.subifd)) {
          if (is.integer(inputOptions.subifd) && is.inRange(inputOptions.subifd, -1, 1e5)) {
            inputDescriptor.subifd = inputOptions.subifd;
          } else {
            throw is.invalidParameterError("subifd", "integer between -1 and 100000", inputOptions.subifd);
          }
        }
        if (is.defined(inputOptions.create)) {
          if (is.object(inputOptions.create) && is.integer(inputOptions.create.width) && inputOptions.create.width > 0 && is.integer(inputOptions.create.height) && inputOptions.create.height > 0 && is.integer(inputOptions.create.channels)) {
            inputDescriptor.createWidth = inputOptions.create.width;
            inputDescriptor.createHeight = inputOptions.create.height;
            inputDescriptor.createChannels = inputOptions.create.channels;
            if (is.defined(inputOptions.create.noise)) {
              if (!is.object(inputOptions.create.noise)) {
                throw new Error("Expected noise to be an object");
              }
              if (!is.inArray(inputOptions.create.noise.type, ["gaussian"])) {
                throw new Error("Only gaussian noise is supported at the moment");
              }
              if (!is.inRange(inputOptions.create.channels, 1, 4)) {
                throw is.invalidParameterError("create.channels", "number between 1 and 4", inputOptions.create.channels);
              }
              inputDescriptor.createNoiseType = inputOptions.create.noise.type;
              if (is.number(inputOptions.create.noise.mean) && is.inRange(inputOptions.create.noise.mean, 0, 1e4)) {
                inputDescriptor.createNoiseMean = inputOptions.create.noise.mean;
              } else {
                throw is.invalidParameterError("create.noise.mean", "number between 0 and 10000", inputOptions.create.noise.mean);
              }
              if (is.number(inputOptions.create.noise.sigma) && is.inRange(inputOptions.create.noise.sigma, 0, 1e4)) {
                inputDescriptor.createNoiseSigma = inputOptions.create.noise.sigma;
              } else {
                throw is.invalidParameterError("create.noise.sigma", "number between 0 and 10000", inputOptions.create.noise.sigma);
              }
            } else if (is.defined(inputOptions.create.background)) {
              if (!is.inRange(inputOptions.create.channels, 3, 4)) {
                throw is.invalidParameterError("create.channels", "number between 3 and 4", inputOptions.create.channels);
              }
              const background = color(inputOptions.create.background);
              inputDescriptor.createBackground = [
                background.red(),
                background.green(),
                background.blue(),
                Math.round(background.alpha() * 255)
              ];
            } else {
              throw new Error("Expected valid noise or background to create a new input image");
            }
            delete inputDescriptor.buffer;
          } else {
            throw new Error("Expected valid width, height and channels to create a new input image");
          }
        }
        if (is.defined(inputOptions.text)) {
          if (is.object(inputOptions.text) && is.string(inputOptions.text.text)) {
            inputDescriptor.textValue = inputOptions.text.text;
            if (is.defined(inputOptions.text.height) && is.defined(inputOptions.text.dpi)) {
              throw new Error("Expected only one of dpi or height");
            }
            if (is.defined(inputOptions.text.font)) {
              if (is.string(inputOptions.text.font)) {
                inputDescriptor.textFont = inputOptions.text.font;
              } else {
                throw is.invalidParameterError("text.font", "string", inputOptions.text.font);
              }
            }
            if (is.defined(inputOptions.text.fontfile)) {
              if (is.string(inputOptions.text.fontfile)) {
                inputDescriptor.textFontfile = inputOptions.text.fontfile;
              } else {
                throw is.invalidParameterError("text.fontfile", "string", inputOptions.text.fontfile);
              }
            }
            if (is.defined(inputOptions.text.width)) {
              if (is.number(inputOptions.text.width)) {
                inputDescriptor.textWidth = inputOptions.text.width;
              } else {
                throw is.invalidParameterError("text.textWidth", "number", inputOptions.text.width);
              }
            }
            if (is.defined(inputOptions.text.height)) {
              if (is.number(inputOptions.text.height)) {
                inputDescriptor.textHeight = inputOptions.text.height;
              } else {
                throw is.invalidParameterError("text.height", "number", inputOptions.text.height);
              }
            }
            if (is.defined(inputOptions.text.align)) {
              if (is.string(inputOptions.text.align) && is.string(this.constructor.align[inputOptions.text.align])) {
                inputDescriptor.textAlign = this.constructor.align[inputOptions.text.align];
              } else {
                throw is.invalidParameterError("text.align", "valid alignment", inputOptions.text.align);
              }
            }
            if (is.defined(inputOptions.text.justify)) {
              if (is.bool(inputOptions.text.justify)) {
                inputDescriptor.textJustify = inputOptions.text.justify;
              } else {
                throw is.invalidParameterError("text.justify", "boolean", inputOptions.text.justify);
              }
            }
            if (is.defined(inputOptions.text.dpi)) {
              if (is.number(inputOptions.text.dpi) && is.inRange(inputOptions.text.dpi, 1, 1e5)) {
                inputDescriptor.textDpi = inputOptions.text.dpi;
              } else {
                throw is.invalidParameterError("text.dpi", "number between 1 and 100000", inputOptions.text.dpi);
              }
            }
            if (is.defined(inputOptions.text.rgba)) {
              if (is.bool(inputOptions.text.rgba)) {
                inputDescriptor.textRgba = inputOptions.text.rgba;
              } else {
                throw is.invalidParameterError("text.rgba", "bool", inputOptions.text.rgba);
              }
            }
            if (is.defined(inputOptions.text.spacing)) {
              if (is.number(inputOptions.text.spacing)) {
                inputDescriptor.textSpacing = inputOptions.text.spacing;
              } else {
                throw is.invalidParameterError("text.spacing", "number", inputOptions.text.spacing);
              }
            }
            if (is.defined(inputOptions.text.wrap)) {
              if (is.string(inputOptions.text.wrap) && is.inArray(inputOptions.text.wrap, ["word", "char", "wordChar", "none"])) {
                inputDescriptor.textWrap = inputOptions.text.wrap;
              } else {
                throw is.invalidParameterError("text.wrap", "one of: word, char, wordChar, none", inputOptions.text.wrap);
              }
            }
            delete inputDescriptor.buffer;
          } else {
            throw new Error("Expected a valid string to create an image with text.");
          }
        }
      } else if (is.defined(inputOptions)) {
        throw new Error("Invalid input options " + inputOptions);
      }
      return inputDescriptor;
    }
    function _write(chunk, encoding, callback) {
      if (Array.isArray(this.options.input.buffer)) {
        if (is.buffer(chunk)) {
          if (this.options.input.buffer.length === 0) {
            this.on("finish", () => {
              this.streamInFinished = true;
            });
          }
          this.options.input.buffer.push(chunk);
          callback();
        } else {
          callback(new Error("Non-Buffer data on Writable Stream"));
        }
      } else {
        callback(new Error("Unexpected data on Writable Stream"));
      }
    }
    function _flattenBufferIn() {
      if (this._isStreamInput()) {
        this.options.input.buffer = Buffer.concat(this.options.input.buffer);
      }
    }
    function _isStreamInput() {
      return Array.isArray(this.options.input.buffer);
    }
    function metadata(callback) {
      if (is.fn(callback)) {
        if (this._isStreamInput()) {
          this.on("finish", () => {
            this._flattenBufferIn();
            sharp.metadata(this.options, callback);
          });
        } else {
          sharp.metadata(this.options, callback);
        }
        return this;
      } else {
        if (this._isStreamInput()) {
          return new Promise((resolve, reject) => {
            const finished = () => {
              this._flattenBufferIn();
              sharp.metadata(this.options, (err, metadata2) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(metadata2);
                }
              });
            };
            if (this.writableFinished) {
              finished();
            } else {
              this.once("finish", finished);
            }
          });
        } else {
          return new Promise((resolve, reject) => {
            sharp.metadata(this.options, (err, metadata2) => {
              if (err) {
                reject(err);
              } else {
                resolve(metadata2);
              }
            });
          });
        }
      }
    }
    function stats(callback) {
      if (is.fn(callback)) {
        if (this._isStreamInput()) {
          this.on("finish", () => {
            this._flattenBufferIn();
            sharp.stats(this.options, callback);
          });
        } else {
          sharp.stats(this.options, callback);
        }
        return this;
      } else {
        if (this._isStreamInput()) {
          return new Promise((resolve, reject) => {
            this.on("finish", function() {
              this._flattenBufferIn();
              sharp.stats(this.options, (err, stats2) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(stats2);
                }
              });
            });
          });
        } else {
          return new Promise((resolve, reject) => {
            sharp.stats(this.options, (err, stats2) => {
              if (err) {
                reject(err);
              } else {
                resolve(stats2);
              }
            });
          });
        }
      }
    }
    module2.exports = function(Sharp) {
      Object.assign(Sharp.prototype, {
        // Private
        _inputOptionsFromObject,
        _createInputDescriptor,
        _write,
        _flattenBufferIn,
        _isStreamInput,
        // Public
        metadata,
        stats
      });
      Sharp.align = align;
    };
  }
});

// node_modules/sharp/lib/resize.js
var require_resize = __commonJS({
  "node_modules/sharp/lib/resize.js"(exports2, module2) {
    "use strict";
    var is = require_is();
    var gravity = {
      center: 0,
      centre: 0,
      north: 1,
      east: 2,
      south: 3,
      west: 4,
      northeast: 5,
      southeast: 6,
      southwest: 7,
      northwest: 8
    };
    var position = {
      top: 1,
      right: 2,
      bottom: 3,
      left: 4,
      "right top": 5,
      "right bottom": 6,
      "left bottom": 7,
      "left top": 8
    };
    var extendWith = {
      background: "background",
      copy: "copy",
      repeat: "repeat",
      mirror: "mirror"
    };
    var strategy = {
      entropy: 16,
      attention: 17
    };
    var kernel = {
      nearest: "nearest",
      cubic: "cubic",
      mitchell: "mitchell",
      lanczos2: "lanczos2",
      lanczos3: "lanczos3"
    };
    var fit = {
      contain: "contain",
      cover: "cover",
      fill: "fill",
      inside: "inside",
      outside: "outside"
    };
    var mapFitToCanvas = {
      contain: "embed",
      cover: "crop",
      fill: "ignore_aspect",
      inside: "max",
      outside: "min"
    };
    function isRotationExpected(options) {
      return options.angle % 360 !== 0 || options.useExifOrientation === true || options.rotationAngle !== 0;
    }
    function isResizeExpected(options) {
      return options.width !== -1 || options.height !== -1;
    }
    function resize(widthOrOptions, height, options) {
      if (isResizeExpected(this.options)) {
        this.options.debuglog("ignoring previous resize options");
      }
      if (is.defined(widthOrOptions)) {
        if (is.object(widthOrOptions) && !is.defined(options)) {
          options = widthOrOptions;
        } else if (is.integer(widthOrOptions) && widthOrOptions > 0) {
          this.options.width = widthOrOptions;
        } else {
          throw is.invalidParameterError("width", "positive integer", widthOrOptions);
        }
      } else {
        this.options.width = -1;
      }
      if (is.defined(height)) {
        if (is.integer(height) && height > 0) {
          this.options.height = height;
        } else {
          throw is.invalidParameterError("height", "positive integer", height);
        }
      } else {
        this.options.height = -1;
      }
      if (is.object(options)) {
        if (is.defined(options.width)) {
          if (is.integer(options.width) && options.width > 0) {
            this.options.width = options.width;
          } else {
            throw is.invalidParameterError("width", "positive integer", options.width);
          }
        }
        if (is.defined(options.height)) {
          if (is.integer(options.height) && options.height > 0) {
            this.options.height = options.height;
          } else {
            throw is.invalidParameterError("height", "positive integer", options.height);
          }
        }
        if (is.defined(options.fit)) {
          const canvas = mapFitToCanvas[options.fit];
          if (is.string(canvas)) {
            this.options.canvas = canvas;
          } else {
            throw is.invalidParameterError("fit", "valid fit", options.fit);
          }
        }
        if (is.defined(options.position)) {
          const pos = is.integer(options.position) ? options.position : strategy[options.position] || position[options.position] || gravity[options.position];
          if (is.integer(pos) && (is.inRange(pos, 0, 8) || is.inRange(pos, 16, 17))) {
            this.options.position = pos;
          } else {
            throw is.invalidParameterError("position", "valid position/gravity/strategy", options.position);
          }
        }
        this._setBackgroundColourOption("resizeBackground", options.background);
        if (is.defined(options.kernel)) {
          if (is.string(kernel[options.kernel])) {
            this.options.kernel = kernel[options.kernel];
          } else {
            throw is.invalidParameterError("kernel", "valid kernel name", options.kernel);
          }
        }
        if (is.defined(options.withoutEnlargement)) {
          this._setBooleanOption("withoutEnlargement", options.withoutEnlargement);
        }
        if (is.defined(options.withoutReduction)) {
          this._setBooleanOption("withoutReduction", options.withoutReduction);
        }
        if (is.defined(options.fastShrinkOnLoad)) {
          this._setBooleanOption("fastShrinkOnLoad", options.fastShrinkOnLoad);
        }
      }
      if (isRotationExpected(this.options) && isResizeExpected(this.options)) {
        this.options.rotateBeforePreExtract = true;
      }
      return this;
    }
    function extend(extend2) {
      if (is.integer(extend2) && extend2 > 0) {
        this.options.extendTop = extend2;
        this.options.extendBottom = extend2;
        this.options.extendLeft = extend2;
        this.options.extendRight = extend2;
      } else if (is.object(extend2)) {
        if (is.defined(extend2.top)) {
          if (is.integer(extend2.top) && extend2.top >= 0) {
            this.options.extendTop = extend2.top;
          } else {
            throw is.invalidParameterError("top", "positive integer", extend2.top);
          }
        }
        if (is.defined(extend2.bottom)) {
          if (is.integer(extend2.bottom) && extend2.bottom >= 0) {
            this.options.extendBottom = extend2.bottom;
          } else {
            throw is.invalidParameterError("bottom", "positive integer", extend2.bottom);
          }
        }
        if (is.defined(extend2.left)) {
          if (is.integer(extend2.left) && extend2.left >= 0) {
            this.options.extendLeft = extend2.left;
          } else {
            throw is.invalidParameterError("left", "positive integer", extend2.left);
          }
        }
        if (is.defined(extend2.right)) {
          if (is.integer(extend2.right) && extend2.right >= 0) {
            this.options.extendRight = extend2.right;
          } else {
            throw is.invalidParameterError("right", "positive integer", extend2.right);
          }
        }
        this._setBackgroundColourOption("extendBackground", extend2.background);
        if (is.defined(extend2.extendWith)) {
          if (is.string(extendWith[extend2.extendWith])) {
            this.options.extendWith = extendWith[extend2.extendWith];
          } else {
            throw is.invalidParameterError("extendWith", "one of: background, copy, repeat, mirror", extend2.extendWith);
          }
        }
      } else {
        throw is.invalidParameterError("extend", "integer or object", extend2);
      }
      return this;
    }
    function extract(options) {
      const suffix = isResizeExpected(this.options) || this.options.widthPre !== -1 ? "Post" : "Pre";
      if (this.options[`width${suffix}`] !== -1) {
        this.options.debuglog("ignoring previous extract options");
      }
      ["left", "top", "width", "height"].forEach(function(name) {
        const value = options[name];
        if (is.integer(value) && value >= 0) {
          this.options[name + (name === "left" || name === "top" ? "Offset" : "") + suffix] = value;
        } else {
          throw is.invalidParameterError(name, "integer", value);
        }
      }, this);
      if (isRotationExpected(this.options) && !isResizeExpected(this.options)) {
        if (this.options.widthPre === -1 || this.options.widthPost === -1) {
          this.options.rotateBeforePreExtract = true;
        }
      }
      return this;
    }
    function trim(trim2) {
      if (!is.defined(trim2)) {
        this.options.trimThreshold = 10;
      } else if (is.string(trim2)) {
        this._setBackgroundColourOption("trimBackground", trim2);
        this.options.trimThreshold = 10;
      } else if (is.number(trim2)) {
        if (trim2 >= 0) {
          this.options.trimThreshold = trim2;
        } else {
          throw is.invalidParameterError("threshold", "positive number", trim2);
        }
      } else if (is.object(trim2)) {
        this._setBackgroundColourOption("trimBackground", trim2.background);
        if (!is.defined(trim2.threshold)) {
          this.options.trimThreshold = 10;
        } else if (is.number(trim2.threshold) && trim2.threshold >= 0) {
          this.options.trimThreshold = trim2.threshold;
        } else {
          throw is.invalidParameterError("threshold", "positive number", trim2);
        }
      } else {
        throw is.invalidParameterError("trim", "string, number or object", trim2);
      }
      if (isRotationExpected(this.options)) {
        this.options.rotateBeforePreExtract = true;
      }
      return this;
    }
    module2.exports = function(Sharp) {
      Object.assign(Sharp.prototype, {
        resize,
        extend,
        extract,
        trim
      });
      Sharp.gravity = gravity;
      Sharp.strategy = strategy;
      Sharp.kernel = kernel;
      Sharp.fit = fit;
      Sharp.position = position;
    };
  }
});

// node_modules/sharp/lib/composite.js
var require_composite = __commonJS({
  "node_modules/sharp/lib/composite.js"(exports2, module2) {
    "use strict";
    var is = require_is();
    var blend = {
      clear: "clear",
      source: "source",
      over: "over",
      in: "in",
      out: "out",
      atop: "atop",
      dest: "dest",
      "dest-over": "dest-over",
      "dest-in": "dest-in",
      "dest-out": "dest-out",
      "dest-atop": "dest-atop",
      xor: "xor",
      add: "add",
      saturate: "saturate",
      multiply: "multiply",
      screen: "screen",
      overlay: "overlay",
      darken: "darken",
      lighten: "lighten",
      "colour-dodge": "colour-dodge",
      "color-dodge": "colour-dodge",
      "colour-burn": "colour-burn",
      "color-burn": "colour-burn",
      "hard-light": "hard-light",
      "soft-light": "soft-light",
      difference: "difference",
      exclusion: "exclusion"
    };
    function composite(images) {
      if (!Array.isArray(images)) {
        throw is.invalidParameterError("images to composite", "array", images);
      }
      this.options.composite = images.map((image) => {
        if (!is.object(image)) {
          throw is.invalidParameterError("image to composite", "object", image);
        }
        const inputOptions = this._inputOptionsFromObject(image);
        const composite2 = {
          input: this._createInputDescriptor(image.input, inputOptions, { allowStream: false }),
          blend: "over",
          tile: false,
          left: 0,
          top: 0,
          hasOffset: false,
          gravity: 0,
          premultiplied: false
        };
        if (is.defined(image.blend)) {
          if (is.string(blend[image.blend])) {
            composite2.blend = blend[image.blend];
          } else {
            throw is.invalidParameterError("blend", "valid blend name", image.blend);
          }
        }
        if (is.defined(image.tile)) {
          if (is.bool(image.tile)) {
            composite2.tile = image.tile;
          } else {
            throw is.invalidParameterError("tile", "boolean", image.tile);
          }
        }
        if (is.defined(image.left)) {
          if (is.integer(image.left)) {
            composite2.left = image.left;
          } else {
            throw is.invalidParameterError("left", "integer", image.left);
          }
        }
        if (is.defined(image.top)) {
          if (is.integer(image.top)) {
            composite2.top = image.top;
          } else {
            throw is.invalidParameterError("top", "integer", image.top);
          }
        }
        if (is.defined(image.top) !== is.defined(image.left)) {
          throw new Error("Expected both left and top to be set");
        } else {
          composite2.hasOffset = is.integer(image.top) && is.integer(image.left);
        }
        if (is.defined(image.gravity)) {
          if (is.integer(image.gravity) && is.inRange(image.gravity, 0, 8)) {
            composite2.gravity = image.gravity;
          } else if (is.string(image.gravity) && is.integer(this.constructor.gravity[image.gravity])) {
            composite2.gravity = this.constructor.gravity[image.gravity];
          } else {
            throw is.invalidParameterError("gravity", "valid gravity", image.gravity);
          }
        }
        if (is.defined(image.premultiplied)) {
          if (is.bool(image.premultiplied)) {
            composite2.premultiplied = image.premultiplied;
          } else {
            throw is.invalidParameterError("premultiplied", "boolean", image.premultiplied);
          }
        }
        return composite2;
      });
      return this;
    }
    module2.exports = function(Sharp) {
      Sharp.prototype.composite = composite;
      Sharp.blend = blend;
    };
  }
});

// node_modules/sharp/lib/operation.js
var require_operation = __commonJS({
  "node_modules/sharp/lib/operation.js"(exports2, module2) {
    "use strict";
    var color = require_color();
    var is = require_is();
    function rotate(angle, options) {
      if (this.options.useExifOrientation || this.options.angle || this.options.rotationAngle) {
        this.options.debuglog("ignoring previous rotate options");
      }
      if (!is.defined(angle)) {
        this.options.useExifOrientation = true;
      } else if (is.integer(angle) && !(angle % 90)) {
        this.options.angle = angle;
      } else if (is.number(angle)) {
        this.options.rotationAngle = angle;
        if (is.object(options) && options.background) {
          const backgroundColour = color(options.background);
          this.options.rotationBackground = [
            backgroundColour.red(),
            backgroundColour.green(),
            backgroundColour.blue(),
            Math.round(backgroundColour.alpha() * 255)
          ];
        }
      } else {
        throw is.invalidParameterError("angle", "numeric", angle);
      }
      return this;
    }
    function flip(flip2) {
      this.options.flip = is.bool(flip2) ? flip2 : true;
      return this;
    }
    function flop(flop2) {
      this.options.flop = is.bool(flop2) ? flop2 : true;
      return this;
    }
    function affine(matrix, options) {
      const flatMatrix = [].concat(...matrix);
      if (flatMatrix.length === 4 && flatMatrix.every(is.number)) {
        this.options.affineMatrix = flatMatrix;
      } else {
        throw is.invalidParameterError("matrix", "1x4 or 2x2 array", matrix);
      }
      if (is.defined(options)) {
        if (is.object(options)) {
          this._setBackgroundColourOption("affineBackground", options.background);
          if (is.defined(options.idx)) {
            if (is.number(options.idx)) {
              this.options.affineIdx = options.idx;
            } else {
              throw is.invalidParameterError("options.idx", "number", options.idx);
            }
          }
          if (is.defined(options.idy)) {
            if (is.number(options.idy)) {
              this.options.affineIdy = options.idy;
            } else {
              throw is.invalidParameterError("options.idy", "number", options.idy);
            }
          }
          if (is.defined(options.odx)) {
            if (is.number(options.odx)) {
              this.options.affineOdx = options.odx;
            } else {
              throw is.invalidParameterError("options.odx", "number", options.odx);
            }
          }
          if (is.defined(options.ody)) {
            if (is.number(options.ody)) {
              this.options.affineOdy = options.ody;
            } else {
              throw is.invalidParameterError("options.ody", "number", options.ody);
            }
          }
          if (is.defined(options.interpolator)) {
            if (is.inArray(options.interpolator, Object.values(this.constructor.interpolators))) {
              this.options.affineInterpolator = options.interpolator;
            } else {
              throw is.invalidParameterError("options.interpolator", "valid interpolator name", options.interpolator);
            }
          }
        } else {
          throw is.invalidParameterError("options", "object", options);
        }
      }
      return this;
    }
    function sharpen(options, flat, jagged) {
      if (!is.defined(options)) {
        this.options.sharpenSigma = -1;
      } else if (is.bool(options)) {
        this.options.sharpenSigma = options ? -1 : 0;
      } else if (is.number(options) && is.inRange(options, 0.01, 1e4)) {
        this.options.sharpenSigma = options;
        if (is.defined(flat)) {
          if (is.number(flat) && is.inRange(flat, 0, 1e4)) {
            this.options.sharpenM1 = flat;
          } else {
            throw is.invalidParameterError("flat", "number between 0 and 10000", flat);
          }
        }
        if (is.defined(jagged)) {
          if (is.number(jagged) && is.inRange(jagged, 0, 1e4)) {
            this.options.sharpenM2 = jagged;
          } else {
            throw is.invalidParameterError("jagged", "number between 0 and 10000", jagged);
          }
        }
      } else if (is.plainObject(options)) {
        if (is.number(options.sigma) && is.inRange(options.sigma, 1e-6, 10)) {
          this.options.sharpenSigma = options.sigma;
        } else {
          throw is.invalidParameterError("options.sigma", "number between 0.000001 and 10", options.sigma);
        }
        if (is.defined(options.m1)) {
          if (is.number(options.m1) && is.inRange(options.m1, 0, 1e6)) {
            this.options.sharpenM1 = options.m1;
          } else {
            throw is.invalidParameterError("options.m1", "number between 0 and 1000000", options.m1);
          }
        }
        if (is.defined(options.m2)) {
          if (is.number(options.m2) && is.inRange(options.m2, 0, 1e6)) {
            this.options.sharpenM2 = options.m2;
          } else {
            throw is.invalidParameterError("options.m2", "number between 0 and 1000000", options.m2);
          }
        }
        if (is.defined(options.x1)) {
          if (is.number(options.x1) && is.inRange(options.x1, 0, 1e6)) {
            this.options.sharpenX1 = options.x1;
          } else {
            throw is.invalidParameterError("options.x1", "number between 0 and 1000000", options.x1);
          }
        }
        if (is.defined(options.y2)) {
          if (is.number(options.y2) && is.inRange(options.y2, 0, 1e6)) {
            this.options.sharpenY2 = options.y2;
          } else {
            throw is.invalidParameterError("options.y2", "number between 0 and 1000000", options.y2);
          }
        }
        if (is.defined(options.y3)) {
          if (is.number(options.y3) && is.inRange(options.y3, 0, 1e6)) {
            this.options.sharpenY3 = options.y3;
          } else {
            throw is.invalidParameterError("options.y3", "number between 0 and 1000000", options.y3);
          }
        }
      } else {
        throw is.invalidParameterError("sigma", "number between 0.01 and 10000", options);
      }
      return this;
    }
    function median(size) {
      if (!is.defined(size)) {
        this.options.medianSize = 3;
      } else if (is.integer(size) && is.inRange(size, 1, 1e3)) {
        this.options.medianSize = size;
      } else {
        throw is.invalidParameterError("size", "integer between 1 and 1000", size);
      }
      return this;
    }
    function blur(sigma) {
      if (!is.defined(sigma)) {
        this.options.blurSigma = -1;
      } else if (is.bool(sigma)) {
        this.options.blurSigma = sigma ? -1 : 0;
      } else if (is.number(sigma) && is.inRange(sigma, 0.3, 1e3)) {
        this.options.blurSigma = sigma;
      } else {
        throw is.invalidParameterError("sigma", "number between 0.3 and 1000", sigma);
      }
      return this;
    }
    function flatten(options) {
      this.options.flatten = is.bool(options) ? options : true;
      if (is.object(options)) {
        this._setBackgroundColourOption("flattenBackground", options.background);
      }
      return this;
    }
    function unflatten() {
      this.options.unflatten = true;
      return this;
    }
    function gamma(gamma2, gammaOut) {
      if (!is.defined(gamma2)) {
        this.options.gamma = 2.2;
      } else if (is.number(gamma2) && is.inRange(gamma2, 1, 3)) {
        this.options.gamma = gamma2;
      } else {
        throw is.invalidParameterError("gamma", "number between 1.0 and 3.0", gamma2);
      }
      if (!is.defined(gammaOut)) {
        this.options.gammaOut = this.options.gamma;
      } else if (is.number(gammaOut) && is.inRange(gammaOut, 1, 3)) {
        this.options.gammaOut = gammaOut;
      } else {
        throw is.invalidParameterError("gammaOut", "number between 1.0 and 3.0", gammaOut);
      }
      return this;
    }
    function negate(options) {
      this.options.negate = is.bool(options) ? options : true;
      if (is.plainObject(options) && "alpha" in options) {
        if (!is.bool(options.alpha)) {
          throw is.invalidParameterError("alpha", "should be boolean value", options.alpha);
        } else {
          this.options.negateAlpha = options.alpha;
        }
      }
      return this;
    }
    function normalise(options) {
      if (is.plainObject(options)) {
        if (is.defined(options.lower)) {
          if (is.number(options.lower) && is.inRange(options.lower, 0, 99)) {
            this.options.normaliseLower = options.lower;
          } else {
            throw is.invalidParameterError("lower", "number between 0 and 99", options.lower);
          }
        }
        if (is.defined(options.upper)) {
          if (is.number(options.upper) && is.inRange(options.upper, 1, 100)) {
            this.options.normaliseUpper = options.upper;
          } else {
            throw is.invalidParameterError("upper", "number between 1 and 100", options.upper);
          }
        }
      }
      if (this.options.normaliseLower >= this.options.normaliseUpper) {
        throw is.invalidParameterError(
          "range",
          "lower to be less than upper",
          `${this.options.normaliseLower} >= ${this.options.normaliseUpper}`
        );
      }
      this.options.normalise = true;
      return this;
    }
    function normalize(options) {
      return this.normalise(options);
    }
    function clahe(options) {
      if (is.plainObject(options)) {
        if (is.integer(options.width) && options.width > 0) {
          this.options.claheWidth = options.width;
        } else {
          throw is.invalidParameterError("width", "integer greater than zero", options.width);
        }
        if (is.integer(options.height) && options.height > 0) {
          this.options.claheHeight = options.height;
        } else {
          throw is.invalidParameterError("height", "integer greater than zero", options.height);
        }
        if (is.defined(options.maxSlope)) {
          if (is.integer(options.maxSlope) && is.inRange(options.maxSlope, 0, 100)) {
            this.options.claheMaxSlope = options.maxSlope;
          } else {
            throw is.invalidParameterError("maxSlope", "integer between 0 and 100", options.maxSlope);
          }
        }
      } else {
        throw is.invalidParameterError("options", "plain object", options);
      }
      return this;
    }
    function convolve(kernel) {
      if (!is.object(kernel) || !Array.isArray(kernel.kernel) || !is.integer(kernel.width) || !is.integer(kernel.height) || !is.inRange(kernel.width, 3, 1001) || !is.inRange(kernel.height, 3, 1001) || kernel.height * kernel.width !== kernel.kernel.length) {
        throw new Error("Invalid convolution kernel");
      }
      if (!is.integer(kernel.scale)) {
        kernel.scale = kernel.kernel.reduce(function(a, b) {
          return a + b;
        }, 0);
      }
      if (kernel.scale < 1) {
        kernel.scale = 1;
      }
      if (!is.integer(kernel.offset)) {
        kernel.offset = 0;
      }
      this.options.convKernel = kernel;
      return this;
    }
    function threshold(threshold2, options) {
      if (!is.defined(threshold2)) {
        this.options.threshold = 128;
      } else if (is.bool(threshold2)) {
        this.options.threshold = threshold2 ? 128 : 0;
      } else if (is.integer(threshold2) && is.inRange(threshold2, 0, 255)) {
        this.options.threshold = threshold2;
      } else {
        throw is.invalidParameterError("threshold", "integer between 0 and 255", threshold2);
      }
      if (!is.object(options) || options.greyscale === true || options.grayscale === true) {
        this.options.thresholdGrayscale = true;
      } else {
        this.options.thresholdGrayscale = false;
      }
      return this;
    }
    function boolean(operand, operator, options) {
      this.options.boolean = this._createInputDescriptor(operand, options);
      if (is.string(operator) && is.inArray(operator, ["and", "or", "eor"])) {
        this.options.booleanOp = operator;
      } else {
        throw is.invalidParameterError("operator", "one of: and, or, eor", operator);
      }
      return this;
    }
    function linear(a, b) {
      if (!is.defined(a) && is.number(b)) {
        a = 1;
      } else if (is.number(a) && !is.defined(b)) {
        b = 0;
      }
      if (!is.defined(a)) {
        this.options.linearA = [];
      } else if (is.number(a)) {
        this.options.linearA = [a];
      } else if (Array.isArray(a) && a.length && a.every(is.number)) {
        this.options.linearA = a;
      } else {
        throw is.invalidParameterError("a", "number or array of numbers", a);
      }
      if (!is.defined(b)) {
        this.options.linearB = [];
      } else if (is.number(b)) {
        this.options.linearB = [b];
      } else if (Array.isArray(b) && b.length && b.every(is.number)) {
        this.options.linearB = b;
      } else {
        throw is.invalidParameterError("b", "number or array of numbers", b);
      }
      if (this.options.linearA.length !== this.options.linearB.length) {
        throw new Error("Expected a and b to be arrays of the same length");
      }
      return this;
    }
    function recomb(inputMatrix) {
      if (!Array.isArray(inputMatrix) || inputMatrix.length !== 3 || inputMatrix[0].length !== 3 || inputMatrix[1].length !== 3 || inputMatrix[2].length !== 3) {
        throw new Error("Invalid recombination matrix");
      }
      this.options.recombMatrix = [
        inputMatrix[0][0],
        inputMatrix[0][1],
        inputMatrix[0][2],
        inputMatrix[1][0],
        inputMatrix[1][1],
        inputMatrix[1][2],
        inputMatrix[2][0],
        inputMatrix[2][1],
        inputMatrix[2][2]
      ].map(Number);
      return this;
    }
    function modulate(options) {
      if (!is.plainObject(options)) {
        throw is.invalidParameterError("options", "plain object", options);
      }
      if ("brightness" in options) {
        if (is.number(options.brightness) && options.brightness >= 0) {
          this.options.brightness = options.brightness;
        } else {
          throw is.invalidParameterError("brightness", "number above zero", options.brightness);
        }
      }
      if ("saturation" in options) {
        if (is.number(options.saturation) && options.saturation >= 0) {
          this.options.saturation = options.saturation;
        } else {
          throw is.invalidParameterError("saturation", "number above zero", options.saturation);
        }
      }
      if ("hue" in options) {
        if (is.integer(options.hue)) {
          this.options.hue = options.hue % 360;
        } else {
          throw is.invalidParameterError("hue", "number", options.hue);
        }
      }
      if ("lightness" in options) {
        if (is.number(options.lightness)) {
          this.options.lightness = options.lightness;
        } else {
          throw is.invalidParameterError("lightness", "number", options.lightness);
        }
      }
      return this;
    }
    module2.exports = function(Sharp) {
      Object.assign(Sharp.prototype, {
        rotate,
        flip,
        flop,
        affine,
        sharpen,
        median,
        blur,
        flatten,
        unflatten,
        gamma,
        negate,
        normalise,
        normalize,
        clahe,
        convolve,
        threshold,
        boolean,
        linear,
        recomb,
        modulate
      });
    };
  }
});

// node_modules/sharp/lib/colour.js
var require_colour = __commonJS({
  "node_modules/sharp/lib/colour.js"(exports2, module2) {
    "use strict";
    var color = require_color();
    var is = require_is();
    var colourspace = {
      multiband: "multiband",
      "b-w": "b-w",
      bw: "b-w",
      cmyk: "cmyk",
      srgb: "srgb"
    };
    function tint(rgb) {
      const colour = color(rgb);
      this.options.tintA = colour.a();
      this.options.tintB = colour.b();
      return this;
    }
    function greyscale(greyscale2) {
      this.options.greyscale = is.bool(greyscale2) ? greyscale2 : true;
      return this;
    }
    function grayscale(grayscale2) {
      return this.greyscale(grayscale2);
    }
    function pipelineColourspace(colourspace2) {
      if (!is.string(colourspace2)) {
        throw is.invalidParameterError("colourspace", "string", colourspace2);
      }
      this.options.colourspaceInput = colourspace2;
      return this;
    }
    function pipelineColorspace(colorspace) {
      return this.pipelineColourspace(colorspace);
    }
    function toColourspace(colourspace2) {
      if (!is.string(colourspace2)) {
        throw is.invalidParameterError("colourspace", "string", colourspace2);
      }
      this.options.colourspace = colourspace2;
      return this;
    }
    function toColorspace(colorspace) {
      return this.toColourspace(colorspace);
    }
    function _setBackgroundColourOption(key, value) {
      if (is.defined(value)) {
        if (is.object(value) || is.string(value)) {
          const colour = color(value);
          this.options[key] = [
            colour.red(),
            colour.green(),
            colour.blue(),
            Math.round(colour.alpha() * 255)
          ];
        } else {
          throw is.invalidParameterError("background", "object or string", value);
        }
      }
    }
    module2.exports = function(Sharp) {
      Object.assign(Sharp.prototype, {
        // Public
        tint,
        greyscale,
        grayscale,
        pipelineColourspace,
        pipelineColorspace,
        toColourspace,
        toColorspace,
        // Private
        _setBackgroundColourOption
      });
      Sharp.colourspace = colourspace;
      Sharp.colorspace = colourspace;
    };
  }
});

// node_modules/sharp/lib/channel.js
var require_channel = __commonJS({
  "node_modules/sharp/lib/channel.js"(exports2, module2) {
    "use strict";
    var is = require_is();
    var bool = {
      and: "and",
      or: "or",
      eor: "eor"
    };
    function removeAlpha() {
      this.options.removeAlpha = true;
      return this;
    }
    function ensureAlpha(alpha) {
      if (is.defined(alpha)) {
        if (is.number(alpha) && is.inRange(alpha, 0, 1)) {
          this.options.ensureAlpha = alpha;
        } else {
          throw is.invalidParameterError("alpha", "number between 0 and 1", alpha);
        }
      } else {
        this.options.ensureAlpha = 1;
      }
      return this;
    }
    function extractChannel(channel) {
      const channelMap = { red: 0, green: 1, blue: 2, alpha: 3 };
      if (Object.keys(channelMap).includes(channel)) {
        channel = channelMap[channel];
      }
      if (is.integer(channel) && is.inRange(channel, 0, 4)) {
        this.options.extractChannel = channel;
      } else {
        throw is.invalidParameterError("channel", "integer or one of: red, green, blue, alpha", channel);
      }
      return this;
    }
    function joinChannel(images, options) {
      if (Array.isArray(images)) {
        images.forEach(function(image) {
          this.options.joinChannelIn.push(this._createInputDescriptor(image, options));
        }, this);
      } else {
        this.options.joinChannelIn.push(this._createInputDescriptor(images, options));
      }
      return this;
    }
    function bandbool(boolOp) {
      if (is.string(boolOp) && is.inArray(boolOp, ["and", "or", "eor"])) {
        this.options.bandBoolOp = boolOp;
      } else {
        throw is.invalidParameterError("boolOp", "one of: and, or, eor", boolOp);
      }
      return this;
    }
    module2.exports = function(Sharp) {
      Object.assign(Sharp.prototype, {
        // Public instance functions
        removeAlpha,
        ensureAlpha,
        extractChannel,
        joinChannel,
        bandbool
      });
      Sharp.bool = bool;
    };
  }
});

// node_modules/sharp/lib/output.js
var require_output = __commonJS({
  "node_modules/sharp/lib/output.js"(exports2, module2) {
    "use strict";
    var path2 = require("path");
    var is = require_is();
    var sharp = require_sharp();
    var formats = /* @__PURE__ */ new Map([
      ["heic", "heif"],
      ["heif", "heif"],
      ["avif", "avif"],
      ["jpeg", "jpeg"],
      ["jpg", "jpeg"],
      ["jpe", "jpeg"],
      ["tile", "tile"],
      ["dz", "tile"],
      ["png", "png"],
      ["raw", "raw"],
      ["tiff", "tiff"],
      ["tif", "tiff"],
      ["webp", "webp"],
      ["gif", "gif"],
      ["jp2", "jp2"],
      ["jpx", "jp2"],
      ["j2k", "jp2"],
      ["j2c", "jp2"],
      ["jxl", "jxl"]
    ]);
    var jp2Regex = /\.(jp[2x]|j2[kc])$/i;
    var errJp2Save = () => new Error("JP2 output requires libvips with support for OpenJPEG");
    var bitdepthFromColourCount = (colours) => 1 << 31 - Math.clz32(Math.ceil(Math.log2(colours)));
    function toFile(fileOut, callback) {
      let err;
      if (!is.string(fileOut)) {
        err = new Error("Missing output file path");
      } else if (is.string(this.options.input.file) && path2.resolve(this.options.input.file) === path2.resolve(fileOut)) {
        err = new Error("Cannot use same file for input and output");
      } else if (jp2Regex.test(path2.extname(fileOut)) && !this.constructor.format.jp2k.output.file) {
        err = errJp2Save();
      }
      if (err) {
        if (is.fn(callback)) {
          callback(err);
        } else {
          return Promise.reject(err);
        }
      } else {
        this.options.fileOut = fileOut;
        return this._pipeline(callback);
      }
      return this;
    }
    function toBuffer(options, callback) {
      if (is.object(options)) {
        this._setBooleanOption("resolveWithObject", options.resolveWithObject);
      } else if (this.options.resolveWithObject) {
        this.options.resolveWithObject = false;
      }
      this.options.fileOut = "";
      return this._pipeline(is.fn(options) ? options : callback);
    }
    function withMetadata(options) {
      this.options.withMetadata = is.bool(options) ? options : true;
      if (is.object(options)) {
        if (is.defined(options.orientation)) {
          if (is.integer(options.orientation) && is.inRange(options.orientation, 1, 8)) {
            this.options.withMetadataOrientation = options.orientation;
          } else {
            throw is.invalidParameterError("orientation", "integer between 1 and 8", options.orientation);
          }
        }
        if (is.defined(options.density)) {
          if (is.number(options.density) && options.density > 0) {
            this.options.withMetadataDensity = options.density;
          } else {
            throw is.invalidParameterError("density", "positive number", options.density);
          }
        }
        if (is.defined(options.icc)) {
          if (is.string(options.icc)) {
            this.options.withMetadataIcc = options.icc;
          } else {
            throw is.invalidParameterError("icc", "string filesystem path to ICC profile", options.icc);
          }
        }
        if (is.defined(options.exif)) {
          if (is.object(options.exif)) {
            for (const [ifd, entries] of Object.entries(options.exif)) {
              if (is.object(entries)) {
                for (const [k, v] of Object.entries(entries)) {
                  if (is.string(v)) {
                    this.options.withMetadataStrs[`exif-${ifd.toLowerCase()}-${k}`] = v;
                  } else {
                    throw is.invalidParameterError(`exif.${ifd}.${k}`, "string", v);
                  }
                }
              } else {
                throw is.invalidParameterError(`exif.${ifd}`, "object", entries);
              }
            }
          } else {
            throw is.invalidParameterError("exif", "object", options.exif);
          }
        }
      }
      return this;
    }
    function toFormat(format, options) {
      const actualFormat = formats.get((is.object(format) && is.string(format.id) ? format.id : format).toLowerCase());
      if (!actualFormat) {
        throw is.invalidParameterError("format", `one of: ${[...formats.keys()].join(", ")}`, format);
      }
      return this[actualFormat](options);
    }
    function jpeg(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.jpegQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.progressive)) {
          this._setBooleanOption("jpegProgressive", options.progressive);
        }
        if (is.defined(options.chromaSubsampling)) {
          if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ["4:2:0", "4:4:4"])) {
            this.options.jpegChromaSubsampling = options.chromaSubsampling;
          } else {
            throw is.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", options.chromaSubsampling);
          }
        }
        const optimiseCoding = is.bool(options.optimizeCoding) ? options.optimizeCoding : options.optimiseCoding;
        if (is.defined(optimiseCoding)) {
          this._setBooleanOption("jpegOptimiseCoding", optimiseCoding);
        }
        if (is.defined(options.mozjpeg)) {
          if (is.bool(options.mozjpeg)) {
            if (options.mozjpeg) {
              this.options.jpegTrellisQuantisation = true;
              this.options.jpegOvershootDeringing = true;
              this.options.jpegOptimiseScans = true;
              this.options.jpegProgressive = true;
              this.options.jpegQuantisationTable = 3;
            }
          } else {
            throw is.invalidParameterError("mozjpeg", "boolean", options.mozjpeg);
          }
        }
        const trellisQuantisation = is.bool(options.trellisQuantization) ? options.trellisQuantization : options.trellisQuantisation;
        if (is.defined(trellisQuantisation)) {
          this._setBooleanOption("jpegTrellisQuantisation", trellisQuantisation);
        }
        if (is.defined(options.overshootDeringing)) {
          this._setBooleanOption("jpegOvershootDeringing", options.overshootDeringing);
        }
        const optimiseScans = is.bool(options.optimizeScans) ? options.optimizeScans : options.optimiseScans;
        if (is.defined(optimiseScans)) {
          this._setBooleanOption("jpegOptimiseScans", optimiseScans);
          if (optimiseScans) {
            this.options.jpegProgressive = true;
          }
        }
        const quantisationTable = is.number(options.quantizationTable) ? options.quantizationTable : options.quantisationTable;
        if (is.defined(quantisationTable)) {
          if (is.integer(quantisationTable) && is.inRange(quantisationTable, 0, 8)) {
            this.options.jpegQuantisationTable = quantisationTable;
          } else {
            throw is.invalidParameterError("quantisationTable", "integer between 0 and 8", quantisationTable);
          }
        }
      }
      return this._updateFormatOut("jpeg", options);
    }
    function png(options) {
      if (is.object(options)) {
        if (is.defined(options.progressive)) {
          this._setBooleanOption("pngProgressive", options.progressive);
        }
        if (is.defined(options.compressionLevel)) {
          if (is.integer(options.compressionLevel) && is.inRange(options.compressionLevel, 0, 9)) {
            this.options.pngCompressionLevel = options.compressionLevel;
          } else {
            throw is.invalidParameterError("compressionLevel", "integer between 0 and 9", options.compressionLevel);
          }
        }
        if (is.defined(options.adaptiveFiltering)) {
          this._setBooleanOption("pngAdaptiveFiltering", options.adaptiveFiltering);
        }
        const colours = options.colours || options.colors;
        if (is.defined(colours)) {
          if (is.integer(colours) && is.inRange(colours, 2, 256)) {
            this.options.pngBitdepth = bitdepthFromColourCount(colours);
          } else {
            throw is.invalidParameterError("colours", "integer between 2 and 256", colours);
          }
        }
        if (is.defined(options.palette)) {
          this._setBooleanOption("pngPalette", options.palette);
        } else if ([options.quality, options.effort, options.colours, options.colors, options.dither].some(is.defined)) {
          this._setBooleanOption("pngPalette", true);
        }
        if (this.options.pngPalette) {
          if (is.defined(options.quality)) {
            if (is.integer(options.quality) && is.inRange(options.quality, 0, 100)) {
              this.options.pngQuality = options.quality;
            } else {
              throw is.invalidParameterError("quality", "integer between 0 and 100", options.quality);
            }
          }
          if (is.defined(options.effort)) {
            if (is.integer(options.effort) && is.inRange(options.effort, 1, 10)) {
              this.options.pngEffort = options.effort;
            } else {
              throw is.invalidParameterError("effort", "integer between 1 and 10", options.effort);
            }
          }
          if (is.defined(options.dither)) {
            if (is.number(options.dither) && is.inRange(options.dither, 0, 1)) {
              this.options.pngDither = options.dither;
            } else {
              throw is.invalidParameterError("dither", "number between 0.0 and 1.0", options.dither);
            }
          }
        }
      }
      return this._updateFormatOut("png", options);
    }
    function webp(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.webpQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.alphaQuality)) {
          if (is.integer(options.alphaQuality) && is.inRange(options.alphaQuality, 0, 100)) {
            this.options.webpAlphaQuality = options.alphaQuality;
          } else {
            throw is.invalidParameterError("alphaQuality", "integer between 0 and 100", options.alphaQuality);
          }
        }
        if (is.defined(options.lossless)) {
          this._setBooleanOption("webpLossless", options.lossless);
        }
        if (is.defined(options.nearLossless)) {
          this._setBooleanOption("webpNearLossless", options.nearLossless);
        }
        if (is.defined(options.smartSubsample)) {
          this._setBooleanOption("webpSmartSubsample", options.smartSubsample);
        }
        if (is.defined(options.preset)) {
          if (is.string(options.preset) && is.inArray(options.preset, ["default", "photo", "picture", "drawing", "icon", "text"])) {
            this.options.webpPreset = options.preset;
          } else {
            throw is.invalidParameterError("preset", "one of: default, photo, picture, drawing, icon, text", options.preset);
          }
        }
        if (is.defined(options.effort)) {
          if (is.integer(options.effort) && is.inRange(options.effort, 0, 6)) {
            this.options.webpEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 0 and 6", options.effort);
          }
        }
        if (is.defined(options.minSize)) {
          this._setBooleanOption("webpMinSize", options.minSize);
        }
        if (is.defined(options.mixed)) {
          this._setBooleanOption("webpMixed", options.mixed);
        }
      }
      trySetAnimationOptions(options, this.options);
      return this._updateFormatOut("webp", options);
    }
    function gif(options) {
      if (is.object(options)) {
        if (is.defined(options.reuse)) {
          this._setBooleanOption("gifReuse", options.reuse);
        }
        if (is.defined(options.progressive)) {
          this._setBooleanOption("gifProgressive", options.progressive);
        }
        const colours = options.colours || options.colors;
        if (is.defined(colours)) {
          if (is.integer(colours) && is.inRange(colours, 2, 256)) {
            this.options.gifBitdepth = bitdepthFromColourCount(colours);
          } else {
            throw is.invalidParameterError("colours", "integer between 2 and 256", colours);
          }
        }
        if (is.defined(options.effort)) {
          if (is.number(options.effort) && is.inRange(options.effort, 1, 10)) {
            this.options.gifEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 1 and 10", options.effort);
          }
        }
        if (is.defined(options.dither)) {
          if (is.number(options.dither) && is.inRange(options.dither, 0, 1)) {
            this.options.gifDither = options.dither;
          } else {
            throw is.invalidParameterError("dither", "number between 0.0 and 1.0", options.dither);
          }
        }
        if (is.defined(options.interFrameMaxError)) {
          if (is.number(options.interFrameMaxError) && is.inRange(options.interFrameMaxError, 0, 32)) {
            this.options.gifInterFrameMaxError = options.interFrameMaxError;
          } else {
            throw is.invalidParameterError("interFrameMaxError", "number between 0.0 and 32.0", options.interFrameMaxError);
          }
        }
        if (is.defined(options.interPaletteMaxError)) {
          if (is.number(options.interPaletteMaxError) && is.inRange(options.interPaletteMaxError, 0, 256)) {
            this.options.gifInterPaletteMaxError = options.interPaletteMaxError;
          } else {
            throw is.invalidParameterError("interPaletteMaxError", "number between 0.0 and 256.0", options.interPaletteMaxError);
          }
        }
      }
      trySetAnimationOptions(options, this.options);
      return this._updateFormatOut("gif", options);
    }
    function jp2(options) {
      if (!this.constructor.format.jp2k.output.buffer) {
        throw errJp2Save();
      }
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.jp2Quality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.lossless)) {
          if (is.bool(options.lossless)) {
            this.options.jp2Lossless = options.lossless;
          } else {
            throw is.invalidParameterError("lossless", "boolean", options.lossless);
          }
        }
        if (is.defined(options.tileWidth)) {
          if (is.integer(options.tileWidth) && is.inRange(options.tileWidth, 1, 32768)) {
            this.options.jp2TileWidth = options.tileWidth;
          } else {
            throw is.invalidParameterError("tileWidth", "integer between 1 and 32768", options.tileWidth);
          }
        }
        if (is.defined(options.tileHeight)) {
          if (is.integer(options.tileHeight) && is.inRange(options.tileHeight, 1, 32768)) {
            this.options.jp2TileHeight = options.tileHeight;
          } else {
            throw is.invalidParameterError("tileHeight", "integer between 1 and 32768", options.tileHeight);
          }
        }
        if (is.defined(options.chromaSubsampling)) {
          if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ["4:2:0", "4:4:4"])) {
            this.options.jp2ChromaSubsampling = options.chromaSubsampling;
          } else {
            throw is.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", options.chromaSubsampling);
          }
        }
      }
      return this._updateFormatOut("jp2", options);
    }
    function trySetAnimationOptions(source, target) {
      if (is.object(source) && is.defined(source.loop)) {
        if (is.integer(source.loop) && is.inRange(source.loop, 0, 65535)) {
          target.loop = source.loop;
        } else {
          throw is.invalidParameterError("loop", "integer between 0 and 65535", source.loop);
        }
      }
      if (is.object(source) && is.defined(source.delay)) {
        if (is.integer(source.delay) && is.inRange(source.delay, 0, 65535)) {
          target.delay = [source.delay];
        } else if (Array.isArray(source.delay) && source.delay.every(is.integer) && source.delay.every((v) => is.inRange(v, 0, 65535))) {
          target.delay = source.delay;
        } else {
          throw is.invalidParameterError("delay", "integer or an array of integers between 0 and 65535", source.delay);
        }
      }
    }
    function tiff(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.tiffQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.bitdepth)) {
          if (is.integer(options.bitdepth) && is.inArray(options.bitdepth, [1, 2, 4, 8])) {
            this.options.tiffBitdepth = options.bitdepth;
          } else {
            throw is.invalidParameterError("bitdepth", "1, 2, 4 or 8", options.bitdepth);
          }
        }
        if (is.defined(options.tile)) {
          this._setBooleanOption("tiffTile", options.tile);
        }
        if (is.defined(options.tileWidth)) {
          if (is.integer(options.tileWidth) && options.tileWidth > 0) {
            this.options.tiffTileWidth = options.tileWidth;
          } else {
            throw is.invalidParameterError("tileWidth", "integer greater than zero", options.tileWidth);
          }
        }
        if (is.defined(options.tileHeight)) {
          if (is.integer(options.tileHeight) && options.tileHeight > 0) {
            this.options.tiffTileHeight = options.tileHeight;
          } else {
            throw is.invalidParameterError("tileHeight", "integer greater than zero", options.tileHeight);
          }
        }
        if (is.defined(options.pyramid)) {
          this._setBooleanOption("tiffPyramid", options.pyramid);
        }
        if (is.defined(options.xres)) {
          if (is.number(options.xres) && options.xres > 0) {
            this.options.tiffXres = options.xres;
          } else {
            throw is.invalidParameterError("xres", "number greater than zero", options.xres);
          }
        }
        if (is.defined(options.yres)) {
          if (is.number(options.yres) && options.yres > 0) {
            this.options.tiffYres = options.yres;
          } else {
            throw is.invalidParameterError("yres", "number greater than zero", options.yres);
          }
        }
        if (is.defined(options.compression)) {
          if (is.string(options.compression) && is.inArray(options.compression, ["none", "jpeg", "deflate", "packbits", "ccittfax4", "lzw", "webp", "zstd", "jp2k"])) {
            this.options.tiffCompression = options.compression;
          } else {
            throw is.invalidParameterError("compression", "one of: none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k", options.compression);
          }
        }
        if (is.defined(options.predictor)) {
          if (is.string(options.predictor) && is.inArray(options.predictor, ["none", "horizontal", "float"])) {
            this.options.tiffPredictor = options.predictor;
          } else {
            throw is.invalidParameterError("predictor", "one of: none, horizontal, float", options.predictor);
          }
        }
        if (is.defined(options.resolutionUnit)) {
          if (is.string(options.resolutionUnit) && is.inArray(options.resolutionUnit, ["inch", "cm"])) {
            this.options.tiffResolutionUnit = options.resolutionUnit;
          } else {
            throw is.invalidParameterError("resolutionUnit", "one of: inch, cm", options.resolutionUnit);
          }
        }
      }
      return this._updateFormatOut("tiff", options);
    }
    function avif(options) {
      return this.heif({ ...options, compression: "av1" });
    }
    function heif(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.heifQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.lossless)) {
          if (is.bool(options.lossless)) {
            this.options.heifLossless = options.lossless;
          } else {
            throw is.invalidParameterError("lossless", "boolean", options.lossless);
          }
        }
        if (is.defined(options.compression)) {
          if (is.string(options.compression) && is.inArray(options.compression, ["av1", "hevc"])) {
            this.options.heifCompression = options.compression;
          } else {
            throw is.invalidParameterError("compression", "one of: av1, hevc", options.compression);
          }
        }
        if (is.defined(options.effort)) {
          if (is.integer(options.effort) && is.inRange(options.effort, 0, 9)) {
            this.options.heifEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 0 and 9", options.effort);
          }
        }
        if (is.defined(options.chromaSubsampling)) {
          if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ["4:2:0", "4:4:4"])) {
            this.options.heifChromaSubsampling = options.chromaSubsampling;
          } else {
            throw is.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", options.chromaSubsampling);
          }
        }
      }
      return this._updateFormatOut("heif", options);
    }
    function jxl(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.jxlDistance = options.quality >= 30 ? 0.1 + (100 - options.quality) * 0.09 : 53 / 3e3 * options.quality * options.quality - 23 / 20 * options.quality + 25;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        } else if (is.defined(options.distance)) {
          if (is.number(options.distance) && is.inRange(options.distance, 0, 15)) {
            this.options.jxlDistance = options.distance;
          } else {
            throw is.invalidParameterError("distance", "number between 0.0 and 15.0", options.distance);
          }
        }
        if (is.defined(options.decodingTier)) {
          if (is.integer(options.decodingTier) && is.inRange(options.decodingTier, 0, 4)) {
            this.options.jxlDecodingTier = options.decodingTier;
          } else {
            throw is.invalidParameterError("decodingTier", "integer between 0 and 4", options.decodingTier);
          }
        }
        if (is.defined(options.lossless)) {
          if (is.bool(options.lossless)) {
            this.options.jxlLossless = options.lossless;
          } else {
            throw is.invalidParameterError("lossless", "boolean", options.lossless);
          }
        }
        if (is.defined(options.effort)) {
          if (is.integer(options.effort) && is.inRange(options.effort, 3, 9)) {
            this.options.jxlEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 3 and 9", options.effort);
          }
        }
      }
      return this._updateFormatOut("jxl", options);
    }
    function raw(options) {
      if (is.object(options)) {
        if (is.defined(options.depth)) {
          if (is.string(options.depth) && is.inArray(
            options.depth,
            ["char", "uchar", "short", "ushort", "int", "uint", "float", "complex", "double", "dpcomplex"]
          )) {
            this.options.rawDepth = options.depth;
          } else {
            throw is.invalidParameterError("depth", "one of: char, uchar, short, ushort, int, uint, float, complex, double, dpcomplex", options.depth);
          }
        }
      }
      return this._updateFormatOut("raw");
    }
    function tile(options) {
      if (is.object(options)) {
        if (is.defined(options.size)) {
          if (is.integer(options.size) && is.inRange(options.size, 1, 8192)) {
            this.options.tileSize = options.size;
          } else {
            throw is.invalidParameterError("size", "integer between 1 and 8192", options.size);
          }
        }
        if (is.defined(options.overlap)) {
          if (is.integer(options.overlap) && is.inRange(options.overlap, 0, 8192)) {
            if (options.overlap > this.options.tileSize) {
              throw is.invalidParameterError("overlap", `<= size (${this.options.tileSize})`, options.overlap);
            }
            this.options.tileOverlap = options.overlap;
          } else {
            throw is.invalidParameterError("overlap", "integer between 0 and 8192", options.overlap);
          }
        }
        if (is.defined(options.container)) {
          if (is.string(options.container) && is.inArray(options.container, ["fs", "zip"])) {
            this.options.tileContainer = options.container;
          } else {
            throw is.invalidParameterError("container", "one of: fs, zip", options.container);
          }
        }
        if (is.defined(options.layout)) {
          if (is.string(options.layout) && is.inArray(options.layout, ["dz", "google", "iiif", "iiif3", "zoomify"])) {
            this.options.tileLayout = options.layout;
          } else {
            throw is.invalidParameterError("layout", "one of: dz, google, iiif, iiif3, zoomify", options.layout);
          }
        }
        if (is.defined(options.angle)) {
          if (is.integer(options.angle) && !(options.angle % 90)) {
            this.options.tileAngle = options.angle;
          } else {
            throw is.invalidParameterError("angle", "positive/negative multiple of 90", options.angle);
          }
        }
        this._setBackgroundColourOption("tileBackground", options.background);
        if (is.defined(options.depth)) {
          if (is.string(options.depth) && is.inArray(options.depth, ["onepixel", "onetile", "one"])) {
            this.options.tileDepth = options.depth;
          } else {
            throw is.invalidParameterError("depth", "one of: onepixel, onetile, one", options.depth);
          }
        }
        if (is.defined(options.skipBlanks)) {
          if (is.integer(options.skipBlanks) && is.inRange(options.skipBlanks, -1, 65535)) {
            this.options.tileSkipBlanks = options.skipBlanks;
          } else {
            throw is.invalidParameterError("skipBlanks", "integer between -1 and 255/65535", options.skipBlanks);
          }
        } else if (is.defined(options.layout) && options.layout === "google") {
          this.options.tileSkipBlanks = 5;
        }
        const centre = is.bool(options.center) ? options.center : options.centre;
        if (is.defined(centre)) {
          this._setBooleanOption("tileCentre", centre);
        }
        if (is.defined(options.id)) {
          if (is.string(options.id)) {
            this.options.tileId = options.id;
          } else {
            throw is.invalidParameterError("id", "string", options.id);
          }
        }
        if (is.defined(options.basename)) {
          if (is.string(options.basename)) {
            this.options.tileBasename = options.basename;
          } else {
            throw is.invalidParameterError("basename", "string", options.basename);
          }
        }
      }
      if (is.inArray(this.options.formatOut, ["jpeg", "png", "webp"])) {
        this.options.tileFormat = this.options.formatOut;
      } else if (this.options.formatOut !== "input") {
        throw is.invalidParameterError("format", "one of: jpeg, png, webp", this.options.formatOut);
      }
      return this._updateFormatOut("dz");
    }
    function timeout(options) {
      if (!is.plainObject(options)) {
        throw is.invalidParameterError("options", "object", options);
      }
      if (is.integer(options.seconds) && is.inRange(options.seconds, 0, 3600)) {
        this.options.timeoutSeconds = options.seconds;
      } else {
        throw is.invalidParameterError("seconds", "integer between 0 and 3600", options.seconds);
      }
      return this;
    }
    function _updateFormatOut(formatOut, options) {
      if (!(is.object(options) && options.force === false)) {
        this.options.formatOut = formatOut;
      }
      return this;
    }
    function _setBooleanOption(key, val) {
      if (is.bool(val)) {
        this.options[key] = val;
      } else {
        throw is.invalidParameterError(key, "boolean", val);
      }
    }
    function _read() {
      if (!this.options.streamOut) {
        this.options.streamOut = true;
        this._pipeline();
      }
    }
    function _pipeline(callback) {
      if (typeof callback === "function") {
        if (this._isStreamInput()) {
          this.on("finish", () => {
            this._flattenBufferIn();
            sharp.pipeline(this.options, callback);
          });
        } else {
          sharp.pipeline(this.options, callback);
        }
        return this;
      } else if (this.options.streamOut) {
        if (this._isStreamInput()) {
          this.once("finish", () => {
            this._flattenBufferIn();
            sharp.pipeline(this.options, (err, data, info) => {
              if (err) {
                this.emit("error", err);
              } else {
                this.emit("info", info);
                this.push(data);
              }
              this.push(null);
              this.on("end", () => this.emit("close"));
            });
          });
          if (this.streamInFinished) {
            this.emit("finish");
          }
        } else {
          sharp.pipeline(this.options, (err, data, info) => {
            if (err) {
              this.emit("error", err);
            } else {
              this.emit("info", info);
              this.push(data);
            }
            this.push(null);
            this.on("end", () => this.emit("close"));
          });
        }
        return this;
      } else {
        if (this._isStreamInput()) {
          return new Promise((resolve, reject) => {
            this.once("finish", () => {
              this._flattenBufferIn();
              sharp.pipeline(this.options, (err, data, info) => {
                if (err) {
                  reject(err);
                } else {
                  if (this.options.resolveWithObject) {
                    resolve({ data, info });
                  } else {
                    resolve(data);
                  }
                }
              });
            });
          });
        } else {
          return new Promise((resolve, reject) => {
            sharp.pipeline(this.options, (err, data, info) => {
              if (err) {
                reject(err);
              } else {
                if (this.options.resolveWithObject) {
                  resolve({ data, info });
                } else {
                  resolve(data);
                }
              }
            });
          });
        }
      }
    }
    module2.exports = function(Sharp) {
      Object.assign(Sharp.prototype, {
        // Public
        toFile,
        toBuffer,
        withMetadata,
        toFormat,
        jpeg,
        jp2,
        png,
        webp,
        tiff,
        avif,
        heif,
        jxl,
        gif,
        raw,
        tile,
        timeout,
        // Private
        _updateFormatOut,
        _setBooleanOption,
        _read,
        _pipeline
      });
    };
  }
});

// node_modules/sharp/vendor/8.14.5/win32-x64/versions.json
var require_versions = __commonJS({
  "node_modules/sharp/vendor/8.14.5/win32-x64/versions.json"(exports2, module2) {
    module2.exports = {
      aom: "3.7.0",
      archive: "3.7.2",
      cairo: "1.17.8",
      cgif: "0.3.2",
      exif: "0.6.24",
      expat: "2.5.0",
      ffi: "3.4.4",
      fontconfig: "2.14.2",
      freetype: "2.13.2",
      fribidi: "1.0.13",
      gdkpixbuf: "2.42.10",
      glib: "2.78.0",
      harfbuzz: "8.2.0",
      heif: "1.16.2",
      imagequant: "2.4.1",
      lcms: "2.15",
      mozjpeg: "4.1.4",
      orc: "0.4.34",
      pango: "1.51.0",
      pixman: "0.42.2",
      png: "1.6.40",
      "proxy-libintl": "0.4",
      rsvg: "2.57.0",
      spng: "0.7.4",
      tiff: "4.6.0",
      vips: "8.14.5",
      webp: "1.3.2",
      xml: "2.11.5",
      "zlib-ng": "2.1.3"
    };
  }
});

// require("../vendor/**/*/**/*/versions.json") in node_modules/sharp/lib/utility.js
var globRequire_vendor_versions_json;
var init_2 = __esm({
  'require("../vendor/**/*/**/*/versions.json") in node_modules/sharp/lib/utility.js'() {
    globRequire_vendor_versions_json = __glob({
      "../vendor/8.14.5/win32-x64/versions.json": () => require_versions()
    });
  }
});

// node_modules/sharp/lib/utility.js
var require_utility = __commonJS({
  "node_modules/sharp/lib/utility.js"(exports2, module2) {
    "use strict";
    init_2();
    var fs2 = require("fs");
    var path2 = require("path");
    var events = require("events");
    var detectLibc = require_detect_libc();
    var is = require_is();
    var platformAndArch = require_platform()();
    var sharp = require_sharp();
    var format = sharp.format();
    format.heif.output.alias = ["avif", "heic"];
    format.jpeg.output.alias = ["jpe", "jpg"];
    format.tiff.output.alias = ["tif"];
    format.jp2k.output.alias = ["j2c", "j2k", "jp2", "jpx"];
    var interpolators = {
      /** [Nearest neighbour interpolation](http://en.wikipedia.org/wiki/Nearest-neighbor_interpolation). Suitable for image enlargement only. */
      nearest: "nearest",
      /** [Bilinear interpolation](http://en.wikipedia.org/wiki/Bilinear_interpolation). Faster than bicubic but with less smooth results. */
      bilinear: "bilinear",
      /** [Bicubic interpolation](http://en.wikipedia.org/wiki/Bicubic_interpolation) (the default). */
      bicubic: "bicubic",
      /** [LBB interpolation](https://github.com/libvips/libvips/blob/master/libvips/resample/lbb.cpp#L100). Prevents some "[acutance](http://en.wikipedia.org/wiki/Acutance)" but typically reduces performance by a factor of 2. */
      locallyBoundedBicubic: "lbb",
      /** [Nohalo interpolation](http://eprints.soton.ac.uk/268086/). Prevents acutance but typically reduces performance by a factor of 3. */
      nohalo: "nohalo",
      /** [VSQBS interpolation](https://github.com/libvips/libvips/blob/master/libvips/resample/vsqbs.cpp#L48). Prevents "staircasing" when enlarging. */
      vertexSplitQuadraticBasisSpline: "vsqbs"
    };
    var versions = {
      vips: sharp.libvipsVersion()
    };
    try {
      versions = globRequire_vendor_versions_json(`../vendor/${versions.vips}/${platformAndArch}/versions.json`);
    } catch (_err) {
    }
    versions.sharp = require_package().version;
    var vendor = {
      current: platformAndArch,
      installed: []
    };
    try {
      vendor.installed = fs2.readdirSync(path2.join(__dirname, `../vendor/${versions.vips}`));
    } catch (_err) {
    }
    function cache(options) {
      if (is.bool(options)) {
        if (options) {
          return sharp.cache(50, 20, 100);
        } else {
          return sharp.cache(0, 0, 0);
        }
      } else if (is.object(options)) {
        return sharp.cache(options.memory, options.files, options.items);
      } else {
        return sharp.cache();
      }
    }
    cache(true);
    function concurrency(concurrency2) {
      return sharp.concurrency(is.integer(concurrency2) ? concurrency2 : null);
    }
    if (detectLibc.familySync() === detectLibc.GLIBC && !sharp._isUsingJemalloc()) {
      sharp.concurrency(1);
    }
    var queue = new events.EventEmitter();
    function counters() {
      return sharp.counters();
    }
    function simd(simd2) {
      return sharp.simd(is.bool(simd2) ? simd2 : null);
    }
    simd(true);
    function block(options) {
      if (is.object(options)) {
        if (Array.isArray(options.operation) && options.operation.every(is.string)) {
          sharp.block(options.operation, true);
        } else {
          throw is.invalidParameterError("operation", "Array<string>", options.operation);
        }
      } else {
        throw is.invalidParameterError("options", "object", options);
      }
    }
    function unblock(options) {
      if (is.object(options)) {
        if (Array.isArray(options.operation) && options.operation.every(is.string)) {
          sharp.block(options.operation, false);
        } else {
          throw is.invalidParameterError("operation", "Array<string>", options.operation);
        }
      } else {
        throw is.invalidParameterError("options", "object", options);
      }
    }
    module2.exports = function(Sharp) {
      Sharp.cache = cache;
      Sharp.concurrency = concurrency;
      Sharp.counters = counters;
      Sharp.simd = simd;
      Sharp.format = format;
      Sharp.interpolators = interpolators;
      Sharp.versions = versions;
      Sharp.vendor = vendor;
      Sharp.queue = queue;
      Sharp.block = block;
      Sharp.unblock = unblock;
    };
  }
});

// node_modules/sharp/lib/index.js
var require_lib = __commonJS({
  "node_modules/sharp/lib/index.js"(exports2, module2) {
    "use strict";
    var Sharp = require_constructor();
    require_input()(Sharp);
    require_resize()(Sharp);
    require_composite()(Sharp);
    require_operation()(Sharp);
    require_colour()(Sharp);
    require_channel()(Sharp);
    require_output()(Sharp);
    require_utility()(Sharp);
    module2.exports = Sharp;
  }
});

// node_modules/uniq/uniq.js
var require_uniq = __commonJS({
  "node_modules/uniq/uniq.js"(exports2, module2) {
    "use strict";
    function unique_pred(list, compare) {
      var ptr = 1, len = list.length, a = list[0], b = list[0];
      for (var i = 1; i < len; ++i) {
        b = a;
        a = list[i];
        if (compare(a, b)) {
          if (i === ptr) {
            ptr++;
            continue;
          }
          list[ptr++] = a;
        }
      }
      list.length = ptr;
      return list;
    }
    function unique_eq(list) {
      var ptr = 1, len = list.length, a = list[0], b = list[0];
      for (var i = 1; i < len; ++i, b = a) {
        b = a;
        a = list[i];
        if (a !== b) {
          if (i === ptr) {
            ptr++;
            continue;
          }
          list[ptr++] = a;
        }
      }
      list.length = ptr;
      return list;
    }
    function unique(list, compare, sorted) {
      if (list.length === 0) {
        return list;
      }
      if (compare) {
        if (!sorted) {
          list.sort(compare);
        }
        return unique_pred(list, compare);
      }
      if (!sorted) {
        list.sort();
      }
      return unique_eq(list);
    }
    module2.exports = unique;
  }
});

// node_modules/cwise-compiler/lib/compile.js
var require_compile = __commonJS({
  "node_modules/cwise-compiler/lib/compile.js"(exports2, module2) {
    "use strict";
    var uniq = require_uniq();
    function innerFill(order, proc, body) {
      var dimension = order.length, nargs = proc.arrayArgs.length, has_index = proc.indexArgs.length > 0, code = [], vars = [], idx = 0, pidx = 0, i, j;
      for (i = 0; i < dimension; ++i) {
        vars.push(["i", i, "=0"].join(""));
      }
      for (j = 0; j < nargs; ++j) {
        for (i = 0; i < dimension; ++i) {
          pidx = idx;
          idx = order[i];
          if (i === 0) {
            vars.push(["d", j, "s", i, "=t", j, "p", idx].join(""));
          } else {
            vars.push(["d", j, "s", i, "=(t", j, "p", idx, "-s", pidx, "*t", j, "p", pidx, ")"].join(""));
          }
        }
      }
      if (vars.length > 0) {
        code.push("var " + vars.join(","));
      }
      for (i = dimension - 1; i >= 0; --i) {
        idx = order[i];
        code.push(["for(i", i, "=0;i", i, "<s", idx, ";++i", i, "){"].join(""));
      }
      code.push(body);
      for (i = 0; i < dimension; ++i) {
        pidx = idx;
        idx = order[i];
        for (j = 0; j < nargs; ++j) {
          code.push(["p", j, "+=d", j, "s", i].join(""));
        }
        if (has_index) {
          if (i > 0) {
            code.push(["index[", pidx, "]-=s", pidx].join(""));
          }
          code.push(["++index[", idx, "]"].join(""));
        }
        code.push("}");
      }
      return code.join("\n");
    }
    function outerFill(matched, order, proc, body) {
      var dimension = order.length, nargs = proc.arrayArgs.length, blockSize = proc.blockSize, has_index = proc.indexArgs.length > 0, code = [];
      for (var i = 0; i < nargs; ++i) {
        code.push(["var offset", i, "=p", i].join(""));
      }
      for (var i = matched; i < dimension; ++i) {
        code.push(["for(var j" + i + "=SS[", order[i], "]|0;j", i, ">0;){"].join(""));
        code.push(["if(j", i, "<", blockSize, "){"].join(""));
        code.push(["s", order[i], "=j", i].join(""));
        code.push(["j", i, "=0"].join(""));
        code.push(["}else{s", order[i], "=", blockSize].join(""));
        code.push(["j", i, "-=", blockSize, "}"].join(""));
        if (has_index) {
          code.push(["index[", order[i], "]=j", i].join(""));
        }
      }
      for (var i = 0; i < nargs; ++i) {
        var indexStr = ["offset" + i];
        for (var j = matched; j < dimension; ++j) {
          indexStr.push(["j", j, "*t", i, "p", order[j]].join(""));
        }
        code.push(["p", i, "=(", indexStr.join("+"), ")"].join(""));
      }
      code.push(innerFill(order, proc, body));
      for (var i = matched; i < dimension; ++i) {
        code.push("}");
      }
      return code.join("\n");
    }
    function countMatches(orders) {
      var matched = 0, dimension = orders[0].length;
      while (matched < dimension) {
        for (var j = 1; j < orders.length; ++j) {
          if (orders[j][matched] !== orders[0][matched]) {
            return matched;
          }
        }
        ++matched;
      }
      return matched;
    }
    function processBlock(block, proc, dtypes) {
      var code = block.body;
      var pre = [];
      var post = [];
      for (var i = 0; i < block.args.length; ++i) {
        var carg = block.args[i];
        if (carg.count <= 0) {
          continue;
        }
        var re = new RegExp(carg.name, "g");
        var ptrStr = "";
        var arrNum = proc.arrayArgs.indexOf(i);
        switch (proc.argTypes[i]) {
          case "offset":
            var offArgIndex = proc.offsetArgIndex.indexOf(i);
            var offArg = proc.offsetArgs[offArgIndex];
            arrNum = offArg.array;
            ptrStr = "+q" + offArgIndex;
          // Adds offset to the "pointer" in the array
          case "array":
            ptrStr = "p" + arrNum + ptrStr;
            var localStr = "l" + i;
            var arrStr = "a" + arrNum;
            if (proc.arrayBlockIndices[arrNum] === 0) {
              if (carg.count === 1) {
                if (dtypes[arrNum] === "generic") {
                  if (carg.lvalue) {
                    pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join(""));
                    code = code.replace(re, localStr);
                    post.push([arrStr, ".set(", ptrStr, ",", localStr, ")"].join(""));
                  } else {
                    code = code.replace(re, [arrStr, ".get(", ptrStr, ")"].join(""));
                  }
                } else {
                  code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""));
                }
              } else if (dtypes[arrNum] === "generic") {
                pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join(""));
                code = code.replace(re, localStr);
                if (carg.lvalue) {
                  post.push([arrStr, ".set(", ptrStr, ",", localStr, ")"].join(""));
                }
              } else {
                pre.push(["var ", localStr, "=", arrStr, "[", ptrStr, "]"].join(""));
                code = code.replace(re, localStr);
                if (carg.lvalue) {
                  post.push([arrStr, "[", ptrStr, "]=", localStr].join(""));
                }
              }
            } else {
              var reStrArr = [carg.name], ptrStrArr = [ptrStr];
              for (var j = 0; j < Math.abs(proc.arrayBlockIndices[arrNum]); j++) {
                reStrArr.push("\\s*\\[([^\\]]+)\\]");
                ptrStrArr.push("$" + (j + 1) + "*t" + arrNum + "b" + j);
              }
              re = new RegExp(reStrArr.join(""), "g");
              ptrStr = ptrStrArr.join("+");
              if (dtypes[arrNum] === "generic") {
                throw new Error("cwise: Generic arrays not supported in combination with blocks!");
              } else {
                code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""));
              }
            }
            break;
          case "scalar":
            code = code.replace(re, "Y" + proc.scalarArgs.indexOf(i));
            break;
          case "index":
            code = code.replace(re, "index");
            break;
          case "shape":
            code = code.replace(re, "shape");
            break;
        }
      }
      return [pre.join("\n"), code, post.join("\n")].join("\n").trim();
    }
    function typeSummary(dtypes) {
      var summary = new Array(dtypes.length);
      var allEqual = true;
      for (var i = 0; i < dtypes.length; ++i) {
        var t = dtypes[i];
        var digits = t.match(/\d+/);
        if (!digits) {
          digits = "";
        } else {
          digits = digits[0];
        }
        if (t.charAt(0) === 0) {
          summary[i] = "u" + t.charAt(1) + digits;
        } else {
          summary[i] = t.charAt(0) + digits;
        }
        if (i > 0) {
          allEqual = allEqual && summary[i] === summary[i - 1];
        }
      }
      if (allEqual) {
        return summary[0];
      }
      return summary.join("");
    }
    function generateCWiseOp(proc, typesig) {
      var dimension = typesig[1].length - Math.abs(proc.arrayBlockIndices[0]) | 0;
      var orders = new Array(proc.arrayArgs.length);
      var dtypes = new Array(proc.arrayArgs.length);
      for (var i = 0; i < proc.arrayArgs.length; ++i) {
        dtypes[i] = typesig[2 * i];
        orders[i] = typesig[2 * i + 1];
      }
      var blockBegin = [], blockEnd = [];
      var loopBegin = [], loopEnd = [];
      var loopOrders = [];
      for (var i = 0; i < proc.arrayArgs.length; ++i) {
        if (proc.arrayBlockIndices[i] < 0) {
          loopBegin.push(0);
          loopEnd.push(dimension);
          blockBegin.push(dimension);
          blockEnd.push(dimension + proc.arrayBlockIndices[i]);
        } else {
          loopBegin.push(proc.arrayBlockIndices[i]);
          loopEnd.push(proc.arrayBlockIndices[i] + dimension);
          blockBegin.push(0);
          blockEnd.push(proc.arrayBlockIndices[i]);
        }
        var newOrder = [];
        for (var j = 0; j < orders[i].length; j++) {
          if (loopBegin[i] <= orders[i][j] && orders[i][j] < loopEnd[i]) {
            newOrder.push(orders[i][j] - loopBegin[i]);
          }
        }
        loopOrders.push(newOrder);
      }
      var arglist = ["SS"];
      var code = ["'use strict'"];
      var vars = [];
      for (var j = 0; j < dimension; ++j) {
        vars.push(["s", j, "=SS[", j, "]"].join(""));
      }
      for (var i = 0; i < proc.arrayArgs.length; ++i) {
        arglist.push("a" + i);
        arglist.push("t" + i);
        arglist.push("p" + i);
        for (var j = 0; j < dimension; ++j) {
          vars.push(["t", i, "p", j, "=t", i, "[", loopBegin[i] + j, "]"].join(""));
        }
        for (var j = 0; j < Math.abs(proc.arrayBlockIndices[i]); ++j) {
          vars.push(["t", i, "b", j, "=t", i, "[", blockBegin[i] + j, "]"].join(""));
        }
      }
      for (var i = 0; i < proc.scalarArgs.length; ++i) {
        arglist.push("Y" + i);
      }
      if (proc.shapeArgs.length > 0) {
        vars.push("shape=SS.slice(0)");
      }
      if (proc.indexArgs.length > 0) {
        var zeros = new Array(dimension);
        for (var i = 0; i < dimension; ++i) {
          zeros[i] = "0";
        }
        vars.push(["index=[", zeros.join(","), "]"].join(""));
      }
      for (var i = 0; i < proc.offsetArgs.length; ++i) {
        var off_arg = proc.offsetArgs[i];
        var init_string = [];
        for (var j = 0; j < off_arg.offset.length; ++j) {
          if (off_arg.offset[j] === 0) {
            continue;
          } else if (off_arg.offset[j] === 1) {
            init_string.push(["t", off_arg.array, "p", j].join(""));
          } else {
            init_string.push([off_arg.offset[j], "*t", off_arg.array, "p", j].join(""));
          }
        }
        if (init_string.length === 0) {
          vars.push("q" + i + "=0");
        } else {
          vars.push(["q", i, "=", init_string.join("+")].join(""));
        }
      }
      var thisVars = uniq([].concat(proc.pre.thisVars).concat(proc.body.thisVars).concat(proc.post.thisVars));
      vars = vars.concat(thisVars);
      if (vars.length > 0) {
        code.push("var " + vars.join(","));
      }
      for (var i = 0; i < proc.arrayArgs.length; ++i) {
        code.push("p" + i + "|=0");
      }
      if (proc.pre.body.length > 3) {
        code.push(processBlock(proc.pre, proc, dtypes));
      }
      var body = processBlock(proc.body, proc, dtypes);
      var matched = countMatches(loopOrders);
      if (matched < dimension) {
        code.push(outerFill(matched, loopOrders[0], proc, body));
      } else {
        code.push(innerFill(loopOrders[0], proc, body));
      }
      if (proc.post.body.length > 3) {
        code.push(processBlock(proc.post, proc, dtypes));
      }
      if (proc.debug) {
        console.log("-----Generated cwise routine for ", typesig, ":\n" + code.join("\n") + "\n----------");
      }
      var loopName = [proc.funcName || "unnamed", "_cwise_loop_", orders[0].join("s"), "m", matched, typeSummary(dtypes)].join("");
      var f = new Function(["function ", loopName, "(", arglist.join(","), "){", code.join("\n"), "} return ", loopName].join(""));
      return f();
    }
    module2.exports = generateCWiseOp;
  }
});

// node_modules/cwise-compiler/lib/thunk.js
var require_thunk = __commonJS({
  "node_modules/cwise-compiler/lib/thunk.js"(exports2, module2) {
    "use strict";
    var compile = require_compile();
    function createThunk(proc) {
      var code = ["'use strict'", "var CACHED={}"];
      var vars = [];
      var thunkName = proc.funcName + "_cwise_thunk";
      code.push(["return function ", thunkName, "(", proc.shimArgs.join(","), "){"].join(""));
      var typesig = [];
      var string_typesig = [];
      var proc_args = [[
        "array",
        proc.arrayArgs[0],
        ".shape.slice(",
        // Slice shape so that we only retain the shape over which we iterate (which gets passed to the cwise operator as SS).
        Math.max(0, proc.arrayBlockIndices[0]),
        proc.arrayBlockIndices[0] < 0 ? "," + proc.arrayBlockIndices[0] + ")" : ")"
      ].join("")];
      var shapeLengthConditions = [], shapeConditions = [];
      for (var i = 0; i < proc.arrayArgs.length; ++i) {
        var j = proc.arrayArgs[i];
        vars.push([
          "t",
          j,
          "=array",
          j,
          ".dtype,",
          "r",
          j,
          "=array",
          j,
          ".order"
        ].join(""));
        typesig.push("t" + j);
        typesig.push("r" + j);
        string_typesig.push("t" + j);
        string_typesig.push("r" + j + ".join()");
        proc_args.push("array" + j + ".data");
        proc_args.push("array" + j + ".stride");
        proc_args.push("array" + j + ".offset|0");
        if (i > 0) {
          shapeLengthConditions.push("array" + proc.arrayArgs[0] + ".shape.length===array" + j + ".shape.length+" + (Math.abs(proc.arrayBlockIndices[0]) - Math.abs(proc.arrayBlockIndices[i])));
          shapeConditions.push("array" + proc.arrayArgs[0] + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[0]) + "]===array" + j + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[i]) + "]");
        }
      }
      if (proc.arrayArgs.length > 1) {
        code.push("if (!(" + shapeLengthConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same dimensionality!')");
        code.push("for(var shapeIndex=array" + proc.arrayArgs[0] + ".shape.length-" + Math.abs(proc.arrayBlockIndices[0]) + "; shapeIndex-->0;) {");
        code.push("if (!(" + shapeConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same shape!')");
        code.push("}");
      }
      for (var i = 0; i < proc.scalarArgs.length; ++i) {
        proc_args.push("scalar" + proc.scalarArgs[i]);
      }
      vars.push(["type=[", string_typesig.join(","), "].join()"].join(""));
      vars.push("proc=CACHED[type]");
      code.push("var " + vars.join(","));
      code.push([
        "if(!proc){",
        "CACHED[type]=proc=compile([",
        typesig.join(","),
        "])}",
        "return proc(",
        proc_args.join(","),
        ")}"
      ].join(""));
      if (proc.debug) {
        console.log("-----Generated thunk:\n" + code.join("\n") + "\n----------");
      }
      var thunk = new Function("compile", code.join("\n"));
      return thunk(compile.bind(void 0, proc));
    }
    module2.exports = createThunk;
  }
});

// node_modules/cwise-compiler/compiler.js
var require_compiler = __commonJS({
  "node_modules/cwise-compiler/compiler.js"(exports2, module2) {
    "use strict";
    var createThunk = require_thunk();
    function Procedure() {
      this.argTypes = [];
      this.shimArgs = [];
      this.arrayArgs = [];
      this.arrayBlockIndices = [];
      this.scalarArgs = [];
      this.offsetArgs = [];
      this.offsetArgIndex = [];
      this.indexArgs = [];
      this.shapeArgs = [];
      this.funcName = "";
      this.pre = null;
      this.body = null;
      this.post = null;
      this.debug = false;
    }
    function compileCwise(user_args) {
      var proc = new Procedure();
      proc.pre = user_args.pre;
      proc.body = user_args.body;
      proc.post = user_args.post;
      var proc_args = user_args.args.slice(0);
      proc.argTypes = proc_args;
      for (var i = 0; i < proc_args.length; ++i) {
        var arg_type = proc_args[i];
        if (arg_type === "array" || typeof arg_type === "object" && arg_type.blockIndices) {
          proc.argTypes[i] = "array";
          proc.arrayArgs.push(i);
          proc.arrayBlockIndices.push(arg_type.blockIndices ? arg_type.blockIndices : 0);
          proc.shimArgs.push("array" + i);
          if (i < proc.pre.args.length && proc.pre.args[i].count > 0) {
            throw new Error("cwise: pre() block may not reference array args");
          }
          if (i < proc.post.args.length && proc.post.args[i].count > 0) {
            throw new Error("cwise: post() block may not reference array args");
          }
        } else if (arg_type === "scalar") {
          proc.scalarArgs.push(i);
          proc.shimArgs.push("scalar" + i);
        } else if (arg_type === "index") {
          proc.indexArgs.push(i);
          if (i < proc.pre.args.length && proc.pre.args[i].count > 0) {
            throw new Error("cwise: pre() block may not reference array index");
          }
          if (i < proc.body.args.length && proc.body.args[i].lvalue) {
            throw new Error("cwise: body() block may not write to array index");
          }
          if (i < proc.post.args.length && proc.post.args[i].count > 0) {
            throw new Error("cwise: post() block may not reference array index");
          }
        } else if (arg_type === "shape") {
          proc.shapeArgs.push(i);
          if (i < proc.pre.args.length && proc.pre.args[i].lvalue) {
            throw new Error("cwise: pre() block may not write to array shape");
          }
          if (i < proc.body.args.length && proc.body.args[i].lvalue) {
            throw new Error("cwise: body() block may not write to array shape");
          }
          if (i < proc.post.args.length && proc.post.args[i].lvalue) {
            throw new Error("cwise: post() block may not write to array shape");
          }
        } else if (typeof arg_type === "object" && arg_type.offset) {
          proc.argTypes[i] = "offset";
          proc.offsetArgs.push({ array: arg_type.array, offset: arg_type.offset });
          proc.offsetArgIndex.push(i);
        } else {
          throw new Error("cwise: Unknown argument type " + proc_args[i]);
        }
      }
      if (proc.arrayArgs.length <= 0) {
        throw new Error("cwise: No array arguments specified");
      }
      if (proc.pre.args.length > proc_args.length) {
        throw new Error("cwise: Too many arguments in pre() block");
      }
      if (proc.body.args.length > proc_args.length) {
        throw new Error("cwise: Too many arguments in body() block");
      }
      if (proc.post.args.length > proc_args.length) {
        throw new Error("cwise: Too many arguments in post() block");
      }
      proc.debug = !!user_args.printCode || !!user_args.debug;
      proc.funcName = user_args.funcName || "cwise";
      proc.blockSize = user_args.blockSize || 64;
      return createThunk(proc);
    }
    module2.exports = compileCwise;
  }
});

// node_modules/ndarray-ops/ndarray-ops.js
var require_ndarray_ops = __commonJS({
  "node_modules/ndarray-ops/ndarray-ops.js"(exports2) {
    "use strict";
    var compile = require_compiler();
    var EmptyProc = {
      body: "",
      args: [],
      thisVars: [],
      localVars: []
    };
    function fixup(x) {
      if (!x) {
        return EmptyProc;
      }
      for (var i = 0; i < x.args.length; ++i) {
        var a = x.args[i];
        if (i === 0) {
          x.args[i] = { name: a, lvalue: true, rvalue: !!x.rvalue, count: x.count || 1 };
        } else {
          x.args[i] = { name: a, lvalue: false, rvalue: true, count: 1 };
        }
      }
      if (!x.thisVars) {
        x.thisVars = [];
      }
      if (!x.localVars) {
        x.localVars = [];
      }
      return x;
    }
    function pcompile(user_args) {
      return compile({
        args: user_args.args,
        pre: fixup(user_args.pre),
        body: fixup(user_args.body),
        post: fixup(user_args.proc),
        funcName: user_args.funcName
      });
    }
    function makeOp(user_args) {
      var args = [];
      for (var i = 0; i < user_args.args.length; ++i) {
        args.push("a" + i);
      }
      var wrapper = new Function("P", [
        "return function ",
        user_args.funcName,
        "_ndarrayops(",
        args.join(","),
        ") {P(",
        args.join(","),
        ");return a0}"
      ].join(""));
      return wrapper(pcompile(user_args));
    }
    var assign_ops = {
      add: "+",
      sub: "-",
      mul: "*",
      div: "/",
      mod: "%",
      band: "&",
      bor: "|",
      bxor: "^",
      lshift: "<<",
      rshift: ">>",
      rrshift: ">>>"
    };
    (function() {
      for (var id in assign_ops) {
        var op = assign_ops[id];
        exports2[id] = makeOp({
          args: ["array", "array", "array"],
          body: {
            args: ["a", "b", "c"],
            body: "a=b" + op + "c"
          },
          funcName: id
        });
        exports2[id + "eq"] = makeOp({
          args: ["array", "array"],
          body: {
            args: ["a", "b"],
            body: "a" + op + "=b"
          },
          rvalue: true,
          funcName: id + "eq"
        });
        exports2[id + "s"] = makeOp({
          args: ["array", "array", "scalar"],
          body: {
            args: ["a", "b", "s"],
            body: "a=b" + op + "s"
          },
          funcName: id + "s"
        });
        exports2[id + "seq"] = makeOp({
          args: ["array", "scalar"],
          body: {
            args: ["a", "s"],
            body: "a" + op + "=s"
          },
          rvalue: true,
          funcName: id + "seq"
        });
      }
    })();
    var unary_ops = {
      not: "!",
      bnot: "~",
      neg: "-",
      recip: "1.0/"
    };
    (function() {
      for (var id in unary_ops) {
        var op = unary_ops[id];
        exports2[id] = makeOp({
          args: ["array", "array"],
          body: {
            args: ["a", "b"],
            body: "a=" + op + "b"
          },
          funcName: id
        });
        exports2[id + "eq"] = makeOp({
          args: ["array"],
          body: {
            args: ["a"],
            body: "a=" + op + "a"
          },
          rvalue: true,
          count: 2,
          funcName: id + "eq"
        });
      }
    })();
    var binary_ops = {
      and: "&&",
      or: "||",
      eq: "===",
      neq: "!==",
      lt: "<",
      gt: ">",
      leq: "<=",
      geq: ">="
    };
    (function() {
      for (var id in binary_ops) {
        var op = binary_ops[id];
        exports2[id] = makeOp({
          args: ["array", "array", "array"],
          body: {
            args: ["a", "b", "c"],
            body: "a=b" + op + "c"
          },
          funcName: id
        });
        exports2[id + "s"] = makeOp({
          args: ["array", "array", "scalar"],
          body: {
            args: ["a", "b", "s"],
            body: "a=b" + op + "s"
          },
          funcName: id + "s"
        });
        exports2[id + "eq"] = makeOp({
          args: ["array", "array"],
          body: {
            args: ["a", "b"],
            body: "a=a" + op + "b"
          },
          rvalue: true,
          count: 2,
          funcName: id + "eq"
        });
        exports2[id + "seq"] = makeOp({
          args: ["array", "scalar"],
          body: {
            args: ["a", "s"],
            body: "a=a" + op + "s"
          },
          rvalue: true,
          count: 2,
          funcName: id + "seq"
        });
      }
    })();
    var math_unary = [
      "abs",
      "acos",
      "asin",
      "atan",
      "ceil",
      "cos",
      "exp",
      "floor",
      "log",
      "round",
      "sin",
      "sqrt",
      "tan"
    ];
    (function() {
      for (var i = 0; i < math_unary.length; ++i) {
        var f = math_unary[i];
        exports2[f] = makeOp({
          args: ["array", "array"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a", "b"], body: "a=this_f(b)", thisVars: ["this_f"] },
          funcName: f
        });
        exports2[f + "eq"] = makeOp({
          args: ["array"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a"], body: "a=this_f(a)", thisVars: ["this_f"] },
          rvalue: true,
          count: 2,
          funcName: f + "eq"
        });
      }
    })();
    var math_comm = [
      "max",
      "min",
      "atan2",
      "pow"
    ];
    (function() {
      for (var i = 0; i < math_comm.length; ++i) {
        var f = math_comm[i];
        exports2[f] = makeOp({
          args: ["array", "array", "array"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a", "b", "c"], body: "a=this_f(b,c)", thisVars: ["this_f"] },
          funcName: f
        });
        exports2[f + "s"] = makeOp({
          args: ["array", "array", "scalar"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a", "b", "c"], body: "a=this_f(b,c)", thisVars: ["this_f"] },
          funcName: f + "s"
        });
        exports2[f + "eq"] = makeOp({
          args: ["array", "array"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a", "b"], body: "a=this_f(a,b)", thisVars: ["this_f"] },
          rvalue: true,
          count: 2,
          funcName: f + "eq"
        });
        exports2[f + "seq"] = makeOp({
          args: ["array", "scalar"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a", "b"], body: "a=this_f(a,b)", thisVars: ["this_f"] },
          rvalue: true,
          count: 2,
          funcName: f + "seq"
        });
      }
    })();
    var math_noncomm = [
      "atan2",
      "pow"
    ];
    (function() {
      for (var i = 0; i < math_noncomm.length; ++i) {
        var f = math_noncomm[i];
        exports2[f + "op"] = makeOp({
          args: ["array", "array", "array"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a", "b", "c"], body: "a=this_f(c,b)", thisVars: ["this_f"] },
          funcName: f + "op"
        });
        exports2[f + "ops"] = makeOp({
          args: ["array", "array", "scalar"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a", "b", "c"], body: "a=this_f(c,b)", thisVars: ["this_f"] },
          funcName: f + "ops"
        });
        exports2[f + "opeq"] = makeOp({
          args: ["array", "array"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a", "b"], body: "a=this_f(b,a)", thisVars: ["this_f"] },
          rvalue: true,
          count: 2,
          funcName: f + "opeq"
        });
        exports2[f + "opseq"] = makeOp({
          args: ["array", "scalar"],
          pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
          body: { args: ["a", "b"], body: "a=this_f(b,a)", thisVars: ["this_f"] },
          rvalue: true,
          count: 2,
          funcName: f + "opseq"
        });
      }
    })();
    exports2.any = compile({
      args: ["array"],
      pre: EmptyProc,
      body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 1 }], body: "if(a){return true}", localVars: [], thisVars: [] },
      post: { args: [], localVars: [], thisVars: [], body: "return false" },
      funcName: "any"
    });
    exports2.all = compile({
      args: ["array"],
      pre: EmptyProc,
      body: { args: [{ name: "x", lvalue: false, rvalue: true, count: 1 }], body: "if(!x){return false}", localVars: [], thisVars: [] },
      post: { args: [], localVars: [], thisVars: [], body: "return true" },
      funcName: "all"
    });
    exports2.sum = compile({
      args: ["array"],
      pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
      body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 1 }], body: "this_s+=a", localVars: [], thisVars: ["this_s"] },
      post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
      funcName: "sum"
    });
    exports2.prod = compile({
      args: ["array"],
      pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=1" },
      body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 1 }], body: "this_s*=a", localVars: [], thisVars: ["this_s"] },
      post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
      funcName: "prod"
    });
    exports2.norm2squared = compile({
      args: ["array"],
      pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
      body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 2 }], body: "this_s+=a*a", localVars: [], thisVars: ["this_s"] },
      post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
      funcName: "norm2squared"
    });
    exports2.norm2 = compile({
      args: ["array"],
      pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
      body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 2 }], body: "this_s+=a*a", localVars: [], thisVars: ["this_s"] },
      post: { args: [], localVars: [], thisVars: ["this_s"], body: "return Math.sqrt(this_s)" },
      funcName: "norm2"
    });
    exports2.norminf = compile({
      args: ["array"],
      pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
      body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 4 }], body: "if(-a>this_s){this_s=-a}else if(a>this_s){this_s=a}", localVars: [], thisVars: ["this_s"] },
      post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
      funcName: "norminf"
    });
    exports2.norm1 = compile({
      args: ["array"],
      pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
      body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 3 }], body: "this_s+=a<0?-a:a", localVars: [], thisVars: ["this_s"] },
      post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
      funcName: "norm1"
    });
    exports2.sup = compile({
      args: ["array"],
      pre: {
        body: "this_h=-Infinity",
        args: [],
        thisVars: ["this_h"],
        localVars: []
      },
      body: {
        body: "if(_inline_1_arg0_>this_h)this_h=_inline_1_arg0_",
        args: [{ "name": "_inline_1_arg0_", "lvalue": false, "rvalue": true, "count": 2 }],
        thisVars: ["this_h"],
        localVars: []
      },
      post: {
        body: "return this_h",
        args: [],
        thisVars: ["this_h"],
        localVars: []
      }
    });
    exports2.inf = compile({
      args: ["array"],
      pre: {
        body: "this_h=Infinity",
        args: [],
        thisVars: ["this_h"],
        localVars: []
      },
      body: {
        body: "if(_inline_1_arg0_<this_h)this_h=_inline_1_arg0_",
        args: [{ "name": "_inline_1_arg0_", "lvalue": false, "rvalue": true, "count": 2 }],
        thisVars: ["this_h"],
        localVars: []
      },
      post: {
        body: "return this_h",
        args: [],
        thisVars: ["this_h"],
        localVars: []
      }
    });
    exports2.argmin = compile({
      args: ["index", "array", "shape"],
      pre: {
        body: "{this_v=Infinity;this_i=_inline_0_arg2_.slice(0)}",
        args: [
          { name: "_inline_0_arg0_", lvalue: false, rvalue: false, count: 0 },
          { name: "_inline_0_arg1_", lvalue: false, rvalue: false, count: 0 },
          { name: "_inline_0_arg2_", lvalue: false, rvalue: true, count: 1 }
        ],
        thisVars: ["this_i", "this_v"],
        localVars: []
      },
      body: {
        body: "{if(_inline_1_arg1_<this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
        args: [
          { name: "_inline_1_arg0_", lvalue: false, rvalue: true, count: 2 },
          { name: "_inline_1_arg1_", lvalue: false, rvalue: true, count: 2 }
        ],
        thisVars: ["this_i", "this_v"],
        localVars: ["_inline_1_k"]
      },
      post: {
        body: "{return this_i}",
        args: [],
        thisVars: ["this_i"],
        localVars: []
      }
    });
    exports2.argmax = compile({
      args: ["index", "array", "shape"],
      pre: {
        body: "{this_v=-Infinity;this_i=_inline_0_arg2_.slice(0)}",
        args: [
          { name: "_inline_0_arg0_", lvalue: false, rvalue: false, count: 0 },
          { name: "_inline_0_arg1_", lvalue: false, rvalue: false, count: 0 },
          { name: "_inline_0_arg2_", lvalue: false, rvalue: true, count: 1 }
        ],
        thisVars: ["this_i", "this_v"],
        localVars: []
      },
      body: {
        body: "{if(_inline_1_arg1_>this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
        args: [
          { name: "_inline_1_arg0_", lvalue: false, rvalue: true, count: 2 },
          { name: "_inline_1_arg1_", lvalue: false, rvalue: true, count: 2 }
        ],
        thisVars: ["this_i", "this_v"],
        localVars: ["_inline_1_k"]
      },
      post: {
        body: "{return this_i}",
        args: [],
        thisVars: ["this_i"],
        localVars: []
      }
    });
    exports2.random = makeOp({
      args: ["array"],
      pre: { args: [], body: "this_f=Math.random", thisVars: ["this_f"] },
      body: { args: ["a"], body: "a=this_f()", thisVars: ["this_f"] },
      funcName: "random"
    });
    exports2.assign = makeOp({
      args: ["array", "array"],
      body: { args: ["a", "b"], body: "a=b" },
      funcName: "assign"
    });
    exports2.assigns = makeOp({
      args: ["array", "scalar"],
      body: { args: ["a", "b"], body: "a=b" },
      funcName: "assigns"
    });
    exports2.equals = compile({
      args: ["array", "array"],
      pre: EmptyProc,
      body: {
        args: [
          { name: "x", lvalue: false, rvalue: true, count: 1 },
          { name: "y", lvalue: false, rvalue: true, count: 1 }
        ],
        body: "if(x!==y){return false}",
        localVars: [],
        thisVars: []
      },
      post: { args: [], localVars: [], thisVars: [], body: "return true" },
      funcName: "equals"
    });
  }
});

// node_modules/ndarray-pixels/dist/ndarray-pixels-node.cjs
var require_ndarray_pixels_node = __commonJS({
  "node_modules/ndarray-pixels/dist/ndarray-pixels-node.cjs"(exports2) {
    var ndarray = require_ndarray();
    var sharp = require_lib();
    var ops = require_ndarray_ops();
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : { "default": e };
    }
    var ndarray__default = /* @__PURE__ */ _interopDefaultLegacy(ndarray);
    var sharp__default = /* @__PURE__ */ _interopDefaultLegacy(sharp);
    var ops__default = /* @__PURE__ */ _interopDefaultLegacy(ops);
    async function getPixelsInternal(buffer, _mimeType) {
      if (!(buffer instanceof Uint8Array)) {
        throw new Error("[ndarray-pixels] Input must be Uint8Array or Buffer.");
      }
      const {
        data,
        info
      } = await sharp__default["default"](buffer).ensureAlpha().raw().toBuffer({
        resolveWithObject: true
      });
      return ndarray__default["default"](new Uint8Array(data), [info.width, info.height, 4], [4, 4 * info.width | 0, 1], 0);
    }
    function putPixelData(array, data, frame = -1) {
      if (array.shape.length === 4) {
        return putPixelData(array.pick(frame), data, 0);
      } else if (array.shape.length === 3) {
        if (array.shape[2] === 3) {
          ops__default["default"].assign(ndarray__default["default"](data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]), array);
          ops__default["default"].assigns(ndarray__default["default"](data, [array.shape[0] * array.shape[1]], [4], 3), 255);
        } else if (array.shape[2] === 4) {
          ops__default["default"].assign(ndarray__default["default"](data, [array.shape[0], array.shape[1], 4], [4, array.shape[0] * 4, 1]), array);
        } else if (array.shape[2] === 1) {
          ops__default["default"].assign(ndarray__default["default"](data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]), ndarray__default["default"](array.data, [array.shape[0], array.shape[1], 3], [array.stride[0], array.stride[1], 0], array.offset));
          ops__default["default"].assigns(ndarray__default["default"](data, [array.shape[0] * array.shape[1]], [4], 3), 255);
        } else {
          throw new Error("[ndarray-pixels] Incompatible array shape.");
        }
      } else if (array.shape.length === 2) {
        ops__default["default"].assign(ndarray__default["default"](data, [array.shape[0], array.shape[1], 3], [4, 4 * array.shape[0], 1]), ndarray__default["default"](array.data, [array.shape[0], array.shape[1], 3], [array.stride[0], array.stride[1], 0], array.offset));
        ops__default["default"].assigns(ndarray__default["default"](data, [array.shape[0] * array.shape[1]], [4], 3), 255);
      } else {
        throw new Error("[ndarray-pixels] Incompatible array shape.");
      }
      return data;
    }
    async function savePixelsInternal(pixels, mimeType) {
      const [width, height, channels] = pixels.shape;
      const data = putPixelData(pixels, new Uint8Array(width * height * channels));
      const format = mimeType.replace("image/", "");
      return sharp__default["default"](data, {
        raw: {
          width,
          height,
          channels
        }
      }).toFormat(format).toBuffer();
    }
    async function getPixels(data, mimeType) {
      return getPixelsInternal(data);
    }
    async function savePixels(pixels, mimeType) {
      return savePixelsInternal(pixels, mimeType);
    }
    exports2.getPixels = getPixels;
    exports2.savePixels = savePixels;
  }
});

// node_modules/ktx-parse/dist/ktx-parse.cjs
var require_ktx_parse = __commonJS({
  "node_modules/ktx-parse/dist/ktx-parse.cjs"(exports2) {
    var KHR_SUPERCOMPRESSION_NONE = 0;
    var KHR_SUPERCOMPRESSION_BASISLZ = 1;
    var KHR_SUPERCOMPRESSION_ZSTD = 2;
    var KHR_SUPERCOMPRESSION_ZLIB = 3;
    var KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT = 0;
    var KHR_DF_VENDORID_KHRONOS = 0;
    var KHR_DF_VERSION = 2;
    var KHR_DF_MODEL_UNSPECIFIED = 0;
    var KHR_DF_MODEL_RGBSDA = 1;
    var KHR_DF_MODEL_ETC1 = 160;
    var KHR_DF_MODEL_ETC2 = 161;
    var KHR_DF_MODEL_ASTC = 162;
    var KHR_DF_MODEL_ETC1S = 163;
    var KHR_DF_MODEL_UASTC = 166;
    var KHR_DF_FLAG_ALPHA_STRAIGHT = 0;
    var KHR_DF_FLAG_ALPHA_PREMULTIPLIED = 1;
    var KHR_DF_TRANSFER_UNSPECIFIED = 0;
    var KHR_DF_TRANSFER_LINEAR = 1;
    var KHR_DF_TRANSFER_SRGB = 2;
    var KHR_DF_TRANSFER_ITU = 3;
    var KHR_DF_TRANSFER_NTSC = 4;
    var KHR_DF_TRANSFER_SLOG = 5;
    var KHR_DF_TRANSFER_SLOG2 = 6;
    var KHR_DF_TRANSFER_BT1886 = 7;
    var KHR_DF_TRANSFER_HLG_OETF = 8;
    var KHR_DF_TRANSFER_HLG_EOTF = 9;
    var KHR_DF_TRANSFER_PQ_EOTF = 10;
    var KHR_DF_TRANSFER_PQ_OETF = 11;
    var KHR_DF_TRANSFER_DCIP3 = 12;
    var KHR_DF_TRANSFER_PAL_OETF = 13;
    var KHR_DF_TRANSFER_PAL625_EOTF = 14;
    var KHR_DF_TRANSFER_ST240 = 15;
    var KHR_DF_TRANSFER_ACESCC = 16;
    var KHR_DF_TRANSFER_ACESCCT = 17;
    var KHR_DF_TRANSFER_ADOBERGB = 18;
    var KHR_DF_PRIMARIES_UNSPECIFIED = 0;
    var KHR_DF_PRIMARIES_BT709 = 1;
    var KHR_DF_PRIMARIES_BT601_EBU = 2;
    var KHR_DF_PRIMARIES_BT601_SMPTE = 3;
    var KHR_DF_PRIMARIES_BT2020 = 4;
    var KHR_DF_PRIMARIES_CIEXYZ = 5;
    var KHR_DF_PRIMARIES_ACES = 6;
    var KHR_DF_PRIMARIES_ACESCC = 7;
    var KHR_DF_PRIMARIES_NTSC1953 = 8;
    var KHR_DF_PRIMARIES_PAL525 = 9;
    var KHR_DF_PRIMARIES_DISPLAYP3 = 10;
    var KHR_DF_PRIMARIES_ADOBERGB = 11;
    var KHR_DF_CHANNEL_RGBSDA_RED = 0;
    var KHR_DF_CHANNEL_RGBSDA_GREEN = 1;
    var KHR_DF_CHANNEL_RGBSDA_BLUE = 2;
    var KHR_DF_CHANNEL_RGBSDA_STENCIL = 13;
    var KHR_DF_CHANNEL_RGBSDA_DEPTH = 14;
    var KHR_DF_CHANNEL_RGBSDA_ALPHA = 15;
    var KHR_DF_SAMPLE_DATATYPE_FLOAT = 128;
    var KHR_DF_SAMPLE_DATATYPE_SIGNED = 64;
    var KHR_DF_SAMPLE_DATATYPE_EXPONENT = 32;
    var KHR_DF_SAMPLE_DATATYPE_LINEAR = 16;
    var VK_FORMAT_UNDEFINED = 0;
    var VK_FORMAT_R4G4_UNORM_PACK8 = 1;
    var VK_FORMAT_R4G4B4A4_UNORM_PACK16 = 2;
    var VK_FORMAT_B4G4R4A4_UNORM_PACK16 = 3;
    var VK_FORMAT_R5G6B5_UNORM_PACK16 = 4;
    var VK_FORMAT_B5G6R5_UNORM_PACK16 = 5;
    var VK_FORMAT_R5G5B5A1_UNORM_PACK16 = 6;
    var VK_FORMAT_B5G5R5A1_UNORM_PACK16 = 7;
    var VK_FORMAT_A1R5G5B5_UNORM_PACK16 = 8;
    var VK_FORMAT_R8_UNORM = 9;
    var VK_FORMAT_R8_SNORM = 10;
    var VK_FORMAT_R8_UINT = 13;
    var VK_FORMAT_R8_SINT = 14;
    var VK_FORMAT_R8_SRGB = 15;
    var VK_FORMAT_R8G8_UNORM = 16;
    var VK_FORMAT_R8G8_SNORM = 17;
    var VK_FORMAT_R8G8_UINT = 20;
    var VK_FORMAT_R8G8_SINT = 21;
    var VK_FORMAT_R8G8_SRGB = 22;
    var VK_FORMAT_R8G8B8_UNORM = 23;
    var VK_FORMAT_R8G8B8_SNORM = 24;
    var VK_FORMAT_R8G8B8_UINT = 27;
    var VK_FORMAT_R8G8B8_SINT = 28;
    var VK_FORMAT_R8G8B8_SRGB = 29;
    var VK_FORMAT_B8G8R8_UNORM = 30;
    var VK_FORMAT_B8G8R8_SNORM = 31;
    var VK_FORMAT_B8G8R8_UINT = 34;
    var VK_FORMAT_B8G8R8_SINT = 35;
    var VK_FORMAT_B8G8R8_SRGB = 36;
    var VK_FORMAT_R8G8B8A8_UNORM = 37;
    var VK_FORMAT_R8G8B8A8_SNORM = 38;
    var VK_FORMAT_R8G8B8A8_UINT = 41;
    var VK_FORMAT_R8G8B8A8_SINT = 42;
    var VK_FORMAT_R8G8B8A8_SRGB = 43;
    var VK_FORMAT_B8G8R8A8_UNORM = 44;
    var VK_FORMAT_B8G8R8A8_SNORM = 45;
    var VK_FORMAT_B8G8R8A8_UINT = 48;
    var VK_FORMAT_B8G8R8A8_SINT = 49;
    var VK_FORMAT_B8G8R8A8_SRGB = 50;
    var VK_FORMAT_A2R10G10B10_UNORM_PACK32 = 58;
    var VK_FORMAT_A2R10G10B10_SNORM_PACK32 = 59;
    var VK_FORMAT_A2R10G10B10_UINT_PACK32 = 62;
    var VK_FORMAT_A2R10G10B10_SINT_PACK32 = 63;
    var VK_FORMAT_A2B10G10R10_UNORM_PACK32 = 64;
    var VK_FORMAT_A2B10G10R10_SNORM_PACK32 = 65;
    var VK_FORMAT_A2B10G10R10_UINT_PACK32 = 68;
    var VK_FORMAT_A2B10G10R10_SINT_PACK32 = 69;
    var VK_FORMAT_R16_UNORM = 70;
    var VK_FORMAT_R16_SNORM = 71;
    var VK_FORMAT_R16_UINT = 74;
    var VK_FORMAT_R16_SINT = 75;
    var VK_FORMAT_R16_SFLOAT = 76;
    var VK_FORMAT_R16G16_UNORM = 77;
    var VK_FORMAT_R16G16_SNORM = 78;
    var VK_FORMAT_R16G16_UINT = 81;
    var VK_FORMAT_R16G16_SINT = 82;
    var VK_FORMAT_R16G16_SFLOAT = 83;
    var VK_FORMAT_R16G16B16_UNORM = 84;
    var VK_FORMAT_R16G16B16_SNORM = 85;
    var VK_FORMAT_R16G16B16_UINT = 88;
    var VK_FORMAT_R16G16B16_SINT = 89;
    var VK_FORMAT_R16G16B16_SFLOAT = 90;
    var VK_FORMAT_R16G16B16A16_UNORM = 91;
    var VK_FORMAT_R16G16B16A16_SNORM = 92;
    var VK_FORMAT_R16G16B16A16_UINT = 95;
    var VK_FORMAT_R16G16B16A16_SINT = 96;
    var VK_FORMAT_R16G16B16A16_SFLOAT = 97;
    var VK_FORMAT_R32_UINT = 98;
    var VK_FORMAT_R32_SINT = 99;
    var VK_FORMAT_R32_SFLOAT = 100;
    var VK_FORMAT_R32G32_UINT = 101;
    var VK_FORMAT_R32G32_SINT = 102;
    var VK_FORMAT_R32G32_SFLOAT = 103;
    var VK_FORMAT_R32G32B32_UINT = 104;
    var VK_FORMAT_R32G32B32_SINT = 105;
    var VK_FORMAT_R32G32B32_SFLOAT = 106;
    var VK_FORMAT_R32G32B32A32_UINT = 107;
    var VK_FORMAT_R32G32B32A32_SINT = 108;
    var VK_FORMAT_R32G32B32A32_SFLOAT = 109;
    var VK_FORMAT_R64_UINT = 110;
    var VK_FORMAT_R64_SINT = 111;
    var VK_FORMAT_R64_SFLOAT = 112;
    var VK_FORMAT_R64G64_UINT = 113;
    var VK_FORMAT_R64G64_SINT = 114;
    var VK_FORMAT_R64G64_SFLOAT = 115;
    var VK_FORMAT_R64G64B64_UINT = 116;
    var VK_FORMAT_R64G64B64_SINT = 117;
    var VK_FORMAT_R64G64B64_SFLOAT = 118;
    var VK_FORMAT_R64G64B64A64_UINT = 119;
    var VK_FORMAT_R64G64B64A64_SINT = 120;
    var VK_FORMAT_R64G64B64A64_SFLOAT = 121;
    var VK_FORMAT_B10G11R11_UFLOAT_PACK32 = 122;
    var VK_FORMAT_E5B9G9R9_UFLOAT_PACK32 = 123;
    var VK_FORMAT_D16_UNORM = 124;
    var VK_FORMAT_X8_D24_UNORM_PACK32 = 125;
    var VK_FORMAT_D32_SFLOAT = 126;
    var VK_FORMAT_S8_UINT = 127;
    var VK_FORMAT_D16_UNORM_S8_UINT = 128;
    var VK_FORMAT_D24_UNORM_S8_UINT = 129;
    var VK_FORMAT_D32_SFLOAT_S8_UINT = 130;
    var VK_FORMAT_BC1_RGB_UNORM_BLOCK = 131;
    var VK_FORMAT_BC1_RGB_SRGB_BLOCK = 132;
    var VK_FORMAT_BC1_RGBA_UNORM_BLOCK = 133;
    var VK_FORMAT_BC1_RGBA_SRGB_BLOCK = 134;
    var VK_FORMAT_BC2_UNORM_BLOCK = 135;
    var VK_FORMAT_BC2_SRGB_BLOCK = 136;
    var VK_FORMAT_BC3_UNORM_BLOCK = 137;
    var VK_FORMAT_BC3_SRGB_BLOCK = 138;
    var VK_FORMAT_BC4_UNORM_BLOCK = 139;
    var VK_FORMAT_BC4_SNORM_BLOCK = 140;
    var VK_FORMAT_BC5_UNORM_BLOCK = 141;
    var VK_FORMAT_BC5_SNORM_BLOCK = 142;
    var VK_FORMAT_BC6H_UFLOAT_BLOCK = 143;
    var VK_FORMAT_BC6H_SFLOAT_BLOCK = 144;
    var VK_FORMAT_BC7_UNORM_BLOCK = 145;
    var VK_FORMAT_BC7_SRGB_BLOCK = 146;
    var VK_FORMAT_ETC2_R8G8B8_UNORM_BLOCK = 147;
    var VK_FORMAT_ETC2_R8G8B8_SRGB_BLOCK = 148;
    var VK_FORMAT_ETC2_R8G8B8A1_UNORM_BLOCK = 149;
    var VK_FORMAT_ETC2_R8G8B8A1_SRGB_BLOCK = 150;
    var VK_FORMAT_ETC2_R8G8B8A8_UNORM_BLOCK = 151;
    var VK_FORMAT_ETC2_R8G8B8A8_SRGB_BLOCK = 152;
    var VK_FORMAT_EAC_R11_UNORM_BLOCK = 153;
    var VK_FORMAT_EAC_R11_SNORM_BLOCK = 154;
    var VK_FORMAT_EAC_R11G11_UNORM_BLOCK = 155;
    var VK_FORMAT_EAC_R11G11_SNORM_BLOCK = 156;
    var VK_FORMAT_ASTC_4x4_UNORM_BLOCK = 157;
    var VK_FORMAT_ASTC_4x4_SRGB_BLOCK = 158;
    var VK_FORMAT_ASTC_5x4_UNORM_BLOCK = 159;
    var VK_FORMAT_ASTC_5x4_SRGB_BLOCK = 160;
    var VK_FORMAT_ASTC_5x5_UNORM_BLOCK = 161;
    var VK_FORMAT_ASTC_5x5_SRGB_BLOCK = 162;
    var VK_FORMAT_ASTC_6x5_UNORM_BLOCK = 163;
    var VK_FORMAT_ASTC_6x5_SRGB_BLOCK = 164;
    var VK_FORMAT_ASTC_6x6_UNORM_BLOCK = 165;
    var VK_FORMAT_ASTC_6x6_SRGB_BLOCK = 166;
    var VK_FORMAT_ASTC_8x5_UNORM_BLOCK = 167;
    var VK_FORMAT_ASTC_8x5_SRGB_BLOCK = 168;
    var VK_FORMAT_ASTC_8x6_UNORM_BLOCK = 169;
    var VK_FORMAT_ASTC_8x6_SRGB_BLOCK = 170;
    var VK_FORMAT_ASTC_8x8_UNORM_BLOCK = 171;
    var VK_FORMAT_ASTC_8x8_SRGB_BLOCK = 172;
    var VK_FORMAT_ASTC_10x5_UNORM_BLOCK = 173;
    var VK_FORMAT_ASTC_10x5_SRGB_BLOCK = 174;
    var VK_FORMAT_ASTC_10x6_UNORM_BLOCK = 175;
    var VK_FORMAT_ASTC_10x6_SRGB_BLOCK = 176;
    var VK_FORMAT_ASTC_10x8_UNORM_BLOCK = 177;
    var VK_FORMAT_ASTC_10x8_SRGB_BLOCK = 178;
    var VK_FORMAT_ASTC_10x10_UNORM_BLOCK = 179;
    var VK_FORMAT_ASTC_10x10_SRGB_BLOCK = 180;
    var VK_FORMAT_ASTC_12x10_UNORM_BLOCK = 181;
    var VK_FORMAT_ASTC_12x10_SRGB_BLOCK = 182;
    var VK_FORMAT_ASTC_12x12_UNORM_BLOCK = 183;
    var VK_FORMAT_ASTC_12x12_SRGB_BLOCK = 184;
    var VK_FORMAT_R10X6_UNORM_PACK16 = 1000156007;
    var VK_FORMAT_R10X6G10X6_UNORM_2PACK16 = 1000156008;
    var VK_FORMAT_R10X6G10X6B10X6A10X6_UNORM_4PACK16 = 1000156009;
    var VK_FORMAT_G10X6B10X6G10X6R10X6_422_UNORM_4PACK16 = 1000156010;
    var VK_FORMAT_B10X6G10X6R10X6G10X6_422_UNORM_4PACK16 = 1000156011;
    var VK_FORMAT_R12X4_UNORM_PACK16 = 1000156017;
    var VK_FORMAT_R12X4G12X4_UNORM_2PACK16 = 1000156018;
    var VK_FORMAT_R12X4G12X4B12X4A12X4_UNORM_4PACK16 = 1000156019;
    var VK_FORMAT_G12X4B12X4G12X4R12X4_422_UNORM_4PACK16 = 1000156020;
    var VK_FORMAT_B12X4G12X4R12X4G12X4_422_UNORM_4PACK16 = 1000156021;
    var VK_FORMAT_PVRTC1_2BPP_UNORM_BLOCK_IMG = 1000054e3;
    var VK_FORMAT_PVRTC1_4BPP_UNORM_BLOCK_IMG = 1000054001;
    var VK_FORMAT_PVRTC2_2BPP_UNORM_BLOCK_IMG = 1000054002;
    var VK_FORMAT_PVRTC2_4BPP_UNORM_BLOCK_IMG = 1000054003;
    var VK_FORMAT_PVRTC1_2BPP_SRGB_BLOCK_IMG = 1000054004;
    var VK_FORMAT_PVRTC1_4BPP_SRGB_BLOCK_IMG = 1000054005;
    var VK_FORMAT_PVRTC2_2BPP_SRGB_BLOCK_IMG = 1000054006;
    var VK_FORMAT_PVRTC2_4BPP_SRGB_BLOCK_IMG = 1000054007;
    var VK_FORMAT_ASTC_4x4_SFLOAT_BLOCK_EXT = 1000066e3;
    var VK_FORMAT_ASTC_5x4_SFLOAT_BLOCK_EXT = 1000066001;
    var VK_FORMAT_ASTC_5x5_SFLOAT_BLOCK_EXT = 1000066002;
    var VK_FORMAT_ASTC_6x5_SFLOAT_BLOCK_EXT = 1000066003;
    var VK_FORMAT_ASTC_6x6_SFLOAT_BLOCK_EXT = 1000066004;
    var VK_FORMAT_ASTC_8x5_SFLOAT_BLOCK_EXT = 1000066005;
    var VK_FORMAT_ASTC_8x6_SFLOAT_BLOCK_EXT = 1000066006;
    var VK_FORMAT_ASTC_8x8_SFLOAT_BLOCK_EXT = 1000066007;
    var VK_FORMAT_ASTC_10x5_SFLOAT_BLOCK_EXT = 1000066008;
    var VK_FORMAT_ASTC_10x6_SFLOAT_BLOCK_EXT = 1000066009;
    var VK_FORMAT_ASTC_10x8_SFLOAT_BLOCK_EXT = 1000066010;
    var VK_FORMAT_ASTC_10x10_SFLOAT_BLOCK_EXT = 1000066011;
    var VK_FORMAT_ASTC_12x10_SFLOAT_BLOCK_EXT = 1000066012;
    var VK_FORMAT_ASTC_12x12_SFLOAT_BLOCK_EXT = 1000066013;
    var VK_FORMAT_A4R4G4B4_UNORM_PACK16_EXT = 100034e4;
    var VK_FORMAT_A4B4G4R4_UNORM_PACK16_EXT = 1000340001;
    var KTX2Container = class {
      constructor() {
        this.vkFormat = VK_FORMAT_UNDEFINED;
        this.typeSize = 1;
        this.pixelWidth = 0;
        this.pixelHeight = 0;
        this.pixelDepth = 0;
        this.layerCount = 0;
        this.faceCount = 1;
        this.supercompressionScheme = KHR_SUPERCOMPRESSION_NONE;
        this.levels = [];
        this.dataFormatDescriptor = [{
          vendorId: KHR_DF_VENDORID_KHRONOS,
          descriptorType: KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT,
          descriptorBlockSize: 0,
          versionNumber: KHR_DF_VERSION,
          colorModel: KHR_DF_MODEL_UNSPECIFIED,
          colorPrimaries: KHR_DF_PRIMARIES_BT709,
          transferFunction: KHR_DF_TRANSFER_SRGB,
          flags: KHR_DF_FLAG_ALPHA_STRAIGHT,
          texelBlockDimension: [0, 0, 0, 0],
          bytesPlane: [0, 0, 0, 0, 0, 0, 0, 0],
          samples: []
        }];
        this.keyValue = {};
        this.globalData = null;
      }
    };
    var BufferReader = class {
      constructor(data, byteOffset, byteLength, littleEndian) {
        this._dataView = void 0;
        this._littleEndian = void 0;
        this._offset = void 0;
        this._dataView = new DataView(data.buffer, data.byteOffset + byteOffset, byteLength);
        this._littleEndian = littleEndian;
        this._offset = 0;
      }
      _nextUint8() {
        const value = this._dataView.getUint8(this._offset);
        this._offset += 1;
        return value;
      }
      _nextUint16() {
        const value = this._dataView.getUint16(this._offset, this._littleEndian);
        this._offset += 2;
        return value;
      }
      _nextUint32() {
        const value = this._dataView.getUint32(this._offset, this._littleEndian);
        this._offset += 4;
        return value;
      }
      _nextUint64() {
        const left = this._dataView.getUint32(this._offset, this._littleEndian);
        const right = this._dataView.getUint32(this._offset + 4, this._littleEndian);
        const value = left + 2 ** 32 * right;
        this._offset += 8;
        return value;
      }
      _nextInt32() {
        const value = this._dataView.getInt32(this._offset, this._littleEndian);
        this._offset += 4;
        return value;
      }
      _nextUint8Array(len) {
        const value = new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + this._offset, len);
        this._offset += len;
        return value;
      }
      _skip(bytes) {
        this._offset += bytes;
        return this;
      }
      _scan(maxByteLength, term) {
        if (term === void 0) {
          term = 0;
        }
        const byteOffset = this._offset;
        let byteLength = 0;
        while (this._dataView.getUint8(this._offset) !== term && byteLength < maxByteLength) {
          byteLength++;
          this._offset++;
        }
        if (byteLength < maxByteLength) this._offset++;
        return new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + byteOffset, byteLength);
      }
    };
    var KTX_WRITER = "KTX-Parse v0.6.0";
    var NUL = new Uint8Array([0]);
    var KTX2_ID = [
      // '´', 'K', 'T', 'X', '2', '0', 'ª', '\r', '\n', '\x1A', '\n'
      171,
      75,
      84,
      88,
      32,
      50,
      48,
      187,
      13,
      10,
      26,
      10
    ];
    var HEADER_BYTE_LENGTH = 68;
    function encodeText(text) {
      if (typeof TextEncoder !== "undefined") {
        return new TextEncoder().encode(text);
      }
      return Buffer.from(text);
    }
    function decodeText(buffer) {
      if (typeof TextDecoder !== "undefined") {
        return new TextDecoder().decode(buffer);
      }
      return Buffer.from(buffer).toString("utf8");
    }
    function concat(buffers) {
      let totalByteLength = 0;
      for (const buffer of buffers) {
        totalByteLength += buffer.byteLength;
      }
      const result = new Uint8Array(totalByteLength);
      let byteOffset = 0;
      for (const buffer of buffers) {
        result.set(new Uint8Array(buffer), byteOffset);
        byteOffset += buffer.byteLength;
      }
      return result;
    }
    function read(data) {
      const id = new Uint8Array(data.buffer, data.byteOffset, KTX2_ID.length);
      if (id[0] !== KTX2_ID[0] || // '´'
      id[1] !== KTX2_ID[1] || // 'K'
      id[2] !== KTX2_ID[2] || // 'T'
      id[3] !== KTX2_ID[3] || // 'X'
      id[4] !== KTX2_ID[4] || // ' '
      id[5] !== KTX2_ID[5] || // '2'
      id[6] !== KTX2_ID[6] || // '0'
      id[7] !== KTX2_ID[7] || // 'ª'
      id[8] !== KTX2_ID[8] || // '\r'
      id[9] !== KTX2_ID[9] || // '\n'
      id[10] !== KTX2_ID[10] || // '\x1A'
      id[11] !== KTX2_ID[11]) {
        throw new Error("Missing KTX 2.0 identifier.");
      }
      const container = new KTX2Container();
      const headerByteLength = 17 * Uint32Array.BYTES_PER_ELEMENT;
      const headerReader = new BufferReader(data, KTX2_ID.length, headerByteLength, true);
      container.vkFormat = headerReader._nextUint32();
      container.typeSize = headerReader._nextUint32();
      container.pixelWidth = headerReader._nextUint32();
      container.pixelHeight = headerReader._nextUint32();
      container.pixelDepth = headerReader._nextUint32();
      container.layerCount = headerReader._nextUint32();
      container.faceCount = headerReader._nextUint32();
      const levelCount = headerReader._nextUint32();
      container.supercompressionScheme = headerReader._nextUint32();
      const dfdByteOffset = headerReader._nextUint32();
      const dfdByteLength = headerReader._nextUint32();
      const kvdByteOffset = headerReader._nextUint32();
      const kvdByteLength = headerReader._nextUint32();
      const sgdByteOffset = headerReader._nextUint64();
      const sgdByteLength = headerReader._nextUint64();
      const levelByteLength = levelCount * 3 * 8;
      const levelReader = new BufferReader(data, KTX2_ID.length + headerByteLength, levelByteLength, true);
      for (let i = 0; i < levelCount; i++) {
        container.levels.push({
          levelData: new Uint8Array(data.buffer, data.byteOffset + levelReader._nextUint64(), levelReader._nextUint64()),
          uncompressedByteLength: levelReader._nextUint64()
        });
      }
      const dfdReader = new BufferReader(data, dfdByteOffset, dfdByteLength, true);
      const dfd = {
        vendorId: dfdReader._skip(
          4
          /* totalSize */
        )._nextUint16(),
        descriptorType: dfdReader._nextUint16(),
        versionNumber: dfdReader._nextUint16(),
        descriptorBlockSize: dfdReader._nextUint16(),
        colorModel: dfdReader._nextUint8(),
        colorPrimaries: dfdReader._nextUint8(),
        transferFunction: dfdReader._nextUint8(),
        flags: dfdReader._nextUint8(),
        texelBlockDimension: [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()],
        bytesPlane: [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()],
        samples: []
      };
      const sampleStart = 6;
      const sampleWords = 4;
      const numSamples = (dfd.descriptorBlockSize / 4 - sampleStart) / sampleWords;
      for (let i = 0; i < numSamples; i++) {
        const sample = {
          bitOffset: dfdReader._nextUint16(),
          bitLength: dfdReader._nextUint8(),
          channelType: dfdReader._nextUint8(),
          samplePosition: [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()],
          sampleLower: -Infinity,
          sampleUpper: Infinity
        };
        if (sample.channelType & KHR_DF_SAMPLE_DATATYPE_SIGNED) {
          sample.sampleLower = dfdReader._nextInt32();
          sample.sampleUpper = dfdReader._nextInt32();
        } else {
          sample.sampleLower = dfdReader._nextUint32();
          sample.sampleUpper = dfdReader._nextUint32();
        }
        dfd.samples[i] = sample;
      }
      container.dataFormatDescriptor.length = 0;
      container.dataFormatDescriptor.push(dfd);
      const kvdReader = new BufferReader(data, kvdByteOffset, kvdByteLength, true);
      while (kvdReader._offset < kvdByteLength) {
        const keyValueByteLength = kvdReader._nextUint32();
        const keyData = kvdReader._scan(keyValueByteLength);
        const key = decodeText(keyData);
        container.keyValue[key] = kvdReader._nextUint8Array(keyValueByteLength - keyData.byteLength - 1);
        if (key.match(/^ktx/i)) {
          const text = decodeText(container.keyValue[key]);
          container.keyValue[key] = text.substring(0, text.lastIndexOf("\0"));
        }
        const kvPadding = keyValueByteLength % 4 ? 4 - keyValueByteLength % 4 : 0;
        kvdReader._skip(kvPadding);
      }
      if (sgdByteLength <= 0) return container;
      const sgdReader = new BufferReader(data, sgdByteOffset, sgdByteLength, true);
      const endpointCount = sgdReader._nextUint16();
      const selectorCount = sgdReader._nextUint16();
      const endpointsByteLength = sgdReader._nextUint32();
      const selectorsByteLength = sgdReader._nextUint32();
      const tablesByteLength = sgdReader._nextUint32();
      const extendedByteLength = sgdReader._nextUint32();
      const imageDescs = [];
      for (let i = 0; i < levelCount; i++) {
        imageDescs.push({
          imageFlags: sgdReader._nextUint32(),
          rgbSliceByteOffset: sgdReader._nextUint32(),
          rgbSliceByteLength: sgdReader._nextUint32(),
          alphaSliceByteOffset: sgdReader._nextUint32(),
          alphaSliceByteLength: sgdReader._nextUint32()
        });
      }
      const endpointsByteOffset = sgdByteOffset + sgdReader._offset;
      const selectorsByteOffset = endpointsByteOffset + endpointsByteLength;
      const tablesByteOffset = selectorsByteOffset + selectorsByteLength;
      const extendedByteOffset = tablesByteOffset + tablesByteLength;
      const endpointsData = new Uint8Array(data.buffer, data.byteOffset + endpointsByteOffset, endpointsByteLength);
      const selectorsData = new Uint8Array(data.buffer, data.byteOffset + selectorsByteOffset, selectorsByteLength);
      const tablesData = new Uint8Array(data.buffer, data.byteOffset + tablesByteOffset, tablesByteLength);
      const extendedData = new Uint8Array(data.buffer, data.byteOffset + extendedByteOffset, extendedByteLength);
      container.globalData = {
        endpointCount,
        selectorCount,
        imageDescs,
        endpointsData,
        selectorsData,
        tablesData,
        extendedData
      };
      return container;
    }
    var DEFAULT_OPTIONS = {
      keepWriter: false
    };
    function write(container, options) {
      if (options === void 0) {
        options = {};
      }
      options = {
        ...DEFAULT_OPTIONS,
        ...options
      };
      let sgdBuffer = new ArrayBuffer(0);
      if (container.globalData) {
        const sgdHeaderBuffer = new ArrayBuffer(20 + container.globalData.imageDescs.length * 5 * 4);
        const sgdHeaderView = new DataView(sgdHeaderBuffer);
        sgdHeaderView.setUint16(0, container.globalData.endpointCount, true);
        sgdHeaderView.setUint16(2, container.globalData.selectorCount, true);
        sgdHeaderView.setUint32(4, container.globalData.endpointsData.byteLength, true);
        sgdHeaderView.setUint32(8, container.globalData.selectorsData.byteLength, true);
        sgdHeaderView.setUint32(12, container.globalData.tablesData.byteLength, true);
        sgdHeaderView.setUint32(16, container.globalData.extendedData.byteLength, true);
        for (let i = 0; i < container.globalData.imageDescs.length; i++) {
          const imageDesc = container.globalData.imageDescs[i];
          sgdHeaderView.setUint32(20 + i * 5 * 4 + 0, imageDesc.imageFlags, true);
          sgdHeaderView.setUint32(20 + i * 5 * 4 + 4, imageDesc.rgbSliceByteOffset, true);
          sgdHeaderView.setUint32(20 + i * 5 * 4 + 8, imageDesc.rgbSliceByteLength, true);
          sgdHeaderView.setUint32(20 + i * 5 * 4 + 12, imageDesc.alphaSliceByteOffset, true);
          sgdHeaderView.setUint32(20 + i * 5 * 4 + 16, imageDesc.alphaSliceByteLength, true);
        }
        sgdBuffer = concat([sgdHeaderBuffer, container.globalData.endpointsData, container.globalData.selectorsData, container.globalData.tablesData, container.globalData.extendedData]);
      }
      const keyValueData = [];
      let keyValue = container.keyValue;
      if (!options.keepWriter) {
        keyValue = {
          ...container.keyValue,
          KTXwriter: KTX_WRITER
        };
      }
      for (const key in keyValue) {
        const value = keyValue[key];
        const keyData = encodeText(key);
        const valueData = typeof value === "string" ? concat([encodeText(value), NUL]) : value;
        const kvByteLength = keyData.byteLength + 1 + valueData.byteLength;
        const kvPadding = kvByteLength % 4 ? 4 - kvByteLength % 4 : 0;
        keyValueData.push(concat([
          new Uint32Array([kvByteLength]),
          keyData,
          NUL,
          valueData,
          new Uint8Array(kvPadding).fill(0)
          // align(4)
        ]));
      }
      const kvdBuffer = concat(keyValueData);
      if (container.dataFormatDescriptor.length !== 1 || container.dataFormatDescriptor[0].descriptorType !== KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT) {
        throw new Error("Only BASICFORMAT Data Format Descriptor output supported.");
      }
      const dfd = container.dataFormatDescriptor[0];
      const dfdBuffer = new ArrayBuffer(28 + dfd.samples.length * 16);
      const dfdView = new DataView(dfdBuffer);
      const descriptorBlockSize = 24 + dfd.samples.length * 16;
      dfdView.setUint32(0, dfdBuffer.byteLength, true);
      dfdView.setUint16(4, dfd.vendorId, true);
      dfdView.setUint16(6, dfd.descriptorType, true);
      dfdView.setUint16(8, dfd.versionNumber, true);
      dfdView.setUint16(10, descriptorBlockSize, true);
      dfdView.setUint8(12, dfd.colorModel);
      dfdView.setUint8(13, dfd.colorPrimaries);
      dfdView.setUint8(14, dfd.transferFunction);
      dfdView.setUint8(15, dfd.flags);
      if (!Array.isArray(dfd.texelBlockDimension)) {
        throw new Error("texelBlockDimension is now an array. For dimensionality `d`, set `d - 1`.");
      }
      dfdView.setUint8(16, dfd.texelBlockDimension[0]);
      dfdView.setUint8(17, dfd.texelBlockDimension[1]);
      dfdView.setUint8(18, dfd.texelBlockDimension[2]);
      dfdView.setUint8(19, dfd.texelBlockDimension[3]);
      for (let i = 0; i < 8; i++) dfdView.setUint8(20 + i, dfd.bytesPlane[i]);
      for (let i = 0; i < dfd.samples.length; i++) {
        const sample = dfd.samples[i];
        const sampleByteOffset = 28 + i * 16;
        if (sample.channelID) {
          throw new Error("channelID has been renamed to channelType.");
        }
        dfdView.setUint16(sampleByteOffset + 0, sample.bitOffset, true);
        dfdView.setUint8(sampleByteOffset + 2, sample.bitLength);
        dfdView.setUint8(sampleByteOffset + 3, sample.channelType);
        dfdView.setUint8(sampleByteOffset + 4, sample.samplePosition[0]);
        dfdView.setUint8(sampleByteOffset + 5, sample.samplePosition[1]);
        dfdView.setUint8(sampleByteOffset + 6, sample.samplePosition[2]);
        dfdView.setUint8(sampleByteOffset + 7, sample.samplePosition[3]);
        if (sample.channelType & KHR_DF_SAMPLE_DATATYPE_SIGNED) {
          dfdView.setInt32(sampleByteOffset + 8, sample.sampleLower, true);
          dfdView.setInt32(sampleByteOffset + 12, sample.sampleUpper, true);
        } else {
          dfdView.setUint32(sampleByteOffset + 8, sample.sampleLower, true);
          dfdView.setUint32(sampleByteOffset + 12, sample.sampleUpper, true);
        }
      }
      const dfdByteOffset = KTX2_ID.length + HEADER_BYTE_LENGTH + container.levels.length * 3 * 8;
      const kvdByteOffset = dfdByteOffset + dfdBuffer.byteLength;
      let sgdByteOffset = sgdBuffer.byteLength > 0 ? kvdByteOffset + kvdBuffer.byteLength : 0;
      if (sgdByteOffset % 8) sgdByteOffset += 8 - sgdByteOffset % 8;
      const levelData = [];
      const levelIndex = new DataView(new ArrayBuffer(container.levels.length * 3 * 8));
      let levelDataByteOffset = (sgdByteOffset || kvdByteOffset + kvdBuffer.byteLength) + sgdBuffer.byteLength;
      for (let i = 0; i < container.levels.length; i++) {
        const level = container.levels[i];
        levelData.push(level.levelData);
        levelIndex.setBigUint64(i * 24 + 0, BigInt(levelDataByteOffset), true);
        levelIndex.setBigUint64(i * 24 + 8, BigInt(level.levelData.byteLength), true);
        levelIndex.setBigUint64(i * 24 + 16, BigInt(level.uncompressedByteLength), true);
        levelDataByteOffset += level.levelData.byteLength;
      }
      const headerBuffer = new ArrayBuffer(HEADER_BYTE_LENGTH);
      const headerView = new DataView(headerBuffer);
      headerView.setUint32(0, container.vkFormat, true);
      headerView.setUint32(4, container.typeSize, true);
      headerView.setUint32(8, container.pixelWidth, true);
      headerView.setUint32(12, container.pixelHeight, true);
      headerView.setUint32(16, container.pixelDepth, true);
      headerView.setUint32(20, container.layerCount, true);
      headerView.setUint32(24, container.faceCount, true);
      headerView.setUint32(28, container.levels.length, true);
      headerView.setUint32(32, container.supercompressionScheme, true);
      headerView.setUint32(36, dfdByteOffset, true);
      headerView.setUint32(40, dfdBuffer.byteLength, true);
      headerView.setUint32(44, kvdByteOffset, true);
      headerView.setUint32(48, kvdBuffer.byteLength, true);
      headerView.setBigUint64(52, BigInt(sgdBuffer.byteLength > 0 ? sgdByteOffset : 0), true);
      headerView.setBigUint64(60, BigInt(sgdBuffer.byteLength), true);
      return new Uint8Array(concat([new Uint8Array(KTX2_ID).buffer, headerBuffer, levelIndex.buffer, dfdBuffer, kvdBuffer, sgdByteOffset > 0 ? new ArrayBuffer(sgdByteOffset - (kvdByteOffset + kvdBuffer.byteLength)) : new ArrayBuffer(0), sgdBuffer, ...levelData]));
    }
    exports2.KHR_DF_CHANNEL_RGBSDA_ALPHA = KHR_DF_CHANNEL_RGBSDA_ALPHA;
    exports2.KHR_DF_CHANNEL_RGBSDA_BLUE = KHR_DF_CHANNEL_RGBSDA_BLUE;
    exports2.KHR_DF_CHANNEL_RGBSDA_DEPTH = KHR_DF_CHANNEL_RGBSDA_DEPTH;
    exports2.KHR_DF_CHANNEL_RGBSDA_GREEN = KHR_DF_CHANNEL_RGBSDA_GREEN;
    exports2.KHR_DF_CHANNEL_RGBSDA_RED = KHR_DF_CHANNEL_RGBSDA_RED;
    exports2.KHR_DF_CHANNEL_RGBSDA_STENCIL = KHR_DF_CHANNEL_RGBSDA_STENCIL;
    exports2.KHR_DF_FLAG_ALPHA_PREMULTIPLIED = KHR_DF_FLAG_ALPHA_PREMULTIPLIED;
    exports2.KHR_DF_FLAG_ALPHA_STRAIGHT = KHR_DF_FLAG_ALPHA_STRAIGHT;
    exports2.KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT = KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT;
    exports2.KHR_DF_MODEL_ASTC = KHR_DF_MODEL_ASTC;
    exports2.KHR_DF_MODEL_ETC1 = KHR_DF_MODEL_ETC1;
    exports2.KHR_DF_MODEL_ETC1S = KHR_DF_MODEL_ETC1S;
    exports2.KHR_DF_MODEL_ETC2 = KHR_DF_MODEL_ETC2;
    exports2.KHR_DF_MODEL_RGBSDA = KHR_DF_MODEL_RGBSDA;
    exports2.KHR_DF_MODEL_UASTC = KHR_DF_MODEL_UASTC;
    exports2.KHR_DF_MODEL_UNSPECIFIED = KHR_DF_MODEL_UNSPECIFIED;
    exports2.KHR_DF_PRIMARIES_ACES = KHR_DF_PRIMARIES_ACES;
    exports2.KHR_DF_PRIMARIES_ACESCC = KHR_DF_PRIMARIES_ACESCC;
    exports2.KHR_DF_PRIMARIES_ADOBERGB = KHR_DF_PRIMARIES_ADOBERGB;
    exports2.KHR_DF_PRIMARIES_BT2020 = KHR_DF_PRIMARIES_BT2020;
    exports2.KHR_DF_PRIMARIES_BT601_EBU = KHR_DF_PRIMARIES_BT601_EBU;
    exports2.KHR_DF_PRIMARIES_BT601_SMPTE = KHR_DF_PRIMARIES_BT601_SMPTE;
    exports2.KHR_DF_PRIMARIES_BT709 = KHR_DF_PRIMARIES_BT709;
    exports2.KHR_DF_PRIMARIES_CIEXYZ = KHR_DF_PRIMARIES_CIEXYZ;
    exports2.KHR_DF_PRIMARIES_DISPLAYP3 = KHR_DF_PRIMARIES_DISPLAYP3;
    exports2.KHR_DF_PRIMARIES_NTSC1953 = KHR_DF_PRIMARIES_NTSC1953;
    exports2.KHR_DF_PRIMARIES_PAL525 = KHR_DF_PRIMARIES_PAL525;
    exports2.KHR_DF_PRIMARIES_UNSPECIFIED = KHR_DF_PRIMARIES_UNSPECIFIED;
    exports2.KHR_DF_SAMPLE_DATATYPE_EXPONENT = KHR_DF_SAMPLE_DATATYPE_EXPONENT;
    exports2.KHR_DF_SAMPLE_DATATYPE_FLOAT = KHR_DF_SAMPLE_DATATYPE_FLOAT;
    exports2.KHR_DF_SAMPLE_DATATYPE_LINEAR = KHR_DF_SAMPLE_DATATYPE_LINEAR;
    exports2.KHR_DF_SAMPLE_DATATYPE_SIGNED = KHR_DF_SAMPLE_DATATYPE_SIGNED;
    exports2.KHR_DF_TRANSFER_ACESCC = KHR_DF_TRANSFER_ACESCC;
    exports2.KHR_DF_TRANSFER_ACESCCT = KHR_DF_TRANSFER_ACESCCT;
    exports2.KHR_DF_TRANSFER_ADOBERGB = KHR_DF_TRANSFER_ADOBERGB;
    exports2.KHR_DF_TRANSFER_BT1886 = KHR_DF_TRANSFER_BT1886;
    exports2.KHR_DF_TRANSFER_DCIP3 = KHR_DF_TRANSFER_DCIP3;
    exports2.KHR_DF_TRANSFER_HLG_EOTF = KHR_DF_TRANSFER_HLG_EOTF;
    exports2.KHR_DF_TRANSFER_HLG_OETF = KHR_DF_TRANSFER_HLG_OETF;
    exports2.KHR_DF_TRANSFER_ITU = KHR_DF_TRANSFER_ITU;
    exports2.KHR_DF_TRANSFER_LINEAR = KHR_DF_TRANSFER_LINEAR;
    exports2.KHR_DF_TRANSFER_NTSC = KHR_DF_TRANSFER_NTSC;
    exports2.KHR_DF_TRANSFER_PAL625_EOTF = KHR_DF_TRANSFER_PAL625_EOTF;
    exports2.KHR_DF_TRANSFER_PAL_OETF = KHR_DF_TRANSFER_PAL_OETF;
    exports2.KHR_DF_TRANSFER_PQ_EOTF = KHR_DF_TRANSFER_PQ_EOTF;
    exports2.KHR_DF_TRANSFER_PQ_OETF = KHR_DF_TRANSFER_PQ_OETF;
    exports2.KHR_DF_TRANSFER_SLOG = KHR_DF_TRANSFER_SLOG;
    exports2.KHR_DF_TRANSFER_SLOG2 = KHR_DF_TRANSFER_SLOG2;
    exports2.KHR_DF_TRANSFER_SRGB = KHR_DF_TRANSFER_SRGB;
    exports2.KHR_DF_TRANSFER_ST240 = KHR_DF_TRANSFER_ST240;
    exports2.KHR_DF_TRANSFER_UNSPECIFIED = KHR_DF_TRANSFER_UNSPECIFIED;
    exports2.KHR_DF_VENDORID_KHRONOS = KHR_DF_VENDORID_KHRONOS;
    exports2.KHR_DF_VERSION = KHR_DF_VERSION;
    exports2.KHR_SUPERCOMPRESSION_BASISLZ = KHR_SUPERCOMPRESSION_BASISLZ;
    exports2.KHR_SUPERCOMPRESSION_NONE = KHR_SUPERCOMPRESSION_NONE;
    exports2.KHR_SUPERCOMPRESSION_ZLIB = KHR_SUPERCOMPRESSION_ZLIB;
    exports2.KHR_SUPERCOMPRESSION_ZSTD = KHR_SUPERCOMPRESSION_ZSTD;
    exports2.KTX2Container = KTX2Container;
    exports2.VK_FORMAT_A1R5G5B5_UNORM_PACK16 = VK_FORMAT_A1R5G5B5_UNORM_PACK16;
    exports2.VK_FORMAT_A2B10G10R10_SINT_PACK32 = VK_FORMAT_A2B10G10R10_SINT_PACK32;
    exports2.VK_FORMAT_A2B10G10R10_SNORM_PACK32 = VK_FORMAT_A2B10G10R10_SNORM_PACK32;
    exports2.VK_FORMAT_A2B10G10R10_UINT_PACK32 = VK_FORMAT_A2B10G10R10_UINT_PACK32;
    exports2.VK_FORMAT_A2B10G10R10_UNORM_PACK32 = VK_FORMAT_A2B10G10R10_UNORM_PACK32;
    exports2.VK_FORMAT_A2R10G10B10_SINT_PACK32 = VK_FORMAT_A2R10G10B10_SINT_PACK32;
    exports2.VK_FORMAT_A2R10G10B10_SNORM_PACK32 = VK_FORMAT_A2R10G10B10_SNORM_PACK32;
    exports2.VK_FORMAT_A2R10G10B10_UINT_PACK32 = VK_FORMAT_A2R10G10B10_UINT_PACK32;
    exports2.VK_FORMAT_A2R10G10B10_UNORM_PACK32 = VK_FORMAT_A2R10G10B10_UNORM_PACK32;
    exports2.VK_FORMAT_A4B4G4R4_UNORM_PACK16_EXT = VK_FORMAT_A4B4G4R4_UNORM_PACK16_EXT;
    exports2.VK_FORMAT_A4R4G4B4_UNORM_PACK16_EXT = VK_FORMAT_A4R4G4B4_UNORM_PACK16_EXT;
    exports2.VK_FORMAT_ASTC_10x10_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_10x10_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_10x10_SRGB_BLOCK = VK_FORMAT_ASTC_10x10_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_10x10_UNORM_BLOCK = VK_FORMAT_ASTC_10x10_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_10x5_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_10x5_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_10x5_SRGB_BLOCK = VK_FORMAT_ASTC_10x5_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_10x5_UNORM_BLOCK = VK_FORMAT_ASTC_10x5_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_10x6_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_10x6_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_10x6_SRGB_BLOCK = VK_FORMAT_ASTC_10x6_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_10x6_UNORM_BLOCK = VK_FORMAT_ASTC_10x6_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_10x8_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_10x8_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_10x8_SRGB_BLOCK = VK_FORMAT_ASTC_10x8_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_10x8_UNORM_BLOCK = VK_FORMAT_ASTC_10x8_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_12x10_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_12x10_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_12x10_SRGB_BLOCK = VK_FORMAT_ASTC_12x10_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_12x10_UNORM_BLOCK = VK_FORMAT_ASTC_12x10_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_12x12_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_12x12_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_12x12_SRGB_BLOCK = VK_FORMAT_ASTC_12x12_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_12x12_UNORM_BLOCK = VK_FORMAT_ASTC_12x12_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_4x4_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_4x4_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_4x4_SRGB_BLOCK = VK_FORMAT_ASTC_4x4_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_4x4_UNORM_BLOCK = VK_FORMAT_ASTC_4x4_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_5x4_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_5x4_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_5x4_SRGB_BLOCK = VK_FORMAT_ASTC_5x4_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_5x4_UNORM_BLOCK = VK_FORMAT_ASTC_5x4_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_5x5_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_5x5_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_5x5_SRGB_BLOCK = VK_FORMAT_ASTC_5x5_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_5x5_UNORM_BLOCK = VK_FORMAT_ASTC_5x5_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_6x5_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_6x5_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_6x5_SRGB_BLOCK = VK_FORMAT_ASTC_6x5_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_6x5_UNORM_BLOCK = VK_FORMAT_ASTC_6x5_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_6x6_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_6x6_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_6x6_SRGB_BLOCK = VK_FORMAT_ASTC_6x6_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_6x6_UNORM_BLOCK = VK_FORMAT_ASTC_6x6_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_8x5_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_8x5_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_8x5_SRGB_BLOCK = VK_FORMAT_ASTC_8x5_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_8x5_UNORM_BLOCK = VK_FORMAT_ASTC_8x5_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_8x6_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_8x6_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_8x6_SRGB_BLOCK = VK_FORMAT_ASTC_8x6_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_8x6_UNORM_BLOCK = VK_FORMAT_ASTC_8x6_UNORM_BLOCK;
    exports2.VK_FORMAT_ASTC_8x8_SFLOAT_BLOCK_EXT = VK_FORMAT_ASTC_8x8_SFLOAT_BLOCK_EXT;
    exports2.VK_FORMAT_ASTC_8x8_SRGB_BLOCK = VK_FORMAT_ASTC_8x8_SRGB_BLOCK;
    exports2.VK_FORMAT_ASTC_8x8_UNORM_BLOCK = VK_FORMAT_ASTC_8x8_UNORM_BLOCK;
    exports2.VK_FORMAT_B10G11R11_UFLOAT_PACK32 = VK_FORMAT_B10G11R11_UFLOAT_PACK32;
    exports2.VK_FORMAT_B10X6G10X6R10X6G10X6_422_UNORM_4PACK16 = VK_FORMAT_B10X6G10X6R10X6G10X6_422_UNORM_4PACK16;
    exports2.VK_FORMAT_B12X4G12X4R12X4G12X4_422_UNORM_4PACK16 = VK_FORMAT_B12X4G12X4R12X4G12X4_422_UNORM_4PACK16;
    exports2.VK_FORMAT_B4G4R4A4_UNORM_PACK16 = VK_FORMAT_B4G4R4A4_UNORM_PACK16;
    exports2.VK_FORMAT_B5G5R5A1_UNORM_PACK16 = VK_FORMAT_B5G5R5A1_UNORM_PACK16;
    exports2.VK_FORMAT_B5G6R5_UNORM_PACK16 = VK_FORMAT_B5G6R5_UNORM_PACK16;
    exports2.VK_FORMAT_B8G8R8A8_SINT = VK_FORMAT_B8G8R8A8_SINT;
    exports2.VK_FORMAT_B8G8R8A8_SNORM = VK_FORMAT_B8G8R8A8_SNORM;
    exports2.VK_FORMAT_B8G8R8A8_SRGB = VK_FORMAT_B8G8R8A8_SRGB;
    exports2.VK_FORMAT_B8G8R8A8_UINT = VK_FORMAT_B8G8R8A8_UINT;
    exports2.VK_FORMAT_B8G8R8A8_UNORM = VK_FORMAT_B8G8R8A8_UNORM;
    exports2.VK_FORMAT_B8G8R8_SINT = VK_FORMAT_B8G8R8_SINT;
    exports2.VK_FORMAT_B8G8R8_SNORM = VK_FORMAT_B8G8R8_SNORM;
    exports2.VK_FORMAT_B8G8R8_SRGB = VK_FORMAT_B8G8R8_SRGB;
    exports2.VK_FORMAT_B8G8R8_UINT = VK_FORMAT_B8G8R8_UINT;
    exports2.VK_FORMAT_B8G8R8_UNORM = VK_FORMAT_B8G8R8_UNORM;
    exports2.VK_FORMAT_BC1_RGBA_SRGB_BLOCK = VK_FORMAT_BC1_RGBA_SRGB_BLOCK;
    exports2.VK_FORMAT_BC1_RGBA_UNORM_BLOCK = VK_FORMAT_BC1_RGBA_UNORM_BLOCK;
    exports2.VK_FORMAT_BC1_RGB_SRGB_BLOCK = VK_FORMAT_BC1_RGB_SRGB_BLOCK;
    exports2.VK_FORMAT_BC1_RGB_UNORM_BLOCK = VK_FORMAT_BC1_RGB_UNORM_BLOCK;
    exports2.VK_FORMAT_BC2_SRGB_BLOCK = VK_FORMAT_BC2_SRGB_BLOCK;
    exports2.VK_FORMAT_BC2_UNORM_BLOCK = VK_FORMAT_BC2_UNORM_BLOCK;
    exports2.VK_FORMAT_BC3_SRGB_BLOCK = VK_FORMAT_BC3_SRGB_BLOCK;
    exports2.VK_FORMAT_BC3_UNORM_BLOCK = VK_FORMAT_BC3_UNORM_BLOCK;
    exports2.VK_FORMAT_BC4_SNORM_BLOCK = VK_FORMAT_BC4_SNORM_BLOCK;
    exports2.VK_FORMAT_BC4_UNORM_BLOCK = VK_FORMAT_BC4_UNORM_BLOCK;
    exports2.VK_FORMAT_BC5_SNORM_BLOCK = VK_FORMAT_BC5_SNORM_BLOCK;
    exports2.VK_FORMAT_BC5_UNORM_BLOCK = VK_FORMAT_BC5_UNORM_BLOCK;
    exports2.VK_FORMAT_BC6H_SFLOAT_BLOCK = VK_FORMAT_BC6H_SFLOAT_BLOCK;
    exports2.VK_FORMAT_BC6H_UFLOAT_BLOCK = VK_FORMAT_BC6H_UFLOAT_BLOCK;
    exports2.VK_FORMAT_BC7_SRGB_BLOCK = VK_FORMAT_BC7_SRGB_BLOCK;
    exports2.VK_FORMAT_BC7_UNORM_BLOCK = VK_FORMAT_BC7_UNORM_BLOCK;
    exports2.VK_FORMAT_D16_UNORM = VK_FORMAT_D16_UNORM;
    exports2.VK_FORMAT_D16_UNORM_S8_UINT = VK_FORMAT_D16_UNORM_S8_UINT;
    exports2.VK_FORMAT_D24_UNORM_S8_UINT = VK_FORMAT_D24_UNORM_S8_UINT;
    exports2.VK_FORMAT_D32_SFLOAT = VK_FORMAT_D32_SFLOAT;
    exports2.VK_FORMAT_D32_SFLOAT_S8_UINT = VK_FORMAT_D32_SFLOAT_S8_UINT;
    exports2.VK_FORMAT_E5B9G9R9_UFLOAT_PACK32 = VK_FORMAT_E5B9G9R9_UFLOAT_PACK32;
    exports2.VK_FORMAT_EAC_R11G11_SNORM_BLOCK = VK_FORMAT_EAC_R11G11_SNORM_BLOCK;
    exports2.VK_FORMAT_EAC_R11G11_UNORM_BLOCK = VK_FORMAT_EAC_R11G11_UNORM_BLOCK;
    exports2.VK_FORMAT_EAC_R11_SNORM_BLOCK = VK_FORMAT_EAC_R11_SNORM_BLOCK;
    exports2.VK_FORMAT_EAC_R11_UNORM_BLOCK = VK_FORMAT_EAC_R11_UNORM_BLOCK;
    exports2.VK_FORMAT_ETC2_R8G8B8A1_SRGB_BLOCK = VK_FORMAT_ETC2_R8G8B8A1_SRGB_BLOCK;
    exports2.VK_FORMAT_ETC2_R8G8B8A1_UNORM_BLOCK = VK_FORMAT_ETC2_R8G8B8A1_UNORM_BLOCK;
    exports2.VK_FORMAT_ETC2_R8G8B8A8_SRGB_BLOCK = VK_FORMAT_ETC2_R8G8B8A8_SRGB_BLOCK;
    exports2.VK_FORMAT_ETC2_R8G8B8A8_UNORM_BLOCK = VK_FORMAT_ETC2_R8G8B8A8_UNORM_BLOCK;
    exports2.VK_FORMAT_ETC2_R8G8B8_SRGB_BLOCK = VK_FORMAT_ETC2_R8G8B8_SRGB_BLOCK;
    exports2.VK_FORMAT_ETC2_R8G8B8_UNORM_BLOCK = VK_FORMAT_ETC2_R8G8B8_UNORM_BLOCK;
    exports2.VK_FORMAT_G10X6B10X6G10X6R10X6_422_UNORM_4PACK16 = VK_FORMAT_G10X6B10X6G10X6R10X6_422_UNORM_4PACK16;
    exports2.VK_FORMAT_G12X4B12X4G12X4R12X4_422_UNORM_4PACK16 = VK_FORMAT_G12X4B12X4G12X4R12X4_422_UNORM_4PACK16;
    exports2.VK_FORMAT_PVRTC1_2BPP_SRGB_BLOCK_IMG = VK_FORMAT_PVRTC1_2BPP_SRGB_BLOCK_IMG;
    exports2.VK_FORMAT_PVRTC1_2BPP_UNORM_BLOCK_IMG = VK_FORMAT_PVRTC1_2BPP_UNORM_BLOCK_IMG;
    exports2.VK_FORMAT_PVRTC1_4BPP_SRGB_BLOCK_IMG = VK_FORMAT_PVRTC1_4BPP_SRGB_BLOCK_IMG;
    exports2.VK_FORMAT_PVRTC1_4BPP_UNORM_BLOCK_IMG = VK_FORMAT_PVRTC1_4BPP_UNORM_BLOCK_IMG;
    exports2.VK_FORMAT_PVRTC2_2BPP_SRGB_BLOCK_IMG = VK_FORMAT_PVRTC2_2BPP_SRGB_BLOCK_IMG;
    exports2.VK_FORMAT_PVRTC2_2BPP_UNORM_BLOCK_IMG = VK_FORMAT_PVRTC2_2BPP_UNORM_BLOCK_IMG;
    exports2.VK_FORMAT_PVRTC2_4BPP_SRGB_BLOCK_IMG = VK_FORMAT_PVRTC2_4BPP_SRGB_BLOCK_IMG;
    exports2.VK_FORMAT_PVRTC2_4BPP_UNORM_BLOCK_IMG = VK_FORMAT_PVRTC2_4BPP_UNORM_BLOCK_IMG;
    exports2.VK_FORMAT_R10X6G10X6B10X6A10X6_UNORM_4PACK16 = VK_FORMAT_R10X6G10X6B10X6A10X6_UNORM_4PACK16;
    exports2.VK_FORMAT_R10X6G10X6_UNORM_2PACK16 = VK_FORMAT_R10X6G10X6_UNORM_2PACK16;
    exports2.VK_FORMAT_R10X6_UNORM_PACK16 = VK_FORMAT_R10X6_UNORM_PACK16;
    exports2.VK_FORMAT_R12X4G12X4B12X4A12X4_UNORM_4PACK16 = VK_FORMAT_R12X4G12X4B12X4A12X4_UNORM_4PACK16;
    exports2.VK_FORMAT_R12X4G12X4_UNORM_2PACK16 = VK_FORMAT_R12X4G12X4_UNORM_2PACK16;
    exports2.VK_FORMAT_R12X4_UNORM_PACK16 = VK_FORMAT_R12X4_UNORM_PACK16;
    exports2.VK_FORMAT_R16G16B16A16_SFLOAT = VK_FORMAT_R16G16B16A16_SFLOAT;
    exports2.VK_FORMAT_R16G16B16A16_SINT = VK_FORMAT_R16G16B16A16_SINT;
    exports2.VK_FORMAT_R16G16B16A16_SNORM = VK_FORMAT_R16G16B16A16_SNORM;
    exports2.VK_FORMAT_R16G16B16A16_UINT = VK_FORMAT_R16G16B16A16_UINT;
    exports2.VK_FORMAT_R16G16B16A16_UNORM = VK_FORMAT_R16G16B16A16_UNORM;
    exports2.VK_FORMAT_R16G16B16_SFLOAT = VK_FORMAT_R16G16B16_SFLOAT;
    exports2.VK_FORMAT_R16G16B16_SINT = VK_FORMAT_R16G16B16_SINT;
    exports2.VK_FORMAT_R16G16B16_SNORM = VK_FORMAT_R16G16B16_SNORM;
    exports2.VK_FORMAT_R16G16B16_UINT = VK_FORMAT_R16G16B16_UINT;
    exports2.VK_FORMAT_R16G16B16_UNORM = VK_FORMAT_R16G16B16_UNORM;
    exports2.VK_FORMAT_R16G16_SFLOAT = VK_FORMAT_R16G16_SFLOAT;
    exports2.VK_FORMAT_R16G16_SINT = VK_FORMAT_R16G16_SINT;
    exports2.VK_FORMAT_R16G16_SNORM = VK_FORMAT_R16G16_SNORM;
    exports2.VK_FORMAT_R16G16_UINT = VK_FORMAT_R16G16_UINT;
    exports2.VK_FORMAT_R16G16_UNORM = VK_FORMAT_R16G16_UNORM;
    exports2.VK_FORMAT_R16_SFLOAT = VK_FORMAT_R16_SFLOAT;
    exports2.VK_FORMAT_R16_SINT = VK_FORMAT_R16_SINT;
    exports2.VK_FORMAT_R16_SNORM = VK_FORMAT_R16_SNORM;
    exports2.VK_FORMAT_R16_UINT = VK_FORMAT_R16_UINT;
    exports2.VK_FORMAT_R16_UNORM = VK_FORMAT_R16_UNORM;
    exports2.VK_FORMAT_R32G32B32A32_SFLOAT = VK_FORMAT_R32G32B32A32_SFLOAT;
    exports2.VK_FORMAT_R32G32B32A32_SINT = VK_FORMAT_R32G32B32A32_SINT;
    exports2.VK_FORMAT_R32G32B32A32_UINT = VK_FORMAT_R32G32B32A32_UINT;
    exports2.VK_FORMAT_R32G32B32_SFLOAT = VK_FORMAT_R32G32B32_SFLOAT;
    exports2.VK_FORMAT_R32G32B32_SINT = VK_FORMAT_R32G32B32_SINT;
    exports2.VK_FORMAT_R32G32B32_UINT = VK_FORMAT_R32G32B32_UINT;
    exports2.VK_FORMAT_R32G32_SFLOAT = VK_FORMAT_R32G32_SFLOAT;
    exports2.VK_FORMAT_R32G32_SINT = VK_FORMAT_R32G32_SINT;
    exports2.VK_FORMAT_R32G32_UINT = VK_FORMAT_R32G32_UINT;
    exports2.VK_FORMAT_R32_SFLOAT = VK_FORMAT_R32_SFLOAT;
    exports2.VK_FORMAT_R32_SINT = VK_FORMAT_R32_SINT;
    exports2.VK_FORMAT_R32_UINT = VK_FORMAT_R32_UINT;
    exports2.VK_FORMAT_R4G4B4A4_UNORM_PACK16 = VK_FORMAT_R4G4B4A4_UNORM_PACK16;
    exports2.VK_FORMAT_R4G4_UNORM_PACK8 = VK_FORMAT_R4G4_UNORM_PACK8;
    exports2.VK_FORMAT_R5G5B5A1_UNORM_PACK16 = VK_FORMAT_R5G5B5A1_UNORM_PACK16;
    exports2.VK_FORMAT_R5G6B5_UNORM_PACK16 = VK_FORMAT_R5G6B5_UNORM_PACK16;
    exports2.VK_FORMAT_R64G64B64A64_SFLOAT = VK_FORMAT_R64G64B64A64_SFLOAT;
    exports2.VK_FORMAT_R64G64B64A64_SINT = VK_FORMAT_R64G64B64A64_SINT;
    exports2.VK_FORMAT_R64G64B64A64_UINT = VK_FORMAT_R64G64B64A64_UINT;
    exports2.VK_FORMAT_R64G64B64_SFLOAT = VK_FORMAT_R64G64B64_SFLOAT;
    exports2.VK_FORMAT_R64G64B64_SINT = VK_FORMAT_R64G64B64_SINT;
    exports2.VK_FORMAT_R64G64B64_UINT = VK_FORMAT_R64G64B64_UINT;
    exports2.VK_FORMAT_R64G64_SFLOAT = VK_FORMAT_R64G64_SFLOAT;
    exports2.VK_FORMAT_R64G64_SINT = VK_FORMAT_R64G64_SINT;
    exports2.VK_FORMAT_R64G64_UINT = VK_FORMAT_R64G64_UINT;
    exports2.VK_FORMAT_R64_SFLOAT = VK_FORMAT_R64_SFLOAT;
    exports2.VK_FORMAT_R64_SINT = VK_FORMAT_R64_SINT;
    exports2.VK_FORMAT_R64_UINT = VK_FORMAT_R64_UINT;
    exports2.VK_FORMAT_R8G8B8A8_SINT = VK_FORMAT_R8G8B8A8_SINT;
    exports2.VK_FORMAT_R8G8B8A8_SNORM = VK_FORMAT_R8G8B8A8_SNORM;
    exports2.VK_FORMAT_R8G8B8A8_SRGB = VK_FORMAT_R8G8B8A8_SRGB;
    exports2.VK_FORMAT_R8G8B8A8_UINT = VK_FORMAT_R8G8B8A8_UINT;
    exports2.VK_FORMAT_R8G8B8A8_UNORM = VK_FORMAT_R8G8B8A8_UNORM;
    exports2.VK_FORMAT_R8G8B8_SINT = VK_FORMAT_R8G8B8_SINT;
    exports2.VK_FORMAT_R8G8B8_SNORM = VK_FORMAT_R8G8B8_SNORM;
    exports2.VK_FORMAT_R8G8B8_SRGB = VK_FORMAT_R8G8B8_SRGB;
    exports2.VK_FORMAT_R8G8B8_UINT = VK_FORMAT_R8G8B8_UINT;
    exports2.VK_FORMAT_R8G8B8_UNORM = VK_FORMAT_R8G8B8_UNORM;
    exports2.VK_FORMAT_R8G8_SINT = VK_FORMAT_R8G8_SINT;
    exports2.VK_FORMAT_R8G8_SNORM = VK_FORMAT_R8G8_SNORM;
    exports2.VK_FORMAT_R8G8_SRGB = VK_FORMAT_R8G8_SRGB;
    exports2.VK_FORMAT_R8G8_UINT = VK_FORMAT_R8G8_UINT;
    exports2.VK_FORMAT_R8G8_UNORM = VK_FORMAT_R8G8_UNORM;
    exports2.VK_FORMAT_R8_SINT = VK_FORMAT_R8_SINT;
    exports2.VK_FORMAT_R8_SNORM = VK_FORMAT_R8_SNORM;
    exports2.VK_FORMAT_R8_SRGB = VK_FORMAT_R8_SRGB;
    exports2.VK_FORMAT_R8_UINT = VK_FORMAT_R8_UINT;
    exports2.VK_FORMAT_R8_UNORM = VK_FORMAT_R8_UNORM;
    exports2.VK_FORMAT_S8_UINT = VK_FORMAT_S8_UINT;
    exports2.VK_FORMAT_UNDEFINED = VK_FORMAT_UNDEFINED;
    exports2.VK_FORMAT_X8_D24_UNORM_PACK32 = VK_FORMAT_X8_D24_UNORM_PACK32;
    exports2.read = read;
    exports2.write = write;
  }
});

// node_modules/@gltf-transform/extensions/dist/extensions.cjs
var require_extensions = __commonJS({
  "node_modules/@gltf-transform/extensions/dist/extensions.cjs"(exports2) {
    var e = require_core();
    var t = require_ktx_parse();
    var s = "EXT_mesh_gpu_instancing";
    var r = "EXT_meshopt_compression";
    var n = "KHR_draco_mesh_compression";
    var o = "KHR_lights_punctual";
    var i = "KHR_materials_anisotropy";
    var a = "KHR_materials_clearcoat";
    var c = "KHR_materials_emissive_strength";
    var u = "KHR_materials_ior";
    var l = "KHR_materials_iridescence";
    var h = "KHR_materials_pbrSpecularGlossiness";
    var f = "KHR_materials_sheen";
    var p = "KHR_materials_specular";
    var x = "KHR_materials_transmission";
    var g = "KHR_materials_unlit";
    var T = "KHR_materials_volume";
    var d = "KHR_materials_variants";
    var m = "KHR_texture_transform";
    var E = "KHR_xmp_json_ld";
    var y = "INSTANCE_ATTRIBUTE";
    var I = class extends e.ExtensionProperty {
      init() {
        this.extensionName = s, this.propertyType = "InstancedMesh", this.parentTypes = [e.PropertyType.NODE];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { attributes: {} });
      }
      getAttribute(e2) {
        return this.getRefMap("attributes", e2);
      }
      setAttribute(e2, t2) {
        return this.setRefMap("attributes", e2, t2, { usage: y });
      }
      listAttributes() {
        return this.listRefMapValues("attributes");
      }
      listSemantics() {
        return this.listRefMapKeys("attributes");
      }
    };
    I.EXTENSION_NAME = s;
    var R = s;
    var N = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = R, this.provideTypes = [e.PropertyType.NODE], this.prewriteTypes = [e.PropertyType.ACCESSOR];
      }
      createInstancedMesh() {
        return new I(this.document.getGraph());
      }
      read(e2) {
        return (e2.jsonDoc.json.nodes || []).forEach((t2, s2) => {
          if (!t2.extensions || !t2.extensions[R]) return;
          const r2 = t2.extensions[R], n2 = this.createInstancedMesh();
          for (const t3 in r2.attributes) n2.setAttribute(t3, e2.accessors[r2.attributes[t3]]);
          e2.nodes[s2].setExtension(R, n2);
        }), this;
      }
      prewrite(e2) {
        e2.accessorUsageGroupedByParent.add(y);
        for (const t2 of this.properties) for (const s2 of t2.listAttributes()) e2.addAccessorToUsageGroup(s2, y);
        return this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listNodes().forEach((s2) => {
          const r2 = s2.getExtension(R);
          if (r2) {
            const n2 = e2.nodeIndexMap.get(s2), o2 = t2.json.nodes[n2], i2 = { attributes: {} };
            r2.listSemantics().forEach((t3) => {
              const s3 = r2.getAttribute(t3);
              i2.attributes[t3] = e2.accessorIndexMap.get(s3);
            }), o2.extensions = o2.extensions || {}, o2.extensions[R] = i2;
          }
        }), this;
      }
    };
    var A;
    var S;
    var C;
    N.EXTENSION_NAME = R, (function(e2) {
      e2.QUANTIZE = "quantize", e2.FILTER = "filter";
    })(A || (A = {})), (function(e2) {
      e2.ATTRIBUTES = "ATTRIBUTES", e2.TRIANGLES = "TRIANGLES", e2.INDICES = "INDICES";
    })(S || (S = {})), (function(e2) {
      e2.NONE = "NONE", e2.OCTAHEDRAL = "OCTAHEDRAL", e2.QUATERNION = "QUATERNION", e2.EXPONENTIAL = "EXPONENTIAL";
    })(C || (C = {}));
    var { BYTE: M, SHORT: O, FLOAT: _ } = e.Accessor.ComponentType;
    var { encodeNormalizedInt: D, decodeNormalizedInt: w } = e.MathUtils;
    function F(t2, s2, r2, n2) {
      const { filter: o2, bits: i2 } = n2, a2 = { array: t2.getArray(), byteStride: t2.getElementSize() * t2.getComponentSize(), componentType: t2.getComponentType(), normalized: t2.getNormalized() };
      if (r2 !== S.ATTRIBUTES) return a2;
      if (o2 !== C.NONE) {
        let e2 = t2.getNormalized() ? (function(e3) {
          const t3 = e3.getComponentType(), s3 = e3.getArray(), r3 = new Float32Array(s3.length);
          for (let e4 = 0; e4 < s3.length; e4++) r3[e4] = w(s3[e4], t3);
          return r3;
        })(t2) : new Float32Array(a2.array);
        switch (o2) {
          case C.EXPONENTIAL:
            a2.byteStride = 4 * t2.getElementSize(), a2.componentType = _, a2.normalized = false, a2.array = s2.encodeFilterExp(e2, t2.getCount(), a2.byteStride, i2);
            break;
          case C.OCTAHEDRAL:
            a2.byteStride = i2 > 8 ? 8 : 4, a2.componentType = i2 > 8 ? O : M, a2.normalized = true, e2 = 3 === t2.getElementSize() ? (function(e3) {
              const t3 = new Float32Array(4 * e3.length / 3);
              for (let s3 = 0, r3 = e3.length / 3; s3 < r3; s3++) t3[4 * s3] = e3[3 * s3], t3[4 * s3 + 1] = e3[3 * s3 + 1], t3[4 * s3 + 2] = e3[3 * s3 + 2];
              return t3;
            })(e2) : e2, a2.array = s2.encodeFilterOct(e2, t2.getCount(), a2.byteStride, i2);
            break;
          case C.QUATERNION:
            a2.byteStride = 8, a2.componentType = O, a2.normalized = true, a2.array = s2.encodeFilterQuat(e2, t2.getCount(), a2.byteStride, i2);
            break;
          default:
            throw new Error("Invalid filter.");
        }
        a2.min = t2.getMin([]), a2.max = t2.getMax([]), t2.getNormalized() && (a2.min = a2.min.map((e3) => w(e3, t2.getComponentType())), a2.max = a2.max.map((e3) => w(e3, t2.getComponentType()))), a2.normalized && (a2.min = a2.min.map((e3) => D(e3, a2.componentType)), a2.max = a2.max.map((e3) => D(e3, a2.componentType)));
      } else a2.byteStride % 4 && (a2.array = (function(t3, s3) {
        const r3 = e.BufferUtils.padNumber(t3.BYTES_PER_ELEMENT * s3) / t3.BYTES_PER_ELEMENT, n3 = new t3.constructor(t3.length / s3 * r3);
        for (let e2 = 0; e2 * s3 < t3.length; e2++) for (let o3 = 0; o3 < s3; o3++) n3[e2 * r3 + o3] = t3[e2 * s3 + o3];
        return n3;
      })(a2.array, t2.getElementSize()), a2.byteStride = a2.array.byteLength / t2.getCount());
      return a2;
    }
    function b(t2, s2) {
      return s2 === e.WriterContext.BufferViewUsage.ELEMENT_ARRAY_BUFFER ? t2.listParents().some((t3) => t3 instanceof e.Primitive && t3.getMode() === e.Primitive.Mode.TRIANGLES) ? S.TRIANGLES : S.INDICES : S.ATTRIBUTES;
    }
    function P(t2, s2) {
      const r2 = s2.getGraph().listParentEdges(t2).filter((t3) => !(t3.getParent() instanceof e.Root));
      for (const s3 of r2) {
        const r3 = s3.getName(), n2 = s3.getAttributes().key || "", o2 = s3.getParent().propertyType === e.PropertyType.PRIMITIVE_TARGET;
        if ("indices" === r3) return { filter: C.NONE };
        if ("attributes" === r3) {
          if ("POSITION" === n2) return { filter: C.NONE };
          if ("TEXCOORD_0" === n2) return { filter: C.NONE };
          if (n2.startsWith("JOINTS_")) return { filter: C.NONE };
          if (n2.startsWith("WEIGHTS_")) return { filter: C.NONE };
          if ("NORMAL" === n2 || "TANGENT" === n2) return o2 ? { filter: C.NONE } : { filter: C.OCTAHEDRAL, bits: 8 };
        }
        if ("output" === r3) {
          const e2 = j(t2);
          return "rotation" === e2 ? { filter: C.QUATERNION, bits: 16 } : "translation" === e2 || "scale" === e2 ? { filter: C.EXPONENTIAL, bits: 12 } : { filter: C.NONE };
        }
        if ("input" === r3) return { filter: C.NONE };
        if ("inverseBindMatrices" === r3) return { filter: C.NONE };
      }
      return { filter: C.NONE };
    }
    function j(t2) {
      for (const s2 of t2.listParents()) if (s2 instanceof e.AnimationSampler) {
        for (const t3 of s2.listParents()) if (t3 instanceof e.AnimationChannel) return t3.getTargetPath();
      }
      return null;
    }
    var v = r;
    var U = { method: A.QUANTIZE };
    var B = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = v, this.prereadTypes = [e.PropertyType.BUFFER, e.PropertyType.PRIMITIVE], this.prewriteTypes = [e.PropertyType.BUFFER, e.PropertyType.ACCESSOR], this.readDependencies = ["meshopt.decoder"], this.writeDependencies = ["meshopt.encoder"], this._decoder = null, this._decoderFallbackBufferMap = /* @__PURE__ */ new Map(), this._encoder = null, this._encoderOptions = U, this._encoderFallbackBuffer = null, this._encoderBufferViews = {}, this._encoderBufferViewData = {}, this._encoderBufferViewAccessors = {};
      }
      install(e2, t2) {
        return "meshopt.decoder" === e2 && (this._decoder = t2), "meshopt.encoder" === e2 && (this._encoder = t2), this;
      }
      setEncoderOptions(e2) {
        return this._encoderOptions = { ...U, ...e2 }, this;
      }
      preread(t2, s2) {
        if (!this._decoder) {
          if (!this.isRequired()) return this;
          throw new Error(`[${v}] Please install extension dependency, "meshopt.decoder".`);
        }
        if (!this._decoder.supported) {
          if (!this.isRequired()) return this;
          throw new Error(`[${v}]: Missing WASM support.`);
        }
        return s2 === e.PropertyType.BUFFER ? this._prereadBuffers(t2) : s2 === e.PropertyType.PRIMITIVE && this._prereadPrimitives(t2), this;
      }
      _prereadBuffers(t2) {
        const s2 = t2.jsonDoc;
        (s2.json.bufferViews || []).forEach((r2, n2) => {
          if (!r2.extensions || !r2.extensions[v]) return;
          const o2 = r2.extensions[v], i2 = o2.byteOffset || 0, a2 = o2.byteLength || 0, c2 = o2.count, u2 = o2.byteStride, l2 = new Uint8Array(c2 * u2), h2 = s2.json.buffers[o2.buffer], f2 = e.BufferUtils.toView(h2.uri ? s2.resources[h2.uri] : s2.resources[e.GLB_BUFFER], i2, a2);
          this._decoder.decodeGltfBuffer(l2, c2, u2, f2, o2.mode, o2.filter), t2.bufferViews[n2] = l2;
        });
      }
      _prereadPrimitives(e2) {
        const t2 = e2.jsonDoc;
        (t2.json.bufferViews || []).forEach((s2) => {
          var n2;
          s2.extensions && s2.extensions[v] && (n2 = t2.json.buffers[s2.buffer]).extensions && n2.extensions[r] && n2.extensions[r].fallback && this._decoderFallbackBufferMap.set(e2.buffers[s2.buffer], e2.buffers[s2.extensions[v].buffer]);
        });
      }
      read(t2) {
        if (!this.isRequired()) return this;
        for (const [t3, s2] of this._decoderFallbackBufferMap) {
          for (const r2 of t3.listParents()) r2 instanceof e.Accessor && r2.swap(t3, s2);
          t3.dispose();
        }
        return this;
      }
      prewrite(t2, s2) {
        return s2 === e.PropertyType.ACCESSOR ? this._prewriteAccessors(t2) : s2 === e.PropertyType.BUFFER && this._prewriteBuffers(t2), this;
      }
      _prewriteAccessors(t2) {
        const s2 = t2.jsonDoc.json, r2 = this._encoder, n2 = this._encoderOptions, o2 = this.document.createBuffer(), i2 = this.document.getRoot().listBuffers().indexOf(o2);
        this._encoderFallbackBuffer = o2, this._encoderBufferViews = {}, this._encoderBufferViewData = {}, this._encoderBufferViewAccessors = {};
        for (const o3 of this.document.getRoot().listAccessors()) {
          if ("weights" === j(o3)) continue;
          if (o3.getSparse()) continue;
          const a2 = t2.getAccessorUsage(o3), c2 = b(o3, a2), u2 = n2.method === A.FILTER ? P(o3, this.document) : { filter: C.NONE }, l2 = F(o3, r2, c2, u2), { array: h2, byteStride: f2 } = l2, p2 = o3.getBuffer();
          if (!p2) throw new Error(`${v}: Missing buffer for accessor.`);
          const x2 = this.document.getRoot().listBuffers().indexOf(p2), g2 = [a2, c2, u2.filter, f2, x2].join(":");
          let T2 = this._encoderBufferViews[g2], d2 = this._encoderBufferViewData[g2], m2 = this._encoderBufferViewAccessors[g2];
          T2 && d2 || (m2 = this._encoderBufferViewAccessors[g2] = [], d2 = this._encoderBufferViewData[g2] = [], T2 = this._encoderBufferViews[g2] = { buffer: i2, target: e.WriterContext.USAGE_TO_TARGET[a2], byteOffset: 0, byteLength: 0, byteStride: a2 === e.WriterContext.BufferViewUsage.ARRAY_BUFFER ? f2 : void 0, extensions: { [v]: { buffer: x2, byteOffset: 0, byteLength: 0, mode: c2, filter: u2.filter !== C.NONE ? u2.filter : void 0, byteStride: f2, count: 0 } } });
          const E2 = t2.createAccessorDef(o3);
          E2.componentType = l2.componentType, E2.normalized = l2.normalized, E2.byteOffset = T2.byteLength, E2.min && l2.min && (E2.min = l2.min), E2.max && l2.max && (E2.max = l2.max), t2.accessorIndexMap.set(o3, s2.accessors.length), s2.accessors.push(E2), m2.push(E2), d2.push(new Uint8Array(h2.buffer, h2.byteOffset, h2.byteLength)), T2.byteLength += h2.byteLength, T2.extensions.EXT_meshopt_compression.count += o3.getCount();
        }
      }
      _prewriteBuffers(t2) {
        const s2 = this._encoder;
        for (const r2 in this._encoderBufferViews) {
          const n2 = this._encoderBufferViews[r2], o2 = this._encoderBufferViewData[r2], i2 = this.document.getRoot().listBuffers()[n2.extensions[v].buffer], a2 = t2.otherBufferViews.get(i2) || [], { count: c2, byteStride: u2, mode: l2 } = n2.extensions[v], h2 = e.BufferUtils.concat(o2), f2 = s2.encodeGltfBuffer(h2, c2, u2, l2), p2 = e.BufferUtils.pad(f2);
          n2.extensions[v].byteLength = f2.byteLength, o2.length = 0, o2.push(p2), a2.push(p2), t2.otherBufferViews.set(i2, a2);
        }
      }
      write(t2) {
        let s2 = 0;
        for (const r3 in this._encoderBufferViews) {
          const n3 = this._encoderBufferViews[r3], o3 = t2.otherBufferViewsIndexMap.get(this._encoderBufferViewData[r3][0]), i2 = this._encoderBufferViewAccessors[r3];
          for (const e2 of i2) e2.bufferView = o3;
          const a2 = t2.jsonDoc.json.bufferViews[o3], c2 = a2.byteOffset || 0;
          Object.assign(a2, n3), a2.byteOffset = s2, a2.extensions[v].byteOffset = c2, s2 += e.BufferUtils.padNumber(n3.byteLength);
        }
        const r2 = this._encoderFallbackBuffer, n2 = t2.bufferIndexMap.get(r2), o2 = t2.jsonDoc.json.buffers[n2];
        return o2.byteLength = s2, o2.extensions = { [v]: { fallback: true } }, r2.dispose(), this;
      }
    };
    B.EXTENSION_NAME = v, B.EncoderMethod = A;
    var k = "EXT_texture_avif";
    var L = class {
      match(t2) {
        return t2.length >= 12 && "ftypavif" === e.BufferUtils.decodeText(t2.slice(4, 12));
      }
      getSize(e2) {
        if (!this.match(e2)) return null;
        const t2 = new DataView(e2.buffer, e2.byteOffset, e2.byteLength);
        let s2 = V(t2, 0);
        if (!s2) return null;
        let r2 = s2.end;
        for (; s2 = V(t2, r2); ) if ("meta" === s2.type) r2 = s2.start + 4;
        else if ("iprp" === s2.type || "ipco" === s2.type) r2 = s2.start;
        else {
          if ("ispe" === s2.type) return [t2.getUint32(s2.start + 4), t2.getUint32(s2.start + 8)];
          if ("mdat" === s2.type) break;
          r2 = s2.end;
        }
        return null;
      }
      getChannels(e2) {
        return 4;
      }
    };
    var G = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = k, this.prereadTypes = [e.PropertyType.TEXTURE];
      }
      static register() {
        e.ImageUtils.registerFormat("image/avif", new L());
      }
      preread(e2) {
        return (e2.jsonDoc.json.textures || []).forEach((e3) => {
          e3.extensions && e3.extensions[k] && (e3.source = e3.extensions[k].source);
        }), this;
      }
      read(e2) {
        return this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listTextures().forEach((s2) => {
          if ("image/avif" === s2.getMimeType()) {
            const r2 = e2.imageIndexMap.get(s2);
            (t2.json.textures || []).forEach((e3) => {
              e3.source === r2 && (e3.extensions = e3.extensions || {}, e3.extensions[k] = { source: e3.source }, delete e3.source);
            });
          }
        }), this;
      }
    };
    function V(t2, s2) {
      if (t2.byteLength < 4 + s2) return null;
      const r2 = t2.getUint32(s2);
      return t2.byteLength < r2 + s2 || r2 < 8 ? null : { type: e.BufferUtils.decodeText(new Uint8Array(t2.buffer, t2.byteOffset + s2 + 4, 4)), start: s2 + 8, end: s2 + r2 };
    }
    G.EXTENSION_NAME = k;
    var H = "EXT_texture_webp";
    var X = class {
      match(e2) {
        return e2.length >= 12 && 87 === e2[8] && 69 === e2[9] && 66 === e2[10] && 80 === e2[11];
      }
      getSize(t2) {
        const s2 = e.BufferUtils.decodeText(t2.slice(0, 4)), r2 = e.BufferUtils.decodeText(t2.slice(8, 12));
        if ("RIFF" !== s2 || "WEBP" !== r2) return null;
        const n2 = new DataView(t2.buffer, t2.byteOffset);
        let o2 = 12;
        for (; o2 < n2.byteLength; ) {
          const t3 = e.BufferUtils.decodeText(new Uint8Array([n2.getUint8(o2), n2.getUint8(o2 + 1), n2.getUint8(o2 + 2), n2.getUint8(o2 + 3)])), s3 = n2.getUint32(o2 + 4, true);
          if ("VP8 " === t3) return [16383 & n2.getInt16(o2 + 14, true), 16383 & n2.getInt16(o2 + 16, true)];
          if ("VP8L" === t3) {
            const e2 = n2.getUint8(o2 + 9), t4 = n2.getUint8(o2 + 10), s4 = n2.getUint8(o2 + 11);
            return [1 + ((63 & t4) << 8 | e2), 1 + ((15 & n2.getUint8(o2 + 12)) << 10 | s4 << 2 | (192 & t4) >> 6)];
          }
          o2 += 8 + s3 + s3 % 2;
        }
        return null;
      }
      getChannels(e2) {
        return 4;
      }
    };
    var K = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = H, this.prereadTypes = [e.PropertyType.TEXTURE];
      }
      static register() {
        e.ImageUtils.registerFormat("image/webp", new X());
      }
      preread(e2) {
        return (e2.jsonDoc.json.textures || []).forEach((e3) => {
          e3.extensions && e3.extensions[H] && (e3.source = e3.extensions[H].source);
        }), this;
      }
      read(e2) {
        return this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listTextures().forEach((s2) => {
          if ("image/webp" === s2.getMimeType()) {
            const r2 = e2.imageIndexMap.get(s2);
            (t2.json.textures || []).forEach((e3) => {
              e3.source === r2 && (e3.extensions = e3.extensions || {}, e3.extensions[H] = { source: e3.source }, delete e3.source);
            });
          }
        }), this;
      }
    };
    K.EXTENSION_NAME = H;
    var z = n;
    var q;
    var $;
    var Q;
    var Y;
    function W(e2, t2) {
      const s2 = new q.DecoderBuffer();
      try {
        if (s2.Init(t2, t2.length), e2.GetEncodedGeometryType(s2) !== q.TRIANGULAR_MESH) throw new Error(`[${z}] Unknown geometry type.`);
        const r2 = new q.Mesh();
        if (!e2.DecodeBufferToMesh(s2, r2).ok() || 0 === r2.ptr) throw new Error(`[${z}] Decoding failure.`);
        return r2;
      } finally {
        q.destroy(s2);
      }
    }
    function J(e2, t2) {
      const s2 = 3 * t2.num_faces();
      let r2, n2;
      if (t2.num_points() <= 65534) {
        const o2 = s2 * Uint16Array.BYTES_PER_ELEMENT;
        r2 = q._malloc(o2), e2.GetTrianglesUInt16Array(t2, o2, r2), n2 = new Uint16Array(q.HEAPU16.buffer, r2, s2).slice();
      } else {
        const o2 = s2 * Uint32Array.BYTES_PER_ELEMENT;
        r2 = q._malloc(o2), e2.GetTrianglesUInt32Array(t2, o2, r2), n2 = new Uint32Array(q.HEAPU32.buffer, r2, s2).slice();
      }
      return q._free(r2), n2;
    }
    function Z(e2, t2, s2, r2) {
      const n2 = Q[r2.componentType], o2 = $[r2.componentType], i2 = s2.num_components(), a2 = t2.num_points() * i2, c2 = a2 * o2.BYTES_PER_ELEMENT, u2 = q._malloc(c2);
      e2.GetAttributeDataArrayForAllPoints(t2, s2, n2, c2, u2);
      const l2 = new o2(q.HEAPF32.buffer, u2, a2).slice();
      return q._free(u2), l2;
    }
    var ee;
    var te;
    !(function(e2) {
      e2[e2.EDGEBREAKER = 1] = "EDGEBREAKER", e2[e2.SEQUENTIAL = 0] = "SEQUENTIAL";
    })(ee || (ee = {})), (function(e2) {
      e2.POSITION = "POSITION", e2.NORMAL = "NORMAL", e2.COLOR = "COLOR", e2.TEX_COORD = "TEX_COORD", e2.GENERIC = "GENERIC";
    })(te || (te = {}));
    var se = { [te.POSITION]: 14, [te.NORMAL]: 10, [te.COLOR]: 8, [te.TEX_COORD]: 12, [te.GENERIC]: 12 };
    var re = { decodeSpeed: 5, encodeSpeed: 5, method: ee.EDGEBREAKER, quantizationBits: se, quantizationVolume: "mesh" };
    function ne(e2, t2) {
      void 0 === t2 && (t2 = re);
      const s2 = { ...re, ...t2 };
      s2.quantizationBits = { ...se, ...t2.quantizationBits };
      const r2 = new Y.MeshBuilder(), n2 = new Y.Mesh(), o2 = new Y.ExpertEncoder(n2), i2 = {}, a2 = new Y.DracoInt8Array(), c2 = e2.listTargets().length > 0;
      let u2 = false;
      for (const t3 of e2.listSemantics()) {
        const a3 = e2.getAttribute(t3);
        if (a3.getSparse()) {
          u2 = true;
          continue;
        }
        const c3 = oe(t3), l3 = ie(r2, a3.getComponentType(), n2, Y[c3], a3.getCount(), a3.getElementSize(), a3.getArray());
        if (-1 === l3) throw new Error(`Error compressing "${t3}" attribute.`);
        if (i2[t3] = l3, "mesh" === s2.quantizationVolume || "POSITION" !== t3) o2.SetAttributeQuantization(l3, s2.quantizationBits[c3]);
        else {
          if ("object" != typeof s2.quantizationVolume) throw new Error("Invalid quantization volume state.");
          {
            const { quantizationVolume: e3 } = s2, t4 = Math.max(e3.max[0] - e3.min[0], e3.max[1] - e3.min[1], e3.max[2] - e3.min[2]);
            o2.SetAttributeExplicitQuantization(l3, s2.quantizationBits[c3], a3.getElementSize(), e3.min, t4);
          }
        }
      }
      const l2 = e2.getIndices();
      if (!l2) throw new ae("Primitive must have indices.");
      r2.AddFacesToMesh(n2, l2.getCount() / 3, l2.getArray()), o2.SetSpeedOptions(s2.encodeSpeed, s2.decodeSpeed), o2.SetTrackEncodedProperties(true), o2.SetEncodingMethod(s2.method === ee.SEQUENTIAL || c2 || u2 ? Y.MESH_SEQUENTIAL_ENCODING : Y.MESH_EDGEBREAKER_ENCODING);
      const h2 = o2.EncodeToDracoBuffer(!(c2 || u2), a2);
      if (h2 <= 0) throw new ae("Error applying Draco compression.");
      const f2 = new Uint8Array(h2);
      for (let e3 = 0; e3 < h2; ++e3) f2[e3] = a2.GetValue(e3);
      const p2 = o2.GetNumberOfEncodedPoints(), x2 = 3 * o2.GetNumberOfEncodedFaces();
      return Y.destroy(a2), Y.destroy(n2), Y.destroy(r2), Y.destroy(o2), { numVertices: p2, numIndices: x2, data: f2, attributeIDs: i2 };
    }
    function oe(e2) {
      return "POSITION" === e2 ? te.POSITION : "NORMAL" === e2 ? te.NORMAL : e2.startsWith("COLOR_") ? te.COLOR : e2.startsWith("TEXCOORD_") ? te.TEX_COORD : te.GENERIC;
    }
    function ie(t2, s2, r2, n2, o2, i2, a2) {
      switch (s2) {
        case e.Accessor.ComponentType.UNSIGNED_BYTE:
          return t2.AddUInt8Attribute(r2, n2, o2, i2, a2);
        case e.Accessor.ComponentType.BYTE:
          return t2.AddInt8Attribute(r2, n2, o2, i2, a2);
        case e.Accessor.ComponentType.UNSIGNED_SHORT:
          return t2.AddUInt16Attribute(r2, n2, o2, i2, a2);
        case e.Accessor.ComponentType.SHORT:
          return t2.AddInt16Attribute(r2, n2, o2, i2, a2);
        case e.Accessor.ComponentType.UNSIGNED_INT:
          return t2.AddUInt32Attribute(r2, n2, o2, i2, a2);
        case e.Accessor.ComponentType.FLOAT:
          return t2.AddFloatAttribute(r2, n2, o2, i2, a2);
        default:
          throw new Error(`Unexpected component type, "${s2}".`);
      }
    }
    var ae = class extends Error {
    };
    var ce = n;
    var ue = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = ce, this.prereadTypes = [e.PropertyType.PRIMITIVE], this.prewriteTypes = [e.PropertyType.ACCESSOR], this.readDependencies = ["draco3d.decoder"], this.writeDependencies = ["draco3d.encoder"], this._decoderModule = null, this._encoderModule = null, this._encoderOptions = {};
      }
      install(t2, s2) {
        return "draco3d.decoder" === t2 && (this._decoderModule = s2, q = this._decoderModule, $ = { [e.Accessor.ComponentType.FLOAT]: Float32Array, [e.Accessor.ComponentType.UNSIGNED_INT]: Uint32Array, [e.Accessor.ComponentType.UNSIGNED_SHORT]: Uint16Array, [e.Accessor.ComponentType.UNSIGNED_BYTE]: Uint8Array, [e.Accessor.ComponentType.SHORT]: Int16Array, [e.Accessor.ComponentType.BYTE]: Int8Array }, Q = { [e.Accessor.ComponentType.FLOAT]: q.DT_FLOAT32, [e.Accessor.ComponentType.UNSIGNED_INT]: q.DT_UINT32, [e.Accessor.ComponentType.UNSIGNED_SHORT]: q.DT_UINT16, [e.Accessor.ComponentType.UNSIGNED_BYTE]: q.DT_UINT8, [e.Accessor.ComponentType.SHORT]: q.DT_INT16, [e.Accessor.ComponentType.BYTE]: q.DT_INT8 }), "draco3d.encoder" === t2 && (this._encoderModule = s2, Y = this._encoderModule), this;
      }
      setEncoderOptions(e2) {
        return this._encoderOptions = e2, this;
      }
      preread(t2) {
        if (!this._decoderModule) throw new Error(`[${ce}] Please install extension dependency, "draco3d.decoder".`);
        const s2 = this.document.getLogger(), r2 = t2.jsonDoc, n2 = /* @__PURE__ */ new Map();
        try {
          const o2 = r2.json.meshes || [];
          for (const i2 of o2) for (const o3 of i2.primitives) {
            if (!o3.extensions || !o3.extensions[ce]) continue;
            const i3 = o3.extensions[ce];
            let [a2, c2] = n2.get(i3.bufferView) || [];
            if (!c2 || !a2) {
              const t3 = r2.json.bufferViews[i3.bufferView], o4 = r2.json.buffers[t3.buffer], u2 = e.BufferUtils.toView(o4.uri ? r2.resources[o4.uri] : r2.resources[e.GLB_BUFFER], t3.byteOffset || 0, t3.byteLength);
              a2 = new this._decoderModule.Decoder(), c2 = W(a2, u2), n2.set(i3.bufferView, [a2, c2]), s2.debug(`[${ce}] Decompressed ${u2.byteLength} bytes.`);
            }
            for (const e2 in o3.attributes) {
              const s3 = t2.jsonDoc.json.accessors[o3.attributes[e2]], r3 = a2.GetAttributeByUniqueId(c2, i3.attributes[e2]), n3 = Z(a2, c2, r3, s3);
              t2.accessors[o3.attributes[e2]].setArray(n3);
            }
            void 0 !== o3.indices && t2.accessors[o3.indices].setArray(J(a2, c2));
          }
        } finally {
          for (const [e2, t3] of Array.from(n2.values())) this._decoderModule.destroy(e2), this._decoderModule.destroy(t3);
        }
        return this;
      }
      read(e2) {
        return this;
      }
      prewrite(t2, s2) {
        if (!this._encoderModule) throw new Error(`[${ce}] Please install extension dependency, "draco3d.encoder".`);
        const r2 = this.document.getLogger();
        r2.debug(`[${ce}] Compression options: ${JSON.stringify(this._encoderOptions)}`);
        const n2 = (function(t3) {
          const s3 = t3.getLogger(), r3 = /* @__PURE__ */ new Set(), n3 = /* @__PURE__ */ new Set();
          for (const o4 of t3.getRoot().listMeshes()) for (const t4 of o4.listPrimitives()) t4.getIndices() ? t4.getMode() !== e.Primitive.Mode.TRIANGLES ? (n3.add(t4), s3.warn(`[${ce}] Skipping Draco compression on non-TRIANGLES primitive.`)) : r3.add(t4) : (n3.add(t4), s3.warn(`[${ce}] Skipping Draco compression on non-indexed primitive.`));
          const o3 = t3.getRoot().listAccessors(), i3 = /* @__PURE__ */ new Map();
          for (let e2 = 0; e2 < o3.length; e2++) i3.set(o3[e2], e2);
          const a2 = /* @__PURE__ */ new Map(), c2 = /* @__PURE__ */ new Set(), u2 = /* @__PURE__ */ new Map();
          for (const e2 of Array.from(r3)) {
            let s4 = le(e2, i3);
            if (c2.has(s4)) u2.set(e2, s4);
            else {
              if (a2.has(e2.getIndices())) {
                const s5 = e2.getIndices(), r4 = s5.clone();
                i3.set(r4, t3.getRoot().listAccessors().length - 1), e2.swap(s5, r4);
              }
              for (const s5 of e2.listAttributes()) if (a2.has(s5)) {
                const r4 = s5.clone();
                i3.set(r4, t3.getRoot().listAccessors().length - 1), e2.swap(s5, r4);
              }
              s4 = le(e2, i3), c2.add(s4), u2.set(e2, s4), a2.set(e2.getIndices(), s4);
              for (const t4 of e2.listAttributes()) a2.set(t4, s4);
            }
          }
          for (const t4 of Array.from(a2.keys())) {
            const s4 = new Set(t4.listParents().map((e2) => e2.propertyType));
            if (2 !== s4.size || !s4.has(e.PropertyType.PRIMITIVE) || !s4.has(e.PropertyType.ROOT)) throw new Error(`[${ce}] Compressed accessors must only be used as indices or vertex attributes.`);
          }
          for (const e2 of Array.from(r3)) {
            const t4 = u2.get(e2), s4 = e2.getIndices();
            if (a2.get(s4) !== t4 || e2.listAttributes().some((e3) => a2.get(e3) !== t4)) throw new Error(`[${ce}] Draco primitives must share all, or no, accessors.`);
          }
          for (const e2 of Array.from(n3)) {
            const t4 = e2.getIndices();
            if (a2.has(t4) || e2.listAttributes().some((e3) => a2.has(e3))) throw new Error(`[${ce}] Accessor cannot be shared by compressed and uncompressed primitives.`);
          }
          return u2;
        })(this.document), o2 = /* @__PURE__ */ new Map();
        let i2 = "mesh";
        "scene" === this._encoderOptions.quantizationVolume && (1 !== this.document.getRoot().listScenes().length ? r2.warn(`[${ce}]: quantizationVolume=scene requires exactly 1 scene.`) : i2 = e.getBounds(this.document.getRoot().listScenes().pop()));
        for (const e2 of Array.from(n2.keys())) {
          const s3 = n2.get(e2);
          if (!s3) throw new Error("Unexpected primitive.");
          if (o2.has(s3)) {
            o2.set(s3, o2.get(s3));
            continue;
          }
          const a2 = e2.getIndices(), c2 = t2.jsonDoc.json.accessors;
          let u2;
          try {
            u2 = ne(e2, { ...this._encoderOptions, quantizationVolume: i2 });
          } catch (e3) {
            if (e3 instanceof ae) {
              r2.warn(`[${ce}]: ${e3.message} Skipping primitive compression.`);
              continue;
            }
            throw e3;
          }
          o2.set(s3, u2);
          const l2 = t2.createAccessorDef(a2);
          l2.count = u2.numIndices, t2.accessorIndexMap.set(a2, c2.length), c2.push(l2);
          for (const s4 of e2.listSemantics()) {
            const r3 = e2.getAttribute(s4);
            if (void 0 === u2.attributeIDs[s4]) continue;
            const n3 = t2.createAccessorDef(r3);
            n3.count = u2.numVertices, t2.accessorIndexMap.set(r3, c2.length), c2.push(n3);
          }
          const h2 = e2.getAttribute("POSITION").getBuffer() || this.document.getRoot().listBuffers()[0];
          t2.otherBufferViews.has(h2) || t2.otherBufferViews.set(h2, []), t2.otherBufferViews.get(h2).push(u2.data);
        }
        return r2.debug(`[${ce}] Compressed ${n2.size} primitives.`), t2.extensionData[ce] = { primitiveHashMap: n2, primitiveEncodingMap: o2 }, this;
      }
      write(e2) {
        const t2 = e2.extensionData[ce];
        for (const s2 of this.document.getRoot().listMeshes()) {
          const r2 = e2.jsonDoc.json.meshes[e2.meshIndexMap.get(s2)];
          for (let n2 = 0; n2 < s2.listPrimitives().length; n2++) {
            const o2 = s2.listPrimitives()[n2], i2 = r2.primitives[n2], a2 = t2.primitiveHashMap.get(o2);
            if (!a2) continue;
            const c2 = t2.primitiveEncodingMap.get(a2);
            c2 && (i2.extensions = i2.extensions || {}, i2.extensions[ce] = { bufferView: e2.otherBufferViewsIndexMap.get(c2.data), attributes: c2.attributeIDs });
          }
        }
        if (!t2.primitiveHashMap.size) {
          const t3 = e2.jsonDoc.json;
          t3.extensionsUsed = (t3.extensionsUsed || []).filter((e3) => e3 !== ce), t3.extensionsRequired = (t3.extensionsRequired || []).filter((e3) => e3 !== ce);
        }
        return this;
      }
    };
    function le(e2, t2) {
      const s2 = [], r2 = e2.getIndices();
      s2.push(t2.get(r2));
      for (const r3 of e2.listAttributes()) s2.push(t2.get(r3));
      return s2.sort().join("|");
    }
    ue.EXTENSION_NAME = ce, ue.EncoderMethod = ee;
    var he = class _he extends e.ExtensionProperty {
      init() {
        this.extensionName = o, this.propertyType = "Light", this.parentTypes = [e.PropertyType.NODE];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { color: [1, 1, 1], intensity: 1, type: _he.Type.POINT, range: null, innerConeAngle: 0, outerConeAngle: Math.PI / 4 });
      }
      getColor() {
        return this.get("color");
      }
      setColor(e2) {
        return this.set("color", e2);
      }
      getColorHex() {
        return e.ColorUtils.factorToHex(this.getColor());
      }
      setColorHex(t2) {
        const s2 = this.getColor().slice();
        return e.ColorUtils.hexToFactor(t2, s2), this.setColor(s2);
      }
      getIntensity() {
        return this.get("intensity");
      }
      setIntensity(e2) {
        return this.set("intensity", e2);
      }
      getType() {
        return this.get("type");
      }
      setType(e2) {
        return this.set("type", e2);
      }
      getRange() {
        return this.get("range");
      }
      setRange(e2) {
        return this.set("range", e2);
      }
      getInnerConeAngle() {
        return this.get("innerConeAngle");
      }
      setInnerConeAngle(e2) {
        return this.set("innerConeAngle", e2);
      }
      getOuterConeAngle() {
        return this.get("outerConeAngle");
      }
      setOuterConeAngle(e2) {
        return this.set("outerConeAngle", e2);
      }
    };
    he.EXTENSION_NAME = o, he.Type = { POINT: "point", SPOT: "spot", DIRECTIONAL: "directional" };
    var fe = o;
    var pe = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = fe;
      }
      createLight(e2) {
        return void 0 === e2 && (e2 = ""), new he(this.document.getGraph(), e2);
      }
      read(e2) {
        const t2 = e2.jsonDoc;
        if (!t2.json.extensions || !t2.json.extensions[fe]) return this;
        const s2 = (t2.json.extensions[fe].lights || []).map((e3) => {
          var t3, s3;
          const r2 = this.createLight().setName(e3.name || "").setType(e3.type);
          return void 0 !== e3.color && r2.setColor(e3.color), void 0 !== e3.intensity && r2.setIntensity(e3.intensity), void 0 !== e3.range && r2.setRange(e3.range), void 0 !== (null == (t3 = e3.spot) ? void 0 : t3.innerConeAngle) && r2.setInnerConeAngle(e3.spot.innerConeAngle), void 0 !== (null == (s3 = e3.spot) ? void 0 : s3.outerConeAngle) && r2.setOuterConeAngle(e3.spot.outerConeAngle), r2;
        });
        return t2.json.nodes.forEach((t3, r2) => {
          t3.extensions && t3.extensions[fe] && e2.nodes[r2].setExtension(fe, s2[t3.extensions[fe].light]);
        }), this;
      }
      write(t2) {
        const s2 = t2.jsonDoc;
        if (0 === this.properties.size) return this;
        const r2 = [], n2 = /* @__PURE__ */ new Map();
        for (const t3 of this.properties) {
          const s3 = t3, o2 = { type: s3.getType() };
          e.MathUtils.eq(s3.getColor(), [1, 1, 1]) || (o2.color = s3.getColor()), 1 !== s3.getIntensity() && (o2.intensity = s3.getIntensity()), null != s3.getRange() && (o2.range = s3.getRange()), s3.getName() && (o2.name = s3.getName()), s3.getType() === he.Type.SPOT && (o2.spot = { innerConeAngle: s3.getInnerConeAngle(), outerConeAngle: s3.getOuterConeAngle() }), r2.push(o2), n2.set(s3, r2.length - 1);
        }
        return this.document.getRoot().listNodes().forEach((e2) => {
          const r3 = e2.getExtension(fe);
          if (r3) {
            const o2 = t2.nodeIndexMap.get(e2), i2 = s2.json.nodes[o2];
            i2.extensions = i2.extensions || {}, i2.extensions[fe] = { light: n2.get(r3) };
          }
        }), s2.json.extensions = s2.json.extensions || {}, s2.json.extensions[fe] = { lights: r2 }, this;
      }
    };
    pe.EXTENSION_NAME = fe;
    var { R: xe, G: ge, B: Te } = e.TextureChannel;
    var de = class extends e.ExtensionProperty {
      init() {
        this.extensionName = i, this.propertyType = "Anisotropy", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { anisotropyStrength: 0, anisotropyRotation: 0, anisotropyTexture: null, anisotropyTextureInfo: new e.TextureInfo(this.graph, "anisotropyTextureInfo") });
      }
      getAnisotropyStrength() {
        return this.get("anisotropyStrength");
      }
      setAnisotropyStrength(e2) {
        return this.set("anisotropyStrength", e2);
      }
      getAnisotropyRotation() {
        return this.get("anisotropyRotation");
      }
      setAnisotropyRotation(e2) {
        return this.set("anisotropyRotation", e2);
      }
      getAnisotropyTexture() {
        return this.getRef("anisotropyTexture");
      }
      getAnisotropyTextureInfo() {
        return this.getRef("anisotropyTexture") ? this.getRef("anisotropyTextureInfo") : null;
      }
      setAnisotropyTexture(e2) {
        return this.setRef("anisotropyTexture", e2, { channels: xe | ge | Te });
      }
    };
    de.EXTENSION_NAME = i;
    var me = i;
    var Ee = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = me;
      }
      createAnisotropy() {
        return new de(this.document.getGraph());
      }
      read(e2) {
        const t2 = e2.jsonDoc, s2 = t2.json.textures || [];
        return (t2.json.materials || []).forEach((t3, r2) => {
          if (t3.extensions && t3.extensions[me]) {
            const n2 = this.createAnisotropy();
            e2.materials[r2].setExtension(me, n2);
            const o2 = t3.extensions[me];
            if (void 0 !== o2.anisotropyStrength && n2.setAnisotropyStrength(o2.anisotropyStrength), void 0 !== o2.anisotropyRotation && n2.setAnisotropyRotation(o2.anisotropyRotation), void 0 !== o2.anisotropyTexture) {
              const t4 = o2.anisotropyTexture;
              n2.setAnisotropyTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getAnisotropyTextureInfo(), t4);
            }
          }
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((s2) => {
          const r2 = s2.getExtension(me);
          if (r2) {
            const n2 = e2.materialIndexMap.get(s2), o2 = t2.json.materials[n2];
            o2.extensions = o2.extensions || {};
            const i2 = o2.extensions[me] = {};
            if (r2.getAnisotropyStrength() > 0 && (i2.anisotropyStrength = r2.getAnisotropyStrength()), 0 !== r2.getAnisotropyRotation() && (i2.anisotropyRotation = r2.getAnisotropyRotation()), r2.getAnisotropyTexture()) {
              const t3 = r2.getAnisotropyTexture(), s3 = r2.getAnisotropyTextureInfo();
              i2.anisotropyTexture = e2.createTextureInfoDef(t3, s3);
            }
          }
        }), this;
      }
    };
    Ee.EXTENSION_NAME = me;
    var { R: ye, G: Ie, B: Re } = e.TextureChannel;
    var Ne = class extends e.ExtensionProperty {
      init() {
        this.extensionName = a, this.propertyType = "Clearcoat", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { clearcoatFactor: 0, clearcoatTexture: null, clearcoatTextureInfo: new e.TextureInfo(this.graph, "clearcoatTextureInfo"), clearcoatRoughnessFactor: 0, clearcoatRoughnessTexture: null, clearcoatRoughnessTextureInfo: new e.TextureInfo(this.graph, "clearcoatRoughnessTextureInfo"), clearcoatNormalScale: 1, clearcoatNormalTexture: null, clearcoatNormalTextureInfo: new e.TextureInfo(this.graph, "clearcoatNormalTextureInfo") });
      }
      getClearcoatFactor() {
        return this.get("clearcoatFactor");
      }
      setClearcoatFactor(e2) {
        return this.set("clearcoatFactor", e2);
      }
      getClearcoatTexture() {
        return this.getRef("clearcoatTexture");
      }
      getClearcoatTextureInfo() {
        return this.getRef("clearcoatTexture") ? this.getRef("clearcoatTextureInfo") : null;
      }
      setClearcoatTexture(e2) {
        return this.setRef("clearcoatTexture", e2, { channels: ye });
      }
      getClearcoatRoughnessFactor() {
        return this.get("clearcoatRoughnessFactor");
      }
      setClearcoatRoughnessFactor(e2) {
        return this.set("clearcoatRoughnessFactor", e2);
      }
      getClearcoatRoughnessTexture() {
        return this.getRef("clearcoatRoughnessTexture");
      }
      getClearcoatRoughnessTextureInfo() {
        return this.getRef("clearcoatRoughnessTexture") ? this.getRef("clearcoatRoughnessTextureInfo") : null;
      }
      setClearcoatRoughnessTexture(e2) {
        return this.setRef("clearcoatRoughnessTexture", e2, { channels: Ie });
      }
      getClearcoatNormalScale() {
        return this.get("clearcoatNormalScale");
      }
      setClearcoatNormalScale(e2) {
        return this.set("clearcoatNormalScale", e2);
      }
      getClearcoatNormalTexture() {
        return this.getRef("clearcoatNormalTexture");
      }
      getClearcoatNormalTextureInfo() {
        return this.getRef("clearcoatNormalTexture") ? this.getRef("clearcoatNormalTextureInfo") : null;
      }
      setClearcoatNormalTexture(e2) {
        return this.setRef("clearcoatNormalTexture", e2, { channels: ye | Ie | Re });
      }
    };
    Ne.EXTENSION_NAME = a;
    var Ae = a;
    var Se = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = Ae;
      }
      createClearcoat() {
        return new Ne(this.document.getGraph());
      }
      read(e2) {
        const t2 = e2.jsonDoc, s2 = t2.json.textures || [];
        return (t2.json.materials || []).forEach((t3, r2) => {
          if (t3.extensions && t3.extensions[Ae]) {
            const n2 = this.createClearcoat();
            e2.materials[r2].setExtension(Ae, n2);
            const o2 = t3.extensions[Ae];
            if (void 0 !== o2.clearcoatFactor && n2.setClearcoatFactor(o2.clearcoatFactor), void 0 !== o2.clearcoatRoughnessFactor && n2.setClearcoatRoughnessFactor(o2.clearcoatRoughnessFactor), void 0 !== o2.clearcoatTexture) {
              const t4 = o2.clearcoatTexture;
              n2.setClearcoatTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getClearcoatTextureInfo(), t4);
            }
            if (void 0 !== o2.clearcoatRoughnessTexture) {
              const t4 = o2.clearcoatRoughnessTexture;
              n2.setClearcoatRoughnessTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getClearcoatRoughnessTextureInfo(), t4);
            }
            if (void 0 !== o2.clearcoatNormalTexture) {
              const t4 = o2.clearcoatNormalTexture;
              n2.setClearcoatNormalTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getClearcoatNormalTextureInfo(), t4), void 0 !== t4.scale && n2.setClearcoatNormalScale(t4.scale);
            }
          }
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((s2) => {
          const r2 = s2.getExtension(Ae);
          if (r2) {
            const n2 = e2.materialIndexMap.get(s2), o2 = t2.json.materials[n2];
            o2.extensions = o2.extensions || {};
            const i2 = o2.extensions[Ae] = { clearcoatFactor: r2.getClearcoatFactor(), clearcoatRoughnessFactor: r2.getClearcoatRoughnessFactor() };
            if (r2.getClearcoatTexture()) {
              const t3 = r2.getClearcoatTexture(), s3 = r2.getClearcoatTextureInfo();
              i2.clearcoatTexture = e2.createTextureInfoDef(t3, s3);
            }
            if (r2.getClearcoatRoughnessTexture()) {
              const t3 = r2.getClearcoatRoughnessTexture(), s3 = r2.getClearcoatRoughnessTextureInfo();
              i2.clearcoatRoughnessTexture = e2.createTextureInfoDef(t3, s3);
            }
            if (r2.getClearcoatNormalTexture()) {
              const t3 = r2.getClearcoatNormalTexture(), s3 = r2.getClearcoatNormalTextureInfo();
              i2.clearcoatNormalTexture = e2.createTextureInfoDef(t3, s3), 1 !== r2.getClearcoatNormalScale() && (i2.clearcoatNormalTexture.scale = r2.getClearcoatNormalScale());
            }
          }
        }), this;
      }
    };
    Se.EXTENSION_NAME = Ae;
    var Ce = class extends e.ExtensionProperty {
      init() {
        this.extensionName = c, this.propertyType = "EmissiveStrength", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { emissiveStrength: 1 });
      }
      getEmissiveStrength() {
        return this.get("emissiveStrength");
      }
      setEmissiveStrength(e2) {
        return this.set("emissiveStrength", e2);
      }
    };
    Ce.EXTENSION_NAME = c;
    var Me = c;
    var Oe = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = Me;
      }
      createEmissiveStrength() {
        return new Ce(this.document.getGraph());
      }
      read(e2) {
        return (e2.jsonDoc.json.materials || []).forEach((t2, s2) => {
          if (t2.extensions && t2.extensions[Me]) {
            const r2 = this.createEmissiveStrength();
            e2.materials[s2].setExtension(Me, r2);
            const n2 = t2.extensions[Me];
            void 0 !== n2.emissiveStrength && r2.setEmissiveStrength(n2.emissiveStrength);
          }
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((s2) => {
          const r2 = s2.getExtension(Me);
          if (r2) {
            const n2 = e2.materialIndexMap.get(s2), o2 = t2.json.materials[n2];
            o2.extensions = o2.extensions || {}, o2.extensions[Me] = { emissiveStrength: r2.getEmissiveStrength() };
          }
        }), this;
      }
    };
    Oe.EXTENSION_NAME = Me;
    var _e = class extends e.ExtensionProperty {
      init() {
        this.extensionName = u, this.propertyType = "IOR", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { ior: 1.5 });
      }
      getIOR() {
        return this.get("ior");
      }
      setIOR(e2) {
        return this.set("ior", e2);
      }
    };
    _e.EXTENSION_NAME = u;
    var De = u;
    var we = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = De;
      }
      createIOR() {
        return new _e(this.document.getGraph());
      }
      read(e2) {
        return (e2.jsonDoc.json.materials || []).forEach((t2, s2) => {
          if (t2.extensions && t2.extensions[De]) {
            const r2 = this.createIOR();
            e2.materials[s2].setExtension(De, r2);
            const n2 = t2.extensions[De];
            void 0 !== n2.ior && r2.setIOR(n2.ior);
          }
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((s2) => {
          const r2 = s2.getExtension(De);
          if (r2) {
            const n2 = e2.materialIndexMap.get(s2), o2 = t2.json.materials[n2];
            o2.extensions = o2.extensions || {}, o2.extensions[De] = { ior: r2.getIOR() };
          }
        }), this;
      }
    };
    we.EXTENSION_NAME = De;
    var { R: Fe, G: be } = e.TextureChannel;
    var Pe = class extends e.ExtensionProperty {
      init() {
        this.extensionName = l, this.propertyType = "Iridescence", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { iridescenceFactor: 0, iridescenceTexture: null, iridescenceTextureInfo: new e.TextureInfo(this.graph, "iridescenceTextureInfo"), iridescenceIOR: 1.3, iridescenceThicknessMinimum: 100, iridescenceThicknessMaximum: 400, iridescenceThicknessTexture: null, iridescenceThicknessTextureInfo: new e.TextureInfo(this.graph, "iridescenceThicknessTextureInfo") });
      }
      getIridescenceFactor() {
        return this.get("iridescenceFactor");
      }
      setIridescenceFactor(e2) {
        return this.set("iridescenceFactor", e2);
      }
      getIridescenceTexture() {
        return this.getRef("iridescenceTexture");
      }
      getIridescenceTextureInfo() {
        return this.getRef("iridescenceTexture") ? this.getRef("iridescenceTextureInfo") : null;
      }
      setIridescenceTexture(e2) {
        return this.setRef("iridescenceTexture", e2, { channels: Fe });
      }
      getIridescenceIOR() {
        return this.get("iridescenceIOR");
      }
      setIridescenceIOR(e2) {
        return this.set("iridescenceIOR", e2);
      }
      getIridescenceThicknessMinimum() {
        return this.get("iridescenceThicknessMinimum");
      }
      setIridescenceThicknessMinimum(e2) {
        return this.set("iridescenceThicknessMinimum", e2);
      }
      getIridescenceThicknessMaximum() {
        return this.get("iridescenceThicknessMaximum");
      }
      setIridescenceThicknessMaximum(e2) {
        return this.set("iridescenceThicknessMaximum", e2);
      }
      getIridescenceThicknessTexture() {
        return this.getRef("iridescenceThicknessTexture");
      }
      getIridescenceThicknessTextureInfo() {
        return this.getRef("iridescenceThicknessTexture") ? this.getRef("iridescenceThicknessTextureInfo") : null;
      }
      setIridescenceThicknessTexture(e2) {
        return this.setRef("iridescenceThicknessTexture", e2, { channels: be });
      }
    };
    Pe.EXTENSION_NAME = l;
    var je = l;
    var ve = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = je;
      }
      createIridescence() {
        return new Pe(this.document.getGraph());
      }
      read(e2) {
        const t2 = e2.jsonDoc, s2 = t2.json.textures || [];
        return (t2.json.materials || []).forEach((t3, r2) => {
          if (t3.extensions && t3.extensions[je]) {
            const n2 = this.createIridescence();
            e2.materials[r2].setExtension(je, n2);
            const o2 = t3.extensions[je];
            if (void 0 !== o2.iridescenceFactor && n2.setIridescenceFactor(o2.iridescenceFactor), void 0 !== o2.iridescenceIor && n2.setIridescenceIOR(o2.iridescenceIor), void 0 !== o2.iridescenceThicknessMinimum && n2.setIridescenceThicknessMinimum(o2.iridescenceThicknessMinimum), void 0 !== o2.iridescenceThicknessMaximum && n2.setIridescenceThicknessMaximum(o2.iridescenceThicknessMaximum), void 0 !== o2.iridescenceTexture) {
              const t4 = o2.iridescenceTexture;
              n2.setIridescenceTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getIridescenceTextureInfo(), t4);
            }
            if (void 0 !== o2.iridescenceThicknessTexture) {
              const t4 = o2.iridescenceThicknessTexture;
              n2.setIridescenceThicknessTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getIridescenceThicknessTextureInfo(), t4);
            }
          }
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((s2) => {
          const r2 = s2.getExtension(je);
          if (r2) {
            const n2 = e2.materialIndexMap.get(s2), o2 = t2.json.materials[n2];
            o2.extensions = o2.extensions || {};
            const i2 = o2.extensions[je] = {};
            if (r2.getIridescenceFactor() > 0 && (i2.iridescenceFactor = r2.getIridescenceFactor()), 1.3 !== r2.getIridescenceIOR() && (i2.iridescenceIor = r2.getIridescenceIOR()), 100 !== r2.getIridescenceThicknessMinimum() && (i2.iridescenceThicknessMinimum = r2.getIridescenceThicknessMinimum()), 400 !== r2.getIridescenceThicknessMaximum() && (i2.iridescenceThicknessMaximum = r2.getIridescenceThicknessMaximum()), r2.getIridescenceTexture()) {
              const t3 = r2.getIridescenceTexture(), s3 = r2.getIridescenceTextureInfo();
              i2.iridescenceTexture = e2.createTextureInfoDef(t3, s3);
            }
            if (r2.getIridescenceThicknessTexture()) {
              const t3 = r2.getIridescenceThicknessTexture(), s3 = r2.getIridescenceThicknessTextureInfo();
              i2.iridescenceThicknessTexture = e2.createTextureInfoDef(t3, s3);
            }
          }
        }), this;
      }
    };
    ve.EXTENSION_NAME = je;
    var { R: Ue, G: Be, B: ke, A: Le } = e.TextureChannel;
    var Ge = class extends e.ExtensionProperty {
      init() {
        this.extensionName = h, this.propertyType = "PBRSpecularGlossiness", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { diffuseFactor: [1, 1, 1, 1], diffuseTexture: null, diffuseTextureInfo: new e.TextureInfo(this.graph, "diffuseTextureInfo"), specularFactor: [1, 1, 1], glossinessFactor: 1, specularGlossinessTexture: null, specularGlossinessTextureInfo: new e.TextureInfo(this.graph, "specularGlossinessTextureInfo") });
      }
      getDiffuseFactor() {
        return this.get("diffuseFactor");
      }
      setDiffuseFactor(e2) {
        return this.set("diffuseFactor", e2);
      }
      getDiffuseHex() {
        return e.ColorUtils.factorToHex(this.getDiffuseFactor());
      }
      setDiffuseHex(t2) {
        const s2 = this.getDiffuseFactor().slice();
        return this.setDiffuseFactor(e.ColorUtils.hexToFactor(t2, s2));
      }
      getDiffuseTexture() {
        return this.getRef("diffuseTexture");
      }
      getDiffuseTextureInfo() {
        return this.getRef("diffuseTexture") ? this.getRef("diffuseTextureInfo") : null;
      }
      setDiffuseTexture(e2) {
        return this.setRef("diffuseTexture", e2, { channels: Ue | Be | ke | Le, isColor: true });
      }
      getSpecularFactor() {
        return this.get("specularFactor");
      }
      setSpecularFactor(e2) {
        return this.set("specularFactor", e2);
      }
      getGlossinessFactor() {
        return this.get("glossinessFactor");
      }
      setGlossinessFactor(e2) {
        return this.set("glossinessFactor", e2);
      }
      getSpecularGlossinessTexture() {
        return this.getRef("specularGlossinessTexture");
      }
      getSpecularGlossinessTextureInfo() {
        return this.getRef("specularGlossinessTexture") ? this.getRef("specularGlossinessTextureInfo") : null;
      }
      setSpecularGlossinessTexture(e2) {
        return this.setRef("specularGlossinessTexture", e2, { channels: Ue | Be | ke | Le });
      }
    };
    Ge.EXTENSION_NAME = h;
    var Ve = h;
    var He = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = Ve;
      }
      createPBRSpecularGlossiness() {
        return new Ge(this.document.getGraph());
      }
      read(e2) {
        const t2 = e2.jsonDoc, s2 = t2.json.textures || [];
        return (t2.json.materials || []).forEach((t3, r2) => {
          if (t3.extensions && t3.extensions[Ve]) {
            const n2 = this.createPBRSpecularGlossiness();
            e2.materials[r2].setExtension(Ve, n2);
            const o2 = t3.extensions[Ve];
            if (void 0 !== o2.diffuseFactor && n2.setDiffuseFactor(o2.diffuseFactor), void 0 !== o2.specularFactor && n2.setSpecularFactor(o2.specularFactor), void 0 !== o2.glossinessFactor && n2.setGlossinessFactor(o2.glossinessFactor), void 0 !== o2.diffuseTexture) {
              const t4 = o2.diffuseTexture;
              n2.setDiffuseTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getDiffuseTextureInfo(), t4);
            }
            if (void 0 !== o2.specularGlossinessTexture) {
              const t4 = o2.specularGlossinessTexture;
              n2.setSpecularGlossinessTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getSpecularGlossinessTextureInfo(), t4);
            }
          }
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((s2) => {
          const r2 = s2.getExtension(Ve);
          if (r2) {
            const n2 = e2.materialIndexMap.get(s2), o2 = t2.json.materials[n2];
            o2.extensions = o2.extensions || {};
            const i2 = o2.extensions[Ve] = { diffuseFactor: r2.getDiffuseFactor(), specularFactor: r2.getSpecularFactor(), glossinessFactor: r2.getGlossinessFactor() };
            if (r2.getDiffuseTexture()) {
              const t3 = r2.getDiffuseTexture(), s3 = r2.getDiffuseTextureInfo();
              i2.diffuseTexture = e2.createTextureInfoDef(t3, s3);
            }
            if (r2.getSpecularGlossinessTexture()) {
              const t3 = r2.getSpecularGlossinessTexture(), s3 = r2.getSpecularGlossinessTextureInfo();
              i2.specularGlossinessTexture = e2.createTextureInfoDef(t3, s3);
            }
          }
        }), this;
      }
    };
    He.EXTENSION_NAME = Ve;
    var { R: Xe, G: Ke, B: ze, A: qe } = e.TextureChannel;
    var $e = class extends e.ExtensionProperty {
      init() {
        this.extensionName = f, this.propertyType = "Sheen", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { sheenColorFactor: [0, 0, 0], sheenColorTexture: null, sheenColorTextureInfo: new e.TextureInfo(this.graph, "sheenColorTextureInfo"), sheenRoughnessFactor: 0, sheenRoughnessTexture: null, sheenRoughnessTextureInfo: new e.TextureInfo(this.graph, "sheenRoughnessTextureInfo") });
      }
      getSheenColorFactor() {
        return this.get("sheenColorFactor");
      }
      getSheenColorHex() {
        return e.ColorUtils.factorToHex(this.getSheenColorFactor());
      }
      setSheenColorFactor(e2) {
        return this.set("sheenColorFactor", e2);
      }
      setSheenColorHex(t2) {
        const s2 = this.getSheenColorFactor().slice();
        return this.set("sheenColorFactor", e.ColorUtils.hexToFactor(t2, s2));
      }
      getSheenColorTexture() {
        return this.getRef("sheenColorTexture");
      }
      getSheenColorTextureInfo() {
        return this.getRef("sheenColorTexture") ? this.getRef("sheenColorTextureInfo") : null;
      }
      setSheenColorTexture(e2) {
        return this.setRef("sheenColorTexture", e2, { channels: Xe | Ke | ze, isColor: true });
      }
      getSheenRoughnessFactor() {
        return this.get("sheenRoughnessFactor");
      }
      setSheenRoughnessFactor(e2) {
        return this.set("sheenRoughnessFactor", e2);
      }
      getSheenRoughnessTexture() {
        return this.getRef("sheenRoughnessTexture");
      }
      getSheenRoughnessTextureInfo() {
        return this.getRef("sheenRoughnessTexture") ? this.getRef("sheenRoughnessTextureInfo") : null;
      }
      setSheenRoughnessTexture(e2) {
        return this.setRef("sheenRoughnessTexture", e2, { channels: qe });
      }
    };
    $e.EXTENSION_NAME = f;
    var Qe = f;
    var Ye = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = Qe;
      }
      createSheen() {
        return new $e(this.document.getGraph());
      }
      read(e2) {
        const t2 = e2.jsonDoc, s2 = t2.json.textures || [];
        return (t2.json.materials || []).forEach((t3, r2) => {
          if (t3.extensions && t3.extensions[Qe]) {
            const n2 = this.createSheen();
            e2.materials[r2].setExtension(Qe, n2);
            const o2 = t3.extensions[Qe];
            if (void 0 !== o2.sheenColorFactor && n2.setSheenColorFactor(o2.sheenColorFactor), void 0 !== o2.sheenRoughnessFactor && n2.setSheenRoughnessFactor(o2.sheenRoughnessFactor), void 0 !== o2.sheenColorTexture) {
              const t4 = o2.sheenColorTexture;
              n2.setSheenColorTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getSheenColorTextureInfo(), t4);
            }
            if (void 0 !== o2.sheenRoughnessTexture) {
              const t4 = o2.sheenRoughnessTexture;
              n2.setSheenRoughnessTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getSheenRoughnessTextureInfo(), t4);
            }
          }
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((s2) => {
          const r2 = s2.getExtension(Qe);
          if (r2) {
            const n2 = e2.materialIndexMap.get(s2), o2 = t2.json.materials[n2];
            o2.extensions = o2.extensions || {};
            const i2 = o2.extensions[Qe] = { sheenColorFactor: r2.getSheenColorFactor(), sheenRoughnessFactor: r2.getSheenRoughnessFactor() };
            if (r2.getSheenColorTexture()) {
              const t3 = r2.getSheenColorTexture(), s3 = r2.getSheenColorTextureInfo();
              i2.sheenColorTexture = e2.createTextureInfoDef(t3, s3);
            }
            if (r2.getSheenRoughnessTexture()) {
              const t3 = r2.getSheenRoughnessTexture(), s3 = r2.getSheenRoughnessTextureInfo();
              i2.sheenRoughnessTexture = e2.createTextureInfoDef(t3, s3);
            }
          }
        }), this;
      }
    };
    Ye.EXTENSION_NAME = Qe;
    var { R: We, G: Je, B: Ze, A: et } = e.TextureChannel;
    var tt = class extends e.ExtensionProperty {
      init() {
        this.extensionName = p, this.propertyType = "Specular", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { specularFactor: 1, specularTexture: null, specularTextureInfo: new e.TextureInfo(this.graph, "specularTextureInfo"), specularColorFactor: [1, 1, 1], specularColorTexture: null, specularColorTextureInfo: new e.TextureInfo(this.graph, "specularColorTextureInfo") });
      }
      getSpecularFactor() {
        return this.get("specularFactor");
      }
      setSpecularFactor(e2) {
        return this.set("specularFactor", e2);
      }
      getSpecularColorFactor() {
        return this.get("specularColorFactor");
      }
      setSpecularColorFactor(e2) {
        return this.set("specularColorFactor", e2);
      }
      getSpecularColorHex() {
        return e.ColorUtils.factorToHex(this.getSpecularColorFactor());
      }
      setSpecularColorHex(t2) {
        const s2 = this.getSpecularColorFactor().slice();
        return this.set("specularColorFactor", e.ColorUtils.hexToFactor(t2, s2));
      }
      getSpecularTexture() {
        return this.getRef("specularTexture");
      }
      getSpecularTextureInfo() {
        return this.getRef("specularTexture") ? this.getRef("specularTextureInfo") : null;
      }
      setSpecularTexture(e2) {
        return this.setRef("specularTexture", e2, { channels: et });
      }
      getSpecularColorTexture() {
        return this.getRef("specularColorTexture");
      }
      getSpecularColorTextureInfo() {
        return this.getRef("specularColorTexture") ? this.getRef("specularColorTextureInfo") : null;
      }
      setSpecularColorTexture(e2) {
        return this.setRef("specularColorTexture", e2, { channels: We | Je | Ze, isColor: true });
      }
    };
    tt.EXTENSION_NAME = p;
    var st = p;
    var rt = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = st;
      }
      createSpecular() {
        return new tt(this.document.getGraph());
      }
      read(e2) {
        const t2 = e2.jsonDoc, s2 = t2.json.textures || [];
        return (t2.json.materials || []).forEach((t3, r2) => {
          if (t3.extensions && t3.extensions[st]) {
            const n2 = this.createSpecular();
            e2.materials[r2].setExtension(st, n2);
            const o2 = t3.extensions[st];
            if (void 0 !== o2.specularFactor && n2.setSpecularFactor(o2.specularFactor), void 0 !== o2.specularColorFactor && n2.setSpecularColorFactor(o2.specularColorFactor), void 0 !== o2.specularTexture) {
              const t4 = o2.specularTexture;
              n2.setSpecularTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getSpecularTextureInfo(), t4);
            }
            if (void 0 !== o2.specularColorTexture) {
              const t4 = o2.specularColorTexture;
              n2.setSpecularColorTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getSpecularColorTextureInfo(), t4);
            }
          }
        }), this;
      }
      write(t2) {
        const s2 = t2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((r2) => {
          const n2 = r2.getExtension(st);
          if (n2) {
            const o2 = t2.materialIndexMap.get(r2), i2 = s2.json.materials[o2];
            i2.extensions = i2.extensions || {};
            const a2 = i2.extensions[st] = {};
            if (1 !== n2.getSpecularFactor() && (a2.specularFactor = n2.getSpecularFactor()), e.MathUtils.eq(n2.getSpecularColorFactor(), [1, 1, 1]) || (a2.specularColorFactor = n2.getSpecularColorFactor()), n2.getSpecularTexture()) {
              const e2 = n2.getSpecularTexture(), s3 = n2.getSpecularTextureInfo();
              a2.specularTexture = t2.createTextureInfoDef(e2, s3);
            }
            if (n2.getSpecularColorTexture()) {
              const e2 = n2.getSpecularColorTexture(), s3 = n2.getSpecularColorTextureInfo();
              a2.specularColorTexture = t2.createTextureInfoDef(e2, s3);
            }
          }
        }), this;
      }
    };
    rt.EXTENSION_NAME = st;
    var { R: nt } = e.TextureChannel;
    var ot = class extends e.ExtensionProperty {
      init() {
        this.extensionName = x, this.propertyType = "Transmission", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { transmissionFactor: 0, transmissionTexture: null, transmissionTextureInfo: new e.TextureInfo(this.graph, "transmissionTextureInfo") });
      }
      getTransmissionFactor() {
        return this.get("transmissionFactor");
      }
      setTransmissionFactor(e2) {
        return this.set("transmissionFactor", e2);
      }
      getTransmissionTexture() {
        return this.getRef("transmissionTexture");
      }
      getTransmissionTextureInfo() {
        return this.getRef("transmissionTexture") ? this.getRef("transmissionTextureInfo") : null;
      }
      setTransmissionTexture(e2) {
        return this.setRef("transmissionTexture", e2, { channels: nt });
      }
    };
    ot.EXTENSION_NAME = x;
    var it = x;
    var at = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = it;
      }
      createTransmission() {
        return new ot(this.document.getGraph());
      }
      read(e2) {
        const t2 = e2.jsonDoc, s2 = t2.json.textures || [];
        return (t2.json.materials || []).forEach((t3, r2) => {
          if (t3.extensions && t3.extensions[it]) {
            const n2 = this.createTransmission();
            e2.materials[r2].setExtension(it, n2);
            const o2 = t3.extensions[it];
            if (void 0 !== o2.transmissionFactor && n2.setTransmissionFactor(o2.transmissionFactor), void 0 !== o2.transmissionTexture) {
              const t4 = o2.transmissionTexture;
              n2.setTransmissionTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getTransmissionTextureInfo(), t4);
            }
          }
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((s2) => {
          const r2 = s2.getExtension(it);
          if (r2) {
            const n2 = e2.materialIndexMap.get(s2), o2 = t2.json.materials[n2];
            o2.extensions = o2.extensions || {};
            const i2 = o2.extensions[it] = { transmissionFactor: r2.getTransmissionFactor() };
            if (r2.getTransmissionTexture()) {
              const t3 = r2.getTransmissionTexture(), s3 = r2.getTransmissionTextureInfo();
              i2.transmissionTexture = e2.createTextureInfoDef(t3, s3);
            }
          }
        }), this;
      }
    };
    at.EXTENSION_NAME = it;
    var ct = class extends e.ExtensionProperty {
      init() {
        this.extensionName = g, this.propertyType = "Unlit", this.parentTypes = [e.PropertyType.MATERIAL];
      }
    };
    ct.EXTENSION_NAME = g;
    var ut = g;
    var lt = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = ut;
      }
      createUnlit() {
        return new ct(this.document.getGraph());
      }
      read(e2) {
        return (e2.jsonDoc.json.materials || []).forEach((t2, s2) => {
          t2.extensions && t2.extensions[ut] && e2.materials[s2].setExtension(ut, this.createUnlit());
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((s2) => {
          if (s2.getExtension(ut)) {
            const r2 = e2.materialIndexMap.get(s2), n2 = t2.json.materials[r2];
            n2.extensions = n2.extensions || {}, n2.extensions[ut] = {};
          }
        }), this;
      }
    };
    lt.EXTENSION_NAME = ut;
    var ht = class extends e.ExtensionProperty {
      init() {
        this.extensionName = d, this.propertyType = "Mapping", this.parentTypes = ["MappingList"];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { material: null, variants: [] });
      }
      getMaterial() {
        return this.getRef("material");
      }
      setMaterial(e2) {
        return this.setRef("material", e2);
      }
      addVariant(e2) {
        return this.addRef("variants", e2);
      }
      removeVariant(e2) {
        return this.removeRef("variants", e2);
      }
      listVariants() {
        return this.listRefs("variants");
      }
    };
    ht.EXTENSION_NAME = d;
    var ft = class extends e.ExtensionProperty {
      init() {
        this.extensionName = d, this.propertyType = "MappingList", this.parentTypes = [e.PropertyType.PRIMITIVE];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { mappings: [] });
      }
      addMapping(e2) {
        return this.addRef("mappings", e2);
      }
      removeMapping(e2) {
        return this.removeRef("mappings", e2);
      }
      listMappings() {
        return this.listRefs("mappings");
      }
    };
    ft.EXTENSION_NAME = d;
    var pt = class extends e.ExtensionProperty {
      init() {
        this.extensionName = d, this.propertyType = "Variant", this.parentTypes = ["MappingList"];
      }
    };
    pt.EXTENSION_NAME = d;
    var xt = d;
    var gt = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = xt;
      }
      createMappingList() {
        return new ft(this.document.getGraph());
      }
      createVariant(e2) {
        return void 0 === e2 && (e2 = ""), new pt(this.document.getGraph(), e2);
      }
      createMapping() {
        return new ht(this.document.getGraph());
      }
      listVariants() {
        return Array.from(this.properties).filter((e2) => e2 instanceof pt);
      }
      read(e2) {
        const t2 = e2.jsonDoc;
        if (!t2.json.extensions || !t2.json.extensions[xt]) return this;
        const s2 = (t2.json.extensions[xt].variants || []).map((e3) => this.createVariant().setName(e3.name || ""));
        return (t2.json.meshes || []).forEach((t3, r2) => {
          const n2 = e2.meshes[r2];
          (t3.primitives || []).forEach((t4, r3) => {
            if (!t4.extensions || !t4.extensions[xt]) return;
            const o2 = this.createMappingList(), i2 = t4.extensions[xt];
            for (const t5 of i2.mappings) {
              const r4 = this.createMapping();
              void 0 !== t5.material && r4.setMaterial(e2.materials[t5.material]);
              for (const e3 of t5.variants || []) r4.addVariant(s2[e3]);
              o2.addMapping(r4);
            }
            n2.listPrimitives()[r3].setExtension(xt, o2);
          });
        }), this;
      }
      write(e2) {
        const t2 = e2.jsonDoc, s2 = this.listVariants();
        if (!s2.length) return this;
        const r2 = [], n2 = /* @__PURE__ */ new Map();
        for (const t3 of s2) n2.set(t3, r2.length), r2.push(e2.createPropertyDef(t3));
        for (const t3 of this.document.getRoot().listMeshes()) {
          const s3 = e2.meshIndexMap.get(t3);
          t3.listPrimitives().forEach((t4, r3) => {
            const o2 = t4.getExtension(xt);
            if (!o2) return;
            const i2 = e2.jsonDoc.json.meshes[s3].primitives[r3], a2 = o2.listMappings().map((t5) => {
              const s4 = e2.createPropertyDef(t5), r4 = t5.getMaterial();
              return r4 && (s4.material = e2.materialIndexMap.get(r4)), s4.variants = t5.listVariants().map((e3) => n2.get(e3)), s4;
            });
            i2.extensions = i2.extensions || {}, i2.extensions[xt] = { mappings: a2 };
          });
        }
        return t2.json.extensions = t2.json.extensions || {}, t2.json.extensions[xt] = { variants: r2 }, this;
      }
    };
    gt.EXTENSION_NAME = xt;
    var { G: Tt } = e.TextureChannel;
    var dt = class extends e.ExtensionProperty {
      init() {
        this.extensionName = T, this.propertyType = "Volume", this.parentTypes = [e.PropertyType.MATERIAL];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { thicknessFactor: 0, thicknessTexture: null, thicknessTextureInfo: new e.TextureInfo(this.graph, "thicknessTexture"), attenuationDistance: Infinity, attenuationColor: [1, 1, 1] });
      }
      getThicknessFactor() {
        return this.get("thicknessFactor");
      }
      setThicknessFactor(e2) {
        return this.set("thicknessFactor", e2);
      }
      getThicknessTexture() {
        return this.getRef("thicknessTexture");
      }
      getThicknessTextureInfo() {
        return this.getRef("thicknessTexture") ? this.getRef("thicknessTextureInfo") : null;
      }
      setThicknessTexture(e2) {
        return this.setRef("thicknessTexture", e2, { channels: Tt });
      }
      getAttenuationDistance() {
        return this.get("attenuationDistance");
      }
      setAttenuationDistance(e2) {
        return this.set("attenuationDistance", e2);
      }
      getAttenuationColor() {
        return this.get("attenuationColor");
      }
      setAttenuationColor(e2) {
        return this.set("attenuationColor", e2);
      }
      getAttenuationColorHex() {
        return e.ColorUtils.factorToHex(this.getAttenuationColor());
      }
      setAttenuationColorHex(t2) {
        const s2 = this.getAttenuationColor().slice();
        return this.set("attenuationColor", e.ColorUtils.hexToFactor(t2, s2));
      }
    };
    dt.EXTENSION_NAME = T;
    var mt = T;
    var Et = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = mt;
      }
      createVolume() {
        return new dt(this.document.getGraph());
      }
      read(e2) {
        const t2 = e2.jsonDoc, s2 = t2.json.textures || [];
        return (t2.json.materials || []).forEach((t3, r2) => {
          if (t3.extensions && t3.extensions[mt]) {
            const n2 = this.createVolume();
            e2.materials[r2].setExtension(mt, n2);
            const o2 = t3.extensions[mt];
            if (void 0 !== o2.thicknessFactor && n2.setThicknessFactor(o2.thicknessFactor), void 0 !== o2.attenuationDistance && n2.setAttenuationDistance(o2.attenuationDistance), void 0 !== o2.attenuationColor && n2.setAttenuationColor(o2.attenuationColor), void 0 !== o2.thicknessTexture) {
              const t4 = o2.thicknessTexture;
              n2.setThicknessTexture(e2.textures[s2[t4.index].source]), e2.setTextureInfo(n2.getThicknessTextureInfo(), t4);
            }
          }
        }), this;
      }
      write(t2) {
        const s2 = t2.jsonDoc;
        return this.document.getRoot().listMaterials().forEach((r2) => {
          const n2 = r2.getExtension(mt);
          if (n2) {
            const o2 = t2.materialIndexMap.get(r2), i2 = s2.json.materials[o2];
            i2.extensions = i2.extensions || {};
            const a2 = i2.extensions[mt] = {};
            if (n2.getThicknessFactor() > 0 && (a2.thicknessFactor = n2.getThicknessFactor()), Number.isFinite(n2.getAttenuationDistance()) && (a2.attenuationDistance = n2.getAttenuationDistance()), e.MathUtils.eq(n2.getAttenuationColor(), [1, 1, 1]) || (a2.attenuationColor = n2.getAttenuationColor()), n2.getThicknessTexture()) {
              const e2 = n2.getThicknessTexture(), s3 = n2.getThicknessTextureInfo();
              a2.thicknessTexture = t2.createTextureInfoDef(e2, s3);
            }
          }
        }), this;
      }
    };
    Et.EXTENSION_NAME = mt;
    var yt = "KHR_mesh_quantization";
    var It = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = yt;
      }
      read(e2) {
        return this;
      }
      write(e2) {
        return this;
      }
    };
    It.EXTENSION_NAME = yt;
    var Rt = "KHR_texture_basisu";
    var Nt = class {
      match(e2) {
        return 171 === e2[0] && 75 === e2[1] && 84 === e2[2] && 88 === e2[3] && 32 === e2[4] && 50 === e2[5] && 48 === e2[6] && 187 === e2[7] && 13 === e2[8] && 10 === e2[9] && 26 === e2[10] && 10 === e2[11];
      }
      getSize(e2) {
        const s2 = t.read(e2);
        return [s2.pixelWidth, s2.pixelHeight];
      }
      getChannels(e2) {
        const s2 = t.read(e2).dataFormatDescriptor[0];
        if (s2.colorModel === t.KHR_DF_MODEL_ETC1S) return 2 === s2.samples.length && 15 == (15 & s2.samples[1].channelType) ? 4 : 3;
        if (s2.colorModel === t.KHR_DF_MODEL_UASTC) return 3 == (15 & s2.samples[0].channelType) ? 4 : 3;
        throw new Error(`Unexpected KTX2 colorModel, "${s2.colorModel}".`);
      }
      getVRAMByteLength(e2) {
        const s2 = t.read(e2), r2 = this.getChannels(e2) > 3;
        let n2 = 0;
        for (let e3 = 0; e3 < s2.levels.length; e3++) {
          const t2 = s2.levels[e3];
          n2 += t2.uncompressedByteLength ? t2.uncompressedByteLength : Math.max(1, Math.floor(s2.pixelWidth / Math.pow(2, e3))) / 4 * (Math.max(1, Math.floor(s2.pixelHeight / Math.pow(2, e3))) / 4) * (r2 ? 16 : 8);
        }
        return n2;
      }
    };
    var At = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = Rt, this.prereadTypes = [e.PropertyType.TEXTURE];
      }
      static register() {
        e.ImageUtils.registerFormat("image/ktx2", new Nt());
      }
      preread(e2) {
        return e2.jsonDoc.json.textures.forEach((e3) => {
          e3.extensions && e3.extensions[Rt] && (e3.source = e3.extensions[Rt].source);
        }), this;
      }
      read(e2) {
        return this;
      }
      write(e2) {
        const t2 = e2.jsonDoc;
        return this.document.getRoot().listTextures().forEach((s2) => {
          if ("image/ktx2" === s2.getMimeType()) {
            const r2 = e2.imageIndexMap.get(s2);
            t2.json.textures.forEach((e3) => {
              e3.source === r2 && (e3.extensions = e3.extensions || {}, e3.extensions[Rt] = { source: e3.source }, delete e3.source);
            });
          }
        }), this;
      }
    };
    At.EXTENSION_NAME = Rt;
    var St = class extends e.ExtensionProperty {
      init() {
        this.extensionName = m, this.propertyType = "Transform", this.parentTypes = [e.PropertyType.TEXTURE_INFO];
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { offset: [0, 0], rotation: 0, scale: [1, 1], texCoord: null });
      }
      getOffset() {
        return this.get("offset");
      }
      setOffset(e2) {
        return this.set("offset", e2);
      }
      getRotation() {
        return this.get("rotation");
      }
      setRotation(e2) {
        return this.set("rotation", e2);
      }
      getScale() {
        return this.get("scale");
      }
      setScale(e2) {
        return this.set("scale", e2);
      }
      getTexCoord() {
        return this.get("texCoord");
      }
      setTexCoord(e2) {
        return this.set("texCoord", e2);
      }
    };
    St.EXTENSION_NAME = m;
    var Ct = m;
    var Mt = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = Ct;
      }
      createTransform() {
        return new St(this.document.getGraph());
      }
      read(e2) {
        for (const [t2, s2] of Array.from(e2.textureInfos.entries())) {
          if (!s2.extensions || !s2.extensions[Ct]) continue;
          const e3 = this.createTransform(), r2 = s2.extensions[Ct];
          void 0 !== r2.offset && e3.setOffset(r2.offset), void 0 !== r2.rotation && e3.setRotation(r2.rotation), void 0 !== r2.scale && e3.setScale(r2.scale), void 0 !== r2.texCoord && e3.setTexCoord(r2.texCoord), t2.setExtension(Ct, e3);
        }
        return this;
      }
      write(t2) {
        const s2 = Array.from(t2.textureInfoDefMap.entries());
        for (const [t3, r2] of s2) {
          const s3 = t3.getExtension(Ct);
          if (!s3) continue;
          r2.extensions = r2.extensions || {};
          const n2 = {}, o2 = e.MathUtils.eq;
          o2(s3.getOffset(), [0, 0]) || (n2.offset = s3.getOffset()), 0 !== s3.getRotation() && (n2.rotation = s3.getRotation()), o2(s3.getScale(), [1, 1]) || (n2.scale = s3.getScale()), null != s3.getTexCoord() && (n2.texCoord = s3.getTexCoord()), r2.extensions[Ct] = n2;
        }
        return this;
      }
    };
    Mt.EXTENSION_NAME = Ct;
    var Ot = [e.PropertyType.ROOT, e.PropertyType.SCENE, e.PropertyType.NODE, e.PropertyType.MESH, e.PropertyType.MATERIAL, e.PropertyType.TEXTURE, e.PropertyType.ANIMATION];
    var _t = class extends e.ExtensionProperty {
      init() {
        this.extensionName = E, this.propertyType = "Packet", this.parentTypes = Ot;
      }
      getDefaults() {
        return Object.assign(super.getDefaults(), { context: {}, properties: {} });
      }
      getContext() {
        return this.get("context");
      }
      setContext(e2) {
        return this.set("context", { ...e2 });
      }
      listProperties() {
        return Object.keys(this.get("properties"));
      }
      getProperty(e2) {
        const t2 = this.get("properties");
        return e2 in t2 ? t2[e2] : null;
      }
      setProperty(e2, t2) {
        this._assertContext(e2);
        const s2 = { ...this.get("properties") };
        return t2 ? s2[e2] = t2 : delete s2[e2], this.set("properties", s2);
      }
      toJSONLD() {
        return { "@context": Dt(this.get("context")), ...Dt(this.get("properties")) };
      }
      fromJSONLD(e2) {
        const t2 = (e2 = Dt(e2))["@context"];
        return t2 && this.set("context", t2), delete e2["@context"], this.set("properties", e2);
      }
      _assertContext(e2) {
        if (!(e2.split(":")[0] in this.get("context"))) throw new Error(`${E}: Missing context for term, "${e2}".`);
      }
    };
    function Dt(e2) {
      return JSON.parse(JSON.stringify(e2));
    }
    _t.EXTENSION_NAME = E;
    var wt = E;
    var Ft = class extends e.Extension {
      constructor() {
        super(...arguments), this.extensionName = wt;
      }
      createPacket() {
        return new _t(this.document.getGraph());
      }
      listPackets() {
        return Array.from(this.properties);
      }
      read(e2) {
        var t2;
        const s2 = null == (t2 = e2.jsonDoc.json.extensions) ? void 0 : t2[wt];
        if (!s2 || !s2.packets) return this;
        const r2 = e2.jsonDoc.json, n2 = this.document.getRoot(), o2 = s2.packets.map((e3) => this.createPacket().fromJSONLD(e3)), i2 = [[r2.asset], r2.scenes, r2.nodes, r2.meshes, r2.materials, r2.images, r2.animations], a2 = [[n2], n2.listScenes(), n2.listNodes(), n2.listMeshes(), n2.listMaterials(), n2.listTextures(), n2.listAnimations()];
        for (let e3 = 0; e3 < i2.length; e3++) {
          const t3 = i2[e3] || [];
          for (let s3 = 0; s3 < t3.length; s3++) {
            const r3 = t3[s3];
            r3.extensions && r3.extensions[wt] && a2[e3][s3].setExtension(wt, o2[r3.extensions[wt].packet]);
          }
        }
        return this;
      }
      write(t2) {
        const { json: s2 } = t2.jsonDoc, r2 = [];
        for (const n2 of this.properties) {
          r2.push(n2.toJSONLD());
          for (const o2 of n2.listParents()) {
            let n3;
            switch (o2.propertyType) {
              case e.PropertyType.ROOT:
                n3 = s2.asset;
                break;
              case e.PropertyType.SCENE:
                n3 = s2.scenes[t2.sceneIndexMap.get(o2)];
                break;
              case e.PropertyType.NODE:
                n3 = s2.nodes[t2.nodeIndexMap.get(o2)];
                break;
              case e.PropertyType.MESH:
                n3 = s2.meshes[t2.meshIndexMap.get(o2)];
                break;
              case e.PropertyType.MATERIAL:
                n3 = s2.materials[t2.materialIndexMap.get(o2)];
                break;
              case e.PropertyType.TEXTURE:
                n3 = s2.images[t2.imageIndexMap.get(o2)];
                break;
              case e.PropertyType.ANIMATION:
                n3 = s2.animations[t2.animationIndexMap.get(o2)];
                break;
              default:
                n3 = null, this.document.getLogger().warn(`[${wt}]: Unsupported parent property, "${o2.propertyType}"`);
            }
            n3 && (n3.extensions = n3.extensions || {}, n3.extensions[wt] = { packet: r2.length - 1 });
          }
        }
        return r2.length > 0 && (s2.extensions = s2.extensions || {}, s2.extensions[wt] = { packets: r2 }), this;
      }
    };
    Ft.EXTENSION_NAME = wt;
    var bt = [ue, pe, Ee, Se, Oe, we, ve, He, rt, Ye, at, lt, gt, Et, It, At, Mt, Ft];
    var Pt = [N, B, G, K, ...bt];
    exports2.ALL_EXTENSIONS = Pt, exports2.Anisotropy = de, exports2.Clearcoat = Ne, exports2.EXTMeshGPUInstancing = N, exports2.EXTMeshoptCompression = B, exports2.EXTTextureAVIF = G, exports2.EXTTextureWebP = K, exports2.EmissiveStrength = Ce, exports2.INSTANCE_ATTRIBUTE = y, exports2.IOR = _e, exports2.InstancedMesh = I, exports2.Iridescence = Pe, exports2.KHRDracoMeshCompression = ue, exports2.KHRLightsPunctual = pe, exports2.KHRMaterialsAnisotropy = Ee, exports2.KHRMaterialsClearcoat = Se, exports2.KHRMaterialsEmissiveStrength = Oe, exports2.KHRMaterialsIOR = we, exports2.KHRMaterialsIridescence = ve, exports2.KHRMaterialsPBRSpecularGlossiness = He, exports2.KHRMaterialsSheen = Ye, exports2.KHRMaterialsSpecular = rt, exports2.KHRMaterialsTransmission = at, exports2.KHRMaterialsUnlit = lt, exports2.KHRMaterialsVariants = gt, exports2.KHRMaterialsVolume = Et, exports2.KHRMeshQuantization = It, exports2.KHRONOS_EXTENSIONS = bt, exports2.KHRTextureBasisu = At, exports2.KHRTextureTransform = Mt, exports2.KHRXMP = Ft, exports2.Light = he, exports2.Mapping = ht, exports2.MappingList = ft, exports2.PBRSpecularGlossiness = Ge, exports2.Packet = _t, exports2.Sheen = $e, exports2.Specular = tt, exports2.Transform = St, exports2.Transmission = ot, exports2.Unlit = ct, exports2.Variant = pt, exports2.Volume = dt;
  }
});

// node_modules/ndarray-lanczos/dist/ndarray-lanczos.cjs
var require_ndarray_lanczos = __commonJS({
  "node_modules/ndarray-lanczos/dist/ndarray-lanczos.cjs"(exports2) {
    function t(t2) {
      return t2 && "object" == typeof t2 && "default" in t2 ? t2 : { default: t2 };
    }
    var r;
    var a = /* @__PURE__ */ t(require_ndarray());
    var e = function(t2, r2) {
      if (t2 <= -r2 || t2 >= r2) return 0;
      if (t2 > -11920929e-14 && t2 < 11920929e-14) return 1;
      var a2 = t2 * Math.PI;
      return Math.sin(a2) / a2 * Math.sin(a2 / r2) / (a2 / r2);
    };
    var n = function(t2, r2, a2, n2, o2, u2, s, h) {
      for (var i = Math.pow(2, h) - 1, f = function(t3) {
        return Math.round(t3 * i);
      }, c = o2 ? 2 : 3, p = 1 / a2, l = Math.min(1, a2), d = c / l, v = new s((Math.floor(2 * (d + 1)) + 2) * r2), M = 0, y = 0; y < r2; y++) {
        for (var _ = (y + 0.5) * p + n2, w = Math.max(0, Math.floor(_ - d)), A = Math.min(t2 - 1, Math.ceil(_ + d)), E = A - w + 1, g = new u2(E), L = new s(E), N = 0, S = 0, C = w; C <= A; C++) {
          var O = e((C + 0.5 - _) * l, c);
          N += O, g[S] = O, S++;
        }
        for (var Z = 0, m = 0; m < g.length; m++) {
          var T = g[m] / N;
          Z += T, L[m] = f(T);
        }
        L[r2 >> 1] += f(1 - Z);
        for (var b = 0; b < L.length && 0 === L[b]; ) b++;
        for (var x = L.length - 1; x > 0 && 0 === L[x]; ) x--;
        var I = x - b + 1;
        v[M++] = w + b, v[M++] = I, v.set(L.subarray(b, x + 1), M), M += I;
      }
      return v;
    };
    var o = function(t2, r2, a2, e2) {
      for (var n2 = t2.shape[1], o2 = r2.shape[0], u2 = Math.pow(2, 8 * r2.data.BYTES_PER_ELEMENT) - 1, s = function(t3) {
        return t3 < 0 ? 0 : t3 > u2 ? u2 : t3;
      }, h = Math.pow(2, e2 - 1), i = 2 * h, f = 0; f < n2; f++) for (var c = f, p = 0, l = 0; l < o2; l++) {
        for (var d = a2[p++], v = 0, M = 0, y = 0, _ = 0, w = a2[p++]; w > 0; w--) {
          var A = a2[p++];
          v += A * t2.get(d, f, 0), M += A * t2.get(d, f, 1), y += A * t2.get(d, f, 2), _ += A * t2.get(d, f, 3), d++;
        }
        r2.set(l, c, 0, s((v + h) / i)), r2.set(l, c, 1, s((M + h) / i)), r2.set(l, c, 2, s((y + h) / i)), r2.set(l, c, 3, s((_ + h) / i));
      }
    };
    function u(t2, e2, u2) {
      if (3 !== t2.shape.length || 3 !== e2.shape.length) throw new TypeError("Input and output must have exactly 3 dimensions (width, height and colorspace)");
      var s, h, i = t2.shape, f = i[0], c = i[1], p = e2.shape, l = p[0], d = p[1], v = l / f, M = d / c;
      switch (e2.dtype) {
        case "uint8_clamped":
        case "uint8":
          s = Float32Array, h = Int16Array;
          break;
        case "uint16":
        case "uint32":
          s = Float64Array, h = Int32Array;
          break;
        default:
          throw TypeError("Unsupported data type " + e2.dtype);
      }
      var y = 7 * h.BYTES_PER_ELEMENT, _ = n(f, l, v, 0, u2 === r.LANCZOS_2, s, h, y), w = n(c, d, M, 0, u2 === r.LANCZOS_2, s, h, y), A = a.default(new (0, e2.data.constructor)(l * c * 4), [c, l, 4]), E = A.transpose(1, 0), g = e2.transpose(1, 0);
      o(t2, E, _, y), o(A, g, w, y);
    }
    !(function(t2) {
      t2[t2.LANCZOS_3 = 3] = "LANCZOS_3", t2[t2.LANCZOS_2 = 2] = "LANCZOS_2";
    })(r || (r = {})), exports2.lanczos2 = function(t2, a2) {
      u(t2, a2, r.LANCZOS_2);
    }, exports2.lanczos3 = function(t2, a2) {
      u(t2, a2, r.LANCZOS_3);
    };
  }
});

// node_modules/@gltf-transform/functions/dist/functions.cjs
var require_functions = __commonJS({
  "node_modules/@gltf-transform/functions/dist/functions.cjs"(exports2) {
    var e = require_core();
    var t = require_ndarray_pixels_node();
    var r = require_extensions();
    var n = require_ktx_parse();
    var o = require_ndarray();
    var s = require_ndarray_lanczos();
    function i(e2) {
      return e2 && "object" == typeof e2 && "default" in e2 ? e2 : { default: e2 };
    }
    var a = /* @__PURE__ */ i(o);
    var c = function(e2, r2, n2) {
      try {
        if (!e2) return Promise.resolve(null);
        const o2 = e2.getImage();
        return o2 ? Promise.resolve(t.getPixels(o2, e2.getMimeType())).then(function(e3) {
          for (let t2 = 0; t2 < e3.shape[0]; ++t2) for (let r3 = 0; r3 < e3.shape[1]; ++r3) n2(e3, t2, r3);
          return Promise.resolve(t.savePixels(e3, "image/png")).then(function(e4) {
            return r2.setImage(e4).setMimeType("image/png");
          });
        }) : Promise.resolve(null);
      } catch (e3) {
        return Promise.reject(e3);
      }
    };
    function l(e2, t2) {
      return Object.defineProperty(t2, "name", { value: e2 }), t2;
    }
    function u(e2, t2, r2) {
      return !!e2 && e2.stack.lastIndexOf(t2) < e2.stack.lastIndexOf(r2);
    }
    function f(t2) {
      const r2 = t2.getIndices(), n2 = t2.getAttribute("POSITION");
      switch (t2.getMode()) {
        case e.Primitive.Mode.POINTS:
          return n2.getCount();
        case e.Primitive.Mode.LINES:
          return r2 ? r2.getCount() / 2 : n2.getCount() / 2;
        case e.Primitive.Mode.LINE_LOOP:
          return n2.getCount();
        case e.Primitive.Mode.LINE_STRIP:
          return n2.getCount() - 1;
        case e.Primitive.Mode.TRIANGLES:
          return r2 ? r2.getCount() / 3 : n2.getCount() / 3;
        case e.Primitive.Mode.TRIANGLE_STRIP:
        case e.Primitive.Mode.TRIANGLE_FAN:
          return n2.getCount() - 2;
        default:
          throw new Error("Unexpected mode: " + t2.getMode());
      }
    }
    var g = class {
      constructor() {
        this._map = /* @__PURE__ */ new Map();
      }
      get size() {
        return this._map.size;
      }
      has(e2) {
        return this._map.has(e2);
      }
      add(e2, t2) {
        let r2 = this._map.get(e2);
        return r2 || (r2 = /* @__PURE__ */ new Set(), this._map.set(e2, r2)), r2.add(t2), this;
      }
      get(e2) {
        return this._map.get(e2) || /* @__PURE__ */ new Set();
      }
      keys() {
        return this._map.keys();
      }
    };
    function p(e2, t2) {
      if (void 0 === t2 && (t2 = 2), 0 === e2) return "0 Bytes";
      const r2 = t2 < 0 ? 0 : t2, n2 = Math.floor(Math.log(e2) / Math.log(1e3));
      return parseFloat((e2 / Math.pow(1e3, n2)).toFixed(r2)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][n2];
    }
    function m(e2) {
      return e2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function h(e2, t2) {
      return `${m(e2)} \u2192 ${m(t2)} (${(function(e3, t3, r2) {
        return void 0 === r2 && (r2 = 2), (e3 > t3 ? "\u2013" : "+") + (Math.abs(e3 - t3) / e3 * 100).toFixed(r2) + "%";
      })(e2, t2)})`;
    }
    function d(e2) {
      const t2 = [];
      for (const r2 of e2.listAttributes()) t2.push(r2);
      for (const r2 of e2.listTargets()) for (const e3 of r2.listAttributes()) t2.push(e3);
      return Array.from(new Set(t2));
    }
    function y(e2, t2, r2) {
      e2.swap(t2, r2);
      for (const n2 of e2.listTargets()) n2.swap(t2, r2);
    }
    function T(e2, t2) {
      if (null == e2 && null == t2) return true;
      if (null == e2 || null == t2) return false;
      if (e2.length !== t2.length) return false;
      for (let r2 = 0; r2 < e2.length; r2++) if (e2[r2] !== t2[r2]) return false;
      return true;
    }
    function A(e2, t2, r2) {
      const n2 = e2.getElementSize(), o2 = e2.getCount(), s2 = e2.getArray(), i2 = s2.slice(0, r2 * n2);
      for (let e3 = 0; e3 < o2; e3++) for (let r3 = 0; r3 < n2; r3++) i2[t2[e3] * n2 + r3] = s2[e3 * n2 + r3];
      e2.setArray(i2);
    }
    function E(e2, t2) {
      void 0 === t2 && (t2 = e2);
      const r2 = t2 <= 65534 ? new Uint16Array(e2) : new Uint32Array(e2);
      for (let e3 = 0; e3 < r2.length; e3++) r2[e3] = e3;
      return r2;
    }
    function S(t2) {
      const r2 = e.Document.fromGraph(t2.getGraph()), n2 = t2.getMaterial();
      return `${r2.getRoot().listMaterials().indexOf(n2)}|${t2.getMode()}|${!!t2.getIndices()}|${t2.listSemantics().sort().map((e2) => {
        const r3 = t2.getAttribute(e2);
        return `${e2}:${r3.getElementSize()}:${r3.getComponentType()}`;
      }).join("+")}|${t2.listTargets().map((e2) => e2.listSemantics().sort().map((e3) => {
        const r3 = t2.getAttribute(e3);
        return `${e3}:${r3.getElementSize()}:${r3.getComponentType()}`;
      }).join("+")).join("~")}`;
    }
    function P(e2, t2) {
      const [r2, n2] = t2, [o2, s2] = e2;
      if (o2 <= r2 && s2 <= n2) return e2;
      let i2 = o2, a2 = s2;
      return i2 > r2 && (a2 = Math.floor(a2 * (r2 / i2)), i2 = r2), a2 > n2 && (i2 = Math.floor(i2 * (n2 / a2)), a2 = n2), [i2, a2];
    }
    var M = "center";
    var I = { pivot: "center" };
    function v(t2) {
      const r2 = /* @__PURE__ */ new Set();
      let n2, o2 = t2;
      for (; n2 = o2.getParentNode(); ) {
        if (r2.has(n2)) throw new Error("Circular dependency in scene graph.");
        r2.add(n2), o2 = n2;
      }
      return o2.listParents().filter((t3) => t3 instanceof e.Scene);
    }
    function b(e2) {
      const t2 = v(e2), r2 = e2.getParentNode();
      if (!r2) return e2;
      e2.setMatrix(e2.getWorldMatrix()), r2.removeChild(e2);
      for (const r3 of t2) r3.addChild(e2);
      return e2;
    }
    var N = "undefined" != typeof Float32Array ? Float32Array : Array;
    function x(e2, t2) {
      var r2 = t2[0], n2 = t2[1], o2 = t2[2], s2 = t2[3], i2 = t2[4], a2 = t2[5], c2 = t2[6], l2 = t2[7], u2 = t2[8], f2 = t2[9], g2 = t2[10], p2 = t2[11], m2 = t2[12], h2 = t2[13], d2 = t2[14], y2 = t2[15], T2 = r2 * a2 - n2 * i2, A2 = r2 * c2 - o2 * i2, E2 = r2 * l2 - s2 * i2, S2 = n2 * c2 - o2 * a2, P2 = n2 * l2 - s2 * a2, M2 = o2 * l2 - s2 * c2, I2 = u2 * h2 - f2 * m2, v2 = u2 * d2 - g2 * m2, b2 = u2 * y2 - p2 * m2, N2 = f2 * d2 - g2 * h2, x2 = f2 * y2 - p2 * h2, R2 = g2 * y2 - p2 * d2, C2 = T2 * R2 - A2 * x2 + E2 * N2 + S2 * b2 - P2 * v2 + M2 * I2;
      return C2 ? (e2[0] = (a2 * R2 - c2 * x2 + l2 * N2) * (C2 = 1 / C2), e2[1] = (o2 * x2 - n2 * R2 - s2 * N2) * C2, e2[2] = (h2 * M2 - d2 * P2 + y2 * S2) * C2, e2[3] = (g2 * P2 - f2 * M2 - p2 * S2) * C2, e2[4] = (c2 * b2 - i2 * R2 - l2 * v2) * C2, e2[5] = (r2 * R2 - o2 * b2 + s2 * v2) * C2, e2[6] = (d2 * E2 - m2 * M2 - y2 * A2) * C2, e2[7] = (u2 * M2 - g2 * E2 + p2 * A2) * C2, e2[8] = (i2 * x2 - a2 * b2 + l2 * I2) * C2, e2[9] = (n2 * b2 - r2 * x2 - s2 * I2) * C2, e2[10] = (m2 * P2 - h2 * E2 + y2 * T2) * C2, e2[11] = (f2 * E2 - u2 * P2 - p2 * T2) * C2, e2[12] = (a2 * v2 - i2 * N2 - c2 * I2) * C2, e2[13] = (r2 * N2 - n2 * v2 + o2 * I2) * C2, e2[14] = (h2 * A2 - m2 * S2 - d2 * T2) * C2, e2[15] = (u2 * S2 - f2 * A2 + g2 * T2) * C2, e2) : null;
    }
    function R(e2, t2, r2) {
      var n2 = t2[0], o2 = t2[1], s2 = t2[2], i2 = t2[3], a2 = t2[4], c2 = t2[5], l2 = t2[6], u2 = t2[7], f2 = t2[8], g2 = t2[9], p2 = t2[10], m2 = t2[11], h2 = t2[12], d2 = t2[13], y2 = t2[14], T2 = t2[15], A2 = r2[0], E2 = r2[1], S2 = r2[2], P2 = r2[3];
      return e2[0] = A2 * n2 + E2 * a2 + S2 * f2 + P2 * h2, e2[1] = A2 * o2 + E2 * c2 + S2 * g2 + P2 * d2, e2[2] = A2 * s2 + E2 * l2 + S2 * p2 + P2 * y2, e2[3] = A2 * i2 + E2 * u2 + S2 * m2 + P2 * T2, e2[4] = (A2 = r2[4]) * n2 + (E2 = r2[5]) * a2 + (S2 = r2[6]) * f2 + (P2 = r2[7]) * h2, e2[5] = A2 * o2 + E2 * c2 + S2 * g2 + P2 * d2, e2[6] = A2 * s2 + E2 * l2 + S2 * p2 + P2 * y2, e2[7] = A2 * i2 + E2 * u2 + S2 * m2 + P2 * T2, e2[8] = (A2 = r2[8]) * n2 + (E2 = r2[9]) * a2 + (S2 = r2[10]) * f2 + (P2 = r2[11]) * h2, e2[9] = A2 * o2 + E2 * c2 + S2 * g2 + P2 * d2, e2[10] = A2 * s2 + E2 * l2 + S2 * p2 + P2 * y2, e2[11] = A2 * i2 + E2 * u2 + S2 * m2 + P2 * T2, e2[12] = (A2 = r2[12]) * n2 + (E2 = r2[13]) * a2 + (S2 = r2[14]) * f2 + (P2 = r2[15]) * h2, e2[13] = A2 * o2 + E2 * c2 + S2 * g2 + P2 * d2, e2[14] = A2 * s2 + E2 * l2 + S2 * p2 + P2 * y2, e2[15] = A2 * i2 + E2 * u2 + S2 * m2 + P2 * T2, e2;
    }
    function C() {
      var e2 = new N(3);
      return N != Float32Array && (e2[0] = 0, e2[1] = 0, e2[2] = 0), e2;
    }
    function w(e2, t2, r2) {
      return e2[0] = Math.min(t2[0], r2[0]), e2[1] = Math.min(t2[1], r2[1]), e2[2] = Math.min(t2[2], r2[2]), e2;
    }
    function O(e2, t2, r2) {
      return e2[0] = Math.max(t2[0], r2[0]), e2[1] = Math.max(t2[1], r2[1]), e2[2] = Math.max(t2[2], r2[2]), e2;
    }
    function $(e2, t2, r2) {
      return e2[0] = t2[0] * r2, e2[1] = t2[1] * r2, e2[2] = t2[2] * r2, e2;
    }
    function L(e2, t2) {
      var r2 = t2[0], n2 = t2[1], o2 = t2[2], s2 = r2 * r2 + n2 * n2 + o2 * o2;
      return s2 > 0 && (s2 = 1 / Math.sqrt(s2)), e2[0] = t2[0] * s2, e2[1] = t2[1] * s2, e2[2] = t2[2] * s2, e2;
    }
    function z(e2, t2, r2) {
      var n2 = t2[0], o2 = t2[1], s2 = t2[2], i2 = r2[3] * n2 + r2[7] * o2 + r2[11] * s2 + r2[15];
      return e2[0] = (r2[0] * n2 + r2[4] * o2 + r2[8] * s2 + r2[12]) / (i2 = i2 || 1), e2[1] = (r2[1] * n2 + r2[5] * o2 + r2[9] * s2 + r2[13]) / i2, e2[2] = (r2[2] * n2 + r2[6] * o2 + r2[10] * s2 + r2[14]) / i2, e2;
    }
    function F(e2, t2, r2) {
      var n2 = t2[0], o2 = t2[1], s2 = t2[2];
      return e2[0] = n2 * r2[0] + o2 * r2[3] + s2 * r2[6], e2[1] = n2 * r2[1] + o2 * r2[4] + s2 * r2[7], e2[2] = n2 * r2[2] + o2 * r2[5] + s2 * r2[8], e2;
    }
    function U() {
      var e2 = new N(4);
      return N != Float32Array && (e2[0] = 0, e2[1] = 0, e2[2] = 0, e2[3] = 0), e2;
    }
    Math.hypot || (Math.hypot = function() {
      for (var e2 = 0, t2 = arguments.length; t2--; ) e2 += arguments[t2] * arguments[t2];
      return Math.sqrt(e2);
    }), C();
    var _ = function(e2, t2, r2) {
      return e2[0] = t2[0] - r2[0], e2[1] = t2[1] - r2[1], e2[2] = t2[2] - r2[2], e2[3] = t2[3] - r2[3], e2;
    };
    var k = function(e2) {
      return Math.hypot(e2[0], e2[1], e2[2], e2[3]);
    };
    U();
    var G = "dedup";
    var q = { keepUniqueNames: false, propertyTypes: [e.PropertyType.ACCESSOR, e.PropertyType.MESH, e.PropertyType.TEXTURE, e.PropertyType.MATERIAL, e.PropertyType.SKIN] };
    function B(t2) {
      void 0 === t2 && (t2 = q);
      const r2 = { ...q, ...t2 }, n2 = new Set(r2.propertyTypes);
      for (const e2 of r2.propertyTypes) if (!q.propertyTypes.includes(e2)) throw new Error(`${G}: Unsupported deduplication on type "${e2}".`);
      return l(G, (t3) => {
        const o2 = t3.getLogger();
        n2.has(e.PropertyType.ACCESSOR) && (function(t4) {
          const r3 = t4.getLogger(), n3 = /* @__PURE__ */ new Map(), o3 = /* @__PURE__ */ new Map(), s2 = /* @__PURE__ */ new Map(), i2 = /* @__PURE__ */ new Map(), a2 = t4.getRoot().listMeshes();
          a2.forEach((e2) => {
            e2.listPrimitives().forEach((e3) => {
              e3.listAttributes().forEach((e4) => c2(e4, o3)), c2(e3.getIndices(), n3);
            });
          });
          for (const e2 of t4.getRoot().listAnimations()) for (const t5 of e2.listSamplers()) c2(t5.getInput(), s2), c2(t5.getOutput(), i2);
          function c2(e2, t5) {
            if (!e2) return;
            const r4 = [e2.getCount(), e2.getType(), e2.getComponentType(), e2.getNormalized(), e2.getSparse()].join(":");
            let n4 = t5.get(r4);
            n4 || t5.set(r4, n4 = /* @__PURE__ */ new Set()), n4.add(e2);
          }
          function l2(t5, r4) {
            for (let n4 = 0; n4 < t5.length; n4++) {
              const o4 = t5[n4], s3 = e.BufferUtils.toView(o4.getArray());
              if (!r4.has(o4)) for (let i3 = n4 + 1; i3 < t5.length; i3++) {
                const n5 = t5[i3];
                r4.has(n5) || e.BufferUtils.equals(s3, e.BufferUtils.toView(n5.getArray())) && r4.set(n5, o4);
              }
            }
          }
          let u2 = 0;
          const f2 = /* @__PURE__ */ new Map();
          for (const e2 of [o3, n3, s2, i2]) for (const t5 of e2.values()) u2 += t5.size, l2(Array.from(t5), f2);
          r3.debug(`${G}: Merged ${f2.size} of ${u2} accessors.`), a2.forEach((e2) => {
            e2.listPrimitives().forEach((e3) => {
              e3.listAttributes().forEach((t6) => {
                f2.has(t6) && e3.swap(t6, f2.get(t6));
              });
              const t5 = e3.getIndices();
              t5 && f2.has(t5) && e3.swap(t5, f2.get(t5));
            });
          });
          for (const e2 of t4.getRoot().listAnimations()) for (const t5 of e2.listSamplers()) {
            const e3 = t5.getInput(), r4 = t5.getOutput();
            e3 && f2.has(e3) && t5.swap(e3, f2.get(e3)), r4 && f2.has(r4) && t5.swap(r4, f2.get(r4));
          }
          Array.from(f2.keys()).forEach((e2) => e2.dispose());
        })(t3), n2.has(e.PropertyType.TEXTURE) && (function(t4, r3) {
          const n3 = t4.getLogger(), o3 = t4.getRoot(), s2 = o3.listTextures(), i2 = /* @__PURE__ */ new Map();
          for (let t5 = 0; t5 < s2.length; t5++) {
            const n4 = s2[t5], o4 = n4.getImage();
            if (!i2.has(n4)) for (let a2 = t5 + 1; a2 < s2.length; a2++) {
              const t6 = s2[a2], c2 = t6.getImage();
              if (i2.has(t6)) continue;
              if (n4.getMimeType() !== t6.getMimeType()) continue;
              if (r3.keepUniqueNames && n4.getName() !== t6.getName()) continue;
              const l2 = n4.getSize(), u2 = t6.getSize();
              l2 && u2 && l2[0] === u2[0] && l2[1] === u2[1] && o4 && c2 && e.BufferUtils.equals(o4, c2) && i2.set(t6, n4);
            }
          }
          n3.debug(`${G}: Merged ${i2.size} of ${o3.listTextures().length} textures.`), Array.from(i2.entries()).forEach((t5) => {
            let [r4, n4] = t5;
            r4.listParents().forEach((t6) => {
              t6 instanceof e.Root || t6.swap(r4, n4);
            }), r4.dispose();
          });
        })(t3, r2), n2.has(e.PropertyType.MATERIAL) && (function(t4, r3) {
          const n3 = t4.getLogger(), o3 = t4.getRoot().listMaterials(), s2 = /* @__PURE__ */ new Map(), i2 = /* @__PURE__ */ new Map(), a2 = /* @__PURE__ */ new Set();
          r3.keepUniqueNames || a2.add("name");
          for (let e2 = 0; e2 < o3.length; e2++) {
            const t5 = o3[e2];
            if (!s2.has(t5) && !j(t5, i2)) for (let r4 = e2 + 1; r4 < o3.length; r4++) {
              const e3 = o3[r4];
              s2.has(e3) || j(e3, i2) || t5.equals(e3, a2) && s2.set(e3, t5);
            }
          }
          n3.debug(`${G}: Merged ${s2.size} of ${o3.length} materials.`), Array.from(s2.entries()).forEach((t5) => {
            let [r4, n4] = t5;
            r4.listParents().forEach((t6) => {
              t6 instanceof e.Root || t6.swap(r4, n4);
            }), r4.dispose();
          });
        })(t3, r2), n2.has(e.PropertyType.MESH) && (function(t4, r3) {
          const n3 = t4.getLogger(), o3 = t4.getRoot(), s2 = /* @__PURE__ */ new Map();
          o3.listAccessors().forEach((e2, t5) => s2.set(e2, t5)), o3.listMaterials().forEach((e2, t5) => s2.set(e2, t5));
          const i2 = o3.listMeshes().length, a2 = /* @__PURE__ */ new Map();
          for (const t5 of o3.listMeshes()) {
            const n4 = [];
            for (const e2 of t5.listPrimitives()) n4.push(D(e2, s2));
            let o4 = "";
            if (r3.keepUniqueNames && (o4 += t5.getName() + ";"), o4 += n4.join(";"), a2.has(o4)) {
              const r4 = a2.get(o4);
              t5.listParents().forEach((n5) => {
                n5.propertyType !== e.PropertyType.ROOT && n5.swap(t5, r4);
              }), t5.dispose();
            } else a2.set(o4, t5);
          }
          n3.debug(`${G}: Merged ${i2 - a2.size} of ${i2} meshes.`);
        })(t3, r2), n2.has(e.PropertyType.SKIN) && (function(t4, r3) {
          const n3 = t4.getLogger(), o3 = t4.getRoot().listSkins(), s2 = /* @__PURE__ */ new Map(), i2 = /* @__PURE__ */ new Set(["joints"]);
          r3.keepUniqueNames || i2.add("name");
          for (let e2 = 0; e2 < o3.length; e2++) {
            const t5 = o3[e2];
            if (!s2.has(t5)) for (let r4 = e2 + 1; r4 < o3.length; r4++) {
              const e3 = o3[r4];
              s2.has(e3) || t5.equals(e3, i2) && T(t5.listJoints(), e3.listJoints()) && s2.set(e3, t5);
            }
          }
          n3.debug(`${G}: Merged ${s2.size} of ${o3.length} skins.`), Array.from(s2.entries()).forEach((t5) => {
            let [r4, n4] = t5;
            r4.listParents().forEach((t6) => {
              t6 instanceof e.Root || t6.swap(r4, n4);
            }), r4.dispose();
          });
        })(t3, r2), o2.debug(`${G}: Complete.`);
      });
    }
    function D(t2, r2) {
      const n2 = [];
      for (const e2 of t2.listSemantics()) {
        const o2 = t2.getAttribute(e2);
        n2.push(e2 + ":" + r2.get(o2));
      }
      if (t2 instanceof e.Primitive) {
        const e2 = t2.getIndices();
        e2 && n2.push("indices:" + r2.get(e2));
        const o2 = t2.getMaterial();
        o2 && n2.push("material:" + r2.get(o2)), n2.push("mode:" + t2.getMode());
        for (const e3 of t2.listTargets()) n2.push("target:" + D(e3, r2));
      }
      return n2.join(",");
    }
    function j(e2, t2) {
      if (t2.has(e2)) return t2.get(e2);
      const r2 = e2.getGraph(), n2 = /* @__PURE__ */ new Set(), o2 = r2.listParentEdges(e2);
      for (; o2.length > 0; ) {
        const s2 = o2.pop();
        if (true === s2.getAttributes().modifyChild) return t2.set(e2, true), true;
        const i2 = s2.getChild();
        if (!n2.has(i2)) for (const e3 of r2.listChildEdges(i2)) o2.push(e3);
      }
      return t2.set(e2, false), false;
    }
    var H = /color|emissive|diffuse/i;
    function W(e2) {
      return e2.getGraph().listParentEdges(e2).some((e3) => e3.getAttributes().isColor || H.test(e3.getName())) ? "srgb" : null;
    }
    function X(t2) {
      const r2 = t2.getGraph(), n2 = /* @__PURE__ */ new Set(), o2 = /* @__PURE__ */ new Set();
      return (function t3(s2) {
        const i2 = /* @__PURE__ */ new Set();
        for (const t4 of r2.listChildEdges(s2)) t4.getChild() instanceof e.Texture && i2.add(t4.getName() + "Info");
        for (const a2 of r2.listChildEdges(s2)) {
          const r3 = a2.getChild();
          n2.has(r3) || (n2.add(r3), r3 instanceof e.TextureInfo && i2.has(a2.getName()) ? o2.add(r3) : r3 instanceof e.ExtensionProperty && t3(r3));
        }
      })(t2), Array.from(o2);
    }
    function K(t2) {
      const r2 = e.Document.fromGraph(t2.getGraph()).getRoot(), n2 = t2.getGraph().listParentEdges(t2).filter((e2) => e2.getParent() !== r2).map((e2) => e2.getName());
      return Array.from(new Set(n2));
    }
    var V = function(r2, n2) {
      try {
        const o2 = r2.getRoot(), s2 = r2.getGraph(), i2 = r2.getLogger(), a2 = o2.listTextures().map(function(r3) {
          return Promise.resolve((function(e2) {
            return Promise.resolve((function(e3) {
              return Promise.resolve((function(r4, n3) {
                try {
                  var o3 = Promise.resolve(t.getPixels(e3.getImage(), e3.getMimeType()));
                } catch (e4) {
                  return null;
                }
                return o3 && o3.then ? o3.then(void 0, function() {
                  return null;
                }) : o3;
              })());
            })(e2)).then(function(e3) {
              if (!e3) return null;
              const t2 = [Infinity, Infinity, Infinity, Infinity], r4 = [-Infinity, -Infinity, -Infinity, -Infinity], n3 = [0, 0, 0, 0], [o3, s3] = e3.shape;
              for (let i4 = 0; i4 < o3; i4++) {
                for (let n4 = 0; n4 < s3; n4++) for (let o4 = 0; o4 < 4; o4++) t2[o4] = Math.min(t2[o4], e3.get(i4, n4, o4)), r4[o4] = Math.max(r4[o4], e3.get(i4, n4, o4));
                if (k(_(n3, r4, t2)) / 255 > Z) return null;
              }
              return (function(e4, t3, r5) {
                return e4[0] = t3[0] * r5, e4[1] = t3[1] * r5, e4[2] = t3[2] * r5, e4[3] = t3[3] * r5, e4;
              })(n3, ((i3 = n3)[0] = (a3 = r4)[0] + (c2 = t2)[0], i3[1] = a3[1] + c2[1], i3[2] = a3[2] + c2[2], i3[3] = a3[3] + c2[3], i3), 0.5 / 255);
              var i3, a3, c2;
            });
          })(r3)).then(function(t2) {
            var a3;
            if (!t2) return;
            "srgb" === W(r3) && e.ColorUtils.convertSRGBToLinear(t2, t2);
            const c2 = r3.getName() || r3.getURI(), l2 = null == (a3 = r3.getSize()) ? void 0 : a3.join("x"), u2 = K(r3);
            for (const e2 of s2.listParentEdges(r3)) {
              const r4 = e2.getParent();
              r4 !== o2 && le(r4, t2, e2.getName(), i2) && e2.dispose();
            }
            1 === r3.listParents().length && (n2.dispose(r3), i2.debug(`${J}: Removed solid-color texture "${c2}" (${l2}px ${u2.join(", ")})`));
          });
        });
        return Promise.resolve(Promise.all(a2)).then(function() {
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var J = "prune";
    var Z = 3 / 255;
    var Q = { propertyTypes: [e.PropertyType.NODE, e.PropertyType.SKIN, e.PropertyType.MESH, e.PropertyType.CAMERA, e.PropertyType.PRIMITIVE, e.PropertyType.PRIMITIVE_TARGET, e.PropertyType.ANIMATION, e.PropertyType.MATERIAL, e.PropertyType.TEXTURE, e.PropertyType.ACCESSOR, e.PropertyType.BUFFER], keepLeaves: false, keepAttributes: true, keepIndices: true, keepSolidTextures: true };
    function Y(t2) {
      void 0 === t2 && (t2 = Q);
      const r2 = { ...Q, ...t2 }, n2 = new Set(r2.propertyTypes);
      return l(J, function(t3) {
        try {
          let o3 = function() {
            if (n2.has(e.PropertyType.ACCESSOR) && i2.listAccessors().forEach((e2) => te(e2, c2)), n2.has(e.PropertyType.BUFFER) && i2.listBuffers().forEach((e2) => te(e2, c2)), c2.empty()) s2.info(`${J}: No unused properties found.`);
            else {
              const e2 = c2.entries().map((e3) => {
                let [t4, r3] = e3;
                return `${t4} (${r3})`;
              }).join(", ");
              s2.info(`${J}: Removed types... ${e2}`);
            }
            s2.debug(`${J}: Complete.`);
          };
          var o2 = o3;
          const s2 = t3.getLogger(), i2 = t3.getRoot(), a2 = t3.getGraph(), c2 = new ee();
          if (n2.has(e.PropertyType.MESH)) for (const u2 of i2.listMeshes()) u2.listPrimitives().length > 0 || c2.dispose(u2);
          if (n2.has(e.PropertyType.NODE)) {
            if (!r2.keepLeaves) for (const f2 of i2.listScenes()) ne(a2, f2, c2);
            for (const g2 of i2.listNodes()) te(g2, c2);
          }
          if (n2.has(e.PropertyType.SKIN)) for (const p2 of i2.listSkins()) te(p2, c2);
          if (n2.has(e.PropertyType.MESH)) for (const m2 of i2.listMeshes()) te(m2, c2);
          if (n2.has(e.PropertyType.CAMERA)) for (const h2 of i2.listCameras()) te(h2, c2);
          if (n2.has(e.PropertyType.PRIMITIVE) && re(a2, e.PropertyType.PRIMITIVE, c2), n2.has(e.PropertyType.PRIMITIVE_TARGET) && re(a2, e.PropertyType.PRIMITIVE_TARGET, c2), !r2.keepAttributes && n2.has(e.PropertyType.ACCESSOR)) {
            const d2 = /* @__PURE__ */ new Map();
            for (const y2 of i2.listMeshes()) for (const T2 of y2.listPrimitives()) {
              const A2 = T2.getMaterial(), E2 = ie(T2, ae(t3, A2));
              oe(T2, E2), T2.listTargets().forEach((e2) => oe(e2, E2)), A2 && (d2.has(A2) ? d2.get(A2).add(T2) : d2.set(A2, /* @__PURE__ */ new Set([T2])));
            }
            for (const [S2, P2] of d2) ce(S2, Array.from(P2));
          }
          if (!r2.keepIndices && n2.has(e.PropertyType.ACCESSOR)) for (const M2 of i2.listMeshes()) for (const I2 of M2.listPrimitives()) se(I2);
          if (n2.has(e.PropertyType.ANIMATION)) for (const v2 of i2.listAnimations()) {
            for (const b2 of v2.listChannels()) b2.getTargetNode() || c2.dispose(b2);
            if (v2.listChannels().length) v2.listSamplers().forEach((e2) => te(e2, c2));
            else {
              const N2 = v2.listSamplers();
              te(v2, c2), N2.forEach((e2) => te(e2, c2));
            }
          }
          n2.has(e.PropertyType.MATERIAL) && i2.listMaterials().forEach((e2) => te(e2, c2));
          const l2 = (function() {
            if (n2.has(e.PropertyType.TEXTURE)) {
              i2.listTextures().forEach((e3) => te(e3, c2));
              const e2 = (function() {
                if (!r2.keepSolidTextures) return Promise.resolve(V(t3, c2)).then(function() {
                });
              })();
              if (e2 && e2.then) return e2.then(function() {
              });
            }
          })();
          return Promise.resolve(l2 && l2.then ? l2.then(o3) : o3());
        } catch (x2) {
          return Promise.reject(x2);
        }
      });
    }
    var ee = class {
      constructor() {
        this.disposed = {};
      }
      empty() {
        for (const e2 in this.disposed) return false;
        return true;
      }
      entries() {
        return Object.entries(this.disposed);
      }
      dispose(e2) {
        this.disposed[e2.propertyType] = this.disposed[e2.propertyType] || 0, this.disposed[e2.propertyType]++, e2.dispose();
      }
    };
    function te(t2, r2) {
      t2.listParents().filter((t3) => !(t3 instanceof e.Root || t3 instanceof e.AnimationChannel)).length || r2.dispose(t2);
    }
    function re(e2, t2, r2) {
      for (const n2 of e2.listEdges()) {
        const e3 = n2.getParent();
        e3.propertyType === t2 && te(e3, r2);
      }
    }
    function ne(t2, r2, n2) {
      if (r2.listChildren().forEach((e2) => ne(t2, e2, n2)), r2 instanceof e.Scene) return;
      const o2 = t2.listParentEdges(r2).some((t3) => {
        const r3 = t3.getParent().propertyType;
        return r3 !== e.PropertyType.ROOT && r3 !== e.PropertyType.SCENE && r3 !== e.PropertyType.NODE;
      });
      0 === t2.listChildren(r2).length && !o2 && n2.dispose(r2);
    }
    function oe(e2, t2) {
      for (const r2 of t2) e2.setAttribute(r2, null);
    }
    function se(e2) {
      const t2 = e2.getIndices(), r2 = e2.listAttributes()[0];
      t2 && r2 && t2.getCount() === r2.getCount() && e2.setIndices(null);
    }
    function ie(e2, t2) {
      const r2 = [];
      for (const n2 of e2.listSemantics()) "TANGENT" !== n2 || t2.has(n2) ? (n2.startsWith("TEXCOORD_") && !t2.has(n2) || n2.startsWith("COLOR_") && "COLOR_0" !== n2) && r2.push(n2) : r2.push(n2);
      return r2;
    }
    function ae(t2, r2, n2) {
      if (void 0 === n2 && (n2 = /* @__PURE__ */ new Set()), !r2) return n2;
      const o2 = t2.getGraph().listChildEdges(r2), s2 = /* @__PURE__ */ new Set();
      for (const t3 of o2) t3.getChild() instanceof e.Texture && s2.add(t3.getName());
      for (const r3 of o2) {
        const o3 = r3.getName(), i2 = r3.getChild();
        i2 instanceof e.TextureInfo && s2.has(o3.replace(/Info$/, "")) && n2.add(`TEXCOORD_${i2.getTexCoord()}`), i2 instanceof e.Texture && o3.match(/normalTexture/i) && n2.add("TANGENT"), i2 instanceof e.ExtensionProperty && ae(t2, i2, n2);
      }
      return n2;
    }
    function ce(e2, t2) {
      const r2 = X(e2), n2 = new Set(r2.map((e3) => e3.getTexCoord())), o2 = Array.from(n2).sort(), s2 = new Map(o2.map((e3, t3) => [e3, t3])), i2 = new Map(o2.map((e3, t3) => [`TEXCOORD_${e3}`, `TEXCOORD_${t3}`]));
      for (const e3 of r2) {
        const t3 = e3.getTexCoord();
        e3.setTexCoord(s2.get(t3));
      }
      for (const e3 of t2) {
        const t3 = e3.listSemantics().filter((e4) => e4.startsWith("TEXCOORD_")).sort();
        a2(e3, t3), e3.listTargets().forEach((e4) => a2(e4, t3));
      }
      function a2(e3, t3) {
        for (const r3 of t3) {
          const t4 = e3.getAttribute(r3);
          if (!t4) continue;
          const n3 = i2.get(r3);
          n3 !== r3 && (e3.setAttribute(n3, t4), e3.setAttribute(r3, null));
        }
      }
    }
    function le(t2, r2, n2, o2) {
      if (t2 instanceof e.Material) switch (n2) {
        case "baseColorTexture":
          return t2.setBaseColorFactor((s2 = r2, i2 = r2, a2 = t2.getBaseColorFactor(), s2[0] = i2[0] * a2[0], s2[1] = i2[1] * a2[1], s2[2] = i2[2] * a2[2], s2[3] = i2[3] * a2[3], s2)), true;
        case "emissiveTexture":
          return t2.setEmissiveFactor((function(e2, t3, r3) {
            return e2[0] = t3[0] * r3[0], e2[1] = t3[1] * r3[1], e2[2] = t3[2] * r3[2], e2;
          })([0, 0, 0], r2.slice(0, 3), t2.getEmissiveFactor())), true;
        case "occlusionTexture":
          return Math.abs(r2[0] - 1) <= Z;
        case "metallicRoughnessTexture":
          return t2.setRoughnessFactor(r2[1] * t2.getRoughnessFactor()), t2.setMetallicFactor(r2[2] * t2.getMetallicFactor()), true;
        case "normalTexture":
          return k(_(U(), r2, [0.5, 0.5, 1, 1])) <= Z;
      }
      var s2, i2, a2;
      return o2.warn(`${J}: Detected single-color ${n2} texture. Pruning ${n2} not yet supported.`), false;
    }
    var ue = "weld";
    var fe = { DEFAULT: 1e-4, TEXCOORD: 1e-4, COLOR: 0.01, NORMAL: 0.05, JOINTS: 0, WEIGHTS: 0.01 };
    var ge = { tolerance: fe.DEFAULT, toleranceNormal: fe.NORMAL, overwrite: true, exhaustive: false };
    function pe(t2) {
      void 0 === t2 && (t2 = ge);
      const r2 = Me(t2);
      return l(ue, function(t3) {
        try {
          let n3 = function() {
            return Promise.resolve(t3.transform(B({ propertyTypes: [e.PropertyType.ACCESSOR] }))).then(function() {
              o2.debug(`${ue}: Complete.`);
            });
          };
          var n2 = n3;
          const o2 = t3.getLogger();
          for (const i2 of t3.getRoot().listMeshes()) {
            for (const a2 of i2.listPrimitives()) me(t3, a2, r2), Ie(a2) && a2.dispose();
            0 === i2.listPrimitives().length && i2.dispose();
          }
          const s2 = (function() {
            if (r2.tolerance > 0) return Promise.resolve(t3.transform(Y({ propertyTypes: [e.PropertyType.ACCESSOR, e.PropertyType.NODE], keepAttributes: true, keepIndices: true, keepLeaves: false }))).then(function() {
            });
          })();
          return Promise.resolve(s2 && s2.then ? s2.then(n3) : n3());
        } catch (c2) {
          return Promise.reject(c2);
        }
      });
    }
    function me(t2, r2, n2) {
      let o2, s2, i2;
      if (void 0 === r2 && (r2 = ge), void 0 === n2 && (n2 = ge), t2 instanceof e.Primitive) {
        const n3 = t2.getGraph();
        o2 = e.Document.fromGraph(n3), s2 = t2, i2 = Me(r2);
      } else o2 = t2, s2 = r2, i2 = Me(n2);
      s2.getIndices() && !i2.overwrite || s2.getMode() !== e.Primitive.Mode.POINTS && (0 === i2.tolerance ? (function(t3, r3) {
        if (r3.getIndices()) return;
        const n3 = r3.listAttributes()[0], o3 = n3.getCount(), s3 = n3.getBuffer(), i3 = t3.createAccessor().setBuffer(s3).setType(e.Accessor.Type.SCALAR).setArray(E(o3));
        r3.setIndices(i3);
      })(o2, s2) : (function(e2, t3, r3) {
        const n3 = e2.getLogger(), o3 = t3.getAttribute("POSITION"), s3 = t3.getIndices() || e2.createAccessor().setArray(E(o3.getCount())), i3 = new Uint32Array(new Set(s3.getArray())).sort(), a2 = {};
        for (const e3 of t3.listSemantics()) {
          const n4 = t3.getAttribute(e3);
          a2[e3] = Te(e3, n4, r3);
        }
        var c2;
        n3.debug(`${ue}: Tolerance thresholds: ${c2 = a2, Object.entries(c2).map((e3) => {
          let [t4, r4] = e3;
          return `${t4}=${r4}`;
        }).join(", ")}`);
        const l2 = [0, 0, 0], u2 = [0, 0, 0], f2 = {}, g2 = a2.POSITION;
        for (let e3 = 0; e3 < i3.length; e3++) {
          o3.getElement(i3[e3], l2);
          const t4 = Pe(l2, g2);
          f2[t4] = f2[t4] || [], f2[t4].push(i3[e3]);
        }
        const p2 = E(i3[i3.length - 1] + 1), m2 = new Array(i3.length).fill(-1), d2 = o3.getCount();
        let y2 = 0;
        for (let e3 = 0; e3 < i3.length; e3++) {
          const n4 = i3[e3];
          o3.getElement(n4, l2);
          const s4 = r3.exhaustive ? Se(l2, g2) : [Pe(l2, g2)];
          e: for (const e4 of s4) if (f2[e4]) t: for (const r4 of f2[e4]) {
            const e5 = p2[r4];
            if (n4 <= e5) continue t;
            o3.getElement(e5, u2);
            const s5 = t3.listSemantics().every((r5) => Ae(t3.getAttribute(r5), n4, e5, a2[r5])), i4 = t3.listTargets().every((t4) => t4.listSemantics().every((r5) => Ae(t4.getAttribute(r5), n4, e5, a2[r5])));
            if (s5 && i4) {
              p2[n4] = e5;
              break e;
            }
          }
          m2[n4] = p2[n4] === n4 ? y2++ : m2[p2[n4]];
        }
        n3.debug(`${ue}: ${h(d2, y2)} vertices.`);
        const T2 = s3.getCount(), A2 = E(T2, i3.length);
        for (let e3 = 0; e3 < T2; e3++) A2[e3] = m2[s3.getScalar(e3)];
        t3.setIndices(s3.clone().setArray(A2)), 1 === s3.listParents().length && s3.dispose();
        for (const e3 of t3.listAttributes()) he(t3, e3, m2, y2);
        for (const e3 of t3.listTargets()) for (const t4 of e3.listAttributes()) he(e3, t4, m2, y2);
        !(function(e3) {
          const t4 = e3.getIndices();
          if (!t4) return;
          const r4 = [];
          let n4 = -Infinity;
          for (let e4 = 0, o5 = t4.getCount(); e4 < o5; e4 += 3) {
            const o6 = t4.getScalar(e4), s4 = t4.getScalar(e4 + 1), i4 = t4.getScalar(e4 + 2);
            o6 !== s4 && o6 !== i4 && s4 !== i4 && (r4.push(o6, s4, i4), n4 = Math.max(n4, o6, s4, i4));
          }
          const o4 = E(r4.length, n4);
          o4.set(r4), t4.setArray(o4);
        })(t3);
      })(o2, s2, i2));
    }
    function he(e2, t2, r2, n2) {
      const o2 = (a2 = t2.getArray(), c2 = n2 * t2.getElementSize(), new (0, a2.constructor)(c2)), s2 = t2.clone().setArray(o2), i2 = new Uint8Array(n2);
      var a2, c2;
      for (let e3 = 0, n3 = []; e3 < r2.length; e3++) i2[r2[e3]] || (s2.setElement(r2[e3], t2.getElement(e3, n3)), i2[r2[e3]] = 1);
      e2.swap(t2, s2), 1 === t2.listParents().length && t2.dispose();
    }
    var de = [];
    var ye = [];
    function Te(e2, t2, r2) {
      if ("NORMAL" === e2 || "TANGENT" === e2) return r2.toleranceNormal;
      if (e2.startsWith("COLOR_")) return fe.COLOR;
      if (e2.startsWith("TEXCOORD_")) return fe.TEXCOORD;
      if (e2.startsWith("JOINTS_")) return fe.JOINTS;
      if (e2.startsWith("WEIGHTS_")) return fe.WEIGHTS;
      de.length = ye.length = 0, t2.getMinNormalized(de), t2.getMaxNormalized(ye);
      const n2 = ye.map((e3, t3) => e3 - de[t3]), o2 = Math.max(...n2);
      return r2.tolerance * o2;
    }
    function Ae(e2, t2, r2, n2, o2) {
      e2.getElement(t2, de), e2.getElement(r2, ye);
      for (let t3 = 0, r3 = e2.getElementSize(); t3 < r3; t3++) if (Math.abs(de[t3] - ye[t3]) > n2) return false;
      return true;
    }
    var Ee = [0, -1, 1];
    function Se(e2, t2) {
      const r2 = [], n2 = [0, 0, 0];
      for (const o2 of Ee) for (const s2 of Ee) for (const i2 of Ee) n2[0] = e2[0] + o2 * t2, n2[1] = e2[1] + s2 * t2, n2[2] = e2[2] + i2 * t2, r2.push(Pe(n2, t2));
      return r2;
    }
    function Pe(e2, t2) {
      return Math.round(e2[0] / t2) + ":" + Math.round(e2[1] / t2) + ":" + Math.round(e2[2] / t2);
    }
    function Me(e2) {
      const t2 = { ...ge, ...e2 };
      if (t2.tolerance < 0 || t2.tolerance > 0.1) throw new Error(`${ue}: Requires 0 <= tolerance <= 0.1`);
      if (t2.toleranceNormal < 0 || t2.toleranceNormal > Math.PI / 2) throw new Error(`${ue}: Requires 0 <= toleranceNormal <= ${(Math.PI / 2).toFixed(2)}`);
      return t2.tolerance > 0 && (t2.tolerance = Math.max(t2.tolerance, Number.EPSILON), t2.toleranceNormal = Math.max(t2.toleranceNormal, Number.EPSILON)), t2;
    }
    function Ie(e2) {
      const t2 = e2.getIndices();
      return !!t2 && 0 === t2.getCount();
    }
    function ve(t2, r2, n2) {
      var o2;
      void 0 === n2 && (n2 = /* @__PURE__ */ new Set());
      const s2 = t2.getAttribute("POSITION"), i2 = (null == (o2 = t2.getIndices()) ? void 0 : o2.getArray()) || E(s2.getCount());
      s2 && be(r2, s2, i2, new Set(n2));
      const a2 = t2.getAttribute("NORMAL");
      a2 && Ne(r2, a2, i2, new Set(n2));
      const c2 = t2.getAttribute("TANGENT");
      c2 && xe(r2, c2, i2, new Set(n2));
      for (const e2 of t2.listTargets()) {
        const t3 = e2.getAttribute("POSITION");
        t3 && be(r2, t3, i2, new Set(n2));
        const o3 = e2.getAttribute("NORMAL");
        o3 && Ne(r2, o3, i2, new Set(n2));
        const s3 = e2.getAttribute("TANGENT");
        s3 && xe(r2, s3, i2, new Set(n2));
      }
      var l2, u2, f2, g2, p2, m2, h2, d2, y2, T2, A2, S2, P2, M2, I2, v2, b2;
      ((u2 = (l2 = r2)[0]) * (h2 = l2[5]) - (f2 = l2[1]) * (m2 = l2[4])) * ((S2 = l2[10]) * (b2 = l2[15]) - (P2 = l2[11]) * (v2 = l2[14])) - (u2 * (d2 = l2[6]) - (g2 = l2[2]) * m2) * ((A2 = l2[9]) * b2 - P2 * (I2 = l2[13])) + (u2 * (y2 = l2[7]) - (p2 = l2[3]) * m2) * (A2 * v2 - S2 * I2) + (f2 * d2 - g2 * h2) * ((T2 = l2[8]) * b2 - P2 * (M2 = l2[12])) - (f2 * y2 - p2 * h2) * (T2 * v2 - S2 * M2) + (g2 * y2 - p2 * d2) * (T2 * I2 - A2 * M2) < 0 && (function(t3) {
        if (t3.getMode() !== e.Primitive.Mode.TRIANGLES) return;
        t3.getIndices() || me(t3, { tolerance: 0 });
        const r3 = t3.getIndices();
        for (let e2 = 0, t4 = r3.getCount(); e2 < t4; e2 += 3) {
          const t5 = r3.getScalar(e2), n3 = r3.getScalar(e2 + 2);
          r3.setScalar(e2, n3), r3.setScalar(e2 + 2, t5);
        }
      })(t2);
      for (let e2 = 0; e2 < i2.length; e2++) n2.add(i2[e2]);
    }
    function be(e2, t2, r2, n2) {
      const o2 = new Float32Array(3 * t2.getCount()), s2 = t2.getElementSize();
      for (let e3 = 0, r3 = [], n3 = t2.getCount(); e3 < n3; e3++) o2.set(t2.getElement(e3, r3), e3 * s2);
      const i2 = C();
      for (let s3 = 0; s3 < r2.length; s3++) {
        const a2 = r2[s3];
        n2.has(a2) || (t2.getElement(a2, i2), z(i2, i2, e2), o2.set(i2, 3 * a2), n2.add(a2));
      }
      t2.setArray(o2).setNormalized(false);
    }
    function Ne(e2, t2, r2, n2) {
      const o2 = (s2 = new N(9), N != Float32Array && (s2[1] = 0, s2[2] = 0, s2[3] = 0, s2[5] = 0, s2[6] = 0, s2[7] = 0), s2[0] = 1, s2[4] = 1, s2[8] = 1, s2);
      var s2;
      !(function(e3, t3) {
        e3[0] = t3[0], e3[1] = t3[1], e3[2] = t3[2], e3[3] = t3[4], e3[4] = t3[5], e3[5] = t3[6], e3[6] = t3[8], e3[7] = t3[9], e3[8] = t3[10];
      })(o2, e2), (function(e3, t3) {
        var r3 = t3[0], n3 = t3[1], o3 = t3[2], s3 = t3[3], i3 = t3[4], a2 = t3[5], c2 = t3[6], l2 = t3[7], u2 = t3[8], f2 = u2 * i3 - a2 * l2, g2 = -u2 * s3 + a2 * c2, p2 = l2 * s3 - i3 * c2, m2 = r3 * f2 + n3 * g2 + o3 * p2;
        m2 && (e3[0] = f2 * (m2 = 1 / m2), e3[1] = (-u2 * n3 + o3 * l2) * m2, e3[2] = (a2 * n3 - o3 * i3) * m2, e3[3] = g2 * m2, e3[4] = (u2 * r3 - o3 * c2) * m2, e3[5] = (-a2 * r3 + o3 * s3) * m2, e3[6] = p2 * m2, e3[7] = (-l2 * r3 + n3 * c2) * m2, e3[8] = (i3 * r3 - n3 * s3) * m2);
      })(o2, o2), (function(e3, t3) {
        if (e3 === t3) {
          var r3 = t3[1], n3 = t3[2], o3 = t3[5];
          e3[1] = t3[3], e3[2] = t3[6], e3[3] = r3, e3[5] = t3[7], e3[6] = n3, e3[7] = o3;
        } else e3[0] = t3[0], e3[1] = t3[3], e3[2] = t3[6], e3[3] = t3[1], e3[4] = t3[4], e3[5] = t3[7], e3[6] = t3[2], e3[7] = t3[5], e3[8] = t3[8];
      })(o2, o2);
      const i2 = C();
      for (let e3 = 0; e3 < r2.length; e3++) {
        const s3 = r2[e3];
        n2.has(s3) || (t2.getElement(s3, i2), F(i2, i2, o2), L(i2, i2), t2.setElement(s3, i2), n2.add(s3));
      }
    }
    function xe(e2, t2, r2, n2) {
      const o2 = C(), s2 = U();
      for (let i2 = 0; i2 < r2.length; i2++) {
        const a2 = r2[i2];
        if (n2.has(a2)) continue;
        t2.getElement(a2, s2);
        const [c2, l2, u2] = s2;
        o2[0] = e2[0] * c2 + e2[4] * l2 + e2[8] * u2, o2[1] = e2[1] * c2 + e2[5] * l2 + e2[9] * u2, o2[2] = e2[2] * c2 + e2[6] * l2 + e2[10] * u2, L(o2, o2), s2[0] = o2[0], s2[1] = o2[1], s2[2] = o2[2], t2.setElement(a2, s2), n2.add(a2);
      }
    }
    function Re(t2, r2, n2, o2) {
      void 0 === n2 && (n2 = false);
      for (const r3 of t2.listPrimitives()) if (r3.listParents().some((r4) => r4.propertyType === e.PropertyType.MESH && r4 !== t2)) {
        const e2 = r3.clone();
        t2.swap(r3, e2);
        for (const t3 of e2.listTargets()) {
          const r4 = t3.clone();
          e2.swap(t3, r4);
        }
      }
      if (!n2) {
        const r3 = /* @__PURE__ */ new Set([...t2.listPrimitives(), ...t2.listPrimitives().flatMap((e2) => e2.listTargets())]), n3 = /* @__PURE__ */ new Map();
        for (const o3 of t2.listPrimitives()) for (const t3 of d(o3)) t3.listParents().some((t4) => (t4 instanceof e.Primitive || t4 instanceof e.PrimitiveTarget) && !r3.has(t4)) && !n3.has(t3) && n3.set(t3, t3.clone());
        for (const e2 of r3) for (const [t3, r4] of n3) e2.swap(t3, r4);
      }
      const s2 = /* @__PURE__ */ new Map();
      for (const e2 of t2.listPrimitives()) {
        const t3 = e2.getAttribute("POSITION");
        let n3;
        o2 ? n3 = o2 : s2.has(t3) ? n3 = s2.get(t3) : s2.set(t3, n3 = /* @__PURE__ */ new Set()), ve(e2, r2, n3);
      }
    }
    var Ce = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var we = "dequantize";
    var Oe = { pattern: /^((?!JOINTS_).)*$/ };
    function $e(e2, t2) {
      for (const r2 of e2.listSemantics()) Le(r2, e2.getAttribute(r2), t2);
      for (const r2 of e2.listTargets()) for (const e3 of r2.listSemantics()) Le(e3, r2.getAttribute(e3), t2);
    }
    function Le(e2, t2, r2) {
      if (!t2.getArray()) return;
      if (!r2.pattern.test(e2)) return;
      if (t2.getComponentSize() >= 4) return;
      const n2 = t2.getArray(), o2 = new Float32Array(n2.length);
      for (let e3 = 0, r3 = t2.getCount(), s2 = []; e3 < r3; e3++) s2 = t2.getElement(e3, s2), t2.setArray(o2).setElement(e3, s2).setArray(n2);
      t2.setArray(o2).setNormalized(false);
    }
    var ze = { method: "edgebreaker", encodeSpeed: 5, decodeSpeed: 5, quantizePosition: 14, quantizeNormal: 10, quantizeColor: 8, quantizeTexcoord: 12, quantizeGeneric: 12, quantizationVolume: "mesh" };
    var Fe = "flatten";
    function Ue(t2) {
      return { properties: t2.getRoot().listScenes().map((t3) => {
        const r2 = t3.listChildren()[0], n2 = e.getBounds(t3);
        return { name: t3.getName(), rootName: r2 ? r2.getName() : "", bboxMin: je(n2.min), bboxMax: je(n2.max) };
      }) };
    }
    function _e(t2) {
      return { properties: t2.getRoot().listMeshes().map((t3) => {
        const r2 = t3.listParents().filter((t4) => t4.propertyType !== e.PropertyType.ROOT).length;
        let n2 = 0, o2 = 0;
        const s2 = /* @__PURE__ */ new Set(), i2 = /* @__PURE__ */ new Set(), a2 = /* @__PURE__ */ new Set();
        t3.listPrimitives().forEach((e2) => {
          for (const t5 of e2.listSemantics()) {
            const r3 = e2.getAttribute(t5);
            s2.add(t5 + ":" + He(r3)), a2.add(r3);
          }
          for (const t5 of e2.listTargets()) t5.listAttributes().forEach((e3) => a2.add(e3));
          const t4 = e2.getIndices();
          t4 && (i2.add(He(t4)), a2.add(t4)), o2 += e2.listAttributes()[0].getCount(), n2 += f(e2);
        });
        let c2 = 0;
        Array.from(a2).forEach((e2) => c2 += e2.getArray().byteLength);
        const l2 = t3.listPrimitives().map((e2) => Be[e2.getMode()]);
        return { name: t3.getName(), mode: Array.from(new Set(l2)), primitives: t3.listPrimitives().length, glPrimitives: n2, vertices: o2, indices: Array.from(i2).sort(), attributes: Array.from(s2).sort(), instances: r2, size: c2 };
      }) };
    }
    function ke(t2) {
      const r2 = t2.getRoot().listMaterials().map((r3) => {
        const n2 = r3.listParents().filter((t3) => t3.propertyType !== e.PropertyType.ROOT).length, o2 = new Set(r3.listExtensions()), s2 = t2.getGraph().listEdges().filter((t3) => {
          const n3 = t3.getChild(), s3 = t3.getParent();
          return n3 instanceof e.Texture && s3 === r3 || !!(n3 instanceof e.Texture && s3 instanceof e.ExtensionProperty && o2.has(s3));
        }).map((e2) => e2.getName());
        return { name: r3.getName(), instances: n2, textures: s2, alphaMode: r3.getAlphaMode(), doubleSided: r3.getDoubleSided() };
      });
      return { properties: r2 };
    }
    function Ge(t2) {
      return { properties: t2.getRoot().listTextures().map((r2) => {
        const o2 = r2.listParents().filter((t3) => t3.propertyType !== e.PropertyType.ROOT).length, s2 = t2.getGraph().listParentEdges(r2).filter((t3) => t3.getParent().propertyType !== e.PropertyType.ROOT).map((e2) => e2.getName()), i2 = e.ImageUtils.getSize(r2.getImage(), r2.getMimeType());
        let a2 = "";
        if ("image/ktx2" === r2.getMimeType()) {
          const e2 = n.read(r2.getImage()).dataFormatDescriptor[0];
          e2.colorModel === n.KHR_DF_MODEL_ETC1S ? a2 = "ETC1S" : e2.colorModel === n.KHR_DF_MODEL_UASTC && (a2 = "UASTC");
        }
        return { name: r2.getName(), uri: r2.getURI(), slots: Array.from(new Set(s2)), instances: o2, mimeType: r2.getMimeType(), compression: a2, resolution: i2 ? i2.join("x") : "", size: r2.getImage().byteLength, gpuSize: e.ImageUtils.getVRAMByteLength(r2.getImage(), r2.getMimeType()) };
      }) };
    }
    function qe(e2) {
      return { properties: e2.getRoot().listAnimations().map((e3) => {
        let t2 = Infinity, r2 = -Infinity;
        e3.listSamplers().forEach((e4) => {
          const n3 = e4.getInput();
          n3 && (t2 = Math.min(t2, n3.getMin([])[0]), r2 = Math.max(r2, n3.getMax([])[0]));
        });
        let n2 = 0, o2 = 0;
        const s2 = /* @__PURE__ */ new Set();
        return e3.listSamplers().forEach((e4) => {
          const t3 = e4.getInput(), r3 = e4.getOutput();
          t3 && (o2 += t3.getCount(), s2.add(t3), r3 && s2.add(r3));
        }), Array.from(s2).forEach((e4) => {
          n2 += e4.getArray().byteLength;
        }), { name: e3.getName(), channels: e3.listChannels().length, samplers: e3.listSamplers().length, duration: Math.round(1e3 * (r2 - t2)) / 1e3, keyframes: o2, size: n2 };
      }) };
    }
    var Be = ["POINTS", "LINES", "LINE_LOOP", "LINE_STRIP", "TRIANGLES", "TRIANGLE_STRIP", "TRIANGLE_FAN"];
    var De = { Float32Array: "f32", Uint32Array: "u32", Uint16Array: "u16", Uint8Array: "u8", Int32Array: "i32", Int16Array: "i16", Int8Array: "i8" };
    function je(e2) {
      for (let t2 = 0; t2 < e2.length; t2++) e2[t2].toFixed && (e2[t2] = Number(e2[t2].toFixed(5)));
      return e2;
    }
    function He(e2) {
      const t2 = e2.getArray();
      return (De[t2.constructor.name] || "?") + (e2.getNormalized() ? "_norm" : "");
    }
    var We = "instance";
    var Xe = { min: 2 };
    function Ke(e2, t2) {
      let r2, n2 = 0;
      for (; r2 = e2.pop(); ) {
        if (r2.listChildren().length || r2.getCamera() || r2.getMesh() || r2.getSkin() || r2.listExtensions().length) continue;
        const t3 = r2.getParentNode();
        t3 && e2.push(t3), r2.dispose(), n2++;
      }
      t2.debug(`${We}: Removed ${n2} unused nodes.`);
    }
    function Ve(e2) {
      const t2 = e2.getMaterial();
      return !(!t2 || !t2.getExtension("KHR_materials_volume"));
    }
    function Je(t2) {
      const r2 = t2.getWorldScale();
      return !e.MathUtils.eq(r2, [1, 1, 1]);
    }
    function Ze(e2, t2, r2, n2) {
      const o2 = r2.listPrimitives()[0].getAttribute("POSITION").getBuffer(), s2 = e2.createAccessor().setType("VEC3").setArray(new Float32Array(3 * n2)).setBuffer(o2), i2 = e2.createAccessor().setType("VEC4").setArray(new Float32Array(4 * n2)).setBuffer(o2), a2 = e2.createAccessor().setType("VEC3").setArray(new Float32Array(3 * n2)).setBuffer(o2);
      return t2.createInstancedMesh().setAttribute("TRANSLATION", s2).setAttribute("ROTATION", i2).setAttribute("SCALE", a2);
    }
    var Qe = { skipValidation: false };
    function Ye(t2, r2) {
      void 0 === r2 && (r2 = {}), r2 = { ...Qe, ...r2 };
      const n2 = t2[0], o2 = e.Document.fromGraph(n2.getGraph());
      if (!r2.skipValidation && new Set(t2.map(S)).size > 1) throw new Error("Requires >=2 Primitives, sharing the same Material and Mode, with compatible vertex attributes and indices.");
      const s2 = [], i2 = [];
      let a2 = 0, c2 = 0;
      for (const e2 of t2) {
        const t3 = et(e2), r3 = [];
        for (let e3 = 0; e3 < t3.length; e3++) {
          const n3 = t3[e3];
          void 0 === r3[n3] && (r3[n3] = a2++), c2++;
        }
        s2.push(new Uint32Array(r3)), i2.push(t3);
      }
      const l2 = o2.createPrimitive().setMode(n2.getMode()).setMaterial(n2.getMaterial());
      for (const t3 of n2.listSemantics()) {
        const r3 = n2.getAttribute(t3), s3 = e.ComponentTypeToTypedArray[r3.getComponentType()], i3 = o2.createAccessor().setType(r3.getType()).setBuffer(r3.getBuffer()).setNormalized(r3.getNormalized()).setArray(new s3(a2 * r3.getElementSize()));
        l2.setAttribute(t3, i3);
      }
      const u2 = (n2.getIndices() ? E(a2) : null) && o2.createAccessor().setBuffer(n2.getIndices().getBuffer()).setArray(E(c2, a2));
      l2.setIndices(u2);
      let f2 = 0;
      for (let e2 = 0; e2 < s2.length; e2++) {
        const r3 = t2[e2], n3 = s2[e2], o3 = i2[e2], a3 = f2;
        let c3 = a3;
        for (const e3 of l2.listSemantics()) {
          const t3 = r3.getAttribute(e3), s3 = l2.getAttribute(e3), i3 = [];
          c3 = a3;
          for (let e4 = 0; e4 < o3.length; e4++) {
            const r4 = o3[e4];
            t3.getElement(r4, i3), s3.setElement(n3[r4], i3), u2 && u2.setScalar(c3++, n3[r4]);
          }
        }
        f2 = c3;
      }
      return l2;
    }
    function et(e2) {
      const t2 = e2.getIndices();
      return t2 ? t2.getArray() : E(e2.getAttribute("POSITION").getCount());
    }
    var tt = "join";
    var { ROOT: rt, NODE: nt, MESH: ot, PRIMITIVE: st, ACCESSOR: it } = e.PropertyType;
    var at = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var ct = { keepMeshes: false, keepNamed: false };
    function lt(t2, r2, n2) {
      const o2 = t2.getLogger(), s2 = {}, i2 = r2.listChildren();
      for (let t3 = 0; t3 < i2.length; t3++) {
        const r3 = i2[t3];
        if (r3.listParents().some((t4) => t4 instanceof e.AnimationChannel)) continue;
        const o3 = r3.getMesh();
        if (o3 && !r3.getExtension("EXT_mesh_gpu_instancing") && !r3.getSkin()) for (const e2 of o3.listPrimitives()) {
          if (e2.listTargets().length > 0) continue;
          const i3 = e2.getMaterial();
          if (i3 && i3.getExtension("KHR_materials_volume")) continue;
          gt(e2);
          let a3 = S(e2);
          const c3 = o3.getName() || r3.getName();
          (n2.keepMeshes || n2.keepNamed && c3) && (a3 += `|${t3}`), a3 in s2 || (s2[a3] = { prims: [], primMeshes: [], primNodes: [], dstNode: r3, dstMesh: void 0 });
          const l2 = s2[a3];
          l2.prims.push(e2), l2.primNodes.push(r3);
        }
      }
      const a2 = Object.values(s2).filter((e2) => {
        let { prims: t3 } = e2;
        return t3.length > 1;
      }), c2 = new Set(a2.flatMap((e2) => e2.primNodes));
      for (const e2 of c2) {
        const t3 = e2.getMesh(), r3 = t3.listParents().some((t4) => t4.propertyType !== rt && e2 !== t4);
        r3 && e2.setMesh(t3.clone());
      }
      for (const e2 of a2) {
        const { dstNode: t3, primNodes: r3 } = e2;
        e2.dstMesh = t3.getMesh(), e2.primMeshes = r3.map((e3) => e3.getMesh());
      }
      for (const t3 of a2) {
        const { prims: r3, primNodes: n3, primMeshes: s3, dstNode: i3, dstMesh: a3 } = t3, c3 = i3.getMatrix();
        for (let t4 = 0; t4 < r3.length; t4++) {
          const o3 = n3[t4];
          let a4 = r3[t4];
          s3[t4].removePrimitive(a4), (a4.listParents().some((t5) => t5.propertyType !== e.PropertyType.ROOT) || ft(a4)) && (a4 = r3[t4] = ut(r3[t4])), o3 !== i3 && (R(at, x(at, c3), o3.getMatrix()), ve(a4, at));
        }
        const l2 = Ye(r3), u2 = l2.listAttributes()[0].getCount();
        a3.addPrimitive(l2), o2.debug(`${tt}: Joined Primitives (${r3.length}) containing ${m(u2)} vertices under Node "${i3.getName()}".`);
      }
    }
    function ut(e2) {
      const t2 = e2.clone();
      for (const e3 of t2.listSemantics()) t2.setAttribute(e3, t2.getAttribute(e3).clone());
      const r2 = t2.getIndices();
      return r2 && t2.setIndices(r2.clone()), t2;
    }
    function ft(e2) {
      for (const t2 of e2.listAttributes()) for (const r2 of t2.listParents()) if (r2 !== e2 && r2.propertyType !== rt) return true;
      return false;
    }
    function gt(e2) {
      for (const t2 of ["POSITION", "NORMAL", "TANGENT"]) {
        const r2 = e2.getAttribute(t2);
        r2 && r2.getComponentSize() < 4 && Le(t2, r2, { pattern: /.*/ });
      }
    }
    function pt(t2) {
      const r2 = e.Document.fromGraph(t2.getGraph());
      let n2 = 0;
      for (const o2 of r2.getGraph().listParentEdges(t2)) {
        const t3 = o2.getParent();
        let { channels: s2 } = o2.getAttributes();
        s2 && "baseColorTexture" === o2.getName() && t3 instanceof e.Material && t3.getAlphaMode() === e.Material.AlphaMode.OPAQUE && (s2 &= ~e.TextureChannel.A), s2 ? n2 |= s2 : t3.propertyType !== e.PropertyType.ROOT && r2.getLogger().warn(`Missing attribute ".channels" on edge, "${o2.getName()}".`);
      }
      return n2;
    }
    var mt = "reorder";
    var ht = { target: "size" };
    function dt(t2) {
      const r2 = { ...ht, ...t2 }, n2 = r2.encoder;
      if (!n2) throw new Error(`${mt}: encoder dependency required \u2014 install "meshoptimizer".`);
      return l(mt, function(t3) {
        try {
          const o2 = t3.getLogger();
          return Promise.resolve(n2.ready).then(function() {
            const s2 = (function(e2) {
              const t4 = new g(), r3 = /* @__PURE__ */ new Map(), n3 = new g();
              for (const o3 of e2.getRoot().listMeshes()) for (const e3 of o3.listPrimitives()) {
                const o4 = e3.getIndices();
                if (o4) {
                  r3.set(o4, e3.getMode());
                  for (const r4 of d(e3)) t4.add(o4, r4), n3.add(r4, e3);
                }
              }
              return { indicesToAttributes: t4, indicesToMode: r3, attributesToPrimitives: n3 };
            })(t3);
            for (const t4 of s2.indicesToAttributes.keys()) {
              const o3 = t4.clone();
              let i2 = o3.getArray().slice();
              i2 instanceof Uint32Array || (i2 = new Uint32Array(i2));
              const [a2, c2] = n2.reorderMesh(i2, s2.indicesToMode.get(t4) === e.Primitive.Mode.TRIANGLES, "size" === r2.target);
              o3.setArray(c2 <= 65534 ? new Uint16Array(i2) : i2);
              for (const e2 of s2.indicesToAttributes.get(t4)) {
                const r3 = e2.clone();
                A(r3, a2, c2);
                for (const n3 of s2.attributesToPrimitives.get(e2)) if (n3.getIndices() === t4 && n3.swap(t4, o3), n3.getIndices() === o3) {
                  n3.swap(e2, r3);
                  for (const t5 of n3.listTargets()) t5.swap(e2, r3);
                }
              }
            }
            return Promise.resolve(t3.transform(Y({ propertyTypes: [e.PropertyType.ACCESSOR], keepAttributes: true, keepIndices: true }))).then(function() {
              s2.indicesToAttributes.size ? o2.debug(`${mt}: Complete.`) : o2.warn(`${mt}: No qualifying primitives found; may need to weld first.`);
            });
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }
    function yt(t2, r2) {
      if (void 0 === r2 && (r2 = Infinity), Number.isFinite(r2) && r2 % 4 || r2 <= 0) throw new Error("Limit must be positive multiple of four.");
      const n2 = t2.getAttribute("POSITION").getCount(), o2 = t2.listSemantics().filter((e2) => e2.startsWith("WEIGHTS_")).length, s2 = new Uint16Array(4 * o2), i2 = new Float32Array(4 * o2), a2 = new Float32Array(4 * o2), c2 = new Uint32Array(4 * o2), l2 = new Uint32Array(4 * o2);
      for (let e2 = 0; e2 < n2; e2++) {
        Tt(t2, e2, "WEIGHTS", i2), Tt(t2, e2, "JOINTS", c2);
        for (let e3 = 0; e3 < 4 * o2; e3++) s2[e3] = e3;
        s2.sort((e3, t3) => i2[e3] > i2[t3] ? -1 : 1);
        for (let e3 = 0; e3 < s2.length; e3++) a2[e3] = i2[s2[e3]], l2[e3] = c2[s2[e3]];
        At(t2, e2, "WEIGHTS", a2), At(t2, e2, "JOINTS", l2);
      }
      for (let e2 = o2; 4 * e2 > r2; e2--) {
        const r3 = t2.getAttribute("WEIGHTS_" + (e2 - 1)), n3 = t2.getAttribute("JOINTS_" + (e2 - 1));
        t2.setAttribute("WEIGHTS_" + (e2 - 1), null), t2.setAttribute("JOINTS_" + (e2 - 1), null), 1 === r3.listParents().length && r3.dispose(), 1 === n3.listParents().length && n3.dispose();
      }
      !(function(t3) {
        if (!(function(e2) {
          const t4 = e2.listSemantics().filter((e3) => e3.startsWith("WEIGHTS_")).map((t5) => e2.getAttribute(t5)), r4 = t4.map((e3) => e3.getNormalized()), n4 = t4.map((e3) => e3.getComponentType());
          return 1 === new Set(r4).size && 1 === new Set(n4).size;
        })(t3)) return;
        const r3 = t3.getAttribute("POSITION").getCount(), n3 = t3.listSemantics().filter((e2) => e2.startsWith("WEIGHTS_")).length, o3 = t3.getAttribute("WEIGHTS_0"), s3 = o3.getArray(), i3 = o3.getComponentType(), a3 = o3.getNormalized(), c3 = a3 ? i3 : void 0, l3 = a3 ? e.MathUtils.decodeNormalizedInt(1, i3) : Number.EPSILON, u2 = new Uint32Array(4 * n3).fill(0), f2 = s3.slice(0, 4 * n3).fill(0);
        for (let n4 = 0; n4 < r3; n4++) {
          Tt(t3, n4, "JOINTS", u2), Tt(t3, n4, "WEIGHTS", f2, c3);
          let r4 = Et(f2, c3);
          if (0 !== r4) {
            if (Math.abs(1 - r4) > l3) for (let t4 = 0; t4 < f2.length; t4++) if (a3) {
              const n5 = e.MathUtils.encodeNormalizedInt(f2[t4] / r4, i3);
              f2[t4] = e.MathUtils.decodeNormalizedInt(n5, i3);
            } else f2[t4] /= r4;
            if (r4 = Et(f2, c3), a3 && 1 !== r4) {
              for (let t4 = f2.length - 1; t4 >= 0; t4--) if (f2[t4] > 0) {
                f2[t4] += e.MathUtils.encodeNormalizedInt(1 - r4, i3);
                break;
              }
            }
            for (let e2 = f2.length - 1; e2 >= 0; e2--) 0 === f2[e2] && (u2[e2] = 0);
            At(t3, n4, "JOINTS", u2), At(t3, n4, "WEIGHTS", f2, c3);
          }
        }
      })(t2);
    }
    function Tt(t2, r2, n2, o2, s2) {
      let i2;
      const a2 = [0, 0, 0, 0];
      for (let c2 = 0; i2 = t2.getAttribute(`${n2}_${c2}`); c2++) {
        i2.getElement(r2, a2);
        for (let t3 = 0; t3 < 4; t3++) o2[4 * c2 + t3] = s2 ? e.MathUtils.encodeNormalizedInt(a2[t3], s2) : a2[t3];
      }
      return o2;
    }
    function At(t2, r2, n2, o2, s2) {
      let i2;
      const a2 = [0, 0, 0, 0];
      for (let c2 = 0; i2 = t2.getAttribute(`${n2}_${c2}`); c2++) {
        for (let t3 = 0; t3 < 4; t3++) a2[t3] = s2 ? e.MathUtils.decodeNormalizedInt(o2[4 * c2 + t3], s2) : o2[4 * c2 + t3];
        i2.setElement(r2, a2);
      }
    }
    function Et(t2, r2) {
      let n2 = 0;
      for (let o2 = 0; o2 < t2.length; o2++) n2 += r2 ? e.MathUtils.decodeNormalizedInt(t2[o2], r2) : t2[o2];
      return n2;
    }
    var St = "quantize";
    var Pt = [Int8Array, Int16Array, Int32Array];
    var { TRANSLATION: Mt, ROTATION: It, SCALE: vt, WEIGHTS: bt } = e.AnimationChannel.TargetPath;
    var Nt = [Mt, It, vt];
    var xt = { pattern: /.*/, quantizationVolume: "mesh", quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12, quantizeColor: 8, quantizeWeight: 8, quantizeGeneric: 12, normalizeWeights: true };
    function Rt(t2) {
      void 0 === t2 && (t2 = xt);
      const n2 = { ...xt, ...t2 };
      return n2.patternTargets = n2.patternTargets || n2.pattern, l(St, function(t3) {
        try {
          const o2 = t3.getLogger(), s2 = t3.getRoot();
          let i2;
          t3.createExtension(r.KHRMeshQuantization).setRequired(true), "scene" === n2.quantizationVolume && (i2 = wt((function(e2) {
            const t4 = e2[0];
            for (const r2 of e2) w(t4.min, t4.min, r2.min), O(t4.max, t4.max, r2.max);
            return t4;
          })(s2.listMeshes().map(_t))));
          for (const e2 of t3.getRoot().listMeshes()) {
            "mesh" === n2.quantizationVolume && (i2 = wt(_t(e2))), i2 && n2.pattern.test("POSITION") && (Ot(t3, e2, i2), zt(e2, 1 / i2.scale));
            for (const r2 of e2.listPrimitives()) {
              Ct(t3, r2, i2, n2);
              for (const e3 of r2.listTargets()) Ct(t3, e3, i2, n2);
            }
          }
          return Promise.resolve(t3.transform(Y({ propertyTypes: [e.PropertyType.ACCESSOR, e.PropertyType.SKIN, e.PropertyType.MATERIAL], keepAttributes: true, keepIndices: true, keepLeaves: true, keepSolidTextures: true }), B({ propertyTypes: [e.PropertyType.ACCESSOR, e.PropertyType.MATERIAL, e.PropertyType.SKIN], keepUniqueNames: true }))).then(function() {
            o2.debug(`${St}: Complete.`);
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }
    function Ct(t2, r2, n2, o2) {
      const s2 = r2 instanceof e.PrimitiveTarget, i2 = t2.getLogger();
      for (const t3 of r2.listSemantics()) {
        if (!s2 && !o2.pattern.test(t3)) continue;
        if (s2 && !o2.patternTargets.test(t3)) continue;
        const l2 = r2.getAttribute(t3), { bits: u2, ctor: f2 } = Ut(t3, l2, i2, o2);
        if (!f2) continue;
        if (u2 < 8 || u2 > 16) throw new Error(`${St}: Requires bits = 8\u201316.`);
        if (l2.getComponentSize() <= u2 / 8) continue;
        const g2 = l2.clone();
        if ("POSITION" === t3) {
          const t4 = n2.scale, o3 = [];
          r2 instanceof e.Primitive ? x(o3, Gt(n2)) : ((a2 = o3)[0] = (c2 = [1 / t4, 1 / t4, 1 / t4])[0], a2[1] = 0, a2[2] = 0, a2[3] = 0, a2[4] = 0, a2[5] = c2[1], a2[6] = 0, a2[7] = 0, a2[8] = 0, a2[9] = 0, a2[10] = c2[2], a2[11] = 0, a2[12] = 0, a2[13] = 0, a2[14] = 0, a2[15] = 1);
          for (let e2 = 0, t5 = [0, 0, 0], r3 = g2.getCount(); e2 < r3; e2++) g2.getElement(e2, t5), g2.setElement(e2, z(t5, t5, o3));
        }
        Ft(g2, f2, u2), r2.swap(l2, g2);
      }
      var a2, c2;
      if (o2.normalizeWeights && r2.getAttribute("WEIGHTS_0") && yt(r2, Infinity), r2 instanceof e.Primitive && r2.getIndices() && r2.listAttributes().length && r2.listAttributes()[0].getCount() < 65535) {
        const e2 = r2.getIndices();
        e2.setArray(new Uint16Array(e2.getArray()));
      }
    }
    function wt(e2) {
      const { min: t2, max: r2 } = e2, n2 = Math.max((r2[0] - t2[0]) / 2, (r2[1] - t2[1]) / 2, (r2[2] - t2[2]) / 2);
      return { offset: [t2[0] + (r2[0] - t2[0]) / 2, t2[1] + (r2[1] - t2[1]) / 2, t2[2] + (r2[2] - t2[2]) / 2], scale: n2 };
    }
    function Ot(t2, r2, n2) {
      const o2 = Gt(n2);
      for (const s2 of r2.listParents()) {
        if (!(s2 instanceof e.Node)) continue;
        const i2 = s2.listParents().filter((t3) => t3 instanceof e.AnimationChannel), a2 = i2.some((e2) => Nt.includes(e2.getTargetPath())), c2 = s2.listChildren().length > 0, l2 = s2.getSkin();
        if (l2) {
          s2.setSkin($t(l2, n2));
          continue;
        }
        const u2 = s2.getExtension("EXT_mesh_gpu_instancing");
        if (u2) {
          s2.setExtension("EXT_mesh_gpu_instancing", Lt(u2, n2));
          continue;
        }
        let f2;
        c2 || a2 ? (f2 = t2.createNode("").setMesh(r2), s2.addChild(f2).setMesh(null), i2.filter((e2) => e2.getTargetPath() === bt).forEach((e2) => e2.setTargetNode(f2))) : f2 = s2;
        const g2 = f2.getMatrix();
        R(g2, g2, o2), f2.setMatrix(g2);
      }
    }
    function $t(e2, t2) {
      e2 = e2.clone();
      const r2 = Gt(t2), n2 = e2.getInverseBindMatrices().clone(), o2 = [];
      for (let e3 = 0, t3 = n2.getCount(); e3 < t3; e3++) n2.getElement(e3, o2), R(o2, o2, r2), n2.setElement(e3, o2);
      return e2.setInverseBindMatrices(n2);
    }
    function Lt(t2, r2) {
      var n2, o2, s2;
      if (!t2.getAttribute("TRANSLATION") && !t2.getAttribute("ROTATION") && !t2.getAttribute("SCALE")) return t2;
      const i2 = null == (n2 = (t2 = t2.clone()).getAttribute("TRANSLATION")) ? void 0 : n2.clone(), a2 = null == (o2 = t2.getAttribute("ROTATION")) ? void 0 : o2.clone(), c2 = null == (s2 = t2.getAttribute("SCALE")) ? void 0 : s2.clone(), l2 = i2 || a2 || c2, u2 = [0, 0, 0], f2 = [0, 0, 0, 1], g2 = [1, 1, 1], p2 = [0, 0, 0], m2 = [0, 0, 0, 1], h2 = [1, 1, 1], d2 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], y2 = Gt(r2);
      for (let t3 = 0, r3 = l2.getCount(); t3 < r3; t3++) e.MathUtils.compose(i2 ? i2.getElement(t3, p2) : u2, a2 ? a2.getElement(t3, m2) : f2, c2 ? c2.getElement(t3, h2) : g2, d2), R(d2, d2, y2), e.MathUtils.decompose(d2, p2, m2, h2), i2 && i2.setElement(t3, p2), a2 && a2.setElement(t3, m2), c2 && c2.setElement(t3, h2);
      return i2 && t2.setAttribute("TRANSLATION", i2), a2 && t2.setAttribute("ROTATION", a2), c2 && t2.setAttribute("SCALE", c2), t2;
    }
    function zt(e2, t2) {
      for (const r2 of e2.listPrimitives()) {
        let e3 = r2.getMaterial();
        if (!e3) continue;
        let n2 = e3.getExtension("KHR_materials_volume");
        !n2 || n2.getThicknessFactor() <= 0 || (n2 = n2.clone().setThicknessFactor(n2.getThicknessFactor() * t2), e3 = e3.clone().setExtension("KHR_materials_volume", n2), r2.setMaterial(e3));
      }
    }
    function Ft(e2, t2, r2) {
      const n2 = new t2(e2.getArray().length), o2 = Pt.includes(t2) ? 1 : 0, s2 = r2 - o2, i2 = 8 * t2.BYTES_PER_ELEMENT - o2, a2 = Math.pow(2, s2) - 1, c2 = i2 - s2, l2 = 2 * s2 - i2, u2 = [o2 > 0 ? -1 : 0, 1];
      for (let t3 = 0, r3 = 0, o3 = []; t3 < e2.getCount(); t3++) {
        e2.getElement(t3, o3);
        for (let e3 = 0; e3 < o3.length; e3++) {
          let t4 = qt(o3[e3], u2);
          t4 = Math.round(Math.abs(t4) * a2), t4 = t4 << c2 | t4 >> l2, n2[r3++] = t4 * Math.sign(o3[e3]);
        }
      }
      e2.setArray(n2).setNormalized(true).setSparse(false);
    }
    function Ut(e2, t2, r2, n2) {
      const o2 = t2.getMinNormalized([]), s2 = t2.getMaxNormalized([]);
      let i2, a2;
      if ("POSITION" === e2) i2 = n2.quantizePosition, a2 = i2 <= 8 ? Int8Array : Int16Array;
      else if ("NORMAL" === e2 || "TANGENT" === e2) i2 = n2.quantizeNormal, a2 = i2 <= 8 ? Int8Array : Int16Array;
      else if (e2.startsWith("COLOR_")) i2 = n2.quantizeColor, a2 = i2 <= 8 ? Uint8Array : Uint16Array;
      else if (e2.startsWith("TEXCOORD_")) {
        if (o2.some((e3) => e3 < 0) || s2.some((e3) => e3 > 1)) return r2.warn(`${St}: Skipping ${e2}; out of [0,1] range.`), { bits: -1 };
        i2 = n2.quantizeTexcoord, a2 = i2 <= 8 ? Uint8Array : Uint16Array;
      } else {
        if (e2.startsWith("JOINTS_")) return i2 = Math.max(...t2.getMax([])) <= 255 ? 8 : 16, a2 = i2 <= 8 ? Uint8Array : Uint16Array, t2.getComponentSize() > i2 / 8 && t2.setArray(new a2(t2.getArray())), { bits: -1 };
        if (e2.startsWith("WEIGHTS_")) {
          if (o2.some((e3) => e3 < 0) || s2.some((e3) => e3 > 1)) return r2.warn(`${St}: Skipping ${e2}; out of [0,1] range.`), { bits: -1 };
          i2 = n2.quantizeWeight, a2 = i2 <= 8 ? Uint8Array : Uint16Array;
        } else {
          if (!e2.startsWith("_")) throw new Error(`${St}: Unexpected semantic, "${e2}".`);
          if (o2.some((e3) => e3 < -1) || s2.some((e3) => e3 > 1)) return r2.warn(`${St}: Skipping ${e2}; out of [-1,1] range.`), { bits: -1 };
          i2 = n2.quantizeGeneric, a2 = a2 = o2.some((e3) => e3 < 0) ? i2 <= 8 ? Int8Array : Int16Array : i2 <= 8 ? Uint8Array : Uint16Array;
        }
      }
      return { bits: i2, ctor: a2 };
    }
    function _t(e2) {
      const t2 = [], r2 = [];
      for (const n3 of e2.listPrimitives()) {
        const e3 = n3.getAttribute("POSITION");
        e3 && t2.push(e3);
        for (const e4 of n3.listTargets()) {
          const t3 = e4.getAttribute("POSITION");
          t3 && r2.push(t3);
        }
      }
      if (0 === t2.length) throw new Error(`${St}: Missing "POSITION" attribute.`);
      const n2 = kt(t2, 3);
      if (r2.length > 0) {
        const { min: e3, max: t3 } = kt(r2, 3);
        w(n2.min, n2.min, w(e3, $(e3, e3, 2), [0, 0, 0])), O(n2.max, n2.max, O(t3, $(t3, t3, 2), [0, 0, 0]));
      }
      return n2;
    }
    function kt(e2, t2) {
      const r2 = new Array(t2).fill(Infinity), n2 = new Array(t2).fill(-Infinity), o2 = [], s2 = [];
      for (const i2 of e2) {
        i2.getMinNormalized(o2), i2.getMaxNormalized(s2);
        for (let e3 = 0; e3 < t2; e3++) r2[e3] = Math.min(r2[e3], o2[e3]), n2[e3] = Math.max(n2[e3], s2[e3]);
      }
      return { min: r2, max: n2 };
    }
    function Gt(e2) {
      return n2 = e2.offset, g2 = (s2 = (r2 = [0, 0, 0, 1])[0]) * (l2 = s2 + s2), p2 = s2 * (u2 = (i2 = r2[1]) + i2), m2 = s2 * (f2 = (a2 = r2[2]) + a2), d2 = i2 * f2, T2 = (c2 = r2[3]) * l2, A2 = c2 * u2, E2 = c2 * f2, P2 = (o2 = [e2.scale, e2.scale, e2.scale])[1], M2 = o2[2], (t2 = [])[0] = (1 - ((h2 = i2 * u2) + (y2 = a2 * f2))) * (S2 = o2[0]), t2[1] = (p2 + E2) * S2, t2[2] = (m2 - A2) * S2, t2[3] = 0, t2[4] = (p2 - E2) * P2, t2[5] = (1 - (g2 + y2)) * P2, t2[6] = (d2 + T2) * P2, t2[7] = 0, t2[8] = (m2 + A2) * M2, t2[9] = (d2 - T2) * M2, t2[10] = (1 - (g2 + h2)) * M2, t2[11] = 0, t2[12] = n2[0], t2[13] = n2[1], t2[14] = n2[2], t2[15] = 1, t2;
      var t2, r2, n2, o2, s2, i2, a2, c2, l2, u2, f2, g2, p2, m2, h2, d2, y2, T2, A2, E2, S2, P2, M2;
    }
    function qt(e2, t2) {
      return Math.min(Math.max(e2, t2[0]), t2[1]);
    }
    var Bt = { level: "high", ...xt };
    var Dt = "meshopt";
    var jt = "undefined" != typeof Symbol ? Symbol.iterator || (Symbol.iterator = /* @__PURE__ */ Symbol("Symbol.iterator")) : "@@iterator";
    function Ht(e2, t2, r2) {
      if (!e2.s) {
        if (r2 instanceof Wt) {
          if (!r2.s) return void (r2.o = Ht.bind(null, e2, t2));
          1 & t2 && (t2 = r2.s), r2 = r2.v;
        }
        if (r2 && r2.then) return void r2.then(Ht.bind(null, e2, t2), Ht.bind(null, e2, 2));
        e2.s = t2, e2.v = r2;
        const n2 = e2.o;
        n2 && n2(e2);
      }
    }
    var Wt = /* @__PURE__ */ (function() {
      function e2() {
      }
      return e2.prototype.then = function(t2, r2) {
        const n2 = new e2(), o2 = this.s;
        if (o2) {
          const e3 = 1 & o2 ? t2 : r2;
          if (e3) {
            try {
              Ht(n2, 1, e3(this.v));
            } catch (e4) {
              Ht(n2, 2, e4);
            }
            return n2;
          }
          return this;
        }
        return this.o = function(e3) {
          try {
            const o3 = e3.v;
            1 & e3.s ? Ht(n2, 1, t2 ? t2(o3) : o3) : r2 ? Ht(n2, 1, r2(o3)) : Ht(n2, 2, o3);
          } catch (e4) {
            Ht(n2, 2, e4);
          }
        }, n2;
      }, e2;
    })();
    function Xt(e2) {
      return e2 instanceof Wt && 1 & e2.s;
    }
    var Kt = "metalRough";
    var Vt = "unweld";
    function Jt(e2) {
      return l(Vt, (e3) => {
        const t2 = e3.getLogger(), r2 = /* @__PURE__ */ new Map();
        for (const n2 of e3.getRoot().listMeshes()) for (const e4 of n2.listPrimitives()) {
          const n3 = e4.getIndices();
          if (!n3) continue;
          const o2 = e4.getAttribute("POSITION").getCount();
          for (const o3 of e4.listAttributes()) e4.swap(o3, Zt(o3, n3, t2, r2)), 1 === o3.listParents().length && o3.dispose();
          for (const o3 of e4.listTargets()) for (const e5 of o3.listAttributes()) o3.swap(e5, Zt(e5, n3, t2, r2)), 1 === e5.listParents().length && e5.dispose();
          const s2 = e4.getAttribute("POSITION").getCount();
          t2.debug(`${Vt}: ${h(o2, s2)} vertices.`), e4.setIndices(null), 1 === n3.listParents().length && n3.dispose();
        }
        t2.debug(`${Vt}: Complete.`);
      });
    }
    function Zt(e2, t2, r2, n2) {
      if (n2.has(e2) && n2.get(e2).has(t2)) return r2.debug(`${Vt}: Cache hit for reused attribute, "${e2.getName()}".`), n2.get(e2).get(t2);
      const o2 = e2.clone(), s2 = e2.getArray().constructor;
      o2.setArray(new s2(t2.getCount() * e2.getElementSize()));
      const i2 = [];
      for (let r3 = 0; r3 < t2.getCount(); r3++) o2.setElement(r3, e2.getElement(t2.getScalar(r3), i2));
      return n2.has(e2) || n2.set(e2, /* @__PURE__ */ new Map()), n2.get(e2).set(t2, o2), o2;
    }
    var Qt = "normals";
    var Yt = { overwrite: false };
    function er(e2, t2, r2) {
      const n2 = [t2[0] - e2[0], t2[1] - e2[1], t2[2] - e2[2]], o2 = [r2[0] - e2[0], r2[1] - e2[1], r2[2] - e2[2]];
      return L([0, 0, 0], [n2[1] * o2[2] - n2[2] * o2[1], n2[2] * o2[0] - n2[0] * o2[2], n2[0] * o2[1] - n2[1] * o2[0]]);
    }
    var tr = "palette";
    var rr = { blockSize: 4, min: 2 };
    function nr(e2) {
      const t2 = Math.round(255 * e2).toString(16);
      return 1 === t2.length ? "0" + t2 : t2;
    }
    function or(t2) {
      return e.ColorUtils.convertLinearToSRGB(t2, t2), t2.map(nr).join("");
    }
    function sr(e2) {
      return Math.pow(2, Math.ceil(Math.log(e2) / Math.LN2));
    }
    function ir(e2, t2, r2, n2) {
      for (let o2 = 0; o2 < n2; o2++) for (let s2 = 0; s2 < n2; s2++) e2.set(t2 * n2 + o2, s2, 0, 255 * r2[0]), e2.set(t2 * n2 + o2, s2, 1, 255 * r2[1]), e2.set(t2 * n2 + o2, s2, 2, 255 * r2[2]), e2.set(t2 * n2 + o2, s2, 3, 255 * r2[3]);
    }
    var ar = "partition";
    var cr = { animations: true, meshes: true };
    function lr(e2, t2) {
      let r2 = `${e2}.bin`, n2 = 1;
      for (; t2.has(r2); ) r2 = `${e2}_${n2++}.bin`;
      return r2;
    }
    var ur;
    function fr(e2, t2, r2) {
      for (let n2 = 0, o2 = r2.length; n2 < o2; n2++) r2[n2] = e2[t2 * o2 + n2];
      return r2;
    }
    function gr(e2, t2, r2) {
      for (let n2 = 0, o2 = r2.length; n2 < o2; n2++) e2[t2 * o2 + n2] = r2[n2];
    }
    function pr(e2, t2, r2 = 0) {
      if (e2.length !== t2.length) return false;
      for (let n2 = 0; n2 < e2.length; n2++) if (Math.abs(e2[n2] - t2[n2]) > r2) return false;
      return true;
    }
    function mr(e2, t2, r2) {
      return e2 * (1 - r2) + t2 * r2;
    }
    function hr(e2, t2, r2, n2) {
      for (let o2 = 0; o2 < t2.length; o2++) e2[o2] = mr(t2[o2], r2[o2], n2);
      return e2;
    }
    function dr(e2, t2, r2, n2) {
      let o2, s2, i2, a2, c2, l2 = t2[0], u2 = t2[1], f2 = t2[2], g2 = t2[3], p2 = r2[0], m2 = r2[1], h2 = r2[2], d2 = r2[3];
      return s2 = l2 * p2 + u2 * m2 + f2 * h2 + g2 * d2, s2 < 0 && (s2 = -s2, p2 = -p2, m2 = -m2, h2 = -h2, d2 = -d2), 1 - s2 > 1e-6 ? (o2 = Math.acos(s2), i2 = Math.sin(o2), a2 = Math.sin((1 - n2) * o2) / i2, c2 = Math.sin(n2 * o2) / i2) : (a2 = 1 - n2, c2 = n2), e2[0] = a2 * l2 + c2 * p2, e2[1] = a2 * u2 + c2 * m2, e2[2] = a2 * f2 + c2 * h2, e2[3] = a2 * g2 + c2 * d2, e2;
    }
    function yr(e2, t2) {
      const r2 = (function(e3, t3) {
        return e3[0] * t3[0] + e3[1] * t3[1] + e3[2] * t3[2] + e3[3] * t3[3];
      })(e2, t2);
      return Math.acos(2 * r2 * r2 - 1);
    }
    !(function(e2) {
      e2[e2.STEP = 0] = "STEP", e2[e2.LERP = 1] = "LERP", e2[e2.SLERP = 2] = "SLERP";
    })(ur || (ur = {}));
    var Tr = "resample";
    var Ar = new Float32Array(0);
    var Er = { ready: Promise.resolve(), resample: function(e2, t2, r2, n2 = 1e-4) {
      const o2 = t2.length / e2.length, s2 = new Array(o2).fill(0), i2 = new Array(o2).fill(0), a2 = new Array(o2).fill(0), c2 = new Array(o2).fill(0), l2 = e2.length - 1;
      let u2 = 1;
      for (let o3 = 1; o3 < l2; ++o3) {
        const l3 = e2[u2 - 1], f2 = e2[o3], g2 = e2[o3 + 1], p2 = (f2 - l3) / (g2 - l3);
        let m2 = false;
        if (f2 !== g2 && (1 !== o3 || f2 !== e2[0])) if (fr(t2, u2 - 1, c2), fr(t2, o3, i2), fr(t2, o3 + 1, a2), "slerp" === r2) {
          const e3 = dr(s2, c2, a2, p2), t3 = yr(c2, i2) + yr(i2, a2);
          m2 = !pr(i2, e3, n2) || t3 + Number.EPSILON >= Math.PI;
        } else "lerp" === r2 ? m2 = !pr(i2, hr(s2, c2, a2, p2), n2) : "step" === r2 && (m2 = !pr(i2, c2) || !pr(i2, a2));
        m2 && (o3 !== u2 && (e2[u2] = e2[o3], gr(t2, u2, fr(t2, o3, s2))), u2++);
      }
      return l2 > 0 && (e2[u2] = e2[l2], gr(t2, u2, fr(t2, l2, s2)), u2++), u2;
    }, tolerance: 1e-4 };
    function Sr(t2, r2, n2) {
      if (t2 instanceof Float32Array) return t2.slice();
      const o2 = new Float32Array(t2);
      if (!n2) return o2;
      for (let t3 = 0; t3 < o2.length; t3++) o2[t3] = e.MathUtils.decodeNormalizedInt(o2[t3], r2);
      return o2;
    }
    function Pr(t2, r2, n2) {
      if (r2 === e.Accessor.ComponentType.FLOAT) return t2.slice();
      const o2 = new (0, e.ComponentTypeToTypedArray[r2])(t2.length);
      for (let s2 = 0; s2 < o2.length; s2++) o2[s2] = n2 ? e.MathUtils.encodeNormalizedInt(t2[s2], r2) : t2[s2];
      return o2;
    }
    var Mr = "sequence";
    var Ir = { name: "", fps: 10, pattern: /.*/, sort: true };
    var vr = "simplify";
    var br = { ratio: 0, error: 1e-4, lockBorder: false };
    function Nr(t2, r2, n2) {
      const o2 = { ...br, ...n2 }, s2 = o2.simplifier, i2 = t2.getLogger(), a2 = r2.getAttribute("POSITION"), c2 = r2.getIndices(), l2 = c2.getCount(), u2 = a2.getCount();
      let f2 = a2.getArray(), g2 = c2.getArray();
      if (a2.getComponentType() !== e.Accessor.ComponentType.FLOAT) if (a2.getNormalized()) {
        const e2 = f2, t3 = new Float32Array(e2.length);
        for (let r3 = 0, n3 = a2.getCount(), o3 = []; r3 < n3; r3++) o3 = a2.getElement(r3, o3), a2.setArray(t3).setElement(r3, o3).setArray(e2);
        f2 = t3;
      } else f2 = new Float32Array(f2);
      c2.getComponentType() !== e.Accessor.ComponentType.UNSIGNED_INT && (g2 = new Uint32Array(g2));
      const p2 = 3 * Math.floor(o2.ratio * l2 / 3), [m2, T2] = s2.simplify(g2, f2, 3, p2, o2.error, o2.lockBorder ? ["LockBorder"] : []), [E2, S2] = s2.compactMesh(m2);
      i2.debug(`${vr}: ${h(a2.getCount(), S2)} vertices, error: ${T2.toFixed(4)}.`);
      for (const e2 of d(r2)) {
        const t3 = e2.clone();
        A(t3, E2, S2), y(r2, e2, t3), 1 === e2.listParents().length && e2.dispose();
      }
      const P2 = c2.clone();
      return P2.setArray(u2 <= 65534 ? new Uint16Array(m2) : m2), r2.setIndices(P2), 1 === c2.listParents().length && c2.dispose(), r2;
    }
    var xr = "sparse";
    var Rr = { ratio: 1 / 3 };
    var Cr = "undefined" != typeof Symbol ? Symbol.iterator || (Symbol.iterator = /* @__PURE__ */ Symbol("Symbol.iterator")) : "@@iterator";
    function wr(e2, t2, r2) {
      if (!e2.s) {
        if (r2 instanceof Or) {
          if (!r2.s) return void (r2.o = wr.bind(null, e2, t2));
          1 & t2 && (t2 = r2.s), r2 = r2.v;
        }
        if (r2 && r2.then) return void r2.then(wr.bind(null, e2, t2), wr.bind(null, e2, 2));
        e2.s = t2, e2.v = r2;
        const n2 = e2.o;
        n2 && n2(e2);
      }
    }
    var Or = /* @__PURE__ */ (function() {
      function e2() {
      }
      return e2.prototype.then = function(t2, r2) {
        const n2 = new e2(), o2 = this.s;
        if (o2) {
          const e3 = 1 & o2 ? t2 : r2;
          if (e3) {
            try {
              wr(n2, 1, e3(this.v));
            } catch (e4) {
              wr(n2, 2, e4);
            }
            return n2;
          }
          return this;
        }
        return this.o = function(e3) {
          try {
            const o3 = e3.v;
            1 & e3.s ? wr(n2, 1, t2 ? t2(o3) : o3) : r2 ? wr(n2, 1, r2(o3)) : wr(n2, 2, o3);
          } catch (e4) {
            wr(n2, 2, e4);
          }
        }, n2;
      }, e2;
    })();
    function $r(e2) {
      return e2 instanceof Or && 1 & e2.s;
    }
    var Lr = "textureResize";
    var zr;
    exports2.TextureResizeFilter = void 0, (zr = exports2.TextureResizeFilter || (exports2.TextureResizeFilter = {})).LANCZOS3 = "lanczos3", zr.LANCZOS2 = "lanczos2";
    var Fr = { size: [2048, 2048], filter: exports2.TextureResizeFilter.LANCZOS3, pattern: null, slots: null };
    var Ur = function(r2, n2) {
      try {
        const o2 = { ...qr, ...n2 }, i2 = o2.encoder, c2 = Br(r2), l2 = o2.targetFormat || c2, u2 = r2.getMimeType(), f2 = `image/${l2}`, g2 = r2.getImage();
        return Promise.resolve(i2 ? (function(t2, r3, n3, o3) {
          try {
            const r4 = o3.encoder;
            let s2 = {};
            const i3 = Dr(n3);
            switch (i3) {
              case "jpeg":
                s2 = { quality: o3.quality };
                break;
              case "png":
                s2 = { quality: o3.quality, effort: jr(o3.effort, 100, 10) };
                break;
              case "webp":
                s2 = { quality: o3.quality, effort: jr(o3.effort, 100, 6), lossless: o3.lossless, nearLossless: o3.nearLossless };
                break;
              case "avif":
                s2 = { quality: o3.quality, effort: jr(o3.effort, 100, 9), lossless: o3.lossless };
            }
            const a2 = r4(t2).toFormat(i3, s2);
            o3.resize && a2.resize(o3.resize[0], o3.resize[1], { fit: "inside", kernel: o3.resizeFilter, withoutEnlargement: true });
            const c3 = e.BufferUtils.toView;
            return Promise.resolve(a2.toBuffer()).then(function(t3) {
              return c3.call(e.BufferUtils, t3);
            });
          } catch (e2) {
            return Promise.reject(e2);
          }
        })(g2, 0, f2, o2) : (function(e2, r3, n3, o3) {
          try {
            return Promise.resolve(t.getPixels(e2, r3)).then(function(e3) {
              if (o3.resize) {
                const [r4, i3] = e3.shape, c3 = P([r4, i3], o3.resize), l3 = a.default(new Uint8Array(c3[0] * c3[1] * 4), [...c3, 4]);
                return o3.resizeFilter === exports2.TextureResizeFilter.LANCZOS3 ? s.lanczos3(e3, l3) : s.lanczos2(e3, l3), t.savePixels(l3, n3);
              }
              return t.savePixels(e3, n3);
            });
          } catch (e3) {
            return Promise.reject(e3);
          }
        })(g2, u2, f2, o2)).then(function(t2) {
          if (u2 === f2 && t2.byteLength >= g2.byteLength && !o2.resize) ;
          else if (u2 === f2) r2.setImage(t2);
          else {
            const n3 = e.ImageUtils.mimeTypeToExtension(u2), o3 = e.ImageUtils.mimeTypeToExtension(f2), s2 = r2.getURI().replace(new RegExp(`\\.${n3}$`), `.${o3}`);
            r2.setImage(t2).setMimeType(f2).setURI(s2);
          }
        });
      } catch (e2) {
        return Promise.reject(e2);
      }
    };
    var _r = "textureCompress";
    var kr = ["jpeg", "png", "webp", "avif"];
    var Gr = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    var qr = { resizeFilter: exports2.TextureResizeFilter.LANCZOS3, pattern: void 0, formats: void 0, slots: void 0, quality: void 0, effort: void 0, lossless: false, nearLossless: false };
    function Br(e2) {
      return Dr(e2.getMimeType());
    }
    function Dr(e2) {
      const t2 = e2.split("/").pop();
      if (!t2 || !kr.includes(t2)) throw new Error(`Unknown MIME type "${e2}".`);
      return t2;
    }
    function jr(e2, t2, r2) {
      if (null != e2) return Math.round(e2 / t2 * r2);
    }
    var Hr = "tangents";
    var Wr = { overwrite: false };
    function Xr(e2) {
      const t2 = e2.getMaterial();
      if (!t2) return "TEXCOORD_0";
      const r2 = t2.getNormalTextureInfo();
      if (!r2) return "TEXCOORD_0";
      const n2 = `TEXCOORD_${r2.getTexCoord()}`;
      return e2.getAttribute(n2) ? n2 : "TEXCOORD_0";
    }
    function Kr(t2, r2, n2, o2, s2) {
      return t2.getMode() === e.Primitive.Mode.TRIANGLES && t2.getAttribute("POSITION") && t2.getAttribute("NORMAL") && t2.getAttribute("TEXCOORD_0") ? t2.getAttribute("TANGENT") && !s2 ? (r2.debug(`${Hr}: Skipping primitive ${o2} of mesh "${n2}": TANGENT found.`), false) : !t2.getIndices() || (r2.warn(`${Hr}: Skipping primitive ${o2} of mesh "${n2}": primitives must be unwelded.`), false) : (r2.debug(`${Hr}: Skipping primitive ${o2} of mesh "${n2}": primitives must have attributes=[POSITION, NORMAL, TEXCOORD_0] and mode=TRIANGLES.`), false);
    }
    var Vr = "unpartition";
    var Jr = "vertexColorSpace";
    var Zr = Qr;
    function Qr(e2) {
      return l(Jr, (t2) => {
        const r2 = t2.getLogger(), n2 = (e2.inputColorSpace || e2.inputEncoding || "").toLowerCase();
        if ("srgb-linear" === n2) return void r2.info(`${Jr}: Vertex colors already linear. Skipping conversion.`);
        if ("srgb" !== n2) return void r2.error(`${Jr}: Unknown input color space "${n2}" \u2013 should be "srgb" or "srgb-linear". Skipping conversion.`);
        const o2 = /* @__PURE__ */ new Set();
        function s2(e3) {
          return e3 < 0.04045 ? 0.0773993808 * e3 : Math.pow(0.9478672986 * e3 + 0.0521327014, 2.4);
        }
        function i2(e3) {
          const t3 = [0, 0, 0];
          let r3;
          for (let n3 = 0; r3 = e3.getAttribute(`COLOR_${n3}`); n3++) if (!o2.has(r3)) {
            for (let e4 = 0; e4 < r3.getCount(); e4++) r3.getElement(e4, t3), t3[0] = s2(t3[0]), t3[1] = s2(t3[1]), t3[2] = s2(t3[2]), r3.setElement(e4, t3);
            o2.add(r3);
          }
        }
        t2.getRoot().listMeshes().forEach((e3) => e3.listPrimitives().forEach(i2)), r2.debug(`${Jr}: Complete.`);
      });
    }
    exports2.DRACO_DEFAULTS = ze, exports2.FLATTEN_DEFAULTS = {}, exports2.JOIN_DEFAULTS = ct, exports2.MESHOPT_DEFAULTS = Bt, exports2.PALETTE_DEFAULTS = rr, exports2.QUANTIZE_DEFAULTS = xt, exports2.SIMPLIFY_DEFAULTS = br, exports2.TEXTURE_COMPRESS_DEFAULTS = qr, exports2.TEXTURE_COMPRESS_SUPPORTED_FORMATS = kr, exports2.TEXTURE_RESIZE_DEFAULTS = Fr, exports2.WELD_DEFAULTS = ge, exports2.center = function(t2) {
      void 0 === t2 && (t2 = I);
      const r2 = { ...I, ...t2 };
      return l(M, (t3) => {
        const n2 = t3.getLogger(), o2 = t3.getRoot(), s2 = o2.listAnimations().length > 0 || o2.listSkins().length > 0;
        t3.getRoot().listScenes().forEach((i2, a2) => {
          let c2;
          if (n2.debug(`${M}: Scene ${a2 + 1} / ${o2.listScenes().length}.`), "string" == typeof r2.pivot) {
            const t4 = e.getBounds(i2);
            c2 = [(t4.max[0] - t4.min[0]) / 2 + t4.min[0], (t4.max[1] - t4.min[1]) / 2 + t4.min[1], (t4.max[2] - t4.min[2]) / 2 + t4.min[2]], "above" === r2.pivot && (c2[1] = t4.max[1]), "below" === r2.pivot && (c2[1] = t4.min[1]);
          } else c2 = r2.pivot;
          n2.debug(`${M}: Pivot "${c2.join(", ")}".`);
          const l2 = [-1 * c2[0], -1 * c2[1], -1 * c2[2]];
          if (s2) {
            n2.debug(`${M}: Model contains animation or skin. Adding a wrapper node.`);
            const e2 = t3.createNode("Pivot").setTranslation(l2);
            i2.listChildren().forEach((t4) => e2.addChild(t4)), i2.addChild(e2);
          } else n2.debug(`${M}: Skipping wrapper, offsetting all root nodes.`), i2.listChildren().forEach((e2) => {
            const t4 = e2.getTranslation();
            e2.setTranslation([t4[0] + l2[0], t4[1] + l2[1], t4[2] + l2[2]]);
          });
        }), n2.debug(`${M}: Complete.`);
      });
    }, exports2.clearNodeParent = b, exports2.clearNodeTransform = function(t2) {
      const r2 = t2.getMesh(), n2 = t2.getMatrix();
      r2 && !e.MathUtils.eq(n2, Ce) && Re(r2, n2);
      for (const e2 of t2.listChildren()) {
        const t3 = e2.getMatrix();
        R(t3, t3, n2), e2.setMatrix(t3);
      }
      return t2.setMatrix(Ce);
    }, exports2.colorspace = Zr, exports2.compressTexture = Ur, exports2.createTransform = l, exports2.dedup = B, exports2.dequantize = function(e2) {
      void 0 === e2 && (e2 = Oe);
      const t2 = { ...Oe, ...e2 };
      return l(we, (e3) => {
        const n2 = e3.getLogger();
        for (const r2 of e3.getRoot().listMeshes()) for (const e4 of r2.listPrimitives()) $e(e4, t2);
        e3.createExtension(r.KHRMeshQuantization).dispose(), n2.debug(`${we}: Complete.`);
      });
    }, exports2.dequantizePrimitive = $e, exports2.draco = function(e2) {
      void 0 === e2 && (e2 = ze);
      const t2 = { ...ze, ...e2 };
      return l("draco", function(e3) {
        try {
          return Promise.resolve(e3.transform(pe({ tolerance: 0 }))).then(function() {
            e3.createExtension(r.KHRDracoMeshCompression).setRequired(true).setEncoderOptions({ method: "edgebreaker" === t2.method ? r.KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER : r.KHRDracoMeshCompression.EncoderMethod.SEQUENTIAL, encodeSpeed: t2.encodeSpeed, decodeSpeed: t2.decodeSpeed, quantizationBits: { POSITION: t2.quantizePosition, NORMAL: t2.quantizeNormal, COLOR: t2.quantizeColor, TEX_COORD: t2.quantizeTexcoord, GENERIC: t2.quantizeGeneric }, quantizationVolume: t2.quantizationVolume });
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      });
    }, exports2.flatten = function(t2) {
      return l(Fe, function(t3) {
        try {
          const r2 = t3.getRoot(), n2 = t3.getLogger(), o2 = /* @__PURE__ */ new Set();
          for (const e2 of r2.listSkins()) for (const t4 of e2.listJoints()) o2.add(t4);
          const s2 = /* @__PURE__ */ new Set();
          for (const e2 of r2.listAnimations()) for (const t4 of e2.listChannels()) {
            const e3 = t4.getTargetNode();
            e3 && "weights" !== t4.getTargetPath() && s2.add(e3);
          }
          const i2 = /* @__PURE__ */ new Set(), a2 = /* @__PURE__ */ new Set();
          for (const e2 of r2.listScenes()) e2.traverse((e3) => {
            const t4 = e3.getParentNode();
            t4 && ((o2.has(t4) || i2.has(t4)) && i2.add(e3), (s2.has(t4) || a2.has(t4)) && a2.add(e3));
          });
          for (const e2 of r2.listScenes()) e2.traverse((e3) => {
            s2.has(e3) || i2.has(e3) || a2.has(e3) || b(e3);
          });
          return s2.size && n2.debug(`${Fe}: Flattening node hierarchies with TRS animation not yet supported.`), Promise.resolve(t3.transform(Y({ propertyTypes: [e.PropertyType.NODE], keepLeaves: false }))).then(function() {
            n2.debug(`${Fe}: Complete.`);
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }, exports2.getGLPrimitiveCount = f, exports2.getNodeScene = function(e2) {
      return v(e2)[0] || null;
    }, exports2.getTextureChannelMask = pt, exports2.getTextureColorSpace = W, exports2.inspect = function(e2) {
      return { scenes: Ue(e2), meshes: _e(e2), materials: ke(e2), textures: Ge(e2), animations: qe(e2) };
    }, exports2.instance = function(t2) {
      void 0 === t2 && (t2 = Xe);
      const n2 = { ...Xe, ...t2 };
      return l(We, (t3) => {
        const o2 = t3.getLogger(), s2 = t3.getRoot();
        if (s2.listAnimations().length) return o2.warn(`${We}: Instancing is not currently supported for animated models.`), void o2.debug(`${We}: Complete.`);
        const i2 = t3.createExtension(r.EXTMeshGPUInstancing);
        let a2 = 0, c2 = 0;
        for (const r2 of s2.listScenes()) {
          const s3 = /* @__PURE__ */ new Map();
          r2.traverse((e2) => {
            const t4 = e2.getMesh();
            t4 && s3.set(t4, (s3.get(t4) || /* @__PURE__ */ new Set()).add(e2));
          });
          const l2 = [];
          for (const u2 of Array.from(s3.keys())) {
            const f2 = Array.from(s3.get(u2));
            if (f2.length < n2.min) continue;
            if (f2.some((e2) => e2.getSkin())) continue;
            if (u2.listPrimitives().some(Ve) && f2.some(Je)) continue;
            const g2 = Ze(t3, i2, u2, f2.length), p2 = g2.getAttribute("TRANSLATION"), m2 = g2.getAttribute("ROTATION"), h2 = g2.getAttribute("SCALE"), d2 = t3.createNode().setMesh(u2).setExtension("EXT_mesh_gpu_instancing", g2);
            r2.addChild(d2);
            let y2 = false, T2 = false, A2 = false;
            for (let t4 = 0; t4 < f2.length; t4++) {
              let r3, n3, o3;
              const s4 = f2[t4];
              p2.setElement(t4, r3 = s4.getWorldTranslation()), m2.setElement(t4, n3 = s4.getWorldRotation()), h2.setElement(t4, o3 = s4.getWorldScale()), e.MathUtils.eq(r3, [0, 0, 0]) || (y2 = true), e.MathUtils.eq(n3, [0, 0, 0, 1]) || (T2 = true), e.MathUtils.eq(o3, [1, 1, 1]) || (A2 = true), s4.setMesh(null), l2.push(s4);
            }
            y2 || p2.dispose(), T2 || m2.dispose(), A2 || h2.dispose(), Ke(l2, o2), a2++, c2 += f2.length;
          }
        }
        o2.info(a2 > 0 ? `${We}: Created ${a2} batches, with ${c2} total instances.` : `${We}: No meshes with >=${n2.min} parent nodes were found.`), 0 === i2.listProperties().length && i2.dispose(), o2.debug(`${We}: Complete.`);
      });
    }, exports2.isTransformPending = u, exports2.join = function(e2) {
      void 0 === e2 && (e2 = ct);
      const t2 = { ...ct, ...e2 };
      return l(tt, function(e3) {
        try {
          const r2 = e3.getRoot(), n2 = e3.getLogger();
          for (const n3 of r2.listScenes()) lt(e3, n3, t2), n3.traverse((r3) => lt(e3, r3, t2));
          return Promise.resolve(e3.transform(Y({ propertyTypes: [nt, ot, st, it], keepAttributes: true, keepIndices: true, keepLeaves: false }))).then(function() {
            n2.debug(`${tt}: Complete.`);
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      });
    }, exports2.joinPrimitives = Ye, exports2.listNodeScenes = v, exports2.listTextureChannels = function(t2) {
      const r2 = pt(t2), n2 = [];
      return r2 & e.TextureChannel.R && n2.push(e.TextureChannel.R), r2 & e.TextureChannel.G && n2.push(e.TextureChannel.G), r2 & e.TextureChannel.B && n2.push(e.TextureChannel.B), r2 & e.TextureChannel.A && n2.push(e.TextureChannel.A), n2;
    }, exports2.listTextureInfo = function(t2) {
      const r2 = t2.getGraph(), n2 = /* @__PURE__ */ new Set();
      for (const o2 of r2.listParentEdges(t2)) {
        const t3 = o2.getParent(), s2 = o2.getName() + "Info";
        for (const o3 of r2.listChildEdges(t3)) {
          const t4 = o3.getChild();
          t4 instanceof e.TextureInfo && o3.getName() === s2 && n2.add(t4);
        }
      }
      return Array.from(n2);
    }, exports2.listTextureInfoByMaterial = X, exports2.listTextureSlots = K, exports2.meshopt = function(e2) {
      const t2 = { ...Bt, ...e2 }, n2 = t2.encoder;
      if (!n2) throw new Error(`${Dt}: encoder dependency required \u2014 install "meshoptimizer".`);
      return l(Dt, function(e3) {
        try {
          let o2, s2, i2 = t2.quantizeNormal;
          return "medium" === t2.level ? (o2 = /.*/, s2 = /.*/) : (o2 = /^(POSITION|TEXCOORD|JOINTS|WEIGHTS)(_\d+)?$/, s2 = /^(POSITION|TEXCOORD|JOINTS|WEIGHTS|NORMAL|TANGENT)(_\d+)?$/, i2 = Math.min(i2, 8)), Promise.resolve(e3.transform(dt({ encoder: n2, target: "size" }), Rt({ ...t2, pattern: o2, patternTargets: s2, quantizeNormal: i2 }))).then(function() {
            e3.createExtension(r.EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: "medium" === t2.level ? r.EXTMeshoptCompression.EncoderMethod.QUANTIZE : r.EXTMeshoptCompression.EncoderMethod.FILTER });
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      });
    }, exports2.metalRough = function(e2) {
      return l(Kt, function(e3) {
        try {
          let t3 = function() {
            i2.dispose();
            for (const e4 of a2) e4 && 1 === e4.listParents().length && e4.dispose();
            n2.debug(`${Kt}: Complete.`);
          };
          var t2 = t3;
          const n2 = e3.getLogger();
          if (!e3.getRoot().listExtensionsUsed().map((e4) => e4.extensionName).includes("KHR_materials_pbrSpecularGlossiness")) return n2.warn(`${Kt}: KHR_materials_pbrSpecularGlossiness not found on document.`), Promise.resolve();
          const o2 = e3.createExtension(r.KHRMaterialsIOR), s2 = e3.createExtension(r.KHRMaterialsSpecular), i2 = e3.createExtension(r.KHRMaterialsPBRSpecularGlossiness), a2 = /* @__PURE__ */ new Set(), l2 = (function(e4, t4, r2) {
            if ("function" == typeof e4[jt]) {
              var n3, o3, s3, i3 = e4[jt]();
              if ((function e5(r3) {
                try {
                  for (; !(n3 = i3.next()).done; ) if ((r3 = t4(n3.value)) && r3.then) {
                    if (!Xt(r3)) return void r3.then(e5, s3 || (s3 = Ht.bind(null, o3 = new Wt(), 2)));
                    r3 = r3.v;
                  }
                  o3 ? Ht(o3, 1, r3) : o3 = r3;
                } catch (e6) {
                  Ht(o3 || (o3 = new Wt()), 2, e6);
                }
              })(), i3.return) {
                var a3 = function(e5) {
                  try {
                    n3.done || i3.return();
                  } catch (e6) {
                  }
                  return e5;
                };
                if (o3 && o3.then) return o3.then(a3, function(e5) {
                  throw a3(e5);
                });
                a3();
              }
              return o3;
            }
            if (!("length" in e4)) throw new TypeError("Object is not iterable");
            for (var c2 = [], l3 = 0; l3 < e4.length; l3++) c2.push(e4[l3]);
            return (function(e5, t5, r3) {
              var n4, o4, s4 = -1;
              return (function r4(i4) {
                try {
                  for (; ++s4 < e5.length; ) if ((i4 = t5(s4)) && i4.then) {
                    if (!Xt(i4)) return void i4.then(r4, o4 || (o4 = Ht.bind(null, n4 = new Wt(), 2)));
                    i4 = i4.v;
                  }
                  n4 ? Ht(n4, 1, i4) : n4 = i4;
                } catch (e6) {
                  Ht(n4 || (n4 = new Wt()), 2, e6);
                }
              })(), n4;
            })(c2, function(e5) {
              return t4(c2[e5]);
            });
          })(e3.getRoot().listMaterials(), function(t4) {
            function r2() {
              t4.setExtension("KHR_materials_pbrSpecularGlossiness", null);
            }
            const n3 = t4.getExtension("KHR_materials_pbrSpecularGlossiness");
            if (!n3) return;
            const i3 = s2.createSpecular().setSpecularFactor(1).setSpecularColorFactor(n3.getSpecularFactor());
            a2.add(n3.getSpecularGlossinessTexture()), a2.add(t4.getBaseColorTexture()), a2.add(t4.getMetallicRoughnessTexture()), t4.setBaseColorFactor(n3.getDiffuseFactor()).setMetallicFactor(0).setRoughnessFactor(1).setExtension("KHR_materials_ior", o2.createIOR().setIOR(1e3)).setExtension("KHR_materials_specular", i3);
            const l3 = n3.getDiffuseTexture();
            l3 && (t4.setBaseColorTexture(l3), t4.getBaseColorTextureInfo().copy(n3.getDiffuseTextureInfo()));
            const u2 = n3.getSpecularGlossinessTexture(), f2 = (function() {
              if (u2) {
                const r3 = n3.getSpecularGlossinessTextureInfo(), o3 = e3.createTexture();
                return Promise.resolve(c(u2, o3, (e4, t5, r4) => {
                  e4.set(t5, r4, 3, 255);
                })).then(function() {
                  i3.setSpecularTexture(o3), i3.setSpecularColorTexture(o3), i3.getSpecularTextureInfo().copy(r3), i3.getSpecularColorTextureInfo().copy(r3);
                  const s3 = n3.getGlossinessFactor(), a3 = e3.createTexture();
                  return Promise.resolve(c(u2, a3, (e4, t5, r4) => {
                    const n4 = 255 - Math.round(e4.get(t5, r4, 3) * s3);
                    e4.set(t5, r4, 0, 0), e4.set(t5, r4, 1, n4), e4.set(t5, r4, 2, 0), e4.set(t5, r4, 3, 255);
                  })).then(function() {
                    t4.setMetallicRoughnessTexture(a3), t4.getMetallicRoughnessTextureInfo().copy(r3);
                  });
                });
              }
              i3.setSpecularColorFactor(n3.getSpecularFactor()), t4.setRoughnessFactor(1 - n3.getGlossinessFactor());
            })();
            return f2 && f2.then ? f2.then(r2) : r2();
          });
          return Promise.resolve(l2 && l2.then ? l2.then(t3) : t3());
        } catch (u2) {
          return Promise.reject(u2);
        }
      });
    }, exports2.normals = function(e2) {
      void 0 === e2 && (e2 = Yt);
      const t2 = { ...Yt, ...e2 };
      return l(Qt, function(e3) {
        try {
          const r2 = e3.getLogger();
          let n2 = 0;
          return Promise.resolve(e3.transform(Jt())).then(function() {
            for (const o2 of e3.getRoot().listMeshes()) for (const s2 of o2.listPrimitives()) {
              const o3 = s2.getAttribute("POSITION");
              let i2 = s2.getAttribute("NORMAL");
              if (t2.overwrite && i2) i2.dispose();
              else if (i2) {
                r2.debug(`${Qt}: Skipping primitive: NORMAL found.`);
                continue;
              }
              i2 = e3.createAccessor().setArray(new Float32Array(3 * o3.getCount())).setType("VEC3");
              const a2 = [0, 0, 0], c2 = [0, 0, 0], l2 = [0, 0, 0];
              for (let e4 = 0; e4 < o3.getCount(); e4 += 3) {
                o3.getElement(e4 + 0, a2), o3.getElement(e4 + 1, c2), o3.getElement(e4 + 2, l2);
                const t3 = er(a2, c2, l2);
                i2.setElement(e4 + 0, t3), i2.setElement(e4 + 1, t3), i2.setElement(e4 + 2, t3);
              }
              s2.setAttribute("NORMAL", i2), n2++;
            }
            n2 ? r2.debug(`${Qt}: Complete.`) : r2.warn(`${Qt}: No qualifying primitives found. See debug output.`);
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      });
    }, exports2.palette = function(r2) {
      void 0 === r2 && (r2 = rr);
      const n2 = { ...rr, ...r2 }, o2 = Math.max(n2.blockSize, 1), s2 = Math.max(n2.min, 1);
      return l(tr, function(r3) {
        try {
          const n3 = r3.getLogger(), i2 = r3.getRoot();
          return Promise.resolve(r3.transform(Y({ propertyTypes: [e.PropertyType.ACCESSOR], keepAttributes: false, keepIndices: true, keepLeaves: true }))).then(function() {
            function c2() {
              function o3() {
                function o4() {
                  let t2 = 1;
                  for (const n4 of l2) {
                    const o5 = n4.getMaterial(), s5 = g2.get(o5), i3 = (v2.get(s5) + 0.5) / m2 * (h2 - y2) / h2, a2 = n4.getAttribute("POSITION"), c3 = a2.getBuffer(), l3 = new Float32Array(2 * a2.getCount()).fill(i3), u3 = r3.createAccessor().setType("VEC2").setArray(l3).setBuffer(c3);
                    let f3;
                    for (const e2 of b2) e2.equals(o5, A2) && (f3 = e2);
                    if (!f3) {
                      const r4 = (t2++).toString().padStart(3, "0");
                      f3 = o5.clone().setName(`PaletteMaterial${r4}`), S2 && f3.setBaseColorFactor([1, 1, 1, 1]).setBaseColorTexture(S2).getBaseColorTextureInfo().setMinFilter(e.TextureInfo.MinFilter.NEAREST).setMagFilter(e.TextureInfo.MagFilter.NEAREST), P2 && f3.setEmissiveFactor([1, 1, 1]).setEmissiveTexture(P2).getEmissiveTextureInfo().setMinFilter(e.TextureInfo.MinFilter.NEAREST).setMagFilter(e.TextureInfo.MagFilter.NEAREST), M2 && f3.setMetallicFactor(1).setRoughnessFactor(1).setMetallicRoughnessTexture(M2).getMetallicRoughnessTextureInfo().setMinFilter(e.TextureInfo.MinFilter.NEAREST).setMagFilter(e.TextureInfo.MagFilter.NEAREST), b2.push(f3);
                    }
                    n4.setMaterial(f3).setAttribute("TEXCOORD_0", u3);
                  }
                  return Promise.resolve(r3.transform(Y({ propertyTypes: [e.PropertyType.MATERIAL] }))).then(function() {
                    n3.debug(`${tr}: Complete.`);
                  });
                }
                const s4 = (function() {
                  if (M2) return Promise.resolve(t.savePixels(T2.metallicRoughness, x2)).then(function(e2) {
                    M2.setImage(e2).setMimeType(x2);
                  });
                })();
                return s4 && s4.then ? s4.then(o4) : o4();
              }
              const s3 = (function() {
                if (P2) return Promise.resolve(t.savePixels(T2.emissive, x2)).then(function(e2) {
                  P2.setImage(e2).setMimeType(x2);
                });
              })();
              return s3 && s3.then ? s3.then(o3) : o3();
            }
            const l2 = /* @__PURE__ */ new Set(), u2 = /* @__PURE__ */ new Set();
            for (const e2 of i2.listMeshes()) for (const t2 of e2.listPrimitives()) {
              const e3 = t2.getMaterial();
              e3 && !t2.getAttribute("TEXCOORD_0") && (l2.add(t2), u2.add(e3));
            }
            const f2 = /* @__PURE__ */ new Set(), g2 = /* @__PURE__ */ new Map(), p2 = { baseColor: /* @__PURE__ */ new Set(), emissive: /* @__PURE__ */ new Set(), metallicRoughness: /* @__PURE__ */ new Set() };
            for (const e2 of u2) {
              const t2 = or(e2.getBaseColorFactor().slice()), r4 = or([...e2.getEmissiveFactor(), 1]), n4 = nr(e2.getRoughnessFactor()), o3 = nr(e2.getMetallicFactor()), s3 = `baseColor:${t2},emissive:${r4},metallicRoughness:${o3}${n4}`;
              p2.baseColor.add(t2), p2.emissive.add(r4), p2.metallicRoughness.add(o3 + "+" + n4), f2.add(s3), g2.set(e2, s3);
            }
            const m2 = f2.size;
            if (m2 < s2) return void n3.debug(`${tr}: Found <${s2} unique material properties. Exiting.`);
            const h2 = sr(m2 * o2), d2 = sr(o2), y2 = h2 - m2 * o2, T2 = { baseColor: null, emissive: null, metallicRoughness: null }, A2 = /* @__PURE__ */ new Set(["name", "extras"]), E2 = function() {
              return [].slice.call(arguments).forEach((e2) => A2.add(e2));
            };
            let S2 = null, P2 = null, M2 = null;
            if (p2.baseColor.size >= s2) {
              const e2 = "PaletteBaseColor";
              S2 = r3.createTexture(e2).setURI(`${e2}.png`), T2.baseColor = a.default(new Uint8Array(h2 * d2 * 4), [h2, d2, 4]), E2("baseColorFactor", "baseColorTexture", "baseColorTextureInfo");
            }
            if (p2.emissive.size >= s2) {
              const e2 = "PaletteEmissive";
              P2 = r3.createTexture(e2).setURI(`${e2}.png`), T2.emissive = a.default(new Uint8Array(h2 * d2 * 4), [h2, d2, 4]), E2("emissiveFactor", "emissiveTexture", "emissiveTextureInfo");
            }
            if (p2.metallicRoughness.size >= s2) {
              const e2 = "PaletteMetallicRoughness";
              M2 = r3.createTexture(e2).setURI(`${e2}.png`), T2.metallicRoughness = a.default(new Uint8Array(h2 * d2 * 4), [h2, d2, 4]), E2("metallicFactor", "roughnessFactor", "metallicRoughnessTexture", "metallicRoughnessTextureInfo");
            }
            if (!(S2 || P2 || M2)) return void n3.debug(`${tr}: No material property has >=${s2} unique values. Exiting.`);
            const I2 = /* @__PURE__ */ new Set(), v2 = /* @__PURE__ */ new Map(), b2 = [];
            let N2 = 0;
            for (const t2 of u2) {
              const r4 = g2.get(t2);
              if (I2.has(r4)) continue;
              const n4 = N2++;
              if (T2.baseColor) {
                const r5 = T2.baseColor, s3 = [...t2.getBaseColorFactor()];
                e.ColorUtils.convertLinearToSRGB(s3, s3), ir(r5, n4, s3, o2);
              }
              if (T2.emissive) {
                const r5 = T2.emissive, s3 = [...t2.getEmissiveFactor(), 1];
                e.ColorUtils.convertLinearToSRGB(s3, s3), ir(r5, n4, s3, o2);
              }
              if (T2.metallicRoughness) {
                const e2 = T2.metallicRoughness, r5 = t2.getMetallicFactor();
                ir(e2, n4, [0, t2.getRoughnessFactor(), r5, 1], o2);
              }
              I2.add(r4), v2.set(r4, n4);
            }
            const x2 = "image/png", R2 = (function() {
              if (S2) return Promise.resolve(t.savePixels(T2.baseColor, x2)).then(function(e2) {
                S2.setImage(e2).setMimeType(x2);
              });
            })();
            return R2 && R2.then ? R2.then(c2) : c2();
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }, exports2.partition = function(t2) {
      void 0 === t2 && (t2 = cr);
      const r2 = { ...cr, ...t2 };
      return l(ar, function(t3) {
        try {
          const n2 = t3.getLogger();
          return false !== r2.meshes && (function(e2, t4, r3) {
            const n3 = new Set(e2.getRoot().listBuffers().map((e3) => e3.getURI()));
            e2.getRoot().listMeshes().forEach((o2, s2) => {
              if (Array.isArray(r3.meshes) && !r3.meshes.includes(o2.getName())) return void t4.debug(`${ar}: Skipping mesh #${s2} with name "${o2.getName()}".`);
              t4.debug(`${ar}: Creating buffer for mesh "${o2.getName()}".`);
              const i2 = e2.createBuffer(o2.getName()).setURI(lr(o2.getName() || "mesh", n3));
              o2.listPrimitives().forEach((e3) => {
                const t5 = e3.getIndices();
                t5 && t5.setBuffer(i2), e3.listAttributes().forEach((e4) => e4.setBuffer(i2)), e3.listTargets().forEach((e4) => {
                  e4.listAttributes().forEach((e5) => e5.setBuffer(i2));
                });
              });
            });
          })(t3, n2, r2), false !== r2.animations && (function(e2, t4, r3) {
            const n3 = new Set(e2.getRoot().listBuffers().map((e3) => e3.getURI()));
            e2.getRoot().listAnimations().forEach((o2, s2) => {
              if (Array.isArray(r3.animations) && !r3.animations.includes(o2.getName())) return void t4.debug(`${ar}: Skipping animation #${s2} with name "${o2.getName()}".`);
              t4.debug(`${ar}: Creating buffer for animation "${o2.getName()}".`);
              const i2 = e2.createBuffer(o2.getName()).setURI(lr(o2.getName() || "animation", n3));
              o2.listSamplers().forEach((e3) => {
                const t5 = e3.getInput(), r4 = e3.getOutput();
                t5 && t5.setBuffer(i2), r4 && r4.setBuffer(i2);
              });
            });
          })(t3, n2, r2), r2.meshes || r2.animations || n2.warn(`${ar}: Select animations or meshes to create a partition.`), Promise.resolve(t3.transform(Y({ propertyTypes: [e.PropertyType.BUFFER] }))).then(function() {
            n2.debug(`${ar}: Complete.`);
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }, exports2.prune = Y, exports2.quantize = Rt, exports2.reorder = dt, exports2.resample = function(t2) {
      void 0 === t2 && (t2 = Er);
      const r2 = { ...Er, ...t2 };
      return l(Tr, function(t3, n2) {
        try {
          const o2 = /* @__PURE__ */ new Set(), s2 = t3.getRoot().listAccessors().length, i2 = t3.getLogger(), a2 = r2.resample;
          return Promise.resolve(r2.ready).then(function() {
            function c2() {
              i2.debug(`${Tr}: Complete.`);
            }
            for (const e2 of t3.getRoot().listAnimations()) {
              const t4 = /* @__PURE__ */ new Map();
              for (const r3 of e2.listChannels()) t4.set(r3.getSampler(), r3.getTargetPath());
              for (const n3 of e2.listSamplers()) {
                const e3 = n3.getInterpolation();
                if ("STEP" === e3 || "LINEAR" === e3) {
                  const s3 = n3.getInput(), i3 = n3.getOutput();
                  o2.add(s3), o2.add(i3);
                  const c3 = Sr(s3.getArray(), s3.getComponentType(), s3.getNormalized()), l3 = Sr(i3.getArray(), i3.getComponentType(), i3.getNormalized()), u2 = l3.length / c3.length, f3 = c3.length;
                  let g2;
                  if (g2 = "STEP" === e3 ? a2(c3, l3, "step", r2.tolerance) : "rotation" === t4.get(n3) ? a2(c3, l3, "slerp", r2.tolerance) : a2(c3, l3, "lerp", r2.tolerance), g2 < f3) {
                    const e4 = s3.getArray(), t5 = i3.getArray(), r3 = Pr(new Float32Array(c3.buffer, c3.byteOffset, g2), s3.getComponentType(), s3.getNormalized()), o3 = Pr(new Float32Array(l3.buffer, l3.byteOffset, g2 * u2), i3.getComponentType(), i3.getNormalized());
                    s3.setArray(Ar), i3.setArray(Ar), n3.setInput(s3.clone().setArray(r3)), n3.setOutput(i3.clone().setArray(o3)), s3.setArray(e4), i3.setArray(t5);
                  }
                }
              }
            }
            for (const t4 of Array.from(o2.values())) t4.listParents().some((t5) => !(t5 instanceof e.Root)) || t4.dispose();
            const l2 = t3.getRoot().listAccessors().length, f2 = (function() {
              if (l2 > s2 && !u(n2, Tr, "dedup")) return Promise.resolve(t3.transform(B({ propertyTypes: [e.PropertyType.ACCESSOR] }))).then(function() {
              });
            })();
            return f2 && f2.then ? f2.then(c2) : c2();
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }, exports2.sequence = function(t2) {
      void 0 === t2 && (t2 = Ir);
      const r2 = { ...Ir, ...t2 };
      return l(Mr, (t3) => {
        const n2 = t3.getLogger(), o2 = t3.getRoot(), s2 = r2.fps, i2 = o2.listNodes().filter((e2) => e2.getName().match(r2.pattern));
        r2.sort && i2.sort((e2, t4) => e2.getName() > t4.getName() ? 1 : -1);
        const a2 = t3.createAnimation(r2.name), c2 = o2.listBuffers()[0];
        i2.forEach((r3, n3) => {
          let o3, l2;
          0 === n3 ? (o3 = [n3 / s2, (n3 + 1) / s2], l2 = [1, 1, 1, 0, 0, 0]) : n3 === i2.length - 1 ? (o3 = [(n3 - 1) / s2, n3 / s2], l2 = [0, 0, 0, 1, 1, 1]) : (o3 = [(n3 - 1) / s2, n3 / s2, (n3 + 1) / s2], l2 = [0, 0, 0, 1, 1, 1, 0, 0, 0]);
          const u2 = t3.createAccessor().setArray(new Float32Array(o3)).setBuffer(c2), f2 = t3.createAccessor().setArray(new Float32Array(l2)).setBuffer(c2).setType(e.Accessor.Type.VEC3), g2 = t3.createAnimationSampler().setInterpolation(e.AnimationSampler.Interpolation.STEP).setInput(u2).setOutput(f2), p2 = t3.createAnimationChannel().setTargetNode(r3).setTargetPath(e.AnimationChannel.TargetPath.SCALE).setSampler(g2);
          a2.addSampler(g2).addChannel(p2);
        }), n2.debug(`${Mr}: Complete.`);
      });
    }, exports2.simplify = function(t2) {
      const r2 = { ...br, ...t2 }, n2 = r2.simplifier;
      if (!n2) throw new Error(`${vr}: simplifier dependency required \u2014 install "meshoptimizer".`);
      return l(vr, function(t3, o2) {
        try {
          const s2 = t3.getLogger();
          return Promise.resolve(n2.ready).then(function() {
            return Promise.resolve(t3.transform(pe({ overwrite: false }))).then(function() {
              for (const n3 of t3.getRoot().listMeshes()) {
                for (const o3 of n3.listPrimitives()) o3.getMode() === e.Primitive.Mode.TRIANGLES ? (Nr(t3, o3, r2), 0 === o3.getIndices().getCount() && o3.dispose()) : s2.warn(`${vr}: Skipping primitive of mesh "${n3.getName()}": Requires TRIANGLES draw mode.`);
                0 === n3.listPrimitives().length && n3.dispose();
              }
              return Promise.resolve(t3.transform(Y({ propertyTypes: [e.PropertyType.ACCESSOR, e.PropertyType.NODE], keepAttributes: true, keepIndices: true, keepLeaves: false }))).then(function() {
                function r3() {
                  s2.debug(`${vr}: Complete.`);
                }
                const n3 = (function() {
                  if (!u(o2, vr, "dedup")) return Promise.resolve(t3.transform(B({ propertyTypes: [e.PropertyType.ACCESSOR] }))).then(function() {
                  });
                })();
                return n3 && n3.then ? n3.then(r3) : r3();
              });
            });
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }, exports2.simplifyPrimitive = Nr, exports2.sortPrimitiveWeights = yt, exports2.sparse = function(t2) {
      void 0 === t2 && (t2 = Rr);
      const r2 = { ...Rr, ...t2 }.ratio;
      if (r2 < 0 || r2 > 1) throw new Error(`${xr}: Ratio must be between 0 and 1.`);
      return l(xr, (t3) => {
        const n2 = t3.getRoot(), o2 = t3.getLogger();
        let s2 = 0;
        for (const t4 of n2.listAccessors()) {
          const n3 = t4.getCount(), o3 = Array(t4.getElementSize()).fill(0), i2 = Array(t4.getElementSize()).fill(0);
          let a2 = 0;
          for (let s3 = 0; s3 < n3 && (t4.getElement(s3, i2), e.MathUtils.eq(i2, o3, 0) || a2++, !(a2 / n3 >= r2)); s3++) ;
          const c2 = a2 / n3 < r2;
          c2 !== t4.getSparse() && (t4.setSparse(c2), s2++);
        }
        o2.debug(`${xr}: Updated ${s2} accessors.`), o2.debug(`${xr}: Complete.`);
      });
    }, exports2.tangents = function(t2) {
      if (void 0 === t2 && (t2 = Wr), !t2.generateTangents) throw new Error(`${Hr}: generateTangents callback required \u2014 install "mikktspace".`);
      const r2 = { ...Wr, ...t2 };
      return l(Hr, (t3) => {
        const n2 = t3.getLogger(), o2 = /* @__PURE__ */ new Map(), s2 = /* @__PURE__ */ new Map();
        let i2 = 0;
        for (const a2 of t3.getRoot().listMeshes()) {
          const c2 = a2.getName(), l2 = a2.listPrimitives();
          for (let a3 = 0; a3 < l2.length; a3++) {
            const u2 = l2[a3];
            if (!Kr(u2, n2, c2, a3, r2.overwrite)) continue;
            const f2 = Xr(u2), g2 = u2.getAttribute("POSITION").getArray(), p2 = u2.getAttribute("NORMAL").getArray(), m2 = u2.getAttribute(f2).getArray(), h2 = o2.get(g2) || e.uuid();
            o2.set(g2, h2);
            const d2 = o2.get(p2) || e.uuid();
            o2.set(p2, d2);
            const y2 = o2.get(m2) || e.uuid();
            o2.set(m2, y2);
            const T2 = u2.getAttribute("TANGENT");
            T2 && 2 === T2.listParents().length && T2.dispose();
            const A2 = `${h2}|${d2}|${y2}`;
            let E2 = s2.get(A2);
            if (E2) {
              n2.debug(`${Hr}: Found cache for primitive ${a3} of mesh "${c2}".`), u2.setAttribute("TANGENT", E2), i2++;
              continue;
            }
            n2.debug(`${Hr}: Generating for primitive ${a3} of mesh "${c2}".`);
            const S2 = u2.getAttribute("POSITION").getBuffer(), P2 = r2.generateTangents(g2 instanceof Float32Array ? g2 : new Float32Array(g2), p2 instanceof Float32Array ? p2 : new Float32Array(p2), m2 instanceof Float32Array ? m2 : new Float32Array(m2));
            for (let e2 = 3; e2 < P2.length; e2 += 4) P2[e2] *= -1;
            E2 = t3.createAccessor().setBuffer(S2).setArray(P2).setType("VEC4"), u2.setAttribute("TANGENT", E2), s2.set(A2, E2), i2++;
          }
        }
        i2 ? n2.debug(`${Hr}: Complete.`) : n2.warn(`${Hr}: No qualifying primitives found. See debug output.`);
      });
    }, exports2.textureCompress = function(t2) {
      const n2 = { ...qr, ...t2 }, o2 = n2.targetFormat, s2 = n2.pattern, i2 = n2.formats, a2 = n2.slots;
      return l(_r, function(t3) {
        try {
          const c2 = t3.getLogger(), l2 = t3.getRoot().listTextures();
          return Promise.resolve(Promise.all(l2.map(function(r2, l3) {
            try {
              const u2 = K(r2), f2 = pt(r2), g2 = r2.getURI() || r2.getName() || `${l3 + 1}/${t3.getRoot().listTextures().length}`, m2 = `${_r}(${g2})`;
              if (!Gr.includes(r2.getMimeType())) return c2.debug(`${m2}: Skipping, unsupported texture type "${r2.getMimeType()}".`), Promise.resolve();
              if (s2 && !s2.test(r2.getName()) && !s2.test(r2.getURI())) return c2.debug(`${m2}: Skipping, excluded by "pattern" parameter.`), Promise.resolve();
              if (i2 && !i2.test(r2.getMimeType())) return c2.debug(`${m2}: Skipping, "${r2.getMimeType()}" excluded by "formats" parameter.`), Promise.resolve();
              if (a2 && u2.length && !u2.some((e2) => a2.test(e2))) return c2.debug(`${m2}: Skipping, [${u2.join(", ")}] excluded by "slots" parameter.`), Promise.resolve();
              if ("jpeg" === n2.targetFormat && f2 & e.TextureChannel.A) return c2.warn(`${m2}: Skipping, [${u2.join(", ")}] requires alpha channel.`), Promise.resolve();
              const h2 = Br(r2);
              c2.debug(`${m2}: Format = ${h2} \u2192 ${o2 || h2}`), c2.debug(`${m2}: Slots = [${u2.join(", ")}]`);
              const d2 = r2.getImage(), y2 = d2.byteLength;
              return Promise.resolve(Ur(r2, n2)).then(function() {
                const e2 = r2.getImage(), t4 = e2.byteLength, n3 = d2 === e2 ? " (SKIPPED" : "";
                c2.debug(`${m2}: Size = ${p(y2)} \u2192 ${p(t4)}${n3}`);
              });
            } catch (e2) {
              return Promise.reject(e2);
            }
          }))).then(function() {
            const e2 = t3.createExtension(r.EXTTextureWebP);
            l2.some((e3) => "image/webp" === e3.getMimeType()) ? e2.setRequired(true) : e2.dispose();
            const n3 = t3.createExtension(r.EXTTextureAVIF);
            l2.some((e3) => "image/avif" === e3.getMimeType()) ? n3.setRequired(true) : n3.dispose(), c2.debug(`${_r}: Complete.`);
          });
        } catch (e2) {
          return Promise.reject(e2);
        }
      });
    }, exports2.textureResize = function(r2) {
      void 0 === r2 && (r2 = Fr);
      const n2 = { ...Fr, ...r2 };
      return l(Lr, function(r3) {
        try {
          let o3 = function(e2) {
            c2.debug(`${Lr}: Complete.`);
          };
          var o2 = o3;
          let i2;
          const c2 = r3.getLogger(), l2 = (function(e2, t2, r4) {
            if ("function" == typeof e2[Cr]) {
              var n3, o4, s2, i3 = e2[Cr]();
              if ((function e3(a3) {
                try {
                  for (; !((n3 = i3.next()).done || r4 && r4()); ) if ((a3 = t2(n3.value)) && a3.then) {
                    if (!$r(a3)) return void a3.then(e3, s2 || (s2 = wr.bind(null, o4 = new Or(), 2)));
                    a3 = a3.v;
                  }
                  o4 ? wr(o4, 1, a3) : o4 = a3;
                } catch (e4) {
                  wr(o4 || (o4 = new Or()), 2, e4);
                }
              })(), i3.return) {
                var a2 = function(e3) {
                  try {
                    n3.done || i3.return();
                  } catch (e4) {
                  }
                  return e3;
                };
                if (o4 && o4.then) return o4.then(a2, function(e3) {
                  throw a2(e3);
                });
                a2();
              }
              return o4;
            }
            if (!("length" in e2)) throw new TypeError("Object is not iterable");
            for (var c3 = [], l3 = 0; l3 < e2.length; l3++) c3.push(e2[l3]);
            return (function(e3, t3, r5) {
              var n4, o5, s3 = -1;
              return (function i4(a3) {
                try {
                  for (; ++s3 < e3.length && (!r5 || !r5()); ) if ((a3 = t3(s3)) && a3.then) {
                    if (!$r(a3)) return void a3.then(i4, o5 || (o5 = wr.bind(null, n4 = new Or(), 2)));
                    a3 = a3.v;
                  }
                  n4 ? wr(n4, 1, a3) : n4 = a3;
                } catch (e4) {
                  wr(n4 || (n4 = new Or()), 2, e4);
                }
              })(), n4;
            })(c3, function(e3) {
              return t2(c3[e3]);
            }, r4);
          })(r3.getRoot().listTextures(), function(r4) {
            const o4 = r4.getName(), i3 = r4.getURI();
            if (n2.pattern && !n2.pattern.test(o4) && !n2.pattern.test(i3)) return void c2.debug(`${Lr}: Skipping, excluded by "pattern" parameter.`);
            if ("image/png" !== r4.getMimeType() && "image/jpeg" !== r4.getMimeType()) return void c2.warn(`${Lr}: Skipping, unsupported texture type "${r4.getMimeType()}".`);
            const l3 = K(r4);
            if (n2.slots && !l3.some((e2) => {
              var t2;
              return null == (t2 = n2.slots) ? void 0 : t2.test(e2);
            })) return void c2.debug(`${Lr}: Skipping, [${l3.join(", ")}] excluded by "slots" parameter.`);
            const u2 = r4.getSize(), f2 = P(u2, n2.size);
            if (e.MathUtils.eq(u2, f2)) return void c2.debug(`${Lr}: Skipping, not within size range.`);
            const g2 = r4.getImage();
            return Promise.resolve(t.getPixels(g2, r4.getMimeType())).then(function(e2) {
              const u3 = a.default(new Uint8Array(f2[0] * f2[1] * 4), [...f2, 4]);
              c2.debug(`${Lr}: Resizing "${i3 || o4}", ${e2.shape} \u2192 ${u3.shape}...`), c2.debug(`${Lr}: Slots \u2192 [${l3.join(", ")}]`);
              try {
                n2.filter === exports2.TextureResizeFilter.LANCZOS3 ? s.lanczos3(e2, u3) : s.lanczos2(e2, u3);
              } catch (e3) {
                if (e3 instanceof Error) return void c2.warn(`${Lr}: Failed to resize "${i3 || o4}": "${e3.message}".`);
                throw e3;
              }
              const g3 = r4.setImage;
              return Promise.resolve(t.savePixels(u3, r4.getMimeType())).then(function(e3) {
                g3.call(r4, e3);
              });
            });
          }, function() {
            return i2;
          });
          return Promise.resolve(l2 && l2.then ? l2.then(o3) : o3());
        } catch (u2) {
          return Promise.reject(u2);
        }
      });
    }, exports2.transformMesh = Re, exports2.transformPrimitive = ve, exports2.unlit = function() {
      return (e2) => {
        const t2 = e2.createExtension(r.KHRMaterialsUnlit).createUnlit();
        e2.getRoot().listMaterials().forEach((e3) => {
          e3.setExtension("KHR_materials_unlit", t2);
        });
      };
    }, exports2.unpartition = function(e2) {
      return l(Vr, function(e3) {
        try {
          const t2 = e3.getLogger(), r2 = e3.getRoot().listBuffers()[0];
          return e3.getRoot().listAccessors().forEach((e4) => e4.setBuffer(r2)), e3.getRoot().listBuffers().forEach((e4, t3) => t3 > 0 ? e4.dispose() : null), t2.debug(`${Vr}: Complete.`), Promise.resolve();
        } catch (e4) {
          return Promise.reject(e4);
        }
      });
    }, exports2.unweld = Jt, exports2.vertexColorSpace = Qr, exports2.weld = pe, exports2.weldPrimitive = me;
  }
});

// processor.ts
var import_fs = __toESM(require("fs"));
var import_https = __toESM(require("https"));
var import_path = __toESM(require("path"));
var import_child_process = require("child_process");
var import_child_process2 = require("child_process");
function docToOBJ(doc) {
  const lines = [];
  let offset = 0;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute("POSITION");
      if (!pos) continue;
      const count = pos.getCount();
      for (let i = 0; i < count; i++) {
        const v = pos.getElement(i, [0, 0, 0]);
        lines.push(`v ${v[0]} ${v[1]} ${v[2]}`);
      }
      const indices = prim.getIndices();
      if (indices) {
        for (let i = 0; i < indices.getCount(); i += 3) {
          const a = indices.getScalar(i) + 1 + offset;
          const b = indices.getScalar(i + 1) + 1 + offset;
          const c = indices.getScalar(i + 2) + 1 + offset;
          lines.push(`f ${a} ${b} ${c}`);
        }
      } else {
        for (let i = 0; i < count; i += 3)
          lines.push(`f ${i + 1 + offset} ${i + 2 + offset} ${i + 3 + offset}`);
      }
      offset += count;
    }
  }
  return lines.join("\n");
}
function objToDoc(objContent, Document) {
  const verts = [];
  const faces = [];
  for (const raw of objContent.split("\n")) {
    const line = raw.trim();
    const parts = line.split(/\s+/);
    if (parts[0] === "v") {
      verts.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
    } else if (parts[0] === "f") {
      const idx = parts.slice(1).map((p) => parseInt(p.split("/")[0], 10) - 1);
      if (idx.length === 3) {
        faces.push(idx[0], idx[1], idx[2]);
      } else if (idx.length === 4) {
        faces.push(idx[0], idx[1], idx[2]);
        faces.push(idx[0], idx[2], idx[3]);
      }
    }
  }
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("Scene");
  const node = doc.createNode("Mesh");
  scene.addChild(node);
  doc.getRoot().setDefaultScene(scene);
  const posAcc = doc.createAccessor().setType("VEC3").setArray(new Float32Array(verts)).setBuffer(buffer);
  const idxAcc = doc.createAccessor().setType("SCALAR").setArray(new Uint32Array(faces)).setBuffer(buffer);
  const prim = doc.createPrimitive().setAttribute("POSITION", posAcc).setIndices(idxAcc);
  const mesh = doc.createMesh("Mesh").addPrimitive(prim);
  node.setMesh(mesh);
  return doc;
}
var DOWNLOAD_URLS = {
  win32: "https://instant-meshes.s3.eu-central-1.amazonaws.com/Release/instant-meshes-windows.zip",
  darwin: "https://instant-meshes.s3.eu-central-1.amazonaws.com/instant-meshes-macos.zip",
  linux: "https://instant-meshes.s3.eu-central-1.amazonaws.com/instant-meshes-linux.zip"
};
function getExecutable() {
  const binDir = import_path.default.join(__dirname, "bin");
  const name = process.platform === "win32" ? "instant-meshes.exe" : "instant-meshes";
  return import_path.default.join(binDir, name);
}
async function ensureExecutable(context) {
  const exe = getExecutable();
  if (import_fs.default.existsSync(exe)) return;
  const url = DOWNLOAD_URLS[process.platform];
  if (!url) throw new Error(`Instant Meshes: unsupported platform "${process.platform}"`);
  context.log("Downloading Instant Meshes binary\u2026");
  context.progress(2, "Downloading Instant Meshes\u2026");
  const zipBuf = await new Promise((resolve, reject) => {
    import_https.default.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        import_https.default.get(res.headers.location, (res2) => {
          const chunks2 = [];
          res2.on("data", (c) => chunks2.push(c));
          res2.on("end", () => resolve(Buffer.concat(chunks2)));
          res2.on("error", reject);
        }).on("error", reject);
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
  context.log("Extracting binary\u2026");
  const binDir = import_path.default.join(__dirname, "bin");
  import_fs.default.mkdirSync(binDir, { recursive: true });
  const tmpZip = exe + ".zip";
  import_fs.default.writeFileSync(tmpZip, zipBuf);
  if (process.platform === "win32") {
    (0, import_child_process2.execFileSync)("powershell", [
      "-NoProfile",
      "-Command",
      `Expand-Archive -Force -LiteralPath '${tmpZip}' -DestinationPath '${binDir}'`
    ]);
    const entries = import_fs.default.readdirSync(binDir).filter((f) => f.endsWith(".exe") && f !== import_path.default.basename(exe));
    if (entries.length === 1 && !import_fs.default.existsSync(exe)) {
      import_fs.default.renameSync(import_path.default.join(binDir, entries[0]), exe);
    }
  } else {
    (0, import_child_process2.execFileSync)("unzip", ["-o", tmpZip, "-d", binDir]);
    const entries = import_fs.default.readdirSync(binDir).filter((f) => !f.endsWith(".zip") && f !== "instant-meshes");
    if (entries.length === 1 && !import_fs.default.existsSync(exe)) {
      import_fs.default.renameSync(import_path.default.join(binDir, entries[0]), exe);
    }
    import_fs.default.chmodSync(exe, 493);
  }
  import_fs.default.unlinkSync(tmpZip);
  context.log("Binary ready.");
}
var processor = async (input, params, context) => {
  if (!input.filePath) throw new Error("instant-meshes: input.filePath is required");
  await ensureExecutable(context);
  const exe = getExecutable();
  const { NodeIO, Document } = require_core();
  const { normals } = require_functions();
  context.progress(10, "Loading mesh\u2026");
  const io = new NodeIO();
  const doc = await io.read(input.filePath);
  let inputFaces = 0;
  for (const mesh of doc.getRoot().listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      inputFaces += idx ? Math.round(idx.getCount() / 3) : 0;
    }
  context.log(`Input: ${inputFaces} triangles \u2014 ${input.filePath}`);
  context.progress(25, "Converting to OBJ\u2026");
  const outDir = import_path.default.join(context.workspaceDir, "Workflows");
  import_fs.default.mkdirSync(outDir, { recursive: true });
  const ts = Date.now();
  const tmpIn = import_path.default.join(outDir, `im-in-${ts}.obj`);
  const tmpOut = import_path.default.join(outDir, `im-out-${ts}.obj`);
  import_fs.default.writeFileSync(tmpIn, docToOBJ(doc), "utf8");
  const targetFaces = Math.max(100, Math.round(Number(params["target_faces"] ?? 5e3)));
  const topology = String(params["topology"] ?? "quads");
  const rosy = topology === "triangles" ? "6" : "4";
  const posy = topology === "triangles" ? "6" : "4";
  const smooth = String(params["smooth"] ?? "2");
  const crease = Number(params["crease"] ?? 30);
  const args = [
    tmpIn,
    "--output",
    tmpOut,
    "--faces",
    targetFaces.toString(),
    "--rosy",
    rosy,
    "--posy",
    posy,
    "--smooth",
    smooth,
    "--intrinsic",
    "--boundaries"
  ];
  if (crease > 0) args.push("--crease", crease.toString());
  context.log(`Running: instant-meshes --faces ${targetFaces} --rosy ${rosy} --posy ${posy} --smooth ${smooth} --crease ${crease} --intrinsic --boundaries`);
  context.progress(40, "Running Instant Meshes\u2026");
  const result = (0, import_child_process.spawnSync)(exe, args, { timeout: 18e4, encoding: "utf8" });
  if (result.status !== 0) {
    import_fs.default.unlinkSync(tmpIn);
    throw new Error(`Instant Meshes failed (exit ${result.status}): ${result.stderr ?? result.error}`);
  }
  if (!import_fs.default.existsSync(tmpOut)) {
    import_fs.default.unlinkSync(tmpIn);
    throw new Error("Instant Meshes did not produce output \u2014 check input mesh.");
  }
  context.progress(75, "Converting output to GLB\u2026");
  const objContent = import_fs.default.readFileSync(tmpOut, "utf8");
  const outDoc = objToDoc(objContent, Document);
  await outDoc.transform(normals({ overwrite: true }));
  let outputFaces = 0;
  for (const mesh of outDoc.getRoot().listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      outputFaces += idx ? Math.round(idx.getCount() / 3) : 0;
    }
  context.log(`Output: ${outputFaces} triangles`);
  context.progress(90, "Writing GLB\u2026");
  const outPath = import_path.default.join(outDir, `instant-meshes-${ts}.glb`);
  await io.write(outPath, outDoc);
  import_fs.default.unlinkSync(tmpIn);
  import_fs.default.unlinkSync(tmpOut);
  context.progress(100, "Done.");
  context.log(`Output: ${outPath}`);
  return { filePath: outPath };
};
module.exports = processor;
/*! Bundled license information:

is-buffer/index.js:
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
