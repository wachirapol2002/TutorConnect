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
        <div :class="center" :style="{fontSize: '2vw',}">สำหรับนักเรียน</div>
        <!-- policy List -->
        <ul class="policy-list" style="font-size: 1.2vw; margin-top: 1rem;">
        <li>1. ไม่แชร์ข้อมูลส่วนตัวที่ละเอียดกับผู้อื่น เช่น รหัสผ่าน หรือข้อมูลทางการเงิน</li>
        <li>2. ระมัดระวังในการนัดหมาย ควรเลือกสถานที่ที่ปลอดภัยและเป็นทางการ</li>
        <li>3. รักษาเวลาในการเรียน หากไม่สามารถเรียนได้ควรแจ้งผู้สอนไปล่วงหน้า</li>
        <li>4. ห้ามคัดลอกหรือเผยแพร่เนื้อหาการเรียนที่ได้รับจากผู้สอนโดยไม่ได้รับอนุญาต</li>
        <li>5. ให้การประเมินการสอนที่ตรงไปตรงมาช่วยให้ผู้สอนพัฒนาต่อไป</li>
        <li>6. เคารพสิทธิของผู้สอนและไม่ขอข้อมูลที่ไม่เกี่ยวข้องจากผู้สอน</li>
        <li>7. ควรเลือกผู้สอนที่มีคุณสมบัติตรงกับความต้องการของคุณ</li>
        <li>8. ห้ามมีพฤติกรรมที่ทำให้ผู้อื่นรู้สึกไม่ปลอดภัย เช่น การคุกคามหรือพูดจาหยาบคาย</li>
        <li>9. ปฏิบัติตามกฎระเบียบและเงื่อนไขการใช้งานของเว็บไซต์อย่างเคร่งครัด</li>
        <li>10. หากพบเห็นผู้สอนทำพฤติกรรมไม่เหมาะสม ควรรายงานให้กับผู้ดูแลระบบทันที</li>
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
    name: "StudentPolicyPage",
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