<template>
  <div id="app">
      <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
      
    <!-- <br /> -->
        <div class="fw-bold text-center" style="font-size: 5vh;">รายชื่อนักเรียนที่สอน</div>
     
      </div>

      <div v-if="students.length == 0" class="text-center my-5">
        <div class="" style="font-size: 5vh;">คุณยังไม่มีนักเรียน</div>
      </div>
      
      <div v-for="(student, index) in students" :key="index" class="container-fluid rounded-4 border border-dark p-1 py-2 mb-5" :style="{ backgroundColor: 'white' , lineHeight: '1.2'  }" style="width: 80vw;">
          <!-- ข้อมูส่วนตัว -->
          <div class="row" :style="{ backgroundColor: '' }">
              <div class="col-3" style="" :style="{ backgroundColor: '' }">
              <!-- รูปโปรไฟล์ -->
                  <section class="container mt-4">
                    <div class="content">
                      <div class="file d-flex flex-column justify-content-center align-items-end">
                        <div :class="center" style="height:10vw; width: 10vw; background-color: white; border: 1px solid black; overflow: hidden;">     
                          <img :src="'http://localhost:3000' + student.portrait_path || require('@/assets/user.png')" alt="โปรไฟล์" 
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
                      <label class="form-label fw-bold" for="username">ชื่อผู้ใช้งาน:</label>
                      <div class="mx-2"> {{ student.username }}</div>
                    </div>
                    <div class="form-group col-4 d-flex" :style="{ backgroundColor: '' }">
                      <label class="form-label fw-bold" for="date">วันที่สมัคร</label>
                      <div class="mx-2">{{ formatTimestamp(student.register_timestamp) }}</div>
                    </div>
                  </div>
                  <!-- ระดับบัญชี -->
                  <div class="row my-2">
                    <div class="form-group col-8 d-flex">
                      <label class="form-label fw-bold" for="permission">ระดับบัญชี:</label>
                      <div class="mx-2">{{ student.permission }}</div>
                    </div>
                    <!-- วิชา -->
                    <div class="form-group col-4 d-flex align-items-center justify-content-start" :style="{ backgroundColor: 'white' }">
                      <label class="form-label fw-bold m-0" for="date">วิชา:</label>
                      <div class="mx-2">{{ student.subject_name+" "+student.degree_level }}</div>
                    </div>
                  </div>     
                  <!-- อีเมล -->
                  <div class="row my-2">
                    <div class="form-group col-8">
                      <label class="form-label fw-bold" for="email">อีเมล</label>
                      <div class="mx-2">{{ student.email }}</div>
                    </div>
                    <!-- รูปแบบการเรียน -->
                    <div class="form-group col-4 d-flex align-items-center justify-content-start" :style="{ backgroundColor: 'white' }">
                      <label class="form-label fw-bold m-0" for="date">รูปแบบ:</label>
                      <div class="mx-2">{{ student.subject_place }}</div>
                    </div>
                  </div>
                  <div class="row my-2">
                    <!-- ชื่อจริง -->
                    <div class="form-group col-4">
                      <label class="form-label fw-bold" for="firstname">ชื่อจริง</label>
                      <div class="mx-2">{{ student.firstname }}</div>
                    </div>
                    <!-- นามสกุล -->
                    <div class="form-group col-4">
                      <label class="form-label fw-bold" for="lastname">นามสกุล</label>
                      <div class="mx-2">{{ student.lastname }}</div>
                    </div>
                  </div>
                  <div class="row my-2">
                    <!-- เบอร์ติดต่อ -->
                    <div class="form-group col-4">
                      <label class="form-label fw-bold" for="phone">เบอร์ติดต่อ</label>
                      <div class="mx-2">{{ student.phone }}</div>
                    </div>
                    <!-- เพศ -->
                    <div class="form-group col-4">
                      <label class="form-label fw-bold" for="gender">เพศ</label>
                      <div class="mx-2">{{ student.gender }}</div>
                    </div>
                    <!-- ปุ่มติดต่อ -->
                    <div class="form-group col-4 d-flex align-items-center justify-content-start" :style="{ backgroundColor: '' }">
                      <div class="button rounded-3 me-5 bg-warning text-dark fw-bold" :style="{}" @click="chat(student.account_id)">
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
  name: "TutorEnrollPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      students: [],
      imageUrl: require('@/assets/user.png'), // เก็บ URL ภาพที่อัปโหลด
      previousRoutes: [],
      mainColor: "#BC2C2C",
      tutor_id: "",
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
      }
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
    this.getStudents()
  },
  methods: {
    getStudents() {
      const data = {
          account_id: this.$cookies.get("account").account_id,
        };
      axios.post("http://localhost:3000/tutor/teacher/info/byAccount", data)
        .then((res) => {
            this.tutor_id = res.data.tutor.tutor_id
            
            return axios.post("http://localhost:3000/tutor/studentlist", { tutor_id: this.tutor_id });
        })  
        .then((res) => {
            this.students = res.data.students;
        })
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
  },
  formatTimestamp(timestamp) {
    return dayjs(timestamp).format('DD-MM-YYYY');
  },
  chat(receiver_id){
      this.$router.push({ name: 'ChatPage'});
      this.$cookies.set("sender_id", this.$cookies.get('account').account_id);
      this.$cookies.set("receiver_id", receiver_id);
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
.button{
transition: transform 0.2s ease;

}
.button:hover{
transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ hover */
cursor: pointer; /* แสดงให้รู้ว่าเป็นปุ่ม */
}
</style>