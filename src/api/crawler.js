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

// 获取币种列表
export function fetchCurrencyList() {
  return request({
    url: crawler_base_url + 'exchangeRate/currency',
    method: 'get'
  })
}

// 获取远期汇率币种列表
export function fetchForwardExchangeCurrencyList() {
  return request({
    url: crawler_base_url + 'forwardExchange/currency',
    method: 'get'
  })
}

// 获取热门汇率币种列表
export function fetchHotExchangeCurrencyList() {
  return request({
    url: crawler_base_url + 'hotExchange/currency',
    method: 'get'
  })
}

// 获取实时汇率列表
export function fetchExchangeRateList(query) {
  return request({
    url: crawler_base_url + 'exchangeRate',
    method: 'get',
    params: query
  })
}

// 获取远期汇率列表
export function fetchForwardExchangeList(query) {
  return request({
    url: crawler_base_url + 'forwardExchange',
    method: 'get',
    params: query
  })
}

// 获取热门汇率列表
export function fetchHotExchangeList(query) {
  return request({
    url: crawler_base_url + 'hotExchange',
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

// 创建爬虫脚本
export function createCrawlerShell(data) {
  return request({
    url: crawler_base_url + 'crawlerShell',
    method: 'post',
    params: data
  })
}

// 修改爬虫脚本
export function updateCrawlerShell(data) {
  return request({
    url: crawler_base_url + 'crawlerShell/' + data.id,
    method: 'put',
    params: data
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

// 删除爬虫脚本
export function deleteCrawlerShell(shellId) {
  return request({
    url: crawler_base_url + 'crawlerShell/' + shellId,
    method: 'delete'
  })
}

// 获取脚本执行日志列表
export function fetchShellExecuteLogList(query) {
  return request({
    url: crawler_base_url + 'crawlerShell/shellExecuteLog',
    method: 'get',
    params: query
  })
}
