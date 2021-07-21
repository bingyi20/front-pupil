<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="count-down">
      倒计时: {{ displayTime }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '../components/HelloWorld.vue'; // @ is an alias to /src
import { EnableCache } from '../libs/async-cache';
import Countdown from '../libs/countdown';
import { CountdownEvent, toFixed } from '../libs/countdown';

@Component({
  components: {
    HelloWorld,
  },
})

export default class Home extends Vue {
  private displayTime = '';

  public created() {
    const countdown = new Countdown(Date.now() + 24 * 60 * 60 * 1000, 75)
    countdown.on(CountdownEvent.RUNNING, remainTime => {
      const {hours, minutes, seconds, count} = remainTime
      this.displayTime = [hours, minutes, seconds].map(toFixed).join(":") + "." + toFixed(count)
    })
    countdown.on(CountdownEvent.STOP, () => {
      alert("倒计时结束")
    })
  }

  mounted() {
    (window as any).home = this;
  }

  @EnableCache
  fetchData(url: string, timeout: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`发起数据请求`)
        resolve(`${url}: 123123123`)
      }, timeout)
    })
  }

}
</script>

<style lang="scss" scoped>
  .count-down {
    font-size: 20px;
  }
</style>
