<template>
    <div id="map">
        <div class="MapToolBar">
            <map-tool-bar :oneMap="oneMap"></map-tool-bar>
            <el-button type="primary" @click="change">{{ statu }}</el-button>
            <el-button type="primary" @click="changeBaselayer"
                >swicth</el-button
            >
        </div>
    </div>
</template>

<script>
import OneMap from "./OneMap";
import View from "ol/View";
import { OSM, Stamen, TileArcGISRest } from "ol/source";
import { Tile as TileLayer } from "ol/layer";

import MapToolBar from "./MapToolBar/index.vue";
import {fullExtentConfig} from "./MapToolBar/MapToolBarConfig"
import { defaults } from 'ol/interaction';
export default {
    name: "HelloWorld",
    props: {
        msg: String,
    },
    components: { MapToolBar },
    data() {
        return {
            statu: "close",
            baseId: 1,
            oneMap: {},
        };
    },
    methods: {
        change() {
            console.log("click");
            if (this.statu == "close") {
                this.oneMap.setBusLayerVisible([]);
                this.statu = "open";
            } else {
                this.oneMap.setBusLayerVisible(["1"]);
                this.statu = "close";
            }
            console.log("this.statu: ", this.statu);
        },
        changeBaselayer() {
            if (this.baseId >= 2) {
                this.baseId = 1;
                this.oneMap.setBaseLayerVisible(this.baseId.toString());
            } else {
                this.baseId += 1;
                this.oneMap.setBaseLayerVisible(this.baseId.toString());
            }
            console.log("this.baseId: ", this.baseId);
        },
    },

    mounted() {
        const mapUrl =
            "http://27.17.26.115:6080/arcgis/rest/services/GZYZT/GZYZTCGCS2000/MapServer";
        let arcgisLayer = new TileLayer({
            source: new TileArcGISRest({
                url: mapUrl,
            }),
        });

        let osm = new TileLayer({
            source: new OSM(),
        });

        let watercolor = new TileLayer({
            source: new Stamen({
                layer: "watercolor",
            }),
        });

        this.oneMap = new OneMap({
            target: "map",
            view: new View({
                center: fullExtentConfig.center,
                zoom: fullExtentConfig.zoom,
                projection: fullExtentConfig.projection,
            }),
            interactions: new defaults({
                doubleClickZoom: false,
            })
        });

        this.oneMap.on("click", (e) => {
            let center = this.oneMap.getView().getCenter();
            let zoom = this.oneMap.getView().getZoom();
            let resolution = this.oneMap.getView().getResolution();

            console.log("click point: ", e.coordinate);
            console.log("map center: ", center);
            console.log("map zoom: ", zoom);
            console.log("map resolution: ", resolution);
        });

        this.oneMap.setBaseLayersInfo([
            { id: "1", layer: osm },
            { id: "2", layer: watercolor },
        ]);
        this.oneMap.setBusLayersInfo([
            { id: "1", layer: arcgisLayer, visible: true },
        ]);
        console.log("baseLayersGroup:", this.oneMap.baseLayersGroup);
        console.log("busLayersGroup", this.oneMap.busLayersGroup);
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
    position: relative;
    width: 100%;
    height: 100%;
}
.MapToolBar {
    /* width: 70px;
  height: 30px; */
    position: absolute;
    top: 10px;
    left: 10px;

    display: flex;

    z-index: 5;
}
</style>
