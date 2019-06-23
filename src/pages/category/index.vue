<template>
    <div class="categories">
        <!-- 左边栏 -->
        <scroll-view class="categories-left" scroll-y :style="{height:windowHeight + 'px'}" >
            <div @click="toselect(index)" :class="['categories-left-item',selectIndex ===index? 'categories-left-active' :'' ]" v-for="(item,index) in oneData" :key="index">
                <span>{{item.cat_name}}</span>
            </div>
        </scroll-view>
        <!-- 右边商品栏 -->
        <!-- 滚动条标签必选要设置高，不然不会有滚动效果 -->
        <!-- 设置高的时候注意需要加上单位 -->
        <scroll-view scroll-y class="categories-right" :style="{height:windowHeight + 'px'}">
            <div class="categories-right-item"  v-for="(item1,index1) in selectData" :key="index1">
                <!-- 第二层 -->
                <div class="categories-right-item-title">
                    <span>{{item1.cat_name}} </span>
                </div>
                <div class="categories-right-item-body">
                <!-- 第三层 -->
                <div class="right-body-item" v-for="(item2,index2) in item1.children" :key="index2">
                    <image :src="item2.cat_icon" />
                    <span class="right-body-item-title">{{item2.cat_name}}</span>
                </div>
            </div>
              </div>
        </scroll-view>
    </div>
</template>

<script>
export default {
    data(){
        return {
            oneData:[], //第一层的数据
            selectIndex:0, //选中的标签
            selectData:[], //默认显示的数据
            windowHeight:0  //屏幕可用高度
        }
    },
    onLoad(){
        //页面加载时执行函数
        this.getCategoryData()

        //当页面加载时就要检测屏幕高度（实际可用高度）
        //通过解构直接获取高度，
        const {windowHeight} = wx.getSystemInfoSync();
        this.windowHeight = windowHeight -10   //样式总有一个margin-top:10 ,所以减去10


    },
    methods: {
        //加载数据
       async getCategoryData(){
            //发送请求
          let res = await this.$axios.get("categories")
          this.oneData = res.data.message
        //   console.log(res)
          //当已经入页面时默认显示第一个的一二三层
          this.selectData = this.oneData[0].children
        },
        // 点击选中
        toselect(index){
            //点击谁就把selectIndex 等于谁的index
            this.selectIndex = index
            //当选中某一项时显示对应的二三层的数据
            this.selectData = this.oneData[index].children
        }
    },
}
</script>
<style lang="less" scoped>
.categories {
  display: flex;
  margin-top: 10px;
  &-left {
    width: 200rpx;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    background-color: #f4f4f4;
    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200rpx;
      height: 100rpx;
      position: relative;
      span{
        color:#999;
      }
    }
    &-active {
      background: #fff;
      text{
        color:#000;
      }
      &::before {
        position: absolute;
        content: '';
        background-color: #ff2d4a;
        left: 0;
        top: 10rpx;
        width: 5px;
        height: 80rpx;
      }
    }
  }
  &-right {
    flex: 1;
    background-color: #fff;
    &-item {
      &-title {
        display: flex;
        justify-content: center;
        align-items: center;
        color:#666;
        font-size: 14px;
        &::before {
          content: '/';
          color: #eeeeee;
          margin-right: 20rpx;
        }

        &::after {
          content: '/';
          color: #eeeeee;
          margin-left: 20rpx;
        }
      }
      &-body {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}
image {
  width: 100rpx;
  height: 80rpx;
}
.right-body-item {
  height: 200rpx;
  width: 33.33333%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-title{
    margin-top:5rpx;
    color:#666;
    font-size: 14px;
  }
}
</style>
