/* eslint-disable import/dynamic-import-chunkname */
export const getTranslations = async (locale: string) => {
	let messages = {};
	const isUnsupportedEditorCommonLocale = locale.includes('is') || locale.includes('ro');

	if (!locale.includes('en')) {
		// duplicated in platform/packages/editor/editor-examples-helpers/src/get-translations.ts
		const imports = [
			import(`../../../editor-core/src/i18n/${locale}`),
			import(`../../../../elements/mention/src/i18n/${locale}`),
			import(`../../../../elements/status/src/i18n/${locale}`),
		];

		if (!isUnsupportedEditorCommonLocale) {
			imports.push(import(`../../../editor-common/src/i18n/${locale}`));
		}

		messages = await Promise.all(imports).then((modules) =>
			modules.reduce((combined, module) => ({ ...combined, ...module.default }), {}),
		);
	}
	return messages;
};
