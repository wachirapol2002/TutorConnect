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
      <div :class="center" :style="{fontSize: '4vh',}">ข้อมูลผู้สอน</div>
      <!-- form -->
      <form name="Information">
        <!-- name -->
        <div class="row my-2">
          <div class="form-group col-12">
            <label class="form-label" for="tutorName">ชื่อติวเตอร์*</label>
            <input
              class="form-control"
              :class="{ 'border-danger': v$.tutorName.$error }"
              type="text"
              id="tutorName"
              name="tutorName"
              required
              placeholder="ชื่อที่แสดงให้นักเรียนเห็น"
              maxlength="20"
              v-model="tutorName"
            />
            <template v-if="v$.tutorName.$error">
              <p class="text-danger m-0 p-0" v-if="v$.tutorName.required.$invalid">
                ต้องกรอกข้อมูลช่องนี้
              </p>
            </template>
          </div>
        </div>

        <div class="row my-2">
          <!-- facebook -->
          <div class="form-group col-6">
            <label class="form-label" for="facebook">Facebook</label>
            <input
              class="form-control"
              type="facebook"
              id="facebook"
              required
              placeholder="Link Facebook"
              maxlength="255"
              v-model="facebook"
            />
          </div>
           <!-- line -->
          <div class="form-group col-6">
            <label class="form-label" for="line">Line</label>
            <input
              class="form-control"
              type="text"
              id="line"
              required
              placeholder="Line ID"
              maxlength="30"
              v-model="line"
            />
          </div>
        </div>

        
        <!-- Introduce -->
        <div class="row my-2">
          <div class="form-group col-12">
            <label class="form-label" for="introduce">ข้อความแนะนำตัว*</label>
            <textarea
              class="form-control"
              :class="{ 'border-danger': v$.introduce.$error }"
              type="text"
              id="introduce"
              name="introduce"
              required
              placeholder="แนะนำตัวให้นักเรียนสนใจ"
              maxlength="255"
              v-model="introduce"
              style="height: 10vh;"
            >
            </textarea>
            <template v-if="v$.introduce.$error">
              <p class="text-danger m-0 p-0" v-if="v$.introduce.required.$invalid">
                ต้องกรอกข้อมูลช่องนี้
              </p>
            </template>
          </div>
        </div>
        <!-- describe -->
        <div class="row my-2">
          <div class="form-group col-12">
            <label class="form-label" for="describe">ประสบการณ์สอน และ ความน่าสนใจ*</label>
            <textarea
              class="form-control"
              :class="{ 'border-danger': v$.describe.$error }"
              type="text"
              id="describe"
              name="describe"
              required
              placeholder="เขียนบรรยายประสบการณ์สอน"
              v-model="describe"
              style="height: 30vh;"
            >
            </textarea>
            <template v-if="v$.describe.$error">
              <p class="text-danger m-0 p-0" v-if="v$.describe.required.$invalid">
                ต้องกรอกข้อมูลช่องนี้
              </p>
            </template>
          </div>
        </div>

        <!-- ประวัติการศึกษา -->
        <div class="row my-2 ">
          <label class="form-label" for="academy">ประวัติการศึกษา</label>
            <div class="form-group col-9 mx-0">
              <input
                v-model="academy"
                type="text"
                placeholder="ประวัติการศึกษา"
                class="form-control"
              />
            </div>
            <!-- ปุ่มเพิ่มประวัติ -->
            <div class="form-group col-3 mx-0">
              <button type="button" @click="addAcademy" class="btn btn-secondary ">เพิ่มประวัติ</button>
            </div>
            <!-- แสดงรายการการศึกษา -->
            <ul v-if="academys.length" class="m-1 border-bottom border-2 mb-4">
              <li
                v-for="(academy, index) in academys"
                :key="index"
                class="d-flex justify-content-between align-items-center my-2"
              >
                <span>
                  - {{ academy.name }}
                </span>
                <button type="button" @click="removeAcademy(index)" class="btn btn-danger btn-sm">ลบ</button>
              </li>
            </ul>
        </div>


        <div class="form-group d-flex justify-content-center">
          <div class="button rounded-3 my-4 px4- mx-2" :style="{backgroundColor: mainColor,}" @click="submit()">
            สมัครติวเตอร์
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
// import axios from "axios";
import useVuelidate from "@vuelidate/core";
import {
  required,
} from "@vuelidate/validators";
import "leaflet/dist/leaflet.css";

export default {
  name: "TeacherInfoPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      imageUrl: null, // เก็บ URL ภาพที่อัปโหลด
      previousRoutes: [],
      mainColor: "#BC2C2C",
      tutorName: "",
      facebook: "",
      line: "",
      introduce: "",
      describe: "",
      academy: "",
      academys: [],
      map: null,       // เก็บอ็อบเจกต์แผนที่
      marker: null,    // เก็บตำแหน่ง Marker
      placeName: "", 
      placePosition: "", 
      place: "",       // เก็บค่าพิกัดที่เลือก
      places: [],
      categories: ["คณิตศาสตร์", "วิทยาศาสตร์", "ภาษาอังกฤษ"], // หมวดวิชาที่มีให้เลือก
      selectedCategory: "", // หมวดวิชาที่เลือก
      subjectName: "", // ชื่อวิชาที่กรอก
      subjects: [], // Array เก็บวิชาที่เพิ่ม
      topicName: "",
      topicPrice: "",
      topics: [],
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
      tutorName: {
        required: required,
      },
      introduce: {
        required: required,
      },
      describe: {
        required: required,
      },
    }
},
  mounted() {
    this.initMap(); // เรียกใช้ฟังก์ชันสร้างแผนที่
  },
  methods: {
    addAcademy() {
      if (this.academy) {
        // เพิ่มวิชาใหม่เข้าไปใน Array
        this.academys.push({
          name: this.academy,
        });
        // เคลียร์ฟิลด์หลังจากเพิ่มข้อมูล
        this.academy = "";
      } else {
        alert("กรุณากรอกประวัติการศึกษาก่อน");
      }
    },
    removeAcademy(index) {
      this.academys.splice(index, 1); // ลบข้อมูลที่ตำแหน่ง index
    },
    addPlace() {
      if (this.placeName) {
        // เพิ่มวิชาใหม่เข้าไปใน Array
        if (this.placePosition == "") {
          this.places.push({
            position: "สอนออนไลน์",
            name: this.placeName,
          });
        }else{
          this.places.push({
          position: this.placePosition,
          name: this.placeName,
        });
        }
        // เคลียร์ฟิลด์หลังจากเพิ่มข้อมูล
        this.placePosition = "";
        this.placeName = "";
      } else {
        alert("กรุณาระบุสถานที่สอนก่อน");
      }
    },
    removePlace(index) {
      this.places.splice(index, 1); // ลบข้อมูลที่ตำแหน่ง index
    },
    addSubject() {
      if (this.selectedCategory && this.subjectName) {
        // เพิ่มวิชาใหม่เข้าไปใน Array
        this.subjects.push({
          category: this.selectedCategory,
          name: this.subjectName,
        });
        // เคลียร์ฟิลด์หลังจากเพิ่มข้อมูล
        this.selectedCategory = "";
        this.subjectName = "";
      } else {
        alert("กรุณาเลือกหมวดวิชาและกรอกชื่อวิชาให้ครบถ้วน");
      }
    },
    removeSubject(index) {
      this.subjects.splice(index, 1); // ลบข้อมูลที่ตำแหน่ง index
    },
    addTopic() {
      if (this.topicName && this.topicPrice) {
        // เพิ่มวิชาใหม่เข้าไปใน Array
        this.topics.push({
          name: this.topicName,
          price: this.topicPrice,
        });
        // เคลียร์ฟิลด์หลังจากเพิ่มข้อมูล
        this.topicName = "";
        this.topicPrice = "";
      } else {
        alert("กรุณากรอกหัวข้อการสอนและกำหนดราคาให้ครบถ้วน");
      }
    },
    removeTopic(index) {
      this.topics.splice(index, 1); // ลบข้อมูลที่ตำแหน่ง index
    },

    submit() {
      // // Validate all fields
        this.v$.$touch();

        this.$router.push({ path: "/tutor/teaching/info" });
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
#map {
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>