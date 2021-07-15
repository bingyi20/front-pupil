<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { set } from 'vue/types/umd';
import HelloWorld from '../components/HelloWorld.vue'; // @ is an alias to /src
import { measure } from '../libs/measure';
import { EnableCache } from '../libs/async-cache';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  @measure
  created() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(123)
      }, 3000)
    }).then((value: number) => {
      console.log(value)
    })
  }

  mounted() {
    (window as any).home = this;
  }

  @EnableCache
  fetchData(url, timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`发起数据请求`)
        resolve(`${url}: 123123123`)
      }, timeout)
    })
  }

}
</script>
