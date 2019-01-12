import { request } from 'd3-request';
import { dsvFormat } from 'd3-dsv';
import { feature, mesh } from 'topojson-client';
import { timeParse, utcParse, timeFormat, utcFormat, timeFormatDefaultLocale } from 'd3-time-format';
import { quantile, ascending, variance, extent, range, mean, min, max, median, bisector, bisectRight, bisect, sum, bisectLeft, permute, tickStep } from 'd3-array';
import { curveBasis, curveBasisClosed, curveBasisOpen, curveBundle, curveCardinal, curveCardinalClosed, curveCardinalOpen, curveCatmullRom, curveCatmullRomClosed, curveCatmullRomOpen, curveLinear, curveLinearClosed, curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore, arc, symbol, area, line } from 'd3-shape';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleIdentity, scaleLog, scalePow, scaleSqrt, scaleQuantile, scaleQuantize, scaleThreshold, scaleTime, scaleUtc } from 'd3-scale';
import * as $$1 from 'd3-interpolate';
import { interpolateRgbBasis, interpolateRound, interpolate } from 'd3-interpolate';
import * as _ from 'd3-scale-chromatic';
import { schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3, interpolateViridis, interpolateMagma, interpolateInferno, interpolatePlasma, interpolateRainbow, interpolateSinebow } from 'd3-scale-chromatic';
import { timeMillisecond, utcMillisecond, timeSecond, utcSecond, timeMinute, utcMinute, timeHour, utcHour, timeDay, utcDay, timeWeek, utcWeek, timeMonth, utcMonth, timeYear, utcYear } from 'd3-time';
import { format, formatSpecifier, formatDefaultLocale } from 'd3-format';
import { contours, contourDensity } from 'd3-contour';
import { geoAlbers, geoAlbersUsa, geoAzimuthalEqualArea, geoAzimuthalEquidistant, geoConicConformal, geoConicEqualArea, geoConicEquidistant, geoEquirectangular, geoGnomonic, geoIdentity, geoMercator, geoNaturalEarth1, geoOrthographic, geoStereographic, geoTransverseMercator, geoPath, geoGraticule, geoArea, geoBounds, geoCentroid } from 'd3-geo';
import { forceSimulation, forceCenter, forceCollide, forceManyBody, forceLink, forceX, forceY } from 'd3-force';
import { nest } from 'd3-collection';
import { hierarchy, pack, partition, stratify, tree, cluster, treemap, treemapBinary, treemapDice, treemapSlice, treemapSliceDice, treemapSquarify, treemapResquarify } from 'd3-hierarchy';
import { voronoi } from 'd3-voronoi';
import { rgb, lab, hcl, hsl } from 'd3-color';
import jsonStableStringify from 'json-stable-stringify';
import util from 'datalib/src/util';
import d3 from 'd3';

function accessor(fn, fields, name) {
  fn.fields = fields || [];
  fn.fname = name;
  return fn;
}
function accessorName(fn) {
  return fn == null ? null : fn.fname;
}
function accessorFields(fn) {
  return fn == null ? null : fn.fields;
}

function error(message) {
  throw Error(message);
}

function splitAccessPath(p) {
  var path$$1 = [],
      q = null,
      b = 0,
      n = p.length,
      s = '',
      i, j, c;
  p = p + '';
  function push() {
    path$$1.push(s + p.substring(i, j));
    s = '';
    i = j + 1;
  }
  for (i=j=0; j<n; ++j) {
    c = p[j];
    if (c === '\\') {
      s += p.substring(i, j);
      i = ++j;
    } else if (c === q) {
      push();
      q = null;
      b = -1;
    } else if (q) {
      continue;
    } else if (i === b && c === '"') {
      i = j + 1;
      q = c;
    } else if (i === b && c === "'") {
      i = j + 1;
      q = c;
    } else if (c === '.' && !b) {
      if (j > i) {
        push();
      } else {
        i = j + 1;
      }
    } else if (c === '[') {
      if (j > i) push();
      b = i = j + 1;
    } else if (c === ']') {
      if (!b) error('Access path missing open bracket: ' + p);
      if (b > 0) push();
      b = 0;
      i = j + 1;
    }
  }
  if (b) error('Access path missing closing bracket: ' + p);
  if (q) error('Access path missing closing quote: ' + p);
  if (j > i) {
    j++;
    push();
  }
  return path$$1;
}

var isArray = Array.isArray;

function isObject(_$$1) {
  return _$$1 === Object(_$$1);
}

function isString(_$$1) {
  return typeof _$$1 === 'string';
}

function $(x) {
  return isArray(x) ? '[' + x.map($) + ']'
    : isObject(x) || isString(x) ?
      JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
    : x;
}

function field(field, name) {
  var path$$1 = splitAccessPath(field),
      code = 'return _[' + path$$1.map($).join('][') + '];';
  return accessor(
    Function('_', code),
    [(field = path$$1.length===1 ? path$$1[0] : field)],
    name || field
  );
}

var empty = [];
var id = field('id');
var identity = accessor(function(_$$1) { return _$$1; }, empty, 'identity');
var zero = accessor(function() { return 0; }, empty, 'zero');
var one = accessor(function() { return 1; }, empty, 'one');
var truthy = accessor(function() { return true; }, empty, 'true');
var falsy = accessor(function() { return false; }, empty, 'false');

function log(method, level, input) {
  var args = [level].concat([].slice.call(input));
  console[method].apply(console, args);
}
var None  = 0;
var Error$1 = 1;
var Warn  = 2;
var Info  = 3;
var Debug = 4;
function logger(_$$1) {
  var level = _$$1 || None;
  return {
    level: function(_$$1) {
      if (arguments.length) {
        level = +_$$1;
        return this;
      } else {
        return level;
      }
    },
    error: function() {
      if (level >= Error$1) log('error', 'ERROR', arguments);
      return this;
    },
    warn: function() {
      if (level >= Warn) log('warn', 'WARN', arguments);
      return this;
    },
    info: function() {
      if (level >= Info) log('log', 'INFO', arguments);
      return this;
    },
    debug: function() {
      if (level >= Debug) log('log', 'DEBUG', arguments);
      return this;
    }
  }
}

function peek(array) {
  return array[array.length - 1];
}

function toNumber(_$$1) {
  return _$$1 == null || _$$1 === '' ? null : +_$$1;
}

function exp(sign) {
  return function(x) { return sign * Math.exp(x); };
}
function log$1(sign) {
  return function(x) { return Math.log(sign * x); };
}
function pow(exponent) {
  return function(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}
function pan(domain, delta, lift, ground) {
  var d0 = lift(domain[0]),
      d1 = lift(peek(domain)),
      dd = (d1 - d0) * delta;
  return [
    ground(d0 - dd),
    ground(d1 - dd)
  ];
}
function panLinear(domain, delta) {
  return pan(domain, delta, toNumber, identity);
}
function panLog(domain, delta) {
  var sign = Math.sign(domain[0]);
  return pan(domain, delta, log$1(sign), exp(sign));
}
function panPow(domain, delta, exponent) {
  return pan(domain, delta, pow(exponent), pow(1/exponent));
}
function zoom(domain, anchor, scale, lift, ground) {
  var d0 = lift(domain[0]),
      d1 = lift(peek(domain)),
      da = anchor != null ? lift(anchor) : (d0 + d1) / 2;
  return [
    ground(da + (d0 - da) * scale),
    ground(da + (d1 - da) * scale)
  ];
}
function zoomLinear(domain, anchor, scale) {
  return zoom(domain, anchor, scale, toNumber, identity);
}
function zoomLog(domain, anchor, scale) {
  var sign = Math.sign(domain[0]);
  return zoom(domain, anchor, scale, log$1(sign), exp(sign));
}
function zoomPow(domain, anchor, scale, exponent) {
  return zoom(domain, anchor, scale, pow(exponent), pow(1/exponent));
}

function array(_$$1) {
  return _$$1 != null ? (isArray(_$$1) ? _$$1 : [_$$1]) : [];
}

function isFunction(_$$1) {
  return typeof _$$1 === 'function';
}

function compare(fields, orders) {
  var idx = [],
      cmp = (fields = array(fields)).map(function(f, i) {
        if (f == null) {
          return null;
        } else {
          idx.push(i);
          return isFunction(f) ? f
            : splitAccessPath(f).map($).join('][');
        }
      }),
      n = idx.length - 1,
      ord = array(orders),
      code = 'var u,v;return ',
      i, j, f, u, v, d, t, lt, gt;
  if (n < 0) return null;
  for (j=0; j<=n; ++j) {
    i = idx[j];
    f = cmp[i];
    if (isFunction(f)) {
      d = 'f' + i;
      u = '(u=this.' + d + '(a))';
      v = '(v=this.' + d + '(b))';
      (t = t || {})[d] = f;
    } else {
      u = '(u=a['+f+'])';
      v = '(v=b['+f+'])';
    }
    d = '((v=v instanceof Date?+v:v),(u=u instanceof Date?+u:u))';
    if (ord[i] !== 'descending') {
      gt = 1;
      lt = -1;
    } else {
      gt = -1;
      lt = 1;
    }
    code += '(' + u+'<'+v+'||u==null)&&v!=null?' + lt
      + ':(u>v||v==null)&&u!=null?' + gt
      + ':'+d+'!==u&&v===v?' + lt
      + ':v!==v&&u===u?' + gt
      + (i < n ? ':' : ':0');
  }
  f = Function('a', 'b', code + ';');
  if (t) f = f.bind(t);
  fields = fields.reduce(function(map, field) {
    if (isFunction(field)) {
      (accessorFields(field) || []).forEach(function(_$$1) { map[_$$1] = 1; });
    } else if (field != null) {
      map[field + ''] = 1;
    }
    return map;
  }, {});
  return accessor(f, Object.keys(fields));
}

function constant(_$$1) {
  return isFunction(_$$1) ? _$$1 : function() { return _$$1; };
}

function debounce(delay, handler) {
  var tid, evt;
  function callback() {
    handler(evt);
    tid = evt = null;
  }
  return function(e) {
    evt = e;
    if (tid) clearTimeout(tid);
    tid = setTimeout(callback, delay);
  };
}

function extend(_$$1) {
  for (var x, k, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (k in x) { _$$1[k] = x[k]; }
  }
  return _$$1;
}

function extentIndex(array, f) {
  var i = -1,
      n = array.length,
      a, b, c, u, v;
  if (f == null) {
    while (++i < n) {
      b = array[i];
      if (b != null && b >= b) {
        a = c = b;
        break;
      }
    }
    u = v = i;
    while (++i < n) {
      b = array[i];
      if (b != null) {
        if (a > b) {
          a = b;
          u = i;
        }
        if (c < b) {
          c = b;
          v = i;
        }
      }
    }
  } else {
    while (++i < n) {
      b = f(array[i], i, array);
      if (b != null && b >= b) {
        a = c = b;
        break;
      }
    }
    u = v = i;
    while (++i < n) {
      b = f(array[i], i, array);
      if (b != null) {
        if (a > b) {
          a = b;
          u = i;
        }
        if (c < b) {
          c = b;
          v = i;
        }
      }
    }
  }
  return [u, v];
}

var NULL = {};
function fastmap(input) {
  var obj = {},
      map,
      test;
  function has(key) {
    return obj.hasOwnProperty(key) && obj[key] !== NULL;
  }
  map = {
    size: 0,
    empty: 0,
    object: obj,
    has: has,
    get: function(key) {
      return has(key) ? obj[key] : undefined;
    },
    set: function(key, value) {
      if (!has(key)) {
        ++map.size;
        if (obj[key] === NULL) --map.empty;
      }
      obj[key] = value;
      return this;
    },
    delete: function(key) {
      if (has(key)) {
        --map.size;
        ++map.empty;
        obj[key] = NULL;
      }
      return this;
    },
    clear: function() {
      map.size = map.empty = 0;
      map.object = obj = {};
    },
    test: function(_$$1) {
      if (arguments.length) {
        test = _$$1;
        return map;
      } else {
        return test;
      }
    },
    clean: function() {
      var next = {},
          size = 0,
          key, value;
      for (key in obj) {
        value = obj[key];
        if (value !== NULL && (!test || !test(value))) {
          next[key] = value;
          ++size;
        }
      }
      map.size = size;
      map.empty = 0;
      map.object = (obj = next);
    }
  };
  if (input) Object.keys(input).forEach(function(key) {
    map.set(key, input[key]);
  });
  return map;
}

function inherits(child, parent) {
  var proto = (child.prototype = Object.create(parent.prototype));
  proto.constructor = child;
  return proto;
}

function isBoolean(_$$1) {
  return typeof _$$1 === 'boolean';
}

function isDate(_$$1) {
  return Object.prototype.toString.call(_$$1) === '[object Date]';
}

function isNumber(_$$1) {
  return typeof _$$1 === 'number';
}

function isRegExp(_$$1) {
  return Object.prototype.toString.call(_$$1) === '[object RegExp]';
}

function key(fields, flat) {
  if (fields) {
    fields = flat
      ? array(fields).map(function(f) { return f.replace(/\\(.)/g, '$1'); })
      : array(fields);
  }
  var fn = !(fields && fields.length)
    ? function() { return ''; }
    : Function('_', 'return \'\'+' +
        fields.map(function(f) {
          return '_[' + (flat
              ? $(f)
              : splitAccessPath(f).map($).join('][')
            ) + ']';
        }).join('+\'|\'+') + ';');
  return accessor(fn, fields, 'key');
}

function merge(compare, array0, array1, output) {
  var n0 = array0.length,
      n1 = array1.length;
  if (!n1) return array0;
  if (!n0) return array1;
  var merged = output || new array0.constructor(n0 + n1),
      i0 = 0, i1 = 0, i = 0;
  for (; i0<n0 && i1<n1; ++i) {
    merged[i] = compare(array0[i0], array1[i1]) > 0
       ? array1[i1++]
       : array0[i0++];
  }
  for (; i0<n0; ++i0, ++i) {
    merged[i] = array0[i0];
  }
  for (; i1<n1; ++i1, ++i) {
    merged[i] = array1[i1];
  }
  return merged;
}

function repeat(str, reps) {
  var s = '';
  while (--reps >= 0) s += str;
  return s;
}

function pad(str, length, padchar, align) {
  var c = padchar || ' ',
      s = str + '',
      n = length - s.length;
  return n <= 0 ? s
    : align === 'left' ? repeat(c, n) + s
    : align === 'center' ? repeat(c, ~~(n/2)) + s + repeat(c, Math.ceil(n/2))
    : s + repeat(c, n);
}

function toBoolean(_$$1) {
  return _$$1 == null || _$$1 === '' ? null : !_$$1 || _$$1 === 'false' || _$$1 === '0' ? false : !!_$$1;
}

function defaultParser(_$$1) {
  return isNumber(_$$1) ? _$$1 : isDate(_$$1) ? _$$1 : Date.parse(_$$1);
}
function toDate(_$$1, parser) {
  parser = parser || defaultParser;
  return _$$1 == null || _$$1 === '' ? null : parser(_$$1);
}

function toString(_$$1) {
  return _$$1 == null || _$$1 === '' ? null : _$$1 + '';
}

function toSet(_$$1) {
  for (var s={}, i=0, n=_$$1.length; i<n; ++i) s[_$$1[i]] = true;
  return s;
}

function truncate(str, length, align, ellipsis) {
  var e = ellipsis != null ? ellipsis : '\u2026',
      s = str + '',
      n = s.length,
      l = Math.max(0, length - e.length);
  return n <= length ? s
    : align === 'left' ? e + s.slice(n - l)
    : align === 'center' ? s.slice(0, Math.ceil(l/2)) + e + s.slice(n - ~~(l/2))
    : s.slice(0, l) + e;
}

function visitArray(array, filter, visitor) {
  if (array) {
    var i = 0, n = array.length, t;
    if (filter) {
      for (; i<n; ++i) {
        if (t = filter(array[i])) visitor(t, i, array);
      }
    } else {
      array.forEach(visitor);
    }
  }
}

function UniqueList(idFunc) {
  var $$$1 = idFunc || identity,
      list = [],
      ids = {};
  list.add = function(_$$1) {
    var id$$1 = $$$1(_$$1);
    if (!ids[id$$1]) {
      ids[id$$1] = 1;
      list.push(_$$1);
    }
    return list;
  };
  list.remove = function(_$$1) {
    var id$$1 = $$$1(_$$1), idx;
    if (ids[id$$1]) {
      ids[id$$1] = 0;
      if ((idx = list.indexOf(_$$1)) >= 0) {
        list.splice(idx, 1);
      }
    }
    return list;
  };
  return list;
}

var TUPLE_ID_KEY = Symbol('vega_id'),
    TUPLE_ID = 1;
function isTuple(t) {
  return !!(t && tupleid(t));
}
function tupleid(t) {
  return t[TUPLE_ID_KEY];
}
function setid(t, id) {
  t[TUPLE_ID_KEY] = id;
  return t;
}
function ingest(datum) {
  var t = (datum === Object(datum)) ? datum : {data: datum};
  return tupleid(t) ? t : setid(t, TUPLE_ID++);
}
function derive(t) {
  return rederive(t, ingest({}));
}
function rederive(t, d) {
  for (var k in t) d[k] = t[k];
  return d;
}
function replace(t, d) {
  return setid(d, tupleid(t));
}

function isChangeSet(v) {
  return v && v.constructor === changeset;
}
function changeset() {
  var add = [],
      rem = [],
      mod = [],
      remp = [],
      modp = [],
      reflow = false;
  return {
    constructor: changeset,
    insert: function(t) {
      var d = array(t), i = 0, n = d.length;
      for (; i<n; ++i) add.push(d[i]);
      return this;
    },
    remove: function(t) {
      var a = isFunction(t) ? remp : rem,
          d = array(t), i = 0, n = d.length;
      for (; i<n; ++i) a.push(d[i]);
      return this;
    },
    modify: function(t, field$$1, value) {
      var m = {field: field$$1, value: constant(value)};
      if (isFunction(t)) {
        m.filter = t;
        modp.push(m);
      } else {
        m.tuple = t;
        mod.push(m);
      }
      return this;
    },
    encode: function(t, set) {
      if (isFunction(t)) modp.push({filter: t, field: set});
      else mod.push({tuple: t, field: set});
      return this;
    },
    reflow: function() {
      reflow = true;
      return this;
    },
    pulse: function(pulse, tuples) {
      var out, i, n, m, f, t, id$$1;
      for (i=0, n=add.length; i<n; ++i) {
        pulse.add.push(ingest(add[i]));
      }
      for (out={}, i=0, n=rem.length; i<n; ++i) {
        t = rem[i];
        out[tupleid(t)] = t;
      }
      for (i=0, n=remp.length; i<n; ++i) {
        f = remp[i];
        tuples.forEach(function(t) {
          if (f(t)) out[tupleid(t)] = t;
        });
      }
      for (id$$1 in out) pulse.rem.push(out[id$$1]);
      function modify(t, f, v) {
        if (v) t[f] = v(t); else pulse.encode = f;
        if (!reflow) out[tupleid(t)] = t;
      }
      for (out={}, i=0, n=mod.length; i<n; ++i) {
        m = mod[i];
        modify(m.tuple, m.field, m.value);
        pulse.modifies(m.field);
      }
      for (i=0, n=modp.length; i<n; ++i) {
        m = modp[i];
        f = m.filter;
        tuples.forEach(function(t) {
          if (f(t)) modify(t, m.field, m.value);
        });
        pulse.modifies(m.field);
      }
      if (reflow) {
        pulse.mod = rem.length || remp.length
          ? tuples.filter(function(t) { return out.hasOwnProperty(tupleid(t)); })
          : tuples.slice();
      } else {
        for (id$$1 in out) pulse.mod.push(out[id$$1]);
      }
      return pulse;
    }
  };
}

var CACHE = '_:mod:_';
function Parameters() {
  Object.defineProperty(this, CACHE, {writable:true, value: {}});
}
var prototype = Parameters.prototype;
prototype.set = function(name, index, value, force) {
  var o = this,
      v = o[name],
      mod = o[CACHE];
  if (index != null && index >= 0) {
    if (v[index] !== value || force) {
      v[index] = value;
      mod[index + ':' + name] = -1;
      mod[name] = -1;
    }
  } else if (v !== value || force) {
    o[name] = value;
    mod[name] = isArray(value) ? 1 + value.length : -1;
  }
  return o;
};
prototype.modified = function(name, index) {
  var mod = this[CACHE], k;
  if (!arguments.length) {
    for (k in mod) { if (mod[k]) return true; }
    return false;
  } else if (isArray(name)) {
    for (k=0; k<name.length; ++k) {
      if (mod[name[k]]) return true;
    }
    return false;
  }
  return (index != null && index >= 0)
    ? (index + 1 < mod[name] || !!mod[index + ':' + name])
    : !!mod[name];
};
prototype.clear = function() {
  this[CACHE] = {};
  return this;
};

var OP_ID = 0;
var PULSE = 'pulse';
var NO_PARAMS = new Parameters();
var SKIP     = 1,
    MODIFIED = 2;
function Operator(init, update, params, react) {
  this.id = ++OP_ID;
  this.value = init;
  this.stamp = -1;
  this.rank = -1;
  this.qrank = -1;
  this.flags = 0;
  if (update) {
    this._update = update;
  }
  if (params) this.parameters(params, react);
}
var prototype$1 = Operator.prototype;
prototype$1.targets = function() {
  return this._targets || (this._targets = UniqueList(id));
};
prototype$1.set = function(value) {
  if (this.value !== value) {
    this.value = value;
    return 1;
  } else {
    return 0;
  }
};
function flag(bit) {
  return function(state) {
    var f = this.flags;
    if (arguments.length === 0) return !!(f & bit);
    this.flags = state ? (f | bit) : (f & ~bit);
    return this;
  };
}
prototype$1.skip = flag(SKIP);
prototype$1.modified = flag(MODIFIED);
prototype$1.parameters = function(params, react) {
  react = react !== false;
  var self = this,
      argval = (self._argval = self._argval || new Parameters()),
      argops = (self._argops = self._argops || []),
      deps = [],
      name, value, n, i;
  function add(name, index, value) {
    if (value instanceof Operator) {
      if (value !== self) {
        if (react) value.targets().add(self);
        deps.push(value);
      }
      argops.push({op:value, name:name, index:index});
    } else {
      argval.set(name, index, value);
    }
  }
  for (name in params) {
    value = params[name];
    if (name === PULSE) {
      array(value).forEach(function(op) {
        if (!(op instanceof Operator)) {
          error('Pulse parameters must be operator instances.');
        } else if (op !== self) {
          op.targets().add(self);
          deps.push(op);
        }
      });
      self.source = value;
    } else if (isArray(value)) {
      argval.set(name, -1, Array(n = value.length));
      for (i=0; i<n; ++i) add(name, i, value[i]);
    } else {
      add(name, -1, value);
    }
  }
  this.marshall().clear();
  return deps;
};
prototype$1.marshall = function(stamp) {
  var argval = this._argval || NO_PARAMS,
      argops = this._argops, item, i, n, op, mod;
  if (argops && (n = argops.length)) {
    for (i=0; i<n; ++i) {
      item = argops[i];
      op = item.op;
      mod = op.modified() && op.stamp === stamp;
      argval.set(item.name, item.index, op.value, mod);
    }
  }
  return argval;
};
prototype$1.evaluate = function(pulse) {
  if (this._update) {
    var params = this.marshall(pulse.stamp),
        v = this._update(params, pulse);
    params.clear();
    if (v !== this.value) {
      this.value = v;
    } else if (!this.modified()) {
      return pulse.StopPropagation;
    }
  }
};
prototype$1.run = function(pulse) {
  if (pulse.stamp <= this.stamp) return pulse.StopPropagation;
  var rv;
  if (this.skip()) {
    this.skip(false);
    rv = 0;
  } else {
    rv = this.evaluate(pulse);
  }
  this.stamp = pulse.stamp;
  this.pulse = rv;
  return rv || pulse;
};

function add(init, update, params, react) {
  var shift = 1,
    op;
  if (init instanceof Operator) {
    op = init;
  } else if (init && init.prototype instanceof Operator) {
    op = new init();
  } else if (isFunction(init)) {
    op = new Operator(null, init);
  } else {
    shift = 0;
    op = new Operator(init, update);
  }
  this.rank(op);
  if (shift) {
    react = params;
    params = update;
  }
  if (params) this.connect(op, op.parameters(params, react));
  this.touch(op);
  return op;
}

function connect(target, sources) {
  var targetRank = target.rank, i, n;
  for (i=0, n=sources.length; i<n; ++i) {
    if (targetRank < sources[i].rank) {
      this.rerank(target);
      return;
    }
  }
}

var STREAM_ID = 0;
function EventStream(filter, apply, receive) {
  this.id = ++STREAM_ID;
  this.value = null;
  if (receive) this.receive = receive;
  if (filter) this._filter = filter;
  if (apply) this._apply = apply;
}
function stream(filter, apply, receive) {
  return new EventStream(filter, apply, receive);
}
var prototype$2 = EventStream.prototype;
prototype$2._filter = truthy;
prototype$2._apply = identity;
prototype$2.targets = function() {
  return this._targets || (this._targets = UniqueList(id));
};
prototype$2.consume = function(_$$1) {
  if (!arguments.length) return !!this._consume;
  this._consume = !!_$$1;
  return this;
};
prototype$2.receive = function(evt) {
  if (this._filter(evt)) {
    var val = (this.value = this._apply(evt)),
        trg = this._targets,
        n = trg ? trg.length : 0,
        i = 0;
    for (; i<n; ++i) trg[i].receive(val);
    if (this._consume) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }
};
prototype$2.filter = function(filter) {
  var s = stream(filter);
  this.targets().add(s);
  return s;
};
prototype$2.apply = function(apply) {
  var s = stream(null, apply);
  this.targets().add(s);
  return s;
};
prototype$2.merge = function() {
  var s = stream();
  this.targets().add(s);
  for (var i=0, n=arguments.length; i<n; ++i) {
    arguments[i].targets().add(s);
  }
  return s;
};
prototype$2.throttle = function(pause) {
  var t = -1;
  return this.filter(function() {
    var now = Date.now();
    if ((now - t) > pause) {
      t = now;
      return 1;
    } else {
      return 0;
    }
  });
};
prototype$2.debounce = function(delay) {
  var s = stream();
  this.targets().add(stream(null, null,
    debounce(delay, function(e) {
      var df = e.dataflow;
      s.receive(e);
      if (df && df.run) df.run();
    })
  ));
  return s;
};
prototype$2.between = function(a, b) {
  var active = false;
  a.targets().add(stream(null, null, function() { active = true; }));
  b.targets().add(stream(null, null, function() { active = false; }));
  return this.filter(function() { return active; });
};

function events(source, type, filter, apply) {
  var df = this,
      s = stream(filter, apply),
      send = function(e) {
        e.dataflow = df;
        try {
          s.receive(e);
        } catch (error$$1) {
          df.error(error$$1);
        } finally {
          df.run();
        }
      },
      sources;
  if (typeof source === 'string' && typeof document !== 'undefined') {
    sources = document.querySelectorAll(source);
  } else {
    sources = array(source);
  }
  for (var i=0, n=sources.length; i<n; ++i) {
    sources[i].addEventListener(type, send);
  }
  return s;
}

var protocol_re = /^([A-Za-z]+:)?\/\//;
var fileProtocol = 'file://';
var requestOptions = [
  'mimeType',
  'responseType',
  'user',
  'password'
];
function loader(options) {
  return {
    options: options || {},
    sanitize: sanitize,
    load: load,
    file: file,
    http: http
  };
}
function marshall(loader, options) {
  return extend({}, loader.options, options);
}
function load(uri, options) {
  var loader = this;
  return loader.sanitize(uri, options)
    .then(function(opt) {
      var url = opt.href;
      return opt.localFile
        ? loader.file(url)
        : loader.http(url, options);
    });
}
function sanitize(uri, options) {
  options = marshall(this, options);
  return new Promise(function(accept, reject) {
    var result = {href: null},
        isFile, hasProtocol, loadFile, base;
    if (uri == null || typeof uri !== 'string') {
      reject('Sanitize failure, invalid URI: ' + $(uri));
      return;
    }
    hasProtocol = protocol_re.test(uri);
    if ((base = options.baseURL) && !hasProtocol) {
      if (!startsWith(uri, '/') && base[base.length-1] !== '/') {
        uri = '/' + uri;
      }
      uri = base + uri;
    }
    loadFile = (isFile = startsWith(uri, fileProtocol))
      || options.mode === 'file'
      || options.mode !== 'http' && !hasProtocol && fs();
    if (isFile) {
      uri = uri.slice(fileProtocol.length);
    } else if (startsWith(uri, '//')) {
      if (options.defaultProtocol === 'file') {
        uri = uri.slice(2);
        loadFile = true;
      } else {
        uri = (options.defaultProtocol || 'http') + ':' + uri;
      }
    }
    Object.defineProperty(result, 'localFile', {value: !!loadFile});
    result.href = uri;
    if (options.target) {
      result.target = options.target + '';
    }
    accept(result);
  });
}
function http(url, options) {
  options = marshall(this, options);
  return new Promise(function(accept, reject) {
    var req = request(url),
        name;
    for (name in options.headers) {
      req.header(name, options.headers[name]);
    }
    requestOptions.forEach(function(name) {
      if (options[name]) req[name](options[name]);
    });
    req.on('error', function(error$$1) {
        reject(error$$1 || 'Error loading URL: ' + url);
      })
      .on('load', function(result) {
        var text = result && result.responseText;
        (!result || result.status === 0)
          ? reject(text || 'Error')
          : accept(text);
      })
      .get();
  });
}
function file(filename) {
  return new Promise(function(accept, reject) {
    var f = fs();
    f ? f.readFile(filename, function(error$$1, data) {
          if (error$$1) reject(error$$1);
          else accept(data);
        })
      : reject('No file system access for ' + filename);
  });
}
function fs() {
  var fs = typeof require === 'function' && require('fs');
  return fs && isFunction(fs.readFile) ? fs : null;
}
function startsWith(string, query) {
  return string == null ? false : string.lastIndexOf(query, 0) === 0;
}

var typeParsers = {
  boolean: toBoolean,
  integer: toNumber,
  number:  toNumber,
  date:    toDate,
  string:  toString,
  unknown: identity
};
var typeTests = [
  isBoolean$1,
  isInteger,
  isNumber$1,
  isDate$1
];
var typeList = [
  'boolean',
  'integer',
  'number',
  'date'
];
function inferType(values, field$$1) {
  if (!values || !values.length) return 'unknown';
  var tests = typeTests.slice(),
      value, i, n, j;
  for (i=0, n=values.length; i<n; ++i) {
    value = field$$1 ? values[i][field$$1] : values[i];
    for (j=0; j<tests.length; ++j) {
      if (isValid(value) && !tests[j](value)) {
        tests.splice(j, 1); --j;
      }
    }
    if (tests.length === 0) return 'string';
  }
  return typeList[typeTests.indexOf(tests[0])];
}
function inferTypes(data, fields) {
  return fields.reduce(function(types, field$$1) {
    types[field$$1] = inferType(data, field$$1);
    return types;
  }, {});
}
function isValid(_$$1) {
  return _$$1 != null && _$$1 === _$$1;
}
function isBoolean$1(_$$1) {
  return _$$1 === 'true' || _$$1 === 'false' || _$$1 === true || _$$1 === false;
}
function isDate$1(_$$1) {
  return !isNaN(Date.parse(_$$1));
}
function isNumber$1(_$$1) {
  return !isNaN(+_$$1) && !(_$$1 instanceof Date);
}
function isInteger(_$$1) {
  return isNumber$1(_$$1) && (_$$1=+_$$1) === ~~_$$1;
}

function delimitedFormat(delimiter) {
  return function(data, format$$1) {
    var delim = {delimiter: delimiter};
    return dsv(data, format$$1 ? extend(format$$1, delim) : delim);
  };
}
function dsv(data, format$$1) {
  if (format$$1.header) {
    data = format$$1.header
      .map($)
      .join(format$$1.delimiter) + '\n' + data;
  }
  return dsvFormat(format$$1.delimiter).parse(data+'');
}

function isBuffer(_$$1) {
  return (typeof Buffer === 'function' && isFunction(Buffer.isBuffer))
    ? Buffer.isBuffer(_$$1) : false;
}
function json(data, format$$1) {
  var prop = (format$$1 && format$$1.property) ? field(format$$1.property) : identity;
  return isObject(data) && !isBuffer(data)
    ? parseJSON(prop(data))
    : prop(JSON.parse(data));
}
function parseJSON(data, format$$1) {
  return (format$$1 && format$$1.copy)
    ? JSON.parse(JSON.stringify(data))
    : data;
}

function topojson(data, format$$1) {
  var method, object, property;
  data = json(data, format$$1);
  method = (format$$1 && (property = format$$1.feature)) ? feature
    : (format$$1 && (property = format$$1.mesh)) ? mesh
    : error('Missing TopoJSON feature or mesh parameter.');
  object = (object = data.objects[property])
    ? method(data, object)
    : error('Invalid TopoJSON object: ' + property);
  return object && object.features || [object];
}

var formats = {
  dsv: dsv,
  csv: delimitedFormat(','),
  tsv: delimitedFormat('\t'),
  json: json,
  topojson: topojson
};
function formats$1(name, format$$1) {
  if (arguments.length > 1) {
    formats[name] = format$$1;
    return this;
  } else {
    return formats.hasOwnProperty(name) ? formats[name] : null;
  }
}

function read(data, schema, dateParse) {
  schema = schema || {};
  var reader = formats$1(schema.type || 'json');
  if (!reader) error('Unknown data format type: ' + schema.type);
  data = reader(data, schema);
  if (schema.parse) parse(data, schema.parse, dateParse);
  if (data.hasOwnProperty('columns')) delete data.columns;
  return data;
}
function parse(data, types, dateParse) {
  if (!data.length) return;
  dateParse = dateParse || timeParse;
  var fields = data.columns || Object.keys(data[0]),
      parsers, datum, field$$1, i, j, n, m;
  if (types === 'auto') types = inferTypes(data, fields);
  fields = Object.keys(types);
  parsers = fields.map(function(field$$1) {
    var type = types[field$$1],
        parts, pattern;
    if (type && (type.indexOf('date:') === 0 || type.indexOf('utc:') === 0)) {
      parts = type.split(/:(.+)?/, 2);
      pattern = parts[1];
      if ((pattern[0] === '\'' && pattern[pattern.length-1] === '\'') ||
          (pattern[0] === '"'  && pattern[pattern.length-1] === '"')) {
        pattern = pattern.slice(1, -1);
      }
      return parts[0] === 'utc' ? utcParse(pattern) : dateParse(pattern);
    }
    if (!typeParsers[type]) {
      throw Error('Illegal format pattern: ' + field$$1 + ':' + type);
    }
    return typeParsers[type];
  });
  for (i=0, n=data.length, m=fields.length; i<n; ++i) {
    datum = data[i];
    for (j=0; j<m; ++j) {
      field$$1 = fields[j];
      datum[field$$1] = parsers[j](datum[field$$1]);
    }
  }
}

function ingest$1(target, data, format$$1) {
  return this.pulse(target, this.changeset().insert(read(data, format$$1)));
}
function loadPending(df) {
  var accept, reject,
      pending = new Promise(function(a, r) {
        accept = a;
        reject = r;
      });
  pending.requests = 0;
  pending.done = function() {
    if (--pending.requests === 0) {
      df.runAfter(function() {
        df._pending = null;
        try {
          df.run();
          accept(df);
        } catch (err) {
          reject(err);
        }
      });
    }
  };
  return (df._pending = pending);
}
function request$1(target, url, format$$1) {
  var df = this,
      pending = df._pending || loadPending(df);
  pending.requests += 1;
  df.loader()
    .load(url, {context:'dataflow'})
    .then(
      function(data) { df.ingest(target, data, format$$1); },
      function(error) { df.error('Loading failed', url, error); })
    .catch(
      function(error) { df.error('Data ingestion failed', url, error); })
    .then(pending.done, pending.done);
}

var SKIP$1 = {skip: true};
function on(source, target, update, params, options) {
  var fn = source instanceof Operator ? onOperator : onStream;
  fn(this, source, target, update, params, options);
  return this;
}
function onStream(df, stream, target, update, params, options) {
  var opt = extend({}, options, SKIP$1), func, op;
  if (!isFunction(target)) target = constant(target);
  if (update === undefined) {
    func = function(e) {
      df.touch(target(e));
    };
  } else if (isFunction(update)) {
    op = new Operator(null, update, params, false);
    func = function(e) {
      var v, t = target(e);
      op.evaluate(e);
      isChangeSet(v = op.value) ? df.pulse(t, v, options) : df.update(t, v, opt);
    };
  } else {
    func = function(e) {
      df.update(target(e), update, opt);
    };
  }
  stream.apply(func);
}
function onOperator(df, source, target, update, params, options) {
  var func, op;
  if (update === undefined) {
    op = target;
  } else {
    func = isFunction(update) ? update : constant(update);
    update = !target ? func : function(_$$1, pulse) {
      var value = func(_$$1, pulse);
      return target.skip()
        ? value
        : (target.skip(true).value = value);
    };
    op = new Operator(null, update, params, false);
    op.modified(options && options.force);
    op.rank = 0;
    if (target) {
      op.skip(true);
      op.value = target.value;
      op.targets().add(target);
    }
  }
  source.targets().add(op);
}

function rank(op) {
  op.rank = ++this._rank;
}
function rerank(op) {
  var queue = [op],
      cur, list, i;
  while (queue.length) {
    this.rank(cur = queue.pop());
    if (list = cur._targets) {
      for (i=list.length; --i >= 0;) {
        queue.push(cur = list[i]);
        if (cur === op) error('Cycle detected in dataflow graph.');
      }
    }
  }
}

var StopPropagation = {};
var ADD       = (1 << 0),
    REM       = (1 << 1),
    MOD       = (1 << 2),
    ADD_REM   = ADD | REM,
    ADD_MOD   = ADD | MOD,
    ALL       = ADD | REM | MOD,
    REFLOW    = (1 << 3),
    SOURCE    = (1 << 4),
    NO_SOURCE = (1 << 5),
    NO_FIELDS = (1 << 6);
function Pulse(dataflow, stamp, encode) {
  this.dataflow = dataflow;
  this.stamp = stamp == null ? -1 : stamp;
  this.add = [];
  this.rem = [];
  this.mod = [];
  this.fields = null;
  this.encode = encode || null;
}
var prototype$3 = Pulse.prototype;
prototype$3.StopPropagation = StopPropagation;
prototype$3.ADD = ADD;
prototype$3.REM = REM;
prototype$3.MOD = MOD;
prototype$3.ADD_REM = ADD_REM;
prototype$3.ADD_MOD = ADD_MOD;
prototype$3.ALL = ALL;
prototype$3.REFLOW = REFLOW;
prototype$3.SOURCE = SOURCE;
prototype$3.NO_SOURCE = NO_SOURCE;
prototype$3.NO_FIELDS = NO_FIELDS;
prototype$3.fork = function(flags) {
  return new Pulse(this.dataflow).init(this, flags);
};
prototype$3.clone = function() {
  var p = this.fork(ALL);
  p.add = p.add.slice();
  p.rem = p.rem.slice();
  p.mod = p.mod.slice();
  if (p.source) p.source = p.source.slice();
  return p.materialize(ALL | SOURCE);
};
prototype$3.addAll = function() {
  var p = this;
  if (!this.source || this.source.length === this.add.length) {
    return p;
  } else {
    p = new Pulse(this.dataflow).init(this);
    p.add = p.source;
    return p;
  }
};
prototype$3.init = function(src, flags) {
  var p = this;
  p.stamp = src.stamp;
  p.encode = src.encode;
  if (src.fields && !(flags & NO_FIELDS)) {
    p.fields = src.fields;
  }
  if (flags & ADD) {
    p.addF = src.addF;
    p.add = src.add;
  } else {
    p.addF = null;
    p.add = [];
  }
  if (flags & REM) {
    p.remF = src.remF;
    p.rem = src.rem;
  } else {
    p.remF = null;
    p.rem = [];
  }
  if (flags & MOD) {
    p.modF = src.modF;
    p.mod = src.mod;
  } else {
    p.modF = null;
    p.mod = [];
  }
  if (flags & NO_SOURCE) {
    p.srcF = null;
    p.source = null;
  } else {
    p.srcF = src.srcF;
    p.source = src.source;
  }
  return p;
};
prototype$3.runAfter = function(func) {
  this.dataflow.runAfter(func);
};
prototype$3.changed = function(flags) {
  var f = flags || ALL;
  return ((f & ADD) && this.add.length)
      || ((f & REM) && this.rem.length)
      || ((f & MOD) && this.mod.length);
};
prototype$3.reflow = function(fork) {
  if (fork) return this.fork(ALL).reflow();
  var len = this.add.length,
      src = this.source && this.source.length;
  if (src && src !== len) {
    this.mod = this.source;
    if (len) this.filter(MOD, filter(this, ADD));
  }
  return this;
};
prototype$3.modifies = function(_$$1) {
  var fields = array(_$$1),
      hash = this.fields || (this.fields = {});
  fields.forEach(function(f) { hash[f] = true; });
  return this;
};
prototype$3.modified = function(_$$1) {
  var fields = this.fields;
  return !(this.mod.length && fields) ? false
    : !arguments.length ? !!fields
    : isArray(_$$1) ? _$$1.some(function(f) { return fields[f]; })
    : fields[_$$1];
};
prototype$3.filter = function(flags, filter) {
  var p = this;
  if (flags & ADD) p.addF = addFilter(p.addF, filter);
  if (flags & REM) p.remF = addFilter(p.remF, filter);
  if (flags & MOD) p.modF = addFilter(p.modF, filter);
  if (flags & SOURCE) p.srcF = addFilter(p.srcF, filter);
  return p;
};
function addFilter(a, b) {
  return a ? function(t,i) { return a(t,i) && b(t,i); } : b;
}
prototype$3.materialize = function(flags) {
  flags = flags || ALL;
  var p = this;
  if ((flags & ADD) && p.addF) {
    p.add = materialize(p.add, p.addF);
    p.addF = null;
  }
  if ((flags & REM) && p.remF) {
    p.rem = materialize(p.rem, p.remF);
    p.remF = null;
  }
  if ((flags & MOD) && p.modF) {
    p.mod = materialize(p.mod, p.modF);
    p.modF = null;
  }
  if ((flags & SOURCE) && p.srcF) {
    p.source = p.source.filter(p.srcF);
    p.srcF = null;
  }
  return p;
};
function materialize(data, filter) {
  var out = [];
  visitArray(data, filter, function(_$$1) { out.push(_$$1); });
  return out;
}
function filter(pulse, flags) {
  var map = {};
  pulse.visit(flags, function(t) { map[tupleid(t)] = 1; });
  return function(t) { return map[tupleid(t)] ? null : t; };
}
prototype$3.visit = function(flags, visitor) {
  var p = this, v = visitor, src, sum$$1;
  if (flags & SOURCE) {
    visitArray(p.source, p.srcF, v);
    return p;
  }
  if (flags & ADD) visitArray(p.add, p.addF, v);
  if (flags & REM) visitArray(p.rem, p.remF, v);
  if (flags & MOD) visitArray(p.mod, p.modF, v);
  if ((flags & REFLOW) && (src = p.source)) {
    sum$$1 = p.add.length + p.mod.length;
    if (sum$$1 === src.length) ; else if (sum$$1) {
      visitArray(src, filter(p, ADD_MOD), v);
    } else {
      visitArray(src, p.srcF, v);
    }
  }
  return p;
};

function MultiPulse(dataflow, stamp, pulses, encode) {
  var p = this,
      c = 0,
      pulse, hash, i, n, f;
  this.dataflow = dataflow;
  this.stamp = stamp;
  this.fields = null;
  this.encode = encode || null;
  this.pulses = pulses;
  for (i=0, n=pulses.length; i<n; ++i) {
    pulse = pulses[i];
    if (pulse.stamp !== stamp) continue;
    if (pulse.fields) {
      hash = p.fields || (p.fields = {});
      for (f in pulse.fields) { hash[f] = 1; }
    }
    if (pulse.changed(p.ADD)) c |= p.ADD;
    if (pulse.changed(p.REM)) c |= p.REM;
    if (pulse.changed(p.MOD)) c |= p.MOD;
  }
  this.changes = c;
}
var prototype$4 = inherits(MultiPulse, Pulse);
prototype$4.fork = function(flags) {
  var p = new Pulse(this.dataflow).init(this, flags & this.NO_FIELDS);
  if (flags !== undefined) {
    if (flags & p.ADD) {
      this.visit(p.ADD, function(t) { return p.add.push(t); });
    }
    if (flags & p.REM) {
      this.visit(p.REM, function(t) { return p.rem.push(t); });
    }
    if (flags & p.MOD) {
      this.visit(p.MOD, function(t) { return p.mod.push(t); });
    }
  }
  return p;
};
prototype$4.changed = function(flags) {
  return this.changes & flags;
};
prototype$4.modified = function(_$$1) {
  var p = this, fields = p.fields;
  return !(fields && (p.changes & p.MOD)) ? 0
    : isArray(_$$1) ? _$$1.some(function(f) { return fields[f]; })
    : fields[_$$1];
};
prototype$4.filter = function() {
  error('MultiPulse does not support filtering.');
};
prototype$4.materialize = function() {
  error('MultiPulse does not support materialization.');
};
prototype$4.visit = function(flags, visitor) {
  var p = this,
      pulses = p.pulses,
      n = pulses.length,
      i = 0;
  if (flags & p.SOURCE) {
    for (; i<n; ++i) {
      pulses[i].visit(flags, visitor);
    }
  } else {
    for (; i<n; ++i) {
      if (pulses[i].stamp === p.stamp) {
        pulses[i].visit(flags, visitor);
      }
    }
  }
  return p;
};

function run(encode) {
  var df = this,
      count = 0,
      level = df.logLevel(),
      op, next, dt, error$$1;
  if (df._pending) {
    df.info('Awaiting requests, delaying dataflow run.');
    return 0;
  }
  if (df._pulse) {
    df.error('Dataflow invoked recursively. Use the runAfter method to queue invocation.');
    return 0;
  }
  if (!df._touched.length) {
    df.info('Dataflow invoked, but nothing to do.');
    return 0;
  }
  df._pulse = new Pulse(df, ++df._clock, encode);
  if (level >= Info) {
    dt = Date.now();
    df.debug('-- START PROPAGATION (' + df._clock + ') -----');
  }
  df._touched.forEach(function(op) { df._enqueue(op, true); });
  df._touched = UniqueList(id);
  try {
    while (df._heap.size() > 0) {
      op = df._heap.pop();
      if (op.rank !== op.qrank) { df._enqueue(op, true); continue; }
      next = op.run(df._getPulse(op, encode));
      if (level >= Debug) {
        df.debug(op.id, next === StopPropagation ? 'STOP' : next, op);
      }
      if (next !== StopPropagation) {
        df._pulse = next;
        if (op._targets) op._targets.forEach(function(op) { df._enqueue(op); });
      }
      ++count;
    }
  } catch (err) {
    error$$1 = err;
  }
  df._pulses = {};
  df._pulse = null;
  if (level >= Info) {
    dt = Date.now() - dt;
    df.info('> Pulse ' + df._clock + ': ' + count + ' operators; ' + dt + 'ms');
  }
  if (error$$1) {
    df._postrun = [];
    df.error(error$$1);
  }
  if (df._onrun) {
    try { df._onrun(df, count, error$$1); } catch (err) { df.error(err); }
  }
  if (df._postrun.length) {
    var postrun = df._postrun;
    df._postrun = [];
    postrun
      .sort(function(a, b) { return b.priority - a.priority; })
      .forEach(function(_$$1) { invokeCallback(df, _$$1.callback); });
  }
  return count;
}
function invokeCallback(df, callback) {
  try { callback(df); } catch (err) { df.error(err); }
}
function runAsync() {
  return this._pending || Promise.resolve(this.run());
}
function runAfter(callback, enqueue, priority) {
  if (this._pulse || enqueue) {
    this._postrun.push({
      priority: priority || 0,
      callback: callback
    });
  } else {
    invokeCallback(this, callback);
  }
}
function enqueue(op, force) {
  var p = !this._pulses[op.id];
  if (p) this._pulses[op.id] = this._pulse;
  if (p || force) {
    op.qrank = op.rank;
    this._heap.push(op);
  }
}
function getPulse(op, encode) {
  var s = op.source,
      stamp = this._clock,
      p;
  if (s && isArray(s)) {
    p = s.map(function(_$$1) { return _$$1.pulse; });
    return new MultiPulse(this, stamp, p, encode);
  }
  p = this._pulses[op.id];
  if (s) {
    s = s.pulse;
    if (!s || s === StopPropagation) {
      p.source = [];
    } else if (s.stamp === stamp && p.target !== op) {
      p = s;
    } else {
      p.source = s.source;
    }
  }
  return p;
}

var NO_OPT = {skip: false, force: false};
function touch(op, options) {
  var opt = options || NO_OPT;
  if (this._pulse) {
    this._enqueue(op);
  } else {
    this._touched.add(op);
  }
  if (opt.skip) op.skip(true);
  return this;
}
function update(op, value, options) {
  var opt = options || NO_OPT;
  if (op.set(value) || opt.force) {
    this.touch(op, opt);
  }
  return this;
}
function pulse(op, changeset, options) {
  this.touch(op, options || NO_OPT);
  var p = new Pulse(this, this._clock + (this._pulse ? 0 : 1)),
      t = op.pulse && op.pulse.source || [];
  p.target = op;
  this._pulses[op.id] = changeset.pulse(p, t);
  return this;
}

function Heap(comparator) {
  this.cmp = comparator;
  this.nodes = [];
}
var prototype$5 = Heap.prototype;
prototype$5.size = function() {
  return this.nodes.length;
};
prototype$5.clear = function() {
  this.nodes = [];
  return this;
};
prototype$5.peek = function() {
  return this.nodes[0];
};
prototype$5.push = function(x) {
  var array = this.nodes;
  array.push(x);
  return siftdown(array, 0, array.length-1, this.cmp);
};
prototype$5.pop = function() {
  var array = this.nodes,
      last = array.pop(),
      item;
  if (array.length) {
    item = array[0];
    array[0] = last;
    siftup(array, 0, this.cmp);
  } else {
    item = last;
  }
  return item;
};
prototype$5.replace = function(item) {
  var array = this.nodes,
      retval = array[0];
  array[0] = item;
  siftup(array, 0, this.cmp);
  return retval;
};
prototype$5.pushpop = function(item) {
  var array = this.nodes, ref = array[0];
  if (array.length && this.cmp(ref, item) < 0) {
    array[0] = item;
    item = ref;
    siftup(array, 0, this.cmp);
  }
  return item;
};
function siftdown(array, start, idx, cmp) {
  var item, parent, pidx;
  item = array[idx];
  while (idx > start) {
    pidx = (idx - 1) >> 1;
    parent = array[pidx];
    if (cmp(item, parent) < 0) {
      array[idx] = parent;
      idx = pidx;
      continue;
    }
    break;
  }
  return (array[idx] = item);
}
function siftup(array, idx, cmp) {
  var start = idx,
      end = array.length,
      item = array[idx],
      cidx = 2 * idx + 1, ridx;
  while (cidx < end) {
    ridx = cidx + 1;
    if (ridx < end && cmp(array[cidx], array[ridx]) >= 0) {
      cidx = ridx;
    }
    array[idx] = array[cidx];
    idx = cidx;
    cidx = 2 * idx + 1;
  }
  array[idx] = item;
  return siftdown(array, start, idx, cmp);
}

function Dataflow() {
  this._log = logger();
  this.logLevel(Error$1);
  this._clock = 0;
  this._rank = 0;
  try {
    this._loader = loader();
  } catch (e) {
  }
  this._touched = UniqueList(id);
  this._pulses = {};
  this._pulse = null;
  this._heap = new Heap(function(a, b) { return a.qrank - b.qrank; });
  this._postrun = [];
}
var prototype$6 = Dataflow.prototype;
prototype$6.stamp = function() {
  return this._clock;
};
prototype$6.loader = function(_$$1) {
  if (arguments.length) {
    this._loader = _$$1;
    return this;
  } else {
    return this._loader;
  }
};
prototype$6.cleanThreshold = 1e4;
prototype$6.add = add;
prototype$6.connect = connect;
prototype$6.rank = rank;
prototype$6.rerank = rerank;
prototype$6.pulse = pulse;
prototype$6.touch = touch;
prototype$6.update = update;
prototype$6.changeset = changeset;
prototype$6.ingest = ingest$1;
prototype$6.request = request$1;
prototype$6.events = events;
prototype$6.on = on;
prototype$6.run = run;
prototype$6.runAsync = runAsync;
prototype$6.runAfter = runAfter;
prototype$6._enqueue = enqueue;
prototype$6._getPulse = getPulse;
function logMethod(method) {
  return function() {
    return this._log[method].apply(this, arguments);
  };
}
prototype$6.error = logMethod('error');
prototype$6.warn = logMethod('warn');
prototype$6.info = logMethod('info');
prototype$6.debug = logMethod('debug');
prototype$6.logLevel = logMethod('level');

function Transform(init, params) {
  Operator.call(this, init, null, params);
}
var prototype$7 = inherits(Transform, Operator);
prototype$7.run = function(pulse) {
  if (pulse.stamp <= this.stamp) return pulse.StopPropagation;
  var rv;
  if (this.skip()) {
    this.skip(false);
  } else {
    rv = this.evaluate(pulse);
  }
  rv = rv || pulse;
  if (rv !== pulse.StopPropagation) this.pulse = rv;
  this.stamp = pulse.stamp;
  return rv;
};
prototype$7.evaluate = function(pulse) {
  var params = this.marshall(pulse.stamp),
      out = this.transform(params, pulse);
  params.clear();
  return out;
};
prototype$7.transform = function() {};

var transforms = {};
function definition(type) {
  var t = transform(type);
  return t && t.Definition || null;
}
function transform(type) {
  type = type && type.toLowerCase();
  return transforms.hasOwnProperty(type) ? transforms[type] : null;
}

function multikey(f) {
  return function(x) {
    var n = f.length,
        i = 1,
        k = String(f[0](x));
    for (; i<n; ++i) {
      k += '|' + f[i](x);
    }
    return k;
  };
}
function groupkey(fields) {
  return !fields || !fields.length ? function() { return ''; }
    : fields.length === 1 ? fields[0]
    : multikey(fields);
}

function measureName(op, field$$1, as) {
  return as || (op + (!field$$1 ? '' : '_' + field$$1));
}
var AggregateOps = {
  'values': measure({
    name: 'values',
    init: 'cell.store = true;',
    set:  'cell.data.values()', idx: -1
  }),
  'count': measure({
    name: 'count',
    set:  'cell.num'
  }),
  '__count__': measure({
    name: 'count',
    set:  'this.missing + this.valid'
  }),
  'missing': measure({
    name: 'missing',
    set:  'this.missing'
  }),
  'valid': measure({
    name: 'valid',
    set:  'this.valid'
  }),
  'sum': measure({
    name: 'sum',
    init: 'this.sum = 0;',
    add:  'this.sum += v;',
    rem:  'this.sum -= v;',
    set:  'this.sum'
  }),
  'mean': measure({
    name: 'mean',
    init: 'this.mean = 0;',
    add:  'var d = v - this.mean; this.mean += d / this.valid;',
    rem:  'var d = v - this.mean; this.mean -= this.valid ? d / this.valid : this.mean;',
    set:  'this.mean'
  }),
  'average': measure({
    name: 'average',
    set:  'this.mean',
    req:  ['mean'], idx: 1
  }),
  'variance': measure({
    name: 'variance',
    init: 'this.dev = 0;',
    add:  'this.dev += d * (v - this.mean);',
    rem:  'this.dev -= d * (v - this.mean);',
    set:  'this.valid > 1 ? this.dev / (this.valid-1) : 0',
    req:  ['mean'], idx: 1
  }),
  'variancep': measure({
    name: 'variancep',
    set:  'this.valid > 1 ? this.dev / this.valid : 0',
    req:  ['variance'], idx: 2
  }),
  'stdev': measure({
    name: 'stdev',
    set:  'this.valid > 1 ? Math.sqrt(this.dev / (this.valid-1)) : 0',
    req:  ['variance'], idx: 2
  }),
  'stdevp': measure({
    name: 'stdevp',
    set:  'this.valid > 1 ? Math.sqrt(this.dev / this.valid) : 0',
    req:  ['variance'], idx: 2
  }),
  'stderr': measure({
    name: 'stderr',
    set:  'this.valid > 1 ? Math.sqrt(this.dev / (this.valid * (this.valid-1))) : 0',
    req:  ['variance'], idx: 2
  }),
  'distinct': measure({
    name: 'distinct',
    set:  'cell.data.distinct(this.get)',
    req:  ['values'], idx: 3
  }),
  'ci0': measure({
    name: 'ci0',
    set:  'cell.data.ci0(this.get)',
    req:  ['values'], idx: 3
  }),
  'ci1': measure({
    name: 'ci1',
    set:  'cell.data.ci1(this.get)',
    req:  ['values'], idx: 3
  }),
  'median': measure({
    name: 'median',
    set:  'cell.data.q2(this.get)',
    req:  ['values'], idx: 3
  }),
  'q1': measure({
    name: 'q1',
    set:  'cell.data.q1(this.get)',
    req:  ['values'], idx: 3
  }),
  'q3': measure({
    name: 'q3',
    set:  'cell.data.q3(this.get)',
    req:  ['values'], idx: 3
  }),
  'argmin': measure({
    name: 'argmin',
    init: 'this.argmin = null;',
    add:  'if (v < this.min) this.argmin = t;',
    rem:  'if (v <= this.min) this.argmin = null;',
    set:  'this.argmin || cell.data.argmin(this.get)',
    req:  ['min'], str: ['values'], idx: 3
  }),
  'argmax': measure({
    name: 'argmax',
    init: 'this.argmax = null;',
    add:  'if (v > this.max) this.argmax = t;',
    rem:  'if (v >= this.max) this.argmax = null;',
    set:  'this.argmax || cell.data.argmax(this.get)',
    req:  ['max'], str: ['values'], idx: 3
  }),
  'min': measure({
    name: 'min',
    init: 'this.min = null;',
    add:  'if (v < this.min || this.min === null) this.min = v;',
    rem:  'if (v <= this.min) this.min = NaN;',
    set:  'this.min = (isNaN(this.min) ? cell.data.min(this.get) : this.min)',
    str:  ['values'], idx: 4
  }),
  'max': measure({
    name: 'max',
    init: 'this.max = null;',
    add:  'if (v > this.max || this.max === null) this.max = v;',
    rem:  'if (v >= this.max) this.max = NaN;',
    set:  'this.max = (isNaN(this.max) ? cell.data.max(this.get) : this.max)',
    str:  ['values'], idx: 4
  })
};
var ValidAggregateOps = Object.keys(AggregateOps);
function createMeasure(op, name) {
  return AggregateOps[op](name);
}
function measure(base) {
  return function(out) {
    var m = extend({init:'', add:'', rem:'', idx:0}, base);
    m.out = out || base.name;
    return m;
  };
}
function compareIndex(a, b) {
  return a.idx - b.idx;
}
function resolve(agg, stream) {
  function collect(m, a) {
    function helper(r) { if (!m[r]) collect(m, m[r] = AggregateOps[r]()); }
    if (a.req) a.req.forEach(helper);
    if (stream && a.str) a.str.forEach(helper);
    return m;
  }
  var map = agg.reduce(
    collect,
    agg.reduce(function(m, a) {
      m[a.name] = a;
      return m;
    }, {})
  );
  var values = [], key$$1;
  for (key$$1 in map) values.push(map[key$$1]);
  return values.sort(compareIndex);
}
function compileMeasures(agg, field$$1) {
  var get = field$$1 || identity,
      all = resolve(agg, true),
      init = 'var cell = this.cell; this.valid = 0; this.missing = 0;',
      ctr = 'this.cell = cell; this.init();',
      add = 'if(v==null){++this.missing; return;} if(v!==v) return; ++this.valid;',
      rem = 'if(v==null){--this.missing; return;} if(v!==v) return; --this.valid;',
      set = 'var cell = this.cell;';
  all.forEach(function(a) {
    init += a.init;
    add += a.add;
    rem += a.rem;
  });
  agg.slice().sort(compareIndex).forEach(function(a) {
    set += 't[\'' + a.out + '\']=' + a.set + ';';
  });
  set += 'return t;';
  ctr = Function('cell', ctr);
  ctr.prototype.init = Function(init);
  ctr.prototype.add = Function('v', 't', add);
  ctr.prototype.rem = Function('v', 't', rem);
  ctr.prototype.set = Function('t', set);
  ctr.prototype.get = get;
  ctr.fields = agg.map(function(_$$1) { return _$$1.out; });
  return ctr;
}

function bin(_$$1) {
  var maxb = _$$1.maxbins || 20,
      base = _$$1.base || 10,
      logb = Math.log(base),
      div  = _$$1.divide || [5, 2],
      min$$1  = _$$1.extent[0],
      max$$1  = _$$1.extent[1],
      span = max$$1 - min$$1,
      step, level, minstep, precision, v, i, n, eps;
  if (_$$1.step) {
    step = _$$1.step;
  } else if (_$$1.steps) {
    v = span / maxb;
    for (i=0, n=_$$1.steps.length; i < n && _$$1.steps[i] < v; ++i);
    step = _$$1.steps[Math.max(0, i-1)];
  } else {
    level = Math.ceil(Math.log(maxb) / logb);
    minstep = _$$1.minstep || 0;
    step = Math.max(
      minstep,
      Math.pow(base, Math.round(Math.log(span) / logb) - level)
    );
    while (Math.ceil(span/step) > maxb) { step *= base; }
    for (i=0, n=div.length; i<n; ++i) {
      v = step / div[i];
      if (v >= minstep && span / v <= maxb) step = v;
    }
  }
  v = Math.log(step);
  precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
  eps = Math.pow(base, -precision - 1);
  if (_$$1.nice || _$$1.nice === undefined) {
    v = Math.floor(min$$1 / step + eps) * step;
    min$$1 = min$$1 < v ? v - step : v;
    max$$1 = Math.ceil(max$$1 / step) * step;
  }
  return {
    start: min$$1,
    stop:  max$$1,
    step:  step
  };
}

function numbers(array, f) {
  var numbers = [],
      n = array.length,
      i = -1, a;
  if (f == null) {
    while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
  } else {
    while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) numbers.push(a);
  }
  return numbers;
}
function number(x) {
  return x === null ? NaN : +x;
}

var random = Math.random;
function setRandom(r) {
  random = r;
}

function bootstrapCI(array, samples, alpha, f) {
  if (!array.length) return [undefined, undefined];
  var values = numbers(array, f),
      n = values.length,
      m = samples,
      a, i, j, mu;
  for (j=0, mu=Array(m); j<m; ++j) {
    for (a=0, i=0; i<n; ++i) {
      a += values[~~(random() * n)];
    }
    mu[j] = a / n;
  }
  return [
    quantile(mu.sort(ascending), alpha/2),
    quantile(mu, 1-(alpha/2))
  ];
}

function quartiles(array, f) {
  var values = numbers(array, f);
  return [
    quantile(values.sort(ascending), 0.25),
    quantile(values, 0.50),
    quantile(values, 0.75)
  ];
}

function integer(min$$1, max$$1) {
  if (max$$1 == null) {
    max$$1 = min$$1;
    min$$1 = 0;
  }
  var dist = {},
      a, b, d;
  dist.min = function(_$$1) {
    if (arguments.length) {
      a = _$$1 || 0;
      d = b - a;
      return dist;
    } else {
      return a;
    }
  };
  dist.max = function(_$$1) {
    if (arguments.length) {
      b = _$$1 || 0;
      d = b - a;
      return dist;
    } else {
      return b;
    }
  };
  dist.sample = function() {
    return a + Math.floor(d * random());
  };
  dist.pdf = function(x) {
    return (x === Math.floor(x) && x >= a && x < b) ? 1 / d : 0;
  };
  dist.cdf = function(x) {
    var v = Math.floor(x);
    return v < a ? 0 : v >= b ? 1 : (v - a + 1) / d;
  };
  dist.icdf = function(p) {
    return (p >= 0 && p <= 1) ? a - 1 + Math.floor(p * d) : NaN;
  };
  return dist.min(min$$1).max(max$$1);
}

function gaussian(mean$$1, stdev) {
  var mu,
      sigma,
      next = NaN,
      dist = {};
  dist.mean = function(_$$1) {
    if (arguments.length) {
      mu = _$$1 || 0;
      next = NaN;
      return dist;
    } else {
      return mu;
    }
  };
  dist.stdev = function(_$$1) {
    if (arguments.length) {
      sigma = _$$1 == null ? 1 : _$$1;
      next = NaN;
      return dist;
    } else {
      return sigma;
    }
  };
  dist.sample = function() {
    var x = 0, y = 0, rds, c;
    if (next === next) {
      x = next;
      next = NaN;
      return x;
    }
    do {
      x = random() * 2 - 1;
      y = random() * 2 - 1;
      rds = x * x + y * y;
    } while (rds === 0 || rds > 1);
    c = Math.sqrt(-2 * Math.log(rds) / rds);
    next = mu + y * c * sigma;
    return mu + x * c * sigma;
  };
  dist.pdf = function(x) {
    var exp = Math.exp(Math.pow(x-mu, 2) / (-2 * Math.pow(sigma, 2)));
    return (1 / (sigma * Math.sqrt(2*Math.PI))) * exp;
  };
  dist.cdf = function(x) {
    var cd,
        z = (x - mu) / sigma,
        Z = Math.abs(z);
    if (Z > 37) {
      cd = 0;
    } else {
      var sum$$1, exp = Math.exp(-Z*Z/2);
      if (Z < 7.07106781186547) {
        sum$$1 = 3.52624965998911e-02 * Z + 0.700383064443688;
        sum$$1 = sum$$1 * Z + 6.37396220353165;
        sum$$1 = sum$$1 * Z + 33.912866078383;
        sum$$1 = sum$$1 * Z + 112.079291497871;
        sum$$1 = sum$$1 * Z + 221.213596169931;
        sum$$1 = sum$$1 * Z + 220.206867912376;
        cd = exp * sum$$1;
        sum$$1 = 8.83883476483184e-02 * Z + 1.75566716318264;
        sum$$1 = sum$$1 * Z + 16.064177579207;
        sum$$1 = sum$$1 * Z + 86.7807322029461;
        sum$$1 = sum$$1 * Z + 296.564248779674;
        sum$$1 = sum$$1 * Z + 637.333633378831;
        sum$$1 = sum$$1 * Z + 793.826512519948;
        sum$$1 = sum$$1 * Z + 440.413735824752;
        cd = cd / sum$$1;
      } else {
        sum$$1 = Z + 0.65;
        sum$$1 = Z + 4 / sum$$1;
        sum$$1 = Z + 3 / sum$$1;
        sum$$1 = Z + 2 / sum$$1;
        sum$$1 = Z + 1 / sum$$1;
        cd = exp / sum$$1 / 2.506628274631;
      }
    }
    return z > 0 ? 1 - cd : cd;
  };
  dist.icdf = function(p) {
    if (p <= 0 || p >= 1) return NaN;
    var x = 2*p - 1,
        v = (8 * (Math.PI - 3)) / (3 * Math.PI * (4-Math.PI)),
        a = (2 / (Math.PI*v)) + (Math.log(1 - Math.pow(x,2)) / 2),
        b = Math.log(1 - (x*x)) / v,
        s = (x > 0 ? 1 : -1) * Math.sqrt(Math.sqrt((a*a) - b) - a);
    return mu + sigma * Math.SQRT2 * s;
  };
  return dist.mean(mean$$1).stdev(stdev);
}

function randomKDE(support, bandwidth) {
  var kernel = gaussian(),
      dist = {},
      n = 0;
  dist.data = function(_$$1) {
    if (arguments.length) {
      support = _$$1;
      n = _$$1 ? _$$1.length : 0;
      return dist.bandwidth(bandwidth);
    } else {
      return support;
    }
  };
  dist.bandwidth = function(_$$1) {
    if (!arguments.length) return bandwidth;
    bandwidth = _$$1;
    if (!bandwidth && support) bandwidth = estimateBandwidth(support);
    return dist;
  };
  dist.sample = function() {
    return support[~~(random() * n)] + bandwidth * kernel.sample();
  };
  dist.pdf = function(x) {
    for (var y=0, i=0; i<n; ++i) {
      y += kernel.pdf((x - support[i]) / bandwidth);
    }
    return y / bandwidth / n;
  };
  dist.cdf = function(x) {
    for (var y=0, i=0; i<n; ++i) {
      y += kernel.cdf((x - support[i]) / bandwidth);
    }
    return y / n;
  };
  dist.icdf = function() {
    throw Error('KDE icdf not supported.');
  };
  return dist.data(support);
}
function estimateBandwidth(array) {
  var n = array.length,
      q = quartiles(array),
      h = (q[2] - q[0]) / 1.34;
  return 1.06 * Math.min(Math.sqrt(variance(array)), h) * Math.pow(n, -0.2);
}

function randomMixture(dists, weights) {
  var dist = {}, m = 0, w;
  function normalize(x) {
    var w = [], sum$$1 = 0, i;
    for (i=0; i<m; ++i) { sum$$1 += (w[i] = (x[i]==null ? 1 : +x[i])); }
    for (i=0; i<m; ++i) { w[i] /= sum$$1; }
    return w;
  }
  dist.weights = function(_$$1) {
    if (arguments.length) {
      w = normalize(weights = (_$$1 || []));
      return dist;
    }
    return weights;
  };
  dist.distributions = function(_$$1) {
    if (arguments.length) {
      if (_$$1) {
        m = _$$1.length;
        dists = _$$1;
      } else {
        m = 0;
        dists = [];
      }
      return dist.weights(weights);
    }
    return dists;
  };
  dist.sample = function() {
    var r = random(),
        d = dists[m-1],
        v = w[0],
        i = 0;
    for (; i<m-1; v += w[++i]) {
      if (r < v) { d = dists[i]; break; }
    }
    return d.sample();
  };
  dist.pdf = function(x) {
    for (var p=0, i=0; i<m; ++i) {
      p += w[i] * dists[i].pdf(x);
    }
    return p;
  };
  dist.cdf = function(x) {
    for (var p=0, i=0; i<m; ++i) {
      p += w[i] * dists[i].cdf(x);
    }
    return p;
  };
  dist.icdf = function() {
    throw Error('Mixture icdf not supported.');
  };
  return dist.distributions(dists).weights(weights);
}

function randomUniform(min$$1, max$$1) {
  if (max$$1 == null) {
    max$$1 = (min$$1 == null ? 1 : min$$1);
    min$$1 = 0;
  }
  var dist = {},
      a, b, d;
  dist.min = function(_$$1) {
    if (arguments.length) {
      a = _$$1 || 0;
      d = b - a;
      return dist;
    } else {
      return a;
    }
  };
  dist.max = function(_$$1) {
    if (arguments.length) {
      b = _$$1 || 0;
      d = b - a;
      return dist;
    } else {
      return b;
    }
  };
  dist.sample = function() {
    return a + d * random();
  };
  dist.pdf = function(x) {
    return (x >= a && x <= b) ? 1 / d : 0;
  };
  dist.cdf = function(x) {
    return x < a ? 0 : x > b ? 1 : (x - a) / d;
  };
  dist.icdf = function(p) {
    return (p >= 0 && p <= 1) ? a + p * d : NaN;
  };
  return dist.min(min$$1).max(max$$1);
}

function TupleStore(key$$1) {
  this._key = key$$1 ? field(key$$1) : tupleid;
  this.reset();
}
var prototype$8 = TupleStore.prototype;
prototype$8.reset = function() {
  this._add = [];
  this._rem = [];
  this._ext = null;
  this._get = null;
  this._q = null;
};
prototype$8.add = function(v) {
  this._add.push(v);
};
prototype$8.rem = function(v) {
  this._rem.push(v);
};
prototype$8.values = function() {
  this._get = null;
  if (this._rem.length === 0) return this._add;
  var a = this._add,
      r = this._rem,
      k = this._key,
      n = a.length,
      m = r.length,
      x = Array(n - m),
      map = {}, i, j, v;
  for (i=0; i<m; ++i) {
    map[k(r[i])] = 1;
  }
  for (i=0, j=0; i<n; ++i) {
    if (map[k(v = a[i])]) {
      map[k(v)] = 0;
    } else {
      x[j++] = v;
    }
  }
  this._rem = [];
  return (this._add = x);
};
prototype$8.distinct = function(get) {
  var v = this.values(),
      n = v.length,
      map = {},
      count = 0, s;
  while (--n >= 0) {
    s = get(v[n]) + '';
    if (!map.hasOwnProperty(s)) {
      map[s] = 1;
      ++count;
    }
  }
  return count;
};
prototype$8.extent = function(get) {
  if (this._get !== get || !this._ext) {
    var v = this.values(),
        i = extentIndex(v, get);
    this._ext = [v[i[0]], v[i[1]]];
    this._get = get;
  }
  return this._ext;
};
prototype$8.argmin = function(get) {
  return this.extent(get)[0] || {};
};
prototype$8.argmax = function(get) {
  return this.extent(get)[1] || {};
};
prototype$8.min = function(get) {
  var m = this.extent(get)[0];
  return m != null ? get(m) : +Infinity;
};
prototype$8.max = function(get) {
  var m = this.extent(get)[1];
  return m != null ? get(m) : -Infinity;
};
prototype$8.quartile = function(get) {
  if (this._get !== get || !this._q) {
    this._q = quartiles(this.values(), get);
    this._get = get;
  }
  return this._q;
};
prototype$8.q1 = function(get) {
  return this.quartile(get)[0];
};
prototype$8.q2 = function(get) {
  return this.quartile(get)[1];
};
prototype$8.q3 = function(get) {
  return this.quartile(get)[2];
};
prototype$8.ci = function(get) {
  if (this._get !== get || !this._ci) {
    this._ci = bootstrapCI(this.values(), 1000, 0.05, get);
    this._get = get;
  }
  return this._ci;
};
prototype$8.ci0 = function(get) {
  return this.ci(get)[0];
};
prototype$8.ci1 = function(get) {
  return this.ci(get)[1];
};

function Aggregate(params) {
  Transform.call(this, null, params);
  this._adds = [];
  this._mods = [];
  this._alen = 0;
  this._mlen = 0;
  this._drop = true;
  this._cross = false;
  this._dims = [];
  this._dnames = [];
  this._measures = [];
  this._countOnly = false;
  this._counts = null;
  this._prev = null;
  this._inputs = null;
  this._outputs = null;
}
Aggregate.Definition = {
  "type": "Aggregate",
  "metadata": {"generates": true, "changes": true},
  "params": [
    { "name": "groupby", "type": "field", "array": true },
    { "name": "ops", "type": "enum", "array": true, "values": ValidAggregateOps },
    { "name": "fields", "type": "field", "null": true, "array": true },
    { "name": "as", "type": "string", "null": true, "array": true },
    { "name": "drop", "type": "boolean", "default": true },
    { "name": "cross", "type": "boolean", "default": false },
    { "name": "key", "type": "field" }
  ]
};
var prototype$9 = inherits(Aggregate, Transform);
prototype$9.transform = function(_$$1, pulse) {
  var aggr = this,
      out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
      mod;
  this.stamp = out.stamp;
  if (this.value && ((mod = _$$1.modified()) || pulse.modified(this._inputs))) {
    this._prev = this.value;
    this.value = mod ? this.init(_$$1) : {};
    pulse.visit(pulse.SOURCE, function(t) { aggr.add(t); });
  } else {
    this.value = this.value || this.init(_$$1);
    pulse.visit(pulse.REM, function(t) { aggr.rem(t); });
    pulse.visit(pulse.ADD, function(t) { aggr.add(t); });
  }
  out.modifies(this._outputs);
  aggr._drop = _$$1.drop !== false;
  if (_$$1.cross && aggr._dims.length > 1) {
    aggr._drop = false;
    this.cross();
  }
  return aggr.changes(out);
};
prototype$9.cross = function() {
  var aggr = this,
      curr = aggr.value,
      dims = aggr._dnames,
      vals = dims.map(function() { return {}; }),
      n = dims.length;
  function collect(cells) {
    var key$$1, i, t, v;
    for (key$$1 in cells) {
      t = cells[key$$1].tuple;
      for (i=0; i<n; ++i) {
        vals[i][(v = t[dims[i]])] = v;
      }
    }
  }
  collect(aggr._prev);
  collect(curr);
  function generate(base, tuple, index) {
    var name = dims[index],
        v = vals[index++],
        k, key$$1;
    for (k in v) {
      tuple[name] = v[k];
      key$$1 = base ? base + '|' + k : k;
      if (index < n) generate(key$$1, tuple, index);
      else if (!curr[key$$1]) aggr.cell(key$$1, tuple);
    }
  }
  generate('', {}, 0);
};
prototype$9.init = function(_$$1) {
  var inputs = (this._inputs = []),
      outputs = (this._outputs = []),
      inputMap = {};
  function inputVisit(get) {
    var fields = array(accessorFields(get)),
        i = 0, n = fields.length, f;
    for (; i<n; ++i) {
      if (!inputMap[f=fields[i]]) {
        inputMap[f] = 1;
        inputs.push(f);
      }
    }
  }
  this._dims = array(_$$1.groupby);
  this._dnames = this._dims.map(function(d) {
    var dname = accessorName(d);
    inputVisit(d);
    outputs.push(dname);
    return dname;
  });
  this.cellkey = _$$1.key ? _$$1.key : groupkey(this._dims);
  this._countOnly = true;
  this._counts = [];
  this._measures = [];
  var fields = _$$1.fields || [null],
      ops = _$$1.ops || ['count'],
      as = _$$1.as || [],
      n = fields.length,
      map = {},
      field$$1, op, m, mname, outname, i;
  if (n !== ops.length) {
    error('Unmatched number of fields and aggregate ops.');
  }
  for (i=0; i<n; ++i) {
    field$$1 = fields[i];
    op = ops[i];
    if (field$$1 == null && op !== 'count') {
      error('Null aggregate field specified.');
    }
    mname = accessorName(field$$1);
    outname = measureName(op, mname, as[i]);
    outputs.push(outname);
    if (op === 'count') {
      this._counts.push(outname);
      continue;
    }
    m = map[mname];
    if (!m) {
      inputVisit(field$$1);
      m = (map[mname] = []);
      m.field = field$$1;
      this._measures.push(m);
    }
    if (op !== 'count') this._countOnly = false;
    m.push(createMeasure(op, outname));
  }
  this._measures = this._measures.map(function(m) {
    return compileMeasures(m, m.field);
  });
  return {};
};
prototype$9.cellkey = groupkey();
prototype$9.cell = function(key$$1, t) {
  var cell = this.value[key$$1];
  if (!cell) {
    cell = this.value[key$$1] = this.newcell(key$$1, t);
    this._adds[this._alen++] = cell;
  } else if (cell.num === 0 && this._drop && cell.stamp < this.stamp) {
    cell.stamp = this.stamp;
    this._adds[this._alen++] = cell;
  } else if (cell.stamp < this.stamp) {
    cell.stamp = this.stamp;
    this._mods[this._mlen++] = cell;
  }
  return cell;
};
prototype$9.newcell = function(key$$1, t) {
  var cell = {
    key:   key$$1,
    num:   0,
    agg:   null,
    tuple: this.newtuple(t, this._prev && this._prev[key$$1]),
    stamp: this.stamp,
    store: false
  };
  if (!this._countOnly) {
    var measures = this._measures,
        n = measures.length, i;
    cell.agg = Array(n);
    for (i=0; i<n; ++i) {
      cell.agg[i] = new measures[i](cell);
    }
  }
  if (cell.store) {
    cell.data = new TupleStore();
  }
  return cell;
};
prototype$9.newtuple = function(t, p) {
  var names = this._dnames,
      dims = this._dims,
      x = {}, i, n;
  for (i=0, n=dims.length; i<n; ++i) {
    x[names[i]] = dims[i](t);
  }
  return p ? replace(p.tuple, x) : ingest(x);
};
prototype$9.add = function(t) {
  var key$$1 = this.cellkey(t),
      cell = this.cell(key$$1, t),
      agg, i, n;
  cell.num += 1;
  if (this._countOnly) return;
  if (cell.store) cell.data.add(t);
  agg = cell.agg;
  for (i=0, n=agg.length; i<n; ++i) {
    agg[i].add(agg[i].get(t), t);
  }
};
prototype$9.rem = function(t) {
  var key$$1 = this.cellkey(t),
      cell = this.cell(key$$1, t),
      agg, i, n;
  cell.num -= 1;
  if (this._countOnly) return;
  if (cell.store) cell.data.rem(t);
  agg = cell.agg;
  for (i=0, n=agg.length; i<n; ++i) {
    agg[i].rem(agg[i].get(t), t);
  }
};
prototype$9.celltuple = function(cell) {
  var tuple = cell.tuple,
      counts = this._counts,
      agg, i, n;
  if (cell.store) {
    cell.data.values();
  }
  for (i=0, n=counts.length; i<n; ++i) {
    tuple[counts[i]] = cell.num;
  }
  if (!this._countOnly) {
    agg = cell.agg;
    for (i=0, n=agg.length; i<n; ++i) {
      agg[i].set(tuple);
    }
  }
  return tuple;
};
prototype$9.changes = function(out) {
  var adds = this._adds,
      mods = this._mods,
      prev = this._prev,
      drop = this._drop,
      add = out.add,
      rem = out.rem,
      mod = out.mod,
      cell, key$$1, i, n;
  if (prev) for (key$$1 in prev) {
    cell = prev[key$$1];
    if (!drop || cell.num) rem.push(cell.tuple);
  }
  for (i=0, n=this._alen; i<n; ++i) {
    add.push(this.celltuple(adds[i]));
    adds[i] = null;
  }
  for (i=0, n=this._mlen; i<n; ++i) {
    cell = mods[i];
    (cell.num === 0 && drop ? rem : mod).push(this.celltuple(cell));
    mods[i] = null;
  }
  this._alen = this._mlen = 0;
  this._prev = null;
  return out;
};

function Bin(params) {
  Transform.call(this, null, params);
}
Bin.Definition = {
  "type": "Bin",
  "metadata": {"modifies": true},
  "params": [
    { "name": "field", "type": "field", "required": true },
    { "name": "anchor", "type": "number" },
    { "name": "maxbins", "type": "number", "default": 20 },
    { "name": "base", "type": "number", "default": 10 },
    { "name": "divide", "type": "number", "array": true, "default": [5, 2] },
    { "name": "extent", "type": "number", "array": true, "length": 2, "required": true },
    { "name": "step", "type": "number" },
    { "name": "steps", "type": "number", "array": true },
    { "name": "minstep", "type": "number", "default": 0 },
    { "name": "nice", "type": "boolean", "default": true },
    { "name": "name", "type": "string" },
    { "name": "as", "type": "string", "array": true, "length": 2, "default": ["bin0", "bin1"] }
  ]
};
var prototype$a = inherits(Bin, Transform);
prototype$a.transform = function(_$$1, pulse) {
  var bins = this._bins(_$$1),
      start = bins.start,
      step = bins.step,
      as = _$$1.as || ['bin0', 'bin1'],
      b0 = as[0],
      b1 = as[1],
      flag;
  if (_$$1.modified()) {
    pulse = pulse.reflow(true);
    flag = pulse.SOURCE;
  } else {
    flag = pulse.modified(accessorFields(_$$1.field)) ? pulse.ADD_MOD : pulse.ADD;
  }
  pulse.visit(flag, function(t) {
    var v = bins(t);
    t[b0] = v;
    t[b1] = v == null ? null : start + step * (1 + (v - start) / step);
  });
  return pulse.modifies(as);
};
prototype$a._bins = function(_$$1) {
  if (this.value && !_$$1.modified()) {
    return this.value;
  }
  var field$$1 = _$$1.field,
      bins  = bin(_$$1),
      start = bins.start,
      stop  = bins.stop,
      step  = bins.step,
      a, d;
  if ((a = _$$1.anchor) != null) {
    d = a - (start + step * Math.floor((a - start) / step));
    start += d;
    stop += d;
  }
  var f = function(t) {
    var v = field$$1(t);
    if (v == null) {
      return null;
    } else {
      v = Math.max(start, Math.min(+v, stop - step));
      return start + step * Math.floor((v - start) / step);
    }
  };
  f.start = start;
  f.stop = stop;
  f.step = step;
  return this.value = accessor(
    f,
    accessorFields(field$$1),
    _$$1.name || 'bin_' + accessorName(field$$1)
  );
};

function SortedList(idFunc, source, input) {
  var $$$1 = idFunc,
      data = source || [],
      add = input || [],
      rem = {},
      cnt = 0;
  return {
    add: function(t) { add.push(t); },
    remove: function(t) { rem[$$$1(t)] = ++cnt; },
    size: function() { return data.length; },
    data: function(compare$$1, resort) {
      if (cnt) {
        data = data.filter(function(t) { return !rem[$$$1(t)]; });
        rem = {};
        cnt = 0;
      }
      if (resort && compare$$1) {
        data.sort(compare$$1);
      }
      if (add.length) {
        data = compare$$1
          ? merge(compare$$1, data, add.sort(compare$$1))
          : data.concat(add);
        add = [];
      }
      return data;
    }
  }
}

function Collect(params) {
  Transform.call(this, [], params);
}
Collect.Definition = {
  "type": "Collect",
  "metadata": {"source": true},
  "params": [
    { "name": "sort", "type": "compare" }
  ]
};
var prototype$b = inherits(Collect, Transform);
prototype$b.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.ALL),
      list = SortedList(tupleid, this.value, out.materialize(out.ADD).add),
      sort = _$$1.sort,
      mod = pulse.changed() || (sort &&
            (_$$1.modified('sort') || pulse.modified(sort.fields)));
  out.visit(out.REM, list.remove);
  this.modified(mod);
  this.value = out.source = list.data(sort, mod);
  if (pulse.source && pulse.source.root) {
    this.value.root = pulse.source.root;
  }
  return out;
};

function Compare(params) {
  Operator.call(this, null, update$1, params);
}
inherits(Compare, Operator);
function update$1(_$$1) {
  return (this.value && !_$$1.modified())
    ? this.value
    : compare(_$$1.fields, _$$1.orders);
}

function CountPattern(params) {
  Transform.call(this, null, params);
}
CountPattern.Definition = {
  "type": "CountPattern",
  "metadata": {"generates": true, "changes": true},
  "params": [
    { "name": "field", "type": "field", "required": true },
    { "name": "case", "type": "enum", "values": ["upper", "lower", "mixed"], "default": "mixed" },
    { "name": "pattern", "type": "string", "default": "[\\w\"]+" },
    { "name": "stopwords", "type": "string", "default": "" },
    { "name": "as", "type": "string", "array": true, "length": 2, "default": ["text", "count"] }
  ]
};
function tokenize(text, tcase, match) {
  switch (tcase) {
    case 'upper': text = text.toUpperCase(); break;
    case 'lower': text = text.toLowerCase(); break;
  }
  return text.match(match);
}
var prototype$c = inherits(CountPattern, Transform);
prototype$c.transform = function(_$$1, pulse) {
  function process(update) {
    return function(tuple) {
      var tokens = tokenize(get(tuple), _$$1.case, match) || [], t;
      for (var i=0, n=tokens.length; i<n; ++i) {
        if (!stop.test(t = tokens[i])) update(t);
      }
    };
  }
  var init = this._parameterCheck(_$$1, pulse),
      counts = this._counts,
      match = this._match,
      stop = this._stop,
      get = _$$1.field,
      as = _$$1.as || ['text', 'count'],
      add = process(function(t) { counts[t] = 1 + (counts[t] || 0); }),
      rem = process(function(t) { counts[t] -= 1; });
  if (init) {
    pulse.visit(pulse.SOURCE, add);
  } else {
    pulse.visit(pulse.ADD, add);
    pulse.visit(pulse.REM, rem);
  }
  return this._finish(pulse, as);
};
prototype$c._parameterCheck = function(_$$1, pulse) {
  var init = false;
  if (_$$1.modified('stopwords') || !this._stop) {
    this._stop = new RegExp('^' + (_$$1.stopwords || '') + '$', 'i');
    init = true;
  }
  if (_$$1.modified('pattern') || !this._match) {
    this._match = new RegExp((_$$1.pattern || '[\\w\']+'), 'g');
    init = true;
  }
  if (_$$1.modified('field') || pulse.modified(_$$1.field.fields)) {
    init = true;
  }
  if (init) this._counts = {};
  return init;
};
prototype$c._finish = function(pulse, as) {
  var counts = this._counts,
      tuples = this._tuples || (this._tuples = {}),
      text = as[0],
      count = as[1],
      out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
      w, t, c;
  for (w in counts) {
    t = tuples[w];
    c = counts[w] || 0;
    if (!t && c) {
      tuples[w] = (t = ingest({}));
      t[text] = w;
      t[count] = c;
      out.add.push(t);
    } else if (c === 0) {
      if (t) out.rem.push(t);
      counts[w] = null;
      tuples[w] = null;
    } else if (t[count] !== c) {
      t[count] = c;
      out.mod.push(t);
    }
  }
  return out.modifies(as);
};

function Cross(params) {
  Transform.call(this, null, params);
}
Cross.Definition = {
  "type": "Cross",
  "metadata": {"generates": true},
  "params": [
    { "name": "filter", "type": "expr" },
    { "name": "as", "type": "string", "array": true, "length": 2, "default": ["a", "b"] }
  ]
};
var prototype$d = inherits(Cross, Transform);
prototype$d.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.NO_SOURCE),
      data = this.value,
      as = _$$1.as || ['a', 'b'],
      a = as[0], b = as[1],
      reset = !data
          || pulse.changed(pulse.ADD_REM)
          || _$$1.modified('as')
          || _$$1.modified('filter');
  if (reset) {
    if (data) out.rem = data;
    data = pulse.materialize(pulse.SOURCE).source;
    out.add = this.value = cross(data, a, b, _$$1.filter || truthy);
  } else {
    out.mod = data;
  }
  out.source = this.value;
  return out.modifies(as);
};
function cross(input, a, b, filter) {
  var data = [],
      t = {},
      n = input.length,
      i = 0,
      j, left;
  for (; i<n; ++i) {
    t[a] = left = input[i];
    for (j=0; j<n; ++j) {
      t[b] = input[j];
      if (filter(t)) {
        data.push(ingest(t));
        t = {};
        t[a] = left;
      }
    }
  }
  return data;
}

var Distributions = {
  kde:     randomKDE,
  mixture: randomMixture,
  normal:  gaussian,
  uniform: randomUniform
};
var DISTRIBUTIONS = 'distributions',
    FUNCTION = 'function',
    FIELD = 'field';
function parse$1(def, data) {
  var func = def[FUNCTION];
  if (!Distributions.hasOwnProperty(func)) {
    error('Unknown distribution function: ' + func);
  }
  var d = Distributions[func]();
  for (var name in def) {
    if (name === FIELD) {
      d.data((def.from || data()).map(def[name]));
    }
    else if (name === DISTRIBUTIONS) {
      d[name](def[name].map(function(_$$1) { return parse$1(_$$1, data); }));
    }
    else if (typeof d[name] === FUNCTION) {
      d[name](def[name]);
    }
  }
  return d;
}

function Density(params) {
  Transform.call(this, null, params);
}
var distributions = [
  {
    "key": {"function": "normal"},
    "params": [
      { "name": "mean", "type": "number", "default": 0 },
      { "name": "stdev", "type": "number", "default": 1 }
    ]
  },
  {
    "key": {"function": "uniform"},
    "params": [
      { "name": "min", "type": "number", "default": 0 },
      { "name": "max", "type": "number", "default": 1 }
    ]
  },
  {
    "key": {"function": "kde"},
    "params": [
      { "name": "field", "type": "field", "required": true },
      { "name": "from", "type": "data" },
      { "name": "bandwidth", "type": "number", "default": 0 }
    ]
  }
];
var mixture = {
  "key": {"function": "mixture"},
  "params": [
    { "name": "distributions", "type": "param", "array": true,
      "params": distributions },
    { "name": "weights", "type": "number", "array": true }
  ]
};
Density.Definition = {
  "type": "Density",
  "metadata": {"generates": true},
  "params": [
    { "name": "extent", "type": "number", "array": true, "length": 2 },
    { "name": "steps", "type": "number", "default": 100 },
    { "name": "method", "type": "string", "default": "pdf",
      "values": ["pdf", "cdf"] },
    { "name": "distribution", "type": "param",
      "params": distributions.concat(mixture) },
    { "name": "as", "type": "string", "array": true,
      "default": ["value", "density"] }
  ]
};
var prototype$e = inherits(Density, Transform);
prototype$e.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
  if (!this.value || pulse.changed() || _$$1.modified()) {
    var dist = parse$1(_$$1.distribution, source(pulse)),
        method = _$$1.method || 'pdf';
    if (method !== 'pdf' && method !== 'cdf') {
      error('Invalid density method: ' + method);
    }
    if (!_$$1.extent && !dist.data) {
      error('Missing density extent parameter.');
    }
    method = dist[method];
    var as = _$$1.as || ['value', 'density'],
        domain = _$$1.extent || extent(dist.data()),
        step = (domain[1] - domain[0]) / (_$$1.steps || 100),
        values = range(domain[0], domain[1] + step/2, step)
          .map(function(v) {
            var tuple = {};
            tuple[as[0]] = v;
            tuple[as[1]] = method(v);
            return ingest(tuple);
          });
    if (this.value) out.rem = this.value;
    this.value = out.add = out.source = values;
  }
  return out;
};
function source(pulse) {
  return function() { return pulse.materialize(pulse.SOURCE).source; };
}

function Extent(params) {
  Transform.call(this, [+Infinity, -Infinity], params);
}
Extent.Definition = {
  "type": "Extent",
  "metadata": {},
  "params": [
    { "name": "field", "type": "field", "required": true }
  ]
};
var prototype$f = inherits(Extent, Transform);
prototype$f.transform = function(_$$1, pulse) {
  var extent$$1 = this.value,
      field$$1 = _$$1.field,
      min$$1 = extent$$1[0],
      max$$1 = extent$$1[1],
      flag = pulse.ADD,
      mod;
  mod = pulse.changed()
     || pulse.modified(field$$1.fields)
     || _$$1.modified('field');
  if (mod) {
    flag = pulse.SOURCE;
    min$$1 = +Infinity;
    max$$1 = -Infinity;
  }
  pulse.visit(flag, function(t) {
    var v = field$$1(t);
    if (v != null) {
      v = +v;
      if (v < min$$1) min$$1 = v;
      if (v > max$$1) max$$1 = v;
    }
  });
  this.value = [min$$1, max$$1];
};

function Subflow(pulse, parent) {
  Operator.call(this, pulse);
  this.parent = parent;
}
var prototype$g = inherits(Subflow, Operator);
prototype$g.connect = function(target) {
  this.targets().add(target);
  return (target.source = this);
};
prototype$g.add = function(t) {
  this.value.add.push(t);
};
prototype$g.rem = function(t) {
  this.value.rem.push(t);
};
prototype$g.mod = function(t) {
  this.value.mod.push(t);
};
prototype$g.init = function(pulse) {
  this.value.init(pulse, pulse.NO_SOURCE);
};
prototype$g.evaluate = function() {
  return this.value;
};

function Facet(params) {
  Transform.call(this, {}, params);
  this._keys = fastmap();
  var a = this._targets = [];
  a.active = 0;
  a.forEach = function(f) {
    for (var i=0, n=a.active; i<n; ++i) f(a[i], i, a);
  };
}
var prototype$h = inherits(Facet, Transform);
prototype$h.activate = function(flow) {
  this._targets[this._targets.active++] = flow;
};
prototype$h.subflow = function(key$$1, flow, pulse, parent) {
  var flows = this.value,
      sf = flows.hasOwnProperty(key$$1) && flows[key$$1],
      df, p;
  if (!sf) {
    p = parent || (p = this._group[key$$1]) && p.tuple;
    df = pulse.dataflow;
    sf = df.add(new Subflow(pulse.fork(pulse.NO_SOURCE), this))
      .connect(flow(df, key$$1, p));
    flows[key$$1] = sf;
    this.activate(sf);
  } else if (sf.value.stamp < pulse.stamp) {
    sf.init(pulse);
    this.activate(sf);
  }
  return sf;
};
prototype$h.transform = function(_$$1, pulse) {
  var df = pulse.dataflow,
      self = this,
      key$$1 = _$$1.key,
      flow = _$$1.subflow,
      cache = this._keys,
      rekey = _$$1.modified('key');
  function subflow(key$$1) {
    return self.subflow(key$$1, flow, pulse);
  }
  this._group = _$$1.group || {};
  this._targets.active = 0;
  pulse.visit(pulse.REM, function(t) {
    var id$$1 = tupleid(t),
        k = cache.get(id$$1);
    if (k !== undefined) {
      cache.delete(id$$1);
      subflow(k).rem(t);
    }
  });
  pulse.visit(pulse.ADD, function(t) {
    var k = key$$1(t);
    cache.set(tupleid(t), k);
    subflow(k).add(t);
  });
  if (rekey || pulse.modified(key$$1.fields)) {
    pulse.visit(pulse.MOD, function(t) {
      var id$$1 = tupleid(t),
          k0 = cache.get(id$$1),
          k1 = key$$1(t);
      if (k0 === k1) {
        subflow(k1).mod(t);
      } else {
        cache.set(id$$1, k1);
        subflow(k0).rem(t);
        subflow(k1).add(t);
      }
    });
  } else if (pulse.changed(pulse.MOD)) {
    pulse.visit(pulse.MOD, function(t) {
      subflow(cache.get(tupleid(t))).mod(t);
    });
  }
  if (rekey) {
    pulse.visit(pulse.REFLOW, function(t) {
      var id$$1 = tupleid(t),
          k0 = cache.get(id$$1),
          k1 = key$$1(t);
      if (k0 !== k1) {
        cache.set(id$$1, k1);
        subflow(k0).rem(t);
        subflow(k1).add(t);
      }
    });
  }
  if (cache.empty > df.cleanThreshold) df.runAfter(cache.clean);
  return pulse;
};

function Field(params) {
  Operator.call(this, null, update$2, params);
}
inherits(Field, Operator);
function update$2(_$$1) {
  return (this.value && !_$$1.modified()) ? this.value
    : isArray(_$$1.name) ? array(_$$1.name).map(function(f) { return field(f); })
    : field(_$$1.name, _$$1.as);
}

function Filter(params) {
  Transform.call(this, fastmap(), params);
}
Filter.Definition = {
  "type": "Filter",
  "metadata": {"changes": true},
  "params": [
    { "name": "expr", "type": "expr", "required": true }
  ]
};
var prototype$i = inherits(Filter, Transform);
prototype$i.transform = function(_$$1, pulse) {
  var df = pulse.dataflow,
      cache = this.value,
      output = pulse.fork(),
      add = output.add,
      rem = output.rem,
      mod = output.mod,
      test = _$$1.expr,
      isMod = true;
  pulse.visit(pulse.REM, function(t) {
    var id$$1 = tupleid(t);
    if (!cache.has(id$$1)) rem.push(t);
    else cache.delete(id$$1);
  });
  pulse.visit(pulse.ADD, function(t) {
    if (test(t, _$$1)) add.push(t);
    else cache.set(tupleid(t), 1);
  });
  function revisit(t) {
    var id$$1 = tupleid(t),
        b = test(t, _$$1),
        s = cache.get(id$$1);
    if (b && s) {
      cache.delete(id$$1);
      add.push(t);
    } else if (!b && !s) {
      cache.set(id$$1, 1);
      rem.push(t);
    } else if (isMod && b && !s) {
      mod.push(t);
    }
  }
  pulse.visit(pulse.MOD, revisit);
  if (_$$1.modified()) {
    isMod = false;
    pulse.visit(pulse.REFLOW, revisit);
  }
  if (cache.empty > df.cleanThreshold) df.runAfter(cache.clean);
  return output;
};

function fieldNames(fields, as) {
  if (!fields) return null;
  return fields.map(function(f, i) {
    return as[i] || accessorName(f);
  });
}

function Flatten(params) {
  Transform.call(this, [], params);
}
Flatten.Definition = {
  "type": "Flatten",
  "metadata": {"generates": true},
  "params": [
    { "name": "fields", "type": "field", "array": true, "required": true },
    { "name": "as", "type": "string", "array": true }
  ]
};
var prototype$j = inherits(Flatten, Transform);
prototype$j.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.NO_SOURCE),
      fields = _$$1.fields,
      as = fieldNames(fields, _$$1.as || []),
      m = as.length;
  out.rem = this.value;
  pulse.visit(pulse.SOURCE, function(t) {
    var arrays = fields.map(function(f) { return f(t); }),
        maxlen = arrays.reduce(function(l, a) { return Math.max(l, a.length); }, 0),
        i = 0, j, d, v;
    for (; i<maxlen; ++i) {
      d = derive(t);
      for (j=0; j<m; ++j) {
        d[as[j]] = (v = arrays[j][i]) == null ? null : v;
      }
      out.add.push(d);
    }
  });
  this.value = out.source = out.add;
  return out.modifies(as);
};

function Fold(params) {
  Transform.call(this, [], params);
}
Fold.Definition = {
  "type": "Fold",
  "metadata": {"generates": true},
  "params": [
    { "name": "fields", "type": "field", "array": true, "required": true },
    { "name": "as", "type": "string", "array": true, "length": 2, "default": ["key", "value"] }
  ]
};
var prototype$k = inherits(Fold, Transform);
prototype$k.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.NO_SOURCE),
      fields = _$$1.fields,
      fnames = fields.map(accessorName),
      as = _$$1.as || ['key', 'value'],
      k = as[0],
      v = as[1],
      n = fields.length;
  out.rem = this.value;
  pulse.visit(pulse.SOURCE, function(t) {
    for (var i=0, d; i<n; ++i) {
      d = derive(t);
      d[k] = fnames[i];
      d[v] = fields[i](t);
      out.add.push(d);
    }
  });
  this.value = out.source = out.add;
  return out.modifies(as);
};

function Formula(params) {
  Transform.call(this, null, params);
}
Formula.Definition = {
  "type": "Formula",
  "metadata": {"modifies": true},
  "params": [
    { "name": "expr", "type": "expr", "required": true },
    { "name": "as", "type": "string", "required": true },
    { "name": "initonly", "type": "boolean" }
  ]
};
var prototype$l = inherits(Formula, Transform);
prototype$l.transform = function(_$$1, pulse) {
  var func = _$$1.expr,
      as = _$$1.as,
      mod = _$$1.modified(),
      flag = _$$1.initonly ? pulse.ADD
        : mod ? pulse.SOURCE
        : pulse.modified(func.fields) ? pulse.ADD_MOD
        : pulse.ADD;
  function set(t) {
    t[as] = func(t, _$$1);
  }
  if (mod) {
    pulse = pulse.materialize().reflow(true);
  }
  if (!_$$1.initonly) {
    pulse.modifies(as);
  }
  return pulse.visit(flag, set);
};

function Generate(params) {
  Transform.call(this, [], params);
}
var prototype$m = inherits(Generate, Transform);
prototype$m.transform = function(_$$1, pulse) {
  var data = this.value,
      out = pulse.fork(pulse.ALL),
      num = _$$1.size - data.length,
      gen = _$$1.generator,
      add, rem, t;
  if (num > 0) {
    for (add=[]; --num >= 0;) {
      add.push(t = ingest(gen(_$$1)));
      data.push(t);
    }
    out.add = out.add.length
      ? out.materialize(out.ADD).add.concat(add)
      : add;
  } else {
    rem = data.slice(0, -num);
    out.rem = out.rem.length
      ? out.materialize(out.REM).rem.concat(rem)
      : rem;
    data = data.slice(-num);
  }
  out.source = this.value = data;
  return out;
};

var Methods = {
  value: 'value',
  median: median,
  mean: mean,
  min: min,
  max: max
};
var Empty = [];
function Impute(params) {
  Transform.call(this, [], params);
}
Impute.Definition = {
  "type": "Impute",
  "metadata": {"changes": true},
  "params": [
    { "name": "field", "type": "field", "required": true },
    { "name": "key", "type": "field", "required": true },
    { "name": "keyvals", "array": true },
    { "name": "groupby", "type": "field", "array": true },
    { "name": "method", "type": "enum", "default": "value",
      "values": ["value", "mean", "median", "max", "min"] },
    { "name": "value", "default": 0 }
  ]
};
var prototype$n = inherits(Impute, Transform);
function getValue(_$$1) {
  var m = _$$1.method || Methods.value, v;
  if (Methods[m] == null) {
    error('Unrecognized imputation method: ' + m);
  } else if (m === Methods.value) {
    v = _$$1.value !== undefined ? _$$1.value : 0;
    return function() { return v; };
  } else {
    return Methods[m];
  }
}
function getField(_$$1) {
  var f = _$$1.field;
  return function(t) { return t ? f(t) : NaN; };
}
prototype$n.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.ALL),
      impute = getValue(_$$1),
      field$$1 = getField(_$$1),
      fName = accessorName(_$$1.field),
      kName = accessorName(_$$1.key),
      gNames = (_$$1.groupby || []).map(accessorName),
      groups = partition$1(pulse.source, _$$1.groupby, _$$1.key, _$$1.keyvals),
      curr = [],
      prev = this.value,
      m = groups.domain.length,
      group, value, gVals, kVal, g, i, j, l, n, t;
  for (g=0, l=groups.length; g<l; ++g) {
    group = groups[g];
    gVals = group.values;
    value = NaN;
    for (j=0; j<m; ++j) {
      if (group[j] != null) continue;
      kVal = groups.domain[j];
      t = {_impute: true};
      for (i=0, n=gVals.length; i<n; ++i) t[gNames[i]] = gVals[i];
      t[kName] = kVal;
      t[fName] = isNaN(value) ? (value = impute(group, field$$1)) : value;
      curr.push(ingest(t));
    }
  }
  if (curr.length) out.add = out.materialize(out.ADD).add.concat(curr);
  if (prev.length) out.rem = out.materialize(out.REM).rem.concat(prev);
  this.value = curr;
  return out;
};
function partition$1(data, groupby, key$$1, keyvals) {
  var get = function(f) { return f(t); },
      groups = [],
      domain = keyvals ? keyvals.slice() : [],
      kMap = {},
      gMap = {}, gVals, gKey,
      group, i, j, k, n, t;
  domain.forEach(function(k, i) { kMap[k] = i + 1; });
  for (i=0, n=data.length; i<n; ++i) {
    t = data[i];
    k = key$$1(t);
    j = kMap[k] || (kMap[k] = domain.push(k));
    gKey = (gVals = groupby ? groupby.map(get) : Empty) + '';
    if (!(group = gMap[gKey])) {
      group = (gMap[gKey] = []);
      groups.push(group);
      group.values = gVals;
    }
    group[j-1] = t;
  }
  groups.domain = domain;
  return groups;
}

function JoinAggregate(params) {
  Aggregate.call(this, params);
}
JoinAggregate.Definition = {
  "type": "JoinAggregate",
  "metadata": {"modifies": true},
  "params": [
    { "name": "groupby", "type": "field", "array": true },
    { "name": "fields", "type": "field", "null": true, "array": true },
    { "name": "ops", "type": "enum", "array": true, "values": ValidAggregateOps },
    { "name": "as", "type": "string", "null": true, "array": true },
    { "name": "key", "type": "field" }
  ]
};
var prototype$o = inherits(JoinAggregate, Aggregate);
prototype$o.transform = function(_$$1, pulse) {
  var aggr = this,
      mod = _$$1.modified(),
      cells;
  if (aggr.value && (mod || pulse.modified(aggr._inputs))) {
    cells = aggr.value = mod ? aggr.init(_$$1) : {};
    pulse.visit(pulse.SOURCE, function(t) { aggr.add(t); });
  } else {
    cells = aggr.value = aggr.value || this.init(_$$1);
    pulse.visit(pulse.REM, function(t) { aggr.rem(t); });
    pulse.visit(pulse.ADD, function(t) { aggr.add(t); });
  }
  aggr.changes();
  pulse.visit(pulse.SOURCE, function(t) {
    extend(t, cells[aggr.cellkey(t)].tuple);
  });
  return pulse.reflow(mod).modifies(this._outputs);
};
prototype$o.changes = function() {
  var adds = this._adds,
      mods = this._mods,
      i, n;
  for (i=0, n=this._alen; i<n; ++i) {
    this.celltuple(adds[i]);
    adds[i] = null;
  }
  for (i=0, n=this._mlen; i<n; ++i) {
    this.celltuple(mods[i]);
    mods[i] = null;
  }
  this._alen = this._mlen = 0;
};

function Key(params) {
  Operator.call(this, null, update$3, params);
}
inherits(Key, Operator);
function update$3(_$$1) {
  return (this.value && !_$$1.modified()) ? this.value : key(_$$1.fields, _$$1.flat);
}

function Lookup(params) {
  Transform.call(this, {}, params);
}
Lookup.Definition = {
  "type": "Lookup",
  "metadata": {"modifies": true},
  "params": [
    { "name": "index", "type": "index", "params": [
        {"name": "from", "type": "data", "required": true },
        {"name": "key", "type": "field", "required": true }
      ] },
    { "name": "values", "type": "field", "array": true },
    { "name": "fields", "type": "field", "array": true, "required": true },
    { "name": "as", "type": "string", "array": true },
    { "name": "default", "default": null }
  ]
};
var prototype$p = inherits(Lookup, Transform);
prototype$p.transform = function(_$$1, pulse) {
  var out = pulse,
      as = _$$1.as,
      keys = _$$1.fields,
      index = _$$1.index,
      values = _$$1.values,
      defaultValue = _$$1.default==null ? null : _$$1.default,
      reset = _$$1.modified(),
      flag = reset ? pulse.SOURCE : pulse.ADD,
      n = keys.length,
      set, m, mods;
  if (values) {
    m = values.length;
    if (n > 1 && !as) {
      error('Multi-field lookup requires explicit "as" parameter.');
    }
    if (as && as.length !== n * m) {
      error('The "as" parameter has too few output field names.');
    }
    as = as || values.map(accessorName);
    set = function(t) {
      for (var i=0, k=0, j, v; i<n; ++i) {
        v = index.get(keys[i](t));
        if (v == null) for (j=0; j<m; ++j, ++k) t[as[k]] = defaultValue;
        else for (j=0; j<m; ++j, ++k) t[as[k]] = values[j](v);
      }
    };
  } else {
    if (!as) {
      error('Missing output field names.');
    }
    set = function(t) {
      for (var i=0, v; i<n; ++i) {
        v = index.get(keys[i](t));
        t[as[i]] = v==null ? defaultValue : v;
      }
    };
  }
  if (reset) {
    out = pulse.reflow(true);
  } else {
    mods = keys.some(function(k) { return pulse.modified(k.fields); });
    flag |= (mods ? pulse.MOD : 0);
  }
  pulse.visit(flag, set);
  return out.modifies(as);
};

function MultiExtent(params) {
  Operator.call(this, null, update$4, params);
}
inherits(MultiExtent, Operator);
function update$4(_$$1) {
  if (this.value && !_$$1.modified()) {
    return this.value;
  }
  var min$$1 = +Infinity,
      max$$1 = -Infinity,
      ext = _$$1.extents,
      i, n, e;
  for (i=0, n=ext.length; i<n; ++i) {
    e = ext[i];
    if (e[0] < min$$1) min$$1 = e[0];
    if (e[1] > max$$1) max$$1 = e[1];
  }
  return [min$$1, max$$1];
}

function MultiValues(params) {
  Operator.call(this, null, update$5, params);
}
inherits(MultiValues, Operator);
function update$5(_$$1) {
  return (this.value && !_$$1.modified())
    ? this.value
    : _$$1.values.reduce(function(data, _$$1) { return data.concat(_$$1); }, []);
}

function Params(params) {
  Transform.call(this, null, params);
}
inherits(Params, Transform);
Params.prototype.transform = function(_$$1, pulse) {
  this.modified(_$$1.modified());
  this.value = _$$1;
  return pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
};

function Pivot(params) {
  Aggregate.call(this, params);
}
Pivot.Definition = {
  "type": "Pivot",
  "metadata": {"generates": true, "changes": true},
  "params": [
    { "name": "groupby", "type": "field", "array": true },
    { "name": "field", "type": "field", "required": true },
    { "name": "value", "type": "field", "required": true },
    { "name": "op", "type": "enum", "values": ValidAggregateOps, "default": "sum" },
    { "name": "limit", "type": "number", "default": 0 },
    { "name": "key", "type": "field" }
  ]
};
var prototype$q = inherits(Pivot, Aggregate);
prototype$q._transform = prototype$q.transform;
prototype$q.transform = function(_$$1, pulse) {
  return this._transform(aggregateParams(_$$1, pulse), pulse);
};
function aggregateParams(_$$1, pulse) {
  var key$$1    = _$$1.field,
  value  = _$$1.value,
      op     = (_$$1.op === 'count' ? '__count__' : _$$1.op) || 'sum',
      fields = accessorFields(key$$1).concat(accessorFields(value)),
      keys   = pivotKeys(key$$1, _$$1.limit || 0, pulse);
  return {
    key:      _$$1.key,
    groupby:  _$$1.groupby,
    ops:      keys.map(function() { return op; }),
    fields:   keys.map(function(k) { return get(k, key$$1, value, fields); }),
    as:       keys.map(function(k) { return k + ''; }),
    modified: _$$1.modified.bind(_$$1)
  };
}
function get(k, key$$1, value, fields) {
  return accessor(
    function(d) { return key$$1(d) === k ? value(d) : NaN; },
    fields,
    k + ''
  );
}
function pivotKeys(key$$1, limit, pulse) {
  var map = {},
      list = [];
  pulse.visit(pulse.SOURCE, function(t) {
    var k = key$$1(t);
    if (!map[k]) {
      map[k] = 1;
      list.push(k);
    }
  });
  list.sort(function(u, v) {
    return (u<v||u==null) && v!=null ? -1
      : (u>v||v==null) && u!=null ? 1
      : ((v=v instanceof Date?+v:v),(u=u instanceof Date?+u:u))!==u && v===v ? -1
      : v!==v && u===u ? 1 : 0;
  });
  return limit ? list.slice(0, limit) : list;
}

function PreFacet(params) {
  Facet.call(this, params);
}
var prototype$r = inherits(PreFacet, Facet);
prototype$r.transform = function(_$$1, pulse) {
  var self = this,
      flow = _$$1.subflow,
      field$$1 = _$$1.field;
  if (_$$1.modified('field') || field$$1 && pulse.modified(accessorFields(field$$1))) {
    error('PreFacet does not support field modification.');
  }
  this._targets.active = 0;
  pulse.visit(pulse.MOD, function(t) {
    var sf = self.subflow(tupleid(t), flow, pulse, t);
    field$$1 ? field$$1(t).forEach(function(_$$1) { sf.mod(_$$1); }) : sf.mod(t);
  });
  pulse.visit(pulse.ADD, function(t) {
    var sf = self.subflow(tupleid(t), flow, pulse, t);
    field$$1 ? field$$1(t).forEach(function(_$$1) { sf.add(ingest(_$$1)); }) : sf.add(t);
  });
  pulse.visit(pulse.REM, function(t) {
    var sf = self.subflow(tupleid(t), flow, pulse, t);
    field$$1 ? field$$1(t).forEach(function(_$$1) { sf.rem(_$$1); }) : sf.rem(t);
  });
  return pulse;
};

function Project(params) {
  Transform.call(this, null, params);
}
Project.Definition = {
  "type": "Project",
  "metadata": {"generates": true, "changes": true},
  "params": [
    { "name": "fields", "type": "field", "array": true },
    { "name": "as", "type": "string", "null": true, "array": true },
  ]
};
var prototype$s = inherits(Project, Transform);
prototype$s.transform = function(_$$1, pulse) {
  var fields = _$$1.fields,
      as = fieldNames(_$$1.fields, _$$1.as || []),
      derive$$1 = fields
        ? function(s, t) { return project(s, t, fields, as); }
        : rederive,
      out, lut;
  if (this.value) {
    lut = this.value;
  } else {
    pulse = pulse.addAll();
    lut = this.value = {};
  }
  out = pulse.fork(pulse.NO_SOURCE);
  pulse.visit(pulse.REM, function(t) {
    var id$$1 = tupleid(t);
    out.rem.push(lut[id$$1]);
    lut[id$$1] = null;
  });
  pulse.visit(pulse.ADD, function(t) {
    var dt = derive$$1(t, ingest({}));
    lut[tupleid(t)] = dt;
    out.add.push(dt);
  });
  pulse.visit(pulse.MOD, function(t) {
    out.mod.push(derive$$1(t, lut[tupleid(t)]));
  });
  return out;
};
function project(s, t, fields, as) {
  for (var i=0, n=fields.length; i<n; ++i) {
    t[as[i]] = fields[i](s);
  }
  return t;
}

function Proxy(params) {
  Transform.call(this, null, params);
}
var prototype$t = inherits(Proxy, Transform);
prototype$t.transform = function(_$$1, pulse) {
  this.value = _$$1.value;
  return _$$1.modified('value')
    ? pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS)
    : pulse.StopPropagation;
};

function Relay(params) {
  Transform.call(this, null, params);
}
var prototype$u = inherits(Relay, Transform);
prototype$u.transform = function(_$$1, pulse) {
  var out, lut;
  if (this.value) {
    lut = this.value;
  } else {
    out = pulse = pulse.addAll();
    lut = this.value = {};
  }
  if (_$$1.derive) {
    out = pulse.fork(pulse.NO_SOURCE);
    pulse.visit(pulse.REM, function(t) {
      var id$$1 = tupleid(t);
      out.rem.push(lut[id$$1]);
      lut[id$$1] = null;
    });
    pulse.visit(pulse.ADD, function(t) {
      var dt = derive(t);
      lut[tupleid(t)] = dt;
      out.add.push(dt);
    });
    pulse.visit(pulse.MOD, function(t) {
      out.mod.push(rederive(t, lut[tupleid(t)]));
    });
  }
  return out;
};

function Sample(params) {
  Transform.call(this, [], params);
  this.count = 0;
}
Sample.Definition = {
  "type": "Sample",
  "metadata": {},
  "params": [
    { "name": "size", "type": "number", "default": 1000 }
  ]
};
var prototype$v = inherits(Sample, Transform);
prototype$v.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.NO_SOURCE),
      mod = _$$1.modified('size'),
      num = _$$1.size,
      res = this.value,
      cnt = this.count,
      cap = 0,
      map = res.reduce(function(m, t) {
        m[tupleid(t)] = 1;
        return m;
      }, {});
  function update(t) {
    var p, idx;
    if (res.length < num) {
      res.push(t);
    } else {
      idx = ~~((cnt + 1) * random());
      if (idx < res.length && idx >= cap) {
        p = res[idx];
        if (map[tupleid(p)]) out.rem.push(p);
        res[idx] = t;
      }
    }
    ++cnt;
  }
  if (pulse.rem.length) {
    pulse.visit(pulse.REM, function(t) {
      var id$$1 = tupleid(t);
      if (map[id$$1]) {
        map[id$$1] = -1;
        out.rem.push(t);
      }
      --cnt;
    });
    res = res.filter(function(t) { return map[tupleid(t)] !== -1; });
  }
  if ((pulse.rem.length || mod) && res.length < num && pulse.source) {
    cap = cnt = res.length;
    pulse.visit(pulse.SOURCE, function(t) {
      if (!map[tupleid(t)]) update(t);
    });
    cap = -1;
  }
  if (mod && res.length > num) {
    for (var i=0, n=res.length-num; i<n; ++i) {
      map[tupleid(res[i])] = -1;
      out.rem.push(res[i]);
    }
    res = res.slice(n);
  }
  if (pulse.mod.length) {
    pulse.visit(pulse.MOD, function(t) {
      if (map[tupleid(t)]) out.mod.push(t);
    });
  }
  if (pulse.add.length) {
    pulse.visit(pulse.ADD, update);
  }
  if (pulse.add.length || cap < 0) {
    out.add = res.filter(function(t) { return !map[tupleid(t)]; });
  }
  this.count = cnt;
  this.value = out.source = res;
  return out;
};

function Sequence(params) {
  Transform.call(this, null, params);
}
Sequence.Definition = {
  "type": "Sequence",
  "metadata": {"changes": true},
  "params": [
    { "name": "start", "type": "number", "required": true },
    { "name": "stop", "type": "number", "required": true },
    { "name": "step", "type": "number", "default": 1 }
  ],
  "output": ["value"]
};
var prototype$w = inherits(Sequence, Transform);
prototype$w.transform = function(_$$1, pulse) {
  if (this.value && !_$$1.modified()) return;
  var out = pulse.materialize().fork(pulse.MOD);
  out.rem = this.value ? pulse.rem.concat(this.value) : pulse.rem;
  this.value = range(_$$1.start, _$$1.stop, _$$1.step || 1).map(ingest);
  out.add = pulse.add.concat(this.value);
  return out;
};

function Sieve(params) {
  Transform.call(this, null, params);
  this.modified(true);
}
var prototype$x = inherits(Sieve, Transform);
prototype$x.transform = function(_$$1, pulse) {
  this.value = pulse.source;
  return pulse.changed()
    ? pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS)
    : pulse.StopPropagation;
};

function TupleIndex(params) {
  Transform.call(this, fastmap(), params);
}
var prototype$y = inherits(TupleIndex, Transform);
prototype$y.transform = function(_$$1, pulse) {
  var df = pulse.dataflow,
      field$$1 = _$$1.field,
      index = this.value,
      mod = true;
  function set(t) { index.set(field$$1(t), t); }
  if (_$$1.modified('field') || pulse.modified(field$$1.fields)) {
    index.clear();
    pulse.visit(pulse.SOURCE, set);
  } else if (pulse.changed()) {
    pulse.visit(pulse.REM, function(t) { index.delete(field$$1(t)); });
    pulse.visit(pulse.ADD, set);
  } else {
    mod = false;
  }
  this.modified(mod);
  if (index.empty > df.cleanThreshold) df.runAfter(index.clean);
  return pulse.fork();
};

function Values(params) {
  Transform.call(this, null, params);
}
var prototype$z = inherits(Values, Transform);
prototype$z.transform = function(_$$1, pulse) {
  var run = !this.value
    || _$$1.modified('field')
    || _$$1.modified('sort')
    || pulse.changed()
    || (_$$1.sort && pulse.modified(_$$1.sort.fields));
  if (run) {
    this.value = (_$$1.sort
      ? pulse.source.slice().sort(_$$1.sort)
      : pulse.source).map(_$$1.field);
  }
};

function WindowOp(op, field$$1, param, as) {
  var fn = WindowOps[op](field$$1, param);
  return {
    init:   fn.init || zero,
    update: function(w, t) { t[as] = fn.next(w); }
  };
}
var WindowOps = {
  row_number: function() {
    return {
      next: function(w) { return w.index + 1; }
    };
  },
  rank: function() {
    var rank;
    return {
      init: function() { rank = 1; },
      next: function(w) {
        var i = w.index,
            data = w.data;
        return (i && w.compare(data[i - 1], data[i])) ? (rank = i + 1) : rank;
      }
    };
  },
  dense_rank: function() {
    var drank;
    return {
      init: function() { drank = 1; },
      next: function(w) {
        var i = w.index,
            d = w.data;
        return (i && w.compare(d[i - 1], d[i])) ? ++drank : drank;
      }
    };
  },
  percent_rank: function() {
    var rank = WindowOps.rank(),
        next = rank.next;
    return {
      init: rank.init,
      next: function(w) {
        return (next(w) - 1) / (w.data.length - 1);
      }
    };
  },
  cume_dist: function() {
    var cume;
    return {
      init: function() { cume = 0; },
      next: function(w) {
        var i = w.index,
            d = w.data,
            c = w.compare;
        if (cume < i) {
          while (i + 1 < d.length && !c(d[i], d[i + 1])) ++i;
          cume = i;
        }
        return (1 + cume) / d.length;
      }
    };
  },
  ntile: function(field$$1, num) {
    num = +num;
    if (!(num > 0)) error('ntile num must be greater than zero.');
    var cume = WindowOps.cume_dist(),
        next = cume.next;
    return {
      init: cume.init,
      next: function(w) { return Math.ceil(num * next(w)); }
    };
  },
  lag: function(field$$1, offset) {
    offset = +offset || 1;
    return {
      next: function(w) {
        var i = w.index - offset;
        return i >= 0 ? field$$1(w.data[i]) : null;
      }
    };
  },
  lead: function(field$$1, offset) {
    offset = +offset || 1;
    return {
      next: function(w) {
        var i = w.index + offset,
            d = w.data;
        return i < d.length ? field$$1(d[i]) : null;
      }
    };
  },
  first_value: function(field$$1) {
    return {
      next: function(w) { return field$$1(w.data[w.i0]); }
    };
  },
  last_value: function(field$$1) {
    return {
      next: function(w) { return field$$1(w.data[w.i1 - 1]); }
    }
  },
  nth_value: function(field$$1, nth) {
    nth = +nth;
    if (!(nth > 0)) error('nth_value nth must be greater than zero.');
    return {
      next: function(w) {
        var i = w.i0 + (nth - 1);
        return i < w.i1 ? field$$1(w.data[i]) : null;
      }
    }
  }
};
var ValidWindowOps = Object.keys(WindowOps);

function WindowState(_$$1) {
  var self = this,
      ops = array(_$$1.ops),
      fields = array(_$$1.fields),
      params = array(_$$1.params),
      as = array(_$$1.as),
      outputs = self.outputs = [],
      windows = self.windows = [],
      inputs = {},
      map = {},
      countOnly = true,
      counts = [],
      measures = [];
  function visitInputs(f) {
    array(accessorFields(f)).forEach(function(_$$1) { inputs[_$$1] = 1; });
  }
  visitInputs(_$$1.sort);
  ops.forEach(function(op, i) {
    var field$$1 = fields[i],
        mname = accessorName(field$$1),
        name = measureName(op, mname, as[i]);
    visitInputs(field$$1);
    outputs.push(name);
    if (WindowOps.hasOwnProperty(op)) {
      windows.push(WindowOp(op, fields[i], params[i], name));
    }
    else {
      if (field$$1 == null && op !== 'count') {
        error('Null aggregate field specified.');
      }
      if (op === 'count') {
        counts.push(name);
        return;
      }
      countOnly = false;
      var m = map[mname];
      if (!m) {
        m = (map[mname] = []);
        m.field = field$$1;
        measures.push(m);
      }
      m.push(createMeasure(op, name));
    }
  });
  if (counts.length || measures.length) {
    self.cell = cell(measures, counts, countOnly);
  }
  self.inputs = Object.keys(inputs);
}
var prototype$A = WindowState.prototype;
prototype$A.init = function() {
  this.windows.forEach(function(_$$1) { _$$1.init(); });
  if (this.cell) this.cell.init();
};
prototype$A.update = function(w, t) {
  var self = this,
      cell = self.cell,
      wind = self.windows,
      data = w.data,
      m = wind && wind.length,
      j;
  if (cell) {
    for (j=w.p0; j<w.i0; ++j) cell.rem(data[j]);
    for (j=w.p1; j<w.i1; ++j) cell.add(data[j]);
    cell.set(t);
  }
  for (j=0; j<m; ++j) wind[j].update(w, t);
};
function cell(measures, counts, countOnly) {
  measures = measures.map(function(m) {
    return compileMeasures(m, m.field);
  });
  var cell = {
    num:   0,
    agg:   null,
    store: false,
    count: counts
  };
  if (!countOnly) {
    var n = measures.length,
        a = cell.agg = Array(n),
        i = 0;
    for (; i<n; ++i) a[i] = new measures[i](cell);
  }
  if (cell.store) {
    var store = cell.data = new TupleStore();
  }
  cell.add = function(t) {
    cell.num += 1;
    if (countOnly) return;
    if (store) store.add(t);
    for (var i=0; i<n; ++i) {
      a[i].add(a[i].get(t), t);
    }
  };
  cell.rem = function(t) {
    cell.num -= 1;
    if (countOnly) return;
    if (store) store.rem(t);
    for (var i=0; i<n; ++i) {
      a[i].rem(a[i].get(t), t);
    }
  };
  cell.set = function(t) {
    var i, n;
    if (store) store.values();
    for (i=0, n=counts.length; i<n; ++i) t[counts[i]] = cell.num;
    if (!countOnly) for (i=0, n=a.length; i<n; ++i) a[i].set(t);
  };
  cell.init = function() {
    cell.num = 0;
    if (store) store.reset();
    for (var i=0; i<n; ++i) a[i].init();
  };
  return cell;
}

function Window(params) {
  Transform.call(this, {}, params);
  this._mlen = 0;
  this._mods = [];
}
Window.Definition = {
  "type": "Window",
  "metadata": {"modifies": true},
  "params": [
    { "name": "sort", "type": "compare" },
    { "name": "groupby", "type": "field", "array": true },
    { "name": "ops", "type": "enum", "array": true, "values": ValidWindowOps.concat(ValidAggregateOps) },
    { "name": "params", "type": "number", "null": true, "array": true },
    { "name": "fields", "type": "field", "null": true, "array": true },
    { "name": "as", "type": "string", "null": true, "array": true },
    { "name": "frame", "type": "number", "null": true, "array": true, "length": 2, "default": [null, 0] },
    { "name": "ignorePeers", "type": "boolean", "default": false }
  ]
};
var prototype$B = inherits(Window, Transform);
prototype$B.transform = function(_$$1, pulse) {
  var self = this,
      state = self.state,
      mod = _$$1.modified(),
      i, n;
  this.stamp = pulse.stamp;
  if (!state || mod) {
    state = self.state = new WindowState(_$$1);
  }
  var key$$1 = groupkey(_$$1.groupby);
  function group(t) { return self.group(key$$1(t)); }
  if (mod || pulse.modified(state.inputs)) {
    self.value = {};
    pulse.visit(pulse.SOURCE, function(t) { group(t).add(t); });
  } else {
    pulse.visit(pulse.REM, function(t) { group(t).remove(t); });
    pulse.visit(pulse.ADD, function(t) { group(t).add(t); });
  }
  for (i=0, n=self._mlen; i<n; ++i) {
    processPartition(self._mods[i], state, _$$1);
  }
  self._mlen = 0;
  self._mods = [];
  return pulse.reflow(mod).modifies(state.outputs);
};
prototype$B.group = function(key$$1) {
  var self = this,
      group = self.value[key$$1];
  if (!group) {
    group = self.value[key$$1] = SortedList(tupleid);
    group.stamp = -1;
  }
  if (group.stamp < self.stamp) {
    group.stamp = self.stamp;
    self._mods[self._mlen++] = group;
  }
  return group;
};
function processPartition(list, state, _$$1) {
  var sort = _$$1.sort,
      range$$1 = sort && !_$$1.ignorePeers,
      frame = _$$1.frame || [null, 0],
      data = list.data(sort),
      n = data.length,
      i = 0,
      b = range$$1 ? bisector(sort) : null,
      w = {
        i0: 0, i1: 0, p0: 0, p1: 0, index: 0,
        data: data, compare: sort || constant(-1)
      };
  for (state.init(); i<n; ++i) {
    setWindow(w, frame, i, n);
    if (range$$1) adjustRange(w, b);
    state.update(w, data[i]);
  }
}
function setWindow(w, f, i, n) {
  w.p0 = w.i0;
  w.p1 = w.i1;
  w.i0 = f[0] == null ? 0 : Math.max(0, i - Math.abs(f[0]));
  w.i1 = f[1] == null ? n : Math.min(n, i + Math.abs(f[1]) + 1);
  w.index = i;
}
function adjustRange(w, bisect$$1) {
  var r0 = w.i0,
      r1 = w.i1 - 1,
      c = w.compare,
      d = w.data,
      n = d.length - 1;
  if (r0 > 0 && !c(d[r0], d[r0-1])) w.i0 = bisect$$1.left(d, d[r0]);
  if (r1 < n && !c(d[r1], d[r1+1])) w.i1 = bisect$$1.right(d, d[r1]);
}



var tx = /*#__PURE__*/Object.freeze({
  aggregate: Aggregate,
  bin: Bin,
  collect: Collect,
  compare: Compare,
  countpattern: CountPattern,
  cross: Cross,
  density: Density,
  extent: Extent,
  facet: Facet,
  field: Field,
  filter: Filter,
  flatten: Flatten,
  fold: Fold,
  formula: Formula,
  generate: Generate,
  impute: Impute,
  joinaggregate: JoinAggregate,
  key: Key,
  lookup: Lookup,
  multiextent: MultiExtent,
  multivalues: MultiValues,
  params: Params,
  pivot: Pivot,
  prefacet: PreFacet,
  project: Project,
  proxy: Proxy,
  relay: Relay,
  sample: Sample,
  sequence: Sequence,
  sieve: Sieve,
  subflow: Subflow,
  tupleindex: TupleIndex,
  values: Values,
  window: Window
});

function Bounds(b) {
  this.clear();
  if (b) this.union(b);
}
var prototype$C = Bounds.prototype;
prototype$C.clone = function() {
  return new Bounds(this);
};
prototype$C.clear = function() {
  this.x1 = +Number.MAX_VALUE;
  this.y1 = +Number.MAX_VALUE;
  this.x2 = -Number.MAX_VALUE;
  this.y2 = -Number.MAX_VALUE;
  return this;
};
prototype$C.empty = function() {
  return (
    this.x1 === +Number.MAX_VALUE &&
    this.y1 === +Number.MAX_VALUE &&
    this.x2 === -Number.MAX_VALUE &&
    this.y2 === -Number.MAX_VALUE
  );
};
prototype$C.set = function(x1, y1, x2, y2) {
  if (x2 < x1) {
    this.x2 = x1;
    this.x1 = x2;
  } else {
    this.x1 = x1;
    this.x2 = x2;
  }
  if (y2 < y1) {
    this.y2 = y1;
    this.y1 = y2;
  } else {
    this.y1 = y1;
    this.y2 = y2;
  }
  return this;
};
prototype$C.add = function(x, y) {
  if (x < this.x1) this.x1 = x;
  if (y < this.y1) this.y1 = y;
  if (x > this.x2) this.x2 = x;
  if (y > this.y2) this.y2 = y;
  return this;
};
prototype$C.expand = function(d) {
  this.x1 -= d;
  this.y1 -= d;
  this.x2 += d;
  this.y2 += d;
  return this;
};
prototype$C.round = function() {
  this.x1 = Math.floor(this.x1);
  this.y1 = Math.floor(this.y1);
  this.x2 = Math.ceil(this.x2);
  this.y2 = Math.ceil(this.y2);
  return this;
};
prototype$C.translate = function(dx, dy) {
  this.x1 += dx;
  this.x2 += dx;
  this.y1 += dy;
  this.y2 += dy;
  return this;
};
prototype$C.rotate = function(angle, x, y) {
  var cos = Math.cos(angle),
      sin = Math.sin(angle),
      cx = x - x*cos + y*sin,
      cy = y - x*sin - y*cos,
      x1 = this.x1, x2 = this.x2,
      y1 = this.y1, y2 = this.y2;
  return this.clear()
    .add(cos*x1 - sin*y1 + cx,  sin*x1 + cos*y1 + cy)
    .add(cos*x1 - sin*y2 + cx,  sin*x1 + cos*y2 + cy)
    .add(cos*x2 - sin*y1 + cx,  sin*x2 + cos*y1 + cy)
    .add(cos*x2 - sin*y2 + cx,  sin*x2 + cos*y2 + cy);
};
prototype$C.union = function(b) {
  if (b.x1 < this.x1) this.x1 = b.x1;
  if (b.y1 < this.y1) this.y1 = b.y1;
  if (b.x2 > this.x2) this.x2 = b.x2;
  if (b.y2 > this.y2) this.y2 = b.y2;
  return this;
};
prototype$C.intersect = function(b) {
  if (b.x1 > this.x1) this.x1 = b.x1;
  if (b.y1 > this.y1) this.y1 = b.y1;
  if (b.x2 < this.x2) this.x2 = b.x2;
  if (b.y2 < this.y2) this.y2 = b.y2;
  return this;
};
prototype$C.encloses = function(b) {
  return b && (
    this.x1 <= b.x1 &&
    this.x2 >= b.x2 &&
    this.y1 <= b.y1 &&
    this.y2 >= b.y2
  );
};
prototype$C.alignsWith = function(b) {
  return b && (
    this.x1 == b.x1 ||
    this.x2 == b.x2 ||
    this.y1 == b.y1 ||
    this.y2 == b.y2
  );
};
prototype$C.intersects = function(b) {
  return b && !(
    this.x2 < b.x1 ||
    this.x1 > b.x2 ||
    this.y2 < b.y1 ||
    this.y1 > b.y2
  );
};
prototype$C.contains = function(x, y) {
  return !(
    x < this.x1 ||
    x > this.x2 ||
    y < this.y1 ||
    y > this.y2
  );
};
prototype$C.width = function() {
  return this.x2 - this.x1;
};
prototype$C.height = function() {
  return this.y2 - this.y1;
};

var gradient_id = 0;
function Gradient(p0, p1) {
  var stops = [], gradient;
  return gradient = {
    id: 'gradient_' + (gradient_id++),
    x1: p0 ? p0[0] : 0,
    y1: p0 ? p0[1] : 0,
    x2: p1 ? p1[0] : 1,
    y2: p1 ? p1[1] : 0,
    stops: stops,
    stop: function(offset, color) {
      stops.push({offset: offset, color: color});
      return gradient;
    }
  };
}

function Item(mark) {
  this.mark = mark;
  this.bounds = (this.bounds || new Bounds());
}

function GroupItem(mark) {
  Item.call(this, mark);
  this.items = (this.items || []);
}
inherits(GroupItem, Item);

function domCanvas(w, h) {
  if (typeof document !== 'undefined' && document.createElement) {
    var c = document.createElement('canvas');
    if (c && c.getContext) {
      c.width = w;
      c.height = h;
      return c;
    }
  }
  return null;
}
function domImage() {
  return typeof Image !== 'undefined' ? Image : null;
}

var NodeCanvas;
['canvas', 'canvas-prebuilt'].some(function(libName) {
  try {
    NodeCanvas = require(libName);
    if (typeof NodeCanvas !== 'function') {
      NodeCanvas = null;
    }
  } catch (error) {
    NodeCanvas = null;
  }
  return NodeCanvas;
});
function nodeCanvas(w, h) {
  if (NodeCanvas) {
    try {
      return new NodeCanvas(w, h);
    } catch (e) {
    }
  }
  return null;
}
function nodeImage() {
  return (NodeCanvas && NodeCanvas.Image) || null;
}

function canvas(w, h) {
  return domCanvas(w, h) || nodeCanvas(w, h) || null;
}
function image() {
  return domImage() || nodeImage() || null;
}

function ResourceLoader(customLoader) {
  this._pending = 0;
  this._loader = customLoader || loader();
}
var prototype$D = ResourceLoader.prototype;
prototype$D.pending = function() {
  return this._pending;
};
function increment(loader$$1) {
  loader$$1._pending += 1;
}
function decrement(loader$$1) {
  loader$$1._pending -= 1;
}
prototype$D.sanitizeURL = function(uri) {
  var loader$$1 = this;
  increment(loader$$1);
  return loader$$1._loader.sanitize(uri, {context:'href'})
    .then(function(opt) {
      decrement(loader$$1);
      return opt;
    })
    .catch(function() {
      decrement(loader$$1);
      return null;
    });
};
prototype$D.loadImage = function(uri) {
  var loader$$1 = this,
      Image = image();
  increment(loader$$1);
  return loader$$1._loader
    .sanitize(uri, {context: 'image'})
    .then(function(opt) {
      var url = opt.href;
      if (!url || !Image) throw {url: url};
      var img = new Image();
      img.onload = function() {
        decrement(loader$$1);
        img.loaded = true;
      };
      img.onerror = function() {
        decrement(loader$$1);
        img.loaded = false;
      };
      img.src = url;
      return img;
    })
    .catch(function(e) {
      decrement(loader$$1);
      return {loaded: false, width: 0, height: 0, src: e && e.url || ''};
    });
};
prototype$D.ready = function() {
  var loader$$1 = this;
  return new Promise(function(accept) {
    function poll(value) {
      if (!loader$$1.pending()) accept(value);
      else setTimeout(function() { poll(true); }, 10);
    }
    poll(false);
  });
};

var lookup = {
  'basis': {
    curve: curveBasis
  },
  'basis-closed': {
    curve: curveBasisClosed
  },
  'basis-open': {
    curve: curveBasisOpen
  },
  'bundle': {
    curve: curveBundle,
    tension: 'beta',
    value: 0.85
  },
  'cardinal': {
    curve: curveCardinal,
    tension: 'tension',
    value: 0
  },
  'cardinal-open': {
    curve: curveCardinalOpen,
    tension: 'tension',
    value: 0
  },
  'cardinal-closed': {
    curve: curveCardinalClosed,
    tension: 'tension',
    value: 0
  },
  'catmull-rom': {
    curve: curveCatmullRom,
    tension: 'alpha',
    value: 0.5
  },
  'catmull-rom-closed': {
    curve: curveCatmullRomClosed,
    tension: 'alpha',
    value: 0.5
  },
  'catmull-rom-open': {
    curve: curveCatmullRomOpen,
    tension: 'alpha',
    value: 0.5
  },
  'linear': {
    curve: curveLinear
  },
  'linear-closed': {
    curve: curveLinearClosed
  },
  'monotone': {
    horizontal: curveMonotoneY,
    vertical:   curveMonotoneX
  },
  'natural': {
    curve: curveNatural
  },
  'step': {
    curve: curveStep
  },
  'step-after': {
    curve: curveStepAfter
  },
  'step-before': {
    curve: curveStepBefore
  }
};
function curves(type, orientation, tension) {
  var entry = lookup.hasOwnProperty(type) && lookup[type],
      curve = null;
  if (entry) {
    curve = entry.curve || entry[orientation || 'vertical'];
    if (entry.tension && tension != null) {
      curve = curve[entry.tension](tension);
    }
  }
  return curve;
}

var cmdlen = { m:2, l:2, h:1, v:1, c:6, s:4, q:4, t:2, a:7 },
    regexp = [/([MLHVCSQTAZmlhvcsqtaz])/g, /###/, /(\d)([-+])/g, /\s|,|###/];
function pathParse(pathstr) {
  var result = [],
      path$$1,
      curr,
      chunks,
      parsed, param,
      cmd, len, i, j, n, m;
  path$$1 = pathstr
    .slice()
    .replace(regexp[0], '###$1')
    .split(regexp[1])
    .slice(1);
  for (i=0, n=path$$1.length; i<n; ++i) {
    curr = path$$1[i];
    chunks = curr
      .slice(1)
      .trim()
      .replace(regexp[2],'$1###$2')
      .split(regexp[3]);
    cmd = curr.charAt(0);
    parsed = [cmd];
    for (j=0, m=chunks.length; j<m; ++j) {
      if ((param = +chunks[j]) === param) {
        parsed.push(param);
      }
    }
    len = cmdlen[cmd.toLowerCase()];
    if (parsed.length-1 > len) {
      for (j=1, m=parsed.length; j<m; j+=len) {
        result.push([cmd].concat(parsed.slice(j, j+len)));
      }
    }
    else {
      result.push(parsed);
    }
  }
  return result;
}

var segmentCache = {};
var bezierCache = {};
var join = [].join;
function segments(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
  var key = join.call(arguments);
  if (segmentCache[key]) {
    return segmentCache[key];
  }
  var th = rotateX * (Math.PI/180);
  var sin_th = Math.sin(th);
  var cos_th = Math.cos(th);
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  var px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
  var py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
  var pl = (px*px) / (rx*rx) + (py*py) / (ry*ry);
  if (pl > 1) {
    pl = Math.sqrt(pl);
    rx *= pl;
    ry *= pl;
  }
  var a00 = cos_th / rx;
  var a01 = sin_th / rx;
  var a10 = (-sin_th) / ry;
  var a11 = (cos_th) / ry;
  var x0 = a00 * ox + a01 * oy;
  var y0 = a10 * ox + a11 * oy;
  var x1 = a00 * x + a01 * y;
  var y1 = a10 * x + a11 * y;
  var d = (x1-x0) * (x1-x0) + (y1-y0) * (y1-y0);
  var sfactor_sq = 1 / d - 0.25;
  if (sfactor_sq < 0) sfactor_sq = 0;
  var sfactor = Math.sqrt(sfactor_sq);
  if (sweep == large) sfactor = -sfactor;
  var xc = 0.5 * (x0 + x1) - sfactor * (y1-y0);
  var yc = 0.5 * (y0 + y1) + sfactor * (x1-x0);
  var th0 = Math.atan2(y0-yc, x0-xc);
  var th1 = Math.atan2(y1-yc, x1-xc);
  var th_arc = th1-th0;
  if (th_arc < 0 && sweep === 1){
    th_arc += 2 * Math.PI;
  } else if (th_arc > 0 && sweep === 0) {
    th_arc -= 2 * Math.PI;
  }
  var segs = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)));
  var result = [];
  for (var i=0; i<segs; ++i) {
    var th2 = th0 + i * th_arc / segs;
    var th3 = th0 + (i+1) * th_arc / segs;
    result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
  }
  return (segmentCache[key] = result);
}
function bezier(params) {
  var key = join.call(params);
  if (bezierCache[key]) {
    return bezierCache[key];
  }
  var cx = params[0],
      cy = params[1],
      th0 = params[2],
      th1 = params[3],
      rx = params[4],
      ry = params[5],
      sin_th = params[6],
      cos_th = params[7];
  var a00 = cos_th * rx;
  var a01 = -sin_th * ry;
  var a10 = sin_th * rx;
  var a11 = cos_th * ry;
  var cos_th0 = Math.cos(th0);
  var sin_th0 = Math.sin(th0);
  var cos_th1 = Math.cos(th1);
  var sin_th1 = Math.sin(th1);
  var th_half = 0.5 * (th1 - th0);
  var sin_th_h2 = Math.sin(th_half * 0.5);
  var t = (8/3) * sin_th_h2 * sin_th_h2 / Math.sin(th_half);
  var x1 = cx + cos_th0 - t * sin_th0;
  var y1 = cy + sin_th0 + t * cos_th0;
  var x3 = cx + cos_th1;
  var y3 = cy + sin_th1;
  var x2 = x3 + t * sin_th1;
  var y2 = y3 - t * cos_th1;
  return (bezierCache[key] = [
    a00 * x1 + a01 * y1,  a10 * x1 + a11 * y1,
    a00 * x2 + a01 * y2,  a10 * x2 + a11 * y2,
    a00 * x3 + a01 * y3,  a10 * x3 + a11 * y3
  ]);
}

var temp = ['l', 0, 0, 0, 0, 0, 0, 0];
function scale(current, s) {
  var c = (temp[0] = current[0]);
  if (c === 'a' || c === 'A') {
    temp[1] = s * current[1];
    temp[2] = s * current[2];
    temp[6] = s * current[6];
    temp[7] = s * current[7];
  } else {
    for (var i=1, n=current.length; i<n; ++i) {
      temp[i] = s * current[i];
    }
  }
  return temp;
}
function pathRender(context, path$$1, l, t, s) {
  var current,
      previous = null,
      x = 0,
      y = 0,
      controlX = 0,
      controlY = 0,
      tempX,
      tempY,
      tempControlX,
      tempControlY;
  if (l == null) l = 0;
  if (t == null) t = 0;
  if (s == null) s = 1;
  if (context.beginPath) context.beginPath();
  for (var i=0, len=path$$1.length; i<len; ++i) {
    current = path$$1[i];
    if (s !== 1) current = scale(current, s);
    switch (current[0]) {
      case 'l':
        x += current[1];
        y += current[2];
        context.lineTo(x + l, y + t);
        break;
      case 'L':
        x = current[1];
        y = current[2];
        context.lineTo(x + l, y + t);
        break;
      case 'h':
        x += current[1];
        context.lineTo(x + l, y + t);
        break;
      case 'H':
        x = current[1];
        context.lineTo(x + l, y + t);
        break;
      case 'v':
        y += current[1];
        context.lineTo(x + l, y + t);
        break;
      case 'V':
        y = current[1];
        context.lineTo(x + l, y + t);
        break;
      case 'm':
        x += current[1];
        y += current[2];
        context.moveTo(x + l, y + t);
        break;
      case 'M':
        x = current[1];
        y = current[2];
        context.moveTo(x + l, y + t);
        break;
      case 'c':
        tempX = x + current[5];
        tempY = y + current[6];
        controlX = x + current[3];
        controlY = y + current[4];
        context.bezierCurveTo(
          x + current[1] + l,
          y + current[2] + t,
          controlX + l,
          controlY + t,
          tempX + l,
          tempY + t
        );
        x = tempX;
        y = tempY;
        break;
      case 'C':
        x = current[5];
        y = current[6];
        controlX = current[3];
        controlY = current[4];
        context.bezierCurveTo(
          current[1] + l,
          current[2] + t,
          controlX + l,
          controlY + t,
          x + l,
          y + t
        );
        break;
      case 's':
        tempX = x + current[3];
        tempY = y + current[4];
        controlX = 2 * x - controlX;
        controlY = 2 * y - controlY;
        context.bezierCurveTo(
          controlX + l,
          controlY + t,
          x + current[1] + l,
          y + current[2] + t,
          tempX + l,
          tempY + t
        );
        controlX = x + current[1];
        controlY = y + current[2];
        x = tempX;
        y = tempY;
        break;
      case 'S':
        tempX = current[3];
        tempY = current[4];
        controlX = 2*x - controlX;
        controlY = 2*y - controlY;
        context.bezierCurveTo(
          controlX + l,
          controlY + t,
          current[1] + l,
          current[2] + t,
          tempX + l,
          tempY + t
        );
        x = tempX;
        y = tempY;
        controlX = current[1];
        controlY = current[2];
        break;
      case 'q':
        tempX = x + current[3];
        tempY = y + current[4];
        controlX = x + current[1];
        controlY = y + current[2];
        context.quadraticCurveTo(
          controlX + l,
          controlY + t,
          tempX + l,
          tempY + t
        );
        x = tempX;
        y = tempY;
        break;
      case 'Q':
        tempX = current[3];
        tempY = current[4];
        context.quadraticCurveTo(
          current[1] + l,
          current[2] + t,
          tempX + l,
          tempY + t
        );
        x = tempX;
        y = tempY;
        controlX = current[1];
        controlY = current[2];
        break;
      case 't':
        tempX = x + current[1];
        tempY = y + current[2];
        if (previous[0].match(/[QqTt]/) === null) {
          controlX = x;
          controlY = y;
        }
        else if (previous[0] === 't') {
          controlX = 2 * x - tempControlX;
          controlY = 2 * y - tempControlY;
        }
        else if (previous[0] === 'q') {
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        }
        tempControlX = controlX;
        tempControlY = controlY;
        context.quadraticCurveTo(
          controlX + l,
          controlY + t,
          tempX + l,
          tempY + t
        );
        x = tempX;
        y = tempY;
        controlX = x + current[1];
        controlY = y + current[2];
        break;
      case 'T':
        tempX = current[1];
        tempY = current[2];
        controlX = 2 * x - controlX;
        controlY = 2 * y - controlY;
        context.quadraticCurveTo(
          controlX + l,
          controlY + t,
          tempX + l,
          tempY + t
        );
        x = tempX;
        y = tempY;
        break;
      case 'a':
        drawArc(context, x + l, y + t, [
          current[1],
          current[2],
          current[3],
          current[4],
          current[5],
          current[6] + x + l,
          current[7] + y + t
        ]);
        x += current[6];
        y += current[7];
        break;
      case 'A':
        drawArc(context, x + l, y + t, [
          current[1],
          current[2],
          current[3],
          current[4],
          current[5],
          current[6] + l,
          current[7] + t
        ]);
        x = current[6];
        y = current[7];
        break;
      case 'z':
      case 'Z':
        context.closePath();
        break;
    }
    previous = current;
  }
}
function drawArc(context, x, y, coords) {
  var seg = segments(
    coords[5],
    coords[6],
    coords[0],
    coords[1],
    coords[3],
    coords[4],
    coords[2],
    x, y
  );
  for (var i=0; i<seg.length; ++i) {
    var bez = bezier(seg[i]);
    context.bezierCurveTo(bez[0], bez[1], bez[2], bez[3], bez[4], bez[5]);
  }
}

var tau = 2 * Math.PI,
    halfSqrt3 = Math.sqrt(3) / 2;
var builtins = {
  'circle': {
    draw: function(context, size) {
      var r = Math.sqrt(size) / 2;
      context.moveTo(r, 0);
      context.arc(0, 0, r, 0, tau);
    }
  },
  'cross': {
    draw: function(context, size) {
      var r = Math.sqrt(size) / 2,
          s = r / 2.5;
      context.moveTo(-r, -s);
      context.lineTo(-r, s);
      context.lineTo(-s, s);
      context.lineTo(-s, r);
      context.lineTo(s, r);
      context.lineTo(s, s);
      context.lineTo(r, s);
      context.lineTo(r, -s);
      context.lineTo(s, -s);
      context.lineTo(s, -r);
      context.lineTo(-s, -r);
      context.lineTo(-s, -s);
      context.closePath();
    }
  },
  'diamond': {
    draw: function(context, size) {
      var r = Math.sqrt(size) / 2;
      context.moveTo(-r, 0);
      context.lineTo(0, -r);
      context.lineTo(r, 0);
      context.lineTo(0, r);
      context.closePath();
    }
  },
  'square': {
    draw: function(context, size) {
      var w = Math.sqrt(size),
          x = -w / 2;
      context.rect(x, x, w, w);
    }
  },
  'triangle-up': {
    draw: function(context, size) {
      var r = Math.sqrt(size) / 2,
          h = halfSqrt3 * r;
      context.moveTo(0, -h);
      context.lineTo(-r, h);
      context.lineTo(r, h);
      context.closePath();
    }
  },
  'triangle-down': {
    draw: function(context, size) {
      var r = Math.sqrt(size) / 2,
          h = halfSqrt3 * r;
      context.moveTo(0, h);
      context.lineTo(-r, -h);
      context.lineTo(r, -h);
      context.closePath();
    }
  },
  'triangle-right': {
    draw: function(context, size) {
      var r = Math.sqrt(size) / 2,
          h = halfSqrt3 * r;
      context.moveTo(h, 0);
      context.lineTo(-h, -r);
      context.lineTo(-h, r);
      context.closePath();
    }
  },
  'triangle-left': {
    draw: function(context, size) {
      var r = Math.sqrt(size) / 2,
          h = halfSqrt3 * r;
      context.moveTo(-h, 0);
      context.lineTo(h, -r);
      context.lineTo(h, r);
      context.closePath();
    }
  }
};
function symbols(_$$1) {
  return builtins.hasOwnProperty(_$$1) ? builtins[_$$1] : customSymbol(_$$1);
}
var custom = {};
function customSymbol(path$$1) {
  if (!custom.hasOwnProperty(path$$1)) {
    var parsed = pathParse(path$$1);
    custom[path$$1] = {
      draw: function(context, size) {
        pathRender(context, parsed, 0, 0, Math.sqrt(size) / 2);
      }
    };
  }
  return custom[path$$1];
}

function rectangleX(d) {
  return d.x;
}
function rectangleY(d) {
  return d.y;
}
function rectangleWidth(d) {
  return d.width;
}
function rectangleHeight(d) {
  return d.height;
}
function constant$1(_$$1) {
  return function() { return _$$1; };
}
function vg_rect() {
  var x = rectangleX,
      y = rectangleY,
      width = rectangleWidth,
      height = rectangleHeight,
      cornerRadius = constant$1(0),
      context = null;
  function rectangle(_$$1, x0, y0) {
    var buffer,
        x1 = x0 != null ? x0 : +x.call(this, _$$1),
        y1 = y0 != null ? y0 : +y.call(this, _$$1),
        w  = +width.call(this, _$$1),
        h  = +height.call(this, _$$1),
        cr = +cornerRadius.call(this, _$$1);
    if (!context) context = buffer = path();
    if (cr <= 0) {
      context.rect(x1, y1, w, h);
    } else {
      var x2 = x1 + w,
          y2 = y1 + h;
      context.moveTo(x1 + cr, y1);
      context.lineTo(x2 - cr, y1);
      context.quadraticCurveTo(x2, y1, x2, y1 + cr);
      context.lineTo(x2, y2 - cr);
      context.quadraticCurveTo(x2, y2, x2 - cr, y2);
      context.lineTo(x1 + cr, y2);
      context.quadraticCurveTo(x1, y2, x1, y2 - cr);
      context.lineTo(x1, y1 + cr);
      context.quadraticCurveTo(x1, y1, x1 + cr, y1);
      context.closePath();
    }
    if (buffer) {
      context = null;
      return buffer + '' || null;
    }
  }
  rectangle.x = function(_$$1) {
    if (arguments.length) {
      x = typeof _$$1 === 'function' ? _$$1 : constant$1(+_$$1);
      return rectangle;
    } else {
      return x;
    }
  };
  rectangle.y = function(_$$1) {
    if (arguments.length) {
      y = typeof _$$1 === 'function' ? _$$1 : constant$1(+_$$1);
      return rectangle;
    } else {
      return y;
    }
  };
  rectangle.width = function(_$$1) {
    if (arguments.length) {
      width = typeof _$$1 === 'function' ? _$$1 : constant$1(+_$$1);
      return rectangle;
    } else {
      return width;
    }
  };
  rectangle.height = function(_$$1) {
    if (arguments.length) {
      height = typeof _$$1 === 'function' ? _$$1 : constant$1(+_$$1);
      return rectangle;
    } else {
      return height;
    }
  };
  rectangle.cornerRadius = function(_$$1) {
    if (arguments.length) {
      cornerRadius = typeof _$$1 === 'function' ? _$$1 : constant$1(+_$$1);
      return rectangle;
    } else {
      return cornerRadius;
    }
  };
  rectangle.context = function(_$$1) {
    if (arguments.length) {
      context = _$$1 == null ? null : _$$1;
      return rectangle;
    } else {
      return context;
    }
  };
  return rectangle;
}

var pi = Math.PI;
function vg_trail() {
  var x,
      y,
      size,
      defined,
      context = null,
      ready, x1, y1, r1;
  function point(x2, y2, w2) {
    var r2 = w2 / 2;
    if (ready) {
      var ux = y1 - y2,
          uy = x2 - x1;
      if (ux || uy) {
        var ud = Math.sqrt(ux * ux + uy * uy),
            rx = (ux /= ud) * r1,
            ry = (uy /= ud) * r1,
            t = Math.atan2(uy, ux);
        context.moveTo(x1 - rx, y1 - ry);
        context.lineTo(x2 - ux * r2, y2 - uy * r2);
        context.arc(x2, y2, r2, t - pi, t);
        context.lineTo(x1 + rx, y1 + ry);
        context.arc(x1, y1, r1, t, t + pi);
      } else {
        context.arc(x2, y2, r2, 0, 2*pi);
      }
      context.closePath();
    } else {
      ready = 1;
    }
    x1 = x2;
    y1 = y2;
    r1 = r2;
  }
  function trail(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;
    if (context == null) context = buffer = path();
    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) ready = 0;
      }
      if (defined0) point(+x(d, i, data), +y(d, i, data), +size(d, i, data));
    }
    if (buffer) {
      context = null;
      return buffer + '' || null;
    }
  }
  trail.x = function(_$$1) {
    if (arguments.length) {
      x = _$$1;
      return trail;
    } else {
      return x;
    }
  };
  trail.y = function(_$$1) {
    if (arguments.length) {
      y = _$$1;
      return trail;
    } else {
      return y;
    }
  };
  trail.size = function(_$$1) {
    if (arguments.length) {
      size = _$$1;
      return trail;
    } else {
      return size;
    }
  };
  trail.defined = function(_$$1) {
    if (arguments.length) {
      defined = _$$1;
      return trail;
    } else {
      return defined;
    }
  };
  trail.context = function(_$$1) {
    if (arguments.length) {
      if (_$$1 == null) {
        context = null;
      } else {
        context = _$$1;
      }
      return trail;
    } else {
      return context;
    }
  };
  return trail;
}

function x(item)    { return item.x || 0; }
function y(item)    { return item.y || 0; }
function w(item)    { return item.width || 0; }
function ts(item)   { return item.size || 1; }
function h(item)    { return item.height || 0; }
function xw(item)   { return (item.x || 0) + (item.width || 0); }
function yh(item)   { return (item.y || 0) + (item.height || 0); }
function sa(item)   { return item.startAngle || 0; }
function ea(item)   { return item.endAngle || 0; }
function pa(item)   { return item.padAngle || 0; }
function ir(item)   { return item.innerRadius || 0; }
function or(item)   { return item.outerRadius || 0; }
function cr(item)   { return item.cornerRadius || 0; }
function def(item)  { return !(item.defined === false); }
function size(item) { return item.size == null ? 64 : item.size; }
function type(item) { return symbols(item.shape || 'circle'); }
var arcShape    = arc().startAngle(sa).endAngle(ea).padAngle(pa)
                          .innerRadius(ir).outerRadius(or).cornerRadius(cr),
    areavShape  = area().x(x).y1(y).y0(yh).defined(def),
    areahShape  = area().y(y).x1(x).x0(xw).defined(def),
    lineShape   = line().x(x).y(y).defined(def),
    rectShape   = vg_rect().x(x).y(y).width(w).height(h).cornerRadius(cr),
    symbolShape = symbol().type(type).size(size),
    trailShape  = vg_trail().x(x).y(y).defined(def).size(ts);
function arc$1(context, item) {
  return arcShape.context(context)(item);
}
function area$1(context, items) {
  var item = items[0],
      interp = item.interpolate || 'linear';
  return (item.orient === 'horizontal' ? areahShape : areavShape)
    .curve(curves(interp, item.orient, item.tension))
    .context(context)(items);
}
function line$1(context, items) {
  var item = items[0],
      interp = item.interpolate || 'linear';
  return lineShape.curve(curves(interp, item.orient, item.tension))
    .context(context)(items);
}
function rectangle(context, item, x, y) {
  return rectShape.context(context)(item, x, y);
}
function shape(context, item) {
  return (item.mark.shape || item.shape)
    .context(context)(item);
}
function symbol$1(context, item) {
  return symbolShape.context(context)(item);
}
function trail(context, items) {
  return trailShape.context(context)(items);
}

function boundStroke(bounds, item) {
  if (item.stroke && item.opacity !== 0 && item.strokeOpacity !== 0) {
    bounds.expand(item.strokeWidth != null ? +item.strokeWidth : 1);
  }
  return bounds;
}

var bounds,
    tau$1 = Math.PI * 2,
    halfPi = tau$1 / 4,
    circleThreshold = tau$1 - 1e-8;
function context(_$$1) {
  bounds = _$$1;
  return context;
}
function noop() {}
function add$1(x, y) { bounds.add(x, y); }
context.beginPath = noop;
context.closePath = noop;
context.moveTo = add$1;
context.lineTo = add$1;
context.rect = function(x, y, w, h) {
  add$1(x, y);
  add$1(x + w, y + h);
};
context.quadraticCurveTo = function(x1, y1, x2, y2) {
  add$1(x1, y1);
  add$1(x2, y2);
};
context.bezierCurveTo = function(x1, y1, x2, y2, x3, y3) {
  add$1(x1, y1);
  add$1(x2, y2);
  add$1(x3, y3);
};
context.arc = function(cx, cy, r, sa, ea, ccw) {
  if (Math.abs(ea - sa) > circleThreshold) {
    add$1(cx - r, cy - r);
    add$1(cx + r, cy + r);
    return;
  }
  var xmin = Infinity, xmax = -Infinity,
      ymin = Infinity, ymax = -Infinity,
      s, i, x, y;
  function update(a) {
    x = r * Math.cos(a);
    y = r * Math.sin(a);
    if (x < xmin) xmin = x;
    if (x > xmax) xmax = x;
    if (y < ymin) ymin = y;
    if (y > ymax) ymax = y;
  }
  update(sa);
  update(ea);
  if (ea !== sa) {
    sa = sa % tau$1; if (sa < 0) sa += tau$1;
    ea = ea % tau$1; if (ea < 0) ea += tau$1;
    if (ea < sa) {
      ccw = !ccw;
      s = sa; sa = ea; ea = s;
    }
    if (ccw) {
      ea -= tau$1;
      s = sa - (sa % halfPi);
      for (i=0; i<4 && s>ea; ++i, s-=halfPi) update(s);
    } else {
      s = sa - (sa % halfPi) + halfPi;
      for (i=0; i<4 && s<ea; ++i, s=s+halfPi) update(s);
    }
  }
  add$1(cx + xmin, cy + ymin);
  add$1(cx + xmax, cy + ymax);
};

function gradient(context, gradient, bounds) {
  var w = bounds.width(),
      h = bounds.height(),
      x1 = bounds.x1 + gradient.x1 * w,
      y1 = bounds.y1 + gradient.y1 * h,
      x2 = bounds.x1 + gradient.x2 * w,
      y2 = bounds.y1 + gradient.y2 * h,
      stop = gradient.stops,
      i = 0,
      n = stop.length,
      linearGradient = context.createLinearGradient(x1, y1, x2, y2);
  for (; i<n; ++i) {
    linearGradient.addColorStop(stop[i].offset, stop[i].color);
  }
  return linearGradient;
}

function color(context, item, value) {
  return (value.id) ?
    gradient(context, value, item.bounds) :
    value;
}

function fill(context, item, opacity) {
  opacity *= (item.fillOpacity==null ? 1 : item.fillOpacity);
  if (opacity > 0) {
    context.globalAlpha = opacity;
    context.fillStyle = color(context, item, item.fill);
    return true;
  } else {
    return false;
  }
}

var Empty$1 = [];
function stroke(context, item, opacity) {
  var lw = (lw = item.strokeWidth) != null ? lw : 1;
  if (lw <= 0) return false;
  opacity *= (item.strokeOpacity==null ? 1 : item.strokeOpacity);
  if (opacity > 0) {
    context.globalAlpha = opacity;
    context.strokeStyle = color(context, item, item.stroke);
    context.lineWidth = lw;
    context.lineCap = item.strokeCap || 'butt';
    context.lineJoin = item.strokeJoin || 'miter';
    context.miterLimit = item.strokeMiterLimit || 10;
    if (context.setLineDash) {
      context.setLineDash(item.strokeDash || Empty$1);
      context.lineDashOffset = item.strokeDashOffset || 0;
    }
    return true;
  } else {
    return false;
  }
}

function compare$1(a, b) {
  return a.zindex - b.zindex || a.index - b.index;
}
function zorder(scene) {
  if (!scene.zdirty) return scene.zitems;
  var items = scene.items,
      output = [], item, i, n;
  for (i=0, n=items.length; i<n; ++i) {
    item = items[i];
    item.index = i;
    if (item.zindex) output.push(item);
  }
  scene.zdirty = false;
  return scene.zitems = output.sort(compare$1);
}
function visit(scene, visitor) {
  var items = scene.items, i, n;
  if (!items || !items.length) return;
  var zitems = zorder(scene);
  if (zitems && zitems.length) {
    for (i=0, n=items.length; i<n; ++i) {
      if (!items[i].zindex) visitor(items[i]);
    }
    items = zitems;
  }
  for (i=0, n=items.length; i<n; ++i) {
    visitor(items[i]);
  }
}
function pickVisit(scene, visitor) {
  var items = scene.items, hit, i;
  if (!items || !items.length) return null;
  var zitems = zorder(scene);
  if (zitems && zitems.length) items = zitems;
  for (i=items.length; --i >= 0;) {
    if (hit = visitor(items[i])) return hit;
  }
  if (items === zitems) {
    for (items=scene.items, i=items.length; --i >= 0;) {
      if (!items[i].zindex) {
        if (hit = visitor(items[i])) return hit;
      }
    }
  }
  return null;
}

function drawAll(path$$1) {
  return function(context, scene, bounds) {
    visit(scene, function(item) {
      if (!bounds || bounds.intersects(item.bounds)) {
        drawPath(path$$1, context, item, item);
      }
    });
  };
}
function drawOne(path$$1) {
  return function(context, scene, bounds) {
    if (scene.items.length && (!bounds || bounds.intersects(scene.bounds))) {
      drawPath(path$$1, context, scene.items[0], scene.items);
    }
  };
}
function drawPath(path$$1, context, item, items) {
  var opacity = item.opacity == null ? 1 : item.opacity;
  if (opacity === 0) return;
  if (path$$1(context, items)) return;
  if (item.fill && fill(context, item, opacity)) {
    context.fill();
  }
  if (item.stroke && stroke(context, item, opacity)) {
    context.stroke();
  }
}

var trueFunc = function() { return true; };
function pick(test) {
  if (!test) test = trueFunc;
  return function(context, scene, x, y, gx, gy) {
    x *= context.pixelRatio;
    y *= context.pixelRatio;
    return pickVisit(scene, function(item) {
      var b = item.bounds;
      if ((b && !b.contains(gx, gy)) || !b) return;
      if (test(context, item, x, y, gx, gy)) return item;
    });
  };
}
function hitPath(path$$1, filled) {
  return function(context, o, x, y) {
    var item = Array.isArray(o) ? o[0] : o,
        fill = (filled == null) ? item.fill : filled,
        stroke = item.stroke && context.isPointInStroke, lw, lc;
    if (stroke) {
      lw = item.strokeWidth;
      lc = item.strokeCap;
      context.lineWidth = lw != null ? lw : 1;
      context.lineCap   = lc != null ? lc : 'butt';
    }
    return path$$1(context, o) ? false :
      (fill && context.isPointInPath(x, y)) ||
      (stroke && context.isPointInStroke(x, y));
  };
}
function pickPath(path$$1) {
  return pick(hitPath(path$$1));
}

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}

function translateItem(item) {
  return translate(item.x || 0, item.y || 0);
}

function markItemPath(type, shape) {
  function attr(emit, item) {
    emit('transform', translateItem(item));
    emit('d', shape(null, item));
  }
  function bound(bounds, item) {
    shape(context(bounds), item);
    return boundStroke(bounds, item)
      .translate(item.x || 0, item.y || 0);
  }
  function draw(context$$1, item) {
    var x = item.x || 0,
        y = item.y || 0;
    context$$1.translate(x, y);
    context$$1.beginPath();
    shape(context$$1, item);
    context$$1.translate(-x, -y);
  }
  return {
    type:   type,
    tag:    'path',
    nested: false,
    attr:   attr,
    bound:  bound,
    draw:   drawAll(draw),
    pick:   pickPath(draw)
  };
}

var arc$2 = markItemPath('arc', arc$1);

function pickArea(a, p) {
  var v = a[0].orient === 'horizontal' ? p[1] : p[0],
      z = a[0].orient === 'horizontal' ? 'y' : 'x',
      lo = 0,
      hi = a.length;
  if (hi === 1) return a[0];
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (a[mid][z] < v) lo = mid + 1;
    else hi = mid;
  }
  lo = Math.max(0, lo - 1);
  hi = Math.min(a.length - 1, hi);
  return (v - a[lo][z]) < (a[hi][z] - v) ? a[lo] : a[hi];
}
function pickLine(a, p) {
  var t = Math.pow(a[0].strokeWidth || 1, 2),
      i = a.length, dx, dy, dd;
  while (--i >= 0) {
    if (a[i].defined === false) continue;
    dx = a[i].x - p[0];
    dy = a[i].y - p[1];
    dd = dx * dx + dy * dy;
    if (dd < t) return a[i];
  }
  return null;
}
function pickTrail(a, p) {
  var i = a.length, dx, dy, dd;
  while (--i >= 0) {
    if (a[i].defined === false) continue;
    dx = a[i].x - p[0];
    dy = a[i].y - p[1];
    dd = dx * dx + dy * dy;
    dx = a[i].size || 1;
    if (dd < dx*dx) return a[i];
  }
  return null;
}

function markMultiItemPath(type, shape, tip) {
  function attr(emit, item) {
    var items = item.mark.items;
    if (items.length) emit('d', shape(null, items));
  }
  function bound(bounds, mark) {
    var items = mark.items;
    if (items.length === 0) {
      return bounds;
    } else {
      shape(context(bounds), items);
      return boundStroke(bounds, items[0]);
    }
  }
  function draw(context$$1, items) {
    context$$1.beginPath();
    shape(context$$1, items);
  }
  var hit = hitPath(draw);
  function pick$$1(context$$1, scene, x, y, gx, gy) {
    var items = scene.items,
        b = scene.bounds;
    if (!items || !items.length || b && !b.contains(gx, gy)) {
      return null;
    }
    x *= context$$1.pixelRatio;
    y *= context$$1.pixelRatio;
    return hit(context$$1, items, x, y) ? items[0] : null;
  }
  return {
    type:   type,
    tag:    'path',
    nested: true,
    attr:   attr,
    bound:  bound,
    draw:   drawOne(draw),
    pick:   pick$$1,
    tip:    tip
  };
}

var area$2 = markMultiItemPath('area', area$1, pickArea);

var clip_id = 1;
function resetSVGClipId() {
  clip_id = 1;
}
function clip(renderer, item, size) {
  var clip = item.clip,
      defs = renderer._defs,
      id$$1 = item.clip_id || (item.clip_id = 'clip' + clip_id++),
      c = defs.clipping[id$$1] || (defs.clipping[id$$1] = {id: id$$1});
  if (isFunction(clip)) {
    c.path = clip(null);
  } else {
    c.width = size.width || 0;
    c.height = size.height || 0;
  }
  return 'url(#' + id$$1 + ')';
}

var StrokeOffset = 0.5;
function attr(emit, item) {
  emit('transform', translateItem(item));
}
function background(emit, item) {
  var offset = item.stroke ? StrokeOffset : 0;
  emit('class', 'background');
  emit('d', rectangle(null, item, offset, offset));
}
function foreground(emit, item, renderer) {
  var url = item.clip ? clip(renderer, item, item) : null;
  emit('clip-path', url);
}
function bound(bounds, group) {
  if (!group.clip && group.items) {
    var items = group.items;
    for (var j=0, m=items.length; j<m; ++j) {
      bounds.union(items[j].bounds);
    }
  }
  if (group.clip || group.width || group.height) {
    boundStroke(
      bounds.add(0, 0).add(group.width || 0, group.height || 0),
      group
    );
  }
  return bounds.translate(group.x || 0, group.y || 0);
}
function backgroundPath(context, group) {
  var offset = group.stroke ? StrokeOffset : 0;
  context.beginPath();
  rectangle(context, group, offset, offset);
}
var hitBackground = hitPath(backgroundPath);
function draw(context, scene, bounds) {
  var renderer = this;
  visit(scene, function(group) {
    var gx = group.x || 0,
        gy = group.y || 0,
        w = group.width || 0,
        h = group.height || 0,
        opacity;
    context.save();
    context.translate(gx, gy);
    if (group.stroke || group.fill) {
      opacity = group.opacity == null ? 1 : group.opacity;
      if (opacity > 0) {
        backgroundPath(context, group);
        if (group.fill && fill(context, group, opacity)) {
          context.fill();
        }
        if (group.stroke && stroke(context, group, opacity)) {
          context.stroke();
        }
      }
    }
    if (group.clip) {
      context.beginPath();
      context.rect(0, 0, w, h);
      context.clip();
    }
    if (bounds) bounds.translate(-gx, -gy);
    visit(group, function(item) {
      renderer.draw(context, item, bounds);
    });
    if (bounds) bounds.translate(gx, gy);
    context.restore();
  });
}
function pick$1(context, scene, x, y, gx, gy) {
  if (scene.bounds && !scene.bounds.contains(gx, gy) || !scene.items) {
    return null;
  }
  var handler = this,
      cx = x * context.pixelRatio,
      cy = y * context.pixelRatio;
  return pickVisit(scene, function(group) {
    var hit, dx, dy, b;
    b = group.bounds;
    if (b && !b.contains(gx, gy)) return;
    dx = (group.x || 0);
    dy = (group.y || 0);
    context.save();
    context.translate(dx, dy);
    dx = gx - dx;
    dy = gy - dy;
    hit = pickVisit(group, function(mark) {
      return pickMark(mark, dx, dy)
        ? handler.pick(mark, x, y, dx, dy)
        : null;
    });
    if (!hit && scene.interactive !== false
        && (group.fill || group.stroke)
        && hitBackground(context, group, cx, cy)) {
      hit = group;
    }
    context.restore();
    return hit || null;
  });
}
function pickMark(mark, x, y) {
  return (mark.interactive !== false || mark.marktype === 'group')
    && mark.bounds && mark.bounds.contains(x, y);
}
var group = {
  type:       'group',
  tag:        'g',
  nested:     false,
  attr:       attr,
  bound:      bound,
  draw:       draw,
  pick:       pick$1,
  background: background,
  foreground: foreground
};

function getImage(item, renderer) {
  var image = item.image;
  if (!image || image.url !== item.url) {
    image = {loaded: false, width: 0, height: 0};
    renderer.loadImage(item.url).then(function(image) {
      item.image = image;
      item.image.url = item.url;
    });
  }
  return image;
}
function imageXOffset(align, w) {
  return align === 'center' ? w / 2 : align === 'right' ? w : 0;
}
function imageYOffset(baseline, h) {
  return baseline === 'middle' ? h / 2 : baseline === 'bottom' ? h : 0;
}
function attr$1(emit, item, renderer) {
  var image = getImage(item, renderer),
      x = item.x || 0,
      y = item.y || 0,
      w = (item.width != null ? item.width : image.width) || 0,
      h = (item.height != null ? item.height : image.height) || 0,
      a = item.aspect === false ? 'none' : 'xMidYMid';
  x -= imageXOffset(item.align, w);
  y -= imageYOffset(item.baseline, h);
  emit('href', image.src || '', 'http://www.w3.org/1999/xlink', 'xlink:href');
  emit('transform', translate(x, y));
  emit('width', w);
  emit('height', h);
  emit('preserveAspectRatio', a);
}
function bound$1(bounds, item) {
  var image = item.image,
      x = item.x || 0,
      y = item.y || 0,
      w = (item.width != null ? item.width : (image && image.width)) || 0,
      h = (item.height != null ? item.height : (image && image.height)) || 0;
  x -= imageXOffset(item.align, w);
  y -= imageYOffset(item.baseline, h);
  return bounds.set(x, y, x + w, y + h);
}
function draw$1(context, scene, bounds) {
  var renderer = this;
  visit(scene, function(item) {
    if (bounds && !bounds.intersects(item.bounds)) return;
    var image = getImage(item, renderer),
        x = item.x || 0,
        y = item.y || 0,
        w = (item.width != null ? item.width : image.width) || 0,
        h = (item.height != null ? item.height : image.height) || 0,
        opacity, ar0, ar1, t;
    x -= imageXOffset(item.align, w);
    y -= imageYOffset(item.baseline, h);
    if (item.aspect !== false) {
      ar0 = image.width / image.height;
      ar1 = item.width / item.height;
      if (ar0 === ar0 && ar1 === ar1 && ar0 !== ar1) {
        if (ar1 < ar0) {
          t = w / ar0;
          y += (h - t) / 2;
          h = t;
        } else {
          t = h * ar0;
          x += (w - t) / 2;
          w = t;
        }
      }
    }
    if (image.loaded) {
      context.globalAlpha = (opacity = item.opacity) != null ? opacity : 1;
      context.drawImage(image, x, y, w, h);
    }
  });
}
var image$1 = {
  type:     'image',
  tag:      'image',
  nested:   false,
  attr:     attr$1,
  bound:    bound$1,
  draw:     draw$1,
  pick:     pick(),
  get:      getImage,
  xOffset:  imageXOffset,
  yOffset:  imageYOffset
};

var line$2 = markMultiItemPath('line', line$1, pickLine);

function attr$2(emit, item) {
  emit('transform', translateItem(item));
  emit('d', item.path);
}
function path$1(context$$1, item) {
  var path$$1 = item.path;
  if (path$$1 == null) return true;
  var cache = item.pathCache;
  if (!cache || cache.path !== path$$1) {
    (item.pathCache = cache = pathParse(path$$1)).path = path$$1;
  }
  pathRender(context$$1, cache, item.x, item.y);
}
function bound$2(bounds, item) {
  return path$1(context(bounds), item)
    ? bounds.set(0, 0, 0, 0)
    : boundStroke(bounds, item);
}
var path$2 = {
  type:   'path',
  tag:    'path',
  nested: false,
  attr:   attr$2,
  bound:  bound$2,
  draw:   drawAll(path$1),
  pick:   pickPath(path$1)
};

function attr$3(emit, item) {
  emit('d', rectangle(null, item));
}
function bound$3(bounds, item) {
  var x, y;
  return boundStroke(bounds.set(
    x = item.x || 0,
    y = item.y || 0,
    (x + item.width) || 0,
    (y + item.height) || 0
  ), item);
}
function draw$2(context, item) {
  context.beginPath();
  rectangle(context, item);
}
var rect = {
  type:   'rect',
  tag:    'path',
  nested: false,
  attr:   attr$3,
  bound:  bound$3,
  draw:   drawAll(draw$2),
  pick:   pickPath(draw$2)
};

function attr$4(emit, item) {
  emit('transform', translateItem(item));
  emit('x2', item.x2 != null ? item.x2 - (item.x||0) : 0);
  emit('y2', item.y2 != null ? item.y2 - (item.y||0) : 0);
}
function bound$4(bounds, item) {
  var x1, y1;
  return boundStroke(bounds.set(
    x1 = item.x || 0,
    y1 = item.y || 0,
    item.x2 != null ? item.x2 : x1,
    item.y2 != null ? item.y2 : y1
  ), item);
}
function path$3(context, item, opacity) {
  var x1, y1, x2, y2;
  if (item.stroke && stroke(context, item, opacity)) {
    x1 = item.x || 0;
    y1 = item.y || 0;
    x2 = item.x2 != null ? item.x2 : x1;
    y2 = item.y2 != null ? item.y2 : y1;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    return true;
  }
  return false;
}
function draw$3(context, scene, bounds) {
  visit(scene, function(item) {
    if (bounds && !bounds.intersects(item.bounds)) return;
    var opacity = item.opacity == null ? 1 : item.opacity;
    if (opacity && path$3(context, item, opacity)) {
      context.stroke();
    }
  });
}
function hit(context, item, x, y) {
  if (!context.isPointInStroke) return false;
  return path$3(context, item, 1) && context.isPointInStroke(x, y);
}
var rule = {
  type:   'rule',
  tag:    'line',
  nested: false,
  attr:   attr$4,
  bound:  bound$4,
  draw:   draw$3,
  pick:   pick(hit)
};

var shape$1 = markItemPath('shape', shape);

var symbol$2 = markItemPath('symbol', symbol$1);

var context$1,
    fontHeight;
var textMetrics = {
  height: height,
  measureWidth: measureWidth,
  estimateWidth: estimateWidth,
  width: estimateWidth,
  canvas: useCanvas
};
useCanvas(true);
function estimateWidth(item) {
  fontHeight = height(item);
  return estimate(textValue(item));
}
function estimate(text) {
  return ~~(0.8 * text.length * fontHeight);
}
function measureWidth(item) {
  context$1.font = font(item);
  return measure$1(textValue(item));
}
function measure$1(text) {
  return context$1.measureText(text).width;
}
function height(item) {
  return item.fontSize != null ? item.fontSize : 11;
}
function useCanvas(use) {
  context$1 = use && (context$1 = canvas(1,1)) ? context$1.getContext('2d') : null;
  textMetrics.width = context$1 ? measureWidth : estimateWidth;
}
function textValue(item) {
  var s = item.text;
  if (s == null) {
    return '';
  } else {
    return item.limit > 0 ? truncate$1(item) : s + '';
  }
}
function truncate$1(item) {
  var limit = +item.limit,
      text = item.text + '',
      width;
  if (context$1) {
    context$1.font = font(item);
    width = measure$1;
  } else {
    fontHeight = height(item);
    width = estimate;
  }
  if (width(text) < limit) return text;
  var ellipsis = item.ellipsis || '\u2026',
      rtl = item.dir === 'rtl',
      lo = 0,
      hi = text.length, mid;
  limit -= width(ellipsis);
  if (rtl) {
    while (lo < hi) {
      mid = (lo + hi >>> 1);
      if (width(text.slice(mid)) > limit) lo = mid + 1;
      else hi = mid;
    }
    return ellipsis + text.slice(lo);
  } else {
    while (lo < hi) {
      mid = 1 + (lo + hi >>> 1);
      if (width(text.slice(0, mid)) < limit) lo = mid;
      else hi = mid - 1;
    }
    return text.slice(0, lo) + ellipsis;
  }
}
function font(item, quote) {
  var font = item.font;
  if (quote && font) {
    font = String(font).replace(/"/g, '\'');
  }
  return '' +
    (item.fontStyle ? item.fontStyle + ' ' : '') +
    (item.fontVariant ? item.fontVariant + ' ' : '') +
    (item.fontWeight ? item.fontWeight + ' ' : '') +
    height(item) + 'px ' +
    (font || 'sans-serif');
}
function offset(item) {
  var baseline = item.baseline,
      h = height(item);
  return Math.round(
    baseline === 'top'    ?  0.79*h :
    baseline === 'middle' ?  0.30*h :
    baseline === 'bottom' ? -0.21*h : 0
  );
}

var textAlign = {
  'left':   'start',
  'center': 'middle',
  'right':  'end'
};
var tempBounds = new Bounds();
function attr$5(emit, item) {
  var dx = item.dx || 0,
      dy = (item.dy || 0) + offset(item),
      x = item.x || 0,
      y = item.y || 0,
      a = item.angle || 0,
      r = item.radius || 0, t;
  if (r) {
    t = (item.theta || 0) - Math.PI/2;
    x += r * Math.cos(t);
    y += r * Math.sin(t);
  }
  emit('text-anchor', textAlign[item.align] || 'start');
  if (a) {
    t = translate(x, y) + ' rotate('+a+')';
    if (dx || dy) t += ' ' + translate(dx, dy);
  } else {
    t = translate(x + dx, y + dy);
  }
  emit('transform', t);
}
function bound$5(bounds, item, noRotate) {
  var h = textMetrics.height(item),
      a = item.align,
      r = item.radius || 0,
      x = item.x || 0,
      y = item.y || 0,
      dx = item.dx || 0,
      dy = (item.dy || 0) + offset(item) - Math.round(0.8*h),
      w, t;
  if (r) {
    t = (item.theta || 0) - Math.PI/2;
    x += r * Math.cos(t);
    y += r * Math.sin(t);
  }
  w = textMetrics.width(item);
  if (a === 'center') {
    dx -= (w / 2);
  } else if (a === 'right') {
    dx -= w;
  }
  bounds.set(dx+=x, dy+=y, dx+w, dy+h);
  if (item.angle && !noRotate) {
    bounds.rotate(item.angle*Math.PI/180, x, y);
  }
  return bounds.expand(noRotate || !w ? 0 : 1);
}
function draw$4(context, scene, bounds) {
  visit(scene, function(item) {
    var opacity, x, y, r, t, str;
    if (bounds && !bounds.intersects(item.bounds)) return;
    if (!(str = textValue(item))) return;
    opacity = item.opacity == null ? 1 : item.opacity;
    if (opacity === 0) return;
    context.font = font(item);
    context.textAlign = item.align || 'left';
    x = item.x || 0;
    y = item.y || 0;
    if ((r = item.radius)) {
      t = (item.theta || 0) - Math.PI/2;
      x += r * Math.cos(t);
      y += r * Math.sin(t);
    }
    if (item.angle) {
      context.save();
      context.translate(x, y);
      context.rotate(item.angle * Math.PI/180);
      x = y = 0;
    }
    x += (item.dx || 0);
    y += (item.dy || 0) + offset(item);
    if (item.fill && fill(context, item, opacity)) {
      context.fillText(str, x, y);
    }
    if (item.stroke && stroke(context, item, opacity)) {
      context.strokeText(str, x, y);
    }
    if (item.angle) context.restore();
  });
}
function hit$1(context, item, x, y, gx, gy) {
  if (item.fontSize <= 0) return false;
  if (!item.angle) return true;
  var b = bound$5(tempBounds, item, true),
      a = -item.angle * Math.PI / 180,
      cos = Math.cos(a),
      sin = Math.sin(a),
      ix = item.x,
      iy = item.y,
      px = cos*gx - sin*gy + (ix - ix*cos + iy*sin),
      py = sin*gx + cos*gy + (iy - ix*sin - iy*cos);
  return b.contains(px, py);
}
var text = {
  type:   'text',
  tag:    'text',
  nested: false,
  attr:   attr$5,
  bound:  bound$5,
  draw:   draw$4,
  pick:   pick(hit$1)
};

var trail$1 = markMultiItemPath('trail', trail, pickTrail);

var marks = {
  arc:     arc$2,
  area:    area$2,
  group:   group,
  image:   image$1,
  line:    line$2,
  path:    path$2,
  rect:    rect,
  rule:    rule,
  shape:   shape$1,
  symbol:  symbol$2,
  text:    text,
  trail:   trail$1
};

function boundItem(item, func, opt) {
  var type = marks[item.mark.marktype],
      bound = func || type.bound;
  if (type.nested) item = item.mark;
  return bound(item.bounds || (item.bounds = new Bounds()), item, opt);
}

var DUMMY = {mark: null};
function boundMark(mark, bounds, opt) {
  var type  = marks[mark.marktype],
      bound = type.bound,
      items = mark.items,
      hasItems = items && items.length,
      i, n, item, b;
  if (type.nested) {
    if (hasItems) {
      item = items[0];
    } else {
      DUMMY.mark = mark;
      item = DUMMY;
    }
    b = boundItem(item, bound, opt);
    bounds = bounds && bounds.union(b) || b;
    return bounds;
  }
  bounds = bounds
    || mark.bounds && mark.bounds.clear()
    || new Bounds();
  if (hasItems) {
    for (i=0, n=items.length; i<n; ++i) {
      bounds.union(boundItem(items[i], bound, opt));
    }
  }
  return mark.bounds = bounds;
}

var keys = [
  'marktype', 'name', 'role', 'interactive', 'clip', 'items', 'zindex',
  'x', 'y', 'width', 'height', 'align', 'baseline',
  'fill', 'fillOpacity', 'opacity',
  'stroke', 'strokeOpacity', 'strokeWidth', 'strokeCap',
  'strokeDash', 'strokeDashOffset',
  'startAngle', 'endAngle', 'innerRadius', 'outerRadius',
  'cornerRadius', 'padAngle',
  'interpolate', 'tension', 'orient', 'defined',
  'url',
  'path',
  'x2', 'y2',
  'size', 'shape',
  'text', 'angle', 'theta', 'radius', 'dx', 'dy',
  'font', 'fontSize', 'fontWeight', 'fontStyle', 'fontVariant'
];
function sceneToJSON(scene, indent) {
  return JSON.stringify(scene, keys, indent);
}
function sceneFromJSON(json) {
  var scene = (typeof json === 'string' ? JSON.parse(json) : json);
  return initialize(scene);
}
function initialize(scene) {
  var type = scene.marktype,
      items = scene.items,
      parent, i, n;
  if (items) {
    for (i=0, n=items.length; i<n; ++i) {
      parent = type ? 'mark' : 'group';
      items[i][parent] = scene;
      if (items[i].zindex) items[i][parent].zdirty = true;
      if ('group' === (type || parent)) initialize(items[i]);
    }
  }
  if (type) boundMark(scene);
  return scene;
}

function Scenegraph(scene) {
  if (arguments.length) {
    this.root = sceneFromJSON(scene);
  } else {
    this.root = createMark({
      marktype: 'group',
      name: 'root',
      role: 'frame'
    });
    this.root.items = [new GroupItem(this.root)];
  }
}
var prototype$E = Scenegraph.prototype;
prototype$E.toJSON = function(indent) {
  return sceneToJSON(this.root, indent || 0);
};
prototype$E.mark = function(markdef, group, index) {
  group = group || this.root.items[0];
  var mark = createMark(markdef, group);
  group.items[index] = mark;
  if (mark.zindex) mark.group.zdirty = true;
  return mark;
};
function createMark(def, group) {
  return {
    bounds:      new Bounds(),
    clip:        !!def.clip,
    group:       group,
    interactive: def.interactive === false ? false : true,
    items:       [],
    marktype:    def.marktype,
    name:        def.name || undefined,
    role:        def.role || undefined,
    zindex:      def.zindex || 0
  };
}

function domCreate(doc, tag, ns) {
  if (!doc && typeof document !== 'undefined' && document.createElement) {
    doc = document;
  }
  return doc
    ? (ns ? doc.createElementNS(ns, tag) : doc.createElement(tag))
    : null;
}
function domFind(el, tag) {
  tag = tag.toLowerCase();
  var nodes = el.childNodes, i = 0, n = nodes.length;
  for (; i<n; ++i) if (nodes[i].tagName.toLowerCase() === tag) {
    return nodes[i];
  }
}
function domChild(el, index, tag, ns) {
  var a = el.childNodes[index], b;
  if (!a || a.tagName.toLowerCase() !== tag.toLowerCase()) {
    b = a || null;
    a = domCreate(el.ownerDocument, tag, ns);
    el.insertBefore(a, b);
  }
  return a;
}
function domClear(el, index) {
  var nodes = el.childNodes,
      curr = nodes.length;
  while (curr > index) el.removeChild(nodes[--curr]);
  return el;
}
function cssClass(mark) {
  return 'mark-' + mark.marktype
    + (mark.role ? ' role-' + mark.role : '')
    + (mark.name ? ' ' + mark.name : '');
}

function point(event, el) {
  var rect = el.getBoundingClientRect();
  return [
    event.clientX - rect.left - (el.clientLeft || 0),
    event.clientY - rect.top - (el.clientTop || 0)
  ];
}

function resolveItem(item, event, el, origin) {
  var mark = item && item.mark,
      mdef, p;
  if (mark && (mdef = marks[mark.marktype]).tip) {
    p = point(event, el);
    p[0] -= origin[0];
    p[1] -= origin[1];
    while (item = item.mark.group) {
      p[0] -= item.x || 0;
      p[1] -= item.y || 0;
    }
    item = mdef.tip(mark.items, p);
  }
  return item;
}

function Handler(customLoader, customTooltip) {
  this._active = null;
  this._handlers = {};
  this._loader = customLoader || loader();
  this._tooltip = customTooltip || defaultTooltip;
}
function defaultTooltip(handler, event, item, value) {
  handler.element().setAttribute('title', value || '');
}
var prototype$F = Handler.prototype;
prototype$F.initialize = function(el, origin, obj) {
  this._el = el;
  this._obj = obj || null;
  return this.origin(origin);
};
prototype$F.element = function() {
  return this._el;
};
prototype$F.canvas = function() {
  return this._el && this._el.firstChild;
};
prototype$F.origin = function(origin) {
  if (arguments.length) {
    this._origin = origin || [0, 0];
    return this;
  } else {
    return this._origin.slice();
  }
};
prototype$F.scene = function(scene) {
  if (!arguments.length) return this._scene;
  this._scene = scene;
  return this;
};
prototype$F.on = function(                 ) {};
prototype$F.off = function(                 ) {};
prototype$F._handlerIndex = function(h, type, handler) {
  for (var i = h ? h.length : 0; --i>=0;) {
    if (h[i].type === type && !handler || h[i].handler === handler) {
      return i;
    }
  }
  return -1;
};
prototype$F.handlers = function() {
  var h = this._handlers, a = [], k;
  for (k in h) { a.push.apply(a, h[k]); }
  return a;
};
prototype$F.eventName = function(name) {
  var i = name.indexOf('.');
  return i < 0 ? name : name.slice(0,i);
};
prototype$F.handleHref = function(event, item, href) {
  this._loader
    .sanitize(href, {context:'href'})
    .then(function(opt) {
      var e = new MouseEvent(event.type, event),
          a = domCreate(null, 'a');
      for (var name in opt) a.setAttribute(name, opt[name]);
      a.dispatchEvent(e);
    })
    .catch(function() {                  });
};
prototype$F.handleTooltip = function(event, item, show) {
  if (item && item.tooltip != null) {
    item = resolveItem(item, event, this.canvas(), this._origin);
    var value = (show && item && item.tooltip) || null;
    this._tooltip.call(this._obj, this, event, item, value);
  }
};
prototype$F.getItemBoundingClientRect = function(item) {
  if (!(el = this.canvas())) return;
  var el, rect = el.getBoundingClientRect(),
      origin = this._origin,
      itemBounds = item.bounds,
      x = itemBounds.x1 + origin[0] + rect.left,
      y = itemBounds.y1 + origin[1] + rect.top,
      w = itemBounds.width(),
      h = itemBounds.height();
  while (item.mark && (item = item.mark.group)) {
    x += item.x || 0;
    y += item.y || 0;
  }
  return {
    x:      x,
    y:      y,
    width:  w,
    height: h,
    left:   x,
    top:    y,
    right:  x + w,
    bottom: y + h
  };
};

function Renderer(loader) {
  this._el = null;
  this._bgcolor = null;
  this._loader = new ResourceLoader(loader);
}
var prototype$G = Renderer.prototype;
prototype$G.initialize = function(el, width, height, origin, scaleFactor) {
  this._el = el;
  return this.resize(width, height, origin, scaleFactor);
};
prototype$G.element = function() {
  return this._el;
};
prototype$G.canvas = function() {
  return this._el && this._el.firstChild;
};
prototype$G.scene = function() {
  return this.canvas();
};
prototype$G.background = function(bgcolor) {
  if (arguments.length === 0) return this._bgcolor;
  this._bgcolor = bgcolor;
  return this;
};
prototype$G.resize = function(width, height, origin, scaleFactor) {
  this._width = width;
  this._height = height;
  this._origin = origin || [0, 0];
  this._scale = scaleFactor || 1;
  return this;
};
prototype$G.dirty = function(        ) {
};
prototype$G.render = function(scene) {
  var r = this;
  r._call = function() { r._render(scene); };
  r._call();
  r._call = null;
  return r;
};
prototype$G._render = function(         ) {
};
prototype$G.renderAsync = function(scene) {
  var r = this.render(scene);
  return this._ready
    ? this._ready.then(function() { return r; })
    : Promise.resolve(r);
};
prototype$G._load = function(method, uri) {
  var r = this,
      p = r._loader[method](uri);
  if (!r._ready) {
    var call = r._call;
    r._ready = r._loader.ready()
      .then(function(redraw) {
        if (redraw) call();
        r._ready = null;
      });
  }
  return p;
};
prototype$G.sanitizeURL = function(uri) {
  return this._load('sanitizeURL', uri);
};
prototype$G.loadImage = function(uri) {
  return this._load('loadImage', uri);
};

var Events = [
  'keydown',
  'keypress',
  'keyup',
  'dragenter',
  'dragleave',
  'dragover',
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseout',
  'mouseover',
  'click',
  'dblclick',
  'wheel',
  'mousewheel',
  'touchstart',
  'touchmove',
  'touchend'
];
var TooltipShowEvent = 'mousemove';
var TooltipHideEvent = 'mouseout';
var HrefEvent = 'click';

function CanvasHandler(loader, tooltip) {
  Handler.call(this, loader, tooltip);
  this._down = null;
  this._touch = null;
  this._first = true;
}
var prototype$H = inherits(CanvasHandler, Handler);
prototype$H.initialize = function(el, origin, obj) {
  var canvas = this._canvas = el && domFind(el, 'canvas');
  if (canvas) {
    var that = this;
    this.events.forEach(function(type) {
      canvas.addEventListener(type, function(evt) {
        if (prototype$H[type]) {
          prototype$H[type].call(that, evt);
        } else {
          that.fire(type, evt);
        }
      });
    });
  }
  return Handler.prototype.initialize.call(this, el, origin, obj);
};
prototype$H.canvas = function() {
  return this._canvas;
};
prototype$H.context = function() {
  return this._canvas.getContext('2d');
};
prototype$H.events = Events;
prototype$H.DOMMouseScroll = function(evt) {
  this.fire('mousewheel', evt);
};
function move(moveEvent, overEvent, outEvent) {
  return function(evt) {
    var a = this._active,
        p = this.pickEvent(evt);
    if (p === a) {
      this.fire(moveEvent, evt);
    } else {
      if (!a || !a.exit) {
        this.fire(outEvent, evt);
      }
      this._active = p;
      this.fire(overEvent, evt);
      this.fire(moveEvent, evt);
    }
  };
}
function inactive(type) {
  return function(evt) {
    this.fire(type, evt);
    this._active = null;
  };
}
prototype$H.mousemove = move('mousemove', 'mouseover', 'mouseout');
prototype$H.dragover  = move('dragover', 'dragenter', 'dragleave');
prototype$H.mouseout  = inactive('mouseout');
prototype$H.dragleave = inactive('dragleave');
prototype$H.mousedown = function(evt) {
  this._down = this._active;
  this.fire('mousedown', evt);
};
prototype$H.click = function(evt) {
  if (this._down === this._active) {
    this.fire('click', evt);
    this._down = null;
  }
};
prototype$H.touchstart = function(evt) {
  this._touch = this.pickEvent(evt.changedTouches[0]);
  if (this._first) {
    this._active = this._touch;
    this._first = false;
  }
  this.fire('touchstart', evt, true);
};
prototype$H.touchmove = function(evt) {
  this.fire('touchmove', evt, true);
};
prototype$H.touchend = function(evt) {
  this.fire('touchend', evt, true);
  this._touch = null;
};
prototype$H.fire = function(type, evt, touch) {
  var a = touch ? this._touch : this._active,
      h = this._handlers[type], i, len;
  evt.vegaType = type;
  if (type === HrefEvent && a && a.href) {
    this.handleHref(evt, a, a.href);
  } else if (type === TooltipShowEvent || type === TooltipHideEvent) {
    this.handleTooltip(evt, a, type !== TooltipHideEvent);
  }
  if (h) {
    for (i=0, len=h.length; i<len; ++i) {
      h[i].handler.call(this._obj, evt, a);
    }
  }
};
prototype$H.on = function(type, handler) {
  var name = this.eventName(type),
      h = this._handlers,
      i = this._handlerIndex(h[name], type, handler);
  if (i < 0) {
    (h[name] || (h[name] = [])).push({
      type:    type,
      handler: handler
    });
  }
  return this;
};
prototype$H.off = function(type, handler) {
  var name = this.eventName(type),
      h = this._handlers[name],
      i = this._handlerIndex(h, type, handler);
  if (i >= 0) {
    h.splice(i, 1);
  }
  return this;
};
prototype$H.pickEvent = function(evt) {
  var p = point(evt, this._canvas),
      o = this._origin;
  return this.pick(this._scene, p[0], p[1], p[0] - o[0], p[1] - o[1]);
};
prototype$H.pick = function(scene, x, y, gx, gy) {
  var g = this.context(),
      mark = marks[scene.marktype];
  return mark.pick.call(this, g, scene, x, y, gx, gy);
};

function clip$1(context, scene) {
  var clip = scene.clip;
  context.save();
  context.beginPath();
  if (isFunction(clip)) {
    clip(context);
  } else {
    var group = scene.group;
    context.rect(0, 0, group.width || 0, group.height || 0);
  }
  context.clip();
}

function devicePixelRatio() {
  return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
}
var pixelRatio = devicePixelRatio();
function resize(canvas, width, height, origin, scaleFactor) {
  var inDOM = typeof HTMLElement !== 'undefined'
    && canvas instanceof HTMLElement
    && canvas.parentNode != null;
  var context = canvas.getContext('2d'),
      ratio = inDOM ? pixelRatio : scaleFactor;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  if (inDOM && ratio !== 1) {
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }
  context.pixelRatio = ratio;
  context.setTransform(
    ratio, 0, 0, ratio,
    ratio * origin[0],
    ratio * origin[1]
  );
  return canvas;
}

function CanvasRenderer(loader) {
  Renderer.call(this, loader);
  this._redraw = false;
  this._dirty = new Bounds();
}
var prototype$I = inherits(CanvasRenderer, Renderer),
    base = Renderer.prototype,
    tempBounds$1 = new Bounds();
prototype$I.initialize = function(el, width, height, origin, scaleFactor) {
  this._canvas = canvas(1, 1);
  if (el) {
    domClear(el, 0).appendChild(this._canvas);
    this._canvas.setAttribute('class', 'marks');
  }
  return base.initialize.call(this, el, width, height, origin, scaleFactor);
};
prototype$I.resize = function(width, height, origin, scaleFactor) {
  base.resize.call(this, width, height, origin, scaleFactor);
  resize(this._canvas, this._width, this._height, this._origin, this._scale);
  this._redraw = true;
  return this;
};
prototype$I.canvas = function() {
  return this._canvas;
};
prototype$I.context = function() {
  return this._canvas ? this._canvas.getContext('2d') : null;
};
prototype$I.dirty = function(item) {
  var b = translate$1(item.bounds, item.mark.group);
  this._dirty.union(b);
};
function clipToBounds(g, b, origin) {
  b.expand(1).round();
  b.translate(-(origin[0] % 1), -(origin[1] % 1));
  g.beginPath();
  g.rect(b.x1, b.y1, b.width(), b.height());
  g.clip();
  return b;
}
function translate$1(bounds, group) {
  if (group == null) return bounds;
  var b = tempBounds$1.clear().union(bounds);
  for (; group != null; group = group.mark.group) {
    b.translate(group.x || 0, group.y || 0);
  }
  return b;
}
prototype$I._render = function(scene) {
  var g = this.context(),
      o = this._origin,
      w = this._width,
      h = this._height,
      b = this._dirty;
  g.save();
  if (this._redraw || b.empty()) {
    this._redraw = false;
    b = null;
  } else {
    b = clipToBounds(g, b, o);
  }
  this.clear(-o[0], -o[1], w, h);
  this.draw(g, scene, b);
  g.restore();
  this._dirty.clear();
  return this;
};
prototype$I.draw = function(ctx, scene, bounds) {
  var mark = marks[scene.marktype];
  if (scene.clip) clip$1(ctx, scene);
  mark.draw.call(this, ctx, scene, bounds);
  if (scene.clip) ctx.restore();
};
prototype$I.clear = function(x, y, w, h) {
  var g = this.context();
  g.clearRect(x, y, w, h);
  if (this._bgcolor != null) {
    g.fillStyle = this._bgcolor;
    g.fillRect(x, y, w, h);
  }
};

function SVGHandler(loader, tooltip) {
  Handler.call(this, loader, tooltip);
  var h = this;
  h._hrefHandler = listener(h, function(evt, item) {
    if (item && item.href) h.handleHref(evt, item, item.href);
  });
  h._tooltipHandler = listener(h, function(evt, item) {
    h.handleTooltip(evt, item, evt.type !== TooltipHideEvent);
  });
}
var prototype$J = inherits(SVGHandler, Handler);
prototype$J.initialize = function(el, origin, obj) {
  var svg = this._svg;
  if (svg) {
    svg.removeEventListener(HrefEvent, this._hrefHandler);
    svg.removeEventListener(TooltipShowEvent, this._tooltipHandler);
    svg.removeEventListener(TooltipHideEvent, this._tooltipHandler);
  }
  this._svg = svg = el && domFind(el, 'svg');
  if (svg) {
    svg.addEventListener(HrefEvent, this._hrefHandler);
    svg.addEventListener(TooltipShowEvent, this._tooltipHandler);
    svg.addEventListener(TooltipHideEvent, this._tooltipHandler);
  }
  return Handler.prototype.initialize.call(this, el, origin, obj);
};
prototype$J.canvas = function() {
  return this._svg;
};
function listener(context, handler) {
  return function(evt) {
    var target = evt.target,
        item = target.__data__;
    evt.vegaType = evt.type;
    item = Array.isArray(item) ? item[0] : item;
    handler.call(context._obj, evt, item);
  };
}
prototype$J.on = function(type, handler) {
  var name = this.eventName(type),
      h = this._handlers,
      i = this._handlerIndex(h[name], type, handler);
  if (i < 0) {
    var x = {
      type:     type,
      handler:  handler,
      listener: listener(this, handler)
    };
    (h[name] || (h[name] = [])).push(x);
    if (this._svg) {
      this._svg.addEventListener(name, x.listener);
    }
  }
  return this;
};
prototype$J.off = function(type, handler) {
  var name = this.eventName(type),
      h = this._handlers[name],
      i = this._handlerIndex(h, type, handler);
  if (i >= 0) {
    if (this._svg) {
      this._svg.removeEventListener(name, h[i].listener);
    }
    h.splice(i, 1);
  }
  return this;
};

function openTag(tag, attr, raw) {
  var s = '<' + tag, key, val;
  if (attr) {
    for (key in attr) {
      val = attr[key];
      if (val != null) {
        s += ' ' + key + '="' + val + '"';
      }
    }
  }
  if (raw) s += ' ' + raw;
  return s + '>';
}
function closeTag(tag) {
  return '</' + tag + '>';
}

var metadata = {
  'version': '1.1',
  'xmlns': 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink'
};

var styles = {
  'fill':             'fill',
  'fillOpacity':      'fill-opacity',
  'stroke':           'stroke',
  'strokeOpacity':    'stroke-opacity',
  'strokeWidth':      'stroke-width',
  'strokeCap':        'stroke-linecap',
  'strokeJoin':       'stroke-linejoin',
  'strokeDash':       'stroke-dasharray',
  'strokeDashOffset': 'stroke-dashoffset',
  'strokeMiterLimit': 'stroke-miterlimit',
  'opacity':          'opacity'
};
var styleProperties = Object.keys(styles);

var ns = metadata.xmlns;
function SVGRenderer(loader) {
  Renderer.call(this, loader);
  this._dirtyID = 1;
  this._dirty = [];
  this._svg = null;
  this._root = null;
  this._defs = null;
}
var prototype$K = inherits(SVGRenderer, Renderer);
var base$1 = Renderer.prototype;
prototype$K.initialize = function(el, width, height, padding) {
  if (el) {
    this._svg = domChild(el, 0, 'svg', ns);
    this._svg.setAttribute('class', 'marks');
    domClear(el, 1);
    this._root = domChild(this._svg, 0, 'g', ns);
    domClear(this._svg, 1);
  }
  this._defs = {
    gradient: {},
    clipping: {}
  };
  this.background(this._bgcolor);
  return base$1.initialize.call(this, el, width, height, padding);
};
prototype$K.background = function(bgcolor) {
  if (arguments.length && this._svg) {
    this._svg.style.setProperty('background-color', bgcolor);
  }
  return base$1.background.apply(this, arguments);
};
prototype$K.resize = function(width, height, origin, scaleFactor) {
  base$1.resize.call(this, width, height, origin, scaleFactor);
  if (this._svg) {
    this._svg.setAttribute('width', this._width * this._scale);
    this._svg.setAttribute('height', this._height * this._scale);
    this._svg.setAttribute('viewBox', '0 0 ' + this._width + ' ' + this._height);
    this._root.setAttribute('transform', 'translate(' + this._origin + ')');
  }
  this._dirty = [];
  return this;
};
prototype$K.canvas = function() {
  return this._svg;
};
prototype$K.svg = function() {
  if (!this._svg) return null;
  var attr = {
    class:   'marks',
    width:   this._width * this._scale,
    height:  this._height * this._scale,
    viewBox: '0 0 ' + this._width + ' ' + this._height
  };
  for (var key$$1 in metadata) {
    attr[key$$1] = metadata[key$$1];
  }
  var bg = !this._bgcolor ? ''
    : (openTag('rect', {
        width:  this._width,
        height: this._height,
        style:  'fill: ' + this._bgcolor + ';'
      }) + closeTag('rect'));
  return openTag('svg', attr) + bg + this._svg.innerHTML + closeTag('svg');
};
prototype$K._render = function(scene) {
  if (this._dirtyCheck()) {
    if (this._dirtyAll) this._resetDefs();
    this.draw(this._root, scene);
    domClear(this._root, 1);
  }
  this.updateDefs();
  this._dirty = [];
  ++this._dirtyID;
  return this;
};
prototype$K.updateDefs = function() {
  var svg = this._svg,
      defs = this._defs,
      el = defs.el,
      index = 0, id$$1;
  for (id$$1 in defs.gradient) {
    if (!el) defs.el = (el = domChild(svg, 0, 'defs', ns));
    updateGradient(el, defs.gradient[id$$1], index++);
  }
  for (id$$1 in defs.clipping) {
    if (!el) defs.el = (el = domChild(svg, 0, 'defs', ns));
    updateClipping(el, defs.clipping[id$$1], index++);
  }
  if (el) {
    if (index === 0) {
      svg.removeChild(el);
      defs.el = null;
    } else {
      domClear(el, index);
    }
  }
};
function updateGradient(el, grad, index) {
  var i, n, stop;
  el = domChild(el, index, 'linearGradient', ns);
  el.setAttribute('id', grad.id);
  el.setAttribute('x1', grad.x1);
  el.setAttribute('x2', grad.x2);
  el.setAttribute('y1', grad.y1);
  el.setAttribute('y2', grad.y2);
  for (i=0, n=grad.stops.length; i<n; ++i) {
    stop = domChild(el, i, 'stop', ns);
    stop.setAttribute('offset', grad.stops[i].offset);
    stop.setAttribute('stop-color', grad.stops[i].color);
  }
  domClear(el, i);
}
function updateClipping(el, clip$$1, index) {
  var mask;
  el = domChild(el, index, 'clipPath', ns);
  el.setAttribute('id', clip$$1.id);
  if (clip$$1.path) {
    mask = domChild(el, 0, 'path', ns);
    mask.setAttribute('d', clip$$1.path);
  } else {
    mask = domChild(el, 0, 'rect', ns);
    mask.setAttribute('x', 0);
    mask.setAttribute('y', 0);
    mask.setAttribute('width', clip$$1.width);
    mask.setAttribute('height', clip$$1.height);
  }
}
prototype$K._resetDefs = function() {
  var def = this._defs;
  def.gradient = {};
  def.clipping = {};
};
prototype$K.dirty = function(item) {
  if (item.dirty !== this._dirtyID) {
    item.dirty = this._dirtyID;
    this._dirty.push(item);
  }
};
prototype$K.isDirty = function(item) {
  return this._dirtyAll
    || !item._svg
    || item.dirty === this._dirtyID;
};
prototype$K._dirtyCheck = function() {
  this._dirtyAll = true;
  var items = this._dirty;
  if (!items.length) return true;
  var id$$1 = ++this._dirtyID,
      item, mark, type, mdef, i, n, o;
  for (i=0, n=items.length; i<n; ++i) {
    item = items[i];
    mark = item.mark;
    if (mark.marktype !== type) {
      type = mark.marktype;
      mdef = marks[type];
    }
    if (mark.zdirty && mark.dirty !== id$$1) {
      this._dirtyAll = false;
      dirtyParents(item, id$$1);
      mark.items.forEach(function(i) { i.dirty = id$$1; });
    }
    if (mark.zdirty) continue;
    if (item.exit) {
      if (mdef.nested && mark.items.length) {
        o = mark.items[0];
        if (o._svg) this._update(mdef, o._svg, o);
      } else if (item._svg) {
        o = item._svg.parentNode;
        if (o) o.removeChild(item._svg);
      }
      item._svg = null;
      continue;
    }
    item = (mdef.nested ? mark.items[0] : item);
    if (item._update === id$$1) continue;
    if (!item._svg || !item._svg.ownerSVGElement) {
      this._dirtyAll = false;
      dirtyParents(item, id$$1);
    } else {
      this._update(mdef, item._svg, item);
    }
    item._update = id$$1;
  }
  return !this._dirtyAll;
};
function dirtyParents(item, id$$1) {
  for (; item && item.dirty !== id$$1; item=item.mark.group) {
    item.dirty = id$$1;
    if (item.mark && item.mark.dirty !== id$$1) {
      item.mark.dirty = id$$1;
    } else return;
  }
}
prototype$K.draw = function(el, scene, prev) {
  if (!this.isDirty(scene)) return scene._svg;
  var renderer = this,
      svg = this._svg,
      mdef = marks[scene.marktype],
      events = scene.interactive === false ? 'none' : null,
      isGroup = mdef.tag === 'g',
      sibling = null,
      i = 0,
      parent;
  parent = bind(scene, el, prev, 'g', svg);
  parent.setAttribute('class', cssClass(scene));
  if (!isGroup) {
    parent.style.setProperty('pointer-events', events);
  }
  if (scene.clip) {
    parent.setAttribute('clip-path', clip(renderer, scene, scene.group));
  } else {
    parent.removeAttribute('clip-path');
  }
  function process(item) {
    var dirty = renderer.isDirty(item),
        node = bind(item, parent, sibling, mdef.tag, svg);
    if (dirty) {
      renderer._update(mdef, node, item);
      if (isGroup) recurse(renderer, node, item);
    }
    sibling = node;
    ++i;
  }
  if (mdef.nested) {
    if (scene.items.length) process(scene.items[0]);
  } else {
    visit(scene, process);
  }
  domClear(parent, i);
  return parent;
};
function recurse(renderer, el, group) {
  el = el.lastChild;
  var prev, idx = 0;
  visit(group, function(item) {
    prev = renderer.draw(el, item, prev);
    ++idx;
  });
  domClear(el, 1 + idx);
}
function bind(item, el, sibling, tag, svg) {
  var node = item._svg, doc;
  if (!node) {
    doc = el.ownerDocument;
    node = domCreate(doc, tag, ns);
    item._svg = node;
    if (item.mark) {
      node.__data__ = item;
      node.__values__ = {fill: 'default'};
      if (tag === 'g') {
        var bg = domCreate(doc, 'path', ns);
        bg.setAttribute('class', 'background');
        node.appendChild(bg);
        bg.__data__ = item;
        var fg = domCreate(doc, 'g', ns);
        node.appendChild(fg);
        fg.__data__ = item;
      }
    }
  }
  if (node.ownerSVGElement !== svg || hasSiblings(item) && node.previousSibling !== sibling) {
    el.insertBefore(node, sibling ? sibling.nextSibling : el.firstChild);
  }
  return node;
}
function hasSiblings(item) {
  var parent = item.mark || item.group;
  return parent && parent.items.length > 1;
}
var element = null,
    values = null;
var mark_extras = {
  group: function(mdef, el, item) {
    values = el.__values__;
    element = el.childNodes[1];
    mdef.foreground(emit, item, this);
    element = el.childNodes[0];
    mdef.background(emit, item, this);
    var value = item.mark.interactive === false ? 'none' : null;
    if (value !== values.events) {
      element.style.setProperty('pointer-events', value);
      values.events = value;
    }
  },
  text: function(mdef, el, item) {
    var str = textValue(item);
    if (str !== values.text) {
      el.textContent = str;
      values.text = str;
    }
    str = font(item);
    if (str !== values.font) {
      el.style.setProperty('font', str);
      values.font = str;
    }
  }
};
prototype$K._update = function(mdef, el, item) {
  element = el;
  values = el.__values__;
  mdef.attr(emit, item, this);
  var extra = mark_extras[mdef.type];
  if (extra) extra.call(this, mdef, el, item);
  this.style(element, item);
};
function emit(name, value, ns) {
  if (value === values[name]) return;
  if (value != null) {
    if (ns) {
      element.setAttributeNS(ns, name, value);
    } else {
      element.setAttribute(name, value);
    }
  } else {
    if (ns) {
      element.removeAttributeNS(ns, name);
    } else {
      element.removeAttribute(name);
    }
  }
  values[name] = value;
}
prototype$K.style = function(el, o) {
  if (o == null) return;
  var i, n, prop, name, value;
  for (i=0, n=styleProperties.length; i<n; ++i) {
    prop = styleProperties[i];
    value = o[prop];
    if (value === values[prop]) continue;
    name = styles[prop];
    if (value == null) {
      if (name === 'fill') {
        el.style.setProperty(name, 'none');
      } else {
        el.style.removeProperty(name);
      }
    } else {
      if (value.id) {
        this._defs.gradient[value.id] = value;
        value = 'url(' + href() + '#' + value.id + ')';
      }
      el.style.setProperty(name, value+'');
    }
    values[prop] = value;
  }
};
function href() {
  var loc;
  return typeof window === 'undefined' ? ''
    : (loc = window.location).hash ? loc.href.slice(0, -loc.hash.length)
    : loc.href;
}

function SVGStringRenderer(loader) {
  Renderer.call(this, loader);
  this._text = {
    head: '',
    bg:   '',
    root: '',
    foot: '',
    defs: '',
    body: ''
  };
  this._defs = {
    gradient: {},
    clipping: {}
  };
}
var prototype$L = inherits(SVGStringRenderer, Renderer);
var base$2 = Renderer.prototype;
prototype$L.resize = function(width, height, origin, scaleFactor) {
  base$2.resize.call(this, width, height, origin, scaleFactor);
  var o = this._origin,
      t = this._text;
  var attr = {
    class:   'marks',
    width:   this._width * this._scale,
    height:  this._height * this._scale,
    viewBox: '0 0 ' + this._width + ' ' + this._height
  };
  for (var key$$1 in metadata) {
    attr[key$$1] = metadata[key$$1];
  }
  t.head = openTag('svg', attr);
  var bg = this._bgcolor;
  if (bg === 'transparent' || bg === 'none') bg = null;
  if (bg) {
    t.bg = openTag('rect', {
      width:  this._width,
      height: this._height,
      style:  'fill: ' + bg + ';'
    }) + closeTag('rect');
  } else {
    t.bg = '';
  }
  t.root = openTag('g', {
    transform: 'translate(' + o + ')'
  });
  t.foot = closeTag('g') + closeTag('svg');
  return this;
};
prototype$L.background = function() {
  var rv = base$2.background.apply(this, arguments);
  if (arguments.length && this._text.head) {
    this.resize(this._width, this._height, this._origin, this._scale);
  }
  return rv;
};
prototype$L.svg = function() {
  var t = this._text;
  return t.head + t.bg + t.defs + t.root + t.body + t.foot;
};
prototype$L._render = function(scene) {
  this._text.body = this.mark(scene);
  this._text.defs = this.buildDefs();
  return this;
};
prototype$L.buildDefs = function() {
  var all = this._defs,
      defs = '',
      i, id$$1, def, stops;
  for (id$$1 in all.gradient) {
    def = all.gradient[id$$1];
    stops = def.stops;
    defs += openTag('linearGradient', {
      id: id$$1,
      x1: def.x1,
      x2: def.x2,
      y1: def.y1,
      y2: def.y2
    });
    for (i=0; i<stops.length; ++i) {
      defs += openTag('stop', {
        offset: stops[i].offset,
        'stop-color': stops[i].color
      }) + closeTag('stop');
    }
    defs += closeTag('linearGradient');
  }
  for (id$$1 in all.clipping) {
    def = all.clipping[id$$1];
    defs += openTag('clipPath', {id: id$$1});
    if (def.path) {
      defs += openTag('path', {
        d: def.path
      }) + closeTag('path');
    } else {
      defs += openTag('rect', {
        x: 0,
        y: 0,
        width: def.width,
        height: def.height
      }) + closeTag('rect');
    }
    defs += closeTag('clipPath');
  }
  return (defs.length > 0) ? openTag('defs') + defs + closeTag('defs') : '';
};
var object;
function emit$1(name, value, ns, prefixed) {
  object[prefixed || name] = value;
}
prototype$L.attributes = function(attr, item) {
  object = {};
  attr(emit$1, item, this);
  return object;
};
prototype$L.href = function(item) {
  var that = this,
      href = item.href,
      attr;
  if (href) {
    if (attr = that._hrefs && that._hrefs[href]) {
      return attr;
    } else {
      that.sanitizeURL(href).then(function(attr) {
        attr['xlink:href'] = attr.href;
        attr.href = null;
        (that._hrefs || (that._hrefs = {}))[href] = attr;
      });
    }
  }
  return null;
};
prototype$L.mark = function(scene) {
  var renderer = this,
      mdef = marks[scene.marktype],
      tag  = mdef.tag,
      defs = this._defs,
      str = '',
      style;
  if (tag !== 'g' && scene.interactive === false) {
    style = 'style="pointer-events: none;"';
  }
  str += openTag('g', {
    'class': cssClass(scene),
    'clip-path': scene.clip ? clip(renderer, scene, scene.group) : null
  }, style);
  function process(item) {
    var href = renderer.href(item);
    if (href) str += openTag('a', href);
    style = (tag !== 'g') ? applyStyles(item, scene, tag, defs) : null;
    str += openTag(tag, renderer.attributes(mdef.attr, item), style);
    if (tag === 'text') {
      str += escape_text(textValue(item));
    } else if (tag === 'g') {
      str += openTag('path', renderer.attributes(mdef.background, item),
        applyStyles(item, scene, 'bgrect', defs)) + closeTag('path');
      str += openTag('g', renderer.attributes(mdef.foreground, item))
        + renderer.markGroup(item)
        + closeTag('g');
    }
    str += closeTag(tag);
    if (href) str += closeTag('a');
  }
  if (mdef.nested) {
    if (scene.items && scene.items.length) process(scene.items[0]);
  } else {
    visit(scene, process);
  }
  return str + closeTag('g');
};
prototype$L.markGroup = function(scene) {
  var renderer = this,
      str = '';
  visit(scene, function(item) {
    str += renderer.mark(item);
  });
  return str;
};
function applyStyles(o, mark, tag, defs) {
  if (o == null) return '';
  var i, n, prop, name, value, s = '';
  if (tag === 'bgrect' && mark.interactive === false) {
    s += 'pointer-events: none; ';
  }
  if (tag === 'text') {
    s += 'font: ' + font(o) + '; ';
  }
  for (i=0, n=styleProperties.length; i<n; ++i) {
    prop = styleProperties[i];
    name = styles[prop];
    value = o[prop];
    if (value == null) {
      if (name === 'fill') {
        s += 'fill: none; ';
      }
    } else if (value === 'transparent' && (name === 'fill' || name === 'stroke')) {
      s += name + ': none; ';
    } else {
      if (value.id) {
        defs.gradient[value.id] = value;
        value = 'url(#' + value.id + ')';
      }
      s += name + ': ' + value + '; ';
    }
  }
  return s ? 'style="' + s.trim() + '"' : null;
}
function escape_text(s) {
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
}

var Canvas = 'canvas';
var PNG = 'png';
var SVG = 'svg';
var None$1 = 'none';
var RenderType = {
  Canvas: Canvas,
  PNG:    PNG,
  SVG:    SVG,
  None:   None$1
};
var modules = {};
modules[Canvas] = modules[PNG] = {
  renderer: CanvasRenderer,
  headless: CanvasRenderer,
  handler:  CanvasHandler
};
modules[SVG] = {
  renderer: SVGRenderer,
  headless: SVGStringRenderer,
  handler:  SVGHandler
};
modules[None$1] = {};
function renderModule(name, _$$1) {
  name = String(name || '').toLowerCase();
  if (arguments.length > 1) {
    modules[name] = _$$1;
    return this;
  } else {
    return modules[name];
  }
}

var clipBounds = new Bounds();
function boundClip(mark) {
  var clip = mark.clip;
  if (isFunction(clip)) {
    clip(context(clipBounds.clear()));
  } else if (clip) {
    clipBounds.set(0, 0, mark.group.width, mark.group.height);
  } else return;
  mark.bounds.intersect(clipBounds);
}

var TOLERANCE = 1e-9;
function sceneEqual(a, b, key$$1) {
  return (a === b) ? true
    : (key$$1 === 'path') ? pathEqual(a, b)
    : (a instanceof Date && b instanceof Date) ? +a === +b
    : (isNumber(a) && isNumber(b)) ? Math.abs(a - b) <= TOLERANCE
    : (!a || !b || !isObject(a) && !isObject(b)) ? a == b
    : (a == null || b == null) ? false
    : objectEqual(a, b);
}
function pathEqual(a, b) {
  return sceneEqual(pathParse(a), pathParse(b));
}
function objectEqual(a, b) {
  var ka = Object.keys(a),
      kb = Object.keys(b),
      key$$1, i;
  if (ka.length !== kb.length) return false;
  ka.sort();
  kb.sort();
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) return false;
  }
  for (i = ka.length - 1; i >= 0; i--) {
    key$$1 = ka[i];
    if (!sceneEqual(a[key$$1], b[key$$1], key$$1)) return false;
  }
  return typeof a === typeof b;
}

function Bound(params) {
  Transform.call(this, null, params);
}
var prototype$M = inherits(Bound, Transform);
prototype$M.transform = function(_$$1, pulse) {
  var view = pulse.dataflow,
      mark = _$$1.mark,
      type = mark.marktype,
      entry = marks[type],
      bound = entry.bound,
      markBounds = mark.bounds, rebound;
  if (entry.nested) {
    if (mark.items.length) view.dirty(mark.items[0]);
    markBounds = boundItem$1(mark, bound);
    mark.items.forEach(function(item) {
      item.bounds.clear().union(markBounds);
    });
  }
  else if (type === 'group' || _$$1.modified()) {
    pulse.visit(pulse.MOD, function(item) { view.dirty(item); });
    markBounds.clear();
    mark.items.forEach(function(item) {
      markBounds.union(boundItem$1(item, bound));
    });
  }
  else {
    rebound = pulse.changed(pulse.REM);
    pulse.visit(pulse.ADD, function(item) {
      markBounds.union(boundItem$1(item, bound));
    });
    pulse.visit(pulse.MOD, function(item) {
      rebound = rebound || markBounds.alignsWith(item.bounds);
      view.dirty(item);
      markBounds.union(boundItem$1(item, bound));
    });
    if (rebound) {
      markBounds.clear();
      mark.items.forEach(function(item) { markBounds.union(item.bounds); });
    }
  }
  boundClip(mark);
  return pulse.modifies('bounds');
};
function boundItem$1(item, bound, opt) {
  return bound(item.bounds.clear(), item, opt);
}

var COUNTER_NAME = ':vega_identifier:';
function Identifier(params) {
  Transform.call(this, 0, params);
}
Identifier.Definition = {
  "type": "Identifier",
  "metadata": {"modifies": true},
  "params": [
    { "name": "as", "type": "string", "required": true }
  ]
};
var prototype$N = inherits(Identifier, Transform);
prototype$N.transform = function(_$$1, pulse) {
  var counter = getCounter(pulse.dataflow),
      id$$1 = counter.value,
      as = _$$1.as;
  pulse.visit(pulse.ADD, function(t) {
    if (!t[as]) t[as] = ++id$$1;
  });
  counter.set(this.value = id$$1);
  return pulse;
};
function getCounter(view) {
  var counter = view._signals[COUNTER_NAME];
  if (!counter) {
    view._signals[COUNTER_NAME] = (counter = view.add(0));
  }
  return counter;
}

function Mark(params) {
  Transform.call(this, null, params);
}
var prototype$O = inherits(Mark, Transform);
prototype$O.transform = function(_$$1, pulse) {
  var mark = this.value;
  if (!mark) {
    mark = pulse.dataflow.scenegraph().mark(_$$1.markdef, lookup$1(_$$1), _$$1.index);
    mark.group.context = _$$1.context;
    if (!_$$1.context.group) _$$1.context.group = mark.group;
    mark.source = this;
    mark.clip = _$$1.clip;
    mark.interactive = _$$1.interactive;
    this.value = mark;
  }
  var Init = mark.marktype === 'group' ? GroupItem : Item;
  pulse.visit(pulse.ADD, function(item) { Init.call(item, mark); });
  if (_$$1.modified('clip') || _$$1.modified('interactive')) {
    mark.clip = _$$1.clip;
    mark.interactive = !!_$$1.interactive;
    mark.zdirty = true;
    pulse.reflow();
  }
  mark.items = pulse.source;
  return pulse;
};
function lookup$1(_$$1) {
  var g = _$$1.groups, p = _$$1.parent;
  return g && g.size === 1 ? g.get(Object.keys(g.object)[0])
    : g && p ? g.lookup(p)
    : null;
}

var Top = 'top';
var Left = 'left';
var Right = 'right';
var Bottom = 'bottom';

function Overlap(params) {
  Transform.call(this, null, params);
}
var prototype$P = inherits(Overlap, Transform);
var methods = {
  parity: function(items) {
    return items.filter(function(item, i) {
      return i % 2 ? (item.opacity = 0) : 1;
    });
  },
  greedy: function(items) {
    var a;
    return items.filter(function(b, i) {
      if (!i || !intersect(a.bounds, b.bounds)) {
        a = b;
        return 1;
      } else {
        return b.opacity = 0;
      }
    });
  }
};
function intersect(a, b) {
  return !(
    a.x2 - 1 < b.x1 ||
    a.x1 + 1 > b.x2 ||
    a.y2 - 1 < b.y1 ||
    a.y1 + 1 > b.y2
  );
}
function hasOverlap(items) {
  for (var i=1, n=items.length, a=items[0].bounds, b; i<n; a=b, ++i) {
    if (intersect(a, b = items[i].bounds)) return true;
  }
}
function hasBounds(item) {
  var b = item.bounds;
  return b.width() > 1 && b.height() > 1;
}
function boundTest(scale, orient, tolerance) {
  var range$$1 = scale.range(),
      b = new Bounds();
  if (orient === Top || orient === Bottom) {
    b.set(range$$1[0], -Infinity, range$$1[1], +Infinity);
  } else {
    b.set(-Infinity, range$$1[0], +Infinity, range$$1[1]);
  }
  b.expand(tolerance || 1);
  return function(item) {
    return b.encloses(item.bounds);
  };
}
prototype$P.transform = function(_$$1, pulse) {
  var reduce = methods[_$$1.method] || methods.parity,
      source = pulse.materialize(pulse.SOURCE).source;
  if (!source) return;
  if (_$$1.sort) {
    source = source.slice().sort(_$$1.sort);
  }
  if (_$$1.method === 'greedy') {
    source = source.filter(hasBounds);
  }
  source.forEach(function(item) { item.opacity = 1; });
  var items = source;
  if (items.length >= 3 && hasOverlap(items)) {
    pulse = pulse.reflow(_$$1.modified()).modifies('opacity');
    do {
      items = reduce(items);
    } while (items.length >= 3 && hasOverlap(items));
    if (items.length < 3 && !peek(source).opacity) {
      if (items.length > 1) peek(items).opacity = 0;
      peek(source).opacity = 1;
    }
  }
  if (_$$1.boundScale) {
    var test = boundTest(_$$1.boundScale, _$$1.boundOrient, _$$1.boundTolerance);
    source.forEach(function(item) {
      if (!test(item)) item.opacity = 0;
    });
  }
  return pulse;
};

function Render(params) {
  Transform.call(this, null, params);
}
var prototype$Q = inherits(Render, Transform);
prototype$Q.transform = function(_$$1, pulse) {
  var view = pulse.dataflow;
  pulse.visit(pulse.ALL, function(item) { view.dirty(item); });
  if (pulse.fields && pulse.fields['zindex']) {
    var item = pulse.source && pulse.source[0];
    if (item) item.mark.zdirty = true;
  }
};

var AxisRole = 'axis',
    LegendRole = 'legend',
    RowHeader = 'row-header',
    RowFooter = 'row-footer',
    RowTitle  = 'row-title',
    ColHeader = 'column-header',
    ColFooter = 'column-footer',
    ColTitle  = 'column-title';
function extractGroups(group) {
  var groups = group.items,
      n = groups.length,
      i = 0, mark, items;
  var views = {
    marks:      [],
    rowheaders: [],
    rowfooters: [],
    colheaders: [],
    colfooters: [],
    rowtitle: null,
    coltitle: null
  };
  for (; i<n; ++i) {
    mark = groups[i];
    items = mark.items;
    if (mark.marktype === 'group') {
      switch (mark.role) {
        case AxisRole:
        case LegendRole:
          break;
        case RowHeader: addAll(items, views.rowheaders); break;
        case RowFooter: addAll(items, views.rowfooters); break;
        case ColHeader: addAll(items, views.colheaders); break;
        case ColFooter: addAll(items, views.colfooters); break;
        case RowTitle:  views.rowtitle = items[0]; break;
        case ColTitle:  views.coltitle = items[0]; break;
        default:        addAll(items, views.marks);
      }
    }
  }
  return views;
}
function addAll(items, array$$1) {
  for (var i=0, n=items.length; i<n; ++i) {
    array$$1.push(items[i]);
  }
}
function bboxFlush(item) {
  return {x1: 0, y1: 0, x2: item.width || 0, y2: item.height || 0};
}
function bboxFull(item) {
  var b = item.bounds.clone();
  return b.empty()
    ? b.set(0, 0, 0, 0)
    : b.translate(-(item.x||0), -(item.y||0));
}
function boundFlush(item, field$$1) {
  return field$$1 === 'x1' ? (item.x || 0)
    : field$$1 === 'y1' ? (item.y || 0)
    : field$$1 === 'x2' ? (item.x || 0) + (item.width || 0)
    : field$$1 === 'y2' ? (item.y || 0) + (item.height || 0)
    : undefined;
}
function boundFull(item, field$$1) {
  return item.bounds[field$$1];
}
function get$1(opt, key$$1, d) {
  var v = isObject(opt) ? opt[key$$1] : opt;
  return v != null ? v : (d !== undefined ? d : 0);
}
function offsetValue(v) {
  return v < 0 ? Math.ceil(-v) : 0;
}
function gridLayout(view, group, opt) {
  var views = extractGroups(group, opt),
      groups = views.marks,
      flush = opt.bounds === 'flush',
      bbox = flush ? bboxFlush : bboxFull,
      bounds = new Bounds(0, 0, 0, 0),
      alignCol = get$1(opt.align, 'column'),
      alignRow = get$1(opt.align, 'row'),
      padCol = get$1(opt.padding, 'column'),
      padRow = get$1(opt.padding, 'row'),
      off = opt.offset,
      ncols = group.columns || opt.columns || groups.length,
      nrows = ncols < 0 ? 1 : Math.ceil(groups.length / ncols),
      cells = nrows * ncols,
      xOffset = [], xExtent = [], xInit = 0,
      yOffset = [], yExtent = [], yInit = 0,
      n = groups.length,
      m, i, c, r, b, g, px, py, x, y, band, extent$$1, offset;
  for (i=0; i<ncols; ++i) {
    xExtent[i] = 0;
  }
  for (i=0; i<nrows; ++i) {
    yExtent[i] = 0;
  }
  for (i=0; i<n; ++i) {
    b = bbox(groups[i]);
    c = i % ncols;
    r = ~~(i / ncols);
    px = c ? Math.ceil(bbox(groups[i-1]).x2): 0;
    py = r ? Math.ceil(bbox(groups[i-ncols]).y2): 0;
    xExtent[c] = Math.max(xExtent[c], px);
    yExtent[r] = Math.max(yExtent[r], py);
    xOffset.push(padCol + offsetValue(b.x1));
    yOffset.push(padRow + offsetValue(b.y1));
    view.dirty(groups[i]);
  }
  for (i=0; i<n; ++i) {
    if (i % ncols === 0) xOffset[i] = xInit;
    if (i < ncols) yOffset[i] = yInit;
  }
  if (alignCol === 'each') {
    for (c=1; c<ncols; ++c) {
      for (offset=0, i=c; i<n; i += ncols) {
        if (offset < xOffset[i]) offset = xOffset[i];
      }
      for (i=c; i<n; i += ncols) {
        xOffset[i] = offset + xExtent[c];
      }
    }
  } else if (alignCol === 'all') {
    for (extent$$1=0, c=1; c<ncols; ++c) {
      if (extent$$1 < xExtent[c]) extent$$1 = xExtent[c];
    }
    for (offset=0, i=0; i<n; ++i) {
      if (i % ncols && offset < xOffset[i]) offset = xOffset[i];
    }
    for (i=0; i<n; ++i) {
      if (i % ncols) xOffset[i] = offset + extent$$1;
    }
  } else {
    for (c=1; c<ncols; ++c) {
      for (i=c; i<n; i += ncols) {
        xOffset[i] += xExtent[c];
      }
    }
  }
  if (alignRow === 'each') {
    for (r=1; r<nrows; ++r) {
      for (offset=0, i=r*ncols, m=i+ncols; i<m; ++i) {
        if (offset < yOffset[i]) offset = yOffset[i];
      }
      for (i=r*ncols; i<m; ++i) {
        yOffset[i] = offset + yExtent[r];
      }
    }
  } else if (alignRow === 'all') {
    for (extent$$1=0, r=1; r<nrows; ++r) {
      if (extent$$1 < yExtent[r]) extent$$1 = yExtent[r];
    }
    for (offset=0, i=ncols; i<n; ++i) {
      if (offset < yOffset[i]) offset = yOffset[i];
    }
    for (i=ncols; i<n; ++i) {
      yOffset[i] = offset + extent$$1;
    }
  } else {
    for (r=1; r<nrows; ++r) {
      for (i=r*ncols, m=i+ncols; i<m; ++i) {
        yOffset[i] += yExtent[r];
      }
    }
  }
  for (x=0, i=0; i<n; ++i) {
    g = groups[i];
    px = g.x || 0;
    g.x = (x = xOffset[i] + (i % ncols ? x : 0));
    g.bounds.translate(x - px, 0);
  }
  for (c=0; c<ncols; ++c) {
    for (y=0, i=c; i<n; i += ncols) {
      g = groups[i];
      py = g.y || 0;
      g.y = (y += yOffset[i]);
      g.bounds.translate(0, y - py);
    }
  }
  for (i=0; i<n; ++i) groups[i].mark.bounds.clear();
  for (i=0; i<n; ++i) {
    g = groups[i];
    view.dirty(g);
    bounds.union(g.mark.bounds.union(g.bounds));
  }
  function min$$1(a, b) { return Math.floor(Math.min(a, b)); }
  function max$$1(a, b) { return Math.ceil(Math.max(a, b)); }
  bbox = flush ? boundFlush : boundFull;
  band = get$1(opt.headerBand, 'row', null);
  x = layoutHeaders(view, views.rowheaders, groups, ncols, nrows, -get$1(off, 'rowHeader'),    min$$1, 0, bbox, 'x1', 0, ncols, 1, band);
  band = get$1(opt.headerBand, 'column', null);
  y = layoutHeaders(view, views.colheaders, groups, ncols, ncols, -get$1(off, 'columnHeader'), min$$1, 1, bbox, 'y1', 0, 1, ncols, band);
  band = get$1(opt.footerBand, 'row', null);
  layoutHeaders(    view, views.rowfooters, groups, ncols, nrows,  get$1(off, 'rowFooter'),    max$$1, 0, bbox, 'x2', ncols-1, ncols, 1, band);
  band = get$1(opt.footerBand, 'column', null);
  layoutHeaders(    view, views.colfooters, groups, ncols, ncols,  get$1(off, 'columnFooter'), max$$1, 1, bbox, 'y2', cells-ncols, 1, ncols, band);
  if (views.rowtitle) {
    offset = x - get$1(off, 'rowTitle');
    band = get$1(opt.titleBand, 'row', 0.5);
    layoutTitle(view, views.rowtitle, offset, 0, bounds, band);
  }
  if (views.coltitle) {
    offset = y - get$1(off, 'columnTitle');
    band = get$1(opt.titleBand, 'column', 0.5);
    layoutTitle(view, views.coltitle, offset, 1, bounds, band);
  }
}
function layoutHeaders(view, headers, groups, ncols, limit, offset, agg, isX, bound, bf, start, stride, back, band) {
  var n = groups.length,
      init = 0,
      edge = 0,
      i, j, k, m, b, h, g, x, y;
  if (!n) return init;
  for (i=start; i<n; i+=stride) {
    if (groups[i]) init = agg(init, bound(groups[i], bf));
  }
  if (!headers.length) return init;
  if (headers.length > limit) {
    view.warn('Grid headers exceed limit: ' + limit);
    headers = headers.slice(0, limit);
  }
  init += offset;
  for (j=0, m=headers.length; j<m; ++j) {
    view.dirty(headers[j]);
    headers[j].mark.bounds.clear();
  }
  for (i=start, j=0, m=headers.length; j<m; ++j, i+=stride) {
    h = headers[j];
    b = h.mark.bounds;
    for (k=i; k >= 0 && (g = groups[k]) == null; k-=back);
    if (isX) {
      x = band == null ? g.x : Math.round(g.bounds.x1 + band * g.bounds.width());
      y = init;
    } else {
      x = init;
      y = band == null ? g.y : Math.round(g.bounds.y1 + band * g.bounds.height());
    }
    b.union(h.bounds.translate(x - (h.x || 0), y - (h.y || 0)));
    h.x = x;
    h.y = y;
    view.dirty(h);
    edge = agg(edge, b[bf]);
  }
  return edge;
}
function layoutTitle(view, g, offset, isX, bounds, band) {
  if (!g) return;
  view.dirty(g);
  var x = offset, y = offset;
  isX
    ? (x = Math.round(bounds.x1 + band * bounds.width()))
    : (y = Math.round(bounds.y1 + band * bounds.height()));
  g.bounds.translate(x - (g.x || 0), y - (g.y || 0));
  g.mark.bounds.clear().union(g.bounds);
  g.x = x;
  g.y = y;
  view.dirty(g);
}

var Fit = 'fit',
    FitX = 'fit-x',
    FitY = 'fit-y',
    Pad = 'pad',
    None$2 = 'none',
    Padding = 'padding';
var AxisRole$1 = 'axis',
    TitleRole = 'title',
    FrameRole = 'frame',
    LegendRole$1 = 'legend',
    ScopeRole = 'scope',
    RowHeader$1 = 'row-header',
    RowFooter$1 = 'row-footer',
    ColHeader$1 = 'column-header',
    ColFooter$1 = 'column-footer';
var AxisOffset = 0.5,
    tempBounds$2 = new Bounds();
function ViewLayout(params) {
  Transform.call(this, null, params);
}
var prototype$R = inherits(ViewLayout, Transform);
prototype$R.transform = function(_$$1, pulse) {
  var view = pulse.dataflow;
  _$$1.mark.items.forEach(function(group) {
    if (_$$1.layout) gridLayout(view, group, _$$1.layout);
    layoutGroup(view, group, _$$1);
  });
  return pulse;
};
function layoutGroup(view, group, _$$1) {
  var items = group.items,
      width = Math.max(0, group.width || 0),
      height = Math.max(0, group.height || 0),
      viewBounds = new Bounds().set(0, 0, width, height),
      axisBounds = viewBounds.clone(),
      xBounds = viewBounds.clone(),
      yBounds = viewBounds.clone(),
      legends = [], title,
      mark, flow, b, i, n;
  for (i=0, n=items.length; i<n; ++i) {
    mark = items[i];
    switch (mark.role) {
      case AxisRole$1:
        axisBounds.union(b = layoutAxis(view, mark, width, height));
        (isYAxis(mark) ? xBounds : yBounds).union(b);
        break;
      case TitleRole:
        title = mark; break;
      case LegendRole$1:
        legends.push(mark); break;
      case FrameRole:
      case ScopeRole:
      case RowHeader$1:
      case RowFooter$1:
      case ColHeader$1:
      case ColFooter$1:
        xBounds.union(mark.bounds);
        yBounds.union(mark.bounds);
        break;
      default:
        viewBounds.union(mark.bounds);
    }
  }
  if (title) {
    axisBounds.union(b = layoutTitle$1(view, title, axisBounds));
    (isYAxis(title) ? xBounds : yBounds).union(b);
  }
  if (legends.length) {
    flow = {left: 0, right: 0, top: 0, bottom: 0, margin: _$$1.legendMargin || 8};
    for (i=0, n=legends.length; i<n; ++i) {
      b = layoutLegend(view, legends[i], flow, xBounds, yBounds, width, height);
      if (_$$1.autosize && _$$1.autosize.type === Fit) {
        var orient = legends[i].items[0].datum.orient;
        if (orient === Left || orient === Right) {
          viewBounds.add(b.x1, 0).add(b.x2, 0);
        } else if (orient === Top || orient === Bottom) {
          viewBounds.add(0, b.y1).add(0, b.y2);
        }
      } else {
        viewBounds.union(b);
      }
    }
  }
  viewBounds.union(xBounds).union(yBounds).union(axisBounds);
  layoutSize(view, group, viewBounds, _$$1);
}
function set(item, property, value) {
  if (item[property] === value) {
    return 0;
  } else {
    item[property] = value;
    return 1;
  }
}
function isYAxis(mark) {
  var orient = mark.items[0].datum.orient;
  return orient === Left || orient === Right;
}
function axisIndices(datum) {
  var index = +datum.grid;
  return [
    datum.ticks  ? index++ : -1,
    datum.labels ? index++ : -1,
    index + (+datum.domain)
  ];
}
function layoutAxis(view, axis, width, height) {
  var item = axis.items[0],
      datum = item.datum,
      orient = datum.orient,
      indices = axisIndices(datum),
      range$$1 = item.range,
      offset = item.offset,
      position = item.position,
      minExtent = item.minExtent,
      maxExtent = item.maxExtent,
      title = datum.title && item.items[indices[2]].items[0],
      titlePadding = item.titlePadding,
      bounds = item.bounds,
      x = 0, y = 0, i, s;
  tempBounds$2.clear().union(bounds);
  bounds.clear();
  if ((i=indices[0]) > -1) bounds.union(item.items[i].bounds);
  if ((i=indices[1]) > -1) bounds.union(item.items[i].bounds);
  switch (orient) {
    case Top:
      x = position || 0;
      y = -offset;
      s = Math.max(minExtent, Math.min(maxExtent, -bounds.y1));
      if (title) s = layoutAxisTitle(title, s, titlePadding, 0, -1, bounds);
      bounds.add(0, -s).add(range$$1, 0);
      break;
    case Left:
      x = -offset;
      y = position || 0;
      s = Math.max(minExtent, Math.min(maxExtent, -bounds.x1));
      if (title) s = layoutAxisTitle(title, s, titlePadding, 1, -1, bounds);
      bounds.add(-s, 0).add(0, range$$1);
      break;
    case Right:
      x = width + offset;
      y = position || 0;
      s = Math.max(minExtent, Math.min(maxExtent, bounds.x2));
      if (title) s = layoutAxisTitle(title, s, titlePadding, 1, 1, bounds);
      bounds.add(0, 0).add(s, range$$1);
      break;
    case Bottom:
      x = position || 0;
      y = height + offset;
      s = Math.max(minExtent, Math.min(maxExtent, bounds.y2));
      if (title) s = layoutAxisTitle(title, s, titlePadding, 0, 1, bounds);
      bounds.add(0, 0).add(range$$1, s);
      break;
    default:
      x = item.x;
      y = item.y;
  }
  boundStroke(bounds.translate(x, y), item);
  if (set(item, 'x', x + AxisOffset) | set(item, 'y', y + AxisOffset)) {
    item.bounds = tempBounds$2;
    view.dirty(item);
    item.bounds = bounds;
    view.dirty(item);
  }
  return item.mark.bounds.clear().union(bounds);
}
function layoutAxisTitle(title, offset, pad$$1, isYAxis, sign, bounds) {
  var b = title.bounds, dx = 0, dy = 0;
  if (title.auto) {
    offset += pad$$1;
    isYAxis
      ? dx = (title.x || 0) - (title.x = sign * offset)
      : dy = (title.y || 0) - (title.y = sign * offset);
    b.translate(-dx, -dy);
    title.mark.bounds.set(b.x1, b.y1, b.x2, b.y2);
    if (isYAxis) {
      bounds.add(0, b.y1).add(0, b.y2);
      offset += b.width();
    } else {
      bounds.add(b.x1, 0).add(b.x2, 0);
      offset += b.height();
    }
  } else {
    bounds.union(b);
  }
  return offset;
}
function layoutTitle$1(view, title, axisBounds) {
  var item = title.items[0],
      datum = item.datum,
      orient = datum.orient,
      offset = item.offset,
      bounds = item.bounds,
      x = 0, y = 0;
  tempBounds$2.clear().union(bounds);
  switch (orient) {
    case Top:
      x = item.x;
      y = axisBounds.y1 - offset;
      break;
    case Left:
      x = axisBounds.x1 - offset;
      y = item.y;
      break;
    case Right:
      x = axisBounds.x2 + offset;
      y = item.y;
      break;
    case Bottom:
      x = item.x;
      y = axisBounds.y2 + offset;
      break;
    default:
      x = item.x;
      y = item.y;
  }
  bounds.translate(x - item.x, y - item.y);
  if (set(item, 'x', x) | set(item, 'y', y)) {
    item.bounds = tempBounds$2;
    view.dirty(item);
    item.bounds = bounds;
    view.dirty(item);
  }
  return title.bounds.clear().union(bounds);
}
function layoutLegend(view, legend, flow, xBounds, yBounds, width, height) {
  var item = legend.items[0],
      datum = item.datum,
      orient = datum.orient,
      offset = item.offset,
      bounds = item.bounds,
      x = 0,
      y = 0,
      w, h, axisBounds;
  if (orient === Top || orient === Bottom) {
    axisBounds = yBounds,
    x = flow[orient];
  } else if (orient === Left || orient === Right) {
    axisBounds = xBounds;
    y = flow[orient];
  }
  tempBounds$2.clear().union(bounds);
  bounds.clear();
  item.items.forEach(function(_$$1) { bounds.union(_$$1.bounds); });
  w = Math.round(bounds.width()) + 2 * item.padding - 1;
  h = Math.round(bounds.height()) + 2 * item.padding - 1;
  switch (orient) {
    case Left:
      x -= w + offset - Math.floor(axisBounds.x1);
      flow.left += h + flow.margin;
      break;
    case Right:
      x += offset + Math.ceil(axisBounds.x2);
      flow.right += h + flow.margin;
      break;
    case Top:
      y -= h + offset - Math.floor(axisBounds.y1);
      flow.top += w + flow.margin;
      break;
    case Bottom:
      y += offset + Math.ceil(axisBounds.y2);
      flow.bottom += w + flow.margin;
      break;
    case 'top-left':
      x += offset;
      y += offset;
      break;
    case 'top-right':
      x += width - w - offset;
      y += offset;
      break;
    case 'bottom-left':
      x += offset;
      y += height - h - offset;
      break;
    case 'bottom-right':
      x += width - w - offset;
      y += height - h - offset;
      break;
    default:
      x = item.x;
      y = item.y;
  }
  boundStroke(bounds.set(x, y, x + w, y + h), item);
  if (set(item, 'x', x) | set(item, 'width', w) |
      set(item, 'y', y) | set(item, 'height', h)) {
    item.bounds = tempBounds$2;
    view.dirty(item);
    item.bounds = bounds;
    view.dirty(item);
  }
  return item.mark.bounds.clear().union(bounds);
}
function layoutSize(view, group, viewBounds, _$$1) {
  var auto = _$$1.autosize || {},
      type = auto.type,
      viewWidth = view._width,
      viewHeight = view._height,
      padding = view.padding();
  if (view._autosize < 1 || !type) return;
  var width  = Math.max(0, group.width || 0),
      left   = Math.max(0, Math.ceil(-viewBounds.x1)),
      right  = Math.max(0, Math.ceil(viewBounds.x2 - width)),
      height = Math.max(0, group.height || 0),
      top    = Math.max(0, Math.ceil(-viewBounds.y1)),
      bottom = Math.max(0, Math.ceil(viewBounds.y2 - height));
  if (auto.contains === Padding) {
    viewWidth -= padding.left + padding.right;
    viewHeight -= padding.top + padding.bottom;
  }
  if (type === None$2) {
    left = 0;
    top = 0;
    width = viewWidth;
    height = viewHeight;
  }
  else if (type === Fit) {
    width = Math.max(0, viewWidth - left - right);
    height = Math.max(0, viewHeight - top - bottom);
  }
  else if (type === FitX) {
    width = Math.max(0, viewWidth - left - right);
    viewHeight = height + top + bottom;
  }
  else if (type === FitY) {
    viewWidth = width + left + right;
    height = Math.max(0, viewHeight - top - bottom);
  }
  else if (type === Pad) {
    viewWidth = width + left + right;
    viewHeight = height + top + bottom;
  }
  view._resizeView(
    viewWidth, viewHeight,
    width, height,
    [left, top],
    auto.resize
  );
}



var vtx = /*#__PURE__*/Object.freeze({
  bound: Bound,
  identifier: Identifier,
  mark: Mark,
  overlap: Overlap,
  render: Render,
  viewlayout: ViewLayout
});

var Log = 'log';
var Pow = 'pow';
var Utc = 'utc';
var Sqrt = 'sqrt';
var Band = 'band';
var Time = 'time';
var Point = 'point';
var Linear = 'linear';
var Ordinal = 'ordinal';
var Quantile = 'quantile';
var Quantize = 'quantize';
var Threshold = 'threshold';
var BinLinear = 'bin-linear';
var BinOrdinal = 'bin-ordinal';
var Sequential = 'sequential';

function bandSpace(count, paddingInner, paddingOuter) {
  var space = count - paddingInner + paddingOuter * 2;
  return count ? (space > 0 ? space : 1) : 0;
}

function invertRange(scale) {
  return function(_$$1) {
    var lo = _$$1[0],
        hi = _$$1[1],
        t;
    if (hi < lo) {
      t = lo;
      lo = hi;
      hi = t;
    }
    return [
      scale.invert(lo),
      scale.invert(hi)
    ];
  }
}

function invertRangeExtent(scale) {
  return function(_$$1) {
    var range$$1 = scale.range(),
        lo = _$$1[0],
        hi = _$$1[1],
        min$$1 = -1, max$$1, t, i, n;
    if (hi < lo) {
      t = lo;
      lo = hi;
      hi = t;
    }
    for (i=0, n=range$$1.length; i<n; ++i) {
      if (range$$1[i] >= lo && range$$1[i] <= hi) {
        if (min$$1 < 0) min$$1 = i;
        max$$1 = i;
      }
    }
    if (min$$1 < 0) return undefined;
    lo = scale.invertExtent(range$$1[min$$1]);
    hi = scale.invertExtent(range$$1[max$$1]);
    return [
      lo[0] === undefined ? lo[1] : lo[0],
      hi[1] === undefined ? hi[0] : hi[1]
    ];
  }
}

function band() {
  var scale = scaleOrdinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range$$1 = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;
  delete scale.unknown;
  function rescale() {
    var n = domain().length,
        reverse = range$$1[1] < range$$1[0],
        start = range$$1[reverse - 0],
        stop = range$$1[1 - reverse],
        space = bandSpace(n, paddingInner, paddingOuter);
    step = (stop - start) / (space || 1);
    if (round) {
      step = Math.floor(step);
    }
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) {
      start = Math.round(start);
      bandwidth = Math.round(bandwidth);
    }
    var values = range(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }
  scale.domain = function(_$$1) {
    if (arguments.length) {
      domain(_$$1);
      return rescale();
    } else {
      return domain();
    }
  };
  scale.range = function(_$$1) {
    if (arguments.length) {
      range$$1 = [+_$$1[0], +_$$1[1]];
      return rescale();
    } else {
      return range$$1.slice();
    }
  };
  scale.rangeRound = function(_$$1) {
    range$$1 = [+_$$1[0], +_$$1[1]];
    round = true;
    return rescale();
  };
  scale.bandwidth = function() {
    return bandwidth;
  };
  scale.step = function() {
    return step;
  };
  scale.round = function(_$$1) {
    if (arguments.length) {
      round = !!_$$1;
      return rescale();
    } else {
      return round;
    }
  };
  scale.padding = function(_$$1) {
    if (arguments.length) {
      paddingOuter = Math.max(0, Math.min(1, _$$1));
      paddingInner = paddingOuter;
      return rescale();
    } else {
      return paddingInner;
    }
  };
  scale.paddingInner = function(_$$1) {
    if (arguments.length) {
      paddingInner = Math.max(0, Math.min(1, _$$1));
      return rescale();
    } else {
      return paddingInner;
    }
  };
  scale.paddingOuter = function(_$$1) {
    if (arguments.length) {
      paddingOuter = Math.max(0, Math.min(1, _$$1));
      return rescale();
    } else {
      return paddingOuter;
    }
  };
  scale.align = function(_$$1) {
    if (arguments.length) {
      align = Math.max(0, Math.min(1, _$$1));
      return rescale();
    } else {
      return align;
    }
  };
  scale.invertRange = function(_$$1) {
    if (_$$1[0] == null || _$$1[1] == null) return;
    var lo = +_$$1[0],
        hi = +_$$1[1],
        reverse = range$$1[1] < range$$1[0],
        values = reverse ? ordinalRange().reverse() : ordinalRange(),
        n = values.length - 1, a, b, t;
    if (lo !== lo || hi !== hi) return;
    if (hi < lo) {
      t = lo;
      lo = hi;
      hi = t;
    }
    if (hi < values[0] || lo > range$$1[1-reverse]) return;
    a = Math.max(0, bisectRight(values, lo) - 1);
    b = lo===hi ? a : bisectRight(values, hi) - 1;
    if (lo - values[a] > bandwidth + 1e-10) ++a;
    if (reverse) {
      t = a;
      a = n - b;
      b = n - t;
    }
    return (a > b) ? undefined : domain().slice(a, b+1);
  };
  scale.invert = function(_$$1) {
    var value = scale.invertRange([_$$1, _$$1]);
    return value ? value[0] : value;
  };
  scale.copy = function() {
    return band()
        .domain(domain())
        .range(range$$1)
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .align(align);
  };
  return rescale();
}
function pointish(scale) {
  var copy = scale.copy;
  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  scale.copy = function() {
    return pointish(copy());
  };
  return scale;
}
function point$1() {
  return pointish(band().paddingInner(1));
}

var map = Array.prototype.map,
    slice = Array.prototype.slice;
function numbers$1(_$$1) {
  return map.call(_$$1, function(x) { return +x; });
}
function binLinear() {
  var linear = scaleLinear(),
      domain = [];
  function scale(x) {
    return linear(x);
  }
  function setDomain(_$$1) {
    domain = numbers$1(_$$1);
    linear.domain([domain[0], peek(domain)]);
  }
  scale.domain = function(_$$1) {
    return arguments.length ? (setDomain(_$$1), scale) : domain.slice();
  };
  scale.range = function(_$$1) {
    return arguments.length ? (linear.range(_$$1), scale) : linear.range();
  };
  scale.rangeRound = function(_$$1) {
    return arguments.length ? (linear.rangeRound(_$$1), scale) : linear.rangeRound();
  };
  scale.interpolate = function(_$$1) {
    return arguments.length ? (linear.interpolate(_$$1), scale) : linear.interpolate();
  };
  scale.invert = function(_$$1) {
    return linear.invert(_$$1);
  };
  scale.ticks = function(count) {
    var n = domain.length,
        stride = ~~(n / (count || n));
    return stride < 2
      ? scale.domain()
      : domain.filter(function(x, i) { return !(i % stride); });
  };
  scale.tickFormat = function() {
    return linear.tickFormat.apply(linear, arguments);
  };
  scale.copy = function() {
    return binLinear().domain(scale.domain()).range(scale.range());
  };
  return scale;
}
function binOrdinal() {
  var domain = [],
      range$$1 = [];
  function scale(x) {
    return x == null || x !== x
      ? undefined
      : range$$1[(bisect(domain, x) - 1) % range$$1.length];
  }
  scale.domain = function(_$$1) {
    if (arguments.length) {
      domain = numbers$1(_$$1);
      return scale;
    } else {
      return domain.slice();
    }
  };
  scale.range = function(_$$1) {
    if (arguments.length) {
      range$$1 = slice.call(_$$1);
      return scale;
    } else {
      return range$$1.slice();
    }
  };
  scale.tickFormat = function() {
    var linear = scaleLinear().domain([domain[0], peek(domain)]);
    return linear.tickFormat.apply(linear, arguments);
  };
  scale.copy = function() {
    return binOrdinal().domain(scale.domain()).range(scale.range());
  };
  return scale;
}

function sequential(interpolator) {
  var linear = scaleLinear(),
      x0 = 0,
      dx = 1,
      clamp = false;
  function update() {
    var domain = linear.domain();
    x0 = domain[0];
    dx = peek(domain) - x0;
  }
  function scale(x) {
    var t = (x - x0) / dx;
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }
  scale.clamp = function(_$$1) {
    if (arguments.length) {
      clamp = !!_$$1;
      return scale;
    } else {
      return clamp;
    }
  };
  scale.domain = function(_$$1) {
    return arguments.length ? (linear.domain(_$$1), update(), scale) : linear.domain();
  };
  scale.interpolator = function(_$$1) {
    if (arguments.length) {
      interpolator = _$$1;
      return scale;
    } else {
      return interpolator;
    }
  };
  scale.copy = function() {
    return sequential().domain(linear.domain()).clamp(clamp).interpolator(interpolator);
  };
  scale.ticks = function(count) {
    return linear.ticks(count);
  };
  scale.tickFormat = function(count, specifier) {
    return linear.tickFormat(count, specifier);
  };
  scale.nice = function(count) {
    return linear.nice(count), update(), scale;
  };
  return scale;
}

function create(type, constructor) {
  return function scale() {
    var s = constructor();
    if (!s.invertRange) {
      s.invertRange = s.invert ? invertRange(s)
        : s.invertExtent ? invertRangeExtent(s)
        : undefined;
    }
    s.type = type;
    return s;
  };
}
function scale$1(type, scale) {
  if (arguments.length > 1) {
    scales[type] = create(type, scale);
    return this;
  } else {
    return scales.hasOwnProperty(type) ? scales[type] : undefined;
  }
}
var scales = {
  identity:      scaleIdentity,
  linear:        scaleLinear,
  log:           scaleLog,
  ordinal:       scaleOrdinal,
  pow:           scalePow,
  sqrt:          scaleSqrt,
  quantile:      scaleQuantile,
  quantize:      scaleQuantize,
  threshold:     scaleThreshold,
  time:          scaleTime,
  utc:           scaleUtc,
  band:          band,
  point:         point$1,
  sequential:    sequential,
  'bin-linear':  binLinear,
  'bin-ordinal': binOrdinal
};
for (var key$1 in scales) {
  scale$1(key$1, scales[key$1]);
}

function interpolateRange(interpolator, range$$1) {
  var start = range$$1[0],
      span = peek(range$$1) - start;
  return function(i) { return interpolator(start + i * span); };
}
function scaleFraction(scale, min$$1, max$$1) {
  var delta = max$$1 - min$$1;
  return !delta || !isFinite(delta) ? constant(0)
    : scale.type === 'linear' || scale.type === 'sequential'
      ? function(_$$1) { return (_$$1 - min$$1) / delta; }
      : scale.copy().domain([min$$1, max$$1]).range([0, 1]).interpolate(lerp);
}
function lerp(a, b) {
  var span = b - a;
  return function(i) { return a + i * span; }
}
function interpolate$1(type, gamma) {
  var interp = $$1[method(type)];
  return (gamma != null && interp && interp.gamma)
    ? interp.gamma(gamma)
    : interp;
}
function method(type) {
  return 'interpolate' + type.toLowerCase()
    .split('-')
    .map(function(s) { return s[0].toUpperCase() + s.slice(1); })
    .join('');
}

function colors(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}
var category20 = colors(
  '1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5'
);
var category20b = colors(
  '393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6'
);
var category20c = colors(
  '3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9'
);
var tableau10 = colors(
  '4c78a8f58518e4575672b7b254a24beeca3bb279a2ff9da69d755dbab0ac'
);
var tableau20 = colors(
  '4c78a89ecae9f58518ffbf7954a24b88d27ab79a20f2cf5b43989483bcb6e45756ff9d9879706ebab0acd67195fcbfd2b279a2d6a5c99e765fd8b5a5'
);
var blueOrange = new Array(3).concat(
  "67a9cff7f7f7f1a340",
  "0571b092c5defdb863e66101",
  "0571b092c5def7f7f7fdb863e66101",
  "2166ac67a9cfd1e5f0fee0b6f1a340b35806",
  "2166ac67a9cfd1e5f0f7f7f7fee0b6f1a340b35806",
  "2166ac4393c392c5ded1e5f0fee0b6fdb863e08214b35806",
  "2166ac4393c392c5ded1e5f0f7f7f7fee0b6fdb863e08214b35806",
  "0530612166ac4393c392c5ded1e5f0fee0b6fdb863e08214b358067f3b08",
  "0530612166ac4393c392c5ded1e5f0f7f7f7fee0b6fdb863e08214b358067f3b08"
).map(colors);

var discretized = {
  blueorange:  blueOrange
};
var schemes = {
  category10:  schemeCategory10,
  accent:      schemeAccent,
  dark2:       schemeDark2,
  paired:      schemePaired,
  pastel1:     schemePastel1,
  pastel2:     schemePastel2,
  set1:        schemeSet1,
  set2:        schemeSet2,
  set3:        schemeSet3,
  category20:  category20,
  category20b: category20b,
  category20c: category20c,
  tableau10:   tableau10,
  tableau20:   tableau20,
  viridis:     interpolateViridis,
  magma:       interpolateMagma,
  inferno:     interpolateInferno,
  plasma:      interpolatePlasma,
  rainbow:     interpolateRainbow,
  sinebow:     interpolateSinebow,
  blueorange:  interpolateRgbBasis(peek(blueOrange))
};
function add$2(name, suffix) {
  schemes[name] = _['interpolate' + suffix];
  discretized[name] = _['scheme' + suffix];
}
add$2('blues',    'Blues');
add$2('greens',   'Greens');
add$2('greys',    'Greys');
add$2('purples',  'Purples');
add$2('reds',     'Reds');
add$2('oranges',  'Oranges');
add$2('brownbluegreen',    'BrBG');
add$2('purplegreen',       'PRGn');
add$2('pinkyellowgreen',   'PiYG');
add$2('purpleorange',      'PuOr');
add$2('redblue',           'RdBu');
add$2('redgrey',           'RdGy');
add$2('redyellowblue',     'RdYlBu');
add$2('redyellowgreen',    'RdYlGn');
add$2('spectral',          'Spectral');
add$2('bluegreen',         'BuGn');
add$2('bluepurple',        'BuPu');
add$2('greenblue',         'GnBu');
add$2('orangered',         'OrRd');
add$2('purplebluegreen',   'PuBuGn');
add$2('purpleblue',        'PuBu');
add$2('purplered',         'PuRd');
add$2('redpurple',         'RdPu');
add$2('yellowgreenblue',   'YlGnBu');
add$2('yellowgreen',       'YlGn');
add$2('yelloworangebrown', 'YlOrBr');
add$2('yelloworangered',   'YlOrRd');
function scheme(name, scheme) {
  if (arguments.length > 1) {
    schemes[name] = scheme;
    return this;
  }
  var part = name.split('-');
  name = part[0];
  part = +part[1] + 1;
  return part && discretized.hasOwnProperty(name) ? discretized[name][part-1]
    : !part && schemes.hasOwnProperty(name) ? schemes[name]
    : undefined;
}

var time = {
  millisecond: timeMillisecond,
  second:      timeSecond,
  minute:      timeMinute,
  hour:        timeHour,
  day:         timeDay,
  week:        timeWeek,
  month:       timeMonth,
  year:        timeYear
};
var utc = {
  millisecond: utcMillisecond,
  second:      utcSecond,
  minute:      utcMinute,
  hour:        utcHour,
  day:         utcDay,
  week:        utcWeek,
  month:       utcMonth,
  year:        utcYear
};
function timeInterval(name) {
  return time.hasOwnProperty(name) && time[name];
}
function utcInterval(name) {
  return utc.hasOwnProperty(name) && utc[name];
}

function tickCount(scale, count) {
  var step;
  if (isObject(count)) {
    step = count.step;
    count = count.interval;
  }
  if (isString(count)) {
    count = scale.type === 'time' ? timeInterval(count)
      : scale.type === 'utc' ? utcInterval(count)
      : error('Only time and utc scales accept interval strings.');
    if (step) count = count.every(step);
  }
  return count;
}
function validTicks(scale, ticks, count) {
  var range$$1 = scale.range(),
      lo = range$$1[0],
      hi = peek(range$$1);
  if (lo > hi) {
    range$$1 = hi;
    hi = lo;
    lo = range$$1;
  }
  ticks = ticks.filter(function(v) {
    v = scale(v);
    return !(v < lo || v > hi)
  });
  if (count > 0 && ticks.length > 1) {
    var endpoints = [ticks[0], peek(ticks)];
    while (ticks.length > count && ticks.length >= 3) {
      ticks = ticks.filter(function(_$$1, i) { return !(i % 2); });
    }
    if (ticks.length < 3) {
      ticks = endpoints;
    }
  }
  return ticks;
}
function tickValues(scale, count) {
  return scale.ticks ? scale.ticks(count) : scale.domain();
}
function tickFormat(scale, count, specifier) {
  var format$$1 = scale.tickFormat
    ? scale.tickFormat(count, specifier)
    : String;
  return (scale.type === Log)
    ? filter$1(format$$1, variablePrecision(specifier))
    : format$$1;
}
function filter$1(sourceFormat, targetFormat) {
  return function(_$$1) {
    return sourceFormat(_$$1) ? targetFormat(_$$1) : '';
  };
}
function variablePrecision(specifier) {
  var s = formatSpecifier(specifier || ',');
  if (s.precision == null) {
    s.precision = 12;
    switch (s.type) {
      case '%': s.precision -= 2; break;
      case 'e': s.precision -= 1; break;
    }
    return trimZeroes(
      format(s),
      format('.1f')(1)[1]
    );
  } else {
    return format(s);
  }
}
function trimZeroes(format$$1, decimalChar) {
  return function(x) {
    var str = format$$1(x),
        dec = str.indexOf(decimalChar),
        idx, end;
    if (dec < 0) return str;
    idx = rightmostDigit(str, dec);
    end = idx < str.length ? str.slice(idx) : '';
    while (--idx > dec) if (str[idx] !== '0') { ++idx; break; }
    return str.slice(0, idx) + end;
  };
}
function rightmostDigit(str, dec) {
  var i = str.lastIndexOf('e'), c;
  if (i > 0) return i;
  for (i=str.length; --i > dec;) {
    c = str.charCodeAt(i);
    if (c >= 48 && c <= 57) return i + 1;
  }
}

function AxisTicks(params) {
  Transform.call(this, null, params);
}
var prototype$S = inherits(AxisTicks, Transform);
prototype$S.transform = function(_$$1, pulse) {
  if (this.value && !_$$1.modified()) {
    return pulse.StopPropagation;
  }
  var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
      ticks = this.value,
      scale = _$$1.scale,
      count = _$$1.count == null ? (_$$1.values ? _$$1.values.length : 10) : tickCount(scale, _$$1.count),
      format$$1 = _$$1.format || tickFormat(scale, count, _$$1.formatSpecifier),
      values = _$$1.values ? validTicks(scale, _$$1.values, count) : tickValues(scale, count);
  if (ticks) out.rem = ticks;
  ticks = values.map(function(value, i) {
    return ingest({
      index: i / (values.length - 1),
      value: value,
      label: format$$1(value)
    });
  });
  if (_$$1.extra) {
    ticks.push(ingest({
      index: -1,
      extra: {value: ticks[0].value},
      label: ''
    }));
  }
  out.source = ticks;
  out.add = ticks;
  this.value = ticks;
  return out;
};

function DataJoin(params) {
  Transform.call(this, null, params);
}
var prototype$T = inherits(DataJoin, Transform);
function defaultItemCreate() {
  return ingest({});
}
function isExit(t) {
  return t.exit;
}
prototype$T.transform = function(_$$1, pulse) {
  var df = pulse.dataflow,
      out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
      item = _$$1.item || defaultItemCreate,
      key$$1 = _$$1.key || tupleid,
      map = this.value;
  if (isArray(out.encode)) {
    out.encode = null;
  }
  if (map && (_$$1.modified('key') || pulse.modified(key$$1))) {
    error('DataJoin does not support modified key function or fields.');
  }
  if (!map) {
    pulse = pulse.addAll();
    this.value = map = fastmap().test(isExit);
    map.lookup = function(t) { return map.get(key$$1(t)); };
  }
  pulse.visit(pulse.ADD, function(t) {
    var k = key$$1(t),
        x = map.get(k);
    if (x) {
      if (x.exit) {
        map.empty--;
        out.add.push(x);
      } else {
        out.mod.push(x);
      }
    } else {
      map.set(k, (x = item(t)));
      out.add.push(x);
    }
    x.datum = t;
    x.exit = false;
  });
  pulse.visit(pulse.MOD, function(t) {
    var k = key$$1(t),
        x = map.get(k);
    if (x) {
      x.datum = t;
      out.mod.push(x);
    }
  });
  pulse.visit(pulse.REM, function(t) {
    var k = key$$1(t),
        x = map.get(k);
    if (t === x.datum && !x.exit) {
      out.rem.push(x);
      x.exit = true;
      ++map.empty;
    }
  });
  if (pulse.changed(pulse.ADD_MOD)) out.modifies('datum');
  if (_$$1.clean && map.empty > df.cleanThreshold) df.runAfter(map.clean);
  return out;
};

function Encode(params) {
  Transform.call(this, null, params);
}
var prototype$U = inherits(Encode, Transform);
prototype$U.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.ADD_REM),
      encoders = _$$1.encoders,
      encode = pulse.encode;
  if (isArray(encode)) {
    if (out.changed() || encode.every(function(e) { return encoders[e]; })) {
      encode = encode[0];
      out.encode = null;
    } else {
      return pulse.StopPropagation;
    }
  }
  var reenter = encode === 'enter',
      update = encoders.update || falsy,
      enter = encoders.enter || falsy,
      exit = encoders.exit || falsy,
      set = (encode && !reenter ? encoders[encode] : update) || falsy;
  if (pulse.changed(pulse.ADD)) {
    pulse.visit(pulse.ADD, function(t) {
      enter(t, _$$1);
      update(t, _$$1);
      if (set !== falsy && set !== update) set(t, _$$1);
    });
    out.modifies(enter.output);
    out.modifies(update.output);
    if (set !== falsy && set !== update) out.modifies(set.output);
  }
  if (pulse.changed(pulse.REM) && exit !== falsy) {
    pulse.visit(pulse.REM, function(t) { exit(t, _$$1); });
    out.modifies(exit.output);
  }
  if (reenter || set !== falsy) {
    var flag = pulse.MOD | (_$$1.modified() ? pulse.REFLOW : 0);
    if (reenter) {
      pulse.visit(flag, function(t) {
        var mod = enter(t, _$$1);
        if (set(t, _$$1) || mod) out.mod.push(t);
      });
      if (out.mod.length) out.modifies(enter.output);
    } else {
      pulse.visit(flag, function(t) {
        if (set(t, _$$1)) out.mod.push(t);
      });
    }
    if (out.mod.length) out.modifies(set.output);
  }
  return out.changed() ? out : pulse.StopPropagation;
};

var discrete = {};
discrete[Quantile] = quantile$1;
discrete[Quantize] = quantize;
discrete[Threshold] = threshold;
discrete[BinLinear] = bin$1;
discrete[BinOrdinal] = bin$1;
function labelValues(scale, count, gradient) {
  if (gradient) return scale.domain();
  var values = discrete[scale.type];
  return values ? values(scale) : tickValues(scale, count);
}
function quantize(scale) {
  var domain = scale.domain(),
      x0 = domain[0],
      x1 = peek(domain),
      n = scale.range().length,
      values = new Array(n),
      i = 0;
  values[0] = -Infinity;
  while (++i < n) values[i] = (i * x1 - (i - n) * x0) / n;
  values.max = +Infinity;
  return values;
}
function quantile$1(scale) {
  var values = [-Infinity].concat(scale.quantiles());
  values.max = +Infinity;
  return values;
}
function threshold(scale) {
  var values = [-Infinity].concat(scale.domain());
  values.max = +Infinity;
  return values;
}
function bin$1(scale) {
  var values = scale.domain();
  values.max = values.pop();
  return values;
}
function labelFormat(scale, format$$1) {
  return discrete[scale.type] ? formatRange(format$$1) : formatPoint(format$$1);
}
function formatRange(format$$1) {
  return function(value, index, array$$1) {
    var limit = array$$1[index + 1] || array$$1.max || +Infinity,
        lo = formatValue(value, format$$1),
        hi = formatValue(limit, format$$1);
    return lo && hi ? lo + '\u2013' + hi : hi ? '< ' + hi : '\u2265 ' + lo;
  };
}
function formatValue(value, format$$1) {
  return isFinite(value) ? format$$1(value) : null;
}
function formatPoint(format$$1) {
  return function(value) {
    return format$$1(value);
  };
}

function LegendEntries(params) {
  Transform.call(this, [], params);
}
var prototype$V = inherits(LegendEntries, Transform);
prototype$V.transform = function(_$$1, pulse) {
  if (this.value != null && !_$$1.modified()) {
    return pulse.StopPropagation;
  }
  var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
      total = 0,
      items = this.value,
      grad  = _$$1.type === 'gradient',
      scale = _$$1.scale,
      count = _$$1.count == null ? 5 : tickCount(scale, _$$1.count),
      format$$1 = _$$1.format || tickFormat(scale, count, _$$1.formatSpecifier),
      values = _$$1.values || labelValues(scale, count, grad);
  format$$1 = labelFormat(scale, format$$1);
  if (items) out.rem = items;
  if (grad) {
    var domain = _$$1.values ? scale.domain() : values,
        fraction = scaleFraction(scale, domain[0], peek(domain));
  } else {
    var size = _$$1.size,
        offset;
    if (isFunction(size)) {
      if (!_$$1.values && scale(values[0]) === 0) {
        values = values.slice(1);
      }
      offset = values.reduce(function(max$$1, value) {
        return Math.max(max$$1, size(value, _$$1));
      }, 0);
    } else {
      size = constant(offset = size || 8);
    }
  }
  items = values.map(function(value, index) {
    var t = ingest({
      index: index,
      label: format$$1(value, index, values),
      value: value
    });
    if (grad) {
      t.perc = fraction(value);
    } else {
      t.offset = offset;
      t.size = size(value, _$$1);
      t.total = Math.round(total);
      total += t.size;
    }
    return t;
  });
  out.source = items;
  out.add = items;
  this.value = items;
  return out;
};

var Paths = fastmap({
  'line': line$3,
  'line-radial': lineR,
  'arc': arc$3,
  'arc-radial': arcR,
  'curve': curve,
  'curve-radial': curveR,
  'orthogonal-horizontal': orthoX,
  'orthogonal-vertical': orthoY,
  'orthogonal-radial': orthoR,
  'diagonal-horizontal': diagonalX,
  'diagonal-vertical': diagonalY,
  'diagonal-radial': diagonalR
});
function sourceX(t) { return t.source.x; }
function sourceY(t) { return t.source.y; }
function targetX(t) { return t.target.x; }
function targetY(t) { return t.target.y; }
function LinkPath(params) {
  Transform.call(this, {}, params);
}
LinkPath.Definition = {
  "type": "LinkPath",
  "metadata": {"modifies": true},
  "params": [
    { "name": "sourceX", "type": "field", "default": "source.x" },
    { "name": "sourceY", "type": "field", "default": "source.y" },
    { "name": "targetX", "type": "field", "default": "target.x" },
    { "name": "targetY", "type": "field", "default": "target.y" },
    { "name": "orient", "type": "enum", "default": "vertical",
      "values": ["horizontal", "vertical", "radial"] },
    { "name": "shape", "type": "enum", "default": "line",
      "values": ["line", "arc", "curve", "diagonal", "orthogonal"] },
    { "name": "as", "type": "string", "default": "path" }
  ]
};
var prototype$W = inherits(LinkPath, Transform);
prototype$W.transform = function(_$$1, pulse) {
  var sx = _$$1.sourceX || sourceX,
      sy = _$$1.sourceY || sourceY,
      tx = _$$1.targetX || targetX,
      ty = _$$1.targetY || targetY,
      as = _$$1.as || 'path',
      orient = _$$1.orient || 'vertical',
      shape = _$$1.shape || 'line',
      path$$1 = Paths.get(shape + '-' + orient) || Paths.get(shape);
  if (!path$$1) {
    error('LinkPath unsupported type: ' + _$$1.shape
      + (_$$1.orient ? '-' + _$$1.orient : ''));
  }
  pulse.visit(pulse.SOURCE, function(t) {
    t[as] = path$$1(sx(t), sy(t), tx(t), ty(t));
  });
  return pulse.reflow(_$$1.modified()).modifies(as);
};
function line$3(sx, sy, tx, ty) {
  return 'M' + sx + ',' + sy +
         'L' + tx + ',' + ty;
}
function lineR(sa, sr, ta, tr) {
  return line$3(
    sr * Math.cos(sa), sr * Math.sin(sa),
    tr * Math.cos(ta), tr * Math.sin(ta)
  );
}
function arc$3(sx, sy, tx, ty) {
  var dx = tx - sx,
      dy = ty - sy,
      rr = Math.sqrt(dx * dx + dy * dy) / 2,
      ra = 180 * Math.atan2(dy, dx) / Math.PI;
  return 'M' + sx + ',' + sy +
         'A' + rr + ',' + rr +
         ' ' + ra + ' 0 1' +
         ' ' + tx + ',' + ty;
}
function arcR(sa, sr, ta, tr) {
  return arc$3(
    sr * Math.cos(sa), sr * Math.sin(sa),
    tr * Math.cos(ta), tr * Math.sin(ta)
  );
}
function curve(sx, sy, tx, ty) {
  var dx = tx - sx,
      dy = ty - sy,
      ix = 0.2 * (dx + dy),
      iy = 0.2 * (dy - dx);
  return 'M' + sx + ',' + sy +
         'C' + (sx+ix) + ',' + (sy+iy) +
         ' ' + (tx+iy) + ',' + (ty-ix) +
         ' ' + tx + ',' + ty;
}
function curveR(sa, sr, ta, tr) {
  return curve(
    sr * Math.cos(sa), sr * Math.sin(sa),
    tr * Math.cos(ta), tr * Math.sin(ta)
  );
}
function orthoX(sx, sy, tx, ty) {
  return 'M' + sx + ',' + sy +
         'V' + ty + 'H' + tx;
}
function orthoY(sx, sy, tx, ty) {
  return 'M' + sx + ',' + sy +
         'H' + tx + 'V' + ty;
}
function orthoR(sa, sr, ta, tr) {
  var sc = Math.cos(sa),
      ss = Math.sin(sa),
      tc = Math.cos(ta),
      ts = Math.sin(ta),
      sf = Math.abs(ta - sa) > Math.PI ? ta <= sa : ta > sa;
  return 'M' + (sr*sc) + ',' + (sr*ss) +
         'A' + sr + ',' + sr + ' 0 0,' + (sf?1:0) +
         ' ' + (sr*tc) + ',' + (sr*ts) +
         'L' + (tr*tc) + ',' + (tr*ts);
}
function diagonalX(sx, sy, tx, ty) {
  var m = (sx + tx) / 2;
  return 'M' + sx + ',' + sy +
         'C' + m  + ',' + sy +
         ' ' + m  + ',' + ty +
         ' ' + tx + ',' + ty;
}
function diagonalY(sx, sy, tx, ty) {
  var m = (sy + ty) / 2;
  return 'M' + sx + ',' + sy +
         'C' + sx + ',' + m +
         ' ' + tx + ',' + m +
         ' ' + tx + ',' + ty;
}
function diagonalR(sa, sr, ta, tr) {
  var sc = Math.cos(sa),
      ss = Math.sin(sa),
      tc = Math.cos(ta),
      ts = Math.sin(ta),
      mr = (sr + tr) / 2;
  return 'M' + (sr*sc) + ',' + (sr*ss) +
         'C' + (mr*sc) + ',' + (mr*ss) +
         ' ' + (mr*tc) + ',' + (mr*ts) +
         ' ' + (tr*tc) + ',' + (tr*ts);
}

function Pie(params) {
  Transform.call(this, null, params);
}
Pie.Definition = {
  "type": "Pie",
  "metadata": {"modifies": true},
  "params": [
    { "name": "field", "type": "field" },
    { "name": "startAngle", "type": "number", "default": 0 },
    { "name": "endAngle", "type": "number", "default": 6.283185307179586 },
    { "name": "sort", "type": "boolean", "default": false },
    { "name": "as", "type": "string", "array": true, "length": 2, "default": ["startAngle", "endAngle"] }
  ]
};
var prototype$X = inherits(Pie, Transform);
prototype$X.transform = function(_$$1, pulse) {
  var as = _$$1.as || ['startAngle', 'endAngle'],
      startAngle = as[0],
      endAngle = as[1],
      field$$1 = _$$1.field || one,
      start = _$$1.startAngle || 0,
      stop = _$$1.endAngle != null ? _$$1.endAngle : 2 * Math.PI,
      data = pulse.source,
      values = data.map(field$$1),
      n = values.length,
      a = start,
      k = (stop - start) / sum(values),
      index = range(n),
      i, t, v;
  if (_$$1.sort) {
    index.sort(function(a, b) {
      return values[a] - values[b];
    });
  }
  for (i=0; i<n; ++i) {
    v = values[index[i]];
    t = data[index[i]];
    t[startAngle] = a;
    t[endAngle] = (a += v * k);
  }
  this.value = values;
  return pulse.reflow(_$$1.modified()).modifies(as);
};

var DEFAULT_COUNT = 5;
var INCLUDE_ZERO = toSet([Linear, Pow, Sqrt]);
var INCLUDE_PAD = toSet([Linear, Log, Pow, Sqrt, Time, Utc]);
var SKIP$2 = toSet([
  'set', 'modified', 'clear', 'type', 'scheme', 'schemeExtent', 'schemeCount',
  'domain', 'domainMin', 'domainMid', 'domainMax', 'domainRaw', 'nice', 'zero',
  'range', 'rangeStep', 'round', 'reverse', 'interpolate', 'interpolateGamma'
]);
function Scale(params) {
  Transform.call(this, null, params);
  this.modified(true);
}
var prototype$Y = inherits(Scale, Transform);
prototype$Y.transform = function(_$$1, pulse) {
  var df = pulse.dataflow,
      scale$$1 = this.value,
      prop;
  if (!scale$$1 || _$$1.modified('type')) {
    this.value = scale$$1 = scale$1((_$$1.type || Linear).toLowerCase())();
  }
  for (prop in _$$1) if (!SKIP$2[prop]) {
    if (prop === 'padding' && INCLUDE_PAD[scale$$1.type]) continue;
    isFunction(scale$$1[prop])
      ? scale$$1[prop](_$$1[prop])
      : df.warn('Unsupported scale property: ' + prop);
  }
  configureRange(scale$$1, _$$1, configureDomain(scale$$1, _$$1, df));
  return pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
};
function configureDomain(scale$$1, _$$1, df) {
  var raw = rawDomain(scale$$1, _$$1.domainRaw);
  if (raw > -1) return raw;
  var domain = _$$1.domain,
      type = scale$$1.type,
      zero$$1 = _$$1.zero || (_$$1.zero === undefined && INCLUDE_ZERO[type]),
      n, mid;
  if (!domain) return 0;
  if (INCLUDE_PAD[type] && _$$1.padding && domain[0] !== peek(domain)) {
    domain = padDomain(type, domain, _$$1.range, _$$1.padding, _$$1.exponent);
  }
  if (zero$$1 || _$$1.domainMin != null || _$$1.domainMax != null || _$$1.domainMid != null) {
    n = ((domain = domain.slice()).length - 1) || 1;
    if (zero$$1) {
      if (domain[0] > 0) domain[0] = 0;
      if (domain[n] < 0) domain[n] = 0;
    }
    if (_$$1.domainMin != null) domain[0] = _$$1.domainMin;
    if (_$$1.domainMax != null) domain[n] = _$$1.domainMax;
    if (_$$1.domainMid != null) {
      mid = _$$1.domainMid;
      if (mid < domain[0] || mid > domain[n]) {
        df.warn('Scale domainMid exceeds domain min or max.', mid);
      }
      domain.splice(n, 0, mid);
    }
  }
  scale$$1.domain(domain);
  if (type === Ordinal) {
    scale$$1.unknown(undefined);
  }
  if (_$$1.nice && scale$$1.nice) {
    scale$$1.nice((_$$1.nice !== true && tickCount(scale$$1, _$$1.nice)) || null);
  }
  return domain.length;
}
function rawDomain(scale$$1, raw) {
  if (raw) {
    scale$$1.domain(raw);
    return raw.length;
  } else {
    return -1;
  }
}
function padDomain(type, domain, range$$1, pad$$1, exponent) {
  var span = Math.abs(peek(range$$1) - range$$1[0]),
      frac = span / (span - 2 * pad$$1),
      d = type === Log  ? zoomLog(domain, null, frac)
        : type === Sqrt ? zoomPow(domain, null, frac, 0.5)
        : type === Pow  ? zoomPow(domain, null, frac, exponent)
        : zoomLinear(domain, null, frac);
  domain = domain.slice();
  domain[0] = d[0];
  domain[domain.length-1] = d[1];
  return domain;
}
function configureRange(scale$$1, _$$1, count) {
  var round = _$$1.round || false,
      range$$1 = _$$1.range;
  if (_$$1.rangeStep != null) {
    range$$1 = configureRangeStep(scale$$1.type, _$$1, count);
  }
  else if (_$$1.scheme) {
    range$$1 = configureScheme(scale$$1.type, _$$1, count);
    if (isFunction(range$$1)) return scale$$1.interpolator(range$$1);
  }
  else if (range$$1 && scale$$1.type === Sequential) {
    return scale$$1.interpolator(interpolateRgbBasis(flip(range$$1, _$$1.reverse)));
  }
  if (range$$1 && _$$1.interpolate && scale$$1.interpolate) {
    scale$$1.interpolate(interpolate$1(_$$1.interpolate, _$$1.interpolateGamma));
  } else if (isFunction(scale$$1.round)) {
    scale$$1.round(round);
  } else if (isFunction(scale$$1.rangeRound)) {
    scale$$1.interpolate(round ? interpolateRound : interpolate);
  }
  if (range$$1) scale$$1.range(flip(range$$1, _$$1.reverse));
}
function configureRangeStep(type, _$$1, count) {
  if (type !== Band && type !== Point) {
    error('Only band and point scales support rangeStep.');
  }
  var outer = (_$$1.paddingOuter != null ? _$$1.paddingOuter : _$$1.padding) || 0,
      inner = type === Point ? 1
            : ((_$$1.paddingInner != null ? _$$1.paddingInner : _$$1.padding) || 0);
  return [0, _$$1.rangeStep * bandSpace(count, inner, outer)];
}
function configureScheme(type, _$$1, count) {
  var name = _$$1.scheme.toLowerCase(),
      scheme$$1 = scheme(name),
      extent$$1 = _$$1.schemeExtent,
      discrete;
  if (!scheme$$1) {
    error('Unrecognized scheme name: ' + _$$1.scheme);
  }
  count = (type === Threshold) ? count + 1
    : (type === BinOrdinal) ? count - 1
    : (type === Quantile || type === Quantize) ? (+_$$1.schemeCount || DEFAULT_COUNT)
    : count;
  return type === Sequential ? adjustScheme(scheme$$1, extent$$1, _$$1.reverse)
    : !extent$$1 && (discrete = scheme(name + '-' + count)) ? discrete
    : isFunction(scheme$$1) ? quantize$1(adjustScheme(scheme$$1, extent$$1), count)
    : type === Ordinal ? scheme$$1 : scheme$$1.slice(0, count);
}
function adjustScheme(scheme$$1, extent$$1, reverse) {
  return (isFunction(scheme$$1) && (extent$$1 || reverse))
    ? interpolateRange(scheme$$1, flip(extent$$1 || [0, 1], reverse))
    : scheme$$1;
}
function flip(array$$1, reverse) {
  return reverse ? array$$1.slice().reverse() : array$$1;
}
function quantize$1(interpolator, count) {
  var samples = new Array(count),
      n = (count - 1) || 1;
  for (var i = 0; i < count; ++i) samples[i] = interpolator(i / n);
  return samples;
}

function SortItems(params) {
  Transform.call(this, null, params);
}
var prototype$Z = inherits(SortItems, Transform);
prototype$Z.transform = function(_$$1, pulse) {
  var mod = _$$1.modified('sort')
         || pulse.changed(pulse.ADD)
         || pulse.modified(_$$1.sort.fields)
         || pulse.modified('datum');
  if (mod) pulse.source.sort(_$$1.sort);
  this.modified(mod);
  return pulse;
};

var Center = 'center',
    Normalize = 'normalize';
function Stack(params) {
  Transform.call(this, null, params);
}
Stack.Definition = {
  "type": "Stack",
  "metadata": {"modifies": true},
  "params": [
    { "name": "field", "type": "field" },
    { "name": "groupby", "type": "field", "array": true },
    { "name": "sort", "type": "compare" },
    { "name": "offset", "type": "enum", "default": "zero", "values": ["zero", "center", "normalize"] },
    { "name": "as", "type": "string", "array": true, "length": 2, "default": ["y0", "y1"] }
  ]
};
var prototype$_ = inherits(Stack, Transform);
prototype$_.transform = function(_$$1, pulse) {
  var as = _$$1.as || ['y0', 'y1'],
      y0 = as[0],
      y1 = as[1],
      field$$1 = _$$1.field || one,
      stack = _$$1.offset === Center ? stackCenter
            : _$$1.offset === Normalize ? stackNormalize
            : stackZero,
      groups, i, n, max$$1;
  groups = partition$2(pulse.source, _$$1.groupby, _$$1.sort, field$$1);
  for (i=0, n=groups.length, max$$1=groups.max; i<n; ++i) {
    stack(groups[i], max$$1, field$$1, y0, y1);
  }
  return pulse.reflow(_$$1.modified()).modifies(as);
};
function stackCenter(group, max$$1, field$$1, y0, y1) {
  var last = (max$$1 - group.sum) / 2,
      m = group.length,
      j = 0, t;
  for (; j<m; ++j) {
    t = group[j];
    t[y0] = last;
    t[y1] = (last += Math.abs(field$$1(t)));
  }
}
function stackNormalize(group, max$$1, field$$1, y0, y1) {
  var scale = 1 / group.sum,
      last = 0,
      m = group.length,
      j = 0, v = 0, t;
  for (; j<m; ++j) {
    t = group[j];
    t[y0] = last;
    t[y1] = last = scale * (v += Math.abs(field$$1(t)));
  }
}
function stackZero(group, max$$1, field$$1, y0, y1) {
  var lastPos = 0,
      lastNeg = 0,
      m = group.length,
      j = 0, v, t;
  for (; j<m; ++j) {
    t = group[j];
    v = field$$1(t);
    if (v < 0) {
      t[y0] = lastNeg;
      t[y1] = (lastNeg += v);
    } else {
      t[y0] = lastPos;
      t[y1] = (lastPos += v);
    }
  }
}
function partition$2(data, groupby, sort, field$$1) {
  var groups = [],
      get = function(f) { return f(t); },
      map, i, n, m, t, k, g, s, max$$1;
  if (groupby == null) {
    groups.push(data.slice());
  } else {
    for (map={}, i=0, n=data.length; i<n; ++i) {
      t = data[i];
      k = groupby.map(get);
      g = map[k];
      if (!g) {
        map[k] = (g = []);
        groups.push(g);
      }
      g.push(t);
    }
  }
  for (k=0, max$$1=0, m=groups.length; k<m; ++k) {
    g = groups[k];
    for (i=0, s=0, n=g.length; i<n; ++i) {
      s += Math.abs(field$$1(g[i]));
    }
    g.sum = s;
    if (s > max$$1) max$$1 = s;
    if (sort) g.sort(sort);
  }
  groups.max = max$$1;
  return groups;
}



var encode = /*#__PURE__*/Object.freeze({
  axisticks: AxisTicks,
  datajoin: DataJoin,
  encode: Encode,
  legendentries: LegendEntries,
  linkpath: LinkPath,
  pie: Pie,
  scale: Scale,
  sortitems: SortItems,
  stack: Stack,
  validTicks: validTicks
});

var CONTOUR_PARAMS = ['size', 'smooth'];
var DENSITY_PARAMS = ['x', 'y', 'size', 'cellSize', 'bandwidth'];
function Contour(params) {
  Transform.call(this, null, params);
}
Contour.Definition = {
  "type": "Contour",
  "metadata": {"generates": true},
  "params": [
    { "name": "size", "type": "number", "array": true, "length": 2, "required": true },
    { "name": "values", "type": "number", "array": true },
    { "name": "x", "type": "field" },
    { "name": "y", "type": "field" },
    { "name": "cellSize", "type": "number" },
    { "name": "bandwidth", "type": "number" },
    { "name": "count", "type": "number" },
    { "name": "smooth", "type": "boolean" },
    { "name": "nice", "type": "boolean", "default": false },
    { "name": "thresholds", "type": "number", "array": true }
  ]
};
var prototype$10 = inherits(Contour, Transform);
prototype$10.transform = function(_$$1, pulse) {
  if (this.value && !pulse.changed() && !_$$1.modified())
    return pulse.StopPropagation;
  var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
      count = _$$1.count || 10,
      contour, params, values;
  if (_$$1.values) {
    contour = contours();
    params = CONTOUR_PARAMS;
    values = _$$1.values;
  } else {
    contour = contourDensity();
    params = DENSITY_PARAMS;
    values = pulse.materialize(pulse.SOURCE).source;
  }
  contour.thresholds(_$$1.thresholds || (_$$1.nice ? count : quantize$2(count)));
  params.forEach(function(param) {
    if (_$$1[param] != null) contour[param](_$$1[param]);
  });
  if (this.value) out.rem = this.value;
  values = values && values.length ? contour(values).map(ingest) : [];
  this.value = out.source = out.add = values;
  return out;
};
function quantize$2(k) {
  return function(values) {
    var ex = extent(values), x0 = ex[0], dx = ex[1] - x0,
        t = [], i = 1;
    for (; i<=k; ++i) t.push(x0 + dx * i / (k + 1));
    return t;
  };
}

var Feature = 'Feature';
var FeatureCollection = 'FeatureCollection';
var MultiPoint = 'MultiPoint';

function GeoJSON(params) {
  Transform.call(this, null, params);
}
GeoJSON.Definition = {
  "type": "GeoJSON",
  "metadata": {},
  "params": [
    { "name": "fields", "type": "field", "array": true, "length": 2 },
    { "name": "geojson", "type": "field" },
  ]
};
var prototype$11 = inherits(GeoJSON, Transform);
prototype$11.transform = function(_$$1, pulse) {
  var features = this._features,
      points = this._points,
      fields = _$$1.fields,
      lon = fields && fields[0],
      lat = fields && fields[1],
      geojson = _$$1.geojson,
      flag = pulse.ADD,
      mod;
  mod = _$$1.modified()
    || pulse.changed(pulse.REM)
    || pulse.modified(accessorFields(geojson))
    || (lon && (pulse.modified(accessorFields(lon))))
    || (lat && (pulse.modified(accessorFields(lat))));
  if (!this.value || mod) {
    flag = pulse.SOURCE;
    this._features = (features = []);
    this._points = (points = []);
  }
  if (geojson) {
    pulse.visit(flag, function(t) {
      features.push(geojson(t));
    });
  }
  if (lon && lat) {
    pulse.visit(flag, function(t) {
      var x = lon(t),
          y = lat(t);
      if (x != null && y != null && (x = +x) === x && (y = +y) === y) {
        points.push([x, y]);
      }
    });
    features = features.concat({
      type: Feature,
      geometry: {
        type: MultiPoint,
        coordinates: points
      }
    });
  }
  this.value = {
    type: FeatureCollection,
    features: features
  };
};

var defaultPath = geoPath();
var projectionProperties = [
  'clipAngle',
  'clipExtent',
  'scale',
  'translate',
  'center',
  'rotate',
  'parallels',
  'precision',
  'reflectX',
  'reflectY',
  'coefficient',
  'distance',
  'fraction',
  'lobes',
  'parallel',
  'radius',
  'ratio',
  'spacing',
  'tilt'
];
function create$1(type, constructor) {
  return function projection() {
    var p = constructor();
    p.type = type;
    p.path = geoPath().projection(p);
    p.copy = p.copy || function() {
      var c = projection();
      projectionProperties.forEach(function(prop) {
        if (p.hasOwnProperty(prop)) c[prop](p[prop]());
      });
      c.path.pointRadius(p.path.pointRadius());
      return c;
    };
    return p;
  };
}
function projection(type, proj) {
  if (!type || typeof type !== 'string') {
    throw new Error('Projection type must be a name string.');
  }
  type = type.toLowerCase();
  if (arguments.length > 1) {
    projections[type] = create$1(type, proj);
    return this;
  } else {
    return projections.hasOwnProperty(type) ? projections[type] : null;
  }
}
function getProjectionPath(proj) {
  return (proj && proj.path) || defaultPath;
}
var projections = {
  albers:               geoAlbers,
  albersusa:            geoAlbersUsa,
  azimuthalequalarea:   geoAzimuthalEqualArea,
  azimuthalequidistant: geoAzimuthalEquidistant,
  conicconformal:       geoConicConformal,
  conicequalarea:       geoConicEqualArea,
  conicequidistant:     geoConicEquidistant,
  equirectangular:      geoEquirectangular,
  gnomonic:             geoGnomonic,
  identity:             geoIdentity,
  mercator:             geoMercator,
  naturalEarth1:        geoNaturalEarth1,
  orthographic:         geoOrthographic,
  stereographic:        geoStereographic,
  transversemercator:   geoTransverseMercator
};
for (var key$2 in projections) {
  projection(key$2, projections[key$2]);
}

function GeoPath(params) {
  Transform.call(this, null, params);
}
GeoPath.Definition = {
  "type": "GeoPath",
  "metadata": {"modifies": true},
  "params": [
    { "name": "projection", "type": "projection" },
    { "name": "field", "type": "field" },
    { "name": "pointRadius", "type": "number", "expr": true },
    { "name": "as", "type": "string", "default": "path" }
  ]
};
var prototype$12 = inherits(GeoPath, Transform);
prototype$12.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.ALL),
      path$$1 = this.value,
      field$$1 = _$$1.field || identity,
      as = _$$1.as || 'path',
      flag = out.SOURCE;
  function set(t) { t[as] = path$$1(field$$1(t)); }
  if (!path$$1 || _$$1.modified()) {
    this.value = path$$1 = getProjectionPath(_$$1.projection);
    out.materialize().reflow();
  } else {
    flag = field$$1 === identity || pulse.modified(field$$1.fields)
      ? out.ADD_MOD
      : out.ADD;
  }
  var prev = initPath(path$$1, _$$1.pointRadius);
  out.visit(flag, set);
  path$$1.pointRadius(prev);
  return out.modifies(as);
};
function initPath(path$$1, pointRadius) {
  var prev = path$$1.pointRadius();
  path$$1.context(null);
  if (pointRadius != null) {
    path$$1.pointRadius(pointRadius);
  }
  return prev;
}

function GeoPoint(params) {
  Transform.call(this, null, params);
}
GeoPoint.Definition = {
  "type": "GeoPoint",
  "metadata": {"modifies": true},
  "params": [
    { "name": "projection", "type": "projection", "required": true },
    { "name": "fields", "type": "field", "array": true, "required": true, "length": 2 },
    { "name": "as", "type": "string", "array": true, "length": 2, "default": ["x", "y"] }
  ]
};
var prototype$13 = inherits(GeoPoint, Transform);
prototype$13.transform = function(_$$1, pulse) {
  var proj = _$$1.projection,
      lon = _$$1.fields[0],
      lat = _$$1.fields[1],
      as = _$$1.as || ['x', 'y'],
      x = as[0],
      y = as[1],
      mod;
  function set(t) {
    var xy = proj([lon(t), lat(t)]);
    if (xy) {
      t[x] = xy[0];
      t[y] = xy[1];
    } else {
      t[x] = undefined;
      t[y] = undefined;
    }
  }
  if (_$$1.modified()) {
    pulse = pulse.materialize().reflow(true).visit(pulse.SOURCE, set);
  } else {
    mod = pulse.modified(lon.fields) || pulse.modified(lat.fields);
    pulse.visit(mod ? pulse.ADD_MOD : pulse.ADD, set);
  }
  return pulse.modifies(as);
};

function GeoShape(params) {
  Transform.call(this, null, params);
}
GeoShape.Definition = {
  "type": "GeoShape",
  "metadata": {"modifies": true},
  "params": [
    { "name": "projection", "type": "projection" },
    { "name": "field", "type": "field", "default": "datum" },
    { "name": "pointRadius", "type": "number", "expr": true },
    { "name": "as", "type": "string", "default": "shape" }
  ]
};
var prototype$14 = inherits(GeoShape, Transform);
prototype$14.transform = function(_$$1, pulse) {
  var out = pulse.fork(pulse.ALL),
      shape = this.value,
      datum = _$$1.field || field('datum'),
      as = _$$1.as || 'shape',
      flag = out.ADD_MOD;
  if (!shape || _$$1.modified()) {
    this.value = shape = shapeGenerator(
      getProjectionPath(_$$1.projection),
      datum,
      _$$1.pointRadius
    );
    out.materialize().reflow();
    flag = out.SOURCE;
  }
  out.visit(flag, function(t) { t[as] = shape; });
  return out.modifies(as);
};
function shapeGenerator(path$$1, field$$1, pointRadius) {
  var shape = pointRadius == null
    ? function(_$$1) { return path$$1(field$$1(_$$1)); }
    : function(_$$1) {
      var prev = path$$1.pointRadius(),
          value = path$$1.pointRadius(pointRadius)(field$$1(_$$1));
      path$$1.pointRadius(prev);
      return value;
    };
  shape.context = function(_$$1) {
    path$$1.context(_$$1);
    return shape;
  };
  return shape;
}

function Graticule(params) {
  Transform.call(this, [], params);
  this.generator = geoGraticule();
}
Graticule.Definition = {
  "type": "Graticule",
  "metadata": {"changes": true},
  "params": [
    { "name": "extent", "type": "array", "array": true, "length": 2,
      "content": {"type": "number", "array": true, "length": 2} },
    { "name": "extentMajor", "type": "array", "array": true, "length": 2,
      "content": {"type": "number", "array": true, "length": 2} },
    { "name": "extentMinor", "type": "array", "array": true, "length": 2,
      "content": {"type": "number", "array": true, "length": 2} },
    { "name": "step", "type": "number", "array": true, "length": 2 },
    { "name": "stepMajor", "type": "number", "array": true, "length": 2, "default": [90, 360] },
    { "name": "stepMinor", "type": "number", "array": true, "length": 2, "default": [10, 10] },
    { "name": "precision", "type": "number", "default": 2.5 }
  ]
};
var prototype$15 = inherits(Graticule, Transform);
prototype$15.transform = function(_$$1, pulse) {
  var src = this.value,
      gen = this.generator, t;
  if (!src.length || _$$1.modified()) {
    for (var prop in _$$1) {
      if (isFunction(gen[prop])) {
        gen[prop](_$$1[prop]);
      }
    }
  }
  t = gen();
  if (src.length) {
    pulse.mod.push(replace(src[0], t));
  } else {
    pulse.add.push(ingest(t));
  }
  src[0] = t;
  return pulse;
};

function Projection(params) {
  Transform.call(this, null, params);
  this.modified(true);
}
var prototype$16 = inherits(Projection, Transform);
prototype$16.transform = function(_$$1, pulse) {
  var proj = this.value;
  if (!proj || _$$1.modified('type')) {
    this.value = (proj = create$2(_$$1.type));
    projectionProperties.forEach(function(prop) {
      if (_$$1[prop] != null) set$1(proj, prop, _$$1[prop]);
    });
  } else {
    projectionProperties.forEach(function(prop) {
      if (_$$1.modified(prop)) set$1(proj, prop, _$$1[prop]);
    });
  }
  if (_$$1.pointRadius != null) proj.path.pointRadius(_$$1.pointRadius);
  if (_$$1.fit) fit(proj, _$$1);
  return pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
};
function fit(proj, _$$1) {
  var data = collectGeoJSON(_$$1.fit);
  _$$1.extent ? proj.fitExtent(_$$1.extent, data)
    : _$$1.size ? proj.fitSize(_$$1.size, data) : 0;
}
function create$2(type) {
  var constructor = projection((type || 'mercator').toLowerCase());
  if (!constructor) error('Unrecognized projection type: ' + type);
  return constructor();
}
function set$1(proj, key$$1, value) {
   if (isFunction(proj[key$$1])) proj[key$$1](value);
}
function collectGeoJSON(features) {
  features = array(features);
  return features.length === 1
    ? features[0]
    : {
        type: FeatureCollection,
        features: features.reduce(function(list, f) {
            (f && f.type === FeatureCollection) ? list.push.apply(list, f.features)
              : isArray(f) ? list.push.apply(list, f)
              : list.push(f);
            return list;
          }, [])
      };
}



var geo = /*#__PURE__*/Object.freeze({
  contour: Contour,
  geojson: GeoJSON,
  geopath: GeoPath,
  geopoint: GeoPoint,
  geoshape: GeoShape,
  graticule: Graticule,
  projection: Projection
});

var ForceMap = {
  center: forceCenter,
  collide: forceCollide,
  nbody: forceManyBody,
  link: forceLink,
  x: forceX,
  y: forceY
};
var Forces = 'forces',
    ForceParams = [
      'alpha', 'alphaMin', 'alphaTarget',
      'velocityDecay', 'forces'
    ],
    ForceConfig = ['static', 'iterations'],
    ForceOutput = ['x', 'y', 'vx', 'vy'];
function Force(params) {
  Transform.call(this, null, params);
}
Force.Definition = {
  "type": "Force",
  "metadata": {"modifies": true},
  "params": [
    { "name": "static", "type": "boolean", "default": false },
    { "name": "restart", "type": "boolean", "default": false },
    { "name": "iterations", "type": "number", "default": 300 },
    { "name": "alpha", "type": "number", "default": 1 },
    { "name": "alphaMin", "type": "number", "default": 0.001 },
    { "name": "alphaTarget", "type": "number", "default": 0 },
    { "name": "velocityDecay", "type": "number", "default": 0.4 },
    { "name": "forces", "type": "param", "array": true,
      "params": [
        {
          "key": {"force": "center"},
          "params": [
            { "name": "x", "type": "number", "default": 0 },
            { "name": "y", "type": "number", "default": 0 }
          ]
        },
        {
          "key": {"force": "collide"},
          "params": [
            { "name": "radius", "type": "number", "expr": true },
            { "name": "strength", "type": "number", "default": 0.7 },
            { "name": "iterations", "type": "number", "default": 1 }
          ]
        },
        {
          "key": {"force": "nbody"},
          "params": [
            { "name": "strength", "type": "number", "default": -30 },
            { "name": "theta", "type": "number", "default": 0.9 },
            { "name": "distanceMin", "type": "number", "default": 1 },
            { "name": "distanceMax", "type": "number" }
          ]
        },
        {
          "key": {"force": "link"},
          "params": [
            { "name": "links", "type": "data" },
            { "name": "id", "type": "field" },
            { "name": "distance", "type": "number", "default": 30, "expr": true },
            { "name": "strength", "type": "number", "expr": true },
            { "name": "iterations", "type": "number", "default": 1 }
          ]
        },
        {
          "key": {"force": "x"},
          "params": [
            { "name": "strength", "type": "number", "default": 0.1 },
            { "name": "x", "type": "field" }
          ]
        },
        {
          "key": {"force": "y"},
          "params": [
            { "name": "strength", "type": "number", "default": 0.1 },
            { "name": "y", "type": "field" }
          ]
        }
      ] },
    {
      "name": "as", "type": "string", "array": true, "modify": false,
      "default": ForceOutput
    }
  ]
};
var prototype$17 = inherits(Force, Transform);
prototype$17.transform = function(_$$1, pulse) {
  var sim = this.value,
      change = pulse.changed(pulse.ADD_REM),
      params = _$$1.modified(ForceParams),
      iters = _$$1.iterations || 300;
  if (!sim) {
    this.value = sim = simulation(pulse.source, _$$1);
    sim.on('tick', rerun(pulse.dataflow, this));
    if (!_$$1.static) {
      change = true;
      sim.tick();
    }
    pulse.modifies('index');
  } else {
    if (change) {
      pulse.modifies('index');
      sim.nodes(pulse.source);
    }
    if (params || pulse.changed(pulse.MOD)) {
      setup(sim, _$$1, 0, pulse);
    }
  }
  if (params || change || _$$1.modified(ForceConfig)
      || (pulse.changed() && _$$1.restart))
  {
    sim.alpha(Math.max(sim.alpha(), _$$1.alpha || 1))
       .alphaDecay(1 - Math.pow(sim.alphaMin(), 1 / iters));
    if (_$$1.static) {
      for (sim.stop(); --iters >= 0;) sim.tick();
    } else {
      if (sim.stopped()) sim.restart();
      if (!change) return pulse.StopPropagation;
    }
  }
  return this.finish(_$$1, pulse);
};
prototype$17.finish = function(_$$1, pulse) {
  var dataflow = pulse.dataflow;
  for (var args=this._argops, j=0, m=args.length, arg; j<m; ++j) {
    arg = args[j];
    if (arg.name !== Forces || arg.op._argval.force !== 'link') {
      continue;
    }
    for (var ops=arg.op._argops, i=0, n=ops.length, op; i<n; ++i) {
      if (ops[i].name === 'links' && (op = ops[i].op.source)) {
        dataflow.pulse(op, dataflow.changeset().reflow());
        break;
      }
    }
  }
  return pulse.reflow(_$$1.modified()).modifies(ForceOutput);
};
function rerun(df, op) {
  return function() { df.touch(op).run(); }
}
function simulation(nodes, _$$1) {
  var sim = forceSimulation(nodes),
      stopped = false,
      stop = sim.stop,
      restart = sim.restart;
  sim.stopped = function() {
    return stopped;
  };
  sim.restart = function() {
    stopped = false;
    return restart();
  };
  sim.stop = function() {
    stopped = true;
    return stop();
  };
  return setup(sim, _$$1, true).on('end', function() { stopped = true; });
}
function setup(sim, _$$1, init, pulse) {
  var f = array(_$$1.forces), i, n, p, name;
  for (i=0, n=ForceParams.length; i<n; ++i) {
    p = ForceParams[i];
    if (p !== Forces && _$$1.modified(p)) sim[p](_$$1[p]);
  }
  for (i=0, n=f.length; i<n; ++i) {
    name = Forces + i;
    p = init || _$$1.modified(Forces, i) ? getForce(f[i])
      : pulse && modified(f[i], pulse) ? sim.force(name)
      : null;
    if (p) sim.force(name, p);
  }
  for (n=(sim.numForces || 0); i<n; ++i) {
    sim.force(Forces + i, null);
  }
  sim.numForces = f.length;
  return sim;
}
function modified(f, pulse) {
  var k, v;
  for (k in f) {
    if (isFunction(v = f[k]) && pulse.modified(accessorFields(v)))
      return 1;
  }
  return 0;
}
function getForce(_$$1) {
  var f, p;
  if (!ForceMap.hasOwnProperty(_$$1.force)) {
    error('Unrecognized force: ' + _$$1.force);
  }
  f = ForceMap[_$$1.force]();
  for (p in _$$1) {
    if (isFunction(f[p])) setForceParam(f[p], _$$1[p], _$$1);
  }
  return f;
}
function setForceParam(f, v, _$$1) {
  f(isFunction(v) ? function(d) { return v(d, _$$1); } : v);
}



var force = /*#__PURE__*/Object.freeze({
  force: Force
});

function Nest(params) {
  Transform.call(this, null, params);
}
Nest.Definition = {
  "type": "Nest",
  "metadata": {"treesource": true, "changes": true},
  "params": [
    { "name": "keys", "type": "field", "array": true },
    { "name": "key", "type": "field" },
    { "name": "generate", "type": "boolean" }
  ]
};
var prototype$18 = inherits(Nest, Transform);
function children(n) {
  return n.values;
}
prototype$18.transform = function(_$$1, pulse) {
  if (!pulse.source) {
    error('Nest transform requires an upstream data source.');
  }
  var key$$1 = _$$1.key || tupleid,
      gen = _$$1.generate,
      mod = _$$1.modified(),
      out = pulse.clone(),
      root, tree$$1, map;
  if (!this.value || mod || pulse.changed()) {
    if (gen && this.value) {
      this.value.each(function(node) {
        if (node.children) out.rem.push(node);
      });
    }
    root = array(_$$1.keys)
      .reduce(function(n, k) { n.key(k); return n; }, nest())
      .entries(out.source);
    this.value = tree$$1 = hierarchy({values: root}, children);
    if (gen) {
      tree$$1.each(function(node) {
        if (node.children) {
          node = ingest(node.data);
          out.add.push(node);
          out.source.push(node);
        }
      });
    }
    map = tree$$1.lookup = {};
    tree$$1.each(function(node) {
      if (tupleid(node.data) != null) {
        map[key$$1(node.data)] = node;
      }
    });
  }
  out.source.root = this.value;
  return out;
};

function HierarchyLayout(params) {
  Transform.call(this, null, params);
}
var prototype$19 = inherits(HierarchyLayout, Transform);
prototype$19.transform = function(_$$1, pulse) {
  if (!pulse.source || !pulse.source.root) {
    error(this.constructor.name
      + ' transform requires a backing tree data source.');
  }
  var layout = this.layout(_$$1.method),
      fields = this.fields,
      root = pulse.source.root,
      as = _$$1.as || fields;
  if (_$$1.field) root.sum(_$$1.field);
  if (_$$1.sort) root.sort(_$$1.sort);
  setParams(layout, this.params, _$$1);
  try {
    this.value = layout(root);
  } catch (err) {
    error(err);
  }
  root.each(function(node) { setFields(node, fields, as); });
  return pulse.reflow(_$$1.modified()).modifies(as).modifies('leaf');
};
function setParams(layout, params, _$$1) {
  for (var p, i=0, n=params.length; i<n; ++i) {
    p = params[i];
    if (p in _$$1) layout[p](_$$1[p]);
  }
}
function setFields(node, fields, as) {
  var t = node.data;
  for (var i=0, n=fields.length-1; i<n; ++i) {
    t[as[i]] = node[fields[i]];
  }
  t[as[n]] = node.children ? node.children.length : 0;
}

var Output = ['x', 'y', 'r', 'depth', 'children'];
function Pack(params) {
  HierarchyLayout.call(this, params);
}
Pack.Definition = {
  "type": "Pack",
  "metadata": {"tree": true, "modifies": true},
  "params": [
    { "name": "field", "type": "field" },
    { "name": "sort", "type": "compare" },
    { "name": "padding", "type": "number", "default": 0 },
    { "name": "radius", "type": "field", "default": null },
    { "name": "size", "type": "number", "array": true, "length": 2 },
    { "name": "as", "type": "string", "array": true, "length": 3, "default": Output }
  ]
};
var prototype$1a = inherits(Pack, HierarchyLayout);
prototype$1a.layout = pack;
prototype$1a.params = ['size', 'padding'];
prototype$1a.fields = Output;

var Output$1 = ["x0", "y0", "x1", "y1", "depth", "children"];
function Partition(params) {
  HierarchyLayout.call(this, params);
}
Partition.Definition = {
  "type": "Partition",
  "metadata": {"tree": true, "modifies": true},
  "params": [
    { "name": "field", "type": "field" },
    { "name": "sort", "type": "compare" },
    { "name": "padding", "type": "number", "default": 0 },
    { "name": "round", "type": "boolean", "default": false },
    { "name": "size", "type": "number", "array": true, "length": 2 },
    { "name": "as", "type": "string", "array": true, "length": 4, "default": Output$1 }
  ]
};
var prototype$1b = inherits(Partition, HierarchyLayout);
prototype$1b.layout = partition;
prototype$1b.params = ['size', 'round', 'padding'];
prototype$1b.fields = Output$1;

function Stratify(params) {
  Transform.call(this, null, params);
}
Stratify.Definition = {
  "type": "Stratify",
  "metadata": {"treesource": true},
  "params": [
    { "name": "key", "type": "field", "required": true },
    { "name": "parentKey", "type": "field", "required": true  }
  ]
};
var prototype$1c = inherits(Stratify, Transform);
prototype$1c.transform = function(_$$1, pulse) {
  if (!pulse.source) {
    error('Stratify transform requires an upstream data source.');
  }
  var mod = _$$1.modified(), tree$$1, map,
      out = pulse.fork(pulse.ALL).materialize(pulse.SOURCE),
      run = !this.value
         || mod
         || pulse.changed(pulse.ADD_REM)
         || pulse.modified(_$$1.key.fields)
         || pulse.modified(_$$1.parentKey.fields);
  out.source = out.source.slice();
  if (run) {
    tree$$1 = stratify().id(_$$1.key).parentId(_$$1.parentKey)(out.source);
    map = tree$$1.lookup = {};
    tree$$1.each(function(node) { map[_$$1.key(node.data)] = node; });
    this.value = tree$$1;
  }
  out.source.root = this.value;
  return out;
};

var Layouts = {
  tidy: tree,
  cluster: cluster
};
var Output$2 = ["x", "y", "depth", "children"];
function Tree(params) {
  HierarchyLayout.call(this, params);
}
Tree.Definition = {
  "type": "Tree",
  "metadata": {"tree": true, "modifies": true},
  "params": [
    { "name": "field", "type": "field" },
    { "name": "sort", "type": "compare" },
    { "name": "method", "type": "enum", "default": "tidy", "values": ["tidy", "cluster"] },
    { "name": "size", "type": "number", "array": true, "length": 2 },
    { "name": "nodeSize", "type": "number", "array": true, "length": 2 },
    { "name": "as", "type": "string", "array": true, "length": 4, "default": Output$2 }
  ]
};
var prototype$1d = inherits(Tree, HierarchyLayout);
prototype$1d.layout = function(method) {
  var m = method || 'tidy';
  if (Layouts.hasOwnProperty(m)) return Layouts[m]();
  else error('Unrecognized Tree layout method: ' + m);
};
prototype$1d.params = ['size', 'nodeSize', 'separation'];
prototype$1d.fields = Output$2;

function TreeLinks(params) {
  Transform.call(this, {}, params);
}
TreeLinks.Definition = {
  "type": "TreeLinks",
  "metadata": {"tree": true, "generates": true, "changes": true},
  "params": [
    { "name": "key", "type": "field" }
  ]
};
var prototype$1e = inherits(TreeLinks, Transform);
function parentTuple(node) {
  var p;
  return node.parent
      && (p=node.parent.data)
      && (tupleid(p) != null) && p;
}
prototype$1e.transform = function(_$$1, pulse) {
  if (!pulse.source || !pulse.source.root) {
    error('TreeLinks transform requires a backing tree data source.');
  }
  var root = pulse.source.root,
      nodes = root.lookup,
      links = this.value,
      key$$1 = _$$1.key || tupleid,
      mods = {},
      out = pulse.fork();
  function modify(id$$1) {
    var link = links[id$$1];
    if (link) {
      mods[id$$1] = 1;
      out.mod.push(link);
    }
  }
  pulse.visit(pulse.REM, function(t) {
    var id$$1 = key$$1(t),
        link = links[id$$1];
    if (link) {
      delete links[id$$1];
      out.rem.push(link);
    }
  });
  pulse.visit(pulse.ADD, function(t) {
    var id$$1 = key$$1(t), p;
    if (p = parentTuple(nodes[id$$1])) {
      out.add.push(links[id$$1] = ingest({source: p, target: t}));
      mods[id$$1] = 1;
    }
  });
  pulse.visit(pulse.MOD, function(t) {
    var id$$1 = key$$1(t),
        node = nodes[id$$1],
        kids = node.children;
    modify(id$$1);
    if (kids) for (var i=0, n=kids.length; i<n; ++i) {
      if (!mods[(id$$1=key$$1(kids[i].data))]) modify(id$$1);
    }
  });
  return out;
};

var Tiles = {
  binary: treemapBinary,
  dice: treemapDice,
  slice: treemapSlice,
  slicedice: treemapSliceDice,
  squarify: treemapSquarify,
  resquarify: treemapResquarify
};
var Output$3 = ["x0", "y0", "x1", "y1", "depth", "children"];
function Treemap(params) {
  HierarchyLayout.call(this, params);
}
Treemap.Definition = {
  "type": "Treemap",
  "metadata": {"tree": true, "modifies": true},
  "params": [
    { "name": "field", "type": "field" },
    { "name": "sort", "type": "compare" },
    { "name": "method", "type": "enum", "default": "squarify",
      "values": ["squarify", "resquarify", "binary", "dice", "slice", "slicedice"] },
    { "name": "padding", "type": "number", "default": 0 },
    { "name": "paddingInner", "type": "number", "default": 0 },
    { "name": "paddingOuter", "type": "number", "default": 0 },
    { "name": "paddingTop", "type": "number", "default": 0 },
    { "name": "paddingRight", "type": "number", "default": 0 },
    { "name": "paddingBottom", "type": "number", "default": 0 },
    { "name": "paddingLeft", "type": "number", "default": 0 },
    { "name": "ratio", "type": "number", "default": 1.618033988749895 },
    { "name": "round", "type": "boolean", "default": false },
    { "name": "size", "type": "number", "array": true, "length": 2 },
    { "name": "as", "type": "string", "array": true, "length": 4, "default": Output$3 }
  ]
};
var prototype$1f = inherits(Treemap, HierarchyLayout);
prototype$1f.layout = function() {
  var x = treemap();
  x.ratio = function(_$$1) {
    var t = x.tile();
    if (t.ratio) x.tile(t.ratio(_$$1));
  };
  x.method = function(_$$1) {
    if (Tiles.hasOwnProperty(_$$1)) x.tile(Tiles[_$$1]);
    else error('Unrecognized Treemap layout method: ' + _$$1);
  };
  return x;
};
prototype$1f.params = [
  'method', 'ratio', 'size', 'round',
  'padding', 'paddingInner', 'paddingOuter',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'
];
prototype$1f.fields = Output$3;



var tree$1 = /*#__PURE__*/Object.freeze({
  nest: Nest,
  pack: Pack,
  partition: Partition,
  stratify: Stratify,
  tree: Tree,
  treelinks: TreeLinks,
  treemap: Treemap
});

function Voronoi(params) {
  Transform.call(this, null, params);
}
Voronoi.Definition = {
  "type": "Voronoi",
  "metadata": {"modifies": true},
  "params": [
    { "name": "x", "type": "field", "required": true },
    { "name": "y", "type": "field", "required": true },
    { "name": "size", "type": "number", "array": true, "length": 2 },
    { "name": "extent", "type": "array", "array": true, "length": 2,
      "default": [[-1e5, -1e5], [1e5, 1e5]],
      "content": {"type": "number", "array": true, "length": 2} },
    { "name": "as", "type": "string", "default": "path" }
  ]
};
var prototype$1g = inherits(Voronoi, Transform);
var defaultExtent = [[-1e5, -1e5], [1e5, 1e5]];
prototype$1g.transform = function(_$$1, pulse) {
  var as = _$$1.as || 'path',
      data = pulse.source,
      diagram, polygons, i, n;
  diagram = voronoi().x(_$$1.x).y(_$$1.y);
  if (_$$1.size) diagram.size(_$$1.size);
  else diagram.extent(_$$1.extent || defaultExtent);
  this.value = (diagram = diagram(data));
  polygons = diagram.polygons();
  for (i=0, n=data.length; i<n; ++i) {
    data[i][as] = polygons[i]
      ? 'M' + polygons[i].join('L') + 'Z'
      : null;
  }
  return pulse.reflow(_$$1.modified()).modifies(as);
};



var voronoi$1 = /*#__PURE__*/Object.freeze({
  voronoi: Voronoi
});

var cloudRadians = Math.PI / 180,
    cw = 1 << 11 >> 5,
    ch = 1 << 11;
function cloud() {
  var size = [256, 256],
      text,
      font,
      fontSize,
      fontStyle,
      fontWeight,
      rotate,
      padding,
      spiral = archimedeanSpiral,
      words = [],
      random = Math.random,
      cloud = {};
  cloud.layout = function() {
    var contextAndRatio = getContext(canvas()),
        board = zeroArray((size[0] >> 5) * size[1]),
        bounds = null,
        n = words.length,
        i = -1,
        tags = [],
        data = words.map(function(d) {
          return {
            text: text(d),
            font: font(d),
            style: fontStyle(d),
            weight: fontWeight(d),
            rotate: rotate(d),
            size: ~~fontSize(d),
            padding: padding(d),
            xoff: 0,
            yoff: 0,
            x1: 0,
            y1: 0,
            x0: 0,
            y0: 0,
            hasText: false,
            sprite: null,
            datum: d
          };
        }).sort(function(a, b) { return b.size - a.size; });
    while (++i < n) {
      var d = data[i];
      d.x = (size[0] * (random() + .5)) >> 1;
      d.y = (size[1] * (random() + .5)) >> 1;
      cloudSprite(contextAndRatio, d, data, i);
      if (d.hasText && place(board, d, bounds)) {
        tags.push(d);
        if (bounds) cloudBounds(bounds, d);
        else bounds = [{x: d.x + d.x0, y: d.y + d.y0}, {x: d.x + d.x1, y: d.y + d.y1}];
        d.x -= size[0] >> 1;
        d.y -= size[1] >> 1;
      }
    }
    return tags;
  };
  function getContext(canvas$$1) {
    canvas$$1.width = canvas$$1.height = 1;
    var ratio = Math.sqrt(canvas$$1.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
    canvas$$1.width = (cw << 5) / ratio;
    canvas$$1.height = ch / ratio;
    var context = canvas$$1.getContext("2d");
    context.fillStyle = context.strokeStyle = "red";
    context.textAlign = "center";
    return {context: context, ratio: ratio};
  }
  function place(board, tag, bounds) {
    var startX = tag.x,
        startY = tag.y,
        maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
        s = spiral(size),
        dt = random() < .5 ? 1 : -1,
        t = -dt,
        dxdy,
        dx,
        dy;
    while (dxdy = s(t += dt)) {
      dx = ~~dxdy[0];
      dy = ~~dxdy[1];
      if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta) break;
      tag.x = startX + dx;
      tag.y = startY + dy;
      if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
          tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue;
      if (!bounds || !cloudCollide(tag, board, size[0])) {
        if (!bounds || collideRects(tag, bounds)) {
          var sprite = tag.sprite,
              w = tag.width >> 5,
              sw = size[0] >> 5,
              lx = tag.x - (w << 4),
              sx = lx & 0x7f,
              msx = 32 - sx,
              h = tag.y1 - tag.y0,
              x = (tag.y + tag.y0) * sw + (lx >> 5),
              last;
          for (var j = 0; j < h; j++) {
            last = 0;
            for (var i = 0; i <= w; i++) {
              board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
            }
            x += sw;
          }
          tag.sprite = null;
          return true;
        }
      }
    }
    return false;
  }
  cloud.words = function(_$$1) {
    if (arguments.length) {
      words = _$$1;
      return cloud;
    } else {
      return words;
    }
  };
  cloud.size = function(_$$1) {
    if (arguments.length) {
      size = [+_$$1[0], +_$$1[1]];
      return cloud;
    } else {
      return size;
    }
  };
  cloud.font = function(_$$1) {
    if (arguments.length) {
      font = functor(_$$1);
      return cloud;
    } else {
      return font;
    }
  };
  cloud.fontStyle = function(_$$1) {
    if (arguments.length) {
      fontStyle = functor(_$$1);
      return cloud;
    } else {
      return fontStyle;
    }
  };
  cloud.fontWeight = function(_$$1) {
    if (arguments.length) {
      fontWeight = functor(_$$1);
      return cloud;
    } else {
      return fontWeight;
    }
  };
  cloud.rotate = function(_$$1) {
    if (arguments.length) {
      rotate = functor(_$$1);
      return cloud;
    } else {
      return rotate;
    }
  };
  cloud.text = function(_$$1) {
    if (arguments.length) {
      text = functor(_$$1);
      return cloud;
    } else {
      return text;
    }
  };
  cloud.spiral = function(_$$1) {
    if (arguments.length) {
      spiral = spirals[_$$1] || _$$1;
      return cloud;
    } else {
      return spiral;
    }
  };
  cloud.fontSize = function(_$$1) {
    if (arguments.length) {
      fontSize = functor(_$$1);
      return cloud;
    } else {
      return fontSize;
    }
  };
  cloud.padding = function(_$$1) {
    if (arguments.length) {
      padding = functor(_$$1);
      return cloud;
    } else {
      return padding;
    }
  };
  cloud.random = function(_$$1) {
    if (arguments.length) {
      random = _$$1;
      return cloud;
    } else {
      return random;
    }
  };
  return cloud;
}
function cloudSprite(contextAndRatio, d, data, di) {
  if (d.sprite) return;
  var c = contextAndRatio.context,
      ratio = contextAndRatio.ratio;
  c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
  var x = 0,
      y = 0,
      maxh = 0,
      n = data.length,
      w, w32, h, i, j;
  --di;
  while (++di < n) {
    d = data[di];
    c.save();
    c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
    w = c.measureText(d.text + "m").width * ratio;
    h = d.size << 1;
    if (d.rotate) {
      var sr = Math.sin(d.rotate * cloudRadians),
          cr = Math.cos(d.rotate * cloudRadians),
          wcr = w * cr,
          wsr = w * sr,
          hcr = h * cr,
          hsr = h * sr;
      w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
      h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
    } else {
      w = (w + 0x1f) >> 5 << 5;
    }
    if (h > maxh) maxh = h;
    if (x + w >= (cw << 5)) {
      x = 0;
      y += maxh;
      maxh = 0;
    }
    if (y + h >= ch) break;
    c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
    if (d.rotate) c.rotate(d.rotate * cloudRadians);
    c.fillText(d.text, 0, 0);
    if (d.padding) {
      c.lineWidth = 2 * d.padding;
      c.strokeText(d.text, 0, 0);
    }
    c.restore();
    d.width = w;
    d.height = h;
    d.xoff = x;
    d.yoff = y;
    d.x1 = w >> 1;
    d.y1 = h >> 1;
    d.x0 = -d.x1;
    d.y0 = -d.y1;
    d.hasText = true;
    x += w;
  }
  var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
      sprite = [];
  while (--di >= 0) {
    d = data[di];
    if (!d.hasText) continue;
    w = d.width;
    w32 = w >> 5;
    h = d.y1 - d.y0;
    for (i = 0; i < h * w32; i++) sprite[i] = 0;
    x = d.xoff;
    if (x == null) return;
    y = d.yoff;
    var seen = 0,
        seenRow = -1;
    for (j = 0; j < h; j++) {
      for (i = 0; i < w; i++) {
        var k = w32 * j + (i >> 5),
            m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
        sprite[k] |= m;
        seen |= m;
      }
      if (seen) seenRow = j;
      else {
        d.y0++;
        h--;
        j--;
        y++;
      }
    }
    d.y1 = d.y0 + seenRow;
    d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
  }
}
function cloudCollide(tag, board, sw) {
  sw >>= 5;
  var sprite = tag.sprite,
      w = tag.width >> 5,
      lx = tag.x - (w << 4),
      sx = lx & 0x7f,
      msx = 32 - sx,
      h = tag.y1 - tag.y0,
      x = (tag.y + tag.y0) * sw + (lx >> 5),
      last;
  for (var j = 0; j < h; j++) {
    last = 0;
    for (var i = 0; i <= w; i++) {
      if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))
          & board[x + i]) return true;
    }
    x += sw;
  }
  return false;
}
function cloudBounds(bounds, d) {
  var b0 = bounds[0],
      b1 = bounds[1];
  if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
  if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
  if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
  if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
}
function collideRects(a, b) {
  return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
}
function archimedeanSpiral(size) {
  var e = size[0] / size[1];
  return function(t) {
    return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
  };
}
function rectangularSpiral(size) {
  var dy = 4,
      dx = dy * size[0] / size[1],
      x = 0,
      y = 0;
  return function(t) {
    var sign = t < 0 ? -1 : 1;
    switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
      case 0:  x += dx; break;
      case 1:  y += dy; break;
      case 2:  x -= dx; break;
      default: y -= dy; break;
    }
    return [x, y];
  };
}
function zeroArray(n) {
  var a = [],
      i = -1;
  while (++i < n) a[i] = 0;
  return a;
}
function functor(d) {
  return typeof d === "function" ? d : function() { return d; };
}
var spirals = {
  archimedean: archimedeanSpiral,
  rectangular: rectangularSpiral
};

var Output$4 = ['x', 'y', 'font', 'fontSize', 'fontStyle', 'fontWeight', 'angle'];
var Params$1 = ['text', 'font', 'rotate', 'fontSize', 'fontStyle', 'fontWeight'];
function Wordcloud(params) {
  Transform.call(this, cloud(), params);
}
Wordcloud.Definition = {
  "type": "Wordcloud",
  "metadata": {"modifies": true},
  "params": [
    { "name": "size", "type": "number", "array": true, "length": 2 },
    { "name": "font", "type": "string", "expr": true, "default": "sans-serif" },
    { "name": "fontStyle", "type": "string", "expr": true, "default": "normal" },
    { "name": "fontWeight", "type": "string", "expr": true, "default": "normal" },
    { "name": "fontSize", "type": "number", "expr": true, "default": 14 },
    { "name": "fontSizeRange", "type": "number", "array": "nullable", "default": [10, 50] },
    { "name": "rotate", "type": "number", "expr": true, "default": 0 },
    { "name": "text", "type": "field" },
    { "name": "spiral", "type": "string", "values": ["archimedean", "rectangular"] },
    { "name": "padding", "type": "number", "expr": true },
    { "name": "as", "type": "string", "array": true, "length": 7, "default": Output$4 }
  ]
};
var prototype$1h = inherits(Wordcloud, Transform);
prototype$1h.transform = function(_$$1, pulse) {
  function modp(param) {
    var p = _$$1[param];
    return isFunction(p) && pulse.modified(p.fields);
  }
  var mod = _$$1.modified();
  if (!(mod || pulse.changed(pulse.ADD_REM) || Params$1.some(modp))) return;
  var data = pulse.materialize(pulse.SOURCE).source,
      layout = this.value,
      as = _$$1.as || Output$4,
      fontSize = _$$1.fontSize || 14,
      range$$1;
  isFunction(fontSize)
    ? (range$$1 = _$$1.fontSizeRange)
    : (fontSize = constant(fontSize));
  if (range$$1) {
    var fsize = fontSize,
        sizeScale = scale$1('sqrt')()
          .domain(extent$1(fsize, data))
          .range(range$$1);
    fontSize = function(x) { return sizeScale(fsize(x)); };
  }
  data.forEach(function(t) {
    t[as[0]] = NaN;
    t[as[1]] = NaN;
    t[as[3]] = 0;
  });
  var words = layout
    .words(data)
    .text(_$$1.text)
    .size(_$$1.size || [500, 500])
    .padding(_$$1.padding || 1)
    .spiral(_$$1.spiral || 'archimedean')
    .rotate(_$$1.rotate || 0)
    .font(_$$1.font || 'sans-serif')
    .fontStyle(_$$1.fontStyle || 'normal')
    .fontWeight(_$$1.fontWeight || 'normal')
    .fontSize(fontSize)
    .random(random)
    .layout();
  var size = layout.size(),
      dx = size[0] >> 1,
      dy = size[1] >> 1,
      i = 0,
      n = words.length,
      w, t;
  for (; i<n; ++i) {
    w = words[i];
    t = w.datum;
    t[as[0]] = w.x + dx;
    t[as[1]] = w.y + dy;
    t[as[2]] = w.font;
    t[as[3]] = w.size;
    t[as[4]] = w.style;
    t[as[5]] = w.weight;
    t[as[6]] = w.rotate;
  }
  return pulse.reflow(mod).modifies(as);
};
function extent$1(field$$1, data) {
  var min$$1 = +Infinity,
      max$$1 = -Infinity,
      i = 0,
      n = data.length,
      v;
  for (; i<n; ++i) {
    v = field$$1(data[i]);
    if (v < min$$1) min$$1 = v;
    if (v > max$$1) max$$1 = v;
  }
  return [min$$1, max$$1];
}



var wordcloud = /*#__PURE__*/Object.freeze({
  wordcloud: Wordcloud
});

function array8(n) { return new Uint8Array(n); }
function array16(n) { return new Uint16Array(n); }
function array32(n) { return new Uint32Array(n); }

function Bitmaps() {
  var width = 8,
      data = [],
      seen = array32(0),
      curr = array$1(0, width),
      prev = array$1(0, width);
  return {
    data: function() { return data; },
    seen: function() {
      return (seen = lengthen(seen, data.length));
    },
    add: function(array) {
      for (var i=0, j=data.length, n=array.length, t; i<n; ++i) {
        t = array[i];
        t._index = j++;
        data.push(t);
      }
    },
    remove: function(num, map) {
      var n = data.length,
          copy = Array(n - num),
          reindex = data,
          t, i, j;
      for (i=0; !map[i] && i<n; ++i) {
        copy[i] = data[i];
        reindex[i] = i;
      }
      for (j=i; i<n; ++i) {
        t = data[i];
        if (!map[i]) {
          reindex[i] = j;
          curr[j] = curr[i];
          prev[j] = prev[i];
          copy[j] = t;
          t._index = j++;
        } else {
          reindex[i] = -1;
        }
        curr[i] = 0;
      }
      data = copy;
      return reindex;
    },
    size: function() { return data.length; },
    curr: function() { return curr; },
    prev: function() { return prev; },
    reset: function(k) { prev[k] = curr[k]; },
    all: function() {
      return width < 0x101 ? 0xff : width < 0x10001 ? 0xffff : 0xffffffff;
    },
    set: function(k, one) { curr[k] |= one; },
    clear: function(k, one) { curr[k] &= ~one; },
    resize: function(n, m) {
      var k = curr.length;
      if (n > k || m > width) {
        width = Math.max(m, width);
        curr = array$1(n, width, curr);
        prev = array$1(n, width);
      }
    }
  };
}
function lengthen(array, length, copy) {
  if (array.length >= length) return array;
  copy = copy || new array.constructor(length);
  copy.set(array);
  return copy;
}
function array$1(n, m, array) {
  var copy = (m < 0x101 ? array8 : m < 0x10001 ? array16 : array32)(n);
  if (array) copy.set(array);
  return copy;
}

function Dimension(index, i, query) {
  var bit = (1 << i);
  return {
    one:     bit,
    zero:    ~bit,
    range:   query.slice(),
    bisect:  index.bisect,
    index:   index.index,
    size:    index.size,
    onAdd: function(added, curr) {
      var dim = this,
          range$$1 = dim.bisect(dim.range, added.value),
          idx = added.index,
          lo = range$$1[0],
          hi = range$$1[1],
          n1 = idx.length, i;
      for (i=0;  i<lo; ++i) curr[idx[i]] |= bit;
      for (i=hi; i<n1; ++i) curr[idx[i]] |= bit;
      return dim;
    }
  };
}

function SortedIndex() {
  var index = array32(0),
      value = [],
      size = 0;
  function insert(key, data, base) {
    if (!data.length) return [];
    var n0 = size,
        n1 = data.length,
        addv = Array(n1),
        addi = array32(n1),
        oldv, oldi, i;
    for (i=0; i<n1; ++i) {
      addv[i] = key(data[i]);
      addi[i] = i;
    }
    addv = sort(addv, addi);
    if (n0) {
      oldv = value;
      oldi = index;
      value = Array(n0 + n1);
      index = array32(n0 + n1);
      merge$1(base, oldv, oldi, n0, addv, addi, n1, value, index);
    } else {
      if (base > 0) for (i=0; i<n1; ++i) {
        addi[i] += base;
      }
      value = addv;
      index = addi;
    }
    size = n0 + n1;
    return {index: addi, value: addv};
  }
  function remove(num, map) {
    var n = size,
        idx, i, j;
    for (i=0; !map[index[i]] && i<n; ++i);
    for (j=i; i<n; ++i) {
      if (!map[idx=index[i]]) {
        index[j] = idx;
        value[j] = value[i];
        ++j;
      }
    }
    size = n - num;
  }
  function reindex(map) {
    for (var i=0, n=size; i<n; ++i) {
      index[i] = map[index[i]];
    }
  }
  function bisect$$1(range$$1, array) {
    var n;
    if (array) {
      n = array.length;
    } else {
      array = value;
      n = size;
    }
    return [
      bisectLeft(array, range$$1[0], 0, n),
      bisectRight(array, range$$1[1], 0, n)
    ];
  }
  return {
    insert:  insert,
    remove:  remove,
    bisect:  bisect$$1,
    reindex: reindex,
    index:   function() { return index; },
    size:    function() { return size; }
  };
}
function sort(values, index) {
  values.sort.call(index, function(a, b) {
    var x = values[a],
        y = values[b];
    return x < y ? -1 : x > y ? 1 : 0;
  });
  return permute(values, index);
}
function merge$1(base, value0, index0, n0, value1, index1, n1, value, index) {
  var i0 = 0, i1 = 0, i;
  for (i=0; i0 < n0 && i1 < n1; ++i) {
    if (value0[i0] < value1[i1]) {
      value[i] = value0[i0];
      index[i] = index0[i0++];
    } else {
      value[i] = value1[i1];
      index[i] = index1[i1++] + base;
    }
  }
  for (; i0 < n0; ++i0, ++i) {
    value[i] = value0[i0];
    index[i] = index0[i0];
  }
  for (; i1 < n1; ++i1, ++i) {
    value[i] = value1[i1];
    index[i] = index1[i1] + base;
  }
}

function CrossFilter(params) {
  Transform.call(this, Bitmaps(), params);
  this._indices = null;
  this._dims = null;
}
CrossFilter.Definition = {
  "type": "CrossFilter",
  "metadata": {},
  "params": [
    { "name": "fields", "type": "field", "array": true, "required": true },
    { "name": "query", "type": "array", "array": true, "required": true,
      "content": {"type": "number", "array": true, "length": 2} }
  ]
};
var prototype$1i = inherits(CrossFilter, Transform);
prototype$1i.transform = function(_$$1, pulse) {
  if (!this._dims) {
    return this.init(_$$1, pulse);
  } else {
    var init = _$$1.modified('fields')
          || _$$1.fields.some(function(f) { return pulse.modified(f.fields); });
    return init
      ? this.reinit(_$$1, pulse)
      : this.eval(_$$1, pulse);
  }
};
prototype$1i.init = function(_$$1, pulse) {
  var fields = _$$1.fields,
      query = _$$1.query,
      indices = this._indices = {},
      dims = this._dims = [],
      m = query.length,
      i = 0, key$$1, index;
  for (; i<m; ++i) {
    key$$1 = fields[i].fname;
    index = indices[key$$1] || (indices[key$$1] = SortedIndex());
    dims.push(Dimension(index, i, query[i]));
  }
  return this.eval(_$$1, pulse);
};
prototype$1i.reinit = function(_$$1, pulse) {
  var output = pulse.materialize().fork(),
      fields = _$$1.fields,
      query = _$$1.query,
      indices = this._indices,
      dims = this._dims,
      bits = this.value,
      curr = bits.curr(),
      prev = bits.prev(),
      all = bits.all(),
      out = (output.rem = output.add),
      mod = output.mod,
      m = query.length,
      adds = {}, add, index, key$$1,
      mods, remMap, modMap, i, n, f;
  prev.set(curr);
  if (pulse.rem.length) {
    remMap = this.remove(_$$1, pulse, output);
  }
  if (pulse.add.length) {
    bits.add(pulse.add);
  }
  if (pulse.mod.length) {
    modMap = {};
    for (mods=pulse.mod, i=0, n=mods.length; i<n; ++i) {
      modMap[mods[i]._index] = 1;
    }
  }
  for (i=0; i<m; ++i) {
    f = fields[i];
    if (!dims[i] || _$$1.modified('fields', i) || pulse.modified(f.fields)) {
      key$$1 = f.fname;
      if (!(add = adds[key$$1])) {
        indices[key$$1] = index = SortedIndex();
        adds[key$$1] = add = index.insert(f, pulse.source, 0);
      }
      dims[i] = Dimension(index, i, query[i]).onAdd(add, curr);
    }
  }
  for (i=0, n=bits.data().length; i<n; ++i) {
    if (remMap[i]) {
      continue;
    } else if (prev[i] !== curr[i]) {
      out.push(i);
    } else if (modMap[i] && curr[i] !== all) {
      mod.push(i);
    }
  }
  bits.mask = (1 << m) - 1;
  return output;
};
prototype$1i.eval = function(_$$1, pulse) {
  var output = pulse.materialize().fork(),
      m = this._dims.length,
      mask = 0;
  if (pulse.rem.length) {
    this.remove(_$$1, pulse, output);
    mask |= (1 << m) - 1;
  }
  if (_$$1.modified('query') && !_$$1.modified('fields')) {
    mask |= this.update(_$$1, pulse, output);
  }
  if (pulse.add.length) {
    this.insert(_$$1, pulse, output);
    mask |= (1 << m) - 1;
  }
  if (pulse.mod.length) {
    this.modify(pulse, output);
    mask |= (1 << m) - 1;
  }
  this.value.mask = mask;
  return output;
};
prototype$1i.insert = function(_$$1, pulse, output) {
  var tuples = pulse.add,
      bits = this.value,
      dims = this._dims,
      indices = this._indices,
      fields = _$$1.fields,
      adds = {},
      out = output.add,
      k = bits.size(),
      n = k + tuples.length,
      m = dims.length, j, key$$1, add;
  bits.resize(n, m);
  bits.add(tuples);
  var curr = bits.curr(),
      prev = bits.prev(),
      all  = bits.all();
  for (j=0; j<m; ++j) {
    key$$1 = fields[j].fname;
    add = adds[key$$1] || (adds[key$$1] = indices[key$$1].insert(fields[j], tuples, k));
    dims[j].onAdd(add, curr);
  }
  for (; k<n; ++k) {
    prev[k] = all;
    if (curr[k] !== all) out.push(k);
  }
};
prototype$1i.modify = function(pulse, output) {
  var out = output.mod,
      bits = this.value,
      curr = bits.curr(),
      all  = bits.all(),
      tuples = pulse.mod,
      i, n, k;
  for (i=0, n=tuples.length; i<n; ++i) {
    k = tuples[i]._index;
    if (curr[k] !== all) out.push(k);
  }
};
prototype$1i.remove = function(_$$1, pulse, output) {
  var indices = this._indices,
      bits = this.value,
      curr = bits.curr(),
      prev = bits.prev(),
      all  = bits.all(),
      map = {},
      out = output.rem,
      tuples = pulse.rem,
      i, n, k, f;
  for (i=0, n=tuples.length; i<n; ++i) {
    k = tuples[i]._index;
    map[k] = 1;
    prev[k] = (f = curr[k]);
    curr[k] = all;
    if (f !== all) out.push(k);
  }
  for (k in indices) {
    indices[k].remove(n, map);
  }
  this.reindex(pulse, n, map);
  return map;
};
prototype$1i.reindex = function(pulse, num, map) {
  var indices = this._indices,
      bits = this.value;
  pulse.runAfter(function() {
    var indexMap = bits.remove(num, map);
    for (var key$$1 in indices) indices[key$$1].reindex(indexMap);
  });
};
prototype$1i.update = function(_$$1, pulse, output) {
  var dims = this._dims,
      query = _$$1.query,
      stamp = pulse.stamp,
      m = dims.length,
      mask = 0, i, q;
  output.filters = 0;
  for (q=0; q<m; ++q) {
    if (_$$1.modified('query', q)) { i = q; ++mask; }
  }
  if (mask === 1) {
    mask = dims[i].one;
    this.incrementOne(dims[i], query[i], output.add, output.rem);
  } else {
    for (q=0, mask=0; q<m; ++q) {
      if (!_$$1.modified('query', q)) continue;
      mask |= dims[q].one;
      this.incrementAll(dims[q], query[q], stamp, output.add);
      output.rem = output.add;
    }
  }
  return mask;
};
prototype$1i.incrementAll = function(dim, query, stamp, out) {
  var bits = this.value,
      seen = bits.seen(),
      curr = bits.curr(),
      prev = bits.prev(),
      index = dim.index(),
      old = dim.bisect(dim.range),
      range$$1 = dim.bisect(query),
      lo1 = range$$1[0],
      hi1 = range$$1[1],
      lo0 = old[0],
      hi0 = old[1],
      one$$1 = dim.one,
      i, j, k;
  if (lo1 < lo0) {
    for (i = lo1, j = Math.min(lo0, hi1); i < j; ++i) {
      k = index[i];
      if (seen[k] !== stamp) {
        prev[k] = curr[k];
        seen[k] = stamp;
        out.push(k);
      }
      curr[k] ^= one$$1;
    }
  } else if (lo1 > lo0) {
    for (i = lo0, j = Math.min(lo1, hi0); i < j; ++i) {
      k = index[i];
      if (seen[k] !== stamp) {
        prev[k] = curr[k];
        seen[k] = stamp;
        out.push(k);
      }
      curr[k] ^= one$$1;
    }
  }
  if (hi1 > hi0) {
    for (i = Math.max(lo1, hi0), j = hi1; i < j; ++i) {
      k = index[i];
      if (seen[k] !== stamp) {
        prev[k] = curr[k];
        seen[k] = stamp;
        out.push(k);
      }
      curr[k] ^= one$$1;
    }
  } else if (hi1 < hi0) {
    for (i = Math.max(lo0, hi1), j = hi0; i < j; ++i) {
      k = index[i];
      if (seen[k] !== stamp) {
        prev[k] = curr[k];
        seen[k] = stamp;
        out.push(k);
      }
      curr[k] ^= one$$1;
    }
  }
  dim.range = query.slice();
};
prototype$1i.incrementOne = function(dim, query, add, rem) {
  var bits = this.value,
      curr = bits.curr(),
      index = dim.index(),
      old = dim.bisect(dim.range),
      range$$1 = dim.bisect(query),
      lo1 = range$$1[0],
      hi1 = range$$1[1],
      lo0 = old[0],
      hi0 = old[1],
      one$$1 = dim.one,
      i, j, k;
  if (lo1 < lo0) {
    for (i = lo1, j = Math.min(lo0, hi1); i < j; ++i) {
      k = index[i];
      curr[k] ^= one$$1;
      add.push(k);
    }
  } else if (lo1 > lo0) {
    for (i = lo0, j = Math.min(lo1, hi0); i < j; ++i) {
      k = index[i];
      curr[k] ^= one$$1;
      rem.push(k);
    }
  }
  if (hi1 > hi0) {
    for (i = Math.max(lo1, hi0), j = hi1; i < j; ++i) {
      k = index[i];
      curr[k] ^= one$$1;
      add.push(k);
    }
  } else if (hi1 < hi0) {
    for (i = Math.max(lo0, hi1), j = hi0; i < j; ++i) {
      k = index[i];
      curr[k] ^= one$$1;
      rem.push(k);
    }
  }
  dim.range = query.slice();
};

function ResolveFilter(params) {
  Transform.call(this, null, params);
}
ResolveFilter.Definition = {
  "type": "ResolveFilter",
  "metadata": {},
  "params": [
    { "name": "ignore", "type": "number", "required": true,
      "description": "A bit mask indicating which filters to ignore." },
    { "name": "filter", "type": "object", "required": true,
      "description": "Per-tuple filter bitmaps from a CrossFilter transform." }
  ]
};
var prototype$1j = inherits(ResolveFilter, Transform);
prototype$1j.transform = function(_$$1, pulse) {
  var ignore = ~(_$$1.ignore || 0),
      bitmap = _$$1.filter,
      mask = bitmap.mask;
  if ((mask & ignore) === 0) return pulse.StopPropagation;
  var output = pulse.fork(pulse.ALL),
      data = bitmap.data(),
      curr = bitmap.curr(),
      prev = bitmap.prev(),
      pass = function(k) {
        return !(curr[k] & ignore) ? data[k] : null;
      };
  output.filter(output.MOD, pass);
  if (!(mask & (mask-1))) {
    output.filter(output.ADD, pass);
    output.filter(output.REM, function(k) {
      return (curr[k] & ignore) === mask ? data[k] : null;
    });
  } else {
    output.filter(output.ADD, function(k) {
      var c = curr[k] & ignore,
          f = !c && (c ^ (prev[k] & ignore));
      return f ? data[k] : null;
    });
    output.filter(output.REM, function(k) {
      var c = curr[k] & ignore,
          f = c && !(c ^ (c ^ (prev[k] & ignore)));
      return f ? data[k] : null;
    });
  }
  return output.filter(output.SOURCE, function(t) { return pass(t._index); });
};



var xf = /*#__PURE__*/Object.freeze({
  crossfilter: CrossFilter,
  resolvefilter: ResolveFilter
});

var version = "3.0.4";

var Default = 'default';
function cursor(view) {
  var cursor = view._signals.cursor;
  if (!cursor) {
    view._signals.cursor = (cursor = view.add({user: Default, item: null}));
  }
  view.on(view.events('view', 'mousemove'), cursor,
    function(_$$1, event) {
      var value = cursor.value,
          user = value ? (isString(value) ? value : value.user) : Default,
          item = event.item && event.item.cursor || null;
      return (value && user === value.user && item == value.item) ? value
        : {user: user, item: item};
    }
  );
  view.add(null, function(_$$1) {
    var user = _$$1.cursor,
        item = this.value;
    if (!isString(user)) {
      item = user.item;
      user = user.user;
    }
    setCursor(user && user !== Default ? user : (item || user));
    return item;
  }, {cursor: cursor});
}
function setCursor(cursor) {
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.cursor = cursor;
  }
}

function dataref(view, name) {
  var data = view._runtime.data;
  if (!data.hasOwnProperty(name)) {
    error('Unrecognized data set: ' + name);
  }
  return data[name];
}
function data(name) {
  return dataref(this, name).values.value;
}
function change(name, changes) {
  if (!isChangeSet(changes)) {
    error('Second argument to changes must be a changeset.');
  }
  var dataset = dataref(this, name);
  dataset.modified = true;
  return this.pulse(dataset.input, changes);
}
function insert(name, _$$1) {
  return change.call(this, name, changeset().insert(_$$1));
}
function remove(name, _$$1) {
  return change.call(this, name, changeset().remove(_$$1));
}

function width(view) {
  var padding = view.padding();
  return Math.max(0, view._viewWidth + padding.left + padding.right);
}
function height$1(view) {
  var padding = view.padding();
  return Math.max(0, view._viewHeight + padding.top + padding.bottom);
}
function offset$1(view) {
  var padding = view.padding(),
      origin = view._origin;
  return [
    padding.left + origin[0],
    padding.top + origin[1]
  ];
}
function resizeRenderer(view) {
  var origin = offset$1(view),
      w = width(view),
      h = height$1(view);
  view._renderer.background(view._background);
  view._renderer.resize(w, h, origin);
  view._handler.origin(origin);
  view._resizeListeners.forEach(function(handler) {
    handler(w, h);
  });
}

function eventExtend(view, event, item) {
  var el = view._renderer.scene(),
      p, e, translate;
  if (el) {
    translate = offset$1(view);
    e = event.changedTouches ? event.changedTouches[0] : event;
    p = point(e, el);
    p[0] -= translate[0];
    p[1] -= translate[1];
  }
  event.dataflow = view;
  event.vega = extension(view, item, p);
  event.item = item;
  return event;
}
function extension(view, item, point$$1) {
  var itemGroup = item
    ? item.mark.marktype === 'group' ? item : item.mark.group
    : null;
  function group(name) {
    var g = itemGroup, i;
    if (name) for (i = item; i; i = i.mark.group) {
      if (i.mark.name === name) { g = i; break; }
    }
    return g && g.mark && g.mark.interactive ? g : {};
  }
  function xy(item) {
    if (!item) return point$$1;
    if (isString(item)) item = group(item);
    var p = point$$1.slice();
    while (item) {
      p[0] -= item.x || 0;
      p[1] -= item.y || 0;
      item = item.mark && item.mark.group;
    }
    return p;
  }
  return {
    view:  constant(view),
    item:  constant(item || {}),
    group: group,
    xy:    xy,
    x:     function(item) { return xy(item)[0]; },
    y:     function(item) { return xy(item)[1]; }
  };
}

var VIEW = 'view',
    WINDOW = 'window';
function initializeEventConfig(config) {
  config = extend({}, config);
  var def = config.defaults;
  if (def) {
    if (isArray(def.prevent)) {
      def.prevent = toSet(def.prevent);
    }
    if (isArray(def.allow)) {
      def.allow = toSet(def.allow);
    }
  }
  return config;
}
function prevent(view, type) {
  var def = view._eventConfig.defaults,
      prevent = def && def.prevent,
      allow = def && def.allow;
  return prevent === false || allow === true ? false
    : prevent === true || allow === false ? true
    : prevent ? prevent[type]
    : allow ? !allow[type]
    : view.preventDefault();
}
function events$1(source, type, filter) {
  var view = this,
      s = new EventStream(filter),
      send = function(e, item) {
        if (source === VIEW && prevent(view, type)) {
          e.preventDefault();
        }
        try {
          s.receive(eventExtend(view, e, item));
        } catch (error$$1) {
          view.error(error$$1);
        } finally {
          view.run();
        }
      },
      sources;
  if (source === VIEW) {
    view.addEventListener(type, send);
    return s;
  }
  if (source === WINDOW) {
    if (typeof window !== 'undefined') sources = [window];
  } else if (typeof document !== 'undefined') {
    sources = document.querySelectorAll(source);
  }
  if (!sources) {
    view.warn('Can not resolve event source: ' + source);
    return s;
  }
  for (var i=0, n=sources.length; i<n; ++i) {
    sources[i].addEventListener(type, send);
  }
  view._eventListeners.push({
    type:    type,
    sources: sources,
    handler: send
  });
  return s;
}

function itemFilter(event) {
  return event.item;
}
function markTarget(event) {
  var source = event.item.mark.source;
  return source.source || source;
}
function invoke(name) {
  return function(_$$1, event) {
    return event.vega.view()
      .changeset()
      .encode(event.item, name);
  };
}
function hover(hoverSet, leaveSet) {
  hoverSet = [hoverSet || 'hover'];
  leaveSet = [leaveSet || 'update', hoverSet[0]];
  this.on(
    this.events('view', 'mouseover', itemFilter),
    markTarget,
    invoke(hoverSet)
  );
  this.on(
    this.events('view', 'mouseout', itemFilter),
    markTarget,
    invoke(leaveSet)
  );
  return this;
}

function finalize() {
  var listeners = this._eventListeners,
      n = listeners.length, m, e;
  while (--n >= 0) {
    e = listeners[n];
    m = e.sources.length;
    while (--m >= 0) {
      e.sources[m].removeEventListener(e.type, e.handler);
    }
  }
}

function element$1(tag, attr, text) {
  var el = document.createElement(tag);
  for (var key in attr) el.setAttribute(key, attr[key]);
  if (text != null) el.textContent = text;
  return el;
}

var BindClass = 'vega-bind',
    NameClass = 'vega-bind-name',
    RadioClass = 'vega-bind-radio',
    OptionClass = 'vega-option-';
function bind$1(view, el, binding) {
  if (!el) return;
  var param = binding.param,
      bind = binding.state;
  if (!bind) {
    bind = binding.state = {
      elements: null,
      active: false,
      set: null,
      update: function(value) {
        bind.source = true;
        view.signal(param.signal, value).run();
      }
    };
    if (param.debounce) {
      bind.update = debounce(param.debounce, bind.update);
    }
  }
  generate(bind, el, param, view.signal(param.signal));
  if (!bind.active) {
    view.on(view._signals[param.signal], null, function() {
      bind.source
        ? (bind.source = false)
        : bind.set(view.signal(param.signal));
    });
    bind.active = true;
  }
  return bind;
}
function generate(bind, el, param, value) {
  var div = element$1('div', {'class': BindClass});
  div.appendChild(element$1('span',
    {'class': NameClass},
    (param.name || param.signal)
  ));
  el.appendChild(div);
  var input = form;
  switch (param.input) {
    case 'checkbox': input = checkbox; break;
    case 'select':   input = select; break;
    case 'radio':    input = radio; break;
    case 'range':    input = range$1; break;
  }
  input(bind, div, param, value);
}
function form(bind, el, param, value) {
  var node = element$1('input');
  for (var key$$1 in param) {
    if (key$$1 !== 'signal' && key$$1 !== 'element') {
      node.setAttribute(key$$1 === 'input' ? 'type' : key$$1, param[key$$1]);
    }
  }
  node.setAttribute('name', param.signal);
  node.value = value;
  el.appendChild(node);
  node.addEventListener('input', function() {
    bind.update(node.value);
  });
  bind.elements = [node];
  bind.set = function(value) { node.value = value; };
}
function checkbox(bind, el, param, value) {
  var attr = {type: 'checkbox', name: param.signal};
  if (value) attr.checked = true;
  var node = element$1('input', attr);
  el.appendChild(node);
  node.addEventListener('change', function() {
    bind.update(node.checked);
  });
  bind.elements = [node];
  bind.set = function(value) { node.checked = !!value || null; };
}
function select(bind, el, param, value) {
  var node = element$1('select', {name: param.signal});
  param.options.forEach(function(option) {
    var attr = {value: option};
    if (valuesEqual(option, value)) attr.selected = true;
    node.appendChild(element$1('option', attr, option+''));
  });
  el.appendChild(node);
  node.addEventListener('change', function() {
    bind.update(param.options[node.selectedIndex]);
  });
  bind.elements = [node];
  bind.set = function(value) {
    for (var i=0, n=param.options.length; i<n; ++i) {
      if (valuesEqual(param.options[i], value)) {
        node.selectedIndex = i; return;
      }
    }
  };
}
function radio(bind, el, param, value) {
  var group = element$1('span', {'class': RadioClass});
  el.appendChild(group);
  bind.elements = param.options.map(function(option) {
    var id$$1 = OptionClass + param.signal + '-' + option;
    var attr = {
      id:    id$$1,
      type:  'radio',
      name:  param.signal,
      value: option
    };
    if (valuesEqual(option, value)) attr.checked = true;
    var input = element$1('input', attr);
    input.addEventListener('change', function() {
      bind.update(option);
    });
    group.appendChild(input);
    group.appendChild(element$1('label', {'for': id$$1}, option+''));
    return input;
  });
  bind.set = function(value) {
    var nodes = bind.elements,
        i = 0,
        n = nodes.length;
    for (; i<n; ++i) {
      if (valuesEqual(nodes[i].value, value)) nodes[i].checked = true;
    }
  };
}
function range$1(bind, el, param, value) {
  value = value !== undefined ? value : ((+param.max) + (+param.min)) / 2;
  var min$$1 = param.min || Math.min(0, +value) || 0,
      max$$1 = param.max || Math.max(100, +value) || 100,
      step = param.step || tickStep(min$$1, max$$1, 100);
  var node = element$1('input', {
    type:  'range',
    name:  param.signal,
    min:   min$$1,
    max:   max$$1,
    step:  step
  });
  node.value = value;
  var label = element$1('label', {}, +value);
  el.appendChild(node);
  el.appendChild(label);
  function update() {
    label.textContent = node.value;
    bind.update(+node.value);
  }
  node.addEventListener('input', update);
  node.addEventListener('change', update);
  bind.elements = [node];
  bind.set = function(value) {
    node.value = value;
    label.textContent = value;
  };
}
function valuesEqual(a, b) {
  return a === b || (a+'' === b+'');
}

function initializeRenderer(view, r, el, constructor, scaleFactor) {
  r = r || new constructor(view.loader());
  return r
    .initialize(el, width(view), height$1(view), offset$1(view), scaleFactor)
    .background(view._background);
}

function initializeHandler(view, prevHandler, el, constructor) {
  var handler = new constructor(view.loader(), tooltip(view))
    .scene(view.scenegraph().root)
    .initialize(el, offset$1(view), view);
  if (prevHandler) {
    prevHandler.handlers().forEach(function(h) {
      handler.on(h.type, h.handler);
    });
  }
  return handler;
}
function tooltip(view) {
  var handler = view.tooltip(),
      tooltip = null;
  if (handler) {
    tooltip = function() {
      try {
        handler.apply(this, arguments);
      } catch (error) {
        view.error(error);
      }
    };
  }
  return tooltip;
}

function initialize$1(el, elBind) {
  var view = this,
      type = view._renderType,
      module = renderModule(type),
      Handler$$1, Renderer$$1;
  el = view._el = el ? lookup$2(view, el) : null;
  if (!module) view.error('Unrecognized renderer type: ' + type);
  Handler$$1 = module.handler || CanvasHandler;
  Renderer$$1 = (el ? module.renderer : module.headless);
  view._renderer = !Renderer$$1 ? null
    : initializeRenderer(view, view._renderer, el, Renderer$$1);
  view._handler = initializeHandler(view, view._handler, el, Handler$$1);
  view._redraw = true;
  if (el) {
    elBind = elBind ? lookup$2(view, elBind)
      : el.appendChild(element$1('div', {'class': 'vega-bindings'}));
    view._bind.forEach(function(_$$1) {
      if (_$$1.param.element) {
        _$$1.element = lookup$2(view, _$$1.param.element);
      }
    });
    view._bind.forEach(function(_$$1) {
      bind$1(view, _$$1.element || elBind, _$$1);
    });
  }
  return view;
}
function lookup$2(view, el) {
  if (typeof el === 'string') {
    if (typeof document !== 'undefined') {
      el = document.querySelector(el);
      if (!el) {
        view.error('Signal bind element not found: ' + el);
        return null;
      }
    } else {
      view.error('DOM document instance not found.');
      return null;
    }
  }
  if (el) {
    try {
      el.innerHTML = '';
    } catch (e) {
      el = null;
      view.error(e);
    }
  }
  return el;
}

function renderHeadless(view, type, scaleFactor) {
  var module = renderModule(type),
      ctr = module && module.headless;
  return !ctr
    ? Promise.reject('Unrecognized renderer type: ' + type)
    : view.runAsync().then(function() {
        return initializeRenderer(view, null, null, ctr, scaleFactor)
          .renderAsync(view._scenegraph.root);
      });
}

function renderToImageURL(type, scaleFactor) {
  return (type !== RenderType.Canvas && type !== RenderType.SVG && type !== RenderType.PNG)
    ? Promise.reject('Unrecognized image type: ' + type)
    : renderHeadless(this, type, scaleFactor).then(function(renderer) {
        return type === RenderType.SVG
          ? toBlobURL(renderer.svg(), 'image/svg+xml')
          : renderer.canvas().toDataURL('image/png');
      });
}
function toBlobURL(data, mime) {
  var blob = new Blob([data], {type: mime});
  return window.URL.createObjectURL(blob);
}

function renderToCanvas(scaleFactor) {
  return renderHeadless(this, RenderType.Canvas, scaleFactor)
    .then(function(renderer) { return renderer.canvas(); });
}

function renderToSVG(scaleFactor) {
  return renderHeadless(this, RenderType.SVG, scaleFactor)
    .then(function(renderer) { return renderer.svg(); });
}

function parseAutosize(spec, config) {
  spec = spec || config.autosize;
  if (isObject(spec)) {
    return spec;
  } else {
    spec = spec || 'pad';
    return {type: spec};
  }
}

function parsePadding(spec, config) {
  spec = spec || config.padding;
  return isObject(spec)
    ? {
        top:    number$1(spec.top),
        bottom: number$1(spec.bottom),
        left:   number$1(spec.left),
        right:  number$1(spec.right)
      }
    : paddingObject(number$1(spec));
}
function number$1(_$$1) {
  return +_$$1 || 0;
}
function paddingObject(_$$1) {
  return {top: _$$1, bottom: _$$1, left: _$$1, right: _$$1};
}

var OUTER = 'outer',
    OUTER_INVALID = ['value', 'update', 'react', 'bind'];
function outerError(prefix, name) {
  error(prefix + ' for "outer" push: ' + $(name));
}
function parseSignal(signal, scope) {
  var name = signal.name;
  if (signal.push === OUTER) {
    if (!scope.signals[name]) outerError('No prior signal definition', name);
    OUTER_INVALID.forEach(function(prop) {
      if (signal[prop] !== undefined) outerError('Invalid property ', prop);
    });
  } else {
    var op = scope.addSignal(name, signal.value);
    if (signal.react === false) op.react = false;
    if (signal.bind) scope.addBinding(name, signal.bind);
  }
}

function ASTNode(type) {
  this.type = type;
}
ASTNode.prototype.visit = function(visitor) {
  var node = this, c, i, n;
  if (visitor(node)) return 1;
  for (c=children$1(node), i=0, n=c.length; i<n; ++i) {
    if (c[i].visit(visitor)) return 1;
  }
};
function children$1(node) {
  switch (node.type) {
    case 'ArrayExpression':
      return node.elements;
    case 'BinaryExpression':
    case 'LogicalExpression':
      return [node.left, node.right];
    case 'CallExpression':
      var args = node.arguments.slice();
      args.unshift(node.callee);
      return args;
    case 'ConditionalExpression':
      return [node.test, node.consequent, node.alternate];
    case 'MemberExpression':
      return [node.object, node.property];
    case 'ObjectExpression':
      return node.properties;
    case 'Property':
      return [node.key, node.value];
    case 'UnaryExpression':
      return [node.argument];
    case 'Identifier':
    case 'Literal':
    case 'RawCode':
    default:
      return [];
  }
}

var TokenName,
    source$1,
    index,
    length,
    lookahead;
var TokenBooleanLiteral = 1,
    TokenEOF = 2,
    TokenIdentifier = 3,
    TokenKeyword = 4,
    TokenNullLiteral = 5,
    TokenNumericLiteral = 6,
    TokenPunctuator = 7,
    TokenStringLiteral = 8,
    TokenRegularExpression = 9;
TokenName = {};
TokenName[TokenBooleanLiteral] = 'Boolean';
TokenName[TokenEOF] = '<end>';
TokenName[TokenIdentifier] = 'Identifier';
TokenName[TokenKeyword] = 'Keyword';
TokenName[TokenNullLiteral] = 'Null';
TokenName[TokenNumericLiteral] = 'Numeric';
TokenName[TokenPunctuator] = 'Punctuator';
TokenName[TokenStringLiteral] = 'String';
TokenName[TokenRegularExpression] = 'RegularExpression';
var SyntaxArrayExpression = 'ArrayExpression',
    SyntaxBinaryExpression = 'BinaryExpression',
    SyntaxCallExpression = 'CallExpression',
    SyntaxConditionalExpression = 'ConditionalExpression',
    SyntaxIdentifier = 'Identifier',
    SyntaxLiteral = 'Literal',
    SyntaxLogicalExpression = 'LogicalExpression',
    SyntaxMemberExpression = 'MemberExpression',
    SyntaxObjectExpression = 'ObjectExpression',
    SyntaxProperty = 'Property',
    SyntaxUnaryExpression = 'UnaryExpression';
var MessageUnexpectedToken = 'Unexpected token %0',
    MessageUnexpectedNumber = 'Unexpected number',
    MessageUnexpectedString = 'Unexpected string',
    MessageUnexpectedIdentifier = 'Unexpected identifier',
    MessageUnexpectedReserved = 'Unexpected reserved word',
    MessageUnexpectedEOS = 'Unexpected end of input',
    MessageInvalidRegExp = 'Invalid regular expression',
    MessageUnterminatedRegExp = 'Invalid regular expression: missing /',
    MessageStrictOctalLiteral = 'Octal literals are not allowed in strict mode.',
    MessageStrictDuplicateProperty = 'Duplicate data property in object literal not allowed in strict mode';
var ILLEGAL = 'ILLEGAL',
    DISABLED = 'Disabled.';
var RegexNonAsciiIdentifierStart = new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
    RegexNonAsciiIdentifierPart = new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]');
function assert(condition, message) {
  if (!condition) {
    throw new Error('ASSERT: ' + message);
  }
}
function isDecimalDigit(ch) {
  return (ch >= 0x30 && ch <= 0x39);
}
function isHexDigit(ch) {
  return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
}
function isOctalDigit(ch) {
  return '01234567'.indexOf(ch) >= 0;
}
function isWhiteSpace(ch) {
  return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
    (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
}
function isLineTerminator(ch) {
  return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
}
function isIdentifierStart(ch) {
  return (ch === 0x24) || (ch === 0x5F) ||
    (ch >= 0x41 && ch <= 0x5A) ||
    (ch >= 0x61 && ch <= 0x7A) ||
    (ch === 0x5C) ||
    ((ch >= 0x80) && RegexNonAsciiIdentifierStart.test(String.fromCharCode(ch)));
}
function isIdentifierPart(ch) {
  return (ch === 0x24) || (ch === 0x5F) ||
    (ch >= 0x41 && ch <= 0x5A) ||
    (ch >= 0x61 && ch <= 0x7A) ||
    (ch >= 0x30 && ch <= 0x39) ||
    (ch === 0x5C) ||
    ((ch >= 0x80) && RegexNonAsciiIdentifierPart.test(String.fromCharCode(ch)));
}
var keywords$1 = {
  'if':1, 'in':1, 'do':1,
  'var':1, 'for':1, 'new':1, 'try':1, 'let':1,
  'this':1, 'else':1, 'case':1, 'void':1, 'with':1, 'enum':1,
  'while':1, 'break':1, 'catch':1, 'throw':1, 'const':1, 'yield':1, 'class':1, 'super':1,
  'return':1, 'typeof':1, 'delete':1, 'switch':1, 'export':1, 'import':1, 'public':1, 'static':1,
  'default':1, 'finally':1, 'extends':1, 'package':1, 'private':1,
  'function':1, 'continue':1, 'debugger':1,
  'interface':1, 'protected':1,
  'instanceof':1, 'implements':1
};
function skipComment() {
  var ch;
  while (index < length) {
    ch = source$1.charCodeAt(index);
    if (isWhiteSpace(ch) || isLineTerminator(ch)) {
      ++index;
    } else {
      break;
    }
  }
}
function scanHexEscape(prefix) {
  var i, len, ch, code = 0;
  len = (prefix === 'u') ? 4 : 2;
  for (i = 0; i < len; ++i) {
    if (index < length && isHexDigit(source$1[index])) {
      ch = source$1[index++];
      code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
    } else {
      throwError({}, MessageUnexpectedToken, ILLEGAL);
    }
  }
  return String.fromCharCode(code);
}
function scanUnicodeCodePointEscape() {
  var ch, code, cu1, cu2;
  ch = source$1[index];
  code = 0;
  if (ch === '}') {
    throwError({}, MessageUnexpectedToken, ILLEGAL);
  }
  while (index < length) {
    ch = source$1[index++];
    if (!isHexDigit(ch)) {
      break;
    }
    code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
  }
  if (code > 0x10FFFF || ch !== '}') {
    throwError({}, MessageUnexpectedToken, ILLEGAL);
  }
  if (code <= 0xFFFF) {
    return String.fromCharCode(code);
  }
  cu1 = ((code - 0x10000) >> 10) + 0xD800;
  cu2 = ((code - 0x10000) & 1023) + 0xDC00;
  return String.fromCharCode(cu1, cu2);
}
function getEscapedIdentifier() {
  var ch, id;
  ch = source$1.charCodeAt(index++);
  id = String.fromCharCode(ch);
  if (ch === 0x5C) {
    if (source$1.charCodeAt(index) !== 0x75) {
      throwError({}, MessageUnexpectedToken, ILLEGAL);
    }
    ++index;
    ch = scanHexEscape('u');
    if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
      throwError({}, MessageUnexpectedToken, ILLEGAL);
    }
    id = ch;
  }
  while (index < length) {
    ch = source$1.charCodeAt(index);
    if (!isIdentifierPart(ch)) {
      break;
    }
    ++index;
    id += String.fromCharCode(ch);
    if (ch === 0x5C) {
      id = id.substr(0, id.length - 1);
      if (source$1.charCodeAt(index) !== 0x75) {
        throwError({}, MessageUnexpectedToken, ILLEGAL);
      }
      ++index;
      ch = scanHexEscape('u');
      if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
        throwError({}, MessageUnexpectedToken, ILLEGAL);
      }
      id += ch;
    }
  }
  return id;
}
function getIdentifier() {
  var start, ch;
  start = index++;
  while (index < length) {
    ch = source$1.charCodeAt(index);
    if (ch === 0x5C) {
      index = start;
      return getEscapedIdentifier();
    }
    if (isIdentifierPart(ch)) {
      ++index;
    } else {
      break;
    }
  }
  return source$1.slice(start, index);
}
function scanIdentifier() {
  var start, id, type;
  start = index;
  id = (source$1.charCodeAt(index) === 0x5C) ? getEscapedIdentifier() : getIdentifier();
  if (id.length === 1) {
    type = TokenIdentifier;
  } else if (keywords$1.hasOwnProperty(id)) {
    type = TokenKeyword;
  } else if (id === 'null') {
    type = TokenNullLiteral;
  } else if (id === 'true' || id === 'false') {
    type = TokenBooleanLiteral;
  } else {
    type = TokenIdentifier;
  }
  return {
    type: type,
    value: id,
    start: start,
    end: index
  };
}
function scanPunctuator() {
  var start = index,
    code = source$1.charCodeAt(index),
    code2,
    ch1 = source$1[index],
    ch2,
    ch3,
    ch4;
  switch (code) {
    case 0x2E:
    case 0x28:
    case 0x29:
    case 0x3B:
    case 0x2C:
    case 0x7B:
    case 0x7D:
    case 0x5B:
    case 0x5D:
    case 0x3A:
    case 0x3F:
    case 0x7E:
      ++index;
      return {
        type: TokenPunctuator,
        value: String.fromCharCode(code),
        start: start,
        end: index
      };
    default:
      code2 = source$1.charCodeAt(index + 1);
      if (code2 === 0x3D) {
        switch (code) {
          case 0x2B:
          case 0x2D:
          case 0x2F:
          case 0x3C:
          case 0x3E:
          case 0x5E:
          case 0x7C:
          case 0x25:
          case 0x26:
          case 0x2A:
            index += 2;
            return {
              type: TokenPunctuator,
              value: String.fromCharCode(code) + String.fromCharCode(code2),
              start: start,
              end: index
            };
          case 0x21:
          case 0x3D:
            index += 2;
            if (source$1.charCodeAt(index) === 0x3D) {
              ++index;
            }
            return {
              type: TokenPunctuator,
              value: source$1.slice(start, index),
              start: start,
              end: index
            };
        }
      }
  }
  ch4 = source$1.substr(index, 4);
  if (ch4 === '>>>=') {
    index += 4;
    return {
      type: TokenPunctuator,
      value: ch4,
      start: start,
      end: index
    };
  }
  ch3 = ch4.substr(0, 3);
  if (ch3 === '>>>' || ch3 === '<<=' || ch3 === '>>=') {
    index += 3;
    return {
      type: TokenPunctuator,
      value: ch3,
      start: start,
      end: index
    };
  }
  ch2 = ch3.substr(0, 2);
  if ((ch1 === ch2[1] && ('+-<>&|'.indexOf(ch1) >= 0)) || ch2 === '=>') {
    index += 2;
    return {
      type: TokenPunctuator,
      value: ch2,
      start: start,
      end: index
    };
  }
  if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
    ++index;
    return {
      type: TokenPunctuator,
      value: ch1,
      start: start,
      end: index
    };
  }
  throwError({}, MessageUnexpectedToken, ILLEGAL);
}
function scanHexLiteral(start) {
  var number = '';
  while (index < length) {
    if (!isHexDigit(source$1[index])) {
      break;
    }
    number += source$1[index++];
  }
  if (number.length === 0) {
    throwError({}, MessageUnexpectedToken, ILLEGAL);
  }
  if (isIdentifierStart(source$1.charCodeAt(index))) {
    throwError({}, MessageUnexpectedToken, ILLEGAL);
  }
  return {
    type: TokenNumericLiteral,
    value: parseInt('0x' + number, 16),
    start: start,
    end: index
  };
}
function scanOctalLiteral(start) {
  var number = '0' + source$1[index++];
  while (index < length) {
    if (!isOctalDigit(source$1[index])) {
      break;
    }
    number += source$1[index++];
  }
  if (isIdentifierStart(source$1.charCodeAt(index)) || isDecimalDigit(source$1.charCodeAt(index))) {
    throwError({}, MessageUnexpectedToken, ILLEGAL);
  }
  return {
    type: TokenNumericLiteral,
    value: parseInt(number, 8),
    octal: true,
    start: start,
    end: index
  };
}
function scanNumericLiteral() {
  var number, start, ch;
  ch = source$1[index];
  assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
    'Numeric literal must start with a decimal digit or a decimal point');
  start = index;
  number = '';
  if (ch !== '.') {
    number = source$1[index++];
    ch = source$1[index];
    if (number === '0') {
      if (ch === 'x' || ch === 'X') {
        ++index;
        return scanHexLiteral(start);
      }
      if (isOctalDigit(ch)) {
        return scanOctalLiteral(start);
      }
      if (ch && isDecimalDigit(ch.charCodeAt(0))) {
        throwError({}, MessageUnexpectedToken, ILLEGAL);
      }
    }
    while (isDecimalDigit(source$1.charCodeAt(index))) {
      number += source$1[index++];
    }
    ch = source$1[index];
  }
  if (ch === '.') {
    number += source$1[index++];
    while (isDecimalDigit(source$1.charCodeAt(index))) {
      number += source$1[index++];
    }
    ch = source$1[index];
  }
  if (ch === 'e' || ch === 'E') {
    number += source$1[index++];
    ch = source$1[index];
    if (ch === '+' || ch === '-') {
      number += source$1[index++];
    }
    if (isDecimalDigit(source$1.charCodeAt(index))) {
      while (isDecimalDigit(source$1.charCodeAt(index))) {
        number += source$1[index++];
      }
    } else {
      throwError({}, MessageUnexpectedToken, ILLEGAL);
    }
  }
  if (isIdentifierStart(source$1.charCodeAt(index))) {
    throwError({}, MessageUnexpectedToken, ILLEGAL);
  }
  return {
    type: TokenNumericLiteral,
    value: parseFloat(number),
    start: start,
    end: index
  };
}
function scanStringLiteral() {
  var str = '',
    quote, start, ch, code, octal = false;
  quote = source$1[index];
  assert((quote === '\'' || quote === '"'),
    'String literal must starts with a quote');
  start = index;
  ++index;
  while (index < length) {
    ch = source$1[index++];
    if (ch === quote) {
      quote = '';
      break;
    } else if (ch === '\\') {
      ch = source$1[index++];
      if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
        switch (ch) {
          case 'u':
          case 'x':
            if (source$1[index] === '{') {
              ++index;
              str += scanUnicodeCodePointEscape();
            } else {
              str += scanHexEscape(ch);
            }
            break;
          case 'n':
            str += '\n';
            break;
          case 'r':
            str += '\r';
            break;
          case 't':
            str += '\t';
            break;
          case 'b':
            str += '\b';
            break;
          case 'f':
            str += '\f';
            break;
          case 'v':
            str += '\x0B';
            break;
          default:
            if (isOctalDigit(ch)) {
              code = '01234567'.indexOf(ch);
              if (code !== 0) {
                octal = true;
              }
              if (index < length && isOctalDigit(source$1[index])) {
                octal = true;
                code = code * 8 + '01234567'.indexOf(source$1[index++]);
                if ('0123'.indexOf(ch) >= 0 &&
                  index < length &&
                  isOctalDigit(source$1[index])) {
                  code = code * 8 + '01234567'.indexOf(source$1[index++]);
                }
              }
              str += String.fromCharCode(code);
            } else {
              str += ch;
            }
            break;
        }
      } else {
        if (ch === '\r' && source$1[index] === '\n') {
          ++index;
        }
      }
    } else if (isLineTerminator(ch.charCodeAt(0))) {
      break;
    } else {
      str += ch;
    }
  }
  if (quote !== '') {
    throwError({}, MessageUnexpectedToken, ILLEGAL);
  }
  return {
    type: TokenStringLiteral,
    value: str,
    octal: octal,
    start: start,
    end: index
  };
}
function testRegExp(pattern, flags) {
  var tmp = pattern;
  if (flags.indexOf('u') >= 0) {
    tmp = tmp
      .replace(/\\u\{([0-9a-fA-F]+)\}/g, function($0, $1) {
        if (parseInt($1, 16) <= 0x10FFFF) {
          return 'x';
        }
        throwError({}, MessageInvalidRegExp);
      })
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, 'x');
  }
  try {
  } catch (e) {
    throwError({}, MessageInvalidRegExp);
  }
  try {
    return new RegExp(pattern, flags);
  } catch (exception) {
    return null;
  }
}
function scanRegExpBody() {
  var ch, str, classMarker, terminated, body;
  ch = source$1[index];
  assert(ch === '/', 'Regular expression literal must start with a slash');
  str = source$1[index++];
  classMarker = false;
  terminated = false;
  while (index < length) {
    ch = source$1[index++];
    str += ch;
    if (ch === '\\') {
      ch = source$1[index++];
      if (isLineTerminator(ch.charCodeAt(0))) {
        throwError({}, MessageUnterminatedRegExp);
      }
      str += ch;
    } else if (isLineTerminator(ch.charCodeAt(0))) {
      throwError({}, MessageUnterminatedRegExp);
    } else if (classMarker) {
      if (ch === ']') {
        classMarker = false;
      }
    } else {
      if (ch === '/') {
        terminated = true;
        break;
      } else if (ch === '[') {
        classMarker = true;
      }
    }
  }
  if (!terminated) {
    throwError({}, MessageUnterminatedRegExp);
  }
  body = str.substr(1, str.length - 2);
  return {
    value: body,
    literal: str
  };
}
function scanRegExpFlags() {
  var ch, str, flags;
  str = '';
  flags = '';
  while (index < length) {
    ch = source$1[index];
    if (!isIdentifierPart(ch.charCodeAt(0))) {
      break;
    }
    ++index;
    if (ch === '\\' && index < length) {
      throwError({}, MessageUnexpectedToken, ILLEGAL);
    } else {
      flags += ch;
      str += ch;
    }
  }
  if (flags.search(/[^gimuy]/g) >= 0) {
    throwError({}, MessageInvalidRegExp, flags);
  }
  return {
    value: flags,
    literal: str
  };
}
function scanRegExp() {
  var start, body, flags, value;
  lookahead = null;
  skipComment();
  start = index;
  body = scanRegExpBody();
  flags = scanRegExpFlags();
  value = testRegExp(body.value, flags.value);
  return {
    literal: body.literal + flags.literal,
    value: value,
    regex: {
      pattern: body.value,
      flags: flags.value
    },
    start: start,
    end: index
  };
}
function isIdentifierName(token) {
  return token.type === TokenIdentifier ||
    token.type === TokenKeyword ||
    token.type === TokenBooleanLiteral ||
    token.type === TokenNullLiteral;
}
function advance() {
  var ch;
  skipComment();
  if (index >= length) {
    return {
      type: TokenEOF,
      start: index,
      end: index
    };
  }
  ch = source$1.charCodeAt(index);
  if (isIdentifierStart(ch)) {
    return scanIdentifier();
  }
  if (ch === 0x28 || ch === 0x29 || ch === 0x3B) {
    return scanPunctuator();
  }
  if (ch === 0x27 || ch === 0x22) {
    return scanStringLiteral();
  }
  if (ch === 0x2E) {
    if (isDecimalDigit(source$1.charCodeAt(index + 1))) {
      return scanNumericLiteral();
    }
    return scanPunctuator();
  }
  if (isDecimalDigit(ch)) {
    return scanNumericLiteral();
  }
  return scanPunctuator();
}
function lex() {
  var token;
  token = lookahead;
  index = token.end;
  lookahead = advance();
  index = token.end;
  return token;
}
function peek$1() {
  var pos;
  pos = index;
  lookahead = advance();
  index = pos;
}
function finishArrayExpression(elements) {
  var node = new ASTNode(SyntaxArrayExpression);
  node.elements = elements;
  return node;
}
function finishBinaryExpression(operator, left, right) {
  var node = new ASTNode((operator === '||' || operator === '&&') ? SyntaxLogicalExpression : SyntaxBinaryExpression);
  node.operator = operator;
  node.left = left;
  node.right = right;
  return node;
}
function finishCallExpression(callee, args) {
  var node = new ASTNode(SyntaxCallExpression);
  node.callee = callee;
  node.arguments = args;
  return node;
}
function finishConditionalExpression(test, consequent, alternate) {
  var node = new ASTNode(SyntaxConditionalExpression);
  node.test = test;
  node.consequent = consequent;
  node.alternate = alternate;
  return node;
}
function finishIdentifier(name) {
  var node = new ASTNode(SyntaxIdentifier);
  node.name = name;
  return node;
}
function finishLiteral(token) {
  var node = new ASTNode(SyntaxLiteral);
  node.value = token.value;
  node.raw = source$1.slice(token.start, token.end);
  if (token.regex) {
    if (node.raw === '//') {
      node.raw = '/(?:)/';
    }
    node.regex = token.regex;
  }
  return node;
}
function finishMemberExpression(accessor, object, property) {
  var node = new ASTNode(SyntaxMemberExpression);
  node.computed = accessor === '[';
  node.object = object;
  node.property = property;
  if (!node.computed) property.member = true;
  return node;
}
function finishObjectExpression(properties) {
  var node = new ASTNode(SyntaxObjectExpression);
  node.properties = properties;
  return node;
}
function finishProperty(kind, key, value) {
  var node = new ASTNode(SyntaxProperty);
  node.key = key;
  node.value = value;
  node.kind = kind;
  return node;
}
function finishUnaryExpression(operator, argument) {
  var node = new ASTNode(SyntaxUnaryExpression);
  node.operator = operator;
  node.argument = argument;
  node.prefix = true;
  return node;
}
function throwError(token, messageFormat) {
  var error,
    args = Array.prototype.slice.call(arguments, 2),
    msg = messageFormat.replace(
      /%(\d)/g,
      function(whole, index) {
        assert(index < args.length, 'Message reference must be in range');
        return args[index];
      }
    );
  error = new Error(msg);
  error.index = index;
  error.description = msg;
  throw error;
}
function throwUnexpected(token) {
  if (token.type === TokenEOF) {
    throwError(token, MessageUnexpectedEOS);
  }
  if (token.type === TokenNumericLiteral) {
    throwError(token, MessageUnexpectedNumber);
  }
  if (token.type === TokenStringLiteral) {
    throwError(token, MessageUnexpectedString);
  }
  if (token.type === TokenIdentifier) {
    throwError(token, MessageUnexpectedIdentifier);
  }
  if (token.type === TokenKeyword) {
    throwError(token, MessageUnexpectedReserved);
  }
  throwError(token, MessageUnexpectedToken, token.value);
}
function expect(value) {
  var token = lex();
  if (token.type !== TokenPunctuator || token.value !== value) {
    throwUnexpected(token);
  }
}
function match(value) {
  return lookahead.type === TokenPunctuator && lookahead.value === value;
}
function matchKeyword(keyword) {
  return lookahead.type === TokenKeyword && lookahead.value === keyword;
}
function parseArrayInitialiser() {
  var elements = [];
  index = lookahead.start;
  expect('[');
  while (!match(']')) {
    if (match(',')) {
      lex();
      elements.push(null);
    } else {
      elements.push(parseConditionalExpression());
      if (!match(']')) {
        expect(',');
      }
    }
  }
  lex();
  return finishArrayExpression(elements);
}
function parseObjectPropertyKey() {
  var token;
  index = lookahead.start;
  token = lex();
  if (token.type === TokenStringLiteral || token.type === TokenNumericLiteral) {
    if (token.octal) {
      throwError(token, MessageStrictOctalLiteral);
    }
    return finishLiteral(token);
  }
  return finishIdentifier(token.value);
}
function parseObjectProperty() {
  var token, key, id, value;
  index = lookahead.start;
  token = lookahead;
  if (token.type === TokenIdentifier) {
    id = parseObjectPropertyKey();
    expect(':');
    value = parseConditionalExpression();
    return finishProperty('init', id, value);
  }
  if (token.type === TokenEOF || token.type === TokenPunctuator) {
    throwUnexpected(token);
  } else {
    key = parseObjectPropertyKey();
    expect(':');
    value = parseConditionalExpression();
    return finishProperty('init', key, value);
  }
}
function parseObjectInitialiser() {
  var properties = [],
    property, name, key, map = {},
    toString = String;
  index = lookahead.start;
  expect('{');
  while (!match('}')) {
    property = parseObjectProperty();
    if (property.key.type === SyntaxIdentifier) {
      name = property.key.name;
    } else {
      name = toString(property.key.value);
    }
    key = '$' + name;
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      throwError({}, MessageStrictDuplicateProperty);
    } else {
      map[key] = true;
    }
    properties.push(property);
    if (!match('}')) {
      expect(',');
    }
  }
  expect('}');
  return finishObjectExpression(properties);
}
function parseGroupExpression() {
  var expr;
  expect('(');
  expr = parseExpression();
  expect(')');
  return expr;
}
var legalKeywords = {
  "if": 1,
  "this": 1
};
function parsePrimaryExpression() {
  var type, token, expr;
  if (match('(')) {
    return parseGroupExpression();
  }
  if (match('[')) {
    return parseArrayInitialiser();
  }
  if (match('{')) {
    return parseObjectInitialiser();
  }
  type = lookahead.type;
  index = lookahead.start;
  if (type === TokenIdentifier || legalKeywords[lookahead.value]) {
    expr = finishIdentifier(lex().value);
  } else if (type === TokenStringLiteral || type === TokenNumericLiteral) {
    if (lookahead.octal) {
      throwError(lookahead, MessageStrictOctalLiteral);
    }
    expr = finishLiteral(lex());
  } else if (type === TokenKeyword) {
    throw new Error(DISABLED);
  } else if (type === TokenBooleanLiteral) {
    token = lex();
    token.value = (token.value === 'true');
    expr = finishLiteral(token);
  } else if (type === TokenNullLiteral) {
    token = lex();
    token.value = null;
    expr = finishLiteral(token);
  } else if (match('/') || match('/=')) {
    expr = finishLiteral(scanRegExp());
    peek$1();
  } else {
    throwUnexpected(lex());
  }
  return expr;
}
function parseArguments() {
  var args = [];
  expect('(');
  if (!match(')')) {
    while (index < length) {
      args.push(parseConditionalExpression());
      if (match(')')) {
        break;
      }
      expect(',');
    }
  }
  expect(')');
  return args;
}
function parseNonComputedProperty() {
  var token;
  index = lookahead.start;
  token = lex();
  if (!isIdentifierName(token)) {
    throwUnexpected(token);
  }
  return finishIdentifier(token.value);
}
function parseNonComputedMember() {
  expect('.');
  return parseNonComputedProperty();
}
function parseComputedMember() {
  var expr;
  expect('[');
  expr = parseExpression();
  expect(']');
  return expr;
}
function parseLeftHandSideExpressionAllowCall() {
  var expr, args, property;
  expr = parsePrimaryExpression();
  for (;;) {
    if (match('.')) {
      property = parseNonComputedMember();
      expr = finishMemberExpression('.', expr, property);
    } else if (match('(')) {
      args = parseArguments();
      expr = finishCallExpression(expr, args);
    } else if (match('[')) {
      property = parseComputedMember();
      expr = finishMemberExpression('[', expr, property);
    } else {
      break;
    }
  }
  return expr;
}
function parsePostfixExpression() {
  var expr = parseLeftHandSideExpressionAllowCall();
  if (lookahead.type === TokenPunctuator) {
    if ((match('++') || match('--'))) {
      throw new Error(DISABLED);
    }
  }
  return expr;
}
function parseUnaryExpression() {
  var token, expr;
  if (lookahead.type !== TokenPunctuator && lookahead.type !== TokenKeyword) {
    expr = parsePostfixExpression();
  } else if (match('++') || match('--')) {
    throw new Error(DISABLED);
  } else if (match('+') || match('-') || match('~') || match('!')) {
    token = lex();
    expr = parseUnaryExpression();
    expr = finishUnaryExpression(token.value, expr);
  } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
    throw new Error(DISABLED);
  } else {
    expr = parsePostfixExpression();
  }
  return expr;
}
function binaryPrecedence(token) {
  var prec = 0;
  if (token.type !== TokenPunctuator && token.type !== TokenKeyword) {
    return 0;
  }
  switch (token.value) {
    case '||':
      prec = 1;
      break;
    case '&&':
      prec = 2;
      break;
    case '|':
      prec = 3;
      break;
    case '^':
      prec = 4;
      break;
    case '&':
      prec = 5;
      break;
    case '==':
    case '!=':
    case '===':
    case '!==':
      prec = 6;
      break;
    case '<':
    case '>':
    case '<=':
    case '>=':
    case 'instanceof':
    case 'in':
      prec = 7;
      break;
    case '<<':
    case '>>':
    case '>>>':
      prec = 8;
      break;
    case '+':
    case '-':
      prec = 9;
      break;
    case '*':
    case '/':
    case '%':
      prec = 11;
      break;
    default:
      break;
  }
  return prec;
}
function parseBinaryExpression() {
  var marker, markers, expr, token, prec, stack, right, operator, left, i;
  marker = lookahead;
  left = parseUnaryExpression();
  token = lookahead;
  prec = binaryPrecedence(token);
  if (prec === 0) {
    return left;
  }
  token.prec = prec;
  lex();
  markers = [marker, lookahead];
  right = parseUnaryExpression();
  stack = [left, token, right];
  while ((prec = binaryPrecedence(lookahead)) > 0) {
    while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
      right = stack.pop();
      operator = stack.pop().value;
      left = stack.pop();
      markers.pop();
      expr = finishBinaryExpression(operator, left, right);
      stack.push(expr);
    }
    token = lex();
    token.prec = prec;
    stack.push(token);
    markers.push(lookahead);
    expr = parseUnaryExpression();
    stack.push(expr);
  }
  i = stack.length - 1;
  expr = stack[i];
  markers.pop();
  while (i > 1) {
    markers.pop();
    expr = finishBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
    i -= 2;
  }
  return expr;
}
function parseConditionalExpression() {
  var expr, consequent, alternate;
  expr = parseBinaryExpression();
  if (match('?')) {
    lex();
    consequent = parseConditionalExpression();
    expect(':');
    alternate = parseConditionalExpression();
    expr = finishConditionalExpression(expr, consequent, alternate);
  }
  return expr;
}
function parseExpression() {
  var expr = parseConditionalExpression();
  if (match(',')) {
    throw new Error(DISABLED);
  }
  return expr;
}
function parse$2(code) {
  source$1 = code;
  index = 0;
  length = source$1.length;
  lookahead = null;
  peek$1();
  var expr = parseExpression();
  if (lookahead.type !== TokenEOF) {
    throw new Error("Unexpect token after expression.");
  }
  return expr;
}

var Constants = {
  NaN:       'NaN',
  E:         'Math.E',
  LN2:       'Math.LN2',
  LN10:      'Math.LN10',
  LOG2E:     'Math.LOG2E',
  LOG10E:    'Math.LOG10E',
  PI:        'Math.PI',
  SQRT1_2:   'Math.SQRT1_2',
  SQRT2:     'Math.SQRT2',
  MIN_VALUE: 'Number.MIN_VALUE',
  MAX_VALUE: 'Number.MAX_VALUE'
};

function Functions(codegen) {
  function fncall(name, args, cast, type) {
    var obj = codegen(args[0]);
    if (cast) {
      obj = cast + '(' + obj + ')';
      if (cast.lastIndexOf('new ', 0) === 0) obj = '(' + obj + ')';
    }
    return obj + '.' + name + (type < 0 ? '' : type === 0 ?
      '()' :
      '(' + args.slice(1).map(codegen).join(',') + ')');
  }
  function fn(name, cast, type) {
    return function(args) {
      return fncall(name, args, cast, type);
    };
  }
  var DATE = 'new Date',
      STRING = 'String',
      REGEXP = 'RegExp';
  return {
    isNaN:    'isNaN',
    isFinite: 'isFinite',
    abs:      'Math.abs',
    acos:     'Math.acos',
    asin:     'Math.asin',
    atan:     'Math.atan',
    atan2:    'Math.atan2',
    ceil:     'Math.ceil',
    cos:      'Math.cos',
    exp:      'Math.exp',
    floor:    'Math.floor',
    log:      'Math.log',
    max:      'Math.max',
    min:      'Math.min',
    pow:      'Math.pow',
    random:   'Math.random',
    round:    'Math.round',
    sin:      'Math.sin',
    sqrt:     'Math.sqrt',
    tan:      'Math.tan',
    clamp: function(args) {
      if (args.length < 3) error('Missing arguments to clamp function.');
      if (args.length > 3) error('Too many arguments to clamp function.');
      var a = args.map(codegen);
      return 'Math.max('+a[1]+', Math.min('+a[2]+','+a[0]+'))';
    },
    now:             'Date.now',
    utc:             'Date.UTC',
    datetime:        DATE,
    date:            fn('getDate', DATE, 0),
    day:             fn('getDay', DATE, 0),
    year:            fn('getFullYear', DATE, 0),
    month:           fn('getMonth', DATE, 0),
    hours:           fn('getHours', DATE, 0),
    minutes:         fn('getMinutes', DATE, 0),
    seconds:         fn('getSeconds', DATE, 0),
    milliseconds:    fn('getMilliseconds', DATE, 0),
    time:            fn('getTime', DATE, 0),
    timezoneoffset:  fn('getTimezoneOffset', DATE, 0),
    utcdate:         fn('getUTCDate', DATE, 0),
    utcday:          fn('getUTCDay', DATE, 0),
    utcyear:         fn('getUTCFullYear', DATE, 0),
    utcmonth:        fn('getUTCMonth', DATE, 0),
    utchours:        fn('getUTCHours', DATE, 0),
    utcminutes:      fn('getUTCMinutes', DATE, 0),
    utcseconds:      fn('getUTCSeconds', DATE, 0),
    utcmilliseconds: fn('getUTCMilliseconds', DATE, 0),
    length:      fn('length', null, -1),
    indexof:     fn('indexOf', null),
    lastindexof: fn('lastIndexOf', null),
    slice:       fn('slice', null),
    parseFloat:  'parseFloat',
    parseInt:    'parseInt',
    upper:       fn('toUpperCase', STRING, 0),
    lower:       fn('toLowerCase', STRING, 0),
    substring:   fn('substring', STRING),
    split:       fn('split', STRING),
    replace:     fn('replace', STRING),
    regexp:  REGEXP,
    test:    fn('test', REGEXP),
    if: function(args) {
        if (args.length < 3) error('Missing arguments to if function.');
        if (args.length > 3) error('Too many arguments to if function.');
        var a = args.map(codegen);
        return '('+a[0]+'?'+a[1]+':'+a[2]+')';
      }
  };
}

function codegen(opt) {
  opt = opt || {};
  var whitelist = opt.whitelist ? toSet(opt.whitelist) : {},
      blacklist = opt.blacklist ? toSet(opt.blacklist) : {},
      constants = opt.constants || Constants,
      functions = (opt.functions || Functions)(visit),
      globalvar = opt.globalvar,
      fieldvar = opt.fieldvar,
      globals = {},
      fields = {},
      memberDepth = 0;
  var outputGlobal = isFunction(globalvar)
    ? globalvar
    : function (id$$1) { return globalvar + '["' + id$$1 + '"]'; };
  function visit(ast) {
    if (isString(ast)) return ast;
    var generator = Generators[ast.type];
    if (generator == null) error('Unsupported type: ' + ast.type);
    return generator(ast);
  }
  var Generators = {
    Literal: function(n) {
        return n.raw;
      },
    Identifier: function(n) {
      var id$$1 = n.name;
      if (memberDepth > 0) {
        return id$$1;
      } else if (blacklist.hasOwnProperty(id$$1)) {
        return error('Illegal identifier: ' + id$$1);
      } else if (constants.hasOwnProperty(id$$1)) {
        return constants[id$$1];
      } else if (whitelist.hasOwnProperty(id$$1)) {
        return id$$1;
      } else {
        globals[id$$1] = 1;
        return outputGlobal(id$$1);
      }
    },
    MemberExpression: function(n) {
        var d = !n.computed;
        var o = visit(n.object);
        if (d) memberDepth += 1;
        var p = visit(n.property);
        if (o === fieldvar) { fields[p] = 1; }
        if (d) memberDepth -= 1;
        return o + (d ? '.'+p : '['+p+']');
      },
    CallExpression: function(n) {
        if (n.callee.type !== 'Identifier') {
          error('Illegal callee type: ' + n.callee.type);
        }
        var callee = n.callee.name;
        var args = n.arguments;
        var fn = functions.hasOwnProperty(callee) && functions[callee];
        if (!fn) error('Unrecognized function: ' + callee);
        return isFunction(fn)
          ? fn(args)
          : fn + '(' + args.map(visit).join(',') + ')';
      },
    ArrayExpression: function(n) {
        return '[' + n.elements.map(visit).join(',') + ']';
      },
    BinaryExpression: function(n) {
        return '(' + visit(n.left) + n.operator + visit(n.right) + ')';
      },
    UnaryExpression: function(n) {
        return '(' + n.operator + visit(n.argument) + ')';
      },
    ConditionalExpression: function(n) {
        return '(' + visit(n.test) +
          '?' + visit(n.consequent) +
          ':' + visit(n.alternate) +
          ')';
      },
    LogicalExpression: function(n) {
        return '(' + visit(n.left) + n.operator + visit(n.right) + ')';
      },
    ObjectExpression: function(n) {
        return '{' + n.properties.map(visit).join(',') + '}';
      },
    Property: function(n) {
        memberDepth += 1;
        var k = visit(n.key);
        memberDepth -= 1;
        return k + ':' + visit(n.value);
      }
  };
  function codegen(ast) {
    var result = {
      code:    visit(ast),
      globals: Object.keys(globals),
      fields:  Object.keys(fields)
    };
    globals = {};
    fields = {};
    return result;
  }
  codegen.functions = functions;
  codegen.constants = constants;
  return codegen;
}

var formatCache = {};
function formatter(type, method, specifier) {
  var k = type + ':' + specifier,
      e = formatCache[k];
  if (!e || e[0] !== method) {
    formatCache[k] = (e = [method, method(specifier)]);
  }
  return e[1];
}
function format$1(_$$1, specifier) {
  return formatter('format', format, specifier)(_$$1);
}
function timeFormat$1(_$$1, specifier) {
  return formatter('timeFormat', timeFormat, specifier)(_$$1);
}
function utcFormat$1(_$$1, specifier) {
  return formatter('utcFormat', utcFormat, specifier)(_$$1);
}
function timeParse$1(_$$1, specifier) {
  return formatter('timeParse', timeParse, specifier)(_$$1);
}
function utcParse$1(_$$1, specifier) {
  return formatter('utcParse', utcParse, specifier)(_$$1);
}
var dateObj = new Date(2000, 0, 1);
function time$1(month, day, specifier) {
  dateObj.setMonth(month);
  dateObj.setDate(day);
  return timeFormat$1(dateObj, specifier);
}
function monthFormat(month) {
  return time$1(month, 1, '%B');
}
function monthAbbrevFormat(month) {
  return time$1(month, 1, '%b');
}
function dayFormat(day) {
  return time$1(0, 2 + day, '%A');
}
function dayAbbrevFormat(day) {
  return time$1(0, 2 + day, '%a');
}

function quarter(date) {
  return 1 + ~~(new Date(date).getMonth() / 3);
}
function utcquarter(date) {
  return 1 + ~~(new Date(date).getUTCMonth() / 3);
}

function log$2(df, method, args) {
  try {
    df[method].apply(df, ['EXPRESSION'].concat([].slice.call(args)));
  } catch (err) {
    df.warn(err);
  }
  return args[args.length-1];
}
function warn() {
  return log$2(this.context.dataflow, 'warn', arguments);
}
function info() {
  return log$2(this.context.dataflow, 'info', arguments);
}
function debug() {
  return log$2(this.context.dataflow, 'debug', arguments);
}

function inScope(item) {
  var group = this.context.group,
      value = false;
  if (group) while (item) {
    if (item === group) { value = true; break; }
    item = item.mark.group;
  }
  return value;
}

function clampRange(range$$1, min$$1, max$$1) {
  var lo = range$$1[0],
      hi = range$$1[1],
      span;
  if (hi < lo) {
    span = hi;
    hi = lo;
    lo = span;
  }
  span = hi - lo;
  return span >= (max$$1 - min$$1)
    ? [min$$1, max$$1]
    : [
        Math.min(Math.max(lo, min$$1), max$$1 - span),
        Math.min(Math.max(hi, span), max$$1)
      ];
}

function pinchDistance(event) {
  var t = event.touches,
      dx = t[0].clientX - t[1].clientX,
      dy = t[0].clientY - t[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
function pinchAngle(event) {
  var t = event.touches;
  return Math.atan2(
    t[0].clientY - t[1].clientY,
    t[0].clientX - t[1].clientX
  );
}

var _window = (typeof window !== 'undefined' && window) || null;
function screen() {
  return _window ? _window.screen : {};
}
function windowSize() {
  return _window
    ? [_window.innerWidth, _window.innerHeight]
    : [undefined, undefined];
}
function containerSize() {
  var view = this.context.dataflow,
      el = view.container && view.container();
  return el
    ? [el.clientWidth, el.clientHeight]
    : [undefined, undefined];
}

function flush(range$$1, value, threshold, left, right, center) {
  var l = Math.abs(value - range$$1[0]),
      r = Math.abs(peek(range$$1) - value);
  return l < r && l <= threshold ? left
    : r <= threshold ? right
    : center;
}

function span(array) {
  return (array[array.length-1] - array[0]) || 0;
}

var Literal = 'Literal';
var Identifier$1 = 'Identifier';

var indexPrefix  = '@';
var scalePrefix  = '%';
var dataPrefix   = ':';

function getScale(name, ctx) {
  var s;
  return isFunction(name) ? name
    : isString(name) ? (s = ctx.scales[name]) && s.value
    : undefined;
}
function addScaleDependency(scope, params, name) {
  var scaleName = scalePrefix + name;
  if (!params.hasOwnProperty(scaleName)) {
    try {
      params[scaleName] = scope.scaleRef(name);
    } catch (err) {
    }
  }
}
function scaleVisitor(name, args, scope, params) {
  if (args[0].type === Literal) {
    addScaleDependency(scope, params, args[0].value);
  }
  else if (args[0].type === Identifier$1) {
    for (name in scope.scales) {
      addScaleDependency(scope, params, name);
    }
  }
}
function range$2(name, group) {
  var s = getScale(name, (group || this).context);
  return s && s.range ? s.range() : [];
}
function domain(name, group) {
  var s = getScale(name, (group || this).context);
  return s ? s.domain() : [];
}
function bandwidth(name, group) {
  var s = getScale(name, (group || this).context);
  return s && s.bandwidth ? s.bandwidth() : 0;
}
function bandspace(count, paddingInner, paddingOuter) {
  return bandSpace(count || 0, paddingInner || 0, paddingOuter || 0);
}
function copy(name, group) {
  var s = getScale(name, (group || this).context);
  return s ? s.copy() : undefined;
}
function scale$2(name, value, group) {
  var s = getScale(name, (group || this).context);
  return s ? s(value) : undefined;
}
function invert(name, range$$1, group) {
  var s = getScale(name, (group || this).context);
  return !s ? undefined
    : isArray(range$$1) ? (s.invertRange || s.invert)(range$$1)
    : (s.invert || s.invertExtent)(range$$1);
}

function scaleGradient(scale, p0, p1, count, group) {
  scale = getScale(scale, (group || this).context);
  var gradient = Gradient(p0, p1),
      stops = scale.domain(),
      min$$1 = stops[0],
      max$$1 = stops[stops.length-1],
      fraction = scaleFraction(scale, min$$1, max$$1);
  if (scale.ticks) {
    stops = scale.ticks(+count || 15);
    if (min$$1 !== stops[0]) stops.unshift(min$$1);
    if (max$$1 !== stops[stops.length-1]) stops.push(max$$1);
  }
  for (var i=0, n=stops.length; i<n; ++i) {
    gradient.stop(fraction(stops[i]), scale(stops[i]));
  }
  return gradient;
}

function geoMethod(methodName, globalMethod) {
  return function(projection, geojson, group) {
    if (projection) {
      var p = getScale(projection, (group || this).context);
      return p && p.path[methodName](geojson);
    } else {
      return globalMethod(geojson);
    }
  };
}
var geoArea$1 = geoMethod('area', geoArea);
var geoBounds$1 = geoMethod('bounds', geoBounds);
var geoCentroid$1 = geoMethod('centroid', geoCentroid);

function geoShape(projection, geojson, group) {
  var p = getScale(projection, (group || this).context);
  return function(context$$1) {
    return p ? p.path.context(context$$1)(geojson) : '';
  }
}
function pathShape(path$$1) {
  var p = null;
  return function(context$$1) {
    return context$$1
      ? pathRender(context$$1, (p = p || pathParse(path$$1)))
      : path$$1;
  };
}

function data$1(name) {
  var data = this.context.data[name];
  return data ? data.values.value : [];
}
function dataVisitor(name, args, scope, params) {
  if (args[0].type !== Literal) {
    error('First argument to data functions must be a string literal.');
  }
  var data = args[0].value,
      dataName = dataPrefix + data;
  if (!params.hasOwnProperty(dataName)) {
    params[dataName] = scope.getData(data).tuplesRef();
  }
}
function indata(name, field$$1, value) {
  var index = this.context.data[name]['index:' + field$$1],
      entry = index ? index.value.get(value) : undefined;
  return entry ? entry.count : entry;
}
function indataVisitor(name, args, scope, params) {
  if (args[0].type !== Literal) error('First argument to indata must be a string literal.');
  if (args[1].type !== Literal) error('Second argument to indata must be a string literal.');
  var data = args[0].value,
      field$$1 = args[1].value,
      indexName = indexPrefix + field$$1;
  if (!params.hasOwnProperty(indexName)) {
    params[indexName] = scope.getData(data).indataRef(scope, field$$1);
  }
}
function setdata(name, tuples) {
  var df = this.context.dataflow,
      data = this.context.data[name],
      input = data.input;
  df.pulse(input, df.changeset().remove(truthy).insert(tuples));
  return 1;
}

var EMPTY = {};
function datum(d) { return d.data; }
function treeNodes(name, context) {
  var tree$$1 = data$1.call(context, name);
  return tree$$1.root && tree$$1.root.lookup || EMPTY;
}
function treePath(name, source, target) {
  var nodes = treeNodes(name, this),
      s = nodes[source],
      t = nodes[target];
  return s && t ? s.path(t).map(datum) : undefined;
}
function treeAncestors(name, node) {
  var n = treeNodes(name, this)[node];
  return n ? n.ancestors().map(datum) : undefined;
}

function inrange(value, range$$1, left, right) {
  var r0 = range$$1[0], r1 = range$$1[range$$1.length-1], t;
  if (r0 > r1) {
    t = r0;
    r0 = r1;
    r1 = t;
  }
  left = left === undefined || left;
  right = right === undefined || right;
  return (left ? r0 <= value : r0 < value) &&
    (right ? value <= r1 : value < r1);
}

function encode$1(item, name, retval) {
  if (item) {
    var df = this.context.dataflow,
        target = item.mark.source;
    df.pulse(target, df.changeset().encode(item, name));
  }
  return retval !== undefined ? retval : item;
}

function equal(a, b) {
  return a === b || a !== a && b !== b ? true
    : isArray(a) && isArray(b) && a.length === b.length ? equalArray(a, b)
    : false;
}
function equalArray(a, b) {
  for (var i=0, n=a.length; i<n; ++i) {
    if (!equal(a[i], b[i])) return false;
  }
  return true;
}
function removePredicate(props) {
  return function(_$$1) {
    for (var key$$1 in props) {
      if (!equal(_$$1[key$$1], props[key$$1])) return false;
    }
    return true;
  };
}
function modify(name, insert, remove, toggle, modify, values) {
  var df = this.context.dataflow,
      data = this.context.data[name],
      input = data.input,
      changes = data.changes,
      stamp = df.stamp(),
      predicate, key$$1;
  if (df._trigger === false || !(input.value.length || insert || toggle)) {
    return 0;
  }
  if (!changes || changes.stamp < stamp) {
    data.changes = (changes = df.changeset());
    changes.stamp = stamp;
    df.runAfter(function() {
      data.modified = true;
      df.pulse(input, changes).run();
    }, true, 1);
  }
  if (remove) {
    predicate = remove === true ? truthy
      : (isArray(remove) || isTuple(remove)) ? remove
      : removePredicate(remove);
    changes.remove(predicate);
  }
  if (insert) {
    changes.insert(insert);
  }
  if (toggle) {
    predicate = removePredicate(toggle);
    if (input.value.some(predicate)) {
      changes.remove(predicate);
    } else {
      changes.insert(toggle);
    }
  }
  if (modify) {
    for (key$$1 in values) {
      changes.modify(modify, key$$1, values[key$$1]);
    }
  }
  return 1;
}

var BIN = 'bin_',
    INTERSECT = 'intersect',
    UNION = 'union',
    UNIT_INDEX = 'index:unit';
function testPoint(datum, entry) {
  var fields = entry.fields,
      values = entry.values,
      getter = entry.getter || (entry.getter = []),
      n = fields.length,
      i = 0, dval;
  for (; i<n; ++i) {
    getter[i] = getter[i] || field(fields[i]);
    dval = getter[i](datum);
    if (isDate(dval)) dval = toNumber(dval);
    if (isDate(values[i])) values[i] = toNumber(values[i]);
    if (entry[BIN + fields[i]]) {
      if (isDate(values[i][0])) values[i] = values[i].map(toNumber);
      if (!inrange(dval, values[i], true, false)) return false;
    } else if (dval !== values[i]) {
      return false;
    }
  }
  return true;
}
function testInterval(datum, entry) {
  var ivals = entry.intervals,
      n = ivals.length,
      i = 0,
      getter, extent$$1, value;
  for (; i<n; ++i) {
    extent$$1 = ivals[i].extent;
    getter = ivals[i].getter || (ivals[i].getter = field(ivals[i].field));
    value = getter(datum);
    if (!extent$$1 || extent$$1[0] === extent$$1[1]) return false;
    if (isDate(value)) value = toNumber(value);
    if (isDate(extent$$1[0])) extent$$1 = ivals[i].extent = extent$$1.map(toNumber);
    if (isNumber(extent$$1[0]) && !inrange(value, extent$$1)) return false;
    else if (isString(extent$$1[0]) && extent$$1.indexOf(value) < 0) return false;
  }
  return true;
}
function vlSelection(name, datum, op, test) {
  var data = this.context.data[name],
      entries = data ? data.values.value : [],
      unitIdx = data ? data[UNIT_INDEX] && data[UNIT_INDEX].value : undefined,
      intersect = op === INTERSECT,
      n = entries.length,
      i = 0,
      entry, miss, count, unit, b;
  for (; i<n; ++i) {
    entry = entries[i];
    if (unitIdx && intersect) {
      miss = miss || {};
      count = miss[unit=entry.unit] || 0;
      if (count === -1) continue;
      b = test(datum, entry);
      miss[unit] = b ? -1 : ++count;
      if (b && unitIdx.size === 1) return true;
      if (!b && count === unitIdx.get(unit).count) return false;
    } else {
      b = test(datum, entry);
      if (intersect ^ b) return b;
    }
  }
  return n && intersect;
}
function vlPoint(name, datum, op) {
  return vlSelection.call(this, name, datum, op, testPoint);
}
function vlInterval(name, datum, op) {
  return vlSelection.call(this, name, datum, op, testInterval);
}
function vlMultiVisitor(name, args, scope, params) {
  if (args[0].type !== Literal) error('First argument to indata must be a string literal.');
  var data = args[0].value,
      op = args.length >= 2 && args[args.length-1].value,
      field$$1 = 'unit',
      indexName = indexPrefix + field$$1;
  if (op === INTERSECT && !params.hasOwnProperty(indexName)) {
    params[indexName] = scope.getData(data).indataRef(scope, field$$1);
  }
  dataVisitor(name, args, scope, params);
}
function vlPointDomain(name, encoding, field$$1, op) {
  var data = this.context.data[name],
      entries = data ? data.values.value : [],
      unitIdx = data ? data[UNIT_INDEX] && data[UNIT_INDEX].value : undefined,
      entry = entries[0],
      i = 0, n, index, values, continuous, units;
  if (!entry) return undefined;
  for (n = encoding ? entry.encodings.length : entry.fields.length; i<n; ++i) {
    if ((encoding && entry.encodings[i] === encoding) ||
        (field$$1 && entry.fields[i] === field$$1)) {
      index = i;
      continuous = entry[BIN + entry.fields[i]];
      break;
    }
  }
  if (unitIdx && unitIdx.size === 1) {
    op = UNION;
  }
  if (unitIdx && op === INTERSECT) {
    units = entries.reduce(function(acc, entry) {
      var u = acc[entry.unit] || (acc[entry.unit] = []);
      u.push({unit: entry.unit, value: entry.values[index]});
      return acc;
    }, {});
    values = Object.keys(units).map(function(unit) {
      return {
        unit: unit,
        value: continuous
          ? continuousDomain(units[unit], UNION)
          : discreteDomain(units[unit], UNION)
      };
    });
  } else {
    values = entries.map(function(entry) {
      return {unit: entry.unit, value: entry.values[index]};
    });
  }
  return continuous ? continuousDomain(values, op) : discreteDomain(values, op);
}
function vlIntervalDomain(name, encoding, field$$1, op) {
  var data = this.context.data[name],
      entries = data ? data.values.value : [],
      entry = entries[0],
      i = 0, n, interval, index, values, discrete;
  if (!entry) return undefined;
  for (n = entry.intervals.length; i<n; ++i) {
    interval = entry.intervals[i];
    if ((encoding && interval.encoding === encoding) ||
        (field$$1 && interval.field === field$$1)) {
      if (!interval.extent) return undefined;
      index = i;
      discrete = interval.extent.length > 2;
      break;
    }
  }
  values = entries.reduce(function(acc, entry) {
    var extent$$1 = entry.intervals[index].extent,
        value = discrete
           ? extent$$1.map(function (d) { return {unit: entry.unit, value: d}; })
           : {unit: entry.unit, value: extent$$1};
    if (discrete) {
      acc.push.apply(acc, value);
    } else {
      acc.push(value);
    }
    return acc;
  }, []);
  return discrete ? discreteDomain(values, op) : continuousDomain(values, op);
}
function discreteDomain(entries, op) {
  var units = {}, count = 0,
      values = {}, domain = [],
      i = 0, n = entries.length,
      entry, unit, v, key$$1;
  for (; i<n; ++i) {
    entry = entries[i];
    unit  = entry.unit;
    key$$1   = entry.value;
    if (!units[unit]) units[unit] = ++count;
    if (!(v = values[key$$1])) {
      values[key$$1] = v = {value: key$$1, units: {}, count: 0};
    }
    if (!v.units[unit]) v.units[unit] = ++v.count;
  }
  for (key$$1 in values) {
    v = values[key$$1];
    if (op === INTERSECT && v.count !== count) continue;
    domain.push(v.value);
  }
  return domain.length ? domain : undefined;
}
function continuousDomain(entries, op) {
  var merge$$1 = op === INTERSECT ? intersectInterval : unionInterval,
      i = 0, n = entries.length,
      extent$$1, domain, lo, hi;
  for (; i<n; ++i) {
    extent$$1 = entries[i].value;
    if (isDate(extent$$1[0])) extent$$1 = extent$$1.map(toNumber);
    lo = extent$$1[0];
    hi = extent$$1[1];
    if (lo > hi) {
      hi = extent$$1[0];
      lo = extent$$1[1];
    }
    domain = domain ? merge$$1(domain, lo, hi) : [lo, hi];
  }
  return domain && domain.length && (+domain[0] !== +domain[1])
    ? domain
    : undefined;
}
function unionInterval(domain, lo, hi) {
  if (domain[0] > lo) domain[0] = lo;
  if (domain[1] < hi) domain[1] = hi;
  return domain;
}
function intersectInterval(domain, lo, hi) {
  if (hi < domain[0] || domain[1] < lo) {
    return [];
  } else {
    if (domain[0] < lo) domain[0] = lo;
    if (domain[1] > hi) domain[1] = hi;
  }
  return domain;
}

var functionContext = {
  random: function() { return random(); },
  isArray: isArray,
  isBoolean: isBoolean,
  isDate: isDate,
  isNumber: isNumber,
  isObject: isObject,
  isRegExp: isRegExp,
  isString: isString,
  isTuple: isTuple,
  toBoolean: toBoolean,
  toDate: toDate,
  toNumber: toNumber,
  toString: toString,
  pad: pad,
  peek: peek,
  truncate: truncate,
  rgb: rgb,
  lab: lab,
  hcl: hcl,
  hsl: hsl,
  sequence: range,
  format: format$1,
  utcFormat: utcFormat$1,
  utcParse: utcParse$1,
  timeFormat: timeFormat$1,
  timeParse: timeParse$1,
  monthFormat: monthFormat,
  monthAbbrevFormat: monthAbbrevFormat,
  dayFormat: dayFormat,
  dayAbbrevFormat: dayAbbrevFormat,
  quarter: quarter,
  utcquarter: utcquarter,
  warn: warn,
  info: info,
  debug: debug,
  inScope: inScope,
  clampRange: clampRange,
  pinchDistance: pinchDistance,
  pinchAngle: pinchAngle,
  screen: screen,
  containerSize: containerSize,
  windowSize: windowSize,
  span: span,
  flush: flush,
  bandspace: bandspace,
  inrange: inrange,
  setdata: setdata,
  pathShape: pathShape,
  panLinear: panLinear,
  panLog: panLog,
  panPow: panPow,
  zoomLinear: zoomLinear,
  zoomLog: zoomLog,
  zoomPow: zoomPow,
  encode: encode$1,
  modify: modify
};
var eventFunctions = ['view', 'item', 'group', 'xy', 'x', 'y'],
    eventPrefix = 'event.vega.',
    thisPrefix = 'this.',
    astVisitors = {};
function expressionFunction(name, fn, visitor) {
  if (arguments.length === 1) {
    return functionContext[name];
  }
  functionContext[name] = fn;
  if (visitor) astVisitors[name] = visitor;
  if (codeGenerator) codeGenerator.functions[name] = thisPrefix + name;
  return this;
}
expressionFunction('bandwidth', bandwidth, scaleVisitor);
expressionFunction('copy', copy, scaleVisitor);
expressionFunction('domain', domain, scaleVisitor);
expressionFunction('range', range$2, scaleVisitor);
expressionFunction('invert', invert, scaleVisitor);
expressionFunction('scale', scale$2, scaleVisitor);
expressionFunction('gradient', scaleGradient, scaleVisitor);
expressionFunction('geoArea', geoArea$1, scaleVisitor);
expressionFunction('geoBounds', geoBounds$1, scaleVisitor);
expressionFunction('geoCentroid', geoCentroid$1, scaleVisitor);
expressionFunction('geoShape', geoShape, scaleVisitor);
expressionFunction('indata', indata, indataVisitor);
expressionFunction('data', data$1, dataVisitor);
expressionFunction('vlSingle', vlPoint, dataVisitor);
expressionFunction('vlSingleDomain', vlPointDomain, dataVisitor);
expressionFunction('vlMulti', vlPoint, vlMultiVisitor);
expressionFunction('vlMultiDomain', vlPointDomain, vlMultiVisitor);
expressionFunction('vlInterval', vlInterval, dataVisitor);
expressionFunction('vlIntervalDomain', vlIntervalDomain, dataVisitor);
expressionFunction('treePath', treePath, dataVisitor);
expressionFunction('treeAncestors', treeAncestors, dataVisitor);
function buildFunctions(codegen$$1) {
  var fn = Functions(codegen$$1);
  eventFunctions.forEach(function(name) { fn[name] = eventPrefix + name; });
  for (var name in functionContext) { fn[name] = thisPrefix + name; }
  return fn;
}
var codegenParams = {
  blacklist:  ['_'],
  whitelist:  ['datum', 'event', 'item'],
  fieldvar:   'datum',
  globalvar:  function(id$$1) { return '_[' + $('$' + id$$1) + ']'; },
  functions:  buildFunctions,
  constants:  Constants,
  visitors:   astVisitors
};
var codeGenerator = codegen(codegenParams);

var signalPrefix = '$';
function expression(expr, scope, preamble) {
  var params = {}, ast, gen;
  try {
    ast = parse$2(expr);
  } catch (err) {
    error('Expression parse error: ' + $(expr));
  }
  ast.visit(function visitor(node) {
    if (node.type !== 'CallExpression') return;
    var name = node.callee.name,
        visit = codegenParams.visitors[name];
    if (visit) visit(name, node.arguments, scope, params);
  });
  gen = codeGenerator(ast);
  gen.globals.forEach(function(name) {
    var signalName = signalPrefix + name;
    if (!params.hasOwnProperty(signalName) && scope.getSignal(name)) {
      params[signalName] = scope.signalRef(name);
    }
  });
  return {
    $expr:   preamble ? preamble + 'return(' + gen.code + ');' : gen.code,
    $fields: gen.fields,
    $params: params
  };
}

function Entry(type, value, params, parent) {
  this.id = -1;
  this.type = type;
  this.value = value;
  this.params = params;
  if (parent) this.parent = parent;
}
function entry(type, value, params, parent) {
  return new Entry(type, value, params, parent);
}
function operator(value, params) {
  return entry('operator', value, params);
}
function ref(op) {
  var ref = {$ref: op.id};
  if (op.id < 0) (op.refs = op.refs || []).push(ref);
  return ref;
}
var tupleidRef = {
  $tupleid: 1,
  toString: function() { return ':_tupleid_:'; }
};
function fieldRef(field$$1, name) {
  return name ? {$field: field$$1, $name: name} : {$field: field$$1};
}
var keyFieldRef = fieldRef('key');
function compareRef(fields, orders) {
  return {$compare: fields, $order: orders};
}
function keyRef(fields, flat) {
  var ref = {$key: fields};
  if (flat) ref.$flat = true;
  return ref;
}
var Ascending  = 'ascending';
var Descending = 'descending';
function sortKey(sort) {
  return !isObject(sort) ? ''
    : (sort.order === Descending ? '-' : '+')
      + aggrField(sort.op, sort.field);
}
function aggrField(op, field$$1) {
  return (op && op.signal ? '$' + op.signal : op || '')
    + (op && field$$1 ? '_' : '')
    + (field$$1 && field$$1.signal ? '$' + field$$1.signal : field$$1 || '');
}
var Scope = 'scope';
var View = 'view';
function isSignal(_$$1) {
  return _$$1 && _$$1.signal;
}
function value(specValue, defaultValue) {
  return specValue != null ? specValue : defaultValue;
}

function parseStream(stream, scope) {
  return stream.signal ? scope.getSignal(stream.signal).id
    : stream.scale ? scope.getScale(stream.scale).id
    : parseStream$1(stream, scope);
}
function eventSource(source) {
   return source === Scope ? View : (source || View);
}
function parseStream$1(stream, scope) {
  var method = stream.merge ? mergeStream
    : stream.stream ? nestedStream
    : stream.type ? eventStream
    : error('Invalid stream specification: ' + $(stream));
  return method(stream, scope);
}
function mergeStream(stream, scope) {
  var list = stream.merge.map(function(s) {
    return parseStream$1(s, scope);
  });
  var entry$$1 = streamParameters({merge: list}, stream, scope);
  return scope.addStream(entry$$1).id;
}
function nestedStream(stream, scope) {
  var id$$1 = parseStream$1(stream.stream, scope),
      entry$$1 = streamParameters({stream: id$$1}, stream, scope);
  return scope.addStream(entry$$1).id;
}
function eventStream(stream, scope) {
  var id$$1 = scope.event(eventSource(stream.source), stream.type),
      entry$$1 = streamParameters({stream: id$$1}, stream, scope);
  return Object.keys(entry$$1).length === 1 ? id$$1
    : scope.addStream(entry$$1).id;
}
function streamParameters(entry$$1, stream, scope) {
  var param = stream.between;
  if (param) {
    if (param.length !== 2) {
      error('Stream "between" parameter must have 2 entries: ' + $(stream));
    }
    entry$$1.between = [
      parseStream$1(param[0], scope),
      parseStream$1(param[1], scope)
    ];
  }
  param = stream.filter ? array(stream.filter) : [];
  if (stream.marktype || stream.markname || stream.markrole) {
    param.push(filterMark(stream.marktype, stream.markname, stream.markrole));
  }
  if (stream.source === Scope) {
    param.push('inScope(event.item)');
  }
  if (param.length) {
    entry$$1.filter = expression('(' + param.join(')&&(') + ')').$expr;
  }
  if ((param = stream.throttle) != null) {
    entry$$1.throttle = +param;
  }
  if ((param = stream.debounce) != null) {
    entry$$1.debounce = +param;
  }
  if (stream.consume) {
    entry$$1.consume = true;
  }
  return entry$$1;
}
function filterMark(type, name, role) {
  var item = 'event.item';
  return item
    + (type && type !== '*' ? '&&' + item + '.mark.marktype===\'' + type + '\'' : '')
    + (role ? '&&' + item + '.mark.role===\'' + role + '\'' : '')
    + (name ? '&&' + item + '.mark.name===\'' + name + '\'' : '');
}

function selector(selector, source, marks) {
  DEFAULT_SOURCE = source || VIEW$1;
  MARKS = marks || DEFAULT_MARKS;
  return parseMerge(selector.trim()).map(parseSelector);
}
var VIEW$1    = 'view',
    LBRACK  = '[',
    RBRACK  = ']',
    LBRACE  = '{',
    RBRACE  = '}',
    COLON   = ':',
    COMMA   = ',',
    NAME    = '@',
    GT      = '>',
    ILLEGAL$1 = /[[\]{}]/,
    DEFAULT_SOURCE,
    MARKS,
    DEFAULT_MARKS = {
      '*': 1,
      arc: 1,
      area: 1,
      group: 1,
      image: 1,
      line: 1,
      path: 1,
      rect: 1,
      rule: 1,
      shape: 1,
      symbol: 1,
      text: 1,
      trail: 1
    };
function isMarkType(type) {
  return MARKS.hasOwnProperty(type);
}
function find(s, i, endChar, pushChar, popChar) {
  var count = 0,
      n = s.length,
      c;
  for (; i<n; ++i) {
    c = s[i];
    if (!count && c === endChar) return i;
    else if (popChar && popChar.indexOf(c) >= 0) --count;
    else if (pushChar && pushChar.indexOf(c) >= 0) ++count;
  }
  return i;
}
function parseMerge(s) {
  var output = [],
      start = 0,
      n = s.length,
      i = 0;
  while (i < n) {
    i = find(s, i, COMMA, LBRACK + LBRACE, RBRACK + RBRACE);
    output.push(s.substring(start, i).trim());
    start = ++i;
  }
  if (output.length === 0) {
    throw 'Empty event selector: ' + s;
  }
  return output;
}
function parseSelector(s) {
  return s[0] === '['
    ? parseBetween(s)
    : parseStream$2(s);
}
function parseBetween(s) {
  var n = s.length,
      i = 1,
      b, stream;
  i = find(s, i, RBRACK, LBRACK, RBRACK);
  if (i === n) {
    throw 'Empty between selector: ' + s;
  }
  b = parseMerge(s.substring(1, i));
  if (b.length !== 2) {
    throw 'Between selector must have two elements: ' + s;
  }
  s = s.slice(i + 1).trim();
  if (s[0] !== GT) {
    throw 'Expected \'>\' after between selector: ' + s;
  }
  b = b.map(parseSelector);
  stream = parseSelector(s.slice(1).trim());
  if (stream.between) {
    return {
      between: b,
      stream: stream
    };
  } else {
    stream.between = b;
  }
  return stream;
}
function parseStream$2(s) {
  var stream = {source: DEFAULT_SOURCE},
      source = [],
      throttle = [0, 0],
      markname = 0,
      start = 0,
      n = s.length,
      i = 0, j,
      filter;
  if (s[n-1] === RBRACE) {
    i = s.lastIndexOf(LBRACE);
    if (i >= 0) {
      try {
        throttle = parseThrottle(s.substring(i+1, n-1));
      } catch (e) {
        throw 'Invalid throttle specification: ' + s;
      }
      s = s.slice(0, i).trim();
      n = s.length;
    } else throw 'Unmatched right brace: ' + s;
    i = 0;
  }
  if (!n) throw s;
  if (s[0] === NAME) markname = ++i;
  j = find(s, i, COLON);
  if (j < n) {
    source.push(s.substring(start, j).trim());
    start = i = ++j;
  }
  i = find(s, i, LBRACK);
  if (i === n) {
    source.push(s.substring(start, n).trim());
  } else {
    source.push(s.substring(start, i).trim());
    filter = [];
    start = ++i;
    if (start === n) throw 'Unmatched left bracket: ' + s;
  }
  while (i < n) {
    i = find(s, i, RBRACK);
    if (i === n) throw 'Unmatched left bracket: ' + s;
    filter.push(s.substring(start, i).trim());
    if (i < n-1 && s[++i] !== LBRACK) throw 'Expected left bracket: ' + s;
    start = ++i;
  }
  if (!(n = source.length) || ILLEGAL$1.test(source[n-1])) {
    throw 'Invalid event selector: ' + s;
  }
  if (n > 1) {
    stream.type = source[1];
    if (markname) {
      stream.markname = source[0].slice(1);
    } else if (isMarkType(source[0])) {
      stream.marktype = source[0];
    } else {
      stream.source = source[0];
    }
  } else {
    stream.type = source[0];
  }
  if (stream.type.slice(-1) === '!') {
    stream.consume = true;
    stream.type = stream.type.slice(0, -1);
  }
  if (filter != null) stream.filter = filter;
  if (throttle[0]) stream.throttle = throttle[0];
  if (throttle[1]) stream.debounce = throttle[1];
  return stream;
}
function parseThrottle(s) {
  var a = s.split(COMMA);
  if (!s.length || a.length > 2) throw s;
  return a.map(function(_$$1) {
    var x = +_$$1;
    if (x !== x) throw s;
    return x;
  });
}

var preamble = 'var datum=event.item&&event.item.datum;';
function parseUpdate(spec, scope, target) {
  var events = spec.events,
      update = spec.update,
      encode = spec.encode,
      sources = [],
      value$$1 = '', entry$$1;
  if (!events) {
    error('Signal update missing events specification.');
  }
  if (isString(events)) {
    events = selector(events, scope.isSubscope() ? Scope : View);
  }
  events = array(events).filter(function(stream) {
    if (stream.signal || stream.scale) {
      sources.push(stream);
      return 0;
    } else {
      return 1;
    }
  });
  if (events.length) {
    sources.push(events.length > 1 ? {merge: events} : events[0]);
  }
  if (encode != null) {
    if (update) error('Signal encode and update are mutually exclusive.');
    update = 'encode(item(),' + $(encode) + ')';
  }
  value$$1 = isString(update) ? expression(update, scope, preamble)
    : update.expr != null ? expression(update.expr, scope, preamble)
    : update.value != null ? update.value
    : update.signal != null ? {
        $expr:   '_.value',
        $params: {value: scope.signalRef(update.signal)}
      }
    : error('Invalid signal update specification.');
  entry$$1 = {
    target: target,
    update: value$$1
  };
  if (spec.force) {
    entry$$1.options = {force: true};
  }
  sources.forEach(function(source) {
    source = {source: parseStream(source, scope)};
    scope.addUpdate(extend(source, entry$$1));
  });
}

function parseSignalUpdates(signal, scope) {
  var op = scope.getSignal(signal.name);
  if (signal.update) {
    var expr = expression(signal.update, scope);
    op.update = expr.$expr;
    op.params = expr.$params;
  }
  if (signal.on) {
    signal.on.forEach(function(_$$1) {
      parseUpdate(_$$1, scope, op.id);
    });
  }
}

function transform$1(name) {
  return function(params, value$$1, parent) {
    return entry(name, value$$1, params || undefined, parent);
  };
}
var Aggregate$1 = transform$1('aggregate');
var AxisTicks$1 = transform$1('axisticks');
var Bound$1 = transform$1('bound');
var Collect$1 = transform$1('collect');
var Compare$1 = transform$1('compare');
var DataJoin$1 = transform$1('datajoin');
var Encode$1 = transform$1('encode');
var Facet$1 = transform$1('facet');
var Field$1 = transform$1('field');
var Key$1 = transform$1('key');
var LegendEntries$1 = transform$1('legendentries');
var Mark$1 = transform$1('mark');
var MultiExtent$1 = transform$1('multiextent');
var MultiValues$1 = transform$1('multivalues');
var Overlap$1 = transform$1('overlap');
var Params$2 = transform$1('params');
var PreFacet$1 = transform$1('prefacet');
var Projection$1 = transform$1('projection');
var Proxy$1 = transform$1('proxy');
var Relay$1 = transform$1('relay');
var Render$1 = transform$1('render');
var Scale$1 = transform$1('scale');
var Sieve$1 = transform$1('sieve');
var SortItems$1 = transform$1('sortitems');
var ViewLayout$1 = transform$1('viewlayout');
var Values$1 = transform$1('values');

var FIELD_REF_ID = 0;
var types = [
  'identity',
  'ordinal', 'band', 'point',
  'bin-linear', 'bin-ordinal',
  'linear', 'pow', 'sqrt', 'log', 'sequential',
  'time', 'utc',
  'quantize', 'quantile', 'threshold'
];
var allTypes = toSet(types),
    ordinalTypes = toSet(types.slice(1, 6));
function isOrdinal(type) {
  return ordinalTypes.hasOwnProperty(type);
}
function isQuantile(type) {
  return type === 'quantile';
}
function initScale(spec, scope) {
  var type = spec.type || 'linear';
  if (!allTypes.hasOwnProperty(type)) {
    error('Unrecognized scale type: ' + $(type));
  }
  scope.addScale(spec.name, {
    type:   type,
    domain: undefined
  });
}
function parseScale(spec, scope) {
  var params = scope.getScale(spec.name).params,
      key$$1;
  params.domain = parseScaleDomain(spec.domain, spec, scope);
  if (spec.range != null) {
    params.range = parseScaleRange(spec, scope, params);
  }
  if (spec.interpolate != null) {
    parseScaleInterpolate(spec.interpolate, params);
  }
  if (spec.nice != null) {
    parseScaleNice(spec.nice, params);
  }
  for (key$$1 in spec) {
    if (params.hasOwnProperty(key$$1) || key$$1 === 'name') continue;
    params[key$$1] = parseLiteral(spec[key$$1], scope);
  }
}
function parseLiteral(v, scope) {
  return !isObject(v) ? v
    : v.signal ? scope.signalRef(v.signal)
    : error('Unsupported object: ' + $(v));
}
function parseArray(v, scope) {
  return v.signal
    ? scope.signalRef(v.signal)
    : v.map(function(v) { return parseLiteral(v, scope); });
}
function dataLookupError(name) {
  error('Can not find data set: ' + $(name));
}
function parseScaleDomain(domain, spec, scope) {
  if (!domain) {
    if (spec.domainMin != null || spec.domainMax != null) {
      error('No scale domain defined for domainMin/domainMax to override.');
    }
    return;
  }
  return domain.signal ? scope.signalRef(domain.signal)
    : (isArray(domain) ? explicitDomain
    : domain.fields ? multipleDomain
    : singularDomain)(domain, spec, scope);
}
function explicitDomain(domain, spec, scope) {
  return domain.map(function(v) {
    return parseLiteral(v, scope);
  });
}
function singularDomain(domain, spec, scope) {
  var data = scope.getData(domain.data);
  if (!data) dataLookupError(domain.data);
  return isOrdinal(spec.type)
      ? data.valuesRef(scope, domain.field, parseSort(domain.sort, false))
      : isQuantile(spec.type) ? data.domainRef(scope, domain.field)
      : data.extentRef(scope, domain.field);
}
function multipleDomain(domain, spec, scope) {
  var data = domain.data,
      fields = domain.fields.reduce(function(dom, d) {
        d = isString(d) ? {data: data, field: d}
          : (isArray(d) || d.signal) ? fieldRef$1(d, scope)
          : d;
        dom.push(d);
        return dom;
      }, []);
  return (isOrdinal(spec.type) ? ordinalMultipleDomain
    : isQuantile(spec.type) ? quantileMultipleDomain
    : numericMultipleDomain)(domain, scope, fields);
}
function fieldRef$1(data, scope) {
  var name = '_:vega:_' + (FIELD_REF_ID++),
      coll = Collect$1({});
  if (isArray(data)) {
    coll.value = {$ingest: data};
  } else if (data.signal) {
    var code = 'setdata(' + $(name) + ',' + data.signal + ')';
    coll.params.input = scope.signalRef(code);
  }
  scope.addDataPipeline(name, [coll, Sieve$1({})]);
  return {data: name, field: 'data'};
}
function ordinalMultipleDomain(domain, scope, fields) {
  var counts, a, c, v;
  counts = fields.map(function(f) {
    var data = scope.getData(f.data);
    if (!data) dataLookupError(f.data);
    return data.countsRef(scope, f.field);
  });
  a = scope.add(Aggregate$1({
    groupby: keyFieldRef,
    ops:['sum'], fields: [scope.fieldRef('count')], as:['count'],
    pulse: counts
  }));
  c = scope.add(Collect$1({pulse: ref(a)}));
  v = scope.add(Values$1({
    field: keyFieldRef,
    sort:  scope.sortRef(parseSort(domain.sort, true)),
    pulse: ref(c)
  }));
  return ref(v);
}
function parseSort(sort, multidomain) {
  if (sort) {
    if (!sort.field && !sort.op) {
      if (isObject(sort)) sort.field = 'key';
      else sort = {field: 'key'};
    } else if (!sort.field && sort.op !== 'count') {
      error('No field provided for sort aggregate op: ' + sort.op);
    } else if (multidomain && sort.field) {
      error('Multiple domain scales can not sort by field.');
    } else if (multidomain && sort.op && sort.op !== 'count') {
      error('Multiple domain scales support op count only.');
    }
  }
  return sort;
}
function quantileMultipleDomain(domain, scope, fields) {
  var values = fields.map(function(f) {
    var data = scope.getData(f.data);
    if (!data) dataLookupError(f.data);
    return data.domainRef(scope, f.field);
  });
  return ref(scope.add(MultiValues$1({values: values})));
}
function numericMultipleDomain(domain, scope, fields) {
  var extents = fields.map(function(f) {
    var data = scope.getData(f.data);
    if (!data) dataLookupError(f.data);
    return data.extentRef(scope, f.field);
  });
  return ref(scope.add(MultiExtent$1({extents: extents})));
}
function parseScaleNice(nice, params) {
  params.nice = isObject(nice)
    ? {
        interval: parseLiteral(nice.interval),
        step: parseLiteral(nice.step)
      }
    : parseLiteral(nice);
}
function parseScaleInterpolate(interpolate$$1, params) {
  params.interpolate = parseLiteral(interpolate$$1.type || interpolate$$1);
  if (interpolate$$1.gamma != null) {
    params.interpolateGamma = parseLiteral(interpolate$$1.gamma);
  }
}
function parseScaleRange(spec, scope, params) {
  var range$$1 = spec.range,
      config = scope.config.range;
  if (range$$1.signal) {
    return scope.signalRef(range$$1.signal);
  } else if (isString(range$$1)) {
    if (config && config.hasOwnProperty(range$$1)) {
      spec = extend({}, spec, {range: config[range$$1]});
      return parseScaleRange(spec, scope, params);
    } else if (range$$1 === 'width') {
      range$$1 = [0, {signal: 'width'}];
    } else if (range$$1 === 'height') {
      range$$1 = isOrdinal(spec.type)
        ? [0, {signal: 'height'}]
        : [{signal: 'height'}, 0];
    } else {
      error('Unrecognized scale range value: ' + $(range$$1));
    }
  } else if (range$$1.scheme) {
    params.scheme = parseLiteral(range$$1.scheme, scope);
    if (range$$1.extent) params.schemeExtent = parseArray(range$$1.extent, scope);
    if (range$$1.count) params.schemeCount = parseLiteral(range$$1.count, scope);
    return;
  } else if (range$$1.step) {
    params.rangeStep = parseLiteral(range$$1.step, scope);
    return;
  } else if (isOrdinal(spec.type) && !isArray(range$$1)) {
    return parseScaleDomain(range$$1, spec, scope);
  } else if (!isArray(range$$1)) {
    error('Unsupported range type: ' + $(range$$1));
  }
  return range$$1.map(function(v) {
    return parseLiteral(v, scope);
  });
}

function parseProjection(proj, scope) {
  var params = {};
  for (var name in proj) {
    if (name === 'name') continue;
    params[name] = parseParameter(proj[name], name, scope);
  }
  scope.addProjection(proj.name, params);
}
function parseParameter(_$$1, name, scope) {
  return isArray(_$$1) ? _$$1.map(function(_$$1) { return parseParameter(_$$1, name, scope); })
    : !isObject(_$$1) ? _$$1
    : _$$1.signal ? scope.signalRef(_$$1.signal)
    : name === 'fit' ? _$$1
    : error('Unsupported parameter object: ' + $(_$$1));
}

var Top$1 = 'top';
var Left$1 = 'left';
var Right$1 = 'right';
var Bottom$1 = 'bottom';
var Index  = 'index';
var Label  = 'label';
var Offset = 'offset';
var Perc   = 'perc';
var Size   = 'size';
var Total  = 'total';
var Value  = 'value';
var GuideLabelStyle = 'guide-label';
var GuideTitleStyle = 'guide-title';
var GroupTitleStyle = 'group-title';
var LegendScales = [
  'shape',
  'size',
  'fill',
  'stroke',
  'strokeDash',
  'opacity'
];
var Skip = {
  name: 1,
  interactive: 1
};

var Skip$1 = toSet(['rule']),
    Swap = toSet(['group', 'image', 'rect']);
function adjustSpatial(encode, marktype) {
  var code = '';
  if (Skip$1[marktype]) return code;
  if (encode.x2) {
    if (encode.x) {
      if (Swap[marktype]) {
        code += 'if(o.x>o.x2)$=o.x,o.x=o.x2,o.x2=$;';
      }
      code += 'o.width=o.x2-o.x;';
    } else {
      code += 'o.x=o.x2-(o.width||0);';
    }
  }
  if (encode.xc) {
    code += 'o.x=o.xc-(o.width||0)/2;';
  }
  if (encode.y2) {
    if (encode.y) {
      if (Swap[marktype]) {
        code += 'if(o.y>o.y2)$=o.y,o.y=o.y2,o.y2=$;';
      }
      code += 'o.height=o.y2-o.y;';
    } else {
      code += 'o.y=o.y2-(o.height||0);';
    }
  }
  if (encode.yc) {
    code += 'o.y=o.yc-(o.height||0)/2;';
  }
  return code;
}

function color$1(enc, scope, params, fields) {
  function color(type, x, y, z) {
    var a = entry$1(null, x, scope, params, fields),
        b = entry$1(null, y, scope, params, fields),
        c = entry$1(null, z, scope, params, fields);
    return 'this.' + type + '(' + [a, b, c].join(',') + ').toString()';
  }
  return (enc.c) ? color('hcl', enc.h, enc.c, enc.l)
    : (enc.h || enc.s) ? color('hsl', enc.h, enc.s, enc.l)
    : (enc.l || enc.a) ? color('lab', enc.l, enc.a, enc.b)
    : (enc.r || enc.g || enc.b) ? color('rgb', enc.r, enc.g, enc.b)
    : null;
}

function expression$1(code, scope, params, fields) {
  var expr = expression(code, scope);
  expr.$fields.forEach(function(name) { fields[name] = 1; });
  extend(params, expr.$params);
  return expr.$expr;
}

function field$1(ref, scope, params, fields) {
  return resolve$1(isObject(ref) ? ref : {datum: ref}, scope, params, fields);
}
function resolve$1(ref, scope, params, fields) {
  var object, level, field$$1;
  if (ref.signal) {
    object = 'datum';
    field$$1 = expression$1(ref.signal, scope, params, fields);
  } else if (ref.group || ref.parent) {
    level = Math.max(1, ref.level || 1);
    object = 'item';
    while (level-- > 0) {
      object += '.mark.group';
    }
    if (ref.parent) {
      field$$1 = ref.parent;
      object += '.datum';
    } else {
      field$$1 = ref.group;
    }
  } else if (ref.datum) {
    object = 'datum';
    field$$1 = ref.datum;
  } else {
    error('Invalid field reference: ' + $(ref));
  }
  if (!ref.signal) {
    if (isString(field$$1)) {
      fields[field$$1] = 1;
      field$$1 = splitAccessPath(field$$1).map($).join('][');
    } else {
      field$$1 = resolve$1(field$$1, scope, params, fields);
    }
  }
  return object + '[' + field$$1 + ']';
}

function scale$3(enc, value, scope, params, fields) {
  var scale = getScale$1(enc.scale, scope, params, fields),
      interp, func, flag;
  if (enc.range != null) {
    interp = +enc.range;
    func = scale + '.range()';
    value = (interp === 0) ? (func + '[0]')
      : '($=' + func + ',' + ((interp === 1) ? '$[$.length-1]'
      : '$[0]+' + interp + '*($[$.length-1]-$[0])') + ')';
  } else {
    if (value !== undefined) value = scale + '(' + value + ')';
    if (enc.band && (flag = hasBandwidth(enc.scale, scope))) {
      func = scale + '.bandwidth';
      interp = +enc.band;
      interp = func + '()' + (interp===1 ? '' : '*' + interp);
      if (flag < 0) interp = '(' + func + '?' + interp + ':0)';
      value = (value ? value + '+' : '') + interp;
      if (enc.extra) {
        value = '(datum.extra?' + scale + '(datum.extra.value):' + value + ')';
      }
    }
    if (value == null) value = '0';
  }
  return value;
}
function hasBandwidth(name, scope) {
  if (!isString(name)) return -1;
  var type = scope.scaleType(name);
  return type === 'band' || type === 'point' ? 1 : 0;
}
function getScale$1(name, scope, params, fields) {
  var scaleName;
  if (isString(name)) {
    scaleName = scalePrefix + name;
    if (!params.hasOwnProperty(scaleName)) {
      params[scaleName] = scope.scaleRef(name);
    }
    scaleName = $(scaleName);
  } else {
    for (scaleName in scope.scales) {
      params[scalePrefix + scaleName] = scope.scaleRef(scaleName);
    }
    scaleName = $(scalePrefix) + '+'
      + (name.signal
        ? '(' + expression$1(name.signal, scope, params, fields) + ')'
        : field$1(name, scope, params, fields));
  }
  return '_[' + scaleName + ']';
}

function gradient$1(enc, scope, params, fields) {
  return 'this.gradient('
    + getScale$1(enc.gradient, scope, params, fields)
    + ',' + $(enc.start)
    + ',' + $(enc.stop)
    + ',' + $(enc.count)
    + ')';
}

function property(property, scope, params, fields) {
  return isObject(property)
      ? '(' + entry$1(null, property, scope, params, fields) + ')'
      : property;
}

function entry$1(channel, enc, scope, params, fields) {
  if (enc.gradient != null) {
    return gradient$1(enc, scope, params, fields);
  }
  var value = enc.signal ? expression$1(enc.signal, scope, params, fields)
    : enc.color ? color$1(enc.color, scope, params, fields)
    : enc.field != null ? field$1(enc.field, scope, params, fields)
    : enc.value !== undefined ? $(enc.value)
    : undefined;
  if (enc.scale != null) {
    value = scale$3(enc, value, scope, params, fields);
  }
  if (value === undefined) {
    value = null;
  }
  if (enc.exponent != null) {
    value = 'Math.pow(' + value + ','
      + property(enc.exponent, scope, params, fields) + ')';
  }
  if (enc.mult != null) {
    value += '*' + property(enc.mult, scope, params, fields);
  }
  if (enc.offset != null) {
    value += '+' + property(enc.offset, scope, params, fields);
  }
  if (enc.round) {
    value = 'Math.round(' + value + ')';
  }
  return value;
}

function set$2(obj, key$$1, value) {
  return obj + '[' + $(key$$1) + ']=' + value + ';';
}

function rule$1(channel, rules, scope, params, fields) {
  var code = '';
  rules.forEach(function(rule) {
    var value = entry$1(channel, rule, scope, params, fields);
    code += rule.test
      ? expression$1(rule.test, scope, params, fields) + '?' + value + ':'
      : value;
  });
  return set$2('o', channel, code);
}

function parseEncode(encode, marktype, params, scope) {
  var fields = {},
      code = 'var o=item,datum=o.datum,$;',
      channel, enc, value;
  for (channel in encode) {
    enc = encode[channel];
    if (isArray(enc)) {
      code += rule$1(channel, enc, scope, params, fields);
    } else {
      value = entry$1(channel, enc, scope, params, fields);
      code += set$2('o', channel, value);
    }
  }
  code += adjustSpatial(encode, marktype);
  code += 'return 1;';
  return {
    $expr:   code,
    $fields: Object.keys(fields),
    $output: Object.keys(encode)
  };
}

var MarkRole = 'mark';
var FrameRole$1 = 'frame';
var ScopeRole$1 = 'scope';
var AxisRole$2 = 'axis';
var AxisDomainRole = 'axis-domain';
var AxisGridRole = 'axis-grid';
var AxisLabelRole = 'axis-label';
var AxisTickRole = 'axis-tick';
var AxisTitleRole = 'axis-title';
var LegendRole$2 = 'legend';
var LegendEntryRole = 'legend-entry';
var LegendGradientRole = 'legend-gradient';
var LegendLabelRole = 'legend-label';
var LegendSymbolRole = 'legend-symbol';
var LegendTitleRole = 'legend-title';
var TitleRole$1 = 'title';

function encoder(_$$1) {
  return isObject(_$$1) ? _$$1 : {value: _$$1};
}
function addEncode(object, name, value) {
  if (value != null) {
    object[name] = isObject(value) && !isArray(value) ? value : {value: value};
    return 1;
  } else {
    return 0;
  }
}
function extendEncode(encode, extra, skip) {
  for (var name in extra) {
    if (skip && skip.hasOwnProperty(name)) continue;
    encode[name] = extend(encode[name] || {}, extra[name]);
  }
  return encode;
}
function encoders(encode, type, role, style, scope, params) {
  var enc, key$$1;
  params = params || {};
  params.encoders = {$encode: (enc = {})};
  encode = applyDefaults(encode, type, role, style, scope.config);
  for (key$$1 in encode) {
    enc[key$$1] = parseEncode(encode[key$$1], type, params, scope);
  }
  return params;
}
function applyDefaults(encode, type, role, style, config) {
  var enter = {}, key$$1, skip, props;
  if (role == 'legend' || String(role).indexOf('axis') === 0) {
    role = null;
  }
  props = role === FrameRole$1 ? config.group
    : (role === MarkRole) ? extend({}, config.mark, config[type])
    : null;
  for (key$$1 in props) {
    skip = has(key$$1, encode)
      || (key$$1 === 'fill' || key$$1 === 'stroke')
      && (has('fill', encode) || has('stroke', encode));
    if (!skip) enter[key$$1] = {value: props[key$$1]};
  }
  array(style).forEach(function(name) {
    var props = config.style && config.style[name];
    for (var key$$1 in props) {
      if (!has(key$$1, encode)) {
        enter[key$$1] = {value: props[key$$1]};
      }
    }
  });
  encode = extend({}, encode);
  encode.enter = extend(enter, encode.enter);
  return encode;
}
function has(key$$1, encode) {
  return encode && (
    (encode.enter && encode.enter[key$$1]) ||
    (encode.update && encode.update[key$$1])
  );
}

function guideMark(type, role, style, key, dataRef, encode, extras) {
  return {
    type:  type,
    name:  extras ? extras.name : undefined,
    role:  role,
    style: (extras && extras.style) || style,
    key:   key,
    from:  dataRef,
    interactive: !!(extras && extras.interactive),
    encode: extendEncode(encode, extras, Skip)
  };
}

var GroupMark = 'group';
var RectMark = 'rect';
var RuleMark = 'rule';
var SymbolMark = 'symbol';
var TextMark = 'text';

function legendGradient(spec, scale, config, userEncode) {
  var zero = {value: 0},
      encode = {}, enter, update;
  encode.enter = enter = {
    opacity: zero,
    x: zero,
    y: zero
  };
  addEncode(enter, 'width', config.gradientWidth);
  addEncode(enter, 'height', config.gradientHeight);
  addEncode(enter, 'stroke', config.gradientStrokeColor);
  addEncode(enter, 'strokeWidth', config.gradientStrokeWidth);
  encode.exit = {
    opacity: zero
  };
  encode.update = update = {
    x: zero,
    y: zero,
    fill: {gradient: scale, start: [0,0], stop: [1,0]},
    opacity: {value: 1}
  };
  addEncode(update, 'width', config.gradientWidth);
  addEncode(update, 'height', config.gradientHeight);
  return guideMark(RectMark, LegendGradientRole, null, undefined, undefined, encode, userEncode);
}

var alignExpr = 'datum.' + Perc + '<=0?"left"'
  + ':datum.' + Perc + '>=1?"right":"center"';
function legendGradientLabels(spec, config, userEncode, dataRef) {
  var zero = {value: 0},
      encode = {}, enter, update;
  encode.enter = enter = {
    opacity: zero
  };
  addEncode(enter, 'fill', config.labelColor);
  addEncode(enter, 'font', config.labelFont);
  addEncode(enter, 'fontSize', config.labelFontSize);
  addEncode(enter, 'fontWeight', config.labelFontWeight);
  addEncode(enter, 'baseline', config.gradientLabelBaseline);
  addEncode(enter, 'limit', config.gradientLabelLimit);
  encode.exit = {
    opacity: zero
  };
  encode.update = update = {
    opacity: {value: 1},
    text: {field: Label}
  };
  enter.x = update.x = {
    field: Perc,
    mult: config.gradientWidth
  };
  enter.y = update.y = {
    value: config.gradientHeight,
    offset: config.gradientLabelOffset
  };
  enter.align = update.align = {signal: alignExpr};
  return guideMark(TextMark, LegendLabelRole, GuideLabelStyle, Perc, dataRef, encode, userEncode);
}

function legendLabels(spec, config, userEncode, dataRef) {
  var zero = {value: 0},
      encode = {}, enter, update;
  encode.enter = enter = {
    opacity: zero
  };
  addEncode(enter, 'align', config.labelAlign);
  addEncode(enter, 'baseline', config.labelBaseline);
  addEncode(enter, 'fill', config.labelColor);
  addEncode(enter, 'font', config.labelFont);
  addEncode(enter, 'fontSize', config.labelFontSize);
  addEncode(enter, 'fontWeight', config.labelFontWeight);
  addEncode(enter, 'limit', config.labelLimit);
  encode.exit = {
    opacity: zero
  };
  encode.update = update = {
    opacity: {value: 1},
    text: {field: Label}
  };
  enter.x = update.x = {
    field:  Offset,
    offset: config.labelOffset
  };
  enter.y = update.y = {
    field:  Size,
    mult:   0.5,
    offset: {
      field: Total,
      offset: {
        field: {group: 'entryPadding'},
        mult: {field: Index}
      }
    }
  };
  return guideMark(TextMark, LegendLabelRole, GuideLabelStyle, Value, dataRef, encode, userEncode);
}

function legendSymbols(spec, config, userEncode, dataRef) {
  var zero = {value: 0},
      encode = {}, enter, update;
  encode.enter = enter = {
    opacity: zero
  };
  addEncode(enter, 'shape', config.symbolType);
  addEncode(enter, 'size', config.symbolSize);
  addEncode(enter, 'strokeWidth', config.symbolStrokeWidth);
  if (!spec.fill) {
    addEncode(enter, 'fill', config.symbolFillColor);
    addEncode(enter, 'stroke', config.symbolStrokeColor);
  }
  encode.exit = {
    opacity: zero
  };
  encode.update = update = {
    opacity: {value: 1}
  };
  enter.x = update.x = {
    field: Offset,
    mult:  0.5
  };
  enter.y = update.y = {
    field: Size,
    mult:  0.5,
    offset: {
      field: Total,
      offset: {
        field: {group: 'entryPadding'},
        mult: {field: Index}
      }
    }
  };
  LegendScales.forEach(function(scale) {
    if (spec[scale]) {
      update[scale] = enter[scale] = {scale: spec[scale], field: Value};
    }
  });
  return guideMark(SymbolMark, LegendSymbolRole, null, Value, dataRef, encode, userEncode);
}

function legendTitle(spec, config, userEncode, dataRef) {
  var zero = {value: 0},
      title = spec.title,
      encode = {}, enter;
  encode.enter = enter = {
    x: {field: {group: 'padding'}},
    y: {field: {group: 'padding'}},
    opacity: zero
  };
  addEncode(enter, 'align', config.titleAlign);
  addEncode(enter, 'baseline', config.titleBaseline);
  addEncode(enter, 'fill', config.titleColor);
  addEncode(enter, 'font', config.titleFont);
  addEncode(enter, 'fontSize', config.titleFontSize);
  addEncode(enter, 'fontWeight', config.titleFontWeight);
  addEncode(enter, 'limit', config.titleLimit);
  encode.exit = {
    opacity: zero
  };
  encode.update = {
    opacity: {value: 1},
    text: title && title.signal ? {signal: title.signal} : {value: title + ''}
  };
  return guideMark(TextMark, LegendTitleRole, GuideTitleStyle, null, dataRef, encode, userEncode);
}

function guideGroup(role, style, name, dataRef, interactive, encode, marks) {
  return {
    type: GroupMark,
    name: name,
    role: role,
    style: style,
    from: dataRef,
    interactive: interactive || false,
    encode: encode,
    marks: marks
  };
}

function clip$2(clip, scope) {
  var expr;
  if (isObject(clip)) {
    if (clip.signal) {
      expr = clip.signal;
    } else if (clip.path) {
      expr = 'pathShape(' + param(clip.path) + ')';
    } else if (clip.sphere) {
      expr = 'geoShape(' + param(clip.sphere) + ', {type: "Sphere"})';
    }
  }
  return expr
    ? scope.signalRef(expr)
    : !!clip;
}
function param(value) {
  return isObject(value) && value.signal
    ? value.signal
    : $(value);
}

function role(spec) {
  var role = spec.role || '';
  return (!role.indexOf('axis') || !role.indexOf('legend'))
    ? role
    : spec.type === GroupMark ? ScopeRole$1 : (role || MarkRole);
}

function definition$1(spec) {
  return {
    marktype:    spec.type,
    name:        spec.name || undefined,
    role:        spec.role || role(spec),
    zindex:      +spec.zindex || undefined
  };
}

function interactive(spec, scope) {
  return spec && spec.signal ? scope.signalRef(spec.signal)
    : spec === false ? false
    : true;
}

function parseTransform(spec, scope) {
  var def = definition(spec.type);
  if (!def) error('Unrecognized transform type: ' + $(spec.type));
  var t = entry(def.type.toLowerCase(), null, parseParameters(def, spec, scope));
  if (spec.signal) scope.addSignal(spec.signal, scope.proxy(t));
  t.metadata = def.metadata || {};
  return t;
}
function parseParameters(def, spec, scope) {
  var params = {}, pdef, i, n;
  for (i=0, n=def.params.length; i<n; ++i) {
    pdef = def.params[i];
    params[pdef.name] = parseParameter$1(pdef, spec, scope);
  }
  return params;
}
function parseParameter$1(def, spec, scope) {
  var type = def.type,
      value$$1 = spec[def.name];
  if (type === 'index') {
    return parseIndexParameter(def, spec, scope);
  } else if (value$$1 === undefined) {
    if (def.required) {
      error('Missing required ' + $(spec.type)
          + ' parameter: ' + $(def.name));
    }
    return;
  } else if (type === 'param') {
    return parseSubParameters(def, spec, scope);
  } else if (type === 'projection') {
    return scope.projectionRef(spec[def.name]);
  }
  return def.array && !isSignal(value$$1)
    ? value$$1.map(function(v) { return parameterValue(def, v, scope); })
    : parameterValue(def, value$$1, scope);
}
function parameterValue(def, value$$1, scope) {
  var type = def.type;
  if (isSignal(value$$1)) {
    return isExpr(type) ? error('Expression references can not be signals.')
         : isField(type) ? scope.fieldRef(value$$1)
         : isCompare(type) ? scope.compareRef(value$$1)
         : scope.signalRef(value$$1.signal);
  } else {
    var expr = def.expr || isField(type);
    return expr && outerExpr(value$$1) ? expression(value$$1.expr, scope)
         : expr && outerField(value$$1) ? fieldRef(value$$1.field)
         : isExpr(type) ? expression(value$$1, scope)
         : isData(type) ? ref(scope.getData(value$$1).values)
         : isField(type) ? fieldRef(value$$1)
         : isCompare(type) ? scope.compareRef(value$$1)
         : value$$1;
  }
}
function parseIndexParameter(def, spec, scope) {
  if (!isString(spec.from)) {
    error('Lookup "from" parameter must be a string literal.');
  }
  return scope.getData(spec.from).lookupRef(scope, spec.key);
}
function parseSubParameters(def, spec, scope) {
  var value$$1 = spec[def.name];
  if (def.array) {
    if (!isArray(value$$1)) {
      error('Expected an array of sub-parameters. Instead: ' + $(value$$1));
    }
    return value$$1.map(function(v) {
      return parseSubParameter(def, v, scope);
    });
  } else {
    return parseSubParameter(def, value$$1, scope);
  }
}
function parseSubParameter(def, value$$1, scope) {
  var params, pdef, k, i, n;
  for (i=0, n=def.params.length; i<n; ++i) {
    pdef = def.params[i];
    for (k in pdef.key) {
      if (pdef.key[k] !== value$$1[k]) { pdef = null; break; }
    }
    if (pdef) break;
  }
  if (!pdef) error('Unsupported parameter: ' + $(value$$1));
  params = extend(parseParameters(pdef, value$$1, scope), pdef.key);
  return ref(scope.add(Params$2(params)));
}
function outerExpr(_$$1) {
  return _$$1 && _$$1.expr;
}
function outerField(_$$1) {
  return _$$1 && _$$1.field;
}
function isData(_$$1) {
  return _$$1 === 'data';
}
function isExpr(_$$1) {
  return _$$1 === 'expr';
}
function isField(_$$1) {
  return _$$1 === 'field';
}
function isCompare(_$$1) {
  return _$$1 === 'compare'
}

function parseData(from, group, scope) {
  var facet, key$$1, op, dataRef, parent;
  if (!from) {
    dataRef = ref(scope.add(Collect$1(null, [{}])));
  }
  else if (facet = from.facet) {
    if (!group) error('Only group marks can be faceted.');
    if (facet.field != null) {
      dataRef = parent = ref(scope.getData(facet.data).output);
    } else {
      if (!from.data) {
        op = parseTransform(extend({
          type:    'aggregate',
          groupby: array(facet.groupby)
        }, facet.aggregate), scope);
        op.params.key = scope.keyRef(facet.groupby);
        op.params.pulse = ref(scope.getData(facet.data).output);
        dataRef = parent = ref(scope.add(op));
      } else {
        parent = ref(scope.getData(from.data).aggregate);
      }
      key$$1 = scope.keyRef(facet.groupby, true);
    }
  }
  if (!dataRef) {
    dataRef = from.$ref ? from
      : ref(scope.getData(from.data).output);
  }
  return {
    key: key$$1,
    pulse: dataRef,
    parent: parent
  };
}

function DataScope(scope, input, output, values, aggr) {
  this.scope = scope;
  this.input = input;
  this.output = output;
  this.values = values;
  this.aggregate = aggr;
  this.index = {};
}
DataScope.fromEntries = function(scope, entries) {
  var n = entries.length,
      i = 1,
      input  = entries[0],
      values = entries[n-1],
      output = entries[n-2],
      aggr = null;
  scope.add(entries[0]);
  for (; i<n; ++i) {
    entries[i].params.pulse = ref(entries[i-1]);
    scope.add(entries[i]);
    if (entries[i].type === 'aggregate') aggr = entries[i];
  }
  return new DataScope(scope, input, output, values, aggr);
};
var prototype$1k = DataScope.prototype;
prototype$1k.countsRef = function(scope, field$$1, sort) {
  var ds = this,
      cache = ds.counts || (ds.counts = {}),
      k = fieldKey(field$$1), v, a, p;
  if (k != null) {
    scope = ds.scope;
    v = cache[k];
  }
  if (!v) {
    p = {
      groupby: scope.fieldRef(field$$1, 'key'),
      pulse: ref(ds.output)
    };
    if (sort && sort.field) addSortField(scope, p, sort);
    a = scope.add(Aggregate$1(p));
    v = scope.add(Collect$1({pulse: ref(a)}));
    v = {agg: a, ref: ref(v)};
    if (k != null) cache[k] = v;
  } else if (sort && sort.field) {
    addSortField(scope, v.agg.params, sort);
  }
  return v.ref;
};
function fieldKey(field$$1) {
  return isString(field$$1) ? field$$1 : null;
}
function addSortField(scope, p, sort) {
  var as = aggrField(sort.op, sort.field), s;
  if (p.ops) {
    for (var i=0, n=p.as.length; i<n; ++i) {
      if (p.as[i] === as) return;
    }
  } else {
    p.ops = ['count'];
    p.fields = [null];
    p.as = ['count'];
  }
  if (sort.op) {
    p.ops.push((s=sort.op.signal) ? scope.signalRef(s) : sort.op);
    p.fields.push(scope.fieldRef(sort.field));
    p.as.push(as);
  }
}
function cache(scope, ds, name, optype, field$$1, counts, index) {
  var cache = ds[name] || (ds[name] = {}),
      sort = sortKey(counts),
      k = fieldKey(field$$1), v, op;
  if (k != null) {
    scope = ds.scope;
    k = k + (sort ? '|' + sort : '');
    v = cache[k];
  }
  if (!v) {
    var params = counts
      ? {field: keyFieldRef, pulse: ds.countsRef(scope, field$$1, counts)}
      : {field: scope.fieldRef(field$$1), pulse: ref(ds.output)};
    if (sort) params.sort = scope.sortRef(counts);
    op = scope.add(entry(optype, undefined, params));
    if (index) ds.index[field$$1] = op;
    v = ref(op);
    if (k != null) cache[k] = v;
  }
  return v;
}
prototype$1k.tuplesRef = function() {
  return ref(this.values);
};
prototype$1k.extentRef = function(scope, field$$1) {
  return cache(scope, this, 'extent', 'extent', field$$1, false);
};
prototype$1k.domainRef = function(scope, field$$1) {
  return cache(scope, this, 'domain', 'values', field$$1, false);
};
prototype$1k.valuesRef = function(scope, field$$1, sort) {
  return cache(scope, this, 'vals', 'values', field$$1, sort || true);
};
prototype$1k.lookupRef = function(scope, field$$1) {
  return cache(scope, this, 'lookup', 'tupleindex', field$$1, false);
};
prototype$1k.indataRef = function(scope, field$$1) {
  return cache(scope, this, 'indata', 'tupleindex', field$$1, true, true);
};

function parseFacet(spec, scope, group) {
  var facet = spec.from.facet,
      name = facet.name,
      data = ref(scope.getData(facet.data).output),
      subscope, source, values, op;
  if (!facet.name) {
    error('Facet must have a name: ' + $(facet));
  }
  if (!facet.data) {
    error('Facet must reference a data set: ' + $(facet));
  }
  if (facet.field) {
    op = scope.add(PreFacet$1({
      field: scope.fieldRef(facet.field),
      pulse: data
    }));
  } else if (facet.groupby) {
    op = scope.add(Facet$1({
      key:   scope.keyRef(facet.groupby),
      group: ref(scope.proxy(group.parent)),
      pulse: data
    }));
  } else {
    error('Facet must specify groupby or field: ' + $(facet));
  }
  subscope = scope.fork();
  source = subscope.add(Collect$1());
  values = subscope.add(Sieve$1({pulse: ref(source)}));
  subscope.addData(name, new DataScope(subscope, source, source, values));
  subscope.addSignal('parent', null);
  op.params.subflow = {
    $subflow: parseSpec(spec, subscope).toRuntime()
  };
}

function parseSubflow(spec, scope, input) {
  var op = scope.add(PreFacet$1({pulse: input.pulse})),
      subscope = scope.fork();
  subscope.add(Sieve$1());
  subscope.addSignal('parent', null);
  op.params.subflow = {
    $subflow: parseSpec(spec, subscope).toRuntime()
  };
}

function parseTrigger(spec, scope, name) {
  var remove = spec.remove,
      insert = spec.insert,
      toggle = spec.toggle,
      modify = spec.modify,
      values = spec.values,
      op = scope.add(operator()),
      update, expr;
  update = 'if(' + spec.trigger + ',modify("'
    + name + '",'
    + [insert, remove, toggle, modify, values]
        .map(function(_$$1) { return _$$1 == null ? 'null' : _$$1; })
        .join(',')
    + '),0)';
  expr = expression(update, scope);
  op.update = expr.$expr;
  op.params = expr.$params;
}

function parseMark(spec, scope) {
  var role$$1 = role(spec),
      group = spec.type === GroupMark,
      facet = spec.from && spec.from.facet,
      layout = spec.layout || role$$1 === ScopeRole$1 || role$$1 === FrameRole$1,
      nested = role$$1 === MarkRole || layout || facet,
      overlap = spec.overlap,
      ops, op, input, store, bound, render, sieve, name,
      joinRef, markRef, encodeRef, layoutRef, boundRef;
  input = parseData(spec.from, group, scope);
  op = scope.add(DataJoin$1({
    key:   input.key || (spec.key ? fieldRef(spec.key) : undefined),
    pulse: input.pulse,
    clean: !group
  }));
  joinRef = ref(op);
  op = store = scope.add(Collect$1({pulse: joinRef}));
  op = scope.add(Mark$1({
    markdef:     definition$1(spec),
    interactive: interactive(spec.interactive, scope),
    clip:        clip$2(spec.clip, scope),
    context:     {$context: true},
    groups:      scope.lookup(),
    parent:      scope.signals.parent ? scope.signalRef('parent') : null,
    index:       scope.markpath(),
    pulse:       ref(op)
  }));
  markRef = ref(op);
  op = scope.add(Encode$1(
    encoders(spec.encode, spec.type, role$$1, spec.style, scope, {pulse: markRef})
  ));
  op.params.parent = scope.encode();
  if (spec.transform) {
    spec.transform.forEach(function(_$$1) {
      var tx = parseTransform(_$$1, scope);
      if (tx.metadata.generates || tx.metadata.changes) {
        error('Mark transforms should not generate new data.');
      }
      tx.params.pulse = ref(op);
      scope.add(op = tx);
    });
  }
  if (spec.sort) {
    op = scope.add(SortItems$1({
      sort:  scope.compareRef(spec.sort, true),
      pulse: ref(op)
    }));
  }
  encodeRef = ref(op);
  if (facet || layout) {
    layout = scope.add(ViewLayout$1({
      layout:       scope.objectProperty(spec.layout),
      legendMargin: scope.config.legendMargin,
      mark:         markRef,
      pulse:        encodeRef
    }));
    layoutRef = ref(layout);
  }
  bound = scope.add(Bound$1({mark: markRef, pulse: layoutRef || encodeRef}));
  boundRef = ref(bound);
  if (group) {
    if (nested) { ops = scope.operators; ops.pop(); if (layout) ops.pop(); }
    scope.pushState(encodeRef, layoutRef || boundRef, joinRef);
    facet ? parseFacet(spec, scope, input)
        : nested ? parseSubflow(spec, scope, input)
        : parseSpec(spec, scope);
    scope.popState();
    if (nested) { if (layout) ops.push(layout); ops.push(bound); }
  }
  if (overlap) {
    op = {
      method: overlap.method === true ? 'parity' : overlap.method,
      pulse:  boundRef
    };
    if (overlap.order) {
      op.sort = scope.compareRef({field: overlap.order});
    }
    if (overlap.bound) {
      op.boundScale = scope.scaleRef(overlap.bound.scale);
      op.boundOrient = overlap.bound.orient;
      op.boundTolerance = overlap.bound.tolerance;
    }
    boundRef = ref(scope.add(Overlap$1(op)));
  }
  render = scope.add(Render$1({pulse: boundRef}));
  sieve = scope.add(Sieve$1({pulse: ref(render)}, undefined, scope.parent()));
  if (spec.name != null) {
    name = spec.name;
    scope.addData(name, new DataScope(scope, store, render, sieve));
    if (spec.on) spec.on.forEach(function(on) {
      if (on.insert || on.remove || on.toggle) {
        error('Marks only support modify triggers.');
      }
      parseTrigger(on, scope, name);
    });
  }
}

function parseLegend(spec, scope) {
  var type = spec.type || 'symbol',
      config = scope.config.legend,
      encode = spec.encode || {},
      legendEncode = encode.legend || {},
      name = legendEncode.name || undefined,
      interactive = legendEncode.interactive,
      style = legendEncode.style,
      datum, dataRef, entryRef, group, title,
      entryEncode, params, children;
  var scale = spec.size || spec.shape || spec.fill || spec.stroke
           || spec.strokeDash || spec.opacity;
  if (!scale) {
    error('Missing valid scale for legend.');
  }
  datum = {
    orient: value(spec.orient, config.orient),
    title:  spec.title != null
  };
  dataRef = ref(scope.add(Collect$1(null, [datum])));
  legendEncode = extendEncode({
    enter: legendEnter(config),
    update: {
      offset:       encoder(value(spec.offset, config.offset)),
      padding:      encoder(value(spec.padding, config.padding)),
      titlePadding: encoder(value(spec.titlePadding, config.titlePadding))
    }
  }, legendEncode, Skip);
  entryEncode = {
    update: {
      x: {field: {group: 'padding'}},
      y: {field: {group: 'padding'}},
      entryPadding: encoder(value(spec.entryPadding, config.entryPadding))
    }
  };
  if (type === 'gradient') {
    entryRef = ref(scope.add(LegendEntries$1({
      type:   'gradient',
      scale:  scope.scaleRef(scale),
      count:  scope.objectProperty(spec.tickCount),
      values: scope.objectProperty(spec.values),
      formatSpecifier: scope.property(spec.format)
    })));
    children = [
      legendGradient(spec, scale, config, encode.gradient),
      legendGradientLabels(spec, config, encode.labels, entryRef)
    ];
  }
  else {
    entryRef = ref(scope.add(LegendEntries$1(params = {
      scale:  scope.scaleRef(scale),
      count:  scope.objectProperty(spec.tickCount),
      values: scope.objectProperty(spec.values),
      formatSpecifier: scope.property(spec.format)
    })));
    children = [
      legendSymbols(spec, config, encode.symbols, entryRef),
      legendLabels(spec, config, encode.labels, entryRef)
    ];
    params.size = sizeExpression(spec, scope, children);
  }
  children = [
    guideGroup(LegendEntryRole, null, null, dataRef, interactive, entryEncode, children)
  ];
  if (datum.title) {
    title = legendTitle(spec, config, encode.title, dataRef);
    entryEncode.update.y.offset = {
      field: {group: 'titlePadding'},
      offset: get$2('fontSize', title.encode, scope, GuideTitleStyle)
    };
    children.push(title);
  }
  group = guideGroup(LegendRole$2, style, name, dataRef, interactive, legendEncode, children);
  if (spec.zindex) group.zindex = spec.zindex;
  return parseMark(group, scope);
}
function sizeExpression(spec, scope, marks) {
  var fontSize = get$2('fontSize', marks[1].encode, scope, GuideLabelStyle),
      symbolSize = spec.size
        ? 'scale("' + spec.size + '",datum)'
        : deref(get$2('size', marks[0].encode, scope)),
      expr = 'max(ceil(sqrt(' + symbolSize + ')),' + deref(fontSize) + ')';
  return expression(expr, scope);
}
function legendEnter(config) {
  var enter = {},
      count = addEncode(enter, 'fill', config.fillColor)
            + addEncode(enter, 'stroke', config.strokeColor)
            + addEncode(enter, 'strokeWidth', config.strokeWidth)
            + addEncode(enter, 'strokeDash', config.strokeDash)
            + addEncode(enter, 'cornerRadius', config.cornerRadius);
  return count ? enter : undefined;
}
function deref(v) {
  return v && v.signal || v;
}
function get$2(name, encode, scope, style) {
  var v = encode && (
    (encode.update && encode.update[name]) ||
    (encode.enter && encode.enter[name])
  );
  return v && v.signal ? v
    : v ? +v.value
    : ((v = scope.config.style[style]) && +v[name]);
}

function parseTitle(spec, scope) {
  spec = isString(spec) ? {text: spec} : spec;
  var config = scope.config.title,
      encode = extend({}, spec.encode),
      datum, dataRef, title;
  datum = {
    orient: spec.orient != null ? spec.orient : config.orient
  };
  dataRef = ref(scope.add(Collect$1(null, [datum])));
  encode.name = spec.name;
  encode.interactive = spec.interactive;
  title = buildTitle(spec, config, encode, dataRef);
  if (spec.zindex) title.zindex = spec.zindex;
  return parseMark(title, scope);
}
function buildTitle(spec, config, userEncode, dataRef) {
  var title = spec.text,
      orient = spec.orient || config.orient,
      anchor = spec.anchor || config.anchor,
      sign = (orient === Left$1 || orient === Top$1) ? -1 : 1,
      horizontal = (orient === Top$1 || orient === Bottom$1),
      extent$$1 = {group: (horizontal ? 'width' : 'height')},
      encode = {}, enter, update, pos, opp, mult, align;
  encode.enter = enter = {
    opacity: {value: 0}
  };
  addEncode(enter, 'fill', config.color);
  addEncode(enter, 'font', config.font);
  addEncode(enter, 'fontSize', config.fontSize);
  addEncode(enter, 'fontWeight', config.fontWeight);
  encode.exit = {
    opacity: {value: 0}
  };
  encode.update = update = {
    opacity: {value: 1},
    text: isObject(title) ? title : {value: title + ''},
    offset: encoder((spec.offset != null ? spec.offset : config.offset) || 0)
  };
  if (anchor === 'start') {
    mult = 0;
    align = 'left';
  } else {
    if (anchor === 'end') {
      mult = 1;
      align = 'right';
    } else {
      mult = 0.5;
      align = 'center';
    }
  }
  pos = {field: extent$$1, mult: mult};
  opp = sign < 0 ? {value: 0}
    : horizontal ? {field: {group: 'height'}}
    : {field: {group: 'width'}};
  if (horizontal) {
    update.x = pos;
    update.y = opp;
    update.angle = {value: 0};
    update.baseline = {value: orient === Top$1 ? 'bottom' : 'top'};
  } else {
    update.x = opp;
    update.y = pos;
    update.angle = {value: sign * 90};
    update.baseline = {value: 'bottom'};
  }
  update.align = {value: align};
  update.limit = {field: extent$$1};
  addEncode(update, 'angle', config.angle);
  addEncode(update, 'baseline', config.baseline);
  addEncode(update, 'limit', config.limit);
  return guideMark(TextMark, TitleRole$1, spec.style || GroupTitleStyle, null, dataRef, encode, userEncode);
}

function parseData$1(data, scope) {
  var transforms = [];
  if (data.transform) {
    data.transform.forEach(function(tx) {
      transforms.push(parseTransform(tx, scope));
    });
  }
  if (data.on) {
    data.on.forEach(function(on) {
      parseTrigger(on, scope, data.name);
    });
  }
  scope.addDataPipeline(data.name, analyze(data, scope, transforms));
}
function analyze(data, scope, ops) {
  var output = [],
      source = null,
      modify = false,
      generate = false,
      upstream, i, n, t, m;
  if (data.values) {
    output.push(source = collect({$ingest: data.values, $format: data.format}));
  } else if (data.url) {
    output.push(source = collect({$request: data.url, $format: data.format}));
  } else if (data.source) {
    source = upstream = array(data.source).map(function(d) {
      return ref(scope.getData(d).output);
    });
    output.push(null);
  }
  for (i=0, n=ops.length; i<n; ++i) {
    t = ops[i];
    m = t.metadata;
    if (!source && !m.source) {
      output.push(source = collect());
    }
    output.push(t);
    if (m.generates) generate = true;
    if (m.modifies && !generate) modify = true;
    if (m.source) source = t;
    else if (m.changes) source = null;
  }
  if (upstream) {
    n = upstream.length - 1;
    output[0] = Relay$1({
      derive: modify,
      pulse: n ? upstream : upstream[0]
    });
    if (modify || n) {
      output.splice(1, 0, collect());
    }
  }
  if (!source) output.push(collect());
  output.push(Sieve$1({}));
  return output;
}
function collect(values) {
  var s = Collect$1({}, values);
  s.metadata = {source: true};
  return s;
}

function axisConfig(spec, scope) {
  var config = scope.config,
      orient = spec.orient,
      xy = (orient === Top$1 || orient === Bottom$1) ? config.axisX : config.axisY,
      or = config['axis' + orient[0].toUpperCase() + orient.slice(1)],
      band = scope.scaleType(spec.scale) === 'band' && config.axisBand;
  return (xy || or || band)
    ? extend({}, config.axis, xy, or, band)
    : config.axis;
}

function axisDomain(spec, config, userEncode, dataRef) {
  var orient = spec.orient,
      zero = {value: 0},
      encode = {}, enter, update, u, u2, v;
  encode.enter = enter = {
    opacity: zero
  };
  addEncode(enter, 'stroke', config.domainColor);
  addEncode(enter, 'strokeWidth', config.domainWidth);
  encode.exit = {
    opacity: zero
  };
  encode.update = update = {
    opacity: {value: 1}
  };
  if (orient === Top$1 || orient === Bottom$1) {
    u = 'x';
    v = 'y';
  } else {
    u = 'y';
    v = 'x';
  }
  u2 = u + '2';
  enter[v] = zero;
  update[u] = enter[u] = position(spec, 0);
  update[u2] = enter[u2] = position(spec, 1);
  return guideMark(RuleMark, AxisDomainRole, null, null, dataRef, encode, userEncode);
}
function position(spec, pos) {
  return {scale: spec.scale, range: pos};
}

function axisGrid(spec, config, userEncode, dataRef) {
  var orient = spec.orient,
      vscale = spec.gridScale,
      sign = (orient === Left$1 || orient === Top$1) ? 1 : -1,
      offset = sign * spec.offset || 0,
      zero = {value: 0},
      encode = {}, enter, exit, update, tickPos, u, v, v2, s;
  encode.enter = enter = {
    opacity: zero
  };
  addEncode(enter, 'stroke', config.gridColor);
  addEncode(enter, 'strokeWidth', config.gridWidth);
  addEncode(enter, 'strokeDash', config.gridDash);
  encode.exit = exit = {
    opacity: zero
  };
  encode.update = update = {};
  addEncode(update, 'opacity', config.gridOpacity);
  tickPos = {
    scale:  spec.scale,
    field:  Value,
    band:   config.bandPosition,
    round:  config.tickRound,
    extra:  config.tickExtra,
    offset: config.tickOffset
  };
  if (orient === Top$1 || orient === Bottom$1) {
    u = 'x';
    v = 'y';
    s = 'height';
  } else {
    u = 'y';
    v = 'x';
    s = 'width';
  }
  v2 = v + '2';
  update[u] = enter[u] = exit[u] = tickPos;
  if (vscale) {
    enter[v] = {scale: vscale, range: 0, mult: sign, offset: offset};
    update[v2] = enter[v2] = {scale: vscale, range: 1, mult: sign, offset: offset};
  } else {
    enter[v] = {value: offset};
    update[v2] = enter[v2] = {signal: s, mult: sign, offset: offset};
  }
  return guideMark(RuleMark, AxisGridRole, null, Value, dataRef, encode, userEncode);
}

function axisTicks(spec, config, userEncode, dataRef, size) {
  var orient = spec.orient,
      sign = (orient === Left$1 || orient === Top$1) ? -1 : 1,
      zero = {value: 0},
      encode = {}, enter, exit, update, tickSize, tickPos;
  encode.enter = enter = {
    opacity: zero
  };
  addEncode(enter, 'stroke', config.tickColor);
  addEncode(enter, 'strokeWidth', config.tickWidth);
  encode.exit = exit = {
    opacity: zero
  };
  encode.update = update = {
    opacity: {value: 1}
  };
  tickSize = encoder(size);
  tickSize.mult = sign;
  tickPos = {
    scale:  spec.scale,
    field:  Value,
    band:   config.bandPosition,
    round:  config.tickRound,
    extra:  config.tickExtra,
    offset: config.tickOffset
  };
  if (orient === Top$1 || orient === Bottom$1) {
    update.y = enter.y = zero;
    update.y2 = enter.y2 = tickSize;
    update.x = enter.x = exit.x = tickPos;
  } else {
    update.x = enter.x = zero;
    update.x2 = enter.x2 = tickSize;
    update.y = enter.y = exit.y = tickPos;
  }
  return guideMark(RuleMark, AxisTickRole, null, Value, dataRef, encode, userEncode);
}

function flushExpr(scale, threshold, a, b, c) {
  return {
    signal: 'flush(range("' + scale + '"), '
      + 'scale("' + scale + '", datum.value), '
      + threshold + ',' + a + ',' + b + ',' + c + ')'
  };
}
function axisLabels(spec, config, userEncode, dataRef, size) {
  var orient = spec.orient,
      sign = (orient === Left$1 || orient === Top$1) ? -1 : 1,
      scale = spec.scale,
      pad = value(spec.labelPadding, config.labelPadding),
      bound = value(spec.labelBound, config.labelBound),
      flush = value(spec.labelFlush, config.labelFlush),
      flushOn = flush != null && flush !== false && (flush = +flush) === flush,
      flushOffset = +value(spec.labelFlushOffset, config.labelFlushOffset),
      overlap = value(spec.labelOverlap, config.labelOverlap),
      zero = {value: 0},
      encode = {}, enter, exit, update, tickSize, tickPos;
  encode.enter = enter = {
    opacity: zero
  };
  addEncode(enter, 'angle', config.labelAngle);
  addEncode(enter, 'fill', config.labelColor);
  addEncode(enter, 'font', config.labelFont);
  addEncode(enter, 'fontSize', config.labelFontSize);
  addEncode(enter, 'fontWeight', config.labelFontWeight);
  addEncode(enter, 'limit', config.labelLimit);
  encode.exit = exit = {
    opacity: zero
  };
  encode.update = update = {
    opacity: {value: 1},
    text: {field: Label}
  };
  tickSize = encoder(size);
  tickSize.mult = sign;
  tickSize.offset = encoder(pad);
  tickSize.offset.mult = sign;
  tickPos = {
    scale:  scale,
    field:  Value,
    band:   0.5,
    offset: config.tickOffset
  };
  if (orient === Top$1 || orient === Bottom$1) {
    update.y = enter.y = tickSize;
    update.x = enter.x = exit.x = tickPos;
    addEncode(update, 'align', flushOn
      ? flushExpr(scale, flush, '"left"', '"right"', '"center"')
      : 'center');
    if (flushOn && flushOffset) {
      addEncode(update, 'dx', flushExpr(scale, flush, -flushOffset, flushOffset, 0));
    }
    addEncode(update, 'baseline', orient === Top$1 ? 'bottom' : 'top');
  } else {
    update.x = enter.x = tickSize;
    update.y = enter.y = exit.y = tickPos;
    addEncode(update, 'align', orient === Right$1 ? 'left' : 'right');
    addEncode(update, 'baseline', flushOn
      ? flushExpr(scale, flush, '"bottom"', '"top"', '"middle"')
      : 'middle');
    if (flushOn && flushOffset) {
      addEncode(update, 'dy', flushExpr(scale, flush, flushOffset, -flushOffset, 0));
    }
  }
  spec = guideMark(TextMark, AxisLabelRole, GuideLabelStyle, Value, dataRef, encode, userEncode);
  if (overlap || bound) {
    spec.overlap = {
      method: overlap,
      order:  'datum.index',
      bound:  bound ? {scale: scale, orient: orient, tolerance: +bound} : null
    };
  }
  return spec;
}

function axisTitle(spec, config, userEncode, dataRef) {
  var orient = spec.orient,
      title = spec.title,
      sign = (orient === Left$1 || orient === Top$1) ? -1 : 1,
      horizontal = (orient === Top$1 || orient === Bottom$1),
      encode = {}, enter, update, titlePos;
  encode.enter = enter = {
    opacity: {value: 0}
  };
  addEncode(enter, 'align', config.titleAlign);
  addEncode(enter, 'fill', config.titleColor);
  addEncode(enter, 'font', config.titleFont);
  addEncode(enter, 'fontSize', config.titleFontSize);
  addEncode(enter, 'fontWeight', config.titleFontWeight);
  addEncode(enter, 'limit', config.titleLimit);
  encode.exit = {
    opacity: {value: 0}
  };
  encode.update = update = {
    opacity: {value: 1},
    text: title && title.signal ? {signal: title.signal} : {value: title + ''}
  };
  titlePos = {
    scale: spec.scale,
    range: 0.5
  };
  if (horizontal) {
    update.x = titlePos;
    update.angle = {value: 0};
    update.baseline = {value: orient === Top$1 ? 'bottom' : 'top'};
  } else {
    update.y = titlePos;
    update.angle = {value: sign * 90};
    update.baseline = {value: 'bottom'};
  }
  addEncode(update, 'angle', config.titleAngle);
  addEncode(update, 'baseline', config.titleBaseline);
  !addEncode(update, 'x', config.titleX)
    && horizontal && !has('x', userEncode)
    && (encode.enter.auto = {value: true});
  !addEncode(update, 'y', config.titleY)
    && !horizontal && !has('y', userEncode)
    && (encode.enter.auto = {value: true});
  return guideMark(TextMark, AxisTitleRole, GuideTitleStyle, null, dataRef, encode, userEncode);
}

function parseAxis(spec, scope) {
  var config = axisConfig(spec, scope),
      encode = spec.encode || {},
      axisEncode = encode.axis || {},
      name = axisEncode.name || undefined,
      interactive = axisEncode.interactive,
      style = axisEncode.style,
      datum, dataRef, ticksRef, size, group, children;
  datum = {
    orient: spec.orient,
    ticks:  !!value(spec.ticks, config.ticks),
    labels: !!value(spec.labels, config.labels),
    grid:   !!value(spec.grid, config.grid),
    domain: !!value(spec.domain, config.domain),
    title:  !!value(spec.title, false)
  };
  dataRef = ref(scope.add(Collect$1({}, [datum])));
  axisEncode = extendEncode({
    update: {
      range:        {signal: 'abs(span(range("' + spec.scale + '")))'},
      offset:       encoder(value(spec.offset, 0)),
      position:     encoder(value(spec.position, 0)),
      titlePadding: encoder(value(spec.titlePadding, config.titlePadding)),
      minExtent:    encoder(value(spec.minExtent, config.minExtent)),
      maxExtent:    encoder(value(spec.maxExtent, config.maxExtent))
    }
  }, encode.axis, Skip);
  ticksRef = ref(scope.add(AxisTicks$1({
    scale:  scope.scaleRef(spec.scale),
    extra:  config.tickExtra,
    count:  scope.objectProperty(spec.tickCount),
    values: scope.objectProperty(spec.values),
    formatSpecifier: scope.property(spec.format)
  })));
  children = [];
  if (datum.grid) {
    children.push(axisGrid(spec, config, encode.grid, ticksRef));
  }
  if (datum.ticks) {
    size = value(spec.tickSize, config.tickSize);
    children.push(axisTicks(spec, config, encode.ticks, ticksRef, size));
  }
  if (datum.labels) {
    size = datum.ticks ? size : 0;
    children.push(axisLabels(spec, config, encode.labels, ticksRef, size));
  }
  if (datum.domain) {
    children.push(axisDomain(spec, config, encode.domain, dataRef));
  }
  if (datum.title) {
    children.push(axisTitle(spec, config, encode.title, dataRef));
  }
  group = guideGroup(AxisRole$2, style, name, dataRef, interactive, axisEncode, children);
  if (spec.zindex) group.zindex = spec.zindex;
  return parseMark(group, scope);
}

function parseSpec(spec, scope, preprocessed) {
  var signals = array(spec.signals),
      scales = array(spec.scales);
  if (!preprocessed) signals.forEach(function(_$$1) {
    parseSignal(_$$1, scope);
  });
  array(spec.projections).forEach(function(_$$1) {
    parseProjection(_$$1, scope);
  });
  scales.forEach(function(_$$1) {
    initScale(_$$1, scope);
  });
  array(spec.data).forEach(function(_$$1) {
    parseData$1(_$$1, scope);
  });
  scales.forEach(function(_$$1) {
    parseScale(_$$1, scope);
  });
  signals.forEach(function(_$$1) {
    parseSignalUpdates(_$$1, scope);
  });
  array(spec.axes).forEach(function(_$$1) {
    parseAxis(_$$1, scope);
  });
  array(spec.marks).forEach(function(_$$1) {
    parseMark(_$$1, scope);
  });
  array(spec.legends).forEach(function(_$$1) {
    parseLegend(_$$1, scope);
  });
  if (spec.title) {
    parseTitle(spec.title, scope);
  }
  scope.parseLambdas();
  return scope;
}

var defined = toSet(['width', 'height', 'padding', 'autosize']);
function parseView(spec, scope) {
  var config = scope.config,
      op, input, encode, parent, root;
  scope.background = spec.background || config.background;
  scope.eventConfig = config.events;
  root = ref(scope.root = scope.add(operator()));
  scope.addSignal('width', spec.width || 0);
  scope.addSignal('height', spec.height || 0);
  scope.addSignal('padding', parsePadding(spec.padding, config));
  scope.addSignal('autosize', parseAutosize(spec.autosize, config));
  array(spec.signals).forEach(function(_$$1) {
    if (!defined[_$$1.name]) parseSignal(_$$1, scope);
  });
  input = scope.add(Collect$1());
  encode = extendEncode({
    enter: { x: {value: 0}, y: {value: 0} },
    update: { width: {signal: 'width'}, height: {signal: 'height'} }
  }, spec.encode);
  encode = scope.add(Encode$1(
    encoders(encode, GroupMark, FrameRole$1, spec.style, scope, {pulse: ref(input)}))
  );
  parent = scope.add(ViewLayout$1({
    layout:       scope.objectProperty(spec.layout),
    legendMargin: config.legendMargin,
    autosize:     scope.signalRef('autosize'),
    mark:         root,
    pulse:        ref(encode)
  }));
  scope.operators.pop();
  scope.pushState(ref(encode), ref(parent), null);
  parseSpec(spec, scope, true);
  scope.operators.push(parent);
  op = scope.add(Bound$1({mark: root, pulse: ref(parent)}));
  op = scope.add(Render$1({pulse: ref(op)}));
  op = scope.add(Sieve$1({pulse: ref(op)}));
  scope.addData('root', new DataScope(scope, input, input, op));
  return scope;
}

function Scope$1(config) {
  this.config = config;
  this.bindings = [];
  this.field = {};
  this.signals = {};
  this.lambdas = {};
  this.scales = {};
  this.events = {};
  this.data = {};
  this.streams = [];
  this.updates = [];
  this.operators = [];
  this.background = null;
  this.eventConfig = null;
  this._id = 0;
  this._subid = 0;
  this._nextsub = [0];
  this._parent = [];
  this._encode = [];
  this._lookup = [];
  this._markpath = [];
}
function Subscope(scope) {
  this.config = scope.config;
  this.field = Object.create(scope.field);
  this.signals = Object.create(scope.signals);
  this.lambdas = Object.create(scope.lambdas);
  this.scales = Object.create(scope.scales);
  this.events = Object.create(scope.events);
  this.data = Object.create(scope.data);
  this.streams = [];
  this.updates = [];
  this.operators = [];
  this._id = 0;
  this._subid = ++scope._nextsub[0];
  this._nextsub = scope._nextsub;
  this._parent = scope._parent.slice();
  this._encode = scope._encode.slice();
  this._lookup = scope._lookup.slice();
  this._markpath = scope._markpath;
}
var prototype$1l = Scope$1.prototype = Subscope.prototype;
prototype$1l.fork = function() {
  return new Subscope(this);
};
prototype$1l.isSubscope = function() {
  return this._subid > 0;
};
prototype$1l.toRuntime = function() {
  this.finish();
  return {
    background:  this.background,
    operators:   this.operators,
    streams:     this.streams,
    updates:     this.updates,
    bindings:    this.bindings,
    eventConfig: this.eventConfig
  };
};
prototype$1l.id = function() {
  return (this._subid ? this._subid + ':' : 0) + this._id++;
};
prototype$1l.add = function(op) {
  this.operators.push(op);
  op.id = this.id();
  if (op.refs) {
    op.refs.forEach(function(ref$$1) { ref$$1.$ref = op.id; });
    op.refs = null;
  }
  return op;
};
prototype$1l.proxy = function(op) {
  var vref = op instanceof Entry ? ref(op) : op;
  return this.add(Proxy$1({value: vref}));
};
prototype$1l.addStream = function(stream) {
  this.streams.push(stream);
  stream.id = this.id();
  return stream;
};
prototype$1l.addUpdate = function(update) {
  this.updates.push(update);
  return update;
};
prototype$1l.finish = function() {
  var name, ds;
  if (this.root) this.root.root = true;
  for (name in this.signals) {
    this.signals[name].signal = name;
  }
  for (name in this.scales) {
    this.scales[name].scale = name;
  }
  function annotate(op, name, type) {
    var data, list;
    if (op) {
      data = op.data || (op.data = {});
      list = data[name] || (data[name] = []);
      list.push(type);
    }
  }
  for (name in this.data) {
    ds = this.data[name];
    annotate(ds.input,  name, 'input');
    annotate(ds.output, name, 'output');
    annotate(ds.values, name, 'values');
    for (var field$$1 in ds.index) {
      annotate(ds.index[field$$1], name, 'index:' + field$$1);
    }
  }
  return this;
};
prototype$1l.pushState = function(encode, parent, lookup) {
  this._encode.push(ref(this.add(Sieve$1({pulse: encode}))));
  this._parent.push(parent);
  this._lookup.push(lookup ? ref(this.proxy(lookup)) : null);
  this._markpath.push(-1);
};
prototype$1l.popState = function() {
  this._encode.pop();
  this._parent.pop();
  this._lookup.pop();
  this._markpath.pop();
};
prototype$1l.parent = function() {
  return peek(this._parent);
};
prototype$1l.encode = function() {
  return peek(this._encode);
};
prototype$1l.lookup = function() {
  return peek(this._lookup);
};
prototype$1l.markpath = function() {
  var p = this._markpath;
  return ++p[p.length-1];
};
prototype$1l.fieldRef = function(field$$1, name) {
  if (isString(field$$1)) return fieldRef(field$$1, name);
  if (!field$$1.signal) {
    error('Unsupported field reference: ' + $(field$$1));
  }
  var s = field$$1.signal,
      f = this.field[s],
      params;
  if (!f) {
    params = {name: this.signalRef(s)};
    if (name) params.as = name;
    this.field[s] = f = ref(this.add(Field$1(params)));
  }
  return f;
};
prototype$1l.compareRef = function(cmp, stable) {
  function check(_$$1) {
    if (isSignal(_$$1)) {
      signal = true;
      return ref(sig[_$$1.signal]);
    } else {
      return _$$1;
    }
  }
  var sig = this.signals,
      signal = false,
      fields = array(cmp.field).map(check),
      orders = array(cmp.order).map(check);
  if (stable) {
    fields.push(tupleidRef);
  }
  return signal
    ? ref(this.add(Compare$1({fields: fields, orders: orders})))
    : compareRef(fields, orders);
};
prototype$1l.keyRef = function(fields, flat) {
  function check(_$$1) {
    if (isSignal(_$$1)) {
      signal = true;
      return ref(sig[_$$1.signal]);
    } else {
      return _$$1;
    }
  }
  var sig = this.signals,
      signal = false;
  fields = array(fields).map(check);
  return signal
    ? ref(this.add(Key$1({fields: fields, flat: flat})))
    : keyRef(fields, flat);
};
prototype$1l.sortRef = function(sort) {
  if (!sort) return sort;
  var a = [aggrField(sort.op, sort.field), tupleidRef],
      o = sort.order || Ascending;
  return o.signal
    ? ref(this.add(Compare$1({
        fields: a,
        orders: [o = this.signalRef(o.signal), o]
      })))
    : compareRef(a, [o, o]);
};
prototype$1l.event = function(source, type) {
  var key$$1 = source + ':' + type;
  if (!this.events[key$$1]) {
    var id$$1 = this.id();
    this.streams.push({
      id: id$$1,
      source: source,
      type: type
    });
    this.events[key$$1] = id$$1;
  }
  return this.events[key$$1];
};
prototype$1l.addSignal = function(name, value$$1) {
  if (this.signals.hasOwnProperty(name)) {
    error('Duplicate signal name: ' + $(name));
  }
  var op = value$$1 instanceof Entry ? value$$1 : this.add(operator(value$$1));
  return this.signals[name] = op;
};
prototype$1l.getSignal = function(name) {
  if (!this.signals[name]) {
    error('Unrecognized signal name: ' + $(name));
  }
  return this.signals[name];
};
prototype$1l.signalRef = function(s) {
  if (this.signals[s]) {
    return ref(this.signals[s]);
  } else if (!this.lambdas.hasOwnProperty(s)) {
    this.lambdas[s] = this.add(operator(null));
  }
  return ref(this.lambdas[s]);
};
prototype$1l.parseLambdas = function() {
  var code = Object.keys(this.lambdas);
  for (var i=0, n=code.length; i<n; ++i) {
    var s = code[i],
        e = expression(s, this),
        op = this.lambdas[s];
    op.params = e.$params;
    op.update = e.$expr;
  }
};
prototype$1l.property = function(spec) {
  return spec && spec.signal ? this.signalRef(spec.signal) : spec;
};
prototype$1l.objectProperty = function(spec) {
  return (!spec || !isObject(spec)) ? spec
    : this.signalRef(spec.signal || propertyLambda(spec));
};
function propertyLambda(spec) {
  return (isArray(spec) ? arrayLambda : objectLambda)(spec);
}
function arrayLambda(array$$1) {
  var code = '[',
      i = 0,
      n = array$$1.length,
      value$$1;
  for (; i<n; ++i) {
    value$$1 = array$$1[i];
    code += (i > 0 ? ',' : '')
      + (isObject(value$$1)
        ? (value$$1.signal || propertyLambda(value$$1))
        : $(value$$1));
  }
  return code + ']';
}
function objectLambda(obj) {
  var code = '{',
      i = 0,
      key$$1, value$$1;
  for (key$$1 in obj) {
    value$$1 = obj[key$$1];
    code += (++i > 1 ? ',' : '')
      + $(key$$1) + ':'
      + (isObject(value$$1)
        ? (value$$1.signal || propertyLambda(value$$1))
        : $(value$$1));
  }
  return code + '}';
}
prototype$1l.addBinding = function(name, bind) {
  if (!this.bindings) {
    error('Nested signals do not support binding: ' + $(name));
  }
  this.bindings.push(extend({signal: name}, bind));
};
prototype$1l.addScaleProj = function(name, transform) {
  if (this.scales.hasOwnProperty(name)) {
    error('Duplicate scale or projection name: ' + $(name));
  }
  this.scales[name] = this.add(transform);
};
prototype$1l.addScale = function(name, params) {
  this.addScaleProj(name, Scale$1(params));
};
prototype$1l.addProjection = function(name, params) {
  this.addScaleProj(name, Projection$1(params));
};
prototype$1l.getScale = function(name) {
  if (!this.scales[name]) {
    error('Unrecognized scale name: ' + $(name));
  }
  return this.scales[name];
};
prototype$1l.projectionRef =
prototype$1l.scaleRef = function(name) {
  return ref(this.getScale(name));
};
prototype$1l.projectionType =
prototype$1l.scaleType = function(name) {
  return this.getScale(name).params.type;
};
prototype$1l.addData = function(name, dataScope) {
  if (this.data.hasOwnProperty(name)) {
    error('Duplicate data set name: ' + $(name));
  }
  return (this.data[name] = dataScope);
};
prototype$1l.getData = function(name) {
  if (!this.data[name]) {
    error('Undefined data set name: ' + $(name));
  }
  return this.data[name];
};
prototype$1l.addDataPipeline = function(name, entries) {
  if (this.data.hasOwnProperty(name)) {
    error('Duplicate data set name: ' + $(name));
  }
  return this.addData(name, DataScope.fromEntries(this, entries));
};

function defaults(configs) {
  var output = defaults$1();
  (configs || []).forEach(function(config) {
    var key$$1, value, style;
    if (config) {
      for (key$$1 in config) {
        if (key$$1 === 'style') {
          style = output.style || (output.style = {});
          for (key$$1 in config.style) {
            style[key$$1] = extend(style[key$$1] || {}, config.style[key$$1]);
          }
        } else {
          value = config[key$$1];
          output[key$$1] = isObject(value) && !isArray(value)
            ? extend(isObject(output[key$$1]) ? output[key$$1] : {}, value)
            : value;
        }
      }
    }
  });
  return output;
}
var defaultFont = 'sans-serif',
    defaultSymbolSize = 30,
    defaultStrokeWidth = 2,
    defaultColor = '#4c78a8',
    black = "#000",
    gray = '#888',
    lightGray = '#ddd';
function defaults$1() {
  return {
    padding: 0,
    autosize: 'pad',
    background: null,
    events: {
      defaults: {allow: ['wheel']}
    },
    group: null,
    mark: null,
    arc: { fill: defaultColor },
    area: { fill: defaultColor },
    image: null,
    line: {
      stroke: defaultColor,
      strokeWidth: defaultStrokeWidth
    },
    path: { stroke: defaultColor },
    rect: { fill: defaultColor },
    rule: { stroke: black },
    shape: { stroke: defaultColor },
    symbol: {
      fill: defaultColor,
      size: 64
    },
    text: {
      fill: black,
      font: defaultFont,
      fontSize: 11
    },
    style: {
      "guide-label": {
        fill: black,
        font: defaultFont,
        fontSize: 10
      },
      "guide-title": {
        fill: black,
        font: defaultFont,
        fontSize: 11,
        fontWeight: 'bold'
      },
      "group-title": {
        fill: black,
        font: defaultFont,
        fontSize: 13,
        fontWeight: 'bold'
      },
      point: {
        size: defaultSymbolSize,
        strokeWidth: defaultStrokeWidth,
        shape: 'circle'
      },
      circle: {
        size: defaultSymbolSize,
        strokeWidth: defaultStrokeWidth
      },
      square: {
        size: defaultSymbolSize,
        strokeWidth: defaultStrokeWidth,
        shape: 'square'
      },
      cell: {
        fill: 'transparent',
        stroke: lightGray
      }
    },
    axis: {
      minExtent: 0,
      maxExtent: 200,
      bandPosition: 0.5,
      domain: true,
      domainWidth: 1,
      domainColor: gray,
      grid: false,
      gridWidth: 1,
      gridColor: lightGray,
      gridOpacity: 1,
      labels: true,
      labelAngle: 0,
      labelLimit: 180,
      labelPadding: 2,
      ticks: true,
      tickColor: gray,
      tickOffset: 0,
      tickRound: true,
      tickSize: 5,
      tickWidth: 1,
      titleAlign: 'center',
      titlePadding: 4
    },
    axisBand: {
      tickOffset: -1
    },
    legend: {
      orient: 'right',
      offset: 18,
      padding: 0,
      entryPadding: 5,
      titlePadding: 5,
      gradientWidth: 100,
      gradientHeight: 20,
      gradientStrokeColor: lightGray,
      gradientStrokeWidth: 0,
      gradientLabelBaseline: 'top',
      gradientLabelOffset: 2,
      labelAlign: 'left',
      labelBaseline: 'middle',
      labelOffset: 8,
      labelLimit: 160,
      symbolType: 'circle',
      symbolSize: 100,
      symbolFillColor: 'transparent',
      symbolStrokeColor: gray,
      symbolStrokeWidth: 1.5,
      titleAlign: 'left',
      titleBaseline: 'top',
      titleLimit: 180
    },
    title: {
      orient: 'top',
      anchor: 'middle',
      offset: 4
    },
    range: {
      category: {
        scheme: 'tableau10'
      },
      ordinal: {
        scheme: 'blues',
        extent: [0.2, 1]
      },
      heatmap: {
        scheme: 'viridis'
      },
      ramp: {
        scheme: 'blues',
        extent: [0.2, 1]
      },
      diverging: {
        scheme: 'blueorange'
      },
      symbol: [
        'circle',
        'square',
        'triangle-up',
        'cross',
        'diamond',
        'triangle-right',
        'triangle-down',
        'triangle-left'
      ]
    }
  };
}

function parse$3(spec, config) {
  if (!isObject(spec)) error('Input Vega specification must be an object.');
  return parseView(spec, new Scope$1(defaults([config, spec.config])))
    .toRuntime();
}

function expression$2(args, code, ctx) {
  if (code[code.length-1] !== ';') {
    code = 'return(' + code + ');';
  }
  var fn = Function.apply(null, args.concat(code));
  return ctx && ctx.functions ? fn.bind(ctx.functions) : fn;
}
function operatorExpression(code, ctx) {
  return expression$2(['_'], code, ctx);
}
function parameterExpression(code, ctx) {
  return expression$2(['datum', '_'], code, ctx);
}
function eventExpression(code, ctx) {
  return expression$2(['event'], code, ctx);
}
function handlerExpression(code, ctx) {
  return expression$2(['_', 'event'], code, ctx);
}
function encodeExpression(code, ctx) {
  return expression$2(['item', '_'], code, ctx);
}

function parseParameters$1(spec, ctx, params) {
  params = params || {};
  var key$$1, value;
  for (key$$1 in spec) {
    value = spec[key$$1];
    if (value && value.$expr && value.$params) {
      parseParameters$1(value.$params, ctx, params);
    }
    params[key$$1] = isArray(value)
      ? value.map(function(v) { return parseParameter$2(v, ctx); })
      : parseParameter$2(value, ctx);
  }
  return params;
}
function parseParameter$2(spec, ctx) {
  if (!spec || !isObject(spec)) return spec;
  for (var i=0, n=PARSERS.length, p; i<n; ++i) {
    p = PARSERS[i];
    if (spec.hasOwnProperty(p.key)) {
      return p.parse(spec, ctx);
    }
  }
  return spec;
}
var PARSERS = [
  {key: '$ref',      parse: getOperator},
  {key: '$key',      parse: getKey},
  {key: '$expr',     parse: getExpression},
  {key: '$field',    parse: getField$1},
  {key: '$encode',   parse: getEncode},
  {key: '$compare',  parse: getCompare},
  {key: '$context',  parse: getContext},
  {key: '$subflow',  parse: getSubflow},
  {key: '$tupleid',  parse: getTupleId}
];
function getOperator(_$$1, ctx) {
  return ctx.get(_$$1.$ref) || error('Operator not defined: ' + _$$1.$ref);
}
function getExpression(_$$1, ctx) {
  var k = 'e:' + _$$1.$expr;
  return ctx.fn[k]
    || (ctx.fn[k] = accessor(parameterExpression(_$$1.$expr, ctx), _$$1.$fields, _$$1.$name));
}
function getKey(_$$1, ctx) {
  var k = 'k:' + _$$1.$key + '_' + (!!_$$1.$flat);
  return ctx.fn[k] || (ctx.fn[k] = key(_$$1.$key, _$$1.$flat));
}
function getField$1(_$$1, ctx) {
  if (!_$$1.$field) return null;
  var k = 'f:' + _$$1.$field + '_' + _$$1.$name;
  return ctx.fn[k] || (ctx.fn[k] = field(_$$1.$field, _$$1.$name));
}
function getCompare(_$$1, ctx) {
  var k = 'c:' + _$$1.$compare + '_' + _$$1.$order,
      c = array(_$$1.$compare).map(function(_$$1) {
        return (_$$1 && _$$1.$tupleid) ? tupleid : _$$1;
      });
  return ctx.fn[k] || (ctx.fn[k] = compare(c, _$$1.$order));
}
function getEncode(_$$1, ctx) {
  var spec = _$$1.$encode,
      encode = {}, name, enc;
  for (name in spec) {
    enc = spec[name];
    encode[name] = accessor(encodeExpression(enc.$expr, ctx), enc.$fields);
    encode[name].output = enc.$output;
  }
  return encode;
}
function getContext(_$$1, ctx) {
  return ctx;
}
function getSubflow(_$$1, ctx) {
  var spec = _$$1.$subflow;
  return function(dataflow, key$$1, parent) {
    var subctx = parseDataflow(spec, ctx.fork()),
        op = subctx.get(spec.operators[0].id),
        p = subctx.signals.parent;
    if (p) p.set(parent);
    return op;
  };
}
function getTupleId() {
  return tupleid;
}

function canonicalType(type) {
  return (type + '').toLowerCase();
}
function isOperator(type) {
   return canonicalType(type) === 'operator';
}
function isCollect(type) {
  return canonicalType(type) === 'collect';
}

function parseOperator(spec, ctx) {
  if (isOperator(spec.type) || !spec.type) {
    ctx.operator(spec,
      spec.update ? operatorExpression(spec.update, ctx) : null);
  } else {
    ctx.transform(spec, spec.type);
  }
}
function parseOperatorParameters(spec, ctx) {
  var op, params;
  if (spec.params) {
    if (!(op = ctx.get(spec.id))) {
      error('Invalid operator id: ' + spec.id);
    }
    params = parseParameters$1(spec.params, ctx);
    ctx.dataflow.connect(op, op.parameters(params));
  }
}

function parseStream$3(spec, ctx) {
  var filter = spec.filter != null ? eventExpression(spec.filter, ctx) : undefined,
      stream = spec.stream != null ? ctx.get(spec.stream) : undefined,
      args;
  if (spec.source) {
    stream = ctx.events(spec.source, spec.type, filter);
  }
  else if (spec.merge) {
    args = spec.merge.map(ctx.get.bind(ctx));
    stream = args[0].merge.apply(args[0], args.slice(1));
  }
  if (spec.between) {
    args = spec.between.map(ctx.get.bind(ctx));
    stream = stream.between(args[0], args[1]);
  }
  if (spec.filter) {
    stream = stream.filter(filter);
  }
  if (spec.throttle != null) {
    stream = stream.throttle(+spec.throttle);
  }
  if (spec.debounce != null) {
    stream = stream.debounce(+spec.debounce);
  }
  if (stream == null) {
    error('Invalid stream definition: ' + JSON.stringify(spec));
  }
  if (spec.consume) stream.consume(true);
  ctx.stream(spec, stream);
}

function parseUpdate$1(spec, ctx) {
  var source = ctx.get(spec.source),
      target = null,
      update = spec.update,
      params = undefined;
  if (!source) error('Source not defined: ' + spec.source);
  if (spec.target && spec.target.$expr) {
    target = eventExpression(spec.target.$expr, ctx);
  } else {
    target = ctx.get(spec.target);
  }
  if (update && update.$expr) {
    if (update.$params) {
      params = parseParameters$1(update.$params, ctx);
    }
    update = handlerExpression(update.$expr, ctx);
  }
  ctx.update(spec, source, target, update, params);
}

function parseDataflow(spec, ctx) {
  var operators = spec.operators || [];
  if (spec.background) {
    ctx.background = spec.background;
  }
  if (spec.eventConfig) {
    ctx.eventConfig = spec.eventConfig;
  }
  operators.forEach(function(entry) {
    parseOperator(entry, ctx);
  });
  operators.forEach(function(entry) {
    parseOperatorParameters(entry, ctx);
  });
  (spec.streams || []).forEach(function(entry) {
    parseStream$3(entry, ctx);
  });
  (spec.updates || []).forEach(function(entry) {
    parseUpdate$1(entry, ctx);
  });
  return ctx.resolve();
}

var SKIP$3 = {skip: true};
function getState(options) {
  var ctx = this,
      state = {};
  if (options.signals) {
    var signals = (state.signals = {});
    Object.keys(ctx.signals).forEach(function(key$$1) {
      var op = ctx.signals[key$$1];
      if (options.signals(key$$1, op)) {
        signals[key$$1] = op.value;
      }
    });
  }
  if (options.data) {
    var data = (state.data = {});
    Object.keys(ctx.data).forEach(function(key$$1) {
      var dataset = ctx.data[key$$1];
      if (options.data(key$$1, dataset)) {
        data[key$$1] = dataset.input.value;
      }
    });
  }
  if (ctx.subcontext && options.recurse !== false) {
    state.subcontext = ctx.subcontext.map(function(ctx) {
      return ctx.getState(options);
    });
  }
  return state;
}
function setState(state) {
  var ctx = this,
      df = ctx.dataflow,
      data = state.data,
      signals = state.signals;
  Object.keys(signals || {}).forEach(function(key$$1) {
    df.update(ctx.signals[key$$1], signals[key$$1], SKIP$3);
  });
  Object.keys(data || {}).forEach(function(key$$1) {
    df.pulse(
      ctx.data[key$$1].input,
      df.changeset().remove(truthy).insert(data[key$$1])
    );
  });
  (state.subcontext  || []).forEach(function(substate, i) {
    var subctx = ctx.subcontext[i];
    if (subctx) subctx.setState(substate);
  });
}

function context$2(df, transforms, functions) {
  return new Context(df, transforms, functions);
}
function Context(df, transforms, functions) {
  this.dataflow = df;
  this.transforms = transforms;
  this.events = df.events.bind(df);
  this.signals = {};
  this.scales = {};
  this.nodes = {};
  this.data = {};
  this.fn = {};
  if (functions) {
    this.functions = Object.create(functions);
    this.functions.context = this;
  }
}
function ContextFork(ctx) {
  this.dataflow = ctx.dataflow;
  this.transforms = ctx.transforms;
  this.functions = ctx.functions;
  this.events = ctx.events;
  this.signals = Object.create(ctx.signals);
  this.scales = Object.create(ctx.scales);
  this.nodes = Object.create(ctx.nodes);
  this.data = Object.create(ctx.data);
  this.fn = Object.create(ctx.fn);
  if (ctx.functions) {
    this.functions = Object.create(ctx.functions);
    this.functions.context = this;
  }
}
Context.prototype = ContextFork.prototype = {
  fork: function() {
    var ctx = new ContextFork(this);
    (this.subcontext || (this.subcontext = [])).push(ctx);
    return ctx;
  },
  get: function(id) {
    return this.nodes[id];
  },
  set: function(id, node) {
    return this.nodes[id] = node;
  },
  add: function(spec, op) {
    var ctx = this,
        df = ctx.dataflow,
        data;
    ctx.set(spec.id, op);
    if (isCollect(spec.type) && (data = spec.value)) {
      if (data.$ingest) {
        df.ingest(op, data.$ingest, data.$format);
      } else if (data.$request) {
        df.request(op, data.$request, data.$format);
      } else {
        df.pulse(op, df.changeset().insert(data));
      }
    }
    if (spec.root) {
      ctx.root = op;
    }
    if (spec.parent) {
      var p = ctx.get(spec.parent.$ref);
      if (p) {
        df.connect(p, [op]);
        op.targets().add(p);
      } else {
        (ctx.unresolved = ctx.unresolved || []).push(function() {
          p = ctx.get(spec.parent.$ref);
          df.connect(p, [op]);
          op.targets().add(p);
        });
      }
    }
    if (spec.signal) {
      ctx.signals[spec.signal] = op;
    }
    if (spec.scale) {
      ctx.scales[spec.scale] = op;
    }
    if (spec.data) {
      for (var name in spec.data) {
        data = ctx.data[name] || (ctx.data[name] = {});
        spec.data[name].forEach(function(role) { data[role] = op; });
      }
    }
  },
  resolve: function() {
    (this.unresolved || []).forEach(function(fn) { fn(); });
    delete this.unresolved;
    return this;
  },
  operator: function(spec, update, params) {
    this.add(spec, this.dataflow.add(spec.value, update, params, spec.react));
  },
  transform: function(spec, type, params) {
    this.add(spec, this.dataflow.add(this.transforms[canonicalType(type)], params));
  },
  stream: function(spec, stream) {
    this.set(spec.id, stream);
  },
  update: function(spec, stream, target, update, params) {
    this.dataflow.on(stream, target, update, params, spec.options);
  },
  getState: getState,
  setState: setState
};

function runtime(view, spec, functions) {
  var fn = functions || functionContext;
  return parseDataflow(spec, context$2(view, transforms, fn));
}

var Width = 'width',
    Height = 'height',
    Padding$1 = 'padding',
    Skip$2 = {skip: true};
function viewWidth(view, width) {
  var a = view.autosize(),
      p = view.padding();
  return width - (a && a.contains === Padding$1 ? p.left + p.right : 0);
}
function viewHeight(view, height) {
  var a = view.autosize(),
      p = view.padding();
  return height - (a && a.contains === Padding$1 ? p.top + p.bottom : 0);
}
function initializeResize(view) {
  var s = view._signals,
      w = s[Width],
      h = s[Height],
      p = s[Padding$1];
  function resetSize() {
    view._autosize = view._resize = 1;
  }
  view._resizeWidth = view.add(null,
    function(_$$1) {
      view._width = _$$1.size;
      view._viewWidth = viewWidth(view, _$$1.size);
      resetSize();
    },
    {size: w}
  );
  view._resizeHeight = view.add(null,
    function(_$$1) {
      view._height = _$$1.size;
      view._viewHeight = viewHeight(view, _$$1.size);
      resetSize();
    },
    {size: h}
  );
  var resizePadding = view.add(null, resetSize, {pad: p});
  view._resizeWidth.rank = w.rank + 1;
  view._resizeHeight.rank = h.rank + 1;
  resizePadding.rank = p.rank + 1;
}
function resizeView(viewWidth, viewHeight, width, height, origin, auto) {
  this.runAfter(function(view) {
    var rerun = 0;
    view._autosize = 0;
    if (view.width() !== width) {
      rerun = 1;
      view.signal(Width, width, Skip$2);
      view._resizeWidth.skip(true);
    }
    if (view.height() !== height) {
      rerun = 1;
      view.signal(Height, height, Skip$2);
      view._resizeHeight.skip(true);
    }
    if (view._viewWidth !== viewWidth) {
      view._resize = 1;
      view._viewWidth = viewWidth;
    }
    if (view._viewHeight !== viewHeight) {
      view._resize = 1;
      view._viewHeight = viewHeight;
    }
    if (view._origin[0] !== origin[0] || view._origin[1] !== origin[1]) {
      view._resize = 1;
      view._origin = origin;
    }
    if (rerun) view.run('enter');
    if (auto) view.runAfter(function() { view.resize(); });
  }, false, 1);
}

function getState$1(options) {
  return this._runtime.getState(options || {
    data:    dataTest,
    signals: signalTest,
    recurse: true
  });
}
function dataTest(name, data) {
  return data.modified
      && isArray(data.input.value)
      && name.indexOf('_:vega:_');
}
function signalTest(name, op) {
  return !(name === 'parent' || op instanceof transforms.proxy);
}
function setState$1(state) {
  var view = this;
  view.runAfter(function() {
    view._trigger = false;
    view._runtime.setState(state);
    view.run().runAfter(function() { view._trigger = true; });
  });
  return this;
}

function defaultTooltip$1(handler, event, item, value) {
  handler.element().setAttribute('title', formatTooltip(value));
}
function formatTooltip(value) {
  return value == null ? ''
    : isArray(value) ? formatArray(value)
    : isObject(value) && !isDate(value) ? formatObject(value)
    : value + '';
}
function formatObject(obj) {
  return Object.keys(obj).map(function(key$$1) {
    var v = obj[key$$1];
    return key$$1 + ': ' + (isArray(v) ? formatArray(v) : formatValue$1(v));
  }).join('\n');
}
function formatArray(value) {
  return '[' + value.map(formatValue$1).join(', ') + ']';
}
function formatValue$1(value) {
  return isArray(value) ? '[\u2026]'
    : isObject(value) && !isDate(value) ? '{\u2026}'
    : value;
}

function View$1(spec, options) {
  var view = this;
  options = options || {};
  Dataflow.call(view);
  view.loader(options.loader || view._loader);
  view.logLevel(options.logLevel || 0);
  view._el = null;
  view._renderType = options.renderer || RenderType.Canvas;
  view._scenegraph = new Scenegraph();
  var root = view._scenegraph.root;
  view._renderer = null;
  view._tooltip = options.tooltip || defaultTooltip$1,
  view._redraw = true;
  view._handler = new CanvasHandler().scene(root);
  view._preventDefault = false;
  view._eventListeners = [];
  view._resizeListeners = [];
  var ctx = runtime(view, spec, options.functions);
  view._runtime = ctx;
  view._signals = ctx.signals;
  view._bind = (spec.bindings || []).map(function(_$$1) {
    return {
      state: null,
      param: extend({}, _$$1)
    };
  });
  if (ctx.root) ctx.root.set(root);
  root.source = ctx.data.root.input;
  view.pulse(
    ctx.data.root.input,
    view.changeset().insert(root.items)
  );
  view._background = ctx.background || null;
  view._eventConfig = initializeEventConfig(ctx.eventConfig);
  view._width = view.width();
  view._height = view.height();
  view._viewWidth = viewWidth(view, view._width);
  view._viewHeight = viewHeight(view, view._height);
  view._origin = [0, 0];
  view._resize = 0;
  view._autosize = 1;
  initializeResize(view);
  cursor(view);
}
var prototype$1m = inherits(View$1, Dataflow);
prototype$1m.run = function(encode) {
  Dataflow.prototype.run.call(this, encode);
  if (this._redraw || this._resize) {
    try {
      this.render();
    } catch (e) {
      this.error(e);
    }
  }
  return this;
};
prototype$1m.render = function() {
  if (this._renderer) {
    if (this._resize) {
      this._resize = 0;
      resizeRenderer(this);
    }
    this._renderer.render(this._scenegraph.root);
  }
  this._redraw = false;
  return this;
};
prototype$1m.dirty = function(item) {
  this._redraw = true;
  this._renderer && this._renderer.dirty(item);
};
prototype$1m.container = function() {
  return this._el;
};
prototype$1m.scenegraph = function() {
  return this._scenegraph;
};
prototype$1m.origin = function() {
  return this._origin.slice();
};
function lookupSignal(view, name) {
  return view._signals.hasOwnProperty(name)
    ? view._signals[name]
    : error('Unrecognized signal name: ' + $(name));
}
prototype$1m.signal = function(name, value, options) {
  var op = lookupSignal(this, name);
  return arguments.length === 1
    ? op.value
    : this.update(op, value, options);
};
prototype$1m.background = function(_$$1) {
  if (arguments.length) {
    this._background = _$$1;
    this._resize = 1;
    return this;
  } else {
    return this._background;
  }
};
prototype$1m.width = function(_$$1) {
  return arguments.length ? this.signal('width', _$$1) : this.signal('width');
};
prototype$1m.height = function(_$$1) {
  return arguments.length ? this.signal('height', _$$1) : this.signal('height');
};
prototype$1m.padding = function(_$$1) {
  return arguments.length ? this.signal('padding', _$$1) : this.signal('padding');
};
prototype$1m.autosize = function(_$$1) {
  return arguments.length ? this.signal('autosize', _$$1) : this.signal('autosize');
};
prototype$1m.renderer = function(type) {
  if (!arguments.length) return this._renderType;
  if (!renderModule(type)) error('Unrecognized renderer type: ' + type);
  if (type !== this._renderType) {
    this._renderType = type;
    this._resetRenderer();
  }
  return this;
};
prototype$1m.tooltip = function(handler) {
  if (!arguments.length) return this._tooltip;
  if (handler !== this._tooltip) {
    this._tooltip = handler;
    this._resetRenderer();
  }
  return this;
};
prototype$1m.loader = function(loader) {
  if (!arguments.length) return this._loader;
  if (loader !== this._loader) {
    Dataflow.prototype.loader.call(this, loader);
    this._resetRenderer();
  }
  return this;
};
prototype$1m.resize = function() {
  this._autosize = 1;
  return this;
};
prototype$1m._resetRenderer = function() {
  if (this._renderer) {
    this._renderer = null;
    this.initialize(this._el);
  }
};
prototype$1m._resizeView = resizeView;
prototype$1m.addEventListener = function(type, handler) {
  this._handler.on(type, handler);
  return this;
};
prototype$1m.removeEventListener = function(type, handler) {
  this._handler.off(type, handler);
  return this;
};
prototype$1m.addResizeListener = function(handler) {
  var l = this._resizeListeners;
  if (l.indexOf(handler) < 0) {
    l.push(handler);
  }
  return this;
};
prototype$1m.removeResizeListener = function(handler) {
  var l = this._resizeListeners,
      i = l.indexOf(handler);
  if (i >= 0) {
    l.splice(i, 1);
  }
  return this;
};
function findHandler(signal, handler) {
  var t = signal._targets || [],
      h = t.filter(function(op) {
            var u = op._update;
            return u && u.handler === handler;
          });
  return h.length ? h[0] : null;
}
prototype$1m.addSignalListener = function(name, handler) {
  var s = lookupSignal(this, name),
      h = findHandler(s, handler);
  if (!h) {
    h = function() { handler(name, s.value); };
    h.handler = handler;
    this.on(s, null, h);
  }
  return this;
};
prototype$1m.removeSignalListener = function(name, handler) {
  var s = lookupSignal(this, name),
      h = findHandler(s, handler);
  if (h) s._targets.remove(h);
  return this;
};
prototype$1m.preventDefault = function(_$$1) {
  if (arguments.length) {
    this._preventDefault = _$$1;
    return this;
  } else {
    return this._preventDefault;
  }
};
prototype$1m.tooltipHandler = function(_$$1) {
  var h = this._handler;
  if (!arguments.length) {
    return h.handleTooltip;
  } else {
    h.handleTooltip = _$$1 || Handler.prototype.handleTooltip;
    return this;
  }
};
prototype$1m.events = events$1;
prototype$1m.finalize = finalize;
prototype$1m.hover = hover;
prototype$1m.data = data;
prototype$1m.change = change;
prototype$1m.insert = insert;
prototype$1m.remove = remove;
prototype$1m.initialize = initialize$1;
prototype$1m.toImageURL = renderToImageURL;
prototype$1m.toCanvas = renderToCanvas;
prototype$1m.toSVG = renderToSVG;
prototype$1m.getState = getState$1;
prototype$1m.setState = setState$1;

extend(transforms, tx, vtx, encode, geo, force, tree$1, voronoi$1, wordcloud, xf);

var vega = /*#__PURE__*/Object.freeze({
  version: version,
  Dataflow: Dataflow,
  EventStream: EventStream,
  Parameters: Parameters,
  Pulse: Pulse,
  MultiPulse: MultiPulse,
  Operator: Operator,
  Transform: Transform,
  changeset: changeset,
  ingest: ingest,
  isTuple: isTuple,
  definition: definition,
  transform: transform,
  transforms: transforms,
  tupleid: tupleid,
  scale: scale$1,
  scheme: scheme,
  interpolate: interpolate$1,
  interpolateRange: interpolateRange,
  timeInterval: timeInterval,
  utcInterval: utcInterval,
  projection: projection,
  View: View$1,
  parse: parse$3,
  expressionFunction: expressionFunction,
  formatLocale: formatDefaultLocale,
  timeFormatLocale: timeFormatDefaultLocale,
  runtime: parseDataflow,
  runtimeContext: context$2,
  bin: bin,
  bootstrapCI: bootstrapCI,
  quartiles: quartiles,
  get random () { return random; },
  setRandom: setRandom,
  randomInteger: integer,
  randomKDE: randomKDE,
  randomMixture: randomMixture,
  randomNormal: gaussian,
  randomUniform: randomUniform,
  accessor: accessor,
  accessorName: accessorName,
  accessorFields: accessorFields,
  id: id,
  identity: identity,
  zero: zero,
  one: one,
  truthy: truthy,
  falsy: falsy,
  logger: logger,
  None: None,
  Error: Error$1,
  Warn: Warn,
  Info: Info,
  Debug: Debug,
  panLinear: panLinear,
  panLog: panLog,
  panPow: panPow,
  zoomLinear: zoomLinear,
  zoomLog: zoomLog,
  zoomPow: zoomPow,
  array: array,
  compare: compare,
  constant: constant,
  debounce: debounce,
  error: error,
  extend: extend,
  extentIndex: extentIndex,
  fastmap: fastmap,
  field: field,
  inherits: inherits,
  isArray: isArray,
  isBoolean: isBoolean,
  isDate: isDate,
  isFunction: isFunction,
  isNumber: isNumber,
  isObject: isObject,
  isRegExp: isRegExp,
  isString: isString,
  key: key,
  merge: merge,
  pad: pad,
  peek: peek,
  repeat: repeat,
  splitAccessPath: splitAccessPath,
  stringValue: $,
  toBoolean: toBoolean,
  toDate: toDate,
  toNumber: toNumber,
  toString: toString,
  toSet: toSet,
  truncate: truncate,
  visitArray: visitArray,
  loader: loader,
  read: read,
  inferType: inferType,
  inferTypes: inferTypes,
  typeParsers: typeParsers,
  formats: formats$1,
  Bounds: Bounds,
  Gradient: Gradient,
  GroupItem: GroupItem,
  ResourceLoader: ResourceLoader,
  Item: Item,
  Scenegraph: Scenegraph,
  Handler: Handler,
  Renderer: Renderer,
  CanvasHandler: CanvasHandler,
  CanvasRenderer: CanvasRenderer,
  SVGHandler: SVGHandler,
  SVGRenderer: SVGRenderer,
  SVGStringRenderer: SVGStringRenderer,
  RenderType: RenderType,
  renderModule: renderModule,
  Marks: marks,
  boundClip: boundClip,
  boundContext: context,
  boundStroke: boundStroke,
  boundItem: boundItem,
  boundMark: boundMark,
  pathCurves: curves,
  pathSymbols: symbols,
  pathRectangle: vg_rect,
  pathTrail: vg_trail,
  pathParse: pathParse,
  pathRender: pathRender,
  point: point,
  domCreate: domCreate,
  domFind: domFind,
  domChild: domChild,
  domClear: domClear,
  openTag: openTag,
  closeTag: closeTag,
  font: font,
  textMetrics: textMetrics,
  resetSVGClipId: resetSVGClipId,
  sceneEqual: sceneEqual,
  pathEqual: pathEqual,
  sceneToJSON: sceneToJSON,
  sceneFromJSON: sceneFromJSON,
  sceneZOrder: zorder,
  sceneVisit: visit,
  scenePickVisit: pickVisit
});

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n.default || n;
}

var axis = createCommonjsModule(function (module, exports) {
(function (AxisOrient) {
    AxisOrient[AxisOrient["TOP"] = 'top'] = "TOP";
    AxisOrient[AxisOrient["RIGHT"] = 'right'] = "RIGHT";
    AxisOrient[AxisOrient["LEFT"] = 'left'] = "LEFT";
    AxisOrient[AxisOrient["BOTTOM"] = 'bottom'] = "BOTTOM";
})(exports.AxisOrient || (exports.AxisOrient = {}));
var AxisOrient = exports.AxisOrient;
exports.defaultAxisConfig = {
    offset: undefined,
    grid: undefined,
    labels: true,
    labelMaxLength: 25,
    tickSize: undefined,
    characterWidth: 6
};
exports.defaultFacetAxisConfig = {
    axisWidth: 0,
    labels: true,
    grid: false,
    tickSize: 0
};
});
var axis_1 = axis.AxisOrient;
var axis_2 = axis.defaultAxisConfig;
var axis_3 = axis.defaultFacetAxisConfig;

var aggregate = createCommonjsModule(function (module, exports) {
(function (AggregateOp) {
    AggregateOp[AggregateOp["VALUES"] = 'values'] = "VALUES";
    AggregateOp[AggregateOp["COUNT"] = 'count'] = "COUNT";
    AggregateOp[AggregateOp["VALID"] = 'valid'] = "VALID";
    AggregateOp[AggregateOp["MISSING"] = 'missing'] = "MISSING";
    AggregateOp[AggregateOp["DISTINCT"] = 'distinct'] = "DISTINCT";
    AggregateOp[AggregateOp["SUM"] = 'sum'] = "SUM";
    AggregateOp[AggregateOp["MEAN"] = 'mean'] = "MEAN";
    AggregateOp[AggregateOp["AVERAGE"] = 'average'] = "AVERAGE";
    AggregateOp[AggregateOp["VARIANCE"] = 'variance'] = "VARIANCE";
    AggregateOp[AggregateOp["VARIANCEP"] = 'variancep'] = "VARIANCEP";
    AggregateOp[AggregateOp["STDEV"] = 'stdev'] = "STDEV";
    AggregateOp[AggregateOp["STDEVP"] = 'stdevp'] = "STDEVP";
    AggregateOp[AggregateOp["MEDIAN"] = 'median'] = "MEDIAN";
    AggregateOp[AggregateOp["Q1"] = 'q1'] = "Q1";
    AggregateOp[AggregateOp["Q3"] = 'q3'] = "Q3";
    AggregateOp[AggregateOp["MODESKEW"] = 'modeskew'] = "MODESKEW";
    AggregateOp[AggregateOp["MIN"] = 'min'] = "MIN";
    AggregateOp[AggregateOp["MAX"] = 'max'] = "MAX";
    AggregateOp[AggregateOp["ARGMIN"] = 'argmin'] = "ARGMIN";
    AggregateOp[AggregateOp["ARGMAX"] = 'argmax'] = "ARGMAX";
})(exports.AggregateOp || (exports.AggregateOp = {}));
var AggregateOp = exports.AggregateOp;
exports.AGGREGATE_OPS = [
    AggregateOp.VALUES,
    AggregateOp.COUNT,
    AggregateOp.VALID,
    AggregateOp.MISSING,
    AggregateOp.DISTINCT,
    AggregateOp.SUM,
    AggregateOp.MEAN,
    AggregateOp.AVERAGE,
    AggregateOp.VARIANCE,
    AggregateOp.VARIANCEP,
    AggregateOp.STDEV,
    AggregateOp.STDEVP,
    AggregateOp.MEDIAN,
    AggregateOp.Q1,
    AggregateOp.Q3,
    AggregateOp.MODESKEW,
    AggregateOp.MIN,
    AggregateOp.MAX,
    AggregateOp.ARGMIN,
    AggregateOp.ARGMAX,
];
exports.SUM_OPS = [
    AggregateOp.COUNT,
    AggregateOp.SUM,
    AggregateOp.DISTINCT,
    AggregateOp.VALID,
    AggregateOp.MISSING
];
exports.SHARED_DOMAIN_OPS = [
    AggregateOp.MEAN,
    AggregateOp.AVERAGE,
    AggregateOp.STDEV,
    AggregateOp.STDEVP,
    AggregateOp.MEDIAN,
    AggregateOp.Q1,
    AggregateOp.Q3,
    AggregateOp.MIN,
    AggregateOp.MAX,
];
});
var aggregate_1 = aggregate.AggregateOp;
var aggregate_2 = aggregate.AGGREGATE_OPS;
var aggregate_3 = aggregate.SUM_OPS;
var aggregate_4 = aggregate.SHARED_DOMAIN_OPS;

var keys$1 = util.keys;
var extend$1 = util.extend;
var duplicate = util.duplicate;
var isArray$1 = util.isArray;
var vals = util.vals;
var truncate$2 = util.truncate;
var toMap = util.toMap;
var isObject$1 = util.isObject;
var isString$1 = util.isString;
var isNumber$2 = util.isNumber;
var isBoolean$2 = util.isBoolean;
var util_2 = util;
var util_3 = util;
function pick$2(obj, props) {
    var copy = {};
    props.forEach(function (prop) {
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = obj[prop];
        }
    });
    return copy;
}
var pick_1 = pick$2;
function range$3(start, stop, step) {
    if (arguments.length < 3) {
        step = 1;
        if (arguments.length < 2) {
            stop = start;
            start = 0;
        }
    }
    if ((stop - start) / step === Infinity) {
        throw new Error('Infinite range');
    }
    var range$$1 = [], i = -1, j;
    if (step < 0) {
        while ((j = start + step * ++i) > stop) {
            range$$1.push(j);
        }
    }
    else {
        while ((j = start + step * ++i) < stop) {
            range$$1.push(j);
        }
    }
    return range$$1;
}
var range_1 = range$3;
function omit(obj, props) {
    var copy = util_2.duplicate(obj);
    props.forEach(function (prop) {
        delete copy[prop];
    });
    return copy;
}
var omit_1 = omit;
function hash(a) {
    if (util_3.isString(a) || util_3.isNumber(a) || util_3.isBoolean(a)) {
        return String(a);
    }
    return jsonStableStringify(a);
}
var hash_1 = hash;
function contains(array, item) {
    return array.indexOf(item) > -1;
}
var contains_1 = contains;
function without(array, excludedItems) {
    return array.filter(function (item) {
        return !contains(excludedItems, item);
    });
}
var without_1 = without;
function union(array, other) {
    return array.concat(without(other, array));
}
var union_1 = union;
function forEach(obj, f, thisArg) {
    if (obj.forEach) {
        obj.forEach.call(thisArg, f);
    }
    else {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                f.call(thisArg, obj[k], k, obj);
            }
        }
    }
}
var forEach_1 = forEach;
function reduce(obj, f, init, thisArg) {
    if (obj.reduce) {
        return obj.reduce.call(thisArg, f, init);
    }
    else {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                init = f.call(thisArg, init, obj[k], k, obj);
            }
        }
        return init;
    }
}
var reduce_1 = reduce;
function map$1(obj, f, thisArg) {
    if (obj.map) {
        return obj.map.call(thisArg, f);
    }
    else {
        var output = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                output.push(f.call(thisArg, obj[k], k, obj));
            }
        }
        return output;
    }
}
var map_1 = map$1;
function some(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
var some_1 = some;
function every(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
var every_1 = every;
function flatten(arrays) {
    return [].concat.apply([], arrays);
}
var flatten_1 = flatten;
function mergeDeep(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < src.length; i++) {
        dest = deepMerge_(dest, src[i]);
    }
    return dest;
}
var mergeDeep_1 = mergeDeep;
function deepMerge_(dest, src) {
    if (typeof src !== 'object' || src === null) {
        return dest;
    }
    for (var p in src) {
        if (!src.hasOwnProperty(p)) {
            continue;
        }
        if (src[p] === undefined) {
            continue;
        }
        if (typeof src[p] !== 'object' || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(src[p].constructor === Array ? [] : {}, src[p]);
        }
        else {
            mergeDeep(dest[p], src[p]);
        }
    }
    return dest;
}
function unique(values, f) {
    var results = [];
    var u = {}, v, i, n;
    for (i = 0, n = values.length; i < n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (v in u) {
            continue;
        }
        u[v] = 1;
        results.push(values[i]);
    }
    return results;
}
var unique_1 = unique;
function warning(message) {
    console.warn('[VL Warning]', message);
}
var warning_1 = warning;
function error$1(message) {
    console.error('[VL Error]', message);
}
var error_1 = error$1;
function differ(dict, other) {
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            if (other[key] && dict[key] && other[key] !== dict[key]) {
                return true;
            }
        }
    }
    return false;
}
var differ_1 = differ;
var util$1 = {
	keys: keys$1,
	extend: extend$1,
	duplicate: duplicate,
	isArray: isArray$1,
	vals: vals,
	truncate: truncate$2,
	toMap: toMap,
	isObject: isObject$1,
	isString: isString$1,
	isNumber: isNumber$2,
	isBoolean: isBoolean$2,
	pick: pick_1,
	range: range_1,
	omit: omit_1,
	hash: hash_1,
	contains: contains_1,
	without: without_1,
	union: union_1,
	forEach: forEach_1,
	reduce: reduce_1,
	map: map_1,
	some: some_1,
	every: every_1,
	flatten: flatten_1,
	mergeDeep: mergeDeep_1,
	unique: unique_1,
	warning: warning_1,
	error: error_1,
	differ: differ_1
};

var channel = createCommonjsModule(function (module, exports) {
(function (Channel) {
    Channel[Channel["X"] = 'x'] = "X";
    Channel[Channel["Y"] = 'y'] = "Y";
    Channel[Channel["X2"] = 'x2'] = "X2";
    Channel[Channel["Y2"] = 'y2'] = "Y2";
    Channel[Channel["ROW"] = 'row'] = "ROW";
    Channel[Channel["COLUMN"] = 'column'] = "COLUMN";
    Channel[Channel["SHAPE"] = 'shape'] = "SHAPE";
    Channel[Channel["SIZE"] = 'size'] = "SIZE";
    Channel[Channel["COLOR"] = 'color'] = "COLOR";
    Channel[Channel["TEXT"] = 'text'] = "TEXT";
    Channel[Channel["DETAIL"] = 'detail'] = "DETAIL";
    Channel[Channel["LABEL"] = 'label'] = "LABEL";
    Channel[Channel["PATH"] = 'path'] = "PATH";
    Channel[Channel["ORDER"] = 'order'] = "ORDER";
    Channel[Channel["OPACITY"] = 'opacity'] = "OPACITY";
})(exports.Channel || (exports.Channel = {}));
var Channel = exports.Channel;
exports.X = Channel.X;
exports.Y = Channel.Y;
exports.X2 = Channel.X2;
exports.Y2 = Channel.Y2;
exports.ROW = Channel.ROW;
exports.COLUMN = Channel.COLUMN;
exports.SHAPE = Channel.SHAPE;
exports.SIZE = Channel.SIZE;
exports.COLOR = Channel.COLOR;
exports.TEXT = Channel.TEXT;
exports.DETAIL = Channel.DETAIL;
exports.LABEL = Channel.LABEL;
exports.PATH = Channel.PATH;
exports.ORDER = Channel.ORDER;
exports.OPACITY = Channel.OPACITY;
exports.CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.PATH, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL, exports.LABEL];
exports.UNIT_CHANNELS = util$1.without(exports.CHANNELS, [exports.ROW, exports.COLUMN]);
exports.UNIT_SCALE_CHANNELS = util$1.without(exports.UNIT_CHANNELS, [exports.PATH, exports.ORDER, exports.DETAIL, exports.TEXT, exports.LABEL, exports.X2, exports.Y2]);
exports.NONSPATIAL_CHANNELS = util$1.without(exports.UNIT_CHANNELS, [exports.X, exports.Y, exports.X2, exports.Y2]);
exports.NONSPATIAL_SCALE_CHANNELS = util$1.without(exports.UNIT_SCALE_CHANNELS, [exports.X, exports.Y, exports.X2, exports.Y2]);
exports.STACK_GROUP_CHANNELS = [exports.COLOR, exports.DETAIL, exports.ORDER, exports.OPACITY, exports.SIZE];
function supportMark(channel, mark) {
    return !!getSupportedMark(channel)[mark];
}
exports.supportMark = supportMark;
function getSupportedMark(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.DETAIL:
        case exports.ORDER:
        case exports.OPACITY:
        case exports.ROW:
        case exports.COLUMN:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, line: true, area: true, text: true
            };
        case exports.X2:
        case exports.Y2:
            return {
                rule: true, bar: true, area: true
            };
        case exports.SIZE:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, text: true
            };
        case exports.SHAPE:
            return { point: true };
        case exports.TEXT:
            return { text: true };
        case exports.PATH:
            return { line: true };
    }
    return {};
}
exports.getSupportedMark = getSupportedMark;
function getSupportedRole(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.OPACITY:
        case exports.LABEL:
        case exports.DETAIL:
            return {
                measure: true,
                dimension: true
            };
        case exports.ROW:
        case exports.COLUMN:
        case exports.SHAPE:
            return {
                measure: false,
                dimension: true
            };
        case exports.X2:
        case exports.Y2:
        case exports.SIZE:
        case exports.TEXT:
            return {
                measure: true,
                dimension: false
            };
        case exports.PATH:
            return {
                measure: false,
                dimension: true
            };
    }
    throw new Error('Invalid encoding channel' + channel);
}
exports.getSupportedRole = getSupportedRole;
function hasScale(channel) {
    return !util$1.contains([exports.DETAIL, exports.PATH, exports.TEXT, exports.LABEL, exports.ORDER], channel);
}
exports.hasScale = hasScale;
});
var channel_1 = channel.Channel;
var channel_2 = channel.X;
var channel_3 = channel.Y;
var channel_4 = channel.X2;
var channel_5 = channel.Y2;
var channel_6 = channel.ROW;
var channel_7 = channel.COLUMN;
var channel_8 = channel.SHAPE;
var channel_9 = channel.SIZE;
var channel_10 = channel.COLOR;
var channel_11 = channel.TEXT;
var channel_12 = channel.DETAIL;
var channel_13 = channel.LABEL;
var channel_14 = channel.PATH;
var channel_15 = channel.ORDER;
var channel_16 = channel.OPACITY;
var channel_17 = channel.CHANNELS;
var channel_18 = channel.UNIT_CHANNELS;
var channel_19 = channel.UNIT_SCALE_CHANNELS;
var channel_20 = channel.NONSPATIAL_CHANNELS;
var channel_21 = channel.NONSPATIAL_SCALE_CHANNELS;
var channel_22 = channel.STACK_GROUP_CHANNELS;
var channel_23 = channel.supportMark;
var channel_24 = channel.getSupportedMark;
var channel_25 = channel.getSupportedRole;
var channel_26 = channel.hasScale;

function autoMaxBins(channel$$1) {
    switch (channel$$1) {
        case channel.ROW:
        case channel.COLUMN:
        case channel.SIZE:
        case channel.SHAPE:
            return 6;
        default:
            return 10;
    }
}
var autoMaxBins_1 = autoMaxBins;
var bin$3 = {
	autoMaxBins: autoMaxBins_1
};

var type$1 = createCommonjsModule(function (module, exports) {
(function (Type) {
    Type[Type["QUANTITATIVE"] = 'quantitative'] = "QUANTITATIVE";
    Type[Type["ORDINAL"] = 'ordinal'] = "ORDINAL";
    Type[Type["TEMPORAL"] = 'temporal'] = "TEMPORAL";
    Type[Type["NOMINAL"] = 'nominal'] = "NOMINAL";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
exports.QUANTITATIVE = Type.QUANTITATIVE;
exports.ORDINAL = Type.ORDINAL;
exports.TEMPORAL = Type.TEMPORAL;
exports.NOMINAL = Type.NOMINAL;
exports.SHORT_TYPE = {
    quantitative: 'Q',
    temporal: 'T',
    nominal: 'N',
    ordinal: 'O'
};
exports.TYPE_FROM_SHORT_TYPE = {
    Q: exports.QUANTITATIVE,
    T: exports.TEMPORAL,
    O: exports.ORDINAL,
    N: exports.NOMINAL
};
function getFullName(type) {
    var typeString = type;
    return exports.TYPE_FROM_SHORT_TYPE[typeString.toUpperCase()] ||
        typeString.toLowerCase();
}
exports.getFullName = getFullName;
});
var type_1 = type$1.Type;
var type_2 = type$1.QUANTITATIVE;
var type_3 = type$1.ORDINAL;
var type_4 = type$1.TEMPORAL;
var type_5 = type$1.NOMINAL;
var type_6 = type$1.SHORT_TYPE;
var type_7 = type$1.TYPE_FROM_SHORT_TYPE;
var type_8 = type$1.getFullName;

var data$2 = createCommonjsModule(function (module, exports) {
(function (DataFormatType) {
    DataFormatType[DataFormatType["JSON"] = 'json'] = "JSON";
    DataFormatType[DataFormatType["CSV"] = 'csv'] = "CSV";
    DataFormatType[DataFormatType["TSV"] = 'tsv'] = "TSV";
    DataFormatType[DataFormatType["TOPOJSON"] = 'topojson'] = "TOPOJSON";
})(exports.DataFormatType || (exports.DataFormatType = {}));
var DataFormatType = exports.DataFormatType;
(function (DataTable) {
    DataTable[DataTable["SOURCE"] = 'source'] = "SOURCE";
    DataTable[DataTable["SUMMARY"] = 'summary'] = "SUMMARY";
    DataTable[DataTable["STACKED_SCALE"] = 'stacked_scale'] = "STACKED_SCALE";
    DataTable[DataTable["LAYOUT"] = 'layout'] = "LAYOUT";
})(exports.DataTable || (exports.DataTable = {}));
var DataTable = exports.DataTable;
exports.SUMMARY = DataTable.SUMMARY;
exports.SOURCE = DataTable.SOURCE;
exports.STACKED_SCALE = DataTable.STACKED_SCALE;
exports.LAYOUT = DataTable.LAYOUT;
exports.types = {
    'boolean': type$1.Type.NOMINAL,
    'number': type$1.Type.QUANTITATIVE,
    'integer': type$1.Type.QUANTITATIVE,
    'date': type$1.Type.TEMPORAL,
    'string': type$1.Type.NOMINAL
};
});
var data_1 = data$2.DataFormatType;
var data_2 = data$2.DataTable;
var data_3 = data$2.SUMMARY;
var data_4 = data$2.SOURCE;
var data_5 = data$2.STACKED_SCALE;
var data_6 = data$2.LAYOUT;
var data_7 = data$2.types;

var scale$4 = createCommonjsModule(function (module, exports) {
(function (ScaleType) {
    ScaleType[ScaleType["LINEAR"] = 'linear'] = "LINEAR";
    ScaleType[ScaleType["LOG"] = 'log'] = "LOG";
    ScaleType[ScaleType["POW"] = 'pow'] = "POW";
    ScaleType[ScaleType["SQRT"] = 'sqrt'] = "SQRT";
    ScaleType[ScaleType["QUANTILE"] = 'quantile'] = "QUANTILE";
    ScaleType[ScaleType["QUANTIZE"] = 'quantize'] = "QUANTIZE";
    ScaleType[ScaleType["ORDINAL"] = 'ordinal'] = "ORDINAL";
    ScaleType[ScaleType["TIME"] = 'time'] = "TIME";
    ScaleType[ScaleType["UTC"] = 'utc'] = "UTC";
})(exports.ScaleType || (exports.ScaleType = {}));
var ScaleType = exports.ScaleType;
(function (NiceTime) {
    NiceTime[NiceTime["SECOND"] = 'second'] = "SECOND";
    NiceTime[NiceTime["MINUTE"] = 'minute'] = "MINUTE";
    NiceTime[NiceTime["HOUR"] = 'hour'] = "HOUR";
    NiceTime[NiceTime["DAY"] = 'day'] = "DAY";
    NiceTime[NiceTime["WEEK"] = 'week'] = "WEEK";
    NiceTime[NiceTime["MONTH"] = 'month'] = "MONTH";
    NiceTime[NiceTime["YEAR"] = 'year'] = "YEAR";
})(exports.NiceTime || (exports.NiceTime = {}));
var NiceTime = exports.NiceTime;
(function (BandSize) {
    BandSize[BandSize["FIT"] = 'fit'] = "FIT";
})(exports.BandSize || (exports.BandSize = {}));
var BandSize = exports.BandSize;
exports.BANDSIZE_FIT = BandSize.FIT;
exports.defaultScaleConfig = {
    round: true,
    textBandWidth: 90,
    bandSize: 21,
    padding: 0.1,
    useRawDomain: false,
    opacity: [0.3, 0.8],
    nominalColorRange: 'category10',
    sequentialColorRange: ['#AFC6A3', '#09622A'],
    shapeRange: 'shapes',
    fontSizeRange: [8, 40],
    ruleSizeRange: [1, 5],
    tickSizeRange: [1, 20]
};
exports.defaultFacetScaleConfig = {
    round: true,
    padding: 16
};
});
var scale_1 = scale$4.ScaleType;
var scale_2 = scale$4.NiceTime;
var scale_3 = scale$4.BandSize;
var scale_4 = scale$4.BANDSIZE_FIT;
var scale_5 = scale$4.defaultScaleConfig;
var scale_6 = scale$4.defaultFacetScaleConfig;

var defaultLegendConfig = {
    orient: undefined,
};
var legend = {
	defaultLegendConfig: defaultLegendConfig
};

var config = createCommonjsModule(function (module, exports) {
exports.defaultCellConfig = {
    width: 200,
    height: 200
};
exports.defaultFacetCellConfig = {
    stroke: '#ccc',
    strokeWidth: 1
};
var defaultFacetGridConfig = {
    color: '#000000',
    opacity: 0.4,
    offset: 0
};
exports.defaultFacetConfig = {
    scale: scale$4.defaultFacetScaleConfig,
    axis: axis.defaultFacetAxisConfig,
    grid: defaultFacetGridConfig,
    cell: exports.defaultFacetCellConfig
};
(function (FontWeight) {
    FontWeight[FontWeight["NORMAL"] = 'normal'] = "NORMAL";
    FontWeight[FontWeight["BOLD"] = 'bold'] = "BOLD";
})(exports.FontWeight || (exports.FontWeight = {}));
var FontWeight = exports.FontWeight;
(function (Shape) {
    Shape[Shape["CIRCLE"] = 'circle'] = "CIRCLE";
    Shape[Shape["SQUARE"] = 'square'] = "SQUARE";
    Shape[Shape["CROSS"] = 'cross'] = "CROSS";
    Shape[Shape["DIAMOND"] = 'diamond'] = "DIAMOND";
    Shape[Shape["TRIANGLEUP"] = 'triangle-up'] = "TRIANGLEUP";
    Shape[Shape["TRIANGLEDOWN"] = 'triangle-down'] = "TRIANGLEDOWN";
})(exports.Shape || (exports.Shape = {}));
var Shape = exports.Shape;
(function (Orient) {
    Orient[Orient["HORIZONTAL"] = 'horizontal'] = "HORIZONTAL";
    Orient[Orient["VERTICAL"] = 'vertical'] = "VERTICAL";
})(exports.Orient || (exports.Orient = {}));
var Orient = exports.Orient;
(function (HorizontalAlign) {
    HorizontalAlign[HorizontalAlign["LEFT"] = 'left'] = "LEFT";
    HorizontalAlign[HorizontalAlign["RIGHT"] = 'right'] = "RIGHT";
    HorizontalAlign[HorizontalAlign["CENTER"] = 'center'] = "CENTER";
})(exports.HorizontalAlign || (exports.HorizontalAlign = {}));
var HorizontalAlign = exports.HorizontalAlign;
(function (VerticalAlign) {
    VerticalAlign[VerticalAlign["TOP"] = 'top'] = "TOP";
    VerticalAlign[VerticalAlign["MIDDLE"] = 'middle'] = "MIDDLE";
    VerticalAlign[VerticalAlign["BOTTOM"] = 'bottom'] = "BOTTOM";
})(exports.VerticalAlign || (exports.VerticalAlign = {}));
var VerticalAlign = exports.VerticalAlign;
(function (FontStyle) {
    FontStyle[FontStyle["NORMAL"] = 'normal'] = "NORMAL";
    FontStyle[FontStyle["ITALIC"] = 'italic'] = "ITALIC";
})(exports.FontStyle || (exports.FontStyle = {}));
var FontStyle = exports.FontStyle;
(function (Interpolate) {
    Interpolate[Interpolate["LINEAR"] = 'linear'] = "LINEAR";
    Interpolate[Interpolate["LINEAR_CLOSED"] = 'linear-closed'] = "LINEAR_CLOSED";
    Interpolate[Interpolate["STEP"] = 'step'] = "STEP";
    Interpolate[Interpolate["STEP_BEFORE"] = 'step-before'] = "STEP_BEFORE";
    Interpolate[Interpolate["STEP_AFTER"] = 'step-after'] = "STEP_AFTER";
    Interpolate[Interpolate["BASIS"] = 'basis'] = "BASIS";
    Interpolate[Interpolate["BASIS_OPEN"] = 'basis-open'] = "BASIS_OPEN";
    Interpolate[Interpolate["BASIS_CLOSED"] = 'basis-closed'] = "BASIS_CLOSED";
    Interpolate[Interpolate["CARDINAL"] = 'cardinal'] = "CARDINAL";
    Interpolate[Interpolate["CARDINAL_OPEN"] = 'cardinal-open'] = "CARDINAL_OPEN";
    Interpolate[Interpolate["CARDINAL_CLOSED"] = 'cardinal-closed'] = "CARDINAL_CLOSED";
    Interpolate[Interpolate["BUNDLE"] = 'bundle'] = "BUNDLE";
    Interpolate[Interpolate["MONOTONE"] = 'monotone'] = "MONOTONE";
})(exports.Interpolate || (exports.Interpolate = {}));
var Interpolate = exports.Interpolate;
(function (AreaOverlay) {
    AreaOverlay[AreaOverlay["LINE"] = 'line'] = "LINE";
    AreaOverlay[AreaOverlay["LINEPOINT"] = 'linepoint'] = "LINEPOINT";
    AreaOverlay[AreaOverlay["NONE"] = 'none'] = "NONE";
})(exports.AreaOverlay || (exports.AreaOverlay = {}));
var AreaOverlay = exports.AreaOverlay;
exports.defaultOverlayConfig = {
    line: false,
    pointStyle: { filled: true },
    lineStyle: {}
};
exports.defaultMarkConfig = {
    color: '#4682b4',
    shape: Shape.CIRCLE,
    strokeWidth: 2,
    size: 30,
    barThinSize: 2,
    ruleSize: 1,
    tickThickness: 1,
    fontSize: 10,
    baseline: VerticalAlign.MIDDLE,
    text: 'Abc',
    applyColorToBackground: false
};
exports.defaultConfig = {
    numberFormat: 's',
    timeFormat: '%b %d, %Y',
    countTitle: 'Number of Records',
    cell: exports.defaultCellConfig,
    mark: exports.defaultMarkConfig,
    overlay: exports.defaultOverlayConfig,
    scale: scale$4.defaultScaleConfig,
    axis: axis.defaultAxisConfig,
    legend: legend.defaultLegendConfig,
    facet: exports.defaultFacetConfig,
};
});
var config_1 = config.defaultCellConfig;
var config_2 = config.defaultFacetCellConfig;
var config_3 = config.defaultFacetConfig;
var config_4 = config.FontWeight;
var config_5 = config.Shape;
var config_6 = config.Orient;
var config_7 = config.HorizontalAlign;
var config_8 = config.VerticalAlign;
var config_9 = config.FontStyle;
var config_10 = config.Interpolate;
var config_11 = config.AreaOverlay;
var config_12 = config.defaultOverlayConfig;
var config_13 = config.defaultMarkConfig;
var config_14 = config.defaultConfig;

function countRetinal(encoding) {
    var count = 0;
    if (encoding.color) {
        count++;
    }
    if (encoding.opacity) {
        count++;
    }
    if (encoding.size) {
        count++;
    }
    if (encoding.shape) {
        count++;
    }
    return count;
}
var countRetinal_1 = countRetinal;
function channels(encoding) {
    return channel.CHANNELS.filter(function (channel$$1) {
        return has$1(encoding, channel$$1);
    });
}
var channels_1 = channels;
function has$1(encoding, channel$$1) {
    var channelEncoding = encoding && encoding[channel$$1];
    return channelEncoding && (channelEncoding.field !== undefined ||
        (util$1.isArray(channelEncoding) && channelEncoding.length > 0));
}
var has_1 = has$1;
function isAggregate(encoding) {
    return util$1.some(channel.CHANNELS, function (channel$$1) {
        if (has$1(encoding, channel$$1) && encoding[channel$$1].aggregate) {
            return true;
        }
        return false;
    });
}
var isAggregate_1 = isAggregate;
function isRanged(encoding) {
    return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}
var isRanged_1 = isRanged;
function fieldDefs(encoding) {
    var arr = [];
    channel.CHANNELS.forEach(function (channel$$1) {
        if (has$1(encoding, channel$$1)) {
            if (util$1.isArray(encoding[channel$$1])) {
                encoding[channel$$1].forEach(function (fieldDef) {
                    arr.push(fieldDef);
                });
            }
            else {
                arr.push(encoding[channel$$1]);
            }
        }
    });
    return arr;
}
var fieldDefs_1 = fieldDefs;
function forEach$1(encoding, f, thisArg) {
    channelMappingForEach(channel.CHANNELS, encoding, f, thisArg);
}
var forEach_1$1 = forEach$1;
function channelMappingForEach(channels, mapping, f, thisArg) {
    var i = 0;
    channels.forEach(function (channel$$1) {
        if (has$1(mapping, channel$$1)) {
            if (util$1.isArray(mapping[channel$$1])) {
                mapping[channel$$1].forEach(function (fieldDef) {
                    f.call(thisArg, fieldDef, channel$$1, i++);
                });
            }
            else {
                f.call(thisArg, mapping[channel$$1], channel$$1, i++);
            }
        }
    });
}
var channelMappingForEach_1 = channelMappingForEach;
function map$2(encoding, f, thisArg) {
    return channelMappingMap(channel.CHANNELS, encoding, f, thisArg);
}
var map_1$1 = map$2;
function channelMappingMap(channels, mapping, f, thisArg) {
    var arr = [];
    channels.forEach(function (channel$$1) {
        if (has$1(mapping, channel$$1)) {
            if (util$1.isArray(mapping[channel$$1])) {
                mapping[channel$$1].forEach(function (fieldDef) {
                    arr.push(f.call(thisArg, fieldDef, channel$$1));
                });
            }
            else {
                arr.push(f.call(thisArg, mapping[channel$$1], channel$$1));
            }
        }
    });
    return arr;
}
var channelMappingMap_1 = channelMappingMap;
function reduce$1(encoding, f, init, thisArg) {
    return channelMappingReduce(channel.CHANNELS, encoding, f, init, thisArg);
}
var reduce_1$1 = reduce$1;
function channelMappingReduce(channels, mapping, f, init, thisArg) {
    var r = init;
    channel.CHANNELS.forEach(function (channel$$1) {
        if (has$1(mapping, channel$$1)) {
            if (util$1.isArray(mapping[channel$$1])) {
                mapping[channel$$1].forEach(function (fieldDef) {
                    r = f.call(thisArg, r, fieldDef, channel$$1);
                });
            }
            else {
                r = f.call(thisArg, r, mapping[channel$$1], channel$$1);
            }
        }
    });
    return r;
}
var channelMappingReduce_1 = channelMappingReduce;
var encoding = {
	countRetinal: countRetinal_1,
	channels: channels_1,
	has: has_1,
	isAggregate: isAggregate_1,
	isRanged: isRanged_1,
	fieldDefs: fieldDefs_1,
	forEach: forEach_1$1,
	channelMappingForEach: channelMappingForEach_1,
	map: map_1$1,
	channelMappingMap: channelMappingMap_1,
	reduce: reduce_1$1,
	channelMappingReduce: channelMappingReduce_1
};

var mark = createCommonjsModule(function (module, exports) {
(function (Mark) {
    Mark[Mark["AREA"] = 'area'] = "AREA";
    Mark[Mark["BAR"] = 'bar'] = "BAR";
    Mark[Mark["LINE"] = 'line'] = "LINE";
    Mark[Mark["POINT"] = 'point'] = "POINT";
    Mark[Mark["TEXT"] = 'text'] = "TEXT";
    Mark[Mark["TICK"] = 'tick'] = "TICK";
    Mark[Mark["RULE"] = 'rule'] = "RULE";
    Mark[Mark["CIRCLE"] = 'circle'] = "CIRCLE";
    Mark[Mark["SQUARE"] = 'square'] = "SQUARE";
    Mark[Mark["ERRORBAR"] = 'errorBar'] = "ERRORBAR";
})(exports.Mark || (exports.Mark = {}));
var Mark = exports.Mark;
exports.AREA = Mark.AREA;
exports.BAR = Mark.BAR;
exports.LINE = Mark.LINE;
exports.POINT = Mark.POINT;
exports.TEXT = Mark.TEXT;
exports.TICK = Mark.TICK;
exports.RULE = Mark.RULE;
exports.CIRCLE = Mark.CIRCLE;
exports.SQUARE = Mark.SQUARE;
exports.ERRORBAR = Mark.ERRORBAR;
exports.PRIMITIVE_MARKS = [exports.AREA, exports.BAR, exports.LINE, exports.POINT, exports.TEXT, exports.TICK, exports.RULE, exports.CIRCLE, exports.SQUARE];
});
var mark_1 = mark.Mark;
var mark_2 = mark.AREA;
var mark_3 = mark.BAR;
var mark_4 = mark.LINE;
var mark_5 = mark.POINT;
var mark_6 = mark.TEXT;
var mark_7 = mark.TICK;
var mark_8 = mark.RULE;
var mark_9 = mark.CIRCLE;
var mark_10 = mark.SQUARE;
var mark_11 = mark.ERRORBAR;
var mark_12 = mark.PRIMITIVE_MARKS;

var stack_1 = createCommonjsModule(function (module, exports) {
(function (StackOffset) {
    StackOffset[StackOffset["ZERO"] = 'zero'] = "ZERO";
    StackOffset[StackOffset["CENTER"] = 'center'] = "CENTER";
    StackOffset[StackOffset["NORMALIZE"] = 'normalize'] = "NORMALIZE";
    StackOffset[StackOffset["NONE"] = 'none'] = "NONE";
})(exports.StackOffset || (exports.StackOffset = {}));
var StackOffset = exports.StackOffset;
function stack(mark$$1, encoding$$1, stacked) {
    if (util$1.contains([StackOffset.NONE, null, false], stacked)) {
        return null;
    }
    if (!util$1.contains([mark.BAR, mark.AREA, mark.POINT, mark.CIRCLE, mark.SQUARE, mark.LINE, mark.TEXT, mark.TICK], mark$$1)) {
        return null;
    }
    if (!encoding.isAggregate(encoding$$1)) {
        return null;
    }
    var stackByChannels = channel.STACK_GROUP_CHANNELS.reduce(function (sc, channel$$1) {
        if (encoding.has(encoding$$1, channel$$1) && !encoding$$1[channel$$1].aggregate) {
            sc.push(channel$$1);
        }
        return sc;
    }, []);
    if (stackByChannels.length === 0) {
        return null;
    }
    var hasXField = encoding.has(encoding$$1, channel.X);
    var hasYField = encoding.has(encoding$$1, channel.Y);
    var xIsAggregate = hasXField && !!encoding$$1.x.aggregate;
    var yIsAggregate = hasYField && !!encoding$$1.y.aggregate;
    if (xIsAggregate !== yIsAggregate) {
        var fieldChannel = xIsAggregate ? channel.X : channel.Y;
        var fieldChannelAggregate = encoding$$1[fieldChannel].aggregate;
        var fieldChannelScale = encoding$$1[fieldChannel].scale;
        if (fieldChannelScale && fieldChannelScale.type && fieldChannelScale.type !== scale$4.ScaleType.LINEAR) {
            console.warn('Cannot stack non-linear (' + fieldChannelScale.type + ') scale');
            return null;
        }
        if (util$1.contains(aggregate.SUM_OPS, fieldChannelAggregate)) {
            if (util$1.contains([mark.BAR, mark.AREA], mark$$1)) {
                stacked = stacked === undefined ? StackOffset.ZERO : stacked;
            }
        }
        else {
            console.warn('Cannot stack when the aggregate function is ' + fieldChannelAggregate + '(non-summative).');
            return null;
        }
        if (!stacked) {
            return null;
        }
        return {
            groupbyChannel: xIsAggregate ? (hasYField ? channel.Y : null) : (hasXField ? channel.X : null),
            fieldChannel: fieldChannel,
            stackByChannels: stackByChannels,
            offset: stacked
        };
    }
    return null;
}
exports.stack = stack;
});
var stack_2 = stack_1.StackOffset;
var stack_3 = stack_1.stack;

var vlEncoding = encoding;
function isSomeFacetSpec(spec) {
    return spec['facet'] !== undefined;
}
var isSomeFacetSpec_1 = isSomeFacetSpec;
function isExtendedUnitSpec(spec) {
    if (isSomeUnitSpec(spec)) {
        var hasRow = encoding.has(spec.encoding, channel.ROW);
        var hasColumn = encoding.has(spec.encoding, channel.COLUMN);
        return hasRow || hasColumn;
    }
    return false;
}
var isExtendedUnitSpec_1 = isExtendedUnitSpec;
function isUnitSpec(spec) {
    if (isSomeUnitSpec(spec)) {
        return !isExtendedUnitSpec(spec);
    }
    return false;
}
var isUnitSpec_1 = isUnitSpec;
function isSomeUnitSpec(spec) {
    return spec['mark'] !== undefined;
}
var isSomeUnitSpec_1 = isSomeUnitSpec;
function isLayerSpec(spec) {
    return spec['layers'] !== undefined;
}
var isLayerSpec_1 = isLayerSpec;
function normalize(spec) {
    if (isExtendedUnitSpec(spec)) {
        return normalizeExtendedUnitSpec(spec);
    }
    if (isUnitSpec(spec)) {
        return normalizeUnitSpec(spec);
    }
    return spec;
}
var normalize_1 = normalize;
function normalizeExtendedUnitSpec(spec) {
    var hasRow = encoding.has(spec.encoding, channel.ROW);
    var hasColumn = encoding.has(spec.encoding, channel.COLUMN);
    var encoding$$1 = util$1.duplicate(spec.encoding);
    delete encoding$$1.column;
    delete encoding$$1.row;
    return util$1.extend(spec.name ? { name: spec.name } : {}, spec.description ? { description: spec.description } : {}, { data: spec.data }, spec.transform ? { transform: spec.transform } : {}, {
        facet: util$1.extend(hasRow ? { row: spec.encoding.row } : {}, hasColumn ? { column: spec.encoding.column } : {}),
        spec: normalizeUnitSpec(util$1.extend(spec.width ? { width: spec.width } : {}, spec.height ? { height: spec.height } : {}, {
            mark: spec.mark,
            encoding: encoding$$1
        }, spec.config ? { config: spec.config } : {}))
    }, spec.config ? { config: spec.config } : {});
}
var normalizeExtendedUnitSpec_1 = normalizeExtendedUnitSpec;
function normalizeUnitSpec(spec) {
    var config$$1 = spec.config;
    var overlayConfig = config$$1 && config$$1.overlay;
    var overlayWithLine = overlayConfig && spec.mark === mark.AREA &&
        util$1.contains([config.AreaOverlay.LINEPOINT, config.AreaOverlay.LINE], overlayConfig.area);
    var overlayWithPoint = overlayConfig && ((overlayConfig.line && spec.mark === mark.LINE) ||
        (overlayConfig.area === config.AreaOverlay.LINEPOINT && spec.mark === mark.AREA));
    if (spec.mark === mark.ERRORBAR) {
        return normalizeErrorBarUnitSpec(spec);
    }
    if (encoding.isRanged(spec.encoding)) {
        return normalizeRangedUnitSpec(spec);
    }
    if (overlayWithPoint || overlayWithLine) {
        return normalizeOverlay(spec, overlayWithPoint, overlayWithLine);
    }
    return spec;
}
var normalizeUnitSpec_1 = normalizeUnitSpec;
function normalizeRangedUnitSpec(spec) {
    if (spec.encoding) {
        var hasX = encoding.has(spec.encoding, channel.X);
        var hasY = encoding.has(spec.encoding, channel.Y);
        var hasX2 = encoding.has(spec.encoding, channel.X2);
        var hasY2 = encoding.has(spec.encoding, channel.Y2);
        if ((hasX2 && !hasX) || (hasY2 && !hasY)) {
            var normalizedSpec = util$1.duplicate(spec);
            if (hasX2 && !hasX) {
                normalizedSpec.encoding.x = normalizedSpec.encoding.x2;
                delete normalizedSpec.encoding.x2;
            }
            if (hasY2 && !hasY) {
                normalizedSpec.encoding.y = normalizedSpec.encoding.y2;
                delete normalizedSpec.encoding.y2;
            }
            return normalizedSpec;
        }
    }
    return spec;
}
var normalizeRangedUnitSpec_1 = normalizeRangedUnitSpec;
function normalizeErrorBarUnitSpec(spec) {
    var layerSpec = util$1.extend(spec.name ? { name: spec.name } : {}, spec.description ? { description: spec.description } : {}, spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, spec.config ? { config: spec.config } : {}, { layers: [] });
    if (!spec.encoding) {
        return layerSpec;
    }
    if (spec.mark === mark.ERRORBAR) {
        var ruleSpec = {
            mark: mark.RULE,
            encoding: util$1.extend(spec.encoding.x ? { x: util$1.duplicate(spec.encoding.x) } : {}, spec.encoding.y ? { y: util$1.duplicate(spec.encoding.y) } : {}, spec.encoding.x2 ? { x2: util$1.duplicate(spec.encoding.x2) } : {}, spec.encoding.y2 ? { y2: util$1.duplicate(spec.encoding.y2) } : {}, {})
        };
        var lowerTickSpec = {
            mark: mark.TICK,
            encoding: util$1.extend(spec.encoding.x ? { x: util$1.duplicate(spec.encoding.x) } : {}, spec.encoding.y ? { y: util$1.duplicate(spec.encoding.y) } : {}, spec.encoding.size ? { size: util$1.duplicate(spec.encoding.size) } : {}, {})
        };
        var upperTickSpec = {
            mark: mark.TICK,
            encoding: util$1.extend({
                x: spec.encoding.x2 ? util$1.duplicate(spec.encoding.x2) : util$1.duplicate(spec.encoding.x),
                y: spec.encoding.y2 ? util$1.duplicate(spec.encoding.y2) : util$1.duplicate(spec.encoding.y)
            }, spec.encoding.size ? { size: util$1.duplicate(spec.encoding.size) } : {})
        };
        layerSpec.layers.push(normalizeUnitSpec(ruleSpec));
        layerSpec.layers.push(normalizeUnitSpec(lowerTickSpec));
        layerSpec.layers.push(normalizeUnitSpec(upperTickSpec));
    }
    return layerSpec;
}
var normalizeErrorBarUnitSpec_1 = normalizeErrorBarUnitSpec;
function normalizeOverlay(spec, overlayWithPoint, overlayWithLine) {
    var outerProps = ['name', 'description', 'data', 'transform'];
    var baseSpec = util$1.omit(spec, outerProps.concat('config'));
    var baseConfig = util$1.duplicate(spec.config);
    delete baseConfig.overlay;
    var stacked = stack_1.stack(spec.mark, spec.encoding, spec.config && spec.config.mark ? spec.config.mark.stacked : undefined);
    var layerSpec = util$1.extend(util$1.pick(spec, outerProps), { layers: [baseSpec] }, util$1.keys(baseConfig).length > 0 ? { config: baseConfig } : {});
    if (overlayWithLine) {
        var lineSpec = util$1.duplicate(baseSpec);
        lineSpec.mark = mark.LINE;
        var markConfig = util$1.extend({}, config.defaultOverlayConfig.lineStyle, spec.config.overlay.lineStyle, stacked ? { stacked: stacked.offset } : null);
        if (util$1.keys(markConfig).length > 0) {
            lineSpec.config = { mark: markConfig };
        }
        layerSpec.layers.push(lineSpec);
    }
    if (overlayWithPoint) {
        var pointSpec = util$1.duplicate(baseSpec);
        pointSpec.mark = mark.POINT;
        var markConfig = util$1.extend({}, config.defaultOverlayConfig.pointStyle, spec.config.overlay.pointStyle, stacked ? { stacked: stacked.offset } : null);
        if (util$1.keys(markConfig).length > 0) {
            pointSpec.config = { mark: markConfig };
        }
        layerSpec.layers.push(pointSpec);
    }
    return layerSpec;
}
var normalizeOverlay_1 = normalizeOverlay;
function accumulate(dict, fieldDefs) {
    fieldDefs.forEach(function (fieldDef) {
        var pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce(function (f, key) {
            if (fieldDef[key] !== undefined) {
                f[key] = fieldDef[key];
            }
            return f;
        }, {});
        var key = util$1.hash(pureFieldDef);
        dict[key] = dict[key] || fieldDef;
    });
    return dict;
}
function fieldDefIndex(spec, dict) {
    if (dict === void 0) { dict = {}; }
    if (isLayerSpec(spec)) {
        spec.layers.forEach(function (layer) {
            accumulate(dict, vlEncoding.fieldDefs(layer.encoding));
        });
    }
    else if (isSomeFacetSpec(spec)) {
        accumulate(dict, vlEncoding.fieldDefs(spec.facet));
        fieldDefIndex(spec.spec, dict);
    }
    else {
        accumulate(dict, vlEncoding.fieldDefs(spec.encoding));
    }
    return dict;
}
function fieldDefs$1(spec) {
    return util$1.vals(fieldDefIndex(spec));
}
var fieldDefs_1$1 = fieldDefs$1;
function isStacked(spec) {
    return stack_1.stack(spec.mark, spec.encoding, (spec.config && spec.config.mark) ? spec.config.mark.stacked : undefined) !== null;
}
var isStacked_1 = isStacked;
var spec = {
	isSomeFacetSpec: isSomeFacetSpec_1,
	isExtendedUnitSpec: isExtendedUnitSpec_1,
	isUnitSpec: isUnitSpec_1,
	isSomeUnitSpec: isSomeUnitSpec_1,
	isLayerSpec: isLayerSpec_1,
	normalize: normalize_1,
	normalizeExtendedUnitSpec: normalizeExtendedUnitSpec_1,
	normalizeUnitSpec: normalizeUnitSpec_1,
	normalizeRangedUnitSpec: normalizeRangedUnitSpec_1,
	normalizeErrorBarUnitSpec: normalizeErrorBarUnitSpec_1,
	normalizeOverlay: normalizeOverlay_1,
	fieldDefs: fieldDefs_1$1,
	isStacked: isStacked_1
};

function field$2(fieldDef, opt) {
    if (opt === void 0) { opt = {}; }
    var field = fieldDef.field;
    var prefix = opt.prefix;
    var suffix = opt.suffix;
    if (isCount(fieldDef)) {
        field = 'count';
    }
    else {
        var fn = opt.fn;
        if (!opt.nofn) {
            if (fieldDef.bin) {
                fn = 'bin';
                suffix = opt.binSuffix || (opt.scaleType === scale$4.ScaleType.ORDINAL ?
                    'range' :
                    'start');
            }
            else if (!opt.noAggregate && fieldDef.aggregate) {
                fn = String(fieldDef.aggregate);
            }
            else if (fieldDef.timeUnit) {
                fn = String(fieldDef.timeUnit);
            }
        }
        if (!!fn) {
            field = fn + "_" + field;
        }
    }
    if (!!suffix) {
        field = field + "_" + suffix;
    }
    if (!!prefix) {
        field = prefix + "_" + field;
    }
    if (opt.datum) {
        field = "datum[\"" + field + "\"]";
    }
    return field;
}
var field_1 = field$2;
function _isFieldDimension(fieldDef) {
    if (util$1.contains([type$1.NOMINAL, type$1.ORDINAL], fieldDef.type)) {
        return true;
    }
    else if (!!fieldDef.bin) {
        return true;
    }
    else if (fieldDef.type === type$1.TEMPORAL) {
        return !!fieldDef.timeUnit;
    }
    return false;
}
function isDimension(fieldDef) {
    return fieldDef && fieldDef.field && _isFieldDimension(fieldDef);
}
var isDimension_1 = isDimension;
function isMeasure(fieldDef) {
    return fieldDef && fieldDef.field && !_isFieldDimension(fieldDef);
}
var isMeasure_1 = isMeasure;
function count() {
    return { field: '*', aggregate: aggregate.AggregateOp.COUNT, type: type$1.QUANTITATIVE };
}
var count_1 = count;
function isCount(fieldDef) {
    return fieldDef.aggregate === aggregate.AggregateOp.COUNT;
}
var isCount_1 = isCount;
function title(fieldDef, config) {
    if (fieldDef.title != null) {
        return fieldDef.title;
    }
    if (isCount(fieldDef)) {
        return config.countTitle;
    }
    var fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
    if (fn) {
        return fn.toString().toUpperCase() + '(' + fieldDef.field + ')';
    }
    else {
        return fieldDef.field;
    }
}
var title_1 = title;
var fielddef = {
	field: field_1,
	isDimension: isDimension_1,
	isMeasure: isMeasure_1,
	count: count_1,
	isCount: isCount_1,
	title: title_1
};

var sort$1 = createCommonjsModule(function (module, exports) {
(function (SortOrder) {
    SortOrder[SortOrder["ASCENDING"] = 'ascending'] = "ASCENDING";
    SortOrder[SortOrder["DESCENDING"] = 'descending'] = "DESCENDING";
    SortOrder[SortOrder["NONE"] = 'none'] = "NONE";
})(exports.SortOrder || (exports.SortOrder = {}));
var SortOrder = exports.SortOrder;
function isSortField(sort) {
    return !!sort && !!sort['field'] && !!sort['op'];
}
exports.isSortField = isSortField;
});
var sort_1 = sort$1.SortOrder;
var sort_2 = sort$1.isSortField;

var datetime = createCommonjsModule(function (module, exports) {
var SUNDAY_YEAR = 2006;
function isDateTime(o) {
    return !!o && (!!o.year || !!o.quarter || !!o.month || !!o.date || !!o.day ||
        !!o.hours || !!o.minutes || !!o.seconds || !!o.milliseconds);
}
exports.isDateTime = isDateTime;
exports.MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
exports.SHORT_MONTHS = exports.MONTHS.map(function (m) { return m.substr(0, 3); });
exports.DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
exports.SHORT_DAYS = exports.DAYS.map(function (d) { return d.substr(0, 3); });
function normalizeQuarter(q) {
    if (util$1.isNumber(q)) {
        return (q - 1) + '';
    }
    else {
        console.warn('Potentially invalid quarter', q);
        return q;
    }
}
function normalizeMonth(m) {
    if (util$1.isNumber(m)) {
        return (m - 1) + '';
    }
    else {
        var lowerM = m.toLowerCase();
        var monthIndex = exports.MONTHS.indexOf(lowerM);
        if (monthIndex !== -1) {
            return monthIndex + '';
        }
        var shortM = lowerM.substr(0, 3);
        var shortMonthIndex = exports.SHORT_MONTHS.indexOf(shortM);
        if (shortMonthIndex !== -1) {
            return shortMonthIndex + '';
        }
        console.warn('Potentially invalid month', m);
        return m;
    }
}
function normalizeDay(d) {
    if (util$1.isNumber(d)) {
        return (d % 7) + '';
    }
    else {
        var lowerD = d.toLowerCase();
        var dayIndex = exports.DAYS.indexOf(lowerD);
        if (dayIndex !== -1) {
            return dayIndex + '';
        }
        var shortD = lowerD.substr(0, 3);
        var shortDayIndex = exports.SHORT_DAYS.indexOf(shortD);
        if (shortDayIndex !== -1) {
            return shortDayIndex + '';
        }
        console.warn('Potentially invalid day', d);
        return d;
    }
}
function timestamp(d, normalize) {
    var date = new Date(0, 0, 1, 0, 0, 0, 0);
    if (d.day !== undefined) {
        if (util$1.keys(d).length > 1) {
            console.warn('Dropping day from datetime', JSON.stringify(d), 'as day cannot be combined with other units.');
            d = util$1.duplicate(d);
            delete d.day;
        }
        else {
            date.setFullYear(SUNDAY_YEAR);
            var day = normalize ? normalizeDay(d.day) : d.day;
            date.setDate(+day + 1);
        }
    }
    if (d.year !== undefined) {
        date.setFullYear(d.year);
    }
    if (d.quarter !== undefined) {
        var quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
        date.setMonth(+quarter * 3);
    }
    if (d.month !== undefined) {
        var month = normalize ? normalizeMonth(d.month) : d.month;
        date.setMonth(+month);
    }
    if (d.date !== undefined) {
        date.setDate(d.date);
    }
    if (d.hours !== undefined) {
        date.setHours(d.hours);
    }
    if (d.minutes !== undefined) {
        date.setMinutes(d.minutes);
    }
    if (d.seconds !== undefined) {
        date.setSeconds(d.seconds);
    }
    if (d.milliseconds !== undefined) {
        date.setMilliseconds(d.milliseconds);
    }
    return date.getTime();
}
exports.timestamp = timestamp;
function dateTimeExpr(d, normalize) {
    if (normalize === void 0) { normalize = false; }
    var units = [];
    if (normalize && d.day !== undefined) {
        if (util$1.keys(d).length > 1) {
            console.warn('Dropping day from datetime', JSON.stringify(d), 'as day cannot be combined with other units.');
            d = util$1.duplicate(d);
            delete d.day;
        }
    }
    if (d.year !== undefined) {
        units.push(d.year);
    }
    else if (d.day !== undefined) {
        units.push(SUNDAY_YEAR);
    }
    else {
        units.push(0);
    }
    if (d.month !== undefined) {
        var month = normalize ? normalizeMonth(d.month) : d.month;
        units.push(month);
    }
    else if (d.quarter !== undefined) {
        var quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
        units.push(quarter + '*3');
    }
    else {
        units.push(0);
    }
    if (d.date !== undefined) {
        units.push(d.date);
    }
    else if (d.day !== undefined) {
        var day = normalize ? normalizeDay(d.day) : d.day;
        units.push(day + '+1');
    }
    else {
        units.push(1);
    }
    for (var _i = 0, _a = ['hours', 'minutes', 'seconds', 'milliseconds']; _i < _a.length; _i++) {
        var timeUnit = _a[_i];
        if (d[timeUnit] !== undefined) {
            units.push(d[timeUnit]);
        }
        else {
            units.push(0);
        }
    }
    return 'datetime(' + units.join(', ') + ')';
}
exports.dateTimeExpr = dateTimeExpr;
});
var datetime_1 = datetime.isDateTime;
var datetime_2 = datetime.MONTHS;
var datetime_3 = datetime.SHORT_MONTHS;
var datetime_4 = datetime.DAYS;
var datetime_5 = datetime.SHORT_DAYS;
var datetime_6 = datetime.timestamp;
var datetime_7 = datetime.dateTimeExpr;

var axis$1 = createCommonjsModule(function (module, exports) {
function parseAxisComponent(model, axisChannels) {
    return axisChannels.reduce(function (axis$$1, channel$$1) {
        if (model.axis(channel$$1)) {
            axis$$1[channel$$1] = parseAxis(channel$$1, model);
        }
        return axis$$1;
    }, {});
}
exports.parseAxisComponent = parseAxisComponent;
function parseInnerAxis(channel$$1, model) {
    var isCol = channel$$1 === channel.COLUMN, isRow = channel$$1 === channel.ROW, type = isCol ? 'x' : isRow ? 'y' : channel$$1;
    var def = {
        type: type,
        scale: model.scaleName(channel$$1),
        grid: true,
        tickSize: 0,
        properties: {
            labels: {
                text: { value: '' }
            },
            axis: {
                stroke: { value: 'transparent' }
            }
        }
    };
    var axis$$1 = model.axis(channel$$1);
    ['layer', 'ticks', 'values', 'subdivide'].forEach(function (property) {
        var method;
        var value = (method = exports[property]) ?
            method(model, channel$$1, def) :
            axis$$1[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = model.axis(channel$$1).properties || {};
    ['grid'].forEach(function (group) {
        var value = properties[group] ?
            properties[group](model, channel$$1, props[group] || {}, def) :
            props[group];
        if (value !== undefined && util$1.keys(value).length > 0) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.parseInnerAxis = parseInnerAxis;
function parseAxis(channel$$1, model) {
    var isCol = channel$$1 === channel.COLUMN, isRow = channel$$1 === channel.ROW, type = isCol ? 'x' : isRow ? 'y' : channel$$1;
    var axis$$1 = model.axis(channel$$1);
    var def = {
        type: type,
        scale: model.scaleName(channel$$1)
    };
    [
        'format', 'grid', 'layer', 'offset', 'orient', 'tickSize', 'ticks', 'tickSizeEnd', 'title', 'titleOffset', 'values',
        'tickPadding', 'tickSize', 'tickSizeMajor', 'tickSizeMinor', 'subdivide'
    ].forEach(function (property) {
        var method;
        var value = (method = exports[property]) ?
            method(model, channel$$1, def) :
            axis$$1[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = model.axis(channel$$1).properties || {};
    [
        'axis', 'labels',
        'grid', 'title', 'ticks', 'majorTicks', 'minorTicks'
    ].forEach(function (group) {
        var value = properties[group] ?
            properties[group](model, channel$$1, props[group] || {}, def) :
            props[group];
        if (value !== undefined && util$1.keys(value).length > 0) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.parseAxis = parseAxis;
function format$$1(model, channel$$1) {
    return common.numberFormat(model.fieldDef(channel$$1), model.axis(channel$$1).format, model.config(), channel$$1);
}
exports.format = format$$1;
function offset(model, channel$$1) {
    return model.axis(channel$$1).offset;
}
exports.offset = offset;
function gridShow(model, channel$$1) {
    var grid = model.axis(channel$$1).grid;
    if (grid !== undefined) {
        return grid;
    }
    return !model.isOrdinalScale(channel$$1) && !model.fieldDef(channel$$1).bin;
}
exports.gridShow = gridShow;
function grid(model, channel$$1) {
    if (channel$$1 === channel.ROW || channel$$1 === channel.COLUMN) {
        return undefined;
    }
    return gridShow(model, channel$$1) && ((channel$$1 === channel.Y || channel$$1 === channel.X) && !(model.parent() && model.parent().isFacet()));
}
exports.grid = grid;
function layer(model, channel$$1, def) {
    var layer = model.axis(channel$$1).layer;
    if (layer !== undefined) {
        return layer;
    }
    if (def.grid) {
        return 'back';
    }
    return undefined;
}
exports.layer = layer;
function orient(model, channel$$1) {
    var orient = model.axis(channel$$1).orient;
    if (orient) {
        return orient;
    }
    else if (channel$$1 === channel.COLUMN) {
        return axis.AxisOrient.TOP;
    }
    return undefined;
}
exports.orient = orient;
function ticks(model, channel$$1) {
    var ticks = model.axis(channel$$1).ticks;
    if (ticks !== undefined) {
        return ticks;
    }
    if (channel$$1 === channel.X && !model.fieldDef(channel$$1).bin) {
        return 5;
    }
    return undefined;
}
exports.ticks = ticks;
function tickSize(model, channel$$1) {
    var tickSize = model.axis(channel$$1).tickSize;
    if (tickSize !== undefined) {
        return tickSize;
    }
    return undefined;
}
exports.tickSize = tickSize;
function tickSizeEnd(model, channel$$1) {
    var tickSizeEnd = model.axis(channel$$1).tickSizeEnd;
    if (tickSizeEnd !== undefined) {
        return tickSizeEnd;
    }
    return undefined;
}
exports.tickSizeEnd = tickSizeEnd;
function title(model, channel$$1) {
    var axis$$1 = model.axis(channel$$1);
    if (axis$$1.title !== undefined) {
        return axis$$1.title;
    }
    var fieldTitle = fielddef.title(model.fieldDef(channel$$1), model.config());
    var maxLength;
    if (axis$$1.titleMaxLength) {
        maxLength = axis$$1.titleMaxLength;
    }
    else if (channel$$1 === channel.X && !model.isOrdinalScale(channel.X)) {
        var unitModel = model;
        maxLength = unitModel.width / model.axis(channel.X).characterWidth;
    }
    else if (channel$$1 === channel.Y && !model.isOrdinalScale(channel.Y)) {
        var unitModel = model;
        maxLength = unitModel.height / model.axis(channel.Y).characterWidth;
    }
    return maxLength ? util$1.truncate(fieldTitle, maxLength) : fieldTitle;
}
exports.title = title;
function titleOffset(model, channel$$1) {
    var titleOffset = model.axis(channel$$1).titleOffset;
    if (titleOffset !== undefined) {
        return titleOffset;
    }
    return undefined;
}
exports.titleOffset = titleOffset;
function values(model, channel$$1) {
    var vals = model.axis(channel$$1).values;
    if (vals && datetime.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            return datetime.timestamp(dt, true);
        });
    }
    return vals;
}
exports.values = values;
var properties;
(function (properties) {
    function axis$$1(model, channel$$1, axisPropsSpec) {
        var axis$$1 = model.axis(channel$$1);
        return util$1.extend(axis$$1.axisColor !== undefined ?
            { stroke: { value: axis$$1.axisColor } } :
            {}, axis$$1.axisWidth !== undefined ?
            { strokeWidth: { value: axis$$1.axisWidth } } :
            {}, axisPropsSpec || {});
    }
    properties.axis = axis$$1;
    function grid(model, channel$$1, gridPropsSpec) {
        var axis$$1 = model.axis(channel$$1);
        return util$1.extend(axis$$1.gridColor !== undefined ? { stroke: { value: axis$$1.gridColor } } : {}, axis$$1.gridOpacity !== undefined ? { strokeOpacity: { value: axis$$1.gridOpacity } } : {}, axis$$1.gridWidth !== undefined ? { strokeWidth: { value: axis$$1.gridWidth } } : {}, axis$$1.gridDash !== undefined ? { strokeDashOffset: { value: axis$$1.gridDash } } : {}, gridPropsSpec || {});
    }
    properties.grid = grid;
    function labels(model, channel$$1, labelsSpec, def) {
        var fieldDef = model.fieldDef(channel$$1);
        var axis$$1 = model.axis(channel$$1);
        var config = model.config();
        if (!axis$$1.labels) {
            return util$1.extend({
                text: ''
            }, labelsSpec);
        }
        if (util$1.contains([type$1.NOMINAL, type$1.ORDINAL], fieldDef.type) && axis$$1.labelMaxLength) {
            labelsSpec = util$1.extend({
                text: {
                    template: '{{ datum["data"] | truncate:' + axis$$1.labelMaxLength + ' }}'
                }
            }, labelsSpec || {});
        }
        else if (fieldDef.type === type$1.TEMPORAL) {
            labelsSpec = util$1.extend({
                text: {
                    template: common.timeTemplate('datum["data"]', fieldDef.timeUnit, axis$$1.format, axis$$1.shortTimeLabels, config)
                }
            }, labelsSpec);
        }
        if (axis$$1.labelAngle !== undefined) {
            labelsSpec.angle = { value: axis$$1.labelAngle };
        }
        else {
            if (channel$$1 === channel.X && (util$1.contains([type$1.NOMINAL, type$1.ORDINAL], fieldDef.type) || !!fieldDef.bin || fieldDef.type === type$1.TEMPORAL)) {
                labelsSpec.angle = { value: 270 };
            }
        }
        if (axis$$1.labelAlign !== undefined) {
            labelsSpec.align = { value: axis$$1.labelAlign };
        }
        else {
            if (labelsSpec.angle) {
                if (labelsSpec.angle.value === 270) {
                    labelsSpec.align = {
                        value: def.orient === 'top' ? 'left' :
                            def.type === 'x' ? 'right' :
                                'center'
                    };
                }
                else if (labelsSpec.angle.value === 90) {
                    labelsSpec.align = { value: 'center' };
                }
            }
        }
        if (axis$$1.labelBaseline !== undefined) {
            labelsSpec.baseline = { value: axis$$1.labelBaseline };
        }
        else {
            if (labelsSpec.angle) {
                if (labelsSpec.angle.value === 270) {
                    labelsSpec.baseline = { value: def.type === 'x' ? 'middle' : 'bottom' };
                }
                else if (labelsSpec.angle.value === 90) {
                    labelsSpec.baseline = { value: 'bottom' };
                }
            }
        }
        if (axis$$1.tickLabelColor !== undefined) {
            labelsSpec.fill = { value: axis$$1.tickLabelColor };
        }
        if (axis$$1.tickLabelFont !== undefined) {
            labelsSpec.font = { value: axis$$1.tickLabelFont };
        }
        if (axis$$1.tickLabelFontSize !== undefined) {
            labelsSpec.fontSize = { value: axis$$1.tickLabelFontSize };
        }
        return util$1.keys(labelsSpec).length === 0 ? undefined : labelsSpec;
    }
    properties.labels = labels;
    function ticks(model, channel$$1, ticksPropsSpec) {
        var axis$$1 = model.axis(channel$$1);
        return util$1.extend(axis$$1.tickColor !== undefined ? { stroke: { value: axis$$1.tickColor } } : {}, axis$$1.tickWidth !== undefined ? { strokeWidth: { value: axis$$1.tickWidth } } : {}, ticksPropsSpec || {});
    }
    properties.ticks = ticks;
    function title(model, channel$$1, titlePropsSpec) {
        var axis$$1 = model.axis(channel$$1);
        return util$1.extend(axis$$1.titleColor !== undefined ? { fill: { value: axis$$1.titleColor } } : {}, axis$$1.titleFont !== undefined ? { font: { value: axis$$1.titleFont } } : {}, axis$$1.titleFontSize !== undefined ? { fontSize: { value: axis$$1.titleFontSize } } : {}, axis$$1.titleFontWeight !== undefined ? { fontWeight: { value: axis$$1.titleFontWeight } } : {}, titlePropsSpec || {});
    }
    properties.title = title;
})(properties = exports.properties || (exports.properties = {}));
});
var axis_2$1 = axis$1.parseAxisComponent;
var axis_3$1 = axis$1.parseInnerAxis;
var axis_4 = axis$1.parseAxis;
var axis_5 = axis$1.format;
var axis_6 = axis$1.offset;
var axis_7 = axis$1.gridShow;
var axis_8 = axis$1.grid;
var axis_9 = axis$1.layer;
var axis_10 = axis$1.orient;
var axis_11 = axis$1.ticks;
var axis_12 = axis$1.tickSize;
var axis_13 = axis$1.tickSizeEnd;
var axis_14 = axis$1.title;
var axis_15 = axis$1.titleOffset;
var axis_16 = axis$1.values;
var axis_17 = axis$1.properties;

var nullfilter = createCommonjsModule(function (module, exports) {
var DEFAULT_NULL_FILTERS = {
    nominal: false,
    ordinal: false,
    quantitative: true,
    temporal: true
};
var nullFilter;
(function (nullFilter) {
    function parse(model) {
        var filterInvalid = model.filterInvalid();
        return model.reduce(function (aggregator, fieldDef) {
            if (fieldDef.field !== '*') {
                if (filterInvalid ||
                    (filterInvalid === undefined && fieldDef.field && DEFAULT_NULL_FILTERS[fieldDef.type])) {
                    aggregator[fieldDef.field] = fieldDef;
                }
                else {
                    aggregator[fieldDef.field] = null;
                }
            }
            return aggregator;
        }, {});
    }
    nullFilter.parseUnit = parse;
    function parseFacet(model) {
        var nullFilterComponent = parse(model);
        var childDataComponent = model.child().component.data;
        if (!childDataComponent.source) {
            util$1.extend(nullFilterComponent, childDataComponent.nullFilter);
            delete childDataComponent.nullFilter;
        }
        return nullFilterComponent;
    }
    nullFilter.parseFacet = parseFacet;
    function parseLayer(model) {
        var nullFilterComponent = parse(model);
        model.children().forEach(function (child) {
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && !util$1.differ(childDataComponent.nullFilter, nullFilterComponent)) {
                util$1.extend(nullFilterComponent, childDataComponent.nullFilter);
                delete childDataComponent.nullFilter;
            }
        });
        return nullFilterComponent;
    }
    nullFilter.parseLayer = parseLayer;
    function assemble(component) {
        var filters = util$1.keys(component.nullFilter).reduce(function (_filters, field) {
            var fieldDef = component.nullFilter[field];
            if (fieldDef !== null) {
                _filters.push('datum["' + fieldDef.field + '"] !== null');
                if (util$1.contains([type$1.QUANTITATIVE, type$1.TEMPORAL], fieldDef.type)) {
                    _filters.push('!isNaN(datum["' + fieldDef.field + '"])');
                }
            }
            return _filters;
        }, []);
        return filters.length > 0 ?
            [{
                    type: 'filter',
                    test: filters.join(' && ')
                }] : [];
    }
    nullFilter.assemble = assemble;
})(nullFilter = exports.nullFilter || (exports.nullFilter = {}));
});
var nullfilter_1 = nullfilter.nullFilter;

var timeunit = createCommonjsModule(function (module, exports) {
(function (TimeUnit) {
    TimeUnit[TimeUnit["YEAR"] = 'year'] = "YEAR";
    TimeUnit[TimeUnit["MONTH"] = 'month'] = "MONTH";
    TimeUnit[TimeUnit["DAY"] = 'day'] = "DAY";
    TimeUnit[TimeUnit["DATE"] = 'date'] = "DATE";
    TimeUnit[TimeUnit["HOURS"] = 'hours'] = "HOURS";
    TimeUnit[TimeUnit["MINUTES"] = 'minutes'] = "MINUTES";
    TimeUnit[TimeUnit["SECONDS"] = 'seconds'] = "SECONDS";
    TimeUnit[TimeUnit["MILLISECONDS"] = 'milliseconds'] = "MILLISECONDS";
    TimeUnit[TimeUnit["YEARMONTH"] = 'yearmonth'] = "YEARMONTH";
    TimeUnit[TimeUnit["YEARMONTHDATE"] = 'yearmonthdate'] = "YEARMONTHDATE";
    TimeUnit[TimeUnit["YEARMONTHDATEHOURS"] = 'yearmonthdatehours'] = "YEARMONTHDATEHOURS";
    TimeUnit[TimeUnit["YEARMONTHDATEHOURSMINUTES"] = 'yearmonthdatehoursminutes'] = "YEARMONTHDATEHOURSMINUTES";
    TimeUnit[TimeUnit["YEARMONTHDATEHOURSMINUTESSECONDS"] = 'yearmonthdatehoursminutesseconds'] = "YEARMONTHDATEHOURSMINUTESSECONDS";
    TimeUnit[TimeUnit["MONTHDATE"] = 'monthdate'] = "MONTHDATE";
    TimeUnit[TimeUnit["HOURSMINUTES"] = 'hoursminutes'] = "HOURSMINUTES";
    TimeUnit[TimeUnit["HOURSMINUTESSECONDS"] = 'hoursminutesseconds'] = "HOURSMINUTESSECONDS";
    TimeUnit[TimeUnit["MINUTESSECONDS"] = 'minutesseconds'] = "MINUTESSECONDS";
    TimeUnit[TimeUnit["SECONDSMILLISECONDS"] = 'secondsmilliseconds'] = "SECONDSMILLISECONDS";
    TimeUnit[TimeUnit["QUARTER"] = 'quarter'] = "QUARTER";
    TimeUnit[TimeUnit["YEARQUARTER"] = 'yearquarter'] = "YEARQUARTER";
    TimeUnit[TimeUnit["QUARTERMONTH"] = 'quartermonth'] = "QUARTERMONTH";
    TimeUnit[TimeUnit["YEARQUARTERMONTH"] = 'yearquartermonth'] = "YEARQUARTERMONTH";
})(exports.TimeUnit || (exports.TimeUnit = {}));
var TimeUnit = exports.TimeUnit;
exports.SINGLE_TIMEUNITS = [
    TimeUnit.YEAR,
    TimeUnit.QUARTER,
    TimeUnit.MONTH,
    TimeUnit.DAY,
    TimeUnit.DATE,
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
    TimeUnit.SECONDS,
    TimeUnit.MILLISECONDS,
];
var SINGLE_TIMEUNIT_INDEX = exports.SINGLE_TIMEUNITS.reduce(function (d, timeUnit) {
    d[timeUnit] = true;
    return d;
}, {});
function isSingleTimeUnit(timeUnit) {
    return !!SINGLE_TIMEUNIT_INDEX[timeUnit];
}
exports.isSingleTimeUnit = isSingleTimeUnit;
function convert(unit, date) {
    var result = new Date(0, 0, 1, 0, 0, 0, 0);
    exports.SINGLE_TIMEUNITS.forEach(function (singleUnit) {
        if (containsTimeUnit(unit, singleUnit)) {
            switch (singleUnit) {
                case TimeUnit.DAY:
                    throw new Error('Cannot convert to TimeUnits containing \'day\'');
                case TimeUnit.YEAR:
                    result.setFullYear(date.getFullYear());
                    break;
                case TimeUnit.QUARTER:
                    result.setMonth((Math.floor(date.getMonth() / 3)) * 3);
                    break;
                case TimeUnit.MONTH:
                    result.setMonth(date.getMonth());
                    break;
                case TimeUnit.DATE:
                    result.setDate(date.getDate());
                    break;
                case TimeUnit.HOURS:
                    result.setHours(date.getHours());
                    break;
                case TimeUnit.MINUTES:
                    result.setMinutes(date.getMinutes());
                    break;
                case TimeUnit.SECONDS:
                    result.setSeconds(date.getSeconds());
                    break;
                case TimeUnit.MILLISECONDS:
                    result.setMilliseconds(date.getMilliseconds());
                    break;
            }
        }
    });
    return result;
}
exports.convert = convert;
exports.MULTI_TIMEUNITS = [
    TimeUnit.YEARQUARTER,
    TimeUnit.YEARQUARTERMONTH,
    TimeUnit.YEARMONTH,
    TimeUnit.YEARMONTHDATE,
    TimeUnit.YEARMONTHDATEHOURS,
    TimeUnit.YEARMONTHDATEHOURSMINUTES,
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
    TimeUnit.QUARTERMONTH,
    TimeUnit.HOURSMINUTES,
    TimeUnit.HOURSMINUTESSECONDS,
    TimeUnit.MINUTESSECONDS,
    TimeUnit.SECONDSMILLISECONDS,
];
var MULTI_TIMEUNIT_INDEX = exports.MULTI_TIMEUNITS.reduce(function (d, timeUnit) {
    d[timeUnit] = true;
    return d;
}, {});
function isMultiTimeUnit(timeUnit) {
    return !!MULTI_TIMEUNIT_INDEX[timeUnit];
}
exports.isMultiTimeUnit = isMultiTimeUnit;
exports.TIMEUNITS = exports.SINGLE_TIMEUNITS.concat(exports.MULTI_TIMEUNITS);
function containsTimeUnit(fullTimeUnit, timeUnit) {
    var fullTimeUnitStr = fullTimeUnit.toString();
    var timeUnitStr = timeUnit.toString();
    var index = fullTimeUnitStr.indexOf(timeUnitStr);
    return index > -1 &&
        (timeUnit !== TimeUnit.SECONDS ||
            index === 0 ||
            fullTimeUnitStr.charAt(index - 1) !== 'i');
}
exports.containsTimeUnit = containsTimeUnit;
function defaultScaleType(timeUnit) {
    switch (timeUnit) {
        case TimeUnit.HOURS:
        case TimeUnit.DAY:
        case TimeUnit.MONTH:
        case TimeUnit.QUARTER:
            return scale$4.ScaleType.ORDINAL;
    }
    return scale$4.ScaleType.TIME;
}
exports.defaultScaleType = defaultScaleType;
function fieldExpr(fullTimeUnit, field) {
    var fieldRef = 'datum["' + field + '"]';
    function func(timeUnit) {
        if (timeUnit === TimeUnit.QUARTER) {
            return 'floor(month(' + fieldRef + ')' + '/3)';
        }
        else {
            return timeUnit + '(' + fieldRef + ')';
        }
    }
    var d = exports.SINGLE_TIMEUNITS.reduce(function (_d, tu) {
        if (containsTimeUnit(fullTimeUnit, tu)) {
            _d[tu] = func(tu);
        }
        return _d;
    }, {});
    if (d.day && util$1.keys(d).length > 1) {
        console.warn('Time unit "' + fullTimeUnit + '" is not supported. We are replacing it with ', (fullTimeUnit + '').replace('day', 'date') + '.');
        delete d.day;
        d.date = func(TimeUnit.DATE);
    }
    return datetime.dateTimeExpr(d);
}
exports.fieldExpr = fieldExpr;
function imputedDomain(timeUnit, channel$$1) {
    if (util$1.contains([channel.ROW, channel.COLUMN, channel.SHAPE, channel.COLOR], channel$$1)) {
        return null;
    }
    switch (timeUnit) {
        case TimeUnit.SECONDS:
            return util$1.range(0, 60);
        case TimeUnit.MINUTES:
            return util$1.range(0, 60);
        case TimeUnit.HOURS:
            return util$1.range(0, 24);
        case TimeUnit.DAY:
            return util$1.range(0, 7);
        case TimeUnit.DATE:
            return util$1.range(1, 32);
        case TimeUnit.MONTH:
            return util$1.range(0, 12);
        case TimeUnit.QUARTER:
            return [0, 1, 2, 3];
    }
    return null;
}
exports.imputedDomain = imputedDomain;
function smallestUnit(timeUnit) {
    if (!timeUnit) {
        return undefined;
    }
    if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
        return 'second';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
        return 'minute';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
        return 'hour';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.DAY) ||
        containsTimeUnit(timeUnit, TimeUnit.DATE)) {
        return 'day';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
        return 'month';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
        return 'year';
    }
    return undefined;
}
exports.smallestUnit = smallestUnit;
function template(timeUnit, field, shortTimeLabels) {
    if (!timeUnit) {
        return undefined;
    }
    var dateComponents = [];
    var template = '';
    var hasYear = containsTimeUnit(timeUnit, TimeUnit.YEAR);
    if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
        template = 'Q{{' + field + ' | quarter}}';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
        dateComponents.push(shortTimeLabels !== false ? '%b' : '%B');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
        dateComponents.push(shortTimeLabels ? '%a' : '%A');
    }
    else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
        dateComponents.push('%d' + (hasYear ? ',' : ''));
    }
    if (hasYear) {
        dateComponents.push(shortTimeLabels ? '%y' : '%Y');
    }
    var timeComponents = [];
    if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
        timeComponents.push('%H');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
        timeComponents.push('%M');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
        timeComponents.push('%S');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MILLISECONDS)) {
        timeComponents.push('%L');
    }
    var dateTimeComponents = [];
    if (dateComponents.length > 0) {
        dateTimeComponents.push(dateComponents.join(' '));
    }
    if (timeComponents.length > 0) {
        dateTimeComponents.push(timeComponents.join(':'));
    }
    if (dateTimeComponents.length > 0) {
        if (template) {
            template += ' ';
        }
        template += '{{' + field + ' | time:\'' + dateTimeComponents.join(' ') + '\'}}';
    }
    return template || undefined;
}
exports.template = template;
});
var timeunit_1 = timeunit.TimeUnit;
var timeunit_2 = timeunit.SINGLE_TIMEUNITS;
var timeunit_3 = timeunit.isSingleTimeUnit;
var timeunit_4 = timeunit.convert;
var timeunit_5 = timeunit.MULTI_TIMEUNITS;
var timeunit_6 = timeunit.isMultiTimeUnit;
var timeunit_7 = timeunit.TIMEUNITS;
var timeunit_8 = timeunit.containsTimeUnit;
var timeunit_9 = timeunit.defaultScaleType;
var timeunit_10 = timeunit.fieldExpr;
var timeunit_11 = timeunit.imputedDomain;
var timeunit_12 = timeunit.smallestUnit;
var timeunit_13 = timeunit.template;

function isEqualFilter(filter) {
    return filter && !!filter.field && filter.equal !== undefined;
}
var isEqualFilter_1 = isEqualFilter;
function isRangeFilter(filter) {
    if (filter && !!filter.field) {
        if (util$1.isArray(filter.range) && filter.range.length === 2) {
            return true;
        }
    }
    return false;
}
var isRangeFilter_1 = isRangeFilter;
function isOneOfFilter(filter) {
    return filter && !!filter.field && (util$1.isArray(filter.oneOf) ||
        util$1.isArray(filter.in));
}
var isOneOfFilter_1 = isOneOfFilter;
function expression$3(filter) {
    if (util$1.isString(filter)) {
        return filter;
    }
    else {
        var fieldExpr = filter.timeUnit ?
            ('time(' + timeunit.fieldExpr(filter.timeUnit, filter.field) + ')') :
            fielddef.field(filter, { datum: true });
        if (isEqualFilter(filter)) {
            return fieldExpr + '===' + valueExpr(filter.equal, filter.timeUnit);
        }
        else if (isOneOfFilter(filter)) {
            var oneOf = filter.oneOf || filter['in'];
            return 'indexof([' +
                oneOf.map(function (v) { return valueExpr(v, filter.timeUnit); }).join(',') +
                '], ' + fieldExpr + ') !== -1';
        }
        else if (isRangeFilter(filter)) {
            var lower = filter.range[0];
            var upper = filter.range[1];
            if (lower !== null && upper !== null) {
                return 'inrange(' + fieldExpr + ', ' +
                    valueExpr(lower, filter.timeUnit) + ', ' +
                    valueExpr(upper, filter.timeUnit) + ')';
            }
            else if (lower !== null) {
                return fieldExpr + ' >= ' + lower;
            }
            else if (upper !== null) {
                return fieldExpr + ' <= ' + upper;
            }
        }
    }
    return undefined;
}
var expression_1 = expression$3;
function valueExpr(v, timeUnit) {
    if (datetime.isDateTime(v)) {
        var expr = datetime.dateTimeExpr(v, true);
        return 'time(' + expr + ')';
    }
    if (timeunit.isSingleTimeUnit(timeUnit)) {
        var datetime$$1 = {};
        datetime$$1[timeUnit] = v;
        var expr = datetime.dateTimeExpr(datetime$$1, true);
        return 'time(' + expr + ')';
    }
    return JSON.stringify(v);
}
var filter$2 = {
	isEqualFilter: isEqualFilter_1,
	isRangeFilter: isRangeFilter_1,
	isOneOfFilter: isOneOfFilter_1,
	expression: expression_1
};

var filter_2 = createCommonjsModule(function (module, exports) {
var filter;
(function (filter_2) {
    function parse(model) {
        var filter = model.filter();
        if (util$1.isArray(filter)) {
            return '(' +
                filter.map(function (f) { return filter$2.expression(f); })
                    .filter(function (f) { return f !== undefined; })
                    .join(') && (') +
                ')';
        }
        else if (filter) {
            return filter$2.expression(filter);
        }
        return undefined;
    }
    filter_2.parse = parse;
    filter_2.parseUnit = parse;
    function parseFacet(model) {
        var filterComponent = parse(model);
        var childDataComponent = model.child().component.data;
        if (!childDataComponent.source && childDataComponent.filter) {
            filterComponent =
                (filterComponent ? filterComponent + ' && ' : '') +
                    childDataComponent.filter;
            delete childDataComponent.filter;
        }
        return filterComponent;
    }
    filter_2.parseFacet = parseFacet;
    function parseLayer(model) {
        var filterComponent = parse(model);
        model.children().forEach(function (child) {
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && childDataComponent.filter && childDataComponent.filter === filterComponent) {
                delete childDataComponent.filter;
            }
        });
        return filterComponent;
    }
    filter_2.parseLayer = parseLayer;
    function assemble(component) {
        var filter = component.filter;
        return filter ? [{
                type: 'filter',
                test: filter
            }] : [];
    }
    filter_2.assemble = assemble;
})(filter = exports.filter || (exports.filter = {}));
});
var filter_3 = filter_2.filter;

var bin_2 = createCommonjsModule(function (module, exports) {
var bin;
(function (bin_2) {
    function numberFormatExpr(format$$1, expr) {
        return "format('" + format$$1 + "', " + expr + ")";
    }
    function parse(model) {
        return model.reduce(function (binComponent, fieldDef, channel$$1) {
            var bin = model.fieldDef(channel$$1).bin;
            if (bin) {
                var binTrans = util$1.extend({
                    type: 'bin',
                    field: fieldDef.field,
                    output: {
                        start: fielddef.field(fieldDef, { binSuffix: 'start' }),
                        mid: fielddef.field(fieldDef, { binSuffix: 'mid' }),
                        end: fielddef.field(fieldDef, { binSuffix: 'end' })
                    }
                }, typeof bin === 'boolean' ? {} : bin);
                if (!binTrans.maxbins && !binTrans.step) {
                    binTrans.maxbins = bin$3.autoMaxBins(channel$$1);
                }
                var transform = [binTrans];
                var isOrdinalColor = model.isOrdinalScale(channel$$1) || channel$$1 === channel.COLOR;
                if (isOrdinalColor) {
                    var format$$1 = (model.axis(channel$$1) || model.legend(channel$$1) || {}).format ||
                        model.config().numberFormat;
                    var startField = fielddef.field(fieldDef, { datum: true, binSuffix: 'start' });
                    var endField = fielddef.field(fieldDef, { datum: true, binSuffix: 'end' });
                    transform.push({
                        type: 'formula',
                        field: fielddef.field(fieldDef, { binSuffix: 'range' }),
                        expr: numberFormatExpr(format$$1, startField) +
                            ' + \'-\' + ' +
                            numberFormatExpr(format$$1, endField)
                    });
                }
                var key = util$1.hash(bin) + '_' + fieldDef.field + 'oc:' + isOrdinalColor;
                binComponent[key] = transform;
            }
            return binComponent;
        }, {});
    }
    bin_2.parseUnit = parse;
    function parseFacet(model) {
        var binComponent = parse(model);
        var childDataComponent = model.child().component.data;
        if (!childDataComponent.source) {
            util$1.extend(binComponent, childDataComponent.bin);
            delete childDataComponent.bin;
        }
        return binComponent;
    }
    bin_2.parseFacet = parseFacet;
    function parseLayer(model) {
        var binComponent = parse(model);
        model.children().forEach(function (child) {
            var childDataComponent = child.component.data;
            if (!childDataComponent.source) {
                util$1.extend(binComponent, childDataComponent.bin);
                delete childDataComponent.bin;
            }
        });
        return binComponent;
    }
    bin_2.parseLayer = parseLayer;
    function assemble(component) {
        return util$1.flatten(util$1.vals(component.bin));
    }
    bin_2.assemble = assemble;
})(bin = exports.bin || (exports.bin = {}));
});
var bin_3 = bin_2.bin;

var formula_1 = createCommonjsModule(function (module, exports) {
var formula;
(function (formula_1) {
    function parse(model) {
        return (model.calculate() || []).reduce(function (formulaComponent, formula) {
            formulaComponent[util$1.hash(formula)] = formula;
            return formulaComponent;
        }, {});
    }
    formula_1.parseUnit = parse;
    function parseFacet(model) {
        var formulaComponent = parse(model);
        var childDataComponent = model.child().component.data;
        if (!childDataComponent.source) {
            util$1.extend(formulaComponent, childDataComponent.calculate);
            delete childDataComponent.calculate;
        }
        return formulaComponent;
    }
    formula_1.parseFacet = parseFacet;
    function parseLayer(model) {
        var formulaComponent = parse(model);
        model.children().forEach(function (child) {
            var childDataComponent = child.component.data;
            if (!childDataComponent.source && childDataComponent.calculate) {
                util$1.extend(formulaComponent || {}, childDataComponent.calculate);
                delete childDataComponent.calculate;
            }
        });
        return formulaComponent;
    }
    formula_1.parseLayer = parseLayer;
    function assemble(component) {
        return util$1.vals(component.calculate).reduce(function (transform, formula) {
            transform.push(util$1.extend({ type: 'formula' }, formula));
            return transform;
        }, []);
    }
    formula_1.assemble = assemble;
})(formula = exports.formula || (exports.formula = {}));
});
var formula_2 = formula_1.formula;

var timeunit$1 = createCommonjsModule(function (module, exports) {
var timeUnit;
(function (timeUnit) {
    function parse(model) {
        return model.reduce(function (timeUnitComponent, fieldDef, channel) {
            if (fieldDef.type === type$1.TEMPORAL && fieldDef.timeUnit) {
                var hash = fielddef.field(fieldDef);
                timeUnitComponent[hash] = {
                    type: 'formula',
                    field: fielddef.field(fieldDef),
                    expr: timeunit.fieldExpr(fieldDef.timeUnit, fieldDef.field)
                };
            }
            return timeUnitComponent;
        }, {});
    }
    timeUnit.parseUnit = parse;
    function parseFacet(model) {
        var timeUnitComponent = parse(model);
        var childDataComponent = model.child().component.data;
        if (!childDataComponent.source) {
            util$1.extend(timeUnitComponent, childDataComponent.timeUnit);
            delete childDataComponent.timeUnit;
        }
        return timeUnitComponent;
    }
    timeUnit.parseFacet = parseFacet;
    function parseLayer(model) {
        var timeUnitComponent = parse(model);
        model.children().forEach(function (child) {
            var childDataComponent = child.component.data;
            if (!childDataComponent.source) {
                util$1.extend(timeUnitComponent, childDataComponent.timeUnit);
                delete childDataComponent.timeUnit;
            }
        });
        return timeUnitComponent;
    }
    timeUnit.parseLayer = parseLayer;
    function assemble(component) {
        return util$1.vals(component.timeUnit);
    }
    timeUnit.assemble = assemble;
})(timeUnit = exports.timeUnit || (exports.timeUnit = {}));
});
var timeunit_2$1 = timeunit$1.timeUnit;

var source_1 = createCommonjsModule(function (module, exports) {
var source;
(function (source) {
    function parse(model) {
        var data = model.data();
        if (data) {
            var sourceData = { name: model.dataName(data$2.SOURCE) };
            if (data.values && data.values.length > 0) {
                sourceData.values = data.values;
                sourceData.format = { type: 'json' };
            }
            else if (data.url) {
                sourceData.url = data.url;
                var defaultExtension = /(?:\.([^.]+))?$/.exec(sourceData.url)[1];
                if (!util$1.contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
                    defaultExtension = 'json';
                }
                var dataFormat = data.format || {};
                var formatType = dataFormat.type || data['formatType'];
                sourceData.format =
                    util$1.extend({ type: formatType ? formatType : defaultExtension }, dataFormat.property ? { property: dataFormat.property } : {}, dataFormat.feature ?
                        { feature: dataFormat.feature } :
                        dataFormat.mesh ?
                            { mesh: dataFormat.mesh } :
                            {});
            }
            return sourceData;
        }
        else if (!model.parent()) {
            return { name: model.dataName(data$2.SOURCE) };
        }
        return undefined;
    }
    source.parseUnit = parse;
    function parseFacet(model) {
        var sourceData = parse(model);
        if (!model.child().component.data.source) {
            model.child().renameData(model.child().dataName(data$2.SOURCE), model.dataName(data$2.SOURCE));
        }
        return sourceData;
    }
    source.parseFacet = parseFacet;
    function parseLayer(model) {
        var sourceData = parse(model);
        model.children().forEach(function (child) {
            var childData = child.component.data;
            if (model.compatibleSource(child)) {
                var canMerge = !childData.filter && !childData.formatParse && !childData.nullFilter;
                if (canMerge) {
                    child.renameData(child.dataName(data$2.SOURCE), model.dataName(data$2.SOURCE));
                    delete childData.source;
                }
                else {
                    childData.source = {
                        name: child.dataName(data$2.SOURCE),
                        source: model.dataName(data$2.SOURCE)
                    };
                }
            }
        });
        return sourceData;
    }
    source.parseLayer = parseLayer;
    function assemble(model, component) {
        if (component.source) {
            var sourceData = component.source;
            if (component.formatParse) {
                component.source.format = component.source.format || {};
                component.source.format.parse = component.formatParse;
            }
            sourceData.transform = [].concat(formula_1.formula.assemble(component), nullfilter.nullFilter.assemble(component), filter_2.filter.assemble(component), bin_2.bin.assemble(component), timeunit$1.timeUnit.assemble(component));
            return sourceData;
        }
        return null;
    }
    source.assemble = assemble;
})(source = exports.source || (exports.source = {}));
});
var source_2 = source_1.source;

var formatparse = createCommonjsModule(function (module, exports) {
var formatParse;
(function (formatParse) {
    function parse(model) {
        var calcFieldMap = (model.calculate() || []).reduce(function (fieldMap, formula) {
            fieldMap[formula.field] = true;
            return fieldMap;
        }, {});
        var parseComponent = {};
        var filter = model.filter();
        if (!util$1.isArray(filter)) {
            filter = [filter];
        }
        filter.forEach(function (f) {
            var val = null;
            if (filter$2.isEqualFilter(f)) {
                val = f.equal;
            }
            else if (filter$2.isRangeFilter(f)) {
                val = f.range[0];
            }
            else if (filter$2.isOneOfFilter(f)) {
                val = (f.oneOf || f['in'])[0];
            }
            if (!!val) {
                if (datetime.isDateTime(val)) {
                    parseComponent[f['field']] = 'date';
                }
                else if (util$1.isNumber(val)) {
                    parseComponent[f['field']] = 'number';
                }
                else if (util$1.isString(val)) {
                    parseComponent[f['field']] = 'string';
                }
            }
        });
        model.forEach(function (fieldDef) {
            if (fieldDef.type === type$1.TEMPORAL) {
                parseComponent[fieldDef.field] = 'date';
            }
            else if (fieldDef.type === type$1.QUANTITATIVE) {
                if (fielddef.isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
                    return;
                }
                parseComponent[fieldDef.field] = 'number';
            }
        });
        var data = model.data();
        if (data && data.format && data.format.parse) {
            var parse_1 = data.format.parse;
            util$1.keys(parse_1).forEach(function (field) {
                parseComponent[field] = parse_1[field];
            });
        }
        return parseComponent;
    }
    formatParse.parseUnit = parse;
    function parseFacet(model) {
        var parseComponent = parse(model);
        var childDataComponent = model.child().component.data;
        if (!childDataComponent.source && childDataComponent.formatParse) {
            util$1.extend(parseComponent, childDataComponent.formatParse);
            delete childDataComponent.formatParse;
        }
        return parseComponent;
    }
    formatParse.parseFacet = parseFacet;
    function parseLayer(model) {
        var parseComponent = parse(model);
        model.children().forEach(function (child) {
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && !util$1.differ(childDataComponent.formatParse, parseComponent)) {
                util$1.extend(parseComponent, childDataComponent.formatParse);
                delete childDataComponent.formatParse;
            }
        });
        return parseComponent;
    }
    formatParse.parseLayer = parseLayer;
})(formatParse = exports.formatParse || (exports.formatParse = {}));
});
var formatparse_1 = formatparse.formatParse;

var nonpositivenullfilter = createCommonjsModule(function (module, exports) {
var nonPositiveFilter;
(function (nonPositiveFilter_1) {
    function parseUnit(model) {
        return model.channels().reduce(function (nonPositiveComponent, channel) {
            var scale = model.scale(channel);
            if (!model.field(channel) || !scale) {
                return nonPositiveComponent;
            }
            nonPositiveComponent[model.field(channel)] = scale.type === scale$4.ScaleType.LOG;
            return nonPositiveComponent;
        }, {});
    }
    nonPositiveFilter_1.parseUnit = parseUnit;
    function parseFacet(model) {
        var childDataComponent = model.child().component.data;
        if (!childDataComponent.source) {
            var nonPositiveFilterComponent = childDataComponent.nonPositiveFilter;
            delete childDataComponent.nonPositiveFilter;
            return nonPositiveFilterComponent;
        }
        return {};
    }
    nonPositiveFilter_1.parseFacet = parseFacet;
    function parseLayer(model) {
        var nonPositiveFilter = {};
        model.children().forEach(function (child) {
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && !util$1.differ(childDataComponent.nonPositiveFilter, nonPositiveFilter)) {
                util$1.extend(nonPositiveFilter, childDataComponent.nonPositiveFilter);
                delete childDataComponent.nonPositiveFilter;
            }
        });
        return nonPositiveFilter;
    }
    nonPositiveFilter_1.parseLayer = parseLayer;
    function assemble(component) {
        return util$1.keys(component.nonPositiveFilter).filter(function (field) {
            return component.nonPositiveFilter[field];
        }).map(function (field) {
            return {
                type: 'filter',
                test: 'datum["' + field + '"] > 0'
            };
        });
    }
    nonPositiveFilter_1.assemble = assemble;
})(nonPositiveFilter = exports.nonPositiveFilter || (exports.nonPositiveFilter = {}));
});
var nonpositivenullfilter_1 = nonpositivenullfilter.nonPositiveFilter;

var summary_1 = createCommonjsModule(function (module, exports) {
var summary;
(function (summary) {
    function addDimension(dims, fieldDef) {
        if (fieldDef.bin) {
            dims[fielddef.field(fieldDef, { binSuffix: 'start' })] = true;
            dims[fielddef.field(fieldDef, { binSuffix: 'mid' })] = true;
            dims[fielddef.field(fieldDef, { binSuffix: 'end' })] = true;
            dims[fielddef.field(fieldDef, { binSuffix: 'range' })] = true;
        }
        else {
            dims[fielddef.field(fieldDef)] = true;
        }
        return dims;
    }
    function parseUnit(model) {
        var dims = {};
        var meas = {};
        model.forEach(function (fieldDef, channel) {
            if (fieldDef.aggregate) {
                if (fieldDef.aggregate === aggregate.AggregateOp.COUNT) {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = true;
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = true;
                }
            }
            else {
                addDimension(dims, fieldDef);
            }
        });
        return [{
                name: model.dataName(data$2.SUMMARY),
                dimensions: dims,
                measures: meas
            }];
    }
    summary.parseUnit = parseUnit;
    function parseFacet(model) {
        var childDataComponent = model.child().component.data;
        if (!childDataComponent.source && childDataComponent.summary) {
            var summaryComponents = childDataComponent.summary.map(function (summaryComponent) {
                summaryComponent.dimensions = model.reduce(addDimension, summaryComponent.dimensions);
                var summaryNameWithoutPrefix = summaryComponent.name.substr(model.child().name('').length);
                model.child().renameData(summaryComponent.name, summaryNameWithoutPrefix);
                summaryComponent.name = summaryNameWithoutPrefix;
                return summaryComponent;
            });
            delete childDataComponent.summary;
            return summaryComponents;
        }
        return [];
    }
    summary.parseFacet = parseFacet;
    function mergeMeasures(parentMeasures, childMeasures) {
        for (var field_1 in childMeasures) {
            if (childMeasures.hasOwnProperty(field_1)) {
                var ops = childMeasures[field_1];
                for (var op in ops) {
                    if (ops.hasOwnProperty(op)) {
                        if (field_1 in parentMeasures) {
                            parentMeasures[field_1][op] = true;
                        }
                        else {
                            parentMeasures[field_1] = { op: true };
                        }
                    }
                }
            }
        }
    }
    function parseLayer(model) {
        var summaries = {};
        model.children().forEach(function (child) {
            var childDataComponent = child.component.data;
            if (!childDataComponent.source && childDataComponent.summary) {
                childDataComponent.summary.forEach(function (childSummary) {
                    var key = util$1.hash(childSummary.dimensions);
                    if (key in summaries) {
                        mergeMeasures(summaries[key].measures, childSummary.measures);
                    }
                    else {
                        childSummary.name = model.dataName(data$2.SUMMARY) + '_' + util$1.keys(summaries).length;
                        summaries[key] = childSummary;
                    }
                    child.renameData(child.dataName(data$2.SUMMARY), summaries[key].name);
                    delete childDataComponent.summary;
                });
            }
        });
        return util$1.vals(summaries);
    }
    summary.parseLayer = parseLayer;
    function assemble(component, model) {
        if (!component.summary) {
            return [];
        }
        return component.summary.reduce(function (summaryData, summaryComponent) {
            var dims = summaryComponent.dimensions;
            var meas = summaryComponent.measures;
            var groupby = util$1.keys(dims);
            var summarize = util$1.reduce(meas, function (aggregator, fnDictSet, field) {
                aggregator[field] = util$1.keys(fnDictSet);
                return aggregator;
            }, {});
            if (util$1.keys(meas).length > 0) {
                summaryData.push({
                    name: summaryComponent.name,
                    source: model.dataName(data$2.SOURCE),
                    transform: [{
                            type: 'aggregate',
                            groupby: groupby,
                            summarize: summarize
                        }]
                });
            }
            return summaryData;
        }, []);
    }
    summary.assemble = assemble;
})(summary = exports.summary || (exports.summary = {}));
});
var summary_2 = summary_1.summary;

var stackscale = createCommonjsModule(function (module, exports) {
var stackScale;
(function (stackScale) {
    function parseUnit(model) {
        var stackProps = model.stack();
        if (stackProps) {
            var groupbyChannel = stackProps.groupbyChannel;
            var fieldChannel = stackProps.fieldChannel;
            var fields = [];
            var field_1 = model.field(groupbyChannel);
            if (field_1) {
                fields.push(field_1);
            }
            return {
                name: model.dataName(data$2.STACKED_SCALE),
                source: model.dataName(data$2.SUMMARY),
                transform: [util$1.extend({
                        type: 'aggregate',
                        summarize: [{ ops: ['sum'], field: model.field(fieldChannel) }]
                    }, fields.length > 0 ? {
                        groupby: fields
                    } : {})]
            };
        }
        return null;
    }
    stackScale.parseUnit = parseUnit;
    function parseFacet(model) {
        var child = model.child();
        var childDataComponent = child.component.data;
        if (!childDataComponent.source && childDataComponent.stackScale) {
            var stackComponent = childDataComponent.stackScale;
            var newName = model.dataName(data$2.STACKED_SCALE);
            child.renameData(stackComponent.name, newName);
            stackComponent.name = newName;
            stackComponent.source = model.dataName(data$2.SUMMARY);
            stackComponent.transform[0].groupby = model.reduce(function (groupby, fieldDef) {
                groupby.push(fielddef.field(fieldDef));
                return groupby;
            }, stackComponent.transform[0].groupby);
            delete childDataComponent.stackScale;
            return stackComponent;
        }
        return null;
    }
    stackScale.parseFacet = parseFacet;
    function parseLayer(model) {
        return null;
    }
    stackScale.parseLayer = parseLayer;
    function assemble(component) {
        return component.stackScale;
    }
    stackScale.assemble = assemble;
})(stackScale = exports.stackScale || (exports.stackScale = {}));
});
var stackscale_1 = stackscale.stackScale;

var timeunitdomain = createCommonjsModule(function (module, exports) {
var timeUnitDomain;
(function (timeUnitDomain) {
    function parse(model) {
        return model.reduce(function (timeUnitDomainMap, fieldDef, channel) {
            if (fieldDef.timeUnit) {
                var domain = timeunit.imputedDomain(fieldDef.timeUnit, channel);
                if (domain) {
                    timeUnitDomainMap[fieldDef.timeUnit] = true;
                }
            }
            return timeUnitDomainMap;
        }, {});
    }
    timeUnitDomain.parseUnit = parse;
    function parseFacet(model) {
        return util$1.extend(parse(model), model.child().component.data.timeUnitDomain);
    }
    timeUnitDomain.parseFacet = parseFacet;
    function parseLayer(model) {
        return util$1.extend(parse(model), model.children().forEach(function (child) {
            return child.component.data.timeUnitDomain;
        }));
    }
    timeUnitDomain.parseLayer = parseLayer;
    function assemble(component) {
        return util$1.keys(component.timeUnitDomain).reduce(function (timeUnitData, tu) {
            var timeUnit = tu;
            var domain = timeunit.imputedDomain(timeUnit, null);
            if (domain) {
                var datetime$$1 = {};
                datetime$$1[timeUnit] = 'datum["data"]';
                timeUnitData.push({
                    name: timeUnit,
                    values: domain,
                    transform: [{
                            type: 'formula',
                            field: 'date',
                            expr: datetime.dateTimeExpr(datetime$$1)
                        }]
                });
            }
            return timeUnitData;
        }, []);
    }
    timeUnitDomain.assemble = assemble;
})(timeUnitDomain = exports.timeUnitDomain || (exports.timeUnitDomain = {}));
});
var timeunitdomain_1 = timeunitdomain.timeUnitDomain;

var colorrank = createCommonjsModule(function (module, exports) {
var colorRank;
(function (colorRank) {
    function parseUnit(model) {
        var colorRankComponent = {};
        if (model.has(channel.COLOR) && model.encoding().color.type === type$1.ORDINAL) {
            colorRankComponent[model.field(channel.COLOR)] = [{
                    type: 'sort',
                    by: model.field(channel.COLOR)
                }, {
                    type: 'rank',
                    field: model.field(channel.COLOR),
                    output: {
                        rank: model.field(channel.COLOR, { prefix: 'rank' })
                    }
                }];
        }
        return colorRankComponent;
    }
    colorRank.parseUnit = parseUnit;
    function parseFacet(model) {
        var childDataComponent = model.child().component.data;
        if (!childDataComponent.source) {
            var colorRankComponent = childDataComponent.colorRank;
            delete childDataComponent.colorRank;
            return colorRankComponent;
        }
        return {};
    }
    colorRank.parseFacet = parseFacet;
    function parseLayer(model) {
        var colorRankComponent = {};
        model.children().forEach(function (child) {
            var childDataComponent = child.component.data;
            if (!childDataComponent.source) {
                util$1.extend(colorRankComponent, childDataComponent.colorRank);
                delete childDataComponent.colorRank;
            }
        });
        return colorRankComponent;
    }
    colorRank.parseLayer = parseLayer;
    function assemble(component) {
        return util$1.flatten(util$1.vals(component.colorRank));
    }
    colorRank.assemble = assemble;
})(colorRank = exports.colorRank || (exports.colorRank = {}));
});
var colorrank_1 = colorrank.colorRank;

function parseUnitData(model) {
    return {
        formatParse: formatparse.formatParse.parseUnit(model),
        nullFilter: nullfilter.nullFilter.parseUnit(model),
        filter: filter_2.filter.parseUnit(model),
        nonPositiveFilter: nonpositivenullfilter.nonPositiveFilter.parseUnit(model),
        source: source_1.source.parseUnit(model),
        bin: bin_2.bin.parseUnit(model),
        calculate: formula_1.formula.parseUnit(model),
        timeUnit: timeunit$1.timeUnit.parseUnit(model),
        timeUnitDomain: timeunitdomain.timeUnitDomain.parseUnit(model),
        summary: summary_1.summary.parseUnit(model),
        stackScale: stackscale.stackScale.parseUnit(model),
        colorRank: colorrank.colorRank.parseUnit(model)
    };
}
var parseUnitData_1 = parseUnitData;
function parseFacetData(model) {
    return {
        formatParse: formatparse.formatParse.parseFacet(model),
        nullFilter: nullfilter.nullFilter.parseFacet(model),
        filter: filter_2.filter.parseFacet(model),
        nonPositiveFilter: nonpositivenullfilter.nonPositiveFilter.parseFacet(model),
        source: source_1.source.parseFacet(model),
        bin: bin_2.bin.parseFacet(model),
        calculate: formula_1.formula.parseFacet(model),
        timeUnit: timeunit$1.timeUnit.parseFacet(model),
        timeUnitDomain: timeunitdomain.timeUnitDomain.parseFacet(model),
        summary: summary_1.summary.parseFacet(model),
        stackScale: stackscale.stackScale.parseFacet(model),
        colorRank: colorrank.colorRank.parseFacet(model)
    };
}
var parseFacetData_1 = parseFacetData;
function parseLayerData(model) {
    return {
        filter: filter_2.filter.parseLayer(model),
        formatParse: formatparse.formatParse.parseLayer(model),
        nullFilter: nullfilter.nullFilter.parseLayer(model),
        nonPositiveFilter: nonpositivenullfilter.nonPositiveFilter.parseLayer(model),
        source: source_1.source.parseLayer(model),
        bin: bin_2.bin.parseLayer(model),
        calculate: formula_1.formula.parseLayer(model),
        timeUnit: timeunit$1.timeUnit.parseLayer(model),
        timeUnitDomain: timeunitdomain.timeUnitDomain.parseLayer(model),
        summary: summary_1.summary.parseLayer(model),
        stackScale: stackscale.stackScale.parseLayer(model),
        colorRank: colorrank.colorRank.parseLayer(model)
    };
}
var parseLayerData_1 = parseLayerData;
function assembleData(model, data) {
    var component = model.component.data;
    var sourceData = source_1.source.assemble(model, component);
    if (sourceData) {
        data.push(sourceData);
    }
    summary_1.summary.assemble(component, model).forEach(function (summaryData) {
        data.push(summaryData);
    });
    if (data.length > 0) {
        var dataTable = data[data.length - 1];
        var colorRankTransform = colorrank.colorRank.assemble(component);
        if (colorRankTransform.length > 0) {
            dataTable.transform = (dataTable.transform || []).concat(colorRankTransform);
        }
        var nonPositiveFilterTransform = nonpositivenullfilter.nonPositiveFilter.assemble(component);
        if (nonPositiveFilterTransform.length > 0) {
            dataTable.transform = (dataTable.transform || []).concat(nonPositiveFilterTransform);
        }
    }
    else {
        if (util$1.keys(component.colorRank).length > 0) {
            throw new Error('Invalid colorRank not merged');
        }
        else if (util$1.keys(component.nonPositiveFilter).length > 0) {
            throw new Error('Invalid nonPositiveFilter not merged');
        }
    }
    var stackData = stackscale.stackScale.assemble(component);
    if (stackData) {
        data.push(stackData);
    }
    timeunitdomain.timeUnitDomain.assemble(component).forEach(function (timeUnitDomainData) {
        data.push(timeUnitDomainData);
    });
    return data;
}
var assembleData_1 = assembleData;
var data$3 = {
	parseUnitData: parseUnitData_1,
	parseFacetData: parseFacetData_1,
	parseLayerData: parseLayerData_1,
	assembleData: assembleData_1
};

function assembleLayout(model, layoutData) {
    var layoutComponent = model.component.layout;
    if (!layoutComponent.width && !layoutComponent.height) {
        return layoutData;
    }
    {
        var distinctFields = util$1.keys(util$1.extend(layoutComponent.width.distinct, layoutComponent.height.distinct));
        var formula = layoutComponent.width.formula.concat(layoutComponent.height.formula)
            .map(function (formula) {
            return util$1.extend({ type: 'formula' }, formula);
        });
        return [
            distinctFields.length > 0 ? {
                name: model.dataName(data$2.LAYOUT),
                source: model.dataTable(),
                transform: [{
                        type: 'aggregate',
                        summarize: distinctFields.map(function (field) {
                            return { field: field, ops: ['distinct'] };
                        })
                    }].concat(formula)
            } : {
                name: model.dataName(data$2.LAYOUT),
                values: [{}],
                transform: formula
            }
        ];
    }
}
var assembleLayout_1 = assembleLayout;
function parseUnitLayout(model) {
    return {
        width: parseUnitSizeLayout(model, channel.X),
        height: parseUnitSizeLayout(model, channel.Y)
    };
}
var parseUnitLayout_1 = parseUnitLayout;
function parseUnitSizeLayout(model, channel$$1) {
    return {
        distinct: getDistinct(model, channel$$1),
        formula: [{
                field: model.channelSizeName(channel$$1),
                expr: unitSizeExpr(model, channel$$1)
            }]
    };
}
function unitSizeExpr(model, channel$$1) {
    var scale = model.scale(channel$$1);
    if (scale) {
        if (scale.type === scale$4.ScaleType.ORDINAL && scale.bandSize !== scale$4.BANDSIZE_FIT) {
            return '(' + cardinalityExpr(model, channel$$1) +
                ' + ' + 1 +
                ') * ' + scale.bandSize;
        }
    }
    return (channel$$1 === channel.X ? model.width : model.height) + '';
}
var unitSizeExpr_1 = unitSizeExpr;
function parseFacetLayout(model) {
    return {
        width: parseFacetSizeLayout(model, channel.COLUMN),
        height: parseFacetSizeLayout(model, channel.ROW)
    };
}
var parseFacetLayout_1 = parseFacetLayout;
function parseFacetSizeLayout(model, channel$$1) {
    var childLayoutComponent = model.child().component.layout;
    var sizeType = channel$$1 === channel.ROW ? 'height' : 'width';
    var childSizeComponent = childLayoutComponent[sizeType];
    {
        var distinct = util$1.extend(getDistinct(model, channel$$1), childSizeComponent.distinct);
        var formula = childSizeComponent.formula.concat([{
                field: model.channelSizeName(channel$$1),
                expr: facetSizeFormula(model, channel$$1, model.child().channelSizeName(channel$$1))
            }]);
        delete childLayoutComponent[sizeType];
        return {
            distinct: distinct,
            formula: formula
        };
    }
}
function facetSizeFormula(model, channel$$1, innerSize) {
    var scale = model.scale(channel$$1);
    if (model.has(channel$$1)) {
        return '(datum["' + innerSize + '"] + ' + scale.padding + ')' + ' * ' + cardinalityExpr(model, channel$$1);
    }
    else {
        return 'datum["' + innerSize + '"] + ' + model.config().facet.scale.padding;
    }
}
function parseLayerLayout(model) {
    return {
        width: parseLayerSizeLayout(model, channel.X),
        height: parseLayerSizeLayout(model, channel.Y)
    };
}
var parseLayerLayout_1 = parseLayerLayout;
function parseLayerSizeLayout(model, channel$$1) {
    {
        var childLayoutComponent = model.children()[0].component.layout;
        var sizeType_1 = channel$$1 === channel.Y ? 'height' : 'width';
        var childSizeComponent = childLayoutComponent[sizeType_1];
        var distinct = childSizeComponent.distinct;
        var formula = [{
                field: model.channelSizeName(channel$$1),
                expr: childSizeComponent.formula[0].expr
            }];
        model.children().forEach(function (child) {
            delete child.component.layout[sizeType_1];
        });
        return {
            distinct: distinct,
            formula: formula
        };
    }
}
function getDistinct(model, channel$$1) {
    if (model.has(channel$$1) && model.isOrdinalScale(channel$$1)) {
        var scale = model.scale(channel$$1);
        if (scale.type === scale$4.ScaleType.ORDINAL && !(scale.domain instanceof Array)) {
            var distinctField = model.field(channel$$1);
            var distinct = {};
            distinct[distinctField] = true;
            return distinct;
        }
    }
    return {};
}
function cardinalityExpr(model, channel$$1) {
    var scale = model.scale(channel$$1);
    if (scale.domain instanceof Array) {
        return scale.domain.length;
    }
    var timeUnit = model.fieldDef(channel$$1).timeUnit;
    var timeUnitDomain = timeUnit ? timeunit.imputedDomain(timeUnit, channel$$1) : null;
    return timeUnitDomain !== null ? timeUnitDomain.length :
        model.field(channel$$1, { datum: true, prefix: 'distinct' });
}
var cardinalityExpr_1 = cardinalityExpr;
var layout = {
	assembleLayout: assembleLayout_1,
	parseUnitLayout: parseUnitLayout_1,
	unitSizeExpr: unitSizeExpr_1,
	parseFacetLayout: parseFacetLayout_1,
	parseLayerLayout: parseLayerLayout_1,
	cardinalityExpr: cardinalityExpr_1
};

var scale$5 = createCommonjsModule(function (module, exports) {
exports.COLOR_LEGEND = 'color_legend';
exports.COLOR_LEGEND_LABEL = 'color_legend_label';
function parseScaleComponent(model) {
    return model.channels().reduce(function (scale, channel$$1) {
        if (model.scale(channel$$1)) {
            var fieldDef = model.fieldDef(channel$$1);
            var scales = {
                main: parseMainScale(model, fieldDef, channel$$1)
            };
            if (channel$$1 === channel.COLOR && model.legend(channel.COLOR) && (fieldDef.type === type$1.ORDINAL || fieldDef.bin || fieldDef.timeUnit)) {
                scales.colorLegend = parseColorLegendScale(model, fieldDef);
                if (fieldDef.bin) {
                    scales.binColorLegend = parseBinColorLegendLabel(model, fieldDef);
                }
            }
            scale[channel$$1] = scales;
        }
        return scale;
    }, {});
}
exports.parseScaleComponent = parseScaleComponent;
function parseMainScale(model, fieldDef, channel$$1) {
    var scale = model.scale(channel$$1);
    var sort = model.sort(channel$$1);
    var scaleDef = {
        name: model.scaleName(channel$$1 + '', true),
        type: scale.type,
    };
    if (channel$$1 === channel.X && model.has(channel.X2)) {
        if (model.has(channel.X)) {
            scaleDef.domain = { fields: [domain(scale, model, channel.X), domain(scale, model, channel.X2)] };
        }
        else {
            scaleDef.domain = domain(scale, model, channel.X2);
        }
    }
    else if (channel$$1 === channel.Y && model.has(channel.Y2)) {
        if (model.has(channel.Y)) {
            scaleDef.domain = { fields: [domain(scale, model, channel.Y), domain(scale, model, channel.Y2)] };
        }
        else {
            scaleDef.domain = domain(scale, model, channel.Y2);
        }
    }
    else {
        scaleDef.domain = domain(scale, model, channel$$1);
    }
    util$1.extend(scaleDef, rangeMixins(scale, model, channel$$1));
    if (sort && (sort$1.isSortField(sort) ? sort.order : sort) === sort$1.SortOrder.DESCENDING) {
        scaleDef.reverse = true;
    }
    [
        'round',
        'clamp', 'nice',
        'exponent', 'zero',
        'points',
        'padding'
    ].forEach(function (property) {
        var value = exports[property](scale, channel$$1, fieldDef, model, scaleDef);
        if (value !== undefined) {
            scaleDef[property] = value;
        }
    });
    return scaleDef;
}
function parseColorLegendScale(model, fieldDef) {
    return {
        name: model.scaleName(exports.COLOR_LEGEND, true),
        type: scale$4.ScaleType.ORDINAL,
        domain: {
            data: model.dataTable(),
            field: model.field(channel.COLOR, (fieldDef.bin || fieldDef.timeUnit) ? {} : { prefix: 'rank' }),
            sort: true
        },
        range: { data: model.dataTable(), field: model.field(channel.COLOR), sort: true }
    };
}
function parseBinColorLegendLabel(model, fieldDef) {
    return {
        name: model.scaleName(exports.COLOR_LEGEND_LABEL, true),
        type: scale$4.ScaleType.ORDINAL,
        domain: {
            data: model.dataTable(),
            field: model.field(channel.COLOR),
            sort: true
        },
        range: {
            data: model.dataTable(),
            field: fielddef.field(fieldDef, { binSuffix: 'range' }),
            sort: {
                field: model.field(channel.COLOR, { binSuffix: 'start' }),
                op: 'min'
            }
        }
    };
}
function scaleType(scale, fieldDef, channel$$1, mark$$1) {
    if (!channel.hasScale(channel$$1)) {
        return null;
    }
    if (util$1.contains([channel.ROW, channel.COLUMN, channel.SHAPE], channel$$1)) {
        if (scale && scale.type !== undefined && scale.type !== scale$4.ScaleType.ORDINAL) {
            console.warn('Channel', channel$$1, 'does not work with scale type =', scale.type);
        }
        return scale$4.ScaleType.ORDINAL;
    }
    if (scale.type !== undefined) {
        return scale.type;
    }
    switch (fieldDef.type) {
        case type$1.NOMINAL:
            return scale$4.ScaleType.ORDINAL;
        case type$1.ORDINAL:
            if (channel$$1 === channel.COLOR) {
                return scale$4.ScaleType.LINEAR;
            }
            return scale$4.ScaleType.ORDINAL;
        case type$1.TEMPORAL:
            if (channel$$1 === channel.COLOR) {
                return scale$4.ScaleType.TIME;
            }
            if (fieldDef.timeUnit) {
                return timeunit.defaultScaleType(fieldDef.timeUnit);
            }
            return scale$4.ScaleType.TIME;
        case type$1.QUANTITATIVE:
            if (fieldDef.bin) {
                return util$1.contains([channel.X, channel.Y, channel.COLOR], channel$$1) ? scale$4.ScaleType.LINEAR : scale$4.ScaleType.ORDINAL;
            }
            return scale$4.ScaleType.LINEAR;
    }
    return null;
}
exports.scaleType = scaleType;
function scaleBandSize(scaleType, bandSize, scaleConfig, topLevelSize, mark$$1, channel$$1) {
    if (scaleType === scale$4.ScaleType.ORDINAL) {
        if (topLevelSize === undefined) {
            if (bandSize) {
                return bandSize;
            }
            else if (channel$$1 === channel.X && mark$$1 === mark.TEXT) {
                return scaleConfig.textBandWidth;
            }
            else {
                return scaleConfig.bandSize;
            }
        }
        else {
            if (bandSize) {
                console.warn('bandSize for', channel$$1, 'overridden as top-level', channel$$1 === channel.X ? 'width' : 'height', 'is provided.');
            }
            return scale$4.BANDSIZE_FIT;
        }
    }
    else {
        return undefined;
    }
}
exports.scaleBandSize = scaleBandSize;
function domain(scale, model, channel$$1) {
    var fieldDef = model.fieldDef(channel$$1);
    if (scale.domain) {
        if (datetime.isDateTime(scale.domain[0])) {
            return scale.domain.map(function (dt) {
                return datetime.timestamp(dt, true);
            });
        }
        return scale.domain;
    }
    if (fieldDef.type === type$1.TEMPORAL) {
        if (timeunit.imputedDomain(fieldDef.timeUnit, channel$$1)) {
            return {
                data: fieldDef.timeUnit,
                field: 'date'
            };
        }
        return {
            data: model.dataTable(),
            field: model.field(channel$$1),
            sort: {
                field: model.field(channel$$1),
                op: 'min'
            }
        };
    }
    var stack = model.stack();
    if (stack && channel$$1 === stack.fieldChannel) {
        if (stack.offset === stack_1.StackOffset.NORMALIZE) {
            return [0, 1];
        }
        return {
            data: model.dataName(data$2.STACKED_SCALE),
            field: model.field(channel$$1, { prefix: 'sum' })
        };
    }
    var useRawDomain = _useRawDomain(scale, model, channel$$1), sort = domainSort(model, channel$$1, scale.type);
    if (useRawDomain) {
        return {
            data: data$2.SOURCE,
            field: model.field(channel$$1, { noAggregate: true })
        };
    }
    else if (fieldDef.bin) {
        if (scale.type === scale$4.ScaleType.ORDINAL) {
            return {
                data: model.dataTable(),
                field: model.field(channel$$1, { binSuffix: 'range' }),
                sort: {
                    field: model.field(channel$$1, { binSuffix: 'start' }),
                    op: 'min'
                }
            };
        }
        else if (channel$$1 === channel.COLOR) {
            return {
                data: model.dataTable(),
                field: model.field(channel$$1, { binSuffix: 'start' })
            };
        }
        else {
            return {
                data: model.dataTable(),
                field: [
                    model.field(channel$$1, { binSuffix: 'start' }),
                    model.field(channel$$1, { binSuffix: 'end' })
                ]
            };
        }
    }
    else if (sort) {
        return {
            data: sort.op ? data$2.SOURCE : model.dataTable(),
            field: (fieldDef.type === type$1.ORDINAL && channel$$1 === channel.COLOR) ? model.field(channel$$1, { prefix: 'rank' }) : model.field(channel$$1),
            sort: sort
        };
    }
    else {
        return {
            data: model.dataTable(),
            field: (fieldDef.type === type$1.ORDINAL && channel$$1 === channel.COLOR) ? model.field(channel$$1, { prefix: 'rank' }) : model.field(channel$$1),
        };
    }
}
exports.domain = domain;
function domainSort(model, channel$$1, scaleType) {
    if (scaleType !== scale$4.ScaleType.ORDINAL) {
        return undefined;
    }
    var sort = model.sort(channel$$1);
    if (sort$1.isSortField(sort)) {
        return {
            op: sort.op,
            field: sort.field
        };
    }
    if (util$1.contains([sort$1.SortOrder.ASCENDING, sort$1.SortOrder.DESCENDING, undefined], sort)) {
        return true;
    }
    return undefined;
}
exports.domainSort = domainSort;
function _useRawDomain(scale, model, channel$$1) {
    var fieldDef = model.fieldDef(channel$$1);
    return scale.useRawDomain &&
        fieldDef.aggregate &&
        aggregate.SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) >= 0 &&
        ((fieldDef.type === type$1.QUANTITATIVE && !fieldDef.bin && scale.type !== scale$4.ScaleType.LOG) ||
            (fieldDef.type === type$1.TEMPORAL && util$1.contains([scale$4.ScaleType.TIME, scale$4.ScaleType.UTC], scale.type)));
}
function rangeMixins(scale, model, channel$$1) {
    var fieldDef = model.fieldDef(channel$$1);
    var scaleConfig = model.config().scale;
    if (scale.type === scale$4.ScaleType.ORDINAL && scale.bandSize && scale.bandSize !== scale$4.BANDSIZE_FIT && util$1.contains([channel.X, channel.Y], channel$$1)) {
        return { bandSize: scale.bandSize };
    }
    if (scale.range && !util$1.contains([channel.X, channel.Y, channel.ROW, channel.COLUMN], channel$$1)) {
        return { range: scale.range };
    }
    switch (channel$$1) {
        case channel.ROW:
            return { range: 'height' };
        case channel.COLUMN:
            return { range: 'width' };
    }
    var unitModel = model;
    switch (channel$$1) {
        case channel.X:
            return {
                rangeMin: 0,
                rangeMax: unitModel.width
            };
        case channel.Y:
            return {
                rangeMin: unitModel.height,
                rangeMax: 0
            };
        case channel.SIZE:
            if (unitModel.mark() === mark.BAR) {
                if (scaleConfig.barSizeRange !== undefined) {
                    return { range: scaleConfig.barSizeRange };
                }
                var dimension = model.config().mark.orient === config.Orient.HORIZONTAL ? channel.Y : channel.X;
                return { range: [model.config().mark.barThinSize, model.scale(dimension).bandSize] };
            }
            else if (unitModel.mark() === mark.TEXT) {
                return { range: scaleConfig.fontSizeRange };
            }
            else if (unitModel.mark() === mark.RULE) {
                return { range: scaleConfig.ruleSizeRange };
            }
            else if (unitModel.mark() === mark.TICK) {
                return { range: scaleConfig.tickSizeRange };
            }
            if (scaleConfig.pointSizeRange !== undefined) {
                return { range: scaleConfig.pointSizeRange };
            }
            var bandSize = pointBandSize(unitModel);
            return { range: [9, (bandSize - 2) * (bandSize - 2)] };
        case channel.SHAPE:
            return { range: scaleConfig.shapeRange };
        case channel.COLOR:
            if (fieldDef.type === type$1.NOMINAL) {
                return { range: scaleConfig.nominalColorRange };
            }
            return { range: scaleConfig.sequentialColorRange };
        case channel.OPACITY:
            return { range: scaleConfig.opacity };
    }
    return {};
}
exports.rangeMixins = rangeMixins;
function pointBandSize(model) {
    var scaleConfig = model.config().scale;
    var hasX = model.has(channel.X);
    var hasY = model.has(channel.Y);
    var xIsMeasure = fielddef.isMeasure(model.encoding().x);
    var yIsMeasure = fielddef.isMeasure(model.encoding().y);
    if (hasX && hasY) {
        return xIsMeasure !== yIsMeasure ?
            model.scale(xIsMeasure ? channel.Y : channel.X).bandSize :
            Math.min(model.scale(channel.X).bandSize || scaleConfig.bandSize, model.scale(channel.Y).bandSize || scaleConfig.bandSize);
    }
    else if (hasY) {
        return yIsMeasure ? model.config().scale.bandSize : model.scale(channel.Y).bandSize;
    }
    else if (hasX) {
        return xIsMeasure ? model.config().scale.bandSize : model.scale(channel.X).bandSize;
    }
    return model.config().scale.bandSize;
}
function clamp(scale) {
    if (util$1.contains([scale$4.ScaleType.LINEAR, scale$4.ScaleType.POW, scale$4.ScaleType.SQRT,
        scale$4.ScaleType.LOG, scale$4.ScaleType.TIME, scale$4.ScaleType.UTC], scale.type)) {
        return scale.clamp;
    }
    return undefined;
}
exports.clamp = clamp;
function exponent(scale) {
    if (scale.type === scale$4.ScaleType.POW) {
        return scale.exponent;
    }
    return undefined;
}
exports.exponent = exponent;
function nice(scale, channel$$1, fieldDef) {
    if (util$1.contains([scale$4.ScaleType.LINEAR, scale$4.ScaleType.POW, scale$4.ScaleType.SQRT, scale$4.ScaleType.LOG,
        scale$4.ScaleType.TIME, scale$4.ScaleType.UTC, scale$4.ScaleType.QUANTIZE], scale.type)) {
        if (scale.nice !== undefined) {
            return scale.nice;
        }
        if (util$1.contains([scale$4.ScaleType.TIME, scale$4.ScaleType.UTC], scale.type)) {
            return timeunit.smallestUnit(fieldDef.timeUnit);
        }
        return util$1.contains([channel.X, channel.Y], channel$$1);
    }
    return undefined;
}
exports.nice = nice;
function padding(scale, channel$$1, __, ___, scaleDef) {
    if (scale.type === scale$4.ScaleType.ORDINAL && util$1.contains([channel.X, channel.Y], channel$$1)) {
        return scaleDef.points ? 1 : scale.padding;
    }
    return undefined;
}
exports.padding = padding;
function points(scale, channel$$1, __, model) {
    if (scale.type === scale$4.ScaleType.ORDINAL && util$1.contains([channel.X, channel.Y], channel$$1)) {
        return model.mark() === mark.BAR && scale.bandSize === scale$4.BANDSIZE_FIT ? undefined : true;
    }
    return undefined;
}
exports.points = points;
function round(scale, channel$$1) {
    if (util$1.contains([channel.X, channel.Y, channel.ROW, channel.COLUMN, channel.SIZE], channel$$1) && scale.round !== undefined) {
        return scale.round;
    }
    return undefined;
}
exports.round = round;
function zero(scale, channel$$1, fieldDef) {
    if (!util$1.contains([scale$4.ScaleType.TIME, scale$4.ScaleType.UTC, scale$4.ScaleType.ORDINAL], scale.type)) {
        if (scale.zero !== undefined) {
            return scale.zero;
        }
        return !scale.domain && !fieldDef.bin && util$1.contains([channel.X, channel.Y], channel$$1);
    }
    return undefined;
}
exports.zero = zero;
});
var scale_2$1 = scale$5.COLOR_LEGEND;
var scale_3$1 = scale$5.COLOR_LEGEND_LABEL;
var scale_4$1 = scale$5.parseScaleComponent;
var scale_5$1 = scale$5.scaleType;
var scale_6$1 = scale$5.scaleBandSize;
var scale_7 = scale$5.domain;
var scale_8 = scale$5.domainSort;
var scale_9 = scale$5.rangeMixins;
var scale_10 = scale$5.clamp;
var scale_11 = scale$5.exponent;
var scale_12 = scale$5.nice;
var scale_13 = scale$5.padding;
var scale_14 = scale$5.points;
var scale_15 = scale$5.round;
var scale_16 = scale$5.zero;

var NameMap = (function () {
    function NameMap() {
        this._nameMap = {};
    }
    NameMap.prototype.rename = function (oldName, newName) {
        this._nameMap[oldName] = newName;
    };
    NameMap.prototype.has = function (name) {
        return this._nameMap[name] !== undefined;
    };
    NameMap.prototype.get = function (name) {
        while (this._nameMap[name]) {
            name = this._nameMap[name];
        }
        return name;
    };
    return NameMap;
}());
var Model = (function () {
    function Model(spec, parent, parentGivenName) {
        this._warnings = [];
        this._parent = parent;
        this._name = spec.name || parentGivenName;
        this._dataNameMap = parent ? parent._dataNameMap : new NameMap();
        this._scaleNameMap = parent ? parent._scaleNameMap : new NameMap();
        this._sizeNameMap = parent ? parent._sizeNameMap : new NameMap();
        this._data = spec.data;
        this._description = spec.description;
        this._transform = spec.transform;
        if (spec.transform) {
            if (spec.transform.filterInvalid === undefined &&
                spec.transform['filterNull'] !== undefined) {
                spec.transform.filterInvalid = spec.transform['filterNull'];
                console.warn('filterNull is deprecated. Please use filterInvalid instead.');
            }
        }
        this.component = { data: null, layout: null, mark: null, scale: null, axis: null, axisGroup: null, gridGroup: null, legend: null };
    }
    Model.prototype.parse = function () {
        this.parseData();
        this.parseSelectionData();
        this.parseLayoutData();
        this.parseScale();
        this.parseAxis();
        this.parseLegend();
        this.parseAxisGroup();
        this.parseGridGroup();
        this.parseMark();
    };
    Model.prototype.assembleScales = function () {
        return util$1.flatten(util$1.vals(this.component.scale).map(function (scales) {
            var arr = [scales.main];
            if (scales.colorLegend) {
                arr.push(scales.colorLegend);
            }
            if (scales.binColorLegend) {
                arr.push(scales.binColorLegend);
            }
            return arr;
        }));
    };
    Model.prototype.assembleAxes = function () {
        return util$1.vals(this.component.axis);
    };
    Model.prototype.assembleLegends = function () {
        return util$1.vals(this.component.legend);
    };
    Model.prototype.assembleGroup = function () {
        var group = {};
        group.marks = this.assembleMarks();
        var scales = this.assembleScales();
        if (scales.length > 0) {
            group.scales = scales;
        }
        var axes = this.assembleAxes();
        if (axes.length > 0) {
            group.axes = axes;
        }
        var legends = this.assembleLegends();
        if (legends.length > 0) {
            group.legends = legends;
        }
        return group;
    };
    Model.prototype.reduce = function (f, init, t) {
        return encoding.channelMappingReduce(this.channels(), this.mapping(), f, init, t);
    };
    Model.prototype.forEach = function (f, t) {
        encoding.channelMappingForEach(this.channels(), this.mapping(), f, t);
    };
    Model.prototype.parent = function () {
        return this._parent;
    };
    Model.prototype.name = function (text, delimiter) {
        if (delimiter === void 0) { delimiter = '_'; }
        return (this._name ? this._name + delimiter : '') + text;
    };
    Model.prototype.description = function () {
        return this._description;
    };
    Model.prototype.data = function () {
        return this._data;
    };
    Model.prototype.renameData = function (oldName, newName) {
        this._dataNameMap.rename(oldName, newName);
    };
    Model.prototype.dataName = function (dataSourceType) {
        return this._dataNameMap.get(this.name(String(dataSourceType)));
    };
    Model.prototype.renameSize = function (oldName, newName) {
        this._sizeNameMap.rename(oldName, newName);
    };
    Model.prototype.channelSizeName = function (channel$$1) {
        return this.sizeName(channel$$1 === channel.X || channel$$1 === channel.COLUMN ? 'width' : 'height');
    };
    Model.prototype.sizeName = function (size) {
        return this._sizeNameMap.get(this.name(size, '_'));
    };
    Model.prototype.calculate = function () {
        return this._transform ? this._transform.calculate : undefined;
    };
    Model.prototype.filterInvalid = function () {
        var transform = this._transform || {};
        if (transform.filterInvalid === undefined) {
            return this.parent() ? this.parent().filterInvalid() : undefined;
        }
        return transform.filterInvalid;
    };
    Model.prototype.filter = function () {
        return this._transform ? this._transform.filter : undefined;
    };
    Model.prototype.field = function (channel$$1, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel$$1);
        if (fieldDef.bin) {
            opt = util$1.extend({
                binSuffix: this.scale(channel$$1).type === scale$4.ScaleType.ORDINAL ? 'range' : 'start'
            }, opt);
        }
        return fielddef.field(fieldDef, opt);
    };
    Model.prototype.scale = function (channel$$1) {
        return this._scale[channel$$1];
    };
    Model.prototype.isOrdinalScale = function (channel$$1) {
        var scale = this.scale(channel$$1);
        return scale && scale.type === scale$4.ScaleType.ORDINAL;
    };
    Model.prototype.renameScale = function (oldName, newName) {
        this._scaleNameMap.rename(oldName, newName);
    };
    Model.prototype.scaleName = function (originalScaleName, parse) {
        var channel$$1 = util$1.contains([scale$5.COLOR_LEGEND, scale$5.COLOR_LEGEND_LABEL], originalScaleName) ? 'color' : originalScaleName;
        if (parse) {
            return this.name(originalScaleName + '');
        }
        if ((this._scale && this._scale[channel$$1]) ||
            this._scaleNameMap.has(this.name(originalScaleName + ''))) {
            return this._scaleNameMap.get(this.name(originalScaleName + ''));
        }
        return undefined;
    };
    Model.prototype.sort = function (channel$$1) {
        return (this.mapping()[channel$$1] || {}).sort;
    };
    Model.prototype.axis = function (channel$$1) {
        return this._axis[channel$$1];
    };
    Model.prototype.legend = function (channel$$1) {
        return this._legend[channel$$1];
    };
    Model.prototype.config = function () {
        return this._config;
    };
    Model.prototype.addWarning = function (message) {
        util$1.warning(message);
        this._warnings.push(message);
    };
    Model.prototype.warnings = function () {
        return this._warnings;
    };
    Model.prototype.isUnit = function () {
        return false;
    };
    Model.prototype.isFacet = function () {
        return false;
    };
    Model.prototype.isLayer = function () {
        return false;
    };
    return Model;
}());
var Model_1 = Model;
var model = {
	Model: Model_1
};

var __extends = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FacetModel = (function (_super) {
    __extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName) {
        _super.call(this, spec, parent, parentGivenName);
        var config$$1 = this._config = this._initConfig(spec.config, parent);
        var child = this._child = common.buildModel(spec.spec, this, this.name('child'));
        var facet = this._facet = this._initFacet(spec.facet);
        this._scale = this._initScale(facet, config$$1, child);
        this._axis = this._initAxis(facet, config$$1, child);
    }
    FacetModel.prototype._initConfig = function (specConfig, parent) {
        return util$1.mergeDeep(util$1.duplicate(config.defaultConfig), parent ? parent.config() : {}, specConfig);
    };
    FacetModel.prototype._initFacet = function (facet) {
        facet = util$1.duplicate(facet);
        var model$$1 = this;
        encoding.channelMappingForEach(this.channels(), facet, function (fieldDef, channel$$1) {
            if (fieldDef.type) {
                fieldDef.type = type$1.getFullName(fieldDef.type);
            }
            if (!fielddef.isDimension(fieldDef)) {
                model$$1.addWarning(channel$$1 + ' encoding should be ordinal.');
            }
        });
        return facet;
    };
    FacetModel.prototype._initScale = function (facet, config$$1, child) {
        return [channel.ROW, channel.COLUMN].reduce(function (_scale, channel$$1) {
            if (facet[channel$$1]) {
                var scaleSpec = facet[channel$$1].scale || {};
                _scale[channel$$1] = util$1.extend({
                    type: scale$4.ScaleType.ORDINAL,
                    round: config$$1.facet.scale.round,
                    padding: (channel$$1 === channel.ROW && child.has(channel.Y)) || (channel$$1 === channel.COLUMN && child.has(channel.X)) ?
                        config$$1.facet.scale.padding : 0
                }, scaleSpec);
            }
            return _scale;
        }, {});
    };
    FacetModel.prototype._initAxis = function (facet, config$$1, child) {
        return [channel.ROW, channel.COLUMN].reduce(function (_axis, channel$$1) {
            if (facet[channel$$1]) {
                var axisSpec = facet[channel$$1].axis;
                if (axisSpec !== false) {
                    var modelAxis = _axis[channel$$1] = util$1.extend({}, config$$1.facet.axis, axisSpec === true ? {} : axisSpec || {});
                    if (channel$$1 === channel.ROW) {
                        var yAxis = child.axis(channel.Y);
                        if (yAxis && yAxis.orient !== axis.AxisOrient.RIGHT && !modelAxis.orient) {
                            modelAxis.orient = axis.AxisOrient.RIGHT;
                        }
                        if (child.has(channel.X) && !modelAxis.labelAngle) {
                            modelAxis.labelAngle = modelAxis.orient === axis.AxisOrient.RIGHT ? 90 : 270;
                        }
                    }
                }
            }
            return _axis;
        }, {});
    };
    FacetModel.prototype.facet = function () {
        return this._facet;
    };
    FacetModel.prototype.has = function (channel$$1) {
        return !!this._facet[channel$$1];
    };
    FacetModel.prototype.child = function () {
        return this._child;
    };
    FacetModel.prototype.hasSummary = function () {
        var summary = this.component.data.summary;
        for (var i = 0; i < summary.length; i++) {
            if (util$1.keys(summary[i].measures).length > 0) {
                return true;
            }
        }
        return false;
    };
    FacetModel.prototype.dataTable = function () {
        return (this.hasSummary() ? data$2.SUMMARY : data$2.SOURCE) + '';
    };
    FacetModel.prototype.fieldDef = function (channel$$1) {
        return this.facet()[channel$$1];
    };
    FacetModel.prototype.stack = function () {
        return null;
    };
    FacetModel.prototype.parseData = function () {
        this.child().parseData();
        this.component.data = data$3.parseFacetData(this);
    };
    FacetModel.prototype.parseSelectionData = function () {
    };
    FacetModel.prototype.parseLayoutData = function () {
        this.child().parseLayoutData();
        this.component.layout = layout.parseFacetLayout(this);
    };
    FacetModel.prototype.parseScale = function () {
        var child = this.child();
        var model$$1 = this;
        child.parseScale();
        var scaleComponent = this.component.scale = scale$5.parseScaleComponent(this);
        util$1.keys(child.component.scale).forEach(function (channel$$1) {
            {
                scaleComponent[channel$$1] = child.component.scale[channel$$1];
                util$1.vals(scaleComponent[channel$$1]).forEach(function (scale) {
                    var scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
                    var newName = model$$1.scaleName(scaleNameWithoutPrefix, true);
                    child.renameScale(scale.name, newName);
                    scale.name = newName;
                });
                delete child.component.scale[channel$$1];
            }
        });
    };
    FacetModel.prototype.parseMark = function () {
        this.child().parseMark();
        this.component.mark = util$1.extend({
            name: this.name('cell'),
            type: 'group',
            from: util$1.extend(this.dataTable() ? { data: this.dataTable() } : {}, {
                transform: [{
                        type: 'facet',
                        groupby: [].concat(this.has(channel.ROW) ? [this.field(channel.ROW)] : [], this.has(channel.COLUMN) ? [this.field(channel.COLUMN)] : [])
                    }]
            }),
            properties: {
                update: getFacetGroupProperties(this)
            }
        }, this.child().assembleGroup());
    };
    FacetModel.prototype.parseAxis = function () {
        this.child().parseAxis();
        this.component.axis = axis$1.parseAxisComponent(this, [channel.ROW, channel.COLUMN]);
    };
    FacetModel.prototype.parseAxisGroup = function () {
        var xAxisGroup = parseAxisGroup(this, channel.X);
        var yAxisGroup = parseAxisGroup(this, channel.Y);
        this.component.axisGroup = util$1.extend(xAxisGroup ? { x: xAxisGroup } : {}, yAxisGroup ? { y: yAxisGroup } : {});
    };
    FacetModel.prototype.parseGridGroup = function () {
        var child = this.child();
        this.component.gridGroup = util$1.extend(!child.has(channel.X) && this.has(channel.COLUMN) ? { column: getColumnGridGroups(this) } : {}, !child.has(channel.Y) && this.has(channel.ROW) ? { row: getRowGridGroups(this) } : {});
    };
    FacetModel.prototype.parseLegend = function () {
        this.child().parseLegend();
        this.component.legend = this._child.component.legend;
        this._child.component.legend = {};
    };
    FacetModel.prototype.assembleParentGroupProperties = function () {
        return null;
    };
    FacetModel.prototype.assembleData = function (data) {
        data$3.assembleData(this, data);
        return this._child.assembleData(data);
    };
    FacetModel.prototype.assembleLayout = function (layoutData) {
        this._child.assembleLayout(layoutData);
        return layout.assembleLayout(this, layoutData);
    };
    FacetModel.prototype.assembleMarks = function () {
        return [].concat(util$1.vals(this.component.axisGroup), util$1.flatten(util$1.vals(this.component.gridGroup)), this.component.mark);
    };
    FacetModel.prototype.channels = function () {
        return [channel.ROW, channel.COLUMN];
    };
    FacetModel.prototype.mapping = function () {
        return this.facet();
    };
    FacetModel.prototype.isFacet = function () {
        return true;
    };
    return FacetModel;
}(model.Model));
var FacetModel_1 = FacetModel;
function getFacetGroupProperties(model$$1) {
    var child = model$$1.child();
    var mergedCellConfig = util$1.extend({}, child.config().cell, child.config().facet.cell);
    return util$1.extend({
        x: model$$1.has(channel.COLUMN) ? {
            scale: model$$1.scaleName(channel.COLUMN),
            field: model$$1.field(channel.COLUMN),
            offset: model$$1.scale(channel.COLUMN).padding / 2
        } : { value: model$$1.config().facet.scale.padding / 2 },
        y: model$$1.has(channel.ROW) ? {
            scale: model$$1.scaleName(channel.ROW),
            field: model$$1.field(channel.ROW),
            offset: model$$1.scale(channel.ROW).padding / 2
        } : { value: model$$1.config().facet.scale.padding / 2 },
        width: { field: { parent: model$$1.child().sizeName('width') } },
        height: { field: { parent: model$$1.child().sizeName('height') } }
    }, child.assembleParentGroupProperties(mergedCellConfig));
}
function parseAxisGroup(model$$1, channel$$1) {
    var axisGroup = null;
    var child = model$$1.child();
    if (child.has(channel$$1)) {
        if (child.axis(channel$$1)) {
            {
                axisGroup = channel$$1 === channel.X ? getXAxesGroup(model$$1) : getYAxesGroup(model$$1);
                if (child.axis(channel$$1) && axis$1.gridShow(child, channel$$1)) {
                    child.component.axis[channel$$1] = axis$1.parseInnerAxis(channel$$1, child);
                }
                else {
                    delete child.component.axis[channel$$1];
                }
            }
        }
    }
    return axisGroup;
}
function getXAxesGroup(model$$1) {
    var hasCol = model$$1.has(channel.COLUMN);
    return util$1.extend({
        name: model$$1.name('x-axes'),
        type: 'group'
    }, hasCol ? {
        from: {
            data: model$$1.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model$$1.field(channel.COLUMN)],
                    summarize: { '*': ['count'] }
                }]
        }
    } : {}, {
        properties: {
            update: {
                width: { field: { parent: model$$1.child().sizeName('width') } },
                height: {
                    field: { group: 'height' }
                },
                x: hasCol ? {
                    scale: model$$1.scaleName(channel.COLUMN),
                    field: model$$1.field(channel.COLUMN),
                    offset: model$$1.scale(channel.COLUMN).padding / 2
                } : {
                    value: model$$1.config().facet.scale.padding / 2
                }
            }
        },
        axes: [axis$1.parseAxis(channel.X, model$$1.child())]
    });
}
function getYAxesGroup(model$$1) {
    var hasRow = model$$1.has(channel.ROW);
    return util$1.extend({
        name: model$$1.name('y-axes'),
        type: 'group'
    }, hasRow ? {
        from: {
            data: model$$1.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model$$1.field(channel.ROW)],
                    summarize: { '*': ['count'] }
                }]
        }
    } : {}, {
        properties: {
            update: {
                width: {
                    field: { group: 'width' }
                },
                height: { field: { parent: model$$1.child().sizeName('height') } },
                y: hasRow ? {
                    scale: model$$1.scaleName(channel.ROW),
                    field: model$$1.field(channel.ROW),
                    offset: model$$1.scale(channel.ROW).padding / 2
                } : {
                    value: model$$1.config().facet.scale.padding / 2
                }
            }
        },
        axes: [axis$1.parseAxis(channel.Y, model$$1.child())]
    });
}
function getRowGridGroups(model$$1) {
    var facetGridConfig = model$$1.config().facet.grid;
    var rowGrid = {
        name: model$$1.name('row-grid'),
        type: 'rule',
        from: {
            data: model$$1.dataTable(),
            transform: [{ type: 'facet', groupby: [model$$1.field(channel.ROW)] }]
        },
        properties: {
            update: {
                y: {
                    scale: model$$1.scaleName(channel.ROW),
                    field: model$$1.field(channel.ROW)
                },
                x: { value: 0, offset: -facetGridConfig.offset },
                x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [rowGrid, {
            name: model$$1.name('row-grid-end'),
            type: 'rule',
            properties: {
                update: {
                    y: { field: { group: 'height' } },
                    x: { value: 0, offset: -facetGridConfig.offset },
                    x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}
function getColumnGridGroups(model$$1) {
    var facetGridConfig = model$$1.config().facet.grid;
    var columnGrid = {
        name: model$$1.name('column-grid'),
        type: 'rule',
        from: {
            data: model$$1.dataTable(),
            transform: [{ type: 'facet', groupby: [model$$1.field(channel.COLUMN)] }]
        },
        properties: {
            update: {
                x: {
                    scale: model$$1.scaleName(channel.COLUMN),
                    field: model$$1.field(channel.COLUMN)
                },
                y: { value: 0, offset: -facetGridConfig.offset },
                y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [columnGrid, {
            name: model$$1.name('column-grid-end'),
            type: 'rule',
            properties: {
                update: {
                    x: { field: { group: 'width' } },
                    y: { value: 0, offset: -facetGridConfig.offset },
                    y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}
var facet = {
	FacetModel: FacetModel_1
};

function isUnionedDomain(domain) {
    if (!util$1.isArray(domain)) {
        return 'fields' in domain;
    }
    return false;
}
var isUnionedDomain_1 = isUnionedDomain;
function isDataRefDomain(domain) {
    if (!util$1.isArray(domain)) {
        return 'data' in domain;
    }
    return false;
}
var isDataRefDomain_1 = isDataRefDomain;
var vega_schema = {
	isUnionedDomain: isUnionedDomain_1,
	isDataRefDomain: isDataRefDomain_1
};

var __extends$1 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LayerModel = (function (_super) {
    __extends$1(LayerModel, _super);
    function LayerModel(spec, parent, parentGivenName) {
        var _this = this;
        _super.call(this, spec, parent, parentGivenName);
        this._width = spec.width;
        this._height = spec.height;
        this._config = this._initConfig(spec.config, parent);
        this._children = spec.layers.map(function (layer, i) {
            return common.buildModel(layer, _this, _this.name('layer_' + i));
        });
    }
    LayerModel.prototype._initConfig = function (specConfig, parent) {
        return util$1.mergeDeep(util$1.duplicate(config.defaultConfig), specConfig, parent ? parent.config() : {});
    };
    Object.defineProperty(LayerModel.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerModel.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    LayerModel.prototype.has = function (channel) {
        return false;
    };
    LayerModel.prototype.children = function () {
        return this._children;
    };
    LayerModel.prototype.isOrdinalScale = function (channel) {
        return this._children[0].isOrdinalScale(channel);
    };
    LayerModel.prototype.dataTable = function () {
        return this._children[0].dataTable();
    };
    LayerModel.prototype.fieldDef = function (channel) {
        return null;
    };
    LayerModel.prototype.stack = function () {
        return null;
    };
    LayerModel.prototype.parseData = function () {
        this._children.forEach(function (child) {
            child.parseData();
        });
        this.component.data = data$3.parseLayerData(this);
    };
    LayerModel.prototype.parseSelectionData = function () {
    };
    LayerModel.prototype.parseLayoutData = function () {
        this._children.forEach(function (child, i) {
            child.parseLayoutData();
        });
        this.component.layout = layout.parseLayerLayout(this);
    };
    LayerModel.prototype.parseScale = function () {
        var model$$1 = this;
        var scaleComponent = this.component.scale = {};
        this._children.forEach(function (child) {
            child.parseScale();
            {
                util$1.keys(child.component.scale).forEach(function (channel) {
                    var childScales = child.component.scale[channel];
                    if (!childScales) {
                        return;
                    }
                    var modelScales = scaleComponent[channel];
                    if (modelScales && modelScales.main) {
                        var modelDomain = modelScales.main.domain;
                        var childDomain = childScales.main.domain;
                        if (util$1.isArray(modelDomain)) {
                            if (util$1.isArray(childScales.main.domain)) {
                                modelScales.main.domain = modelDomain.concat(childDomain);
                            }
                            else {
                                model$$1.addWarning('custom domain scale cannot be unioned with default field-based domain');
                            }
                        }
                        else {
                            var unionedFields = vega_schema.isUnionedDomain(modelDomain) ? modelDomain.fields : [modelDomain];
                            if (util$1.isArray(childDomain)) {
                                model$$1.addWarning('custom domain scale cannot be unioned with default field-based domain');
                            }
                            var fields = vega_schema.isDataRefDomain(childDomain) ? unionedFields.concat([childDomain]) :
                                vega_schema.isUnionedDomain(childDomain) ? unionedFields.concat(childDomain.fields) :
                                    unionedFields;
                            fields = util$1.unique(fields, util$1.hash);
                            if (fields.length > 1) {
                                modelScales.main.domain = { fields: fields };
                            }
                            else {
                                modelScales.main.domain = fields[0];
                            }
                        }
                        modelScales.colorLegend = modelScales.colorLegend ? modelScales.colorLegend : childScales.colorLegend;
                        modelScales.binColorLegend = modelScales.binColorLegend ? modelScales.binColorLegend : childScales.binColorLegend;
                    }
                    else {
                        scaleComponent[channel] = childScales;
                    }
                    util$1.vals(childScales).forEach(function (scale) {
                        var scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
                        var newName = model$$1.scaleName(scaleNameWithoutPrefix, true);
                        child.renameScale(scale.name, newName);
                        scale.name = newName;
                    });
                    delete childScales[channel];
                });
            }
        });
    };
    LayerModel.prototype.parseMark = function () {
        this._children.forEach(function (child) {
            child.parseMark();
        });
    };
    LayerModel.prototype.parseAxis = function () {
        var axisComponent = this.component.axis = {};
        this._children.forEach(function (child) {
            child.parseAxis();
            {
                util$1.keys(child.component.axis).forEach(function (channel) {
                    if (!axisComponent[channel]) {
                        axisComponent[channel] = child.component.axis[channel];
                    }
                });
            }
        });
    };
    LayerModel.prototype.parseAxisGroup = function () {
        return null;
    };
    LayerModel.prototype.parseGridGroup = function () {
        return null;
    };
    LayerModel.prototype.parseLegend = function () {
        var legendComponent = this.component.legend = {};
        this._children.forEach(function (child) {
            child.parseLegend();
            {
                util$1.keys(child.component.legend).forEach(function (channel) {
                    if (!legendComponent[channel]) {
                        legendComponent[channel] = child.component.legend[channel];
                    }
                });
            }
        });
    };
    LayerModel.prototype.assembleParentGroupProperties = function () {
        return null;
    };
    LayerModel.prototype.assembleData = function (data) {
        data$3.assembleData(this, data);
        this._children.forEach(function (child) {
            child.assembleData(data);
        });
        return data;
    };
    LayerModel.prototype.assembleLayout = function (layoutData) {
        this._children.forEach(function (child) {
            child.assembleLayout(layoutData);
        });
        return layout.assembleLayout(this, layoutData);
    };
    LayerModel.prototype.assembleMarks = function () {
        return util$1.flatten(this._children.map(function (child) {
            return child.assembleMarks();
        }));
    };
    LayerModel.prototype.channels = function () {
        return [];
    };
    LayerModel.prototype.mapping = function () {
        return null;
    };
    LayerModel.prototype.isLayer = function () {
        return true;
    };
    LayerModel.prototype.compatibleSource = function (child) {
        var data = this.data();
        var childData = child.component.data;
        var compatible = !childData.source || (data && data.url === childData.source.url);
        return compatible;
    };
    return LayerModel;
}(model.Model));
var LayerModel_1 = LayerModel;
var layer = {
	LayerModel: LayerModel_1
};

function initMarkConfig(mark$$1, encoding$$1, stacked, config$$1) {
    return util$1.extend(['filled', 'opacity', 'orient', 'align'].reduce(function (cfg, property) {
        var value = config$$1.mark[property];
        switch (property) {
            case 'filled':
                if (value === undefined) {
                    cfg[property] = mark$$1 !== mark.POINT && mark$$1 !== mark.LINE && mark$$1 !== mark.RULE;
                }
                break;
            case 'opacity':
                if (value === undefined) {
                    if (util$1.contains([mark.POINT, mark.TICK, mark.CIRCLE, mark.SQUARE], mark$$1)) {
                        if (!encoding.isAggregate(encoding$$1) || encoding.has(encoding$$1, channel.DETAIL)) {
                            cfg[property] = 0.7;
                        }
                    }
                    if (mark$$1 === mark.BAR && !stacked) {
                        if (encoding.has(encoding$$1, channel.COLOR) || encoding.has(encoding$$1, channel.DETAIL) || encoding.has(encoding$$1, channel.SIZE)) {
                            cfg[property] = 0.7;
                        }
                    }
                    if (mark$$1 === mark.AREA) {
                        cfg[property] = 0.7;
                    }
                }
                break;
            case 'orient':
                cfg[property] = orient(mark$$1, encoding$$1, config$$1.mark);
                break;
            case 'align':
                if (value === undefined) {
                    cfg[property] = encoding.has(encoding$$1, channel.X) ? 'center' : 'right';
                }
        }
        return cfg;
    }, {}), config$$1.mark);
}
var initMarkConfig_1 = initMarkConfig;
function orient(mark$$1, encoding$$1, markConfig) {
    if (markConfig === void 0) { markConfig = {}; }
    switch (mark$$1) {
        case mark.POINT:
        case mark.CIRCLE:
        case mark.SQUARE:
        case mark.TEXT:
            return undefined;
    }
    var yIsRange = encoding$$1.y && encoding$$1.y2;
    var xIsRange = encoding$$1.x && encoding$$1.x2;
    switch (mark$$1) {
        case mark.TICK:
            var xScaleType = encoding$$1.x ? scale$5.scaleType(encoding$$1.x.scale || {}, encoding$$1.x, channel.X, mark$$1) : null;
            var yScaleType = encoding$$1.y ? scale$5.scaleType(encoding$$1.y.scale || {}, encoding$$1.y, channel.Y, mark$$1) : null;
            if (xScaleType !== scale$4.ScaleType.ORDINAL && (!encoding$$1.y ||
                yScaleType === scale$4.ScaleType.ORDINAL) ||
                encoding$$1.y.bin) {
                return config.Orient.VERTICAL;
            }
            return config.Orient.HORIZONTAL;
        case mark.RULE:
            if (xIsRange) {
                return config.Orient.HORIZONTAL;
            }
            if (yIsRange) {
                return config.Orient.VERTICAL;
            }
            if (encoding$$1.y) {
                return config.Orient.HORIZONTAL;
            }
            if (encoding$$1.x) {
                return config.Orient.VERTICAL;
            }
            return undefined;
        case mark.BAR:
        case mark.AREA:
            if (yIsRange) {
                return config.Orient.VERTICAL;
            }
            if (xIsRange) {
                return config.Orient.HORIZONTAL;
            }
        case mark.LINE:
            var xIsMeasure = fielddef.isMeasure(encoding$$1.x) || fielddef.isMeasure(encoding$$1.x2);
            var yIsMeasure = fielddef.isMeasure(encoding$$1.y) || fielddef.isMeasure(encoding$$1.y2);
            if (xIsMeasure && !yIsMeasure) {
                return config.Orient.HORIZONTAL;
            }
            else if (!xIsMeasure && yIsMeasure) {
                return config.Orient.VERTICAL;
            }
            else if (xIsMeasure && yIsMeasure) {
                if (encoding$$1.x.type === type$1.TEMPORAL) {
                    return config.Orient.VERTICAL;
                }
                else if (encoding$$1.y.type === type$1.TEMPORAL) {
                    return config.Orient.HORIZONTAL;
                }
            }
            return config.Orient.VERTICAL;
    }
    console.warn('orient unimplemented for mark', mark$$1);
    return config.Orient.VERTICAL;
}
var orient_1 = orient;
var config$1 = {
	initMarkConfig: initMarkConfig_1,
	orient: orient_1
};

var legend$1 = createCommonjsModule(function (module, exports) {
function parseLegendComponent(model) {
    return [channel.COLOR, channel.SIZE, channel.SHAPE, channel.OPACITY].reduce(function (legendComponent, channel$$1) {
        if (model.legend(channel$$1)) {
            legendComponent[channel$$1] = parseLegend(model, channel$$1);
        }
        return legendComponent;
    }, {});
}
exports.parseLegendComponent = parseLegendComponent;
function getLegendDefWithScale(model, channel$$1) {
    switch (channel$$1) {
        case channel.COLOR:
            var fieldDef = model.encoding().color;
            var scale = model.scaleName(useColorLegendScale(fieldDef) ?
                scale$5.COLOR_LEGEND :
                channel.COLOR);
            return model.config().mark.filled ? { fill: scale } : { stroke: scale };
        case channel.SIZE:
            return { size: model.scaleName(channel.SIZE) };
        case channel.SHAPE:
            return { shape: model.scaleName(channel.SHAPE) };
        case channel.OPACITY:
            return { opacity: model.scaleName(channel.OPACITY) };
    }
    return null;
}
function parseLegend(model, channel$$1) {
    var fieldDef = model.fieldDef(channel$$1);
    var legend = model.legend(channel$$1);
    var config = model.config();
    var def = getLegendDefWithScale(model, channel$$1);
    def.title = title(legend, fieldDef, config);
    var format$$1 = common.numberFormat(fieldDef, legend.format, config, channel$$1);
    if (format$$1) {
        def.format = format$$1;
    }
    var vals = values(legend);
    if (vals) {
        def.values = vals;
    }
    ['offset', 'orient'].forEach(function (property) {
        var value = legend[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = (typeof legend !== 'boolean' && legend.properties) || {};
    ['title', 'symbols', 'legend', 'labels'].forEach(function (group) {
        var value = properties[group] ?
            properties[group](fieldDef, props[group], model, channel$$1) :
            props[group];
        if (value !== undefined && util$1.keys(value).length > 0) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.parseLegend = parseLegend;
function title(legend, fieldDef, config) {
    if (legend.title !== undefined) {
        return legend.title;
    }
    return fielddef.title(fieldDef, config);
}
exports.title = title;
function values(legend) {
    var vals = legend.values;
    if (vals && datetime.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            return datetime.timestamp(dt, true);
        });
    }
    return vals;
}
exports.values = values;
function useColorLegendScale(fieldDef) {
    return fieldDef.type === type$1.ORDINAL || fieldDef.bin || fieldDef.timeUnit;
}
exports.useColorLegendScale = useColorLegendScale;
var properties;
(function (properties) {
    function symbols(fieldDef, symbolsSpec, model, channel$$1) {
        var symbols = {};
        var mark$$1 = model.mark();
        var legend = model.legend(channel$$1);
        switch (mark$$1) {
            case mark.BAR:
            case mark.TICK:
            case mark.TEXT:
                symbols.shape = { value: 'square' };
                break;
            case mark.CIRCLE:
            case mark.SQUARE:
                symbols.shape = { value: mark$$1 };
                break;
            case mark.POINT:
            case mark.LINE:
            case mark.AREA:
                break;
        }
        var cfg = model.config();
        var filled = cfg.mark.filled;
        var config = channel$$1 === channel.COLOR ?
            util$1.without(common.FILL_STROKE_CONFIG, [filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) :
            util$1.without(common.FILL_STROKE_CONFIG, ['strokeDash', 'strokeDashOffset']);
        config = util$1.without(config, ['strokeDash', 'strokeDashOffset']);
        common.applyMarkConfig(symbols, model, config);
        if (filled) {
            symbols.strokeWidth = { value: 0 };
        }
        if (channel$$1 === channel.OPACITY) {
            delete symbols.opacity;
        }
        var value;
        if (model.has(channel.COLOR) && channel$$1 === channel.COLOR) {
            if (useColorLegendScale(fieldDef)) {
                value = { scale: model.scaleName(channel.COLOR), field: 'data' };
            }
        }
        else if (model.encoding().color && model.encoding().color.value) {
            value = { value: model.encoding().color.value };
        }
        if (value !== undefined) {
            if (filled) {
                symbols.fill = value;
            }
            else {
                symbols.stroke = value;
            }
        }
        else if (channel$$1 !== channel.COLOR) {
            symbols[filled ? 'fill' : 'stroke'] = symbols[filled ? 'fill' : 'stroke'] ||
                { value: cfg.mark.color };
        }
        if (legend.symbolColor !== undefined) {
            symbols.fill = { value: legend.symbolColor };
        }
        else if (symbols.fill === undefined) {
            if (cfg.mark.fill !== undefined) {
                symbols.fill = { value: cfg.mark.fill };
            }
            else if (cfg.mark.stroke !== undefined) {
                symbols.stroke = { value: cfg.mark.stroke };
            }
        }
        if (channel$$1 !== channel.SHAPE) {
            if (legend.symbolShape !== undefined) {
                symbols.shape = { value: legend.symbolShape };
            }
            else if (cfg.mark.shape !== undefined) {
                symbols.shape = { value: cfg.mark.shape };
            }
        }
        if (channel$$1 !== channel.SIZE) {
            if (legend.symbolSize !== undefined) {
                symbols.size = { value: legend.symbolSize };
            }
        }
        if (legend.symbolStrokeWidth !== undefined) {
            symbols.strokeWidth = { value: legend.symbolStrokeWidth };
        }
        symbols = util$1.extend(symbols, symbolsSpec || {});
        return util$1.keys(symbols).length > 0 ? symbols : undefined;
    }
    properties.symbols = symbols;
    function labels(fieldDef, labelsSpec, model, channel$$1) {
        var legend = model.legend(channel$$1);
        var config = model.config();
        var labels = {};
        if (channel$$1 === channel.COLOR) {
            if (fieldDef.type === type$1.ORDINAL) {
                labelsSpec = util$1.extend({
                    text: {
                        scale: model.scaleName(scale$5.COLOR_LEGEND),
                        field: 'data'
                    }
                }, labelsSpec || {});
            }
            else if (fieldDef.bin) {
                labelsSpec = util$1.extend({
                    text: {
                        scale: model.scaleName(scale$5.COLOR_LEGEND_LABEL),
                        field: 'data'
                    }
                }, labelsSpec || {});
            }
            else if (fieldDef.type === type$1.TEMPORAL) {
                labelsSpec = util$1.extend({
                    text: {
                        template: common.timeTemplate('datum["data"]', fieldDef.timeUnit, legend.format, legend.shortTimeLabels, config)
                    }
                }, labelsSpec || {});
            }
        }
        if (legend.labelAlign !== undefined) {
            labels.align = { value: legend.labelAlign };
        }
        if (legend.labelColor !== undefined) {
            labels.fill = { value: legend.labelColor };
        }
        if (legend.labelFont !== undefined) {
            labels.font = { value: legend.labelFont };
        }
        if (legend.labelFontSize !== undefined) {
            labels.fontSize = { value: legend.labelFontSize };
        }
        if (legend.labelBaseline !== undefined) {
            labels.baseline = { value: legend.labelBaseline };
        }
        labels = util$1.extend(labels, labelsSpec || {});
        return util$1.keys(labels).length > 0 ? labels : undefined;
    }
    properties.labels = labels;
    function title(fieldDef, titleSpec, model, channel$$1) {
        var legend = model.legend(channel$$1);
        var titles = {};
        if (legend.titleColor !== undefined) {
            titles.fill = { value: legend.titleColor };
        }
        if (legend.titleFont !== undefined) {
            titles.font = { value: legend.titleFont };
        }
        if (legend.titleFontSize !== undefined) {
            titles.fontSize = { value: legend.titleFontSize };
        }
        if (legend.titleFontWeight !== undefined) {
            titles.fontWeight = { value: legend.titleFontWeight };
        }
        titles = util$1.extend(titles, titleSpec || {});
        return util$1.keys(titles).length > 0 ? titles : undefined;
    }
    properties.title = title;
})(properties = exports.properties || (exports.properties = {}));
});
var legend_1 = legend$1.parseLegendComponent;
var legend_2 = legend$1.parseLegend;
var legend_3 = legend$1.title;
var legend_4 = legend$1.values;
var legend_5 = legend$1.useColorLegendScale;
var legend_6 = legend$1.properties;

var area_1 = createCommonjsModule(function (module, exports) {
var area$$1;
(function (area$$1) {
    function markType() {
        return 'area';
    }
    area$$1.markType = markType;
    function properties(model) {
        var p = {};
        var config$$1 = model.config();
        var orient = config$$1.mark.orient;
        p.orient = { value: orient };
        var stack = model.stack();
        p.x = x(model.encoding().x, model.scaleName(channel.X), model.scale(channel.X), orient, stack);
        p.y = y(model.encoding().y, model.scaleName(channel.Y), model.scale(channel.Y), orient, stack);
        var _x2 = x2(model.encoding().x, model.encoding().x2, model.scaleName(channel.X), model.scale(channel.X), orient, stack);
        if (_x2) {
            p.x2 = _x2;
        }
        var _y2 = y2(model.encoding().y, model.encoding().y2, model.scaleName(channel.Y), model.scale(channel.Y), orient, stack);
        if (_y2) {
            p.y2 = _y2;
        }
        common.applyColorAndOpacity(p, model);
        common.applyMarkConfig(p, model, ['interpolate', 'tension']);
        return p;
    }
    area$$1.properties = properties;
    function x(fieldDef, scaleName, scale, orient, stack) {
        if (stack && channel.X === stack.fieldChannel) {
            return {
                scale: scaleName,
                field: fielddef.field(fieldDef, { suffix: 'start' })
            };
        }
        else if (fieldDef) {
            if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
            else if (fieldDef.value) {
                return {
                    scale: scaleName,
                    value: fieldDef.value
                };
            }
        }
        return { value: 0 };
    }
    area$$1.x = x;
    function x2(xFieldDef, x2FieldDef, scaleName, scale, orient, stack) {
        if (orient === config.Orient.HORIZONTAL) {
            if (stack && channel.X === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(xFieldDef, { suffix: 'end' })
                };
            }
            else if (x2FieldDef) {
                if (x2FieldDef.field) {
                    return {
                        scale: scaleName,
                        field: fielddef.field(x2FieldDef)
                    };
                }
                else if (x2FieldDef.value) {
                    return {
                        scale: scaleName,
                        value: x2FieldDef.value
                    };
                }
            }
            if (util$1.contains([scale$4.ScaleType.LOG, scale$4.ScaleType.TIME, scale$4.ScaleType.UTC], scale.type) || scale.zero === false) {
                return {
                    value: 0
                };
            }
            return {
                scale: scaleName,
                value: 0
            };
        }
        return undefined;
    }
    area$$1.x2 = x2;
    function y(fieldDef, scaleName, scale, orient, stack) {
        if (stack && channel.Y === stack.fieldChannel) {
            return {
                scale: scaleName,
                field: fielddef.field(fieldDef, { suffix: 'start' })
            };
        }
        else if (fieldDef) {
            if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
            else if (fieldDef.value) {
                return {
                    scale: scaleName,
                    value: fieldDef.value
                };
            }
        }
        return { value: 0 };
    }
    area$$1.y = y;
    function y2(yFieldDef, y2FieldDef, scaleName, scale, orient, stack) {
        if (orient !== config.Orient.HORIZONTAL) {
            if (stack && channel.Y === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(yFieldDef, { suffix: 'end' })
                };
            }
            else if (y2FieldDef) {
                if (y2FieldDef.field) {
                    return {
                        scale: scaleName,
                        field: fielddef.field(y2FieldDef)
                    };
                }
                else if (y2FieldDef.value) {
                    return {
                        scale: scaleName,
                        value: y2FieldDef.value
                    };
                }
            }
            if (util$1.contains([scale$4.ScaleType.LOG, scale$4.ScaleType.TIME, scale$4.ScaleType.UTC], scale.type) || scale.zero === false) {
                return {
                    field: { group: 'height' }
                };
            }
            return {
                scale: scaleName,
                value: 0
            };
        }
        return undefined;
    }
    area$$1.y2 = y2;
})(area$$1 = exports.area || (exports.area = {}));
});
var area_2 = area_1.area;

var bar_1 = createCommonjsModule(function (module, exports) {
var bar;
(function (bar) {
    function markType() {
        return 'rect';
    }
    bar.markType = markType;
    function properties(model) {
        var p = {};
        var orient = model.config().mark.orient;
        var stack = model.stack();
        var xFieldDef = model.encoding().x;
        var x2FieldDef = model.encoding().x2;
        var xIsMeasure = fielddef.isMeasure(xFieldDef) || fielddef.isMeasure(x2FieldDef);
        if (stack && channel.X === stack.fieldChannel) {
            p.x = {
                scale: model.scaleName(channel.X),
                field: model.field(channel.X, { suffix: 'start' })
            };
            p.x2 = {
                scale: model.scaleName(channel.X),
                field: model.field(channel.X, { suffix: 'end' })
            };
        }
        else if (xIsMeasure) {
            if (orient === config.Orient.HORIZONTAL) {
                if (model.has(channel.X)) {
                    p.x = {
                        scale: model.scaleName(channel.X),
                        field: model.field(channel.X)
                    };
                }
                else {
                    p.x = {
                        scale: model.scaleName(channel.X),
                        value: 0
                    };
                }
                if (model.has(channel.X2)) {
                    p.x2 = {
                        scale: model.scaleName(channel.X),
                        field: model.field(channel.X2)
                    };
                }
                else {
                    if (util$1.contains([scale$4.ScaleType.LOG, scale$4.ScaleType.TIME, scale$4.ScaleType.UTC], model.scale(channel.X).type) ||
                        model.scale(channel.X).zero === false) {
                        p.x2 = { value: 0 };
                    }
                    else {
                        p.x2 = {
                            scale: model.scaleName(channel.X),
                            value: 0
                        };
                    }
                }
            }
            else {
                p.xc = {
                    scale: model.scaleName(channel.X),
                    field: model.field(channel.X)
                };
                p.width = { value: sizeValue(model, channel.X) };
            }
        }
        else {
            if (model.has(channel.X)) {
                if (model.encoding().x.bin) {
                    if (model.has(channel.SIZE) && orient !== config.Orient.HORIZONTAL) {
                        p.xc = {
                            scale: model.scaleName(channel.X),
                            field: model.field(channel.X, { binSuffix: 'mid' })
                        };
                        p.width = {
                            scale: model.scaleName(channel.SIZE),
                            field: model.field(channel.SIZE)
                        };
                    }
                    else {
                        p.x = {
                            scale: model.scaleName(channel.X),
                            field: model.field(channel.X, { binSuffix: 'start' }),
                            offset: 1
                        };
                        p.x2 = {
                            scale: model.scaleName(channel.X),
                            field: model.field(channel.X, { binSuffix: 'end' })
                        };
                    }
                }
                else if (model.scale(channel.X).bandSize === scale$4.BANDSIZE_FIT) {
                    p.x = {
                        scale: model.scaleName(channel.X),
                        field: model.field(channel.X),
                        offset: 0.5
                    };
                }
                else {
                    p.xc = {
                        scale: model.scaleName(channel.X),
                        field: model.field(channel.X)
                    };
                }
            }
            else {
                p.x = { value: 0, offset: 2 };
            }
            p.width = model.has(channel.X) && model.scale(channel.X).bandSize === scale$4.BANDSIZE_FIT ? {
                scale: model.scaleName(channel.X),
                band: true,
                offset: -0.5
            } : model.has(channel.SIZE) && orient !== config.Orient.HORIZONTAL ? {
                scale: model.scaleName(channel.SIZE),
                field: model.field(channel.SIZE)
            } : {
                value: sizeValue(model, (channel.X))
            };
        }
        var yFieldDef = model.encoding().y;
        var y2FieldDef = model.encoding().y2;
        var yIsMeasure = fielddef.isMeasure(yFieldDef) || fielddef.isMeasure(y2FieldDef);
        if (stack && channel.Y === stack.fieldChannel) {
            p.y = {
                scale: model.scaleName(channel.Y),
                field: model.field(channel.Y, { suffix: 'start' })
            };
            p.y2 = {
                scale: model.scaleName(channel.Y),
                field: model.field(channel.Y, { suffix: 'end' })
            };
        }
        else if (yIsMeasure) {
            if (orient !== config.Orient.HORIZONTAL) {
                if (model.has(channel.Y)) {
                    p.y = {
                        scale: model.scaleName(channel.Y),
                        field: model.field(channel.Y)
                    };
                }
                else {
                    p.y = {
                        scale: model.scaleName(channel.Y),
                        value: 0
                    };
                }
                if (model.has(channel.Y2)) {
                    p.y2 = {
                        scale: model.scaleName(channel.Y),
                        field: model.field(channel.Y2)
                    };
                }
                else {
                    if (util$1.contains([scale$4.ScaleType.LOG, scale$4.ScaleType.TIME, scale$4.ScaleType.UTC], model.scale(channel.Y).type) ||
                        model.scale(channel.Y).zero === false) {
                        p.y2 = {
                            field: { group: 'height' }
                        };
                    }
                    else {
                        p.y2 = {
                            scale: model.scaleName(channel.Y),
                            value: 0
                        };
                    }
                }
            }
            else {
                p.yc = {
                    scale: model.scaleName(channel.Y),
                    field: model.field(channel.Y)
                };
                p.height = { value: sizeValue(model, channel.Y) };
            }
        }
        else {
            if (model.has(channel.Y)) {
                if (model.encoding().y.bin) {
                    if (model.has(channel.SIZE) && orient === config.Orient.HORIZONTAL) {
                        p.yc = {
                            scale: model.scaleName(channel.Y),
                            field: model.field(channel.Y, { binSuffix: 'mid' })
                        };
                        p.height = {
                            scale: model.scaleName(channel.SIZE),
                            field: model.field(channel.SIZE)
                        };
                    }
                    else {
                        p.y = {
                            scale: model.scaleName(channel.Y),
                            field: model.field(channel.Y, { binSuffix: 'start' })
                        };
                        p.y2 = {
                            scale: model.scaleName(channel.Y),
                            field: model.field(channel.Y, { binSuffix: 'end' }),
                            offset: 1
                        };
                    }
                }
                else if (model.scale(channel.Y).bandSize === scale$4.BANDSIZE_FIT) {
                    p.y = {
                        scale: model.scaleName(channel.Y),
                        field: model.field(channel.Y),
                        offset: 0.5
                    };
                }
                else {
                    p.yc = {
                        scale: model.scaleName(channel.Y),
                        field: model.field(channel.Y)
                    };
                }
            }
            else {
                p.y2 = {
                    field: { group: 'height' },
                    offset: -1
                };
            }
            p.height = model.has(channel.Y) && model.scale(channel.Y).bandSize === scale$4.BANDSIZE_FIT ? {
                scale: model.scaleName(channel.Y),
                band: true,
                offset: -0.5
            } : model.has(channel.SIZE) && orient === config.Orient.HORIZONTAL ? {
                scale: model.scaleName(channel.SIZE),
                field: model.field(channel.SIZE)
            } : {
                value: sizeValue(model, channel.Y)
            };
        }
        common.applyColorAndOpacity(p, model);
        return p;
    }
    bar.properties = properties;
    function sizeValue(model, channel$$1) {
        var fieldDef = model.encoding().size;
        if (fieldDef && fieldDef.value !== undefined) {
            return fieldDef.value;
        }
        var markConfig = model.config().mark;
        if (markConfig.barSize) {
            return markConfig.barSize;
        }
        return model.isOrdinalScale(channel$$1) ?
            model.scale(channel$$1).bandSize - 1 :
            !model.has(channel$$1) ?
                model.config().scale.bandSize - 1 :
                markConfig.barThinSize;
    }
})(bar = exports.bar || (exports.bar = {}));
});
var bar_2 = bar_1.bar;

var line_1 = createCommonjsModule(function (module, exports) {
var line$$1;
(function (line$$1) {
    function markType() {
        return 'line';
    }
    line$$1.markType = markType;
    function properties(model) {
        var p = {};
        var config = model.config();
        var stack = model.stack();
        p.x = x(model.encoding().x, model.scaleName(channel.X), stack, config);
        p.y = y(model.encoding().y, model.scaleName(channel.Y), stack, config);
        var _size = size(model.encoding().size, config);
        if (_size) {
            p.strokeWidth = _size;
        }
        common.applyColorAndOpacity(p, model);
        common.applyMarkConfig(p, model, ['interpolate', 'tension']);
        return p;
    }
    line$$1.properties = properties;
    function x(fieldDef, scaleName, stack, config) {
        if (fieldDef) {
            if (stack && channel.X === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { suffix: 'end' })
                };
            }
            else if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
        }
        return { value: 0 };
    }
    function y(fieldDef, scaleName, stack, config) {
        if (fieldDef) {
            if (stack && channel.Y === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { suffix: 'end' })
                };
            }
            else if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
        }
        return { field: { group: 'height' } };
    }
    function size(fieldDef, config) {
        if (fieldDef && fieldDef.value !== undefined) {
            return { value: fieldDef.value };
        }
        return { value: config.mark.lineSize };
    }
})(line$$1 = exports.line || (exports.line = {}));
});
var line_2 = line_1.line;

var point_1 = createCommonjsModule(function (module, exports) {
var point;
(function (point) {
    function markType() {
        return 'symbol';
    }
    point.markType = markType;
    function properties(model, fixedShape) {
        var p = {};
        var config = model.config();
        var stack = model.stack();
        p.x = x(model.encoding().x, model.scaleName(channel.X), stack, config);
        p.y = y(model.encoding().y, model.scaleName(channel.Y), stack, config);
        p.size = size(model.encoding().size, model.scaleName(channel.SIZE), model.scale(channel.SIZE), config);
        p.shape = shape(model.encoding().shape, model.scaleName(channel.SHAPE), model.scale(channel.SHAPE), config, fixedShape);
        common.applyColorAndOpacity(p, model);
        return p;
    }
    point.properties = properties;
    function x(fieldDef, scaleName, stack, config) {
        if (fieldDef) {
            if (stack && channel.X === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { suffix: 'end' })
                };
            }
            else if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
        }
        return { value: config.scale.bandSize / 2 };
    }
    function y(fieldDef, scaleName, stack, config) {
        if (fieldDef) {
            if (stack && channel.Y === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { suffix: 'end' })
                };
            }
            else if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
        }
        return { value: config.scale.bandSize / 2 };
    }
    function size(fieldDef, scaleName, scale, config) {
        if (fieldDef) {
            if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { scaleType: scale.type })
                };
            }
            else if (fieldDef.value !== undefined) {
                return { value: fieldDef.value };
            }
        }
        return { value: config.mark.size };
    }
    function shape(fieldDef, scaleName, scale, config, fixedShape) {
        if (fixedShape) {
            return { value: fixedShape };
        }
        else if (fieldDef) {
            if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { scaleType: scale.type })
                };
            }
            else if (fieldDef.value) {
                return { value: fieldDef.value };
            }
        }
        return { value: config.mark.shape };
    }
})(point = exports.point || (exports.point = {}));
var circle;
(function (circle) {
    function markType() {
        return 'symbol';
    }
    circle.markType = markType;
    function properties(model) {
        return point.properties(model, 'circle');
    }
    circle.properties = properties;
})(circle = exports.circle || (exports.circle = {}));
var square;
(function (square) {
    function markType() {
        return 'symbol';
    }
    square.markType = markType;
    function properties(model) {
        return point.properties(model, 'square');
    }
    square.properties = properties;
})(square = exports.square || (exports.square = {}));
});
var point_2 = point_1.point;
var point_3 = point_1.circle;
var point_4 = point_1.square;

var rule_1 = createCommonjsModule(function (module, exports) {
var rule;
(function (rule) {
    function markType() {
        return 'rule';
    }
    rule.markType = markType;
    function properties(model) {
        var p = {};
        if (model.config().mark.orient === config.Orient.VERTICAL) {
            if (model.has(channel.X)) {
                p.x = {
                    scale: model.scaleName(channel.X),
                    field: model.field(channel.X, { binSuffix: 'mid' })
                };
            }
            else {
                p.x = { value: 0 };
            }
            if (model.has(channel.Y)) {
                p.y = {
                    scale: model.scaleName(channel.Y),
                    field: model.field(channel.Y, { binSuffix: 'mid' })
                };
            }
            else {
                p.y = { field: { group: 'height' } };
            }
            if (model.has(channel.Y2)) {
                p.y2 = {
                    scale: model.scaleName(channel.Y),
                    field: model.field(channel.Y2, { binSuffix: 'mid' })
                };
            }
            else {
                p.y2 = { value: 0 };
            }
        }
        else {
            if (model.has(channel.Y)) {
                p.y = {
                    scale: model.scaleName(channel.Y),
                    field: model.field(channel.Y, { binSuffix: 'mid' })
                };
            }
            else {
                p.y = { value: 0 };
            }
            if (model.has(channel.X)) {
                p.x = {
                    scale: model.scaleName(channel.X),
                    field: model.field(channel.X, { binSuffix: 'mid' })
                };
            }
            else {
                p.x = { value: 0 };
            }
            if (model.has(channel.X2)) {
                p.x2 = {
                    scale: model.scaleName(channel.X),
                    field: model.field(channel.X2, { binSuffix: 'mid' })
                };
            }
            else {
                p.x2 = { field: { group: 'width' } };
            }
        }
        common.applyColorAndOpacity(p, model);
        if (model.has(channel.SIZE)) {
            p.strokeWidth = {
                scale: model.scaleName(channel.SIZE),
                field: model.field(channel.SIZE)
            };
        }
        else {
            p.strokeWidth = { value: sizeValue(model) };
        }
        return p;
    }
    rule.properties = properties;
    function sizeValue(model) {
        var fieldDef = model.encoding().size;
        if (fieldDef && fieldDef.value !== undefined) {
            return fieldDef.value;
        }
        return model.config().mark.ruleSize;
    }
})(rule = exports.rule || (exports.rule = {}));
});
var rule_2 = rule_1.rule;

var text_1 = createCommonjsModule(function (module, exports) {
var text;
(function (text_1) {
    function markType() {
        return 'text';
    }
    text_1.markType = markType;
    function background(model) {
        return {
            x: { value: 0 },
            y: { value: 0 },
            width: { field: { group: 'width' } },
            height: { field: { group: 'height' } },
            fill: {
                scale: model.scaleName(channel.COLOR),
                field: model.field(channel.COLOR, model.encoding().color.type === type$1.ORDINAL ? { prefix: 'rank' } : {})
            }
        };
    }
    text_1.background = background;
    function properties(model) {
        var p = {};
        common.applyMarkConfig(p, model, ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
            'fontStyle', 'radius', 'theta', 'text']);
        var config = model.config();
        var stack = model.stack();
        var textFieldDef = model.encoding().text;
        p.x = x(model.encoding().x, model.scaleName(channel.X), stack, config, textFieldDef);
        p.y = y(model.encoding().y, model.scaleName(channel.Y), stack, config);
        p.fontSize = size(model.encoding().size, model.scaleName(channel.SIZE), config);
        p.text = text(textFieldDef, model.scaleName(channel.TEXT), config);
        if (model.config().mark.applyColorToBackground && !model.has(channel.X) && !model.has(channel.Y)) {
            p.fill = { value: 'black' };
            var opacity = model.config().mark.opacity;
            if (opacity) {
                p.opacity = { value: opacity };
            }
        }
        else {
            common.applyColorAndOpacity(p, model);
        }
        return p;
    }
    text_1.properties = properties;
    function x(fieldDef, scaleName, stack, config, textFieldDef) {
        if (fieldDef) {
            if (stack && channel.X === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { suffix: 'end' })
                };
            }
            else if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
        }
        if (textFieldDef && textFieldDef.type === type$1.QUANTITATIVE) {
            return { field: { group: 'width' }, offset: -5 };
        }
        else {
            return { value: config.scale.textBandWidth / 2 };
        }
    }
    function y(fieldDef, scaleName, stack, config) {
        if (fieldDef) {
            if (stack && channel.Y === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { suffix: 'end' })
                };
            }
            else if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
        }
        return { value: config.scale.bandSize / 2 };
    }
    function size(sizeFieldDef, scaleName, config) {
        if (sizeFieldDef) {
            if (sizeFieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(sizeFieldDef)
                };
            }
            if (sizeFieldDef.value) {
                return { value: sizeFieldDef.value };
            }
        }
        return { value: config.mark.fontSize };
    }
    function text(textFieldDef, scaleName, config) {
        if (textFieldDef) {
            if (textFieldDef.field) {
                if (type$1.QUANTITATIVE === textFieldDef.type) {
                    var format$$1 = common.numberFormat(textFieldDef, config.mark.format, config, channel.TEXT);
                    var filter = 'number' + (format$$1 ? ':\'' + format$$1 + '\'' : '');
                    return {
                        template: '{{' + fielddef.field(textFieldDef, { datum: true }) + ' | ' + filter + '}}'
                    };
                }
                else if (type$1.TEMPORAL === textFieldDef.type) {
                    return {
                        template: common.timeTemplate(fielddef.field(textFieldDef, { datum: true }), textFieldDef.timeUnit, config.mark.format, config.mark.shortTimeLabels, config)
                    };
                }
                else {
                    return { field: textFieldDef.field };
                }
            }
            else if (textFieldDef.value) {
                return { value: textFieldDef.value };
            }
        }
        return { value: config.mark.text };
    }
})(text = exports.text || (exports.text = {}));
});
var text_2 = text_1.text;

var tick_1 = createCommonjsModule(function (module, exports) {
var tick;
(function (tick) {
    function markType() {
        return 'rect';
    }
    tick.markType = markType;
    function properties(model) {
        var p = {};
        var config$$1 = model.config();
        var stack = model.stack();
        p.xc = x(model.encoding().x, model.scaleName(channel.X), stack, config$$1);
        p.yc = y(model.encoding().y, model.scaleName(channel.Y), stack, config$$1);
        if (config$$1.mark.orient === config.Orient.HORIZONTAL) {
            p.width = size(model.encoding().size, model.scaleName(channel.SIZE), config$$1, (model.scale(channel.X) || {}).bandSize);
            p.height = { value: config$$1.mark.tickThickness };
        }
        else {
            p.width = { value: config$$1.mark.tickThickness };
            p.height = size(model.encoding().size, model.scaleName(channel.SIZE), config$$1, (model.scale(channel.Y) || {}).bandSize);
        }
        common.applyColorAndOpacity(p, model);
        return p;
    }
    tick.properties = properties;
    function x(fieldDef, scaleName, stack, config$$1) {
        if (fieldDef) {
            if (stack && channel.X === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { suffix: 'end' })
                };
            }
            else if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
            else if (fieldDef.value) {
                return { value: fieldDef.value };
            }
        }
        return { value: config$$1.scale.bandSize / 2 };
    }
    function y(fieldDef, scaleName, stack, config$$1) {
        if (fieldDef) {
            if (stack && channel.Y === stack.fieldChannel) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { suffix: 'end' })
                };
            }
            else if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fielddef.field(fieldDef, { binSuffix: 'mid' })
                };
            }
            else if (fieldDef.value) {
                return { value: fieldDef.value };
            }
        }
        return { value: config$$1.scale.bandSize / 2 };
    }
    function size(fieldDef, scaleName, config$$1, scaleBandSize) {
        if (fieldDef) {
            if (fieldDef.field) {
                return {
                    scale: scaleName,
                    field: fieldDef.field
                };
            }
            else if (fieldDef.value !== undefined) {
                return { value: fieldDef.value };
            }
        }
        if (config$$1.mark.tickSize) {
            return { value: config$$1.mark.tickSize };
        }
        var bandSize = scaleBandSize !== undefined ?
            scaleBandSize :
            config$$1.scale.bandSize;
        return { value: bandSize / 1.5 };
    }
})(tick = exports.tick || (exports.tick = {}));
});
var tick_2 = tick_1.tick;

var markCompiler = {
    area: area_1.area,
    bar: bar_1.bar,
    line: line_1.line,
    point: point_1.point,
    text: text_1.text,
    tick: tick_1.tick,
    rule: rule_1.rule,
    circle: point_1.circle,
    square: point_1.square
};
function parseMark$1(model) {
    if (util$1.contains([mark.LINE, mark.AREA], model.mark())) {
        return parsePathMark(model);
    }
    else {
        return parseNonPathMark(model);
    }
}
var parseMark_1 = parseMark$1;
function parsePathMark(model) {
    var mark$$1 = model.mark();
    var isFaceted = model.parent() && model.parent().isFacet();
    var dataFrom = { data: model.dataTable() };
    var details = detailFields(model);
    var pathMarks = [
        {
            name: model.name('marks'),
            type: markCompiler[mark$$1].markType(),
            from: util$1.extend(isFaceted || details.length > 0 ? {} : dataFrom, { transform: [{ type: 'sort', by: sortPathBy(model) }] }),
            properties: { update: markCompiler[mark$$1].properties(model) }
        }
    ];
    if (details.length > 0) {
        var facetTransform = { type: 'facet', groupby: details };
        var transform = model.stack() ?
            stackTransforms(model, true).concat(facetTransform) :
            [].concat(facetTransform, model.has(channel.ORDER) ? [{ type: 'sort', by: sortBy(model) }] : []);
        return [{
                name: model.name('pathgroup'),
                type: 'group',
                from: util$1.extend(isFaceted ? {} : dataFrom, { transform: transform }),
                properties: {
                    update: {
                        width: { field: { group: 'width' } },
                        height: { field: { group: 'height' } }
                    }
                },
                marks: pathMarks
            }];
    }
    else {
        return pathMarks;
    }
}
function parseNonPathMark(model) {
    var mark$$1 = model.mark();
    var isFaceted = model.parent() && model.parent().isFacet();
    var dataFrom = { data: model.dataTable() };
    var marks = [];
    if (mark$$1 === mark.TEXT &&
        model.has(channel.COLOR) &&
        model.config().mark.applyColorToBackground && !model.has(channel.X) && !model.has(channel.Y)) {
        marks.push(util$1.extend({
            name: model.name('background'),
            type: 'rect'
        }, isFaceted ? {} : { from: dataFrom }, { properties: { update: text_1.text.background(model) } }));
    }
    marks.push(util$1.extend({
        name: model.name('marks'),
        type: markCompiler[mark$$1].markType()
    }, (!isFaceted || model.stack() || model.has(channel.ORDER)) ? {
        from: util$1.extend(isFaceted ? {} : dataFrom, model.stack() ?
            { transform: stackTransforms(model, false) } :
            model.has(channel.ORDER) ?
                { transform: [{ type: 'sort', by: sortBy(model) }] } :
                {})
    } : {}, { properties: { update: markCompiler[mark$$1].properties(model) } }));
    return marks;
}
function sortBy(model) {
    if (model.has(channel.ORDER)) {
        var channelDef = model.encoding().order;
        if (channelDef instanceof Array) {
            return channelDef.map(common.sortField);
        }
        else {
            return common.sortField(channelDef);
        }
    }
    return null;
}
function sortPathBy(model) {
    if (model.mark() === mark.LINE && model.has(channel.PATH)) {
        var channelDef = model.encoding().path;
        if (channelDef instanceof Array) {
            return channelDef.map(common.sortField);
        }
        else {
            return common.sortField(channelDef);
        }
    }
    else {
        var dimensionChannel = model.config().mark.orient === config.Orient.HORIZONTAL ? channel.Y : channel.X;
        var sort = model.sort(dimensionChannel);
        if (sort$1.isSortField(sort)) {
            return '-' + fielddef.field({
                aggregate: encoding.isAggregate(model.encoding()) ? sort.op : undefined,
                field: sort.field
            });
        }
        else {
            return '-' + model.field(dimensionChannel, { binSuffix: 'mid' });
        }
    }
}
function detailFields(model) {
    return [channel.COLOR, channel.DETAIL, channel.OPACITY, channel.SHAPE].reduce(function (details, channel$$1) {
        if (model.has(channel$$1) && !model.fieldDef(channel$$1).aggregate) {
            details.push(model.field(channel$$1));
        }
        return details;
    }, []);
}
function stackTransforms(model, impute) {
    var stackByFields = getStackByFields(model);
    if (impute) {
        return [imputeTransform(model, stackByFields), stackTransform(model, stackByFields)];
    }
    return [stackTransform(model, stackByFields)];
}
function getStackByFields(model) {
    var encoding$$1 = model.encoding();
    return channel.STACK_GROUP_CHANNELS.reduce(function (fields, channel$$1) {
        var channelEncoding = encoding$$1[channel$$1];
        if (encoding.has(encoding$$1, channel$$1)) {
            if (util$1.isArray(channelEncoding)) {
                channelEncoding.forEach(function (fieldDef) {
                    fields.push(fielddef.field(fieldDef));
                });
            }
            else {
                var fieldDef = channelEncoding;
                var scale = model.scale(channel$$1);
                var _field = fielddef.field(fieldDef, {
                    binSuffix: scale && scale.type === scale$4.ScaleType.ORDINAL ? 'range' : 'start'
                });
                if (!!_field) {
                    fields.push(_field);
                }
            }
        }
        return fields;
    }, []);
}
function imputeTransform(model, stackFields) {
    var stack = model.stack();
    return {
        type: 'impute',
        field: model.field(stack.fieldChannel),
        groupby: stackFields,
        orderby: [model.field(stack.groupbyChannel, { binSuffix: 'mid' })],
        method: 'value',
        value: 0
    };
}
function stackTransform(model, stackFields) {
    var stack = model.stack();
    var encoding$$1 = model.encoding();
    var sortby = model.has(channel.ORDER) ?
        (util$1.isArray(encoding$$1[channel.ORDER]) ? encoding$$1[channel.ORDER] : [encoding$$1[channel.ORDER]]).map(common.sortField) :
        stackFields.map(function (field) {
            return '-' + field;
        });
    var valName = model.field(stack.fieldChannel);
    var transform = {
        type: 'stack',
        groupby: [model.field(stack.groupbyChannel, { binSuffix: 'mid' }) || 'undefined'],
        field: model.field(stack.fieldChannel),
        sortby: sortby,
        output: {
            start: valName + '_start',
            end: valName + '_end'
        }
    };
    if (stack.offset) {
        transform.offset = stack.offset;
    }
    return transform;
}
var mark$1 = {
	parseMark: parseMark_1
};

var __extends$2 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UnitModel = (function (_super) {
    __extends$2(UnitModel, _super);
    function UnitModel(spec, parent, parentGivenName) {
        _super.call(this, spec, parent, parentGivenName);
        var providedWidth = spec.width !== undefined ? spec.width :
            parent ? parent['width'] : undefined;
        var providedHeight = spec.height !== undefined ? spec.height :
            parent ? parent['height'] : undefined;
        var mark$$1 = this._mark = spec.mark;
        var encoding$$1 = this._encoding = this._initEncoding(mark$$1, spec.encoding || {});
        this._stack = stack_1.stack(mark$$1, encoding$$1, ((spec.config || {}).mark || {}).stacked);
        var config$$1 = this._config = this._initConfig(spec.config, parent, mark$$1, encoding$$1, this._stack);
        this._scale = this._initScale(mark$$1, encoding$$1, config$$1, providedWidth, providedHeight);
        this._axis = this._initAxis(encoding$$1, config$$1);
        this._legend = this._initLegend(encoding$$1, config$$1);
        this._initSize(mark$$1, this._scale, providedWidth, providedHeight, config$$1.cell, config$$1.scale);
    }
    UnitModel.prototype._initEncoding = function (mark$$1, encoding$$1) {
        encoding$$1 = util$1.duplicate(encoding$$1);
        encoding.forEach(encoding$$1, function (fieldDef, channel$$1) {
            if (!channel.supportMark(channel$$1, mark$$1)) {
                console.warn(channel$$1, 'dropped as it is incompatible with', mark$$1);
                delete fieldDef.field;
                return;
            }
            if (fieldDef.type) {
                fieldDef.type = type$1.getFullName(fieldDef.type);
            }
            if ((channel$$1 === channel.PATH || channel$$1 === channel.ORDER) && !fieldDef.aggregate && fieldDef.type === type$1.QUANTITATIVE) {
                fieldDef.aggregate = aggregate.AggregateOp.MIN;
            }
        });
        return encoding$$1;
    };
    UnitModel.prototype._initConfig = function (specConfig, parent, mark$$1, encoding$$1, stack) {
        var config$$1 = util$1.mergeDeep(util$1.duplicate(config.defaultConfig), parent ? parent.config() : {}, specConfig);
        var hasFacetParent = false;
        while (parent !== null) {
            if (parent.isFacet()) {
                hasFacetParent = true;
                break;
            }
            parent = parent.parent();
        }
        if (hasFacetParent) {
            config$$1.cell = util$1.extend({}, config$$1.cell, config$$1.facet.cell);
        }
        config$$1.mark = config$1.initMarkConfig(mark$$1, encoding$$1, stack, config$$1);
        return config$$1;
    };
    UnitModel.prototype._initScale = function (mark$$1, encoding$$1, config$$1, topLevelWidth, topLevelHeight) {
        return channel.UNIT_SCALE_CHANNELS.reduce(function (_scale, channel$$1) {
            if (encoding.has(encoding$$1, channel$$1) ||
                (channel$$1 === channel.X && encoding.has(encoding$$1, channel.X2)) ||
                (channel$$1 === channel.Y && encoding.has(encoding$$1, channel.Y2))) {
                var channelDef = encoding$$1[channel$$1];
                var scaleSpec = (channelDef || {}).scale || {};
                var _scaleType = scale$5.scaleType(scaleSpec, channelDef, channel$$1, mark$$1);
                var scale = _scale[channel$$1] = util$1.extend({
                    type: _scaleType,
                    round: config$$1.scale.round,
                    padding: config$$1.scale.padding,
                    useRawDomain: config$$1.scale.useRawDomain
                }, scaleSpec);
                scale.bandSize = scale$5.scaleBandSize(scale.type, scale.bandSize, config$$1.scale, channel$$1 === channel.X ? topLevelWidth : topLevelHeight, mark$$1, channel$$1);
            }
            return _scale;
        }, {});
    };
    UnitModel.prototype._initSize = function (mark$$1, scale, width, height, cellConfig, scaleConfig) {
        if (width !== undefined) {
            this._width = width;
        }
        else if (scale[channel.X]) {
            if (scale[channel.X].type !== scale$4.ScaleType.ORDINAL || scale[channel.X].bandSize === scale$4.BANDSIZE_FIT) {
                this._width = cellConfig.width;
            }
        }
        else {
            if (mark$$1 === mark.TEXT) {
                this._width = scaleConfig.textBandWidth;
            }
            else {
                this._width = scaleConfig.bandSize;
            }
        }
        if (height !== undefined) {
            this._height = height;
        }
        else if (scale[channel.Y]) {
            if (scale[channel.Y].type !== scale$4.ScaleType.ORDINAL || scale[channel.Y].bandSize === scale$4.BANDSIZE_FIT) {
                this._height = cellConfig.height;
            }
        }
        else {
            this._height = scaleConfig.bandSize;
        }
    };
    UnitModel.prototype._initAxis = function (encoding$$1, config$$1) {
        return [channel.X, channel.Y].reduce(function (_axis, channel$$1) {
            if (encoding.has(encoding$$1, channel$$1) ||
                (channel$$1 === channel.X && encoding.has(encoding$$1, channel.X2)) ||
                (channel$$1 === channel.Y && encoding.has(encoding$$1, channel.Y2))) {
                var axisSpec = (encoding$$1[channel$$1] || {}).axis;
                if (axisSpec !== null && axisSpec !== false) {
                    _axis[channel$$1] = util$1.extend({}, config$$1.axis, axisSpec === true ? {} : axisSpec || {});
                }
            }
            return _axis;
        }, {});
    };
    UnitModel.prototype._initLegend = function (encoding$$1, config$$1) {
        return channel.NONSPATIAL_SCALE_CHANNELS.reduce(function (_legend, channel$$1) {
            if (encoding.has(encoding$$1, channel$$1)) {
                var legendSpec = encoding$$1[channel$$1].legend;
                if (legendSpec !== null && legendSpec !== false) {
                    _legend[channel$$1] = util$1.extend({}, config$$1.legend, legendSpec === true ? {} : legendSpec || {});
                }
            }
            return _legend;
        }, {});
    };
    Object.defineProperty(UnitModel.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitModel.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    UnitModel.prototype.parseData = function () {
        this.component.data = data$3.parseUnitData(this);
    };
    UnitModel.prototype.parseSelectionData = function () {
    };
    UnitModel.prototype.parseLayoutData = function () {
        this.component.layout = layout.parseUnitLayout(this);
    };
    UnitModel.prototype.parseScale = function () {
        this.component.scale = scale$5.parseScaleComponent(this);
    };
    UnitModel.prototype.parseMark = function () {
        this.component.mark = mark$1.parseMark(this);
    };
    UnitModel.prototype.parseAxis = function () {
        this.component.axis = axis$1.parseAxisComponent(this, [channel.X, channel.Y]);
    };
    UnitModel.prototype.parseAxisGroup = function () {
        return null;
    };
    UnitModel.prototype.parseGridGroup = function () {
        return null;
    };
    UnitModel.prototype.parseLegend = function () {
        this.component.legend = legend$1.parseLegendComponent(this);
    };
    UnitModel.prototype.assembleData = function (data) {
        return data$3.assembleData(this, data);
    };
    UnitModel.prototype.assembleLayout = function (layoutData) {
        return layout.assembleLayout(this, layoutData);
    };
    UnitModel.prototype.assembleMarks = function () {
        return this.component.mark;
    };
    UnitModel.prototype.assembleParentGroupProperties = function (cellConfig) {
        return common.applyConfig({}, cellConfig, common.FILL_STROKE_CONFIG.concat(['clip']));
    };
    UnitModel.prototype.channels = function () {
        return channel.UNIT_CHANNELS;
    };
    UnitModel.prototype.mapping = function () {
        return this.encoding();
    };
    UnitModel.prototype.stack = function () {
        return this._stack;
    };
    UnitModel.prototype.toSpec = function (excludeConfig, excludeData) {
        var encoding$$1 = util$1.duplicate(this._encoding);
        var spec;
        spec = {
            mark: this._mark,
            encoding: encoding$$1
        };
        if (!excludeConfig) {
            spec.config = util$1.duplicate(this._config);
        }
        if (!excludeData) {
            spec.data = util$1.duplicate(this._data);
        }
        return spec;
    };
    UnitModel.prototype.mark = function () {
        return this._mark;
    };
    UnitModel.prototype.has = function (channel$$1) {
        return encoding.has(this._encoding, channel$$1);
    };
    UnitModel.prototype.encoding = function () {
        return this._encoding;
    };
    UnitModel.prototype.fieldDef = function (channel$$1) {
        return this._encoding[channel$$1] || {};
    };
    UnitModel.prototype.field = function (channel$$1, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel$$1);
        if (fieldDef.bin) {
            opt = util$1.extend({
                binSuffix: this.scale(channel$$1).type === scale$4.ScaleType.ORDINAL ? 'range' : 'start'
            }, opt);
        }
        return fielddef.field(fieldDef, opt);
    };
    UnitModel.prototype.dataTable = function () {
        return this.dataName(encoding.isAggregate(this._encoding) ? data$2.SUMMARY : data$2.SOURCE);
    };
    UnitModel.prototype.isUnit = function () {
        return true;
    };
    return UnitModel;
}(model.Model));
var UnitModel_1 = UnitModel;
var unit = {
	UnitModel: UnitModel_1
};

var common = createCommonjsModule(function (module, exports) {
function buildModel(spec$$1, parent, parentGivenName) {
    if (spec.isSomeFacetSpec(spec$$1)) {
        return new facet.FacetModel(spec$$1, parent, parentGivenName);
    }
    if (spec.isLayerSpec(spec$$1)) {
        return new layer.LayerModel(spec$$1, parent, parentGivenName);
    }
    if (spec.isUnitSpec(spec$$1)) {
        return new unit.UnitModel(spec$$1, parent, parentGivenName);
    }
    console.error('Invalid spec.');
    return null;
}
exports.buildModel = buildModel;
exports.STROKE_CONFIG = ['stroke', 'strokeWidth',
    'strokeDash', 'strokeDashOffset', 'strokeOpacity', 'opacity'];
exports.FILL_CONFIG = ['fill', 'fillOpacity',
    'opacity'];
exports.FILL_STROKE_CONFIG = util$1.union(exports.STROKE_CONFIG, exports.FILL_CONFIG);
function applyColorAndOpacity(p, model) {
    var filled = model.config().mark.filled;
    var colorFieldDef = model.encoding().color;
    var opacityFieldDef = model.encoding().opacity;
    if (filled) {
        applyMarkConfig(p, model, exports.FILL_CONFIG);
    }
    else {
        applyMarkConfig(p, model, exports.STROKE_CONFIG);
    }
    var colorValue;
    var opacityValue;
    if (model.has(channel.COLOR)) {
        colorValue = {
            scale: model.scaleName(channel.COLOR),
            field: model.field(channel.COLOR, colorFieldDef.type === type$1.ORDINAL ? { prefix: 'rank' } : {})
        };
    }
    else if (colorFieldDef && colorFieldDef.value) {
        colorValue = { value: colorFieldDef.value };
    }
    if (model.has(channel.OPACITY)) {
        opacityValue = {
            scale: model.scaleName(channel.OPACITY),
            field: model.field(channel.OPACITY, opacityFieldDef.type === type$1.ORDINAL ? { prefix: 'rank' } : {})
        };
    }
    else if (opacityFieldDef && opacityFieldDef.value) {
        opacityValue = { value: opacityFieldDef.value };
    }
    if (colorValue !== undefined) {
        if (filled) {
            p.fill = colorValue;
        }
        else {
            p.stroke = colorValue;
        }
    }
    else {
        p[filled ? 'fill' : 'stroke'] = p[filled ? 'fill' : 'stroke'] ||
            { value: model.config().mark.color };
    }
    if (!p.fill && util$1.contains([mark.BAR, mark.POINT, mark.CIRCLE, mark.SQUARE], model.mark())) {
        p.fill = { value: 'transparent' };
    }
    if (opacityValue !== undefined) {
        p.opacity = opacityValue;
    }
}
exports.applyColorAndOpacity = applyColorAndOpacity;
function applyConfig(properties, config, propsList) {
    propsList.forEach(function (property) {
        var value = config[property];
        if (value !== undefined) {
            properties[property] = { value: value };
        }
    });
    return properties;
}
exports.applyConfig = applyConfig;
function applyMarkConfig(marksProperties, model, propsList) {
    return applyConfig(marksProperties, model.config().mark, propsList);
}
exports.applyMarkConfig = applyMarkConfig;
function numberFormat(fieldDef, format$$1, config, channel$$1) {
    if (fieldDef.type === type$1.QUANTITATIVE && !fieldDef.bin) {
        if (format$$1) {
            return format$$1;
        }
        else if (fieldDef.aggregate === aggregate.AggregateOp.COUNT && channel$$1 === channel.TEXT) {
            return 'd';
        }
        return config.numberFormat;
    }
    return undefined;
}
exports.numberFormat = numberFormat;
function sortField(orderChannelDef) {
    return (orderChannelDef.sort === sort$1.SortOrder.DESCENDING ? '-' : '') +
        fielddef.field(orderChannelDef, { binSuffix: 'mid' });
}
exports.sortField = sortField;
function timeTemplate(templateField, timeUnit, format$$1, shortTimeLabels, config) {
    if (!timeUnit || format$$1) {
        var _format = format$$1 || config.timeFormat;
        return '{{' + templateField + ' | time:\'' + _format + '\'}}';
    }
    else {
        return timeunit.template(timeUnit, templateField, shortTimeLabels);
    }
}
exports.timeTemplate = timeTemplate;
});
var common_1 = common.buildModel;
var common_2 = common.STROKE_CONFIG;
var common_3 = common.FILL_CONFIG;
var common_4 = common.FILL_STROKE_CONFIG;
var common_5 = common.applyColorAndOpacity;
var common_6 = common.applyConfig;
var common_7 = common.applyMarkConfig;
var common_8 = common.numberFormat;
var common_9 = common.sortField;
var common_10 = common.timeTemplate;

function compile(inputSpec) {
    var spec$$1 = spec.normalize(inputSpec);
    var model = common.buildModel(spec$$1, null, '');
    model.parse();
    return assemble(model);
}
var compile_2 = compile;
function assemble(model) {
    var config = model.config();
    var output = util$1.extend({
        width: 1,
        height: 1,
        padding: 'auto'
    }, config.viewport ? { viewport: config.viewport } : {}, config.background ? { background: config.background } : {}, {
        data: [].concat(model.assembleData([]), model.assembleLayout([])),
        marks: [assembleRootGroup(model)]
    });
    return {
        spec: output
    };
}
function assembleRootGroup(model) {
    var rootGroup = util$1.extend({
        name: model.name('root'),
        type: 'group',
    }, model.description() ? { description: model.description() } : {}, {
        from: { data: model.name(data$2.LAYOUT + '') },
        properties: {
            update: util$1.extend({
                width: { field: model.name('width') },
                height: { field: model.name('height') }
            }, model.assembleParentGroupProperties(model.config().cell))
        }
    });
    return util$1.extend(rootGroup, model.assembleGroup());
}
var assembleRootGroup_1 = assembleRootGroup;
var compile_1 = {
	compile: compile_2,
	assembleRootGroup: assembleRootGroup_1
};



var facet$1 = /*#__PURE__*/Object.freeze({

});

var shorthand = createCommonjsModule(function (module, exports) {
exports.DELIM = '|';
exports.ASSIGN = '=';
exports.TYPE = ',';
exports.FUNC = '_';
function shorten(spec) {
    return 'mark' + exports.ASSIGN + spec.mark +
        exports.DELIM + shortenEncoding(spec.encoding);
}
exports.shorten = shorten;
function parse(shorthand, data, config) {
    var split = shorthand.split(exports.DELIM), mark$$1 = split.shift().split(exports.ASSIGN)[1].trim(), encoding$$1 = parseEncoding(split.join(exports.DELIM));
    var spec = {
        mark: mark.Mark[mark$$1],
        encoding: encoding$$1
    };
    if (data !== undefined) {
        spec.data = data;
    }
    if (config !== undefined) {
        spec.config = config;
    }
    return spec;
}
exports.parse = parse;
function shortenEncoding(encoding$$1) {
    return encoding.map(encoding$$1, function (fieldDef, channel) {
        return channel + exports.ASSIGN + shortenFieldDef(fieldDef);
    }).join(exports.DELIM);
}
exports.shortenEncoding = shortenEncoding;
function parseEncoding(encodingShorthand) {
    return encodingShorthand.split(exports.DELIM).reduce(function (m, e) {
        var split = e.split(exports.ASSIGN), enctype = split[0].trim(), fieldDefShorthand = split[1];
        m[enctype] = parseFieldDef(fieldDefShorthand);
        return m;
    }, {});
}
exports.parseEncoding = parseEncoding;
function shortenFieldDef(fieldDef) {
    return (fieldDef.aggregate ? fieldDef.aggregate + exports.FUNC : '') +
        (fieldDef.timeUnit ? fieldDef.timeUnit + exports.FUNC : '') +
        (fieldDef.bin ? 'bin' + exports.FUNC : '') +
        (fieldDef.field || '') + exports.TYPE + type$1.SHORT_TYPE[fieldDef.type];
}
exports.shortenFieldDef = shortenFieldDef;
function shortenFieldDefs(fieldDefs, delim) {
    if (delim === void 0) { delim = exports.DELIM; }
    return fieldDefs.map(shortenFieldDef).join(delim);
}
exports.shortenFieldDefs = shortenFieldDefs;
function parseFieldDef(fieldDefShorthand) {
    var split = fieldDefShorthand.split(exports.TYPE);
    var fieldDef = {
        field: split[0].trim(),
        type: type$1.TYPE_FROM_SHORT_TYPE[split[1].trim()]
    };
    for (var i = 0; i < aggregate.AGGREGATE_OPS.length; i++) {
        var a = aggregate.AGGREGATE_OPS[i];
        if (fieldDef.field.indexOf(a + '_') === 0) {
            fieldDef.field = fieldDef.field.substr(a.toString().length + 1);
            if (a === aggregate.AggregateOp.COUNT && fieldDef.field.length === 0) {
                fieldDef.field = '*';
            }
            fieldDef.aggregate = a;
            break;
        }
    }
    for (var i = 0; i < timeunit.TIMEUNITS.length; i++) {
        var tu = timeunit.TIMEUNITS[i];
        if (fieldDef.field && fieldDef.field.indexOf(tu + '_') === 0) {
            fieldDef.field = fieldDef.field.substr(fieldDef.field.length + 1);
            fieldDef.timeUnit = tu;
            break;
        }
    }
    if (fieldDef.field && fieldDef.field.indexOf('bin_') === 0) {
        fieldDef.field = fieldDef.field.substr(4);
        fieldDef.bin = true;
    }
    return fieldDef;
}
exports.parseFieldDef = parseFieldDef;
});
var shorthand_1 = shorthand.DELIM;
var shorthand_2 = shorthand.ASSIGN;
var shorthand_3 = shorthand.TYPE;
var shorthand_4 = shorthand.FUNC;
var shorthand_5 = shorthand.shorten;
var shorthand_6 = shorthand.parse;
var shorthand_7 = shorthand.shortenEncoding;
var shorthand_8 = shorthand.parseEncoding;
var shorthand_9 = shorthand.shortenFieldDef;
var shorthand_10 = shorthand.shortenFieldDefs;
var shorthand_11 = shorthand.parseFieldDef;



var transform$2 = /*#__PURE__*/Object.freeze({

});

var validate = createCommonjsModule(function (module, exports) {
exports.DEFAULT_REQUIRED_CHANNEL_MAP = {
    text: ['text'],
    line: ['x', 'y'],
    area: ['x', 'y']
};
exports.DEFAULT_SUPPORTED_CHANNEL_TYPE = {
    bar: util$1.toMap(['row', 'column', 'x', 'y', 'size', 'color', 'detail']),
    line: util$1.toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
    area: util$1.toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
    tick: util$1.toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
    circle: util$1.toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
    square: util$1.toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
    point: util$1.toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail', 'shape']),
    text: util$1.toMap(['row', 'column', 'size', 'color', 'text'])
};
function getEncodingMappingError(spec, requiredChannelMap, supportedChannelMap) {
    if (requiredChannelMap === void 0) { requiredChannelMap = exports.DEFAULT_REQUIRED_CHANNEL_MAP; }
    if (supportedChannelMap === void 0) { supportedChannelMap = exports.DEFAULT_SUPPORTED_CHANNEL_TYPE; }
    var mark$$1 = spec.mark;
    var encoding = spec.encoding;
    var requiredChannels = requiredChannelMap[mark$$1];
    var supportedChannels = supportedChannelMap[mark$$1];
    for (var i in requiredChannels) {
        if (!(requiredChannels[i] in encoding)) {
            return 'Missing encoding channel \"' + requiredChannels[i] +
                '\" for mark \"' + mark$$1 + '\"';
        }
    }
    for (var channel in encoding) {
        if (!supportedChannels[channel]) {
            return 'Encoding channel \"' + channel +
                '\" is not supported by mark type \"' + mark$$1 + '\"';
        }
    }
    if (mark$$1 === mark.BAR && !encoding.x && !encoding.y) {
        return 'Missing both x and y for bar';
    }
    return null;
}
exports.getEncodingMappingError = getEncodingMappingError;
});
var validate_1 = validate.DEFAULT_REQUIRED_CHANNEL_MAP;
var validate_2 = validate.DEFAULT_SUPPORTED_CHANNEL_TYPE;
var validate_3 = validate.getEncodingMappingError;

var name$1 = "vega-lite";
var author$1 = "Jeffrey Heer, Dominik Moritz, Kanit \"Ham\" Wongsuphasawat";
var version$1 = "1.3.1";
var collaborators = [
	"Kanit Wongsuphasawat <kanitw@gmail.com> (http://kanitw.yellowpigz.com)",
	"Dominik Moritz <domoritz@cs.washington.edu> (http://www.domoritz.de)",
	"Jeffrey Heer <jheer@uw.edu> (http://jheer.org)"
];
var description$1 = "Vega-lite provides a higher-level grammar for visual analysis, comparable to ggplot or Tableau, that generates complete Vega specifications.";
var main$1 = "src/vl.js";
var types$1 = "src/vl.d.ts";
var bin$4 = {
	vl2png: "./bin/vl2png",
	vl2svg: "./bin/vl2svg",
	vl2vg: "./bin/vl2vg"
};
var directories = {
	test: "test"
};
var scripts$1 = {
	build: "browserify src/vl.ts -p tsify -d -s vl | exorcist vega-lite.js.map > vega-lite.js ",
	postbuild: "uglifyjs vega-lite.js -cm --source-map vega-lite.min.js.map > vega-lite.min.js && npm run schema",
	"build:all": "npm run clean && npm run data && npm run build && npm test && npm run lint && npm run build:images",
	"build:images": "npm run data && scripts/generate-images.sh",
	"build:toc": "bundle exec jekyll build --incremental -q && scripts/generate-toc",
	cover: "npm run pretest && istanbul cover node_modules/.bin/_mocha -- --recursive",
	clean: "rm -f vega-lite.* vega-lite-schema.json & find -E src test site -regex '.*\\.(js|js.map|d.ts)' -delete & rm -rf examples/_diff examples/_original examples/_output examples/images && rm -rf data",
	data: "rsync -r node_modules/vega-datasets/data/* data",
	deploy: "scripts/deploy.sh",
	"deploy:gh": "scripts/deploy-gh.sh",
	lint: "tslint -c tslint.json 'src/**/*.ts' 'test/**/*.ts' --exclude '**/*.d.ts'",
	prestart: "npm run build && npm run data && scripts/index-examples",
	start: "npm run watch & browser-sync start --server --files 'vega-lite.js' --index 'test-gallery.html'",
	poststart: "rm examples/all-examples.json",
	schema: "typescript-json-schema --required true src/spec.ts ExtendedSpec > vega-lite-schema.json",
	presite: "tsc && npm run build && bower install && npm run data && npm run build:toc",
	site: "bundle exec jekyll serve --incremental",
	pretest: "tsc && npm run data",
	test: "npm run schema && mocha --recursive --require source-map-support/register test examples",
	"test:debug": "npm run schema && mocha --debug-brk --recursive --require source-map-support/register test examples",
	"watch:build": "watchify src/vl.ts -p tsify -v -d -s vl -o 'exorcist vega-lite.js.map > vega-lite.js'",
	"watch:test": "nodemon -x 'npm test && npm run lint'",
	watch: "nodemon -x 'npm run build && npm test && npm run lint'",
	"x-compile": "./scripts/examples-compile.sh",
	"x-diff": "./scripts/examples-diff.sh"
};
var repository$1 = {
	type: "git",
	url: "https://github.com/vega/vega-lite.git"
};
var license$1 = "BSD-3-Clause";
var bugs = {
	url: "https://github.com/vega/vega-lite/issues"
};
var homepage = "https://github.com/vega/vega-lite";
var devDependencies$1 = {
	"@types/chai": "^3.4.34",
	"@types/d3": "^3.5.36",
	"@types/json-stable-stringify": "^1.0.29",
	"@types/mocha": "^2.2.32",
	"@types/node": "^6.0.45",
	"browser-sync": "~2.17.3",
	browserify: "~13.1.0",
	chai: "~3.5.0",
	cheerio: "~0.22.0",
	exorcist: "~0.4.0",
	istanbul: "~0.4.5",
	mocha: "~3.1.2",
	nodemon: "~1.11.0",
	"source-map-support": "~0.4.2",
	tsify: "~2.0.2",
	tslint: "~3.15.1",
	typescript: "^2.0.3",
	"typescript-json-schema": "~0.2.0",
	"uglify-js": "~2.7.3",
	vega: "~2.6.3",
	"vega-datasets": "vega/vega-datasets#gh-pages",
	watchify: "~3.7.0",
	"yaml-front-matter": "~3.4.0",
	"z-schema": "~3.18.0"
};
var dependencies$1 = {
	datalib: "~1.7.2",
	"json-stable-stringify": "~1.0.1",
	yargs: "~6.3.0"
};
var _package$1 = {
	name: name$1,
	author: author$1,
	version: version$1,
	collaborators: collaborators,
	description: description$1,
	main: main$1,
	types: types$1,
	bin: bin$4,
	directories: directories,
	scripts: scripts$1,
	repository: repository$1,
	license: license$1,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies$1,
	dependencies: dependencies$1
};

var _package$2 = /*#__PURE__*/Object.freeze({
  name: name$1,
  author: author$1,
  version: version$1,
  collaborators: collaborators,
  description: description$1,
  main: main$1,
  types: types$1,
  bin: bin$4,
  directories: directories,
  scripts: scripts$1,
  repository: repository$1,
  license: license$1,
  bugs: bugs,
  homepage: homepage,
  devDependencies: devDependencies$1,
  dependencies: dependencies$1,
  default: _package$1
});

var require$$23 = getCjsExportFromNamespace(_package$2);

var axis$2 = axis;
var aggregate$1 = aggregate;
var bin$5 = bin$3;
var channel$1 = channel;
var compile$1 = compile_1.compile;
var config$2 = config;
var data$4 = data$2;
var datetime$1 = datetime;
var encoding$1 = encoding;
var facet$2 = facet$1;
var fieldDef = fielddef;
var legend$2 = legend;
var mark$2 = mark;
var scale$6 = scale$4;
var shorthand$1 = shorthand;
var sort$2 = sort$1;
var spec$1 = spec;
var stack = stack_1;
var timeUnit = timeunit;
var transform$3 = transform$2;
var type$2 = type$1;
var util$2 = util$1;
var validate$1 = validate;
var version$2 = require$$23.version;
var vl = {
	axis: axis$2,
	aggregate: aggregate$1,
	bin: bin$5,
	channel: channel$1,
	compile: compile$1,
	config: config$2,
	data: data$4,
	datetime: datetime$1,
	encoding: encoding$1,
	facet: facet$2,
	fieldDef: fieldDef,
	legend: legend$2,
	mark: mark$2,
	scale: scale$6,
	shorthand: shorthand$1,
	sort: sort$2,
	spec: spec$1,
	stack: stack,
	timeUnit: timeUnit,
	transform: transform$3,
	type: type$2,
	util: util$2,
	validate: validate$1,
	version: version$2
};

var $$2 = vega.util.mutator;
var parameter = {
  init: function(el, param, spec) {
    return (rewrite(param, spec), handle(el, param));
  },
  bind: function(param, view) {
    param.dom.forEach(function(el) { el.__vega__ = view; });
    view.onSignal(param.dom[0].name, function(k, v) { param.set(v); });
  }
};
function rewrite(param, spec) {
  var sg = spec.signals || (spec.signals = []);
  for (var i=0; i<sg.length; ++i) {
    if (sg[i].name === param.signal) break;
  }
  if (i === sg.length) {
    sg.push({
      name: param.signal,
      init: param.value
    });
  }
  (param.rewrite || []).forEach(function(path$$1) {
    $$2(path$$1)(spec, {signal: param.signal});
  });
}
function handle(el, param) {
  var p = el.append('div')
    .attr('class', 'vega-param');
  p.append('span')
    .attr('class', 'vega-param-name')
    .text(param.name || param.signal);
  var input = form$1;
  switch (param.type) {
    case 'checkbox': input = checkbox$1; break;
    case 'select':   input = select$1; break;
    case 'radio':    input = radio$1; break;
    case 'range':    input = range$4; break;
  }
  return input(p, param);
}
function form$1(el, param) {
  var fm = el.append('input')
    .on('input', update$6);
  for (var key in param) {
    if (key === 'signal' || key === 'rewrite') continue;
    fm.attr(key, param[key]);
  }
  fm.attr('name', param.signal);
  var node = fm.node();
  return {
    dom: [node],
    set: function(value) { node.value = value; }
  };
}
function checkbox$1(el, param) {
  var cb = el.append('input')
    .on('change', function() { update$6.call(this, this.checked); })
    .attr('type', 'checkbox')
    .attr('name', param.signal)
    .attr('checked', param.value || null)
    .node();
  return {
    dom: [cb],
    set: function(value) { cb.checked = !!value || null; }
  };
}
function select$1(el, param) {
  var sl = el.append('select')
    .attr('name', param.signal)
    .on('change', function() {
      update$6.call(this, this.options[this.selectedIndex].__data__);
    });
  sl.selectAll('option')
    .data(param.options)
   .enter().append('option')
    .attr('value', vg.util.identity)
    .attr('selected', function(x) { return x === param.value || null; })
    .text(vg.util.identity);
  var node = sl.node();
  return {
    dom: [node],
    set: function(value) {
      var idx = param.options.indexOf(value);
      node.selectedIndex = idx;
    }
  };
}
function radio$1(el, param) {
  var rg = el.append('span')
    .attr('class', 'vega-param-radio');
  var nodes = param.options.map(function(option) {
    var id = 'vega-option-' + param.signal + '-' + option;
    var rb = rg.append('input')
      .datum(option)
      .on('change', update$6)
      .attr('id', id)
      .attr('type', 'radio')
      .attr('name', param.signal)
      .attr('value', option)
      .attr('checked', option === param.value || null);
    rg.append('label')
      .attr('for', id)
      .text(option);
    return rb.node();
  });
  return {
    dom: nodes,
    set: function(value) {
      for (var i=0; i<nodes.length; ++i) {
        if (nodes[i].value === value) {
          nodes[i].checked = true;
        }
      }
    }
  };
}
function range$4(el, param) {
  var val = param.value !== undefined ? param.value :
    ((+param.max) + (+param.min)) / 2;
  var rn = el.append('input')
    .on('input', function() {
      lbl.text(this.value);
      update$6.call(this, +this.value);
    })
    .attr('type', 'range')
    .attr('name', param.signal)
    .attr('value', val)
    .attr('min', param.min)
    .attr('max', param.max)
    .attr('step', param.step || vg.util.bins({
      min: param.min,
      max: param.max,
      maxbins: 100
    }).step);
  var lbl = el.append('label')
    .attr('class', 'vega-range')
    .text(val);
  var node = rn.node();
  return {
    dom: [node],
    set: function(value) {
      node.value = value;
      lbl.text(value);
    }
  };
}
function update$6(value) {
  if (value === undefined) value = this.__data__ || d3.event.target.value;
  this.__vega__.signal(this.name, value).update();
}

var post = function(window, url, data) {
  var editor = window.open(url),
      wait = 10000,
      step = 250,
      count = ~~(wait/step);
  function listen(evt) {
    if (evt.source === editor) {
      count = 0;
      window.removeEventListener('message', listen, false);
    }
  }
  window.addEventListener('message', listen, false);
  function send() {
    if (count <= 0) return;
    editor.postMessage(data, '*');
    setTimeout(send, step);
    count -= 1;
  }
  setTimeout(send, step);
};

var config$3 = {
  editor_url: 'http://vega.github.io/vega-editor/',
  source_header: '',
  source_footer: ''
};
var MODES = {
  'vega':      'vega',
  'vega-lite': 'vega-lite'
};
var PREPROCESSOR = {
  'vega':      function(vgjson) { return vgjson; },
  'vega-lite': function(vljson) { return vl.compile(vljson).spec; }
};
function load$1(url, arg, prop, el, callback) {
  vega.util.load({url: url}, function(err, data) {
    var opt;
    if (err || !data) {
      console.error(err || ('No data found at ' + url));
    } else {
      if (!arg) {
        opt = JSON.parse(data);
      } else {
        opt = vega.util.extend({}, arg);
        opt[prop] = prop === 'source' ? data : JSON.parse(data);
      }
      embed(el, opt, callback);
    }
  });
}
function embed(el, opt, callback) {
  var cb = callback || function(){},
      params = [], source, spec, mode, config;
  try {
    if (vega.util.isString(opt)) {
      return load$1(opt, null, null, el, callback);
    } else if (opt.source) {
      source = opt.source;
      spec = JSON.parse(source);
    } else if (opt.spec) {
      spec = opt.spec;
      source = JSON.stringify(spec, null, 2);
    } else if (opt.url) {
      return load$1(opt.url, opt, 'source', el, callback);
    } else {
      spec = opt;
      source = JSON.stringify(spec, null, 2);
      opt = {spec: spec, actions: false};
    }
    mode = MODES[opt.mode] || MODES.vega;
    spec = PREPROCESSOR[mode](spec);
    if (vega.util.isString(opt.config)) {
      return load$1(opt.config, opt, 'config', el, callback);
    } else if (opt.config) {
      config = opt.config;
    }
    var div = d3.select(el)
      .classed('vega-embed', true)
      .html('');
    if (opt.parameters) {
      var elp = opt.parameter_el ? d3.select(opt.parameter_el) : div;
      var pdiv = elp.append('div')
        .attr('class', 'vega-params');
      params = opt.parameters.map(function(p) {
        return parameter.init(pdiv, p, spec);
      });
    }
  } catch (err) { cb(err); }
  vega.parse.spec(spec, config, function(error, chart) {
    if (error) { cb(error); return; }
    try {
      var renderer = opt.renderer || 'canvas',
          actions  = opt.actions || {};
      var view = chart({
        el: el,
        data: opt.data || undefined,
        renderer: renderer
      });
      if (opt.actions !== false) {
        var ctrl = div.append('div')
          .attr('class', 'vega-actions');
        if (actions.export !== false) {
          var ext = (renderer==='canvas' ? 'png' : 'svg');
          ctrl.append('a')
            .text('Export as ' + ext.toUpperCase())
            .attr('href', '#')
            .attr('target', '_blank')
            .attr('download', (spec.name || 'vega') + '.' + ext)
            .on('mousedown', function() {
              this.href = view.toImageURL(ext);
              d3.event.preventDefault();
            });
        }
        if (actions.source !== false) {
          ctrl.append('a')
            .text('View Source')
            .attr('href', '#')
            .on('click', function() {
              viewSource(source);
              d3.event.preventDefault();
            });
        }
        if (actions.editor !== false) {
          ctrl.append('a')
            .text('Open in Vega Editor')
            .attr('href', '#')
            .on('click', function() {
              post(window, embed.config.editor_url, {spec: source, mode: mode});
              d3.event.preventDefault();
            });
        }
      }
      params.forEach(function(p) { parameter.bind(p, view); });
      view.update();
      cb(null, {view: view, spec: spec});
    } catch (err) { cb(err); }
  });
}
function viewSource(source) {
  var header = '<html><head>' + config$3.source_header + '</head>' + '<body><pre><code class="json">';
  var footer = '</code></pre>' + config$3.source_footer + '</body></html>';
  var win = window.open('');
  win.document.write(header + source + footer);
  win.document.title = 'Vega JSON Source';
}
embed.config = config$3;
var embed_1 = embed;

var vegaEmbedV2 = embed_1;

export default vegaEmbedV2;
