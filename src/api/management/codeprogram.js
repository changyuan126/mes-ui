import request from "@/utils/request";

// 查询排班列表
export function list(query) {
  return request({
    url: "/cad/code/list",
    method: "get",
    params: query,
  });
}

// 新增
export function updateTeam(data) {
  return request({
    url: "/cad/code/add",
    method: "post",
    data: data,
  });
}

// 修改
export function reviseFile(data) {
  return request({
    url: "/cad/code/edit",
    method: "put",
    data: data,
  });
}

// 删除
export function delTeam(teamId) {
  return request({
    url: "/cad/code/" + teamId,
    method: "delete",
  });
}

// 查询设备列表
export function listMachinery(query) {
  return request({
    url: "/mes/dv/machinery/list",
    method: "get",
    params: query,
  });
}
