<template>
    <div>
        <!-- 当购物车中空时显示 -->
        <view class="empty-car" v-if="isEmpty">
            <image src="/static/img/kong.png" />
            <span class="empty-car-tips">购物车还是空的</span>
            <span class="empty-car-tips extra">快去逛逛吧</span>
        </view>
        <view v-else>
            <!-- 购物车中不为空时 -->
            <!-- 头部 -->
            <view class="shop-head">
                <view class="shop-head-info">
                    <i class="iconfont icon-shop flex-center icon-dianpu"></i>
                    <span class="shop-name"> 品优生活馆</span>
                </view>
            </view>
        </view>
        <!-- 商品栏 -->
        <view class="goods-item" v-for="item in goodsList" :key="item.goods_id" >
          <!-- 左边勾选框 -->
          <view @click="toggleSelect(item)" :class="['pubIcon', item.isselect?'trueIcon':'falseIcon']"></view>
          <!-- 中间图片 -->
        <view class="goods-item-pic">
         <image :src="item.goods_small_logo" />
        </view>
        <!-- 右边文字 -->
         <view class="goods-item-info">
          <text class="goods-item-info-title">{{item.goods_name}}</text>
          <text class="goods-item-info-price">￥{{item.goods_price}}</text>
          <view class="goods-item-info-edit">
            <view class="outer">
              <view :style="{'color':item.goods_number == 1 ? '#ccc' : 'black'}" @click="substrict(item)">-</view>
              <view class="value">
                <input
                  style="font-size:12px;color:#999;"
                  v-model="item.goods_number"
                  @input="changeValue(item)"
                  type="number"
                /></view>
              <view @click="add(item)" class="add">+</view>
            </view>
            <text @click="deleteGoods(item.goods_id)">| 删除</text>
          </view>
        </view>
      </view>
      <!-- 底部区 -->
     <view class="fixed-bar">
        <view @click="toggleAllSelect" class="allselect">
          <view :class="['pubIcon',isAllSelect ? 'trueIcon':'falseIcon']"></view><text>全选</text>
        </view>
        <view class="statistics">
          <view>
            <text>合计：</text>
            <text style="color:red;font-size:15px;">￥{{getTotalPrice}}</text>
          </view>
          <text>包含运费</text>
        </view>
        <view @click="goToPay" :class="['jiesuan',getTotalCount === 0 ? 'disabled':'']">
          <text>去结算({{getTotalCount}})</text>
        </view>
      </view>
    </view>
    </div>
</template>


<script>
//导入封装的方法
import {getLocalGoods,updataGoods,deleteGoods}from "../common/common"

export default {
    data(){
        return {
            isEmpty:true, //购物车车是否为空，显示或隐藏
            goodsList:[], //数据
            // isselect:true,  //进入页面商品是否全选
            isAllSelect:true  //点击全选按钮
        }
    },
    onShow(){
      //调用函数
      this.getShopCartData()
    },
    computed: {  //计算属性必须有返回值
      //计算选中的数量
      getTotalCount(){
        let num = 0; //中数量
        this.goodsList.forEach(item =>{
          //选中就把数量加在一起
          if(item.isselect){
            num += item.goods_number
          }
        })
        return num
      },
      //计算重价格
      getTotalPrice(){
        let money = 0; //总价格
        this.goodsList.forEach(item =>{
            if(item.isselect){
            money += item.goods_number * item.goods_price
          }
        })
        return money
      }
      
    },
    methods: {
        //获取选中商品的数据
      async  getShopCartData(){
            //现获取本地的商品id和数量 返回的是一个对象
          let objNum =  getLocalGoods()
          //通过keys方法回去到商品的id 存储的方式是以{id:数量} 返回以键组成的数组
          let ids = Object.keys(objNum)
          //判断从本地获取的数据是否为空
          if(ids.length == 0) {
            //如果为0 就把isEmpty=false
            this.isEmpty = true
            return  //就没必要继续往下面执行了
          }
          //能走下面说明不为空 
          this.isEmpty = false
          //获取数据后 发送请求
         let res = await this.$axios.get(`goods/goodslist?goods_ids=${ids.join(',')}`)
          //遍历添加数据的数量和是否选中

          res.data.message.forEach(ele => {
            ele.goods_number = objNum[ele.goods_id]
            ele.isselect = true
          });
          //再把数据给 goodsList
          this.goodsList = res.data.message
        },
        //点击全选
        toggleAllSelect(){
          //点击全选取反
          this.isAllSelect = !this.isAllSelect
          //其他选项跟着一起变
          this.goodsList.forEach(item =>{
            item.isselect = this.isAllSelect
          })
        },
        //点击本商品选中不选中
        toggleSelect(item){
          //本条数据的选中取反
          item.isselect = !item.isselect
          //有一项没有选中就不选中
          //开关思想,假设都是选中状态,遍历有一个不是选中就给false
          let allselect = true
          this.goodsList.some(item =>{
            //如果有false就直接false
            if(!item.isselect){
              allselect = false
            }
            return  
          })
          this.isAllSelect = allselect
        },
        // 点击添加
        add(item){
          //自身的数据也要加加
          item.goods_number++
          //调用封装的函数
          updataGoods({
            goods_id:item.goods_id,
            goods_number:item.goods_number
          })
        },
        //点击减
      substrict(item){
        //自身减减
        item.goods_number--
        //调用方法传入参数
          updataGoods({
            goods_id:item.goods_id,
            goods_number:item.goods_number
          })
      },
      // 删除本商品
      deleteGoods(goods_id){
        wx.showModal({
          title: '提示', //提示的标题,
          content: '确定要删除商品吗?', //提示的内容,
          showCancel: true, //是否显示取消按钮,
          cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
          cancelColor: '#000000', //取消按钮的文字颜色,
          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3CC51F', //确定按钮的文字颜色,
          success: res => {
            if (res.confirm) {
                 //data中删除本数据
                  //通过findindex方法 查询出本数据在goodsList中的索引
                let num = this.goodsList.findIndex(item =>{
                    item.goods_id === goods_id
                  })
                  //通过索引进行删除数据
                  this.goodsList.splice(num,1)
                  //调用方法删除本地的数据
                  deleteGoods(goods_id)
                  //删除后是否为空,为空就要提示为空页面
                  this.isEmpty = this.goodsList.length === 0
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        });
    
      },
      //修改input框中的数据
      changeValue(item){
        //调用方法传入参数
          updataGoods({
            goods_id:item.goods_id,
            goods_number:item.goods_number
          })
      }
    },
}
</script>

<style lang="less" scoped>
@PADDING-LEFT: 20rpx;
.empty-car {
  display: flex;
  flex-direction: column;
  height: 500rpx;
  justify-content: center;
  align-items: center;
  image {
    width: 125rpx;
    height: 124rpx;
  }
  &-tips {
    margin-top: 30rpx;
    font-size: 28rpx;
    color: #666;
  }
}
.extra {
  font-size: 24rpx;
  color: #999;
}
.shop-head {
  background-color: #fff;
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 @PADDING-LEFT;
  border-bottom: 1px solid #ddd;
  &-info {
    display: flex;
    align-items: center;
    .shop-name {
      margin-left: 10rpx;
      color:#333;
    }
  }
}
.goods-item {
  height: 220rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding-left: @PADDING-LEFT;
  border-bottom: 1px solid #eee;
  &-pic {
    width: 160rpx;
    height: 160rpx;
    margin-left: 10rpx;
    border: 1px solid #ddd;
    padding: 10rpx;
    border-radius: 5rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  &-info {
    flex: 1;
    height: 180rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0rpx @PADDING-LEFT;
    &-title {
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 30rpx;
    }
    &-price {
      color: #ff2d4a;
      font-size: 30rpx;
    }
    &-edit {
      display: flex;
      justify-content: space-between;
      .outer {
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        border-radius: 5rpx;
        view {
          height: 50rpx;
          width: 50rpx;
          line-height: 50rpx;
          text-align: center;
        }
        .value {
          width: 65rpx;
          border-left: 1px solid #ddd;
        }
        .add {
          border-left: 1px solid #ddd;
        }
      }
    }
  }
}
.pubIcon {
  background: url(https://mcart.jiuxian.com/statics/images/cart/catIcon.png)
    no-repeat 0 0;
  background-size: 300rpx 300rpx;
  width: 55rpx;
  height: 55rpx;
}
.trueIcon {
  background-position: 0 -225rpx;
}
.falseIcon {
  background-position: -50rpx -225rpx;
}
.fixed-bar {
  display: flex;
  height: 98rpx;
  width: 750rpx;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  .allselect {
    padding-left: @PADDING-LEFT;
    width: 200rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
  }
  .statistics {
    flex: 1;
    display: flex;
    // align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .jiesuan {
    width: 200rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ff2d4a;
    text {
      color: #fff;
    }
  }

  .disabled {
    background-color: #ddd;
  }
}
</style>
