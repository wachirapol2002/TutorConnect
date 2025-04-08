<template>
  <div id="app">
    <div class="mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="ค้นหา (ID, ชื่อผู้ใช้, ชื่อติวเตอร์)"
        @input="searchTutors"
      />
    </div>
    
      <div class="container-fluid rounded-4 border border-dark p-0 py-0 mb-1" :style="{ backgroundColor: 'white' , lineHeight: '1.2'  }" style="width: 100vw; min-height: 75vh;">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th scope="col" @click="sortTable('account_id')" class="text-center">
                ID
                <span v-if="sortColumn === 'account_id' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'account_id' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>
              <th scope="col" class="text-center">ภาพโปรไฟล์</th>
              <th scope="col" @click="sortTable('username')" class="">
                ชื่อผู้ใช้
                <span v-if="sortColumn === 'username' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'username' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>
              <th scope="col" @click="sortTable('displayname')" class="">
                ชื่อติวเตอร์
                <span v-if="sortColumn === 'displayname' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'displayname' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>

              <th scope="col" @click="sortTable('rating_score')" class="text-center">
                คะแนน
                <span v-if="sortColumn === 'rating_score' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'rating_score' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>


              <th scope="col" @click="sortTable('revisit_score')" class="text-center">
                อัตราเรียนซ้ำ
                <span v-if="sortColumn === 'revisit_score' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'revisit_score' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>

              <th scope="col" @click="sortTable('teaching_count')" class="text-center">
                จำนวนที่สอน
                <span v-if="sortColumn === 'teaching_count' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'teaching_count' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>
  
              <th scope="col" @click="sortTable('report_count')" class="text-center">
                โดนรายงาน
                <span v-if="sortColumn === 'report_count' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'report_count' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>
          
              <th scope="col" class="text-center">สาเหตุ</th>
              <th scope="col" class="text-center">สถานะ</th>
              <th scope="col" class="text-center">โปรไฟล์ผู้สอน</th>
              <th scope="col" class="text-center">ข้อมูลส่วนตัว</th>
              <th scope="col" class="text-center">ติดต่อ</th>
              <th scope="col" class="text-center">สิทธิ์การสอน</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tutor, index) in currentTutors" :key="index">
              <th scope="row" class="text-center">{{ tutor.account_id || '-'  }}</th>
              <td class="text-center">
                <img
                        :src="tutor && tutor.portrait_path ? 'http://localhost:3000' + tutor.portrait_path : require('@/assets/user.png')"
                        alt="User"
                        class="rounded-circle me-3 profile-img"
                        :style="{ 
                          width: '70px', 
                          height: '70px', 
                          objectFit: 'cover', 
                          maxWidth: '70px', 
                          maxHeight: '70px' 
                        }"
                />
              </td>
              <td>{{ tutor.username || '-'  }}</td>
              <td>{{ tutor.displayname || '-' }}</td>
    
              <td class="text-center">{{ formatScore(tutor.rating_score) || '-' }}</td>
              <td class="text-center">{{ formatScore(tutor.revisit_score)+"%" || '-' }}</td>
              <td class="text-center">{{ tutor.teaching_count}}</td>
              <td class="text-center">{{ tutor.report_count}}</td>
              <td>
                <router-link :to="'/admin/reportlist/?id='+ tutor.account_id" style="text-decoration: none;">
                  <div class="button bg-warning text-dark" style="border: 3px solid wheat;">
                    ข้อกล่าวหา
                  </div>
                </router-link>
              </td>
              <td class="text-center">
                <span 
                    class="badge font-bold p-2 rounded-lg"
                    :class="{'bg-success text-white': tutor.profile_status === 'พร้อมสอน',
                            'bg-warning text-dark': tutor.profile_status === 'รอตรวจสอบ', 
                            'bg-danger text-white': tutor.profile_status === 'ระงับชั่วคราว'}">
                    {{ tutor.profile_status }}
                </span>
              </td>
              
              <td>
                <router-link :to="'/tutor/profile/?id='+ tutor.tutor_id" style="text-decoration: none;">
                  <div class="button bg-light text-dark">
                    ดูโปรไฟล์
                  </div>
                </router-link>
              </td>
              <td>
                <router-link :to="'/admin/tutorpersonal/?id='+ tutor.account_id" style="text-decoration: none;">
                  <div class="button bg-light text-dark">
                    ดูข้อมูล
                  </div>
                </router-link>
              </td>
              <td>
                <div class="button bg-dark text-light" @click="chat(tutor.account_id)">
                  ส่งข้อความ
                </div>
              </td>
              <template v-if="tutor.profile_status == 'พร้อมสอน'">
                <td>
                <div class="button bg-danger text-light" @click="btnBan(tutor.tutor_id)">
                  ระงับการสอน
                </div>
              </td>
              </template>
              <template v-if="tutor.profile_status == 'ระงับชั่วคราว'">
                <td>
                <div class="button bg-warning text-dark" @click="btnUnBan(tutor.tutor_id)">
                  ปลดระงับ
                </div>
              </td>
              </template>
              <template v-if="tutor.profile_status == 'รอตรวจสอบ'">
                <td>
                <div class="button bg-success text-light"  @click="btnApprove(tutor.tutor_id)">
                  อนุญาติการสอน
                </div>
              </td>
              </template>
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
  name: "TutorInfoListPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      tutors: [],
      searchQuery: '', // คำค้นหาจากผู้ใช้
      sortColumn: '',  // คอลัมน์ที่ใช้สำหรับการเรียงลำดับ
      sortOrder: 'asc',  // ทิศทางการเรียงลำดับ (asc หรือ desc)
      currentPage: 1, // หน้าปัจจุบัน
      itemsPerPage: 7, // จำนวนแถวต่อหน้า

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
    const account = this.$cookies.get('account');
    if (!account || account.permission !== 'ผู้ดูแลระบบ') {
      window.location.href = '/';
    }
    this.getTutors()
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredTutors.length / this.itemsPerPage); // คำนวณจำนวนหน้า
    },
    filteredTutors() {
      // ฟังก์ชันในการกรองข้อมูลตามคำค้นหา
      return this.tutors.filter(tutor => {
        const query = this.searchQuery.toLowerCase();
        return (
          (tutor.account_id && tutor.account_id.toString().includes(query)) ||
          (tutor.username && tutor.username.toLowerCase().includes(query)) ||
          (tutor.displayname && tutor.displayname.toLowerCase().includes(query)) ||
          (tutor.firstname && tutor.firstname.toLowerCase().includes(query)) ||
          (tutor.lastname && tutor.lastname.toLowerCase().includes(query)) ||
          (tutor.email && tutor.email.toLowerCase().includes(query))
        );
        
      });
    },
    currentTutors() {
      const start = (this.currentPage - 1) * this.itemsPerPage; // เริ่มต้นแถวในหน้า
      const end = start + this.itemsPerPage; // จบแถวในหน้า
      return this.filteredTutors.slice(start, end); // ดึงข้อมูลที่ต้องการแสดง
    },
  },

  methods: {
    formatScore(score) {
      const validScore = parseFloat(score);
      if (isNaN(validScore)) {
        return '0';
      }
      return validScore % 1 === 0 ? validScore.toFixed(0) : validScore.toFixed(1);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    searchTutors() {
      this.currentPage = 1; // รีเซ็ตหน้าหลังจากค้นหาใหม่
    },
    sortTable(column) {
    if (this.sortColumn === column) {
      // ถ้าเป็นคอลัมน์เดิมที่คลิกแล้วให้สลับทิศทาง
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // ถ้าเป็นคอลัมน์ใหม่ให้ตั้งค่าเริ่มต้นที่ 'asc'
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortTutors();
  },
  sortTutors() {
    this.tutors.sort((a, b) => {
      let comparison = 0;
      if (a[this.sortColumn] < b[this.sortColumn]) {
        comparison = -1;
      } else if (a[this.sortColumn] > b[this.sortColumn]) {
        comparison = 1;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  },
    getTutors() {
      axios.post("http://localhost:3000/tutorlist/info")
        .then((res) => {
            this.tutors = res.data.tutors
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
          this.closePopup()
          alert(response.data.message); 
          this.getTutors()
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
          this.closePopup()
          alert(response.data.message);
          this.getTutors()
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
            this.closePopup()
            alert(response.data.message);
            this.getTutors()
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
