import React, { type ReactNode, useRef, useState } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { useCloseOnUnclaimedEscape } from '../../src/page-surface/use-close-on-unclaimed-escape';
import { Popover } from '../../src/popover/popover';
import { flushPopoverExit } from '../../src/testing/flush-popover-exit';
import { useManualLightDismiss } from '../../src/use-manual-light-dismiss';

function pressEscape({ repeat = false }: { repeat?: boolean } = {}): KeyboardEvent {
	const event = new KeyboardEvent('keydown', {
		key: 'Escape',
		repeat,
		bubbles: true,
		cancelable: true,
		composed: true,
	});
	act(() => {
		// eslint-disable-next-line testing-library/no-node-access -- dispatch to the current focus to exercise element and document listener order
		(document.activeElement ?? document.body).dispatchEvent(event);
	});
	return event;
}

function Surface({
	name,
	onClose,
	isTargeted = false,
	shouldClose = true,
}: {
	name: string;
	onClose: () => void;
	isTargeted?: boolean;
	shouldClose?: boolean;
}) {
	const surfaceRef = useRef<HTMLDivElement>(null);
	useCloseOnUnclaimedEscape({
		isEnabled: true,
		surfaceRef,
		targetRef: isTargeted ? surfaceRef : undefined,
		onClose,
		shouldClose: () => shouldClose,
	});
	return (
		<div ref={surfaceRef} data-testid={name}>
			<button type="button">{name}</button>
		</div>
	);
}

function Manual({
	name,
	isOpen = true,
	onClose,
	children,
}: {
	name: string;
	isOpen?: boolean;
	onClose: () => void;
	children?: ReactNode;
}) {
	const popoverRef = useRef<HTMLDivElement>(null);
	useManualLightDismiss({ popoverRef, isOpen, onClose });
	return (
		<Popover
			ref={popoverRef}
			mode="manual"
			isOpen={isOpen}
			role="dialog"
			label={name}
			testId={name}
		>
			<button type="button">{name}</button>
			{children}
		</Popover>
	);
}

function ClosableManual({
	name,
	isOpen,
	isTargeted,
	onClose,
}: {
	name: string;
	isOpen: boolean;
	isTargeted: boolean;
	onClose: (name: string) => void;
}) {
	const [isDismissed, setIsDismissed] = useState(false);
	const [isSurfaceOpen, setIsSurfaceOpen] = useState(true);
	return (
		<Manual
			name={name}
			isOpen={isOpen && !isDismissed}
			onClose={() => {
				onClose(name);
				setIsDismissed(true);
			}}
		>
			{isSurfaceOpen ? (
				<Surface
					name={`${name} surface`}
					isTargeted={isTargeted}
					onClose={() => {
						onClose(`${name} surface`);
						setIsSurfaceOpen(false);
					}}
				/>
			) : null}
		</Manual>
	);
}

// Runs before any manual hook mounts: the surface must start open order tracking itself.
it('leaves Escape to a later native tooltip when no manual hook has mounted', () => {
	const onSurfaceClose = jest.fn();
	render(
		<>
			<Popover isOpen role="dialog" label="Auto" onClose={() => {}}>
				<Surface name="Surface" onClose={onSurfaceClose} />
			</Popover>
			<Popover isOpen mode="hint" role="tooltip" testId="tooltip" onClose={() => {}}>
				Tooltip
			</Popover>
		</>,
	);
	const tooltip = screen.getByTestId('tooltip');
	expect(tooltip.matches(':popover-open')).toBe(true);

	expect(pressEscape().defaultPrevented).toBe(false);

	expect(onSurfaceClose).not.toHaveBeenCalled();
	expect(tooltip.matches(':popover-open')).toBe(false);
});

describe.each([false, true])('Escape ownership with targeted surfaces: %s', (isTargeted) => {
	it.each([false, true])(
		'closes newer surface, newer popover, older surface, older popover (reverse DOM order: %s)',
		async (isReversed) => {
			const onClose = jest.fn();
			const names = isReversed ? ['Newer', 'Older'] : ['Older', 'Newer'];
			function Stack({ isNewerOpen }: { isNewerOpen: boolean }) {
				return (
					<>
						{names.map((name) => (
							<ClosableManual
								key={name}
								name={name}
								isOpen={name === 'Older' || isNewerOpen}
								isTargeted={isTargeted}
								onClose={onClose}
							/>
						))}
					</>
				);
			}
			const { rerender } = render(<Stack isNewerOpen={false} />);
			rerender(<Stack isNewerOpen />);

			['Newer surface', 'Newer', 'Older surface', 'Older'].forEach((name, index) => {
				screen.getByRole('button', { name }).focus();
				const event = pressEscape();
				expect(event.defaultPrevented).toBe(true);
				expect(onClose).toHaveBeenCalledTimes(index + 1);
				expect(onClose).toHaveBeenNthCalledWith(index + 1, name);
			});
			await flushPopoverExit();
			expect(screen.queryByTestId('Older')).not.toBeInTheDocument();
			expect(screen.queryByTestId('Newer')).not.toBeInTheDocument();
		},
	);
});

it.each([
	{ shouldClose: false, repeat: false },
	{ shouldClose: true, repeat: true },
])(
	'protects native ancestors when the surface declines or repeats: %s',
	({ shouldClose, repeat }) => {
		const onSurfaceClose = jest.fn();
		const onManualClose = jest.fn();
		const onAutoClose = jest.fn();
		render(
			<Popover isOpen role="dialog" label="Auto" testId="auto" onClose={onAutoClose}>
				<Manual name="Manual" onClose={onManualClose}>
					<Surface name="Surface" onClose={onSurfaceClose} shouldClose={shouldClose} />
				</Manual>
			</Popover>,
		);
		screen.getByRole('button', { name: 'Surface' }).focus();
		const outer = screen.getByTestId('auto');
		expect(outer.matches(':popover-open')).toBe(true);

		expect(pressEscape({ repeat }).defaultPrevented).toBe(true);

		expect(outer.matches(':popover-open')).toBe(true);
		expect(screen.getByTestId('Manual').matches(':popover-open')).toBe(true);
		expect(onSurfaceClose).not.toHaveBeenCalled();
		expect(onManualClose).not.toHaveBeenCalled();
		expect(onAutoClose).not.toHaveBeenCalled();
	},
);

describe('Escape ownership with a layer that opens last inside an older popover', () => {
	function Stack({
		isNewerOpen,
		isTooltipOpen,
		onOlderClose,
		onNewerClose,
	}: {
		isNewerOpen: boolean;
		isTooltipOpen: boolean;
		onOlderClose: () => void;
		onNewerClose: () => void;
	}) {
		return (
			<>
				<Manual name="Older" onClose={onOlderClose}>
					<Popover
						isOpen={isTooltipOpen}
						mode="hint"
						role="tooltip"
						testId="tooltip"
						onClose={() => {}}
					>
						Tooltip in older
					</Popover>
				</Manual>
				<Manual name="Newer" isOpen={isNewerOpen} onClose={onNewerClose} />
			</>
		);
	}

	it('lets the tooltip close first, as the native order does', () => {
		const onOlderClose = jest.fn();
		const onNewerClose = jest.fn();
		const props = { onOlderClose, onNewerClose };
		const { rerender } = render(<Stack {...props} isNewerOpen={false} isTooltipOpen={false} />);
		rerender(<Stack {...props} isNewerOpen isTooltipOpen={false} />);
		// For example, a hover in the older popover opens the tooltip after the newer popover.
		rerender(<Stack {...props} isNewerOpen isTooltipOpen />);
		act(() => {
			screen.getByRole('button', { name: 'Newer' }).focus();
		});

		const first = pressEscape();

		// The browser closes the tooltip, so no hook may cancel the keydown.
		expect(first.defaultPrevented).toBe(false);
		expect(screen.getByTestId('tooltip').matches(':popover-open')).toBe(false);
		expect(onNewerClose).not.toHaveBeenCalled();
		expect(onOlderClose).not.toHaveBeenCalled();

		const second = pressEscape();

		expect(second.defaultPrevented).toBe(true);
		expect(onNewerClose).toHaveBeenCalledTimes(1);
		expect(onOlderClose).not.toHaveBeenCalled();
	});
});
