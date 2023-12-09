interface UserData {
  back_up_config: {
    [key: string]: {
      folder_id: string
      photo_folder_id: string
      sub_folder: { [key: string]: any }
      video_folder_id: string
    }
  }
  ding_ding_robot_url: string
  DingDingRobotUrl: string
  encourage_desc: string
  EncourageDesc: string
  feed_back_switch: boolean
  FeedBackSwitch: boolean
  following_desc: string
  FollowingDesc: string
  share: string
}

export interface GetAccessTokenResponse {
  access_token: string
  avatar: string
  default_drive_id: string
  default_sbox_drive_id: string
  device_id: string
  domain_id: string
  exist_link: string[]
  expire_time: string
  expires_in: number
  is_first_login: boolean
  need_link: boolean
  need_rp_verify: boolean
  nick_name: string
  pin_setup: boolean
  refresh_token: string
  role: string
  state: string
  status: string
  token_type: string
  user_data: UserData
  user_id: string
  user_name: string
}
export interface GetSignInListResponse {
  arguments: null
  code: null
  maxResults: null
  message: null
  nextToken: null
  result: {
    blessing: string
    description: string
    isReward: boolean
    pcAndWebRewardCover: string
    rewardCover: string
    signInCount: number
    signInCover: string
    signInLogs: Array<{
      calendarChinese: null | string
      calendarDay: null | string
      calendarMonth: null | string
      day: number
      icon: string
      isReward: boolean
      notice: null
      pcAndWebIcon: string
      poster: null
      reward: {
        action: null | string
        background: string
        bottleId: null
        bottleName: null
        bottleShareId: null
        color: null | string
        description: null | string
        detailAction: null
        goodsId: number | null
        name: null | string
        notice: null | string
        subNotice: null | string
      }
      rewardAmount: number
      status: string
      themes: string
      type: string
    }>
    signInRemindCover: string
    subject: string
    title: string
  }
  success: boolean
  totalCount: null
}

export interface GetSignInInfoResponse {
  arguments: null
  code: null
  maxResults: null
  message: null
  nextToken: null
  result: {
    isSignIn: boolean
    year: string
    month: string
    day: string
    signInDay: number
    blessing: string
    subtitle: string
    themeIcon: string
    themeAction: string
    theme: string
    action: string
    rewards: Array<{
      'id': null
      'name': string
      'rewardImage': string
      'rewardDesc': string
      'nameIcon': string
      'type': string
      'actionText': string
      'action': string
      'status': string
      'remind': string
      'remindIcon': string
      'expire': null
      'position': number
      'idempotent': null
    }>
  }
  success: boolean
  totalCount: null
}
export interface GetSignInRewardResponse {
  arguments: null
  code: null
  maxResults: null
  message: null
  nextToken: null
  result: {
    action: string
    background: string
    bottleId: null
    bottleName: null
    bottleShareId: null
    color: string
    description: string
    detailAction: null
    goodsId: number
    name: string
    notice: string
    subNotice: string
  }
  success: boolean
  totalCount: null
}
export interface GetSignInTaskRewardResponse {
  arguments: null
  code: null
  maxResults: null
  message: null
  nextToken: null
  result: {
    action: string
    background: string
    bottleId: null
    bottleName: null
    bottleShareId: null
    color: string
    description: string
    detailAction: string
    goodsId: number
    name: string
    notice: string
    subNotice: string
  }
  success: boolean
  totalCount: null
}
export interface RequestError {
  code: string
  message: string
  requestId: string
}
