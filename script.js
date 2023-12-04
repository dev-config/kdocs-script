// 阿里云盘定时签到
let isEnd = false
let startRow = 2
const accountList = []
const sendEmailObj = {}

/**
 * 发送邮件
 * @param {string} to 发送邮箱
 * @param {string} text 发送内容
 */
function sendEmail(to, text) {
  const data_time = new Date().toLocaleDateString()
  // 配置发送邮箱
  const mailer = SMTP.login({
    host: "smtp.qiye.aliyun.com", // 邮箱 的SMTP服务器的域名
    port: 465,
    username: "admin@antmoe.com", // 邮箱地址
    password: "8EwhAgLdyTrYQqit", // 邮箱的SMTP密码，非密码
    secure: true
  });
  mailer.send({
    text, // 文本
    to, // 收件人
    from: "阿里云盘签到<admin@antmoe.com>", // 发件人
    subject: "阿里云盘签到通知-" + data_time, // 主题
  })
}

const sendMailHealper = {
  add: function (email, text) {
    if (sendEmailObj[email]) {
      sendEmailObj[email] += '\n\n' + text
    } else {
      sendEmailObj[email] = text
    }
  },
  send: function () {
    console.log('开始发送邮件')
    Object.entries(sendEmailObj).forEach(([email, text]) => {
      console.log('发送邮件给' + email, text)
      sendEmail(email, text)
    })
  },
}



function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d;);
}

/**
 * 根据行数获取当前行的数据
 * @param {number} number 
 * @returns { { refreshToken:string,isReward:boolean,isNotify:boolean,email:string,number:number } }
 */
function getRow(number) {
  const refreshToken = Application.Range("A" + number).Text
  const isReward = Application.Range("B" + number).Text === '是' ? true : false
  const isNotify = Application.Range("C" + number).Text === '是' ? true : false
  const email = Application.Range("D" + number).Text
  return { refreshToken, isReward, isNotify, email, number }
}

/**
 * 获取token
 * @param {string} token 
 * @returns { { accessToken:string | '',phone: string } }
 */
function getAccessToken(token) {
  // 发起网络请求-获取token
  const data = HTTP.post("https://auth.aliyundrive.com/v2/account/token",
    JSON.stringify({
      "grant_type": "refresh_token",
      "refresh_token": token
    })
  ).json()
  const accessToken = data['access_token'] || ''
  const phone = data["user_name"] || ''
  const refresh_token = data["refresh_token"] || '已过期'
  return { accessToken, phone, refresh_token }
}


/**
 * 签到
 * @param {string} accessToken
 * @param {any} row
 * @throws { {row:number} }
 * @returns { userName:string,signInCount:number,row:number }
 *  */
function signIn(accessToken, row) {
  try {
    const data = HTTP.post("https://member.aliyundrive.com/v1/activity/sign_in_list",
      JSON.stringify({ "_rx-s": "mobile" }),
      { headers: { "Authorization": "Bearer " + accessToken } }
    )
    const dataJson = data.json()
    const signInCount = dataJson['result']['signInCount']
    const userName = dataJson["user_name"]
    return {
      row,
      userName,
      signInCount,
      success: true,
    }
  } catch (e) {
    console.log(e)
    return {
      row,
      success: false,
    }
  }
}

function signInReward(accessToken, signInCount) {
  try {
    const data = HTTP.post(
      "https://member.aliyundrive.com/v1/activity/sign_in_reward?_rx-s=mobile",
      JSON.stringify({ "signInDay": signInCount }),
      { headers: { "Authorization": "Bearer " + accessToken } }
    )
    const dataJson = data.json()
    const name = dataJson["result"]["name"]
    const description = dataJson["result"]["description"]
    return {
      name,
      description,
      success: true,
    }
  } catch {
    return {
      success: false,
    }
  }
}
/**
 * 获取本日签到奖励
 */
function signInInfo(accessToken) {
  try {
    const data = HTTP.post(
      "https://member.aliyundrive.com/v2/activity/sign_in_info",
      JSON.stringify({}),
      { headers: { "Authorization": "Bearer " + accessToken } }
    )
    const dataJson = data.json()
    const rewards = dataJson["result"]["rewards"]

    return {
      rewards,
      success: true,
    }
  } catch {
    return {
      rewards: [],
      success: false,
    }
  }
}
/**
 * 获取本日任务奖励
 */
function signInTaskReward(accessToken, signInCount) {
  try {
    const data = HTTP.post(
      "https://member.aliyundrive.com/v2/activity/sign_in_task_reward",
      JSON.stringify({ "signInDay": signInCount }),
      { headers: { "Authorization": "Bearer " + accessToken } }
    )
    const dataJson = data.json()
    const name = dataJson["result"]["name"]
    const description = dataJson["result"]["description"]
    return {
      name,
      description,
      success: true,
    }
  } catch {
    return {
      success: false,
    }
  }
}


function main() {
  console.log(`共${accountList.length}个账号`)

  accountList.forEach((account, index) => {
    const { token, isReward, isNotify, email, row } = account
    console.log(`开始签到第${index + 2}行账号`)
    const { accessToken, phone, refresh_token } = getAccessToken(token)

    Application.Range('A' + row).Value = refresh_token

    if (!accessToken) {
      console.log(`第${index + 2}行账号token错误`)
      sendMailHealper.add(email, `第${index + 2}行账号token错误`)
      return
    }
    const signResult = signIn(accessToken, account)
    if (!signResult.success) {
      console.log(`第${index + 2}行账号签到失败`)
      sendMailHealper.add(email, `第${index + 2}行账号签到失败`)
      return
    }
    const userName = phone
    const signInCount = signResult.signInCount
    if (!isReward) {
      console.log(`账号：${userName}-签到成功, 本月累计签到${signInCount}天`)
      if (isNotify) {
        sendMailHealper.add(email, `账号：${userName}-签到成功, 本月累计签到${signInCount}天`)
      }
      return
    }

    const rewardResult = signInReward(accessToken, signResult.signInCount)
    const name = rewardResult.name
    const description = rewardResult.description
    if (!rewardResult.success) {
      console.log(`第${index + 2}行账号签到奖励失败`)
      sendMailHealper.add(email, `第${index + 2}行账号签到奖励失败`)
      return
    } else {
      console.log(`账号：${userName}-签到成功, 本月累计签到${signInCount}天`)
      console.log(`本次签到获得${name},${description}`)
      if (isNotify) {
        sendMailHealper.add(email, `账号：${userName}-签到成功, 本月累计签到${signInCount}天\n本次签到获得${name},${description}`)
      }
    }
    const signInTaskRewardResult = signInTaskReward(accessToken, signResult.signInCount)
    if (!signInTaskRewardResult.success) {
      console.log(`第${index + 2}行账号领取任务奖励失败`)
      sendMailHealper.add(email, `第${index + 2}行账号领取任务奖励失败`)
    } else {
      console.log(`第${index + 2}行账号领取任务奖励成功`)
      sendMailHealper.add(email, `第${index + 2}行账号领取任务奖励成功`)
    }
    const signInInfoResult = signInInfo(accessToken)
    if (signInInfoResult.rewards.length) {
      console.log(`本月签到奖励`)
      signInInfoResult.rewards.forEach((item) => {
        console.log(`${item.name},${item.description}`)
        if (isNotify) {
          sendMailHealper.add(email, `今日签到奖励：${item.name}=>${item.remind} | ${item.type}`)
        }
      })
    }
  })
  sendMailHealper.send()
}

while (!isEnd) {
  // 当前行的token
  const { refreshToken: token, isReward, isNotify, email } = getRow(startRow)
  if (!token) {
    isEnd = true
    break
  }
  accountList.push({ token, isReward, isNotify, email, row: startRow })
  startRow++
}
console.log(`获取到${accountList.length}个账号`)
main()
