import React, { useCallback, useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import type { SyncBlockStoreManager } from '@atlaskit/editor-common/sync-block';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

export const ContentComponent = ({
	syncBlockStoreManager,
}: {
	syncBlockStoreManager: SyncBlockStoreManager;
}) => {
	const [isOpen, setIsOpen] = useState(false);

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

	const confirmationCallback = useCallback(() => {
		setIsOpen(true);

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
						<ModalTitle>Confirmation</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div>Are you sure you want to delete this synced block?</div>
					</ModalBody>
					<ModalFooter>
						<Button appearance="subtle" onClick={handleClose(false)}>
							Cancel
						</Button>
						<Button appearance="danger" onClick={handleClose(true)} autoFocus>
							Delete
						</Button>
					</ModalFooter>
				</ModalDialog>
			)}
		</ModalTransition>
	);
};
