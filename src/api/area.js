import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取省
export function fetchProvince(query) {
  return request({
    url: base_url + 'admin/province',
    method: 'get',
    params: query
  })
}

// 新增省
export function createProvince(data) {
  return request({
    url: base_url + 'admin/province',
    method: 'post',
    params: data
  })
}

// 修改省
export function updateProvince(data) {
  return request({
    url: base_url + 'admin/province/' + data.id,
    method: 'put',
    params: data
  })
}

// 删除省
export function deleteProvince(provinceId) {
  return request({
    url: base_url + 'admin/province/' + provinceId,
    method: 'delete'
  })
}

// 刷新省排序
export function refreshProvince(data) {
  return request({
    url: base_url + 'admin/province/refresh',
    method: 'post',
    params: data
  })
}
