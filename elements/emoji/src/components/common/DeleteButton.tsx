/** @jsx jsx */
import { FC } from 'react';
import { jsx } from '@emotion/react';
import Button, {
  CustomThemeButtonProps,
} from '@atlaskit/button/custom-theme-button';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { token } from '@atlaskit/tokens';
import { N500 } from '@atlaskit/theme/colors';
import { deleteEmojiLabel } from '../../util/constants';
import { emojiDeleteButton, deleteButton } from './styles';

/**
 * Test id for wrapper Emoji delete button
 */
export const RENDER_EMOJI_DELETE_BUTTON_TESTID = 'render-emoji-delete-button';

const DeleteButton: FC<CustomThemeButtonProps> = (props) => (
  <span
    css={deleteButton}
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
      appearance="subtle-link"
      spacing="none"
      testId="emoji-delete-button"
    />
  </span>
);

export default DeleteButton;
