import { logException } from '@atlaskit/editor-common/monitoring/error';
import type { Fragment, Schema } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';

import { escapeBackslashAndLinksExceptCodeBlock } from './index';

/**
 * Convert plain-text markdown to a ProseMirror Slice using the GFM converter.
 *
 * Only called when a `markdownToPmConverter` is provided. Returns `undefined` if the converter
 * throws or produces an empty document — the caller will propagate `undefined`
 * without falling back to the legacy MarkdownTransformer.
 */
export function getMarkdownSliceViaGfm(
	text: string,
	schema: Schema,
	openStart: number,
	openEnd: number,
	markdownToPmConverter: (params: { markdown: string; schema: Schema }) => Fragment,
): Slice | undefined {
	// The injected GFM converter enables tables, task lists, and strikethrough
	// individually, but does not enable the GFM autolink-literal extension.
	// Wrap bare URLs in CommonMark autolink syntax so the card plugin receives
	// a link mark to resolve.
	const escapedTextInput = escapeBackslashAndLinksExceptCodeBlock(text);
	try {
		const doc = schema.nodes.doc.createAndFill(
			{},
			markdownToPmConverter({ markdown: escapedTextInput, schema }),
		);
		if (doc && doc.content) {
			return new Slice(doc.content, openStart, openEnd);
		}
	} catch (e) {
		void logException(e instanceof Error ? e : new Error(String(e)), {
			location: 'editor-plugin-paste/getMarkdownSlice',
		});
	}
	return undefined;
}
