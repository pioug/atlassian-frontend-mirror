/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@compiled/react';
import Button, { type ButtonProps } from '@atlaskit/button/standard-button';
import CrossCircleIcon from '@atlaskit/icon/core/migration/cross-circle';
import { token } from '@atlaskit/tokens';
import { N500 } from '@atlaskit/theme/colors';
import { deleteEmojiLabel } from '../../util/constants';
import { emojiDeleteButton } from './styles';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	boxWrapperStyle: {
		width: '18px',
		height: '18px',
	},
});

const deleteButton = css({
	// hide by default
	visibility: 'hidden',
	display: 'flex',
	position: 'absolute',
	top: token('space.negative.100', '-8px'),
	right: token('space.negative.100', '-8px'),
	zIndex: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& span': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
	},
});

/**
 * Test id for wrapper Emoji delete button
 */
export const RENDER_EMOJI_DELETE_BUTTON_TESTID = 'render-emoji-delete-button';

const DeleteButton = (props: ButtonProps) => (
	<span
		css={deleteButton}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={emojiDeleteButton}
		data-testid={RENDER_EMOJI_DELETE_BUTTON_TESTID}
	>
		<Button
			iconBefore={
				<Box xcss={styles.boxWrapperStyle}>
					<CrossCircleIcon
						label={deleteEmojiLabel}
						color={token('color.text.subtle', N500)}
						LEGACY_size="small"
						size="small"
					/>
				</Box>
			}
			onClick={props.onClick}
			// TODO: (from codemod) "link" and "subtle-link" appearances are only available in LinkButton, please either provide a href prop then migrate to LinkButton, or remove the appearance from the default button.
			appearance="subtle-link"
			spacing="none"
			testId="emoji-delete-button"
			tabIndex={-1}
		/>
	</span>
);

export default DeleteButton;
