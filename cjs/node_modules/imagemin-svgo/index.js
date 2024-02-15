"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodeBuffer = require("node:buffer");
var _isSvg = _interopRequireDefault(require("is-svg"));
var _svgo = require("svgo");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const imageminSvgo = options => async buffer => {
  options = {
    multipass: true,
    ...options
  };
  if (!(0, _isSvg.default)(buffer)) {
    return Promise.resolve(buffer);
  }
  if (_nodeBuffer.Buffer.isBuffer(buffer)) {
    buffer = buffer.toString();
  }
  const {
    data
  } = (0, _svgo.optimize)(buffer, options);
  return _nodeBuffer.Buffer.from(data);
};
var _default = exports.default = imageminSvgo;