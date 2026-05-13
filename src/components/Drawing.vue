<template>
  <div id="parent" ref='ParentInstance'>

    <ejs-tab swipeMode='None' class="content" id="innertab" ref='TabInstance' heightAdjustMode="Fill"
      overflowMode='Scrollable' headerPlacement="Bottom" cssClass="e-fill" :showCloseButton=false>
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

import { TabComponent as EjsTab } from "@syncfusion/ej2-vue-navigations";
import { FetchDrawing } from "../utils/FetchDrawing";
import { useTemplateRef, type App, onMounted, onBeforeUnmount } from "vue";
import { SGDb, cad } from "sgcad"
import { hideSpinner, createSpinner, showSpinner } from '@syncfusion/ej2-vue-popups';
import { createApp, h } from 'vue'

import View from './View.vue';
import { cosDownload } from "@/utils/Cos"
import { fileUpload } from "@/utils/FileUpload"
//import { useUserStore } from "sgcad";
const TabInstance = useTemplateRef('TabInstance')
const ParentInstance = useTemplateRef('ParentInstance')
let aborter: AbortController | null = null;
const appMap = new Map<HTMLDivElement, App>()


const getViewContent = (props) => {
  const container = document.createElement('div');
  const app = createApp({
    render() {
      return h(View, props);
    }
  });
  app.mount(container);

  appMap.set(container, app)
  return container;
}


onMounted(async () => {

  createSpinner({
    target: ParentInstance.value!,
    type:'Fabric'
  });

  showSpinner(ParentInstance.value!);

  setInterval(function () {
    hideSpinner(ParentInstance.value!);
  }, 5000);

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
    if (drawingName.endsWith(".pb")) {
      db = await FetchDrawing(`/dwg/${drawingName}`)
    } else {
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

      const props = { db: sgdb, block, isModel: i === 0 };

      const item = { header: { text: name }, content: getViewContent(props) };
      items.push(item)
    }
  }

  tabObj.addTab(items);
  //tabObj.select(1)
  //drawingHideSpinner()
});
onBeforeUnmount(() => {
  for (const [element, app] of appMap) {
    app.unmount()
    element.remove()
  }
  appMap.clear()


})
// const removing = (args: RemoveEventArgs) => {

//   const removedIndex = args.removedIndex
//   const tabObj = TabInstance.value!.ej2Instances;
//   const existItems = tabObj.items
//   const currItem = existItems[removedIndex]
//   const content = currItem.content
//   const app = appMap.get(content)
//   if(app){
//     app.unmount()
//     appMap.delete(content)
//   }
//   const n = existItems.length
//   if (removedIndex === (n - 2)) {
//     tabObj.select(n - 3)
//   }
// }
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