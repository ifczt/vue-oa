import _global from '@/utils/Global'
import { parseTime } from '@/utils/index'
import { CodeToText } from 'element-china-area-data/dist/app'

export function list_handle(items) {
  // 遍历items 将数据转换为符合标准的数据
  for (const obj of items) {
    if (obj.apply_discount_state > 0) {
      obj.auxiliary_apply = obj.apply_discount_state !== 1
    }
    obj.apply_discount_state_bool = obj.apply_discount_state
    obj.apply_discount_state = obj.apply_discount_state === 2 ? obj.apply_discount_state : Boolean(obj.apply_discount_state)
    const delivery_state = obj.delivery_state
    if (typeof delivery_state === 'number') {
      obj.delivery_state = _global.DELIVERY_STATE[obj.delivery_state]
    }
    obj.buy_product = get_product_name(obj.buy_product)
    obj.delivery = get_delivery_name(obj.delivery)
    obj.area = [obj['province'], obj['city'], obj['area']]
  }
  return items
}

export function get_product_price(buy_product) {
  if (buy_product instanceof Object) {
    buy_product = buy_product.price
    return buy_product
  } else {
    for (const obj of _global.product_name_options) {
      if (obj.name === buy_product || obj.id === parseInt(buy_product)) {
        return obj.price
      }
    }
  }
  return 0
}

// 返回产品名字
export function get_product_name(buy_product) {
  if (buy_product instanceof Object) {
    buy_product = buy_product.name
    return buy_product
  } else {
    for (const obj of _global.product_name_options) {
      if (obj.id === parseInt(buy_product)) {
        return obj.name
      }
    }
  }
  if (!isRealNum(buy_product)) {
    return buy_product
  }
  return '产品信息获取失败，ID为：' + buy_product
}

// 返回派送名字
export function get_delivery_name(delivery) {
  if (delivery instanceof Object) {
    delivery = delivery.name
    return delivery
  } else {
    for (const obj of _global.delivery_mode_options) {
      if (obj.id === (delivery)) {
        return obj.name
      }
    }
  }
  if (!isRealNum(delivery)) {
    return delivery
  }
  return '派送信息获取失败，ID为：' + delivery
}

// 以下是提交到服务器的数据格式化处理
export function to_server_order(items) {
  delete items['auxiliary_apply']
  delete items['publicist_name']
  delete items['apply_discount_state_bool']
  // 区域合并处理
  if (items.area) {
    items.province = items.area[0]
    items.city = items.area[1]
    items.area = items.area[2]
  } else {
    delete items.area
  }
  items.price = items.apply_discount_state ? items.price : get_product_price(items.buy_product)
  items.price = items.pay_method === '2' ? 0 : items.price
  items.apply_discount_state = items.apply_discount_state ? 1 : 0
  items.buy_product = get_product(items.buy_product, 'id')
  items.delivery = get_delivery_id(items.delivery)
  items.delivery_time = parseTime(items.delivery_time, '{y}-{m}-{d}')
  items.delivery_state = _global.DELIVERY_STATE.indexOf(items.delivery_state)
  return items
}

export function get_product(buy_product, val) {
  if (buy_product instanceof Object) {
    buy_product = buy_product[val]
    return buy_product
  } else {
    for (const obj of _global.product_name_options) {
      if (obj.name === buy_product) {
        buy_product = obj[val]
        return buy_product
      }
    }
  }
}

export function get_delivery_id(delivery) {
  if (delivery instanceof Object) {
    delivery = delivery.id
    return delivery
  } else {
    for (const obj of _global.delivery_mode_options) {
      if (obj.name === delivery) {
        delivery = obj.id
        return delivery
      }
    }
  }
  return 0
}

export function isRealNum(val) {
  // 先判定是否为number
  if (typeof val !== 'number') {
    return false
  }
  return !isNaN(val)
}

export function to_server_region_school(val) {
  val.province = val.province.id
  val.city = val.city.id
  return val
}

export function to_asarray(val, pdt, need = true) {
  const asarray = []
  const _val = JSON.parse(JSON.stringify(val))
  if (need) {
    _val.push({ add: true })
  }
  _val.forEach((item, index) => {
    const arr = Math.floor(index / pdt)
    if (!asarray[arr]) {
      asarray[arr] = []
    }
    asarray[arr].push(item)
  })

  for (let i = asarray[asarray.length - 1].length; i < pdt; i++) {
    asarray[asarray.length - 1].push({})
  }
  return asarray
}

export function hanlder_region_list(list) {
  for (const item of list) {
    item.province = CodeToText[item.province]
    if (item.city) {
      const arr = item.city.split(',')
      item.city = []
      for (const _c of arr) {
        item.city.push({ name: CodeToText[_c], id: _c })
      }
    } else {
      item.city = [{ name: '全市', id: 'all' }]
    }
  }
  return list
}

export function randomColor() {
  const colors = ['', 'success', 'info', 'warning', 'danger']
  return colors[Math.floor(Math.random() * colors.length)]
}

export function server_terr_data(list) {
  list['start_time'] = list.time_slot[0]
  list['eff_time'] = list.time_slot[1]
  delete list.time_slot
  list.city = list.city.join(',')
  list.product = list.product.join(',')
  return list
}

export function view_terr_data(list) {
  list.province = CodeToText[list.province]
  list.time_slot = list.time_slot[0] + '-' + list.time_slot[1]
  let _city_arr = []
  if (list.city.length <= 1 && list.city[0] === '') {
    list.city = [{ name: '全市', id: 'all' }]
  } else {
    for (const cx of list.city) {
      _city_arr.push({ name: CodeToText[cx], id: cx })
    }
  }
  if (_city_arr.length === 0) {
    _city_arr = [{ name: '全市', id: 'all' }]
  }
  list.city = _city_arr
  const arr = []
  for (const i of list.product) {
    arr.push({ name: get_product_name(i), id: i })
  }
  list.product = arr
  return list
}
