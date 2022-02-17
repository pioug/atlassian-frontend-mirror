import React from 'react';
import { css } from '@emotion/core';

import { MetadataBlockProps } from './types';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkStatus,
  SmartLinkWidth,
} from '../../../../../constants';
import { getGapSize, renderElementItems } from '../utils';
import Block from '../block';
import ElementGroup from '../element-group';

const DEFAULT_MAX_LINES = 2;
const MAXIMUM_MAX_LINES = 2;
const MINIMUM_MAX_LINES = 1;

const getElementGroupStyles = (size: SmartLinkSize, maxLines: number) => {
  // MetadataBlock allows metadata elements to be displayed in
  // multiple lines, with maximum of 2 lines.
  // a) We need the height of the line to be equal on both left and right
  //    sides so they line up nicely.
  // b) There is no way to truncate non-text elements nicely. Here
  //    it's fix max height of the element group so that anything that is
  //    overflown will not be visible.
  const lineHeight = getLineHeight(size);
  const gap = getGapSize(size);
  const gapHeight = gap * (maxLines - 1);
  const height = lineHeight * maxLines + gapHeight;
  return css`
    flex-wrap: wrap;
    line-height: ${lineHeight}rem;
    max-height: ${height}rem;
    > span,
    > div {
      min-height: ${lineHeight}rem;
      max-height: ${lineHeight}rem;
      line-height: ${lineHeight}rem;
    }
  `;
};

const getLineHeight = (size: SmartLinkSize) => {
  // The maximum height of all elements in specific size.
  // These heights belongs to AvatarGroup.
  switch (size) {
    case SmartLinkSize.XLarge:
    case SmartLinkSize.Large:
      return 1.75;
    case SmartLinkSize.Medium:
    case SmartLinkSize.Small:
    default:
      return 1.5;
  }
};

const getMaxLines = (maxLines: number) => {
  if (maxLines > MAXIMUM_MAX_LINES) {
    return DEFAULT_MAX_LINES;
  }

  if (maxLines < MINIMUM_MAX_LINES) {
    return MINIMUM_MAX_LINES;
  }

  return maxLines;
};

const MetadataBlock: React.FC<MetadataBlockProps> = ({
  maxLines = DEFAULT_MAX_LINES,
  status = SmartLinkStatus.Fallback,
  testId = 'smart-block-metadata',
  primary = [],
  secondary = [],
  ...blockProps
}) => {
  if (
    (primary.length === 0 && secondary.length === 0) ||
    status !== SmartLinkStatus.Resolved
  ) {
    return null;
  }

  const primaryElements = renderElementItems(primary);
  const secondaryElements = renderElementItems(secondary);

  const { size = SmartLinkSize.Medium } = blockProps;
  const elementGroupStyles = getElementGroupStyles(size, getMaxLines(maxLines));

  return (
    <Block {...blockProps} testId={`${testId}-resolved-view`}>
      {primaryElements && (
        <ElementGroup
          align={SmartLinkAlignment.Left}
          css={elementGroupStyles}
          direction={SmartLinkDirection.Horizontal}
          width={SmartLinkWidth.Flexible}
        >
          {primaryElements}
        </ElementGroup>
      )}
      {secondaryElements && (
        <ElementGroup
          align={SmartLinkAlignment.Right}
          css={elementGroupStyles}
          direction={SmartLinkDirection.Horizontal}
          width={SmartLinkWidth.Flexible}
        >
          {secondaryElements}
        </ElementGroup>
      )}
    </Block>
  );
};

export default MetadataBlock;
