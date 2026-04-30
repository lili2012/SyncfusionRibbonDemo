<template>
  <div id="parent" ref='ParentInstance'>
    <ejs-tab swipeMode='None' class="content" id="innertab" ref='TabInstance' heightAdjustMode="Fill"
      overflowMode='Scrollable' headerPlacement="Bottom" cssClass="e-fill" :showCloseButton=false :selected='selected'>
    </ejs-tab>
    <!-- <Teleport to=".e-tab .e-content > .e-item.e-active">
      <div class="modal">
        <p>Hello from the modal!</p>
        <button>Close</button>
      </div>
    </Teleport> -->
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  file: File
}>()

import { TabComponent as EjsTab, SelectEventArgs } from "@syncfusion/ej2-vue-navigations";
import { FetchDrawing } from "../utils/FetchDrawing";
import { useTemplateRef, onMounted, onUnmounted, onBeforeUnmount } from "vue";
import { SGDb, cad } from "sgcad"
import { hideSpinner, createSpinner, showSpinner } from '@syncfusion/ej2-vue-popups';
import { createApp, h, createVNode, render } from 'vue'
import CommandLine from './CommandLine.vue';
import View from './View.vue';
import { cosDownload } from "@/utils/Cos"
import { fileUpload } from "@/utils/FileUpload"
//import { useUserStore } from "sgcad";
const TabInstance = useTemplateRef('TabInstance')
const ParentInstance = useTemplateRef('ParentInstance')
let aborter: AbortController | null = null;
function drawingShowSpinner() {
  showSpinner(this!);
}
function drawingHideSpinner() {
  hideSpinner(this!);
}
async function waitUntil(condition: () => boolean, timeout = 1000) {
  const time = 100
  let acumulateTime = 0
  while (!condition()) {
    await new Promise((resolve) => setTimeout(resolve, time));
    acumulateTime += time
    if (acumulateTime >= timeout) {
      return;
    }
  }
}
// onMounted(() => {
//   if(aborter){
//     aborter.abort()
//   }
// })
onMounted(async () => {
  createSpinner({
    target: ParentInstance.value!,
  });
  const drawingShowSpinnerBind = drawingShowSpinner.bind(ParentInstance.value!)
  const drawingHideSpinnerBind = drawingHideSpinner.bind(ParentInstance.value!)
  drawingShowSpinnerBind()
  const tabObj = TabInstance.value!.ej2Instances;
  tabObj.animation.previous.effect = 'None'
  tabObj.animation.next.effect = 'None'
  //const userStore = useUserStore()
  //await waitUntil(() => userStore.user !== "");
  const file = props.file
  aborter = new AbortController();
  let db: Db | undefined = undefined
  if (file.size > 0) {
    db = await fileUpload(file, aborter.signal)
  } else {
    const drawingName = file.name
    if(drawingName.endsWith(".pb")){
      db = await FetchDrawing(`/dwg/${drawingName}`)
    }else{
      db = await cosDownload(`/${drawingName}.pb.${window.encoding}`)
    }
  }

  if (!db)
    return
  const sgdb = new SGDb()
  SGDb.setCurrentDb(sgdb)
  sgdb.populate(db)

  await sgdb.textStyleTableTable.waitForFontFiles()
  const blockTable = sgdb.blockTable

  const layouts: cad.Layout[] = db.layouts


  const n = layouts.length
  const items = []
  for (let i = 0; i < n; i++) {
    const layout = layouts[i]
    const blockid = layout.paperSpaceId
    const block = blockTable.getById(blockid)
    if (block) {
      const name = layout.name
      let isModel = false
      if (i === 0) {
        isModel = true
      }
      const viewContainer = document.createElement('div');
      viewContainer.style.position = 'absolute'
      viewContainer.style.top = '0'
      viewContainer.style.bottom = '0'
      viewContainer.style.left = '0'
      viewContainer.style.right = '0'
      viewContainer.style.display = 'flex'
      // Store the props and component info without mounting
      viewContainer.dataset.pendingMount = 'true';
      viewContainer._mountProps = { db: sgdb, block, isModel: i === 0, drawingShowSpinner: drawingShowSpinnerBind, drawingHideSpinner: drawingHideSpinnerBind };

      const item = { header: { text: name }, content: viewContainer };
      items.push(item)
    }
  }

  tabObj.addTab(items);
  //tabObj.select(1)
  //drawingHideSpinner()
});
onBeforeUnmount(() => {
  const tabObj = TabInstance.value!.ej2Instances;
  // tabObj.removeallTabs();

  // console.log(TabInstance.value!.ej2Instances)
  // ParentInstance.value!.querySelectorAll('.e-item').forEach(item => {
  //   const content = item.firstChild as HTMLElement
  //   if (content) {
  //     render(null, content)
  //   }
  // })
  const n = tabObj.items.length
  for (let i = n - 1; i >= 0; i--) {
    const content = tabObj.items[i].content
    if (content) {
      render(null, content)
    }
  }

})
const selected = (args: SelectEventArgs) => {
  // When a tab is selected, check if it has pending components to mount
  setTimeout(() => {
    const selectedContent = args.selectedContent;
    if (selectedContent) {
      const pendingElements = selectedContent.querySelectorAll('[data-pending-mount="true"]');
      pendingElements.forEach(element => {
        if (element._mountProps) {
          // Now mount the component when the tab is visible
          const view = createVNode(View, element._mountProps)

          render(view, element)
          // Clear the pending flag
          element.dataset.pendingMount = 'false';
          const child = element.firstChild as HTMLElement
          if (child) {
            if (!args.isInteracted) {
              const commandline = createVNode(CommandLine)
              render(commandline, child)
            }
          }
        }
      });

      const content = selectedContent.parentElement!
      const commandline = content.querySelectorAll('#commandlineContainer').item(0)
      const child = selectedContent.firstChild?.firstChild as HTMLElement
      child.append(commandline)

    }
  }, 0);
}
</script>

<style>
@import "@syncfusion/ej2-base/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-buttons/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-popups/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-splitbuttons/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-inputs/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-lists/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-dropdowns/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-navigations/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-ribbon/styles/fabric-dark.css";
@import "@syncfusion/ej2-icons/styles/fabric.css";

.e-tab .e-tab-header .e-toolbar-item.withoutIcon span.e-icons.e-close-icon {
  display: none;
}

.e-tab .e-tab-header {
  background-color: #333232;
}

.e-tab.e-fill .e-tab-header {
  border-bottom: 10px;
  border-top: 1px Solid #0074cc;
}

.e-tab .e-content .e-item {
  color: black;
  font-size: 20px;
}

.e-ribbon.e-rbn .e-ribbon-tab .e-tab-header .e-toolbar-item.e-active .e-tab-wrap .e-tab-text {
  color: white;
}

.e-ribbon.e-rbn .e-ribbon-tab .e-tab-header .e-indicator {
  background: #0074cc;
}
</style>


<style scoped>
#parent {
  height: 100%;
  width: 100%;
  background-color: black;
}

.ribbonTemplate {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ribbonTemplate.Large {
  flex-direction: column;
}

.ribbonTemplate.Large .e-icons {
  font-size: 35px;
}

.ribbonTemplate.Medium .e-icons,
.ribbonTemplate.Small .e-icons {
  font-size: 20px;
  margin: 15px 5px;
}

.ribbonTemplate.Small .text {
  display: none;
}

.font-group .e-ribbon-group-content {
  justify-content: center;
}

.e-add-icon::before {
  content: '\e823';
}

.header {
  flex: 0 1 auto;
}

.content {
  flex: 1 1 auto;
}

/* .e-tab .e-tab-header:not(.e-vertical) .e-indicator, .e-tab .e-tab-header.e-vertical .e-indicator {
    transition: none;
} */
</style>