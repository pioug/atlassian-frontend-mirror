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
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for `width="trigger"` behavior.
 * The trigger is an element with a known width so we can verify the
 * popover matches it.
 */
export default function TestingPopoverWidthTrigger(): JSX.Element {
	return (
		<div css={styles.wrapper}>
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<div data-testid="popover-trigger" role="button" tabIndex={0}>
						Wide trigger element
					</div>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Width test" width="trigger">
					<div data-testid="popover-content" css={styles.content}>
						This popover should match the trigger width
					</div>
				</Popup.Content>
			</Popup>
		</div>
	);
}
