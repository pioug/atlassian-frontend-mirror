import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';
import { within } from '@atlassian/testing-library/within';

import AvatarGroup from '../../avatar-group';

const data = Array.from({ length: 8 }, (_, index) => ({
	name: `Name ${index}`,
	src: `#${index}`,
	href: `#${index}`,
}));

describe('AvatarGroup overflow menu in a modal, Tab (top layer)', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('closes the menu on Tab and moves focus to the next element of the modal', async () => {
		const user = userEvent.setup();
		render(
			<ModalDialog onClose={__noop}>
				<ModalHeader hasCloseButton>
					<ModalTitle>Modal</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<AvatarGroup testId="test" data={data} maxCount={3} />
					<button type="button">After</button>
				</ModalBody>
			</ModalDialog>,
		);
		await user.click(screen.getByTestId('test--overflow-menu--trigger'));
		const firstItem = within(screen.getByTestId('test--overflow-menu')).getAllByRole('menuitem')[0];
		act(() => {
			firstItem.focus();
		});

		await user.tab();

		expect(screen.queryByTestId('test--overflow-menu')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
	});
});
