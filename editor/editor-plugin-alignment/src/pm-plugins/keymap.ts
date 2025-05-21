import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	alignCenter,
	alignLeft,
	alignRight,
	bindKeymapWithCommand,
	keymap,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { AlignmentPlugin } from '../alignmentPluginType';
import { changeAlignment } from '../editor-commands';

export function keymapPlugin(api?: ExtractInjectionAPI<AlignmentPlugin>): SafePlugin {
	const list = {};

	// Ignored via go/ees005
	bindKeymapWithCommand(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		alignLeft.common!,
		changeAlignment('start', api, INPUT_METHOD.SHORTCUT),
		list,
	);
	// Ignored via go/ees005
	bindKeymapWithCommand(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		alignCenter.common!,
		changeAlignment('center', api, INPUT_METHOD.SHORTCUT),
		list,
	);
	// Ignored via go/ees005
	bindKeymapWithCommand(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		alignRight.common!,
		changeAlignment('end', api, INPUT_METHOD.SHORTCUT),
		list,
	);

	return keymap(list) as SafePlugin;
}
