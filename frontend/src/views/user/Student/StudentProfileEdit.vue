<template>
    <div id="app">
        <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
        
      <!-- <br /> -->
          <div class="fw-bold text-center" style="font-size: 2.5vw;">แก้ไขข้อมูลส่วนตัว</div>
       
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
                          <label class="file-label">
                            <input
                              class="file-input"
                              type="file"
                              id="file"
                              name="file"
                              ref="file"
                              accept="image/*"
                              @change="handleFileUpload"
                            />
                            <span class="file-cta mt-2 fw-bold text-center" style="font-size: 1vw;">
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
                  <section class="container mt-4" style="font-size: 1.5vw;">
                    <!-- ชื่อผู้ใช้งาน -->
                    <div class="row my-2">
                      <div class="form-group col-12 d-flex">
                        <label class="form-label fw-bold" for="username">ชื่อผู้ใช้งาน:</label>
                        <div class="mx-2" >{{ username }}</div>
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
                        <label class="form-label fw-bold" for="email">อีเมล*</label>
                        <input style="font-size: 1.5vw;"
                          class="form-control p-0 px-2"
                          :class="{ 'border-danger': v$.email.$error }"
                          type="email"
                          id="email"
                          required
                          placeholder="อีเมล"
                          maxlength="100"
                          v-model="email"
                        />
                        <template  v-if="v$.email.$error">
                          <div style="font-size: 1.25vw;">
                            <p class="text-danger m-0 p-0" v-if="v$.email.required.$invalid">
                              ต้องกรอก อีเมล
                            </p>
                            <p class="text-danger m-0 p-0" v-if="v$.email.email.$invalid">
                              กรอกอีเมลไม่ถูกต้อง
                            </p>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="row my-2">
                      <!-- ชื่อจริง -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="firstname">ชื่อจริง*</label>
                        <input style="font-size: 1.5vw;"
                          class="form-control p-0 px-2"
                          :class="{ 'border-danger': v$.firstname.$error }"
                          type="text"
                          id="firstname"
                          required
                          placeholder="ชื่อจริง"
                          maxlength="100"
                          v-model="firstname"
                        />
                        <template v-if="v$.firstname.$error">
                          <div style="font-size: 1.25vw;">
                            <p class="text-danger m-0 p-0" v-if="v$.firstname.required.$invalid">
                              ต้องกรอก ชื่อจริง
                            </p>
                          </div>
                        </template>
                      </div>
                      <!-- นามสกุล -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="lastname">นามสกุล*</label>
                        <input style="font-size: 1.5vw;"
                          class="form-control p-0 px-2"
                          :class="{ 'border-danger': v$.lastname.$error }"
                          type="text"
                          id="lastname"
                          required
                          placeholder="นามสกุล"
                          maxlength="100"
                          v-model="lastname"
                        />
                        <template v-if="v$.lastname.$error">
                          <div style="font-size: 1.25vw;">
                            <p class="text-danger m-0 p-0" v-if="v$.lastname.required.$invalid">
                              ต้องกรอก นามสกุล
                            </p>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="row my-2">
                      <!-- เบอร์ติดต่อ -->
                      <div class="form-group col-4">
                        <label class="form-label fw-bold" for="phone">เบอร์ติดต่อ*</label>
                        <input style="font-size: 1.5vw;"
                          class="form-control p-0 px-2"
                          :class="{ 'border-danger': v$.phone.$error }"
                          type="text"
                          id="phone"
                          required
                          placeholder="08xxxxxxxx"
                          maxlength="10"
                          v-model="phone"
                        />
                        <template v-if="v$.phone.$error">
                          <div style="font-size: 1.25vw;">
                            <p class="text-danger m-0 p-0" v-if="v$.phone.required.$invalid">
                              ต้องกรอก หมายเลขโทรศัพท์
                            </p>
                            <p class="text-danger m-0 p-0" v-if="v$.phone.phone.$invalid">
                              หมายเลขโทรศัพท์ไม่ถูกต้อง
                            </p>
                          </div>
                        </template>
                      </div>
                      <!-- เพศ -->
                      <div class="form-group col-2">
                        <label class="form-label fw-bold" for="gender">เพศ*</label>
                          <select v-model="gender" class="form-control text-center p-0 px-2" style="font-size: 1.5vw; width: auto;">
                            <option value="" disabled>ระบุเพศ</option>
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
                            <div class="button rounded-3 bg-dark mx-3 text-light" :style="{}" @click="update()">
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
  import axios from "axios";
  import useVuelidate from "@vuelidate/core";
  import {
    required,
    email,
    minLength,
    maxLength,
    helpers,
  } from "@vuelidate/validators";


    function phone(value) {
    return !helpers.req(value) || !!value.match(/0[0-9]{9}/);
  }

  export default {
    name: "StudentProfileEditPage",
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    data() {
      return {
        imageUrl: this.$cookies.get("account").portrait_path ? 'http://localhost:3000' + this.$cookies.get("account").portrait_path : require('@/assets/user.png'),
        previousRoutes: [],
        mainColor: "#BC2C2C",
        file: null,
        portrait_path: this.$cookies.get("account").portrait_path,
        username: this.$cookies.get("account").username,
        permission: this.$cookies.get("account").permission,
        email: this.$cookies.get("account").email,
        firstname: this.$cookies.get("account").firstname,
        lastname: this.$cookies.get("account").lastname,
        phone: this.$cookies.get("account").phone,
        gender: this.$cookies.get("account").gender,
        genders: ["ชาย", "หญิง", "ไม่ระบุ"], 
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
  },
    mounted() {
      const account = this.$cookies.get('account');
      if (!account) {
        window.location.href = '/login';
      }

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

      update() {
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
          axios.post('http://localhost:3000/user/edit', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
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
              };
              this.$cookies.set("account", account);
              this.$router.push({ path: "/student/profile" });
              alert("อัพเดทข้อมูลสำเร็จ");
            })
            .catch((err) => {
              alert(err.response.data.details);
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
img {
    object-fit: cover;
}
</style>