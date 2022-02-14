import React from 'react';
import { css, SerializedStyles } from '@emotion/core';
import { FormattedMessage } from 'react-intl-next';

import { SmartLinkSize } from '../../../constants';
import { MessageProps } from './types';

export const getFormattedMessage = (message?: MessageProps) => {
  if (message) {
    const { descriptor, values } = message;
    return <FormattedMessage {...descriptor} values={values} />;
  }
};

const getIconDimensionStyles = (value: string): SerializedStyles => css`
  height: ${value};
  min-height: ${value};
  max-height: ${value};
  width: ${value};
  min-width: ${value};
  max-width: ${value};
`;

export const getIconSizeStyles = (width: string): SerializedStyles => {
  const sizeStyles = getIconDimensionStyles(width);
  return css`
    flex: 0 0 auto;
    ${sizeStyles}
    span,
    svg,
    img {
      ${sizeStyles}
    }
    svg {
      padding: 0;
    }
  `;
};

export const getLinkLineHeight = (size: SmartLinkSize): string => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return '1.5rem';
    case SmartLinkSize.Large:
    case SmartLinkSize.Medium:
    case SmartLinkSize.Small:
    default:
      return '1rem';
  }
};

export const getLinkSizeStyles = (size: SmartLinkSize): SerializedStyles => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return css`
        font-size: 1.25rem;
        font-weight: 400;
        letter-spacing: -0.008em;
        line-height: ${getLinkLineHeight(size)};
      `;
    case SmartLinkSize.Large:
    case SmartLinkSize.Medium:
      return css`
        font-size: 0.875rem;
        font-weight: 500;
        letter-spacing: -0.003em;
        line-height: ${getLinkLineHeight(size)};
      `;
    case SmartLinkSize.Small:
    default:
      return css`
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0em;
        line-height: ${getLinkLineHeight(size)};
      `;
  }
};

export const getTruncateStyles = (
  maxLines: number,
  lineHeight: string = '1rem',
): SerializedStyles =>
  css`
    display: -webkit-box;
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: ${maxLines};
    -webkit-box-orient: vertical;
    // Fallback options
    max-height: calc(${maxLines} * ${lineHeight});
  `;
