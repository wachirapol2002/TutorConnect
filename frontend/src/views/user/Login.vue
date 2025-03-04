<template>
    <div id="app">
      <div class="fw-bold text-center my-4">
        <img
          :src="require('@/assets/logo.png')" class="my-3"
          style="max-height:10vh; width: auto; border-radius: 0%"
          
        />
        <!-- <br /> -->
        <!-- TutorConnect -->
         
      </div>
      <div
        class="container-fluid rounded-4 px-5 py-4 border border-dark" :style="{backgroundColor: 'white'}"
        style="width: 50vw;"
      >
        <div :class="center" :style="{fontSize: '4vh',}">เข้าสู่ระบบ</div>
        <!-- form -->
        <form name="login">
          <!-- Username -->
          <div class="row my-2">
            <div class="form-group col-12">
              <label class="form-label" for="username">Username</label>
              <input
                class="form-control"
                type="text"
                id="username"
                name="username"
                required
                placeholder="ชื่อผู้ใช้"
                maxlength="20"
                v-model="username"
              />
            </div>
          </div>
          <!-- Password -->
          <div class="row my-2">
            <div class="form-group col-12">
              <label class="form-label" for="password">Password</label>
              <input
                class="form-control"
                :type="showpassword ? 'text' : 'password'"
                id="password"
                required
                placeholder="รหัสผ่าน"
                maxlength="20"
                v-model="password"
              />
            </div>
          </div>
          <!-- showpassword -->
          <div class="form-group form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="check"
              v-model="showpassword"
            />
            <label
              class="form-check-label"
              style="font-size: 17px"
              for="showpass"
              >Show Password</label
            >
          </div>
          <p v-if="error" class="px-3 py-2 mb-3 alert alert-danger">
            {{ error }}
          </p>
          <div class="form-group d-flex justify-content-center">
            <div class="button rounded-3 my-4 px4- mx-2 bg-dark text-light" @click="login()">
              เข้าสู่ระบบ
            </div>
          </div>

          <div class="form-group" :class="center">
            <label :style="{fontSize: '3vh', color: 'black',}">ยังไม่มีบัญชี</label>
            
            <router-link to="/student/register" style="text-decoration: none">
              <div class="register mx-2" :style="{fontSize: '3vh', color: 'black', fontWeight: 500}">สมัครสมาชิก</div>
            </router-link>
          </div>

                    
        </form>
      </div>

    </div>
</template>
  
  <script>
  import axios from "axios";
  import useVuelidate from "@vuelidate/core";
  import { required } from "@vuelidate/validators";
  // @ is an alias to /src
  export default {
    name: "LoginPage",
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
      username: {required: required},
      password: {required: required},
    },
    mounted() {
    },
    methods: {
      login() {
        this.v$.$touch();
        if (!this.v$.$invalid) {
          const data = {
            username: this.username,
            password: this.password,
          };
          axios.post("http://localhost:3000/user/login/", data)
            .then((res) => {
              const account = {
                account_id:res.data.account.account_id,
                portrait_path: res.data.account.portrait_path,
                username: res.data.account.username,
                permission: res.data.account.permission,
                firstname: res.data.account.firstname,
                lastname: res.data.account.lastname,
                gender: res.data.account.gender,
                email: res.data.account.email,
                phone: res.data.account.phone,
                tutor_id: res.data.tutor_id
              };
              console.log(res.data)
              this.$cookies.set("account", account);
              alert("เข้าสู่ระบบสำเร็จ");
              if(this.$cookies.get("account").permission == 'ติวเตอร์'){
                
                axios.post("http://localhost:3000/tutor/teacher/info/byAccount", {account_id: this.$cookies.get("account").account_id,})
                .then((res) => {
                  const profile_status = res.data.tutor.profile_status
                  console.log(profile_status)
                  if(profile_status === 'สมัครติวเตอร์'){
                    this.$router.push({ path: "/tutor/verify" });
                  }else if(profile_status === 'รอตรวจสอบ'){
                    this.$router.push({ path: "/tutor/wait" });
                  }else if(profile_status === 'พร้อมสอน'){
                    this.$router.push({ path: "/teacher/profile" });
                  }
                })
                .catch((error) => {
                    this.error = error.response.data.message;
                });
              }else{
                this.$router.push({ path: "/" });
              }
              
            })
            .catch((error) => {
              this.error = error.response.data.message;
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
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #D9D9D9; /* กรอบ */
    width: auto; /* ขนาดกล่อง */
    height: auto;
    text-align: center;
    transition: transform 0.2s;
    color: white;
  }
  .button:hover {
    transform: scale(1.05);
  }
  .register:hover{
    text-decoration: underline;
  }
  .text-danger {
    color: red;
  }
</style>
  