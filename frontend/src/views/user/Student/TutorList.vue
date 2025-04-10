<template>
    <div id="app">
        <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
          <div class="fw-bold text-center" style="font-size: 2.5vw;">ประวัติการเรียน</div>
        </div>
        <div v-for="(tutor, index) in tutors" :key="index" class="container-fluid rounded-4 border border-dark p-1 py-2 mb-5" :style="{ backgroundColor: 'white' , lineHeight: '1.2'  }" style="width: 80vw;">
          <div class="row" :style="{ backgroundColor: '' }">
            <div class="col-3" style="" :style="{ backgroundColor: '' }">
              <section class="container mt-4">
                      <div class="content">
                        <div class="file d-flex flex-column justify-content-center align-items-end">
                          <!-- แสดงภาพตัวอย่าง -->
                          <router-link :to="'/tutor/profile/?id='+ tutor.tutor_id" style="text-decoration: none;">
                            <div :class="center" style="height:10vw; width: 10vw; background-color: white; border: 1px solid black; overflow: hidden;">     
                              <img :src="'http://localhost:3000' + tutor.portrait_path || require('@/assets/user.png')" alt="โปรไฟล์" 
                              style="width: 100%; height: 100%; object-fit: cover;"
                            />
                            </div>
                          </router-link>
                          
                        </div>
                      </div>
              </section>
            </div>
            <div class="col-9" :style="{ backgroundColor: '' }">
              <section class="container mt-4" style="font-size: 1.5vw;">
                   <!-- ชื่อผู้ใช้งาน -->
                   <div class="row my-2">
                      <div class="form-group col-8 d-flex" :style="{ backgroundColor: '' }">
                        <label class="form-label fw-bold m-0" :style="{ fontSize: '2vw' }" for="tutorname">{{tutor.displayname}}</label>
                        <div class="ms-3">
                            <span v-for="star in Math.floor(tutor.rating_score)" :key="star" class="text-warning" :style="{ fontSize: '2vw' }">★</span>
                            <span v-for="empty in (5 - Math.floor(tutor.rating_score))" :key="empty" class="text-secondary" :style="{ fontSize: '2vw' }">★</span>
                            <small class="ms-1" :style="{ fontSize: '2vw' }">{{ formatScore(tutor.rating_score)}}/5</small>
                        </div>
                      </div>
                      <div class="form-group col-4 d-flex" :style="{ backgroundColor: '' }">
                        <div class="">
                          <div class="fw-bold">
                            วันที่เริ่มเรียนครั้งแรก
                          </div>  
                          {{ formatTimestamp(tutor.first_approve_timestamp) }}
                        </div>
                      </div>
                    </div>

                    <!-- วิชาที่สอน -->
                    <div class="d-flex align-items-center">

                      <div class="" :style="{ fontSize: '2vw', whiteSpace: 'nowrap' }">วิชาที่เรียน</div>
                      <div class="m-2" style="background-color: '';">
                          <span class="badge m-1 text-dark"  
                          v-for="(subject, index) in parseSubjects(tutor)" 
                          :key="index" 
                          :style="{backgroundColor: categoryColors[parseCategories(tutor)[index]], fontSize: '1vw'}"
                        >
                          {{ subject}}
                        </span>
                      </div>
                    </div>
                    <!-- แนะนำตัว -->
                    <div class="row my-2">
                      <div class="form-group col-8 d-flex align-items-center">
                        <p class="my-2" :style="{ fontSize: '1vw' }">
                          {{ tutor.introduce_message }}
                        </p>
                      </div>
                    </div>



                    
                        <!-- ช่องทางการติดต่อ -->
                        <div class="d-flex align-items-center">
                        <!-- ไอคอน Facebook -->
                          <img class="LinkIcon" :src="require('@/assets/facebook.png')" alt="Facebook" width="5%" height="auto" 
                            @click="openFacebookInNewTab(tutor.facebook_link)"
                          />
                        <!-- ไอคอน LINE -->
                          <img class="LinkIcon mx-4 me-2" :src="require('@/assets/line.png')" alt="Line" width="5%" height="auto"
                            @click="openLineInNewTab(tutor.line_id)"
                          />
                          <div :style="{ fontWeight: '400', fontSize: '1.5vw'}">:{{ tutor.line_id }}</div>
                          <div class="ms-4 fw-light" :style="{ fontWeight: '400', fontSize: '1.5vw'}">เบอร์ติดต่อ: <i>{{ tutor.phone }}</i></div>
                        </div>

                     <!-- ส่งข้อความ -->
                     <div class="row mt-3">
                      <div class="form-group col-8 d-flex align-items-center">
                        <div class="button rounded-3 me-5 bg-dark text-light fw-bold" :style="{}" @click="chat(tutor.account_id)">
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
  import axios from "axios";
  import useVuelidate from "@vuelidate/core";
  import {
    required,
  } from "@vuelidate/validators";

  export default {
    name: "TutorListPage",
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    data() {
      return {
        tutors: [],
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
        },
        categoryColors: {
          "ภาษา": "#A8D5BA",
          "วิชาการ": "#A7C7E7",
          "ดนตรี": "#F6C78A",
          "กีฬา": "#FFE7A1",
          "คอมพิวเตอร์": "#C4B0E4",
          "ทักษะชีวิต": "#B3D4E0",
          "พัฒนาวิชาชีพ": "#F3BFC3"
        },
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
      this.getTutors()
    },
    methods: {
    formatScore(score) {
      const validScore = parseFloat(score);
      if (isNaN(validScore)) {
        return '0';
      }
      return validScore % 1 === 0 ? validScore.toFixed(0) : validScore.toFixed(1);
    },
    getTutors() {
        const data = {
            account_id: this.$cookies.get("account").account_id,
          };
        axios.post("http://localhost:3000/student/tutorlist", data)
          .then((res) => {
              this.tutors = res.data.tutors
          })  
          .catch((err) => {
            alert(err.response.data.details.message);
          });   
    },
    parseSubjects(tutor) {
    return tutor.subject_list.split(', ');
    },
    parseCategories(tutor) {
      return tutor.category_list.split(', ');
    },
    formatTimestamp(timestamp) {
      if(!timestamp) return " ";
        const date = new Date(timestamp);
        return date.toLocaleString('th-TH');
    },
    formatText(text) {
        return text.replace(/\n/g, "<br>");
    },
    openFacebookInNewTab(facebook) {
      window.open(facebook, '_blank');
    },
    openLineInNewTab(line) {
      window.open('https://line.me/ti/p/~'+line, '_blank');
    },

    setRating(n) {
        this.currentRating = n;
    },
    submit() {
        // // Validate all fields
          this.v$.$touch();
   
    },
    chat(account_id){
      this.$router.push({ name: 'ChatPage'});
      this.$cookies.set("sender_id", this.$cookies.get('account').account_id);
      this.$cookies.set("receiver_id", account_id);
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
.LinkIcon{
  transition: transform 0.2s ease;
  
}
.LinkIcon:hover{
  transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ hover */
  cursor: pointer; /* แสดงให้รู้ว่าเป็นปุ่ม */
}
.information{
  font-size: 1.2vw;
}
</style>