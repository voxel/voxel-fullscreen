'use strict';

module.exports = function(game, opts) {
  return new FullscreenPlugin(game, opts);
};
module.exports.pluginInfo = {
  loadAfter: ['voxel-keys']
};

function FullscreenPlugin(game, opts) {
  this.shell = game.shell;

  this.keys = game.plugins.get('voxel-keys');
  if (!this.keys) throw new Error('voxel-fullscreen requires voxel-keys');

  this.element = opts.element !== undefined ? opts.element : document.body;

  this.enable();
}

FullscreenPlugin.prototype.enable = function() {
  this.shell.bind('fullscreen', 'F11');
  this.keys.down.on('fullscreen', this.onToggle = this.toggle.bind(this));
};

FullscreenPlugin.prototype.disable = function() {
  this.keys.down.removeListener('fullscreen', this.onToggle);
  this.shell.unbind('fullscreen');
};

FullscreenPlugin.prototype.isFullscreen = function() {
  return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
};

// enter or exit fullscreen
// note: these methods MUST be only called in response to user input, or it will do nothing (browser feature)
FullscreenPlugin.prototype.toggle = function() {
  if (this.isFullscreen()) {
    console.log('leave fullscreen');
    this.leave();
  } else {
    console.log('enter fullscreen');
    this.enter();
  }
};

FullscreenPlugin.prototype.enter = function() {
  var f = 
    this.element.requestFullscreen ||
    this.element.requestFullScreen ||
    this.element.webkitRequestFullscreen ||
    this.element.webkitRequestFullScreen ||
    this.element.mozRequestFullscreen ||
    this.element.mozRequestFullScreen ||
    this.element.msRequestFullscreen;
  if (!f) throw new Error('no requestFullscreen found on '+this.element);

  f.call(this.element, this.element.ALLOW_KEYBOARD_INPUT)
};

FullscreenPlugin.prototype.leave = function() {
  var f =
    document.exitFullscreen ||
    document.cancelFullscreen ||
    document.cancelFullScreen ||
    document.webkitCancelFullscreen ||
    document.webkitCancelFullScreen ||
    document.mozCancelFullscreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen;
  if (!f) throw new Error('no exitFullscreen found on documnet');

  f.call(document);
};
