<!-- Plot -->
<template>
    <div class="Plot">
        <div class="panel">
            <el-button @click="plotType = 'Point'">标绘点</el-button>
            <el-button @click="plotType = 'Polyline'">标绘线</el-button>
            <el-button @click="plotType = 'Polygon'">标绘面</el-button>
            <el-button @click="clear">清除</el-button>
        </div>

        <!-- 信息窗口 -->
        <transition name="el-fade-in-linear">
            <info-window
                ref="infoWindow"
                v-if="infoWindow.visible"
                :title="infoWindow.extData.title"
                :pos="infoWindow.position"
                @close="infoWindowClose"
            >
                <el-form v-if="infoWindow.isEditAttribute">
                    <el-form-item label="标题">
                        <el-input
                            v-model="infoWindow.extData.title"
                            placeholder="请输入标题"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input
                            v-model="infoWindow.extData.desc"
                            type="textarea"
                            placeholder="请输入描述"
                        >
                        </el-input>
                    </el-form-item>
                </el-form>
                <template v-else>
                    {{ infoWindow.extData.desc }}
                </template>
                <div slot="footer" class="info-window-footer">
                    <span class="by"></span>
                    <div class="tools">
                        <template v-for="(tool, index) in infoWindowTools">
                            <el-tooltip
                                :key="index"
                                effect="dark"
                                :content="tool.label"
                                placement="top"
                            >
                                <i
                                    :class="['footer-icon', tool.icon]"
                                    @click="infoWindowToolClick(tool)"
                                ></i>
                            </el-tooltip>
                        </template>
                    </div>
                </div>
            </info-window>
        </transition>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { Overlay } from "ol";
import { boundingExtent, getCenter } from "ol/extent";

import olPlot from "ol-plot";
import { plotStyle } from "./MapToolBarConfig";

import InfoWindow from "./plot/info-window.vue";

export default {
    //import引入的组件需要注入到对象中才能使用
    components: { InfoWindow },
    name: "Plot",
    props: {
        oneMap: {
            type: Object,
            required: true,
        },
    },
    data() {
        //这里存放数据
        return {
            plotType: "",
            draw: null,

            plot: null,
            featureList: [],

            infoWindow: {
                overlay: null,
                extData: {},
                polygonIndex: null,
                visible: false,
                isEditAttribute: false,
                position: null,
            },
        };
    },
    //计算属性 类似于data概念
    computed: {
        layer: function () {
            return this.oneMap.getPlotLayer();
        },
        source: function () {
            return this.oneMap.getPlotLayer().getSource();
        },
        infoWindowTools() {
            let tools = [];
            if (this.infoWindow.isEditAttribute) {
                tools = [
                    {
                        name: "complate",
                        label: "完成",
                        icon: "el-icon-check",
                    },
                ];
            } else {
                tools = [
                    {
                        name: "editStyle",
                        functionName: "EditAreaStyle",
                        label: "编辑样式",
                        // icon: "icon-color",
                        icon: "el-icon-set-up",
                    },
                      {
                        name: 'editNode',
                        functionName: 'EditAreaNode',
                        label: '开启/结束编辑节点',
                        icon: 'el-icon-menu'
                      },
                    {
                        name: "editAttribute",
                        functionName: "EditAreaAttributes",
                        label: "编辑属性",
                        icon: "el-icon-edit",
                    },
                    {
                        name: "delete",
                        functionName: "DelArea",
                        label: "删除",
                        icon: "el-icon-delete",
                    },
                ];
            }
            return tools;
        },
    },
    //监控data中的数据变化
    watch: {
        plotType: function (val, oldVal) {
            console.log("val: ", val);
            console.log("oldVal: ", oldVal);
            if (val) {
                this.activate(val);
                console.log("map: ", this.oneMap);
            }
        },
    },
    //方法集合
    methods: {
        init() {
            this.plot = new olPlot(this.oneMap);
            this.layer.setStyle(plotStyle);
            this.plot.plotDraw.on("drawEnd", this.onDrawEnd);
        },
        clear() {
            this.source.clear();
        },
        onDrawEnd(event) {
            var feature = event.feature;
            let fId = this.uid();
            feature.setId(fId);
            let featureProps = {
                id: fId, // 生成一个uid，正式环境调用接口的时候这个ID不用传，由后端生成ID返回
                type: this.plotType,
                title: `标绘${this.featureList.length + 1}`,
                desc: "",
                // feature: feature,
                styles: plotStyle,
            };
            feature.setProperties(featureProps);
            this.featureList.push(feature);

            // 开启编辑
            // this.plot.plotEdit.activate(feature);
            this.setInfoWindowPosition(feature);
            this.plotType = "";
        },

        setInfoWindowPosition(feature, point) {
            const center = this.getFeatureCenter(feature);
            // const extData = feature.getProperties().extData;
            const props = feature.getProperties();
            this.infoWindow.visible = true;
            this.infoWindow.extData = props;
            // this.infoWindow.polygonIndex = this.polygons.findIndex(
            //     (item) => item.id === extData.id
            // );
            // this.infoWindow.featureIndex = this.source
            //     .getFeatures()
            //     .findIndex((item) => item.getId() === extData.id);
            // this.editStyleDialog.styles = extData.styles;
            // this.editStyleDialog.polygonId = extData.id;
            this.$nextTick(() => {
                const infoWindowHeight = this.$refs.infoWindow.$el.clientHeight; // 获取信息框的高度
                let pixel = this.oneMap.getPixelFromCoordinate(point || center); // 多边形中心坐标转像素
                pixel[1] = pixel[1] - infoWindowHeight / 2 - 10; // 设置偏移像素
                const coordinate = this.oneMap.getCoordinateFromPixel(pixel); // 像素重新转换成坐标
                if (!this.infoWindow.overlay) {
                    // 设置信息窗Overlay
                    this.infoWindow.overlay = new Overlay({
                        element: this.$refs.infoWindow.$el,
                    });
                    this.oneMap.addOverlay(this.infoWindow.overlay); // 地图上添加信息窗
                }
                this.infoWindow.overlay.setPosition(coordinate); // 设置信息窗位置
            });
        },

        infoWindowClose() {
            if (this.infoWindow.isEditAttribute) {
                this.infoWindow.isEditAttribute = false;
            } else {
                this.infoWindow.visible = false;
            }
        },

        // 指定标绘类型，开始绘制。
        activate(type) {
            this.plot.plotEdit.deactivate();
            this.plot.plotDraw.active(type);
        },
        uid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
        },

        getFeatureCenter(feature) {
            const polygonGeometry = feature.getGeometry();
            const path = polygonGeometry.getCoordinates()[0]; // 获取多边形的path
            const center = getCenter(boundingExtent(path)); // 获取多边形的中心坐标
            return center;
        },

        infoWindowToolClick({ name }) {
            const index = this.infoWindow.featureIndex;
            const feature = this.source.getFeatures()[index];
            if (index <= -1) return;
            switch (name) {
                // 编辑样式
                case "editStyle":
                    this.handleEditStyle();
                    break;
                // 编辑节点
                case "editNode":
                    this.handleEditNode(feature);
                    break;
                // 编辑属性
                case "editAttribute":
                    this.infoWindow.isEditAttribute = true;
                    break;
                // 删除
                case "delete":
                    this.handleDelete(feature);
                    break;
                // 完成
                case "complate":
                    this.handleComplate(feature);
                    break;
            }
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.init();
    },
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
.panel {
    width: 100px;
    height: 150px;
    border-radius: 5px;
    background-color: white;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.el-button {
    width: 100px;
}
</style>    