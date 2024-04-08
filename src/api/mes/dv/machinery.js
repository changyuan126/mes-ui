import request from "@/utils/request";

// 查询设备列表
export function listMachinery(query) {
  return request({
    url: "/mes/dv/machinery/list",
    method: "get",
    params: query,
  });
}

// 查询设备详细
export function getMachinery(machineryId) {
  return request({
    url: "/mes/dv/machinery/" + machineryId,
    method: "get",
  });
}

// 查询代码程序列表
export function listMes(query) {
  return request({
    url: "/cad/code/list",
    method: "get",
    params: query,
  });
}

// 新增设备
export function addMachinery(data) {
  return request({
    url: "/mes/dv/machinery",
    method: "post",
    data: data,
  });
}

// 修改设备
export function updateMachinery(data) {
  return request({
    url: "/mes/dv/machinery",
    method: "put",
    data: data,
  });
}

// 删除设备
export function delMachinery(machineryId) {
  return request({
    url: "/mes/dv/machinery/" + machineryId,
    method: "delete",
  });
}

// 新增设备关联通知人
export function UserArr(data) {
  return request({
    url: "/machinery/User/add",
    method: "post",
    data: data,
  });
}

// 查询设备关联通知人详细信息
export function machineryUsers(query) {
  return request({
    url: "/machinery/User/machineryUsers",
    method: "get",
    params: query,
  });
}
