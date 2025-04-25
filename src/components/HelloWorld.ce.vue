<template>
<div class="canvasContainer" ref="canvasContainer">

</div>
</template>


<script setup lang="ts">
const props = defineProps<{
  drawing?: string,
  fonts: string[]
}>()

import {Viewport} from "SGCAD"
import * as three from "three"
import { useTemplateRef, onMounted } from "vue";

function onVisible() {
  Viewport.Render()
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
let viewport:Viewport

async function Load(url:string) {
  try {
    await viewport!.Load({
      url,
      fonts: props.fonts,
      progressCbk: null,
    })
  } catch (e: any) {
    console.warn((e as Error).message)
  }
}

const url = "http://localhost:3000/"


onMounted(async() => {


  viewport= new Viewport(canvasContainer.value!, options)
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
