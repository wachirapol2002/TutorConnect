<template>
  <div id="app">
    <div class="fw-bold text-center my-4">
      <div class="my-2" :class="center" :style="{fontSize: '2vw',}">ข้อมูลผู้สอน</div>
      <div class="step-container">
        <router-link to="/tutor/verify" :class="center" style="text-decoration: none;">
          <div class="step actived"> 1 </div>
        </router-link>
        <router-link to="" :class="center" style="text-decoration: none;">
          <div class="step active"> 2 </div>
        </router-link>
        <router-link to="" :class="center" style="text-decoration: none;">
          <div class="step"> 3 </div>
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
        <!-- name -->
        <div class="row my-2">
          <div class="form-group col-12">
            <label class="form-label" for="tutorName">ชื่อติวเตอร์*</label>
              <input
                class="form-control information"
                :class="{ 'border-danger': v$.tutorName.$error }"
                type="text"
                id="tutorName"
                name="tutorName"
                required
                placeholder="ชื่อที่แสดงให้นักเรียนเห็น"
                maxlength="20"
                v-model="tutorName"
              />
            <template v-if="v$.tutorName.$error">
              <p class="text-danger m-0 p-0" v-if="v$.tutorName.required.$invalid">
                ต้องกรอกข้อมูลช่องนี้
              </p>
            </template>
          </div>
        </div>

        <div class="row my-2">
          <!-- facebook -->
          <div class="form-group col-6">
            <label class="form-label" for="facebook">Facebook</label>
            <input
              class="form-control information"
              type="facebook"
              id="facebook"
              required
              placeholder="Link Facebook"
              maxlength="255"
              v-model="facebook"
            />
          </div>
           <!-- line -->
          <div class="form-group col-6">
            <label class="form-label" for="line">Line</label>
            <input
              class="form-control information"
              type="text"
              id="line"
              required
              placeholder="Line ID"
              maxlength="30"
              v-model="line"
            />
          </div>
        </div>

        
        <!-- Introduce -->
        <div class="row my-2">
          <div class="form-group col-12">
            <label class="form-label" for="introduce">ข้อความแนะนำตัว*</label>
            <textarea
              class="form-control information"
              :class="{ 'border-danger': v$.introduce.$error }"
              type="text"
              id="introduce"
              name="introduce"
              required
              placeholder="แนะนำตัวให้นักเรียนสนใจ"
              maxlength="255"
              v-model="introduce"
              style="height: 10vh;"
            >
            </textarea>
            <template v-if="v$.introduce.$error">
              <p class="text-danger m-0 p-0" v-if="v$.introduce.required.$invalid">
                ต้องกรอกข้อมูลช่องนี้
              </p>
            </template>
          </div>
        </div>
        <!-- describe -->
        <div class="row my-2">
          <div class="form-group col-12">
            <label class="form-label" for="describe">ประสบการณ์สอน และ ความน่าสนใจ*</label>
            <textarea
              class="form-control information"
              :class="{ 'border-danger': v$.describe.$error }"
              type="text"
              id="describe"
              name="describe"
              required
              placeholder="เขียนบรรยายประสบการณ์สอน"
              v-model="describe"
              style="height: 30vh;"
            >
            </textarea>
            <template v-if="v$.describe.$error">
              <p class="text-danger m-0 p-0" v-if="v$.describe.required.$invalid">
                ต้องกรอกข้อมูลช่องนี้
              </p>
            </template>
          </div>
        </div>

        <!-- ประวัติการศึกษา -->
        <div class="row my-2 ">
          <label class="form-label" for="academy">ประวัติการศึกษา</label>
            <div class="form-group col-2 mx-0 pe-1" style="width: auto;">
              <select v-model="status" class="form-control information">
                <option value="">สถานะ</option>
                <option value="กำลังศึกษา">กำลังศึกษา</option>
                <option value="จบการศึกษา">จบการศึกษา</option>
              </select>
            </div>
            <div class="form-group col-2 mx-0 px-1" style="width: auto;">
              <select v-model="degree" class="form-control information">
                <option value="">ระดับ</option>
                <option value="ปริญญาตรี">ปริญญาตรี</option>
                <option value="ปริญญาโท">ปริญญาโท</option>
                <option value="ปริญญาเอก">ปริญญาเอก</option>
              </select>
            </div>
            <div class="form-group col-3 mx-0 px-1">
              <input
                v-model="school_name"
                type="text"
                placeholder="คณะหรือสถานศึกษา*"
                class="form-control information"
              />
            </div>
            <div class="form-group col-2 mx-0 px-1">
              <input
                v-model="honor"
                type="text"
                placeholder="เกียรนิยม"
                class="form-control information"
              />
            </div>
            <div class="form-group col-2 mx-0 px-1" >
              <input
                v-model="grade"
                type="text"
                placeholder="เกรดเฉลี่ย"
                class="form-control information"
              />
            </div>
            <!-- ปุ่มเพิ่มประวัติ -->
            <div class="form-group col-1 mx-0">
              <button type="button" @click="addAcademy" class="btn btn-secondary information">เพิ่ม</button>
            </div>
            <!-- แสดงรายการการศึกษา -->
            <div class="information mt-3">
              <ul v-if="academys.length" class="m-1 border-bottom border-2 mb-4">
                <li
                  v-for="(academy, index) in academys"
                  :key="academy.graduate_id"
                  class="d-flex justify-content-between align-items-center my-2"
                >
                  <span>
                    - {{ academy.status }} {{ academy.degree }} {{ academy.school_name }} {{ academy.honor }} {{ academy.grade }}
                  </span>
                  <button type="button" @click="removeAcademy(academy.graduate_id, index)" class="btn btn-danger btn-sm information">ลบ</button>
                </li>
              </ul>
            </div>
        </div>


        <div class="form-group d-flex justify-content-center">
          <div class="button rounded-3 my-4 px4- mx-2 information text-light bg-dark" :style="{backgroundColor: mainColor,}" @click="back()">
            ย้อนกลับ
          </div>
          <div class="button rounded-3 my-4 px4- mx-2 information text-light bg-dark" :style="{backgroundColor: mainColor,}" @click="submit()">
            ยืนยันข้อมูลผู้สอน
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

export default {
  name: "TeacherInfoPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      imageUrl: null, // เก็บ URL ภาพที่อัปโหลด
      currentStep: 2,
      totalSteps: 4,
      previousRoutes: [],
      mainColor: "#BC2C2C",
      tutor_id: '',
      tutorName: this.$cookies.get("tutor") ? this.$cookies.get("tutor").displayname : "",
      facebook: this.$cookies.get("tutor") ? this.$cookies.get("tutor").facebook_link : "",
      line: this.$cookies.get("tutor") ? this.$cookies.get("tutor").line_id : "",
      introduce: this.$cookies.get("tutor") ? this.$cookies.get("tutor").introduce_message : "",
      describe: this.$cookies.get("tutor") ? this.$cookies.get("tutor").description : "",
      status: '', // ค่าเริ่มต้น
      degree: '',
      school_name: '',
      honor: '',
      grade: '',
      academy: "",
      academys: [],
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
      tutorName: {
        required: required,
      },
      introduce: {
        required: required,
      },
      describe: {
        required: required,
      },
    }
},
  mounted() {
    this.teacherInfo()
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
              return axios.post("http://localhost:3000/tutor/graduate", { tutor_id: this.tutor_id });
          })  
          .then((res) => {
              this.academys = res.data.graduates;
          })
          .catch((err) => {
            alert(err.response.data.details.message);
          });   
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
    removeAcademy(graduate_id, index) {
      if (confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
        const data = {
            graduate_id: graduate_id,
          };
        axios
          .post("http://localhost:3000/tutor/graduate/remove", data)
          .then(() => {
            this.academys.splice(index, 1); // ลบข้อมูลจากหน้าจอ
          })
          .catch((err) => {
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            console.error(err);
          });
      }
    },
    
    
    submit() {
        // Validate all fields
        this.v$.$touch();
        // เช็คว่าในฟอร์มไม่มี error
        if (!this.v$.$invalid) {
          const data = {
            account_id: this.$cookies.get("account").account_id,
            tutorName: this.tutorName,
            facebook: this.facebook,
            line: this.line,
            introduce: this.introduce,
            describe: this.describe,
          };
          axios
            .post("http://localhost:3000/tutor/teacher/update", data)
            .then((res) => {
              const tutor = {
                tutor_id: res.data.tutor.tutor_id,
                account_id:res.data.tutor.account_id,
                displayname: res.data.tutor.displayname,
                facebook_link: res.data.tutor.facebook_link,
                line_id: res.data.tutor.line_id,
                introduce_message: res.data.tutor.introduce_message,
                description: res.data.tutor.description,
                rating_score: res.data.tutor.rating_score,
                revisit_score: res.data.tutor.revisit_score,
                profile_status: res.data.tutor.profile_status,
              };
              this.$cookies.set("tutor", tutor);
              alert("กรอกข้อมูลผู้สอนสำเร็จ");
              this.$router.push({ path: "/tutor/teaching/info" });
            })
            .catch((err) => {
              alert(err.response.data.details.message);
              console.log(err)
            });
        }
      },

    back() {
      this.$router.push({ path: "/tutor/verify" });
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
.form-label{
  font-size: 1.5vw;
}
.information{
  font-size: 1.2vw;
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