// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
import mediumZoom from 'medium-zoom'
import './custom.css'

export default {
    ...DefaultTheme,

    setup() {
        const initZoom = () => {
            mediumZoom('img', { background: 'rgba(0,0,0.8)' })
        }
        onMounted(() => {
            initZoom()
        })
    }
}
