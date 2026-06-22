/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@compiled/react';
import Button, { type ButtonProps } from '@atlaskit/button/standard-button';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import { token } from '@atlaskit/tokens';
import { deleteEmojiLabel } from '../../util/constants';
import { emojiDeleteButton } from './styles';
import { Box } from '@atlaskit/primitives/compiled';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

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
	top: token('space.negative.100'),
	right: token('space.negative.100'),
	zIndex: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& span': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
	},
});

const refreshedDeleteButton = css({
	top: token('space.negative.050'),
	right: token('space.negative.050'),
});

/**
 * Test id for wrapper Emoji delete button
 */
export const RENDER_EMOJI_DELETE_BUTTON_TESTID = 'render-emoji-delete-button';

const DeleteButton = (props: ButtonProps): JSX.Element => {
	const isRefreshEnabled = expVal('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', false);

	return (
		<span
			css={[deleteButton, isRefreshEnabled && refreshedDeleteButton]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={emojiDeleteButton}
			data-testid={RENDER_EMOJI_DELETE_BUTTON_TESTID}
		>
			<Button
				iconBefore={
					<Box xcss={styles.boxWrapperStyle}>
						{isRefreshEnabled ? (
							<CrossCircleIcon label={deleteEmojiLabel} color={token('color.icon')} size="medium" />
						) : (
							<CrossCircleIcon
								label={deleteEmojiLabel}
								color={token('color.text.subtle')}
								size="small"
							/>
						)}
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
};

export default DeleteButton;
