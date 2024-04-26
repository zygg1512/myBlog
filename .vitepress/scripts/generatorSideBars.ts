import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'
export type SidebarItem = {
    text?: string
    link?: string
    items?: SidebarItem[]
    collapsed?: boolean
    base?: string
    docFooterText?: string
    rel?: string
    target?: string
}
function generatorSideBars(root) {
    const rootDir = resolve(__dirname, '../../src', root)
    const files = readdirSync(rootDir)
    const sideBars: SidebarItem[] = []
    for (const file of files) {
        const fileDir = resolve(rootDir, file)
        const fileStats = statSync(fileDir)
        const isDir = fileStats.isDirectory()
        if (isDir) {
            const items = generatorSideBars(`${root}/${file}`)
            const sidebarItem: SidebarItem = {
                text: file,
                items,
                collapsed: true
            }
            sideBars.push(sidebarItem)
        } else if (computedFileExtension(file) === 'md') {
            const sidebarItem: SidebarItem = {
                text: file,
                link: `/${root}/${file}`
            }
            sideBars.push(sidebarItem)
        }
    }
    return sideBars
}
function computedFileExtension(file) {
    return file.slice(file.lastIndexOf('.') + 1)
}
export default generatorSideBars
