<template>
  <ejs-tab swipeMode='None' class="content" id="innertab" ref='TabInstance' heightAdjustMode="Fill" overflowMode='Popup'
    headerPlacement="Bottom" cssClass="e-fill" :showCloseButton=false>
  </ejs-tab>
</template>
<script setup lang="ts">
const props = defineProps<{
  url: string,
  fonts: string[]
}>()

import { TabComponent as EjsTab } from "@syncfusion/ej2-vue-navigations";
import { FetchDrawing } from "./FetchDrawing";
import { useTemplateRef, onMounted } from "vue";
import { SGDb, TextRenderer, SGBlock } from "sgcad"

const TabInstance = useTemplateRef('TabInstance')


onMounted(async () => {
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
  const modelBlock = blockTable.getByName("*Model_Space")!
  modelBlock.calculateBlockBound(blockTable)
  const paperBlock = blockTable.getByName("*Paper_Space")!

  const customElement = customElements.get('view-page')
  if (customElement) {

      const modelView = new customElement({db: sgdb, block: modelBlock, isModel: true})
      modelView.style.position= "absolute"
      modelView.style.width= "100%"
      modelView.style.height= "100%"
      const paperView = new customElement({db: sgdb, block: paperBlock, isModel: false})
      paperView.style.position= "absolute"
      paperView.style.width= "100%"
      paperView.style.height= "100%"

   
      const modelItem = { header: { text: "模型"}, content: modelView };
      const paperItem = { header: { text: "布局"}, content: paperView };

      tabObj.addTab([modelItem, paperItem]);
      tabObj.select(0)
  }
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