import { css } from '@emotion/react';
import { IMAGE_AND_BORDER_ADJUSTMENT } from '@atlaskit/editor-common/ui';

export const linkStyle = (hasBorderMark: boolean) => css`
  position: absolute;
  background: transparent;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  cursor: pointer;
  width: ${hasBorderMark
    ? `calc(100% - ${IMAGE_AND_BORDER_ADJUSTMENT}px)`
    : '100%'} !important;
  height: ${hasBorderMark
    ? `calc(100% - ${IMAGE_AND_BORDER_ADJUSTMENT}px)`
    : '100%'} !important;
`;

export const borderStyle = (
  hasLinkMark: boolean,
  color: string,
  width: number,
) => css`
  width: ${hasLinkMark
    ? '100%'
    : `calc(100% - ${IMAGE_AND_BORDER_ADJUSTMENT}px)`} !important;
  height: ${hasLinkMark
    ? '100%'
    : `calc(100% - ${IMAGE_AND_BORDER_ADJUSTMENT}px)`} !important;
  border-color: ${color};
  border-width: ${width}px;
  border-style: solid;
  border-radius: ${width * 2}px;
`;
