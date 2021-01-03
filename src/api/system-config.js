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

// 修改第三方服务配置
export function updateThirdPartyConfig(param) {
  return request({
    url: base_url + 'thirdParty/config/' + param.configId,
    method: 'put',
    params: param
  })
}
