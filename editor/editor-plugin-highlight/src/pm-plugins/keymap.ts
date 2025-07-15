import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	bindKeymapWithCommand,
	keymap,
	toggleHighlightPalette,
	applyYellowHighlight,
} from '@atlaskit/editor-common/keymaps';
import { editorCommandToPMCommand } from '@atlaskit/editor-common/preset';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { highlightColorPalette, highlightColorPaletteNext } from '@atlaskit/editor-common/ui-color';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { changeColor } from '../editor-commands/change-color';
import { togglePalette } from '../editor-commands/palette';
import type { HighlightPlugin } from '../highlightPluginType';

export function keymapPlugin({ api }: { api: ExtractInjectionAPI<HighlightPlugin> | undefined }) {
	const list = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		toggleHighlightPalette.common!,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		togglePalette(api!)({ inputMethod: INPUT_METHOD.SHORTCUT }),
		list,
	);

	const analyticsApi = api?.analytics?.actions;
	const color = expValEquals('platform_editor_add_orange_highlight_color', 'cohort', 'test')
		? highlightColorPaletteNext.find(({ label }) => label === 'Yellow')
		: highlightColorPalette.find(({ label }) => label === 'Yellow') || {
				value: '#fedec8',
			};

	if (color) {
		bindKeymapWithCommand(
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			applyYellowHighlight.common!,
			editorCommandToPMCommand(
				changeColor(analyticsApi)({
					color: color.value,
					inputMethod: INPUT_METHOD.SHORTCUT,
				}),
			),
			list,
		);
	}

	return keymap(list) as SafePlugin;
}
