import {
    QuickOpenBox as QuickOpenBoxImport
} from './1.73.0.js'

export * from './1.73.0.js'
export const locatorVersion = 'insiders'
export const QuickOpenBox = {
    ...QuickOpenBoxImport,
    elem: '.quick-input-widget'
}
