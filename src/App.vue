<template>
  123 456
</template>


<script setup>
// import HelloWorld from "./components/HelloWorld.vue";
// import logo from "./assets/logo.png";

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md

fetch("/api/users").then((res) => {
  console.log("res", res);
});
</script>
<style scoped>
.logo {
  background: url(@/assets/logo.png);
  width: 200px;
  height: 200px;
}
</style>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
