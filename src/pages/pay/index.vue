<template>
  <div>
    <view @click="chooseAddress" class="address">
      <view v-if="address" class="address-info">
        <view class="address-info-name-phone">
          <view>
            <text style="font-size:12px;">收货人：{{address.userName}}</text>
          </view>
          <view style="display:flex;align-items: center;">
            <text style="margin-right:36rpx;font-size:12px;">{{address.telNumber}}</text>
            <view class="iconfont-tap icon-jiantouyou"></view>
          </view>
        </view>
        <view class="address-info-detail-info">
          <text style="font-size:12px;">收货地址：{{address.detailAddress}}</text>
        </view>
      </view>
      <view v-else class="address-add">
        <text style="font-size:12px;">+ 新增地址</text>
      </view>
      <view class="address-pic">
        <image src="/static/img/cart_border@2x.png"/>
      </view>
    </view>
    <!-- 2.0 购买的商品列表 -->
    <view class="order-list">
      <block v-for="item in goodsList" :key="item.goods_id">
        <view class="product-item">
          <navigator class="product-left">
            <image :src="item.goods_small_logo" />
          </navigator>
          <view class="product-right">
            <navigator class="product-name">{{item.goods_name}}</navigator>
            <view class="product-right-price">
              <text class="product-right-price-symbol">￥</text>
              <text class="product-right-price-integer">{{item.goods_price}}</text>
              <text class="product-right-price-decimal">.00</text>
            </view>
            <view class="product-right-num">x{{item.goods_number}}</view>
          </view>
        </view>
      </block>
    </view>
    <!-- 3.0 金额统计 -->
    <view class="order-total">
      <view class="order-total-item">
        <text>商品金额</text>
        <text class="order-total-item-price">￥{{totalAmount}}</text>
      </view>
      <view class="order-total-item">
        <text>运 费</text>
        <text class="order-total-item-price">￥+0.00</text>
      </view>
      <block v-if="token">
        <view @click="goToOrder" class="wxPay">微信支付</view>
      </block>
      <block v-else>
        <button @getuserinfo="wxLogin" open-type="getUserInfo" class="wxLogin">登录后下单支付</button>
      </block>
    </view>
  </div>
</template>

<script>
//引入模块
import { getLocalGoods } from "../common/common";
import chooseAddress from "../chooseAdress/chooseAdress";
export default {
  // vue混入语法
  mixins: [chooseAddress],
  data() {
    return {
      goodsList: [], //存储商品数据
      token:null,  //token数据
      totalAmount:0  //商品的价格
    };
  },
  onLoad(option) {
    //接受参数
    //并调用函数
    this.getGoodsListData(option.ids);
    //

    //判断本地有没有存储地址
    if (wx.getStorageSync("address")) {
      this.address = wx.getStorageSync("address");
    }
    //检测是否已经登录了,判断是否有token存在
    if(wx.getStorageSync('token')){
      this.token = wx.getStorageSync('token')
    }
  },
  methods: {
    async getGoodsListData(ids) {
      //获取本地商品的信息
      let localGoods = getLocalGoods();

      //请求服务器获取数据
      let res = await this.$axios.get(`goods/goodslist?goods_ids=${ids}`);
      //把从本地获取的商品数量添加到 数据中去
      res.data.message.forEach(ele => {
        ele.goods_number = localGoods[ele.goods_id];
        this.totalAmount += ele.goods_number * ele.goods_price 

      });
      //添加到数据中后,在把数据给goodsList 中
      this.goodsList = res.data.message;
      // console.log(this.goodsList)
    },
    //当结算时需要登录
    wxLogin(e){
      //e  是button按钮点击是触发的,
      //判断用户是否拒绝授权
      if (e.mp.detail.errMsg == "getUserInfo:fail auth deny")  return  //拒绝就直接返回后面没法玩儿

      //当授权后就把需要的数据之间存储到 storage 中
      //微信方法
      wx.setStorageSync('userInfo',e.mp.detail.userInfo)

      //进行登录 
      wx.login({
        success: async(res) => {
          // console.log(res)  
        //向服务器发送登录请求
        let res1 = await this.$axios.post("users/wxlogin",{
          //传入的参数
          code:res.code,
          encryptedData:e.mp.detail.encryptedData,
          iv:e.mp.detail.iv,
          rawData:e.mp.detail.rawData,
          signature:e.mp.detail.signature
        })
        // console.log(res1)
        //判断是否请求成功, 获取到token 后保存到本地
        if(res1.data.meta.status == 200){
          this.token = res1.data.message.token
          // console.log(111111111)
          //保存到本地
          wx.setStorageSync('token',res1.data.message.token)
        }
        }
      });

    },
    //进行支付
    async goToOrder(){
      //判断是否有授权地址, 有没有地址
      if(!this.address){
        wx.showToast({
          title: '请选择地址', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
        //没选地址直接提示后 不执行后面的
        return
      }
      //获取下单需要的参数
      let params = {
        order_price:this.totalAmount,
        consignee_addr:this.address.detailAddress,
        goods:this.goodsList.map(item => {
          return {
            goods_id: item.goods_id,
            goods_number: item.goods_number,
            goods_price: item.goods_price
          }
        })
      }
      // console.log(params)
      // //对服务器发送请求  发送请求需要带上请求头  去封装的$axios中设置请求拦截器
      // let res2 = await this.$axios.post("my/orders/create",{
      //   params
      // })
      // console.log(res2)
      //不知道是不是后台有问题,请求不过来数据直接看老师的代码写死参数,订单号
      this.pay("HMDD20190526000000001094")
    },
    //单独定义一个下单的函数(方法)
    async pay(order_number){
      let res = await this.$axios.post("my/orders/req_unifiedorder",{
        order_number
      })
        console.log(res)
      //需要调用微信api 唤起微信支付 wx.requestPayement 
      wx.requestPayment({
        timeStamp: 'timeStamp', //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
        nonceStr: 'nonceStr', //随机字符串，长度为32个字符以下,
        package: 'package', //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
        signType: 'MD5', //签名算法，暂支持 MD5,
        paySign: 'paySign', //签名,具体签名方案参见小程序支付接口文档,
        success: res => {},
        fail: () => {},
        complete: () => {}
      });

    }
  }
};
</script>



<style scoped lang="less">
.address {
  height: 222rpx;
  background-color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &-info {
    display: flex;
    height: 160rpx;
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
    &-name-phone {
      display: flex;
      justify-content: space-between;
      padding: 0rpx 30rpx;
    }
    &-detail-info {
      padding: 0rpx 30rpx;
    }
  }
  &-add {
    width: 360rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    margin: 100px auto;
    color: #999;
    background-color: #f4f4f4;
  }
  &-pic {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 750rpx;
    height: 15rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.iconfont-tap {
  font-family: "iconfont" !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  min-width: 88rpx;
  min-height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-jiantouyou {
  position: absolute;
  top: 32rpx;
  right: 0;
}
.icon-jiantouyou:before {
  font-size: 24rpx;
  color: #999;
  line-height: 1;
  width: 15rpx;
  height: 25rpx;
}
.order-list {
  background-color: #fff;
}
.product-item {
  display: flex;
  padding: 30rpx 20rpx;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 20rpx;
    right: 0;
    bottom: 0;
    border-bottom: 1rpx solid #ddd;
  }
  .product-left {
    width: 200rpx;
    height: 200rpx;
    background-color: #eee;
    margin-right: 26rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .product-right {
    width: 480rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    .product-name {
      height: 84rpx;
      font-size: 30rpx;
      line-height: 1.4;
      /* 多行文字隐藏省略号 */
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    &-price {
      text {
        color: #ff2d4a;
      }
      &-symbol,
      &-decimal {
        font-size: 28rpx;
      }
      &-integer {
        font-size: 44rpx;
      }
    }
    &-num {
      position: absolute;
      right: 0;
      bottom: 0;
      letter-spacing: 2rpx;
      color: #999;
    }
  }
}
.order-total {
  background-color: #fff;
  margin-top: 20rpx;
  height: 300rpx;
  &-item {
    height: 80rpx;
    display: flex;
    align-items: center;
    padding: 0rpx 30rpx;
    justify-content: space-between;
    &-price {
      color: #ff2d4a;
    }
  }
}
.wxLogin {
  margin-top: 10rpx;
  width: 720rpx;
}
.wxPay {
  margin-top: 10rpx;
  margin-left: 15rpx;
  width: 720rpx;
  background-color: #00c000;
  display: flex;
  height: 80rpx;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 32rpx;
  border-radius: 5rpx;
}
</style>