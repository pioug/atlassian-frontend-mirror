/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FC, useMemo, useState } from 'react';
import { EmojiId, EmojiImageRepresentation } from '../../types';
import {
  emojiContainer,
  emojiImage,
  emojiMainStyle,
  emojiNodeStyles,
  emojiStyles,
} from './styles';

import { defaultEmojiHeight } from '../../util/constants';

type EmojiImageType = {
  emojiId: EmojiId;
  imageUrl: string;
  showImageBeforeLoad?: boolean;
  maxSize?: number;
  representation?: EmojiImageRepresentation;
  showTooltip?: boolean;
  onImageLoadError?: () => void;
};

export const EmojiImage: FC<EmojiImageType> = (props) => {
  const {
    maxSize = defaultEmojiHeight,
    representation,
    showTooltip,
    imageUrl,
    showImageBeforeLoad,
    emojiId,
    onImageLoadError,
  } = props;
  const { shortName } = emojiId;
  const [validImage, setValidImage] = useState(false);

  const imageSize = useMemo(() => {
    if (representation) {
      return {
        width: maxSize / (representation.height * representation.width),
        height: maxSize,
      };
    }

    return {
      width: maxSize,
      height: maxSize,
    };
  }, [maxSize, representation]);

  const style = {
    minWidth: `${imageSize.width}px`,
    width: `${imageSize.width}px`,
    height: `${imageSize.height}px`,
  };

  const handleImageLoad = () => setValidImage(true);

  const handleImageLoadError = () => {
    setValidImage(false);
    if (onImageLoadError) {
      onImageLoadError();
    }
  };

  const visibility = useMemo(() => {
    return showImageBeforeLoad || validImage ? 'initial' : 'hidden';
  }, [validImage, showImageBeforeLoad]);

  return (
    <span
      data-testid={`emoji-image-${shortName}`}
      aria-label={shortName}
      className={`${emojiMainStyle} ${emojiNodeStyles} ${emojiImage}`}
      style={style}
      css={[emojiContainer, emojiStyles]}
      title={showTooltip ? shortName : ''}
    >
      <img
        className="emoji"
        alt={shortName}
        onLoad={() => handleImageLoad()}
        onError={() => handleImageLoadError()}
        src={imageUrl}
        style={{ objectFit: 'contain', visibility }}
        width={imageSize.width}
        height={imageSize.height}
        //@ts-ignore
        loading="lazy"
      />
    </span>
  );
};
