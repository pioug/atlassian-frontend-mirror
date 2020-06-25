/** @jsx jsx */
import { jsx } from '@emotion/core';

import { FC } from 'react';
import LinkGlyph from '@atlaskit/icon/glyph/link';

import { ExpandedFrame } from '../components/ExpandedFrame';
import { ImageIcon } from '../components/ImageIcon';
import { ContextViewModel } from '../../types';
import { Frame } from '../components/Frame';

export interface EmbedCardResolvedViewProps {
  /** The title of the link */
  title?: string;
  /** The context view model */
  context?: ContextViewModel;
  /** The link to display */
  link: string;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** will show the frame regardless of user interaction */
  isFrameVisible?: boolean;
  /** The src to be used for the `iframe` */
  preview?: string;
  /** The optional click handler */
  onClick?: (evt: React.MouseEvent) => void;
  /** For testing purposes only. */
  testId?: string;

  inheritDimensions?: boolean;
}

export const EmbedCardResolvedView: FC<EmbedCardResolvedViewProps> = ({
  link,
  context,
  onClick,
  isSelected,
  isFrameVisible,
  preview,
  title,
  testId = 'embed-card-resolved-view',
  inheritDimensions,
}) => {
  const src =
    context && context.icon
      ? typeof context.icon === 'string'
        ? context.icon
        : undefined
      : undefined;
  const text = title || (context && context.text);

  return (
    <ExpandedFrame
      isSelected={isSelected}
      isFrameVisible={isFrameVisible}
      href={link}
      testId={testId}
      icon={
        <ImageIcon
          src={src}
          default={<LinkGlyph label="icon" size="small" />}
        />
      }
      text={text}
      onClick={onClick}
      inheritDimensions={inheritDimensions}
    >
      <Frame url={preview} testId={testId} />
    </ExpandedFrame>
  );
};
