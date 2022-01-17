<template>
  <CalculatorDashboard></CalculatorDashboard>
</template>

<script>
import CalculatorDashboard from './components/CalculatorDashboard'

export default {
  name: 'App',
  components: {
    CalculatorDashboard
  }
}
</script>

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
