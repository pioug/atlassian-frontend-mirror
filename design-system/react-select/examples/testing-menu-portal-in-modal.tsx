/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import Modal, { ModalBody, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';
import Select from '@atlaskit/react-select';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
];

const styles = cssMap({
	root: {
		padding: 16,
	},
});

/**
 * Playwright fixture: Select rendered inside an `@atlaskit/modal-dialog`.
 * Used to verify the top-layer popover stacks above the modal and is not
 * clipped by the modal's containing block.
 */
export default function MenuPortalInModalFixture(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div css={styles.root}>
			<Button onClick={() => setIsOpen(true)} testId="open-modal">
				Open modal
			</Button>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={() => setIsOpen(false)} testId="modal">
						<ModalHeader>
							<ModalTitle>Pick a city</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Label htmlFor="menu-portal-modal-select">City</Label>
							<Select
								inputId="menu-portal-modal-select"
								testId="react-select"
								options={options}
								menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
							/>
						</ModalBody>
					</Modal>
				)}
			</ModalTransition>
		</div>
	);
}
