async function main() {
    let enabledScripts = await chrome.storage.local.get("enabledScripts").then(r => r.enabledScripts) || []
    let origin = location.origin
    if (enabledScripts.includes("nicovideo") && origin.includes("nicovideo.jp")) {
        applyScript("nicovideo");
    }
    if (enabledScripts.includes("bilibili") && origin.includes("bilibili.com")) {
        applyScript("bilibili");
    }
}

function applyScript(scriptName) {
    if(document instanceof HTMLDocument) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = chrome.runtime.getURL(`${scriptName}.user.js`);
        (document.head || document.documentElement).appendChild(script);
    }
}

main();