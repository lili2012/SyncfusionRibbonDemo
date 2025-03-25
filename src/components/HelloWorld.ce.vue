<template>
<div class="canvasContainer" ref="canvasContainer">

</div>
</template>


<script setup lang="ts">
const props = defineProps<{
  drawing?: string,
  fonts: string[]
}>()

import {DxfViewer} from "dxf-viewer"
import * as three from "three"
import { useTemplateRef, onMounted } from "vue";



function onVisible() {
  dxfViewer.Render()
}    

function onHide() {
 
}  

defineExpose({
  onVisible,
  onHide
});


const canvasContainer = useTemplateRef('canvasContainer')
const options = {
                    clearColor: new three.Color("#fff"),
                    autoResize: true,
                    colorCorrection: true,
                    sceneOptions: {
                        wireframeMesh: true
                    }
                }
let dxfViewer:DxfViewer
// const Subscribe = (eventName) => {
//       dxfViewer.Subscribe(eventName, e => this.$emit("dxf-" + eventName, e))
// }

// for(const eventName of ["loaded", "cleared", "destroyed", "resized", "pointerdown", "pointerup", "viewChanged", "message"]) {
//     Subscribe(eventName)
// }

async function Load(url:string) {
  try {
    await dxfViewer!.Load({
      url,
      fonts: props.fonts,
      progressCbk: null,
      workerFactory: null
    })
  } catch (e: any) {
    console.warn((e as Error).message)
  }
}

const url = "http://localhost:3000/"


onMounted(async() => {

  dxfViewer= new DxfViewer(canvasContainer.value!, options)
  await Load(url + props.drawing)




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
