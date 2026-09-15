import type { Slice } from '@atlaskit/editor-prosemirror/model';

/** Whether a slice contains exactly one structurally empty paragraph. */
export const isEmptyParagraphSlice = (slice: Slice | undefined): boolean =>
	slice?.content.childCount === 1 &&
	slice.content.firstChild?.type.name === 'paragraph' &&
	slice.content.firstChild.content.size === 0;
