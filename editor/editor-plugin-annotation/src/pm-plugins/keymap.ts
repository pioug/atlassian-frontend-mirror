import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { addInlineComment, bindKeymapWithCommand } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import type { AnnotationPlugin } from '../annotationPluginType';
import { setInlineCommentDraftState } from '../editor-commands';

export function keymapPlugin(api: ExtractInjectionAPI<AnnotationPlugin> | undefined): SafePlugin {
	const list = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		addInlineComment.common!,
		setInlineCommentDraftState(
			api?.analytics?.actions,
			undefined,
			api,
		)(true, INPUT_METHOD.SHORTCUT),
		list,
	);

	return keymap(list) as SafePlugin;
}
