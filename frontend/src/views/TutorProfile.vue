<template>
    <div id="app">
        <div class="container-fluid rounded-4  border border-dark my-5 p-3 py-4" :style="{ backgroundColor: 'white' }" style="width: 80vw;">
            <!-- ส่วนข้อมูลของผู้สอน -->
            <div class="d-flex justify-content-start align-items-center" :style="{ backgroundColor: '' }">
                <div :class="center" class="m-0 p-0" style="width: 25vw;" :style="{ backgroundColor: '' }">
                <!-- รูปโปรไฟล์ -->
                    <div class="m-0 rounded-circle bg-light" :class="center" :style="{ backgroundColor: 'white' }" style="height:13vw; width: 13vw; background-color: white; border: 1px solid black; overflow: hidden;">
                        <img
                            :src="require('@/assets/user.png')"
                            alt="profile"
                            class=""
                            style="width: 100%; height: 100%; object-fit: cover;"
                        />
                    </div>
                </div>
                <div class="container" style="width: 40vw;" :style="{ backgroundColor: '' }">
                    <!-- ชื่อผู้สอน -->
                    <div class="d-flex align-items-center">
                        <div class="fw-bold" :style="{ fontSize: '2vw' }">พี่หนึ่ง</div>
                        <!-- ดาวและคะแนน -->
                        <div class="ms-3">
                            <span class="text-warning" :style="{ fontSize: '2vw' }">★★★★★</span>
                            <small class="ms-1" :style="{ fontSize: '2vw' }">4.2/5</small>
                        </div>
                    </div>
                    <!-- วิชาที่สอน -->
                    <div class="d-flex align-items-center">
                        <div class="" :style="{ fontSize: '1.5vw' }">วิชาทีสอน</div>
                        <div class="m-2">
                            <span class="badge bg-primary mx-1" :style="{ fontSize: '1vw' }">คณิตศาสตร์</span>
                            <span class="badge bg-primary mx-1" :style="{ fontSize: '1vw' }">ฟิสิกส์</span>
                        </div>
                    </div>
                    <!-- แนะนำตัว -->
                    <div class="d-flex align-items-center">
                        <p class="my-2">
                        สวัสดีครับ พี่หนึ่งนะครับ จบจากคณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย
                        เรียนกับพี่เน้นความเข้าใจ แก้ปัญหาการลืมสูตรได้ สอนเป็นกันเองครับ
                        </p>
                    </div>
                    <!-- ช่องทางการติดต่อ -->
                    <div class="d-flex align-items-center">
                        <!-- ไอคอน Facebook -->
                        <img class="" :src="require('@/assets/facebook.png')" alt="Facebook" width="5%" height="auto"/>
                        <!-- ไอคอน LINE -->
                        <img class="mx-4 me-2" :src="require('@/assets/line.png')" alt="Line" width="5%" height="auto"/>
                        <div :style="{ fontWeight: '400', fontSize: '1.5vw'}">:Id12345</div>
                        <div class="ms-4 fw-light" :style="{ fontWeight: '400', fontSize: '1.5vw'}">เบอร์ติดต่อ: <i>0991234569</i></div>
                        
                    </div>
                    <!-- ปุ่มส่งข้อความ -->
                    <div class="d-flex align-items-center mt-3">
                      <div class="button rounded-3 me-5 bg-warning text-dark fw-bold" :style="{}" @click="chat()">
                          ส่งข้อความ
                      </div>
                    </div>
                
                </div>
            </div>
        </div>

        <div class="container-fluid rounded-4 px-5 py-4 border border-dark" :style="{backgroundColor: 'white'}" style="width: 80vw;">
            <div :class="center" :style="{fontSize: '2vw',}">ข้อมูลการสอน</div>
            <!-- รายละเอียดข้อมูลการสอน -->
            <div>
                <!-- แนะนำตัว/ประสบการณ์สอน/ความน่าสนใจ -->
                <div class="mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}">แนะนำตัว/ประสบการณ์สอน/ความน่าสนใจ</div>
                <ul>
                    <li>เป็นติวเตอร์ให้กับนักเรียนที่สอบติดมหาวิทยาลัยชั้นนำในประเทศ เช่น จุฬาลงกรณ์มหาวิทยาลัย และมหาวิทยาลัยธรรมศาสตร์</li>
                    <li>มีส่วนร่วมในการออกแบบคอร์สติวออนไลน์สำหรับการสอบ <em>GAT-PAT</em> และวิชาสามัญ ซึ่งช่วยให้นักเรียนหลายคนสามารถเพิ่มคะแนนสอบได้มากกว่า 30%</li>
                    <li>เคยสอนนักเรียนที่เตรียมตัวสอบแข่งขันทางวิชาการระดับประเทศ และนักเรียนหลายคนได้รับรางวัลชนะเลิศในการแข่งขันวิชาการระดับภูมิภาค</li>
                </ul>

                <!-- ประวัติการศึกษา -->
                <div class="mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}">ประวัติการศึกษา</div>
                <ul>
                    <li>คณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย เกรด 3.99</li>
                    <li><em>Pat 3</em> : ความถนัดทางวิศวกรรมศาสตร์ 259/300</li>
                </ul>

                <!-- สถานที่สอน -->
                <div class="mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}">สถานที่สอน</div>
                <ul>
                    <li>ออนไลน์</li>
                </ul>

                <!-- หัวข้อการสอนและราคา -->
                <div class="mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}">หัวข้อการสอนและราคา</div>
                <ul>
                    <li>คณิตศาสตร์ มัธยมปลาย เพื่อเพิ่มเกรด <strong>250 บาท/ชม</strong></li>
                    <li>ฟิสิกส์ มัธยมต้น เพื่อสอบเข้าห้องเรียนพิเศษ <strong>300 บาท/ชม</strong></li>
                    <li>ฟิสิกส์ มัธยมปลาย เพื่อเพิ่มเกรด <strong>300 บาท/ชม</strong></li>
                </ul>
            </div>
            <!-- ปุ่มสมัครเป็นนักเรียน -->
            <div class="text-center mt-4">
                <button class="btn btn-warning fw-bold px-4 py-2" style="font-size: 1.2rem;">สมัครเป็นนักเรียน</button>
            </div>
        </div>
        
        <!-- ให้คะแนน -->
        <div class="mt-4">
            <div class="fw-bold" style="font-size: 1.5rem;">ให้คะแนน</div>
            <div id="rating" class="d-flex align-items-center">
                <!-- ดาว -->
                <span v-for="n in 5" :key="n" @click="setRating(n)" :class="{'text-warning': n <= currentRating}" 
                    class="me-2 fs-3" style="cursor: pointer;">★</span>
            </div>
        </div>

        <!-- แสดงความคิดเห็น -->
        <div class="mt-4">
            <div class="fw-bold" style="font-size: 1.5rem;">แสดงความคิดเห็น</div>
            <div class="d-flex align-items-center mt-2">
                <input v-model="commentInput" class="form-control me-2" placeholder="แสดงความคิดเห็น..." />
                <button @click="submitComment" class="btn btn-secondary">ส่ง</button>
            </div>
        </div>

        <!-- ความคิดเห็นที่แสดง -->
        <div class="mt-5">
            <div class="fw-bold" style="font-size: 1.3rem;">ความคิดเห็นผู้เรียน</div>
            <div v-for="(comment, index) in comments" :key="index" class="border p-2 rounded mt-2">
                <div class="d-flex justify-content-between">
                    <div>
                        <strong>{{ comment.name }}</strong>
                        <div>{{ comment.message }}</div>
                    </div>
                    <div>{{ comment.date }}</div>
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
    name: "TutorProfilePage",
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

    },
    methods: {
    setRating(n) {
        this.currentRating = n;
    },
    chat(){
      this.$router.push({ path: "/chat" });
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