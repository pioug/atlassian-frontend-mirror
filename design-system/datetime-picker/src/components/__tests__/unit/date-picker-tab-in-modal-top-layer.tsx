import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import noop from '@atlaskit/ds-lib/noop';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import DatePicker from '../../date-picker';

// The open calendar is in a modal's Tab order.
function Fields() {
	return (
		<>
			<button type="button">Before</button>
			<DatePicker id="due-date" label="Due date" />
			<button type="button">After</button>
		</>
	);
}

describe('DatePicker Tab order with the calendar open', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it.each([
		['inside a modal', true],
		['outside a modal', false],
	])('moves Tab from the input into the calendar, %s', async (_context, isInModal) => {
		const user = userEvent.setup();
		render(
			isInModal ? (
				<ModalDialog onClose={noop}>
					<ModalHeader hasCloseButton>
						<ModalTitle>Modal</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<Fields />
					</ModalBody>
				</ModalDialog>
			) : (
				<Fields />
			),
		);
		await user.click(screen.getByRole('combobox'));
		expect(screen.getByRole('grid')).toBeInTheDocument();

		await user.tab();

		expect(screen.getByRole('grid')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Previous year/ })).toHaveFocus();
	});
});
