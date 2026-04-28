import { translations } from "../assets/translations.js"

export const i18n = {
    locale: 'pt-br',
    t: (key) => (translations[i18n.locale][key])
}

