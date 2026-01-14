import type { IntlShape } from 'react-intl-next';

import { timestampToString } from '@atlaskit/editor-common/utils';
import type { Slice } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns a plain text serialization of a given slice. This is used for populating the plain text
 * section of the clipboard on copy.
 * The current implementation is bare bones - only inlineCards, blockCards and mentions are tested (they
 * previously were empty on plain text copy).
 *
 * By default (without this function passed to the editor), the editor uses
 * `slice.content.textBetween(0, slice.content.size, "\n\n")`
 * (see https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextSerializer)
 *
 * @todo Remove when `platform_editor_date_to_text` FF is removed.
 *       Also, rename the file to `create-clipboard-text-serializer.ts`.
 */
export function clipboardTextSerializer(slice: Slice): string {
	const blockSeparator = '\n\n';

	return slice.content.textBetween(0, slice.content.size, blockSeparator, (leafNode) => {
		switch (leafNode.type.name) {
			case 'hardBreak':
				return '\n';
			case 'text':
				return leafNode.text;
			case 'inlineCard':
				return leafNode.attrs.url;
			case 'blockCard':
				return leafNode.attrs.url;
			// Note: Due to relying on an async fetch of the Mention name by the Node's React component,
			// pasting a mention does not actually work for the in-product Mention implementation.
			// However, this is also true of the previous implementation.
			// Bug ticket: https://product-fabric.atlassian.net/browse/ED-23076
			case 'mention':
				return leafNode.attrs.text;
			default:
				// Unsupported node
				return leafNode.text ?? '';
		}
	});
}

/**
 * Returns a plain text serialization of a given slice. This is used for populating the plain text
 * section of the clipboard on copy.
 * The current implementation is bare bones - only inlineCards, blockCards and mentions are tested (they
 * previously were empty on plain text copy).
 *
 * By default (without this function passed to the editor), the editor uses
 * `slice.content.textBetween(0, slice.content.size, "\n\n")`
 * (see https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextSerializer)
 */
export function createClipboardTextSerializer(intl: IntlShape) {
	return (slice: Slice): string => {
		const blockSeparator = '\n\n';

		return slice.content.textBetween(0, slice.content.size, blockSeparator, (leafNode) => {
			switch (leafNode.type.name) {
				case 'hardBreak':
					return '\n';
				case 'text':
					return leafNode.text;
				case 'inlineCard':
					return leafNode.attrs.url;
				case 'blockCard':
					return leafNode.attrs.url;
				// Note: Due to relying on an async fetch of the Mention name by the Node's React component,
				// pasting a mention does not actually work for the in-product Mention implementation.
				// However, this is also true of the previous implementation.
				// Bug ticket: https://product-fabric.atlassian.net/browse/ED-23076
				case 'mention':
					return leafNode.attrs.text;
				case 'date':
					return timestampToString(leafNode.attrs.timestamp, intl);
				default:
					// Unsupported node
					return leafNode.text ?? '';
			}
		});
	};
}
