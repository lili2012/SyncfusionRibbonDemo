<template>
  <div class="container" ref="commandlineContainer"
    style="position:absolute;bottom: 10px;left: 25px; height: 40px;width: calc(100% - 50px);background-color: whitesmoke;display: flex;flex-direction: row; opacity: 0.8;"
    @mouseenter="onMouseenter" @mouseleave="onMouseleave"  @mousedown="OnMouseDown" @mouseup="OnMouseUp">
    <div class="header" ref="header" style="height: 100%;width: 40px;cursor: move;display: flex;flex-direction: column;align-items: center;">
        <svg t="1719914784910"
             class="t-shell-dot"
             viewBox="0 0 1024 1024"
             version="1.1"
             xmlns="http://www.w3.org/2000/svg"
             p-id="7341"
             width="20"
             height="20">
          <path
              d="M803.84 863.744c-8.704 0-16.896-3.584-23.552-10.24L512 585.728l-267.264 267.264c-6.656 6.656-14.336 10.24-23.04 10.24-12.288 0-25.088-7.168-39.424-21.504-14.848-14.848-21.504-27.648-21.504-39.936 0-8.704 3.584-16.384 10.752-23.04L438.272 512 170.496 244.224c-25.6-26.112 0-52.736 9.728-62.464 11.776-11.776 25.088-23.04 39.424-23.04 8.192 0 16.384 3.584 24.576 11.264L512 438.272l267.776-267.264c7.168-7.168 15.36-10.752 23.552-10.752 12.288 0 24.064 7.168 40.96 23.552 11.264 11.264 35.328 35.328 9.216 60.928L585.728 512l267.264 267.264c23.04 23.04 9.216 44.032-9.216 62.976-13.824 14.336-27.648 21.504-39.936 21.504z"
              p-id="7342"
              fill="#1413139c"/>
        </svg>
    </div>
    <div style="display: flex;flex-direction: column; flex-grow: 1;">
      <textarea readonly style="top:0px;padding: 0px;border: 0px;flex-grow: 1;background-color: #cccccc;min-height: 0px;"></textarea>
      <input class="commandinput" style="padding: 0px;border: 0px; flex: 0 0 40px;"></input>
    </div>
    <!-- <div  class="commandInput"; style="position: absolute;top: 0px;height:100%;width: 100%;"></div> -->
    
  </div>
</template>

<script setup lang="ts">
//const props = defineProps<{}>()

import { useTemplateRef } from "vue"
const commandlineContainer = useTemplateRef('commandlineContainer')
const header = useTemplateRef('header')
let posX: number | undefined
let posY: number | undefined
const onMouseenter = (e: MouseEvent) => {
  commandlineContainer.value!.style.opacity = "1"
}
const onMouseleave = (e: MouseEvent) => {
  commandlineContainer.value!.style.opacity = "0.8"
}
let isPinned = false
let drag = false
const OnMouseDown = (e: MouseEvent) => {
  const rect = e.currentTarget!.getBoundingClientRect();
  posX = e.clientX - rect.left;
  posY = e.clientY - rect.top;
  const headerEle = header.value!
  const headerRect = headerEle.getBoundingClientRect();
  const parent = commandlineContainer.value!.parentElement!
  if(posX <= headerRect.width && posY <= headerRect.height){
    parent.addEventListener("mousemove", dragging)
  }else if(posY < 5){
    parent.addEventListener("mousemove", resizing)
  }

}

const OnMouseUp = (e: MouseEvent) => {
  drag = false
  const parent = commandlineContainer.value!.parentElement!
  parent.removeEventListener("mousemove", dragging);
  parent.removeEventListener("mousemove", resizing);
}
const resizing = (e: MouseEvent) => {
  if (isPinned) {
    return
  }
  console.log("resizing")
  e.stopPropagation();
  const rect = e.currentTarget.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  if(offsetY >= 0){
    const ele = commandlineContainer.value!
    const heightOffset = ele.offsetTop - offsetY 
    const height = ele.clientHeight
    let newHeight = (height + heightOffset) 
    if(newHeight < 40){
      newHeight = 40
    }
    ele.style.height = newHeight + "px";
  }
}

const dragging = (e: MouseEvent) => {
  if (isPinned) {
    return
  }
  e.stopPropagation();
  const rect = e.currentTarget!.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  let x = offsetX - posX
  let y = offsetY - posY

  const ele = commandlineContainer.value!
  const parent = ele.parentElement!
  const clientWidth = parent.clientWidth
  const clientHeight = parent.clientHeight



  if (x > clientWidth - ele.clientWidth) {
    x = clientWidth - ele.clientWidth
  }else if(x < 0){
    x = 0
  }
  
  if (y > clientHeight - ele.clientHeight) {
    y = clientHeight - ele.clientHeight
  }else if (y < 0){
    y = 0
  }


  ele.style.left = x + "px";
  ele.style.bottom = (clientHeight - y - ele.clientHeight) + "px";
}

</script>
<style scoped>
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

.commandinput {
  flex-grow: 1;
}
</style>
