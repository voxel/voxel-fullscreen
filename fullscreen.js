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

  this.pendingRequest = false;

  this.enable();
}

FullscreenPlugin.prototype.enable = function() {
  // ensure the full screen is covered on WebKit browsers
  // https://github.com/deathcap/voxel-fullscreen/issues/1
  document.body.style.width = '100%';

  this.shell.bind('fullscreen', 'F11');
  //this.keys.down.on('fullscreen', this.onToggle = this.toggle.bind(this));
  document.addEventListener('keydown', this.onKeydown = this.keydown.bind(this));
  this.onChange = this.changed.bind(this);
  document.addEventListener('fullscreenchange', this.onChange);
  document.addEventListener('webkitfullscreenchange', this.onChange);
  document.addEventListener('mozfullscreenchange', this.onChange);
  document.addEventListener('MSFullscreenchange', this.onChange);
  document.addEventListener('click', this.onClick = this.click.bind(this));
};

FullscreenPlugin.prototype.disable = function() {
  document.removeEventListener('keydown', this.onKeydown);
  document.removeEventListener('click', this.onClick);
  document.removeEventListener('MSFullscreenchange', this.onChange);
  document.removeEventListener('mozfullscreenchange', this.onChange);
  document.removeEventListener('webkitfullscreenchange', this.onChange);
  document.removeEventListener('fullscreenchange', this.onChange);
  //this.keys.down.removeListener('fullscreen', this.onToggle);
  this.shell.unbind('fullscreen');
};

FullscreenPlugin.prototype.isFullscreen = function() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement);
  //return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen; // non-standard
};

FullscreenPlugin.prototype.keydown = function(ev) {
  var code = ev.keyCode;
  var bindingNames = this.keys.getBindingsNames(code);
  if (bindingNames.indexOf('fullscreen') == -1) return; // not us
  // TODO: does this event need to be debounced? repeatedly sent when key is down,
  // we could track keyup like voxel-keys to avoid repeat handling, but doesn't seem
  // to be a problem right now (if user really wants to hold F11 to keep toggling...)

  console.log('fullscreen keydown');
  this.toggle();
};

// try to enter or exit fullscreen
// note: if not called in response to user input, entering will be delayed until the next
// time the user clicks their mouse, which counts as required user interaction (browser feature)
FullscreenPlugin.prototype.toggle = function() {
  if (this.isFullscreen()) {
    console.log('fullscreen leaving');
    this.leave();
  } else {
    console.log('fullscreen entering');
    this.enter();
  }
};

FullscreenPlugin.prototype.enter = function() {
  // request might be denied: cleared in change(), or replayed in click()
  this.pendingRequest = true;

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

  // leaving fullscreen for some reason releases pointer lock,
  // but we can't re-request it here since it wasn't a mouse action :(
  //this.shell.pointerLock = true;
};

FullscreenPlugin.prototype.changed = function() {
  console.log('fullscreen changed', this.isFullscreen());
  if (this.isFullscreen() && this.pendingRequest) {
    this.pendingRequest = false; // fullfilled!
  }
};

FullscreenPlugin.prototype.click = function() {
  if (this.pendingRequest) {
    // this is our chance to try again
    this.enter();
  }
};
