let enabledScripts = await chrome.storage.local.get("enabledScripts").then(r => r.enabledScripts) || ["nicovideo", "bilibili"]
enabledScripts.forEach(script => {
    const checkbox = document.querySelector(`input[name="scripts"][value="${script}"]`);
    if (checkbox) {
        checkbox.checked = true;
    }
});
config.addEventListener("change", async () => {
    const checkboxes = document.querySelectorAll('input[name="scripts"]:checked');    
    const values = Array.from(checkboxes).map(cb => cb.value);
    await chrome.storage.local.set({ enabledScripts: values });
});

fixSeekbar.addEventListener("click", () => {
    // Get user's language preference
    const userLanguage = navigator.language || navigator.userLanguage;

    // Determine which documentation to open based on language
    let docUrl = "docs/InstallWrappers_en.html"; // Default to English

    if (userLanguage.startsWith("ja")) {
        // Japanese
        docUrl = "docs/InstallWrappers_ja.html";
    } else if (userLanguage.startsWith("zh")) {
        docUrl = "docs/InstallWrappers_zh.html";
    }

    // Open the appropriate documentation
    chrome.tabs.create({ url: docUrl });
});
