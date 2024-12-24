<template>
  <div id="app">
    <!-- nav bar -->
    <nav 
      class="navbar navbar-dark sticky-top"
      :style="{ 
        backgroundColor: mainColor,
        minHeight: '10vh',
        borderBottom: '1vh solid #D7CCCC',
      }">
        <div class="container-fluid px-0" :style="{color: 'white', fontWeight: 'bold', fontSize: '4vh',}">
          <div class="col-4 d-flex justify-content-start align-items-center" :style="{backgroundColor: ''}">
            <router-link to="/">
              <div class="mx-2" :class="center">
                <img :src="require('./assets/logo.png')" style="max-height:7.5vh; width: auto;">
              </div>
            </router-link>
            <div>TutorConnect</div>

            <router-link to="/tutor/register" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">สมัครติวเตอร์</div>
            </router-link>
          </div>


          <div class="col-8 d-flex flex-row-reverse justify-content-start align-items-center">
            <router-link to="/login" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">เข้าสู่ระบบ</div>
            </router-link>
            <router-link to="/student/register" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">สมัครสมาชิก</div>
            </router-link>
            <router-link to="/" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">หาติวเตอร์</div>
            </router-link>
            <router-link to="/student/tutorlist" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">ติวเตอร์ที่เคยเรียน</div>
            </router-link>
            <router-link to="/student/announce" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">ลงประกาศ</div>
            </router-link> 
          </div>


          <!-- <div class="col-8 d-flex flex-row-reverse justify-content-start align-items-center">
            <router-link to="/login" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">เข้าสู่ระบบ</div>
            </router-link>
            <router-link to="/student/register" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">สมัครสมาชิก</div>
            </router-link>
            <router-link to="/" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">หาติวเตอร์</div>
            </router-link>
            <router-link to="/tutor/studentlist" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">นักเรียนที่เคยสอน</div>
            </router-link>
            <router-link to="/tutor/enroll" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">ผู้สมัครเรียน</div>
            </router-link>
            <router-link to="/tutor/announce" :class="center" style="text-decoration: none; color: white;">
              <div class="px-3" :style="{fontSize: '3vh'}">หางาน</div>
            </router-link>
          </div> -->



          

              

        </div>
    </nav>

    <!-- router-view -->
    <div class="container-fluid bg-light d-flex flex-column align-items-center pb-5" style="min-height: 90vh">

      <router-view :key="$route.fullPath" />

    </div>

    <footer
      :style="{ backgroundColor: '#D9D9D9', minHeight: '10vh' }">
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainColor: "#BC2C2C",
      center:{
          'd-flex': true,
          'justify-content-center':true,
          'align-items-center':true
      },
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
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

#app {
  font-family: Kanit, Avenir, Helvetica, Arial, sans-serif
}

* {
  margin: 0;
  padding: 0;
}

</style>
