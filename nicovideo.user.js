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
    let newStream = createStream(originalElems)

    let newVideo = createVideo(originalElems[0], newStream)
    console.log(newVideo)
    originalElems[0].after(newVideo)
    originalElems.map(e => e.remove())

}

function createStream(originalElems) {
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
