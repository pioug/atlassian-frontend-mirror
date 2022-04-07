/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { NumericalCardDimensions } from '@atlaskit/media-card';

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
  onContextMenu?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

export const MediaCardWrapper = ({
  dimensions,
  children,
  onContextMenu,
}: MediaCardWrapperProps) => {
  return (
    <div
      css={forcedDimensions}
      style={{
        paddingBottom: `${(dimensions.height / dimensions.width) * 100}%`,
      }}
      onContextMenuCapture={onContextMenu}
    >
      <div css={absoluteDiv}>{children}</div>
    </div>
  );
};
