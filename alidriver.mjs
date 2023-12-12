function Config() {
  const MAIL_HOST = "";
  const MAIL_PORT = "465";
  const MAIL_USERNAME = "";
  const MAIL_PASSWORD = "";
  const MAIL_SECURE = "true" ;
  const DEVICE_ID = "";
  return {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_SECURE,
    DEVICE_ID
  };
}

function Email(options) {
  const mailer = SMTP.login({
    host: options.host,
    port: options.port,
    username: options.username,
    password: options.password,
    secure: options.secure || true
  });
  const sendEmailObj = {};
  function add(to, text) {
    if (sendEmailObj[to])
      sendEmailObj[to].push(text);
    else
      sendEmailObj[to] = [text];
  }
  function send() {
    const data_time = (/* @__PURE__ */ new Date()).toLocaleDateString();
    Object.entries(sendEmailObj).forEach(([to, text]) => {
      console.log("发送邮件", to);
      mailer.send({
        to,
        // 收件人
        text: text.join(""),
        // 文本
        from: `阿里云盘签到<${options.username}>`,
        // 发件人
        subject: `阿里云盘签到通知-${data_time}`
        // 主题
      });
    });
  }
  return { add, send };
}

function Http(accessToken) {
  const { DEVICE_ID } = Config();
  let _accessToken = accessToken;
  let _deviceId = DEVICE_ID;
  function fetch(url, data) {
    return HTTP.fetch(url, {
      ...data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": `Bearer ${_accessToken}`,
        "x-device-id": _deviceId,
        ...data.headers
      }
    });
  }
  function updateAccessToken(token) {
    _accessToken = token;
  }
  function updateDeviceId(deviceId) {
    _deviceId = deviceId;
  }
  return { fetch, updateAccessToken, updateDeviceId };
}

const config = Config();
const emailHelper = Email({
  host: config.MAIL_HOST,
  port: Number(config.MAIL_PORT),
  username: config.MAIL_USERNAME,
  password: config.MAIL_PASSWORD,
  secure: Boolean(config.MAIL_SECURE)
});
const http = Http("");
let isEnd = false;
let startRow = 2;
const accountList = [];
function getRow(number) {
  const refreshToken = Application.Range(`A${number}`).Text;
  const isReward = Application.Range(`B${number}`).Text === "是";
  const isNotify = Application.Range(`C${number}`).Text === "是";
  const email = Application.Range(`D${number}`).Text;
  return { refreshToken, isReward, isNotify, email, number };
}
function getAccessTokenApi(refreshToken) {
  const body = {
    grant_type: "refresh_token",
    refresh_token: refreshToken
  };
  const result = http.fetch("https://auth.aliyundrive.com/v2/account/token", {
    body: JSON.stringify(body),
    method: "POST"
  }).json();
  if (result.access_token)
    http.updateAccessToken(result.access_token);
  return result;
}
function signInListApi() {
  const body = { "_rx-s": "mobile" };
  const result = http.fetch("https://member.aliyundrive.com/v1/activity/sign_in_list", {
    method: "POST",
    body: JSON.stringify(body)
  }).json();
  return result;
}
function signInInfoApi() {
  const body = {};
  const result = http.fetch("https://member.aliyundrive.com/v2/activity/sign_in_info", {
    method: "POST",
    body: JSON.stringify(body)
  }).json();
  return result;
}
function signInRewardApi(signInDay) {
  const body = { signInDay };
  const result = http.fetch("https://member.aliyundrive.com/v1/activity/sign_in_reward", {
    method: "POST",
    body: JSON.stringify(body)
  }).json();
  return result;
}
function signInTaskRewardApi(signInDay) {
  const body = { signInDay };
  const result = http.fetch("https://member.aliyundrive.com/v2/activity/sign_in_task_reward", {
    method: "POST",
    body: JSON.stringify(body)
  }).json();
  return result;
}
(function() {
  while (!isEnd) {
    const { refreshToken, isReward, isNotify, email, number } = getRow(startRow);
    if (!refreshToken) {
      isEnd = true;
      break;
    }
    accountList.push({ refreshToken, isReward, isNotify, email, startRow: number });
    startRow++;
  }
  console.log(`共${accountList.length}个账号`);
  accountList.forEach((account, index) => {
    const { refreshToken, email, isReward, isNotify, startRow: startRow2 } = account;
    console.log(`开始签到第${index + 2}行账号`);
    const { access_token, refresh_token, user_name } = getAccessTokenApi(refreshToken);
    Application.Range(`A${startRow2}`).Value = refresh_token;
    if (!access_token) {
      console.log(`第${index + 2}行账号token错误`);
      emailHelper.add(email, `第${index + 2}行账号token错误

`);
      return;
    }
    http.updateAccessToken(access_token);
    const signInListResult = signInListApi();
    if (!signInListResult.success) {
      console.log(`第${index + 2}行账号(${user_name})签到失败`);
      emailHelper.add(email, `第${index + 2}行账号(${user_name})签到失败

`);
    } else if (isNotify) {
      emailHelper.add(email, `✅ 第${index + 2}行账号(${user_name})签到成功
`);
    }
    if (!isReward)
      return;
    const signInInfoResult = signInInfoApi();
    const signInDay = signInInfoResult.result.signInDay;
    const signInRewardResult = signInRewardApi(signInDay);
    const signInTaskRewardResult = signInTaskRewardApi(signInDay);
    if (isNotify) {
      if (signInRewardResult.success)
        emailHelper.add(email, `✅ 第${index + 2}行账号(${user_name})签到奖励成功=>${signInRewardResult.result.name},${signInRewardResult.result.description}
`);
      else
        emailHelper.add(email, `❌ 第${index + 2}行账号(${user_name})签到奖励失败=>${signInRewardResult.message}
`);
      if (signInTaskRewardResult.success)
        emailHelper.add(email, `✅ 第${index + 2}行账号(${user_name})签到任务奖励成功=>${signInTaskRewardResult.result.description}
`);
      else
        emailHelper.add(email, `❌ 第${index + 2}行账号(${user_name})签到任务奖励失败=>${signInTaskRewardResult.message}
`);
      if (signInInfoResult.result.rewards.length) {
        emailHelper.add(email, `
今日所有奖励如下⬇️
`);
        signInInfoResult.result.rewards.forEach((item) => {
          emailHelper.add(email, `${item.name}=>${item.remind} | ${item.type}
`);
        });
        emailHelper.add(email, `今日所有奖励如上⬆️

`);
      }
    }
  });
  emailHelper.send();
})();
