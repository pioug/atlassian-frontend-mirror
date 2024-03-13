/** @jsx jsx */
import { jsx } from '@emotion/react';
import type { EmojiDescription } from '../../types';
import CachingEmoji from './CachingEmoji';
import {
  emojiName,
  emojiShortName,
  preview,
  previewImg,
  previewText,
} from './styles';

type Props = {
  emoji: EmojiDescription;
};

export const EmojiPreviewComponent = ({ emoji }: Props) => {
  return (
    <div css={preview}>
      <span css={previewImg}>
        <CachingEmoji key={emoji.id || emoji.shortName} emoji={emoji} />
      </span>
      <div css={previewText}>
        {emoji.name && <div css={emojiName}>{emoji.name}</div>}
        <div css={emojiShortName}>{emoji.shortName}</div>
      </div>
    </div>
  );
};
