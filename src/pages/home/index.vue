<template>
<div>
  <!-- 轮播图 -->
  <swiper indicator-dots autoplay circular>
      <block v-for="(item,index) in swiperdata"  :key="index">
        <navigator :url="item.navigator_url">
          <swiper-item>
              <image mode="aspectFill" :src="item.image_src"></image>
          </swiper-item>
          </navigator>
      </block>
  </swiper>
  <!-- 菜单栏 -->
    <!-- 通过遍历的方式来渲染页面 -->
     <div class="categories">
      <div v-for="item in nav" :key="item.id" class="category-item ">
        <image :src="item.image_src"/>
      </div>
    </div>
    <!-- 楼层数据 -->
    <div v-for="(item,index) in loordatas" :key="index" class="floor">
     <!-- 楼梯层的title -->
      <div class="floor-header">
        <image :src="item.floor_title.image_src" />
      </div>
      <div class="floor-body">
        <!-- 左边的 -->
        <div class="floor-body-left">
          <img :src="item.product_list[0].image_src" />
        </div>
        <!-- 右边的 -->
       <div  class="floor-body-rigth">
           <div v-if="index1 > 0"  v-for="(item1,index1) in item.product_list" :key="index1" :style="{width:item1.image_width + 'rpx'}">
              <image :src="item1.image_src" class="floor-rigth-img"/> 
           </div>
       </div>
      </div>
    </div>
    <!-- 底部部 -->
       <div class="goTop">
         <i class="iconfont .icon-xiao"></i>
         <span class="bottomline">我是有底线的...</span>
       </div>
       <!--回到顶部  -->
       <div v-show="isShowTop" @click="goToTop">
         <div class="to-top">
           <img class="image" src="../../../static/img/arrow_top@2x.png" alt="">
           <span>顶部</span>
         </div>
       </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      isShowTop:false, //是否显示回到顶部
      swiperdata:[], // 轮播图的数据
      nav:[], //菜单栏数据
      loordatas:[], //楼梯层数据
    };
  },
  //页面加载完后执行的方法
  onLoad() {
    // 调用获取轮播图方法
    this.getSwiperData()
    //调用获取菜单栏方法
    this.getNav()
    //楼层数据
    this.getFloordata()
    
  },
  //监听滚轮的事件， 参数是一个对象离顶部有多少距离
  onPageScroll({scrollTop}){
    //判断是否到达显示回到顶部的距离
    if(scrollTop > 80){
      // 做一个节流处理
      // 值是true就直接返回不在执行
      if(this.isShowTop) return
      //修改isShowTop的值
      this.isShowTop = true
    }else {
      //值是 false就直接停止执行
       if(!this.isShowTop) return
      this.isShowTop = false
    }
  },
  methods: {
    //请求轮播图数据
    async getSwiperData() {
      //发送请求
      let res = await this.$axios.get('home/swiperdata');
      // 把获取的值给swiperdata
      this.swiperdata = res.data.message
      // console.log(this.swiperdata)
    },
  // 请求菜单栏数据
    async getNav(){
    let res = await this.$axios.get('home/catitems');
    
    this.nav = res.data.message
  // console.log(res)
  },
  // 请求楼梯层的数据
  async getFloordata(){

    let res = await this.$axios.get("home/floordata")
   
    this.loordatas = res.data.message
  //  console.log(this.loordatas)
  },
  // 点击回到顶部
  goToTop(){
    //使用微信中的方法，可以直接回到想去的为位置
    mpvue.pageScrollTo({
      scrollTop:0, //需要到的为止
      duration:300 //到指定为止的时间
    })
  },
  }
};
</script>

<style lang="less" scoped>
swiper{
  width:750rpx;
  height: 400rpx;
  image{
    width:100%;
    height: 100%;
  }
}
.categories{
  display: flex;
  height: 150rpx;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;
  .category-item {
    width: 120rpx;
    height: 120rpx;
    image{
      width: 100%;
      height: 100%;
    }
  }
}
.floor {
  margin-top: 20rpx;
  background-color: white;
  &-header {
    width: 750rpx;
    height: 59rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  &-body {
    display: flex;
    padding: 20rpx 16rpx 10rpx 16rpx;
    &-left {
      width: 232rpx;
      height: 386rpx;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-rigth {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      image {
        width: 100%;
        height: 188rpx;
        margin: 0 0 10rpx 10rpx;
      }
    }
  }
}
.goTop {
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #888;
  .bottomline {
    margin-left: 5rpx;
  }
}

  .to-top {
    background-color: aliceblue;
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  position: fixed;
  right: 40rpx;
  bottom: 50rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .image {
    width: 24rpx;
    height: 14rpx;
  }
  span {
    font-size: 12px;
    margin-top: 20rpx;
  color: #999
  }
}


</style>
