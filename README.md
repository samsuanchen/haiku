# A. 方寸幻彩 簡介

**方寸幻彩** 源自 [Brad Nelson](http://bradn123.github.io/) 的 [Forth Haiku Salon](http://forthsalon.appspot.com/)。
我們擴充了一些功能，包括: meta 設定 charset=UTF-8 使網頁 title 可用中文，隨時備存 程式碼 到 localStorage，每次網頁啟動時 自動 恢復最後更新的 程式碼，顯示滑鼠位置, 程式碼中 左右括號 自動配對，程式碼輸入格寬高可調, 操作平台離線運作， ... 等等。

**方寸幻彩** 用數字與指令 計算，在 時間 t 位置 x,y 的顏色,
R 紅 G 綠 B 藍光的亮度 與 透明度，以產生畫面整體所呈現各種不可思議的奇妙動畫。這樣的作畫概念與方式，**與一般傳統繪圖實在迥然不同**。另外一方面，這樣的表達方式, 針對畫面上每個獨立點隨時間變化的描述, 在千萬 cpu 或 gpu 可以平行處理的世代, 絕對是 **若干年後最有效的電腦程式設計語言**。

# B．基礎

## token

### token 乃是 不含 空格 跳格 或 跳行 的字串

### 某些 token 已定義為 指令

* ( * + - -rot / 2dup : < <= <> = > >= \ abs and atan2 ceil cos drop dup exp floor if log max min mod negate not or over pi pop pow push r@ random rot sin sqrt swap t tan x y z* z+

### 註解指令

* (
* \

* 行中
## 未定定義為 指令 的 token 當作 浮點數 來解析 取其 值 放上 堆疊

### 數值 1

* 1 1. 1.0 1.00 .1e1 .1E1 .10e1 .10E1 0.10e1 0.10E1 都為 1

### 數值 0

* 0 -0 0. .0 0.0 0.00 0e0
* 其他 既非 指令 又非 數值 的 字串 都視同 0


## 0 與 1

## 顏色

### 黑色

* (空的輸入格)
* 0
* 0 0
* 0 0 0
* 0 0 0 1 [黑 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgICA-rKNCQw)
* a a a a


### 三原色

* 1 0 0 1 [紅 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgIDAtLKSCgw)
* 0 1 0 1 [綠 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgICAz7mWCgw)
* 0 0 1 1 [藍 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgIDAtKSDCgw)

* n n n 0 不透明 (完全看不見)

### 亮度 為 0 與 1 的 混合色

* [紫 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgICAy46YCgw)
* [青 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgICA-rKNCgw)
* [黃 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgICA9aeACgw)
* [白 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgIDA1OuNCQw)

### 亮度 在 0 與 1 之間 (小數) 的 混合色

* [灰 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgIDA8o2bCgw)
* [褐 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgICAnJGaCgw)
* [橘 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgIDA1OuNCww)
* [暗黃 - 科科](http://forthsalon.appspot.com/haiku-view/ahBzfmZvcnRoc2Fsb24taHJkchILEgVIYWlrdRiAgIDA8tGKCgw)

### 亮度 在 0 與 1 之外

* 轉為 顏色的數值 小於 0 視同 0
* 轉為 顏色的數值 大於 1 視同 1

## 變數

### 橫座標 x 與 縱座標 y

* x 左到右 從 0 漸增到 1
* y 下到上 從 0 漸增到 1

### 時間秒數 t (產生 動畫)

* t 凌晨起 從 0 漸增的 秒數 (連續的實數值, 不是跳躍的整數值)

* ( * + - -rot / 2dup : < <= <> = > >=
* abs and atan2 ceil cos drop dup exp floor if log max min mod negate not or over pi pop pow push r@ random rot sin sqrt swap t tan x y z* z+




