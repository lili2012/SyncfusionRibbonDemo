<template>
  <div id="commandlineContainer" :class="$style.container" ref="commandlineContainer" @mouseenter="onMouseenter" @mousemove="onMouseMove"
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
      <textarea ref="logArea" readonly v-model=commandLineStore.log
        style="top:0px;padding: 0px;border: 0px;flex-grow: 1;background-color: #cccccc;min-height: 0px;"></textarea>
      <div style="flex: 0 0 30px;display: flex;flex-direction: row;">
        <span style="font-weight: 550;white-space: pre-wrap;">{{ commandLineStore.command.description?.length ?
          commandLineStore.command.description + " " : "" }}</span>
        <span style="font-weight: light;">{{ commandLineStore.prompt.description }}</span>
        <input ref="inputArea" class="commandinput" v-model="currInput"
          style="font-size:16pt;padding: 0px;border: 0px; height:30px;flex-grow: 1;" @keypress="onKeyPress"></input>
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
  //apiKey: 'ragflow-M2ZjJjODg2NTBjODExZjA4MTQ5MzJlOT',
  //baseURL: 'http://localhost:80/api/v1/chats_openai/35af8aca50d811f080c532e95cee60b0',
  // apiKey: 'sk-TJMK9IPfAL030epr5dC50cB1Ed4a478f98C20f01E2673e0d',
  // baseURL: 'https://aihubmix.com/v1',
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-22b0bd97e5b84ad5aea06194931fce6a',
  //apiKey:"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",
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

const obj = {
  "绘制的文字": "我",
  "lines": [{ "function name": "line", "parameters": { "startX": 0.4645669291338583, "startY": 0.8267716535433071, "endX": 0.4409448818897638, "endY": 0.8188976377952756 } }, { "function name": "line", "parameters": { "startX": 0.4409448818897638, "startY": 0.8188976377952756, "endX": 0.33858267716535434, "endY": 0.7716535433070866 } }, { "function name": "line", "parameters": { "startX": 0.33858267716535434, "startY": 0.7716535433070866, "endX": 0.3228346456692913, "endY": 0.7716535433070866 } }, { "function name": "line", "parameters": { "startX": 0.3228346456692913, "startY": 0.7716535433070866, "endX": 0.15748031496062992, "endY": 0.7086614173228346 } }, { "function name": "line", "parameters": { "startX": 0.3543307086614173, "startY": 0.7716535433070866, "endX": 0.3543307086614173, "endY": 0.14960629921259844 } }, { "function name": "line", "parameters": { "startX": 0.3543307086614173, "startY": 0.14960629921259844, "endX": 0.3464566929133858, "endY": 0.07086614173228346 } }, { "function name": "line", "parameters": { "startX": 0.3464566929133858, "startY": 0.07086614173228346, "endX": 0.2204724409448819, "endY": 0.15748031496062992 } }, { "function name": "line", "parameters": { "startX": 0.10236220472440945, "startY": 0.3307086614173228, "endX": 0.13385826771653542, "endY": 0.31496062992125984 } }, { "function name": "line", "parameters": { "startX": 0.13385826771653542, "startY": 0.31496062992125984, "endX": 0.15748031496062992, "endY": 0.3307086614173228 } }, { "function name": "line", "parameters": { "startX": 0.15748031496062992, "startY": 0.3307086614173228, "endX": 0.49606299212598426, "endY": 0.4645669291338583 } }, { "function name": "line", "parameters": { "startX": 0.11811023622047244, "startY": 0.5826771653543307, "endX": 0.14173228346456693, "endY": 0.5590551181102362 } }, { "function name": "line", "parameters": { "startX": 0.14173228346456693, "startY": 0.5590551181102362, "endX": 0.15748031496062992, "endY": 0.5669291338582677 } }, { "function name": "line", "parameters": { "startX": 0.15748031496062992, "startY": 0.5669291338582677, "endX": 0.8267716535433071, "endY": 0.6692913385826772 } }, { "function name": "line", "parameters": { "startX": 0.8267716535433071, "startY": 0.6692913385826772, "endX": 0.7952755905511811, "endY": 0.6771653543307087 } }, { "function name": "line", "parameters": { "startX": 0.7952755905511811, "startY": 0.6771653543307087, "endX": 0.7480314960629921, "endY": 0.6535433070866141 } }, { "function name": "line", "parameters": { "startX": 0.6692913385826772, "startY": 0.8582677165354331, "endX": 0.7637795275590551, "endY": 0.8188976377952756 } }, { "function name": "line", "parameters": { "startX": 0.7637795275590551, "startY": 0.8188976377952756, "endX": 0.7874015748031495, "endY": 0.7874015748031495 } }, { "function name": "line", "parameters": { "startX": 0.7874015748031495, "startY": 0.7874015748031495, "endX": 0.8031496062992126, "endY": 0.7637795275590551 } }, { "function name": "line", "parameters": { "startX": 0.5354330708661417, "startY": 0.9763779527559056, "endX": 0.5669291338582677, "endY": 0.937007874015748 } }, { "function name": "line", "parameters": { "startX": 0.5669291338582677, "startY": 0.937007874015748, "endX": 0.5590551181102362, "endY": 0.8661417322834646 } }, { "function name": "line", "parameters": { "startX": 0.5590551181102362, "startY": 0.8661417322834646, "endX": 0.5748031496062992, "endY": 0.7165354330708661 } }, { "function name": "line", "parameters": { "startX": 0.5748031496062992, "startY": 0.7165354330708661, "endX": 0.5826771653543307, "endY": 0.5826771653543307 } }, { "function name": "line", "parameters": { "startX": 0.5826771653543307, "startY": 0.5826771653543307, "endX": 0.5984251968503937, "endY": 0.48031496062992124 } }, { "function name": "line", "parameters": { "startX": 0.5984251968503937, "startY": 0.48031496062992124, "endX": 0.6220472440944882, "endY": 0.3858267716535433 } }, { "function name": "line", "parameters": { "startX": 0.6220472440944882, "startY": 0.3858267716535433, "endX": 0.6614173228346456, "endY": 0.2992125984251969 } }, { "function name": "line", "parameters": { "startX": 0.6614173228346456, "startY": 0.2992125984251969, "endX": 0.7086614173228346, "endY": 0.2047244094488189 } }, { "function name": "line", "parameters": { "startX": 0.7086614173228346, "startY": 0.2047244094488189, "endX": 0.7559055118110236, "endY": 0.14173228346456693 } }, { "function name": "line", "parameters": { "startX": 0.7559055118110236, "startY": 0.14173228346456693, "endX": 0.8110236220472441, "endY": 0.09448818897637795 } }, { "function name": "line", "parameters": { "startX": 0.8110236220472441, "startY": 0.09448818897637795, "endX": 0.8661417322834646, "endY": 0.047244094488188976 } }, { "function name": "line", "parameters": { "startX": 0.8661417322834646, "startY": 0.047244094488188976, "endX": 0.889763779527559, "endY": 0.031496062992125984 } }, { "function name": "line", "parameters": { "startX": 0.889763779527559, "startY": 0.031496062992125984, "endX": 0.8818897637795275, "endY": 0.2125984251968504 } }, { "function name": "line", "parameters": { "startX": 0.7637795275590551, "startY": 0.5275590551181102, "endX": 0.7559055118110236, "endY": 0.4881889763779528 } }, { "function name": "line", "parameters": { "startX": 0.7559055118110236, "startY": 0.4881889763779528, "endX": 0.7086614173228346, "endY": 0.4094488188976378 } }, { "function name": "line", "parameters": { "startX": 0.7086614173228346, "startY": 0.4094488188976378, "endX": 0.6220472440944882, "endY": 0.31496062992125984 } }, { "function name": "line", "parameters": { "startX": 0.6220472440944882, "startY": 0.31496062992125984, "endX": 0.5275590551181102, "endY": 0.23622047244094488 } }, { "function name": "line", "parameters": { "startX": 0.5275590551181102, "startY": 0.23622047244094488, "endX": 0.44881889763779526, "endY": 0.18110236220472442 } }]
}

async function send_messages(message: string) {
  const messages: Message[] = [
    { role: "system", content: "请调用用户提供的函数，这里有需要的知识：" + JSON.stringify(obj) },
    { role: "user", content: message }
  ]
  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages,
    tool_choice: "required",
    tools: aitools
  })
  return response
}
const commandLineStore = useCommandLineStore()
const commandlineContainer = useTemplateRef('commandlineContainer')
const header = useTemplateRef('header')
const logArea = useTemplateRef('logArea')
const inputArea = useTemplateRef('inputArea')

const currInput = ref("")
let posX: number | undefined
let posY: number | undefined
const onMouseenter = (e: MouseEvent) => {
  setTimeout(() => {
      const containerElement = commandlineContainer.value!
  containerElement.style.opacity = "1"
  }, 0);

}
const onMouseMove = (e: MouseEvent) =>{
  const containerElement = commandlineContainer.value!
  containerElement.style.opacity = "1"
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  posX = e.clientX - rect.left;
  posY = e.clientY - rect.top;
  const headerEle = header.value!
  const headerRect = headerEle.getBoundingClientRect();
  if (posX > headerRect.width && posY < 5) {
    logArea.value!.style.cursor = "ns-resize"
    inputArea.value!.style.cursor = "ns-resize"
  }else{
    logArea.value!.style.cursor = ""
    inputArea.value!.style.cursor = ""
  }
}
const unsubscribe = commandLineStore.$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    after((result) => {
      const textarea = logArea.value!
      textarea.scrollTop = textarea.scrollHeight;
    })
  }
)

const onMouseleave = (e: MouseEvent) => {
    setTimeout(() => {
      const containerElement = commandlineContainer.value!
  containerElement.style.opacity = "0.8"
  }, 0);
}
let isPinned = false
const OnMouseDown = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  posX = e.clientX - rect.left;
  posY = e.clientY - rect.top;
  const headerEle = header.value!
  const headerRect = headerEle.getBoundingClientRect();
  const containerElement = commandlineContainer.value!
  const parent = containerElement.parentElement!
  if (posX <= headerRect.width && posY <= headerRect.height) {
    parent.addEventListener("mousemove", dragging)
  } else if (posY < 5) {
    
    parent.addEventListener("mousemove", resizing)
  }
}
function executeCommand(command: string) {

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
    if (CommandStack.hasRunningCommand()) {

      commandLineStore.parseArgs(inputString)
    } else {
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
    if (newHeight < 30) {
      newHeight = 30
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
  height: 30px;
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
