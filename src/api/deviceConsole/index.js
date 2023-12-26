import request from '@/utils/request'

// 获取用户详细信息
export function devices() {
  return request({
    url: '/device/devices',
    method: 'get'
  })
}