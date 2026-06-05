import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

export const transformSingleLineCodeBlockToCodeMark = (slice: Slice, schema: Schema): Slice => {
	if (slice.content.childCount === 1 && (slice.openStart || slice.openEnd)) {
		const maybeCodeBlock = slice.content.firstChild;
		if (maybeCodeBlock && maybeCodeBlock.type === schema.nodes.codeBlock) {
			if (maybeCodeBlock.textContent && maybeCodeBlock.textContent.indexOf('\n') === -1) {
				return new Slice(
					Fragment.from(schema.text(maybeCodeBlock.textContent, [schema.marks.code.create()])),
					0,
					0,
				);
			}
		}
	}
	return slice;
};
