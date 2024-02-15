"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isJpg;
function isJpg(buffer) {
  if (!buffer || buffer.length < 3) {
    return false;
  }
  return buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
}