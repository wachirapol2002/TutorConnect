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
        <div class="container-fluid p-0 m-0" :style="{color: 'white', fontWeight: 'bold', fontSize: '2vw',}" >
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
                <div class="px-3" :style="{fontSize: '1.5vw'}">สมัครติวเตอร์</div>
              </router-link>
            </template>
            <template v-if="this.$cookies.isKey('account')">
                <template v-if="this.$cookies.get('account').permission =='นักเรียน'">
                  <div class="px-3" :style="{fontSize: '1.5vw'}">บัญชี: นักเรียน</div>
              </template>
              <template v-if="this.$cookies.get('account').permission =='ติวเตอร์'">
                  <div class="px-3" :style="{fontSize: '1.5vw'}">บัญชี: ติวเตอร์</div>
              </template>
              <template v-if="this.$cookies.get('account').permission =='ผู้ดูแลระบบ'">
                  <div class="px-3" :style="{fontSize: '1.5vw'}">บัญชี: ผู้ดูแลระบบ</div>
              </template>
            </template>
            
            
          </div>
          

          <!-- ส่วนหลัง -->
          <!-- นักเรียน -->
          <template v-if="this.$cookies.isKey('account') && this.$cookies.get('account').permission=='นักเรียน'">
            <div class="col-8 d-flex flex-row-reverse justify-content-start align-items-center">    
              <div class="bell ms-2 me-3" :class="center" style="text-decoration: none; color: #ffcc00;">
              </div>
              <div class="dropdown">
                <div class="router-link" :class="center" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="text-decoration: none; color: white;">
                  <div class="px-3" :style="{fontSize: '1.5vw'}">
                    <font-awesome-icon icon="user" class="me-1" style="font-size: 1.5rem; color: white;" />
                    {{ this.$cookies.get('account').username }}
                    <span >&#9660;</span>
                  </div>
                </div>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <router-link to="/notification" class="dropdown-item">
                      ข้อความแจ้งเตือน <font-awesome-icon icon="bell" class="" style="font-size: 1rem; cursor: pointer;" /> 
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/student/profile" class="dropdown-item">ตั้งค่าโปรไฟล์ส่วนตัว</router-link>
                  </li>
                  <li>
                    <div class="dropdown-item" @click="logout" style="cursor: pointer;">ออกจากระบบ</div>
                  </li>
                </ul>
              </div>
              <router-link class="router-link" to="/student/tutorlist" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '1.5vw'}">ติวเตอร์ที่เคยเรียน</div>
              </router-link>
              <router-link class="router-link" to="/student/announce" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '1.5vw'}">ลงประกาศ</div>
              </router-link>
              <router-link class="router-link" to="/" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '1.5vw'}">หาติวเตอร์</div>
              </router-link>
              <router-link class="router-link" to="/chat" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :class="center" :style="{fontSize: '1.5vw'}">
                  ข้อความ
                  <div v-if="unread_messages != 0" class="num-box ms-1 px-2" :class="center"
                    style="width: auto; height: auto;"
                    :style="{fontSize: '1.25vw'}"
                  >
                    {{ unread_messages }}
                  </div>
                </div>
              </router-link>
            </div>
          </template>
          <!-- ติวเตอร์ -->
          <template v-if="this.$cookies.isKey('account') && this.$cookies.get('account').permission=='ติวเตอร์'">
            <div class="col-8 d-flex flex-row-reverse justify-content-start align-items-center">    
              <div class="bell ms-2 me-3" :class="center" style="text-decoration: none; color: #ffcc00;">
              </div>
              <div class="dropdown">
                <div class="router-link" :class="center" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="text-decoration: none; color: white;">
                  <div class="px-3" :style="{fontSize: '1.5vw'}">
                    <font-awesome-icon icon="user" class="me-1" style="font-size: 1.5rem; color: white;" />
                    {{ this.$cookies.get('account').username }}
                    <span >&#9660;</span>
                  </div>
                </div>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <router-link to="/notification" class="dropdown-item">
                      ข้อความแจ้งเตือน <font-awesome-icon icon="bell" class="" style="font-size: 1rem; cursor: pointer;" /> 
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/student/profile" class="dropdown-item">ตั้งค่าโปรไฟล์ส่วนตัว</router-link>
                  </li>
                  <li>
                    <router-link to="/teacher/profile" class="dropdown-item">ตั้งค่าโปรไฟล์ผู้สอน</router-link>
                  </li>
                  <li>
                    <div class="dropdown-item" @click="logout" style="cursor: pointer;">ออกจากระบบ</div>
                  </li>
                </ul>
              </div>

              <template v-if="this.$cookies.isKey('account') && this.$cookies.get('account').permission=='ติวเตอร์' && this.$cookies.get('account').tutor_status=='พร้อมสอน'">
                <router-link class="router-link" to="/tutor/studentlist" :class="center" style="text-decoration: none; color: white;">
                  <div class="px-3" :style="{fontSize: '1.5vw'}">นักเรียนที่เคยสอน</div>
                </router-link>
                <router-link class="router-link" to="/tutor/enroll" :class="center" style="text-decoration: none; color: white;">
                  <div class="px-3" :style="{fontSize: '1.5vw'}">ผู้สมัครเรียน</div>
                </router-link>
                <router-link class="router-link" to="/tutor/announce" :class="center" style="text-decoration: none; color: white;">
                  <div class="px-3" :style="{fontSize: '1.5vw'}">หางาน</div>
                </router-link>
              </template>
    
              <router-link class="router-link" to="/chat" :class="center" style="text-decoration: none; color: white;">
                  <div class="px-3" :class="center" :style="{fontSize: '1.5vw'}">
                    ข้อความ
                    <div v-if="unread_messages != 0" class="num-box ms-1 px-2" :class="center"
                    style="width: auto; height: auto;"
                    :style="{fontSize: '1.25vw'}"
                    >
                    {{ unread_messages }}
                    </div>
                  </div>
              </router-link>

              <template v-if="this.$cookies.isKey('account') && this.$cookies.get('account').permission=='ติวเตอร์' && this.$cookies.get('account').tutor_status!='พร้อมสอน'">
                <router-link class="router-link" to="/tutor/announce" :class="center" style="text-decoration: none; color: white;">
                    <div class="px-3" :style="{fontSize: '1.5vw'}">ยืนยันตัวตน</div>
                </router-link>
              </template>
            </div>
          </template>
          <!-- ผู้ดูแลระบบ -->
          <template v-if="this.$cookies.isKey('account') && this.$cookies.get('account').permission=='ผู้ดูแลระบบ'">
            <div class="col-8 d-flex flex-row-reverse justify-content-start align-items-center">    
              <div class="bell ms-2 me-3" :class="center" style="text-decoration: none; color: #ffcc00;">
              </div>
              <div class="dropdown">
                <div class="router-link" :class="center" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="text-decoration: none; color: white;">
                  <div class="px-3" :style="{fontSize: '1.5vw'}">
                    <font-awesome-icon icon="user" class="me-1" style="font-size: 1.5rem; color: white;" />
                    {{ this.$cookies.get('account').username }}
                    <span >&#9660;</span>
                  </div>
                </div>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <router-link to="/notification" class="dropdown-item">
                      ข้อความแจ้งเตือน <font-awesome-icon icon="bell" class="" style="font-size: 1rem; cursor: pointer;" /> 
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/student/profile" class="dropdown-item">ตั้งค่าโปรไฟล์ส่วนตัว</router-link>
                  </li>
                  <li>
                    <div class="dropdown-item" @click="logout" style="cursor: pointer;">ออกจากระบบ</div>
                  </li>
                </ul>
              </div>


              <div class="dropdown">
                <div class="router-link" :class="center" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="text-decoration: none; color: white;">
                  <div class="px-3" :class="center" :style="{fontSize: '1.5vw'}">
                    จัดการบัญชี <span >&#9660;</span>
                </div>
                </div>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <router-link to="/admin/verify" class="dropdown-item">
                      ยืนยันตัวตนผู้สอน {{ unverify_count }}
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/admin/tutorlist" class="dropdown-item">บัญชีผู้สอนทั้งหมด</router-link>
                  </li>
                  <li>
                    <router-link to="/admin/studentlist" class="dropdown-item">บัญชีผู้เรียนทั้งหมด</router-link>
                  </li>
                </ul>
              </div>


              <router-link class="router-link" to="/tutor/announce" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '1.5vw'}">ดูประกาศ</div>
              </router-link>
              <router-link class="router-link" to="/" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '1.5vw'}">ผู้สอนในระบบ</div>
              </router-link>
              <router-link class="router-link" to="/chat" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :class="center" :style="{fontSize: '1.5vw'}">
                  ข้อความ
                  <div v-if="unread_messages != 0" class="num-box ms-1 px-2" :class="center"
                    style="width: auto; height: auto;"
                    :style="{fontSize: '1.25vw'}"
                  >
                    {{ unread_messages }}
                  </div>
                </div>
              </router-link>
            </div>
          </template>
          <!-- ผู้ใช้งานทั่วไป -->
          <template v-if="!this.$cookies.isKey('account')">
            <div class="col-8 d-flex flex-row-reverse justify-content-start align-items-center">
              <router-link class="router-link  me-3" to="/login" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '1.5vw'}">เข้าสู่ระบบ</div>
              </router-link>
              <router-link class="router-link" to="/student/register" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '1.5vw'}">สมัครสมาชิก</div>
              </router-link>
              <router-link class="router-link" to="/" :class="center" style="text-decoration: none; color: white;">
                <div class="px-3" :style="{fontSize: '1.5vw'}">หาติวเตอร์</div>
              </router-link>
            </div>
          </template>
          


              

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
import axios from "axios";
export default {
  data() {
    return {
      intervalID: null,
      mainColor: "#BC2C2C",
      unread_messages: 0,
      unverify_count: 0,
      center:{
          'd-flex': true,
          'justify-content-center':true,
          'align-items-center':true
      },
    };
  },
  mounted() {
    // this.unread_messages = this.$cookies.get("unread_messages") || 0;
    // ตรวจสอบค่าจาก cookies ทุกๆ 3 วินาที
    this.startInterval();
  },
  beforeUnmount() {
    this.stopInterval(); // หยุด interval เมื่อ component ถูกทำลาย
  },
  watch: {
    unread_messages(newValue, oldValue) {
      console.log(`Unread messages เปลี่ยนจาก ${oldValue} เป็น ${newValue}`);
    },
  },
  methods: {
    startInterval() {
      this.intervalID = setInterval(() => {
        this.unReadCount();
        this.verifyCount()
      }, 3000);
    },
    stopInterval() {
      if (this.intervalID) {
        clearInterval(this.intervalID);
        this.intervalID = null; // ตั้งค่าให้เป็น null เพื่อป้องกันการ clear ซ้ำ
      }
    },

    logout () {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
      alert("ออกจากระบบแล้ว");
      this.$router.push({path: '/login'})
    },
    unReadCount() {
      if(this.$cookies.isKey('account')){
        const data = {
          account_id: this.$cookies.get("account").account_id,
        };
        axios.post("http://localhost:3000/chat/unread/count", data)
        .then((res) => {
          // this.$cookies.set("unread_messages", res.data.unread.unread_count);
          this.unread_messages = res.data.unread.unread_count
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
      }
      // const newCount = this.$cookies.get("unread_messages");
      // if (newCount !== this.unread_messages) {
      //   this.unread_messages = newCount;
      // }
    },
    verifyCount() {
      if(this.$cookies.isKey('account') && this.$cookies.get('account').permission=='ผู้ดูแลระบบ'){
        axios.post("http://localhost:3000/tutorlist/unverify/count")
        .then((res) => {
          this.unverify_count = res.data.count
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
      }
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
.profile-img {
  width: 100%;   /* ทำให้รูปขยายเต็มขนาดของ div */
  height: 100%;  /* ทำให้รูปเต็มขนาดของ div */
  object-fit: cover; /* ป้องกันภาพบิดเบี้ยว และครอบรูปให้อยู่ในกรอบ */
}
.num-box {
  background-color: white;
  color: black;
  border-radius: 8px;
  border: 2px solid black;
}
</style>
