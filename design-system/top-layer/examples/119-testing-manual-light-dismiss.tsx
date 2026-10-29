/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { useCloseOnUnclaimedEscape } from '@atlaskit/top-layer/page-surface/use-close-on-unclaimed-escape';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useManualLightDismiss } from '@atlaskit/top-layer/use-manual-light-dismiss';

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
	},
});

function ManualSurfaceExample({
	name,
	shouldClose = true,
}: {
	name: string;
	shouldClose?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(true);
	const [isSurfaceOpen, setIsSurfaceOpen] = useState(true);
	const popoverRef = useRef<HTMLDivElement>(null);
	const surfaceRef = useRef<HTMLDivElement>(null);
	useManualLightDismiss({ popoverRef, isOpen, onClose: () => setIsOpen(false) });
	useCloseOnUnclaimedEscape({
		isEnabled: isOpen && isSurfaceOpen,
		surfaceRef,
		shouldClose: () => shouldClose,
		onClose: () => setIsSurfaceOpen(false),
	});
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
			{isSurfaceOpen ? (
				<div ref={surfaceRef} data-testid={`${name}-surface`}>
					<button type="button">{name} surface</button>
				</div>
			) : null}
		</Popover>
	);
}

function EscapeOwnershipExamples() {
	const [scenario, setScenario] = useState<'closed' | 'siblings' | 'veto'>('closed');
	return (
		<div>
			<button type="button" onClick={() => setScenario('siblings')}>
				Open sibling surfaces
			</button>
			<button type="button" onClick={() => setScenario('veto')}>
				Open declining surface
			</button>
			{scenario === 'siblings' ? (
				<Fragment>
					<ManualSurfaceExample name="older" />
					<ManualSurfaceExample name="newer" />
				</Fragment>
			) : null}
			{scenario === 'veto' ? (
				<Popover
					isOpen
					role="dialog"
					label="Native ancestor"
					testId="native-ancestor"
					onClose={() => setScenario('closed')}
				>
					<button type="button">Native ancestor</button>
					<ManualSurfaceExample name="declining" shouldClose={false} />
				</Popover>
			) : null}
		</div>
	);
}

/**
 * Test fixture for `useManualLightDismiss`.
 *
 * A manual popover that uses the hook for Escape and click-outside dismiss.
 * Displays the close reason when dismissed.
 */
export default function TestingManualLightDismiss(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [closeReason, setCloseReason] = useState<string | null>(null);
	const [closeCount, setCloseCount] = useState(0);
	const popoverRef = useRef<HTMLDivElement>(null);

	useManualLightDismiss({
		popoverRef,
		isOpen,
		onClose: ({ reason }) => {
			setCloseReason(reason);
			setCloseCount((c) => c + 1);
			setIsOpen(false);
		},
	});

	return (
		<div css={styles.wrapper}>
			<button
				type="button"
				data-testid="trigger"
				onClick={() => {
					setIsOpen(true);
					setCloseReason(null);
				}}
			>
				Open popover
			</button>
			<Popover
				ref={popoverRef}
				role="dialog"
				mode="manual"
				isOpen={isOpen}
				label="Light dismiss popover"
			>
				<div data-testid="popover-content" css={styles.content}>
					Manual popover with manual light dismiss
					<button type="button" data-testid="inner-button">
						Inner button
					</button>
				</div>
			</Popover>
			<button type="button" data-testid="outside-button">
				Outside button
			</button>
			{closeReason && <div data-testid="close-reason">{closeReason}</div>}
			<div data-testid="close-count">{closeCount}</div>
			<EscapeOwnershipExamples />
		</div>
	);
}
