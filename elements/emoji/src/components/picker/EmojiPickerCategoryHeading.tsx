/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { isMessagesKey } from '../../util/type-helpers';
import { messages } from '../i18n';
import { emojiCategoryTitle } from './styles';

export interface Props {
  id: string;
  title: string;
  className?: string;
}

export default class EmojiPickerCategoryHeading extends PureComponent<
  Props,
  {}
> {
  render() {
    const { id, title, className } = this.props;

    return (
      <div id={id} data-category-id={id} className={className}>
        <div css={emojiCategoryTitle}>
          {isMessagesKey(title) ? (
            <FormattedMessage {...messages[title]} />
          ) : (
            title
          )}
        </div>
      </div>
    );
  }
}
