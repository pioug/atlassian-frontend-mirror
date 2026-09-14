/* eslint-disable @atlaskit/platform/no-direct-document-usage -- ProseMirror schema uses document to build DOM markers */

import mapValues from 'lodash/mapValues';

import { Schema } from '@atlaskit/editor-prosemirror/model';
import { EditorState, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { RICH_INLINE_NODE } from '../plugins/rich-inline-nodes/constants';
import { richInlineNodeAttrs } from '../plugins/rich-inline-nodes/nodes/attrs';
import { createNodeSpec } from '../plugins/rich-inline-nodes/util/create-node-spec';

const createMarkWithStyle = (tokenType: string) => {
	const mark = document.createElement('span');
	mark.className = `mark-token-${tokenType}`;
	mark.setAttribute('data-token-type', tokenType);
	mark.setAttribute('spellcheck', 'false');
	return mark;
};

type Nodes = 'doc' | 'paragraph' | 'text' | keyof typeof richInlineNodeAttrs;

type Marks = 'token' | 'cursor';

export const JQLEditorSchema: Schema<Nodes, Marks> = new Schema<Nodes, Marks>({
	nodes: {
		doc: { content: 'paragraph+' },
		paragraph: {
			content: `(text|${RICH_INLINE_NODE})*`,
			toDOM: () => ['p', { spellcheck: 'false' }, 0],
			parseDOM: [{ tag: 'p' }],
		},
		text: {},
		...mapValues(richInlineNodeAttrs, (attrs, name) => createNodeSpec(name, attrs)),
	},
	marks: {
		token: {
			toDOM: ({ attrs }) => createMarkWithStyle(attrs.tokenType),
			attrs: {
				tokenType: {},
			},
		},
		cursor: {
			toDOM: () => {
				return document.createElement('span');
			},
		},
	},
});

export const defaultEditorState: EditorState = EditorState.create({
	schema: JQLEditorSchema,
});

export type JQLEditorSchemaType = typeof JQLEditorSchema;

// @types/prosemirror-commands@1.0.1 does not export Command and Keymap types
// TODO: update to Command<JQLEditorSchemaType> and Keymap<JQLEditorSchemaType> if types are bumped to a newer version
export type JQLEditorCommand = (
	state: EditorState,
	dispatch?: (tr: Transaction) => void,
	view?: EditorView,
) => boolean;

export type JQLEditorKeymap = {
	[key: string]: JQLEditorCommand;
};
