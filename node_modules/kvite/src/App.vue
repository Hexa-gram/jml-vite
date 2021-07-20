<template>
  <img src="./assets/logo.png" alt="">
  <div>
    {{ title }}
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const title = ref("hello, kvite!");
    setInterval(() => {
      title.value = title.value.split("").reverse().join("");
    }, 1000);
    return { title };
  },
};
</script>
