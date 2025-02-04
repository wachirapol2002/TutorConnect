<template>
  <div id="app">
    <!-- nav bar -->
    <nav 
      class="navbar navbar-dark sticky-top p-0"
      :style="{ 
        backgroundColor: mainColor,
        minHeight: '10vh',
        borderBottom: '1vh solid #D7CCCC',
      }"
      >
        <div class="container-fluid p-0 m-0" :style="{color: 'white', fontWeight: 'bold', fontSize: '4vh',}" >
          <!-- ส่วนหน้า -->
          <div class="col-4 d-flex justify-content-start align-items-center" :style="{backgroundColor: ''}">
            <router-link to="/" :class="center" style="text-decoration: none; color: white;">
              <div class="mx-2" :class="center">
                <img :src="require('./assets/logo.png')" style="max-height:7.5vh; width: auto;">
              </div>
            </router-link>
            <div>TutorConnect</div>

            <template v-if="!this.$cookies.isKey('account')">
              <router-link class="router-link mx-3" to="/tutor/register" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">สมัครติวเตอร์</div>
              </router-link>
            </template>
            <template v-if="this.$cookies.isKey('account')">
                <template v-if="this.$cookies.get('account').permission =='นักเรียน'">
                  <div class="px-3" :style="{fontSize: '3vh'}">บัญชี: นักเรียน</div>
              </template>
              <template v-if="this.$cookies.get('account').permission =='ติวเตอร์'">
                  <div class="px-3" :style="{fontSize: '3vh'}">บัญชี: ติวเตอร์</div>
              </template>
            </template>
            
            
          </div>
          

          <!-- ส่วนหลัง -->
          <!-- นักเรียน -->
          <template v-if="this.$cookies.isKey('account') && this.$cookies.get('account').permission=='นักเรียน'">
            <div class="col-8 d-flex flex-row-reverse justify-content-start align-items-center">    
              <div class="bell ms-2 me-3" :class="center" style="text-decoration: none; color: #ffcc00;">
                <font-awesome-icon icon="bell" class="" style="font-size: 2rem; cursor: pointer;" />
              </div>
              <div class="dropdown">
                <div class="router-link" :class="center" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="text-decoration: none; color: white;">
                  <div class="px-3" :style="{fontSize: '3vh'}">
                    <font-awesome-icon icon="user" class="me-1" style="font-size: 1.5rem; color: white;" />
                    {{ this.$cookies.get('account').username }}
                  </div>
                </div>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <router-link to="/student/profile" class="dropdown-item">ตั้งค่าโปรไฟล์ส่วนตัว</router-link>
                  </li>
                  <li>
                    <div class="dropdown-item" @click="logout" style="cursor: pointer;">ออกจากระบบ</div>
                  </li>
                </ul>
              </div>
              <router-link class="router-link" to="/student/tutorlist" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">ติวเตอร์ที่เคยเรียน</div>
              </router-link>
              <router-link class="router-link" to="/student/announce" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">ลงประกาศ</div>
              </router-link>
              <router-link class="router-link" to="/" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">หาติวเตอร์</div>
              </router-link>
            </div>
          </template>
          <!-- ติวเตอร์ -->
          <template v-if="this.$cookies.isKey('account') && this.$cookies.get('account').permission=='ติวเตอร์'">
            <div class="col-8 d-flex flex-row-reverse justify-content-start align-items-center">    
              <div class="bell ms-2 me-3" :class="center" style="text-decoration: none; color: #ffcc00;">
                <font-awesome-icon icon="bell" class="" style="font-size: 2rem; cursor: pointer;" />
              </div>
              <div class="dropdown">
                <div class="router-link" :class="center" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="text-decoration: none; color: white;">
                  <div class="px-3" :style="{fontSize: '3vh'}">
                    <font-awesome-icon icon="user" class="me-1" style="font-size: 1.5rem; color: white;" />
                    {{ this.$cookies.get('account').username }}
                  </div>
                </div>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <router-link to="/student/profile" class="dropdown-item">ตั้งค่าโปรไฟล์ส่วนตัว</router-link>
                  </li>
                  <li>
                    <router-link to="/student/profile" class="dropdown-item">ตั้งค่าโปรไฟล์ผู้สอน</router-link>
                  </li>
                  <li>
                    <div class="dropdown-item" @click="logout" style="cursor: pointer;">ออกจากระบบ</div>
                  </li>
                </ul>
              </div>
              <router-link class="router-link" to="/tutor/studentlist" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">นักเรียนที่เคยสอน</div>
              </router-link>
              <router-link class="router-link" to="/tutor/enroll" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">ผู้สมัครเรียน</div>
              </router-link>
              <router-link class="router-link" to="/tutor/announce" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">หางาน</div>
              </router-link>
            </div>
          </template>
          <!-- ผู้ดูแล -->
          <template v-if="this.$cookies.isKey('account') && this.$cookies.get('account').permission=='ผู้ดูแล'">
          </template>
          <!-- ผู้ใช้งานทั่วไป -->
          <template v-if="!this.$cookies.isKey('account')">
            <div class="col-8 d-flex flex-row-reverse justify-content-start align-items-center">
              <router-link class="router-link  me-3" to="/login" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">เข้าสู่ระบบ</div>
              </router-link>
              <router-link class="router-link" to="/student/register" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">สมัครสมาชิก</div>
              </router-link>
              <router-link class="router-link" to="/" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '3vh'}">หาติวเตอร์</div>
              </router-link>
            </div>
          </template>
          

<!-- 
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
      alert("ออกจากระบบแล้ว");
      this.$router.push({path: '/login'})
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
.router-link{
  transition: transform 0.2s ease;
}
.router-link:hover {
  background-color: #D94C4C; /* เปลี่ยนสีเมื่อ hover */
  transform: translateY(-2px); /* เคลื่อนขึ้นเล็กน้อย */
  transition: background-color 0.3s ease, transform 0.3s ease;
  cursor: pointer; /* แสดงให้รู้ว่าเป็นปุ่ม */
}
.router-link div:hover {
  background-color: #D94C4C; /* เปลี่ยนสีพื้นหลังเมื่อ hover */
  color: white;
  transform: translateY(-2px); /* เคลื่อนขึ้นเล็กน้อย */
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.bell{
  transition: transform 0.2s ease;
  
}

.bell:hover{
  transform: scale(1.2); /* ขยายเล็กน้อยเมื่อ hover */
  cursor: pointer; /* แสดงให้รู้ว่าเป็นปุ่ม */
}

.dropdown-menu {
  background-color: #f8f9fa;
  color: black;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #e9ecef;
  color: black;
  cursor: pointer;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
}

</style>
