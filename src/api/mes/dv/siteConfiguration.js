import request from '@/utils/request'

// 查询agv站点
export function findProAgvsite(query) {
  return request({
    url: '/proagvsite/findProAgvsite',
    method: 'get',
    params: query
  })
}

// 自动生成agv站点编码
export function findSiteCode(query) {
    return request({
      url: '/proagvsite/findSiteCode',
      method: 'get',
      params: query
    })
  }

// 新增agv站点
export function addProAgvsite(data) {
  return request({
    url: '/proagvsite/addProAgvsite',
    method: 'post',
    data: data
  })
}

// 修改agv线路
export function updateProAgvsite(data) {
    return request({
      url: '/proagvsite/updateProAgvsite',
      method: 'post',
      data: data
    })
  }

  // 删除agv站点
export function deleteProAgvsite(data) {
    return request({
      url: '/proagvsite/deleteProAgvsite',
      method: 'post',
      data: data
    })
  }