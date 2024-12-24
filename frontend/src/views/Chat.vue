<template>
    <div id="app" class="d-flex">
        <div class="container-fluid rounded-4  border border-dark p-0 py-4 d-flex" :style="{ backgroundColor: 'white' }" style="width: 100vw; height: 90vh;">
          <!-- Main Chat Area -->
          <div class="chat-main flex-grow-1 d-flex flex-column" :style="{ width: '80%', backgroundColor: '#ffffff' }">
                <!-- Header -->
                <div
                  class="chat-header p-3 border-bottom"
                  :style="{ backgroundColor: '#ffffff', borderBottom: '1px solid #ddd' }"
                >

                

                <!-- ชื่อผู้สนทนา -->
                 <div class="d-flex align-items-center">
                    <img
                      :src="contacts[selectedContact]?.image || defaultImage"
                      alt="User"
                      class="rounded-circle me-3"
                      :style="{ width: '5%', height: '5%', objectFit: 'cover' }"
                      v-if="selectedContact !== null"
                    />
                    <div class="m-0 fw-bold" :style="{ fontSize: '2vw' }">{{ contacts[selectedContact]?.name || "เลือกคนที่ต้องการติดต่อ" }}</div>
                 </div>

                  
                </div>

                <!-- Chat Messages -->
                <div class="chat-messages flex-grow-1 p-3" :style="{ overflowY: 'auto' }" ref="chatMessages">
                  <div
                    v-for="(message, index) in contacts[selectedContact]?.messages || []"
                    :key="index"
                    class="d-flex mb-3"
                    :class="{
                      'justify-content-end': message.isSender,
                      'justify-content-start': !message.isSender,
                    }"
                  >
                    <div
                      class="p-2 rounded"
                      :style="{
                        backgroundColor: message.isSender ? '#d1f7c4' : '#f0f0f0',
                        maxWidth: '70%',
                        whiteSpace: 'pre-wrap',
                      }"
                    >
                      {{ message.text }}
                    </div>
                  </div>
                </div>

                <!-- Chat Input -->
                <div class="chat-input p-3 border-top" :style="{ backgroundColor: '#ffffff' }">
                  <div class="input-group">
                    <textarea
                      class="form-control"
                      v-model="newMessage"
                      placeholder="ช่องข้อความ"
                      @keydown="handleKeydown"
                      rows="2"
                      :style="{ resize: 'none' }"
                    ></textarea>
                    <button class="btn btn-secondary" @click="sendMessage" style="width: 5vw;">
                      <i class="bi bi-send"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Sidebar รายชื่อผู้สนทนา -->
              <div
                class="chat-sidebar p-3"
                :style="{ 
                  width: '20%', 
                  backgroundColor: '#ffffff', 
                  borderLeft: '1px solid #ddd', 
                  overflowY: 'auto' /* เพิ่ม scroll bar เมื่อมีเนื้อหาเกิน */
                }"
              >
                <div class="search-bar mb-3">
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="form-control"
                    placeholder="ค้นหา"
                    :style="{ borderRadius: '20px', padding: '0.5rem 1rem' }"
                  />
                </div>
                <ul class="list-group list-unstyled">
                  <li
                    v-for="(contact, index) in filteredContacts"
                    :key="index"
                    class="d-flex align-items-center p-2 mb-2"
                    :style="{ cursor: 'pointer', backgroundColor: selectedContact === index ? '#f0f0f0' : 'transparent' }"
                    @click="selectContact(index)"
                  >
                    <img
                      :src="contact.image || defaultImage"
                      alt="User"
                      class="rounded-circle me-3"
                      :style="{ width: '25%', height: '25%', objectFit: 'cover' }"
                    />
                    <div>
                      <div class="fw-bold">{{ contact.name }}</div>
                      <small class="text-muted">{{ contact.lastMessage }}</small>
                    </div>
                  </li>
                </ul>
              </div>
        </div>
    </div>
</template>
  
  <script>
  // import axios from "axios";
  export default {
    name: "ChatPage",
    data() {
      return {
        contacts: [
          {
            name: "พี่หนึ่ง",
            lastMessage: "น้องสะดวกเป็นออนไซต์ หรือออนไลน์ครับ \nตอนนี้คิวพี่ว่าง อังคาร-เสาร์ ช่วง 16.00-19.00 ครับ ",
            image: null,
            messages: [
              { text: "สวัสดีครับ", isSender: true },
              { text: "ผมสนใจอยากเรียนกับพี่ต้องทำยังไงบ้างครับ", isSender: true },
              { text: "น้องสนใจเรียนแบบไหนดีครับ", isSender: false },
              { text: "ผมอยากเนื้อหาเตรียมสอบฟิสิกส์ ม.ปลาย ครับ", isSender: true },
              { text: "น้องสะดวกเป็นออนไซต์ หรือออนไลน์ครับ \nตอนนี้คิวพี่ว่าง อังคาร-เสาร์ ช่วง 16.00-19.00 ครับ ", isSender: false },
            ],
          },
          {
            name: "ครูสอง",
            lastMessage: "",
            image: null,
            messages: [

            ],
          },
          {
            name: "Tutor3",
            lastMessage: "",
            image: null,
            messages: [

            ],
          },
          {
            name: "Tutor4",
            lastMessage: "",
            image: null,
            messages: [

            ],
          },
          {
            name: "Tutor5",
            lastMessage: "",
            image: null,
            messages: [

            ],
          },
          {
            name: "Tutor6",
            lastMessage: "",
            image: null,
            messages: [

            ],
          },
          {
            name: "Tutor7",
            lastMessage: "",
            image: null,
            messages: [

            ],
          },
        ],
        selectedContact: 0,
        newMessage: "",
        searchQuery: "",
        defaultImage: require("@/assets/user.png"),
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
        }
      };
    },
    validations: {
     
  },
    mounted() {

  },
    computed: {
    filteredContacts() {
      // ค้นหารายชื่อผู้คุยล่าสุดตาม searchQuery
      if (!this.searchQuery) {
        return this.contacts;
      }
      return this.contacts.filter((contact) =>
        contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
    methods: {
      selectContact(index) {
        this.selectedContact = index;
      },
      handleKeydown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault(); // ป้องกันการสร้างบรรทัดใหม่
          this.sendMessage(); // เรียกฟังก์ชันส่งข้อความ
        }
      },
      scrollToBottom() {
        const chatMessages = this.$refs.chatMessages;
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      },
      sendMessage() {
        if (this.newMessage.trim() !== "") {
          this.contacts[this.selectedContact].messages.push({
            text: this.newMessage,
            isSender: true,
          });
          this.newMessage = "";
          this.$nextTick(() => {
          this.scrollToBottom(); // เรียกฟังก์ชันเลื่อนหลังจาก DOM อัปเดต
      });
        }
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

  
      submit() {
        // // Validate all fields
          // this.v$.$touch();
          this.$router.push({ path: "/student/profile/edit" });
   
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
      selectedContact() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
    },
    
  };
  </script>
  
<style>
img {
    object-fit: cover;
}
</style>