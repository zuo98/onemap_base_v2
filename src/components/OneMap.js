

import { Map, Collection } from "ol";
import { Group as LayerGroup } from "ol/layer";

class OneMap extends Map {
    /**
     * @param {import("ol/PluggableMap").MapOptions} options Map options.
     * @param {Array} Array baseLayersInfo.
     * @param {Array} Array busLayersInfo.
     */
    constructor(options, baseLayersInfo, busLayersInfo) {
        super(options);
        this.baseLayersInfo = baseLayersInfo;
        this.busLayersInfo = busLayersInfo;
        this._init(baseLayersInfo, busLayersInfo);
    }
    _init(baseLayersInfo, busLayersInfo) {
        this.baseLayersGroup = new LayerGroup({ id: "baseLayersGroup", zIndex: 1 });
        this.busLayersGroup = new LayerGroup({ id: "busLayersGroup", zIndex: 2 });
        this.addLayer(this.baseLayersGroup);
        this.addLayer(this.busLayersGroup);
        if (baseLayersInfo) {
            this.selectBaseLayerId = baseLayersInfo[0].id;
            this.baseLayers = baseLayersInfo.map((item) => {
                if (item.id === this.selectBaseLayerId) {
                    item.layer.setVisible(true);
                } else {
                    item.layer.setVisible(false);
                }
                return item.layer
            });
            this.baseLayersGroup.setLayers(new Collection(this.baseLayers));
        } else {
            this.selectBaseLayerId = '';
            this.baseLayers = []
        }
        if (busLayersInfo) {
            let layers = [];
            let visibleIds = [];
            busLayersInfo.forEach((item) => {
                layers.push(item.layer);
                if (item.visible) {
                    visibleIds.push(item.id);
                }
            })
            this.selectBusLayerIds = visibleIds;
            this.busLayers = layers;
            this.busLayersGroup.setLayers(new Collection(this.busLayers));
        } else {
            this.selectBusLayerIds = [];
            this.busLayers = [];
        }

    }
    getBaseLayers() {
        return this.baseLayers;
    }

    setBaseLayersInfo(baseLayersInfo) {
        if (baseLayersInfo) {
            this.selectBaseLayerId = baseLayersInfo[0].id;
            this.baseLayers = baseLayersInfo.map((item) => {
                if (item.id === this.selectBaseLayerId) {
                    item.layer.setVisible(true);
                } else {
                    item.layer.setVisible(false);
                }
                return item.layer
            });
            this.baseLayersGroup.setLayers(new Collection(this.baseLayers));
            this.baseLayersInfo=baseLayersInfo;
        }
    }

    getBusLayers() {
        return this.busLayers;
    }

    setBusLayersInfo(busLayersInfo) {
        if (busLayersInfo) {
            let layers = [];
            let visibleIds = [];
            busLayersInfo.forEach((item) => {
                layers.push(item.layer);
                if (item.visible) {
                    visibleIds.push(item.id);
                }
            })
            this.selectBusLayerIds = visibleIds;
            this.busLayers = layers;
            this.busLayersGroup.setLayers(new Collection(this.busLayers));
            this.busLayersInfo=busLayersInfo;
        }
    }

    setBusLayerVisible(layerIds) {
        if (this.busLayers) {
            console.log(' this.busLayersInfo: ',  this.busLayersInfo);
            this.busLayersInfo.forEach((item) => {
                item.layer.setVisible(false);
                if (layerIds.includes(item.id)) {
                    item.layer.setVisible(true);
                }
            });
            this.selectLayerIds = layerIds;
        }
    }

}


export default OneMap;