import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { useFocusRing } from '../../src';
import type { FocusState } from '../../src/types';

/**
 * @returns The getByTestId() fn and the hook state
 */
function setup(initialFocus?: FocusState) {
	const returnVal: ReturnType<typeof useFocusRing> = {} as any;
	function DummyComponent() {
		const focusHook = useFocusRing(initialFocus);
		Object.assign(returnVal, focusHook);
		return (
			<button {...focusHook.focusProps} data-testid="test" type="button">
				Save
			</button>
		);
	}
	render(<DummyComponent />);
	return [returnVal] as const;
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Focus Ring', () => {
	it('can accept a different default state', () => {
		const [focusHook] = setup('on');
		expect(focusHook.focusState).toEqual('on');
	});

	it('will update the focus state when focus changes', () => {
		const TestComponent = () => {
			const { focusState, focusProps } = useFocusRing();
			return (
				<button {...focusProps} data-testid="test" type="button">
					{focusState}
				</button>
			);
		};

		render(<TestComponent />);
		expect(screen.getByText('off')).toBeInTheDocument();

		const element = screen.getByTestId('test');
		fireEvent.focus(element);

		expect(screen.getByText('on')).toBeInTheDocument();

		fireEvent.blur(element);
		expect(screen.getByText('off')).toBeInTheDocument();
	});

	it('can programmatically update the focus state by directly calling the event handlers', () => {
		const [focusHook] = setup();

		expect(focusHook.focusState).toEqual('off');
		act(() => {
			// @ts-expect-error
			focusHook.focusProps.onFocus();
		});

		expect(focusHook.focusState).toEqual('on');

		act(() => {
			// @ts-expect-error
			focusHook.focusProps.onBlur();
		});
		expect(focusHook.focusState).toEqual('off');
	});
});
