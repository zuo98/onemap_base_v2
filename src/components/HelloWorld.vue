<template>
  <div id="map">
    <div class="MapToolBar">
      <el-button type="primary" @click="change">{{ statu }}</el-button>
    </div>
  </div>
</template>

<script>
import OneMap from "./OneMap";
import View from "ol/View";
import { OSM, TileArcGISRest } from "ol/source";
import { Tile as TileLayer } from "ol/layer";
import { fromLonLat } from "ol/proj";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      statu: "close",
      oneMap: null,
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
  },

  mounted() {
    const mapUrl =
      "http://27.17.26.115:6080/arcgis/rest/services/GZYZT/GZYZTCGCS2000/MapServer";
    let raster = new TileLayer({
      source: new OSM(),
    });
    let arcgisLayer = new TileLayer({
      source: new TileArcGISRest({
        url: mapUrl,
      }),
    });
    console.log("arcgisLayer: ", arcgisLayer);
    this.oneMap = new OneMap({
      target: "map",
      view: new View({
        center: fromLonLat([114.31, 30.52]),
        zoom: 11,
      }),
    });
    this.oneMap.setBaseLayersInfo([{ id: "1", layer: raster }]);
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
  position: absolute;
  top:10px;
  right: 10px;
  width: 70px;
  height: 30px;
  z-index: 5;
}
</style>
