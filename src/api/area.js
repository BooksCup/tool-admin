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

// 获取市
export function fetchCity(query) {
  return request({
    url: base_url + 'admin/city',
    method: 'get',
    params: query
  })
}

// 新增市
export function createCity(data) {
  return request({
    url: base_url + 'admin/city',
    method: 'post',
    params: data
  })
}

// 修改市
export function updateCity(data) {
  return request({
    url: base_url + 'admin/city/' + data.id,
    method: 'put',
    params: data
  })
}

// 删除市
export function deleteCity(cityId) {
  return request({
    url: base_url + 'admin/city/' + cityId,
    method: 'delete'
  })
}

// 刷新市排序
export function refreshCity(data) {
  return request({
    url: base_url + 'admin/city/refresh',
    method: 'post',
    params: data
  })
}

// 获取区县
export function fetchDistrict(query) {
  return request({
    url: base_url + 'admin/district',
    method: 'get',
    params: query
  })
}

// 新增区县
export function createDistrict(data) {
  return request({
    url: base_url + 'admin/district',
    method: 'post',
    params: data
  })
}

// 修改区县
export function updateDistrict(data) {
  return request({
    url: base_url + 'admin/district/' + data.id,
    method: 'put',
    params: data
  })
}

// 删除区县
export function deleteDistrict(districtId) {
  return request({
    url: base_url + 'admin/district/' + districtId,
    method: 'delete'
  })
}

// 刷新市排序
export function refreshDistrict(data) {
  return request({
    url: base_url + 'admin/district/refresh',
    method: 'post',
    params: data
  })
}
