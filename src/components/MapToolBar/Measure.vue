<!-- Measure -->
<template>
    <div class="Measure">
        <div class="panel">
            <el-select v-model="measureType" placeholder="请选择测量类型">
                <el-option
                    v-for="item in measureTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-checkbox v-model="showSegments">局部测量</el-checkbox>
            <el-checkbox v-model="clearPrevious">连续测量</el-checkbox>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { Draw, Modify } from "ol/interaction";
import { LineString, Point } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";

import {
    style,
    labelStyle,
    tipStyle,
    modifyStyle,
    segmentStyle,
    formatLength,
    formatArea,
} from "./MapToolBarConfig";
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    name: "Measure",
    props: {
        oneMap: {
            type: Object,
            required: true,
        },
    },
    data() {
        //这里存放数据
        return {
            measureTypeOptions: [
                {
                    value: "LineString",
                    label: "距离测量",
                },
                {
                    value: "Polygon",
                    label: "面积测量",
                },
            ],
            measureType: "LineString",
            showSegments: true,
            clearPrevious: false,

            tipPoint: "",
            source: null,
            vector: null,
            modify: null,
            draw: null,
        };
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        measureType: function ()  {
            this.oneMap.removeInteraction(this.draw);
            this.addInteraction();
        },
        showSegments: function (){
            this.vector.changed();
            this.draw.getOverlay().changed();
        },
    },
    //方法集合
    methods: {
        addInteraction() {
            const drawType = this.measureType;
            const activeTip =
                "Click to continue drawing the " +
                (drawType === "Polygon" ? "polygon" : "line");
            const idleTip = "Click to start measuring";
            let tip = idleTip;
            this.draw = new Draw({
                source: this.source,
                type: drawType,
                style: (feature) => {
                    return this.styleFunction(
                        feature,
                        this.showSegments,
                        drawType,
                        tip
                    );
                },
            });
            this.draw.on("drawstart", () => {
                if (!this.clearPrevious) {
                    this.source.clear();
                }
                this.modify.setActive(false);
                tip = activeTip;
            });
            this.draw.on("drawend", () => {
                modifyStyle.setGeometry(this.tipPoint);
                this.modify.setActive(true);
                this.oneMap.once("pointermove", function () {
                    modifyStyle.setGeometry();
                });
                tip = idleTip;
            });
            this.modify.setActive(true);
            this.oneMap.addInteraction(this.draw);
        },
        styleFunction(feature, segments, drawType, tip) {
            const segmentStyles = [segmentStyle];
            const styles = [style];
            const geometry = feature.getGeometry();
            const type = geometry.getType();
            let point, label, line;
            if (!drawType || drawType === type) {
                if (type === "Polygon") {
                    point = geometry.getInteriorPoint();
                    label = formatArea(geometry);
                    line = new LineString(geometry.getCoordinates()[0]);
                } else if (type === "LineString") {
                    point = new Point(geometry.getLastCoordinate());
                    label = formatLength(geometry);
                    line = geometry;
                }
            }
            if (segments && line) {
                let count = 0;
                line.forEachSegment(function (a, b) {
                    const segment = new LineString([a, b]);
                    const label = formatLength(segment);
                    if (segmentStyles.length - 1 < count) {
                        segmentStyles.push(segmentStyle.clone());
                    }
                    const segmentPoint = new Point(
                        segment.getCoordinateAt(0.5)
                    );
                    segmentStyles[count].setGeometry(segmentPoint);
                    segmentStyles[count].getText().setText(label);
                    styles.push(segmentStyles[count]);
                    count++;
                });
            }
            if (label) {
                labelStyle.setGeometry(point);
                labelStyle.getText().setText(label);
                styles.push(labelStyle);
            }
            if (
                tip &&
                type === "Point" &&
                !this.modify.getOverlay().getSource().getFeatures().length
            ) {
                this.tipPoint = geometry;
                tipStyle.getText().setText(tip);
                styles.push(tipStyle);
            }
            return styles;
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.source = new VectorSource();
        this.modify = new Modify({ source: this.source, style: modifyStyle });
        this.vector = new VectorLayer({
            source: this.source,
            style: (feature) => {
                return this.styleFunction(feature, this.showSegments);
            },
            zIndex: 10000,
        });
        this.oneMap.addLayer(this.vector);
        this.oneMap.addInteraction(this.modify);
        this.addInteraction();
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
    beforeDestroy() {
        this.oneMap.removeLayer(this.vector);
        this.oneMap.removeInteraction(this.draw);
        this.oneMap.removeInteraction(this.modify);
    },
    //生命周期 - 销毁完成
    destroyed() {},
    //如果页面有keep-alive缓存功能，这个函数会触发
    activated() {},
};
</script>
<style scoped>
/* //@import url(); 引入公共css类 */
.panel {
    width: 150px;
    height: 150px;
    background-color: white;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
</style>