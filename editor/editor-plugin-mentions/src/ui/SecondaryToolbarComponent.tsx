import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, TypeAheadHandler } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { MentionsPlugin } from '../types';

import ToolbarMention from './ToolbarMention';

interface SecondaryToolbarComponentProps {
	editorView: EditorView;
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	typeAhead: TypeAheadHandler;
	disabled: boolean;
}

export function SecondaryToolbarComponent({
	editorView,
	api,
	typeAhead,
	disabled,
}: SecondaryToolbarComponentProps) {
	const { mentionState } = useSharedPluginState(api, ['mention']);

	const openMentionTypeAhead = useCallback(() => {
		api?.typeAhead?.actions?.open({
			triggerHandler: typeAhead,
			inputMethod: INPUT_METHOD.INSERT_MENU,
		});
	}, [api, typeAhead]);

	return !mentionState?.mentionProvider ? null : (
		<ToolbarMention
			editorView={editorView}
			onInsertMention={openMentionTypeAhead}
			isDisabled={disabled || api?.typeAhead?.actions.isAllowed(editorView.state)}
		/>
	);
}
