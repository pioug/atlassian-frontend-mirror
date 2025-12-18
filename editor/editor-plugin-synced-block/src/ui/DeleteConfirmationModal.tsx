import React, { useCallback, useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';

import { syncedBlockPluginKey } from '../pm-plugins/main';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

export const DeleteConfirmationModal = ({
	syncBlockStoreManager,
	api,
}: {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	syncBlockStoreManager: SyncBlockStoreManager;
}): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const [syncBlockCount, setSyncBlockCount] = useState(1);
	const { mode, bodiedSyncBlockDeletionStatus, activeFlag } = useSharedPluginStateWithSelector(
		api,
		['connectivity', 'syncedBlock'],
		(states) => ({
			mode: states.connectivityState?.mode,
			bodiedSyncBlockDeletionStatus: states.syncedBlockState?.bodiedSyncBlockDeletionStatus,
			activeFlag: states.syncedBlockState?.activeFlag,
		}),
	);

	const { formatMessage } = useIntl();

	const resolverRef = React.useRef<((value: boolean | PromiseLike<boolean>) => void) | undefined>(
		undefined,
	);

	const handleClick = useCallback(
		(confirm: boolean) => () => {
			if (resolverRef.current) {
				resolverRef.current(confirm);
				resolverRef.current = undefined;
			}

			if (!confirm) {
				setIsOpen(false);
			}

			api?.core?.actions.execute(({ tr }) => {
				return tr.setMeta(syncedBlockPluginKey, {
					bodiedSyncBlockDeletionStatus: confirm ? 'processing' : 'none',
					activeFlag: false,
				});
			});
		},
		[api?.core?.actions],
	);

	const confirmationCallback = useCallback(
		(syncBlockCount: number) => {
			setIsOpen(true);
			setSyncBlockCount(syncBlockCount);

			const confirmedPromise = new Promise<boolean>((resolve) => {
				resolverRef.current = resolve;
			});

			if (activeFlag) {
				api?.core?.actions.execute(({ tr }) => {
					return tr.setMeta(syncedBlockPluginKey, {
						// Clear flag to avoid potential retry deletion of different blocks
						activeFlag: false,
					});
				});
			}

			return confirmedPromise;
		},
		[activeFlag, api?.core?.actions],
	);

	useEffect(() => {
		const unregister =
			syncBlockStoreManager.sourceManager.registerConfirmationCallback(confirmationCallback);

		return () => {
			unregister();
		};
	}, [syncBlockStoreManager, confirmationCallback]);

	useEffect(() => {
		if (bodiedSyncBlockDeletionStatus === 'completed' && isOpen) {
			// auto close modal once deletion is successful
			setIsOpen(false);
			api?.core?.actions.execute(({ tr }) => {
				return tr.setMeta(syncedBlockPluginKey, {
					// Reset deletion status to have a clean state for next deletion
					bodiedSyncBlockDeletionStatus: 'none',
				});
			});
		}
	}, [api?.core?.actions, bodiedSyncBlockDeletionStatus, isOpen]);

	return (
		<ModalTransition>
			{isOpen && (
				<ModalDialog onClose={handleClick(false)} testId="sync-block-delete-confirmation">
					<ModalHeader hasCloseButton>
						<ModalTitle appearance="warning">
							{formatMessage(messages.deleteConfirmationModalTitle)}
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<Text>
							{formatMessage(messages.deleteConfirmationModalDescription, {
								syncBlockCount,
							})}
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button appearance="subtle" onClick={handleClick(false)}>
							{formatMessage(messages.deleteConfirmationModalCancelButton)}
						</Button>
						<Button
							appearance="warning"
							onClick={handleClick(true)}
							autoFocus
							isDisabled={isOfflineMode(mode)}
							isLoading={bodiedSyncBlockDeletionStatus === 'processing'}
						>
							{formatMessage(messages.deleteConfirmationModalDeleteButton)}
						</Button>
					</ModalFooter>
				</ModalDialog>
			)}
		</ModalTransition>
	);
};
