import { sleep } from '../../utils'
import { Config } from '../../utils/config'
import { Email } from '../../utils/mail'
import { Http } from '../../utils/request'
import type { GetAccessTokenResponse, GetSignInInfoResponse, GetSignInListResponse, GetSignInRewardResponse, GetSignInTaskRewardResponse, RequestError } from './type'

const config = Config()
const emailHelper = Email({
  host: config.MAIL_HOST,
  port: Number(config.MAIL_PORT),
  username: config.MAIL_USERNAME,
  password: config.MAIL_PASSWORD,
  secure: Boolean(config.MAIL_SECURE),
})
const http = Http('')

let isEnd = false
let startRow = 2
const accountList: Array<{ refreshToken: string, isReward: boolean, isNotify: boolean, email: string, startRow: number }> = []

/**
 * 根据行数获取当前行的数据
 * @param {number} number
 */
function getRow(number: number) {
  const refreshToken = Application.Range(`A${number}`).Text
  const isReward = Application.Range(`B${number}`).Text === '是'
  const isNotify = Application.Range(`C${number}`).Text === '是'
  const email = Application.Range(`D${number}`).Text
  return { refreshToken, isReward, isNotify, email, number }
}

// 获取 access token
function getAccessTokenApi(refreshToken: string) {
  const body = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }
  const result = http.post<GetAccessTokenResponse & RequestError>('https://auth.aliyundrive.com/v2/account/token', JSON.stringify(body)).json()
  if (result.access_token)
    http.updateAccessToken(result.access_token)

  return result
}
// 签到
function signInListApi() {
  const body = { '_rx-s': 'mobile' }
  const result = http.post<GetSignInListResponse>('https://member.aliyundrive.com/v1/activity/sign_in_list', JSON.stringify(body)).json()
  return result
}
// 更新设备信息
function updateDeviceExtras(deviceId: string) {
  const body = {
    autoBackupStatus: true,
  }
  const result = http.fetch<{ 'result': boolean, 'success': boolean, 'code': null, 'message'?: string }>('https://api.alipan.com/users/v1/users/update_device_extras', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'x-device-id': deviceId,
      'Content-Type': 'application/json;charset=UTF-8',
    },

  }).json()
  return result
}
// 获取今日签到奖励
function signInInfoApi() {
  const body = {}
  const result = http.post<GetSignInInfoResponse>('https://member.aliyundrive.com/v2/activity/sign_in_info', JSON.stringify(body)).json()
  return result
}
// 领取签到奖励
function signInRewardApi(signInDay: number) {
  const body = { signInDay }
  const result = http.post<GetSignInRewardResponse>('https://member.aliyundrive.com/v1/activity/sign_in_reward', JSON.stringify(body)).json()
  return result
}
// 领取签到任务奖励
function signInTaskRewardApi(signInDay: number) {
  const body = { signInDay }
  const result = http.post<GetSignInTaskRewardResponse>('https://member.aliyundrive.com/v2/activity/sign_in_task_reward', JSON.stringify(body)).json()
  return result
}

(function () {
  while (!isEnd) {
    // 当前行的token
    const { refreshToken, isReward, isNotify, email, number } = getRow(startRow)
    if (!refreshToken) {
      isEnd = true
      break
    }
    accountList.push({ refreshToken, isReward, isNotify, email, startRow: number })
    startRow++
  }
  console.log(`共${accountList.length}个账号`)
  accountList.forEach((account, index) => {
    const { refreshToken, email, isReward, isNotify, startRow } = account
    console.log(`开始签到第${index + 2}行账号`)
    const { access_token, refresh_token, user_name, device_id } = getAccessTokenApi(refreshToken)
    Application.Range(`A${startRow}`).Value = refresh_token
    if (!access_token) {
      console.log(`第${index + 2}行账号token错误`)
      emailHelper.add(email, `第${index + 2}行账号token错误\n\n`)
      return
    }
    http.updateAccessToken(access_token)
    const signInListResult = signInListApi()
    if (!signInListResult.success) {
      console.log(`第${index + 2}行账号(${user_name})签到失败`)
      emailHelper.add(email, `第${index + 2}行账号(${user_name})签到失败\n\n`)
    }
    else if (isNotify) {
      emailHelper.add(email, `✅ 第${index + 2}行账号(${user_name})签到成功\n`)
    }
    if (!isReward)
      return

    // 更新设备信息
    const updateDeviceExtrasResult = updateDeviceExtras(device_id)
    console.log(`更新设备信息=>${JSON.stringify(updateDeviceExtrasResult)}`)
    sleep(2000)

    // 获取今日签到奖励
    const signInInfoResult = signInInfoApi()
    // 领取签到奖励
    const signInRewardResult = signInRewardApi(signInInfoResult.result.signInDay)
    // 领取签到任务奖励
    const signInTaskRewardResult = signInTaskRewardApi(signInInfoResult.result.signInDay)

    if (isNotify) {
      if (signInRewardResult.success)
        emailHelper.add(email, `✅ 第${index + 2}行账号(${user_name})签到奖励成功=>${signInRewardResult.result.name},${signInRewardResult.result.description}\n`)
      else
        emailHelper.add(email, `❌ 第${index + 2}行账号(${user_name})签到奖励失败=>${signInRewardResult.message}\n`)

      if (signInTaskRewardResult.success)
        emailHelper.add(email, `✅ 第${index + 2}行账号(${user_name})签到任务奖励成功=>${signInTaskRewardResult.result.description}\n`)
      else
        emailHelper.add(email, `❌ 第${index + 2}行账号(${user_name})签到任务奖励失败=>${signInTaskRewardResult.message}\n`)

      if (signInInfoResult.result.rewards.length) {
        emailHelper.add(email, `\n今日所有奖励如下⬇️\n`)
        signInInfoResult.result.rewards.forEach((item) => {
          emailHelper.add(email, `${item.name}=>${item.remind} | ${item.type}\n`)
        })
        emailHelper.add(email, `今日所有奖励如上⬆️\n\n`)
      }
    }
  })
  emailHelper.send()
})()
