/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type KeyboardEvent as ReactKeyboardEvent,
	type ReactNode,
	useMemo,
	useRef,
	useState,
} from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useManualLightDismiss } from '@atlaskit/top-layer/use-manual-light-dismiss';

const styles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
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

type TLayerName = 'dialog' | 'manual';

/**
 * Three controls with their own Escape handler, as a control that undoes its own state on Escape
 * (for example an inline edit that leaves edit mode):
 *
 * - `prevent`: takes the Escape with `preventDefault()`.
 * - `stop`: hides the Escape with `stopPropagation()`. This is not a claim.
 * - `read`: sees the Escape and leaves it to the layers.
 *
 * Each handler calls `onEscape` for the Escapes it sees.
 */
function Controls({ name, onEscape }: { name: TLayerName; onEscape: () => void }) {
	function onKeyDown(event: ReactKeyboardEvent, action: 'prevent' | 'stop' | 'read') {
		if (event.key !== 'Escape') {
			return;
		}
		onEscape();
		if (action === 'prevent') {
			event.preventDefault();
		}
		if (action === 'stop') {
			event.stopPropagation();
		}
	}
	return (
		<div css={styles.surface}>
			<button
				type="button"
				data-testid={`${name}-prevent`}
				onKeyDown={(event) => onKeyDown(event, 'prevent')}
			>
				Prevents Escape
			</button>
			<button
				type="button"
				data-testid={`${name}-stop`}
				onKeyDown={(event) => onKeyDown(event, 'stop')}
			>
				Stops Escape
			</button>
			<button
				type="button"
				data-testid={`${name}-read`}
				onKeyDown={(event) => onKeyDown(event, 'read')}
			>
				Reads Escape
			</button>
		</div>
	);
}

/**
 * A controlled `manual` popover with `useManualLightDismiss`, as `Popup` renders it.
 */
function ManualPopoverLayer({
	onCloseRequest,
	onEscape,
}: {
	onCloseRequest: () => void;
	onEscape: () => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const insideRefs = useMemo(() => [triggerRef], []);
	function onClose() {
		onCloseRequest();
		setIsOpen(false);
	}

	useManualLightDismiss({
		popoverRef,
		isOpen,
		additionalInsideElementRefs: insideRefs,
		onClose,
	});
	useAnchoredPopover({ anchorRef: triggerRef, popoverRef, placement: { edge: 'end' }, isOpen });

	return (
		<span>
			<button
				ref={triggerRef}
				type="button"
				data-testid="manual-trigger"
				aria-expanded={isOpen}
				onClick={() => setIsOpen((previous) => !previous)}
			>
				Open manual popover
			</button>
			<Popover
				ref={popoverRef}
				mode="manual"
				isOpen={isOpen}
				onClose={onClose}
				role="dialog"
				label="Manual popover"
				testId="manual-layer"
			>
				<Controls name="manual" onEscape={onEscape} />
			</Popover>
		</span>
	);
}

/**
 * Test fixture: a `Dialog` and a `manual` popover with `useManualLightDismiss`. Each holds controls whose Escape handler calls `preventDefault()`, calls `stopPropagation()`, or
 * only reads the Escape (see `Controls`). Each layer closes when asked. `<name>-close-count` counts
 * the asks, and `<name>-handler-count` counts the Escapes the handlers saw.
 *
 * See notes/decisions/consumed-escape.md.
 */
export default function TestingConsumedEscape(): ReactNode {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [closeCounts, setCloseCounts] = useState<Record<TLayerName, number>>({
		dialog: 0,
		manual: 0,
	});
	const [handlerCounts, setHandlerCounts] = useState<Record<TLayerName, number>>({
		dialog: 0,
		manual: 0,
	});
	function countClose(name: TLayerName) {
		setCloseCounts((current) => ({ ...current, [name]: current[name] + 1 }));
	}
	function countHandlerEscape(name: TLayerName) {
		setHandlerCounts((current) => ({ ...current, [name]: current[name] + 1 }));
	}

	return (
		<div css={styles.root}>
			<button type="button" data-testid="dialog-trigger" onClick={() => setIsDialogOpen(true)}>
				Open dialog
			</button>
			<ManualPopoverLayer
				onCloseRequest={() => countClose('manual')}
				onEscape={() => countHandlerEscape('manual')}
			/>
			{(['dialog', 'manual'] as const).map((name) => (
				<div key={name}>
					{name} closes: <output data-testid={`${name}-close-count`}>{closeCounts[name]}</output>,
					handler Escapes:{' '}
					<output data-testid={`${name}-handler-count`}>{handlerCounts[name]}</output>
				</div>
			))}
			<Dialog
				isOpen={isDialogOpen}
				onClose={() => {
					countClose('dialog');
					setIsDialogOpen(false);
				}}
				label="Dialog with Escape handlers"
				testId="dialog-layer"
			>
				<Controls name="dialog" onEscape={() => countHandlerEscape('dialog')} />
			</Dialog>
		</div>
	);
}
