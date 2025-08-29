// ==UserScript==
// @name        DanmakuPIP Niconico
// @namespace   Violentmonkey Scripts
// @match       https://www.nicovideo.jp/watch/*
// @grant       none
// @version     1.0
// @author      FoxRefire
// @description Show Danmaku comments in Picture-in-Picrure widow
// ==/UserScript==

async function main() {
    setInterval(_ => {
        let videoElm = document.querySelector("div[data-name=content] video")
        let canvasElm = document.querySelector("div[data-name=comment] canvas")
        if(canvasElm && videoElm.videoWidth && !videoElm.originalVideo) {
            run(videoElm, canvasElm)
        }
    }, 100)
}

async function run(videoElm, canvasElm) {
    let newStream = createStream(videoElm, canvasElm)

    let newVideo = createVideo(videoElm, newStream)
    console.log(newVideo)
    videoElm.after(newVideo)
    videoElm.remove()
    canvasElm.style.display = "none"
}

function createStream(videoElm, canvasElm) {
    let newCanvas = document.createElement("canvas")
    let ctx = newCanvas.getContext("2d")

    newCanvas.width = videoElm.videoWidth
    newCanvas.height = videoElm.videoHeight
    draw(newCanvas, ctx, videoElm, canvasElm)
    let videoStream = newCanvas.captureStream(30)
    let audioStream = getAudioStream(videoElm)
    let mixedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
    ])

    return mixedStream
}

function createVideo(originalVideo, stream) {
    let newVideo = originalVideo.cloneNode()
    newVideo.srcObject = stream
    newVideo.onplay = () => originalVideo.play()
    newVideo.onpause = () => originalVideo.pause()
    newVideo.originalVideo = originalVideo
    originalVideo.onplay = () => newVideo.play()
    originalVideo.onpause = () => newVideo.pause()
    return newVideo
}

function draw(canvas, ctx, videoElm, canvasElm) {
    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(videoElm, 0, 0, canvas.width, canvas.height)
        ctx.drawImage(canvasElm, 0, 0, canvas.width, canvas.height)
    } finally {
        requestAnimationFrame(_ => draw(canvas, ctx, videoElm, canvasElm))
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
