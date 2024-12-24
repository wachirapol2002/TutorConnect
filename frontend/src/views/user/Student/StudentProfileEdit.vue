<template>
    <div id="app">
        <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
        
      <!-- <br /> -->
          <div class="fw-bold text-center" style="font-size: 5vh;">แก้ไขข้อมูลส่วนตัว</div>
       
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
                        <div :class="center" style="height:12vw; width: 12  vw; background-color: white; border: 1px solid black; overflow: hidden;">     
                          <img v-if="imageUrl"
                            :src="imageUrl"
                            alt="Preview"
                            style="width: 100%; height: 100%; object-fit: cover;"
                            />
                        </div>
                          <label class="file-label">
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
                          </label>
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
                        <div class="mx-2">IamStudent</div>
                      </div>
                    </div>
                    <!-- ระดับบัญชี -->
                    <div class="row my-2">
                      <div class="form-group col-12 d-flex">
                        <label class="form-label fw-bold" for="permission">ระดับบัญชี:</label>
                        <div class="mx-2">นักเรียน</div>
                      </div>
                    </div>     
                    <!-- อีเมล -->
                    <div class="row my-2">
                      <div class="form-group col-8">
                        <label class="form-label fw-bold" for="email">อีเมล*</label>
                        <input
                          class="form-control"
                          :class="{ 'border-danger': v$.email.$error }"
                          type="email"
                          id="email"
                          required
                          placeholder="อีเมล"
                          maxlength="100"
                          v-model="email"
                        />
                        <template v-if="v$.email.$error">
                          <p class="text-danger m-0 p-0" v-if="v$.email.required.$invalid">
                            ต้องกรอกข้อมูลช่องนี้
                          </p>
                          <p class="text-danger m-0 p-0" v-if="v$.email.email.$invalid">
                            กรอกข้อมูลไม่ถูกต้อง
                          </p>
                        </template>
                      </div>
                    </div>
                    <div class="row my-2">
                      <!-- ชื่อจริง -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="firstname">ชื่อจริง*</label>
                        <input
                          class="form-control"
                          :class="{ 'border-danger': v$.firstname.$error }"
                          type="text"
                          id="firstname"
                          required
                          placeholder="ชื่อจริง"
                          maxlength="100"
                          v-model="firstname"
                        />
                        <template v-if="v$.firstname.$error">
                          <p class="text-danger m-0 p-0" v-if="v$.firstname.required.$invalid">
                            ต้องกรอกข้อมูลช่องนี้
                          </p>
                        </template>
                      </div>
                      <!-- นามสกุล -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="lastname">นามสกุล*</label>
                        <input
                          class="form-control"
                          :class="{ 'border-danger': v$.lastname.$error }"
                          type="text"
                          id="lastname"
                          required
                          placeholder="นามสกุล"
                          maxlength="100"
                          v-model="lastname"
                        />
                        <template v-if="v$.lastname.$error">
                          <p class="text-danger m-0 p-0" v-if="v$.lastname.required.$invalid">
                            ต้องกรอกข้อมูลช่องนี้
                          </p>
                        </template>
                      </div>
                    </div>
                    <div class="row my-2">
                      <!-- เบอร์ติดต่อ -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="phone">เบอร์ติดต่อ*</label>
                        <input
                          class="form-control"
                          :class="{ 'border-danger': v$.phone.$error }"
                          type="text"
                          id="phone"
                          required
                          placeholder="08xxxxxxxx"
                          maxlength="10"
                          v-model="phone"
                        />
                        <template v-if="v$.phone.$error">
                          <p class="text-danger m-0 p-0" v-if="v$.phone.required.$invalid">
                            ต้องกรอกข้อมูลช่องนี้
                          </p>
                          <p class="text-danger m-0 p-0" v-if="v$.phone.phone.$invalid">
                            กรอกข้อมูลไม่ถูกต้อง
                          </p>
                        </template>
                      </div>
                      <!-- เพศ -->
                      <div class="form-group col-2">
                        <label class="form-label fw-bold" for="gender">เพศ*</label>
                          <select v-model="selectedGender" class="form-control text-center">
                            <option value="" disabled>-ระบุเพศ-</option>
                            <option v-for="(gender, index) in genders" :key="index" :value="gender">
                              {{ gender }}
                            </option>
                          </select>
                      </div>
                      <!-- ปุ่ม -->
                      <div class="row my-2">
                        <div class="form-group col-8 ">
                        </div>
                        <div class="form-group col-4 ">
                          <div class="form-group d-flex align-items-center justify-content-start">
                            <div class="button rounded-3 bg-dark mx-3 text-light" :style="{}" @click="back()">
                              กลับ
                            </div>
                            <div class="button rounded-3 bg-dark mx-3 text-light" :style="{}" @click="submit()">
                              บันทึก
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
    name: "StudentProfileEditPage",
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    data() {
      return {
        imageUrl: require('@/assets/user.png'), // เก็บ URL ภาพที่อัปโหลด
        previousRoutes: [],
        mainColor: "#BC2C2C",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        firstname: "",
        lastname: "",
        genders: ["ชาย", "หญิง", "ไม่ระบุ"], // หมวดวิชาที่มีให้เลือก
        selectedGender: "", // หมวดวิชาที่เลือก
        gender: null,
        showpassword: false,
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
          this.v$.$touch();
   
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