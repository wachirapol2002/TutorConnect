<template>
    <div id="app">


      <!-- main categories -->
        <div class="container-fluid p-5 d-flex flex-column my-categories" :style="{backgroundColor: '', height: '40vh', minWidth: '100vw' }">
          <div class="row">
            <div class="category rounded-4 px-2 mx-2" :style="{backgroundColor: Language}">
              <img :src="require('@/assets/languages.png')" alt="ภาษา" class="category-icon m-2" />
              <span class="category-label m-1">ภาษา</span>
            </div>
            <div class="category rounded-4 px-2 mx-2" :style="{backgroundColor: Education}">
              <img :src="require('@/assets/education.png')" alt="วิชาการ" class="category-icon m-2" />
              <span class="category-label m-1">วิชาการ</span>
            </div>
            <div class="category rounded-4 px-2 mx-2"  :style="{backgroundColor: Music}">
              <img :src="require('@/assets/musical.png')" alt="ดนตรี" class="category-icon m-2" />
              <span class="category-label m-1">ดนตรี</span>
            </div>
            <div class="category rounded-4 px-2 mx-2"  :style="{backgroundColor: Sports}">
              <img :src="require('@/assets/sports.png')" alt="กีฬา" class="category-icon m-2" />
              <span class="category-label m-1">กีฬา</span>
            </div>
          </div>
          <div class="row">
            <div class="category rounded-4 px-2 mx-2"  :style="{backgroundColor: Computer}">
              <img :src="require('@/assets/computer.png')" alt="คอมพิวเตอร์" class="category-icon m-2" />
              <span class="category-label m-1">คอมพิวเตอร์</span>
            </div>
            <div class="category rounded-4 px-2 mx-2"  :style="{backgroundColor: LifeSkills}">
              <img :src="require('@/assets/life-skills.png')" alt="ทักษะชีวิต" class="category-icon m-2" />
              <span class="category-label m-1">ทักษะชีวิต</span>
            </div>
            <div class="category rounded-4 px-2 mx-2"  :style="{backgroundColor: Development}">
              <img :src="require('@/assets/development.png')" alt="พัฒนาวิชาชีพ" class="category-icon m-2" />
              <span class="category-label m-1">พัฒนาวิชาชีพ</span>
            </div>
          </div>
        </div>


      <!-- main categories -->
      <div class="container">
        <div class="row">
          <div 
            class="col-12 col-sm-6 col-md-4 mb-3"
            v-for="(category, index) in subCategories" 
            :key="index"
          >
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">{{ category }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- filter -->
        <div :class=center class="flex-column mb-5" :style="{backgroundColor: '', height: 'auto', minWidth: '100vw' }">
          <div class="filter rounded-4 px-2 my-4" :style="{backgroundColor: '#F8AE1E'}">
                <span :style="{fontWeight: 'bold', fontSize: '3.2vh',}">เพิ่มฟิลเตอร์</span>
          </div>
            <!-- ฟิลเตอร์ -->
          <div class="filter-container rounded-4 p-4 m-0 shadow-lg" :style="{backgroundColor: 'white', height: 'auto', minWidth: '65vw' }">
            <!-- เพศผู้สอน -->
            <div class="filter-group mb-3 pb-3 border-bottom border-2" :style="{backgroundColor: '',}">
              <div class="filter-title mb-3">เพศผู้สอน</div>
              <div class="filter-options d-flex justify-content-around" :style="{backgroundColor: ''}">
                <button
                  class="filter-button rounded-4 mx-5"
                  :class="{ selected: selectedGender.includes('ชาย') }"
                  @click="toggleGender('ชาย')"
                >
                  ชาย
                </button>
                <button
                  class="filter-button rounded-4 mx-5"
                  :class="{ selected: selectedGender.includes('หญิง') }"
                  @click="toggleGender('หญิง')"
                >
                  หญิง
                </button>
              </div>
            </div>
            <!-- สถานที่สอน -->
            <div class="filter-group mb-3 pb-3 border-bottom border-2">
              <div class="filter-title mb-3">สถานที่สอน</div>
              <div class="filter-options d-flex justify-content-around" :style="{backgroundColor: ''}">
                <button class="filter-button rounded-4 mx-5">ออนไลน์</button>
                <button class="filter-button rounded-4 mx-5">ระบุสถานที่</button>
              </div>
              
            </div>
            <!-- ราคาต่อชั่วโมง -->
            <div class="filter-group mb-3 pb-3 border-bottom border-2">
              <div class="filter-title mb-3">ราคาต่อชั่วโมง</div>
              <div class="slider-container d-flex flex-column align-items-center justify-content-center" :style="{backgroundColor: '', height: 'auto', width: '100%'}">
                <div class="d-flex align-items-center justify-content-center" :style="{backgroundColor: '', height: 'auto', width: '50%'}">
                  <span class="price-box-label">ไม่เกิน</span>
                  <div class="price-box rounded-4 mx-2">{{ price }}</div>
                  <span class="price-box-label">บาท</span>
                </div>
                <div class="d-flex align-items-center justify-content-center my-3" :style="{backgroundColor: '', height: 'auto', width: '50%'}">
                  <span class="range-label">0</span>
                  <input type="range" min="0" max="1000" step="50" v-model="price" class="slider" />
                  <span class="range-label">1000</span>
                </div>
              </div>
            </div>
            <!-- คะแนนการสอน -->
            <div class="filter-group mb-3">
              <div class="filter-title mb-3">คะแนนการสอน</div>
              <div class="rating-container d-flex flex-column align-items-center justify-content-center" :style="{backgroundColor: '', height: 'auto', width: '100%'}">
                <div class="d-flex align-items-center justify-content-center" :style="{backgroundColor: '', height: 'auto', width: '50%'}">
                  <span class="price-box-label">ตั้งแต่</span>
                  <div class="price-box rounded-4 mx-2">{{ rating }}</div>
                  <span class="price-box-label">ขึ้นไป</span>
                </div>
                <div class="star-container">
                  <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= rating }" @click="rating = star">
                    ★
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tutor -->
        <div class="container py-4" style="background-color: #E5DBD9;">
          <div class="row justify-content-center g-3">
            <!-- Card 1 -->
            
            <div class="col-md-4">
              <router-link to="/tutor/profile" style="text-decoration: none;">
              <div class="card shadow-sm text-center">
                <div class="card-body">
                  <div class="rounded-circle bg-light mx-auto mb-3" style="width: 100px; height: 100px;">
                    <img :src="require('@/assets/user.png')" alt="โปรไฟล์" class="img-fluid rounded-circle" />
                  </div>
                  <h5 class="card-title">พี่หนึ่ง</h5>
                  <div class="mb-3">
                    <span class="badge me-2 text-dark" :style="{backgroundColor: Education}">คณิตศาสตร์</span>
                    <span class="badge text-dark" :style="{backgroundColor: Education}">ฟิสิกส์</span>
                  </div>
                  <p class="text-muted">
                    สวัสดีครับ พี่หนึ่งเองครับ จบจากคณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย เรียนกับพี่แล้วความเข้าใจจะเพิ่มขึ้นแน่นอนครับ สอนเป็นกันเองครับ
                  </p>
                  <div class="d-flex justify-content-center align-items-center gap-1">
                    <span class="text-warning">★★★★</span>
                    <span class="text-secondary">★</span>
                    <span class="ms-2 text-muted">4.2/5</span>
                  </div>
                </div>
              </div>
            </router-link>
            </div>

            <!-- Card 2 -->
            <div class="col-md-4">
              <div class="card shadow-sm text-center">
                <div class="card-body">
                  <div class="rounded-circle bg-light mx-auto mb-3" style="width: 100px; height: 100px;">
                    <img :src="require('@/assets/user.png')" alt="โปรไฟล์" class="img-fluid rounded-circle" />
                  </div>
                  <h5 class="card-title">ครูสอง</h5>
                  <div class="mb-3">
                    <span class="badge me-2 text-dark" :style="{backgroundColor: Language}">ภาษาอังกฤษ</span>
                    <span class="badge text-dark" :style="{backgroundColor: Education}">ชีวะ</span>
                  </div>
                  <p class="text-muted">
                    เอกภาษาอังกฤษ มหาวิทยาลัยเกษตรศาสตร์ เน้นเข้าใจง่าย ช่วยผู้เรียนตั้งแต่ต้น ใจดี ไม่เข้าใจตรงไหนถามได้เสมอ
                  </p>
                  <div class="d-flex justify-content-center align-items-center gap-1">
                    <span class="text-warning">★★★</span>
                    <span class="text-secondary">★★</span>
                    <span class="ms-2 text-muted">3.7/5</span>
                  </div>
                </div>
              </div>
            </div>

            



          </div>
        </div>

    </div>
</template>
  
  <script>
  import axios from "axios";
  
  // @ is an alias to /src
  export default {
    name: "HomePage",
    data() {
      return {
        selectedGender: [], // เก็บค่าที่เลือก เช่น ['ชาย', 'หญิง']
        price: 500,
        rating: 0,
        Language: "#A8D5BA",
        Education: "#A7C7E7",
        Music: "#F6C78A",
        Sports: "#FFE7A1",
        Computer: "#C4B0E4",
        LifeSkills: "#B3D4E0",
        Development: "#F3BFC3",
        subCategories: [
            "คณิตศาสตร์",
            "แคลคูลัส",
            "ตรีโกณมิติ",
            "เศรษฐศาสตร์",
            "ฟิสิกส์",
            "เคมี",
            "ชีววิทยา",
            "ประวัติศาสตร์"
        ],
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
    mounted() {
    },
    methods: {
      getTables() {
        axios
          .get("http://localhost:8080", {
            params: {
              search: this.search,
            },
          })
          .then((response) => {
            this.tables = response.data;
          })
          .catch((err) => {
            console.log(err);
          });
      },
      toggleGender(gender) {
      if (this.selectedGender.includes(gender)) {
        // ถ้ามีอยู่แล้ว ให้เอาออก
        this.selectedGender = this.selectedGender.filter((item) => item !== gender);
      } else {
        // ถ้ายังไม่มี ให้เพิ่ม
        this.selectedGender.push(gender);
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
.my-categories {
  gap: 1vw; /* ระยะห่างระหว่าง category */
}

.category {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid black; /* กรอบ */
  background-color: #f9f9f9; /* สีพื้นหลัง */
  width: auto; /* ขนาดกล่อง */
  height: 12vh;
  text-align: center;
  transition: transform 0.2s;
}

.category:hover {
  transform: scale(1.05);
}

.category-icon {
  width: 3vw; /* ขนาดไอคอน */
  height: 3vw;
}

.category-label {
  font-size: 4vh;
  font-weight: bold;
  color: black; /* สีข้อความ */
}

.filter {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid black; /* กรอบ */
  background-color: #f9f9f9; /* สีพื้นหลัง */
  width: auto; /* ขนาดกล่อง */
  height: 7vh;
  text-align: center;
}

.filter-container {
  width: 100%; /* ความกว้างของ container */
  max-width: 600px; /* หรือกำหนด max-width เพื่อควบคุมความกว้าง */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.filter-title {
  font-weight: bold;
  font-size: 3vh;
}

.filter-options {
  display: flex;
  width: 50%; /* ความกว้างของ filter-options ตาม container */
  height: 100%;
}

.filter-button {
  font-size: 3vh;
  width: auto; /* ขนาดกล่อง */
  height: 7vh;
  padding: 1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid black; /* กรอบ */
  background-color: #f9f9f9; /* สีพื้นหลัง */
  text-align: center;
  color: black;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-button.selected {
  background-color: #808080; /* สีเขียวเมื่อถูกเลือก */
  color: black;
  border-color: black;
}
.filter-button:hover {
  background-color: #3E3E3E; /* สีเมื่อ hover */
}

.price-box {
  font-size: 3vh;
  width: 5vw; /* ขนาดกล่อง */
  height: 7vh;
  padding: 1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid black; /* กรอบ */
  background-color: #f9f9f9; /* สีพื้นหลัง */
  text-align: center;
  color: black;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-container {
  width: 100%;
}

.slider {
  width: 100%;
}

.price-box-label{
  text-align: center;
  font-size: 3vh;
}

.range-label{
  width: 10vw;
  text-align: center;
  font-size: 3vh;
}

.star-container {
  display: flex;
  gap: 5px;
}

.star {
  font-size: 2rem;
  cursor: pointer;
  color: #ccc;
}

.star.active {
  color: #ffcc00;
}

.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: scale(1.05);
}
.form-label{
    font-weight: 500;
  }

</style>
  