// 封装一个axios的模块
// 导入vue和axios包
import Vue from 'vue'
import axios from 'axios'
// 统一设置请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8899/api/public/v1/' 

//设置拦截器
axios.interceptors.request.use(config =>{
  //判断本地是否有token
  if(wx.getStorageSync("token")){
    //如果有就设置到请求头中
    //config是整个请求
    config.headers.Authorization =wx.getStorageSync("token")
    // console.log(JSOn.toStringfy(wx.getStorageInfoSync("token")))
    // console.log(wx.getStorageSync("token"))
  }
  //再返回 config
  return config

  //注意pc或普通请求中(以xhr的请求)设置了请求头就可以了
  //但是微信小程序底层发送请求不是xhr 是wx.requset() 还要在适配器中修改 添加一个header
})



// 设置适配器(替换axios底层的发送网络请求方式)通过adapter方法
axios.defaults.adapter = function (config) {
    // console.log(config)
  // 需要返回一个promise对象,直接return
  return new Promise((resolve, reject) => {
    // 异步请求服务器需要时间，所以在发送请求的时候设置一个正在加载的动图
    wx.showLoading({
      title: '正在加载...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    mpvue.request({
      url: config.url,
      data: config.data,
      method: config.method,
      header: config.headers,
      dataType: 'json',
      success: res => {
        // 把成功请求返回出去
       
        resolve(res)
      },
      fail: err => {
        // 把错误信息返回出去
        reject(err)
      },
      // 不管请求是否成功都要执行的方法
      complete:()=>{
        //当加载结束都要执行，结束图标
        wx.hideLoading();
      }
    })
  })
}
// 最后把设置后的axios添加到Vue的原型中去
Vue.prototype.$axios = axios
//注意:当注册插件后年需要到最外面的main.js中导入
