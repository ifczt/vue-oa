export const today = {
  text: '今天',
  onClick(picker) {
    picker.$emit('pick', new Date())
  }
}
export const tomorrow = {
  text: '明天',
  onClick(picker) {
    const date = new Date()
    date.setTime(date.getTime() + 3600 * 1000 * 24)
    picker.$emit('pick', date)
  }
}
export const after_tomorrow = {
  text: '后天',
  onClick(picker) {
    const date = new Date()
    date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
    picker.$emit('pick', date)
  }
}
export const t_month = {
  text: '本月',
  onClick(picker) {
    const end = new Date()
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    picker.$emit('pick', [start, end])
  }
}
export const t_year = {
  text: '今年至今',
  onClick(picker) {
    const end = new Date()
    const start = new Date(new Date().getFullYear(), 0)
    picker.$emit('pick', [start, end])
  }
}
export const six_month = {
  text: '最近六个月',
  onClick(picker) {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 6)
    picker.$emit('pick', [start, end])
  }
}
