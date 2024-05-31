import { type IntlShape } from 'react-intl-next';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export function getUnsupportedContent(
	message: any,
	prefix: string,
	node?: PMNode,
	intl?: IntlShape,
) {
	let defaultLocale = 'en';
	let canTranslateToLocale = true;
	let locale = intl ? intl.locale : defaultLocale;
	let finalMessage = message.defaultMessage;

	if (node && locale.startsWith(defaultLocale)) {
		const { originalValue } = node.attrs;
		if (originalValue.text || (originalValue.attrs && originalValue.attrs.text)) {
			finalMessage = originalValue.text ? originalValue.text : originalValue.attrs.text;
			canTranslateToLocale = false;
		} else if (originalValue.type) {
			finalMessage = `${prefix} ${originalValue.type}`;
			canTranslateToLocale = false;
		}
	}

	if (intl && canTranslateToLocale) {
		return intl.formatMessage(message);
	}

	return finalMessage;
}
