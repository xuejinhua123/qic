<!-- 交接信息 -->
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useQirPinia } from '../../store/qir'
import { IQICHandoverReq } from '../../tools/interface/iQicData'
import { AddHandoverRecord, SelectAllByBatchDj } from '../../tools/api/qicApi'
import { messageError } from '../../tools/element-plus/SBMessage'
const qicStore = useQirPinia()


interface Ihandover {
  id?: number,
  start: number | string,
  end: number | string,
  qty: string,
  onSku: number | string,
  state: string, //已完成，未完成
  sample: string,
  roll1: string,
  roll2: string,
  roll3: string,
  roll4: string,
}

let handoverInfo = ref<Ihandover>({
  id: 1,
  start: '',
  end: '',
  qty: '',
  onSku: '',
  state: '',
  sample: '不需要',
  roll1: '',
  roll2: '',
  roll3: '',
  roll4: ''
})

const dialogVisible = ref<boolean>(false)
const isRoll = ref<boolean>(false) // 是否有卷数

const desc = ref<string>('')
const handoverArr = ref<Array<Ihandover>>([])
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<Ihandover>>({
  start: [
    { required: true, message: '请输入SKU', trigger: 'blur' },
    { min: 0, max: 99, message: '1-99', trigger: 'blur' },
  ],
  end: [
    { required: true, message: '请输入SKU', trigger: 'blur' },
    { min: 1, max: 99, message: '1-99', trigger: 'blur' },
  ],
  qty: [
    { required: true, message: '请输入QTY', trigger: 'blur' }
  ],
  sample: [
    { required: true, message: '请选择是否抽样', trigger: 'blur' }
  ],
  state: [
    { required: true, message: '请选择完成状态', trigger: 'change' },
  ],
})

// 添加交接
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      dialogVisible.value = true
      if (handoverInfo.value.onSku === '') {
        isRoll.value = false
      } else {
        isRoll.value = true
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 重置交接
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  handoverInfo.value = {
    id: 1,
    start: '',
    end: '',
    qty: '',
    onSku: '',
    sample: '',
    state: '',
    roll1: '',
    roll2: '',
    roll3: '',
    roll4: ''
  }
}


// 交接按钮
const addHandover = () => {
  console.log("交接信息 ==》 ", handoverInfo.value)

  // 1、判断单号和工号
  if(isQICValue()) {
    return
  }
  // 判断输入框
  if (handoverInfo.value.start > handoverInfo.value.end) {
    messageError('SKU 输入有误 (左边大于右边)')
    return
  }
  // if (isRoll.value) { // 不好判断  注意：卷数 的分母是同步，如果要修改
  //   if ()
  // }
  console.log('执行2')

  // dialogVisible.value = true

  // // 2、赋值 显示
  // if (handoverArr.value.length === 0) {
  //     desc.value = qicStore.queryForm.batch + ' | ' + qicStore.queryForm.DJ + ' | ' + handoverInfo.value.start
  //      + ' | ' + handoverInfo.value.end + ' | ' + handoverInfo.value.qty + ' | ' + handoverInfo.value.sample + ' | ' + handoverInfo.value.state
  //   handoverArr.value.push(handoverInfo.value)
  // } else {
  //     desc.value += '\n' + qicStore.queryForm.batch + ' | ' + qicStore.queryForm.DJ + ' | ' + handoverInfo.value.start
  //     + ' | ' + handoverInfo.value.end + ' | ' + handoverInfo.value.qty + ' | ' + handoverInfo.value.sample + ' | ' + handoverInfo.value.state
  //   handoverArr.value.push(handoverInfo.value)
  // }

  // // 3、添加交接信息
  // AddHandoverRecord(qicStore.queryForm.batch, qicStore.queryForm.DJ, qicStore.queryForm.jobNumber.toString(), qicStore.queryForm._name,
  //   handoverInfo.value.start.toString(), handoverInfo.value.end.toString(), handoverInfo.value.qty, handoverInfo.value.state, handoverInfo.value.remark)

  // 显示

  console.table(handoverInfo.value)
  
  // if (handoverArr.value.length !== 0) {
  //   desc.value += '\n'
  // }
  if (isRoll.value) { // 有卷数
    desc.value += qicStore.queryForm.batch + ' | ' + qicStore.queryForm.DJ + ' | SKU: ' +
      handoverInfo.value.start + ' - ' + handoverInfo.value.end +
      `卷数: ${+handoverInfo.value.onSku}(<${handoverInfo.value.roll1}/${handoverInfo.value.roll2}>-<${handoverInfo.value.roll3}/${handoverInfo.value.roll2}>)` +
      ' | QIY: ' + handoverInfo.value.qty + ' | ' + handoverInfo.value.state + ' | ' + handoverInfo.value.sample
    handoverArr.value.push(handoverInfo.value)
  } else { // 没有卷数
    desc.value += qicStore.queryForm.batch + ' | ' + qicStore.queryForm.DJ + ' | SKU: ' +
      handoverInfo.value.start + ' - ' + handoverInfo.value.end +
      ' | QIY: ' + handoverInfo.value.qty + ' | ' + handoverInfo.value.state + ' | ' + handoverInfo.value.sample
      handoverArr.value.push(handoverInfo.value)
  }

  // 复制数据
  let data:IQICHandoverReq = {
    batch: qicStore.queryForm.batch,
    dj: qicStore.queryForm.DJ,
    employeeNo: qicStore.queryForm.jobNumber.toString(),
    employeeName: qicStore.queryForm._name,
    start: handoverInfo.value.start.toString(),
    end: handoverInfo.value.end.toString(),
    onSku: handoverInfo.value.onSku.toString(),
    startJ: handoverInfo.value.roll1 + '/' + handoverInfo.value.roll2,
    endJ: handoverInfo.value.roll3 + '/' + handoverInfo.value.roll2, // 先是同步分母
    qty: handoverInfo.value.qty.toString(),
    state: handoverInfo.value.state,
    sampling: handoverInfo.value.sample,
    remark: '哇哇'
  }
  // 请求
  AddHandoverRecord(data)
  dialogVisible.value = false
}

// 获取交接记录
const GetHandoverRecords = async () => {
  // 1、判断
  if (isQICValue()) {
    return
  }

  // 2、重置交接记录
  resetHandover()

  // 3、获取
  SelectAllByBatchDj(qicStore.queryForm.batch, qicStore.queryForm.DJ, qicStore.queryForm.jobNumber.toString()).then((res:any)=>{
    // 交接记录处理
    manageHandover(res.data)
  }).catch((err:any)=>{
    console.error(err)
  })
}

// 获取的交接记录处理
const manageHandover = (data:any) =>{
  // 解构
  handoverArr.value.push(...data)

  // 处理数据
  data.forEach((v:IQICHandoverReq, i:number) => {
    desc.value += qicStore.queryForm.batch + ' | ' + qicStore.queryForm.DJ + ' | SKU: ' +
      v.start + ' - ' + v.end
    if (v.startJ !== '') {
      handoverArr.value[i].roll1 = v.startJ.split('/')[0]
      handoverArr.value[i].roll2 = v.startJ.split('/')[1]
      if (v.endJ !== '') {
        desc.value += `,SKU卷数(${+v.end + 1},<${v.startJ}-${v.endJ}>)`
        handoverArr.value[i].roll3 = v.endJ.split('/')[0]
        handoverArr.value[i].roll4 = v.endJ.split('/')[1]
      } else {
        desc.value += `,SKU卷数(${+v.end + 1},<${v.startJ}>)`
      }
    }

    desc.value += ' | QIY: ' + v.qty + ' | ' + v.state + ' | ' + (v.start === '1' ? '未抽样' : '已抽样') + '\n'
  })

  // 3、处理数据 待测
  // handoverArr.value.push(...result.data)
  
  
  // 赋值desc
  // handoverArr.value.forEach(v => {
  //   desc.value += qicStore.queryForm.batch + ' | ' + qicStore.queryForm.DJ + ' | SKU: ' +
  //     v.start + ' - ' + v.end +
  //     ' | QIY: ' + v.qty + ' | ' + v.state + ' | ' + (v.start === '1' ? '未抽样' : '已抽样') + '\n'
  // })

  // handoverArr.value.forEach(v => {
    
  //   desc.value += qicStore.queryForm.batch + ' | ' + qicStore.queryForm.DJ + ' | SKU: ' +
  //     v.start + ' - ' + v.end
    
  //   if (v.roll2 !== undefined) {
  //     if (v.roll4 !== undefined) {
  //       desc.value += `,SKU卷数(${+v.end + 1},<${v.roll1}/${v.roll2}>-<${v.roll3}/${v.roll4}>)`
  //     } else {
  //       desc.value += `,SKU卷数(${+v.end + 1},<${v.roll1}/${v.roll2}>)`
  //     }
  //   }

  //   desc.value += ' | QIY: ' + v.qty + ' | ' + v.state + ' | ' + (v.start === '1' ? '未抽样' : '已抽样') + '\n'
  // })

}

/*****************************方法*****************************/
// 置空交接记录
const resetHandover = ()=>{
  handoverArr.value = []
  handoverInfo.value = {
    id: 1,
    start: 1,
    end: 1,
    qty: '',
    onSku: '',
    sample: '',
    state: '',
    roll1: '',
    roll2: '',
    roll3: '',
    roll4: ''
  }
  desc.value = ''
}

/**
 * 判断单号 姓名，DJ，ip 是否有值
*/
const isQICValue = () => {
  if (qicStore.queryForm.batch === '') {
    messageError('请输入单号')
    return true
  }

  if(qicStore.queryForm.DJ === '' || qicStore.queryForm.DJ === undefined) {
    messageError('没有DJ, 请加载单号')
    return true
  }

  if (qicStore.queryForm._name === '') {
    messageError('请输入工号')
    return true
  }

  if (qicStore.ipData.ip === '' || qicStore.ipData.ip === undefined) {
    messageError('IP信息无效')
    return true
  }
  return false
}

// 当dj更新时,重新获取交接记录 getSaveEpc()
// watch(()=>qicStore.queryForm.DJ,(newVal, oldVal)=> {
//   console.log('************* dj更新 Show **************************')
//   console.log(newVal, oldVal, qicStore.isBatch, qicStore.isRecord)
//   if(newVal !== oldVal && newVal !== '' && qicStore.isBatch === 1 && qicStore.isRecord === 1) {
//     GetHandoverRecords()
//   }
// })
// 用两个监听器
watch(()=>[qicStore.queryForm.DJ, qicStore.isRecord],([djNewVal, reNewVal], [djOldVal, crOldVal])=> {
  console.log('****************** 监听dj isRecord 获取 交接记录 **************************')
  console.log(djNewVal, djOldVal, reNewVal, crOldVal, qicStore.isBatch, qicStore.queryForm.rbo)
  if (djNewVal !== '' && qicStore.isBatch === 1) {
    if (reNewVal === 1) {
      GetHandoverRecords()
    }
  }
})

// 当单号无效时 好像没有效果
watch(()=>qicStore.isBatch, (newVal, oldVal) =>{
  console.log('*********** isBatch show  ***************')
  console.log(newVal, oldVal, qicStore.isBatch, qicStore.isRecord)
  if (newVal !== oldVal) {
    if (newVal === 0 || newVal === -1) {
      // 重置交接记录
      resetHandover()
    }
  }
})

</script>

<template>
  <!-- 生产交接 -->
  <div class="handover-box">
    <div class="qir-title handover-title">
      <div>生产交接</div>
      <el-button-group>
        <el-button type="primary" @click="submitForm(ruleFormRef)">添加交接</el-button>
        <el-button type="primary" @click="resetForm(ruleFormRef)">RESET</el-button>
      </el-button-group>
    </div>
    <el-form ref="ruleFormRef" :inline="true" :model="handoverInfo" class="demo-form-inline"
      status-icon :rules="rules">
      <el-form-item label="">
        <div>SKU:</div>
        <el-input-number v-model="handoverInfo.start" :min="1" />
        <div>-</div>
        <el-input-number v-model="handoverInfo.end" :min="1" />
      </el-form-item>

      <el-form-item label="QIY">
        <el-input-number class="xj-qiy" v-model="handoverInfo.qty" :min="1" placeholder="QIY" :step="10" />
      </el-form-item>

      <el-form-item label="">
        <div>SKU:</div>
        <el-input-number v-model="handoverInfo.onSku" :min="1" />
        卷数:
        <el-input-number v-model="handoverInfo.roll1" :min="1" />
        <div>/</div>
        <el-input-number v-model="handoverInfo.roll2" :min="1" />
        <div>&nbsp;-&nbsp;</div>
        <el-input-number v-model="handoverInfo.roll3" :min="1" />
        <div>/</div>
        <el-input-number v-model="handoverInfo.roll2" :min="1" />
      </el-form-item>

      <!-- <el-form-item label="">
        <div>SKU:</div>
        <el-input class="sb_w_60 sb_h_20" :min="1" type="number" v-model="handoverInfo.start" />
        <div>-</div>
        <el-input class="sb_w_60 sb_h_20" :min="1" type="number" v-model="handoverInfo.end" />
      </el-form-item> -->

      <!-- <el-form-item label="">
        <div>(SKU)卷数:</div>
        <el-input class="sb_w_40 sb_h_20" :min="1" type="number" v-model="handoverInfo.roll1" />
        <div>/</div>
        <el-input class="sb_w_40 sb_h_20" :min="1" type="number" v-model="handoverInfo.roll2" />
        <div>&nbsp;-&nbsp;</div>
        <el-input class="sb_w_40 sb_h_20" :min="1" type="number" v-model="handoverInfo.roll3" />
        <div>/</div>
        <el-input class="sb_w_40 sb_h_20" :min="1" type="number" v-model="handoverInfo.roll2" />
      </el-form-item> -->

      <el-form-item label="" prop="state">
        <el-select v-model="handoverInfo.state" clearable placeholder="请选择交接信息">
          <el-option label="已生产完,剩余未生产" value="已生成完,剩余未生产"/>
          <el-option label="已全部生产完" value="已全部生产完"/>
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="sample">
        <el-select v-model="handoverInfo.sample" clearable placeholder="请选择是否抽样">
          <el-option label="未抽样" value="未抽样"/>
          <el-option label="已抽样" value="已抽样"/>
          <el-option label="不需要" value="不需要"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-input
      v-model="desc"
      placeholder="交接信息"
      show-word-limit
      :rows=2
      type="textarea"
      disabled
    />
    <!-- <div class="qirm-box handover">
      <div class="top">
        <div>SKU:</div>
        <el-input class="sb_w_100 sb_h_20" min="1" type="number" v-model="handoverInfo.min_sku" />
        <div>-</div>
        <el-input class="sb_w_100 sb_h_20" min="1" type="number" v-model="handoverInfo.max_sku" />
        <div>QTY:</div>
        <el-input class="sb_h_20" v-model="handoverInfo.qty" placeholder="QIY" />
        <el-select v-model="handoverInfo.state" clearable placeholder="请选择">
          <el-option
            v-for="item in handover_select"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" @click="addHandover">添加交接</el-button>
      </div>
      <el-input
        v-model="handoverInfo.desc"
        placeholder="交接信息"
        show-word-limit
        :rows=2
        type="textarea"
        disabled
      />
    </div> -->
  </div>
  <!-- 弹框信息 -->
  <el-dialog v-model="dialogVisible">
    <div class="handover-dialog">
      <div class="handover-title">交接信息</div>
      <div class="mr-15 xj-flex">
        工号:<div class="bgc">{{qicStore.queryForm.jobNumber}}</div>
        单号:<div class="bgc">{{qicStore.queryForm.batch}}</div>
        DJ:<div class="bgc">{{qicStore.queryForm.DJ}}</div>
      </div>
      <div class="info">
        生产信息:SKU<div class="bgc">({{handoverInfo.start}}-{{handoverInfo.end}})</div>
        <div class="xj-flex" v-show="isRoll">SKU:<span class="bgc">{{handoverInfo.onSku}}</span>卷数:
          <div class="bgc" :v-show="handoverInfo.roll1">&lt;{{handoverInfo.roll1}}</div>
          <div class="bgc" :v-show="handoverInfo.roll2">/{{handoverInfo.roll2}}&gt;-</div>
          <div class="bgc" :v-show="handoverInfo.roll3">&lt;{{handoverInfo.roll3}}</div>
          <div class="bgc" :v-show="handoverInfo.roll4">/{{handoverInfo.roll2}}&gt;</div>
        </div>
        <div v-show="handoverInfo.state !== '已全部生产完'">{{handoverInfo.state}}</div>
        <div>
          <el-button class="not-click bs-16" type="success" size="large" plain v-show="handoverInfo.state === '已全部生产完'">已完成</el-button>
          <el-button class="not-click bs-16" type="danger" size="large" plain v-show="handoverInfo.state !== '已全部生产完'">交接中</el-button>
        </div>
      </div>
      <div>是否抽样:
        <el-button class="not-click bs-16" type="success" size="large" plain v-show="handoverInfo.sample === '已抽样'">{{handoverInfo.sample}}</el-button>
        <el-button class="not-click bs-16" type="danger" size="large" plain v-show="handoverInfo.sample === '未抽样'">{{handoverInfo.sample}}</el-button>
        <el-button class="not-click bs-16" type="info" size="large" plain v-show="handoverInfo.sample === '不需要'">{{handoverInfo.sample}}</el-button>
      </div>

      <div>
        <el-button class="bs-16" size="large" type="primary" @click="addHandover">添加</el-button>
        <el-button class="bs-16" size="large" type="info" @click="dialogVisible = false">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="less">
.handover-title {
  display: flex;
  justify-content: space-between;
  .el-button {
    font-size: 16px;
  }
}
// 边距
.el-form--inline .el-form-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

// 输入框 
.el-input-number--small {
  width: 80px;
}
.xj-qiy.el-input-number--small {
  width: 120px;
}

.handover .el-textarea {
  font-size: 18px;
}

// 弹框信息
.handover-dialog {
  font-size: 18px;
  color: #000;
  letter-spacing: .2em;
  >div {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.handover-title {
  text-align: center;
  font-size: 24px;
  font-weight: 800;
}
.info {
  display: flex;
  align-items: center;
  >div {
    margin-right: 10px;
  }
}
.xj-flex {
  display: flex;
}
.bgc {
  background-color: antiquewhite;
}
.mr-15 div {
  margin-right: 15px;
}
.bs-16 {
  font-size: 16px;
}
</style>