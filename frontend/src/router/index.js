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
        path: '/tutor/register',
        name: 'RegisterTutorPage',
        component: () => import('../views/user/Tutor/RegisterTutor.vue')
    },
    {
        path: '/tutor/info',
        name: 'TutorInfoPage',
        component: () => import('../views/user/Tutor/TeachingInfo.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router