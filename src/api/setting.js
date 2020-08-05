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

