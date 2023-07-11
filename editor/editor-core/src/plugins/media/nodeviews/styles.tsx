/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { NumericalCardDimensions } from '@atlaskit/media-card';
import { IMAGE_AND_BORDER_ADJUSTMENT } from '@atlaskit/editor-common/ui';

export const MediaInlineNodeSelector = 'media-inline-node';
export const MediaSingleNodeSelector = 'media-single-node';

export const figureWrapper = css`
  margin: 0;
`;

const absoluteDiv = css`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const forcedDimensions = css`
  width: 100%;
  position: relative;
`;

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
      style={{
        borderColor: `var(--custom-palette-color)`,
        borderWidth: `${calculatedBorderWidth}px`,
        borderStyle: 'solid',
        borderRadius: `${calculatedBorderWidth * 2}px`,
        width:
          calculatedBorderWidth > 0
            ? `calc(100% - ${IMAGE_AND_BORDER_ADJUSTMENT}px)`
            : undefined,
        height:
          calculatedBorderWidth > 0
            ? `calc(100% - ${IMAGE_AND_BORDER_ADJUSTMENT}px)`
            : undefined,
      }}
    >
      <div
        css={forcedDimensions}
        style={{
          paddingBottom: `${(dimensions.height / dimensions.width) * 100}%`,
        }}
        onContextMenuCapture={onContextMenu}
      >
        <div css={absoluteDiv}>{children}</div>
      </div>
    </div>
  );
};
