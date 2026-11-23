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
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.300'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	row: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.200'),
	},
	triggers: {
		display: 'flex',
		gap: token('space.1000'),
		paddingBlockEnd: token('space.1000'),
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

type TLayerName = 'first' | 'nested' | 'second';

/**
 * A controlled `manual` popover with `useManualLightDismiss`, anchored below (or beside) its
 * trigger. The hook only asks: `onClose` logs the request, and the owner closes the popover unless
 * it refuses. The trigger counts as inside, and its click toggles the popover.
 */
function AskFirstLayer({
	name,
	isRefusing,
	onLog,
	edge,
	hasOtherToggle = false,
	children,
}: {
	name: TLayerName;
	isRefusing: boolean;
	onLog: (entry: string) => void;
	edge: 'end' | 'inline-end';
	/**
	 * A second toggle for the layer, outside it and not its trigger. Its `aria-controls` lists the
	 * layer, so a press on it does not ask: its own click decides.
	 */
	hasOtherToggle?: boolean;
	children?: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const insideRefs = useMemo(() => [triggerRef], []);

	function onClose({ reason }: { reason: TPopoverCloseReason }) {
		onLog(`${name}:${reason}`);
		if (!isRefusing) {
			setIsOpen(false);
		}
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
		placement: edge === 'end' ? { edge: 'end' } : { axis: 'inline', edge: 'end' },
		isOpen,
	});

	return (
		<span>
			<button
				ref={triggerRef}
				type="button"
				data-testid={`${name}-trigger`}
				aria-expanded={isOpen}
				onClick={() => setIsOpen((previous) => !previous)}
			>
				Open {name}
			</button>
			<Popover
				ref={popoverRef}
				id={`${name}-popover`}
				mode="manual"
				isOpen={isOpen}
				role="dialog"
				label={`${name} layer`}
				testId={`${name}-layer`}
			>
				<div css={styles.surface}>
					<button type="button" data-testid={`${name}-button`}>
						Button in {name}
					</button>
					<span data-testid={`${name}-text`}>Text in {name}</span>
					{children}
				</div>
			</Popover>
			{hasOtherToggle ? (
				<button
					type="button"
					data-testid={`${name}-other-toggle`}
					// As a DS trigger: only while the layer is open (its host is in the DOM only then).
					aria-controls={isOpen ? `${name}-popover` : undefined}
					aria-expanded={isOpen}
					onClick={() => {
						onLog(`${name}:toggle`);
						setIsOpen((previous) => !previous);
					}}
				>
					Toggle {name} from elsewhere
				</button>
			) : null}
		</span>
	);
}

function RefuseSwitch({
	name,
	isRefusing,
	onChange,
}: {
	name: TLayerName;
	isRefusing: boolean;
	onChange: (isRefusing: boolean) => void;
}) {
	return (
		<button
			type="button"
			data-testid={`${name}-refuse`}
			aria-pressed={isRefusing}
			onClick={() => onChange(!isRefusing)}
		>
			Refuse close: {name}
		</button>
	);
}

/**
 * Test fixture: `manual` popovers with `useManualLightDismiss` and a controlled `isOpen` whose
 * owner can refuse a close. An outside press or Escape only asks (`onClose`); the popover hides only
 * when its owner sets `isOpen` to `false`.
 *
 * - `first` holds a nested layer, `nested` (open it from "Open nested" in `first`).
 * - `second` is a separate layer, to press its trigger while `first` is open.
 * - `first` also has a second toggle outside it ("Toggle first from elsewhere"), whose
 *   `aria-controls` lists the layer. The log lists its clicks as `first:toggle`.
 * - Each layer has a switch that makes its owner refuse a close.
 * - The log lists each close request as `<name>:<reason>`.
 * - "Outside field" takes focus on a press in every browser (Safari does not focus a button).
 *
 * See notes/decisions/wrappers-ask-first-close.md and
 * notes/decisions/manual-light-dismiss-escape-stacking.md.
 */
export default function TestingManualAskFirstClose(): ReactNode {
	const [refusing, setRefusing] = useState<Record<TLayerName, boolean>>({
		first: false,
		nested: false,
		second: false,
	});
	const [log, setLog] = useState<string[]>([]);

	function onLog(entry: string) {
		setLog((current) => [...current, entry]);
	}
	function getRefuseProps(name: TLayerName) {
		return {
			name,
			isRefusing: refusing[name],
			onChange: (isRefusing: boolean) =>
				setRefusing((current) => ({ ...current, [name]: isRefusing })),
		};
	}

	return (
		<div css={styles.root}>
			<div css={styles.row}>
				<RefuseSwitch {...getRefuseProps('first')} />
				<RefuseSwitch {...getRefuseProps('nested')} />
				<RefuseSwitch {...getRefuseProps('second')} />
			</div>
			<div css={styles.row}>
				<input aria-label="Outside field" data-testid="outside-field" />
				<span data-testid="outside-text">Outside text</span>
			</div>
			<div css={styles.triggers}>
				<AskFirstLayer
					name="first"
					isRefusing={refusing.first}
					onLog={onLog}
					edge="end"
					hasOtherToggle
				>
					<AskFirstLayer
						name="nested"
						isRefusing={refusing.nested}
						onLog={onLog}
						edge="inline-end"
					/>
				</AskFirstLayer>
				<AskFirstLayer name="second" isRefusing={refusing.second} onLog={onLog} edge="end" />
			</div>
			<p data-testid="close-log">{log.join(' ')}</p>
		</div>
	);
}
