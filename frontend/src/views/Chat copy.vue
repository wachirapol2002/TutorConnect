<template>
    <div id="app" class="d-flex">
        <div class="container-fluid rounded-0 border-bottom border-dark p-0 d-flex" :style="{ backgroundColor: 'white' }" style="width: 100vw; height: 90vh;">
          <!-- Main Chat Area -->
          <div class="chat-main flex-grow-1 d-flex flex-column" :style="{ width: '75%', backgroundColor: '#ffffff' }">
                <!-- Header -->
                <div
                  class="chat-header px-3 py-2 border-bottom border-dark"
                  :style="{ backgroundColor: chatFrame }"
                >
                  <!-- ชื่อผู้สนทนา -->
                  <div class="d-flex align-items-center" style="background-color: '';">
                      <img
                        :src="receiver && receiver.portrait_path ? 'http://localhost:3000' + receiver.portrait_path : require('@/assets/user.png')"
                        alt="User"
                        class="rounded-circle me-3 profile-img"
                        :style="{ 
                          width: '70px', 
                          height: '70px', 
                          objectFit: 'cover', 
                          maxWidth: '70px', 
                          maxHeight: '70px' 
                        }"
                        v-if="receiver_id !== null"
                      />
                      <div class="d-flex flex-column">
                        <div class="m-0" :style="{ fontSize: '1.2em' }"> {{ this.receiver.permission }}</div>
                        <template v-if="this.receiver.displayname">
                          <div class="m-0 fw-bold" :style="{ fontSize: '1.5em' }">{{ this.receiver.displayname + " ("+ this.receiver.username +")" || "เลือกคนที่ต้องการติดต่อ" }}</div>
                        </template>
                        <template v-if="!this.receiver.displayname">
                          <div class="m-0 fw-bold" :style="{ fontSize: '1.5em' }">{{ this.receiver.username || "เลือกคนที่ต้องการติดต่อ" }}</div>
                        </template>
                      </div>
                  </div>
                </div>

                <!-- Chat Messages -->
                <div class="chat-messages flex-grow-1 p-3 " :style="{ overflowY: 'auto' }" ref="chatMessages">
                    <div v-for="(message, index) in messages || []"
                      :key="index" class="d-flex mb-3"
                      :class="{
                        'justify-content-start': message.sender_id == this.sender_id,
                        'justify-content-start': message.sender_id != this.sender_id,
                      }"
                    >
                      <div class="d-flex flex-column">
                        <div class="d-flex flex-row">
                          <img 
                              :src="message.sender_id == this.sender_id ? ( this.$cookies.get('account').portrait_path ? 'http://localhost:3000' + this.$cookies.get('account').portrait_path : require('@/assets/user.png')) : (this.receiver.portrait_path ? 'http://localhost:3000' + this.receiver.portrait_path : require('@/assets/user.png'))"
                              class="rounded-circle profile-img mb-1" 
                              style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;"
                            />
                          <div class="d-flex flex-column">
                              <div style="font-size: 1.2em;">{{ message.sender_id == this.sender_id ? this.$cookies.get('account').username  : (this.receiver.displayname || this.receiver.username)}}</div>
                              <div style="font-size: 0.8em;"> {{formatTimestamp(message.timestamp) }}</div>
                          </div>
                        </div>
                        <!-- backgroundColor: message.sender_id == this.sender_id ? '#d1f7c4' : '#f0f0f0', -->
                        <div class="p-2 rounded"
                          style="font-size: 1.3em;"
                          :style="{
                            backgroundColor: message.sender_id == this.sender_id ? '#f0f0f0' : '#c4c2c2',
                            width: 'auto',
                            maxWidth: '100%',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-all',
                            resize: 'none'
                            }"
                        >
                            {{ message.message_text }}
                        </div>
                        <div v-if = "(message.sender_id == this.sender_id) && (messages.length == index+1)" >
                          <span v-if="message.is_read"></span>
                          <span v-else>❌ ยังไม่อ่าน</span>
                        </div>
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
                      style="font-size: 1.3em;"
                    ></textarea>
                    <button class="btn btn-secondary" @click="sendMessage" style="width: 5vw;">
                      <i class="bi bi-send"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Sidebar รายชื่อผู้สนทนา -->
              <div
                class="chat-sidebar py-3"
                :style="{ 
                  width: '25%',
                  backgroundColor: chatFrame, 
                  borderLeft: '1px solid #ddd', 
                  overflowY: 'auto' /* เพิ่ม scroll bar เมื่อมีเนื้อหาเกิน */
                }"
              >
                <div 
                  class="search-bar mb-3 px-3"
                  :style="{
                    height: '50px',
                    position: 'sticky',
                    backgroundColor: '',
                  }"
                  >
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
                    class="d-flex align-items-center p-2"
                    :style="{ cursor: 'pointer', backgroundColor: receiver_id === contact.partner_id ? '#f0f0f0' : 'white' , borderBottom: '1px solid #d9d7d7'}"
                    @click="selectContact(contact.partner_id)"
                  >
                    <img
                      :src="contact && contact.partner_portrait ? 'http://localhost:3000' + contact.partner_portrait : require('@/assets/user.png')"
                      alt="User"
                      class="rounded-circle me-3 profile-img"
                      :style="{ 
                        width: '50px', 
                        height: '50px', 
                        objectFit: 'cover', 
                        maxWidth: '50px', 
                        maxHeight: '50px' 
                      }"
                    />
                    <div>
                      <div :class="center" style="font-size: 1.3em;">{{ contact.partner_displayname || contact.partner_username}} ({{ contact.partner_permission }}) 
                        
                        <div v-if="contact.unread_messages != 0"
                          class="num-box-chat ms-1 px-2" :class="center"
                          style="width: auto; height: auto;"
                          :style="{fontSize: '1.25vw'}"
                        >
                          {{ contact.unread_messages }}
                        </div>

                      </div>
                      <small class="text-muted" style="font-size: 1.1em;">{{ truncateText(contact.message_text, 15) }}</small>
                      <div class="text-muted" style="font-size: 0.8em;"> {{formatTimestamp(contact.timestamp) }}</div>
                    </div>
                  </li>
                </ul>
              </div>
        </div>
    </div>
</template>
  
  <script>
  import axios from "axios";
  import { io } from 'socket.io-client';
  export default {
    name: "ChatPage",
    data() {
      return {
        chatFrame: "#e3e1e1",
        intervalID: null,
        socket: null,
        sender_id: this.$cookies.get('account').account_id,
        receiver_id: parseInt(this.$cookies.get('receiver_id')),
        receiver: {},
        messages: [],
        contacts: [],
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
      this.socket = io("http://localhost:3000");
      this.getContacts()
      this.selectContact(this.receiver_id)


       // รับข้อความที่ส่งมา
       this.socket.on("receiveMessage", ({ sender, receiver, message }) => {
        console.log(`📨 Received message from ${sender}: ${message}`);
        this.messages.forEach((message) => {
          if (message.sender_id === receiver && message.receiver_id === sender) {
            message.is_read = true;
          }
        });
        this.messages.push({
          message_id: null,
          sender_id: sender,
          receiver_id: receiver,
          message_text: message,
          attachment_path: null,
          is_read: false,
          timestamp: new Date().toISOString()
        });

        this.$nextTick(() => this.scrollToBottom());
      });
      this.startInterval();


  },
  beforeUnmount() {
    this.stopInterval(); // หยุด interval เมื่อ component ถูกทำลาย
  },
    computed: {
    filteredContacts() {
      // ค้นหารายชื่อผู้คุยล่าสุดตาม searchQuery
      if (!this.searchQuery) {
        return this.contacts;
      }
      return this.contacts.filter((contact) =>
        contact.partner_username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
    methods: {
      startInterval() {
      this.intervalID = setInterval(() => {
        this.getContacts();
      }, 3000);
    },
      stopInterval() {
      if (this.intervalID) {
        clearInterval(this.intervalID);
        this.intervalID = null; // ตั้งค่าให้เป็น null เพื่อป้องกันการ clear ซ้ำ
      }
    },
      
      getContacts(){
        const data = {
          account_id: this.$cookies.get("account").account_id,
        };
        axios.post("http://localhost:3000/chat/account", data)
        .then((res) => {
            this.contacts = res.data.accounts
        })  
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
      },

      async selectContact(receiver_id) {
        this.$cookies.set("receiver_id",receiver_id);
        this.newMessage = "";

        this.getHistory(this.sender_id ,receiver_id)
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        this.receiver_id = receiver_id;
        this.getReceiver(receiver_id) //ข้อมูลผู้รับ
        this.socket.emit("joinRoom", { user1: this.sender_id, user2: receiver_id });
        this.getContacts()
      },
      
      
      getHistory(sender_id, receiver_id){
        const data = {
          sender_id: sender_id,
          receiver_id: receiver_id,
        };
        axios.post("http://localhost:3000/chat/history", data)
        .then((res) => {

          this.messages = res.data.messages

          this.$nextTick(() => {
            console.log(this.messages); // ตอนนี้ UI น่าจะอัปเดตแล้ว
            this.scrollToBottom(); // ถ้ามีฟังก์ชันเลื่อนลงไปยังข้อความล่าสุด
          });
          })
        .catch((err) => {
          alert(err.response.data.details.message);
        });   
      },
      
      getReceiver(receiver_id){
        console.log(receiver_id)
        const data = {
          account_id: receiver_id,
        };
        axios.post("http://localhost:3000/chat/receiver", data)
        .then((res) => {
          this.receiver = res.data.receiver || {}
          })
        .catch((err) => {
          alert(err.response.data.details.message);
          this.receiver = {};
        });   
      },

      sendMessage() {
        if (this.newMessage.trim() !== "" && this.receiver_id) {
          const data = {
            sender_id: this.sender_id,
            receiver_id: this.receiver_id,
            message: this.newMessage
          };
          axios.post("http://localhost:3000/chat/send", data)
          .then(() => {
            })
          .catch((err) => {
            alert(err.response.data.details.message);
          });   

          this.socket.emit('sendMessage', {
          sender: this.sender_id,
          receiver: this.receiver_id,
          message: this.newMessage
          });

          this.newMessage = "";
          this.$nextTick(() => {
          this.scrollToBottom(); // เรียกฟังก์ชันเลื่อนหลังจาก DOM อัปเดต
          this.getContacts()
          });
        }
      },
      formatTimestamp(timestamp) {
        if(!timestamp) return " ";
        const date = new Date(timestamp);
        return date.toLocaleString('th-TH');
      },
      truncateText(text, maxLength) {
        if (!text) return " ";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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
      messages: {
        handler() {
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        },
        deep: true, // ตรวจสอบการเปลี่ยนแปลงภายใน messages (กรณีเป็น array/object)
        immediate: true, // เรียกครั้งแรกเมื่อ component ถูกสร้าง
      },
    },
    
  };
  </script>
  
<style>
img {
    object-fit: cover;
}
.num-box-chat {
  background-color: #3fbd39;
  color: white;
  border-radius: 100px;
}
</style>