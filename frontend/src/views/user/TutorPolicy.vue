<template>
  <div id="app">
    <div class="fw-bold text-center my-4">
      <img
        :src="require('@/assets/logo.png')" class="my-0"
        style="max-height:10vh; width: auto; border-radius: 0%"
        
      />
    </div>
    <div
      class="container-fluid rounded-4 px-5 py-4 border border-dark" :style="{backgroundColor: 'white'}"
      style="width: 50vw;"
    >
      <div :class="center" :style="{fontSize: '2vw',}">นโยบายการใช้งาน</div>
      <div :class="center" :style="{fontSize: '2vw',}">สำหรับผู้สอน</div>
      <!-- policy List -->
      <ul class="policy-list" style="font-size: 1.2vw; margin-top: 1rem;">
      <li>1. ไม่ขอข้อมูลส่วนตัวของผู้เรียน เช่น รหัสผ่าน หรือข้อมูลทางการเงิน</li>
      <li>2. ให้การสอนอย่างมีคุณภาพและพร้อมที่จะช่วยเหลือผู้เรียน</li>
      <li>3. เคารพความเป็นส่วนตัวของผู้เรียน ไม่ควรขอข้อมูลส่วนตัวที่ไม่เกี่ยวข้อง</li>
      <li>4. ควรปฏิบัติตามมาตรฐานทางจริยธรรมในการสอนและไม่ขอให้ผู้เรียนทำกิจกรรมที่ไม่เหมาะสม</li>
      <li>5. แจ้งผู้เรียนล่วงหน้าหากไม่สามารถสอนตามกำหนดการได้</li>
      <li>6. ห้ามมีพฤติกรรมไม่เหมาะสม เช่น การนัดหมายในที่ลับหรือนอกสถานที่</li>
      <li>7. ให้คำแนะนำและคำปรึกษาในการพัฒนาทักษะของผู้เรียนอย่างเป็นธรรมและสร้างสรรค์</li>
      <li>8. รับฟังความคิดเห็นและข้อเสนอแนะจากผู้เรียนเพื่อพัฒนาการสอน</li>
      <li>9. รักษาความลับของข้อมูลผู้เรียนอย่างเคร่งครัด</li>
      <li>10. หากพบการกระทำผิดหรือพฤติกรรมไม่เหมาะสมจากผู้เรียน ควรรายงานให้กับผู้ดูแลระบบ</li>
    </ul>
      
    </div>

  </div>
</template>
  
  <script>
  import axios from "axios";
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
    name: "TutorPolicyPage",
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    data() {
      return {
        previousRoutes: [],
        mainColor: "#BC2C2C",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        firstname: "",
        lastname: "",
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
    validations() {
      return{
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
        gender: {
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
          sameAs: sameAs(this.password),
        },
      }
    },
    mounted() {
    },
    methods: {
      submit() {
        // Validate all fields
        this.v$.$touch();
        // เช็คว่าในฟอร์มไม่มี error
        if (!this.v$.$invalid) {
          const data = {
            username: this.username,
            firstname: this.firstname,
            lastname: this.lastname,
            gender: this.gender,
            email: this.email,
            phone: this.phone,
            password: this.password,
            confirmPassword: this.confirmPassword,
          };
          axios
            .post("http://localhost:3000/student/register", data)
            .then(() => {
              this.$router.push({ path: "/login" });
              alert("สมัครสมาชิกสำเร็จ");
            })
            .catch((err) => {
              alert(err.response.data.details.message);
              console.log(err)
            });
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
.policy-list {
  list-style-type: none;
  padding-left: 0;
}

.policy-list li {
  margin: 1rem 0;
  line-height: 1.5;
}
</style>