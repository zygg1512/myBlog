import { SidebarItem } from './generatorSideBars'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

function generatorHomePages(sideBars: SidebarItem[]) {
    let featuresMd: string = ''
    for (const sideBar of sideBars) {
        const { text } = sideBar
        let _sideBar = sideBar
        while (_sideBar.items && _sideBar.items.length) {
            const item = _sideBar.items[0]
            _sideBar = item
        }
        featuresMd += `\n    - title: ${text}\n      link: ${_sideBar?.link}`
    }
    const homeTemplate = readFileSync(resolve(__dirname, './templates/home.md'), 'utf-8')

    const homeMd = homeTemplate.replace('{{features}}', featuresMd)
    writeFileSync(resolve(__dirname, '../../src/index.md'), homeMd)
}
export default generatorHomePages
