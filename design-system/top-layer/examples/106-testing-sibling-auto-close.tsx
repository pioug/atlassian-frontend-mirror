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
		display: 'flex',
		gap: token('space.200'),
	},
});

/**
 * Test fixture for popover="auto" sibling auto-close behavior.
 * WCAG 2.4.3: When a second sibling popover opens, the first should
 * auto-close. This is native popover="auto" behavior: only one
 * non-ancestor auto popover can be open at a time.
 */
export default function TestingSiblingAutoClose(): JSX.Element {
	return (
		<div css={styles.wrapper}>
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button" data-testid="trigger-a">
						Open A
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Popup A">
					<div data-testid="popover-a">Popup A content</div>
				</Popup.Content>
			</Popup>

			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button" data-testid="trigger-b">
						Open B
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Popup B">
					<div data-testid="popover-b">Popup B content</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
