import Vue from 'vue'
import App from './App'
//注意:当注册插件后年需要到最外面的main.js中导入  如果命名的事index.js就不用到文件,直接打文件夹就可以了
import "./axios/axios"

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
