import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';

type GetBlockMenuTriggerExtensionKeyOptions = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	editorView?: EditorView;
};

export const getBlockMenuTriggerExtensionKey = ({
	api,
	editorView,
}: GetBlockMenuTriggerExtensionKeyOptions): string | undefined => {
	const menuTriggerByNode = api?.blockControls?.sharedState.currentState()?.menuTriggerByNode;
	const pos = menuTriggerByNode?.rootPos ?? menuTriggerByNode?.pos;

	if (!editorView || pos === undefined) {
		return undefined;
	}

	const extensionKey = editorView.state.doc.nodeAt(pos)?.attrs.extensionKey;
	return typeof extensionKey === 'string' ? extensionKey : undefined;
};
