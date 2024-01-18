<script setup lang="ts">
// vue
import { ref, reactive } from 'vue'


// 导入
import type { ViewNick } from '../tools/interface/iMode'

// 变量
const currentDate = ref(new Date())
let viewDate = reactive<ViewNick[]>([]) // 模块数据
const _row = ref<number>(4) // 一行的模块数目
let _row_num = ref<number>(1) // 多少行

viewDate = [
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    title: '质量检测报表',
    name: 'QualityInspectionReport',
    img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  }
]
console.log(viewDate.length)
_row_num.value = Math.floor(+viewDate.length / _row.value) + 1
console.log(_row_num.value)

</script>

<template>
  <div class="mian">
    <el-row v-for="(value, index) in _row_num" :key="value">
      <el-col v-for="(v, i) in viewDate.slice(index*_row, index*_row + _row)" :key="i" :span="_row" :offset="i > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }" class="sb_card" shadow="hover" @click="() => $router.push({ name: v.name })">
          <img
            :src="v.img"
            class="image"
          />
          <div style="padding: 14px">
            <span>{{v.title}}</span>
            <div class="bottom">
              <time class="time">{{ currentDate }}</time>
              <el-button text class="button">{{v.name}}</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.mian {
  >.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.sb_card {
  cursor: pointer;
}
.sb_card:hover {
  transform: scale(1.2, 1.2)
}
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
</style>
