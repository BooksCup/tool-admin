import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 发送消息
export function sendMessage(data) {
  return request({
    url: base_url + 'admin/messages',
    method: 'post',
    params: data
  })
}
