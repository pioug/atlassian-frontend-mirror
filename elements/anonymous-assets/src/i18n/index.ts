export const locales: Record<string, () => Promise<any>> = {
	en: () => import(/* webpackChunkName: "@atlaskit-internal_anonymous-assets-i18n-en" */ './en'),
};
