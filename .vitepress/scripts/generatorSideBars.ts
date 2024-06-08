import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'
export interface SidebarItem {
    text?: string
    link?: string
    items?: SidebarItem[]
    collapsed?: boolean
    base?: string
    docFooterText?: string
    rel?: string
    target?: string
}
export interface SidebarBars {
    [key: string]: SidebarItem[]
}

function resolveRootDir(root) {
    return resolve(__dirname, '../../src', root)
}
function generatorSideBars(root): SidebarBars {
    const rootDir = resolveRootDir(root)
    const files = readdirSync(rootDir)
    const sideBars: SidebarBars = {}
    for (const file of files) {
        const fileDir = resolve(rootDir, file)
        const fileStats = statSync(fileDir)
        const isDir = fileStats.isDirectory()
        if (!isDir) continue
        const route = `/${root}/${file}/`
        sideBars[route] = [
            {
                text: processFileame(file),
                items: generatorsideItems(`${root}/${file}`)
            }
        ]
    }
    return sideBars
}
function generatorsideItems(root: string): SidebarItem[] {
    const rootDir = resolveRootDir(root)
    const files = readdirSync(rootDir)
    const sidebarItems: SidebarItem[] = []
    for (const file of files) {
        const fileDir = resolve(rootDir, file)
        const fileStats = statSync(fileDir)
        const isDir = fileStats.isDirectory()
        if (isDir) {
            const items = generatorsideItems(`${root}/${file}`)
            const sidebarItem: SidebarItem = {
                text: processFileame(file),
                items,
                collapsed: true
            }
            sidebarItems.push(sidebarItem)
        } else if (computedFileExtension(file) === 'md') {
            const sidebarItem: SidebarItem = {
                text: processFileame(file),
                link: `/${root}/${file}`
            }
            sidebarItems.push(sidebarItem)
        }
    }
    return sidebarItems
}
function computedFileExtension(file) {
    return file.slice(file.lastIndexOf('.') + 1)
}

function processFileame(fileName: string): string {
    return fileName.replace(/^[0-9]\.(.*?)(\.md)*$/, '$1').trim()
}

export default generatorSideBars
