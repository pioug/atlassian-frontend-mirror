/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		border: `0 solid ${token('color.border')}`,
	},
	section: {
		borderBlockEnd: `0 solid ${token('color.border')}`,
		paddingBlockEnd: token('space.200'),
	},
});

/**
 * Test fixture for raw popover="manual" focus behavior.
 *
 * Uses raw HTML `popover` attribute (NOT the Popover React component) to test
 * the browser's native focus behavior without any custom focus management hooks.
 *
 * We use the native `autofocus` attribute (set via ref) instead of React's
 * `autoFocus` prop. React's autoFocus calls .focus() at mount time, not
 * at showPopover() time, so it doesn't participate in the browser's
 * "popover focusing steps" algorithm.
 *
 * Scenarios:
 * 1. Manual, no autofocus → focus stays on trigger
 * 2. Auto, no autofocus → focus stays on trigger
 * 3. Manual, with native autofocus → does focus move?
 * 4. Auto, with native autofocus → does focus move?
 * 5. Manual, hide via hidePopover() → does focus restore?
 * 6. Auto, hide via Escape → does focus restore?
 */
export default function TestingManualPopoverFocus() {
	return (
		<div css={styles.wrapper}>
			<ManualNoAutofocus />
			<AutoNoAutofocus />
			<ManualWithNativeAutofocus />
			<AutoWithNativeAutofocus />
			<ManualFocusRestore />
			<AutoFocusRestore />
		</div>
	);
}

function ManualNoAutofocus() {
	const popoverRef = useRef<HTMLDivElement>(null);

	return (
		<div css={styles.section}>
			<button
				type="button"
				data-testid="manual-no-af-trigger"
				onClick={() => {
					popoverRef.current?.showPopover();
				}}
			>
				Show manual (no autofocus)
			</button>
			<div
				ref={popoverRef}
				// @ts-expect-error -- popover attribute not yet in React types
				// eslint-disable-next-line react/no-unknown-property
				popover="manual"
				css={styles.content}
			>
				<span data-testid="manual-no-af-content">Manual popover — no autofocus</span>
				<br />
				<button type="button" data-testid="manual-no-af-inner">
					Inner button
				</button>
			</div>
		</div>
	);
}

function AutoNoAutofocus() {
	const popoverRef = useRef<HTMLDivElement>(null);

	return (
		<div css={styles.section}>
			<button
				type="button"
				data-testid="auto-no-af-trigger"
				onClick={() => {
					popoverRef.current?.showPopover();
				}}
			>
				Show auto (no autofocus)
			</button>
			<div
				ref={popoverRef}
				// @ts-expect-error -- popover attribute not yet in React types
				// eslint-disable-next-line react/no-unknown-property
				popover="auto"
				css={styles.content}
			>
				<span data-testid="auto-no-af-content">Auto popover — no autofocus</span>
				<br />
				<button type="button" data-testid="auto-no-af-inner">
					Inner button
				</button>
			</div>
		</div>
	);
}

/**
 * Uses a ref callback to set the native `autofocus` attribute directly
 * on the DOM element, bypassing React's autoFocus handling.
 */
function ManualWithNativeAutofocus() {
	const popoverRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		// Set native autofocus attribute directly on the DOM element
		innerRef.current?.setAttribute('autofocus', '');
	}, []);

	return (
		<div css={styles.section}>
			<button
				type="button"
				data-testid="manual-af-trigger"
				onClick={() => {
					popoverRef.current?.showPopover();
				}}
			>
				Show manual (with autofocus)
			</button>
			<div
				ref={popoverRef}
				// @ts-expect-error -- popover attribute not yet in React types
				// eslint-disable-next-line react/no-unknown-property
				popover="manual"
				css={styles.content}
			>
				<span data-testid="manual-af-content">Manual popover — with autofocus</span>
				<br />
				<button type="button" ref={innerRef} data-testid="manual-af-inner">
					Inner button (autofocus)
				</button>
			</div>
		</div>
	);
}

function AutoWithNativeAutofocus() {
	const popoverRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		innerRef.current?.setAttribute('autofocus', '');
	}, []);

	return (
		<div css={styles.section}>
			<button
				type="button"
				data-testid="auto-af-trigger"
				onClick={() => {
					popoverRef.current?.showPopover();
				}}
			>
				Show auto (with autofocus)
			</button>
			<div
				ref={popoverRef}
				// @ts-expect-error -- popover attribute not yet in React types
				// eslint-disable-next-line react/no-unknown-property
				popover="auto"
				css={styles.content}
			>
				<span data-testid="auto-af-content">Auto popover — with autofocus</span>
				<br />
				<button type="button" ref={innerRef} data-testid="auto-af-inner">
					Inner button (autofocus)
				</button>
			</div>
		</div>
	);
}

function ManualFocusRestore() {
	const popoverRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		innerRef.current?.setAttribute('autofocus', '');
	}, []);

	return (
		<div css={styles.section}>
			<button
				type="button"
				data-testid="manual-restore-trigger"
				onClick={() => {
					popoverRef.current?.showPopover();
				}}
			>
				Show manual (test restore)
			</button>
			<div
				ref={popoverRef}
				// @ts-expect-error -- popover attribute not yet in React types
				// eslint-disable-next-line react/no-unknown-property
				popover="manual"
				css={styles.content}
			>
				<span data-testid="manual-restore-content">
					Manual popover — focus restore test
				</span>
				<br />
				<button type="button" ref={innerRef} data-testid="manual-restore-inner">
					Inner button (autofocus)
				</button>
				<button
					type="button"
					data-testid="manual-restore-close"
					onClick={() => {
						popoverRef.current?.hidePopover();
					}}
				>
					Close via hidePopover()
				</button>
			</div>
		</div>
	);
}

function AutoFocusRestore() {
	const popoverRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		innerRef.current?.setAttribute('autofocus', '');
	}, []);

	return (
		<div css={styles.section}>
			<button
				type="button"
				data-testid="auto-restore-trigger"
				onClick={() => {
					popoverRef.current?.showPopover();
				}}
			>
				Show auto (test restore)
			</button>
			<div
				ref={popoverRef}
				// @ts-expect-error -- popover attribute not yet in React types
				// eslint-disable-next-line react/no-unknown-property
				popover="auto"
				css={styles.content}
			>
				<span data-testid="auto-restore-content">
					Auto popover — focus restore test
				</span>
				<br />
				<button type="button" ref={innerRef} data-testid="auto-restore-inner">
					Inner button (autofocus)
				</button>
			</div>
		</div>
	);
}
