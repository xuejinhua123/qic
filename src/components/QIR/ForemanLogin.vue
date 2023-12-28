<!-- 领班登录 -->
<script setup lang="ts">
import { ref, watch } from 'vue'
// pinia
import { useQirPinia } from '../../store/qir'
import { messageError } from '../../tools/element-plus/SBMessage';
import { foremanLogin, updatePad } from '../../tools/api/userApi';
const qicStore = useQirPinia()

// let isShowLogin = ref(false) // 是否显示弹框(登录)
const isResetPad = ref<boolean>(false) // 是否显示重置密码，true：显示，false：不显示

// 领班登录信息
let foreman = ref({
  account: '',
  password: '',
  newpassword: ''
})
// 登录
const login = () => {
  console.log('登录信息 ==> ', foreman.value)
  if (foreman.value.account === '') {
    messageError('请输入工号')
    return
  }
  if (foreman.value.password === '') {
    messageError('请输入密码')
    return
  }

  foremanLogin(foreman.value.account, foreman.value.password).then((res:any)=>{
    console.log(res)
    // userData.value = res.data
    qicStore.qicUser = res.data

    // 开启权限（修改权限）
    qicStore.isForemanLogin = true
    // 取消禁用
    // isDisabled.value = false

    // 关闭登录界面
    qicStore.isShowLogin = false

    // 重置登录信息
    resetLoginInfo()
  }).catch((err:any)=>{
    console.error(err)
  })
  // 登录成功
  // const results = await foremanLogin(foreman.value.account, foreman.value.password)
  // userData.value = results.data
  // qicStore.qicUser = results.data
  // console.table(userData.value)
  // console.table(qicStore.qicUser)
  // if (results !==-1) {

  //   // 开启权限（修改权限）
  //   qicStore.isForemanLogin = true

  //   // 取消禁用
  //   // isDisabled.value = false

  //   // 关闭登录界面
  //   isShowLogin.value = false

  //   // 重置登录信息
  //   resetLoginInfo()
  // }
  // 回车修改成功(鼠标离开界面)
}

// 回车登录
const changeLogin = () => {
  console.log('回车 ==> ')
  if (!isResetPad.value) {
    login()
  }
}

// 修改密码
const clickUpdatePassword = () => {
  console.log('账号信息 ==> ', foreman.value)
  if (foreman.value.account === '') {
    messageError('请输入工号')
    return
  }
  if (foreman.value.password === '') {
    messageError('请输入密码')
    return
  }
  if (foreman.value.newpassword === '') {
    messageError('请输入新密码')
    return
  }
  if (foreman.value.password === foreman.value.newpassword) {
    messageError('新密码与旧密码相同')
    return
  }
  updatePad(foreman.value.account, foreman.value.password, foreman.value.newpassword).then((res:any)=>{
    console.log(res)
    // 重置登录信息
    foreman.value.password = ''
    foreman.value.newpassword = ''
    // 显示登录界面
    isResetPad.value = false
  }).catch((err:any)=>{
    console.error(err)
  })

  // // 重置登录信息
  // resetLoginInfo()
  
  // // 显示登录界面
  // isResetPad.value = false
}
// 重置登录输入框信息
const resetLoginInfo = ()=>{
  foreman.value.account = ''
  foreman.value.password = ''
  foreman.value.newpassword = ''
}


watch(()=>qicStore.isShowLogin, (newVal, oldVal)=>{
  if (newVal !== oldVal && newVal === false) {
    isResetPad.value = false
  }
})
</script>

<template>
  <el-dialog
    v-model="qicStore.isShowLogin"
    title="领班登录"
    width="30%"
    align-center
    draggable
  >
  <el-form
      ref="foremanLoginRef"
      :model="foreman"
      status-icon
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="员工号" prop="account">
        <el-input v-model="foreman.account" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="foreman.password" type="password" autocomplete="off" show-password @change="changeLogin" />
      </el-form-item>
      <el-form-item label="新密码" prop="newpassword" v-show="isResetPad">
        <el-input v-model="foreman.newpassword" type="newpassword" autocomplete="off" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isResetPad = !isResetPad">{{isResetPad ? '返回登录' : '修改密码'}}</el-button>
        <el-button @click="qicStore.isShowLogin = false">Cancel</el-button>
        <el-button type="primary" @click="login" v-show="!isResetPad">登录</el-button>
        <el-button type="primary" @click="clickUpdatePassword" v-show="isResetPad">修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">

</style>