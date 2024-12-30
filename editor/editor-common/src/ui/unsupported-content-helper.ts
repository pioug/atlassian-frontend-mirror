import { type IntlShape } from 'react-intl-next';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
export function getUnsupportedContent(
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	message: any,
	prefix: string,
	node?: PMNode,
	intl?: IntlShape,
) {
	const defaultLocale = 'en';
	let canTranslateToLocale = true;
	const locale = intl ? intl.locale : defaultLocale;
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
