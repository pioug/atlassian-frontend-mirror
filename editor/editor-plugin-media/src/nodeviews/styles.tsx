/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import { MediaBorderGapFiller } from '@atlaskit/editor-common/ui';
import type { NumericalCardDimensions } from '@atlaskit/media-card';
import { Y200, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { CommentStatus } from '../types';

export const MediaInlineNodeSelector = 'media-inline-node';
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
  commentStatus?: CommentStatus;
};

const boxShadowColorByStatus = {
  draft: token('color.background.accent.yellow.subtle', Y300),
  focus: token('color.background.accent.yellow.subtle', Y300),
  blur: token('color.background.accent.yellow.subtler', Y200),
};

const commentStatusStyleMap = (status: CommentStatus) =>
  `3px 3px 0px 0px ${boxShadowColorByStatus[status]}`;

export const MediaCardWrapper = ({
  dimensions,
  children,
  selected,
  borderWidth = 0,
  onContextMenu,
  commentStatus,
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
        ...(commentStatus && {
          boxShadow: `${commentStatusStyleMap(commentStatus)}`,
        }),
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
