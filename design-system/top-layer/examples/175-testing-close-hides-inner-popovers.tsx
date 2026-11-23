/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useMemo, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useManualLightDismiss } from '@atlaskit/top-layer/use-manual-light-dismiss';

const styles = cssMap({
	root: {
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	surface: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
	},
});

/**
 * A controlled `manual` popover with `useManualLightDismiss`. The owner accepts every close request.
 */
function AskFirstLayer({
	name,
	isOpen,
	setIsOpen,
	onLog,
	children,
}: {
	name: string;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	onLog: (entry: string) => void;
	children: ReactNode;
}) {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const insideRefs = useMemo(() => [triggerRef], []);
	function onClose({ reason }: { reason: TPopoverCloseReason }) {
		onLog(`${name}:${reason}`);
		setIsOpen(false);
	}
	useManualLightDismiss({
		popoverRef,
		isOpen,
		additionalInsideElementRefs: insideRefs,
		onClose,
	});
	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'inline', edge: 'end' },
		isOpen,
	});
	return (
		<span>
			<button
				ref={triggerRef}
				type="button"
				data-testid={`${name}-trigger`}
				onClick={() => setIsOpen(!isOpen)}
			>
				Open {name}
			</button>
			<Popover
				ref={popoverRef}
				mode="manual"
				isOpen={isOpen}
				// As the DS wrappers do: a close that the owner did not ask for (the outer popover closed)
				// reaches it here.
				onClose={onClose}
				role="dialog"
				label={`${name} layer`}
				testId={`${name}-layer`}
				shouldAnimate
			>
				<div css={styles.surface}>{children}</div>
			</Popover>
		</span>
	);
}

/**
 * Test fixture: when an ask-first popover closes, the open popovers inside it close at once, as
 * inside an `auto` popover. A button in the inner popover closes only the outer one, as a menu item
 * in a nested popup that closes the whole menu.
 *
 * The log lists each close request as `<name>:<reason>`.
 *
 * See `notes/decisions/wrappers-ask-first-close.md`.
 */
export default function TestingCloseHidesInnerPopovers(): JSX.Element {
	const [log, setLog] = useState<string[]>([]);
	const [isOuterOpen, setIsOuterOpen] = useState(false);
	const [isInnerOpen, setIsInnerOpen] = useState(false);
	function onLog(entry: string) {
		setLog((current) => [...current, entry]);
	}

	return (
		<div css={styles.root}>
			<AskFirstLayer name="outer" isOpen={isOuterOpen} setIsOpen={setIsOuterOpen} onLog={onLog}>
				<AskFirstLayer name="inner" isOpen={isInnerOpen} setIsOpen={setIsInnerOpen} onLog={onLog}>
					<button type="button" data-testid="close-outer" onClick={() => setIsOuterOpen(false)}>
						Close the outer popover
					</button>
				</AskFirstLayer>
			</AskFirstLayer>
			<p data-testid="log">{log.join(' ')}</p>
		</div>
	);
}
