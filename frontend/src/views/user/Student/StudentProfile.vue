<template>
    <div id="app">
        <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
        
      <!-- <br /> -->
          <div class="fw-bold text-center" style="font-size: 5vh;">ข้อมูลส่วนตัว</div>
       
        </div>
        
        <div class="container-fluid rounded-4  border border-dark p-3 py-4" :style="{ backgroundColor: 'white' }" style="width: 80vw;">
            <!-- ข้อมูส่วนตัว -->
            <div class="row" :style="{ backgroundColor: '' }">
                <div class="col-3" style="" :style="{ backgroundColor: '' }">
                <!-- รูปโปรไฟล์ -->
                    <section class="container mt-4">
                      <div class="content">
                        <div class="file d-flex flex-column justify-content-center align-items-end">
                          <!-- แสดงภาพตัวอย่าง -->
                        <div :class="center" style="height:12vw; width: 12vw; background-color: white; border: 1px solid black; overflow: hidden;">     
                          <img v-if="imageUrl"
                            :src="imageUrl"
                            alt="Preview"
                            style="width: 100%; height: 100%; object-fit: cover;"
                            />
                        </div>
                          <!-- <label class="file-label">
                            <input
                              class="file-input"
                              type="file"
                              id="file"
                              ref="file"
                              accept="image/*"
                              @change="handleFileUpload"
                            />
                            <span class="file-cta mt-2 fw-bold text-center" style="font-size: 1.7vh;">
                              <span class="file-label"> เปลี่ยนรูปภาพ</span>
                            </span>
                          </label> -->
                        </div>
                        <!-- แสดงข้อความ Error -->
                        <p v-if="error" class="px-3 py-2 my-3 alert alert-danger">
                          {{ error }}
                        </p>
                      </div>
                    </section>
                </div>
                <div class="col-9" :style="{ backgroundColor: '' }">
                  <section class="container mt-4" style="font-size: 3vh;">
                    <!-- ชื่อผู้ใช้งาน -->
                    <div class="row my-2">
                      <div class="form-group col-12 d-flex">
                        <label class="form-label fw-bold" for="username">ชื่อผู้ใช้งาน:</label>
                        <div class="mx-2">{{ username }}</div>
                      </div>
                    </div>
                    <!-- ระดับบัญชี -->
                    <div class="row my-2">
                      <div class="form-group col-12 d-flex">
                        <label class="form-label fw-bold" for="permission">ระดับบัญชี:</label>
                        <div class="mx-2">{{ permission }}</div>
                      </div>
                    </div>     
                    <!-- อีเมล -->
                    <div class="row my-2">
                      <div class="form-group col-8">
                        <label class="form-label fw-bold" for="email">อีเมล</label>
                        <div class="mx-2">{{ email }}</div>
                      </div>
                    </div>
                    <div class="row my-2">
                      <!-- ชื่อจริง -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="firstname">ชื่อจริง</label>
                        <div class="mx-2">{{ firstname }}</div>
                      </div>
                      <!-- นามสกุล -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="lastname">นามสกุล</label>
                        <div class="mx-2">{{ lastname }}</div>
                      </div>
                    </div>
                    <div class="row my-2">
                      <!-- เบอร์ติดต่อ -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="phone">เบอร์ติดต่อ</label>
                        <div class="mx-2">{{ phone }}</div>
                      </div>
                      <!-- เพศ -->
                      <div class="form-group col-2">
                        <label class="form-label fw-bold" for="gender">เพศ</label>
                        <div class="mx-2">{{ gender }}</div>
                      </div>
                      <!-- ปุ่ม -->
                      <div class="row my-2">
                        <div class="form-group col-8 ">
                        </div>
                        <div class="form-group col-4 ">
                          <div class="form-group d-flex align-items-center justify-content-start">
                            <div class="button rounded-3 bg-dark mx-3 text-light" :style="{}" @click="submit()">
                              แก้ไข
                            </div>
                          </div>
                        </div>
                       
                      </div>

                      
                    </div>
                  </section>
                </div>
            </div>
        </div>

        

    </div>
</template>
  
  <script>
  // import axios from "axios";
  import useVuelidate from "@vuelidate/core";
  import {
    required,
    email,
    minLength,
    maxLength,
    sameAs,
    helpers,
  } from "@vuelidate/validators";


    function phone(value) {
    return !helpers.req(value) || !!value.match(/0[0-9]{9}/);
  }

  function complexPassword(value) {
    if (value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/)) {
      return true;
    }
    return false;
  }

  export default {
    name: "StudentProfilePage",
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    data() {
      return {
        imageUrl: this.$cookies.get("account").portrait_path ? 'http://localhost:3000' + this.$cookies.get("account").portrait_path : require('@/assets/user.png'),
        previousRoutes: [],
        mainColor: "#BC2C2C",
        username: this.$cookies.get("account").username,
        permission: this.$cookies.get("account").permission,
        email: this.$cookies.get("account").email,
        firstname: this.$cookies.get("account").firstname,
        lastname: this.$cookies.get("account").lastname,
        phone: this.$cookies.get("account").phone,
        gender: this.$cookies.get("account").gender,
        genders: ["ชาย", "หญิง", "ไม่ระบุ"], 
        selectedGender: "", 
        error: "",
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
      username: {
        required: required,
        minLength: minLength(5),
        maxLength: maxLength(20),
      },
      firstname: {
        required: required,
      },
      lastname: {
        required: required,
      },
      email: {
        required: required,
        email: email,
      },
      phone: {
        required: required,
        phone: phone,
      },
      password: {
        required: required,
        minLength: minLength(8),
        complex: complexPassword,
      },
      confirmPassword: {
        sameAs: sameAs("password"),
      },
  },
    mounted() {

    },
    methods: {
      handleFileUpload(event) {
      const file = event.target.files[0]; // ไฟล์ที่ผู้ใช้อัปโหลด
      this.error = null;
      if (file) {
        // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
        if (!file.type.startsWith("image/")) {
          this.error = "Please upload a valid image file.";
          this.imageUrl = null;
          return;
        }
        // อ่านไฟล์และสร้าง Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result; // URL ของภาพ
        };
        reader.readAsDataURL(file);
      }
      },

  
      submit() {
        // // Validate all fields
          // this.v$.$touch();
          this.$router.push({ path: "/student/profile/edit" });
   
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