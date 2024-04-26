import { defineConfig } from 'vitepress'
import generatorSideBars from './scripts/generatorSideBars'
import generatorHomePages from './scripts/generatorHomePages'
import { resolve } from 'path'
const sidebar = generatorSideBars('blogs')
generatorHomePages(sidebar)
export default defineConfig({
    title: 'MyBlog',
    description: 'Blog For Zygg',
    head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
    outDir: resolve(__dirname, '../static/dist'),
    cacheDir: resolve(__dirname, '../static/cache'),
    srcDir: 'src',
    srcExclude: ['**/.DS_Store'],
    cleanUrls: true,
    themeConfig: {
        logo: '/logo.png',
        sidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
        outline: {
            level: 'deep'
        },
        search: {
            provider: 'local'
        }
    }
})
