import React, { useState } from 'react';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act, fireEvent, render, screen, waitFor } from '@atlassian/testing-library';

import ModalDialog from '../../modal-dialog';
import ModalTransition from '../../modal-transition';
import { type ModalDialogProps } from '../../types';

function ControlledModal({
	onOpenComplete,
}: {
	onOpenComplete: NonNullable<ModalDialogProps['onOpenComplete']>;
}) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div>
			<button data-testid="open-trigger" type="button" onClick={() => setIsOpen(true)}>
				Open
			</button>
			<ModalTransition>
				{isOpen && (
					<ModalDialog
						testId="modal"
						label="Test modal"
						onClose={() => setIsOpen(false)}
						onOpenComplete={onOpenComplete}
					>
						Modal content
					</ModalDialog>
				)}
			</ModalTransition>
		</div>
	);
}

function simulateDialogCancel(dialog: HTMLDialogElement) {
	const event = new Event('cancel', { cancelable: true });
	act(() => {
		dialog.dispatchEvent(event);
		if (!event.defaultPrevented) {
			dialog.close();
		}
	});
}

/**
 * This is separate from modal-dialog-top-layer.test.tsx because that suite caches reduced motion
 * as enabled, while this test needs a pending exit animation.
 */
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
it('should call onOpenComplete when re-opened before exit settles', async () => {
	passGate('platform-dst-top-layer');

	const originalGetAnimations = Object.getOwnPropertyDescriptor(
		HTMLElement.prototype,
		'getAnimations',
	);
	const originalMatchMedia = window.matchMedia;
	const exitAnimationDeferred = { resolve: (_animation: Animation) => {} };
	const exitAnimation = {
		finished: new Promise<Animation>((resolve) => {
			exitAnimationDeferred.resolve = resolve;
		}),
	} as Animation;
	const animations: { current: Animation[] } = { current: [] };
	const getAnimations = jest.fn(() => animations.current);

	Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
		configurable: true,
		value: getAnimations,
	});
	window.matchMedia = () => ({ matches: false }) as MediaQueryList;

	try {
		const onOpenComplete = jest.fn();
		render(<ControlledModal onOpenComplete={onOpenComplete} />);

		await waitFor(() => expect(onOpenComplete).toHaveBeenCalledTimes(1));
		const dialog = screen.getByTestId('modal') as HTMLDialogElement;

		animations.current = [exitAnimation];
		simulateDialogCancel(dialog);
		await waitFor(() => expect(getAnimations).toHaveBeenCalledTimes(1));

		animations.current = [];
		fireEvent.click(screen.getByTestId('open-trigger'));

		expect(screen.getByTestId('modal')).toBe(dialog);
		await waitFor(() => expect(onOpenComplete).toHaveBeenCalledTimes(2));

		exitAnimationDeferred.resolve({} as Animation);
		await exitAnimation.finished;
	} finally {
		window.matchMedia = originalMatchMedia;
		if (originalGetAnimations) {
			Object.defineProperty(HTMLElement.prototype, 'getAnimations', originalGetAnimations);
		} else {
			Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
		}
	}
});
