/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popup } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	tall: {
		height: '200vh',
		display: 'flex',
		flexDirection: 'column',
	},
	spacer: {
		flex: 1,
	},
	triggerWrapper: {
		display: 'flex',
		justifyContent: 'center',
		paddingBlockEnd: token('space.100'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		minHeight: '60px',
	},
});

/**
 * Test fixture for flip behavior.
 * The trigger is placed near the bottom of a tall container.
 * When the viewport is scrolled so the trigger is near the bottom edge,
 * the popover should flip to appear above the trigger.
 */
export default function TestingPopoverFlip(): JSX.Element {
	return (
		<div css={styles.tall}>
			<div css={styles.spacer} />
			<div data-testid="trigger-wrapper" css={styles.triggerWrapper}>
				<Popup placement={{ edge: 'end' }} onClose={() => {}}>
					<Popup.Trigger>
						<button type="button" data-testid="popover-trigger">
							Open
						</button>
					</Popup.Trigger>
					<Popup.Content role="dialog" label="Flip test">
						<div data-testid="popover-content" css={styles.content}>
							Should flip above trigger when near bottom
						</div>
					</Popup.Content>
				</Popup>
			</div>
		</div>
	);
}
