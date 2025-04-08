<template>
  <div id="app">
    <div class="fw-bold text-center my-4">
      <div class="my-2" :class="center" :style="{fontSize: '2vw',}">เอกสารยืนยันตัวตน</div>
      <div class="step-container">
        <!-- <div
          v-for="step in totalSteps"
          :key="step"
          class="step"
          :class="{ active: step === currentStep }"
        >
          {{ step }}
        </div> -->
        <router-link to="" :class="center" style="text-decoration: none;">
          <div class="step active"> 1 </div>
        </router-link>
        <router-link to="" :class="center" style="text-decoration: none;">
          <div class="step"> 2 </div>
        </router-link>
        <router-link to="" :class="center" style="text-decoration: none;">
          <div class="step"> 3 </div>
        </router-link>
        <router-link to="" :class="center" style="text-decoration: none;">
          <div class="step"> 4 </div>
        </router-link>
      </div>
    </div>
    <div
      class="container-fluid rounded-4 px-5 py-4 border border-dark" :style="{backgroundColor: 'white'}"
      style="width: 50vw;"
    >
      
      <!-- form -->
      <form name="Verify">
        <!-- file -->
        <section class="container">
          <div class="content">
            <div class="file d-flex flex-column" :class="center">
              <!-- แสดงภาพตัวอย่าง -->
            <div class="my-3" :class="center" style="height:12vw; width: 20vw; background-color: white; border: 1px solid black; overflow: hidden;">     
              <img v-if="documentPreview"
                :src="documentPreview"
                alt="Preview"
                style="width: 100%; height: 100%; object-fit: cover;"
                />
            </div>
            <label class="label">สำเนา บัตรประชาชน/หนังสือเดินทาง</label>
   

              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  id="file"
                  ref="file"
                  accept="image/*"
                  @change="handleDocumentUpload"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="bi bi-upload"></i>
                  </span>
                  <span class="file-label"> เลือกรูปภาพ </span>
                </span>
              </label>
              <template v-if="v$.documentFile.$error">
              <p class="text-danger m-0 p-0" v-if="v$.documentFile.required.$invalid">
                ต้องใส่ เอกสารยืนยันตัวตน
              </p>
            </template>
            </div>
            <!-- แสดงข้อความ Error -->
            <p v-if="error" class="px-3 py-2 my-3 alert alert-danger">
              {{ error }}
            </p>
          </div>
        </section>




        <!-- selfieFile -->
        <section class="container">
          <div class="content">
            <div class="file d-flex flex-column" :class="center">
              <!-- แสดงภาพตัวอย่าง -->
            <div class="my-3" :class="center" style="height:12vw; width: 20vw; background-color: white; border: 1px solid black; overflow: hidden;">     
              <img v-if="selfiePreview"
                :src="selfiePreview"
                alt="Preview"
                style="width: 100%; height: 100%; object-fit: cover;"
                />
            </div>
            <label class="label">ภาพถ่ายใบหน้าพร้อมบัตรประชาชน</label>
   

              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  id="file"
                  ref="file"
                  accept="image/*"
                  @change="handleSelfieUpload"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="bi bi-upload"></i>
                  </span>
                  <span class="file-label"> เลือกรูปภาพ </span>
                </span>
              </label>
              <template v-if="v$.selfieFile.$error">
              <p class="text-danger m-0 p-0" v-if="v$.selfieFile.required.$invalid">
                ต้องใส่ รูปถ่ายยืนยันตัวตน
              </p>
            </template>
            </div>
            <!-- แสดงข้อความ Error -->
            <p v-if="error" class="px-3 py-2 my-3 alert alert-danger">
              {{ error }}
            </p>
          </div>
        </section>


        <div class="form-group d-flex justify-content-center">
          <div class="button rounded-3 my-4 px4- mx-2 text-light bg-dark" :style="{backgroundColor: mainColor,}" @click="submit()">
            บันทึกข้อมูล
          </div>
        </div>
                  
      </form>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import {
  requiredIf
} from "@vuelidate/validators";

export default {
  name: "verifyTutorPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      tutor_id: this.$cookies.get('account').tutor_id,
      currentStep: 1, // หน้าปัจจุบัน เริ่มที่ 1
      totalSteps: 4, // จำนวนหน้าทั้งหมด
      documentPreview: require('@/assets/IDcard.png'),
      selfiePreview: require('@/assets/selfie.png'),
      documentFile: null,
      selfieFile: null,
      previousRoutes: [],
      mainColor: "#BC2C2C",
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
      documentFile: {
        required: requiredIf(() => this.documentPreview === require('@/assets/IDcard.png')),
      },
      selfieFile: {
        required: requiredIf(() => this.selfiePreview === require('@/assets/selfie.png')),
      },
    }
  },
  mounted() {
    const account = this.$cookies.get('account');
      if (!account) {
        window.location.href = '/login';
      }
    this.initPreview()
  },
  methods: {
    initPreview(){
      console.log(this.$cookies.get('account').tutor_id)
      const data = {
            tutor_id: this.tutor_id
          };
        axios.post("http://localhost:3000/tutor/verify/path", data)
          .then((res) => {
            if (res.data.path.document_path) {
              this.documentPreview = 'http://localhost:3000' + res.data.path.document_path;
            } else {
              this.documentPreview = require('@/assets/IDcard.png'); // ถ้าไม่พบให้แสดงเป็นรูป default
            }

            if (res.data.path.selfie_path) {
              this.selfiePreview = 'http://localhost:3000' + res.data.path.selfie_path;
            } else {
              this.selfiePreview = require('@/assets/selfie.png'); // ถ้าไม่พบให้แสดงเป็นรูป default
            }
          })  
          .catch((err) => {
            alert(err.response.data.details.message);
          });   
    },
    handleDocumentUpload(event) {
      const file = event ? event.target.files[0] : this.$refs.file.files[0];
  
      this.error = null; // รีเซ็ตข้อความ Error
      if (file) {
        // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
        if (!file.type.startsWith("image/")) {
          this.error = "กรุณาอัปโหลดไฟล์รูปภาพที่ถูกต้อง.";
          this.documentPreview = null;
          return;
        }
        // อ่านไฟล์และสร้าง Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.documentPreview = e.target.result; // URL ของภาพ
          this.documentFile = file;
        };
        reader.readAsDataURL(file);
      }
      },
      handleSelfieUpload(event) {
      const file = event ? event.target.files[0] : this.$refs.file.files[0];
  
      this.error = null; // รีเซ็ตข้อความ Error
      if (file) {
        // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
        if (!file.type.startsWith("image/")) {
          this.error = "กรุณาอัปโหลดไฟล์รูปภาพที่ถูกต้อง.";
          this.selfiePreview = null;
          return;
        }
        // อ่านไฟล์และสร้าง Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selfiePreview = e.target.result; // URL ของภาพ
          this.selfieFile = file;
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
          formData.append("tutor_id", this.tutor_id);
          formData.append("document", this.documentFile);
          formData.append("selfie", this.selfieFile);
          axios.post("http://localhost:3000/tutor/verify/update", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {
              alert("บันทึกข้อมูลสำเร็จ");
              this.$router.push({ path: "/tutor/teacher/info" });
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
.step.actived {
  background-color: black; /* สีแดงเข้ม */
  color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

</style>