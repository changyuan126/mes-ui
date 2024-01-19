import request from "@/utils/request";

// 分页查询托盘设置列表
export function listMdItem(query) {
  return request({
    url: "/propallet/findProPallet",
    method: "get",
    params: query,
  });
}

// 新增托盘设置
export function addMdItem(data) {
  return request({
    url: "/propallet/addProPallet",
    method: "post",
    data: data,
  });
}

// 修改托盘设置
export function updateMdItem(data) {
  return request({
    url: "/propallet/updateProPallet",
    method: "post",
    data: data,
  });
}

// 删除托盘设置
export function delMdItem(data) {
  return request({
    url: "/propallet/deleteProPallet",
    method: "post",
    data: data,
  });
}

// 批量删除托盘设置
export function batchDeleteProPallet(itemId) {
  return request({
    url: "/propallet/batchDeleteProPallet" + "?proPalletIds=" + itemId,
    method: "get",
  });
}

// 自动生成托盘编码
export function findPalletCode(query) {
  return request({
    url: "/propallet/findPalletCode",
    method: "get",
    params: query,
  });
}
