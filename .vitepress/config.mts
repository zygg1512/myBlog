import generatorSideBars from './scripts/generatorSideBars'
import generatorHomePages from './scripts/generatorHomePages'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { resolve } from 'path'
const sidebar = generatorSideBars('blogs')
generatorHomePages(sidebar)

export default withMermaid({
    title: 'MyBlog',
    description: 'Blog For Zygg',
    head: [['link', { rel: 'icon', href: '/myBlog/favicon.ico' }]],
    base: '/myBlog/',
    outDir: resolve(__dirname, '../static/dist'),
    cacheDir: resolve(__dirname, '../static/cache'),
    srcDir: 'src',
    srcExclude: ['**/.DS_Store'],
    cleanUrls: true,
    mermaid: {},
    mermaidPlugin: {
        class: 'mermaid'
    },
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
