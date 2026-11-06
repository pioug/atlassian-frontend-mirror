import React, { StrictMode, useEffect, useRef } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Popover } from '../../src/popover/popover';
import { flushPopoverExit } from '../../src/testing/flush-popover-exit';

// Moves focus inside in a passive effect, as content such as a calendar does when it opens.
function TakesFocusOnMount() {
	const buttonRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		buttonRef.current?.focus();
	}, []);
	return (
		<button type="button" ref={buttonRef}>
			Inside
		</button>
	);
}

function Subject({
	isMounted,
	isOpen,
	shouldTakeFocus = false,
}: {
	isMounted: boolean;
	isOpen: boolean;
	shouldTakeFocus?: boolean;
}) {
	return (
		<div>
			<button type="button">Trigger</button>
			{isMounted ? (
				<Popover mode="manual" isOpen={isOpen}>
					{shouldTakeFocus ? <TakesFocusOnMount /> : <button type="button">Inside</button>}
				</Popover>
			) : null}
		</div>
	);
}

function focusButton({ name }: { name: string }) {
	act(() => screen.getByRole('button', { name, hidden: true }).focus());
}

describe('Popover focus restoration target', () => {
	it('keeps the trigger as the target when StrictMode shows a popover again after its content took focus', async () => {
		const { rerender } = render(
			<StrictMode>
				<Subject isMounted={false} isOpen={false} shouldTakeFocus />
			</StrictMode>,
		);
		focusButton({ name: 'Trigger' });
		// Mount the popover already open. StrictMode shows it again after the content effect ran.
		rerender(
			<StrictMode>
				<Subject isMounted isOpen shouldTakeFocus />
			</StrictMode>,
		);
		await flushPopoverExit();
		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();

		rerender(
			<StrictMode>
				<Subject isMounted isOpen={false} shouldTakeFocus />
			</StrictMode>,
		);
		await flushPopoverExit();

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
	});

	it('keeps the trigger as the target when the popover reopens during its close with focus inside', async () => {
		const { rerender } = render(<Subject isMounted isOpen={false} />);
		focusButton({ name: 'Trigger' });
		rerender(<Subject isMounted isOpen />);
		focusButton({ name: 'Inside' });

		// Close, then reopen before the close finishes. Focus is still inside the popover.
		rerender(<Subject isMounted isOpen={false} />);
		rerender(<Subject isMounted isOpen />);
		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
		rerender(<Subject isMounted isOpen={false} />);
		await flushPopoverExit();

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
	});
});
