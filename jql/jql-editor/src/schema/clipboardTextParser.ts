/* eslint-disable @atlaskit/platform/no-direct-document-usage -- ProseMirror schema uses document to build DOM markers */

import { DOMParser, type ResolvedPos, type Slice } from '@atlaskit/editor-prosemirror/model';

import { splitTextByNewLine } from '../utils/split-text-by-new-line';
import { JQLEditorSchema } from './index';

const domParser = DOMParser.fromSchema(JQLEditorSchema);

/**
 * Emulate the behaviour of the default https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextParser but
 * preserves consecutive empty lines.
 */
export const clipboardTextParser = (text: string, $context: ResolvedPos): Slice => {
	const dom = document.createElement('div');
	// Split each line of text and wrap each in a p tag.
	splitTextByNewLine(text).forEach((block) => {
		dom.appendChild(document.createElement('p')).textContent = block;
	});
	return domParser.parseSlice(dom, {
		context: $context,
		preserveWhitespace: true,
	});
};
