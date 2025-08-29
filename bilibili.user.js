// ==UserScript==
// @name         DanmakuPIP Niconico
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show Danmaku comments in Picture-in-Picrure widow
// @author       FoxRefire
// @match        *://*.bilibili.com/*
// @grant        none
// ==/UserScript==

async function loadDanmaku() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/danmaku/dist/danmaku.min.js';
    document.head.appendChild(script);
    return new Promise(r => script.onload = r);
}

function bilibiliParser(danmakuXml) {
    const $xml = new DOMParser().parseFromString(danmakuXml, 'text/xml');
    return [...$xml.getElementsByTagName('d')].map(($d) => {
        const p = $d.getAttribute('p');
        if (p === null || $d.childNodes[0] === undefined) return null;
        const values = p.split(',');
        const mode = ({ 6: 'ltr', 1: 'rtl', 5: 'top', 4: 'bottom' })[values[1]];
        if (!mode) return null;
        const fontSize = Number(values[2]) || 25;
        const color = `000000${Number(values[3]).toString(16)}`.slice(-6);
        return {
            text: $d.childNodes[0].nodeValue,
            mode,
            time: values[0] * 1,
            style: {
                fontSize: `${fontSize}px`,
                color: `#${color}`,
                textShadow: color === '00000'
                ? '-1px -1px #fff, -1px 1px #fff, 1px -1px #fff, 1px 1px #fff'
                : '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',

                font: `${fontSize}px sans-serif`,
                fillStyle: `#${color}`,
                strokeStyle: color === '000000' ? '#fff' : '#000',
                lineWidth: 2.0,
            },
        };
    }).filter((x) => x);
}

async function fetchDanmaku(cid){
    const response=await fetch(`https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`).then(r => r.text());
    return bilibiliParser(response);
}

function getCid(){
    const scripts=document.querySelectorAll('script');
    for (let s of scripts){
        const match=s.textContent.match(/\"cid\":(\d+),/);
        if (match) return match[1];
    }
    return null;
}

async function createCommentsCanvas(video, container, cid) {
    await loadDanmaku()
    const comments = await fetchDanmaku(cid)

    var danmaku = new Danmaku({
        container: container,
        media: video,
        comments: comments,
        engine: 'canvas'
    });
    container.querySelector(".bpx-player-row-dm-wrap").style.display = "none"

    return container.querySelector("canvas")
}

function createStream(videoElm, canvasElm) {
    let newCanvas = document.createElement("canvas")
    let ctx = newCanvas.getContext("2d")

    newCanvas.width = videoElm.videoWidth
    newCanvas.height = videoElm.videoHeight
    draw(newCanvas, ctx, videoElm, canvasElm)
    let videoStream = newCanvas.captureStream(30)

    return videoStream
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

function createVideo(originalVideo, stream) {
    let newVideo = originalVideo.cloneNode()
    newVideo.srcObject = stream
    newVideo.onplay = () => originalVideo.play()
    newVideo.onpause = () => originalVideo.pause()
    newVideo.originalVideo = originalVideo
    newVideo.danmaku = true
    originalVideo.onplay = () => newVideo.play()
    originalVideo.onpause = () => newVideo.pause()
    return newVideo
}

async function main(video, container, cid) {
    let origCanvas = await createCommentsCanvas(video, container, cid)
    console.log(origCanvas)
    let newStream = createStream(video, origCanvas)
    let newVideo = createVideo(video, newStream)
    video.after(newVideo)
    video.style.display = "none"
    origCanvas.style.display = "none"
}

setInterval(() => {
    const video = document.querySelector('video');
    const container = document.querySelector('.bpx-player-dm-mask-wrap');
    const cid = getCid()
    if(video && container && cid && !video.danmaku) {
        video.danmaku = true
        console.log("debug", cid)
        main(video, container, cid)
    }
}, 100)
