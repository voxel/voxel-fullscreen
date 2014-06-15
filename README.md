# voxel-fullscreen

Toggle fullscreen with a hotkey (voxel.js plugin)

Uses the `fullscreen` keybinding, default F11. Hitting this key
will enter or exit fullscreen mode via the
[HTML5 Fullscreen API](http://www.w3.org/TR/fullscreen/)
([more details](http://www.sitepoint.com/use-html5-full-screen-api/)).

Known issue: leaving fullscreen may release pointer lock (click to re-acquire).


## How does this plugin compare to...

...browser menu fullscreening (View - Enter Full Screen in Chrome)?
Since this plugin uses the HTML5 Fullscreen API, the document is shown
in its entirety, without any extra browser chrome (e.g., tabs).

...[game-shell](https://github.com/mikolalysenko/game-shell)'s fullscreen property?
This plugin adds a keybinding, and also sets the fullscreen element to
`document.body` instead of just the WebGL canvas.


## License

MIT

