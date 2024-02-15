'use strict';

const execBuffer = require('exec-buffer');
const isPng = require('is-png');
const optipng = require('optipng-bin');
module.exports = options => async buffer => {
  options = {
    optimizationLevel: 3,
    bitDepthReduction: true,
    colorTypeReduction: true,
    paletteReduction: true,
    interlaced: false,
    errorRecovery: true,
    ...options
  };
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('Expected a buffer');
  }
  if (!isPng(buffer)) {
    return buffer;
  }
  const arguments_ = ['-strip', 'all', '-clobber', '-o', options.optimizationLevel, '-out', execBuffer.output];
  if (options.errorRecovery) {
    arguments_.push('-fix');
  }
  if (!options.bitDepthReduction) {
    arguments_.push('-nb');
  }
  if (typeof options.interlaced === 'boolean') {
    arguments_.push('-i', options.interlaced ? '1' : '0');
  }
  if (!options.colorTypeReduction) {
    arguments_.push('-nc');
  }
  if (!options.paletteReduction) {
    arguments_.push('-np');
  }
  arguments_.push(execBuffer.input);
  return execBuffer({
    input: buffer,
    bin: optipng,
    args: arguments_
  });
};