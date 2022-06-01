/** @jsx jsx */
import { jsx } from '@emotion/core';
import Button, {
  CustomThemeButtonProps,
} from '@atlaskit/button/custom-theme-button';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { FC } from 'react';
import { token } from '@atlaskit/tokens';
import { N500 } from '@atlaskit/theme/colors';
import { deleteEmojiLabel } from '../../util/constants';
import { emojiDeleteButton, deleteButton } from './styles';

const DeleteButton: FC<CustomThemeButtonProps> = (props) => (
  <span
    css={deleteButton}
    className={emojiDeleteButton}
    data-testid="emoji-delete-button"
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
    />
  </span>
);

export default DeleteButton;
