import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取第三方服务字典列表
export function fetchThirdPartyDicList(query) {
  return request({
    url: base_url + 'thirdParty/dic',
    method: 'get',
    params: query
  })
}
