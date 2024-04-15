export const locales: Record<string, () => Promise<any>> = {
  cs: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-cs" */ './cs'
    ),
  da: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-da" */ './da'
    ),
  de: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-de" */ './de'
    ),
  en_GB: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-en-GB" */ './en_GB'
    ),
  en_ZZ: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-en-ZZ" */ './en_ZZ'
    ),
  en: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-en" */ './en'
    ),
  es: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-es" */ './es'
    ),
  fi: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-fi" */ './fi'
    ),
  fr: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-fr" */ './fr'
    ),
  hu: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-hu" */ './hu'
    ),
  it: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-it" */ './it'
    ),
  ja: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-ja" */ './ja'
    ),
  ko: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-ko" */ './ko'
    ),
  nb: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-nb" */ './nb'
    ),
  nl: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-nl" */ './nl'
    ),
  pl: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-pl" */ './pl'
    ),
  pt_BR: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-pt-BR" */ './pt_BR'
    ),
  ru: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-ru" */ './ru'
    ),
  sv: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-sv" */ './sv'
    ),
  th: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-th" */ './th'
    ),
  tr: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-tr" */ './tr'
    ),
  uk: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-uk" */ './uk'
    ),
  vi: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-vi" */ './vi'
    ),
  zh_TW: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-zh-tw" */ './zh_TW'
    ),
  zh: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-zh" */ './zh'
    ),
};
