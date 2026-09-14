/* eslint-disable @atlaskit/platform/no-direct-document-usage -- ProseMirror schema uses document to build DOM markers */

import { type MutableRefObject } from 'react';

import mapValues from 'lodash/mapValues';
import { type IntlShape } from 'react-intl';

import { baseKeymap } from '@atlaskit/editor-prosemirror/commands';
import { keydownHandler, keymap } from '@atlaskit/editor-prosemirror/keymap';
import { type EditorState, Plugin } from '@atlaskit/editor-prosemirror/state';
import { history } from '@atlaskit/prosemirror-history/history';
import { redo } from '@atlaskit/prosemirror-history/redo';
import { undo } from '@atlaskit/prosemirror-history/undo';

import { default as autocompletePlugin } from '../plugins/autocomplete';
import { default as jqlAstPlugin } from '../plugins/jql-ast';
import { default as jqlSyntaxHighlightingPlugin } from '../plugins/jql-syntax-highlighting';
import { default as richInlineNodesPlugin } from '../plugins/rich-inline-nodes';
import { default as validationTooltipPlugin } from '../plugins/validation-tooltip';
import { type PortalActions } from '../ui/jql-editor-portal-provider/types';

import type { JQLEditorCommand, JQLEditorKeymap } from './index';

const noopCommand = () => true;

function keymapNoRepeat(bindings: JQLEditorKeymap) {
	const handler = keydownHandler(bindings);

	const proxyBindings = mapValues(bindings, () => noopCommand);
	const proxyHandler = keydownHandler(proxyBindings);

	return new Plugin({
		props: {
			handleKeyDown: (view, event) => {
				if (event.repeat) {
					return proxyHandler(view, event);
				}
				return handler(view, event);
			},
		},
	});
}

export const configurePlugins = (
	editorState: EditorState,
	onSearchCommand: JQLEditorCommand | undefined,
	intlRef: MutableRefObject<IntlShape>,
	mainId: string,
	portalActions: PortalActions | void,
	enableRichInlineNodes: boolean,
): EditorState => {
	return editorState.reconfigure({
		plugins: [
			history(),
			// Other plugins rely on having AST as part of the state during a transaction, this plugin should be kept first
			jqlAstPlugin(intlRef),
			jqlSyntaxHighlightingPlugin(),
			...(portalActions !== undefined
				? [
						autocompletePlugin(portalActions, enableRichInlineNodes),
						...(enableRichInlineNodes ? [richInlineNodesPlugin(portalActions)] : []),
					]
				: []),
			validationTooltipPlugin(mainId),
			// Keeping these at the bottom allows plugins to define custom key bindings to override default behavior
			keymap({
				'Mod-z': undo,
				'Mod-Shift-z': redo,
				'Mod-y': redo,
				// Mimic default Enter behavior in PM's base keymap, allowing to insert new lines even when autocomplete is open
				'Shift-Enter': baseKeymap.Enter,
			}),
			...(!onSearchCommand
				? []
				: [
						keymapNoRepeat({
							'Mod-Enter': onSearchCommand,
							Enter: onSearchCommand,
						}),
					]),
			keymap(baseKeymap),
		],
	});
};
