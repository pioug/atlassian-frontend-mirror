/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import { MediaBorderGapFiller } from '@atlaskit/editor-common/ui';
import type { NumericalCardDimensions } from '@atlaskit/media-card';

export const MediaSingleNodeSelector = 'media-single-node';

const absoluteDivStyles = css({
  position: 'absolute',
  width: '100%',
  height: '100%',
});

const forcedDimensionsStyles = css({
  width: '100%',
  position: 'relative',
});

type MediaCardWrapperProps = {
  dimensions: NumericalCardDimensions;
  children: React.ReactNode;
  selected?: boolean;
  borderWidth?: number;
  onContextMenu?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

export const MediaCardWrapper = ({
  dimensions,
  children,
  selected,
  borderWidth = 0,
  onContextMenu,
}: MediaCardWrapperProps) => {
  const calculatedBorderWidth =
    selected && borderWidth > 0 ? borderWidth + 1 : borderWidth;
  return (
    <div
      data-testid="media-card-wrapper"
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className="media-card-wrapper"
      style={{
        borderColor: `var(--custom-palette-color)`,
        borderWidth: `${calculatedBorderWidth}px`,
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        borderStyle: 'solid',
        borderRadius: `${calculatedBorderWidth * 2}px`,
      }}
    >
      <div
        css={forcedDimensionsStyles}
        style={{
          paddingBottom: `${(dimensions.height / dimensions.width) * 100}%`,
        }}
        onContextMenuCapture={onContextMenu}
      >
        {borderWidth > 0 && (
          <MediaBorderGapFiller borderColor={`var(--custom-palette-color)`} />
        )}
        <div css={absoluteDivStyles}>{children}</div>
      </div>
    </div>
  );
};
