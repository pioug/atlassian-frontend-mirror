import { SUPPORTED_LANGUAGES } from '@atlaskit/code/constants';
import { mapSlice } from '@atlaskit/editor-common/utils';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

interface VSCodeBlockParams {
	state: EditorState;
	slice: Slice;
	text: string;
	event: ClipboardEvent;
}

function safelyGetVSCodeLanguage(editorData: string | undefined) {
	try {
		const vscodeData = editorData ? JSON.parse(editorData) : undefined;
		return vscodeData?.mode;
	} catch (_e) {}
}

export function handleVSCodeBlock({ state, slice, text, event }: VSCodeBlockParams): Slice {
	if (!fg('platform_editor_vs_code_block_paste')) {
		return slice;
	}
	const vscodeData = event?.clipboardData?.getData('vscode-editor-data');
	const language = safelyGetVSCodeLanguage(vscodeData);
	if (text && language && SUPPORTED_LANGUAGES.some((l) => l.alias[0] === language)) {
		const { schema } = state;
		slice = mapSlice(slice, (node) => {
			if (node.type.name === schema.nodes.codeBlock?.name) {
				return schema.nodes.codeBlock.createChecked({ language }, schema.text(text));
			}
			return node;
		});
	}
	return slice;
}
