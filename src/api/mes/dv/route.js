import request from '@/utils/request'

// 查询agv线路
export function findProAgvline(query) {
  return request({
    url: '/proagv/findProAgvline',
    method: 'get',
    params: query
  })
}

// 自动生成agv线路编码
export function findLineCode(query) {
    return request({
      url: '/proagv/findLineCode',
      method: 'get',
      params: query
    })
  }

// 新增agv线路
export function addProAgvline(data) {
  return request({
    url: '/proagv/addProAgvline',
    method: 'post',
    data: data
  })
}

// 修改agv线路
export function updateProAgvline(data) {
    return request({
      url: '/proagv/updateProAgvline',
      method: 'post',
      data: data
    })
  }

  // 删除agv线路
export function deleteProAgvline(data) {
    return request({
      url: '/proagv/deleteProAgvline',
      method: 'post',
      data: data
    })
  }