//  处理获取地址   vue混入
export default {
    data(){
        return {
            address:null  //地址信息
        }
    },
    methods: {
         //当点击的时候选择地址
         chooseAddress(){
            //通过微信api让用户是否同意获取地址授权
            wx.chooseAddress({
                //用户同意,并且选着了地址
              success: res => {
                      res.detailAddress = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
                // 给 address 赋值
                // console.log(res.detailAddres)
                this.address = res
                // console.log(this.address)
                //通过微信元素方法把数据存储到本地
                wx.setStorageSync('address',res)
              },
              //当用户拒绝或者是同意了，但是没有选择地址
              fail:({errMsg}) =>{
                if (errMsg === "chooseAddress:fail auth deny") {
                    wx.showModal({
                      title: "提示", //提示的标题,
                      content: "请去我的页面打开授权选择收货地址", //提示的内容,
                      showCancel: false, //是否显示取消按钮,
                      confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
                      confirmColor: "#3CC51F", //确定按钮的文字颜色,
                      success: res => {
                        if (res.confirm) {
                          wx.switchTab({ url: "/pages/my/main" });
                        }
                      }
                    });
                  }
              }
            });
        },
    },
}