<!-- 修改机台号 -->
<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useQirPinia } from '../../store/qir'
import { SaveIp } from '../../tools/api/qicApi';
import { messageError } from '../../tools/element-plus/SBMessage';
const qicStore = useQirPinia()

const IpInfo = reactive({
  team: '',
  jobNum: ''
})

onMounted(()=>{
  if (qicStore.isIP){
    IpInfo.team = qicStore.queryForm.type
    IpInfo.jobNum = qicStore.queryForm.machineNo
  }
})

const addIP = ()=>{
  console.table(IpInfo)
  if (IpInfo.team === '') {
    messageError('请输入组别')
    return
  }
  if (IpInfo.jobNum === '') {
    messageError('请输入机台号')
    return
  }
  SaveIp(IpInfo.team, IpInfo.jobNum)
}
const updateIP = ()=>{
  console.table(IpInfo)
  if (IpInfo.team === '') {
    messageError('请输入组别')
    return
  }
  if (IpInfo.jobNum === '') {
    messageError('请输入机台号')
    return
  }
  SaveIp(IpInfo.team, IpInfo.jobNum)
}
const resetInput = ()=>{
  IpInfo.jobNum = ''
  IpInfo.team = ''
}
</script>

<template>
  <div>
    <div class="ip-title">{{qicStore.isIP ? '修改' : '添加' }}机台信息</div>

    <div>
      <el-form :inline="true" :model="IpInfo" class="demo-form-inline" status-icon size="defalut">
      <el-form-item label="组别" prop="组别">
        <el-input v-model="IpInfo.team" placeholder="组别" clearable />
        <!-- <el-select v-model="IpInfo.team">
          <el-option label="ADTP1" value="ADTP1" />
          <el-option label="Inkjet" value="Inkjet" />
          <el-option label="SN700" value="SN700" />
        </el-select> -->
      </el-form-item>
      <el-form-item label="机台号" prop="机台号">
        <el-input v-model="IpInfo.jobNum" placeholder="机台号" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-show="!qicStore.isIP" @click="addIP">添加</el-button>
        <el-button type="success" @click="updateIP">修改</el-button>
        <el-button type="info" @click="resetInput">RESET</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.ip-title {
  padding-bottom: 30px;
  font-size: 20px;
  text-align: center;
  font-weight: 800;
}
</style>