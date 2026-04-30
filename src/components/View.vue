<template>
  <div ref="container" style="height: 100%;width: 100%;">
    <div ref="canvasContainer"
      style="height: 100%;width: 100%;cursor: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAg9JREFUeF7t24lBhVAMAMGkc6j8cbSxYwd+SbKOuBP+Ouec3d3wRzDpb94DMB4AGyC8/2wAG0ADhBfA2AA2gA1gA/g1MPsMOAFOgBOQHf8ZETg2gA1gA4jA7DMgAp0AJyA7/iLw/9H7c7D3Abo7QAPYABqgO/8gSAN4J1AEeiUsfANEoAgUgeEF4K+BIMg/hpBAEtg9AiJQBIrA7vyTQBJIAkkgCQzfABEoAkVgeAGQQBJIAkkgCeweAREoAkVgd/5JIAkkgSSQBIZvgAgUgSIwvABIIAkkgSSQBHaPgAgUgSKwO/8kkASSQBJIAsM3QASKQBEYXgAkkASSQBJIArtHQASKQBHYnX8SSAJJIAkkgeEbIAJn9vsQws9A/Vu/OQAH6A6BE8ABOEB3/jkAB+AAHIADhG+ACBSBIjC8ALwR5I0gbwSRQBLYPQIiUASKwO78k0ASSAJJIAkM3wARKAJFYHgBkEASSAJJIAnsHgERKAJFYHf+SSAJJIEkkASGb4AIFIEiMLwASCAJJIEkkAR2j4AIFIEisDv/JJAEkkASSALDN0AEikARGF4AJJAEkkASSAK7R0AEikAR2J1/EkgCSSAJJIHhGyACRaAIDC8AEkgCSSAJJIHdIyACRaAI7M4/CSSBJJAEksDwDRCBIlAEhhcACSSBJJAEksDuERCBIlAEduf/l8DrvQBX+TN4AC70ARwY2ZasAAAAAElFTkSuQmCC&quot;) 64 64, auto;">
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  db: SGDb,
  block: SGBlock,
  isModel: true,
  drawingShowSpinner: () => void,
  drawingHideSpinner: () => void,
}>()

import { SGDb, Viewport, SGBlock } from "sgcad"

import { useTemplateRef, onMounted, onBeforeMount, App, render, onBeforeUnmount } from "vue";


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
const container = useTemplateRef('container')
let viewport: Viewport | undefined
onBeforeMount(() => {


})

function showView() {
  viewport = new Viewport(canvasContainer.value!, props.block, props.db, props.isModel)
  props.drawingHideSpinner()
}
onMounted(async () => {

  if (!props.isModel) {
    props.drawingShowSpinner()
  }
  setTimeout(showView, 0)


})

onBeforeUnmount(() => {
  if (viewport) {
    viewport.despose()
    viewport = undefined
  }

})
// ondestroyed() {
//   this.dxfViewer.Destroy()
//   this.dxfViewer = null
// }



</script>
<!-- <style module>
.box {
  color: green;
  height: 100%;
  width: 100%;
}
.commandline {
  position: absolute;
  top: 0;
  height: 15px;
  width: 100%;
  background: red;
}

.canvasContainer {
  height: calc(100% - 15px);
  width: 100%;
  background: green;
}

</style> -->
