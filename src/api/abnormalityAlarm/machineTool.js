import request from "@/utils/request";

// 查询设备报警列表
export function list(query) {
  return request({
    url: "/cad/warn/page",
    method: "get",
    params: query,
  });
}

// 修改设备报警
export function edit(data) {
  return request({
    url: "/cad/warn/edit",
    method: "put",
    data: data,
  });
}
