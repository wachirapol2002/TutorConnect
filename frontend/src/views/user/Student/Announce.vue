<template>
    <div id="app">
        <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
        
          <div class="fw-bold text-center" style="font-size: 5vh;">ประกาศหาติวเตอร์</div>
       
        </div>
        <div class="container-fluid rounded-4  border border-dark p-0 py-4 d-flex flex-column justify-content-center align-items-center" :style="{ backgroundColor: 'white' }" style="width: 80vw;">
          <div class="mb-3" :class="center" :style="{fontSize: '2vw',}">เขียนประกาศ</div>
            <div clas="container" style="width: 70%; font-size: 1.5vw;" :style="{ backgroundColor: '' }">
              <form name="Register">
                <!-- วิชา -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วิชาที่ต้องการเรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <!-- <input
                      class="form-control"
                      :style="{fontSize: '1.2vw',}"
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      placeholder="วิชาที่ต้องการหาคนมาสอน"
                      v-model="subject"
                    /> -->
                    <input v-model="subject" class="form-control" :style="{ fontSize: '1.2vw' }" list="subjectsList" required  placeholder="วิชาที่ต้องการหาคนมาสอน"/>
                    <datalist id="subjectsList">
                      <option v-for="subject in subjects" :key="subject" :value="subject"></option>
                    </datalist>

                  </div>
                </div>
                <!--สถานที่  -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">กำหนดสถานที่</div>
                  </div>
                  <div class="form-group col-8">
                    <!-- <input
                      class="form-control"
                      :style="{fontSize: '1.2vw',}"
                      type="text"
                      id="place"
                      name="place"
                      required
                      placeholder="สถานที่เรียน (ชื่อสถานที่, จังหวัด, ออนไลน์)"
                      v-model="place"
                    /> -->
                    <input v-model="place" class="form-control" :style="{ fontSize: '1.2vw' }" list="placesList" required  placeholder="ระบุสถานที่"/>
                    <datalist id="placesList">
                      <option v-for="place in places" :key="place" :value="place"></option>
                    </datalist>

                    <!-- <select v-model="place" class="form-control" :style="{ fontSize: '1.2vw' }" required>
                      <option value="" disabled>เลือกสถานที่</option>
                      <option v-for="place in places" :key="place" :value="place">
                        {{ place }}
                      </option>
                    </select> -->
                   

                  </div>
                </div>
                <!--อายุ  -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">ช่วงอายุของผู้เรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <!-- <input
                      class="form-control"
                      :style="{fontSize: '1.2vw',}"
                      type="text"
                      id="age"
                      name="age"
                      required
                      placeholder="อายุ หรือ ระดับการศึกษา"
                      v-model="age"
                    /> -->
                    <select v-model="age" class="form-control" :style="{ fontSize: '1.2vw' }" required>
                      <option value="" disabled>เลือกระดับผู้เรียน</option>
                      <option v-for="age in ages" :key="age" :value="age">
                        {{ age }}
                      </option>
                    </select>
                  </div>
                </div>

                <!--วันที่สะดวก -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วันที่สะดวก</div>
                  </div>
                  <div class="form-group col-8">
                    <!-- <input
                      class="form-control"
                      :style="{fontSize: '1.2vw',}"
                      type="text"
                      id="day"
                      name="day"
                      required
                      placeholder="ระบุวันจันทร์-วันอาทิตย์"
                      v-model="day"
                    /> -->
                    <div class="border rounded p-2" style="max-height: 20vh; overflow-y: auto;">
                    <div class="form-check" v-for="day in days" :key="day">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :id="day" 
                        :value="day" 
                        v-model="selectedDays"
                        placeholder="ระบุวันจันทร์-วันอาทิตย์"
                      />
                      <label class="form-check-label" :for="day" :style="{ fontSize: '1.2vw' }">{{ day }}</label>
                    </div>
                  </div>

                  </div>
                </div>
                
                <!--ช่วงเวลา -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">ช่วงเวลา</div>
                  </div>
                  <div class="form-group col-8">
                    <!-- <input
                      class="form-control"
                      :style="{fontSize: '1.2vw',}"
                      type="text"
                      id="time"
                      name="time"
                      required
                      placeholder="ระบุเวลา หรือช่วงเวลา (เช้า, เย็น)"
                      v-model="time"
                    /> -->
                    <select v-model="time" class="form-control" :style="{ fontSize: '1.2vw' }" required>
                      <option value="" disabled>เลือกเวลา</option>
                      <option v-for="time in times" :key="time" :value="time">
                        {{ time }}
                      </option>
                    </select>
                  </div>
                </div>

                <!--รูปแบบการเรียน -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">รูปแบบการเรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <!-- <input
                      class="form-control"
                      :style="{fontSize: '1.2vw',}"
                      type="text"
                      id="learning"
                      name="learning"
                      required
                      placeholder="ตัวต่อตัว, เป็นกลุ่ม, อื่น ๆ"
                      v-model="learning"
                    /> -->
                    <select v-model="learning" class="form-control" :style="{ fontSize: '1.2vw' }" required>
                      <option value="" disabled>เลือกรูปแบบการเรียน</option>
                      <option v-for="learning in learnings" :key="learning" :value="learning">
                        {{ learning }}
                      </option>
                    </select>
                  </div>
                </div>

                <!--เริ่มเรียนได้ -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วันที่เริ่มเรียนได้</div>
                  </div>
                  <div class="form-group col-8">
                    <input
                      class="form-control"
                      :style="{fontSize: '1.2vw',}"
                      type="date"
                      id="start"
                      name="start"
                      required
                      placeholder="ระบุวันที่"
                      v-model="start"
                    />
                  </div>
                </div>

                 <!--เป้าหมาย -->
                 <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">เป้าหมายการเรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <input
                      class="form-control"
                      :style="{fontSize: '1.2vw',}"
                      type="text"
                      id="objective"
                      name="objective"
                      required
                      placeholder="เป้าหมายการเรียนหรือสิ่งที่คาดหวัง"
                      v-model="objective"
                    />
                  </div>
                </div>
                <div class="form-group d-flex justify-content-center">
                  <div class="button rounded-3 my-4 px4- mx-2 text-light" :style="{backgroundColor: mainColor,}" @click="submit()">
                    ลงประกาศ
                  </div>
                </div>
              </form>
            </div>
        </div>






        <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
          <div class="fw-bold text-center" style="font-size: 5vh;">ประกาศที่เคยลง</div>
        </div>



        <div v-for="(announce, index) in announces" :key="index" class="container-fluid rounded-4 border border-dark my-0 p-0 d-flex flex-column justify-content-center align-items-center mt-5" :style="{ backgroundColor: 'white' }" style="width: 80vw; overflow: hidden;">
          
          <div class="row rounded-top border-bottom border-1 border-dark" :style="{ backgroundColor: '#D9D9D9' }" style="width: 100%; font-size: 1.5vw; ">  
            <div class="col-12">หมายเลขประกาศ {{ announce.announce_id }}</div>
          </div>
            <div clas="container" style="width: 70%; font-size: 1.5vw;" :style="{ backgroundColor: '' }">
              <form name="Register">
                <!-- ผู้ลงประกาศ -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">ผู้ลงประกาศ</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{ announce.firstname+" "+announce.lastname}}</div>
                  </div>
                </div>
                <!-- วิชา -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วิชาที่ต้องการเรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{ announce.subject_to_learn}}</div>
                  </div>
                </div>
                <!--สถานที่  -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">กำหนดสถานที่</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{ announce.place_to_learn}}</div>
                  </div>
                </div>
                <!--อายุ  -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">ช่วงอายุของผู้เรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{ announce.student_age}}</div>
                  </div>
                </div>

                <!--วันที่สะดวก -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วันที่สะดวก</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{ announce.convenient_day}}</div>
                  </div>
                </div>
                
                <!--ช่วงเวลา -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">ช่วงเวลา</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{ announce.convenient_time}}</div>
                  </div>
                </div>

                <!--รูปแบบการเรียน -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">รูปแบบการเรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{ announce.learning_style}}</div>
                  </div>
                </div>

                <!--เริ่มเรียนได้ -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วันที่เริ่มเรียนได้</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{formatTimestamp(announce.starting_time) }}</div>
                  </div>
                </div>

                 <!--เป้าหมาย -->
                 <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">เป้าหมายการเรียน</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{ announce.objective}}</div>
                  </div>
                </div>
                
                <!--เป้าหมาย -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-4">
                    <div class="mx-2">วันที่ลงประกาศ</div>
                  </div>
                  <div class="form-group col-8">
                    <div class="mx-2">{{formatTimestamp(announce.timestamp)}}</div>
                  </div>
                </div>

                <!--ปุ่ม -->
                <div class="row my-3" :class="center">
                  <div class="form-group col-10">
                  </div>
                  <div class="form-group col-2">
                    <div class="button rounded-3 text-light" :style="{backgroundColor: mainColor,}" @click="del()">
                      ลบประกาศ
                    </div>
                  </div>
                </div>
              </form>

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
    email,
    minLength,
    maxLength,
    sameAs,
    helpers,
  } from "@vuelidate/validators";


    function phone(value) {
    return !helpers.req(value) || !!value.match(/0[0-9]{9}/);
  }

  function complexPassword(value) {
    if (value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/)) {
      return true;
    }
    return false;
  }

  export default {
    name: "StudentAnnouncePage",
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    data() {
      return {
        account_id: this.$cookies.get("account").account_id,
        imageUrl: require('@/assets/user.png'), // เก็บ URL ภาพที่อัปโหลด
        previousRoutes: [],
        mainColor: "#BC2C2C",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        firstname: "",
        lastname: "",
        genders: ["ชาย", "หญิง", "ไม่ระบุ"], // หมวดวิชาที่มีให้เลือก
        selectedGender: "", // หมวดวิชาที่เลือก
        gender: null,
        showpassword: false,
        error: "",
        center: {
          "d-flex": true,
          "justify-content-center": true,
          "align-items-center": true,
        },
        red:{
          backgroundColor: 'red'
        },
        announces: [],
        subjects:[
        "คณิตศาสตร์",
        "ฟิสิกส์",
        "เคมี",
        "ชีววิทยา",
        "ภาษาอังกฤษ",
        "ภาษาจีน",
        "ภาษาญี่ปุ่น",
        "ภาษาเกาหลี",
        "การเขียนโปรแกรม (Python, JavaScript, Java, C++)",
        "ออกแบบกราฟิก (Photoshop, Illustrator)",
        "UX/UI Design",
        "Data Science และ AI",
        "ดนตรี (กีตาร์, เปียโน, ไวโอลิน, กลอง)",
        "ศิลปะ (วาดภาพ, ระบายสี, ดิจิทัลอาร์ต)",
        "การเขียนเรียงความและติวสอบเข้า",
        "การพูดในที่สาธารณะ (Public Speaking)",
        "การเงินและการลงทุน",
        "การตลาดออนไลน์และโซเชียลมีเดีย",
        "การพัฒนาตนเองและทักษะชีวิต",
        "โยคะและฟิตเนส"
        ],
        subject: "",
        places: ["เรียนออนไลน์", "กรุงเทพฯ", "สถาบันกวดวิชา" ,"บ้านของผู้เรียน", "ห้องสมุด", "มหาวิทยาลัยหรือโรงเรียน"],
        place: "",
        ages: ["ต่ำกว่า 12 ปี", "13-18 ปี", "19-25 ปี", "26 ปีขึ้นไป", "ประถมศึกษา", "มัธยมต้น", "มัธยมปลาย", "ปริญญาตรีขึ้นไป"],
        age: "",
        days: ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"],
        selectedDays: [],
        times: ["เช้า (08:00-12:00)", "บ่าย (13:00-17:00)", "เย็น (18:00-20:00)"],
        time: "",
        learnings: ["ตัวต่อตัว", "เรียนเป็นกลุ่ม", "วิดีโอสอน", "แบบฝึกหัด", "อบรม"],
        learning: "",
        start: "",
        objective: "",


      };
    },
    validations: {
      username: {
        required: required,
        minLength: minLength(5),
        maxLength: maxLength(20),
      },
      firstname: {
        required: required,
      },
      lastname: {
        required: required,
      },
      email: {
        required: required,
        email: email,
      },
      phone: {
        required: required,
        phone: phone,
      },
      password: {
        required: required,
        minLength: minLength(8),
        complex: complexPassword,
      },
      confirmPassword: {
        sameAs: sameAs("password"),
      },
  },
    mounted() {
      this.initAnnounce()
    },
    methods: {
      formatText(text) {
        return text.replace(/\n/g, "<br>");
      },
      formatTimestamp(timestamp) {
      return dayjs(timestamp).format('DD-MM-YYYY');
      },
      handleFileUpload(event) {
      const file = event.target.files[0]; // ไฟล์ที่ผู้ใช้อัปโหลด
      this.error = null;
      if (file) {
        // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
        if (!file.type.startsWith("image/")) {
          this.error = "Please upload a valid image file.";
          this.imageUrl = null;
          return;
        }
        // อ่านไฟล์และสร้าง Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result; // URL ของภาพ
        };
        reader.readAsDataURL(file);
      }
      },
      initAnnounce() {
        const data = {
            account_id: this.account_id,
          };
        axios.post("http://localhost:3000/student/announce", data)
        .then((res) => {
            this.announces = res.data.announces;
          })  
          .catch((err) => {
            alert(err.response.data.details.message);
          });   
        },

      submit() {
        const dayOrder = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
        const data = {
            account_id: this.account_id,
            subject_to_learn: this.subject,
            place_to_learn: this.place,
            student_age: this.age,
            convenient_day: this.selectedDays.sort((a, b) => {return dayOrder.indexOf(a) - dayOrder.indexOf(b);}).join(","),
            convenient_time: this.time,
            learning_style: this.learning,
            starting_time: this.start,
            objective: this.objective,
          };
        axios.post("http://localhost:3000/student/announce/add", data)
        .then((res) => {
            this.announces = res.data.announces;
            this.subject = "",
            this.place = "",
            this.age = "",
            this.selectedDays = [],
            this.time = "",
            this.learning = "",
            this.start = "",
            this.objective = ""
          })  
          .catch((err) => {
            alert(err);
          });   
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