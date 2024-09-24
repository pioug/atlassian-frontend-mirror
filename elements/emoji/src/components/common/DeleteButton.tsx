/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import Button, { type ButtonProps } from '@atlaskit/button/standard-button';
import CrossCircleIcon from '@atlaskit/icon/utility/migration/cross-circle';
import { token } from '@atlaskit/tokens';
import { N500 } from '@atlaskit/theme/colors';
import { deleteEmojiLabel } from '../../util/constants';
import { emojiDeleteButton, deleteButton } from './styles';
import { Box, xcss } from '@atlaskit/primitives';

/**
 * Test id for wrapper Emoji delete button
 */
export const RENDER_EMOJI_DELETE_BUTTON_TESTID = 'render-emoji-delete-button';

const boxWrapperStyle = xcss({
	width: '18px',
	height: '18px',
});

const DeleteButton = (props: ButtonProps) => (
	<span
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css={deleteButton}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={emojiDeleteButton}
		data-testid={RENDER_EMOJI_DELETE_BUTTON_TESTID}
	>
		<Button
			iconBefore={
				<Box xcss={boxWrapperStyle}>
					<CrossCircleIcon
						label={deleteEmojiLabel}
						color={token('color.text.subtle', N500)}
						LEGACY_size="small"
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
