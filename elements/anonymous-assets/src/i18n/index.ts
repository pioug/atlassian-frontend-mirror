export const locales: Record<string, () => Promise<any>> = {
	en: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-en" */ './en'),
	cs: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-cs" */ './cs'),
	da: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-da" */ './da'),
	de: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-de" */ './de'),
	en_GB: () =>
		import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-en_GB" */ './en_GB'),
	en_ZZ: () =>
		import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-en_ZZ" */ './en_ZZ'),
	es: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-es" */ './es'),
	fi: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-fi" */ './fi'),
	fr: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-fr" */ './fr'),
	hr: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-hr" */ './hr'),
	hu: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-hu" */ './hu'),
	it: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-it" */ './it'),
	ja: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-ja" */ './ja'),
	ko: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-ko" */ './ko'),
	nb: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-nb" */ './nb'),
	nl: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-nl" */ './nl'),
	pl: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-pl" */ './pl'),
	pt_BR: () =>
		import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-pt_BR" */ './pt_BR'),
	ru: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-ru" */ './ru'),
	sr_RS: () =>
		import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-sr_RS" */ './sr_RS'),
	sr_YR: () =>
		import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-sr_YR" */ './sr_YR'),
	sv: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-sv" */ './sv'),
	th: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-th" */ './th'),
	tr: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-tr" */ './tr'),
	uk: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-uk" */ './uk'),
	vi: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-vi" */ './vi'),
	zh: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-zh" */ './zh'),
	zh_TW: () =>
		import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-zh_TW" */ './zh_TW'),
};
