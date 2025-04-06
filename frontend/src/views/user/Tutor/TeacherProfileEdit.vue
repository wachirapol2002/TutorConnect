<template>
    <div id="app">
        <div class="container-fluid rounded-4  border border-dark my-5 p-3 py-4" :style="{ backgroundColor: 'white' }" style="width: 80vw;">
            <!-- ส่วนข้อมูลของผู้สอน -->            
            <div class="d-flex justify-content-start align-items-center" :style="{ backgroundColor: '' }">
                <div :class="center" class="m-0 p-0" style="width: 25vw;" :style="{ backgroundColor: '' }">
                <!-- รูปโปรไฟล์ -->
                    <div class="m-0 rounded-circle bg-light" :class="center" :style="{ backgroundColor: 'white' }" style="height:13vw; width: 13vw; background-color: white; border: 1px solid black; overflow: hidden;">
                        <img :src="'http://localhost:3000' + this.tutor.portrait_path || require('@/assets/user.png')" alt="โปรไฟล์" class="img-fluid rounded-circle" style="width: 100%; height: 100%; object-fit: cover;"/>
                    </div>
                </div>
                <div class="container" style="width: 40vw;" :style="{ backgroundColor: '' }">
                    <!-- ชื่อผู้สอน -->
                    <div class="d-flex align-items-center">
                      <input
                        class="form-control information fw-bold p-0"
                        :class="{ 'border-danger': v$.tutorName.$error }"
                        :style="{ 
                          fontSize: '2vw',
                          width: `${tutorName.length ? tutorName.length + 1 : 10}ch`
                        }"
                        type="text"
                        id="tutorName"
                        name="tutorName"
                        required
                        placeholder="ชื่อที่แสดง*"
                        maxlength="20"
                        v-model="tutorName"
                      />
                        <!-- ดาวและคะแนน -->
                        <div class="ms-3">
                            <span v-for="star in Math.floor(this.rating_score)" :key="star" class="text-warning" :style="{ fontSize: '2vw' }">★</span>
                            <span v-for="empty in (5 - Math.floor(this.rating_score))" :key="empty" class="text-secondary" :style="{ fontSize: '2vw' }">★</span>
                            <small class="ms-1" :style="{ fontSize: '2vw' }">{{ formatScore(this.rating_score)}}/5</small>
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
                    <div class="d-flex align-items-center" :style="{ fontSize: '1.5vw'}" >
                      <textarea
                      class="form-control information my-2 p-0"
                      :class="{ 'border-danger': v$.introduce.$error }"
                      :style="{ fontSize: '1.5vw'}"
                      type="text"
                      id="introduce"
                      name="introduce"
                      required
                      placeholder="แนะนำตัวให้นักเรียนสนใจ*"
                      maxlength="255"
                      v-model="introduce"
           
                      style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal;"
                      
                    >
                    </textarea>
                    </div>
                    <template v-if="v$.introduce.$error">
                      <p class="text-danger mb-2 p-0" v-if="v$.introduce.required.$invalid">
                        ต้องกรอกข้อมูลช่องนี้
                      </p>
                    </template>
                    <!-- ช่องทางการติดต่อ -->
                    <div class="d-flex align-items-center">
                        <!-- ไอคอน Facebook -->
                        <img class="LinkIcon" :src="require('@/assets/facebook.png')" alt="Facebook" width="5%" height="auto" 
                        />
                        <input
                          class="form-control information"
                          type="facebook"
                          id="facebook"
                          required
                          placeholder="Link Facebook"
                          maxlength="255"
                          v-model="facebook"
                          :style="{ 
                          width: `${facebook.length ? facebook.length + 1 : 10}ch`
                          }"
                        />

                    </div>

                    <div class="d-flex align-items-center my-2">
                        <!-- ไอคอน LINE -->
                        <img class="LinkIcon" :src="require('@/assets/line.png')" alt="Line" width="5%" height="auto"
                        />
                        <input
                          class="form-control information"
                          type="text"
                          id="line"
                          required
                          placeholder="Line ID"
                          maxlength="30"
                          v-model="line"
                          :style="{ 
                          width: `${line.length ? line.length + 1 : 10}ch`
                          }"
                        />
                    </div>
                    <div class="d-flex align-items-center">
                      <div class="fw-light" :style="{ fontWeight: '400', fontSize: '1.5vw'}">เบอร์ติดต่อ:
                        
                         <i>{{ this.tutor.phone }}</i>
                      </div>
                    </div>
        
                    <div class="d-flex align-items-center mt-3">
                      <div class="button rounded-3 me-5 bg-dark text-white fw-bold" :style="{}" @click="back()">
                          ยกเลิก
                      </div>
                      <div class="button rounded-3 me-5 bg-dark text-white fw-bold" :style="{}" @click="submit()">
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
                  <textarea
                    class="form-control information mt-2"
                    :class="{ 'border-danger': v$.describe.$error }"
                    type="text"
                    id="describe"
                    name="describe"
                    required
                    placeholder="เขียนบรรยายประสบการณ์สอน"
                    v-model="describe"
                    @input="autoResize"
                    style="overflow: hidden; resize: none; min-height: 30vh;"
                  >
                  </textarea>
                  <template v-if="v$.describe.$error">
                    <p class="text-danger m-0 p-0" v-if="v$.describe.required.$invalid">
                      ต้องกรอกข้อมูลช่องนี้
                    </p>
                  </template>


                <!-- ประวัติการศึกษา -->
                <div class="row my-2 ">
                  <div class="mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}">ประวัติการศึกษา</div>
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
                      <ul v-if="graduates.length" class="m-1 border-bottom border-2 mb-4">
                        <li
                          v-for="(graduate, index) in graduates"
                          :key="graduate.graduate_id"
                          class="d-flex justify-content-between align-items-center my-2"
                        >
                          <span>
                            - {{ graduate.status }} {{ graduate.degree }} {{ graduate.school_name }} {{ graduate.honor }} {{ graduate.grade }}
                          </span>
                          <button type="button" @click="removeAcademy(graduate.graduate_id, index)" class="btn btn-danger btn-sm information">ลบ</button>
                        </li>
                      </ul>
                    </div>
                </div>
                

                <!-- สถานทีสอน -->
                <!-- Map -->
                <div class="mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}">สถานที่สอน</div>
                <div class="form-label mt-3" :style="{fontWeight: '500', fontSize: '1.2vw',}" for="onside">ออนไซต์</div>
                <div id="map" style="height: 60vh; width: 100%;"></div>
                <input id="placeInput" type="text" placeholder="ค้นหาสถานที่" class="form-control information" />
                <!-- ออนไซต์ -->
                <div class="row my-4">
                  <!--ชื่อสถานที่ -->
                  <div class="form-group col-3 mx-0">
                    <input
                      v-model="placeName"
                      type="text"
                      placeholder="ระบุชื่อสถานที่*"
                      class="form-control information"
                    />
                  </div>
                  <!-- พิกัดสถานที่ -->
                  <div class="form-group col-6 mx-0 px-0">
                    <input
                      v-model="placeAddress"
                      type="text"
                      placeholder="ระบุที่อยู่"
                      class="form-control information"
                    />
                  </div>
                  <!-- ปุ่มเพิ่มสถานที่ -->
                  <div class="form-group col-2 mx-0">
                    <button type="button" @click="addPlace" class="btn btn-secondary information">เพิ่มสถานที</button>
                  </div>
                </div>
                <!-- ออนไลน์ -->
                <div class="form-label mt-3" :style="{fontWeight: '500', fontSize: '1.2vw',}" for="onside">ออนไลน์</div>
                <div class="row my-4">
                  <!--ชื่อสถานที่ -->
                  <div class="form-group col-9 mx-0">
                    <input
                      v-model="appName"
                      type="text"
                      placeholder="ระบุชื่อโปรแกรม/เว็บไซต์*"
                      class="form-control information"
                    />
                  </div>
                  <!-- ปุ่มเพิ่มสถานที่ -->
                  <div class="form-group col-2 mx-0">
                    <button type="button" @click="addApp" class="btn btn-secondary information">เพิ่มโปรแกรม</button>
                  </div>
                </div>
                <div class="row my-4">
                  <!-- แสดงรายการสถานที่ -->
                  <ul v-if="places.length" class="m-1 border-bottom border-2 mb-4">
                    <li
                      v-for="(place, index) in places"
                      :key="place.location_id"
                      class="d-flex justify-content-between align-items-center my-2"
                      :style="{fontSize: '1vw',}"
                    >
                      <div class="col-11">
                      - {{ place.place_name + (place.address !== 'ไม่ระบุ' ? ' ' + place.address : '') }}
                      </div>
                      <button type="button" @click="removePlace(place.location_id, index)" class="btn btn-danger btn-sm">ลบ</button>
                    </li>
                  </ul>
                </div>
                

               
                 <!-- วิชาที่ต้องการสอน -->
                  <div class="form-label mt-3" :style="{fontWeight: '500', fontSize: '1.5vw',}" for="subject">วิชาที่ต้องการสอน</div>
                  <div class="row my-0">
                    <div class="form-group col-3 mx-0 pe-1">
                      <label class="form-label" for="subject" :style="{fontWeight: '500', fontSize: '1.5vw',}">หมวดวิชา</label>
                    </div>
                    <div class="form-group col-3 mx-0 pe-1">
                      <label class="form-label" for="subject" :style="{fontWeight: '500', fontSize: '1.5vw',}">ชื่อวิชา</label>
                    </div>
                    <div class="form-group col-2 mx-0 pe-1">
                      <label class="form-label" for="subject" :style="{fontWeight: '500', fontSize: '1.5vw',}">ระดับชั้น</label>
                    </div>
                    <div class="form-group col-2 mx-0 pe-1">
                      <label class="form-label" for="subject" :style="{fontWeight: '500', fontSize: '1.5vw',}">ราคา/ชั่วโมง</label>
                    </div>
                  </div>

                  <div class="row my-2 mt-0">
                    <!-- เลือกหมวดวิชา -->
                    <div class="form-group col-3 mx-0 pe-1">
                      <select v-model="selectedCategory" class="form-control information">
                        <option value="" disabled>เลือกหมวดวิชา*</option>
                        <option v-for="(category, index) in categories" :key="index" :value="category">
                          {{ category }}
                        </option>
                      </select>
                    </div>
                    <!-- กรอกชื่อวิชา -->
                    <div class="form-group col-3 mx-0 px-1">
                      <input
                        v-model="subjectName"
                        type="text"
                        placeholder="ชื่อวิชาที่สอน*"
                        class="form-control information"
                      />
                    </div>
                    <!-- กรอกชื่อวิชา -->
                    <div class="form-group col-2 mx-0 px-1">
                      <select v-model="subjectDegree" class="form-control information">
                        <option value="" disabled>ช่วงวัย</option>
                        <option value="ประถมต้น">ประถมต้น</option>
                        <option value="ประถมปลาย">ประถมปลาย</option>
                        <option value="มัธยมต้น">มัธยมต้น</option>
                        <option value="มัธยมปลาย">มัธยมปลาย</option>
                      </select>
                    </div>
                    <!-- กรอกชื่อวิชา -->
                    <div class="form-group col-2 mx-0 px-1">
                      <input
                        v-model="subjectPrice"
                        type="text"
                        placeholder="บาท"
                        class="form-control information"
                      />
                    </div>
          
                    <!-- คำอธิบายรายวิชา -->
                    <div class="row my-2">
                      <div class="form-group col-12">
                        <label class="form-label" for="subjectDescribe">คำอธิบายรายวิชา</label>
                        <textarea
                          class="form-control information"
                          type="text"
                          id="subjectDescribe"
                          name="subjectDescribe"
                          required
                          placeholder="รายละเอียดการสอน"
                          v-model="subjectDescribe"
                          style="height: 15vh;"
                        >
                        </textarea>
                      </div>
                    </div>
                    <!-- สถานที่สอนแต่ละวิชา -->
                    <div class="row my-2">
                    <div class="form-group col-12">
                        <div class="btn-group col-6 mx-1">
                          <button
                            type="button"
                            class="btn col-3"
                            :class="{'btn-dark': subjectPlace === 'ออนไซต์ และ ออนไลน์', 'btn-outline-secondary': subjectPlace !== 'ออนไซต์ และ ออนไลน์'}"
                            @click="subjectPlace = 'ออนไซต์ และ ออนไลน์'"
                            style="font-size: 1vw;"
                          >
                            ออนไซต์ และ ออนไลน์
                          </button>
                          <button
                            type="button"
                            class="btn col-3"
                            :class="{'btn-dark': subjectPlace === 'ออนไซต์', 'btn-outline-secondary': subjectPlace !== 'ออนไซต์'}"
                            @click="subjectPlace = 'ออนไซต์'"
                            style="font-size: 1vw;"
                          >
                            ออนไซต์
                          </button>
                          <button
                            type="button"
                            class="btn col-3"
                            :class="{'btn-dark': subjectPlace === 'ออนไลน์', 'btn-outline-secondary': subjectPlace !== 'ออนไลน์'}"
                            @click="subjectPlace = 'ออนไลน์'"
                            style="font-size: 1vw;"
                          >
                            ออนไลน์
                          </button>
                        </div>
                        <!-- ปุ่มเพิ่มวิชา -->
                        <div class="btn-group mx-5 col-1">
                            <button type="button" @click="addSubject" class="btn btn-secondary information">เพิ่มวิชา</button>
                        </div>
                    </div>
                  </div>
                  <template v-if="v$.subjectPlace.$error">
                      <p class="text-danger mx-5 p-0" v-if="v$.subjectPlace.required.$invalid" style="font-size: 1vw;">
                          ต้องเลือก ประเภทสถานที่สอน
                      </p>
                  </template>


                

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
            <!-- แสดงรายการวิชาที่เพิ่ม -->
            <div class="information mt-3">
            <ul v-if="subjects.length" class="m-1 border-bottom border-2 mb-4">
              <li
                v-for="(subject, index) in subjects"
                :key="subject.subject_id"
                class="d-flex justify-content-between align-items-center my-2"
              >
                <span>
                  <!-- {{ index + 1 }}. หมวด: {{ subject.category }} | ชื่อวิชา: {{ subject.subject_name }} {{ subject.degree_level }} {{ subject.price }} บาท/ชั่วโมง -->
                     {{ index + 1 }}. หมวด {{ subject.category }} | {{ subject.subject_name }} {{ subject.degree_level }} {{ subject.price }} บาท/ชั่วโมง
                </span>
                <div>
                  <button type="button" @click="SubjectDescribe(subject.subject_id, index)" class="btn btn-secondary btn-sm fw-bold text-light">รายละเอียดวิชา</button>
                  <button type="button" @click="removeSubject(subject.subject_id, index)" class="text-light btn btn-danger btn-sm mx-2">ลบ</button>
     
                </div>


                
              </li>
            </ul>
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
        phone: "",
        introduce: "",
        describe: "",
        status: '', // ค่าเริ่มต้น
        degree: '',
        school_name: '',
        honor: '',
        grade: '',
        academy: "",
        academys: [],        
        map: null,       // เก็บอ็อบเจกต์แผนที่
        marker: null,    // เก็บตำแหน่ง Marker
        placeName: "", 
        placePosition: "",
        placeAddress: "",
        appName: "",
        place: "",       // เก็บค่าพิกัดที่เลือก
        places: [],
        selectedCategory: "", // หมวดวิชาที่เลือก
        subjectName: "", // ชื่อวิชาที่กรอก
        subjects: [], // Array เก็บวิชาที่เพิ่ม
        graduates: [],
        showSubjectDetail: false,
        showSubjectRating: false,
        subjectDetail: {},
        categories: ["ภาษา", "วิชาการ", "ดนตรี", "กีฬา", "คอมพิวเตอร์", "ทักษะชีวิต", "พัฒนาวิชาชีพ"], // หมวดวิชาที่มีให้เลือก
        subjectDegree: "",
        subjectPrice: "",
        subjectDescribe: "",
        subjectPlace: null,
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
      subjectPlace:{
        required: required,
      },
    }
  },

    mounted() {
      this.initInfo()
      this.initGoogleMap();
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
    formatScore(score) {
      const validScore = parseFloat(score);
      if (isNaN(validScore)) {
        return '0';
      }
      return validScore % 1 === 0 ? validScore.toFixed(0) : validScore.toFixed(1);
    },
      initGoogleMap() {
        const apiKey = `AIzaSyA3COn2lDxjeOm1IsKFTt_78770tHMGnAU`; // แทนที่ด้วย API Key จริงของคุณ
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&language=th`;
        script.async = true;
        script.defer = true;
        window.initMap = this.setupGoogleMap;
        document.head.appendChild(script);
      },
      setupGoogleMap() {
        console.log("Google Maps API Loaded:", window.google);
      if (!window.google) {
        this.initGoogleMap();
        return;
      }

      const defaultLocation = { lat: 13.736717, lng: 100.523186 };
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 13,
      });

      // สร้าง Marker เริ่มต้น + เพิ่ม draggable: true ให้ลากได้
      this.marker = new google.maps.Marker({
        position: defaultLocation,
        map: this.map,
        draggable: true,
      });

      // ✨ Event: ลาก marker แล้วอัปเดตพิกัดใหม่
      google.maps.event.addListener(this.marker, "dragend", (event) => {
        const { lat, lng } = event.latLng.toJSON();
        this.placePosition = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;
        console.log("พิกัดใหม่:", this.placePosition);
      });

      // สร้าง Autocomplete
      const input = document.getElementById("placeInput");
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", this.map);

      // ค้นหาสถานที่ผ่าน Autocomplete
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          alert("ไม่สามารถค้นหาตำแหน่งนี้ได้ กรุณาลองใหม่อีกครั้ง");
          return;
        }

        const location = place.geometry.location;
        const { lat, lng } = location.toJSON();
        this.placeName = place.name || "";
        this.placePosition = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;
        this.placeAddress = place.formatted_address || "ไม่พบที่อยู่";

        // ย้าย Marker ไปตำแหน่งใหม่
        this.marker.setPosition(location);

        // ขยับแผนที่ไปตำแหน่งใหม่
        this.map.setCenter(location);
        this.map.setZoom(15);
      });

      // คลิกบนแผนที่เพื่อเพิ่ม/ย้าย Marker
      this.map.addListener("click", (event) => {
        const { lat, lng } = event.latLng.toJSON();
        this.placePosition = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;

        this.marker.setPosition(event.latLng);
        this.map.setCenter(event.latLng);
      });
    },
    autoResize(event) {
      event.target.style.height = "30vh";
      event.target.style.height = `${event.target.scrollHeight}px`; // ขยายตามเนื้อหาจริง
    },
    formatText(text) {
        return text.replace(/\n/g, "<br>");
    },
    formatTimestamp(timestamp) {
      if(!timestamp) return " ";
        const date = new Date(timestamp);
        return date.toLocaleString('th-TH');
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
          return axios.post("http://localhost:3000/tutor/place", { tutor_id: this.tutor_id });
          })
          .then((res) => {
            this.places = res.data.places;
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
      addPlace() {
      if (this.placeName) {
        this.marker.setPosition({ lat: 13.736717, lng: 100.523186 });
        this.map.setCenter({ lat: 13.736717, lng: 100.523186 });
        let data = {}
        if (this.placePosition == "") {
          data = {
            tutor_id: this.tutor_id,
            placeName: this.placeName,
            address: this.placeAddress ? this.placeAddress : "ไม่ระบุ",
            position: "สอนออนไลน์"
          };
        }else{
          data = {
            tutor_id: this.tutor_id,
            placeName: this.placeName,
            address: this.placeAddress ? this.placeAddress : "ไม่ระบุ",
            position: this.placePosition,
          };
        }
        axios
          .post("http://localhost:3000/tutor/place/add", data)
          .then((res) => {
            this.places = res.data.places
            this.placePosition = "";
            this.placeAddress = "";
            this.placeName = "";
            document.getElementById("placeInput").value = "";
          })
          .catch((err) => {
            alert(err);
            console.log(err)
          });

      } else {
        alert("กรุณาระบุสถานที่สอนก่อน");
      }
    },
    addApp() {
      if (this.appName) {
        let data = {
            tutor_id: this.tutor_id,
            placeName: this.appName,
            address: "ออนไลน์",
            position: "สอนออนไลน์"
        };
        axios
          .post("http://localhost:3000/tutor/place/add", data)
          .then((res) => {
            this.places = res.data.places
            this.appName = "";
          })
          .catch((err) => {
            alert(err);
            console.log(err)
          });

      } else {
        alert("กรุณาระบุโปรแกราม/เว็บไซต์ก่อน");
      }
    },
    removePlace(location_id, index) {
      if (confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
        const data = {
            location_id: location_id,
          };
        axios
          .post("http://localhost:3000/tutor/place/remove", data)
          .then(() => {
            this.places.splice(index, 1); // ลบข้อมูลจากหน้าจอ
          })
          .catch((err) => {
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            console.error(err);
          });
      }
    },
    addSubject() {
      this.v$.$touch();
      if(!this.v$.$invalid){
          if (this.subjectName){
            if (this.subjectName.includes(",")) {
              alert("ห้ามใช้เครื่องหมาย , ในชื่อวิชา");
              return;
            }
            const data = {
                tutor_id: this.tutor_id,
                selectedCategory: this.selectedCategory, // หมวดวิชาที่เลือก
                subjectName: this.subjectName, // ชื่อวิชาที่กรอก
                subjectDegree: this.subjectDegree,
                subjectPrice: this.subjectPrice,
                subjectDescribe: this.subjectDescribe,
                subjectPlace: this.subjectPlace,
              };
            axios
              .post("http://localhost:3000/tutor/subject/add", data)
              .then((res) => {
                this.subjects = res.data.subjects
                this.selectedCategory = ''
                this.subjectName = ''
                this.subjectDegree = ''
                this.subjectPrice = ''
                this.subjectDescribe = ''
                this.subjectPlace = null
              })
              .catch((err) => {
                alert(err);
                console.log(err)
              });
        }else{
          alert("กรุณากรอกชื่อวิชาก่อน");
        }
      }
    },
  

    SubjectDescribe(subject_id, index) {
      // ดึงข้อมูลวิชาจาก index หรือ subject_id
      const subject = this.subjects[index];
      this.subjectDetail = subject; // เก็บข้อมูลใน subjectDetail
      this.showSubjectDetail = true; // เปิด popup
    },
    closePopup() {
      this.showSubjectDetail = false; // ปิด popup
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
              this.graduates = res.data.graduates
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
            this.graduates.splice(index, 1); // ลบข้อมูลจากหน้าจอ
          })
          .catch((err) => {
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            console.error(err);
          });
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
  
    submit() {
      // Validate all fields
      this.v$.$touch();
        // เช็คว่าในฟอร์มไม่มี error
        if (!this.v$.$invalid) {
          const data = {
            account_id: this.$cookies.get("account").account_id,
            tutorName: this.tutorName,
            introduce: this.introduce,
            describe: this.describe,
            facebook: this.facebook,
            line: this.line,
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
              alert("บันทึกข้อมูลผู้สอนแล้ว");
              this.$router.push({ path: "/teacher/profile" });
            })
            .catch((err) => {
              alert(err.response.data.details.message);
              console.log(err)
            });
        }
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
.btn{
  transition: transform 0.2s ease;
  border: 3px solid #D9D9D9; /* กรอบ */
  width: auto; /* ขนาดกล่อง */
  height: auto;
  text-align: center;
  transition: transform 0.2s;
  
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