/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

const styles = cssMap({
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: token('space.400'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	// Generous padding, so a pointer nudge that stays inside the trigger can still
	// cross the boundary between the padding box and the label element. That
	// crossing is what fires a second `mouseover` on the trigger.
	trigger: {
		paddingBlock: token('space.300'),
		paddingInline: token('space.300'),
		font: token('font.body'),
	},
	away: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		font: token('font.body'),
	},
});

/**
 * Test fixture for the `Tooltip` pointer dismissal contract on the top-layer
 * path: a press dismisses the tooltip on pointerup, and it stays dismissed until
 * the pointer re-enters the trigger. Asserted in
 * `__tests__/playwright/ff-testing/platform-dst-top-layer-tooltip/pointer-dismiss.spec.tsx`.
 */
export default function TestingTopLayerPointerDismiss(): ReactNode {
	return (
		<div css={styles.wrapper}>
			<Tooltip content="This is a tooltip" testId="tooltip">
				{({ testId, ...tooltipProps }) => (
					<button {...tooltipProps} data-testid={testId} type="button" css={styles.trigger}>
						<span data-testid="trigger-label">Press me</span>
					</button>
				)}
			</Tooltip>
			<button type="button" data-testid="away" css={styles.away}>
				Somewhere else
			</button>
		</div>
	);
}
