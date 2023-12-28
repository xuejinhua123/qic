export const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Main.vue')
  },
  {
    path: '/qir',
    name: 'QualityInspectionReport',
    component: () => import('../views/QualityInspectionReport.vue')
  },
  // {
  //   path: '/',
  //   name: 'Login',
  //   component: () => import('../views/Login.vue')
  // },
  // {
  //   path: '/main',
  //   name: 'Main',
  //   component: () => import('../views/Main.vue'),
  //   children: [
  //     {
  //       path: '/home',
  //       alias: '',
  //       name: 'Home',
  //       component: () => import('../views/menu/Home.vue')
  //     },
  //     {
  //       path: '/snack/:sorts',
  //       name: 'Snack',
  //       component: () => import('../views/menu/Snack.vue'),
  //       beforeUpdate: (to, from) => {
  //         console.log('to ==> ', to.name)
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/not',
  //   name: 'Not',
  //   component: () => import('../views/error/Not.vue')
  // },
  // // 测试
  // {
  //   path: '/father',
  //   name: 'Father',
  //   component: () => import('../views/Test/Father.vue')
  // }
]
