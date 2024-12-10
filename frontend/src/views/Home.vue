<template>
    <div id="app">
      <h1>wdw</h1>
    </div>
</template>
  
  <script>
  import axios from "axios";
  
  // @ is an alias to /src
  export default {
    name: "HomePage",
    data() {
      return {
        previousRoutes: [],
        isHover: false,
        search: "",
        tables: [],
        center: {
          "d-flex": true,
          "justify-content-center": true,
          "align-items-center": true,
        },
      };
    },
    mounted() {
    },
    methods: {
      getTables() {
        axios
          .get("http://44.206.165.83:3000", {
            params: {
              search: this.search,
            },
          })
          .then((response) => {
            this.tables = response.data;
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    watch: {
      $route(to, from) {
        this.previousRoutes.push(from); // เมื่อมีการเปลี่ยนเส้นทางใหม่ ให้เก็บเส้นทางก่อนหน้าลงในอาร์เรย์
      },
    },
  };
  </script>
  