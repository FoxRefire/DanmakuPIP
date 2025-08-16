// ==UserScript==
// @name        DanmakuPIP Niconico
// @namespace   Violentmonkey Scripts
// @match       https://www.nicovideo.jp/watch/*
// @grant       none
// @version     1.0
// @author      FoxRefire
// @description Show Danmaku comments in Picture-in-Picrure widow
// ==/UserScript==

async function waitTargetElements() {
    return new Promise(resolve => {
        let interval = setInterval(_ => {
            let videoElm = document.querySelector("div[data-name=content] video")
            let canvasElm = document.querySelector("div[data-name=comment] canvas")
            if(canvasElm && videoElm.videoWidth) {
                resolve([videoElm, canvasElm])
                clearInterval(interval)
            }
        }, 100)
    })
}

async function main() {
    let originalElems = await waitTargetElements()
    let newSource = createSource(originalElems)
    console.log(newSource)

    let newVideo = createVideo(originalElems[0], newSource)
    console.log(newVideo)
    originalElems[0].after(newVideo)
    originalElems.map(e => e.remove())

}

function createSource(originalElems) {
    let newCanvas = document.createElement("canvas")
    let ctx = newCanvas.getContext("2d")

    newCanvas.width = originalElems[0].videoWidth
    newCanvas.height = originalElems[0].videoHeight
    draw(newCanvas, ctx, originalElems)
    let videoStream = newCanvas.captureStream(30)
    let audioStream = getAudioStream(originalElems[0])
    let mixedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
    ])
    let mediaSource = new MediaSource()
    mediaSource.addEventListener('sourceopen', () => {
        let sourceBuffer = mediaSource.addSourceBuffer('video/webm')
        mediaSource.duration = originalElems[0].duration

        originalElems[0].recorder = new MediaRecorder(mixedStream, { mimeType: 'video/webm' })
        originalElems[0].recorder.ondataavailable = e => {
            if (e && e.data && e.data.size > 0) {
                e.data.arrayBuffer().then(buf => sourceBuffer.appendBuffer(buf))
            }
        }
        originalElems[0].recorder.start(500)
        originalElems[0].recorder.pause()
    })

    return mediaSource
}

function createVideo(originalVideo, mediaSource) {
    let newVideo = originalVideo.cloneNode()
    newVideo.src = URL.createObjectURL(mediaSource)
    newVideo.onplay = () => {
        originalVideo.play()
        originalVideo.recorder.resume()
    }
    newVideo.onpause = () => {
        originalVideo.pause()
        originalVideo.recorder.pause()
    }
    originalVideo.onplay = () => newVideo.play()
    originalVideo.onpause = () => newVideo.pause()
    return newVideo
}

function draw(canvas, ctx, originalElems) {
    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(originalElems[0], 0, 0, canvas.width, canvas.height)
        ctx.drawImage(originalElems[1], 0, 0, canvas.width, canvas.height)
    } finally {
        requestAnimationFrame(_ => draw(canvas, ctx, originalElems))
    }
}

function getAudioStream(originalVideo) {
    let audioContext = new AudioContext()
    let dest = audioContext.createMediaStreamDestination()
    let originalAudio = audioContext.createMediaElementSource(originalVideo)
    originalAudio.connect(dest)
    return dest.stream
}

main()
