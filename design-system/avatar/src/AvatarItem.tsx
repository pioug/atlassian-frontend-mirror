/** @jsx jsx */
import React, {
  createElement,
  forwardRef,
  Fragment,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react';

import { ClassNames, Interpolation, jsx } from '@emotion/core';

import {
  B200,
  backgroundActive,
  backgroundHover,
} from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';

import { BORDER_WIDTH } from './constants';
import Text from './Text';
import { AvatarClickEventHandler } from './types';
import { getButtonProps, getCustomElement, getLinkProps } from './utilities';

export interface CustomAvatarItemProps {
  testId?: string;
  onClick?: MouseEventHandler;
  className?: string;
  href?: string;
  children: ReactNode;
  ref: Ref<HTMLElement>;
}

export interface AvatarItemProps {
  avatar: ReactNode;
  /** Change background color */
  backgroundColor?: string;
  /** A custom component to use instead of the default span. */
  children?: (props: CustomAvatarItemProps) => ReactNode;
  /** Provides a url for avatars being used as a link. */
  href?: string;
  /** Change the style to indicate the item is disabled. */
  isDisabled?: boolean;
  /** Handler to be called on click. */
  onClick?: AvatarClickEventHandler;
  /** PrimaryText text */
  primaryText?: ReactNode;
  /** SecondaryText text */
  secondaryText?: ReactNode;
  /** Pass target down to the anchor, if href is provided. */
  target?: '_blank' | '_self' | '_top' | '_parent';
  /** Whether or not overflowing primary and secondary text is truncated */
  isTruncationDisabled?: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

const getStyles = (
  css: (
    template: TemplateStringsArray,
    ...args: Array<Interpolation>
  ) => string,
  {
    backgroundColor,
    isInteractive,
    isDisabled,
  }: {
    backgroundColor: string;
    isInteractive: boolean;
    isDisabled?: boolean;
  },
) => css`
  align-items: center;
  background-color: ${backgroundColor};
  border-radius: ${borderRadius()}px;
  border: ${BORDER_WIDTH}px solid transparent;
  box-sizing: border-box;
  color: inherit;
  display: flex;
  font-size: inherit;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  outline: none;
  margin: 0;
  padding: ${gridSize() / 2}px;
  text-align: left;
  text-decoration: none;
  width: 100%;
  cursor: pointer;

  ${isInteractive &&
    `
        :hover {
          background-color: ${backgroundHover()};
          text-decoration: none;
        }

        :focus {
          outline: none;
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
`;

const AvatarItem = forwardRef<HTMLElement, AvatarItemProps>(
  (
    {
      avatar,
      backgroundColor = 'transparent',
      children,
      isTruncationDisabled,
      href,
      isDisabled,
      onClick,
      primaryText,
      secondaryText,
      target,
      testId,
    },
    ref,
  ) => {
    const onClickHandler = (event: React.MouseEvent<HTMLElement>) => {
      if (isDisabled || typeof onClick !== 'function') {
        return;
      }
      onClick(event);
    };

    const getTestId = (testId?: string, children?: ReactNode) =>
      !children
        ? { 'data-testid': `${testId}--itemInner` }
        : { testId: `${testId}--itemInner` };

    return (
      <ClassNames>
        {({ css }) => {
          const props: CustomAvatarItemProps = {
            ref,
            className: getStyles(css, {
              backgroundColor,
              isInteractive: Boolean(onClick || href),
            }),
            ...(href && getLinkProps(href, target)),
            ...(onClick && getButtonProps(onClickHandler, isDisabled)),
            ...(testId && getTestId(testId, children)),
            children: (
              <Fragment>
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
              </Fragment>
            ),
          };

          return children
            ? children(props)
            : createElement(getCustomElement(href, onClick), props);
        }}
      </ClassNames>
    );
  },
);

AvatarItem.displayName = 'AvatarItem';

export default AvatarItem;
