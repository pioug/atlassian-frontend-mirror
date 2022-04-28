/** @jsx jsx */
import React, { useMemo } from 'react';

import LinkIcon from '@atlaskit/icon/glyph/link';
import { css, jsx, SerializedStyles } from '@emotion/core';

import { IconProps } from './types';
import {
  IconType,
  SmartLinkPosition,
  SmartLinkSize,
} from '../../../../../constants';
import AtlaskitIcon from '../../common/atlaskit-icon';
import ImageIcon from '../../common/image-icon';
import { getIconSizeStyles, getTruncateStyles } from '../../utils';

const getPositionStyles = (
  size: SmartLinkSize,
  position: SmartLinkPosition,
): SerializedStyles => {
  switch (position) {
    case SmartLinkPosition.Center:
      return css`
        align-self: center;
      `;
    case SmartLinkPosition.Top:
    default:
      return css`
        align-self: flex-start;
        margin: 0;
      `;
  }
};

const getWidth = (size?: SmartLinkSize): string => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return '2rem';
    case SmartLinkSize.Large:
      return '1.5rem';
    case SmartLinkSize.Medium:
      return '1rem';
    case SmartLinkSize.Small:
    default:
      return '.75rem';
  }
};

const getIconStyles = (
  size: SmartLinkSize,
  position: SmartLinkPosition,
  width: string,
): SerializedStyles => css`
  ${getPositionStyles(size, position)}
  ${getIconSizeStyles(width)}
`;

const getCustomRenderStyles = (value: string): SerializedStyles => css`
  ${getTruncateStyles(1, value)}
  line-height: ${value};
  font-size: ${value};
  text-align: center;
  text-overflow: clip;
  -webkit-box-orient: unset;
  span {
    margin: 0;
    padding: 0;
    vertical-align: baseline;
  }
`;

const renderAtlaskitIcon = (
  icon?: IconType,
  label?: string,
  testId?: string,
): React.ReactNode | undefined => {
  if (icon) {
    return <AtlaskitIcon icon={icon} label={label} testId={`${testId}-icon`} />;
  }
};

const renderDefaultIcon = (label: string, testId: string): React.ReactNode => (
  <LinkIcon label={label} testId={`${testId}-default`} />
);

const renderImageIcon = (
  defaultIcon: React.ReactNode,
  icon?: IconType,
  url?: string,
  testId?: string,
): React.ReactNode | undefined => {
  if (url) {
    return <ImageIcon defaultIcon={defaultIcon} testId={testId} url={url} />;
  }
};

/**
 * An element that displays an Icon or favicon.
 * @public
 * @param {IconProps} IconProps - The props necessary for the Icon element.
 * @see LinkIcon
 */
const Icon: React.FC<IconProps> = ({
  icon,
  label = 'Link',
  position = SmartLinkPosition.Top,
  overrideCss,
  render,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-icon',
  url,
}) => {
  const element = useMemo(() => {
    const defaultIcon = renderDefaultIcon(label, testId);
    return (
      render?.() ||
      renderImageIcon(defaultIcon, icon, url, testId) ||
      renderAtlaskitIcon(icon, label, testId) ||
      defaultIcon
    );
  }, [icon, label, render, testId, url]);

  const width = getWidth(size);
  const styles = getIconStyles(size, position, width);
  const renderStyles = render ? getCustomRenderStyles(width) : undefined;

  return (
    <div
      css={[styles, renderStyles, overrideCss]}
      data-fit-to-content
      data-smart-element-icon
      data-testid={testId}
    >
      {element}
    </div>
  );
};

export default Icon;
