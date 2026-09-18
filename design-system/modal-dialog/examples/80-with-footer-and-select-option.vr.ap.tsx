import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Label } from '@atlaskit/form/label/default';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Box } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select/default';

export function WithFooterAndSelectOptionExample(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const Footer = () => {
		return (
			<ModalFooter>
				<Button appearance="primary" onClick={close}>
					test button
				</Button>
			</ModalFooter>
		);
	};

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Box testId="dialog-body">
								<Label htmlFor="city-select">City</Label>
								<Select
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
									className="single-select"
									inputId="city-select"
									classNamePrefix="react-select"
									options={[
										{ label: 'Adelaide', value: 'adelaide' },
										{ label: 'Brisbane', value: 'brisbane' },
										{ label: 'Canberra', value: 'canberra' },
										{ label: 'Darwin', value: 'darwin' },
										{ label: 'Hobart', value: 'hobart' },
										{ label: 'Melbourne', value: 'melbourne' },
										{ label: 'Perth', value: 'perth' },
										{ label: 'Sydney', value: 'sydney' },
									]}
									// Make it appear over the top of the modal rather than scrollable
									menuPosition="fixed"
								/>
							</Box>
						</ModalBody>
						<Footer />
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}

export default WithFooterAndSelectOptionExample;
