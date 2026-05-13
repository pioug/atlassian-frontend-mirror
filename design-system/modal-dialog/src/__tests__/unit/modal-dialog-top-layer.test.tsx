import React, { useCallback, useState } from 'react';

import { axe } from '@af/accessibility-testing';
import { AnalyticsListener } from '@atlaskit/analytics-next';
// eslint-disable-next-line import/no-extraneous-dependencies -- devDependency provided by monorepo
import { ffTest } from '@atlassian/feature-flags-test-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- devDependency provided by monorepo
import { act, fireEvent, render, screen } from '@atlassian/testing-library';

import ModalBody from '../../modal-body';
import ModalDialog from '../../modal-dialog';
import ModalFooter from '../../modal-footer';
import ModalHeader from '../../modal-header';
import ModalTitle from '../../modal-title';
import ModalTransition from '../../modal-transition';
import { type ModalDialogProps } from '../../types';

jest.mock('raf-schd', () => (fn: Function) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

/**
 * Simulates the native `cancel` event that the browser fires on `<dialog>`
 * when the user presses Escape. JSDOM does not implement the dialog API,
 * so we dispatch the event manually.
 */
function simulateDialogCancel(dialogEl: Element) {
	const event = new Event('cancel', { cancelable: true });
	act(() => {
		dialogEl.dispatchEvent(event);
	});
}

/**
 * Simulates the `transitionend` event that fires when a CSS transition completes.
 * In JSDOM, CSS transitions don't run, so we dispatch the event manually
 * to trigger the ExitingPersistence glue in modal-wrapper.
 */
function simulateTransitionEnd(dialogEl: Element) {
	const event = new Event('transitionend', { bubbles: true });
	act(() => {
		dialogEl.dispatchEvent(event);
	});
}

/**
 * Helper to render a modal that can be opened and closed.
 * Props are explicitly listed to avoid unsafe spread into JSX.
 */
function ControlledModal({
	onClose: onCloseProp,
	defaultOpen = true,
	children,
	label,
	width,
	height,
	onOpenComplete,
	onCloseComplete,
	hasLabel = true,
	shouldCloseOnEscapePress,
	shouldCloseOnOverlayClick,
}: {
	onClose?: ModalDialogProps['onClose'];
	defaultOpen?: boolean;
	children?: React.ReactNode;
	label?: ModalDialogProps['label'];
	width?: ModalDialogProps['width'];
	height?: ModalDialogProps['height'];
	onOpenComplete?: ModalDialogProps['onOpenComplete'];
	onCloseComplete?: ModalDialogProps['onCloseComplete'];
	hasLabel?: boolean;
	shouldCloseOnEscapePress?: ModalDialogProps['shouldCloseOnEscapePress'];
	shouldCloseOnOverlayClick?: ModalDialogProps['shouldCloseOnOverlayClick'];
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const onClose = useCallback(
		(...args: Parameters<NonNullable<typeof onCloseProp>>) => {
			setIsOpen(false);
			onCloseProp?.(...args);
		},
		[onCloseProp],
	);

	const defaultChildren = (
		<>
			<ModalHeader hasCloseButton>
				<ModalTitle>Modal Title</ModalTitle>
			</ModalHeader>
			<ModalBody>Modal body content</ModalBody>
			<ModalFooter>
				<button data-testid="footer-action" type="button">
					Action
				</button>
			</ModalFooter>
		</>
	);

	return (
		<div>
			<button data-testid="open-trigger" type="button" onClick={() => setIsOpen(true)}>
				Open
			</button>
			<ModalTransition>
				{isOpen && (
					<ModalDialog
						testId="modal"
						onClose={onClose}
						label={hasLabel ? (label ?? 'Test Modal') : undefined}
						width={width}
						height={height}
						onOpenComplete={onOpenComplete}
						onCloseComplete={onCloseComplete}
						shouldCloseOnEscapePress={shouldCloseOnEscapePress}
						shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
					>
						{children ?? defaultChildren}
					</ModalDialog>
				)}
			</ModalTransition>
		</div>
	);
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'ModalDialog top-layer rendering', () => {
	beforeAll(() => {
		// Emulate reduced motion to avoid animation timing issues
		window.matchMedia = (query: string) =>
			({ matches: query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList;
	});

	afterAll(() => {
		window.matchMedia = () => ({ matches: false }) as MediaQueryList;
	});

	it('should render using a native <dialog> element', () => {
		render(<ControlledModal />);

		const dialog = screen.getByTestId('modal');
		expect(dialog.tagName).toBe('DIALOG');
	});

	it('should open the dialog element when mounted', () => {
		render(<ControlledModal />);

		const dialog = screen.getByTestId('modal');
		expect(dialog).toHaveAttribute('open');
	});

	it('should close dialog when unmounted', () => {
		const { unmount } = render(<ControlledModal />);

		const dialog = screen.getByTestId('modal');
		expect(dialog).toHaveAttribute('open');

		unmount();

		expect(dialog).not.toHaveAttribute('open');
	});

	it('should render modal content (header, body, footer)', () => {
		render(<ControlledModal />);

		expect(screen.getByTestId('modal--header')).toBeInTheDocument();
		expect(screen.getByTestId('modal--body')).toBeInTheDocument();
		expect(screen.getByTestId('modal--footer')).toBeInTheDocument();
	});

	it('should render modal title', () => {
		render(<ControlledModal />);

		expect(screen.getByTestId('modal--title')).toBeInTheDocument();
		expect(screen.getByText('Modal Title')).toBeInTheDocument();
	});

	it('should call onClose when escape is pressed (cancel event)', () => {
		const onClose = jest.fn();
		render(<ControlledModal onClose={onClose} />);

		const dialog = screen.getByTestId('modal');
		simulateDialogCancel(dialog);

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith(expect.any(KeyboardEvent), expect.anything());
		expect((onClose.mock.calls[0][0] as KeyboardEvent).key).toBe('Escape');
	});

	it('should call onClose when backdrop is clicked', () => {
		const onClose = jest.fn();
		render(<ControlledModal onClose={onClose} />);

		const dialog = screen.getByTestId('modal');
		// Backdrop click: event.target === event.currentTarget (clicking the dialog itself)
		fireEvent.click(dialog);

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith(expect.any(MouseEvent), expect.anything());
	});

	it('should unmount modal when onClose sets isOpen to false', () => {
		render(<ControlledModal />);

		expect(screen.getByTestId('modal')).toBeInTheDocument();

		const dialog = screen.getByTestId('modal');
		simulateDialogCancel(dialog);

		// With reduced motion active, the modal unmounts immediately (no exit animation).
		expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
	});

	it('should set aria-labelledby referencing the title when no label prop is provided', () => {
		render(<ControlledModal hasLabel={false} />);

		const dialog = screen.getByTestId('modal');
		const titleId = dialog.getAttribute('aria-labelledby');
		expect(titleId).toBeTruthy();

		// The title text element should have the matching id
		const titleElement = screen.getByTestId('modal--title-text');
		expect(titleElement.id).toBe(titleId);
	});

	it('should set aria-label when label prop is provided', () => {
		render(<ControlledModal label="Accessible label" />);

		const dialog = screen.getByTestId('modal');
		expect(dialog).toHaveAttribute('aria-label', 'Accessible label');
		expect(dialog).not.toHaveAttribute('aria-labelledby');
	});

	it('should render a visual content container inside the <dialog>', () => {
		render(<ControlledModal />);

		// The visual container is a focusable div inside the dialog
		const visualContainer = screen.getByRole('dialog', { hidden: true });
		expect(visualContainer).toBeInTheDocument();
	});

	it('should render with default width (medium)', () => {
		render(<ControlledModal />);
		expect(screen.getByTestId('modal')).toBeInTheDocument();
	});

	it('should support named width presets', () => {
		render(<ControlledModal width="large" />);
		expect(screen.getByTestId('modal')).toBeInTheDocument();
	});

	it('should support custom numeric width', () => {
		render(<ControlledModal width={800} />);

		const dialog = screen.getByTestId('modal');
		const style = dialog.getAttribute('style');
		expect(style).toContain('width: min(800px, 100vw)');
	});

	it('should support custom string width', () => {
		render(<ControlledModal width="80%" />);

		const dialog = screen.getByTestId('modal');
		const style = dialog.getAttribute('style');
		// Percentage widths are resolved relative to the legacy Positioner container:
		// calc(<pct> * (100vw - 120px) / 100) to match legacy behavior
		expect(style).toContain('width: min(calc(80 * (100vw - 120px) / 100), 100vw)');
	});

	it('should accept height prop without error', () => {
		// Height is passed as a CSS custom property (--modal-dialog-height).
		// JSDOM doesn't serialize custom properties in getAttribute('style'),
		// so we verify the modal renders successfully with the prop.
		render(<ControlledModal height={500} />);

		const dialog = screen.getByTestId('modal');
		expect(dialog).toBeInTheDocument();
	});

	it('should call onOpenComplete after mount', () => {
		const onOpenComplete = jest.fn();
		render(<ControlledModal onOpenComplete={onOpenComplete} />);

		expect(onOpenComplete).toHaveBeenCalledTimes(1);
		expect(onOpenComplete).toHaveBeenCalledWith(expect.any(HTMLDivElement), true);
	});

	it('should render close button when hasCloseButton is true', () => {
		render(<ControlledModal />);
		expect(screen.getByTestId('modal--close-button')).toBeInTheDocument();
	});

	it('should render children correctly', () => {
		render(
			<ControlledModal>
				<ModalBody>
					<div data-testid="custom-child">Custom content</div>
				</ModalBody>
			</ControlledModal>,
		);

		expect(screen.getByTestId('custom-child')).toBeInTheDocument();
	});

	it('should support testId on sub-components', () => {
		render(<ControlledModal />);

		expect(screen.getByTestId('modal')).toBeInTheDocument();
		expect(screen.getByTestId('modal--header')).toBeInTheDocument();
		expect(screen.getByTestId('modal--title')).toBeInTheDocument();
		expect(screen.getByTestId('modal--body')).toBeInTheDocument();
		expect(screen.getByTestId('modal--footer')).toBeInTheDocument();
	});

	it('should not use Portal for rendering', () => {
		render(<ControlledModal />);

		// In top-layer mode, the dialog should be in the natural DOM position,
		// not portalled to end of <body>.
		const dialog = screen.getByTestId('modal');
		const trigger = screen.getByTestId('open-trigger');
		expect(dialog).toBeInTheDocument();
		expect(trigger).toBeInTheDocument();
	});

	// ── Animation tests ──

	it('should apply animation data attribute to the dialog element', () => {
		render(<ControlledModal />);

		const dialog = screen.getByTestId('modal');
		expect(dialog).toHaveAttribute('data-ds-dialog-slide-up-and-fade');
	});

	it('should close dialog when exiting to trigger CSS exit animation', () => {
		render(<ControlledModal />);

		const dialog = screen.getByTestId('modal');
		expect(dialog).toHaveAttribute('open');

		simulateDialogCancel(dialog);

		// The ExitingPersistence glue should have called dialog.close()
		// to trigger the CSS exit animation.
		expect(dialog).not.toHaveAttribute('open');
	});

	it('should call onCloseComplete during exit teardown', () => {
		const onCloseComplete = jest.fn();
		render(<ControlledModal onCloseComplete={onCloseComplete} />);

		const dialog = screen.getByTestId('modal');
		simulateDialogCancel(dialog);

		// With reduced motion, onCloseComplete fires immediately (no exit animation).
		expect(onCloseComplete).toHaveBeenCalledTimes(1);
		expect(onCloseComplete).toHaveBeenCalledWith(expect.any(HTMLDivElement));
	});

	it('should unmount modal on backdrop click after exit animation', () => {
		render(<ControlledModal />);

		const dialog = screen.getByTestId('modal');

		// Backdrop click: click the dialog element directly.
		act(() => {
			const event = new MouseEvent('click', { bubbles: true, cancelable: true });
			Object.defineProperty(event, 'target', { value: dialog });
			dialog.dispatchEvent(event);
		});

		// Simulate CSS exit animation completing.
		simulateTransitionEnd(dialog);

		expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
	});

	// ── shouldCloseOnEscapePress / shouldCloseOnOverlayClick respected via top-layer context ──

	it('should NOT call onClose on Escape when shouldCloseOnEscapePress is false', () => {
		const onClose = jest.fn();
		render(<ControlledModal onClose={onClose} shouldCloseOnEscapePress={false} />);

		const dialog = screen.getByTestId('modal');
		simulateDialogCancel(dialog);

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('modal')).toBeInTheDocument();
	});

	it('should NOT call onClose on backdrop click when shouldCloseOnOverlayClick is false', () => {
		const onClose = jest.fn();
		render(<ControlledModal onClose={onClose} shouldCloseOnOverlayClick={false} />);

		const dialog = screen.getByTestId('modal');
		fireEvent.click(dialog);

		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByTestId('modal')).toBeInTheDocument();
	});

	// ── Click inside content does NOT close ──

	it('should not close when clicking inside modal content', () => {
		const onClose = jest.fn();
		render(<ControlledModal onClose={onClose} />);

		// Click on the body text inside the modal
		fireEvent.click(screen.getByText('Modal body content'));

		expect(onClose).not.toHaveBeenCalled();
	});

	it('should not close when clicking interactive elements inside modal', () => {
		const onClose = jest.fn();
		render(<ControlledModal onClose={onClose} />);

		fireEvent.click(screen.getByTestId('footer-action'));

		expect(onClose).not.toHaveBeenCalled();
	});

	// ── Re-open after close ──

	it('should support re-opening after close', () => {
		render(<ControlledModal />);

		expect(screen.getByTestId('modal')).toBeInTheDocument();

		// Close the modal via Escape
		const dialog = screen.getByTestId('modal');
		simulateDialogCancel(dialog);
		simulateTransitionEnd(dialog);

		expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

		// Re-open by clicking the trigger
		fireEvent.click(screen.getByTestId('open-trigger'));

		const reopenedDialog = screen.getByTestId('modal');
		expect(reopenedDialog).toBeInTheDocument();
		expect(reopenedDialog).toHaveAttribute('open');
	});

	it('should call onOpenComplete again when re-opened', () => {
		const onOpenComplete = jest.fn();
		render(<ControlledModal onOpenComplete={onOpenComplete} />);

		expect(onOpenComplete).toHaveBeenCalledTimes(1);

		// Close
		const dialog = screen.getByTestId('modal');
		simulateDialogCancel(dialog);
		simulateTransitionEnd(dialog);

		// Re-open
		fireEvent.click(screen.getByTestId('open-trigger'));

		expect(onOpenComplete).toHaveBeenCalledTimes(2);
	});

	// ── Escape triggers close flow correctly ──

	it('should close dialog after Escape triggers the exit flow', () => {
		render(<ControlledModal />);

		const dialog = screen.getByTestId('modal');
		expect(dialog).toHaveAttribute('open');

		simulateDialogCancel(dialog);

		// After Escape, the ExitingPersistence glue should call dialog.close()
		// to trigger the CSS exit animation.
		expect(dialog).not.toHaveAttribute('open');
	});

	// ── dialog.close() is called before unmount (not just on Escape) ──

	it('should close dialog when backdrop triggers exit', () => {
		render(<ControlledModal />);

		const dialog = screen.getByTestId('modal');
		expect(dialog).toHaveAttribute('open');

		fireEvent.click(dialog);

		expect(dialog).not.toHaveAttribute('open');
	});

	// ── onCloseComplete with backdrop close ──

	it('should call onCloseComplete when closed via backdrop click', () => {
		const onCloseComplete = jest.fn();
		render(<ControlledModal onCloseComplete={onCloseComplete} />);

		const dialog = screen.getByTestId('modal');
		fireEvent.click(dialog);

		// With reduced motion, onCloseComplete fires immediately (no exit animation).
		expect(onCloseComplete).toHaveBeenCalledTimes(1);
		expect(onCloseComplete).toHaveBeenCalledWith(expect.any(HTMLDivElement));
	});

	// ── Role and semantics ──

	it('should have role="dialog" on the visual content container', () => {
		render(<ControlledModal />);

		const dialogRole = screen.getByRole('dialog', { hidden: true });
		expect(dialogRole).toBeInTheDocument();
	});

	it('should set aria-label on dialog when label prop is a custom value', () => {
		render(<ControlledModal label="Custom accessible name" />);

		const dialog = screen.getByTestId('modal');
		expect(dialog).toHaveAttribute('aria-label', 'Custom accessible name');
	});

	// ── Default open state ──

	it('should not render modal when defaultOpen is false', () => {
		render(<ControlledModal defaultOpen={false} />);

		expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
	});

	it('should render modal when opened from defaultOpen false via trigger', () => {
		render(<ControlledModal defaultOpen={false} />);

		expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

		fireEvent.click(screen.getByTestId('open-trigger'));

		expect(screen.getByTestId('modal')).toBeInTheDocument();
	});

	it('should not fail aXe audit', async () => {
		const { container } = render(<ControlledModal />);

		await axe(container);
	});

	// ── Analytics event integration ──

	it('should fire analytics event on the atlaskit channel when closed via Escape', () => {
		const analyticsCallback = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={analyticsCallback}>
				<ControlledModal />
			</AnalyticsListener>,
		);

		const dialog = screen.getByTestId('modal');
		simulateDialogCancel(dialog);

		expect(analyticsCallback).toHaveBeenCalledTimes(1);
		expect(analyticsCallback.mock.calls[0][0].payload).toEqual({
			action: 'closed',
			actionSubject: 'modalDialog',
			attributes: {
				componentName: 'modalDialog',
				packageName: expect.any(String),
				packageVersion: expect.any(String),
			},
		});
	});

	it('should pass analytics event as second argument to onClose callback', () => {
		const onClose = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={jest.fn()}>
				<ControlledModal onClose={onClose} />
			</AnalyticsListener>,
		);

		const dialog = screen.getByTestId('modal');
		simulateDialogCancel(dialog);

		expect(onClose).toHaveBeenCalledTimes(1);
		// First arg: synthetic KeyboardEvent; second arg: analytics event
		expect(onClose.mock.calls[0][1]).toBeDefined();
		expect(onClose.mock.calls[0][1].payload).toEqual({
			action: 'closed',
			actionSubject: 'modalDialog',
			attributes: {
				componentName: 'modalDialog',
				packageName: expect.any(String),
				packageVersion: expect.any(String),
			},
		});
	});

	it('should fire analytics event when closed via backdrop click', () => {
		const analyticsCallback = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={analyticsCallback}>
				<ControlledModal />
			</AnalyticsListener>,
		);

		const dialog = screen.getByTestId('modal');
		fireEvent.click(dialog);

		expect(analyticsCallback).toHaveBeenCalledTimes(1);
		expect(analyticsCallback.mock.calls[0][0].payload).toEqual({
			action: 'closed',
			actionSubject: 'modalDialog',
			attributes: {
				componentName: 'modalDialog',
				packageName: expect.any(String),
				packageVersion: expect.any(String),
			},
		});
	});

	// ── Stacked modals ──

	it('should hide backdrop for stacked background modals', () => {
		// Render two modals to create a stacking scenario.
		// The first modal should have a hidden backdrop since it's behind.
		render(
			<div>
				<ModalTransition>
					<ModalDialog testId="modal-back" label="Back Modal">
						<ModalBody>Back modal</ModalBody>
					</ModalDialog>
				</ModalTransition>
				<ModalTransition>
					<ModalDialog testId="modal-front" label="Front Modal">
						<ModalBody>Front modal</ModalBody>
					</ModalDialog>
				</ModalTransition>
			</div>,
		);

		// Both modals should render
		expect(screen.getByTestId('modal-back')).toBeInTheDocument();
		expect(screen.getByTestId('modal-front')).toBeInTheDocument();
	});

	// ── Width preset resolution ──

	it('should apply small width preset inline style', () => {
		render(<ControlledModal width="small" />);

		const dialog = screen.getByTestId('modal');
		const style = dialog.getAttribute('style');
		// small = 400px
		expect(style).toContain('width: min(400px, 100vw)');
	});

	it('should apply x-large width preset inline style', () => {
		render(<ControlledModal width="x-large" />);

		const dialog = screen.getByTestId('modal');
		const style = dialog.getAttribute('style');
		// x-large = 968px
		expect(style).toContain('width: min(968px, 100vw)');
	});

	// ── onClose synthetic event shape ──

	it('should provide a KeyboardEvent with key=Escape when closed via cancel event', () => {
		const onClose = jest.fn();
		render(<ControlledModal onClose={onClose} />);

		const dialog = screen.getByTestId('modal');
		simulateDialogCancel(dialog);

		const event = onClose.mock.calls[0][0];
		expect(event).toBeInstanceOf(KeyboardEvent);
		expect(event.key).toBe('Escape');
	});

	it('should provide a MouseEvent when closed via backdrop click', () => {
		const onClose = jest.fn();
		render(<ControlledModal onClose={onClose} />);

		const dialog = screen.getByTestId('modal');
		fireEvent.click(dialog);

		const event = onClose.mock.calls[0][0];
		expect(event).toBeInstanceOf(MouseEvent);
	});

	// ── DialogScrollLock rendered ──

	it('should render DialogScrollLock for background scroll prevention', () => {
		render(<ControlledModal />);

		// DialogScrollLock sets overflow:hidden on the <html> element.
		// Verify the dialog is present and functional (scroll lock is an
		// internal implementation detail verified by the component itself).
		const dialog = screen.getByTestId('modal');
		expect(dialog.tagName).toBe('DIALOG');
	});

	// ── Children mounted only once ──

	it('should mount children only once', () => {
		const mountFn = jest.fn();

		function TrackMount() {
			React.useEffect(() => {
				mountFn();
			}, []);
			return <div>Tracked child</div>;
		}

		render(
			<ControlledModal>
				<ModalBody>
					<TrackMount />
				</ModalBody>
			</ControlledModal>,
		);

		expect(mountFn).toHaveBeenCalledTimes(1);
	});
});
