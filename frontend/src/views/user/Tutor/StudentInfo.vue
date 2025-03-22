<template>
    <div id="app">
        <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
        
      <!-- <br /> -->
          <div class="fw-bold text-center" style="font-size: 2.5vw;">ข้อมูลติดต่อนักเรียน</div>
       
        </div>
        
        <div class="container-fluid rounded-4  border border-dark p-3 py-4" :style="{ backgroundColor: 'white' }" style="width: 80vw;">
            <!-- ข้อมูส่วนตัว -->
            <div class="row" :style="{ backgroundColor: '' }">
                <div class="col-3" style="" :style="{ backgroundColor: '' }">
                  <!-- รูปโปรไฟล์ -->
                  <section class="container mt-4">
                    <div class="content">
                      <div class="file d-flex flex-column justify-content-center align-items-end">
                        <div :class="center" style="height:10vw; width: 10vw; background-color: white; border: 1px solid black; overflow: hidden;">     
                          <img :src="this.portrait_path ? 'http://localhost:3000' + this.portrait_path : require('@/assets/user.png')" alt="โปรไฟล์" 
                            style="width: 100%; height: 100%; object-fit: cover;"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div class="col-9" :style="{ backgroundColor: '' }">
                  <section class="container mt-4" style="font-size: 1.5vw;">
                    <!-- ชื่อผู้ใช้งาน -->
                    <div class="row my-2">
                      <div class="form-group col-8 d-flex" :style="{ backgroundColor: '' }">
                        <label class="form-label fw-bold" for="username">ชื่อผู้ใช้งาน:</label>
                        <div class="mx-2">{{ this.username }}</div>
                      </div>
                      
                    </div>
                    <!-- ระดับบัญชี -->
                    <div class="row my-2">
                      <div class="form-group col-8 d-flex">
                        <label class="form-label fw-bold" for="permission">ระดับบัญชี:</label>
                        <div class="mx-2">{{this.permission}}</div>
                      </div>
                      
                    </div>     
                    <!-- อีเมล -->
                    <div class="row my-2">
                      <div class="form-group col-8">
                        <label class="form-label fw-bold" for="email">อีเมล</label>
                        <div class="mx-2">{{this.email}}</div>
                      </div>

                    </div>
                    <div class="row my-2">
                      <!-- ชื่อจริง -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="firstname">ชื่อจริง</label>
                        <div class="mx-2">{{this.firstname}}</div>
                      </div>
                      <!-- นามสกุล -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="lastname">นามสกุล</label>
                        <div class="mx-2">{{this.lastname}}</div>
                      </div>
                     
                    </div>
                    <div class="row my-2">
                      <!-- เบอร์ติดต่อ -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="phone">เบอร์ติดต่อ</label>
                        <div class="mx-2">{{this.phone}}</div>
                      </div>
                      <!-- เพศ -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="gender">เพศ</label>
                        <div class="mx-2">{{this.gender}}</div>
                      </div>
                      <!-- ปุ่มติดต่อ -->
                      <div class="form-group col-4 d-flex align-items-center justify-content-start" :style="{ backgroundColor: '' }">
                        <div class="button rounded-3 me-5 bg-dark text-light fw-bold" :style="{}" @click="chat(this.student_id)">
                          ส่งข้อความ
                        </div>
                        <div v-if="(this.$cookies.get('account')) && this.$route.query.id != this.$cookies.get('account').account_id" class="button rounded-3 me-5 bg-warning text-dark fw-bold" :style="{}" @click="report()">
                            รายงาน
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
            </div>
        </div>

      <!-- รายงาน -->
      <div v-if="showReport" class="popup-overlay" style="width: 100%;">
        <div class="popup" style="width: 50%;">
          <div class="mb-2 text-center" style="font-size: 2vw;">ต้องการรายงานนักเรียนหรือไม่</div>

          <!-- ช่องใส่เหตุผล/คอมเมนต์ -->
          <div class="mb-3 text-center">
            <label for="reason" class="form-label" style="font-size: 1vw;">ระบุเหตุผล เพื่อให้แจ้งเตือนนักเรียน</label>
            <textarea v-model="reason" id="reason" class="form-control" style="font-size: 1vw;" rows="3" placeholder="กรอกเหตุผลที่นี่..."></textarea>
          </div>
          <template v-if="v$.reason.$error">
            <p class="text-danger m-0 p-0" style="font-size: 1em;" v-if="v$.reason.required.$invalid">
              กรุณากรอกเหตุผลของการรายงาน
            </p>
          </template>

          <div class="d-flex align-items-center justify-content-center mt-3">
            <div class="button rounded-3 me-5 bg-dark text-light fw-bold" @click="closePopup">
              ปิด
            </div>
            <div class="button rounded-3 me-5 bg-warning text-dark fw-bold" @click="submitReport">
              ยืนยัน
            </div>
          </div>
        </div>
      </div>

        

    </div>
</template>
  
  <script>
  import axios from "axios";
  import useVuelidate from "@vuelidate/core";
  import {
    required,
  } from "@vuelidate/validators";

  export default {
    name: "StudentInfoPage",
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    data() {
      return {
        student_id: this.$route.query.id,
        portrait_path: require('@/assets/user.png'), // เก็บ URL ภาพที่อัปโหลด
        previousRoutes: [],
        mainColor: "#BC2C2C",
        username: "",
        permission: "",
        email: "",
        phone: "",
        firstname: "",
        lastname: "",
        gender: "",
        error: "",
        showReport: false,
        reason: "",
        center: {
          "d-flex": true,
          "justify-content-center": true,
          "align-items-center": true,
        },
        red:{
          backgroundColor: 'red'
        }
      };
    },
    validations: {
      reason: {
      required: required,
    },
    },
    mounted() {
      this.initInfo()
    },
    methods: {
      initInfo() {
        const data = {
            student_id: this.student_id,
          };
        axios.post("http://localhost:3000/tutor/student/info", data)
          .then((res) => {
              this.username = res.data.student.username
              this.permission = res.data.student.permission
              this.email = res.data.student.email
              this.firstname = res.data.student.firstname
              this.lastname = res.data.student.lastname
              this.phone = res.data.student.phone
              this.gender = res.data.student.gender
              this.portrait_path = res.data.student.portrait_path
          })  
          .catch((err) => {
            alert(err.response.data.details.message);
          });   
    },
    report(){
      this.showReport = true; // เปิด popup
    },
    submitReport(){
      this.v$.$touch();
      if (!this.v$.$invalid) {
        const data = {
            account_id: this.$route.query.id,
            reporter_id: this.$cookies.get('account').account_id,
            message: this.reason
          };
        axios.post("http://localhost:3000/report", data)
              .then((res) => {
                alert(res.data.message); 
                this.closePopup()
                this.reason = ""
              })
              .catch((err) => {
                alert(err.response.data.message);
              });
      }
    },
    closePopup() {
      this.showReport = false;
      this.reason = "";
    },

      chat(receiver_id){
      this.$router.push({ name: 'ChatPage'});
      this.$cookies.set("sender_id", this.$cookies.get('account').account_id);
      this.$cookies.set("receiver_id", receiver_id);
    },
  
      back() {
        if (this.previousRoutes.length > 0) {
          const previousRoute = this.previousRoutes.pop();
          this.$router.push(previousRoute);
        } else {
          this.$router.go(-1);
        }
      },

    },
    watch: {
      $route(to, from) {
        this.previousRoutes.push(from); // เมื่อมีการเปลี่ยนเส้นทางใหม่ ให้เก็บเส้นทางก่อนหน้าลงในอาร์เรย์
      },
    },
    
  };
  </script>
  
<style>
img {
    object-fit: cover;
}
</style>