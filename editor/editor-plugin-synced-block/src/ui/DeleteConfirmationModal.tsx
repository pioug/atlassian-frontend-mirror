import React, { useCallback, useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

export const DeleteConfirmationModal = ({
	syncBlockStoreManager,
	api,
}: {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	syncBlockStoreManager: SyncBlockStoreManager;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [syncBlockCount, setSyncBlockCount] = useState(1);
	const { mode } = useSharedPluginStateWithSelector(api, ['connectivity'], (states) => ({
		mode: states.connectivityState?.mode,
	}));

	const { formatMessage } = useIntl();

	const resolverRef = React.useRef<((value: boolean | PromiseLike<boolean>) => void) | undefined>(
		undefined,
	);

	const handleClose = useCallback(
		(confirm: boolean) => () => {
			if (resolverRef.current) {
				resolverRef.current(confirm);
				resolverRef.current = undefined;
			}

			setIsOpen(false);
		},
		[],
	);

	const confirmationCallback = useCallback((syncBlockCount: number) => {
		setIsOpen(true);
		setSyncBlockCount(syncBlockCount);

		const confirmedPromise = new Promise<boolean>((resolve) => {
			resolverRef.current = resolve;
		});

		return confirmedPromise;
	}, []);

	useEffect(() => {
		const unregister =
			syncBlockStoreManager.sourceManager.registerConfirmationCallback(confirmationCallback);

		return () => {
			unregister();
		};
	}, [syncBlockStoreManager, confirmationCallback]);

	return (
		<ModalTransition>
			{isOpen && (
				<ModalDialog onClose={handleClose(false)} testId="sync-block-delete-confirmation">
					<ModalHeader hasCloseButton>
						<ModalTitle appearance="warning">
							{formatMessage(messages.deleteConfirmationModalTitle)}
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<Text>
							{formatMessage(messages.deleteConfirmationModalDescription, { syncBlockCount })}
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button appearance="subtle" onClick={handleClose(false)}>
							{formatMessage(messages.deleteConfirmationModalCancelButton)}
						</Button>
						<Button
							appearance="warning"
							onClick={handleClose(true)}
							autoFocus
							isDisabled={mode === 'offline'}
						>
							{formatMessage(messages.deleteConfirmationModalDeleteButton)}
						</Button>
					</ModalFooter>
				</ModalDialog>
			)}
		</ModalTransition>
	);
};
