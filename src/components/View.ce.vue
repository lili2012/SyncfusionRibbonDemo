<template>
  <div class="canvasContainer" ref="canvasContainer">

  </div>
</template>


<script setup lang="ts">
const props = defineProps<{
  db: SGDb,
  block: SGBlock,
  isModel: true,
  drawingShowSpinner:  ()=>void,
  drawingHideSpinner: ()=>void,
}>()

import { SGDb, Viewport, SGBlock } from "sgcad"

import { useTemplateRef, onMounted, onBeforeMount} from "vue";



function onVisible() {
  //SGDb.setCurrentSpace(props.block)
  
}

function onHide() {

}

defineExpose({
  onVisible,
  onHide
});


const canvasContainer = useTemplateRef('canvasContainer')

let viewport: Viewport
onBeforeMount(()=>{
  

})

function showView(){
  viewport = new Viewport(canvasContainer.value!, props.block, props.db, props.isModel)
  props.drawingHideSpinner()
}
onMounted(async () => {
  if(!props.isModel){
    props.drawingShowSpinner()
  }
  setTimeout(showView, 0)


})


// ondestroyed() {
//   this.dxfViewer.Destroy()
//   this.dxfViewer = null
// }



</script>
<style scoped>
div {
  color: black;
  width: 100%;
  height: 100%;
}
</style>
