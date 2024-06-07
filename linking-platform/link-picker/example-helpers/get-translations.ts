/* eslint-disable import/dynamic-import-chunkname */
export const getTranslations = async (locale: string) => {
	let messages = {};
	if (!locale.includes('en')) {
		messages = await Promise.all([import(`../src/i18n/${locale}`)]).then((modules) =>
			modules.reduce((combined, module) => ({ ...combined, ...module.default }), {}),
		);
	}
	return messages;
};
