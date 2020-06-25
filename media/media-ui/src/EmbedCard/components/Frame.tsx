/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FC } from 'react';

export interface FrameProps {
  url?: string;
  testId?: string;
}

export const Frame: FC<FrameProps> = ({ url, testId }) => {
  if (!url) {
    return null;
  }

  return (
    <iframe
      src={url}
      data-testid={`${testId}-frame`}
      css={{
        border: 0,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '3px',
      }}
      allowFullScreen
      scrolling="yes"
      allow="autoplay; encrypted-media"
    />
  );
};
