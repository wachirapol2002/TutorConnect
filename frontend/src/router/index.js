import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
    path: '/',
    name: 'HomePage',
    component: () => import('../views/Home.vue')
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('../views/user/Login.vue')
    },
    {
        path: '/student/register',
        name: 'RegisterStudentPage',
        component: () => import('../views/user/Student/RegisterStudent.vue')
    },
    {
        path: '/student/profile',
        name: 'StudentProfilePage',
        component: () => import('../views/user/Student/StudentProfile.vue')
    },
    {
        path: '/student/profile/edit',
        name: 'StudentProfileEditPage',
        component: () => import('../views/user/Student/StudentProfileEdit.vue')
    },
    {
        path: '/student/tutorlist',
        name: 'TutorListPage',
        component: () => import('../views/user/Student/TutorList.vue')
    },
    {
        path: '/student/announce',
        name: 'StudentAnnouncePage',
        component: () => import('../views/user/Student/Announce.vue')
    },
    {
        path: '/tutor/register',
        name: 'RegisterTutorPage',
        component: () => import('../views/user/Tutor/register/RegisterTutor.vue')
    },
    {
        path: '/tutor/verify',
        name: 'VerifyTutorPage',
        component: () => import('../views/user/Tutor/register/VerifyTutor.vue')
    },
    {
        path: '/tutor/teacher/info',
        name: 'TeacherInfoPage',
        component: () => import('../views/user/Tutor/register/TeacherInfo.vue')
    },
    {
        path: '/tutor/teaching/info',
        name: 'TeachingInfoPage',
        component: () => import('../views/user/Tutor/register/TeachingInfo.vue')
    },
    {
        path: '/tutor/wait',
        name: 'TutorWaitPage',
        component: () => import('../views/user/Tutor/register/waitApprove.vue')
    },
    {
        path: '/tutor/profile',
        name: 'TutorProfilePage',
        component: () => import('../views/user/Student/TutorProfile.vue')
    },
    {
        path: '/teacher/profile',
        name: 'TeacherProfilePage',
        component: () => import('../views/user/Tutor/TeacherProfile.vue')
    },
    {
        path: '/teacher/profile/edit',
        name: 'TeacherProfileEditPage',
        component: () => import('../views/user/Tutor/TeacherProfileEdit.vue')
    },
    {
        path: '/tutor/announce',
        name: 'TutorAnnouncePage',
        component: () => import('../views/user/Tutor/FindAnnounce.vue')
    },
    {
        path: '/tutor/studentinfo',
        name: 'StudentInfoPage',
        component: () => import('../views/user/Tutor/StudentInfo.vue')
    },
    {
        path: '/tutor/enroll',
        name: 'TutorEnrollPage',
        component: () => import('../views/user/Tutor/EnrollStudent.vue')
    },
    {
        path: '/tutor/studentlist',
        name: 'StudentListPage',
        component: () => import('../views/user/Tutor/StudentList.vue')
    },
    {
        path: '/admin/verify',
        name: 'ApproveTutorPage',
        component: () => import('../views/user/Admin/ApproveTutor.vue')
    },
    {
        path: '/chat',
        name: 'ChatPage',
        component: () => import('../views/Chat.vue'),
        props: route => ({ receiverId: route.params.receiver_id }) // รับ props จาก params
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router