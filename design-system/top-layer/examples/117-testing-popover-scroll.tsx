/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popup } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	scrollContainer: {
		height: '300px',
		overflow: 'auto',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	spacerSmall: {
		height: '100px',
	},
	spacerLarge: {
		height: '600px',
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for scroll behavior.
 * The popup is inside a scrollable container.
 * Scrolling should NOT close the popover.
 */
export default function TestingPopoverScroll() {
	return (
		<div data-testid="scroll-container" css={styles.scrollContainer}>
			<div css={styles.spacerSmall} />
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button" data-testid="popover-trigger">
						Open
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Scroll test">
					<div data-testid="popover-content" css={styles.content}>
						Popover content in scrollable container
					</div>
				</Popup.Content>
			</Popup>
			<div css={styles.spacerLarge} />
		</div>
	);
}
