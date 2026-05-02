<template>
  <ejs-ribbon class="header" :fileMenu="fileSettings" :activeLayout="activeLayout">
    <e-ribbon-tabs>
      <e-ribbon-tab header="常用">
        <e-ribbon-groups>
          <e-ribbon-group header="绘制">
            <e-ribbon-collections>
              <e-ribbon-collection>
                <e-ribbon-items>
                  <e-ribbon-item type="Button" :buttonSettings="lineButton"
                    :allowedSizes=RibbonItemSize.Large></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
              <e-ribbon-collection>
                <e-ribbon-items>
                  <e-ribbon-item type="Button" :buttonSettings="polylineButton"></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
              <e-ribbon-collection>
                <e-ribbon-items>
                  <e-ribbon-item type="Button" :buttonSettings="circleButton"></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
              <e-ribbon-collection>
                <e-ribbon-items>
                  <e-ribbon-item type="Button" :buttonSettings="arcButton"></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
              <e-ribbon-collection>
                <e-ribbon-items>
                  <e-ribbon-item type="Button" :buttonSettings="rectangleButton"></e-ribbon-item>
                  <e-ribbon-item type="Button" :buttonSettings="ellipseButton"></e-ribbon-item>
                  <e-ribbon-item type="Button" :buttonSettings="regionButton"></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
            </e-ribbon-collections>
          </e-ribbon-group>
          <e-ribbon-group header="修改">
            <e-ribbon-collections>
              <e-ribbon-collection>
                <e-ribbon-items>
                  <e-ribbon-item type="Button" :buttonSettings="deleteEntities"
                    :allowedSizes=RibbonItemSize.Large></e-ribbon-item>
                  <e-ribbon-item type="Button" :buttonSettings="moveEntities"
                    :allowedSizes=RibbonItemSize.Large></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
            </e-ribbon-collections>
          </e-ribbon-group>
        </e-ribbon-groups>
      </e-ribbon-tab>
      <e-ribbon-tab header="协同">
        <e-ribbon-groups>
          <e-ribbon-group header="版本">
            <e-ribbon-collections>
              <e-ribbon-collection>
                <e-ribbon-items>
                  <e-ribbon-item type="Button" :buttonSettings="lineButton"
                    :allowedSizes=RibbonItemSize.Large></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
            </e-ribbon-collections>
          </e-ribbon-group>
        </e-ribbon-groups>
      </e-ribbon-tab>
      <e-ribbon-tab header="AI">
        <e-ribbon-groups>
          <e-ribbon-group header="命令">
            <e-ribbon-collections>
              <e-ribbon-collection>
                <e-ribbon-items>
                  <e-ribbon-item type="Button" :allowedSizes=RibbonItemSize.Large></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
            </e-ribbon-collections>
          </e-ribbon-group>
        </e-ribbon-groups>
      </e-ribbon-tab>
    </e-ribbon-tabs>
  </ejs-ribbon>
  <CommandLine class="float" v-show="isCommandLineVisible" />
  <ejs-tab :selectedItem=0 swipeMode='None' class="content" id="tab" ref='TabInstance' heightAdjustMode="Fill"
    overflowMode='Scrollable' headerPlacement="Top" cssClass="e-fill" :selected='selected' :removing='removing'
    :showCloseButton=true>

    <e-tabitems>
      <e-tabitem :header="headerText0" :content="content0"></e-tabitem>
      <e-tabitem :header="headerText1" :content="'introPageComponent'"></e-tabitem>
      <template v-slot:introPageComponent>
        <IntroPage @openFile=openNewDrawing></IntroPage>
      </template>

      <!-- <e-tabitem :header="headerText2" :content="content2"></e-tabitem> -->
      <e-tabitem :header='addTabHeader' cssClass="withoutIcon"></e-tabitem>
    </e-tabitems>

  </ejs-tab>
</template>

<script setup lang="ts">
import { createApp, type App, h, provide, useTemplateRef, onMounted, render, ref } from "vue";
import { RibbonFileMenu, RibbonColorPicker, FileMenuEventArgs } from "@syncfusion/ej2-vue-ribbon";
import { RibbonItemSize, RibbonComponent as EjsRibbon, RibbonGroupDirective as ERibbonGroup, RibbonGroupsDirective as ERibbonGroups, RibbonCollectionsDirective as ERibbonCollections, RibbonCollectionDirective as ERibbonCollection, RibbonItemsDirective as ERibbonItems, RibbonItemDirective as ERibbonItem, RibbonTabsDirective as ERibbonTabs, RibbonTabDirective as ERibbonTab } from "@syncfusion/ej2-vue-ribbon";
import { TabComponent as EjsTab, TabItemsDirective as ETabitems, TabItemDirective as ETabitem, SelectEventArgs, RemoveEventArgs, TabItem } from "@syncfusion/ej2-vue-navigations";
import { CommandStack } from "sgcad";
import Drawing from "@/components/Drawing.vue"
import { useFileDialog } from '@vueuse/core'
import IntroPage from "@/components/IntroPage.vue"
import CommandLine from './CommandLine.vue';
const TabInstance = useTemplateRef('TabInstance')
provide('ribbon', [RibbonFileMenu, RibbonColorPicker]);

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: '.dwg,.dxf', // Set to accept only image files
  directory: false, // Select directories instead of files if set true
  multiple: false,
})

onChange((files) => {
  const file = files?.item(0)
  if (file) {
    openNewDrawing(file)
    reset()
  }

})

const fileSettings = {
  visible: true,
  text: '文件',
  menuItems: [
    { text: "打开", iconCss: "e-icons e-file-document", id: "fileopen" },
    { text: "打开文件-本地测试用", iconCss: "e-icons e-file-document", id: "localFileopen" }
  ],
  select: (args: FileMenuEventArgs) => {
    const id = args.item.id
    switch (id) {
      case "fileopen":
        open()
        break;
      case "localFileopen":
        openLocalDrawing()
        break;
      default:
        break;
    }
  }
};
const lineButton = {
  iconCss: "e-icons e-line", content: "Line", clicked: () => CommandStack.execute("line")
};

const polylineButton = { iconCss: "e-icons e-perimeter", content: "Polyline", clicked: () => CommandStack.execute("polyline") };
const circleButton = { iconCss: "e-icons e-circle", content: "Circle" };
const arcButton = { iconCss: "e-icons e-radius", content: "Arc" };
const rectangleButton = { iconCss: "e-icons e-frame-5", content: "Rectangle" };
const ellipseButton = { iconCss: "e-icons e-triangle", content: "Ellipse" };
const regionButton = { iconCss: "e-icons e-table", content: "Region" };

const activeLayout = ref("Classic");
const appMap = new Map<HTMLDivElement, App>()
const detectMobile = () => {
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    activeLayout.value = "Simplified"
  }
};
const isCommandLineVisible = ref(false)
onMounted(() => {
  const tabObj = TabInstance.value!.ej2Instances;
  tabObj.animation.previous.effect = 'None'
  tabObj.animation.next.effect = 'None'
  detectMobile()

});

const getDrawingContent = (props: { file: File }) => {
  const container = document.createElement('div');
  const app = createApp({
    render() {
      return h(Drawing, props);
    }
  });
  app.mount(container);

  appMap.set(container, app)
  return container;
}


const selected = (args: SelectEventArgs) => {
  if (args.isInteracted) {
    const selectedIndex = args.selectedIndex
    const tabObj = TabInstance.value!.ej2Instances;
    const existItems: TabItem[] = tabObj.items

    const n = existItems.length
    if (selectedIndex === (n - 1)) {
      addNewPage()
    }

    const currItem = existItems[args.selectedIndex]
    const content = currItem.content
    isCommandLineVisible.value = false
    if (content instanceof HTMLElement) {
      const canvas = content.querySelector('canvas');
      if (canvas) {
        isCommandLineVisible.value = true
      }
    }


    // const previousItem = existItems[args.previousIndex]
    // if(previousItem.content.onHide){
    //   previousItem.content.onHide()
    // }
  }
}

const removing = (args: RemoveEventArgs) => {

  const removedIndex = args.removedIndex
  const tabObj = TabInstance.value!.ej2Instances;
  const existItems = tabObj.items
  const currItem = existItems[removedIndex]
  const content = currItem.content
  const app = appMap.get(content)
  if (app) {
    app.unmount()
    content.remove()
    appMap.delete(content)
  }
  const n = existItems.length
  if (removedIndex === (n - 2)) {
    tabObj.select(n - 3)
  }
}

// const removed = (args: RemoveEventArgs) => {
//   console.log("removed", args)
// }

let drawingNumber = 1;

const drawings = ["Drawing4.dxf.pb", "S70-04 通信电缆敷设图.dxf.pb"] //, ""dwg2013_04.dwg", " glow.dxf


const openLocalDrawing = () => {

  const drawingName = drawings[(drawingNumber - 1) % 2]
  const file = new File([""], drawingName)
  openNewDrawing(file)

}

//TODO: 目前的做法是每次新建一个tab就加载一个dwg文件，后续可以改成下载好文件后再加载，或者新建tab时先不加载文件，等用户切换到该tab时再加载
const openNewDrawing = (file: File, originalFileName?: string) => {
  isCommandLineVisible.value = true
  const tabObj = TabInstance.value!.ej2Instances;

  drawingNumber = drawingNumber + 1
  const headerName = originalFileName ?? file.name
  const item = { header: { text: headerName }, content: getDrawingContent({ file }) };
  const existItems = tabObj.items
  const insertIndex = existItems.length - 1;
  tabObj.addTab([item], insertIndex);
  tabObj.select(insertIndex)
}

const addNewPage = () => {
  const drawingName = "Drawing4.dxf"
  const file = new File([""], "cfa11d79bd908cb7e9ae000069837f9700e7bd52e5877adba39f4f9ed4f7f258")
  openNewDrawing(file, drawingName)

}

const deleteEntities = {
  iconCss: "e-icons e-erase", content: "删除",
  clicked: () => CommandStack.execute("delete")
};
const moveEntities = {
  iconCss: "e-icons e-transform", content: "移动",
  clicked: () => CommandStack.execute("move")
};

const headerText0 = { text: "工程介绍" };
const headerText1 = { text: "图纸列表" };

const addTabHeader = { 'iconCss': 'e-plus' }
const content0 = "肥西核电站平面设计图是该核电站整体规划与布局的重要表现形式，涵盖了核电站内各主要建筑物、设施以及设备的空间位置安排。该设计图主要呈现了核电站的结构布局，包括反应堆厂房、蒸汽发生器、涡轮发电机组、电力变电站、冷却塔等关键组成部分的相对位置。核电站的平面设计图通常依据核安全标准和环境影响评估要求，精确标明了各设施的布置，以确保运行时的安全性、效率性和环境适应性。例如，反应堆厂房通常设有多重安全隔离层，以防止核泄漏，蒸汽发生器与涡轮机组的配置则优化了热能转换过程。此外，冷却系统的设计确保了反应堆在高温下稳定运行，并通过冷却塔实现热量的释放。在设计过程中，还需要考虑到电力输送的线路和区域规划，以确保核电站的输出能够有效连接到国家或地区的电网系统，满足不同时间段的电力需求。"

</script>

<style>
@import "@syncfusion/ej2-base/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-buttons/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-popups/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-splitbuttons/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-inputs/styles/fabric-dark.css";
/* @import "@syncfusion/ej2-vue-lists/styles/fabric-dark.css"; */
@import "@syncfusion/ej2-vue-dropdowns/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-navigations/styles/fabric-dark.css";
@import "@syncfusion/ej2-vue-ribbon/styles/fabric-dark.css";
@import "@syncfusion/ej2-icons/styles/fabric.css";

.float {
  position: fixed;
  z-index: 1000;
}

.e-tab .e-tab-header .e-toolbar-item.withoutIcon span.e-icons.e-close-icon {
  display: none;
}

/*To show the first letter of Tab header text to Lowercase */
.e-tab .e-tab-header .e-toolbar-item .e-tab-text {
  text-transform: none !important;
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

/* .header {
  flex: 0 1 auto;
}

.content {
  flex: 1 1 auto;
} */
</style>