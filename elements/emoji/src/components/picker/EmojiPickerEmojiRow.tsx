/** @jsx jsx */
import { type FC, memo } from 'react';
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';
import type { EmojiDescription, OnEmojiEvent } from '../../types';
import CachingEmoji from '../common/CachingEmoji';
import { emojiItem, emojiPickerRow } from './styles';
import type { VirtualItem as VirtualItemContext } from '@tanstack/react-virtual';
import { useEmojiPickerListContext } from '../../hooks/useEmojiPickerListContext';
import type { CategoryGroupKey } from './categories';
import { messages } from '../i18n';

export interface Props {
  category: CategoryGroupKey;
  emojis: EmojiDescription[];
  title: string;
  showDelete: boolean;
  onSelected?: OnEmojiEvent;
  onMouseMove?: OnEmojiEvent;
  onFocus?: OnEmojiEvent;
  onDelete?: OnEmojiEvent;
  virtualItemContext?: VirtualItemContext;
}

const EmojiPickerEmojiRow: FC<Props> = ({
  emojis,
  onSelected,
  onMouseMove,
  onFocus,
  title,
  showDelete,
  onDelete,
  virtualItemContext,
}) => {
  const { currentEmojisFocus, setEmojisFocus } = useEmojiPickerListContext();
  const rowIndex = virtualItemContext?.index || 0;
  const { formatMessage } = useIntl();
  const handleFocus: (index: number) => OnEmojiEvent<HTMLSpanElement> =
    (index) => (emojiId, emoji, event) => {
      setEmojisFocus({
        rowIndex,
        columnIndex: index,
      });
      onFocus && onFocus(emojiId, emoji, event);
    };
  return (
    <div css={emojiPickerRow} role="presentation">
      {emojis.map((emoji, index) => {
        const { shortName, id } = emoji;
        const key = id ? `${id}-${title}` : `${shortName}-${title}`;
        const focus =
          currentEmojisFocus.rowIndex === rowIndex &&
          currentEmojisFocus.columnIndex === index;
        return (
          <span
            css={emojiItem}
            key={key}
            role="gridcell"
            aria-colindex={index + 1} // aria-colindex is 1 based
          >
            <CachingEmoji
              emoji={emoji}
              selectOnHover={true}
              onSelected={onSelected}
              onMouseMove={onMouseMove}
              onFocus={handleFocus(index)}
              showDelete={showDelete}
              onDelete={onDelete}
              placeholderSize={24}
              data-focus-index={`${rowIndex}-${index}`}
              tabIndex={focus ? 0 : -1}
              aria-roledescription={formatMessage(
                messages.emojiButtonRoleDescription,
              )}
              shouldBeInteractive
            />
          </span>
        );
      })}
    </div>
  );
};

export default memo(EmojiPickerEmojiRow);
