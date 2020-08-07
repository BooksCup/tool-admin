import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取region
export function fetchRegion(query) {
  return request({
    url: base_url + 'admin/region',
    method: 'get',
    params: query
  })
}

// 新增region
export function createRegion(data) {
  return request({
    url: base_url + 'admin/region',
    method: 'post',
    params: data
  })
}

// 修改region
export function updateRegion(data) {
  return request({
    url: base_url + 'admin/region/' + data.id,
    method: 'put',
    params: data
  })
}

// 删除region
export function deleteRegion(regionId) {
  return request({
    url: base_url + 'admin/region/' + regionId,
    method: 'delete'
  })
}

// 刷新region排序
export function refreshRegion(data) {
  return request({
    url: base_url + 'admin/region/refresh',
    method: 'post',
    params: data
  })
}

