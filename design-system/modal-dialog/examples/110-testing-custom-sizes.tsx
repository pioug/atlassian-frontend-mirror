import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import type { ModalDialogProps } from '@atlaskit/modal-dialog/types';

/**
 * Test fixture: modals with a custom `width` or `height`, in body scroll and viewport scroll.
 * The browser test checks that each one has the same size with `platform-dst-top-layer` on and off.
 */
type TSizeCase = {
	id: string;
	width?: ModalDialogProps['width'];
	height?: ModalDialogProps['height'];
	shouldScrollInViewport?: boolean;
};

const sizeCases: ReadonlyArray<TSizeCase> = [
	{ id: 'body-height-100-percent', height: '100%' },
	{ id: 'body-width-and-height-100-percent', width: '100%', height: '100%' },
	{ id: 'body-height-420', height: 420 },
	{ id: 'body-width-42-percent', width: '42%' },
	{ id: 'body-width-calc-percent', width: 'calc(100% - 80px)' },
	{ id: 'body-width-calc-vw', width: 'calc(100vw - 80px)' },
	{ id: 'body-width-x-large', width: 'x-large' },
	{ id: 'viewport-width-42-percent', width: '42%', shouldScrollInViewport: true },
	{ id: 'viewport-width-calc-percent', width: 'calc(100% - 80px)', shouldScrollInViewport: true },
	{ id: 'viewport-width-1200', width: 1200, shouldScrollInViewport: true },
	{ id: 'viewport-width-x-large', width: 'x-large', shouldScrollInViewport: true },
	{ id: 'viewport-height-420', height: 420, shouldScrollInViewport: true },
];

export default function TestingCustomSizes(): React.JSX.Element {
	const [openCase, setOpenCase] = useState<TSizeCase | null>(null);
	const close = useCallback(() => setOpenCase(null), []);

	return (
		<div>
			{sizeCases.map((sizeCase) => (
				<Button
					key={sizeCase.id}
					aria-haspopup="dialog"
					onClick={() => setOpenCase(sizeCase)}
					testId={`${sizeCase.id}-trigger`}
				>
					{sizeCase.id}
				</Button>
			))}
			<ModalTransition>
				{openCase && (
					<ModalDialog
						onClose={close}
						testId="modal"
						width={openCase.width}
						height={openCase.height}
						shouldScrollInViewport={openCase.shouldScrollInViewport}
					>
						<ModalHeader hasCloseButton>
							<ModalTitle>{openCase.id}</ModalTitle>
						</ModalHeader>
						<ModalBody>Short content.</ModalBody>
						<ModalFooter>
							<Button appearance="primary" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</div>
	);
}
