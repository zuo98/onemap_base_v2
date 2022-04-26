<!-- MapToolBar -->
<template>
    <div class="map_tool_bar">
        <div class="tool_bar">
            <el-button type="primary" @click="fullExtent">
                <i class="el-icon-map-location"></i>
                <span>全幅</span>
            </el-button>
            <el-button type="primary" @click="openPanel('Measure')">
                <i class="el-icon-aim"></i>
                <span>测量</span>
            </el-button>
        </div>
        <div class="panel">
            <transition name="el-zoom-in-top">
                <component :is="componentId" :oneMap="oneMap"></component>
            </transition>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Measure from "./Measure";
export default {
    name: "MapToolBar",
    //import引入的组件需要注入到对象中才能使用
    components: {Measure},
    props: {
        oneMap:{
            type:Object,
            required:true,
        }
    },
    data() {
        //这里存放数据
        return {
            componentId: "",
        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        fullExtent(){

        },
        openPanel(componentId) {
            this.componentId == componentId
                ? (this.componentId = "")
                : (this.componentId = componentId);
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    //生命周期 - 创建之前
    beforeCreate() {},
    //生命周期 - 挂载之前
    beforeMount() {},
    //生命周期 - 更新之前
    beforeUpdate() {},
    //生命周期 - 更新之后
    updated() {},
    //生命周期 - 销毁之前
    beforeDestroy() {},
    //生命周期 - 销毁完成
    destroyed() {},
    //如果页面有keep-alive缓存功能，这个函数会触发
    activated() {},
};
</script>
<style scoped>
/* //@import url(); 引入公共css类 */
</style>