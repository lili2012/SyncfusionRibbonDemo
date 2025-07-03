<template>
  <ejs-ribbon class="header" :fileMenu="fileSettings">
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
                  <e-ribbon-item type="Button" :buttonSettings="test1"
                    :allowedSizes=RibbonItemSize.Large></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
            </e-ribbon-collections>
          </e-ribbon-group>
        </e-ribbon-groups>
      </e-ribbon-tab>
    </e-ribbon-tabs>
  </ejs-ribbon>
  <ejs-tab :selectedItem=0 swipeMode='None' class="content" id="tab" ref='TabInstance' heightAdjustMode="Fill"
    overflowMode='Scrollable' headerPlacement="Top" cssClass="e-fill" :selected='selected' :removing='removing'
    :showCloseButton=true>
    <e-tabitems>
      <e-tabitem :header="headerText0" :content="content0"></e-tabitem>
      <e-tabitem :header="headerText1" :content="content1"></e-tabitem>
      <e-tabitem :header="headerText2" :content="content2"></e-tabitem>
      <e-tabitem :header='addTabHeader' cssClass="withoutIcon"></e-tabitem>
    </e-tabitems>
  </ejs-tab>
</template>

<script setup lang="ts">
import { provide, useTemplateRef, onMounted, createVNode, render } from "vue";
import { RibbonFileMenu, RibbonColorPicker } from "@syncfusion/ej2-vue-ribbon";
import { RibbonItemSize, RibbonComponent as EjsRibbon, RibbonGroupDirective as ERibbonGroup, RibbonGroupsDirective as ERibbonGroups, RibbonCollectionsDirective as ERibbonCollections, RibbonCollectionDirective as ERibbonCollection, RibbonItemsDirective as ERibbonItems, RibbonItemDirective as ERibbonItem, RibbonTabsDirective as ERibbonTabs, RibbonTabDirective as ERibbonTab } from "@syncfusion/ej2-vue-ribbon";
import { TabComponent as EjsTab, TabItemsDirective as ETabitems, TabItemDirective as ETabitem, SelectEventArgs, RemoveEventArgs, TabItem } from "@syncfusion/ej2-vue-navigations";
import { CommandStack } from "sgcad";
import Drawing from "./components/Drawing.vue"
import OpenAI from "openai";
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
      name: "get_weather",
      description: "Get weather of an location, the user shoud supply a location first",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          }
        },
        required: ["location"]
      },
    }
  },
]

async function send_messages() {
  const messages: Message[] = [{ role: "user", content: "How's the weather in Hangzhou?" }]
  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages,
    tools: aitools
  })
  return response
}
const TabInstance = useTemplateRef('TabInstance')
provide('ribbon', [RibbonFileMenu, RibbonColorPicker]);

const fileSettings = {
  visible: true,
  text: '文件',
  menuItems: [
    { text: "新建", iconCss: "e-icons e-file-new", id: "filenew" },
    { text: "打开", iconCss: "e-icons e-file-document", id: "fileopen" }
  ]
};
const lineButton = {
  iconCss: "e-icons e-line", content: "Line", clicked: () => CommandStack.execute("line")
};

const test1 = {
  iconCss: "e-icons e-line", content: "test", clicked: () => {
    const call1 = async () => {
      const response = await send_messages()
      const func = response.choices[0].message.tool_calls?.at(0)?.function
      console.log(func?.name)
      console.log(func?.arguments)
    }
    call1()
  }
};
const polylineButton = { iconCss: "e-icons e-perimeter", content: "Polyline",  clicked: () => CommandStack.execute("polyline")};
const circleButton = { iconCss: "e-icons e-circle", content: "Circle" };
const arcButton = { iconCss: "e-icons e-radius", content: "Arc" };
const rectangleButton = { iconCss: "e-icons e-frame-5", content: "Rectangle" };
const ellipseButton = { iconCss: "e-icons e-triangle", content: "Ellipse" };
const regionButton = { iconCss: "e-icons e-table", content: "Region" };

onMounted(() => {
  const tabObj = TabInstance.value!.ej2Instances;
  tabObj.animation.previous.effect = 'None'
  tabObj.animation.next.effect = 'None'


});

const selected = (args: SelectEventArgs) => {
  if (args.isInteracted) {
    const selectedIndex = args.selectedIndex
    const tabObj = TabInstance.value!.ej2Instances;
    const existItems: TabItem[] = tabObj.items

    const n = existItems.length
    if (selectedIndex === (n - 1)) {
      addNewPage()
    }
    //const currItem = existItems[args.selectedIndex]
    // if(currItem.content.onVisible){
    //   currItem.content.onVisible()
    // }

    // const previousItem = existItems[args.previousIndex]
    // if(previousItem.content.onHide){
    //   previousItem.content.onHide()
    // }
  }
  setTimeout(() => {
    const selectedContent = args.selectedContent;
    if (selectedContent) {
      const pendingElements = selectedContent.querySelectorAll('[data-pending-mount="true"]');
      pendingElements.forEach(element => {
        if (element._mountProps) {
          const drawing = createVNode(Drawing, element._mountProps)
          render(drawing, element)
          // Clear the pending flag
          element.dataset.pendingMount = 'false';
        }
      });
    }
  }, 0);
}

const removing = (args: RemoveEventArgs) => {
  const removedIndex = args.removedIndex
  const tabObj = TabInstance.value!.ej2Instances;
  const existItems = tabObj.items
  const n = existItems.length
  if (removedIndex === (n - 2)) {
    tabObj.select(n - 3)
  }
}

let drawingNumber = 1;
//const url = "http://localhost:3000/"
//const url = "/dwg/"
//const drawings = [ "Drawing4.dxf","S70-04 通信电缆敷设图.dxf"] //, "Drawing1.dxf"
const drawings = [ "draworder1.dxf","draworder2.dxf"]
//const drawings = ["dwg2013_04.dxf"]
//const drawings = [ "S70-04 通信电缆敷设图.dxf"]
//const drawings = [ "Drawing4_1.dxf","Drawing4.dxf"]
//const drawings = [ "多行文字测试.dxf","Drawing4.dxf"]

const addNewPage = () => {
  const tabObj = TabInstance.value!.ej2Instances;

  const drawingName = drawings[(drawingNumber - 1) % 2]

  //const drawingUrl = url + drawingName

  const drawingContainer = document.createElement('div');

  //https://stackoverflow.com/questions/9519841/why-does-this-css-margin-top-style-not-work/9519933#9519933
  //https://www.tabnine.com/academy/javascript/how-to-set-style-to-an-html-element-using-javascript/
  //shadowElement.style.overflow ="hidden"
  drawingContainer.style.position = "absolute"
  drawingContainer.style.width = "100%"
  drawingContainer.style.height = "100%"
  drawingContainer.dataset.pendingMount = 'true';
  drawingContainer._mountProps = { drawingName };
  drawingNumber = drawingNumber + 1
  const item = { header: { text: drawingName }, content: drawingContainer };
  const existItems = tabObj.items
  const insertIndex = existItems.length - 1;
  tabObj.addTab([item], insertIndex);
  //tabObj.selectedItem = insertIndex
  tabObj.select(insertIndex)
  // }
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
const headerText1 = { text: "项目进展" };
const headerText2 = { text: "施工管理" };
const addTabHeader = { 'iconCss': 'e-plus' }
const content0 = `肥西核电站平面设计图是该核电站整体规划与布局的重要表现形式，涵盖了核电站内各主要建筑物、设施以及设备的空间位置安排。该设计图主要呈现了核电站的结构布局，包括反应堆厂房、蒸汽发生器、涡轮发电机组、电力变电站、冷却塔等关键组成部分的相对位置。核电站的平面设计图通常依据核安全标准和环境影响评估要求，精确标明了各设施的布置，以确保运行时的安全性、效率性和环境适应性。例如，反应堆厂房通常设有多重安全隔离层，以防止核泄漏，蒸汽发生器与涡轮机组的配置则优化了热能转换过程。此外，冷却系统的设计确保了反应堆在高温下稳定运行，并通过冷却塔实现热量的释放。在设计过程中，还需要考虑到电力输送的线路和区域规划，以确保核电站的输出能够有效连接到国家或地区的电网系统，满足不同时间段的电力需求。`;
const content1 = `肥西核电站的立面设计图主要展示了核电站各建筑物外立面的视觉效果与结构形态，旨在兼顾安全性、功能性和美观性。立面设计不仅体现了建筑的外观，还涉及到结构的抗震、防辐射等要求，以保证核电站在极端环境下的稳定性与安全性。在肥西核电站的立面设计中，反应堆厂房通常具有坚固的外墙结构，以抵御外部压力和辐射，外立面材料往往采用高强度、防辐射的混凝土或钢材，并可能配备防护屏障。此外，涡轮发电机组、冷却塔等大型设施也在立面设计中有独立的表现，通常呈现出高耸、简洁的几何形态，以适应其高效运行需求。立面设计还需要考虑到设施与周边环境的和谐融入。例如，冷却塔的高大圆形设计不仅满足冷却需求，还在视觉上具有独特的标志性，使核电站在外观上易于识别，同时确保不对周围生态环境造成过大影响。此外，立面图中还会标出建筑的入口、窗户、通风口等细节位置，以确保功能区域的合理分布和人员流动的顺畅。设计师在考虑核电站安全标准的同时，也会注重建筑的美学效果，使其在保障安全与技术要求的基础上，呈现出简洁现代的外观。`;
const content2 = `肥西核电站立面详图是对核电站建筑外立面细部设计的详细呈现，通常包括了建筑外观、结构构件、装饰元素及细节处理等内容。这类设计图不仅提供了建筑物外立面的精确尺寸、比例、材质，还展示了各部分与其他建筑构件的连接方式，确保了核电站在外观上的安全性、功能性与美观性。在肥西核电站的立面详图中，反应堆厂房的外墙可能会标出防护层的厚度、材料种类以及施工工艺，例如采用辐射防护混凝土和钢筋混凝土层的具体做法。涡轮发电机组、泵房等设施的立面详细图则涉及到外部通道、窗户、排气口等部件的尺寸和位置安排，确保建筑物的通风、散热及维护管理功能。冷却塔的立面详图通常会标明塔体的高度、直径以及内部结构的承载设计，还可能包括防风、防震等特殊设计要求。此部分详图对于冷却塔的稳定性和安全性至关重要，尤其是在面对强风和极端天气时，冷却塔的结构必须经受住巨大的外部压力。此外，立面详图还会标注建筑表面装饰材料的细节，例如抗风化的外墙涂层或金属外装饰，确保其长期的耐久性与良好的视觉效果。在美学方面，设计师还会在详图中精确呈现建筑物的比例、线条和层次感，以使建筑在严格的功能性要求下，依然能够呈现出简洁、现代的外观。`;
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