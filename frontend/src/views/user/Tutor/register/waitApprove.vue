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
      <div :class="center" :style="{fontSize: '4vh',}">รอยืนยันตัวตน</div>
      <!-- form -->
      <form name="Verify">
        <!-- file -->
  


        <div class="form-group d-flex justify-content-center">
          <div class="button rounded-3 my-4 px4- mx-2 text-light" :style="{backgroundColor: mainColor,}" @click="back()">
            ย้อนกลับ
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
  name: "TutorWaitPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      tutor_id: this.$cookies.get('account').tutor_id,
      documentPreview: null,
      selfiePreview: null,
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
    this.initPreview()
  },
  methods: {
    initPreview(){
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
      this.$router.push({ path: "/tutor/teaching/info" });
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