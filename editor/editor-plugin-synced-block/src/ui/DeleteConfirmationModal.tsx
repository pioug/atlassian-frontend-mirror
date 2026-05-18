import React, { useCallback, useEffect, useState } from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl';
import type { IntlShape, MessageDescriptor } from 'react-intl';

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

const modalContentMap: Record<
	'source-block-deleted' | 'source-block-unsynced' | 'source-block-unpublished',
	ModalContent
> = {
	'source-block-deleted': {
		titleMultiple: messages.deleteConfirmationModalTitleMultiple,
		titleSingle: messages.deletionConfirmationModalTitleSingle,
		descriptionSingle: messages.deletionConfirmationModalDescriptionNoRef,
		descriptionMultiple: messages.deletionConfirmationModalDescriptionNew,
		confirmButtonLabel: messages.deleteConfirmationModalDeleteButton,
	},
	'source-block-unpublished': {
		titleMultiple: messages.deleteConfirmationModalTitleMultiple,
		titleSingle: messages.deletionConfirmationModalTitleSingle,
		descriptionSingle: messages.deletionConfirmationModalDescriptionNoRef,
		descriptionMultiple: messages.deletionConfirmationModalDescriptionNew,
		confirmButtonLabel: messages.deleteConfirmationModalDeleteButton,
	},
	'source-block-unsynced': {
		titleMultiple: messages.unsyncConfirmationModalTitle,
		titleSingle: messages.unsyncConfirmationModalTitle,
		descriptionSingle: messages.unsyncConfirmModalDescriptionSingle,
		descriptionMultiple: messages.unsyncConfirmModalDescriptionMultipleNew,
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

	// When a source block with no references is deleted, the modal is never shown but
	// onDeleteCompleted still sets bodiedSyncBlockDeletionStatus to 'completed'. This ref signals
	// the useEffect to silently reset the status without trying to close the modal (which was never open).
	const skipModalOnCompletedRef = React.useRef(false);

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

	// Store activeFlag in a ref so confirmationCallback always reads the latest value
	// even if it changes during the await fetchReferenceCountRef call.
	const activeFlagRef = React.useRef(activeFlag);
	activeFlagRef.current = activeFlag;

	// Use a ref so fetchReferenceCount can be called from confirmationCallback without
	// being added to its dependency array — preventing confirmationCallback from being
	// recreated mid-flight during an await (which would break the promise chain).
	// The assignment during render is intentional — this is a standard React ref-as-latest-value
	// pattern. The reduce over syncBlockIds (typically 1-2 items) is not actually expensive.
	const fetchReferenceCountRef = React.useRef<(syncBlockIds: SyncBlockAttrs[]) => Promise<number>>(
		() => Promise.resolve(0),
	);
	fetchReferenceCountRef.current = async (syncBlockIds: SyncBlockAttrs[]): Promise<number> => {
		const references = await Promise.all(
			syncBlockIds.map(async (syncBlockId) => {
				const result = await syncBlockStoreManager.sourceManager.fetchReferences(
					syncBlockId.resourceId,
				);
				if (result?.error) {
					// Consider fetch fails as soon as one of the fetches fails
					throw new Error();
				}
				return result.references?.length ?? 0;
			}),
		);
		// eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render
		return references.reduce((sum, count) => sum + count, 0);
	};

	const confirmationCallback = useCallback(
		async (syncBlockIds: SyncBlockAttrs[], deleteReason: DeletionReason | undefined) => {
			// Fetch references before opening the modal. If none exist, skip the modal
			// entirely and auto-confirm the deletion. On fetch error, default to showing
			// the modal to avoid accidental data loss.
			let count: number;
			try {
				count = await fetchReferenceCountRef.current(syncBlockIds);
			} catch {
				count = 1;
			}

			if (count === 0) {
				// No references — auto-confirm without showing the modal.
				// Clear activeFlag to avoid issues with subsequent deletion attempts.
				// We do NOT reset bodiedSyncBlockDeletionStatus here because onDeleteCompleted
				// will set it to 'completed' after the delete call returns. Instead we use a
				// ref to signal that the next 'completed' status should be silently reset
				// without trying to close the modal.
				skipModalOnCompletedRef.current = true;
				api?.core?.actions.execute(({ tr }) => {
					return tr.setMeta(syncedBlockPluginKey, {
						...(activeFlagRef.current ? { activeFlag: false } : {}),
					});
				});
				return true;
			}

			setReferenceCount(count);

			setIsOpen(true);
			setSyncBlockIds(syncBlockIds);

			if (deleteReason) {
				setDeleteReason(deleteReason);
			}

			const confirmedPromise = new Promise<boolean>((resolve) => {
				resolverRef.current = resolve;
			});

			if (activeFlagRef.current) {
				api?.core?.actions.execute(({ tr }) => {
					return tr.setMeta(syncedBlockPluginKey, {
						// Clear flag to avoid potential retry deletion of different blocks
						activeFlag: false,
					});
				});
			}

			return confirmedPromise;
		},
		// fetchReferenceCountRef and activeFlagRef are intentionally omitted — they are refs
		// and never change identity, ensuring confirmationCallback is never recreated mid-flight
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[api?.core?.actions],
	);

	useEffect(() => {
		const unregister =
			syncBlockStoreManager.sourceManager.registerConfirmationCallback(confirmationCallback);

		return () => {
			unregister();
		};
	}, [syncBlockStoreManager, confirmationCallback]);

	useEffect(() => {
		if (skipModalOnCompletedRef.current) {
			if (bodiedSyncBlockDeletionStatus === 'completed') {
				// Deletion was auto-confirmed without showing the modal (no references).
				// Reset the status to 'none' — keep skipModalOnCompletedRef true until
				// we confirm the status has landed as 'none' to guard against the race where
				// the next deletion opens the modal before this transaction is processed.
				api?.core?.actions.execute(({ tr }) => {
					return tr.setMeta(syncedBlockPluginKey, {
						bodiedSyncBlockDeletionStatus: 'none',
					});
				});
			} else if (bodiedSyncBlockDeletionStatus === 'none') {
				skipModalOnCompletedRef.current = false;
			} else if (bodiedSyncBlockDeletionStatus === 'processing' && isOpen) {
				// Reset on deletion failure (e.g. network error) to avoid modal stuck in opened state.
				skipModalOnCompletedRef.current = false;
			}
			return;
		}

		if (bodiedSyncBlockDeletionStatus === 'completed' && isOpen) {
			// auto close modal once deletion is successful
			// eslint-disable-next-line @atlassian/perf-linting/no-chain-state-updates -- Ignored via go/ees017 (to be fixed)
			setIsOpen(false);
			api?.core?.actions.execute(({ tr }) => {
				return tr.setMeta(syncedBlockPluginKey, {
					// Reset deletion status to have a clean state for next deletion
					bodiedSyncBlockDeletionStatus: 'none',
				});
			});
		}
	}, [api?.core?.actions, bodiedSyncBlockDeletionStatus, isOpen]);

	// References are fetched and set before the modal opens in
	// confirmationCallback, so no additional fetch is needed here.

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
								content={modalContentMap[deleteReason]}
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
