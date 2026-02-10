import React, { useCallback, useEffect, useState } from 'react';

import { cssMap } from '@compiled/react';
import { useIntl, type IntlShape, type MessageDescriptor } from 'react-intl-next';


import Button from '@atlaskit/button/new';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import type {
	DeletionReason,
	SyncBlockAttrs,
	SyncBlockStoreManager,
} from '@atlaskit/editor-synced-block-provider';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text, Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';

import { syncedBlockPluginKey } from '../pm-plugins/main';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

type ModalContent = {
	confirmButtonLabel: MessageDescriptor;
	descriptionMultiple: MessageDescriptor;
	descriptionSingle: MessageDescriptor;
	titleMultiple: MessageDescriptor;
	titleSingle: MessageDescriptor;
};
const modalContentMap: Record<'source-block-deleted' | 'source-block-unsynced', ModalContent> = {
	'source-block-deleted': {
		titleMultiple: messages.deleteConfirmationModalTitleMultiple,
		titleSingle: messages.deleteConfirmationModalTitleSingle,
		descriptionSingle: messages.deleteConfirmationModalDescriptionNoRef,
		descriptionMultiple: messages.deleteConfirmationModalDescriptionMultiple,
		confirmButtonLabel: messages.deleteConfirmationModalDeleteButton,
	},
	'source-block-unsynced': {
		titleMultiple: messages.unsyncConfirmationModalTitle,
		titleSingle: messages.unsyncConfirmationModalTitle,
		descriptionSingle: messages.unsyncConfirmationModalDescriptionSingle,
		descriptionMultiple: messages.unsyncConfirmationModalDescriptionMultiple,
		confirmButtonLabel: messages.deleteConfirmationModalUnsyncButton,
	},
};

const modalContentMapNew: Record<'source-block-deleted' | 'source-block-unsynced', ModalContent> = {
	'source-block-deleted': {
		titleMultiple: messages.deleteConfirmationModalTitleMultiple,
		titleSingle: messages.deletionConfirmationModalTitleSingle,
		descriptionSingle: messages.deletionConfirmationModalDescriptionNoRef,
		descriptionMultiple: messages.deletionConfirmationModalDescription,
		confirmButtonLabel: messages.deleteConfirmationModalDeleteButton,
	},
	'source-block-unsynced': {
		titleMultiple: messages.unsyncConfirmationModalTitle,
		titleSingle: messages.unsyncConfirmationModalTitle,
		descriptionSingle: messages.unsyncConfirmModalDescriptionSingle,
		descriptionMultiple: messages.unsyncConfirmModalDescriptionMultiple,
		confirmButtonLabel: messages.deleteConfirmationModalUnsyncButton,
	},
};

const styles = cssMap({
	spinner: {
		marginBlock: 'auto',
		marginInline: 'auto',
	},
});

export const DeleteConfirmationModal = ({
	syncBlockStoreManager,
	api,
}: {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	syncBlockStoreManager: SyncBlockStoreManager;
}): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const [syncBlockIds, setSyncBlockIds] = useState<SyncBlockAttrs[] | undefined>(undefined);
	const [referenceCount, setReferenceCount] = useState<number | undefined>(undefined);
	const [deleteReason, setDeleteReason] = useState<DeletionReason>('source-block-deleted');
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
				setReferenceCount(undefined);
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
		(syncBlockIds: SyncBlockAttrs[], deleteReason: DeletionReason | undefined) => {
			setIsOpen(true);
			setSyncBlockIds(syncBlockIds);

			if (deleteReason) {
				setDeleteReason(deleteReason);
			}

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

	useEffect(() => {
		if (isOpen && syncBlockIds !== undefined) {
			const fetchReferences = async () => {
				try {
					const references = await Promise.all(
						syncBlockIds.map(async (syncBlockId) => {
							const references = await syncBlockStoreManager.sourceManager.fetchReferences(
								syncBlockId.resourceId,
							);
							if (references?.error) {
								// Consider fetch fails as soon as one of the fetches fails
								throw new Error();
							}
							return references.references?.length ?? 0;
						}),
					);

					const totalCount = references.reduce((sum, count) => sum + count, 0);
					setReferenceCount(totalCount);
				} catch {
					setReferenceCount(0);
				}
			};

			fetchReferences();
		}
	}, [isOpen, syncBlockIds, syncBlockStoreManager.sourceManager]);

	return (
		<ModalTransition>
			{isOpen && (
				<ModalDialog
					onClose={handleClick(false)}
					testId="sync-block-delete-confirmation"
					height={184}
				>
						<>
							{referenceCount === undefined ? (
								<Box xcss={styles.spinner}>
									<Spinner size="large" />
								</Box>
							) : (
								<ModalContent
									content={
										fg('platform_synced_block_patch_2')
											? modalContentMapNew[deleteReason]
											: modalContentMap[deleteReason]
									}
									referenceCount={referenceCount}
									handleClick={handleClick}
									formatMessage={formatMessage}
									isDeleting={bodiedSyncBlockDeletionStatus === 'processing'}
									isDisabled={isOfflineMode(mode)}
									deleteReason={deleteReason}
									sourceCount={syncBlockIds?.length || 0}
								/>
							)}
						</>
				</ModalDialog>
			)}
		</ModalTransition>
	);
};

const ModalContent = ({
	content,
	referenceCount,
	handleClick,
	formatMessage,
	isDeleting,
	isDisabled,
	deleteReason,
	sourceCount,
}: {
	content: ModalContent;
	deleteReason: DeletionReason;
	formatMessage: IntlShape['formatMessage'];
	handleClick: (confirm: boolean) => () => void;
	isDeleting: boolean;
	isDisabled: boolean;
	referenceCount: number;
	sourceCount: number;
}) => {
	const { titleMultiple, titleSingle, descriptionSingle, descriptionMultiple, confirmButtonLabel } =
		content;

	const hasNoReferenceOrFailToFetch = referenceCount === 0;
	const syncBlockCount =
		deleteReason === 'source-block-deleted' ? referenceCount + sourceCount : referenceCount;

	return (
		<>
			<ModalHeader hasCloseButton>
				<ModalTitle appearance="warning">
					{hasNoReferenceOrFailToFetch
						? formatMessage(titleSingle)
						: formatMessage(titleMultiple, { count: syncBlockCount })}
				</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<Text>
					{hasNoReferenceOrFailToFetch
						? formatMessage(descriptionSingle)
						: formatMessage(descriptionMultiple, {
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
					isDisabled={isDisabled}
					isLoading={isDeleting}
					testId={`synced-block-delete-confirmation-modal-${deleteReason}-button`}
				>
					{formatMessage(confirmButtonLabel)}
				</Button>
			</ModalFooter>
		</>
	);
};
