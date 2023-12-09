interface EmailOptions {
  host: string
  port: number
  username: string
  password: string
  secure: boolean
}

function Email(options: EmailOptions) {
  // 配置发送邮箱
  const mailer = SMTP.login({
    host: options.host,
    port: options.port,
    username: options.username,
    password: options.password,
    secure: options.secure || true,
  })
  const sendEmailObj: Record<string, string[]> = {}

  function add(to: string, text: string) {
    if (sendEmailObj[to])
      sendEmailObj[to].push(text)
    else
      sendEmailObj[to] = [text]
  }

  function send() {
    const data_time = new Date().toLocaleDateString()
    Object.entries(sendEmailObj).forEach(([to, text]) => {
      console.log('发送邮件', to)
      mailer.send({
        to, // 收件人
        text: text.join(''), // 文本
        from: `阿里云盘签到<${options.username}>`, // 发件人
        subject: `阿里云盘签到通知-${data_time}`, // 主题
      })
    })
  }

  return { add, send }
}
export { Email }
