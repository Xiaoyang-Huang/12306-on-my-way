# 12306 on my way
## 这不是一个抢票工具! 但他很大概率可以帮你买到回家的票!
### 使用方式:
> * 安装插件([下载crx文件](https://raw.githubusercontent.com/Xiaoyang-Huang/12306-on-my-way/master/www/www.crx),目前只支持chrome) 
> * **登录**12306
> * 打开插件,输入你的**出发地**和**目的地**以及**出发日期**
> * **勾选**你想乘坐的车次
> * 点击**开始查票**
> * 在你满意的票段后点击**购票**
***
### 工作原理:
> 这并不是一个抢票工具!
> 
> 这个工具会帮你查询你想坐的车次所有区段的票
>> #### 例如:
>> 你需要从衡阳出发到上海,结果发现没有票,但衡阳到上海的车次大多数**始发站都不是衡阳**,于是你可以通过这个工具扫描从始发站到上海以及上海以后的所有站点的车票,铁道部放票一般都是**分段**放的,所以在**某些大站是可能有余票的**
>>
>> 假设你搜到了一张K512,**海口**到**上海**的票,**经过衡阳**,那么你买下来后可以**直接从衡阳**上车.这是**符合铁道部规定的**,因为你购买的乘坐区间并没有少于你的乘坐区间
>
> **需要注意的是,你通过此方式所购得的车票,因为乘坐区间大于你原先的区间,所以票价也会贵上一些,非紧急出行者还是老实刷票吧...**

### 业余时间开发的小工具...一些用户体验还没来得及完善...请求等待和失败都没有处理...如果你发现插件不工作,请刷新页面并到这来提交BUG...