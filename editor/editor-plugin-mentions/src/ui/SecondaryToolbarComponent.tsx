import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, TypeAheadHandler } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { type mentionsPlugin } from '../mentionsPlugin';
import type { MentionsPlugin } from '../mentionsPluginType';

import ToolbarMention from './ToolbarMention';

interface SecondaryToolbarComponentProps {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	disabled: boolean;
	editorView: EditorView;
	typeAhead: TypeAheadHandler;
}

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<typeof mentionsPlugin>, 'mention'>,
) => {
	return {
		mentionProvider: states.mentionState?.mentionProvider,
	};
};

export function SecondaryToolbarComponent({
	editorView,
	api,
	typeAhead,
	disabled,
}: SecondaryToolbarComponentProps) {
	const { mentionProvider } = useSharedPluginStateWithSelector(api, ['mention'], selector);

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
