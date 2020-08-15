import request from '@/utils/request'
import { crawler_base_url } from '@/utils/config'

// 获取用户列表
export function fetchWeavePriceList(query) {
  return request({
    url: crawler_base_url + 'weavePrice',
    method: 'get',
    params: query
  })
}
