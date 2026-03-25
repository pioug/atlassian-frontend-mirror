/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popup } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	center: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for positioning verification.
 * Trigger is centered in the viewport so there is space in all directions.
 * Query `?axis=inline&edge=start` to change the placement at runtime.
 */
export default function TestingPopoverPositioning() {
	const params = new URLSearchParams(window.location.search);
	const axis = (params.get('axis') ?? 'block') as 'block' | 'inline';
	const edge = (params.get('edge') ?? 'end') as 'start' | 'end';

	return (
		<div css={styles.center}>
			<Popup placement={{ axis, edge }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button" data-testid="popover-trigger">
						Open
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Positioned popup">
					<div data-testid="popover-content" css={styles.content}>
						Positioned content
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
