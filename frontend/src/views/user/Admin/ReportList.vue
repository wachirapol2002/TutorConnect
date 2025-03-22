<template>
  <div id="app">

      <div class="container-fluid rounded-4 border border-dark p-0 py-0 mb-1" :style="{ backgroundColor: 'white' , lineHeight: '1.2'  }" style="width: 100vw; min-height: 75vh;">
        <table class="table  table-striped">
          <thead class="thead-dark">
            <tr>
              <th scope="col" class="text-center" style="width: 5vw">#</th>
              <th scope="col" class="" style="width: 10vw">ผู้รายงาน</th>
              <th scope="col" class="" style="width: 65vw">ข้อหา</th>
              
              <th scope="col" class="" style="width: 10vw">ผู้โดยรายงาน</th>
              <th scope="col" class="" style="width: 10vw">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(notification, index) in currentReports" :key="index">
              <th scope="row" class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
              <td class="">{{ notification.reporter_username || '-'  }}</td>
              <td class="">{{ notification.message || '-'  }}</td>
              <td class="">{{ notification.reported_username || '-' }}</td>
              <td class="">{{ formatTimestamp(notification.timestamp)}}</td>
            </tr>
          </tbody>
        </table>

       
      </div>

      <div class="d-flex justify-content-center my-3">
      
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="btn btn-dark">ย้อนกลับ</button>
        <span class="mx-3">หน้า {{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" class="btn btn-dark">หน้าถัดไป</button>
      </div>



      <!-- อนุมัติ -->
      <div v-if="showApprove" class="popup-overlay" style="width: 100%;">
        <div class="popup" style="width: 50%;">
          <div class="mb-2 text-center" style="font-size: 2vw;">ต้องการยืนยันสิทธิ์การสอนหรือไม่</div>
          <div class="d-flex align-items-center justify-content-center mt-3">
            <div class="button rounded-3 me-5 bg-dark text-light fw-bold" @click="closePopup">
              ปิด
            </div>
            <div v-if="this.$cookies.get('account').permission=='ผู้ดูแลระบบ'" class="button rounded-3 me-5 bg-success text-white fw-bold" @click="Approve(this.select_tutor_id)">
              ยืนยัน
            </div>
          </div>
        </div>
      </div>


      <!-- ปลดระงับ -->
      <div v-if="showUnBan" class="popup-overlay" style="width: 100%;">
        <div class="popup" style="width: 50%;">
          <div class="mb-2 text-center" style="font-size: 2vw;">ต้องการปลดระงับการสอนหรือไม่</div>
          <div class="d-flex align-items-center justify-content-center mt-3">
            <div class="button rounded-3 me-5 bg-dark text-light fw-bold" @click="closePopup">
              ปิด
            </div>
            <div v-if="this.$cookies.get('account').permission=='ผู้ดูแลระบบ'" class="button rounded-3 me-5 bg-danger text-white fw-bold" @click="unBan(this.select_tutor_id)">
              ยืนยัน
            </div>
          </div>
        </div>
      </div>


      <!-- ระงับ -->
      <div v-if="showBan" class="popup-overlay" style="width: 100%;">
        <div class="popup" style="width: 50%;">
          <div class="mb-2 text-center" style="font-size: 2vw;">ต้องการระงับสิทธิ์สอนหรือไม่</div>


          <div class="mb-3 text-center">
            <label for="reason" class="form-label" style="font-size: 1vw;">ระบุเหตุผล แจ้งเตือนไปยังผู้สอน</label>
            <textarea v-model="reason" id="reason" class="form-control" style="font-size: 1vw;" rows="3" placeholder="กรอกเหตุผลที่นี่..."></textarea>
          </div>
          <template v-if="v$.reason.$error">
            <p class="text-danger m-0 p-0" style="font-size: 1em;" v-if="v$.reason.required.$invalid">
              กรุณาระบุเหตุผลของการถูกระงับ
            </p>
          </template>

          <div class="d-flex align-items-center justify-content-center mt-3">
            <div class="button rounded-3 me-5 bg-dark text-light fw-bold" @click="closePopup">
              ปิด
            </div>
            <div v-if="this.$cookies.get('account').permission=='ผู้ดูแลระบบ'" class="button rounded-3 me-5 bg-danger text-white fw-bold" @click="Ban(this.select_tutor_id)">
              ยืนยัน
            </div>
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
  name: "ReportList",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      report_account_id: this.$route.query.id,
      reports: [],
      tutors: [],
      searchQuery: '', // คำค้นหาจากผู้ใช้
      sortColumn: '',  // คอลัมน์ที่ใช้สำหรับการเรียงลำดับ
      sortOrder: 'asc',  // ทิศทางการเรียงลำดับ (asc หรือ desc)
      currentPage: 1, // หน้าปัจจุบัน
      itemsPerPage: 15, // จำนวนแถวต่อหน้า

      imageUrl: require('@/assets/user.png'), // เก็บ URL ภาพที่อัปโหลด
      previousRoutes: [],
      mainColor: "#BC2C2C",
      select_index: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      firstname: "",
      lastname: "",
      
      select_tutor_id: "",
      reason: "",
      showApprove: false,
      showBan: false,
      showUnBan: false,
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
      reason: {
        required: required,
      },
  },
  mounted() {
    this.getReports()
  },
  computed: {
    totalPages() {
      return Math.ceil(this.reports.length / this.itemsPerPage); // คำนวณจำนวนหน้า
    },

    currentReports() {
      const start = (this.currentPage - 1) * this.itemsPerPage; // เริ่มต้นแถวในหน้า
      const end = start + this.itemsPerPage; // จบแถวในหน้า
      return this.reports.slice(start, end); // ดึงข้อมูลที่ต้องการแสดง
    },
  },

  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

  getReports() {
      const data = {
          account_id: this.$route.query.id,
        };
        
      axios.post("http://localhost:3000/reportlist", data)
        .then((res) => {
            this.reports = res.data.reports
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
  },
  Approve(tutor_id) {
      const data = {
          tutor_id: tutor_id,
          sender_id: this.$cookies.get("account").account_id,
        };
      axios.post("http://localhost:3000/admin/verify/accept", data)
        .then((response) => {
          alert(response.data.message); 
          this.getTutors()
          this.closePopup()
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
    },
    unBan(tutor_id) {
      const data = {
          tutor_id: tutor_id,
          sender_id: this.$cookies.get("account").account_id,
        };
      axios.post("http://localhost:3000/admin/tutor/unban", data)
        .then((response) => {
          alert(response.data.message);
          this.getTutors()
          this.closePopup()
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
    },
    Ban(tutor_id) {
      this.v$.$touch();
      if (!this.v$.$invalid) {
        const data = {
            tutor_id: tutor_id,
            sender_id: this.$cookies.get("account").account_id,
            message: this.reason
          };
          axios.post("http://localhost:3000/admin/tutor/ban", data)
          .then((response) => {
            alert(response.data.message);
            this.getTutors()
            this.closePopup()
          })  
          .catch((err) => {
            alert(err.response.data.details.message);
          });
      }
    },
    btnApprove(tutor_id) {
      this.select_tutor_id = tutor_id
      this.showApprove = true;
      this.reason = "";
    },
    btnBan(tutor_id) {
      this.select_tutor_id = tutor_id
      this.showBan = true;
      this.reason = "";
    },
    btnUnBan(tutor_id) {
      this.select_tutor_id = tutor_id
      this.showUnBan = true;
      this.reason = "";
    },
    closePopup() {
      this.showBan = false;
      this.showUnBan = false;
      this.showApprove = false;
      this.select_tutor_id = ""
      this.select_index = ""
      this.reason = "";
    },
  formatTimestamp(timestamp) {
      if(!timestamp) return " ";
      const date = new Date(timestamp);
      return date.toLocaleString('th-TH');
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
th {
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
}

</style>
