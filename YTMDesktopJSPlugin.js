let currentSongInfo, titleElement, authorElement, elapsedSecondsElement, durationElement, progressbarElement, coverImageElement, audioCanvasElement

class YTMDesktopJSPluginEvent extends Event {
    constructor(type, data) {
        super(`YTMDesktopJSPlugin:${type ?? 'default'}`)
        this.data = data ?? {}
    }
}

function parseSeconds(s) {
    const seconds = Number(s)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    let builder = ''
    if (hours > 0) builder = `${hours}:`
    builder = `${builder}${(minutes % 60) > 9 ? minutes % 60 : `0${minutes % 60}`}:`
    builder = `${builder}${(seconds % 60) > 9 ? seconds % 60 : `0${seconds % 60}`}`

    return builder
}

function renderCanvas(audioData, color) {
    const ctx = audioCanvasElement.getContext('2d')

    ctx.clearRect(0, 0, audioCanvasElement.width, audioCanvasElement.height)

    const barWidth = (audioCanvasElement.width / audioData.length) * .8
    const gapWidth = (audioCanvasElement.width / audioData.length) * .2
    let x = 0

    ctx.fillStyle = color ?? 'white'

    for (let i = 0; i < audioData.length; i++) {
        const barHeight = (audioCanvasElement.height / 4) / 256 * audioData[i]

        ctx.fillRect(x, audioCanvasElement.height - barHeight / 2, barWidth, barHeight / 2)

        x += barWidth + gapWidth
    }
}

const webSocket = new WebSocket(`ws://${window.ytmIp ?? '127.0.0.1:8080'}`)

webSocket.addEventListener('message', event => {
    if (event.data) {
        const json = JSON.parse(event.data)
        const data = json.data

        switch (json.action) {
            case 'songInfo':
                if (titleElement) titleElement.innerText = data.title
                if (authorElement) authorElement.innerText = data.artist
                if (elapsedSecondsElement) elapsedSecondsElement.innerText = parseSeconds(data.elapsedSeconds)
                if (durationElement) durationElement.innerText = parseSeconds(data.songDuration)
                if (coverImageElement) coverImageElement.src = data.imageSrc
                if (progressbarElement) {
                    progressbarElement.max = Number(data.songDuration)
                    progressbarElement.value = Number(data.elapsedSeconds)
                    progressbarElement.onchange = event => {
                        let value = event.target.value
                        if (value >= data.elapsedSeconds) value--
                        webSocket.send(JSON.stringify({ action: 'seek', data: { elapsedSeconds: value } }))
                    }
                }

                window.dispatchEvent(new YTMDesktopJSPluginEvent('SongInfo', data))
                break
            case 'audioData':
                if (audioCanvasElement) renderCanvas([...data, ...data.reverse()])

                window.dispatchEvent(new YTMDesktopJSPluginEvent('AudioData', data))
                break
        }
    }
})

function init() {
    titleElement = document.getElementById('ytm_title')
    authorElement = document.getElementById('ytm_author')
    elapsedSecondsElement = document.getElementById('ytm_elapsed_seconds')
    durationElement = document.getElementById('ytm_duration')
    progressbarElement = document.getElementById('ytm_progressbar')
    coverImageElement = document.getElementById('ytm_cover')
    audioCanvasElement = document.getElementById('ytm_audio')
}

window.YTMDesktopJSPlugin = {
    init: init,
    YTMDesktopJSPluginEvent: YTMDesktopJSPluginEvent
}

init()