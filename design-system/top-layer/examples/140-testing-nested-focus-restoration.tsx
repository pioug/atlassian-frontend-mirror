import React, { type ReactNode, useCallback, useRef, useState } from 'react';

import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

// Fixture for nested-popover focus restoration tests.
//
// The native HTML Popover API only restores focus for the OUTERMOST
// `popover="auto"`. Nested popovers (one opening while another is already open)
// are shown with `shouldRestoreFocus: false`, so without an internal fallback
// they would close with focus stranded on `<body>` whenever the role moved focus
// into the popover (dialog, menu, listbox, alertdialog, tree, grid).
//
// Each scenario below pairs an outer dialog (to establish the nested context)
// with a second popover that has a focus-capturing role. The outer popover
// remains open while the nested one is dismissed via Escape; the focus must
// return to the nested trigger so the user can continue from where they were.

type TFocusCapturingRole = 'dialog' | 'menu' | 'listbox' | 'alertdialog' | 'tree' | 'grid';
type TInnerRole = TFocusCapturingRole | 'tooltip';

type TInnerProps = {
	role: TInnerRole;
	testIdPrefix: string;
};

function getInnerChildren(role: TInnerRole): ReactNode {
	if (role === 'menu') {
		return (
			<div role="none">
				<button type="button" role="menuitem" data-testid="inner-menuitem">
					Item 1
				</button>
			</div>
		);
	}
	if (role === 'listbox') {
		return (
			<div role="none">
				<div role="option" aria-selected={false} tabIndex={0} data-testid="inner-option">
					Option 1
				</div>
			</div>
		);
	}
	if (role === 'tree') {
		return (
			<div role="none">
				<div role="treeitem" aria-selected={false} tabIndex={0} data-testid="inner-treeitem">
					Node 1
				</div>
			</div>
		);
	}
	if (role === 'grid') {
		return (
			<div role="none">
				<div role="row">
					<div role="gridcell" tabIndex={0} data-testid="inner-gridcell">
						Cell 1
					</div>
				</div>
			</div>
		);
	}
	return (
		<button type="button" data-testid="inner-button">
			Inner button
		</button>
	);
}

function FocusCapturingNestedScenario({
	role,
	testIdPrefix,
}: {
	role: TFocusCapturingRole;
	testIdPrefix: string;
}): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'inline', edge: 'end' },
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role, isOpen, popoverId: popoverId })}
				type="button"
				data-testid={`${testIdPrefix}-trigger`}
			>
				Open {role}
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role={role}
				label={`Nested ${role}`}
			>
				<div data-testid={`${testIdPrefix}-popover`}>{getInnerChildren(role)}</div>
			</Popover>
		</>
	);
}

function TooltipNestedScenario({ testIdPrefix }: { testIdPrefix: string }): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'inline', edge: 'end' },
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={toggle}
				aria-describedby={popoverId}
				type="button"
				data-testid={`${testIdPrefix}-trigger`}
			>
				Open tooltip
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="tooltip"
				mode="hint"
				label="Nested tooltip"
			>
				<div data-testid={`${testIdPrefix}-popover`}>{getInnerChildren('tooltip')}</div>
			</Popover>
		</>
	);
}

function OuterDialog({
	innerScenarios,
}: {
	innerScenarios: ReadonlyArray<TInnerProps>;
}): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
	});

	return (
		<div>
			<button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
				type="button"
				data-testid="outer-trigger"
			>
				Open outer
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label="Outer dialog"
			>
				<div data-testid="outer-popover">
					Outer
					{innerScenarios.map((scenario) => {
						if (scenario.role === 'tooltip') {
							return (
								<TooltipNestedScenario
									key={scenario.testIdPrefix}
									testIdPrefix={scenario.testIdPrefix}
								/>
							);
						}
						return (
							<FocusCapturingNestedScenario
								key={scenario.testIdPrefix}
								role={scenario.role}
								testIdPrefix={scenario.testIdPrefix}
							/>
						);
					})}
				</div>
			</Popover>
		</div>
	);
}

export default function TestingNestedFocusRestoration(): ReactNode {
	return (
		<OuterDialog
			innerScenarios={[
				{ role: 'dialog', testIdPrefix: 'inner-dialog' },
				{ role: 'menu', testIdPrefix: 'inner-menu' },
				{ role: 'listbox', testIdPrefix: 'inner-listbox' },
				{ role: 'alertdialog', testIdPrefix: 'inner-alertdialog' },
				// tree and grid are accepted by Popover but `useInitialFocus`
				// does not yet implement focus-on-open for them, so the
				// restoration path has nothing to restore. They stay in the
				// fixture for completeness; the playwright matrix skips them.
				{ role: 'tree', testIdPrefix: 'inner-tree' },
				{ role: 'grid', testIdPrefix: 'inner-grid' },
				{ role: 'tooltip', testIdPrefix: 'inner-tooltip' },
			]}
		/>
	);
}
