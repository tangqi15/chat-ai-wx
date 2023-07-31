#  使用 pnpm 作为包 管理工具

  为了 使用  pnpm why 包名    看看哪些包 依赖

## Project setup
```
小程序依赖安装npm run ic
若小程序首次启动使用npm i，后续启动为保证插件正确安装，需使用npm run serve命令启动
```

### Compiles and hot-reloads for development
```
小程序运行npm run dev:mp-weixin或npm run serve
```

### Compiles and minifies for production
```
构建命令npm run build
```

### Customize configuration
项目依托于CLI[uni-app]并且使用了UI组件库[uni-ui，vant-weapp]


### sfc.d.ts   用来解决 类型声明的问题。    ts 会校验  vue 文件没有类型声明，无法被  import  引入
Vue项目中使用了当文件组件（SFC）,可以添加一个  *.vue 的类型 声明文件，通常被 肠胃 *.d.ts 文件，来解决类型声明的问题。