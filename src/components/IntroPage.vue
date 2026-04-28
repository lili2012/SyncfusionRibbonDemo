<template>
  <ejs-listview id='element' ref='list' :fields='fields' :select='onSelect'></ejs-listview>
</template>

<script setup lang="ts">
const emit = defineEmits(['openFile'])
import { ListViewComponent as EjsListview, SelectEventArgs } from "@syncfusion/ej2-vue-lists";
import { ref, onMounted, useTemplateRef } from 'vue'
import { UploadService, rpcImpl } from "sgcad";
const list= useTemplateRef('list')

onMounted(async () => {
  const upload = new UploadService(rpcImpl, false, false);
  const response = await upload.getDrawings({});

  list.value.addItem(response.drawings);
})


const fields = { text: 'filename', id: 'sha256' };

const onSelect = (args:SelectEventArgs) => {
  console.log(args.data.sha256)
  const drawingName = args.data.sha256 
  const file = new File([""], drawingName)
  const originalFileName = args.data.filename
  emit('openFile', file, originalFileName)
  list.value.unselectItem()
};

</script>
<style>
.e-listview .e-list-item {
  /* text-align: center; */
  color: black;
  /* height: 100px; */
  /* background-color: rgb(255, 255, 255); */
}
</style>

//https://ej2.syncfusion.com/vue/documentation/listview/customizing-templates
