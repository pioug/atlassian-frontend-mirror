/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { Popup } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

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
	counts: {
		display: 'flex',
		gap: token('space.200'),
		marginBlockEnd: token('space.200'),
	},
});

/**
 * Test fixture for animation callback lifecycle.
 * Exposes `onEnterFinish` and `onExitFinish` call counts via data attributes
 * so Playwright tests can assert that callbacks fire at the right point in the
 * animation lifecycle — after real CSS `transitionend` events in a real browser.
 */
export default function TestingAnimationCallbacks(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [enterCount, setEnterCount] = useState(0);
	const [exitCount, setExitCount] = useState(0);

	return (
		<div css={styles.wrapper}>
			<div css={styles.counts}>
				<Text>
					Enter count: <span data-testid="enter-count">{enterCount}</span>
				</Text>
				<Text>
					Exit count: <span data-testid="exit-count">{exitCount}</span>
				</Text>
			</div>
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
				<Popup.Content
					isOpen={isOpen}
					role="dialog"
					label="Animation callback test"
					animate={animation}
					onEnterFinish={() => setEnterCount((c) => c + 1)}
					onExitFinish={() => setExitCount((c) => c + 1)}
				>
					<PopupSurface>
						<div data-testid="popover-content" css={styles.content}>
							Animated content
						</div>
					</PopupSurface>
				</Popup.Content>
			</Popup>
		</div>
	);
}
