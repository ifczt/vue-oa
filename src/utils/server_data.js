import _global from '@/utils/Global'
import { parseTime } from '@/utils/index'

export function list_handle(items) {
  // 遍历items 将数据转换为符合标准的数据
  for (const obj of items) {
    obj.apply_discount_state = Boolean(obj.apply_discount_state)
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
  // 区域合并处理
  if (items.area) {
    items.province = items.area[0]
    items.city = items.area[1]
    items.area = items.area[2]
  } else {
    delete items.area
  }
  items.price = items.apply_discount_state ? items.price : get_product_price(items.buy_product)
  items.apply_discount_state = items.apply_discount_state ? 1 : 0
  items.buy_product = get_product(items.buy_product,'id')
  items.delivery = get_delivery_id(items.delivery)
  items.delivery_time = parseTime(items.delivery_time, '{y}-{m}-{d}')
  items.delivery_state = _global.DELIVERY_STATE.indexOf(items.delivery_state)
  return items
}

export function get_product(buy_product,val) {
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
// export function get_product_id(buy_product) {
//   if (buy_product instanceof Object) {
//     buy_product = buy_product.id
//     return buy_product
//   } else {
//     for (const obj of _global.product_name_options) {
//       if (obj.name === buy_product) {
//         buy_product = obj.id
//         return buy_product
//       }
//     }
//   }
//   return 0
// }

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

