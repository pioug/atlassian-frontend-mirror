import React from 'react';

import { render } from '@testing-library/react';
import Lorem from 'react-lorem-component';

import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button/new';

import { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '../../index';
import Modal from '../../modal-wrapper';

it('Basic Modal should not fail aXe audit', async () => {
	const { container } = render(
		<div>
			<Button appearance="primary" onClick={() => true} testId="modal-trigger">
				Open Modal
			</Button>
			<ModalTransition>
				<Modal onClose={() => false} testId="modal">
					<ModalHeader>
						<ModalTitle>Modal Title</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<Lorem count={2} />
					</ModalBody>
					<ModalFooter>
						<Button testId="secondary" appearance="subtle" onClick={close}>
							Secondary Action
						</Button>
						<Button testId="primary" appearance="primary" onClick={close}>
							Close
						</Button>
					</ModalFooter>
				</Modal>
			</ModalTransition>
		</div>,
	);
	await axe(container);
});
