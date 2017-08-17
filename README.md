# homeapp

## データベース初期化
* DB初期化
```
node reset_database.js
```
* バックアップデータ導入

* 不足ファイルダウンロード

## 投資指標データcron
* 投資指標取得ファイルのcron起動

## 起動/停止
* PM2を導入しているため下記で起動
```
pm2 start app.json
```
* 停止
```
pm2 list
pm2 stop app
```
