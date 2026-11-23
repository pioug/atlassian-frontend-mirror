/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useRef, useState } from 'react';

import { jsx } from '@compiled/react';
import { bindAll } from 'bind-event-listener';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useManualLightDismiss } from '@atlaskit/top-layer/use-manual-light-dismiss';

const styles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.300'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	row: {
		display: 'flex',
		gap: token('space.400'),
	},
	surface: {
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	blanket: {
		position: 'fixed',
		insetBlock: 0,
		insetInline: 0,
		borderStyle: 'none',
		backgroundColor: token('color.background.neutral'),
	},
});

/**
 * A controlled `manual` popover with `useManualLightDismiss`, anchored below its trigger. The owner
 * accepts every close request.
 */
function useAskFirstPopover({ onLog }: { onLog: (entry: string) => void }) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const insideRefs = useMemo(() => [triggerRef], []);
	useManualLightDismiss({
		popoverRef,
		isOpen,
		additionalInsideElementRefs: insideRefs,
		onClose: ({ reason }) => {
			onLog(`close:${reason}`);
			setIsOpen(false);
		},
	});
	useAnchoredPopover({ anchorRef: triggerRef, popoverRef, placement: { edge: 'end' }, isOpen });
	return { isOpen, setIsOpen, triggerRef, popoverRef };
}

/**
 * Test fixture: a press outside an ask-first popover asks its owner after the press's own `click`.
 *
 * - **Blanket:** while the popover is open, its owner renders a blanket over the page, and removes
 *   it when the popover closes. A press on the blanket must not click the button under it
 *   (click-through), and the `click` must reach the elements around the blanket, while the popover
 *   is still open (as a form that checks, in a capture `click` listener, whether its picker is
 *   open).
 * - **One open popover:** two popovers that share one "open" state. A press on the second trigger
 *   while the first popover is open closes the first one and opens the second one.
 *
 * The log lists the events in order.
 *
 * See `notes/decisions/wrappers-ask-first-close.md`.
 */
export default function TestingOutsidePressClickThrough(): JSX.Element {
	const [log, setLog] = useState<string[]>([]);
	function onLog(entry: string) {
		setLog((current) => [...current, entry]);
	}

	const blanketPopover = useAskFirstPopover({ onLog });
	const blanketPopoverRef = blanketPopover.popoverRef;
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Native listeners around the blanket, as the page around it would have.
	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) {
			return;
		}
		return bindAll(wrapper, [
			{
				type: 'click',
				listener: () =>
					onLog(
						`capture:${blanketPopoverRef.current?.matches(':popover-open') ? 'open' : 'closed'}`,
					),
				options: { capture: true },
			},
			{ type: 'click', listener: () => onLog('around:click') },
		]);
	}, [blanketPopoverRef]);

	const [openName, setOpenName] = useState<'first' | 'second' | null>(null);

	return (
		<div css={styles.root}>
			<div css={styles.row}>
				<button type="button" data-testid="under" onClick={() => onLog('under:click')}>
					Under the blanket
				</button>
				<div ref={wrapperRef}>
					<button
						ref={blanketPopover.triggerRef}
						type="button"
						data-testid="blanket-trigger"
						onClick={() => blanketPopover.setIsOpen((current) => !current)}
					>
						Open with blanket
					</button>
					{blanketPopover.isOpen ? (
						<button
							type="button"
							aria-label="Blanket"
							tabIndex={-1}
							data-testid="blanket"
							css={styles.blanket}
							onClick={() => onLog('blanket:click')}
						/>
					) : null}
					<Popover
						ref={blanketPopover.popoverRef}
						mode="manual"
						isOpen={blanketPopover.isOpen}
						role="dialog"
						label="Popover with blanket"
						testId="blanket-layer"
					>
						<div css={styles.surface}>Popover with a blanket</div>
					</Popover>
				</div>
			</div>
			<SharedOpenPopovers openName={openName} setOpenName={setOpenName} onLog={onLog} />
			<p data-testid="log">{log.join(' ')}</p>
		</div>
	);
}

function SharedOpenPopover({
	name,
	openName,
	setOpenName,
	onLog,
}: {
	name: 'first' | 'second';
	openName: 'first' | 'second' | null;
	setOpenName: (name: 'first' | 'second' | null) => void;
	onLog: (entry: string) => void;
}) {
	const isOpen = openName === name;
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const insideRefs = useMemo(() => [triggerRef], []);
	useManualLightDismiss({
		popoverRef,
		isOpen,
		additionalInsideElementRefs: insideRefs,
		onClose: ({ reason }) => {
			onLog(`${name}:${reason}`);
			// One piece of state for all the popovers, as Jira `QuickAddItemsCompact` does.
			setOpenName(null);
		},
	});
	useAnchoredPopover({ anchorRef: triggerRef, popoverRef, placement: { edge: 'end' }, isOpen });
	return (
		<span>
			<button
				ref={triggerRef}
				type="button"
				data-testid={`${name}-trigger`}
				onClick={() => setOpenName(isOpen ? null : name)}
			>
				Open {name}
			</button>
			<Popover
				ref={popoverRef}
				mode="manual"
				isOpen={isOpen}
				role="dialog"
				label={`${name} popover`}
				testId={`${name}-layer`}
			>
				<div css={styles.surface}>Popover {name}</div>
			</Popover>
		</span>
	);
}

function SharedOpenPopovers({
	openName,
	setOpenName,
	onLog,
}: {
	openName: 'first' | 'second' | null;
	setOpenName: (name: 'first' | 'second' | null) => void;
	onLog: (entry: string) => void;
}) {
	return (
		<div css={styles.row}>
			<SharedOpenPopover name="first" openName={openName} setOpenName={setOpenName} onLog={onLog} />
			<SharedOpenPopover
				name="second"
				openName={openName}
				setOpenName={setOpenName}
				onLog={onLog}
			/>
		</div>
	);
}
