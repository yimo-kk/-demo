/**
 * 模块中对数据的增删改查
 * 指定导出
 */

 let KEy = "GOODS"

 //一进入模块就先查询浏览器中的是否有GOODS
export const getLocalGoods = ()=>{
    //存在就返回其值，不存在返回空或空对象
    return wx.getStorageSync(KEy) || {}
}
 
//当添加到本地时需要传入商品的id和数量 传入一个对象 {goods_id:129,goods_number:1}
export const addGoods = goods =>{
    //从本地获取数据（上定义函数了直接调用
    let localGoods = getLocalGoods()

    // 判断传过来的id是否在本地存储，有就在原来的基础上加上goods_number，
    //不存在就给对象添加一个属性和值 
    if(localGoods[goods.goods_id]){
        localGoods[goods.goods_id] += goods.goods_number
    }else {
        localGoods[goods.goods_id] = goods.goods_number
    }
    //修改数据之后再把数据存回本地
    wx.setStorageSync(KEy,localGoods)
}
//修改商品的数量
//参数是一个对象,商品的id和数量
export const updataGoods = goods =>{
    //从本地获取商品
    let localGoods = getLocalGoods()

    //直接把商品的数量改为传进来的数量
    localGoods[goods.goods_id] = goods.goods_number

    //修改后在保存回去
    wx.setStorageSync(KEy,localGoods)
}
 //删出商品
 //参数是删除的id
 export const deleteGoods = goods_id =>{
    //从本地取出来
    let localGoods = getLocalGoods()
    //删除
    // delete方法可以直接删除 指定对象键的值
    delete localGoods[goods_id]
     //删除后再保存回去本地
    wx.setStorageSync(KEy,localGoods)
 }