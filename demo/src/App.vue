<template>
  <div id="title" class="big">{{ title }}</div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const title = ref("卧槽,牛逼");
    // window.vueTitle = title;
    return { title };
  },
};
</script>
<style scoped>
#title {
  color: purple;
}
</style>
<style lang="less">
.big {
  font-size: 40px;
}
</style>
