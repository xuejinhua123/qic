
import { Ref } from 'vue'
import { useQirPinia } from '../../../store/qir'
import { createQICRecord, updateOneRecord } from '../../../tools/api/qicApi'
import { messageError } from '../../../tools/element-plus/SBMessage'
import { IQICDataReq, IQICTableData } from '../../../tools/interface/iQicData'

/** 操作OK
 * 
 * @returns 
 */
function _useHandleOkHooks (tbUuid:Ref<string>) {
  const qicStore = useQirPinia()

  /** 创建记录 + 更新一条记录
   * 
   * @param index 下标 + 1
   * @param value OK值
   * @param tableName 表名
   * @param InditexValue 
   * @param _tableContent 单表数据(不是工序表数据) 
   * @returns 
   */
  const _createOK = (index: number, value: string, tableName:string, InditexValue:string, _tableContent:Array<IQICTableData>, _filterTableContent: Array<IQICTableData>)=>{
    console.log('创建')
    // (1) 判断
    if (qicStore.isIP === false) {
      messageError('该IP没有信息，请联系领班--IP地址改了或者IP信息没有保存')
      return
    }
    if(qicStore.queryForm.batch === '') {
      messageError('请输入batch')
      return
    }
    if(qicStore.queryForm._name === '') {
      messageError('请输入工号')
      return
    }
    if(qicStore.queryForm.procedure === '') {
      messageError('请选择工序')
      return
    }

    // (2) 处理参数
    let params = ''
    let data:IQICDataReq = {
      uuid: "",
      batch: qicStore.queryForm.batch,
      _group: '', // (不传 空)
      machine: '',// (不传 空)
      _process: qicStore.queryForm.procedure,
      shift: '',// (不传 空)
      ip: qicStore.ipData.ip,
      rbo: qicStore.queryForm.rbo,
      table_Name: tableName,
      from_name_id: '',
      params: "",
      state: '0',
      employee: qicStore.queryForm.jobNumber.toString(),
      cN_Name: qicStore.queryForm._name,
    }

    // (3) 如果是Inditex 表，需要添加一个
    if (tableName === 'Inditex') {
      params += '1:' + InditexValue + '-'
      _tableContent?.forEach((_v:IQICTableData, i:number)=> {
        if (i === index) {
          params += (index+2) + ':' + value + '-'
        }else {
          params += (i+2) + ':' + 0 + '-'
        }
      })
    } else {
      // 普通表
      _tableContent?.forEach((_v:any, i:number)=> {
        if (i === index) {
          params += (index+1) + ':' + value + '-'
        }else {
          params += (i+1) + ':' + 0 + '-'
        }
      })
    }

    // (4) 裁切 - 
    params = params.substring(0, params.length - 1)
    console.log('params ==> ', data.params)
    console.log('更新的参数 ==> ', (index+1) + ':' + value)
    console.log('params ==> ', params)

    // 4、创建 + 更新第一个
    createQICRecord(data).then((res:any)=>{
      // 赋值uuid
      tbUuid.value = res.data.data.uuid
      let state = '0'
      if (_filterTableContent.length === 1) { // 如果一道工序只有一个行内容
        state = '1'
      }

      console.log(res.data.data.uuid, params, state)

      return updateOneRecord(res.data.data.uuid, params, state)
    }).then((res:any) => {
      console.log(res)
    }).catch((err:any)=>{
      console.error(err)
    })
  }

  const _updateOK = (index: number, value: string, _filterTableContent: Array<IQICTableData>)=>{
    console.log('更新一条记录')
    console.log(index)
    console.log(value)
    console.log('uuid ==> ', tbUuid.value)
    if (qicStore.isIP === false) {
      messageError('该IP没有信息，请联系领班--IP地址改了或者IP信息没有保存')
      return
    }
    if(qicStore.queryForm.batch === '') {
      messageError('请输入batch')
      return
    }
    if(qicStore.queryForm._name === '') {
      messageError('请输入工号')
      return
    }
    if(qicStore.queryForm.procedure === '') {
      messageError('请选择工序')
      return
    }
    if (tbUuid.value === '') {
      console.error('uuid为空')
      return
    }

    // 2、处理参数
    const params = (index+1) + ':' + value
    let state = '0'
    if (_filterTableContent?.every((v:any) => v.results !== '')) {
      state = '1'
    }
    // 工序：印刷，rbo：tage
    if (qicStore.queryForm.procedure === '印刷' && qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) {
      let len = 0
      _filterTableContent.forEach(v=>{
        if (v.results !== '') len +=1
      })
      if (len >= _filterTableContent.length - 1) {
        state = '1'
      }
    }
    console.log(tbUuid.value, params, state)

    // 3、更新
    updateOneRecord(tbUuid.value, params, state).then((res:any)=>{
      console.log(res)

      // 有个小问题, 如果领班修改了，退出了，渲染是禁用的，但是没有渲染已改的，但后台是改了，可以用搜索记录再看一次即可，或者按单加载
    }).catch((err:any) =>{
      console.error(err)
    })

  }
  return {
    _createOK, _updateOK
  }
}
export default _useHandleOkHooks