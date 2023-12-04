## 阿里云盘每日签到

基于[金山云文档](https://www.kdocs.cn/)实现每日自动签到阿里云盘

- 无需服务器/Qx、surge 等代理工具
- 支持多账号
- 目前仅可以邮件提醒

## 使用方法

### 第一步：获取Token

- 自动获取: 登录[阿里云盘](https://www.aliyundrive.com/drive/)后，控制台粘贴
```javascript
copy(JSON.parse(localStorage.token).refresh_token); console.log(JSON.parse(localStorage.token).refresh_token);
```
![img](https://file2.antmoe.com/image/2/2023/09/02/64f31a55e0a16.png)

- 手动获取: 登录[阿里云盘](https://www.aliyundrive.com/drive/)后，可以在开发者工具 ->
  Application -> Local Storage 中的 `token` 字段中找到。  
  注意：不是复制整段 JSON 值，而是 JSON 里 `refresh_token` 字段的值，如下图所示红色部分：
  ![refresh token](https://file2.antmoe.com/image/2/2023/09/02/64f31a6a98384.png)

### 第二步：新建表格

进入[金山云文档](https://www.kdocs.cn/)新建一个Excel 文档，然后按如下格式进行填写

![202309021933578RmJTzGr000312](https://file2.antmoe.com/image/2/2023/09/02/64f31ddcc8270.png)

### 第三步：复制代码

复制本仓库的签到代码并粘贴到对应位置

![20230902193706kXxyLR1N000316](https://file2.antmoe.com/image/2/2023/09/02/64f31ebe334df.png)

接下来点击服务，开启对应权限（云文档、邮件、网络）

![20230902193858ktbR7rMi000317](https://file2.antmoe.com/image/2/2023/09/02/64f31f0c12470.png)

接下来点击运行测试一下即可。

![202309021941303HzwIdi3000318](https://file2.antmoe.com/image/2/2023/09/02/64f31f93d4382.png)



### 第四步：添加定时

![20230902194357T2PhPeOI000319](https://file2.antmoe.com/image/2/2023/09/02/64f320216dc45.png)

最后根据自己的喜好，添加一个定时任务即可。

## 其他说明

- 领取任务奖励暂时只是领取，并不能完成任务。
