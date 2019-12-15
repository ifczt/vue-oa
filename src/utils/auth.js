import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getUserName() {
  return Cookies.get('username')
}
export function setUserName(val) {
  return Cookies.set('username',val)
}
export function getPassWord() {
  return Cookies.get('password')
}
export function setPassWord(val) {
  return Cookies.set('password',val)
}
