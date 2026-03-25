/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popup } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	wrapper: {
		paddingBlock: token('space.800'),
		paddingInline: token('space.800'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
	},
	popoverContent: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	hintContent: {
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
});

/**
 * Test fixture for mode="hint" not closing mode="auto" popovers.
 * A hint popover (tooltip) should be able to appear without
 * closing an already-open auto popover.
 *
 * Layout: An auto popup with a hint trigger inside it.
 * The hint opens on hover without closing the auto popup.
 */
export default function TestingHintNoCloseAuto() {
	return (
		<div css={styles.wrapper}>
			{/* Auto popup */}
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button
						type="button"
						data-testid="auto-trigger"
					>
						Toggle auto popup
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Auto popup">
					<div data-testid="auto-popover" css={styles.popoverContent}>
						Auto popup content
						{/* Hint popup nested inside the auto popup */}
						<Popup
							placement={{ edge: 'end' }}
							onClose={() => {}}
							mode="hint"
						>
							<Popup.Trigger>
								<button type="button" data-testid="hint-trigger">
									Hover for hint
								</button>
							</Popup.Trigger>
							<Popup.Content role="tooltip" label="Hint tooltip">
								<div data-testid="hint-popover" css={styles.hintContent}>
									Hint tooltip content
								</div>
							</Popup.Content>
						</Popup>
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
