## About This Guide
Due to MediaStream constraints, enabling this extension will cause the seek bar to stop functioning in Firefox's PiP window.

This guide explains how to fix this issue.

## STEP1 (omni.ja Patching)
This step is only required for regular Firefox.

If you are using Firefox Nightly, Developer Edition, Floorp, Zen, Librewolf, or Waterfox, you can skip this step.

1. Find the omni.ja path

omni.ja should be located directly under Firefox's installation directory.

Common paths are as follows:
```
C:/Program Files/Mozilla Firefox/omni.ja
C:/Program Files (x86)/Mozilla Firefox/omni.ja
/Applications/Firefox.app/omni.ja
/usr/lib/firefox/omni.ja
/usr/lib64/firefox/omni.ja
/opt/firefox/omni.ja
```
You can also check Firefox's installation directory from the `about:support` page.

2. Apply the patch

Download [`omniPatcher.py`](./omniPatcher.py) and run it as follows:
```shell
python omniPatcher.py /path/to/omni.ja
```

3. Clear startup cache
To reflect the changes, open `about:support` and clear the startup cache from the button in the top right.

## STEP2 (about:config Changes)

1. Open about:config

Type `about:config` in the address bar.

2. Change values

Make sure both `xpinstall.signatures.required` and `extensions.experiments.enabled` are set to `false`.

If they are not, change them. If the items don't exist, create boolean values.

## STEP3 (Custom Video Wrappers Installation)

1. Download the wrappers

Download and save [`customWrappers.xpi`](./customWrappers.xpi).

This file is a fork of Firefox's internal extension. Unlike the extension itself, it is licensed under the MPL.

2. Install

Open `about:addons` and drag and drop the downloaded wrapper extension to install it.

3. Restart the browser

Great job!

After installation, restart Firefox and you should see the seek bar in the PiP window even when this extension is enabled.
