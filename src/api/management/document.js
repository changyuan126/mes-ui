import request from "@/utils/request";

// 查询排班列表
export function list(query) {
  return request({
    url: "/cad/file/list",
    method: "get",
    params: query,
  });
}

// 新增
export function updateTeam(data) {
  return request({
    url: "/cad/file",
    method: "post",
    data: data,
  });
}

// 修改
export function reviseFile(data) {
  return request({
    url: "/cad/file",
    method: "put",
    data: data,
  });
}

// 删除
export function delTeam(teamId) {
  return request({
    url: "/cad/file/" + teamId,
    method: "delete",
  });
}

// 查询文件类型列表
export function listType(query) {
  return request({
    url: "/cad/type/list",
    method: "get",
    params: query,
  });
}
