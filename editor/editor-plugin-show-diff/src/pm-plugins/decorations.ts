import type { Change } from 'prosemirror-changeset';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

const style = convertToInlineCss({
	background: token('color.background.accent.purple.subtlest'),
	textDecoration: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.border.accent.purple'),
});

/**
 * Inline decoration used for insertions as the content already exists in the document
 *
 * @param change Changeset "change" containing information about the change content + range
 * @returns Prosemirror inline decoration
 */
export const createInlineChangedDecoration = (change: Change) =>
	Decoration.inline(
		change.fromB,
		change.toB,
		{
			style,
		},
		{},
	);

interface DeletedContentDecorationProps {
	change: Change;
	doc: PMNode;
	tr: Transaction;
}

const deletedContentStyle = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
});

/**
 * Creates a widget to represent the deleted content in the editor
 *
 * @param props.change Changeset "change" containing information about the change content + range
 * @param props.doc Baseline doc to compare against
 * @param props.tr The relevant transaction this decoration is being created against
 * @returns Prosemirror widget decoration
 */
export const createDeletedContentDecoration = ({
	change,
	doc,
	tr,
}: DeletedContentDecorationProps) => {
	const dom = document.createElement('span');
	dom.setAttribute('style', deletedContentStyle);
	dom.appendChild(
		DOMSerializer.fromSchema(tr.doc.type.schema).serializeFragment(
			doc.slice(change.fromA, change.toA).content,
		),
	);

	// Widget decoration used for deletions as the content is not in the document
	// and we want to display the deleted content with a style.
	return Decoration.widget(change.fromB, dom, {
		marks: [],
	});
};
