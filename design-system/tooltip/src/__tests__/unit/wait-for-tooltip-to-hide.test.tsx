import React from 'react';

import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { waitForTooltipToHide } from '../../testing';
import Tooltip from '../../tooltip';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('waitForTooltipToHide', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('unmounts the tooltip and fires onHide once after the hide delay is flushed', async () => {
		const user = createUser();
		const onHide = jest.fn();
		render(
			<Tooltip testId="tooltip" content="hello world" onHide={onHide}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);
		const trigger = screen.getByTestId('trigger');

		await user.hover(trigger);
		act(() => {
			jest.runAllTimers();
		});
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		await user.unhover(trigger);
		// flush the hide delay
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(onHide).not.toHaveBeenCalled();

		await waitForTooltipToHide();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(onHide).toHaveBeenCalledTimes(1);
	});
});
