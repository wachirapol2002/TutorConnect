<template>
  <div id="app">
    <!-- nav bar -->
    <nav class="navbar navbar-light sticky-top border-bottom bg-dark" style="height: 10vh;">
            <div class="container-fluid">

                 
      
            </div>
    </nav>

    <!-- router-view -->
    <router-view :key="$route.fullPath" />


    <footer class="bg-dark" style="height: 10vh;"></footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center:{
          'd-flex': true,
          'justify-content-center':true,
          'align-items-center':true
      },
      hoverBooking: false,
      hoverCheckIN: false,
      hoverPayment: false,
      hoverVIP: false,
      hoverRegister: false,
    };
  },
  methods: {
    logout () {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
      alert("Logout");
      this.$router.push({path: '/user/login'})
    },
  },
};
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
