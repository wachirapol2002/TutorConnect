<template>
    <div id="app">


      <!-- main categories -->
        <div class="container-fluid p-4 d-flex flex-column my-categories" :class="center" :style="{backgroundColor: '', height: '', minWidth: '100vw' }">
          <div class="row">
            <div class="category rounded-4 px-2 py-2 mx-2 my-2" :style="{backgroundColor: Language}" @click="filterCategory('ภาษา')">
              <img :src="require('@/assets/languages.png')" alt="ภาษา" class="category-icon m-2" />
              <span class="category-label m-1">ภาษา</span>
            </div>
            <div class="category rounded-4 px-2 py-2 mx-2 my-2" :style="{backgroundColor: Education}" @click="filterCategory('วิชาการ')">
              <img :src="require('@/assets/education.png')" alt="วิชาการ" class="category-icon m-2" />
              <span class="category-label m-1">วิชาการ</span>
            </div>
            <div class="category rounded-4 px-2 py-2 mx-2 my-2"  :style="{backgroundColor: Music}" @click="filterCategory('ดนตรี')">
              <img :src="require('@/assets/musical.png')" alt="ดนตรี" class="category-icon m-2" />
              <span class="category-label m-1">ดนตรี</span>
            </div>
            <div class="category rounded-4 px-2 py-2 mx-2 my-2"  :style="{backgroundColor: Sports}" @click="filterCategory('กีฬา')">
              <img :src="require('@/assets/sports.png')" alt="กีฬา" class="category-icon m-2" />
              <span class="category-label m-1">กีฬา</span>
            </div>
            <div class="category rounded-4 px-2 py-2 mx-2 my-2"  :style="{backgroundColor: Computer}" @click="filterCategory('คอมพิวเตอร์')">
              <img :src="require('@/assets/computer.png')" alt="คอมพิวเตอร์" class="category-icon m-2" />
              <span class="category-label m-1">คอมพิวเตอร์</span>
            </div>
            <div class="category rounded-4 px-2 py-2 mx-2 my-2"  :style="{backgroundColor: LifeSkills}" @click="filterCategory('ทักษะชีวิต')">
              <img :src="require('@/assets/life-skills.png')" alt="ทักษะชีวิต" class="category-icon m-2" />
              <span class="category-label m-1">ทักษะชีวิต</span>
            </div>
            <div class="category rounded-4 px-2 py-2 mx-2 my-2"  :style="{backgroundColor: Development}" @click="filterCategory('พัฒนาวิชาชีพ')">
              <img :src="require('@/assets/development.png')" alt="พัฒนาวิชาชีพ" class="category-icon m-2" />
              <span class="category-label m-1">พัฒนาวิชาชีพ</span>
            </div>
          </div>
        </div>

      <div v-if="subCategories.length > 0">
        <div class="container mb-3">
          <input 
            type="text" 
            class="form-control card-text" 
            placeholder="ค้นหาวิชา..." 
            v-model="searchQuery"
          />
        </div> 
        <!-- subjects -->
        <div class="container">
          <div class="row">
            <div 
              class="col-6 col-sm-6 col-md-4 mb-3"
              v-for="(subject, index) in filteredSubjects" 
              :key="index"
            >
              <div class="card shadow-sm" :class="{'bg-dark text-white': isSelected(subject)}">
                <div class="card-body text-center">
                  <div class="card-text" 
                  @click="filterSubject(subject)">{{ subject }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- filter -->
        <div :class=center class="flex-column mb-0" :style="{backgroundColor: '', height: 'auto', minWidth: '100vw' }">
          <div v-if="showfilter == false" class="filter rounded-4 px-2 my-4 button text-dark" :style="{backgroundColor: '#F8AE1E'}">
                <div class="filter-text" :style="{fontWeight: 'bold',}" @click="morefilter()">เพิ่มฟิลเตอร์</div>
          </div>
          <div v-if="showfilter == true" class="filter rounded-4 px-2 my-4 button text-dark" :style="{backgroundColor: '#F8AE1E'}">
                <div class="filter-text" :style="{fontWeight: 'bold',}" @click="hidefilter()">ซ่อนฟิลเตอร์</div>
          </div>
            <!-- ฟิลเตอร์ -->
          <div v-if="showfilter == true" class="filter-container rounded-4 p-4 mb-5 shadow-lg" :style="{backgroundColor: 'white', height: 'auto', minWidth: '65vw' }">
            <!-- เพศผู้สอน -->
            <div class="filter-group mb-3 pb-3 border-bottom border-2" :style="{backgroundColor: '',}">
              <div class="filter-title mb-3">เพศผู้สอน</div>
              <div class="filter-options d-flex justify-content-center" :style="{backgroundColor: ''}">
                <button
                  class="filter-button rounded-4 mx-5 px-3 button text-dark"
                  :class="{ selected: selectedGender.includes('ชาย') }"
                  @click="toggleGender('ชาย')"
                >
                  ชาย
                </button>
                <button
                  class="filter-button rounded-4 mx-5 px-3 button text-dark"
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
              <div class="filter-options d-flex justify-content-center" :style="{backgroundColor: ''}">
                <button
                  class="filter-button rounded-4 mx-5 px-3 button text-dark"
                  :class="{ selected: selectedPlace.includes('ออนไซต์') }"
                  @click="togglePlace('ออนไซต์')"
                >
                  ออนไซต์
                </button>
                <button
                  class="filter-button rounded-4 mx-5 px-3 button text-dark"
                  :class="{ selected: selectedPlace.includes('ออนไลน์') }"
                  @click="togglePlace('ออนไลน์')"
                >
                  ออนไลน์
                </button>
              </div>
              
            </div>
            <!-- ราคาต่อชั่วโมง -->
            <div class="filter-group mb-3 pb-3 border-bottom border-2">
              <div class="filter-title mb-3">ราคาต่อชั่วโมง</div>
              <div class="slider-container d-flex flex-column align-items-center justify-content-center" :style="{backgroundColor: '', height: 'auto', width: '100%'}">
                <div class="d-flex align-items-center justify-content-center" :style="{backgroundColor: '', height: 'auto', width: '50%'}">
                  <span class="price-box-label">ไม่เกิน</span>
                  <input type="number" v-model="price" class="price-box rounded-4 mx-2" :class="center"  min="0" max="9999" />
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
                  <input type="number" v-model="minRating" class="price-box rounded-4 mx-2" :class="center"  min="0" max="5" />

                  <span class="price-box-label">ขึ้นไป</span>
                </div>
                <div class="star-container">
                  <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= minRating }" @click="minRating = star">
                    ★
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tutor -->
        <div v-if="tutors.length > 0" class="container py-4" style="background-color: #E5DBD9;">
          <div class="row justify-content-center g-3">
            <div class="col-md-4" v-for="(tutor, index) in filteredTutors" :key="index">
              <router-link :to="'/tutor/profile/?id='+ tutor.tutor_id" style="text-decoration: none;">
                <div class="card shadow-sm text-center d-flex flex-column h-100" >
                  <div class="card-body">
                    <div class="rounded-circle bg-light mx-auto mb-3" style="width: 100px; height: 100px; overflow: hidden;">
                      <img :src="'http://localhost:3000' + tutor.portrait_path || require('@/assets/user.png')" alt="โปรไฟล์" class="img-fluid rounded-circle profile-img"/>
                    </div>
                    <div class="card-title h5"> 
                      {{ tutor.displayname }}
                      <div class="d-inline fowt-bold">
                        <i v-if="tutor.gender === 'ชาย'" class="bi bi-gender-male gender-male"></i>
                        <i v-else-if="tutor.gender === 'หญิง'" class="bi bi-gender-female gender-female"></i>
                      </div>
                    </div>
                    
                    <!-- วิชา -->
                    <div class="mb-3">
                      <span class="badge me-2 text-dark subject-text" 
                        v-for="(subject, index) in tutor.subject_names" 
                        :key="index" 
                        :style="{backgroundColor: this.categoryColors[tutor.categories?.[index]] ?? 'gray'}"
                      >
                        {{ subject }}
                      </span>
                    </div>
                    <p class="text-muted">
                      {{ truncateText(tutor.introduce_message, 200) }}
                    </p>
                    <div class="d-flex justify-content-center align-items-center gap-1">
                      <span v-for="star in Math.floor(tutor.rating_score)" :key="star" class="text-warning">★</span>
                      <span v-for="empty in (5 - Math.floor(tutor.rating_score))" :key="empty" class="text-secondary">★</span>
                      <span class="ms-2 text-muted">{{ formatScore(tutor.rating_score) }}/5</span>
                        <font-awesome-icon icon="chalkboard-teacher" class="text-primary mx-1" title="จำนวนครั้งที่สอน"/>
                        <span>{{formatScore(tutor.teaching_count)}}</span>
                        <font-awesome-icon icon="repeat" class="text-success mx-1" title="อัตราการกลับมาเรียนซ้ำ"/>
                        <span>{{formatScore(tutor.revisit_score)}} %</span>
                    </div>
                  </div>
                </div>
              </router-link>
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
        selectedCategory: "", // เก็บหมวดหมู่ที่ถูกเลือก
        selectedSubject: "",
        selectedSubjects: [],
        selectedGender: [], // เก็บค่าที่เลือก เช่น ['ชาย', 'หญิง']
        selectedPlace: [],
        price: null,
        minRating: 0,
        tutors: [],
        showfilter: false,
        categoryColors: {
          "ภาษา": "#A8D5BA",
          "วิชาการ": "#A7C7E7",
          "ดนตรี": "#F6C78A",
          "กีฬา": "#FFE7A1",
          "คอมพิวเตอร์": "#C4B0E4",
          "ทักษะชีวิต": "#B3D4E0",
          "พัฒนาวิชาชีพ": "#F3BFC3"
        },
        Language: "#A8D5BA",
        Education: "#A7C7E7",
        Music: "#F6C78A",
        Sports: "#FFE7A1",
        Computer: "#C4B0E4",
        LifeSkills: "#B3D4E0",
        Development: "#F3BFC3",
        searchQuery: "",
        subCategories: [
            // "คณิตศาสตร์",
            // "แคลคูลัส",
            // "ตรีโกณมิติ",
            // "เศรษฐศาสตร์",
            // "ฟิสิกส์",
            // "เคมี",
            // "ชีววิทยา",
            // "ประวัติศาสตร์"
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
      this.getTutors()
    },
    methods: {
      getTutors() {
        axios
          .get("http://localhost:3000/tutor/teacher/info", {
            params: {
              search: this.search,
            },
          })
          .then((response) => {
            this.tutors = response.data;
            console.log(this.tutors)
          })
          .catch((err) => {
            console.log(err);
          });
      },
      isSelected(subject) {
    return this.selectedSubjects.includes(subject);
    },
    formatScore(score) {
      const validScore = parseFloat(score);
      if (isNaN(validScore)) {
        return '0';
      }
      return validScore % 1 === 0 ? validScore.toFixed(0) : validScore.toFixed(1);
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
    togglePlace(place) {
      if (this.selectedPlace.includes(place)) {
        // ถ้ามีอยู่แล้ว ให้เอาออก
        this.selectedPlace = this.selectedPlace.filter((item) => item !== place);
      } else {
        // ถ้ายังไม่มี ให้เพิ่ม
        this.selectedPlace.push(place);
      }
    },
      filterCategory(category) {
      if(this.selectedCategory === category){
        this.selectedCategory = ""
        this.selectedSubjects = []
        axios.get("http://localhost:3000/category/subject", {params: {category: this.selectedCategory}})
          .then(() => {
              this.subCategories = {}
          })  
          .catch((err) => {
            alert(err.response.data.details.message);
          });   

      }else{
        this.selectedCategory = category;
        this.selectedSubjects = []
        axios.get("http://localhost:3000/category/subject", {params: {category: this.selectedCategory}})
          .then((res) => {
              this.subCategories = res.data
          })  
          .catch((err) => {
            alert(err.response.data.details.message);
          });   
      }
      
    },
    filterSubject(subject) {
      // this.selectedSubject = subject
      const index = this.selectedSubjects.indexOf(subject);
      if (index === -1) {
        this.selectedSubjects.push(subject);  // ถ้าไม่ได้เลือกเพิ่มเข้าไป
      } else {
        this.selectedSubjects.splice(index, 1);  // ถ้าเลือกแล้วให้ลบออก
      }
    },
      morefilter(){
        this.showfilter = true
    },
      hidefilter(){
        this.showfilter = false
    },
    truncateText(text, maxLength) {
      if (!text) return "";
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
    },
    computed:{
      filteredSubjects() {
      const search = this.searchQuery.toLowerCase();
      return this.subCategories.filter(subject =>
        subject.toLowerCase().includes(search)
      );
    },
      filteredTutors() {
      return this.tutors.filter(tutor => 
        (!this.selectedCategory || tutor.categories.includes(this.selectedCategory)) && // หมวดหมู่
        // (!this.selectedSubject || tutor.subject_names.includes(this.selectedSubject)) && // วิชา
        (this.selectedSubjects.length === 0 || this.selectedSubjects.some(subject => tutor.subject_names.includes(subject))) && // วิชา
        (this.selectedPlace.length === 0 || this.selectedPlace.some(place => tutor.places.includes(place))) && // สถานที่
        (this.selectedGender.length === 0 || this.selectedGender.includes(tutor.gender)) && // เพศ
        (this.price == 0 || !this.price || tutor.max_price <= this.price) && // ราคา
        (this.minRating == 0 || !this.minRating || tutor.rating_score >= this.minRating)
      );
    },
    },
    watch: {
      $route(to, from) {
        this.previousRoutes.push(from); // เมื่อมีการเปลี่ยนเส้นทางใหม่ ให้เก็บเส้นทางก่อนหน้าลงในอาร์เรย์
      },
      price(newValue) {
        if (newValue < 0) {
          this.price = 0;
        } else if (newValue > 9999) {
          this.price = 9999;
        }
      },
      minRating(newValue) {
        if (newValue < 0) {
          this.minRating = 0;
        } else if (newValue > 5) {
          this.minRating = 5;
        }
      }
    },
  };
  </script>

<style>
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
  height: auto;
  text-align: center;
  transition: transform 0.2s;
}

.category:hover {
  transform: scale(1.05);
  cursor: pointer; /* แสดงให้รู้ว่าเป็นปุ่ม */
}

.category-icon {
  width: 3vw; /* ขนาดไอคอน */
  height: 3vw;
  min-width: 30px;
  min-height: 30px;
}

.category-label {
  font-size: clamp(16px, 2vw, 2vw);
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
.filter-text{
  font-size: clamp(16px, 1.6vw, 25px);
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
  font-size: clamp(16px, 1.5vw, 1.5vw);
}

.filter-options {
  width: 50%; /* ความกว้างของ filter-options ตาม container */
  height: 100%;
}

.filter-button {
  font-size: clamp(16px, 1.5vw, 1.5vw);
  width: auto; /* ขนาดกล่อง */
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid black; /* กรอบ */
  background-color: #f9f9f9; /* สีพื้นหลัง */
  text-align: center;
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
  color: white;
}

.price-box {
  font-size: clamp(16px, 1.5vw, 1.5vw);
  width: 6vw; /* ขนาดกล่อง */
  min-width: 60px;
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
  font-size: clamp(16px, 1.5vw, 1.5vw);
}

.range-label{
  width: 10vw;
  text-align: center;
  font-size: clamp(16px, 1.5vw, 1.5vw);
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
.card-text{
  font-size: clamp(16px, 1vw, 1vw);
}
.subject-text{
  font-size: 12px;
}
.card:hover {
  transform: scale(1.05);
  cursor: pointer; /* แสดงให้รู้ว่าเป็นปุ่ม */

}
.form-label{
    font-weight: 500;
  }
  
.gender-male {
  color: skyblue;
  font-size: 1.5rem;
}

.gender-female {
  color: pink;
  font-size: 1.5rem;
}
.profile-img {
  width: 100%;   /* ทำให้รูปขยายเต็มขนาดของ div */
  height: 100%;  /* ทำให้รูปเต็มขนาดของ div */
  object-fit: cover; /* ป้องกันภาพบิดเบี้ยว และครอบรูปให้อยู่ในกรอบ */
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


</style>
  