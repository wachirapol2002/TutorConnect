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
      <div :class="center" :style="{fontSize: '4vh',}">ข้อมูลการสอน</div>
      <!-- form -->
      <form name="Information">
        <!-- Introduce -->
        <div class="row my-2">
          <div class="form-group col-12">
            <label class="form-label" for="introduce">ข้อความแนะนำตัว</label>
            <textarea
              class="form-control"
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
            <label class="form-label" for="describe">ประสบการณ์สอน และ ความน่าสนใจ</label>
            <textarea
              class="form-control"
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

        <!-- สถานทีสอน -->
         <!-- Leaflet Map -->
         <label class="form-label" for="place">สถานที่สอน</label>
         <div id="map" style="height: 40vh; width: 100%;"></div>
        <div class="row my-4">
          <!-- พิกัดสถานที่ -->
            <div class="form-group col-6 mx-0">
              <input
                v-model="placePosition"
                type="text"
                placeholder="คลิกบนแผนที่เพื่อเลือก (ออนไลน์ไม่ต้องเลือก)"
                class="form-control"
                readonly
              />
            </div>
            <!--ชื่อสถานที่ -->
            <div class="form-group col-3 mx-0 px-0">
              <input
                v-model="placeName"
                type="text"
                placeholder="ระบุชื่อสถานที่"
                class="form-control"
              />
            </div>
            <!-- ปุ่มเพิ่มสถานที่ -->
            <div class="form-group col-3 mx-0">
              <button type="button" @click="addPlace" class="btn btn-secondary ">เพิ่มสถานที</button>
            </div>
        </div>
        <div class="row my-4">
          <!-- แสดงรายการสถานที่ -->
          <ul v-if="places.length" class="m-1 border-bottom border-2 mb-4">
            <li
              v-for="(place, index) in places"
              :key="index"
              class="d-flex justify-content-between align-items-center my-2"
            >
              <div class="col-5">
                - {{ place.name }}
              </div>
              <div class="col-6">
                {{ place.position }}
              </div>
              <button type="button" @click="removePlace(index)" class="btn btn-danger btn-sm">ลบ</button>
            </li>
          </ul>
        </div>


        <!-- วิชาที่ต้องการสอน -->
        <div class="row my-2">
          <label class="form-label" for="subject">วิชาที่ต้องการสอน</label>
          <!-- เลือกหมวดวิชา -->
            <div class="form-group col-3 mx-0">
              <select v-model="selectedCategory" class="form-control">
                <option value="" disabled>-เลือกหมวดวิชา-</option>
                <option v-for="(category, index) in categories" :key="index" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <!-- กรอกชื่อวิชา -->
            <div class="form-group col-6 mx-0 px-0">
              <input
                v-model="subjectName"
                type="text"
                placeholder="-วิชาที่สอน-"
                class="form-control"
              />
            </div>
            <!-- ปุ่มเพิ่มวิชา -->
            <div class="form-group col-3 mx-0">
              <button type="button" @click="addSubject" class="btn btn-secondary ">เพิ่มวิชา</button>
            </div>
            <!-- แสดงรายการวิชาที่เพิ่ม -->
            <ul v-if="subjects.length" class="m-1 border-bottom border-2 mb-4">
              <li
                v-for="(subject, index) in subjects"
                :key="index"
                class="d-flex justify-content-between align-items-center my-2"
              >
                <span>
                  {{ index + 1 }}. หมวด: {{ subject.category }} | ชื่อวิชา: {{ subject.name }}
                </span>
                <button type="button" @click="removeSubject(index)" class="btn btn-danger btn-sm">ลบ</button>
              </li>
            </ul>
        </div>

        <!-- หัวข้อการสอนและการกำหนดราคา -->
        <div class="row mt-4">
          <div class="col-7">
            <label class="form-label" for="topic">หัวข้อการสอน</label>
          </div>
          <div class="col-3">
            <label class="form-label" for="topic">ราคา/ชั่วโมง</label>
          </div>
          <div class="col-2">
          </div>
        </div>
        <div class="row my-0">
          <!-- หัวข้อการสอน -->
            <div class="form-group col-7 mx-0">
              <input
                v-model="topicName"
                type="text"
                placeholder="รายการที่สอน"
                class="form-control"
              />
            </div>
            <!--ราคา -->
            <div class="form-group col-2 mx-0 px-0">
              <input
                v-model="topicPrice"
                type="text"
                placeholder="ราคา"
                class="form-control"
              />
            </div>
            <!-- ปุ่มเพิ่มหัวข้อ -->
            <div class="form-group col-3 mx-0">
              <button type="button" @click="addTopic" class="btn btn-secondary ">เพิ่มรายการ</button>
            </div>
            <!-- แสดงรายการวิชาที่เพิ่ม -->
            <ul v-if="topics.length" class="m-1">
              <li
                v-for="(topic, index) in topics"
                :key="index"
                class="d-flex justify-content-between align-items-center my-2"
              >
                <span>
                  {{ index + 1 }}. หัวข้อ: {{ topic.name }} ราคา: {{ topic.price }} ฿/ชั่วโมง
                </span>
                <button type="button" @click="removeTopic(index)" class="btn btn-danger btn-sm">ลบ</button>
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
import L from "leaflet";

export default {
  name: "TutorInfoPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      imageUrl: null, // เก็บ URL ภาพที่อัปโหลด
      previousRoutes: [],
      mainColor: "#BC2C2C",
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
  validations: {
  introduce: {
    required: required,
  },
  describe: {
    required: required,
  },

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
 
      },

    back() {
      if (this.previousRoutes.length > 0) {
        const previousRoute = this.previousRoutes.pop();
        this.$router.push(previousRoute);
      } else {
        this.$router.go(-1);
      }
    },

    initMap() {
      // สร้างแผนที่และกำหนดตำแหน่งเริ่มต้น
      this.map = L.map("map").setView([13.736717, 100.523186], 13); // Bangkok

      // เพิ่มแผนที่จาก OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      // เพิ่ม Marker เมื่อมีการคลิกบนแผนที่
      this.map.on("click", this.onMapClick);
    },
    onMapClick(e) {
      const { lat, lng } = e.latlng; // ดึงพิกัดจากการคลิก
      this.placePosition = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;

      // ลบ Marker ตัวเก่าถ้ามี
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // เพิ่ม Marker ใหม่ที่ตำแหน่งคลิก
      this.marker = L.marker([lat, lng]).addTo(this.map);
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