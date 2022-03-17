/** @jsx jsx */
import { jsx } from '@emotion/core';
import { placeholder, placeholderContainer } from './styles';
import { defaultEmojiHeight } from '../../util/constants';
import { EmojiImageRepresentation } from '../../types';
import {
  isImageRepresentation,
  isMediaRepresentation,
} from '../../util/type-helpers';

export interface Props {
  shortName: string;
  size?: number;
  showTooltip?: boolean;
  representation?: EmojiImageRepresentation;
}

const EmojiPlaceholder = (props: Props) => {
  const {
    shortName,
    size = defaultEmojiHeight,
    showTooltip,
    representation,
  } = props;

  let scaledWidth;
  let scaledHeight;
  if (
    representation &&
    size &&
    (isImageRepresentation(representation) ||
      isMediaRepresentation(representation))
  ) {
    const width = representation.width;
    const height = representation.height;
    if (width && height) {
      scaledWidth = (size / height) * width;
      scaledHeight = size;
    }
  }
  const width: number = scaledWidth || size;
  const height: number = scaledHeight || size;
  const style = {
    fill: 'f7f7f7',
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <span
      aria-label={shortName}
      className={placeholder}
      css={placeholderContainer}
      style={style}
      title={showTooltip ? shortName : ''}
    />
  );
};

export default EmojiPlaceholder;
