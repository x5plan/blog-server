export const enum CE_Language {
    en = "en",
    zh_cn = "zh-cn",
}

export const languages: CE_Language[] = [CE_Language.en, CE_Language.zh_cn];

export const defaultLanguage = CE_Language.en;

export function getLanguage(lang: string): CE_Language {
    return languages.includes(lang as CE_Language) ? (lang as CE_Language) : defaultLanguage;
}
