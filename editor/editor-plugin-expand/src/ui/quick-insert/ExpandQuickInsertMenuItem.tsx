import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { createWrapSelectionTransaction } from '@atlaskit/editor-common/utils';
import ExpandElementIcon from '@atlaskit/icon-lab/core/expand-element';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { createExpandNode as createLegacyExpandNode } from '../../legacyExpand/commands';
import {
	createExpandNode as createSinglePlayerExpandNode,
	wrapSelectionAndSetExpandedState,
} from '../../singlePlayerExpand/commands';
import type { ExpandPlugin } from '../../types';

type Props = {
	api: ExtractInjectionAPI<ExpandPlugin> | undefined;
	isLegacy: boolean;
	previewImageUrls?: QuickInsertMenuItemProps['previewImageUrls'];
};

export const ExpandQuickInsertMenuItem = ({
	api,
	isLegacy,
	previewImageUrls,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const preview = useMemo(
		() =>
			previewImageUrls
				? {
						image: previewImageUrls,
						attribution: {
							name: formatMessage(quickInsertMessages.previewAttributionAtlassian),
						},
					}
				: undefined,
		[formatMessage, previewImageUrls],
	);
	const { editorDisabled, mode } = useSharedPluginStateWithSelector(
		api,
		['editorDisabled', 'editorViewMode'],
		(states) => ({
			editorDisabled: states.editorDisabledState?.editorDisabled,
			mode: states.editorViewModeState?.mode,
		}),
	);
	const onSelect = useCallback(
		({ editorView, insert, source }: OnSelectContext) => {
			const { state } = editorView;
			const node = isLegacy
				? createLegacyExpandNode(state)
				: createSinglePlayerExpandNode(state, undefined, !!api?.localId);
			if (!node) {
				return false;
			}
			const tr = state.selection.empty
				? insert(node)
				: isLegacy || !fg('platform_editor_adf_with_localid')
					? createWrapSelectionTransaction({ state, type: node.type })
					: wrapSelectionAndSetExpandedState(state, node);
			api?.analytics?.actions.attachAnalyticsEvent({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId:
					node.type === state.schema.nodes.nestedExpand
						? ACTION_SUBJECT_ID.NESTED_EXPAND
						: ACTION_SUBJECT_ID.EXPAND,
				attributes: {
					inputMethod: isLegacy ? INPUT_METHOD.QUICK_INSERT : source,
				},
				eventType: EVENT_TYPE.TRACK,
			})(tr);
			return tr;
		},
		[api, isLegacy],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(messages.expandDescription)}
			iconBefore={<ExpandElementIcon label="" />}
			isDisabled={editorDisabled || mode === 'view'}
			onSelect={onSelect}
			preview={preview}
			title={formatMessage(messages.expand)}
		/>
	);
};
