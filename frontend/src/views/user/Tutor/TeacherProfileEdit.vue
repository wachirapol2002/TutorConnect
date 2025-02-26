<template>
    <div id="app">
        <div class="container-fluid rounded-4  border border-dark my-5 p-3 py-4" :style="{ backgroundColor: 'white' }" style="width: 80vw;">
            <!-- ส่วนข้อมูลของผู้สอน -->
            <div class="d-flex justify-content-start align-items-center" :style="{ backgroundColor: '' }">
                <div :class="center" class="m-0 p-0" style="width: 25vw;" :style="{ backgroundColor: '' }">
                <!-- รูปโปรไฟล์ -->
                    <div class="m-0 rounded-circle bg-light" :class="center" :style="{ backgroundColor: 'white' }" style="height:13vw; width: 13vw; background-color: white; border: 1px solid black; overflow: hidden;">
                        <img :src="'http://localhost:3000' + this.tutor.portrait_path || require('@/assets/user.png')" alt="โปรไฟล์" class="img-fluid rounded-circle profile-img" />
                    </div>
                </div>
                <div class="container" style="width: 40vw;" :style="{ backgroundColor: '' }">
                    <!-- ชื่อผู้สอน -->
                    <div class="d-flex align-items-center">
                        <div class="fw-bold" :style="{ fontSize: '2vw' }">{{ tutorName }}</div>
                        <!-- ดาวและคะแนน -->
                        <div class="ms-3">
                            <span v-for="star in Math.floor(this.rating_score)" :key="star" class="text-warning" :style="{ fontSize: '2vw' }">★</span>
                            <span v-for="empty in (5 - Math.floor(this.rating_score))" :key="empty" class="text-secondary" :style="{ fontSize: '2vw' }">★</span>
                            <small class="ms-1" :style="{ fontSize: '2vw' }">{{ this.rating_score}}/5</small>
                        </div>
                    </div>
                    <!-- วิชาที่สอน -->
                    <div class="d-flex align-items-center">

                        <div class="" :style="{ fontSize: '2vw', whiteSpace: 'nowrap' }">วิชาที่สอน</div>
                        <div class="m-2" style="background-color: '';">
                            <span class="badge m-1 text-dark"  
                            v-for="(subject, index) in subjects" 
                            :key="index" 
                            :style="{backgroundColor: this.categoryColors[subject.category], fontSize: '1vw'}"
                          >
                            {{ subject.subject_name}}
                          </span>
                        </div>
                    </div>
                    <!-- แนะนำตัว -->
                    <div class="d-flex align-items-center" :style="{ fontSize: '1.5vw'}" style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">
                        <p v-html="formatText(introduce)" class="my-2" ></p>
                    </div>
                    <!-- ช่องทางการติดต่อ -->
                    <div class="d-flex align-items-center">
                        <!-- ไอคอน Facebook -->
                        <img class="LinkIcon" :src="require('@/assets/facebook.png')" alt="Facebook" width="5%" height="auto" 
                          @click="openFacebookInNewTab"
                        />
                        <!-- ไอคอน LINE -->
                        <img class="LinkIcon mx-4 me-2" :src="require('@/assets/line.png')" alt="Line" width="5%" height="auto"
                          @click="openLineInNewTab"
                        />
                        <div :style="{ fontWeight: '400', fontSize: '1.5vw'}">:{{ this.line }}</div>
                        <div class="ms-4 fw-light" :style="{ fontWeight: '400', fontSize: '1.5vw'}">เบอร์ติดต่อ: <i>{{ this.tutor.phone }}</i></div>
                        
                    </div>
                    <!-- ปุ่มส่งข้อความ -->
                    <div class="d-flex align-items-center mt-3">
                      <div class="button rounded-3 me-5 bg-dark text-white fw-bold" :style="{}" @click="back()">
                          ยกเลิก
                      </div>
                      <div class="button rounded-3 me-5 bg-dark text-white fw-bold" :style="{}" @click="chat()">
                          บันทึกข้อมูล
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
                <div class="information mt-2">
                  <ul>
                      <li v-html="formatText(describe)"></li>
                  </ul>
                </div>
                <!-- ประวัติการศึกษา -->
                <div class="mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}">ประวัติการศึกษา</div>
                <div class="information">
                  <ul v-if="graduates.length" >
                    <li v-for="(graduate) in graduates" 
                      :key="graduate.graduate_id"
                      class="d-flex justify-content-start align-items-center my-2"
                    >
                      <div class="col-12">
                        {{ graduate.status + " " + graduate.degree + " " + graduate.school_name + " " + graduate.honor + " " + graduate.grade}}
                      </div>

                    </li>
                  </ul>
                </div>
                

                <!-- สถานที่สอน -->
                <div class="mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}">สถานที่สอน</div>
                <div class="information mt-2">
                  <ul>
                      <li>ออนไลน์</li>
                  </ul>
                </div>
                

                <!-- หัวข้อการสอนและราคา -->
                <div class="mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}">หัวข้อการสอนและราคา</div>
                <!-- <div class="information mt-2">
                  <ul v-if="subjects.length" >
                    <li v-for="(subject, index) in subjects" 
                      :key="subject.subject_id"
                      class="d-flex justify-content-start align-items-center my-2"
                    >
                      <div class="col-1 text-center" :class="center">
                        <button type="button" @click="enrollSubject(subject.subject_id)" class="button btn btn-success btn-sm fw-bold text-light">สมัครเรียน</button>
                      </div>
                      <div class="col-10">
                        {{ subject.subject_name + " " + subject.degree_level}}
                        <strong>{{ subject.price }} บาท/ชั่วโมง</strong>
                      </div>
                      <div class="col-1 text-center" :class="center">
                        <button type="button" @click="SubjectDescribe(index)" class="button btn btn-warning btn-sm fw-bold text-dark">รายละเอียดเพิ่มเติม</button>
                      </div>
                    </li>
                  </ul>
                </div> -->

                <div class="information mt-2">
                  <ul v-if="unStudySubjects.length" class="m-0 p-0">
                    <li v-for="(subject, index) in unStudySubjects" 
                      :key="subject.subject_id"
                      class="d-flex justify-content-start align-items-center my-2"
                    >
                      <div class="col-1 text-center bg-light" :class="center">
                        <!-- ✅ เช็คเงื่อนไข status -->
                        <button 
                          v-if="!subject.status" 
                          type="button" 
                          @click="enrollSubject(subject.subject_id)" 
                          class="button btn btn-success btn-sm fw-bold text-light w-100"
                        >
                          สมัครเรียน
                        </button>

                        <button 
                          v-else-if="subject.status === 'รออนุมัติ'" 
                          type="button" 
                          @click="cancelEnroll(subject.subject_id, subject.study_id)" 
                          class="button btn btn-danger btn-sm fw-bold text-light w-100"
                        >
                          ยกเลิกสมัคร
                        </button>
                      </div>

                      <div class="col-10">
                        <div class="ms-3">
                        {{ subject.subject_name + " " + subject.degree_level }}
                        <strong>{{ subject.price }} บาท/ชั่วโมง</strong>
                        </div>
                      </div>

                      <div class="col-1 text-center" :class="center">
                        <button 
                          type="button" 
                          @click="unSubjectDescribe(index)" 
                          class="button btn btn-secondary btn-sm fw-bold text-light"
                        >
                          รายละเอียดเพิ่มเติม
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>

                <!-- รายละเอียดวิชา -->
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

            <!-- ให้คะแนนวิชา -->
            <div v-if="showSubjectRating" class="popup-overlay">
              <div class="popup">
                <div class="mb-2" style="font-size: 2vw;">ประเมินการสอน</div>

                <div class="row my-2">
                  <div class="col-2" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">รหัสวิชา:</strong> {{ subjectDetail.subject_id }}</div>
                  <div class="col-6" style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">ผู้สอน:</strong> {{ subjectDetail.displayname }}</div>
                </div>
                <div class="my-2">
                  <div style="font-size: 1.2vw;"><strong style="font-size: 1.1vw;">หัวข้อ:</strong>{{" "+subjectDetail.subject_name + " " + subjectDetail.degree_level}}</div>
                </div>
                <div class="mt-4">
                    <div v-if="this.currentSubjectRating<=0" class="fw-bold" style="font-size: 1.4rem;">ให้คะแนนวิชาสอน</div>
                    <div v-if="this.currentSubjectRating>0" class="fw-bold" style="font-size: 1.4rem;">ให้คะแนนวิชา {{ this.currentSubjectRating }} ดาว</div>
                    <div id="rating" class="d-flex align-items-center">
                        <!-- ดาว -->
                        <span v-for="n in 5" :key="n" @click="setSubjectRating(n, subjectDetail.study_id, subjectDetail.subject_id)" :class="{'text-warning': n <= this.currentSubjectRating}" 
                            class="me-2 fs-3" style="cursor: pointer;">★</span>
                    </div>
                </div>
                <div class="d-flex justify-content-end mt-3">
                  <button @click="closePopup" class="btn btn-secondary">ปิด</button>
                </div>
              </div>
            </div>

            </div>
        </div>


        <!-- ความคิดเห็นที่แสดง -->
        <div class="mt-5">
            <div class="fw-bold" style="font-size: 1.5rem;">ความคิดเห็นผู้เรียน</div>
            <div v-for="(comment, index) in comments" :key="comment.comment_id" class="comment-card p-4 py-3 my-4">
                <div class="row">
                    <!-- รูปโปรไฟล์ -->
                    <div class="col-1">
                      <img :src="'http://localhost:3000' + comment.portrait_path || require('@/assets/user.png')" 
                          alt="โปรไฟล์" class="comment-img profile-img">
                    </div>
                    <!-- ข้อความความคิดเห็น -->
      
                      <div class="col-11">
                        <div class="comment-content p-0">
                          <div class="row" style="font-size: 1.4vw;">
                            <div class="d-flex justify-content-between align-items-center">
                            <div class="">
                              <strong class="comment-name">{{ comment.firstname }} {{ comment.lastname+" "+" " }}</strong>
                              {{ " "+formatTimestamp(comment.timestamp) }}
                            </div>
                            <button v-if="comment.account_id === this.account_id" @click="deleteComment(comment.comment_id, index)"  class="btn btn-danger btn-sm">
                                ลบ
                            </button>
                          </div>
                          </div>
                          <div class="row comment-box mt-2 p-2" style="font-size: 1.2vw;">
                            <div class="comment-text" v-html="formatText(comment.message)"></div>
                          </div>    
                        </div>
                      </div>
                </div>
            </div>
        </div>


    </div>
</template>
  
  <script>
  import dayjs from 'dayjs';
  import axios from "axios";
  import useVuelidate from "@vuelidate/core";
  import {
    required,
  } from "@vuelidate/validators";

  export default {
    name: "TeacherProfileEditPage",
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    data() {
      return {
        tutor_id: this.$cookies.get('account').tutor_id,
        account_id: this.$cookies.get('account').account_id,
        comments: [],
        imageUrl: null, // เก็บ URL ภาพที่อัปโหลด
        previousRoutes: [],
        mainColor: "#BC2C2C",
        tutor: "",
        rating_score: "",
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
        selectedCategory: "", // หมวดวิชาที่เลือก
        subjectName: "", // ชื่อวิชาที่กรอก
        subjects: [], // Array เก็บวิชาที่เพิ่ม
        graduates: [],
        showSubjectDetail: false,
        showSubjectRating: false,
        subjectDetail: {},
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
      this.initInfo()
    },
    computed: {
    unStudySubjects() {
      return this.subjects.filter(subject => subject.status !== 'อนุมัติคำขอ');
    },
    studySubjects() {
      return this.subjects.filter(subject => subject.status == 'อนุมัติคำขอ');
    }
  },
    methods: {
    formatText(text) {
        return text.replace(/\n/g, "<br>");
    },
    formatTimestamp(timestamp) {
      return dayjs(timestamp).format('DD-MM-YYYY HH:mm:ss');
    },
    openFacebookInNewTab() {
      window.open(this.tutor.facebook_link, '_blank');
    },
    openLineInNewTab() {
      window.open('https://line.me/ti/p/~'+this.tutor.line_id, '_blank');
    },
    initInfo() {
        const data = {
            tutor_id: this.tutor_id
          };
        axios.post("http://localhost:3000/tutor/teacher/info", data)
        
          .then((res) => {
              this.tutor= res.data.tutor
              this.rating_score = res.data.tutor.rating_score
              this.tutor_id = res.data.tutor.tutor_id
              this.tutorName = res.data.tutor.displayname
              this.facebook = res.data.tutor.facebook_link
              this.line = res.data.tutor.line_id
              this.introduce = res.data.tutor.introduce_message
              this.describe = res.data.tutor.description
              return axios.post("http://localhost:3000/tutor/graduate", { tutor_id: this.tutor.tutor_id });
          })  
          .then((res) => {
            this.graduates = res.data.graduates;
            return axios.post("http://localhost:3000/student/subject", { tutor_id: this.tutor.tutor_id, account_id: this.account_id});
          })
          .then((res) => {
            this.subjects = res.data.subjects;
            console.log(this.subjects)
            return axios.post("http://localhost:3000/tutor/comment", { tutor_id: this.tutor.tutor_id });
          })
          .then((res) => {
            this.comments = res.data.comments;
            return axios.post("http://localhost:3000/student/getRating", { tutor_id: this.tutor.tutor_id, account_id: this.account_id});
          })
          .then((res) => {
            this.currentRating = res.data.score;
          })
          .catch((err) => {
            alert(err.response.data.details.message);
          });   
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
    chat(){
      this.$router.push({ path: "/chat" });
    },
    handleKeydown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault(); // ป้องกันการสร้างบรรทัดใหม่
          this.sendMessage(); // เรียกฟังก์ชันส่งข้อความ
        }
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
      enrollSubject(subject_id) {
        const data = {
            tutor_id: this.tutor_id,
            account_id: this.account_id,
            subject_id: subject_id,
          };
          axios
            .post("http://localhost:3000/student/subject/register", data)
            .then(() => {
              alert("ส่งคำขอไปที่ผู้สอนแล้ว");
              return axios.post("http://localhost:3000/student/subject", { tutor_id: this.tutor.tutor_id, account_id: this.account_id});
            })
            .then((res) => {
              this.subjects = res.data.subjects;
            })
            .catch((err) => {
              alert(err.response.data.message);
            });
      },
      cancelEnroll(subject_id, study_id) {
        const data = {
            study_id: study_id,
            tutor_id: this.tutor_id,
            account_id: this.account_id,
            subject_id: subject_id,
          };
          axios
            .post("http://localhost:3000/student/subject/cancelRegister", data)
            .then(() => {
              alert("ยกเลิกสมัครเรียนแล้ว");
              return axios.post("http://localhost:3000/student/subject", { tutor_id: this.tutor.tutor_id, account_id: this.account_id});
            })
            .then((res) => {
              this.subjects = res.data.subjects;
            })
            .catch((err) => {
              alert(err.response.data.message);
            });
      },
    unSubjectDescribe(index) {
      // ดึงข้อมูลวิชาจาก index
      this.subjectDetail = this.unStudySubjects[index]; // เก็บข้อมูลใน subjectDetail
      this.showSubjectDetail = true; // เปิด popup
    },
    SubjectDescribe(index) {
      // ดึงข้อมูลวิชาจาก index
      this.subjectDetail = this.studySubjects[index]; // เก็บข้อมูลใน subjectDetail
      this.showSubjectDetail = true; // เปิด popup
    },
    SubjectRating(index, study_id) {
      console.log(study_id)
      // ดึงข้อมูลวิชาจาก index
      const subject = this.studySubjects[index];
      this.subjectDetail = subject; // เก็บข้อมูลใน subjectDetail
      axios.post("http://localhost:3000/student/subject/rating/view", {study_id: study_id})
            .then((res) => {
              console.log(res.data.rating)
              this.currentSubjectRating = res.data.rating;
            })
            .catch((err) => {
              alert(err.response.data.message);
            });
      this.showSubjectRating = true; // เปิด popup
    },
    closePopup() {
      this.showSubjectDetail = false; // ปิด popup
      this.showSubjectRating = false;
    },
  
      submit() {
        // // Validate all fields
          this.v$.$touch();
   
        },
  
      back() {
        this.$router.push({ path: "/teacher/profile" });
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

.comment-card {
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-img {
    width: 5vw;
    height: 5vw;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ddd;
}

.comment-box {
    background: #f8f9fa; /* พื้นหลังสีเทาอ่อน */
    border: 2px solid #ddd; /* ขอบสีเทา */
    border-radius: 0.5vw; /* ทำให้ขอบโค้งมน */
    font-size: 1.2vw;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* เพิ่มเงาเบาๆ */
}

.delete-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: red;
    transition: 0.2s;
}

.delete-btn:hover {
    transform: scale(1.2);
}
</style>