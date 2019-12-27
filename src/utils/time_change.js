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
export const this_year = {
  text: '今年',
  onClick(picker) {
    const end = new Date(new Date().getFullYear(), 11, 31)
    const start = new Date(new Date().getFullYear(), 0, 1)
    picker.$emit('pick', [start, end])
  }
}
export const first_half_year = {
  text: '上半年',
  onClick(picker) {
    const end = new Date(new Date().getFullYear(), 5, 30)
    const start = new Date(new Date().getFullYear(), 0, 1)
    picker.$emit('pick', [start, end])
  }
}
export const second_half_year = {
  text: '下半年',
  onClick(picker) {
    const end = new Date(new Date().getFullYear(), 11, 31)
    const start = new Date(new Date().getFullYear(), 5, 30)
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
export function formatDate(numb, format) {
  const time = new Date((numb - 1) * 24 * 3600000 + 1)
  time.setYear(time.getFullYear() - 70)
  const year = time.getFullYear() + ''
  const month = time.getMonth() + 1 + ''
  const date = time.getDate() - 1 + ''
  if (format && format.length === 1) {
    return year + format + month + format + date
  }
  return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}
