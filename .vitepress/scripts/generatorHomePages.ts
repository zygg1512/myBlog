import { SidebarBars } from './generatorSideBars'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

function generatorHomePages(sideBars: SidebarBars) {
    const sideBarNames = Object.keys(sideBars)
    let featuresMd: string = ''
    for (const sideBarName of sideBarNames) {
        const sideBarInfos = sideBars[sideBarName]
        if (!Array.isArray(sideBarInfos) || !sideBarInfos.length) continue
        const sideBar = sideBarInfos[0]
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
