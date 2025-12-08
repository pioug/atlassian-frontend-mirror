import { doc, paragraph, text } from '@atlaskit/adf-schema';
import { keymap } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactory } from '@atlaskit/editor-common/types';
import { baseKeymap } from '@atlaskit/editor-prosemirror/commands';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { history } from '@atlaskit/prosemirror-history';

import type { BasePlugin, Callback } from './basePluginType';
import { setKeyboardHeight } from './editor-commands/set-keyboard-height';
import disableSpellcheckingPlugin from './pm-plugins/disable-spell-checking';
import filterStepsPlugin from './pm-plugins/filter-steps';
import frozenEditor from './pm-plugins/frozen-editor';
import inlineCursorTargetPlugin from './pm-plugins/inline-cursor-target';
import { createLazyNodeViewDecorationPlugin } from './pm-plugins/lazy-node-view-decoration';
import newlinePreserveMarksPlugin from './pm-plugins/newline-preserve-marks';
import scrollGutter from './pm-plugins/scroll-gutter/plugin';
import { getKeyboardHeight } from './pm-plugins/scroll-gutter/util/get-keyboard-height';
import { inputTracking } from './pm-plugins/utils/inputTrackingConfig';

export function resolveCallbacks(from: number, to: number, tr: Transaction, callbacks: Callback[]) {
	const { doc } = tr;
	doc.nodesBetween(from, to, (node, pos) => {
		callbacks.forEach((cb) => cb({ tr, node, pos, from, to }));
	});
}

const SMART_TO_ASCII: { [char: string]: string } = {
	'…': '...',
	'→': '->',
	'←': '<-',
	'–': '--',
	'“': '"',
	'”': '"',
	'‘': "'",
	'’': "'",
};

// eslint-disable-next-line require-unicode-regexp
const FIND_SMART_CHAR = new RegExp(`[${Object.keys(SMART_TO_ASCII).join('')}]`, 'g');

const basePlugin: BasePlugin = ({ config: options, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
	const callbacks: Callback[] = [];

	api?.base?.actions.registerMarks(({ tr, node, pos, from, to }) => {
		const { doc } = tr;
		const { schema } = doc.type;
		const { text: textNodeType } = schema.nodes;

		if (node.type === textNodeType && node.text) {
			// Find a valid start and end position because the text may be partially selected.
			const startPositionInSelection = Math.max(pos, from);
			const endPositionInSelection = Math.min(pos + node.nodeSize, to);

			const textForReplacing = doc.textBetween(startPositionInSelection, endPositionInSelection);

			const newText = textForReplacing.replace(
				FIND_SMART_CHAR,
				(match) => SMART_TO_ASCII[match] ?? match,
			);

			const currentStartPos = tr.mapping.map(startPositionInSelection);
			const currentEndPos = tr.mapping.map(endPositionInSelection);

			tr.replaceWith(currentStartPos, currentEndPos, schema.text(newText, node.marks));
		}
	});

	return {
		name: 'base',

		getSharedState(editorState) {
			return {
				keyboardHeight: getKeyboardHeight(editorState),
			};
		},

		actions: {
			setKeyboardHeight,
			resolveMarks: (from: number, to: number, tr: Transaction) =>
				resolveCallbacks(from, to, tr, callbacks),
			registerMarks: (callback: Callback) => {
				callbacks.push(callback);
			},
		},
		pmPlugins() {
			const plugins: { name: string; plugin: PMPluginFactory }[] = [
				{
					name: 'filterStepsPlugin',
					plugin: ({ dispatchAnalyticsEvent }) => filterStepsPlugin(dispatchAnalyticsEvent),
				},
			];

			plugins.push({
				name: 'lazyNodeViewDecorationsPlugin',
				plugin: () => createLazyNodeViewDecorationPlugin(),
			});

			// In Chrome, when the selection is placed between adjacent nodes which are not contenteditatble
			// the cursor appears at the right most point of the parent container.
			//
			// In Firefox, when the selection is placed between adjacent nodes which are not contenteditatble
			// no cursor is presented to users.
			//
			// In Safari, when the selection is placed between adjacent nodes which are not contenteditatble
			// it is not possible to navigate with arrow keys.
			//
			// This plugin works around the issues by inserting decorations between
			// inline nodes which are set as contenteditable, and have a zero width space.
			plugins.push({
				name: 'inlineCursorTargetPlugin',
				plugin: () =>
					options && options.allowInlineCursorTarget ? inlineCursorTargetPlugin() : undefined,
			});

			plugins.push(
				{
					name: 'newlinePreserveMarksPlugin',
					plugin: newlinePreserveMarksPlugin,
				},
				{
					name: 'frozenEditor',
					plugin: ({ dispatchAnalyticsEvent }) => {
						return frozenEditor(api?.contextIdentifier)(
							dispatchAnalyticsEvent,
							inputTracking,
							undefined,
						);
					},
				},
				{ name: 'history', plugin: () => history() as SafePlugin },
				// should be last :(
				{
					name: 'codeBlockIndent',
					plugin: () =>
						keymap({
							...baseKeymap,
							'Mod-[': () => true,
							'Mod-]': () => true,
						}),
				},
			);

			if (options && options.allowScrollGutter) {
				plugins.push({
					name: 'scrollGutterPlugin',
					plugin: () => scrollGutter(options.allowScrollGutter),
				});
			}

			plugins.push({
				name: 'disableSpellcheckingPlugin',
				plugin: () => disableSpellcheckingPlugin(featureFlags),
			});

			return plugins;
		},
		nodes() {
			return [
				{ name: 'doc', node: doc },
				{ name: 'paragraph', node: paragraph },
				{ name: 'text', node: text },
			];
		},
	};
};

export default basePlugin;
