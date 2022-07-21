<!-- MapToolBar -->
<template>
    <div class="map_tool_bar">
        <div class="tool_bar">
            <el-button type="primary" @click="queryPoint">
                <span>识别</span>
            </el-button>
            <el-button type="primary" @click="fullExtent">
                <span>全幅</span>
            </el-button>
            <el-button type="primary" @click="openPanel('Measure')">
                <span>测量</span>
            </el-button>
            <el-button type="primary" @click="openPanel('Plot')">
                <span>标绘</span>
            </el-button>
            <el-button type="primary" @click="clear">
                <span>清除</span>
            </el-button>
            <base-layer :oneMap="oneMap"></base-layer>
            <el-button type="primary" @click="openPanel('BaseLayers')">
                <span>底图</span>
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
import Measure from "./measure/Measure";
import BaseLayers from "./baseLayer/index";
import Plot from './Plot.vue';        
import {fullExtentConfig} from "./MapToolBarConfig";
import BaseLayer from "./baseLayer/index.vue";
export default {
    name: "MapToolBar",
    //import引入的组件需要注入到对象中才能使用
    components: { Measure, Plot, BaseLayers, BaseLayer },
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
            this.closePanel();
            this.oneMap.getView().animate({
                center: fullExtentConfig.center,
                zoom: fullExtentConfig.zoom,
            })
        },
        clear(){
            this.closePanel();
            let layers = this.oneMap.getToolOperateLayers();
            layers.map((layer)=>{
                let source = layer.getSource();
                if(source){
                    source.clear();
                }
            })
        },
        closePanel(){
            this.componentId = "";
        },
        openPanel(componentId) {
            this.componentId == componentId
                ? (this.componentId = "")
                : (this.componentId = componentId);
        },
        queryPoint(){
            this.componentId = "";
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