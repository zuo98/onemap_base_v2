<template>
<div>
    <div class="baseIcon"></div>
    <div class="baseLayerPanel" v-if="isShow">
    
    </div>
</div>
</template>

<script>
export default {
    components:{},
    name:"BaseLayers",
    props:{
        oneMap:{
            type: Object,
            required: true,
        }
    },
    data(){
        return {
            isShow: false,
            baseLayersInfo:[],
            selectBaseLayerId:'',
        }
    },

    methods:{
        getBaseLayersInfo(){
            let baseGroupLayer = this.oneMap.baseLayersGroup
            console.log('baseGroupLayer: ', baseGroupLayer);
            
        }
    },

    mounted(){
        this.getBaseLayersInfo();
    }

    

};
</script>

<style lang="scss" scoped>
.baseIcon {
    width: 30px;
    height: 30px;
    border: 5px solid rgba(237, 237, 240, 0.5);
    border-radius: 5px;
    background: rgba(0, 119, 255, 0.782);

    &:hover {
            background: rgba(0, 119, 255, 1);

    }
}

.baseLayerPanel{
    
}
</style>