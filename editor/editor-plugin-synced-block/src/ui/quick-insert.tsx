/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type {
	QuickInsertActionInsert,
	QuickInsertItem,
} from '@atlaskit/editor-common/provider-factory';
import { IconSyncBlock } from '@atlaskit/editor-common/quick-insert';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import Lozenge from '@atlaskit/lozenge';

import { createSyncedBlock } from '../editor-commands';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
import { SYNCED_BLOCK_BUTTON_TEST_ID } from '../types';

const lozengeWrapperStyles = css({
	flexShrink: 0,
	flexGrow: 0,
	display: 'inline-flex',
});

export const getQuickInsertConfig = (
	config: { enableSourceCreation?: boolean } | undefined,
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	syncBlockStore: SyncBlockStoreManager,
): (({
	formatMessage,
}: {
	formatMessage: (message: { defaultMessage: string; id: string }) => string;
}) => QuickInsertItem[]) => {
	return ({ formatMessage }) => {
		if (!config?.enableSourceCreation) {
			return [];
		}

		return [
			{
				id: 'syncBlock',
				title: formatMessage(blockTypeMessages.syncedBlock),
				description: formatMessage(blockTypeMessages.syncedBlockDescription),
				priority: 800,
				keywords: [
					'synced',
					'block',
					'synced-block',
					'sync',
					'sync-block',
					'auto',
					'update',
					'excerpt',
					'connect',
				],
				isDisabledOffline: true,
				keyshortcut: '',
				lozenge: (
					<span css={lozengeWrapperStyles}>
						<Lozenge appearance="new">{formatMessage(blockTypeMessages.newLozenge)}</Lozenge>
					</span>
				),
				icon: () => <IconSyncBlock label={formatMessage(blockTypeMessages.syncedBlock)} />,
				action: (insert: QuickInsertActionInsert, state: EditorState) => {
					return createSyncedBlock({
						tr: state.tr,
						syncBlockStore,
						typeAheadInsert: insert,
						fireAnalyticsEvent: api?.analytics?.actions.fireAnalyticsEvent,
					});
				},
				testId: SYNCED_BLOCK_BUTTON_TEST_ID.quickInsertCreate,
			},
		];
	};
};
