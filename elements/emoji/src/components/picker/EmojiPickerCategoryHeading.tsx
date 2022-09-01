/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { isMessagesKey } from '../../util/type-helpers';
import { messages } from '../i18n';
import { emojiCategoryTitle } from './styles';

export interface Props {
  id: string;
  title: string;
  className?: string;
}

const EmojiPickerCategoryHeading: FC<Props> = ({ id, title, className }) => (
  <div id={id} data-category-id={id} className={className}>
    <div css={emojiCategoryTitle}>
      {isMessagesKey(title) ? <FormattedMessage {...messages[title]} /> : title}
    </div>
  </div>
);

export default EmojiPickerCategoryHeading;
