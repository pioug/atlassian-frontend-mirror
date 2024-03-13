/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import { isMessagesKey } from '../../util/type-helpers';
import { messages } from '../i18n';
import { emojiCategoryTitle } from './styles';
import type { CategoryGroupKey } from './categories';

/**
 * Test id for wrapper Emoji Picker List div
 */
export const RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID =
  'render-emoji-picker-categorty-heading';

export interface Props {
  id: CategoryGroupKey;
  title: string;
  className?: string;
}

const EmojiPickerCategoryHeading = ({ id, title, className }: Props) => (
  <div
    id={id}
    data-category-id={id}
    className={className}
    data-testid={RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID}
    role="rowheader"
  >
    <div css={emojiCategoryTitle}>
      {isMessagesKey(title) ? <FormattedMessage {...messages[title]} /> : title}
    </div>
  </div>
);

export default EmojiPickerCategoryHeading;
