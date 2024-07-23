/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import Button, { type ButtonProps } from '@atlaskit/button/standard-button';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { token } from '@atlaskit/tokens';
import { N500 } from '@atlaskit/theme/colors';
import { deleteEmojiLabel } from '../../util/constants';
import { emojiDeleteButton, deleteButton } from './styles';

/**
 * Test id for wrapper Emoji delete button
 */
export const RENDER_EMOJI_DELETE_BUTTON_TESTID = 'render-emoji-delete-button';

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
				<CrossCircleIcon
					label={deleteEmojiLabel}
					primaryColor={token('color.text.subtle', N500)}
					size="small"
				/>
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
