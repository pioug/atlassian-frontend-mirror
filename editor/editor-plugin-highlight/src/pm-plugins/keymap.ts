import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	applyYellowHighlight,
	bindKeymapWithCommand,
	keymap,
	toggleHighlightPalette,
} from '@atlaskit/editor-common/keymaps';
import { editorCommandToPMCommand } from '@atlaskit/editor-common/preset';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { highlightColorPalette, highlightColorPaletteNew } from '@atlaskit/editor-common/ui-color';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { changeColor } from '../editor-commands/change-color';
import { togglePalette } from '../editor-commands/palette';
import type { HighlightPlugin } from '../highlightPluginType';

export function keymapPlugin({ api }: { api: ExtractInjectionAPI<HighlightPlugin> | undefined }) {
	const list = {};
	const isToolbarAIFCEnabled = Boolean(api?.toolbar);

	if (!isToolbarAIFCEnabled) {
		bindKeymapWithCommand(
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			toggleHighlightPalette.common!,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			togglePalette(api!)({ inputMethod: INPUT_METHOD.SHORTCUT }),
			list,
		);
	}

	const analyticsApi = api?.analytics?.actions;
	const highlightPalette = expValEqualsNoExposure(
		'platform_editor_lovability_text_bg_color',
		'isEnabled',
		true,
	)
		? highlightColorPaletteNew
		: highlightColorPalette;
	const color = highlightPalette.find(({ label }) => label === 'Yellow');

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
