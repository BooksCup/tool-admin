import request from '@/utils/request'
import { base_url } from '@/utils/config'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

// 获取用户列表
export function fetchUserList(query) {
  return request({
    url: base_url + 'admin/users',
    method: 'get',
    params: query
  })
}

// 创建用户
export function createUser(data) {
  return request({
    url: base_url + 'users',
    method: 'post',
    params: data
  })
}

// 删除用户
export function deleteUser(userId) {
  return request({
    url: base_url + 'users/' + userId,
    method: 'delete'
  })
}

// 编辑用户
export function updateUser(param) {
  return request({
    url: base_url + 'users/' + param.id,
    method: 'put',
    params: param
  })
}

// 检测极光用户是否存在
export function checkJimUserExist(userId) {
  return request({
    url: base_url + 'admin/jimUser/' + userId + '/exist',
    method: 'get'
  })
}

// 同步用户信息至极光
export function syncUserToJim(userId) {
  return request({
    url: base_url + 'admin/jimUser?userId=' + userId,
    method: 'post'
  })
}
