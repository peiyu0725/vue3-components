import { createRouter, createWebHashHistory } from 'vue-router';
import FullCalendar from '../components/FullCalendar.vue'
import DateTimePicker from '../components/DateTimePicker.vue'
import Editor from '../components/Editor.vue'

const routes = [
    { path: '/', component: FullCalendar, props: true },
    { path: '/dateTimePicker', component: DateTimePicker },
    { path: '/editor', component: Editor },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;