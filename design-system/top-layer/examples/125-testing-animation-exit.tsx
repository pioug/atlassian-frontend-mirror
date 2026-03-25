/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { Popup } from '@atlaskit/top-layer/popup';

const animation = slideAndFade();

const styles = cssMap({
	wrapper: {
		paddingBlock: token('space.800'),
		paddingInline: token('space.800'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for animation exit lifecycle.
 * Verifies that exit animation completes before the element is hidden from the DOM.
 * Includes a status indicator that reflects whether the popover is open or closed.
 */
export default function TestingAnimationExit() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div css={styles.wrapper}>
			<div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
			<Popup
				placement={{ edge: 'end' }}
				onClose={() => {
					setIsOpen(false);
				}}
			>
				<Popup.Trigger>
					<button
						type="button"
						data-testid="popover-trigger"
						onClick={() => setIsOpen((prev) => !prev)}
					>
						Toggle
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Animation exit test" animate={animation}>
					<div data-testid="popover-content" css={styles.content}>
						Animated content
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
