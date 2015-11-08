# A. 方寸彩繪 簡介

直接開啟 [方寸幻彩](http://rawgit.com/samsuanchen/haiku/master/) 或 [http://rawgit.com/samsuanchen/haiku/master/](http://rawgit.com/samsuanchen/haiku/master/) 網頁就可在雲端啟動這奇妙動畫的操作平台，看到一個範例，一面國旗迎風飄揚。
 
**方寸彩繪** 源自 [Brad Nelson](http://bradn123.github.io/) 的 [Forth Haiku Salon](http://forthsalon.appspot.com/), 也可參考 [Forth Haiku for the Impatient](https://docs.google.com/presentation/d/1EIHuFRrKioeZCgfAGFLg7IqBDGzbiQ7IMDmWt2T8jok/edit#slide=id.g7b3b339a9_08)。
為了在台灣向普羅大眾有效推廣，我們簡化了操作畫面，擴充了操作功能，並中文化，包括: meta 設定 charset=UTF-8 使網頁 title 可用中文，隨時備存 程式碼 到 localStorage，每次網頁啟動時 自動 恢復最後修訂的 程式碼 與 scroll 位置，顯示滑鼠位置，程式碼中 左括號指令 自動配對到對應的 右括號，程式碼輸入格寬高操作者可自行調整並以 localStorage 記住，直接複製網頁 [index.html](https://github.com/samsuanchen/haiku/blob/master/index.html) 加上所需 [haiku.css](https://github.com/samsuanchen/haiku/blob/master/haiku.css)，[haiku.js](https://github.com/samsuanchen/haiku/blob/master/haiku.js)，與 [jquery.js](https://github.com/samsuanchen/haiku/blob/master/jquery.js) 就可離線運作， ... 等等。
 
**方寸彩繪** 用 數字 與 [指令](http://forthsalon.appspot.com/word-list)，計算 在時間 t 位置 x,y 的顏色,
R 紅 G 綠 B 藍光的亮度 與 透明度，以產生畫面整體所呈現各種不可思議的奇妙動畫。這樣的作畫概念與方式，**與一般電腦繪圖迥然不同**。另外一方面，這樣的表達方式, 針對畫面上每個獨立點隨時間變化的描述, 在千萬 cpu 或 gpu 可以平行處理的世代, 絕對是 **將來最有效的電腦程式設計語言**。

# B. 基本概念

## B.1. token 字串
我們所謂的 token 乃指專 不含廣義空格 (空格 跳格 或 跳行) 的字串。 而我們所謂的 程式碼 也就是用許多這樣的 token 字串構成。

## B.2. 某些 token 已事先定義為 指令
下列 [這 49 個 token](http://forthsalon.appspot.com/word-list) 字串　都已事先被定義為 [指令](http://forthsalon.appspot.com/word-list)。

( * + - -rot / 2dup : < <= <> = > >= \ abs and atan2 ceil cos drop dup exp floor if log max min mod negate not or over pi pop pow push r@ random rot sin sqrt swap t tan x y z* z+

## B.3. 反斜線 與 左刮號 指令 作 註解
* \　反斜線空格後, 直到　列尾,　文字忽略 當作註解
* (　左刮號空格後,　直到對應的　右刮號 token, 文字忽略 也作註解

## B.4. 未定定義 的 token 當作 數值 來解析
* 例如 表示 1 的 token 可以有許多不同的寫法: 1 1. 1.0 1.00 .1e1 .1E1 .10e1 .10E1 0.10e1 0.10E1 等等都為 1。

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




