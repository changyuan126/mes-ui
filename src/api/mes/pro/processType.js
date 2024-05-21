import request from '@/utils/request'

// 查询工序类型列表
export function listMachinerytype(query) {
  return request({
    url: '/process/type/list',
    method: 'get',
    params: query
  })
}

// 查询工序类型详细
export function getMachinerytype(processTypeld) {
  return request({
    url: '/process/type/' + processTypeld,
    method: 'get'
  })
}

// 新增工序类型
export function addMachinerytype(data) {
  return request({
    url: '/process/type/add',
    method: 'post',
    data: data
  })
}

// 修改工序类型
export function updateMachinerytype(data) {
  return request({
    url: '/process/type/edit',
    method: 'put',
    data: data
  })
}

// 删除工序类型
export function delMachinerytype(processTypeld) {
  return request({
    url: '/process/type/' + processTypeld,
    method: 'delete'
  })
}
