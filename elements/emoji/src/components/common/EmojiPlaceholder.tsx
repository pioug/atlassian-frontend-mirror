/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  placeholder,
  placeholderContainer,
  placeholderContainerAnimated,
} from './styles';
import { defaultEmojiHeight } from '../../util/constants';
import { EmojiImageRepresentation } from '../../types';

export interface Props {
  shortName: string;
  size?: number;
  showTooltip?: boolean;
  representation?: EmojiImageRepresentation;
  loading?: boolean;
}

const EmojiPlaceholder = (props: Props) => {
  const {
    shortName,
    size = defaultEmojiHeight,
    showTooltip,
    representation,
    loading = false,
  } = props;

  let scaledWidth;
  let scaledHeight;
  if (representation && size) {
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
    minWidth: `${width}px`,
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <span
      data-testid={`emoji-placeholder-${shortName}`}
      aria-busy={loading}
      aria-label={shortName}
      className={placeholder}
      css={
        loading
          ? [placeholderContainer, placeholderContainerAnimated]
          : placeholderContainer
      }
      style={style}
      title={showTooltip ? shortName : ''}
    />
  );
};

export default EmojiPlaceholder;
