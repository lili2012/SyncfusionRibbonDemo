<template>
  <div id="commandlineContainer" :class="$style.container" ref="commandlineContainer" @mouseenter="onMouseenter"
    @mouseleave="onMouseleave" @mousedown="OnMouseDown" @mouseup="OnMouseUp">
    <div class="header" ref="header"
      style="height: 100%;width: 40px;cursor: move;display: flex;flex-direction: column;align-items: center;">
      <svg t="1719914784910" class="t-shell-dot" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="7341" width="20" height="20">
        <path
          d="M803.84 863.744c-8.704 0-16.896-3.584-23.552-10.24L512 585.728l-267.264 267.264c-6.656 6.656-14.336 10.24-23.04 10.24-12.288 0-25.088-7.168-39.424-21.504-14.848-14.848-21.504-27.648-21.504-39.936 0-8.704 3.584-16.384 10.752-23.04L438.272 512 170.496 244.224c-25.6-26.112 0-52.736 9.728-62.464 11.776-11.776 25.088-23.04 39.424-23.04 8.192 0 16.384 3.584 24.576 11.264L512 438.272l267.776-267.264c7.168-7.168 15.36-10.752 23.552-10.752 12.288 0 24.064 7.168 40.96 23.552 11.264 11.264 35.328 35.328 9.216 60.928L585.728 512l267.264 267.264c23.04 23.04 9.216 44.032-9.216 62.976-13.824 14.336-27.648 21.504-39.936 21.504z"
          p-id="7342" fill="#1413139c" />
      </svg>
    </div>
    <div style="display: flex;flex-direction: column; flex-grow: 1;">
      <textarea readonly v-model=commandLineStore.log
        style="top:0px;padding: 0px;border: 0px;flex-grow: 1;background-color: #cccccc;min-height: 0px;"></textarea>
      <div style="flex: 0 0 40px;display: flex;flex-direction: row;">
        <span style="font-weight: 450;white-space: pre-wrap;">{{ commandLineStore.command.description?.length ?
          commandLineStore.command.description + " " : "" }}</span>
        <span style="font-weight: light;">{{ commandLineStore.prompt.description }}</span>
        <input class="commandinput" v-model="currInput"
          style="font-size:16pt;padding: 0px;border: 0px; height:40px;flex-grow: 1;" @keypress="onKeyPress"></input>
      </div>

    </div>
    <!-- <div  class="commandInput"; style="position: absolute;top: 0px;height:100%;width: 100%;"></div> -->

  </div>
</template>

<script setup lang="ts">
//const props = defineProps<{}>()
//https://help.autodesk.com/view/OARX/2025/ENU/?guid=GUID-3D998905-0C24-4FF9-A9C7-7F361A591B80
import { useTemplateRef, watch, ref } from "vue"
import { useCommandLineStore, CommandStack, drawLineByTwoPoint } from "sgcad"
import OpenAI from "openai";

import { Vector3 } from "three";
const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-22b0bd97e5b84ad5aea06194931fce6a',
  dangerouslyAllowBrowser: true
});
type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type Tool = OpenAI.Chat.Completions.ChatCompletionTool;
const aitools: Tool[] = [
  {
    type: "function",
    function: {
      name: "line",
      description: "绘制一条直线，参数是两个点，第一个点是起点，第二个点是终点",
      parameters: {
        type: "object",
        properties: {
          startX: {
            type: "number",
            description: "起点的x坐标",
          },
          startY: {
            type: "number",
            description: "起点的y坐标",
          },
          endX: {
            type: "number",
            description: "终点的x坐标",
          },
          endY: {
            type: "number",
            description: "终点的y坐标",
          }
        },
        required: ["startX", "startY", "endX", "endY"]
      },
    }
  },
]

async function send_messages(message: string) {
  const messages: Message[] = [{ role: "user", content: message }]
  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages,
    tools: aitools
  })
  return response
}
const commandLineStore = useCommandLineStore()
const commandlineContainer = useTemplateRef('commandlineContainer')
const header = useTemplateRef('header')

const currInput = ref("")
let posX: number | undefined
let posY: number | undefined
const onMouseenter = (e: MouseEvent) => {
  commandlineContainer.value!.style.opacity = "1"
}
const onMouseleave = (e: MouseEvent) => {
  commandlineContainer.value!.style.opacity = "0.8"
}
let isPinned = false
const OnMouseDown = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  posX = e.clientX - rect.left;
  posY = e.clientY - rect.top;
  const headerEle = header.value!
  const headerRect = headerEle.getBoundingClientRect();
  const parent = commandlineContainer.value!.parentElement!
  if (posX <= headerRect.width && posY <= headerRect.height) {
    parent.addEventListener("mousemove", dragging)
  } else if (posY < 5) {
    parent.addEventListener("mousemove", resizing)
  }
}
function executeCommand(command:string) {

  if (CommandStack.hasCommand(command)) {
    (async () => await CommandStack.execute(command))()
  } else {
    const callFunc = async () => {
      commandLineStore.log += command
      commandLineStore.log += '\n'
      const response = await send_messages(command)
      commandLineStore.log += response.choices[0].message.content
      commandLineStore.log += '\n'
      const tool_calls = response.choices[0].message.tool_calls
      if (tool_calls) {
        for (const tool_call of tool_calls) {
          const func = tool_call.function

          const funcName = func?.name
          const argsStr = func?.arguments
          if (funcName && argsStr) {
            const args = JSON.parse(argsStr);
            if (funcName === 'line') {
              drawLineByTwoPoint(new Vector3(args.startX, args.startY, 0), new Vector3(args.endX, args.endY, 0))
            }
          }
        }
      }



    }
    callFunc()
  }
}
const onKeyPress = (e: KeyboardEvent) => {

  if (e.key === "Enter" || e.key === " ") {
    const inputString = currInput.value
    currInput.value = ""
    if(CommandStack.hasRunningCommand()){

      commandLineStore.parseArgs(inputString) 
    }else{
      executeCommand(inputString)
    }
    
  }
}
const OnMouseUp = (e: MouseEvent) => {

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
  //https://medium.com/@bloodturtle/difference-between-event-target-and-event-currenttarget-0d229cc7f9eb

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  if (offsetY >= 0) {
    const ele = commandlineContainer.value!
    const heightOffset = ele.offsetTop - offsetY
    const height = ele.clientHeight
    let newHeight = (height + heightOffset)
    if (newHeight < 40) {
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
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  let x = offsetX - posX!
  let y = offsetY - posY!

  const ele = commandlineContainer.value!
  const parent = ele.parentElement!
  const clientWidth = parent.clientWidth
  const clientHeight = parent.clientHeight



  if (x > clientWidth - ele.clientWidth) {
    x = clientWidth - ele.clientWidth
  } else if (x < 0) {
    x = 0
  }

  if (y > clientHeight - ele.clientHeight) {
    y = clientHeight - ele.clientHeight
  } else if (y < 0) {
    y = 0
  }


  ele.style.left = x + "px";
  ele.style.bottom = (clientHeight - y - ele.clientHeight) + "px";
}

</script>
<style module>
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

.container {
  position: absolute;
  bottom: 10px;
  left: 25px;
  height: 40px;
  width: calc(100% - 50px);
  background-color: whitesmoke;
  display: flex;
  flex-direction: row;
  opacity: 0.8;
}

.commandinput {
  flex-grow: 1;
}
</style>
