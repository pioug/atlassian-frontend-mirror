import mapValues from 'lodash/mapValues';

import { type Node } from '@atlaskit/editor-prosemirror/model';
import { type EditorState, Plugin, PluginKey } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';
import { JQLSyntaxError } from '@atlaskit/jql-ast';

import { type PortalActions } from '../../ui/jql-editor-portal-provider/types';
import getDocumentPosition from '../common/get-document-position';
import { getJastFromState } from '../jql-ast';

import { ERROR_NODE, RICH_INLINE_NODE, SELECTED_NODE } from './constants';
import { richInlineNodes } from './nodes';
import { type RichInlineNodeDecoration } from './types';
import { ReactNodeView } from './util/react-node-view';

const decorateNodesInRange = (
	state: EditorState,
	decoration: RichInlineNodeDecoration,
	from: number,
	to: number,
) => {
	const decorations: Decoration[] = [];

	state.doc.nodesBetween(from, to, (node, pos) => {
		if (node.type.spec.group === RICH_INLINE_NODE) {
			decorations.push(Decoration.node(pos, pos + node.nodeSize, {}, { type: decoration }));
		}
	});

	return decorations;
};

const RichInlineNodesPluginKey = new PluginKey<void>('rich-inline-nodes-plugin');

const richInlineNodesPlugin = (portalActions: PortalActions) =>
	new Plugin<void>({
		key: RichInlineNodesPluginKey,
		props: {
			decorations: (state: EditorState) => {
				const decorations: Decoration[] = [];

				// Apply selected decoration to node views when they are part of a text selection
				const { from, to } = state.selection;
				decorations.push(...decorateNodesInRange(state, SELECTED_NODE, from, to));

				// Apply error decoration to node views when they are part of AST error range
				const ast = getJastFromState(state);
				const [error] = ast.errors;
				if (error instanceof JQLSyntaxError) {
					const documentFrom = getDocumentPosition(state.doc, error.start);
					const documentTo = getDocumentPosition(state.doc, error.stop);
					decorations.push(...decorateNodesInRange(state, ERROR_NODE, documentFrom, documentTo));
				}

				return DecorationSet.create(state.doc, decorations);
			},
			nodeViews: mapValues(
				richInlineNodes,
				(jqlNodeSpec) =>
					(
						node: Node,
						_view: EditorView,
						_getPos: (() => number | undefined) | boolean,
						decorations: readonly Decoration[],
					) =>
						ReactNodeView.for(jqlNodeSpec.component, portalActions, node, decorations),
			),
		},
	});

export default richInlineNodesPlugin;
