import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, TypeAheadHandler } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { mentionsPlugin } from '../mentionsPlugin';
import type { MentionsPlugin } from '../mentionsPluginType';

import ToolbarMention from './ToolbarMention';

interface SecondaryToolbarComponentProps {
	editorView: EditorView;
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	typeAhead: TypeAheadHandler;
	disabled: boolean;
}

const useSharedMentionState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<typeof mentionsPlugin> | undefined) => {
		const mentionProvider = useSharedPluginStateSelector(api, 'mention.mentionProvider');
		return { mentionProvider };
	},
	(api: ExtractInjectionAPI<typeof mentionsPlugin> | undefined) => {
		const { mentionState } = useSharedPluginState(api, ['mention']);
		return { mentionProvider: mentionState?.mentionProvider };
	},
);

export function SecondaryToolbarComponent({
	editorView,
	api,
	typeAhead,
	disabled,
}: SecondaryToolbarComponentProps) {
	const { mentionProvider } = useSharedMentionState(api);

	const openMentionTypeAhead = useCallback(() => {
		api?.typeAhead?.actions?.open({
			triggerHandler: typeAhead,
			inputMethod: INPUT_METHOD.INSERT_MENU,
		});
	}, [api, typeAhead]);

	return !mentionProvider ? null : (
		<ToolbarMention
			editorView={editorView}
			onInsertMention={openMentionTypeAhead}
			isDisabled={disabled || api?.typeAhead?.actions.isAllowed(editorView.state)}
		/>
	);
}
