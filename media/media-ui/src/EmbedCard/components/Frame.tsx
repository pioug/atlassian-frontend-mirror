/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState } from 'react';
import { getIframeSandboxAttribute } from '../../util';

export interface FrameProps {
  url?: string;
  isTrusted?: boolean;
  testId?: string;
}

export const Frame = React.forwardRef<HTMLIFrameElement, FrameProps>(
  ({ url, isTrusted = false, testId }, iframeRef) => {
    const [isIframeLoaded, setIframeLoaded] = useState(false);
    if (!url) {
      return null;
    }

    return (
      <iframe
        ref={iframeRef}
        src={url}
        data-testid={`${testId}-frame`}
        data-iframe-loaded={isIframeLoaded}
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
        onLoad={() => setIframeLoaded(true)}
        sandbox={getIframeSandboxAttribute(isTrusted)}
      />
    );
  },
);
