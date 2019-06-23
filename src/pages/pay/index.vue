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
        <image src="/static/img/cart_border@2x.png" />
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
    </div>
</template>

<script>
//引入模块
import {getLocalGoods} from "../common/common"
import chooseAddress from "../chooseAdress/chooseAdress"
export default {
    // vue混入语法
    mixins:[chooseAddress],
    data() {
        return {
            goodsList:[]  //存储商品数据
        }
    },
    onLoad(option){
        //接受参数
        //并调用函数
        this.getGoodsListData(option.ids)

        //判断本地有没有存储地址
        if(wx.getStorageSync('address')){
            this.address = wx.getStorageSync('address')
        }
    },
    methods: {
        async getGoodsListData(ids){
            //获取本地商品的信息
            let localGoods = getLocalGoods()

            //请求服务器获取数据
            let res = await this.$axios.get(`goods/goodslist?goods_ids=${ids}`)
            //把从本地获取的商品数量添加到 数据中去
            res.data.message.forEach(ele => {
                ele.goods_number = localGoods[ele.goods_id]
            });
            //添加到数据中后,在把数据给goodsList 中
            this.goodsList = res.data.message
            console.log(this.goodsList)
        }
    },
    
}
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