<template>
  <ejs-ribbon class="header" :fileMenu="fileSettings">
    <e-ribbon-tabs>
      <e-ribbon-tab header="Home">
        <e-ribbon-groups>
          <e-ribbon-group header="Draw">
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
          <e-ribbon-group header="Modify">
            <e-ribbon-collections>
              <e-ribbon-collection>
                <e-ribbon-items>
                  <e-ribbon-item type="Button" :buttonSettings="addNewTab"
                    :allowedSizes=RibbonItemSize.Large></e-ribbon-item>
                </e-ribbon-items>
              </e-ribbon-collection>
            </e-ribbon-collections>
          </e-ribbon-group>
        </e-ribbon-groups>
      </e-ribbon-tab>
    </e-ribbon-tabs>
  </ejs-ribbon>
  <ejs-tab class="content" id="tab" ref='TabInstance' heightAdjustMode="Fill" overflowMode='Popup' headerPlacement="Bottom" cssClass="e-fill" :selected ='selected' :removing='removing' :showCloseButton=true>
    <e-tabitems>
      <e-tabitem :header="headerText0" :content="content0"></e-tabitem>
      <e-tabitem :header="headerText1" :content="content1"></e-tabitem>
      <e-tabitem :header="headerText2" :content="content2"></e-tabitem>
      <e-tabitem :header='addTabHeader' cssClass="withoutIcon" ></e-tabitem>
    </e-tabitems>
  </ejs-tab>
</template>

<script setup lang="ts">
import { provide, useTemplateRef, onMounted,  } from "vue";
import { RibbonFileMenu, RibbonColorPicker } from "@syncfusion/ej2-vue-ribbon";
import { RibbonItemSize, RibbonComponent as EjsRibbon, RibbonGroupDirective as ERibbonGroup, RibbonGroupsDirective as ERibbonGroups, RibbonCollectionsDirective as ERibbonCollections, RibbonCollectionDirective as ERibbonCollection, RibbonItemsDirective as ERibbonItems, RibbonItemDirective as ERibbonItem, RibbonTabsDirective as ERibbonTabs, RibbonTabDirective as ERibbonTab } from "@syncfusion/ej2-vue-ribbon";
import { TabComponent as EjsTab, TabItemsDirective as ETabitems, TabItemDirective as ETabitem,SelectEventArgs,RemoveEventArgs } from "@syncfusion/ej2-vue-navigations";

const TabInstance = useTemplateRef('TabInstance')
provide('ribbon', [RibbonFileMenu, RibbonColorPicker]);

const fileSettings = {
  visible: true,
  menuItems: [
    { text: "New", iconCss: "e-icons e-file-new", id: "new" }
  ]
};
const lineButton = { iconCss: "e-icons e-line", content: "Line" };
const polylineButton = { iconCss: "e-icons e-perimeter", content: "Polyline" };
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

const selected = (args: SelectEventArgs)=>{
  if(args.isInteracted){
    const selectedIndex = args.selectedIndex 
    const tabObj = TabInstance.value!.ej2Instances;
    const existItems = tabObj.items
    const n = existItems.length
    if(selectedIndex === (n-1)){
      addNewPage()
    }
  }
}

const removing = (args: RemoveEventArgs)=>{
  const removedIndex = args.removedIndex 
  const tabObj = TabInstance.value!.ej2Instances;
  const existItems = tabObj.items
  const n = existItems.length 
  if(removedIndex === (n-2)){
    tabObj.select(n-3)
  }
}

let drawingNumber = 1;
const addNewPage = ()=>{
  const tabObj = TabInstance.value!.ej2Instances;
    //https://github.com/vuejs/core/pull/11517
    //https://github.com/ElMassimo/vue-custom-element-example
    //https://github.com/vuejs/core/issues/4662
    //https://github.com/EranGrin/vue-web-component-wrapper?tab=readme-ov-file

    const customElement = customElements.get('hello-world')
    if (customElement) {
      const shadowElement = new customElement({})
      
     //https://stackoverflow.com/questions/9519841/why-does-this-css-margin-top-style-not-work/9519933#9519933
      //https://www.tabnine.com/academy/javascript/how-to-set-style-to-an-html-element-using-javascript/
      //shadowElement.style.overflow ="hidden"
      shadowElement.style.position= "absolute"
      shadowElement.style.width= "100%"
      shadowElement.style.height= "100%"
      const drawingTitle = "drawing" + drawingNumber.toString()
      drawingNumber = drawingNumber + 1
      const item = { header: { text: drawingTitle}, content: shadowElement };
      const existItems = document.querySelectorAll('#tab .e-toolbar-item')
      const insertIndex = existItems.length - 1;
      tabObj.addTab([item], insertIndex);
      tabObj.select(insertIndex)
    }
}

const addNewTab = {
  iconCss: "e-icons e-add-notes", content: "New Drawing",
  clicked: addNewPage
};

const headerText0 = { text: "平面图" };
const headerText1 = { text: "立面图" };
const headerText2 = { text: "详图" };
const addTabHeader = {'iconCss': 'e-plus'}
const content0 = "肥西核电站平面图";
const content1 = "肥西核电站立面图";
const content2 = "肥西核电站详图";
</script>

<style>
@import "@syncfusion/ej2-base/styles/fluent.css";
@import "@syncfusion/ej2-vue-buttons/styles/fluent.css";
@import "@syncfusion/ej2-vue-popups/styles/fluent.css";
@import "@syncfusion/ej2-vue-splitbuttons/styles/fluent.css";
@import "@syncfusion/ej2-vue-inputs/styles/fluent.css";
@import "@syncfusion/ej2-vue-lists/styles/fluent.css";
@import "@syncfusion/ej2-vue-dropdowns/styles/fluent.css";
@import "@syncfusion/ej2-vue-navigations/styles/fluent.css";
@import "@syncfusion/ej2-vue-ribbon/styles/fluent.css";
@import "@syncfusion/ej2-icons/styles/fluent.css";

.e-tab .e-tab-header .e-toolbar-item.withoutIcon span.e-icons.e-close-icon {
    display: none; 
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


</style>