<template>
  <div id="app">
    <div class="fw-bold text-center my-4">
      <div class="my-2" :class="center" :style="{fontSize: '2vw',}">ข้อมูลการสอน</div>
      <div class="step-container">
        <router-link to="/tutor/verify" :class="center" style="text-decoration: none;">
          <div class="step actived"> 1 </div>
        </router-link>
        <router-link to="/tutor/teacher/info" :class="center" style="text-decoration: none;">
          <div class="step actived"> 2 </div>
        </router-link>
        <router-link to="" :class="center" style="text-decoration: none;">
          <div class="step active"> 3 </div>
        </router-link>
        <router-link to="" :class="center" style="text-decoration: none;">
          <div class="step"> 4 </div>
        </router-link>
      </div>
    </div>
    <div
      class="container-fluid rounded-4 px-5 py-4 border border-dark" :style="{backgroundColor: 'white'}"
      style="width: 80vw;"
    >
      <!-- form -->
      <form name="Information">
        <!-- สถานทีสอน -->
         <!-- Map -->
         <label class="form-label" for="place">สถานที่สอน</label>
         <div class="form-label mt-3" :style="{fontWeight: '500', fontSize: '1.2vw',}" for="onside">ออนไซต์</div>
         <div id="map" style="height: 60vh; width: 100%;"></div>
         <input id="placeInput" type="text" placeholder="ค้นหาสถานที่" class="form-control information" />
          <!-- ออนไซต์ -->
          <div class="row my-4">
            <!--ชื่อสถานที่ -->
            <div class="form-group col-3 mx-0">
              <input
                v-model="placeName"
                type="text"
                placeholder="ระบุชื่อสถานที่*"
                class="form-control information"
              />
            </div>
            <!-- พิกัดสถานที่ -->
            <div class="form-group col-6 mx-0 px-0">
              <input
                v-model="placeAddress"
                type="text"
                placeholder="ระบุที่อยู่"
                class="form-control information"
              />
            </div>
            <!-- ปุ่มเพิ่มสถานที่ -->
            <div class="form-group col-2 mx-0">
              <button type="button" @click="addPlace" class="btn btn-secondary information">เพิ่มสถานที</button>
            </div>
          </div>
          <!-- ออนไลน์ -->
          <div class="form-label mt-3" :style="{fontWeight: '500', fontSize: '1.2vw',}" for="onside">ออนไลน์</div>
          <div class="row my-4">
            <!--ชื่อสถานที่ -->
            <div class="form-group col-9 mx-0">
              <input
                v-model="appName"
                type="text"
                placeholder="ระบุชื่อโปรแกรม/เว็บไซต์*"
                class="form-control information"
              />
            </div>
            <!-- ปุ่มเพิ่มสถานที่ -->
            <div class="form-group col-2 mx-0">
              <button type="button" @click="addApp" class="btn btn-secondary information">เพิ่มโปรแกรม</button>
            </div>
        </div>
        <div class="row my-4">
          <!-- แสดงรายการสถานที่ -->
          <ul v-if="places.length" class="m-1 border-bottom border-2 mb-4">
            <li
              v-for="(place, index) in places"
              :key="place.location_id"
              class="d-flex justify-content-between align-items-center my-2"
            >
              <div class="col-11">
                - {{ place.place_name + (place.address !== 'ไม่ระบุ' ? ' ' + place.address : '') }}
              </div>
              <button type="button" @click="removePlace(place.location_id, index)" class="btn btn-danger btn-sm">ลบ</button>
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
  
            <!-- คำอธิบายรายวิชา -->
            <div class="row my-2">
              <div class="form-group col-12">
                <label class="form-label" for="subjectDescribe">คำอธิบายรายวิชา</label>
                <textarea
                  class="form-control information"
                  type="text"
                  id="subjectDescribe"
                  name="subjectDescribe"
                  required
                  placeholder="รายละเอียดการสอน"
                  v-model="subjectDescribe"
                  style="height: 15vh;"
                >
                </textarea>
              </div>
            </div>
              <!-- สถานที่สอนแต่ละวิชา -->
              <div class="row my-2">
              <div class="form-group col-12">
                  <div class="btn-group col-6 mx-1">
                    <button
                      type="button"
                      class="btn col-3"
                      :class="{'btn-dark': subjectPlace === 'ออนไซต์ และ ออนไลน์', 'btn-outline-secondary': subjectPlace !== 'ออนไซต์ และ ออนไลน์'}"
                      @click="subjectPlace = 'ออนไซต์ และ ออนไลน์'"
                      style="font-size: 1vw;"
                    >
                      ออนไซต์ และ ออนไลน์
                    </button>
                    <button
                      type="button"
                      class="btn col-3"
                      :class="{'btn-dark': subjectPlace === 'ออนไซต์', 'btn-outline-secondary': subjectPlace !== 'ออนไซต์'}"
                      @click="subjectPlace = 'ออนไซต์'"
                      style="font-size: 1vw;"
                    >
                      ออนไซต์
                    </button>
                    <button
                      type="button"
                      class="btn col-3"
                      :class="{'btn-dark': subjectPlace === 'ออนไลน์', 'btn-outline-secondary': subjectPlace !== 'ออนไลน์'}"
                      @click="subjectPlace = 'ออนไลน์'"
                      style="font-size: 1vw;"
                    >
                      ออนไลน์
                    </button>
                  </div>
                   <!-- ปุ่มเพิ่มวิชา -->
                  <div class="btn-group mx-5 col-1">
                      <button type="button" @click="addSubject" class="btn btn-secondary information">เพิ่มวิชา</button>
                  </div>
              </div>
            </div>
            <template v-if="v$.subjectPlace.$error">
                <p class="text-danger mx-5 p-0" v-if="v$.subjectPlace.required.$invalid" style="font-size: 1vw;">
                    ต้องเลือก ประเภทสถานที่สอน
                </p>
            </template>

            <div v-if="showSubjectDetail" class="popup-overlay">
              <div class="popup">
                <div class="mb-2" style="font-size: 2vw;">รายละเอียดวิชา</div>
                <div class="my-2" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">รหัสวิชา:</strong> {{ subjectDetail.subject_id }}</div>
                <div class="my-2" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">ผู้สอน:</strong> {{ subjectDetail.displayname }}</div>
                <div class="my-2" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">หมวดวิชา:</strong> {{ subjectDetail.category }}</div>
                <div class="my-2" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">ชื่อวิชา:</strong> {{ subjectDetail.subject_name }}</div>
                <div class="row my-2">
                  <div class="col-3" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">ระดับ:</strong> {{ subjectDetail.degree_level || '-'}}</div>
                  <div class="col-6" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">สอน:</strong> {{ subjectDetail.subject_place}}</div>
                </div>
                <div class="row my-2">
                  <div class="col-3" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">ราคา/ชั่วโมง:</strong> {{ subjectDetail.price+" บาท" || '-'}}</div>
                  <div class="col-6" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">จำนวนนักเรียนที่เคยเรียน:</strong> {{ subjectDetail.student_count+" คน" || '-'}}</div>
                </div>
                <div class="my-2" style="font-size: 1.2vw; white-space: pre-line;"><strong style="font-size: 1.1vw;">รายละเอียด:</strong> {{ subjectDetail.description || '-'}}</div>
                <div class="d-flex justify-content-end mt-3">
                  <button @click="closePopup" class="btn btn-secondary">ปิด</button>
                </div>
              </div>
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
                <div>
                  <button type="button" @click="SubjectDescribe(subject.subject_id, index)" class="btn btn-secondary btn-sm fw-bold text-light mx-2">รายละเอียดวิชา</button>
                  <button type="button" @click="removeSubject(subject.subject_id, index)" class="text-light btn btn-danger btn-sm mx-2">ลบ</button>
                </div>
                
              </li>
            </ul>
            </div>
        </div>

        <div class="form-group d-flex justify-content-center">
          <div class="button rounded-3 my-4 px4- mx-2 information text-light bg-dark" :style="{backgroundColor: mainColor,}" @click="back()">
            ย้อนกลับ
          </div>
          <div class="button rounded-3 my-4 px4- mx-2 information text-light bg-dark" :style="{backgroundColor: mainColor,}" @click="submit()">
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
export default {
  name: "TeachingInfoPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      imageUrl: null, // เก็บ URL ภาพที่อัปโหลด
      currentStep: 3,
      totalSteps: 4,
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
      appName: "",
      placeAddress: "",
      placePosition: "",
      place: "",       // เก็บค่าพิกัดที่เลือก
      places: [],
      categories: ["ภาษา", "วิชาการ", "ดนตรี", "กีฬา", "คอมพิวเตอร์", "ทักษะชีวิต", "พัฒนาวิชาชีพ"], // หมวดวิชาที่มีให้เลือก
      selectedCategory: "", // หมวดวิชาที่เลือก
      subjectName: "", // ชื่อวิชาที่กรอก
      subjectDegree: "",
      subjectPrice: "",
      subjectDescribe: "",
      subjectPlace: null,
      showSubjectDetail: false,
      subjectDetail: {},
      subjects: [], // Array เก็บวิชาที่เพิ่ม
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
      introduce: {
        required: required,
      },
      describe: {
        required: required,
      },
      subjectPlace:{
        required: required,
      },
      }
  },
  mounted() {
    const account = this.$cookies.get('account');
      if (!account) {
        window.location.href = '/login';
      }
    this.initGoogleMap();
    this.teacherInfo();
  },
  methods: {
    initGoogleMap() {
    const apiKey = `AIzaSyA3COn2lDxjeOm1IsKFTt_78770tHMGnAU`; // แทนที่ด้วย API Key จริงของคุณ
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&language=th`;
    script.async = true;
    script.defer = true;
    window.initMap = this.setupGoogleMap;
    document.head.appendChild(script);
  },
  setupGoogleMap() {
    console.log("Google Maps API Loaded:", window.google);
  if (!window.google) {
    this.initGoogleMap();
    return;
  }

  const defaultLocation = { lat: 13.736717, lng: 100.523186 };
  this.map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
  });

  // สร้าง Marker เริ่มต้น + เพิ่ม draggable: true ให้ลากได้
  this.marker = new google.maps.Marker({
    position: defaultLocation,
    map: this.map,
    draggable: true,
  });

  // ✨ Event: ลาก marker แล้วอัปเดตพิกัดใหม่
  google.maps.event.addListener(this.marker, "dragend", (event) => {
    const { lat, lng } = event.latLng.toJSON();
    this.placePosition = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;
    console.log("พิกัดใหม่:", this.placePosition);
  });

  // สร้าง Autocomplete
  const input = document.getElementById("placeInput");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", this.map);

  // ค้นหาสถานที่ผ่าน Autocomplete
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      alert("ไม่สามารถค้นหาตำแหน่งนี้ได้ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    const location = place.geometry.location;
    const { lat, lng } = location.toJSON();
    this.placeName = place.name || "";
    this.placePosition = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;
    this.placeAddress = place.formatted_address || "ไม่พบที่อยู่";

    // ย้าย Marker ไปตำแหน่งใหม่
    this.marker.setPosition(location);

    // ขยับแผนที่ไปตำแหน่งใหม่
    this.map.setCenter(location);
    this.map.setZoom(15);
  });

  // คลิกบนแผนที่เพื่อเพิ่ม/ย้าย Marker
  this.map.addListener("click", (event) => {
    const { lat, lng } = event.latLng.toJSON();
    this.placePosition = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;

    this.marker.setPosition(event.latLng);
    this.map.setCenter(event.latLng);
  });
},

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
              return axios.post("http://localhost:3000/tutor/place", { tutor_id: this.tutor_id });
            })  
          .then((res) => {
            this.places = res.data.places;
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
        this.marker.setPosition({ lat: 13.736717, lng: 100.523186 });
        this.map.setCenter({ lat: 13.736717, lng: 100.523186 });
        let data = {}
        if (this.placePosition == "") {
          data = {
            tutor_id: this.tutor_id,
            placeName: this.placeName,
            address: this.placeAddress ? this.placeAddress : "ไม่ระบุ",
            position: "สอนออนไลน์"
          };
        }else{
          data = {
            tutor_id: this.tutor_id,
            placeName: this.placeName,
            address: this.placeAddress ? this.placeAddress : "ไม่ระบุ",
            position: this.placePosition,
          };
        }
        axios
          .post("http://localhost:3000/tutor/place/add", data)
          .then((res) => {
            this.places = res.data.places
            this.placePosition = "";
            this.placeAddress = "";
            this.placeName = "";
            document.getElementById("placeInput").value = "";
          })
          .catch((err) => {
            alert(err);
            console.log(err)
          });

      } else {
        alert("กรุณาระบุสถานที่สอนก่อน");
      }
    },
    addApp() {
      if (this.appName) {
        let data = {
            tutor_id: this.tutor_id,
            placeName: this.appName,
            address: "ออนไลน์",
            position: "สอนออนไลน์"
        };
        axios
          .post("http://localhost:3000/tutor/place/add", data)
          .then((res) => {
            this.places = res.data.places
            this.appName = "";
          })
          .catch((err) => {
            alert(err);
            console.log(err)
          });

      } else {
        alert("กรุณาระบุโปรแกราม/เว็บไซต์ก่อน");
      }
    },
    removePlace(location_id, index) {
      if (confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
        const data = {
            location_id: location_id,
          };
        axios
          .post("http://localhost:3000/tutor/place/remove", data)
          .then(() => {
            this.places.splice(index, 1); // ลบข้อมูลจากหน้าจอ
          })
          .catch((err) => {
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            console.error(err);
          });
      }
    },
    addSubject() {
      this.v$.$touch();
      if(!this.v$.$invalid){
          if (this.subjectName){
            const data = {
                tutor_id: this.tutor_id,
                selectedCategory: this.selectedCategory, // หมวดวิชาที่เลือก
                subjectName: this.subjectName, // ชื่อวิชาที่กรอก
                subjectDegree: this.subjectDegree,
                subjectPrice: this.subjectPrice,
                subjectDescribe: this.subjectDescribe,
                subjectPlace: this.subjectPlace,
              };
            axios
              .post("http://localhost:3000/tutor/subject/add", data)
              .then((res) => {
                this.subjects = res.data.subjects
                this.selectedCategory = ''
                this.subjectName = ''
                this.subjectDegree = ''
                this.subjectPrice = ''
                this.subjectDescribe = ''
                this.subjectPlace = null
              })
              .catch((err) => {
                alert(err);
                console.log(err)
              });
        }else{
          alert("กรุณากรอกชื่อวิชาก่อน");
        }
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
    SubjectDescribe(subject_id, index) {
      // ดึงข้อมูลวิชาจาก index หรือ subject_id
      const subject = this.subjects[index];
      this.subjectDetail = subject; // เก็บข้อมูลใน subjectDetail
      this.showSubjectDetail = true; // เปิด popup
    },
    closePopup() {
      this.showSubjectDetail = false; // ปิด popup
    },

    submit() {
      const data = {
            tutor_id: this.tutor_id,
          };
          axios
            .post("http://localhost:3000/tutor/sentVerify", data)
            .then(() => {
              alert('ข้อมูลของคุณกำลังรอผู้ดูแลตรวจสอบ');
              this.$router.push({ path: "/tutor/wait" });
            })
            .catch((err) => {
              alert(err.response.data.details.message);
              console.log(err)
            });
      },

      back() {
        this.$router.push({ path: "/tutor/teacher/info" });
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
  font-size: 1vw;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 70vw;
  max-width: 70vw;
}
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