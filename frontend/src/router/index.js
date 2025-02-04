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
        component: () => import('../views/user/Tutor/RegisterTutor.vue')
    },
    {
        path: '/tutor/teacher/info',
        name: 'TeacherInfoPage',
        component: () => import('../views/user/Tutor/TeacherInfo.vue')
    },
    {
        path: '/tutor/teaching/info',
        name: 'TeachingInfoPage',
        component: () => import('../views/user/Tutor/TeachingInfo.vue')
    },
    {
        path: '/tutor/profile',
        name: 'TutorProfilePage',
        component: () => import('../views/user/Student/TutorProfile.vue')
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
        path: '/admin/approve',
        name: 'ApproveTutorPage',
        component: () => import('../views/ApproveTutor.vue')
    },
    {
        path: '/chat',
        name: 'ChatPage',
        component: () => import('../views/Chat.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router