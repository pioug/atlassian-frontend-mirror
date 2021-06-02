import Button, {
  CustomThemeButtonProps,
} from '@atlaskit/button/custom-theme-button';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import React, { FC } from 'react';
import { N500 } from '@atlaskit/theme/colors';
import { deleteEmojiLabel } from '../../util/constants';
import * as styles from './styles';

const DeleteButton: FC<CustomThemeButtonProps> = (props) => (
  <span className={styles.deleteButton}>
    <Button
      iconBefore={
        <CrossCircleIcon
          label={deleteEmojiLabel}
          primaryColor={N500}
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
