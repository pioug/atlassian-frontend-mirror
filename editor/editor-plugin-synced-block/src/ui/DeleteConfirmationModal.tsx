import React, { useCallback, useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';

export const DeleteConfirmationModal = ({
	syncBlockStoreManager,
}: {
	syncBlockStoreManager: SyncBlockStoreManager;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [syncBlockCount, setSyncBlockCount] = useState(1);

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
		const unregister = syncBlockStoreManager.registerConfirmationCallback(confirmationCallback);

		return () => {
			unregister();
		};
	}, [syncBlockStoreManager, confirmationCallback]);

	return (
		<ModalTransition>
			{isOpen && (
				<ModalDialog onClose={handleClose(false)}>
					<ModalHeader hasCloseButton>
						<ModalTitle appearance='warning'>{formatMessage(messages.deleteConfirmationModalTitle)}</ModalTitle>
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
						<Button appearance="warning" onClick={handleClose(true)} autoFocus>
							{formatMessage(messages.deleteConfirmationModalDeleteButton)}
						</Button>
					</ModalFooter>
				</ModalDialog>
			)}
		</ModalTransition>
	);
};
