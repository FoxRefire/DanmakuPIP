## 關於本指南
由於MediaStream的限制，啟用此擴充功能會導致Firefox的PiP視窗中的搜尋列無法正常運作。

本指南說明如何修復此問題。

## 步驟1 (omni.ja修補)
此步驟僅適用於一般版Firefox。

如果您使用Firefox Nightly、Developer Edition、Floorp、Zen、Librewolf或Waterfox，可以跳過此步驟。

1. 找到omni.ja路徑

omni.ja應該位於Firefox安裝目錄的直屬位置。

常見路徑如下：
```
C:/Program Files/Mozilla Firefox/omni.ja
C:/Program Files (x86)/Mozilla Firefox/omni.ja
/Applications/Firefox.app/omni.ja
/usr/lib/firefox/omni.ja
/usr/lib64/firefox/omni.ja
/opt/firefox/omni.ja
```
您也可以從`about:support`頁面檢查Firefox的安裝目錄。

2. 執行修補

下載[`omniPatcher.py`](./omniPatcher.py)並按以下方式執行：
```shell
python omniPatcher.py /path/to/omni.ja
```

3. 清除啟動快取
為了反映變更，請開啟`about:support`並從右上角的按鈕清除啟動快取。

## 步驟2 (about:config的變更)

1. 開啟about:config

在網址列中輸入`about:config`。

2. 變更數值

確認`xpinstall.signatures.required`和`extensions.experiments.enabled`兩者的數值都設定為`false`。

如果沒有，請變更它們。如果項目不存在，請建立布林值。

## 步驟3 (自訂影片包裝器的安裝)

1. 下載包裝器

下載並儲存[`customWrappers.xpi`](./customWrappers.xpi)。

這個檔案是Firefox內部擴充功能的分叉。與擴充功能本身不同，它以MPL許可證發布。

2. 安裝

開啟`about:addons`並拖曳下載的包裝器擴充功能來安裝。

3. 重新啟動瀏覽器

辛苦了！

安裝後，重新啟動Firefox，即使啟用此擴充功能，PiP視窗中也應該會顯示搜尋列。
