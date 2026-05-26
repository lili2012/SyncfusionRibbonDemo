<template>
  <div ref="container" style="height: 100%;width: 100%;">
    <div ref="canvasContainer" class="canvasContainer" :style="{ cursor: customCursor }">
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  db: SGDb,
  block: SGBlock,
  isModel: true,
  backgroundColor: string
}>()

import { SGDb, Viewport, SGBlock } from "sgcad"

import { useTemplateRef, onMounted, onBeforeUnmount, ref } from "vue";

const canvasContainer = useTemplateRef('canvasContainer')
const container = useTemplateRef('container')
const customCursor = ref("url('svg/black.png') 64 64, auto");
let viewport: Viewport | undefined

onMounted(() => {
  if(props.backgroundColor === "black"){
    customCursor.value = "url('svg/white.png') 64 64, auto";
  }
  viewport = new Viewport(canvasContainer.value!, props.block, props.db, props.isModel, props.backgroundColor)
})

onBeforeUnmount(() => {
  if (viewport) {
    viewport.despose()
    viewport = undefined
  }

})

</script>
<style scoped>
/* .box {
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
}  */

/* #canvasContainer {
  background-color: red;
} */
.canvasContainer {
  height: 100%;
  width: 100%;
}
</style>
