/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popup } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	wrapper: {
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for rapid toggle behavior.
 * The open-count indicator tracks how many times the trigger has been clicked.
 * After rapid toggling, there should be at most one visible popover (or zero).
 */
export default function TestingPopoverRapidToggle() {
	const [clickCount, setClickCount] = useState(0);

	return (
		<div css={styles.wrapper}>
			<div data-testid="click-count">{clickCount}</div>
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button
						type="button"
						data-testid="popover-trigger"
						onClick={() => setClickCount((c) => c + 1)}
					>
						Toggle
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Rapid toggle test">
					<div data-testid="popover-content" css={styles.content}>
						Popover content
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
