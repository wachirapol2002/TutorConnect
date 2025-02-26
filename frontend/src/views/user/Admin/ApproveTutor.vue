<template>
  <div id="app">
      <div :class="center" class="my-4" :style="{ backgroundColor: '' }" style="height: 10vh;">
        <div class="fw-bold text-center" style="font-size: 5vh;">ติวเตอร์ที่รอยืนยัน</div>
      </div>
      <div v-if="tutors.length == 0" class="text-center my-5">
        <div class="" style="font-size: 5vh;">ไม่มีติวเตอร์ที่รอยืนยัน</div>
      </div>
      
      <div v-for="(tutor, index) in tutors" :key="index" class="container-fluid rounded-4 border border-dark p-1 py-2 mb-5" :style="{ backgroundColor: 'white' , lineHeight: '1.2'  }" style="width: 80vw;">
          <!-- ข้อมูส่วนตัว -->
          <div class="row" :style="{ backgroundColor: '' }">
              <div class="col-3" style="" :style="{ backgroundColor: '' }">
              <!-- รูปโปรไฟล์ -->
                  <section class="container mt-4">
                    <div class="content">
                      <div class="file d-flex flex-column justify-content-center align-items-end">
                        <div :class="center" style="height:10vw; width: 10vw; background-color: white; border: 1px solid black; overflow: hidden;">     
                          <img :src="'http://localhost:3000' + tutor.portrait_path || require('@/assets/user.png')" alt="โปรไฟล์" 
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
                    <div class="form-group col-4 d-flex" :style="{ backgroundColor: '' }">
                      <label class="form-label fw-bold" for="username">ชื่อผู้ใช้งาน:</label>
                      <div class="mx-2"> {{ tutor.username }}</div>
                    </div>
                    <div class="form-group col-4 d-flex" :style="{ backgroundColor: '' }">
                      <label class="form-label fw-bold" for="displayname">ชื่อติวเตอร์:</label>
                      <div class="mx-2"> {{ tutor.displayname }}</div>
                    </div>
                    <div class="form-group col-4 d-flex" :style="{ backgroundColor: '' }">
                      <label class="form-label fw-bold" for="date">วันที่ยื่นเอกสาร</label>
                      <div class="mx-2">{{ formatTimestamp(tutor.status_timestamp) }}</div>
                    </div>
                  </div>

                  <!-- อีเมล -->
                  <div class="row my-2">
                    <div class="form-group col-8">
                      <label class="form-label fw-bold" for="email">อีเมล</label>
                      <div class="mx-2">{{ tutor.email }}</div>
                    </div>
                  </div>
                  <div class="row my-2">
                    <!-- ชื่อจริง -->
                    <div class="form-group col-4">
                      <label class="form-label fw-bold" for="firstname">ชื่อจริง</label>
                      <div class="mx-2">{{ tutor.firstname }}</div>
                    </div>
                    <!-- นามสกุล -->
                    <div class="form-group col-4">
                      <label class="form-label fw-bold" for="lastname">นามสกุล</label>
                      <div class="mx-2">{{ tutor.lastname }}</div>
                    </div>
                    <!-- รับสอน -->
                    <div class="form-group col-4 d-flex align-items-center justify-content-start" :style="{ backgroundColor: '' }">
                      <div class="button rounded-3 me-5 bg-success fw-bold text-light" :style="{}"
                        @click="showAccept()"
                      >
                        อนุมัติ
                      </div>
                      <div class="button rounded-3 m-0 bg-danger fw-bold text-light" :style="{}"
                        @click="showUnAccept()"
                      >
                        ปฏิเสธ
                      </div>
                    </div>
                  </div>

                  <!-- ยืนยัน -->
                  <div v-if="showlicense" class="popup-overlay" style="width: 100%;">
                    <div class="popup" style="width: 50%;">
                      <div class="mb-2 text-center" style="font-size: 2vw;">ต้องการยกเลิกสิทธิ์การสอนหรือไม่</div>

                      <!-- ช่องใส่เหตุผล/คอมเมนต์ -->
                      <div class="mb-3 text-center">
                        <label for="Reason" class="form-label" style="font-size: 1vw;">กรุณาระบุเหตุผล</label>
                        <textarea v-model="Reason" id="Reason" class="form-control" style="font-size: 1vw;" rows="3" placeholder="กรอกเหตุผลที่นี่..."></textarea>
                      </div>

                      <div class="d-flex align-items-center justify-content-center mt-3">
                        <div class="button rounded-3 me-5 bg-dark text-light fw-bold" @click="closePopup">
                          ย้อนกลับ
                        </div>
                        <div v-if="this.$cookies.get('account').permission=='ผู้ดูแลระบบ'" class="button rounded-3 me-5 bg-danger text-white fw-bold" @click="Accept(tutor.tutor_id, index)">
                          ยืนยัน
                        </div>
                      </div>
                    </div>
                  </div>


                  <!-- ปฏิเสธ -->
                  <div v-if="showUnlicense" class="popup-overlay" style="width: 100%;">
                    <div class="popup" style="width: 50%;">
                      <div class="mb-2 text-center" style="font-size: 2vw;">ต้องการยกเลิกสิทธิ์การสอนหรือไม่</div>

                      <!-- ช่องใส่เหตุผล/คอมเมนต์ -->
                      <div class="mb-3 text-center">
                        <label for="Reason" class="form-label" style="font-size: 1vw;">กรุณาระบุเหตุผล</label>
                        <textarea v-model="Reason" id="Reason" class="form-control" style="font-size: 1vw;" rows="3" placeholder="กรอกเหตุผลที่นี่..."></textarea>
                      </div>

                      <div class="d-flex align-items-center justify-content-center mt-3">
                        <div class="button rounded-3 me-5 bg-dark text-light fw-bold" @click="closePopup">
                          ย้อนกลับ
                        </div>
                        <div v-if="this.$cookies.get('account').permission=='ผู้ดูแลระบบ'" class="button rounded-3 me-5 bg-danger text-white fw-bold" @click="unAccept(tutor.tutor_id, index)">
                          ยืนยัน
                        </div>
                      </div>
                    </div>
                  </div>
                  



                  <div class="row my-2">
                    <!-- เบอร์ติดต่อ -->
                    <div class="form-group col-4">
                      <label class="form-label fw-bold" for="phone">เบอร์ติดต่อ</label>
                      <div class="mx-2">{{ tutor.phone }}</div>
                    </div>
                    <!-- เพศ -->
                    <div class="form-group col-4">
                      <label class="form-label fw-bold" for="gender">เพศ</label>
                      <div class="mx-2">{{ tutor.gender }}</div>
                    </div>
                    <!-- ปุ่มติดต่อ -->
                    <div class="form-group col-4 d-flex align-items-center justify-content-start" :style="{ backgroundColor: '' }">
                      <div class="button rounded-3 me-5 bg-warning text-dark fw-bold" :style="{}">
                        ส่งข้อความ
                      </div>
                    </div>
                  </div>

                  <div class="row my-2">
                    <!-- เอกสารยืนยัน -->
                    <div class="form-group col-6">
                      <label class="form-label fw-bold" for="firstname">เอกสารยืนยัน</label>
                        <div :class="center" style="height:12vw; width: 20vw; background-color: white; border: 1px solid black; overflow: hidden;">     
                          <img :src="(tutor.document_path ? 'http://localhost:3000' + tutor.document_path :require('@/assets/IDcard.png'))" alt="เอกสารยืนยัน" 
                            style="width: 100%; height: 100%; object-fit: cover;"
                          />
                        </div>
                    </div>
                   <!-- ภาพถ่ายใบหน้า -->
                    <div class="form-group col-6">
                      <label class="form-label fw-bold" for="lastname">ภาพถ่ายใบหน้า</label>
                      
                      <div :class="center" style="height:12vw; width: 20vw; background-color: white; border: 1px solid black; overflow: hidden;">     
                          <img :src="(tutor.selfie_path ? 'http://localhost:3000' + tutor.selfie_path : require('@/assets/selfie.png'))" alt="ภาพถ่ายใบหน้า" 
                            style="width: 100%; height: 100%; object-fit: cover;"
                          />
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

export default {
  name: "ApproveTutorPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      tutors: [],
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
      showlicense: false,
      showUnlicense: false,
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
},
  mounted() {
    this.getTutors()
  },
  methods: {
    getTutors() {
      axios.post("http://localhost:3000/tutorlist/unverify")
        .then((res) => {
            this.tutors = res.data.tutors
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
  },
  Accept(tutor_id, index) {
      const data = {
          tutor_id: tutor_id
        };
      axios.post("http://localhost:3000/admin/verify/accept", data)
        .then((response) => {
          alert(response.data.message); 
          this.tutors.splice(index, 1); 
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
    },
    unAccept(tutor_id, index) {
      const data = {
          tutor_id: tutor_id
        };
        axios.post("http://localhost:3000/admin/verify/unaccept", data)
        .then((response) => {
          alert(response.data.message); 
          this.tutors.splice(index, 1); 
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
    },
    showAccept() {
      this.showlicense = true;
      this.Reason = "";
    },
    showUnAccept() {
      this.showUnlicense = true;
      this.Reason = "";
    },
    closePopup() {
      this.showlicense = false;
      this.showUnlicense = false;
      this.Reason = "";
    },
  formatTimestamp(timestamp) {
    return dayjs(timestamp).format('DD-MM-YYYY');
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
display: flex;
align-items: center;
justify-content: center;
border: 3px solid #D9D9D9; /* กรอบ */
width: auto; /* ขนาดกล่อง */
height: auto;
text-align: center;
transition: transform 0.2s ease;;
color: white;

}
.button:hover{
transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ hover */
cursor: pointer; /* แสดงให้รู้ว่าเป็นปุ่ม */
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

</style>
