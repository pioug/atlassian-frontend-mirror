import React, { type PropsWithChildren } from 'react';

// eslint-disable-next-line @atlassian/testing-library/prefer-atlassian-testing-library -- Platform hook tests use renderHook from @testing-library/react.
import { renderHook } from '@testing-library/react';

import InteractionContext from '@atlaskit/interaction-context';
import { createEvent } from '@atlassian/testing-library/create-event';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import usePressTracing from './index';

describe('usePressTracing event inputs', () => {
	const tracePress = jest.fn();
	const context = { hold: jest.fn(), tracePress };
	const wrapper = ({ children }: PropsWithChildren) => (
		<InteractionContext.Provider value={context}>{children}</InteractionContext.Provider>
	);

	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(performance, 'now').mockReturnValue(1000);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('can be used directly as a React click handler and preserves the event timestamp', async () => {
		function Button() {
			const onClick = usePressTracing('open-details');
			return <button onClick={onClick}>Open details</button>;
		}
		const { container } = render(<Button />, { wrapper });
		const button = screen.getByRole('button', { name: 'Open details' });
		const event = createEvent.click(button);
		Object.defineProperty(event, 'timeStamp', { value: 125 });

		// eslint-disable-next-line testing-library/prefer-user-event -- Dispatch a specific event to verify its original timestamp.
		fireEvent(button, event);

		expect(tracePress).toHaveBeenCalledWith('open-details', 125);
		await expect(container).toBeAccessible();
	});

	it.each([0, 125])('preserves a numeric timestamp of %s', (timestamp) => {
		const { result } = renderHook(() => usePressTracing('open-details'), { wrapper });

		result.current(timestamp);

		expect(tracePress).toHaveBeenCalledWith('open-details', timestamp);
	});

	it.each([0, 125])('preserves a native event timestamp of %s', (timestamp) => {
		const { result } = renderHook(() => usePressTracing('open-details'), { wrapper });
		const event = new MouseEvent('click');
		Object.defineProperty(event, 'timeStamp', { value: timestamp });

		const target = new EventTarget();
		target.addEventListener('click', result.current);
		target.dispatchEvent(event);

		expect(tracePress).toHaveBeenCalledWith('open-details', timestamp);
	});

	it('uses the current time when no input is provided', () => {
		const { result } = renderHook(() => usePressTracing('open-details'), { wrapper });

		result.current();

		expect(tracePress).toHaveBeenCalledWith('open-details', 1000);
	});

	it('remains a no-op without an interaction context', () => {
		const { result } = renderHook(() => usePressTracing('open-details'));

		result.current(new MouseEvent('click'));

		expect(tracePress).not.toHaveBeenCalled();
	});
});
