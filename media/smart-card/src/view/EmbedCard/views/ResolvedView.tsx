/** @jsx jsx */
import { jsx } from '@emotion/core';

import React from 'react';
import LinkGlyph from '@atlaskit/icon/glyph/link';

import { ExpandedFrame } from '../components/ExpandedFrame';
import { ImageIcon } from '../components/ImageIcon';
import { ContextViewModel } from '../types';
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
  preview?: { src: string; aspectRatio?: number };
  /** A flag that determines whether link source can be trusted in iframe **/
  isTrusted?: boolean;
  /** The optional click handler */
  onClick?: (evt: React.MouseEvent) => void;
  /** For testing purposes only. */
  testId?: string;

  inheritDimensions?: boolean;
}

export const EmbedCardResolvedView = React.forwardRef<
  HTMLIFrameElement,
  EmbedCardResolvedViewProps
>(
  (
    {
      link,
      context,
      onClick,
      isSelected,
      isFrameVisible,
      preview,
      title,
      isTrusted,
      testId = 'embed-card-resolved-view',
      inheritDimensions,
    },
    embedIframeRef,
  ) => {
    const iconFromContext = context?.icon;
    const src =
      typeof iconFromContext === 'string' ? iconFromContext : undefined;
    const text = title || context?.text;
    const linkGlyph = React.useMemo(
      () => (
        <LinkGlyph
          label="icon"
          size="small"
          testId="embed-card-fallback-icon"
        />
      ),
      [],
    );
    let icon = React.useMemo(() => {
      if (React.isValidElement(iconFromContext)) {
        return iconFromContext;
      }
      return <ImageIcon src={src} default={linkGlyph} />;
    }, [src, linkGlyph, iconFromContext]);

    return (
      <ExpandedFrame
        isSelected={isSelected}
        isFrameVisible={isFrameVisible}
        href={link}
        testId={testId}
        icon={icon}
        text={text}
        onClick={onClick}
        inheritDimensions={inheritDimensions}
      >
        <Frame
          url={preview?.src}
          isTrusted={isTrusted}
          testId={testId}
          ref={embedIframeRef}
        />
      </ExpandedFrame>
    );
  },
);
