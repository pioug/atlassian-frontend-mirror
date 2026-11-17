import React, { type ReactNode, StrictMode } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';
import { isNativeElementOpen } from '../../src/internal/is-native-element-open';
import { Popover } from '../../src/popover/popover';

/**
 * A layer shows (`showPopover()`, `showModal()`) before its content effects run: `autoFocus`, ref
 * callbacks and layout effects. So a content `autoFocus` works.
 *
 * - Smoke tests: the patterns that consumers check in their own jsdom tests work in jsdom.
 * - The focus and React timing tests run in a browser
 *   (`__tests__/playwright/show-before-content-effects.spec.tsx`).
 */

type TLayerKind = 'popover-dialog' | 'popover-menu' | 'popover-no-role' | 'dialog';

const layerKinds: TLayerKind[] = ['popover-dialog', 'popover-menu', 'popover-no-role', 'dialog'];

function noop() {}

function getPopoverRole({ kind }: { kind: TLayerKind }): 'dialog' | 'menu' | undefined {
	if (kind === 'popover-menu') {
		return 'menu';
	}
	if (kind === 'popover-dialog') {
		return 'dialog';
	}
	return undefined;
}

function TestLayer({
	kind,
	isOpen,
	testId = 'layer',
	hasAutoFocus = false,
	children,
}: {
	kind: TLayerKind;
	isOpen: boolean;
	testId?: string;
	hasAutoFocus?: boolean;
	children?: ReactNode;
}): ReactNode {
	const itemRole = kind === 'popover-menu' ? 'menuitem' : undefined;
	const content = (
		<div>
			<button type="button" role={itemRole} data-testid={`${testId}-first`}>
				First
			</button>
			{hasAutoFocus && (
				<button type="button" role={itemRole} data-testid={`${testId}-target`} autoFocus>
					Target
				</button>
			)}
			{children}
		</div>
	);
	if (kind === 'dialog') {
		return (
			<Dialog isOpen={isOpen} onClose={noop} label={testId} testId={testId}>
				{content}
			</Dialog>
		);
	}
	return (
		<Popover
			isOpen={isOpen}
			onClose={noop}
			role={getPopoverRole({ kind })}
			label={testId}
			testId={testId}
		>
			{content}
		</Popover>
	);
}

function Trigger(): ReactNode {
	return (
		<button type="button" data-testid="trigger">
			Trigger
		</button>
	);
}

// Runs the queued tasks: `toggle` events, and the focus fixup one frame later.
async function runTasks() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 50));
	});
}

describe('show before content effects: smoke tests', () => {
	it.each(layerKinds)('%s: content `autoFocus` takes focus when `isOpen` turns true', (kind) => {
		const view = render(
			<>
				<Trigger />
				<TestLayer kind={kind} isOpen={false} hasAutoFocus />
			</>,
		);
		screen.getByTestId('trigger').focus();

		view.rerender(
			<>
				<Trigger />
				<TestLayer kind={kind} isOpen hasAutoFocus />
			</>,
		);

		expect(screen.getByTestId('layer-target')).toHaveFocus();
	});

	it.each(['popover-dialog', 'dialog'] as const)(
		'%s that mounts open: content `autoFocus` takes focus',
		(kind) => {
			render(<TestLayer kind={kind} isOpen hasAutoFocus />);

			expect(screen.getByTestId('layer-target')).toHaveFocus();
		},
	);

	it.each(['popover-dialog', 'dialog'] as const)(
		'%s that mounts open in StrictMode: content `autoFocus` keeps focus',
		async (kind) => {
			render(
				<StrictMode>
					<TestLayer kind={kind} isOpen hasAutoFocus />
				</StrictMode>,
			);
			await runTasks();

			expect(isNativeElementOpen({ element: screen.getByTestId('layer') })).toBe(true);
			expect(screen.getByTestId('layer-target')).toHaveFocus();
		},
	);

	it('a popover that mounts open inside a dialog that mounts open: the popover is open and takes focus', () => {
		render(
			<TestLayer kind="dialog" isOpen testId="parent">
				<TestLayer kind="popover-dialog" isOpen testId="nested" />
			</TestLayer>,
		);

		expect(isNativeElementOpen({ element: screen.getByTestId('parent') })).toBe(true);
		expect(isNativeElementOpen({ element: screen.getByTestId('nested') })).toBe(true);
		expect(screen.getByTestId('nested-first')).toHaveFocus();
	});
});
