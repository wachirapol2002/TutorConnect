<template>
    <div id="app">
        <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
          <div class="fw-bold text-center" style="font-size: 5vh;">ประกาศ</div>
        </div>

        <div class="container-fluid rounded-4 border border-dark mt-0 p-0 d-flex flex-column justify-content-center align-items-center" :style="{ backgroundColor: 'white' }" style="width: 80vw; overflow: hidden;">
          <div class="row rounded-top border-bottom border-1 border-dark" :style="{ backgroundColor: '#D9D9D9' }" style="width: 100%; font-size: 1.5vw; ">  
            <div class="col-12">หมายเลขประกาศ 0001</div>
          </div>
            <div clas="container" style="width: 70%; font-size: 1.5vw;" :style="{ backgroundColor: '' }">
              <form name="Register">
                <!-- ผู้ลงประกาศ -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">ผู้ลงประกาศ</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">เรียนดี อยากเรียน</div>
                  </div>
                </div>
                <!-- วิชา -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วิชาที่ต้องการเรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">คณิตศาสตร์ มัธยมปลาย</div>
                  </div>
                </div>
                <!--สถานที่  -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">กำหนดสถานที่</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">ออนไลน์</div>
                  </div>
                </div>
                <!--อายุ  -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">ช่วงอายุของผู้เรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">มัธยมปลาย</div>
                  </div>
                </div>

                <!--วันที่สะดวก -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วันที่สะดวก</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">วันจันทร์-วันเสาร์</div>
                  </div>
                </div>
                
                <!--ช่วงเวลา -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">ช่วงเวลา</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">เย็น</div>
                  </div>
                </div>

                <!--รูปแบบการเรียน -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">รูปแบบการเรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">ตัวต่อตัว</div>
                  </div>
                </div>

                <!--เริ่มเรียนได้ -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วันที่เริ่มเรียนได้</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">ทันทีที่เจอติวเตอร์ที่ต้องการ</div>
                  </div>
                </div>

                 <!--เป้าหมาย -->
                 <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">เป้าหมายการเรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">เตรียมสอบ</div>
                  </div>
                </div>
                
                <!--เป้าหมาย -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วันที่ลงประกาศ</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">20/12/2567</div>
                  </div>
                </div>

                <!--ปุ่ม -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-10">
                  </div>
                  <div class="form-group col-2">
                    <div class="button rounded-3 text-light" :style="{backgroundColor: mainColor,}" @click="contact()">
                      ดูข้อมูลติดต่อ
                    </div>
                  </div>
                </div>
              </form>

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
    name: "StudentAnnouncePage",
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
      contact(){
        this.$router.push({ path: "/tutor/studentinfo" });
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