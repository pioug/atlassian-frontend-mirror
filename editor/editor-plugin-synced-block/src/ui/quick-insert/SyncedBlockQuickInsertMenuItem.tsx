import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import BlockSyncedIcon from '@atlaskit/icon-lab/core/block-synced';

import { createSyncedBlock } from '../../editor-commands';
import type { SyncedBlockPlugin } from '../../syncedBlockPluginType';

export const SyncedBlockQuickInsertMenuItem = ({
	api,
	previewImageUrls,
	syncBlockStore,
}: {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
	previewImageUrls?: QuickInsertMenuItemProps['previewImageUrls'];
	syncBlockStore: SyncBlockStoreManager;
}): React.JSX.Element => {
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
	const { editorDisabled } = useSharedPluginStateWithSelector(
		api,
		['editorDisabled'],
		(states) => ({
			editorDisabled: states.editorDisabledState?.editorDisabled,
		}),
	);
	const onSelect = useCallback(
		({ editorView, insert, source }: OnSelectContext) =>
			createSyncedBlock({
				tr: editorView.state.tr,
				syncBlockStore,
				typeAheadInsert: insert,
				fireAnalyticsEvent: api?.analytics?.actions.fireAnalyticsEvent,
				inputMethod: source ?? INPUT_METHOD.QUICK_INSERT,
			}),
		[api, syncBlockStore],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(blockTypeMessages.syncedBlockDescription)}
			iconBefore={<BlockSyncedIcon label="" />}
			isDisabled={editorDisabled}
			onSelect={onSelect}
			preview={preview}
			title={formatMessage(blockTypeMessages.syncedBlockQuickInsertTitle)}
		/>
	);
};
