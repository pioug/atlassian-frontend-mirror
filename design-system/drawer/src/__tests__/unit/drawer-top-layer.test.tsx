import React, { type SyntheticEvent, useCallback, useState } from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { axe } from '@af/accessibility-testing/jest-axe';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
// Platform jest tests must use passGate/failGate to set gate values; ffTest is
// not permitted in this repo (see platform AGENTS.md feature-gate testing rules).
// eslint-disable-next-line import/no-extraneous-dependencies -- devDependency provided by monorepo
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { Drawer } from '../../drawer';
import { DrawerCloseButton } from '../../drawer-panel/drawer-close-button';
import { DrawerContent } from '../../drawer-panel/drawer-content';
import { DrawerSidebar } from '../../drawer-panel/drawer-sidebar';
import { type DrawerProps } from '../../types';

/**
 * JSDOM does not run the `cancel` event's default close action. The shared
 * top-layer polyfill supplies the subsequent native `toggle` and `close` events.
 */
function simulateDialogCancel(dialogEl: Element) {
	const dialog = dialogEl as HTMLDialogElement;
	const event = new Event('cancel', { cancelable: true });
	act(() => {
		dialog.dispatchEvent(event);
		if (!event.defaultPrevented) {
			dialog.close();
		}
	});
}

type ControlledDrawerProps = {
	onClose?: DrawerProps['onClose'];
	onOpenComplete?: DrawerProps['onOpenComplete'];
	onCloseComplete?: DrawerProps['onCloseComplete'];
	isOpenByDefault?: boolean;
	label?: string;
	titleId?: string;
	hasLabel?: boolean;
	width?: DrawerProps['width'];
	children?: React.ReactNode;
};

function ControlledDrawer({
	onClose: onCloseProp,
	onOpenComplete,
	onCloseComplete,
	isOpenByDefault = true,
	label = 'Test drawer',
	titleId,
	hasLabel = true,
	width,
	children,
}: ControlledDrawerProps) {
	const [isOpen, setIsOpen] = useState(isOpenByDefault);

	const onClose = useCallback(
		(event: SyntheticEvent<HTMLElement>, analyticsEvent?: any) => {
			setIsOpen(false);
			onCloseProp?.(event, analyticsEvent);
		},
		[onCloseProp],
	);

	return (
		<div>
			<button data-testid="open-trigger" type="button" onClick={() => setIsOpen(true)}>
				Open
			</button>
			<Drawer
				testId="drawer"
				isOpen={isOpen}
				onClose={onClose}
				onOpenComplete={onOpenComplete}
				onCloseComplete={onCloseComplete}
				label={hasLabel ? label : undefined}
				titleId={titleId}
				width={width}
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>{children ?? <span>Drawer body content</span>}</DrawerContent>
			</Drawer>
		</div>
	);
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Drawer top-layer rendering', () => {
	beforeAll(() => {
		// Emulate reduced motion so entry/exit settle synchronously (no
		// `transitionend` to await). Mirrors modal-dialog's top-layer tests.
		window.matchMedia = (query: string) =>
			({ matches: query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList;
	});

	afterAll(() => {
		window.matchMedia = () => ({ matches: false }) as MediaQueryList;
	});

	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('should render using a native <dialog> element', () => {
		render(<ControlledDrawer />);

		const dialog = screen.getByTestId('drawer');
		expect(dialog.tagName).toBe('DIALOG');
	});

	it('should open the dialog element when mounted', () => {
		render(<ControlledDrawer />);

		expect(screen.getByTestId('drawer')).toHaveAttribute('open');
	});

	it('should not render the drawer when closed', () => {
		render(<ControlledDrawer isOpenByDefault={false} />);

		expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
	});

	it('should render drawer content and sub-components', () => {
		render(<ControlledDrawer />);

		expect(screen.getByTestId('drawer-contents')).toBeInTheDocument();
		expect(screen.getByTestId('DrawerCloseButton')).toBeInTheDocument();
		expect(screen.getByText('Drawer body content')).toBeInTheDocument();
	});

	it('should not use a portal (renders in place, not at end of body)', () => {
		const { container } = render(<ControlledDrawer />);

		// The dialog renders within the React tree's container; a portal would
		// instead append it to the end of <body>, outside the container.
		expect(container).toContainElement(screen.getByTestId('drawer'));
	});

	// ── Accessible name ──

	it('should set aria-label when label is provided', () => {
		render(<ControlledDrawer label="Settings drawer" />);

		const dialog = screen.getByTestId('drawer');
		expect(dialog).toHaveAttribute('aria-label', 'Settings drawer');
		expect(dialog).not.toHaveAttribute('aria-labelledby');
	});

	it('should set aria-labelledby when only titleId is provided', () => {
		render(<ControlledDrawer hasLabel={false} titleId="drawer-title" />);

		const dialog = screen.getByTestId('drawer');
		expect(dialog).toHaveAttribute('aria-labelledby', 'drawer-title');
	});

	// ── Width ──

	it('should pin the narrow width', () => {
		render(<ControlledDrawer width="narrow" />);

		expect(screen.getByTestId('drawer')).toHaveStyle({ width: '360px', maxWidth: '100vw' });
	});

	it('should pin the wide width', () => {
		render(<ControlledDrawer width="wide" />);

		expect(screen.getByTestId('drawer')).toHaveStyle({ width: '600px', maxWidth: '100vw' });
	});

	// ── Close: Escape (native cancel) ──

	it('should call onClose with a KeyboardEvent when Escape (cancel) fires', async () => {
		const onClose = jest.fn();
		render(<ControlledDrawer onClose={onClose} />);

		simulateDialogCancel(screen.getByTestId('drawer'));

		await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
		const event = onClose.mock.calls[0][0];
		expect(event).toBeInstanceOf(KeyboardEvent);
		expect(event.key).toBe('Escape');
	});

	it('should close (unmount) after Escape', async () => {
		render(<ControlledDrawer />);

		expect(screen.getByTestId('drawer')).toBeInTheDocument();
		simulateDialogCancel(screen.getByTestId('drawer'));

		await waitFor(() => expect(screen.queryByTestId('drawer')).not.toBeInTheDocument());
	});

	// ── Close: backdrop click ──

	it('should call onClose with a MouseEvent when the backdrop is clicked', async () => {
		const onClose = jest.fn();
		render(<ControlledDrawer onClose={onClose} />);

		// Backdrop click === clicking the <dialog> element itself
		// (event.target === event.currentTarget).
		fireEvent.click(screen.getByTestId('drawer'));

		await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
		expect(onClose.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
	});

	it('should NOT close when clicking inside the drawer content', () => {
		const onClose = jest.fn();
		render(<ControlledDrawer onClose={onClose} />);

		fireEvent.click(screen.getByText('Drawer body content'));

		expect(onClose).not.toHaveBeenCalled();
	});

	// ── Close: close button (back button trigger) ──

	it('should call onClose when the close button is clicked', () => {
		const onClose = jest.fn();
		render(<ControlledDrawer onClose={onClose} />);

		fireEvent.click(screen.getByTestId('DrawerCloseButton'));

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	// ── Lifecycle callbacks ──

	it('should call onOpenComplete once after opening', () => {
		const onOpenComplete = jest.fn();
		render(<ControlledDrawer onOpenComplete={onOpenComplete} />);

		expect(onOpenComplete).toHaveBeenCalledTimes(1);
		expect(onOpenComplete).toHaveBeenCalledWith(expect.any(HTMLElement));
	});

	it('should call onCloseComplete after closing', async () => {
		const onCloseComplete = jest.fn();
		render(<ControlledDrawer onCloseComplete={onCloseComplete} />);

		simulateDialogCancel(screen.getByTestId('drawer'));

		await waitFor(() => expect(onCloseComplete).toHaveBeenCalledTimes(1));
		expect(onCloseComplete).toHaveBeenCalledWith(expect.any(HTMLElement));
	});

	// ── Re-open ──

	it('should support re-opening after close', async () => {
		render(<ControlledDrawer />);

		simulateDialogCancel(screen.getByTestId('drawer'));
		await waitFor(() => expect(screen.queryByTestId('drawer')).not.toBeInTheDocument());

		fireEvent.click(screen.getByTestId('open-trigger'));

		const reopened = screen.getByTestId('drawer');
		expect(reopened).toBeInTheDocument();
		expect(reopened).toHaveAttribute('open');
	});

	// ── Analytics ──

	it('should fire an analytics event with the escKey trigger on Escape', async () => {
		const onEvent = jest.fn();
		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<ControlledDrawer />
			</AnalyticsListener>,
		);

		simulateDialogCancel(screen.getByTestId('drawer'));

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'dismissed',
				actionSubject: 'drawer',
				attributes: {
					componentName: 'drawer',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'drawer',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
					trigger: 'escKey',
				},
			],
		});

		await waitFor(() => expect(onEvent).toHaveBeenCalledTimes(1));
		expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
	});

	it('should fire an analytics event with the blanket trigger on backdrop click', async () => {
		const onEvent = jest.fn();
		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<ControlledDrawer />
			</AnalyticsListener>,
		);

		fireEvent.click(screen.getByTestId('drawer'));

		await waitFor(() => expect(onEvent).toHaveBeenCalledTimes(1));
		expect(onEvent.mock.calls[0][0].context[0]).toEqual(
			expect.objectContaining({ trigger: 'blanket' }),
		);
	});

	it('should pass the analytics event as the second arg to onClose', async () => {
		const onClose = jest.fn();
		render(
			<AnalyticsListener channel="atlaskit" onEvent={jest.fn()}>
				<ControlledDrawer onClose={onClose} />
			</AnalyticsListener>,
		);

		simulateDialogCancel(screen.getByTestId('drawer'));

		await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
		expect(onClose.mock.calls[0][1]).toBeDefined();
		expect(onClose.mock.calls[0][1].payload.action).toBe('dismissed');
	});

	// ── Accessibility ──

	it('should not fail an aXe audit', async () => {
		const { container } = render(<ControlledDrawer label="Accessible drawer" />);

		await axe(container);
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Drawer legacy rendering (flag off)', () => {
	beforeEach(() => {
		failGate('platform-dst-top-layer');
	});

	it('should render the legacy panel (not a native <dialog>) when the flag is off', () => {
		render(<ControlledDrawer />);

		// Legacy path puts testId on the panel <div role="dialog">, not a <dialog>.
		const panel = screen.getByTestId('drawer');
		expect(panel.tagName).toBe('DIV');
		expect(panel).toHaveAttribute('role', 'dialog');
	});
});
