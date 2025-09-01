import {
	FORMAT_MENU_ITEM,
	FORMAT_CODE_BLOCK_MENU_ITEM,
	FORMAT_NESTED_MENU_RANK,
} from '@atlaskit/editor-common/block-menu';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { CodeBlockAdvancedPlugin } from './codeBlockAdvancedPluginType';
import { codeBlockNodeWithFixedToDOM } from './nodeviews/codeBlockNodeWithToDOMFixed';
import { createPlugin } from './pm-plugins/main';
import { createCodeBlockMenuItem } from './ui/createCodeBlockMenuItem';

export const codeBlockAdvancedPlugin: CodeBlockAdvancedPlugin = ({ api, config }) => {
	if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
		api?.blockMenu?.actions.registerBlockMenuComponents([
			{
				type: 'block-menu-item',
				key: FORMAT_CODE_BLOCK_MENU_ITEM.key,
				parent: {
					type: 'block-menu-section' as const,
					key: FORMAT_MENU_ITEM.key,
					rank: FORMAT_NESTED_MENU_RANK[FORMAT_CODE_BLOCK_MENU_ITEM.key],
				},
				component: createCodeBlockMenuItem(api),
			},
		]);
	}

	return {
		name: 'codeBlockAdvanced',

		nodes() {
			return [
				{
					name: 'codeBlock',
					node: codeBlockNodeWithFixedToDOM({
						allowCodeFolding: config?.allowCodeFolding ?? false,
					}),
				},
			];
		},

		pmPlugins() {
			return [
				{
					name: 'codeBlockAdvancedPlugin',
					plugin: ({ getIntl }) =>
						createPlugin({
							api,
							extensions: config?.extensions ?? [],
							allowCodeFolding: config?.allowCodeFolding ?? false,
							getIntl,
						}),
				},
			];
		},
	};
};
