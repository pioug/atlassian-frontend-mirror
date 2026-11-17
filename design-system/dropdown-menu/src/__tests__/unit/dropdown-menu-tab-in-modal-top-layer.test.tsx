import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import noop from '@atlaskit/ds-lib/noop';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import DropdownItem from '../../dropdown-item';
import DropdownItemGroup from '../../dropdown-item-group';
import DropdownMenu from '../../dropdown-menu';

const testId = 'dropdown';

// Tab in a menu inside a modal closes the menu and moves on from the trigger.
function MenuInModal({ isTriggerLast = false }: { isTriggerLast?: boolean }) {
	return (
		<ModalDialog onClose={noop}>
			<ModalHeader hasCloseButton>
				<ModalTitle>Modal</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<button type="button">Before</button>
				<DropdownMenu trigger="Options" testId={testId}>
					<DropdownItemGroup>
						<DropdownItem>Move</DropdownItem>
						<DropdownItem>Clone</DropdownItem>
						<DropdownItem>Delete</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
				{isTriggerLast ? null : <button type="button">After</button>}
			</ModalBody>
		</ModalDialog>
	);
}

describe('DropdownMenu in a modal, Tab', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('should be accessible with the menu open in the modal', async () => {
		const user = userEvent.setup();
		render(<MenuInModal />);
		await user.click(screen.getByTestId(`${testId}--trigger`));

		await expect(document.body).toBeAccessible();
	});

	it('closes the menu on Tab and moves focus to the next element of the modal', async () => {
		const user = userEvent.setup();
		render(<MenuInModal />);
		await user.click(screen.getByTestId(`${testId}--trigger`));
		screen.getByRole('menuitem', { name: 'Move' }).focus();

		await user.tab();

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
	});

	it('closes the menu on Shift+Tab and moves focus to the element before the trigger', async () => {
		const user = userEvent.setup();
		render(<MenuInModal />);
		await user.click(screen.getByTestId(`${testId}--trigger`));
		screen.getByRole('menuitem', { name: 'Clone' }).focus();

		await user.tab({ shift: true });

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
	});

	it('wraps to the first element of the modal when the trigger is its last element', async () => {
		const user = userEvent.setup();
		render(<MenuInModal isTriggerLast />);
		const first = screen.getByRole('button', { name: 'Close Modal' });
		await user.click(screen.getByTestId(`${testId}--trigger`));
		screen.getByRole('menuitem', { name: 'Move' }).focus();

		await user.tab();

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(first).toHaveFocus();
		expect(document.body).not.toHaveFocus();
	});
});
