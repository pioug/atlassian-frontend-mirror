import React from 'react';

import { render } from '@atlassian/testing-library';
import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button/default/button';

import ModalBody from '../../modal-body';
import ModalFooter from '../../modal-footer';
import ModalHeader from '../../modal-header';
import ModalTitle from '../../modal-title';
import ModalTransition from '../../modal-transition';
import Modal from '../../modal-dialog';

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
						<div>Modal body content</div>
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
