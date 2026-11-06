import React, { useState } from 'react';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Popup } from '../../popup';
import { type TriggerProps } from '../../types';

type TOnClose = (event: Event | React.MouseEvent | React.KeyboardEvent | null) => void;

/**
 * A role-less popup: it takes no initial focus, so focus stays on the trigger when it opens.
 */
function TogglePopup({ onClose }: { onClose: TOnClose }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popup
			isOpen={isOpen}
			onClose={(event) => {
				onClose(event);
				setIsOpen(false);
			}}
			testId="popup"
			trigger={(triggerProps: TriggerProps) => (
				<button type="button" {...triggerProps} onClick={() => setIsOpen((current) => !current)}>
					Trigger
				</button>
			)}
			content={() => <div>Popup content</div>}
		/>
	);
}

describe('Popup close event for Escape with platform-dst-top-layer', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('passes an Escape keyboard event when Escape is pressed with focus on the trigger', async () => {
		const onClose = jest.fn();
		render(<TogglePopup onClose={onClose} />);
		const trigger = screen.getByRole('button', { name: 'Trigger' });

		await userEvent.click(trigger);
		expect(screen.getByTestId('popup')).toBeVisible();
		expect(trigger).toHaveFocus();

		await userEvent.keyboard('{Escape}');

		await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
		const [event] = onClose.mock.calls[0];
		expect(event).toBeInstanceOf(KeyboardEvent);
		expect(event).toMatchObject({ type: 'keydown', key: 'Escape' });
		expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
	});
});
