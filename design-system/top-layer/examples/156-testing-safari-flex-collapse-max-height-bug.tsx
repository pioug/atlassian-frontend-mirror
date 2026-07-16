/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, type RefObject, useLayoutEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Reproduction of the Safari top-layer flex-collapse bug (unfixed state) — the
 * visual counterpart to `154-testing-safari-flex-collapse-max-height`.
 *
 * It uses the Trello list structure (see inline comments) and forces the bug on
 * both surfaces by overriding `height` back to the UA default `fit-content`. That
 * restores the indefinite block size, so the `max-height: 100%` column's scroll
 * child collapses to ~0px on WebKit (the tinted body vanishes in the snapshot);
 * Chromium and Firefox are unaffected.
 *
 * Captures the broken baseline next to the healthy one — not a consumer pattern.
 * See `notes/decisions/safari-popover-flex-collapse.md`.
 */
const styles = cssMap({
	page: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
	},
	// `.m-list`: flex column, max-height:100%, no definite height (the precondition
	// for the WebKit collapse).
	column: {
		display: 'flex',
		flexDirection: 'column',
		boxSizing: 'border-box',
		width: '272px',
		maxHeight: '100%',
		justifyContent: 'space-between',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.bold'),
		borderRadius: token('radius.small'),
		backgroundColor: token('elevation.surface.overlay'),
	},
	header: {
		flex: 'none',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		fontWeight: token('font.weight.semibold'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border'),
	},
	// `.listCards`: the scroll child. `flex: 1 1 auto` + `overflow-y: auto` is the
	// combination that collapses on WebKit inside a fit-content ancestor.
	scrollBody: {
		display: 'flex',
		flex: '1 1 auto',
		flexDirection: 'column',
		minHeight: 0,
		marginBlockStart: token('space.0'),
		marginBlockEnd: token('space.0'),
		marginInlineStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		overflowX: 'hidden',
		overflowY: 'auto',
		listStyle: 'none',
		// Tinted so a collapse to `0px` is obvious in the snapshot.
		backgroundColor: token('color.background.neutral'),
	},
	row: {
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.050'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border'),
	},
	footer: {
		flex: 'none',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		borderBlockStartWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border'),
	},
});

/**
 * Reintroduces the bug by restoring the UA default `height: fit-content` (the
 * `Popover` reset overrides this with `height: auto`; the `Dialog` reset does not,
 * so for a dialog this only re-asserts the default). Applied imperatively because
 * the `xcss` prop is restricted to `backgroundColor`.
 */
function useReintroduceBug({
	elementRef,
	isOpen,
}: {
	elementRef: RefObject<HTMLElement | null>;
	isOpen: boolean;
}): void {
	useLayoutEffect(() => {
		const element = elementRef.current;
		if (!element || !isOpen) {
			return;
		}
		element.style.height = 'fit-content';
		return () => {
			element.style.removeProperty('height');
		};
	}, [elementRef, isOpen]);
}

/**
 * Trello-shaped list column: header, scrollable `<ol>`, footer. `scrollBodyTestId`
 * targets the `<ol>` whose height collapses to `0` when the bug is present.
 */
function ListColumn({
	label,
	scrollBodyTestId,
}: {
	label: string;
	scrollBodyTestId: string;
}): ReactNode {
	const rows = Array.from({ length: 30 }, (_unused, index) => index + 1);

	return (
		<div css={styles.column}>
			<div css={styles.header}>{`${label} header`}</div>
			<ol css={styles.scrollBody} data-testid={scrollBodyTestId}>
				{rows.map((rowNumber) => (
					<li key={rowNumber} css={styles.row}>
						{`Card ${rowNumber}`}
					</li>
				))}
			</ol>
			<div css={styles.footer}>+ Add a card</div>
		</div>
	);
}

function DialogVariant(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const dialogRef = useRef<HTMLDialogElement>(null);

	useReintroduceBug({ elementRef: dialogRef, isOpen });

	return (
		<div>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsOpen(true)}>
				Open dialog
			</button>

			<Dialog
				ref={dialogRef}
				onClose={() => setIsOpen(false)}
				isOpen={isOpen}
				label="Safari flex collapse dialog"
				testId="dialog"
			>
				<ListColumn label="Dialog" scrollBodyTestId="dialog-scroll-body" />
			</Dialog>
		</div>
	);
}

function PopoverVariant(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
	});

	useReintroduceBug({ elementRef: popoverRef, isOpen });

	return (
		<div>
			<button
				type="button"
				ref={triggerRef}
				data-testid="popover-trigger"
				onClick={() => setIsOpen(true)}
			>
				Open popover
			</button>

			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Safari flex collapse popover"
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<ListColumn label="Popover" scrollBodyTestId="popover-scroll-body" />
			</Popover>
		</div>
	);
}

export default function TestingSafariFlexCollapseMaxHeightBug(): ReactNode {
	return (
		<div css={styles.page}>
			<DialogVariant />
			<PopoverVariant />
		</div>
	);
}
