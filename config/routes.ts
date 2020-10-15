export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    name: 'user',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    name: 'root',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/home',
          },
          {
            name: '首页',
            path: '/home',
            component: './home',
          },
          {
            name: '查询中心',
            path: '/queryCore',
            routes: [
              {
                name: '委外管理员',
                path: '/queryCore/outsourcing',
                routes: [
                  {
                    name: '委案历史',
                    path: '/queryCore/outsourcing/history',
                    component: './queryCore/outsourcing/history',
                  },
                  {
                    name: '还款查询',
                    path: '/queryCore/outsourcing/repaymentQuery',
                    component: './queryCore/outsourcing/repaymentQuery',
                  },
                ],
              },
              {
                name: '机构管理员',
                path: '/queryCore/mechanism',
                component: './queryCore/mechanism',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
