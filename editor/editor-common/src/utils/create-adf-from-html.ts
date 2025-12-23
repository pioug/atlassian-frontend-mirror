import type { DocNode } from '@atlaskit/adf-schema';

import { parseHTMLTextContent } from './parse-html-text-content';

/**
 * Creates ADF from HTML string.
 * This is particularly useful for providing translations in HTML to be supported and we convert back to ADF here
 * See: https://developer.atlassian.com/platform/localization/i18n-formatting/avoiding-concatenation/
 *
 * This function only supports a subset of the schema as it is intended for translations, but it supports
 * SSR as it has no DOM dependencies and is lightweight.
 *
 * @param html - The HTML string to convert to ADF
 * @returns ADF DocNode or undefined if parsing fails
 */
export const createADFFromHTML = (html: string): DocNode => {
	return parseHTMLTextContent(html);
};
