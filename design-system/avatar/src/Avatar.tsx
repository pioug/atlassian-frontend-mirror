/** @jsx jsx */
import React, {
  ComponentType,
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
} from 'react';

import { css, jsx } from '@emotion/core';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { B200, background, N70A } from '@atlaskit/theme/colors';

import AvatarImage from './AvatarImage';
import { AVATAR_RADIUS, AVATAR_SIZES, BORDER_WIDTH } from './constants';
import { PresenceWrapper } from './Presence';
import { StatusWrapper } from './Status';
import {
  AppearanceType,
  AvatarClickType,
  IndicatorSizeType,
  SizeType,
} from './types';
import { getButtonProps, getCustomElement, getLinkProps } from './utilities';
import { name as packageName, version as packageVersion } from './version.json';

export interface AvatarPropTypes {
  /** Indicates the shape of the avatar. Most avatars are circular, but square avatars
   can be used for 'container' objects. */
  appearance?: AppearanceType;
  /** Defines the size of the avatar */
  size?: SizeType;
  /** Used to override the default border color of the presence indicator.
   Accepts any color argument that the border-color CSS property accepts. */
  borderColor?: string;
  /** A custom component to use instead of the default span.
   * A `className` prop is passed to the component which has classNames for all the default styles for the avatar.
   * */
  component?: ComponentType<{
    children: ReactNode;
    testId?: string;
    onClick?: MouseEventHandler;
    className?: string;
    href?: string;
  }>;
  /** Provides a url for avatars being used as a link. */
  href?: string;
  /** Change the style to indicate the avatar is disabled. */
  isDisabled?: boolean;
  /** Name will be displayed in a tooltip, also used by screen readers as fallback
   content if the image fails to load. */
  name?: string;
  /** Indicates a user's online status by showing a small icon on the avatar.
  Refer to presence values on the Presence component.
  Alternatively accepts any React element. For best results, it is recommended to
  use square content with height and width of 100%. */
  presence?: ('online' | 'busy' | 'focus' | 'offline') | ReactNode;
  /** A url to load an image from (this can also be a base64 encoded image). */
  src?: string;
  /** Indicates contextual information by showing a small icon on the avatar.
   Refer to status values on the Status component. */
  status?: ('approved' | 'declined' | 'locked') | ReactNode;
  /** The index of where this avatar is in the group `stack`. */
  stackIndex?: number;
  /** Assign specific tabIndex order to the underlying node. */
  tabIndex?: number;
  /** Pass target down to the anchor, if href is provided. */
  target?: '_blank' | '_self' | '_top' | '_parent';
  /** Handler to be called on click. */
  onClick?: AvatarClickType;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

const Avatar: FC<AvatarPropTypes> = ({
  appearance = 'circle',
  borderColor,
  component,
  href,
  isDisabled,
  name,
  onClick,
  presence,
  size = 'medium',
  src,
  stackIndex,
  status,
  target,
  testId,
}: AvatarPropTypes) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const avatarSize = AVATAR_SIZES[size];
  const avatarRadius = AVATAR_RADIUS[size];
  const customPresenceNode = typeof presence === 'object' ? presence : null;
  const customStatusNode = typeof status === 'object' ? status : null;
  const isValidIconSize = size !== 'xxlarge' && size !== 'xsmall';

  const guardedClick = useCallback(
    (event: React.MouseEvent) => {
      if (isDisabled || typeof onClick !== 'function') return;

      const analyticsEvent = createAnalyticsEvent({
        action: 'clicked',
        actionSubject: 'avatar',
        attributes: {
          componentName: 'avatar',
          packageName,
          packageVersion,
        },
      });

      onClick(event, analyticsEvent);
      analyticsEvent.fire('atlaskit');
    },
    [createAnalyticsEvent, isDisabled, onClick],
  );

  const Element: string | ComponentType<any> =
    component || getCustomElement(href, onClick);

  return (
    <div
      data-testid={testId}
      style={{
        display: 'inline-block',
        position: 'relative',
        outline: 0,
        zIndex: stackIndex,
        height: `${avatarSize + 4}px`,
        width: `${avatarSize + 4}px`,
      }}
    >
      <Element
        css={css`
            height: ${avatarSize}px;
            width: ${avatarSize}px;
            align-items: stretch;
            background-color: ${borderColor || background()};
            border: 0;
            border-radius: ${
              appearance === 'circle'
                ? '50%'
                : `${avatarRadius + BORDER_WIDTH}px`
            };
            padding: ${BORDER_WIDTH}px;
            box-sizing: content-box;
            cursor: inherit;
            display: flex;
            flex-direction: column;
            justify-content: center;
            outline: none;
            overflow: hidden;
            position: static;
            transform: translateZ(0);
            transition: opacity 200ms, background-color 200ms ease-out;

            &::-moz-focus-inner {
              border: 0;
              margin: 0;
              padding: 0;
            }

            &::after {
              background-color: transparent;
              border-radius: ${
                appearance === 'circle' ? '50%' : `${avatarRadius}px`
              };
              bottom: ${BORDER_WIDTH}px;
              content: ' ';
              left: ${BORDER_WIDTH}px;
              opacity: 0;
              pointer-events: none;
              position: absolute;
              right: ${BORDER_WIDTH}px;
              top: ${BORDER_WIDTH}px;
              transition: opacity 200ms;
            }
            ${stackIndex && `position: relative;`}

            ${Boolean(href || onClick) &&
              `
              cursor: pointer;

              :focus {
                outline: none;
                background-color: ${B200};
              }

              :active,
              :hover {
                &::after {
                  background-color: ${N70A};
                  opacity: 1;
                }
              }

              :active {
                transform: scale(0.9);
              }
            `}

            ${isDisabled &&
              `
                cursor: not-allowed;

                &::after {
                  opacity: 1;
                  pointer-events: none;
                  background-color: rgba(255, 255, 255, 0.7);
                }
              `}
          `}
        {...(href && getLinkProps(href, target))}
        {...(!href && onClick && getButtonProps(isDisabled))}
        {...(!component
          ? { 'data-testid': testId && `${testId}--inner` }
          : { testId: testId && `${testId}--inner` })}
        onClick={guardedClick}
      >
        <AvatarImage
          alt={name}
          appearance={appearance!}
          size={size!}
          src={src}
        />
      </Element>
      {isValidIconSize && presence && !status && (
        <PresenceWrapper
          appearance={appearance!}
          size={size as IndicatorSizeType}
          presence={!customPresenceNode && presence}
          testId={testId}
        >
          {customPresenceNode}
        </PresenceWrapper>
      )}

      {isValidIconSize && status && (
        <StatusWrapper
          appearance={appearance!}
          size={size as IndicatorSizeType}
          borderColor={borderColor}
          status={!customStatusNode && status}
          testId={testId}
        >
          {customStatusNode}
        </StatusWrapper>
      )}
    </div>
  );
};

export default Avatar;
