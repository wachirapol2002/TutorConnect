<template>
  <div id="app">
    <div class="fw-bold text-center my-4">
      <img
          :src="require('@/assets/logo.png')" class="my-3"
          style="max-height:10vh; width: auto; border-radius: 0%"
        />
      <div class="my-2 text-danger" :class="center" :style="{fontSize: '2vw',}">*จำเป็นต้องส่งเอกสารยืนยันตัวตน</div>
      
    </div>
    <div
      class="container-fluid rounded-4 px-5 py-4 border border-dark" :style="{backgroundColor: 'white'}"
      style="width: 50vw;"
    >
    
      <div :class="center" :style="{fontSize: '2vw',}">สมัครสอน</div>

      <!-- form -->
      <form name="Register">
        <!-- file -->
        <section class="container">
          
          <div class="content">
            <div class="file d-flex flex-column" :class="center">
              <!-- แสดงภาพตัวอย่าง -->
            <div class="my-3" :class="center" style="height:10vw; width: 10vw; background-color: white; border: 1px solid black; overflow: hidden;">     
              <img v-if="imageUrl"
                :src="imageUrl"
                alt="Preview"
                style="width: 100%; height: 100%; object-fit: cover;"
                />
            </div>
            <label class="label">Profile Picture</label>
   

              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  id="file"
                  ref="file"
                  accept="image/*"
                  @change="handleFileUpload"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="bi bi-upload"></i>
                  </span>
                  <span class="file-label"> เลือกรูปภาพ </span>
                </span>
              </label>
              <template v-if="v$.file.$error">
              <p class="text-danger m-0 p-0" v-if="v$.file.required.$invalid">
                ต้องใส่รูปภาพ
              </p>
            </template>
            </div>
            <!-- แสดงข้อความ Error -->
            <p v-if="error" class="px-3 py-2 my-3 alert alert-danger">
              {{ error }}
            </p>
          </div>
        </section>
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
          <!-- email -->
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
          <!-- phone -->
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

        <!-- password -->
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
            <label class="form-label" for="confirmPassword"
              >Confirm Password*</label
            >
            <input
              class="form-control"
              :class="{ 'border-danger': v$.confirmPassword.$error }"
              :type="showpassword ? 'text' : 'password'"
              id="confirmPassword"
              name="password"
              required
              placeholder="ยืนยันรหัสผ่าน"
              maxlength="20"
              v-model="confirmPassword"
            />
            <template v-if="v$.confirmPassword.$error">
              <p
                class="text-danger m-0 p-0"
                v-if="v$.confirmPassword.sameAs.$invalid"
              >
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
            สมัครติวเตอร์
          </div>
        </div>

        <div class="form-group" :class="center">
          <label :style="{fontSize: '1.5vw', color: 'black',}">มีบัญชีอยู่แล้ว</label>
          
          <router-link to="/login" style="text-decoration: none">
            <div class="register mx-2" :style="{fontSize: '1.5vw', color: 'black', fontWeight: 500}">เข้าสู่ระบบ</div>
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
  name: "RegisterTutorPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      imageUrl: null, // เก็บ URL ภาพที่อัปโหลด
      currentStep: 1,
      totalSteps: 4,
      previousRoutes: [],
      mainColor: "#BC2C2C",
      file: null,
      // username: "",
      // password: "",
      // confirmPassword: "",
      email: "",
      phone: "",
      firstname: "",
      lastname: "",
      username: "Tutor",
      // firstname: "Wachirapol",
      // lastname: "Klinkasorn",
      // email: "wachirapol2545@gmail.com",
      // phone: "0909209945",
      password: "Kami28062545",
      confirmPassword: "Kami28062545",
      
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
    return {
      file: {
        required: required,
      },
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
    handleFileUpload(event) {
      const file = event ? event.target.files[0] : this.$refs.file.files[0];
  
      this.error = null; // รีเซ็ตข้อความ Error
      if (file) {
        // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
        if (!file.type.startsWith("image/")) {
          this.error = "กรุณาอัปโหลดไฟล์รูปภาพที่ถูกต้อง.";
          this.imageUrl = null;
          return;
        }
        // อ่านไฟล์และสร้าง Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result; // URL ของภาพ
          this.file = file;
        };
        reader.readAsDataURL(file);
      }
      },
    submit() {
        // Validate all fields
        this.v$.$touch();
        // เช็คว่าในฟอร์มไม่มี error
        if (!this.v$.$invalid) {
          const formData = new FormData();
          formData.append("portrait", this.file);
          formData.append('username', this.username);
          formData.append('firstname', this.firstname);
          formData.append('lastname', this.lastname);
          formData.append('gender', this.gender);
          formData.append('email', this.email);
          formData.append('phone', this.phone);
          formData.append("password", this.password);
          formData.append("confirmPassword", this.confirmPassword);
          axios.post("http://localhost:3000/tutor/register", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
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
                tutor_id: res.data.tutor_id,
              };
              this.$cookies.set("account", account);
              alert("สมัครบัญชีติวเตอร์สำเร็จ");
              this.$router.push({ path: "/tutor/verify" });
              
            })
            .catch((error) => {
              console.error("Error during API request:", error);
              this.error = error.response
                ? error.response.data
                : "An error occurred.";
            });
        }
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
.step-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
}

/* ดีไซน์ตัวเลขของแต่ละขั้นตอน */
.step {
  width: 3vw;
  height: 3vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #777;
  transition: all 0.3s ease-in-out;
}

/* เมื่ออยู่ที่หน้าปัจจุบัน */
.step.active {
  background-color: #BC2C2C; /* สีแดงเข้ม */
  color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

</style>