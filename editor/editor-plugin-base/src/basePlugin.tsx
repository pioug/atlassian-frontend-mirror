import { doc, paragraph, text } from '@atlaskit/adf-schema';
import { keymap } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactory } from '@atlaskit/editor-common/types';
import { baseKeymap } from '@atlaskit/editor-prosemirror/commands';
import { history } from '@atlaskit/editor-prosemirror/history';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type BasePlugin } from './basePluginType';
import { setKeyboardHeight } from './editor-commands/set-keyboard-height';
import disableSpellcheckingPlugin from './pm-plugins/disable-spell-checking';
import filterStepsPlugin from './pm-plugins/filter-steps';
import frozenEditor from './pm-plugins/frozen-editor';
import inlineCursorTargetPlugin from './pm-plugins/inline-cursor-target';
import { createLazyNodeViewDecorationPlugin } from './pm-plugins/lazy-node-view-decoration';
import newlinePreserveMarksPlugin from './pm-plugins/newline-preserve-marks';
import scrollGutter from './pm-plugins/scroll-gutter/plugin';
import scrollGutterNext from './pm-plugins/scroll-gutter/plugin-next';
import { getKeyboardHeight } from './pm-plugins/scroll-gutter/util/get-keyboard-height';
import { inputTracking } from './pm-plugins/utils/inputTrackingConfig';

const basePlugin: BasePlugin = ({ config: options, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

	return {
		name: 'base',

		getSharedState(editorState) {
			return {
				keyboardHeight: getKeyboardHeight(editorState),
			};
		},

		actions: {
			setKeyboardHeight,
		},

		pmPlugins() {
			const plugins: { name: string; plugin: PMPluginFactory }[] = [
				{
					name: 'filterStepsPlugin',
					plugin: ({ dispatchAnalyticsEvent }) => filterStepsPlugin(dispatchAnalyticsEvent),
				},
			];

			if (editorExperiment('platform_editor_exp_lazy_node_views', true, { exposure: true })) {
				plugins.push({
					name: 'lazyNodeViewDecorationsPlugin',
					plugin: () => createLazyNodeViewDecorationPlugin(),
				});
			}

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
				if (fg('platform_editor_improved_scroll_gutter')) {
					plugins.push({
						name: 'scrollGutterPlugin',
						plugin: () => scrollGutterNext(options.allowScrollGutter),
					});
				} else {
					plugins.push({
						name: 'scrollGutterPlugin',
						plugin: () => scrollGutter(options.allowScrollGutter),
					});
				}
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
