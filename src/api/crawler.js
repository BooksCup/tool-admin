import request from '@/utils/request'
import { crawler_base_url } from '@/utils/config'

// 获取纺织品类别列表
export function fetchWeaveTypeList() {
  return request({
    url: crawler_base_url + 'weavePrice/type',
    method: 'get'
  })
}

// 获取纺织品价格列表
export function fetchWeavePriceList(query) {
  return request({
    url: crawler_base_url + 'weavePrice',
    method: 'get',
    params: query
  })
}

// 获取爬虫脚本列表
export function fetchCrawlerShellList(query) {
  return request({
    url: crawler_base_url + 'crawlerShell',
    method: 'get',
    params: query
  })
}

// 执行爬虫脚本
export function executeCrawlerShell(data) {
  return request({
    url: crawler_base_url + 'crawlerShell/execute',
    method: 'post',
    params: data
  })
}
