/** 查询表单
 * 
 */
export interface IQueryQICForm {
  batch: string, // 单号
  DJ: string, // dj
  jobNumber: number, // 工号
  rbo: string, // 客户
  internalItem: string, // 产品
  _name: string, // 姓名
  type: string, // 组别
  machineNo: string, // 机台号
  _date: string // 日期
  procedure: string // 工序
  qty: string // 单个dj的qty
}


// 质量检查表 qic 表数据接口
export interface IQICTableData {
  step: string, // 步骤
  process: string, // 工序
  number: string, // 序号
  risk_level: string, // 风险等级
  inspection_items: string, // 检查项目
  inspection_frequency: string, // 检查频率
  method: string, // 检查方法
  results: string, // 检查结果
  isDisabled?: boolean, // 是否禁用
  index: number, // 索引
}

// 空请求返回的IP信息数据
export interface IIpRes {
  ip: string, // ip
  machine_no: string, // 机台号
  type: string, // 组
  updata_time: string, // 更新时间
  process_selection: string, // 工序选择
}

/** 5条记录的数据
 * batch: string, // 单号
 * employee: string, // 工号
 * state: string, // 状态
 * uuid: string, // uuid
 * create_time: string, // 创建时间
 * _process: string, // 工序
 */
export interface IQICFiveRecord {
  batch: string, // 单号
  employee: string, // 工号
  state: string, // 状态
  uuid: string, // uuid
  create_time: string, // 创建时间
  _process: string, // 工序
}
// 根据IP获取订单信息
export interface IQICOrderDByIP {
  batch: string, // 单号
  rbo: string, // 客户
  internalItem: string, // 产品
  otc: Array<string>, // otc
  smallFromName: string, // 表名
  qty: string, // qiy NPA8R0:11000-NP9RTL:1600-NPA69V:250500-
  create_Time?: string, // 创建时间
  updata_time?: string // 更新时间
}
// 最近一份记录
export interface IQICRecord {
  uuid: string, // uuid
  batch: string, // 单号
  rbo: string, // 客户
  table_Name: string, // 表名
  params: string, // OK:格式：1-2-1-2-4...
  state: string, // 状态 0:未完成，1：已完成
  employee: string, // 工号
  cN_Name: string, // 姓名
  create_Time: string, // 创建时间
  _process: string
}

// 质量检查表 qic 数据接口(获取的数据接口)
export interface IQICDataReq {
  id?: number,
  uuid?: string,
  batch: string, // 单号
  _group: string, // (不传 空)
  machine: string,// (不传 空)
  _process: string, // 工序
  shift: string,// (不传 空)
  ip?: string, // ip
  rbo: string, // 客户
  table_Name: string, // 表名
  from_name_id?: string, // 表名id
  params?: string, // OK:格式：1-2-1-2-4...
  state: string, // 0: // 未完成，1：已完成 
  employee: string, // 工号
  cN_Name: string, // 姓名
  update_Time?: string, // 更新时间
  create_Time?: string
}


// 添加交接请求
export interface IQICHandoverReq {
  batch: string,
  dj: string,
  employeeNo: string,
  employeeName: string,
  start: string,
  end: string,
  onSku: string, // 现在还没做完的SKU，卷数的那个
  startJ: string,
  endJ: string,
  qty: string,
  state: string,
  sampling: string,
  remark?: string
}