<template>
  <div id="app">
    <div class="mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="ค้นหา (ID, ชื่อผู้ใช้, ชื่อจริง, นามสกุล, อีเมล)"
        @input="searchStudents"
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
              <th scope="col" @click="sortTable('firstname')" class="">
                ชื่อจริง
                <span v-if="sortColumn === 'firstname' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'firstname' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>
              <th scope="col" @click="sortTable('lastname')" class="">
                นามสกุล
                <span v-if="sortColumn === 'lastname' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'lastname' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>
              <th scope="col" @click="sortTable('email')" class="">
                อีเมล
                <span v-if="sortColumn === 'email' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'email' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>
              <th scope="col" @click="sortTable('phone')" class="">
                หมายเลขโทรศัพท์
                <span v-if="sortColumn === 'phone' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'phone' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>
              <th scope="col" @click="sortTable('report_count')" class="text-center">
                โดนรายงาน
                <span v-if="sortColumn === 'report_count' && sortOrder === 'asc'" class="ms-2">&#9650;</span>
                <span v-if="sortColumn === 'report_count' && sortOrder === 'desc'" class="ms-2">&#9660;</span>
              </th>
              <th scope="col" class="text-center">สาเหตุ</th>
              <th scope="col" class="text-center">โปรไฟล์</th>
              <th scope="col" class="text-center">ติดต่อ</th>
              <!-- <th scope="col" class="text-center">Manage</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in currentStudents" :key="index">
              <th scope="row" class="text-center">{{ student.account_id }}</th>
              <td class="text-center">
                <img
                        :src="student && student.portrait_path ? 'http://localhost:3000' + student.portrait_path : require('@/assets/user.png')"
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
              <td>{{ student.username }}</td>
              <td>{{ student.firstname }}</td>
              <td>{{ student.lastname }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.phone }}</td>
              <td class="text-center">{{ student.report_count }}</td>
              <td>
                <router-link :to="'/admin/reportlist/?id='+ student.account_id" style="text-decoration: none;">
                  <div class="button bg-warning text-dark">
                    ผู้รายงาน
                  </div>
                </router-link>
              </td>
              <td>
                <router-link :to="'/tutor/studentinfo/?id='+ student.account_id" style="text-decoration: none;">
                  <div class="button bg-light text-dark">
                    ดูโปรไฟล์
                  </div>
                </router-link>
              </td>
              <td>
                <div class="button bg-dark text-light" @click="chat(student.account_id)">
                  ส่งข้อความ
                </div>
              </td>
              <!-- <td>
              <div class="button bg-warning text-dark">
                แก้ไข
              </div>
            </td> -->

            </tr>
          </tbody>
        </table>

       
      </div>

      <div class="d-flex justify-content-center my-3">
      
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="btn btn-dark">ย้อนกลับ</button>
      <span class="mx-3">หน้า {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" class="btn btn-dark">หน้าถัดไป</button>
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
  name: "StudentInfoListPage",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      students: [],
      searchQuery: '', // คำค้นหาจากผู้ใช้
      sortColumn: '',  // คอลัมน์ที่ใช้สำหรับการเรียงลำดับ
      sortOrder: 'asc',  // ทิศทางการเรียงลำดับ (asc หรือ desc)
      currentPage: 1, // หน้าปัจจุบัน
      itemsPerPage: 7, // จำนวนแถวต่อหน้า

      imageUrl: require('@/assets/user.png'), // เก็บ URL ภาพที่อัปโหลด
      previousRoutes: [],
      mainColor: "#BC2C2C",
      select_tutor_id: "",
      select_index: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      firstname: "",
      lastname: "",
 
      reason: "",
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
      reason: {
        required: required,
      },
  },
  mounted() {
    this.getStudents()
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.itemsPerPage); // คำนวณจำนวนหน้า
    },
    filteredStudents() {
      // ฟังก์ชันในการกรองข้อมูลตามคำค้นหา
      return this.students.filter(tutor => {
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
    currentStudents() {
      const start = (this.currentPage - 1) * this.itemsPerPage; // เริ่มต้นแถวในหน้า
      const end = start + this.itemsPerPage; // จบแถวในหน้า
      return this.filteredStudents.slice(start, end); // ดึงข้อมูลที่ต้องการแสดง
    },
  },

  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    searchStudents() {
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
    this.sortStudents();
  },
  sortStudents() {
    this.students.sort((a, b) => {
      let comparison = 0;
      if (a[this.sortColumn] < b[this.sortColumn]) {
        comparison = -1;
      } else if (a[this.sortColumn] > b[this.sortColumn]) {
        comparison = 1;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  },
    getStudents() {
      axios.post("http://localhost:3000/studentlist/info")
        .then((res) => {
            this.students = res.data.students
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
  },
  Accept(tutor_id, index) {
      const data = {
          tutor_id: tutor_id,
          sender_id: this.$cookies.get("account").account_id,
        };
      axios.post("http://localhost:3000/admin/verify/accept", data)
        .then((response) => {
          alert(response.data.message); 
          this.tutors.splice(index, 1);
          this.closePopup()
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
    },
    unAccept(tutor_id, index) {
      this.v$.$touch();
      if (!this.v$.$invalid) {
        const data = {
            tutor_id: tutor_id,
            sender_id: this.$cookies.get("account").account_id,
            message: this.reason
          };
          axios.post("http://localhost:3000/admin/verify/unaccept", data)
          .then((response) => {
            alert(response.data.message); 
            this.tutors.splice(index, 1);
            this.closePopup()
          })  
          .catch((err) => {
            alert(err.response.data.details.message);
          });
      }
    },
    showAccept(tutor_id, index) {
      this.select_tutor_id = tutor_id
      this.select_index = index
      this.showlicense = true;
      this.reason = "";
    },
    showUnAccept(tutor_id, index) {
      this.select_tutor_id = tutor_id
      this.select_index = index
      this.showUnlicense = true;
      this.reason = "";
    },
    closePopup() {
      this.showlicense = false;
      this.showUnlicense = false;
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
