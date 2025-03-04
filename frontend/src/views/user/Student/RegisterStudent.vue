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
        <div :class="center" :style="{fontSize: '4vh',}">สมัครสมาชิก</div>
        <!-- form -->
        <form name="Register">
          <!-- Username -->
          <div class="row my-2">
            <div class="form-group col-12">
              <label class="form-label" for="username">Username*</label>
              <input
                class="form-control"
                :class="{ 'border-danger': v$.username.$error }"
                type="text"
                id="username"
                name="username"
                required
                placeholder="ชื่อผู้ใช้"
                maxlength="20"
                v-model="username"
              />
              <template v-if="v$.username.$error">
                <p class="text-danger m-0 p-0" v-if="v$.username.required.$invalid">
                  ต้องกรอก ชื่อผู้ใช้
                </p>
                <p class="text-danger m-0 p-0" v-if="v$.username.minLength.$invalid || v$.username.maxLength.$invalid">
                  ต้องการ 5-20 ตัวอักษร
                </p>
              </template>
            </div>
          </div>
          <div class="row my-2">
            <!-- Firstname -->
            <div class="form-group col-6">
              <label class="form-label" for="firstname">Firstname*</label>
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
                  ต้องกรอก ชื่อจริง
                </p>
              </template>
            </div>
            <!-- Lastname -->
            <div class="form-group col-6">
              <label class="form-label" for="lastname">Lastname*</label>
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
                  ต้องกรอก นามสกุล
                </p>
              </template>
            </div>
          </div>
          <!-- Gender -->
          <div class="row my-2">
            <div class="form-group col-12">
              <label class="form-label mb-2">Gender*</label>
              <div :class="center">
                <div class="btn-group col-12">
                  <button
                    type="button"
                    class="btn col-4"
                    :class="{'btn-dark': gender === 'ชาย', 'btn-outline-secondary': gender !== 'ชาย'}"
                    @click="gender = 'ชาย'"
                  >
                    <i class="bi bi-gender-male"></i>
                    ชาย
      
                  </button>
                  <button
                    type="button"
                    class="btn col-4"
                    :class="{'btn-dark': gender === 'หญิง', 'btn-outline-secondary': gender !== 'หญิง'}"
                    @click="gender = 'หญิง'"
                  >
                    <i class="bi bi-gender-female"></i>
                    หญิง
                  </button>
                  <button
                    type="button"
                    class="btn col-4"
                    :class="{'btn-dark': gender === 'ไม่ระบุ', 'btn-outline-secondary': gender !== 'ไม่ระบุ'}"
                    @click="gender = 'ไม่ระบุ'"
                  >
                    ไม่ระบุ
                  </button>
                </div>
              </div>
            </div>
          </div>
          <template v-if="v$.gender.$error">
                <p class="text-danger m-0 p-0" v-if="v$.gender.required.$invalid">
                  ต้องเลือก เพศ
                </p>
          </template>


          <div class="row my-2">
            <div class="form-group col-6">
              <label class="form-label" for="email">E-mail*</label>
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
                  ต้องกรอก อีเมล
                </p>
                <p class="text-danger m-0 p-0" v-if="v$.email.email.$invalid">
                  กรอกอีเมลไม่ถูกต้อง
                </p>
              </template>
            </div>
            <div class="form-group col-6">
              <label class="form-label" for="phone">Phone*</label>
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
                  ต้องกรอก หมายเลขโทรศัพท์
                </p>
                <p class="text-danger m-0 p-0" v-if="v$.phone.phone.$invalid">
                  หมายเลขโทรศัพท์ไม่ถูกต้อง
                </p>
              </template>
            </div>
          </div>
          <div class="row my-2">
            <div class="form-group col-12">
              <label class="form-label" for="password">Password*</label>
              <input
                class="form-control"
                :class="{ 'border-danger': v$.password.$error }"
                :type="showpassword ? 'text' : 'password'"
                id="password"
                required
                placeholder="รหัสผ่าน"
                maxlength="20"
                v-model="password"
              />
              <template v-if="v$.password.$error">
                <p class="text-danger m-0 p-0" v-if="v$.password.required.$invalid">
                  ต้องกรอก รหัสผ่าน
                </p>
                <p class="text-danger m-0 p-0" v-if="(v$.password.minLength.$invalid || v$.password.complex.$invalid) && !v$.password.required.$invalid">
                  ต้องประกอบด้วย A-Z, a-z, 0-9 และอย่างน้อย 8 ตัวอักษร
                </p>
              </template>
            </div>
          </div>
          <div class="row my-2">
            <div class="form-group col-12">
              <label class="form-label" for="confirmPassword">Confirm Password*</label>
              <input
                class="form-control"
                :class="{ 'border-danger': v$.confirmPassword.$error && this.password }"
                :type="showpassword ? 'text' : 'password'"
                id="confirmPassword"
                required
                placeholder="ยืนยันรหัสผ่าน"
                maxlength="20"
                v-model="confirmPassword"
              />
              <template v-if="v$.confirmPassword.$error && this.password">
                <p class="text-danger m-0 p-0" v-if="v$.confirmPassword.sameAs.$invalid ">
                  รหัสผ่านต้องเหมือนกัน
                </p>
              </template>
            </div>
          </div>
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


          <div class="form-group d-flex justify-content-center">
            <div class="button rounded-3 my-4 px4- mx-2 bg-dark text-light" :style="{backgroundColor: mainColor,}" @click="submit()">
              สมัครสมาชิก
            </div>
          </div>

          <div class="form-group" :class="center">
            <label :style="{fontSize: '3vh', color: 'black',}">มีบัญชีอยู่แล้ว</label>
            
            <router-link to="/login" style="text-decoration: none">
              <div class="register mx-2" :style="{fontSize: '3vh', color: 'black', fontWeight: 500}">เข้าสู่ระบบ</div>
            </router-link>
          </div>

                    
        </form>
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
    name: "RegisterStudentPage",
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
</style>