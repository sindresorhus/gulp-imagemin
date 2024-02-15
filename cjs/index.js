"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = gulpImagemin;
exports.svgo = exports.optipng = exports.mozjpeg = exports.gifsicle = void 0;
require("core-js/modules/esnext.set.add-all.js");
require("core-js/modules/esnext.set.delete-all.js");
require("core-js/modules/esnext.set.difference.js");
require("core-js/modules/esnext.set.every.js");
require("core-js/modules/esnext.set.filter.js");
require("core-js/modules/esnext.set.find.js");
require("core-js/modules/esnext.set.intersection.js");
require("core-js/modules/esnext.set.is-disjoint-from.js");
require("core-js/modules/esnext.set.is-subset-of.js");
require("core-js/modules/esnext.set.is-superset-of.js");
require("core-js/modules/esnext.set.join.js");
require("core-js/modules/esnext.set.map.js");
require("core-js/modules/esnext.set.reduce.js");
require("core-js/modules/esnext.set.some.js");
require("core-js/modules/esnext.set.symmetric-difference.js");
require("core-js/modules/esnext.set.union.js");
require("core-js/modules/esnext.weak-map.delete-all.js");
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeProcess = _interopRequireDefault(require("node:process"));
var _index = _interopRequireDefault(require("./node_modules/pretty-bytes/index.js"));
var _index2 = _interopRequireDefault(require("./node_modules/chalk/source/index.js"));
var _index3 = _interopRequireDefault(require("./node_modules/imagemin/index.js"));
var _index4 = _interopRequireDefault(require("./node_modules/plur/index.js"));
var _index5 = require("./node_modules/gulp-plugin-extras/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const PLUGIN_NAME = 'gulp-imagemin';
const defaultPlugins = ['gifsicle', 'mozjpeg', 'optipng', 'svgo'];
const loadPlugin = async (pluginName, ...arguments_) => {
  try {
    const {
      default: plugin
    } = await (specifier => new Promise(r => r(specifier)).then(s => _interopRequireWildcard(require(s))))(`./node_modules/imagemin-${pluginName}/index.js`);
    return plugin(...arguments_);
  } catch (error) {
    console.log('er', error);
    console.log(`${PLUGIN_NAME}: Could not load default plugin \`${pluginName}\``);
  }
};
const exposePlugin = async plugin => (...arguments_) => loadPlugin(plugin, ...arguments_);
const getDefaultPlugins = async () => Promise.all(defaultPlugins.flatMap(plugin => loadPlugin(plugin)));
function gulpImagemin(plugins, options) {
  if (typeof plugins === 'object' && !Array.isArray(plugins)) {
    options = plugins;
    plugins = undefined;
  }
  options = {
    // TODO: Remove this when Gulp gets a real logger with levels
    silent: _nodeProcess.default.argv.includes('--silent'),
    verbose: _nodeProcess.default.argv.includes('--verbose'),
    ...options
  };
  const validExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg']);
  let totalBytes = 0;
  let totalSavedBytes = 0;
  let totalFiles = 0;
  return (0, _index5.gulpPlugin)('gulp-imagemin', async file => {
    if (!validExtensions.has(_nodePath.default.extname(file.path).toLowerCase())) {
      if (options.verbose) {
        console.log(`${PLUGIN_NAME}: Skipping unsupported image ${_index2.default.blue(file.relative)}`);
      }
      return file;
    }
    if (Array.isArray(plugins)) {
      plugins = await Promise.all(plugins);
    }
    const localPlugins = plugins ?? (await getDefaultPlugins());
    const data = await _index3.default.buffer(file.contents, {
      plugins: localPlugins
    });
    const originalSize = file.contents.length;
    const optimizedSize = data.length;
    const saved = originalSize - optimizedSize;
    const percent = originalSize > 0 ? saved / originalSize * 100 : 0;
    const savedMessage = `saved ${(0, _index.default)(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
    const message = saved > 0 ? savedMessage : 'already optimized';
    if (saved > 0) {
      totalBytes += originalSize;
      totalSavedBytes += saved;
      totalFiles++;
    }
    if (options.verbose) {
      console.log(`${PLUGIN_NAME}:`, _index2.default.green('✔ ') + file.relative + _index2.default.gray(` (${message})`));
    }
    file.contents = data;
    return file;
  }, {
    async *onFinish() {
      // eslint-disable-line require-yield
      if (!options.silent) {
        const percent = totalBytes > 0 ? totalSavedBytes / totalBytes * 100 : 0;
        let message = `Minified ${totalFiles} ${(0, _index4.default)('image', totalFiles)}`;
        if (totalFiles > 0) {
          message += _index2.default.gray(` (saved ${(0, _index.default)(totalSavedBytes)} - ${percent.toFixed(1).replace(/\.0$/, '')}%)`);
        }
        console.log(`${PLUGIN_NAME}:`, message);
      }
    }
  });
}
const gifsicle = exports.gifsicle = exposePlugin('gifsicle');
const mozjpeg = exports.mozjpeg = exposePlugin('mozjpeg');
const optipng = exports.optipng = exposePlugin('optipng');
const svgo = exports.svgo = exposePlugin('svgo');