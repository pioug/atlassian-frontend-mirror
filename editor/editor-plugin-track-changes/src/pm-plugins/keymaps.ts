import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import {
	bindKeymapWithCommand,
	isCapsLockOnAndModifyKeyboardEvent,
	toggleViewChanges,
} from '@atlaskit/editor-common/keymaps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { TrackChangesPlugin } from '../trackChangesPluginType';

export function keymapPlugin(api?: ExtractInjectionAPI<TrackChangesPlugin>): SafePlugin {
	const list = {};
	const browser = getBrowserInfo();

	// Exclude Firefox browser from keyboard shortcut
	if (!browser.gecko && fg('platform_editor_ai_aifc_patch_ga_blockers')) {
		bindKeymapWithCommand(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			toggleViewChanges.common!,
			() => {
				const isShowDiffAvailable =
					api?.trackChanges?.sharedState.currentState()?.isShowDiffAvailable;
				if (!isShowDiffAvailable) {
					return false;
				}
				const result = api?.core.actions.execute(api?.trackChanges?.commands.toggleChanges);
				return result ?? false;
			},
			list,
		);
	}

	return new SafePlugin({
		props: {
			handleKeyDown(view: EditorView, event: KeyboardEvent) {
				const keyboardEvent = isCapsLockOnAndModifyKeyboardEvent(event);
				return keydownHandler(list)(view, keyboardEvent);
			},
		},
	});
}
