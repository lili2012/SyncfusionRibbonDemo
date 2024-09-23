<script setup lang="ts">
//import { ref } from 'vue'
//import Button from './Button.ce.vue'
//defineProps<{ msg: string }>()
</script>

<template>
    <p>
    这个网页被嵌入到shadow dom中。
    </p>
  <p>
    了解shadow dom应用案例：
    <a href="https://jelly.jd.com/article/615020c42685d0019947426c" target="_blank">视觉走查插件开发之深入Shadow DOM</a>.
  </p>
  <p>
    shadow dom官方技术文档：
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM" target="_blank">Using shadow DOM</a>.
  </p>
  <!-- <Button /> -->

</template>

<style scoped>
p {
  color: black;
}
</style>
