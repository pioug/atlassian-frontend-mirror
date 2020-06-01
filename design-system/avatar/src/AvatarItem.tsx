/** @jsx jsx */
import React, { ComponentType, FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import {
  B200,
  backgroundActive,
  backgroundHover,
} from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';

import Text from './Text';
import { AvatarClickType } from './types';
import { getButtonProps, getCustomElement, getLinkProps } from './utilities';

export interface AvatarItemProps {
  avatar: ReactNode;
  /** Change background color */
  backgroundColor?: string;
  /** A custom component to use instead of the default span. */
  component?: ComponentType<any>;
  /** Provides a url for avatars being used as a link. */
  href?: string;
  /** Change the style to indicate the item is disabled. */
  isDisabled?: boolean;
  /** Handler to be called on click. */
  onClick?: AvatarClickType;
  /** PrimaryText text */
  primaryText?: ReactNode;
  /** SecondaryText text */
  secondaryText?: ReactNode;
  /** Pass target down to the anchor, if href is provided. */
  target?: '_blank' | '_self' | '_top' | '_parent';
  /** Whether or not overflowing primary and secondary text is truncated */
  isTruncationDisabled?: boolean;
  testId?: string;
}

const AvatarItem: FC<AvatarItemProps> = ({
  avatar,
  backgroundColor = 'transparent',
  component,
  isTruncationDisabled,
  href,
  isDisabled,
  onClick,
  primaryText,
  secondaryText,
  target,
  testId,
}) => {
  const Element: string | ComponentType<any> =
    component || getCustomElement(href, onClick);

  return (
    <Element
      onClick={(event: React.MouseEvent) => {
        if (isDisabled || typeof onClick !== 'function') return;
        onClick(event);
      }}
      css={css`
        align-items: center;
        background-color: ${backgroundColor};
        border-radius: ${borderRadius()}px;
        border: 2px solid transparent;
        box-sizing: border-box;
        color: inherit;
        display: flex;
        font-size: inherit;
        font-style: normal;
        font-weight: normal;
        line-height: 1;
        outline: none;
        margin: 0;
        padding: ${gridSize() * 2}px;
        text-align: left;
        text-decoration: none;
        width: 100%;
        cursor: pointer;

        ${(onClick || href) &&
          `
          :hover {
            background-color: ${backgroundHover()};
          }

          :focus {
            border-color: ${B200};
          }

          :active {
            background-color: ${backgroundActive()};
          }
        `}

        ${isDisabled &&
          `
          cursor: not-allowed;
          opacity: 0.75;
          pointer-events: none;
        `}
      `}
      {...(href && target && getLinkProps(href, target))}
      {...(onClick && getButtonProps(isDisabled))}
      {...(!component
        ? { 'data-testid': testId && `${testId}--itemInner` }
        : { testId: testId && `${testId}--itemInner` })}
    >
      {avatar}
      <div
        css={{
          maxWidth: '100%',
          minWidth: 0,
          flex: '1 1 100%',
          lineHeight: '1.4',
          paddingLeft: `${gridSize()}px`,
        }}
      >
        <Text truncate={!isTruncationDisabled!}>{primaryText}</Text>
        <Text secondary truncate={!isTruncationDisabled!}>
          {secondaryText}
        </Text>
      </div>
    </Element>
  );
};

export default AvatarItem;
