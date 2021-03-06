
import {
    Circle as CircleStyle,
    Fill,
    RegularShape,
    Stroke,
    Style,
    Text,
} from 'ol/style';

//====tool fullextend config====
//全幅视图
export const fullExtentConfig={
    center: [114.29626775048673, 30.578277587890625],
    zoom: 10,
    projection: "EPSG:4326",
}
//===============================

//=======tool measure config=====
//测量样式
export const lineStyle = new Style({
    //测量面积的polygon的填充样式
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.4)',
    }),
    //polygon的边界线的样式，距离测量的线样式
    stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        lineDash: [10, 10],
        width: 2,
    }),
    //鼠标点样式
    image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
            width: 2,
        }),
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
    }),
});
//返回端点，拐点样式；
export const createVertexStyle = function (point) {
    return new Style({
        geometry: point,
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: "rgba(255, 0, 0, 1)",
                width: 2,
            }),
            fill: new Fill({
                color: "rgba(255,255,255,0.7)",
            }),
        }),
    });
}
//返回标记label
export const createLabelStyle = function (point, label) {
    return new Style({
        geometry: point,
        text: new Text({
            text: label,
            font: '14px Calibri,sans-serif',
            fill: new Fill({
                color: 'rgba(255, 255, 255, 1)',
            }),
            backgroundFill: new Fill({
                color: 'rgba(0, 0, 0, 0.7)',
            }),
            padding: [3, 3, 3, 3],
            textBaseline: 'bottom',
            offsetY: -15,
        }),
        image: new RegularShape({
            radius: 8,
            points: 3,
            angle: Math.PI,
            displacement: [0, 10],
            fill: new Fill({
                color: 'rgba(0, 0, 0, 0.7)',
            }),
        }),
    });
}
//鼠标点的提示样式
export const tipStyle = new Style({
    text: new Text({
        font: '12px Calibri,sans-serif',
        fill: new Fill({
            color: 'rgba(255, 255, 255, 1)',
        }),
        backgroundFill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
        }),
        padding: [2, 2, 2, 2],
        textAlign: 'left',
        offsetX: 15,
    }),
});
//修改测量线绘制时，接触点的样式以及提示
export const modifyStyle = new Style({
    image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
        }),
    }),
    text: new Text({
        text: 'Drag to modify',
        font: '12px Calibri,sans-serif',
        fill: new Fill({
            color: 'rgba(255, 255, 255, 1)',
        }),
        backgroundFill: new Fill({
            color: 'rgba(0, 0, 0, 0.7)',
        }),
        padding: [2, 2, 2, 2],
        textAlign: 'left',
        offsetX: 15,
    }),
});
//局部线段的长度label
export const createSegmentStyle = function(point, label){
    return new Style({
        geometry: point,
        text: new Text({
            text: label,
            font: '12px Calibri,sans-serif',
            fill: new Fill({
                color: 'rgba(255, 255, 255, 1)',
            }),
            backgroundFill: new Fill({
                color: 'rgba(0, 0, 0, 0.4)',
            }),
            padding: [2, 2, 2, 2],
            textBaseline: 'bottom',
            offsetY: -12,
        }),
        image: new RegularShape({
            radius: 6,
            points: 3,
            angle: Math.PI,
            displacement: [0, 8],
            fill: new Fill({
                color: 'rgba(0, 0, 0, 0.4)',
            }),
        }),
    });
}
//====================================


//=====tool plot config===============
export const plotStyle = new Style({
    //测量面积的polygon的填充样式
    fill: new Fill({
        color: 'rgba(0, 255, 0, 0.4)',
    }),
    //polygon的边界线的样式，距离测量的线样式
    stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        lineDash: [10, 10],
        width: 2,
    }),
    //鼠标点样式
    image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
            width: 2,
        }),
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
    }),
});
//====================================