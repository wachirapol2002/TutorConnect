<template>
    <div id="app">
        <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
          <div class="fw-bold text-center" style="font-size: 5vh;">ผู้สมัครติวเตอร์</div>
        </div>
        <div class="container-fluid rounded-4  border border-dark p-3 py-4" :style="{ backgroundColor: 'white' }" style="width: 80vw;">
          <div class="row" :style="{ backgroundColor: '' }">
            <div class="col-3" style="" :style="{ backgroundColor: '' }">
              <section class="container mt-4">
                      <div class="content">
                        <div class="file d-flex flex-column justify-content-center align-items-end">
                          <!-- แสดงภาพตัวอย่าง -->
                          <div :class="center" style="height:12vw; width: 12  vw; background-color: white; border: 1px solid black; overflow: hidden;">     
                            <img v-if="imageUrl"
                              :src="imageUrl"
                              alt="Preview"
                              style="width: 100%; height: 100%; object-fit: cover;"
                              />
                          </div>
                          
                        </div>
                      </div>
              </section>
            </div>
            <div class="col-9" :style="{ backgroundColor: '' }">
              <section class="container mt-4" style="font-size: 3vh;">
                   <!-- ชื่อผู้ใช้งาน -->
                   <div class="row my-2">
                      <div class="form-group col-8 d-flex" :style="{ backgroundColor: '' }">
                        <label class="form-label fw-bold m-0" :style="{ fontSize: '2vw' }" for="tutorname">พี่หนึ่ง</label>
                        <div class="ms-3">
                            <span class="text-warning" :style="{ fontSize: '2vw' }">★★★★★</span>
                            <small class="ms-1" :style="{ fontSize: '2vw' }">4.2/5</small>
                        </div>
                      </div>
                      <div class="form-group col-4 d-flex" :style="{ backgroundColor: '' }">
                        <label class="form-label fw-bold" for="date">วันที่สมัคร</label>
                        <div class="mx-2">25/11/2567</div>
                      </div>
                    </div>

                    <!-- วิชาที่สอน -->
                    <div class="row my-2">
                      <div class="form-group col-8 d-flex">
                        <label class="form-label m-0" :style="{ fontSize: '1.5vw' }" for="subject">วิชาที่สอน</label>
                        <div class="mx-2">
                            <span class="badge bg-primary mx-1" :style="{ fontSize: '1vw' }">คณิตศาสตร์</span>
                            <span class="badge bg-primary mx-1" :style="{ fontSize: '1vw' }">ฟิสิกส์</span>
                        </div>
                      </div>
                      <!-- อนุมัติ -->
                      <div class="form-group col-4 d-flex align-items-center justify-content-start" :style="{ backgroundColor: '' }">
                        <div class="button rounded-3 me-5 bg-success fw-bold text-light" :style="{}">
                          อนุมัติ
                        </div>
                        <div class="button rounded-3 m-0 bg-danger fw-bold text-light" :style="{}">
                          ไม่อนุมัติ
                        </div>
                      </div>
                    </div>
                    <!-- แนะนำตัว -->
                    <div class="row my-2">
                      <div class="form-group col-8 d-flex align-items-center">
                        <p class="my-2" :style="{ fontSize: '1vw' }">
                          สวัสดีครับ พี่หนึ่งนะครับ จบจากคณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย
                          เรียนกับพี่เน้นความเข้าใจ แก้ปัญหาการลืมสูตรได้ สอนเป็นกันเองครับ
                        </p>
                      </div>
                    </div>

                    <!-- ติดต่อ -->
                    <div class="row my-2">
                      <div class="form-group col-8 d-flex align-items-center">
                        <!-- ไอคอน Facebook -->
                        <img class="" :src="require('@/assets/facebook.png')" alt="Facebook" width="7%" height="auto"/>
                        <!-- ไอคอน LINE -->
                        <img class="mx-4 me-2" :src="require('@/assets/line.png')" alt="Line" width="7%" height="auto"/>
                        <div :style="{ fontWeight: '400', fontSize: '1.5vw'}">:Id12345</div>
                        <div class="ms-4 fw-light" :style="{ fontWeight: '400', fontSize: '1.5vw'}">เบอร์ติดต่อ: <i>0991234569</i></div>
                        
                      </div>
     
                    </div>

                     <!-- ส่งข้อความ -->
                     <div class="row mt-3">
                      <div class="form-group col-8 d-flex align-items-center">
                        <div class="button rounded-3 me-5 bg-warning text-dark fw-bold" :style="{}">
                          ส่งข้อความ
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
  // import axios from "axios";
  import useVuelidate from "@vuelidate/core";
  import {
    required,
  } from "@vuelidate/validators";

  export default {
    name: "ApproveTutorPage",
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    data() {
      return {
        currentRating: 0, // ดาวที่ถูกให้คะแนน
        commentInput: "", // ข้อความคอมเมนต์จาก input
        comments: [ // คอมเมนต์ที่แสดงไว้เริ่มต้น
            { name: "เก่งจริง เรียนดี", message: "สอนเข้าใจง่ายมากครับ", date: "17/08/2024" },
            { name: "มาเรียน ฟิสิกส์", message: "สอนดี สอนสนุกมาก", date: "15/08/2024" }
        ],
        imageUrl: require('@/assets/user.png'),
        previousRoutes: [],
        mainColor: "#BC2C2C",
        introduce: "",
       
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

    },
    methods: {
    setRating(n) {
        this.currentRating = n;
    },
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