/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';
import { Dialog } from '@atlaskit/top-layer/dialog-content';

const styles = cssMap({
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: token('space.400'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	card: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		paddingBlock: token('space.300'),
		paddingInline: token('space.300'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
	},
});

function CopyButton({
	hasNewContentOnTriggerClick,
	testId,
}: {
	hasNewContentOnTriggerClick?: boolean;
	testId: string;
}) {
	const [count, setCount] = useState(0);
	return (
		<Tooltip
			content={count > 0 ? `Copied! (${count})` : 'Copy to clipboard'}
			hasNewContentOnTriggerClick={hasNewContentOnTriggerClick}
			testId={testId}
		>
			{(tooltipProps) => (
				<Button {...tooltipProps} onClick={() => setCount((c) => c + 1)}>
					{hasNewContentOnTriggerClick ? 'Copy (hasNewContentOnTriggerClick)' : 'Copy (default)'}
				</Button>
			)}
		</Tooltip>
	);
}

/**
 * Demo for `hasNewContentOnTriggerClick` on the top-layer path. Use
 * `?featureFlag=platform-dst-top-layer-tooltip`. Pressing the default button
 * closes its tooltip. Pressing the other one keeps the tooltip open and shows
 * the new content. The dialog checks that Escape closes only the tooltip.
 */
export default function TestingStayOpenOnTriggerClick(): ReactNode {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	return (
		<div css={styles.wrapper}>
			<CopyButton testId="default" />
			<CopyButton testId="stay-open" hasNewContentOnTriggerClick />
			<Button onClick={() => setIsDialogOpen(true)} testId="open-dialog">
				Open dialog
			</Button>
			<Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} label="Dialog">
				<div css={styles.card}>
					<CopyButton testId="dialog-stay-open" hasNewContentOnTriggerClick />
					<Button onClick={() => setIsDialogOpen(false)}>Close</Button>
				</div>
			</Dialog>
		</div>
	);
}
