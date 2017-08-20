# homeapp


## ■環境コマンド
> PM2を導入しているためcronや起動停止は下記で行う

#### ・サーバー起動/停止
```
pm2 start app # 起動
pm2 stop app # 停止
```
#### ・投資指標取得ファイルのcron起動

```
pm2 start cron/get_stock_data.js # 起動
pm2 stop cron/get_stock_data.js # 停止
```
#### ・データベース初期化
```
# データのバックアップ
node reset_database.js # DB初期化
# バックアップデータ導入
# 不足ファイルダウンロード
```
#### ・その他
```
# 全ファイルの投資指標データの取り込み
node script/save_stock_prices_all.js
# 投資指標データの取り込み
node script/save_stock_prices_day.js ファイル名
```
