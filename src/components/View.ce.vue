<template>
  <div class="canvasContainer" ref="canvasContainer">

  </div>
</template>


<script setup lang="ts">
const props = defineProps<{
  db: SGDb,
  block: SGBlock,
  isModel: true,
}>()

import { SGDb, Viewport, SGBlock } from "sgcad"
import * as three from "three"
import { useTemplateRef, onMounted } from "vue";



function onVisible() {
  //Viewport.Render()
}

function onHide() {

}

defineExpose({
  onVisible,
  onHide
});


const canvasContainer = useTemplateRef('canvasContainer')
const options = {
  clearColor: new three.Color("#000000"),
  autoResize: true,
  colorCorrection: false,
  sceneOptions: {
    wireframeMesh: true
  }
}
let viewport: Viewport

onMounted(async () => {
  viewport = new Viewport(canvasContainer.value!, props.block, props.db, props.isModel, options)

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
