<template>
  <div id="parent" ref='ParentInstance'>
  <ejs-tab swipeMode='None' class="content" id="innertab" ref='TabInstance' heightAdjustMode="Fill" overflowMode='Scrollable'
    headerPlacement="Bottom" cssClass="e-fill" :showCloseButton=false >
  </ejs-tab>
</div>
</template>
<script setup lang="ts">
const props = defineProps<{
  url: string,
  fonts: string[]
}>()

import { TabComponent as EjsTab } from "@syncfusion/ej2-vue-navigations";
import { FetchDrawing } from "./FetchDrawing";
import { useTemplateRef, onMounted } from "vue";
import { SGDb, TextRenderer, Layout } from "sgcad"
import { hideSpinner, createSpinner, showSpinner } from '@syncfusion/ej2-vue-popups';
const TabInstance = useTemplateRef('TabInstance')
const ParentInstance = useTemplateRef('ParentInstance')
function drawingShowSpinner (){
  showSpinner(this!);
}
function drawingHideSpinner(){
  hideSpinner(this!);
}
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

  const db = await FetchDrawing(props.url + '.pb')
  if (!db)
    return
  const sgdb = new SGDb()
  sgdb.populate(db)
  const textRenderer = new TextRenderer
  await textRenderer.init(db.textStyles);
  const blockTable = sgdb.blockTable

  const layouts: Layout[] = db.layouts
  const customElement = customElements.get('view-page')
  if (!customElement)
    return
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
      const modelView = new customElement({ db: sgdb, block, isModel: i === 0, drawingShowSpinner:drawingShowSpinnerBind, drawingHideSpinner: drawingHideSpinnerBind })
      modelView.style.position = "absolute"
      modelView.style.width = "100%"
      modelView.style.height = "100%"
      const item = { header: { text: name }, content: modelView };
      items.push(item)
    }
  }

  tabObj.addTab(items);
  //tabObj.select(1)
  //drawingHideSpinner()
});

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
#parent{
height: 100%;
width:100%;
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