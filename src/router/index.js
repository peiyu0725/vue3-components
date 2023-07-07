import { createRouter, createWebHashHistory } from 'vue-router';
import FullCalendar from '../components/FullCalendar.vue'
import DateTimePicker from '../components/DateTimePicker.vue'
import Editor from '../components/Editor.vue'
import VideoPlayer from '../components/VideoPlayer.vue'

const routes = [
    { path: '/', component: FullCalendar, props: true },
    { path: '/dateTimePicker', component: DateTimePicker },
    { path: '/editor', component: Editor },
    { path: '/videoPlayer', component: VideoPlayer },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;