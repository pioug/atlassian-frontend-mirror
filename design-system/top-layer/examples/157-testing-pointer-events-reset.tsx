/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

const styles = cssMap({
	board: {
		display: 'grid',
		gap: token('space.200'),
		maxWidth: '360px',
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.large'),
	},
	card: {
		position: 'relative',
		minHeight: '120px',
		backgroundColor: token('elevation.surface.raised'),
		borderRadius: token('radius.medium'),
		boxShadow: token('elevation.shadow.raised'),
	},
	cardSurface: {
		position: 'absolute',
		insetBlockStart: token('space.0'),
		insetInlineEnd: token('space.0'),
		insetBlockEnd: token('space.0'),
		insetInlineStart: token('space.0'),
		width: '100%',
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		backgroundColor: 'transparent',
		border: 'none',
		borderRadius: token('radius.medium'),
		color: token('color.text'),
		cursor: 'pointer',
		textAlign: 'start',
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: token('space.100'),
	},
	controls: {
		position: 'absolute',
		insetBlockStart: token('space.100'),
		insetInlineEnd: token('space.100'),
		// The card surface stays interactive through this overlaid controls layer.
		pointerEvents: 'none',
	},
	triggerWrapper: {
		// Only the trigger is wrapped, so the sibling top-layer surface needs its own reset.
		pointerEvents: 'auto',
	},
	popoverContent: {
		minWidth: '220px',
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	dialogSurface: {
		width: '360px',
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
	},
});

type TCardSurfaceProps = {
	cardClickCount: number;
	issueKey: string;
	onClick: () => void;
	surfaceTestId: string;
	title: string;
};

function CardSurface({
	cardClickCount,
	issueKey,
	onClick,
	surfaceTestId,
	title,
}: TCardSurfaceProps): ReactNode {
	return (
		<button type="button" css={styles.cardSurface} data-testid={surfaceTestId} onClick={onClick}>
			<span css={styles.cardContent}>
				<Lozenge appearance="inprogress">IN PROGRESS</Lozenge>
				<Text weight="semibold">{title}</Text>
				<Text size="small">
					{issueKey} · Card opened {cardClickCount} times
				</Text>
			</span>
		</button>
	);
}

function PopoverCard(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [cardClickCount, setCardClickCount] = useState(0);
	const [actionCount, setActionCount] = useState(0);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'inline', edge: 'end' },
		isOpen,
	});

	const close = useCallback(() => setIsOpen(false), []);

	return (
		<div css={styles.card}>
			<CardSurface
				cardClickCount={cardClickCount}
				issueKey="DSP-25685"
				onClick={() => setCardClickCount((count) => count + 1)}
				surfaceTestId="popover-card-surface"
				title="Make top-layer popovers interactive"
			/>
			<div css={styles.controls}>
				<div css={styles.triggerWrapper}>
					<Button
						ref={triggerRef}
						appearance="subtle"
						onClick={() => setIsOpen((open) => !open)}
						{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId })}
					>
						More actions
					</Button>
				</div>
				<Popover
					ref={popoverRef}
					id={popoverId}
					role="dialog"
					label="Card actions"
					isOpen={isOpen}
					onClose={close}
				>
					<PopoverSurface>
						<div css={styles.popoverContent}>
							<Stack space="space.150">
								<Heading size="xsmall">Card actions</Heading>
								<button
									type="button"
									data-testid="popover-action"
									onClick={() => setActionCount((count) => count + 1)}
								>
									Add flag
								</button>
								<Text size="small">Action selected {actionCount} times</Text>
							</Stack>
						</div>
					</PopoverSurface>
				</Popover>
			</div>
		</div>
	);
}

function DialogCard(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [cardClickCount, setCardClickCount] = useState(0);
	const [actionCount, setActionCount] = useState(0);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<div css={styles.card}>
			<CardSurface
				cardClickCount={cardClickCount}
				issueKey="DSP-25686"
				onClick={() => setCardClickCount((count) => count + 1)}
				surfaceTestId="dialog-card-surface"
				title="Make top-layer dialogs interactive"
			/>
			<div css={styles.controls}>
				<div css={styles.triggerWrapper}>
					<Button appearance="subtle" onClick={() => setIsOpen(true)} aria-haspopup="dialog">
						Open details
					</Button>
				</div>
				<Dialog isOpen={isOpen} onClose={close} labelledBy="dialog-title">
					<div css={styles.dialogSurface}>
						<Stack space="space.200">
							<Heading id="dialog-title" size="medium">
								Issue details
							</Heading>
							<Text>The dialog is a sibling of its trigger wrapper.</Text>
							<Inline space="space.100" alignInline="end">
								<Button appearance="subtle" onClick={close}>
									Close
								</Button>
								<button
									type="button"
									data-testid="dialog-action"
									onClick={() => setActionCount((count) => count + 1)}
								>
									Assign to me
								</button>
							</Inline>
							<Text size="small">Action selected {actionCount} times</Text>
						</Stack>
					</div>
				</Dialog>
			</div>
		</div>
	);
}

export default function TestingPointerEventsReset(): ReactNode {
	return (
		<div css={styles.board}>
			<Stack space="space.200">
				<Heading size="small">To do</Heading>
				<PopoverCard />
				<DialogCard />
			</Stack>
		</div>
	);
}
