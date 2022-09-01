/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';

import Item from './Item';
import { Appearance, ContentRef } from '../types';
import { token } from '@atlaskit/tokens';
import { G200, G400, N100 } from '@atlaskit/theme/colors';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import type { Theme } from '@atlaskit/theme/types';

const iconStyles = (showPlaceholder: boolean | undefined) => (theme: Theme) => {
  return css({
    flex: '0 0 16px',
    height: '16px',
    width: '16px',
    margin: `4px ${gridSize() * 1.5}px 0 0`,
    color: showPlaceholder
      ? token('color.icon.subtle', N100)
      : themed({
          light: token('color.icon.success', G400),
          dark: token('color.icon.success', G200),
        })({ theme }),
    '> span': {
      margin: '-8px',
    },
  });
};

export interface Props {
  children?: any;
  contentRef?: ContentRef;
  placeholder?: string;
  showPlaceholder?: boolean;
  appearance?: Appearance;
  dataAttributes?: { [key: string]: string | number };
}

const DecisionItem = ({
  appearance,
  children,
  contentRef,
  placeholder,
  showPlaceholder,
  dataAttributes,
}: Props) => {
  const theme = useGlobalTheme();
  const icon = (
    <span css={iconStyles(showPlaceholder)(theme)}>
      <DecisionIcon label="Decision" size="large" />
    </span>
  );

  return (
    <Item
      appearance={appearance}
      contentRef={contentRef}
      icon={icon}
      placeholder={placeholder}
      showPlaceholder={showPlaceholder}
      itemType="DECISION"
      dataAttributes={dataAttributes}
      theme={theme}
    >
      {children}
    </Item>
  );
};

export default DecisionItem;
