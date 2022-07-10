# YTMDesktopJSPlugin

default view

```html
<div id="ytmDesktop">
    <div id="song_cover">
        <img alt="cover" id="ytm_cover" />
        <canvas id="ytm_audio" width="1000" height="1000"></canvas>
    </div>
    <div id="song_title">
        <span id="ytm_title"></span><span id="ytm_spacer">-</span><span id="ytm_author"></span>
    </div>
    <div id="song_time">
        <span id="ytm_elapsed_seconds"></span>
        <input title="progress" type="range" id="ytm_progressbar"></progress>
        <span id="ytm_duration"></span>
    </div>
    <script src="YTMDesktopJSPlugin.js"></script>
    <link href="YTMDesktopJSPlugin.css" rel="stylesheet">
</div>
```

## config

```javascript
window.ytmIp // custom ip, default is 127.0.0.1:8080
```