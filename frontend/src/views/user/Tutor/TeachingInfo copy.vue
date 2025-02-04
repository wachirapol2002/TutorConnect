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
      style="width: 80vw;"
    >
      <div :class="center" :style="{fontSize: '2vw',}">ข้อมูลการสอน</div>
      <!-- form -->
      <form name="Information">
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
                class="form-control information"
                readonly
              />
            </div>
            <!--ชื่อสถานที่ -->
            <div class="form-group col-3 mx-0 px-0">
              <input
                v-model="placeName"
                type="text"
                placeholder="ระบุชื่อสถานที่"
                class="form-control information"
              />
            </div>
            <!-- ปุ่มเพิ่มสถานที่ -->
            <div class="form-group col-3 mx-0">
              <button type="button" @click="addPlace" class="btn btn-secondary information">เพิ่มสถานที</button>
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
        <label class="form-label" for="subject">วิชาที่ต้องการสอน</label>
        <div class="row my-0">
          <div class="form-group col-3 mx-0 pe-1">
            <label class="form-label" for="subject">หมวดวิชา</label>
          </div>
          <div class="form-group col-3 mx-0 pe-1">
            <label class="form-label" for="subject">ชื่อวิชา</label>
          </div>
          <div class="form-group col-2 mx-0 pe-1">
            <label class="form-label" for="subject">ระดับชั้น</label>
          </div>
          <div class="form-group col-2 mx-0 pe-1">
            <label class="form-label" for="subject">ราคา/ชั่วโมง</label>
          </div>
          
        </div>
        <div class="row my-2 mt-0">
          <!-- <label class="form-label" for="subject">วิชาที่ต้องการสอน</label> -->
          <!-- เลือกหมวดวิชา -->
            <div class="form-group col-3 mx-0 pe-1">
              <select v-model="selectedCategory" class="form-control information">
                <option value="" disabled>เลือกหมวดวิชา*</option>
                <option v-for="(category, index) in categories" :key="index" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <!-- กรอกชื่อวิชา -->
            <div class="form-group col-3 mx-0 px-1">
              <input
                v-model="subjectName"
                type="text"
                placeholder="ชื่อวิชาที่สอน*"
                class="form-control information"
              />
            </div>
            <!-- กรอกชื่อวิชา -->
            <div class="form-group col-2 mx-0 px-1">
              <select v-model="subjectDegree" class="form-control information">
                <option value="" disabled>ช่วงวัย</option>
                <option value="ประถมต้น">ประถมต้น</option>
                <option value="ประถมปลาย">ประถมปลาย</option>
                <option value="มัธยมต้น">มัธยมต้น</option>
                <option value="มัธยมปลาย">มัธยมปลาย</option>
              </select>
            </div>
            <!-- กรอกชื่อวิชา -->
            <div class="form-group col-2 mx-0 px-1">
              <input
                v-model="subjectPrice"
                type="text"
                placeholder="บาท"
                class="form-control information"
              />
            </div>
            <!-- ปุ่มเพิ่มวิชา -->
            <div class="form-group col-2 mx-0">
              <button type="button" @click="addSubject" class="btn btn-secondary information">เพิ่มวิชา</button>
            </div>
            <!-- แสดงรายการวิชาที่เพิ่ม -->
            <div class="information mt-3">
            <ul v-if="subjects.length" class="m-1 border-bottom border-2 mb-4">
              <li
                v-for="(subject, index) in subjects"
                :key="subject.subject_id"
                class="d-flex justify-content-between align-items-center my-2"
              >
                <span>
                  <!-- {{ index + 1 }}. หมวด: {{ subject.category }} | ชื่อวิชา: {{ subject.subject_name }} {{ subject.degree_level }} {{ subject.price }} บาท/ชั่วโมง -->
                     {{ index + 1 }}. หมวด {{ subject.category }} | {{ subject.subject_name }} {{ subject.degree_level }} {{ subject.price }} บาท/ชั่วโมง
                </span>
                <button type="button" @click="removeSubject(subject.subject_id, index)" class="btn btn-danger btn-sm information">ลบ</button>
              </li>
            </ul>
            </div>
        </div>

        <div class="form-group d-flex justify-content-center">
          <div class="button rounded-3 my-4 px4- mx-2 information text-light" :style="{backgroundColor: mainColor,}" @click="submit()">
            กลับ
          </div>
          <div class="button rounded-3 my-4 px4- mx-2 information text-light" :style="{backgroundColor: mainColor,}" @click="submit()">
            ยืนยันข้อมูลการสอน
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
  required,
} from "@vuelidate/validators";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
  name: "TeachingInfoPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      imageUrl: null, // เก็บ URL ภาพที่อัปโหลด
      previousRoutes: [],
      mainColor: "#BC2C2C",
      tutor_id: '',
      tutorName: this.$cookies.get("tutor") ? this.$cookies.get("tutor").displayname : "",
      facebook: this.$cookies.get("tutor") ? this.$cookies.get("tutor").facebook_link : "",
      line: this.$cookies.get("tutor") ? this.$cookies.get("tutor").line_id : "",
      introduce: this.$cookies.get("tutor") ? this.$cookies.get("tutor").introduce_message : "",
      describe: this.$cookies.get("tutor") ? this.$cookies.get("tutor").description : "",


      map: null,       // เก็บอ็อบเจกต์แผนที่
      marker: null,    // เก็บตำแหน่ง Marker
      placeName: "", 
      placePosition: "", 
      place: "",       // เก็บค่าพิกัดที่เลือก
      places: [],
      categories: ["ภาษา", "วิชาการ", "ดนตรี", "กีฬา", "คอมพิวเตอร์", "ทักษะชีวิต", "พัฒนาวิชาชีพ"], // หมวดวิชาที่มีให้เลือก
      selectedCategory: "", // หมวดวิชาที่เลือก
      subjectName: "", // ชื่อวิชาที่กรอก
      subjectDegree: "",
      subjectPrice: "",
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
    this.teacherInfo();
  },
  methods: {
    teacherInfo() {
        const data = {
            account_id: this.$cookies.get("account").account_id,
          };
        axios.post("http://localhost:3000/tutor/teacher/info/byAccount", data)
          .then((res) => {
              this.tutor_id = res.data.tutor.tutor_id
              this.tutorName = res.data.tutor.displayname
              this.facebook = res.data.tutor.facebook_link
              this.line = res.data.tutor.line_id
              this.introduce = res.data.tutor.introduce_message
              this.describe = res.data.tutor.description
              return axios.post("http://localhost:3000/tutor/subject", { tutor_id: this.tutor_id });
          })  
          .then((res) => {
              this.subjects = res.data.subjects;
          })
          .catch((err) => {
            alert(err.response.data.details.message);
          });   
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
      if (this.subjectName){
        const data = {
            tutor_id: this.tutor_id,
            selectedCategory: this.selectedCategory, // หมวดวิชาที่เลือก
            subjectName: this.subjectName, // ชื่อวิชาที่กรอก
            subjectDegree: this.subjectDegree,
            subjectPrice: this.subjectPrice,
          };
        axios
          .post("http://localhost:3000/tutor/subject/add", data)
          .then((res) => {
            this.subjects = res.data.subjects
            this.selectedCategory = ''
            this.subjectName = ''
            this.subjectDegree = ''
            this.subjectPrice = ''
          })
          .catch((err) => {
            alert(err);
            console.log(err)
          });
    }else{
      alert("กรุณากรอกชื่อวิชาก่อน");
    }
    },
    
    addAcademy() {
      if (this.school_name){
        const data = {
            tutor_id: this.tutor_id,
            status: this.status,
            degree: this.degree,
            school_name: this.school_name,
            honor: this.honor,
            grade: this.grade,
          };
          axios
            .post("http://localhost:3000/tutor/graduate/add", data)
            .then((res) => {
              this.academys = res.data.graduates
              this.status = ''
              this.degree = ''
              this.school_name = ''
              this.honor = ''
              this.grade = ''
            })
            .catch((err) => {
              alert(err.response.data.details.message);
              console.log(err)
            });
      }else{
        alert("กรุณากรอกชื่อสถานศึกษาก่อน");
      }
    },
    removeSubject(subject_id, index) {
      if (confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
        const data = {
            subject_id: subject_id,
          };
        axios
          .post("http://localhost:3000/tutor/subject/remove", data)
          .then(() => {
            this.subjects.splice(index, 1); // ลบข้อมูลจากหน้าจอ
          })
          .catch((err) => {
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            console.error(err);
          });
      }
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
        this.$router.push({ path: "/tutor/profile" });
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
.button{
  transition: transform 0.2s ease;
  
}
.button:hover{
  transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ hover */
  cursor: pointer; /* แสดงให้รู้ว่าเป็นปุ่ม */
}
.btn{
  transition: transform 0.2s ease;
  
}
.btn:hover{
  transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ hover */
  cursor: pointer; /* แสดงให้รู้ว่าเป็นปุ่ม */
}
.form-label{
  font-size: 1.5vw;
}
.information{
  font-size: 1.2vw;
}
</style>