/* eslint-disable node/prefer-global/process */
export function Config() {
  // 邮箱HOST
  const MAIL_HOST = process.env.MAIL_HOST as string || ''
  // 邮箱端口号
  const MAIL_PORT = process.env.MAIL_PORT as string || '465'
  // 邮箱账号
  const MAIL_USERNAME = process.env.MAIL_USERNAME as string || ''
  // 邮箱密码
  const MAIL_PASSWORD = process.env.MAIL_PASSWORD as string || ''
  // 邮箱是否使用SSL
  const MAIL_SECURE = process.env.MAIL_SECURE as string || 'true'

  return {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_SECURE,
  }
}
