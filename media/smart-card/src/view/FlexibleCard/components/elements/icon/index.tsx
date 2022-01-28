/** @jsx jsx */
import React, { useMemo } from 'react';

import LinkIcon from '@atlaskit/icon/glyph/link';
import { css, jsx } from '@emotion/core';

import { IconProps } from './types';
import { IconType, SmartLinkSize } from '../../../../../constants';
import AtlaskitIcon from './atlaskit-icon';
import ImageIcon from './image-icon';

const getDimensionStyles = (value: string) => ({
  maxHeight: value,
  maxWidth: value,
  minHeight: value,
  minWidth: value,
  height: value,
  width: value,
});

const getSizeStyles = (size?: SmartLinkSize) => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return getDimensionStyles('1.75rem');
    case SmartLinkSize.Large:
      return getDimensionStyles('1.5rem');
    case SmartLinkSize.Medium:
      return getDimensionStyles('1rem');
    case SmartLinkSize.Small:
    default:
      return getDimensionStyles('.75rem');
  }
};

const getMargin = (size: SmartLinkSize) => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return '0.12em 0 0 0';
    case SmartLinkSize.Large:
      return '0';
    case SmartLinkSize.Medium:
      return '0';
    case SmartLinkSize.Small:
    default:
      return '-.05em 0 0 0';
  }
};

const getIconStyles = (size: SmartLinkSize) => {
  const styles = getSizeStyles(size);
  return css({
    flex: '0 0 auto',
    alignSelf: 'flex-start',
    margin: getMargin(size),
    ...styles,
    '[class$="-Icon"],[class$="-Wrapper"]': {
      ...styles,
      '> svg': { ...styles, padding: 0 },
    },
    '& > img': styles,
  });
};

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

const Icon: React.FC<IconProps> = ({
  icon,
  label = 'Link',
  size = SmartLinkSize.Medium,
  testId = 'smart-element-icon',
  url,
}) => {
  const element = useMemo(() => {
    const defaultIcon = renderDefaultIcon(label, testId);
    return (
      renderImageIcon(defaultIcon, icon, url, testId) ||
      renderAtlaskitIcon(icon, label, testId) ||
      defaultIcon
    );
  }, [icon, label, testId, url]);
  const styles = getIconStyles(size);
  return (
    <div css={styles} data-smart-element-icon data-testid={testId}>
      {element}
    </div>
  );
};

export default Icon;
