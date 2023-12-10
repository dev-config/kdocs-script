interface SMTPLoginOptions {
  // 邮箱 的SMTP服务器的域名
  host: string
  // 端口
  port: number
  // 用户名
  username: string
  // 邮箱地址
  password: string
  // 是否加密
  secure: boolean
}
interface SMTPMailer {
  // 发送邮件
  send: (o: { text: string, to: string, from: string, subject: string }) => void
}

declare const SMTP: {
  login: (o: SMTPLoginOptions) => SMTPMailer
}

interface HTTPOptions {
  timeout?: number
  headers?: Record<string, string>
}
interface HTTPResponse<T> {
  status: number
  statusText: string
  headers: Record<string, string>
  text: () => string
  json: () => T
  // eslint-disable-next-line node/prefer-global/buffer
  binary: () => Buffer
}
interface FetchRequestOption {
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: string
  timeout?: number
}

declare const HTTP: {
  get<T>(url: string, options?: HTTPOptions): HTTPResponse<T>
  post<T>(url: string, body: any, options?: HTTPOptions): HTTPResponse<T>
  fetch<T>(url: string, options?: FetchRequestOption): HTTPResponse<T>

}
interface Enum {

}

interface Range {
  /**
   * 区域中单元格的数量
   */
  Count: number
  /**
   * 【只读】读取单元格格式化文本
   */
  Text: string
  /**
   * 读写单元格中的值
   */
  Value: any
  Value2: any[][]
  /**
   * 用于控制 Excel 中的条件格式
   */
  FormatConditions: FormatConditions
  /**
   * 以 A1 样式表示法表示的对象的隐式交叉的公式
   */
  Formula: string
  /**
   * 返回或设置区域的数组公式
   */
  FormulaArray: string
  /**
   * 获取或者设置区域的数字格式
   */
  NumberFormat: string
  /**
   * 行或者列的隐藏
   */
  Hidden: boolean
  /**
   * 内部颜色的十六进制 RGB
   */
  'Interior.Color': string
  /**
   * 设置区域的水平对齐方式
   */
  HorizontalAlignment: Enum.XlHAlign
  /**
   * 设置区域的垂直对齐方式
   */
  VerticalAlignment: Enum.XlVAlign
  /**
   * 获取或者设置区域自动换行
   */
  WrapText: boolean
  /**
   * 单元格缩进
   */
  IndentLevel: number
  /**
   * 单元格的合并区域
   */
  MergeArea: Range
  /**
   * 区域内是否存在合并的单元格
   */
  MergeCells: boolean
  /**
   * 区域中的单元格集合
   */
  Cells: Range
  /**
   * 区域中的行集合
   */
  Rows: Range
  /**
   * 区域中的列集合
   */
  Columns: Range
  /**
   * 区域所在行的整行
   */
  EntireRow: Range
  /**
   * 区域所在列的整列
   */
  EntireColumn: Range
  /**
   * 区域中第一行的行号
   */
  Row: number
  /**
   * 区域中最后一行的行号
   */
  RowEnd: number
  /**
   * 区域中第一列的列号
   */
  Column: number
  /**
   * 区域中最后一列的列号
   */
  ColumnEnd: number
  /**
   * 边框集合对象
   */
  Borders: Borders
}

declare const Application: {
  Range: (address: string) => Range
}
