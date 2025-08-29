## このガイドについて
MediaStreamの制約により、この拡張機能を有効にするとFirefoxのPiPウィンドウでシークバーが機能しなくなります。

このガイドではこの問題を修正する方法を解説します

## STEP1(omni.jaのパッチ)
このステップは通常版Firefoxでのみ必要です。

Firefox Nightly、Developer Edition、Floorp、Zen、Librewolf、Waterfoxをご使用の方はこのステップを省略してください


1. omni.jaのパスを見つける

omni.jaはFirefoxのインストールディレクトリの直下に配置されているはずです。

一般的なパスは次の通りです
```
C:/Program Files/Mozilla Firefox/omni.ja
C:/Program Files (x86)/Mozilla Firefox/omni.ja
/Applications/Firefox.app/omni.ja
/usr/lib/firefox/omni.ja
/usr/lib64/firefox/omni.ja
/opt/firefox/omni.ja
```
`about:support`ページからもFirefoxのインストールディレクトリを確認できます。
  
2.パッチを実行する

[`omniPatcher.py`](./omniPatcher.py)をダウンロードして次のように実行します。
```shell
python omniPatcher.py /path/to/omni.ja
```

3.スタートアップキャッシュを削除
変更を反映するために`about:support`を開き、右上のボタンからスタートアップキャッシュを削除してください。

## STEP2(about:configの変更)

1.about:configを開く

アドレスバーに`about:config`と入力します

2.値の変更

`xpinstall.signatures.required`、`extensions.experiments.enabled`の両方の値が`false`に設定されているか確認してください

なっていない場合は変更し、項目が無い場合は真偽値を作成してください。

## STEP3(カスタムビデオラッパーのインストール)

1.ラッパーのダウンロード

[customWrappers.xpi](./customWrappers.xpi)をダウンロードして保存します

このファイルはFirefoxの内部拡張機能のフォークです。また、拡張機能本体とは異なり、MPLによってライセンスされています。

2.インストール

`about:addons`を開き、ダウンロードしたラッパー拡張機能をドラッグしてインストールします

3.ブラウザの再起動

お疲れ様でした！

インストール後、Firefoxを再起動するとこの拡張機能を有効にしてもPiPウィンドウにシークバーが表示されるようになっているはずです