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
            <el-button size="mini" @click="clearMeasure">清除</el-button>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { Draw, Modify } from "ol/interaction";
import { LineString, Point } from "ol/geom";
import { getArea, getLength } from "ol/sphere";

import {
    lineStyle,
    tipStyle,
    modifyStyle,
    createLabelStyle,
    createSegmentStyle,
    createVertexStyle,
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
            clearPrevious: true,

            tipPoint: "",
            modify: null,
            draw: null,
        };
    },
    //计算属性 类似于data概念
    computed: {
        vectorLayer: function () {
            return this.oneMap.getMeasureLayer();
        },
        source: function () {
            return this.oneMap.getMeasureLayer().getSource();
        },
    },
    //监控data中的数据变化
    watch: {
        measureType: function () {
            this.oneMap.removeInteraction(this.draw);
            this.addInteraction();
        },
        showSegments: function () {
            this.vectorLayer.changed();
            this.draw.getOverlay().changed();
        },
    },
    //方法集合
    methods: {
        init() {
            this.modify = new Modify({
                source: this.source,
                style: modifyStyle,
            });
            this.vectorLayer.setStyle((feature) => {
                return this.styleFunction(feature, this.showSegments);
            });
            this.oneMap.addInteraction(this.modify);
            this.addInteraction();
        },

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
            const styles = [lineStyle];
            const geometry = feature.getGeometry();
            const type = geometry.getType();
            let point, label, line, startPoint;
            if (!drawType || drawType === type) {
                if (type === "Polygon") {
                    //端点和拐点
                    geometry.getCoordinates().forEach((line) => {
                        line.forEach((coord) => {
                            styles.push(createVertexStyle(new Point(coord)));
                        });
                    });
                    point = geometry.getInteriorPoint();
                    label = this.formatArea(geometry);
                    line = new LineString(geometry.getCoordinates()[0]);
                } else if (type === "LineString") {
                    //端点和拐点
                    geometry.getCoordinates().forEach((coord) => {
                        styles.push(createVertexStyle(new Point(coord)));
                    });
                    point = new Point(geometry.getLastCoordinate());
                    startPoint = new Point(geometry.getFirstCoordinate());
                    label = this.formatLength(geometry);
                    line = geometry;
                }
            }
            if (segments && line) {
                line.forEachSegment((a, b) => {
                    const segment = new LineString([a, b]);
                    const label = this.formatLength(segment);
                    const segmentPoint = new Point(
                        segment.getCoordinateAt(0.5)
                    );
                    styles.push(createSegmentStyle(segmentPoint, label));
                });
            }
            if (point && label) {
                styles.push(createLabelStyle(point, label));
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
            if (startPoint) {
                styles.push(createLabelStyle(startPoint, "Start Point"));
            }
            return styles;
        },

        //计算长度
        formatLength(line) {
            let newLine = line.clone();
            let curPrj = this.oneMap.getView().getProjection();
            newLine = newLine.transform(curPrj, "EPSG:3857");
            const length = getLength(newLine);
            let output;
            if (length > 100) {
                output = Math.round((length / 1000) * 100) / 100 + " km";
            } else {
                output = Math.round(length * 100) / 100 + " m";
            }
            return output;
        },

        //计算面积
        formatArea(polygon) {
            let newPolygon = polygon.clone();
            let curPrj = this.oneMap.getView().getProjection();
            newPolygon = newPolygon.transform(curPrj, "EPSG:3857");
            const area = getArea(newPolygon);
            let output;
            if (area > 10000) {
                output = Math.round((area / 1000000) * 100) / 100 + " km\xB2";
            } else {
                output = Math.round(area * 100) / 100 + " m\xB2";
            }
            return output;
        },

        clearMeasure() {
            this.source.clear();
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
    beforeDestroy() {
        this.oneMap.removeInteraction(this.modify);
        this.oneMap.removeInteraction(this.draw);
        // this.oneMap.removeLayer(this.vector);
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
    border-radius: 5px;
    background-color: white;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
</style>