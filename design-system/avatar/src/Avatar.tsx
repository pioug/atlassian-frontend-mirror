/** @jsx jsx */
import {
  createElement,
  forwardRef,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { ClassNames, Interpolation, jsx } from '@emotion/core';

import { UIAnalyticsEvent, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { B200, N0, N70A } from '@atlaskit/theme/colors';

import AvatarImage from './AvatarImage';
import { AVATAR_RADIUS, AVATAR_SIZES, BORDER_WIDTH } from './constants';
import { PresenceWrapper } from './Presence';
import { StatusWrapper } from './Status';
import {
  AppearanceType,
  AvatarClickEventHandler,
  IndicatorSizeType,
  SizeType,
} from './types';
import { getButtonProps, getCustomElement, getLinkProps } from './utilities';
import { name as packageName, version as packageVersion } from './version.json';

export interface CustomAvatarProps {
  testId?: string;
  onClick?: MouseEventHandler;
  className?: string;
  href?: string;
  children: ReactNode;
  ref: Ref<HTMLElement>;
}

export interface AvatarPropTypes {
  /** Indicates the shape of the avatar. Most avatars are circular, but square avatars
   can be used for 'container' objects. */
  appearance?: AppearanceType;
  /** Defines the size of the avatar */
  size?: SizeType;
  /** Used to override the default border color of the presence indicator.
   Accepts any color argument that the border-color CSS property accepts. */
  borderColor?: string;
  /** Supply a custom avatar component instead of the default */
  children?: (props: CustomAvatarProps) => ReactNode;
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
  onClick?: AvatarClickEventHandler;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  /** Analytics context meta data */
  analyticsContext?: Record<string, any>;
}

const getStyles = (
  css: (
    template: TemplateStringsArray,
    ...args: Array<Interpolation>
  ) => string,
  {
    size,
    radius,
    appearance,
    borderColor = N0,
    stackIndex,
    isInteractive,
    isDisabled,
  }: {
    size: number;
    radius: number;
    appearance: AppearanceType;
    borderColor?: string;
    stackIndex?: number;
    isInteractive: boolean;
    isDisabled?: boolean;
  },
) => css`
    height: ${size}px;
    width: ${size}px;
    align-items: stretch;
    background-color: ${borderColor};
    border-radius: ${appearance === 'circle' ? '50%' : `${radius}px`};
    box-sizing: content-box;
    cursor: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    outline: none;
    overflow: hidden;
    position: static;
    transform: translateZ(0);
    transition: transform 200ms, opacity 200ms;
    box-shadow: 0 0 0 ${BORDER_WIDTH}px ${borderColor};
    border: none;
    margin: ${BORDER_WIDTH}px;
    padding: 0;

    &::-moz-focus-inner {
      border: 0;
      margin: 0;
      padding: 0;
    }

    &::after {
      background-color: transparent;
      bottom: 0px;
      content: ' ';
      left: 0px;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      right: 0px;
      top: 0px;
      transition: opacity 200ms;
      width: 100%;
    }

    ${stackIndex && `position: relative;`}

    ${isInteractive &&
      `
      cursor: pointer;

      :focus {
        outline: none;
        box-shadow: 0 0 0 ${BORDER_WIDTH}px ${B200}
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
          opacity: 0.7;
          pointer-events: none;
          background-color: ${N0};
        }
      `}
  `;

const Avatar = forwardRef<HTMLElement, AvatarPropTypes>(
  (
    {
      analyticsContext,
      appearance = 'circle' as AppearanceType,
      borderColor,
      children,
      href,
      isDisabled,
      name,
      onClick,
      presence,
      size = 'medium' as SizeType,
      src,
      stackIndex,
      status,
      target,
      testId,
    },
    ref,
  ) => {
    const { createAnalyticsEvent } = useAnalyticsEvents();
    const customPresenceNode = typeof presence === 'object' ? presence : null;
    const customStatusNode = typeof status === 'object' ? status : null;
    const isValidIconSize = size !== 'xxlarge' && size !== 'xsmall';
    const lastAnalytics = useRef(analyticsContext);

    useEffect(() => {
      lastAnalytics.current = analyticsContext;
    }, [analyticsContext]);

    const getTestId = (testId?: string, children?: ReactNode) =>
      !children
        ? { 'data-testid': `${testId}--inner` }
        : { testId: `${testId}--inner` };

    const onClickHandler = useCallback(
      (event: MouseEvent<HTMLElement>) => {
        if (isDisabled || typeof onClick !== 'function') {
          return;
        }

        const analyticsEvent = createAnalyticsEvent({
          action: 'clicked',
          actionSubject: 'avatar',
          attributes: {
            componentName: 'avatar',
            packageName,
            packageVersion,
          },
        });

        /**
         * To avoid wrapping this component in AnalyticsContext we manually
         * push the parent context's meta data into the context.
         **/
        const context: Record<string, any> = {
          componentName: 'avatar',
          packageName,
          packageVersion,
          ...lastAnalytics.current,
        };

        analyticsEvent.context.push(context);

        /** Replicating the logic in the `withAnalyticsEvents` HOC */
        const clone: UIAnalyticsEvent | null = analyticsEvent.clone();
        if (clone) {
          clone.fire('atlaskit');
        }

        onClick(event, analyticsEvent);
      },
      [createAnalyticsEvent, isDisabled, onClick],
    );

    return (
      <div
        data-testid={testId}
        style={{
          display: 'inline-block',
          position: 'relative',
          outline: 0,
          zIndex: stackIndex,
        }}
      >
        <ClassNames>
          {({ css }) => {
            const props: CustomAvatarProps = {
              className: getStyles(css, {
                size: AVATAR_SIZES[size],
                radius: AVATAR_RADIUS[size],
                appearance,
                borderColor,
                stackIndex,
                isInteractive: Boolean(href || onClick),
                isDisabled,
              }),
              ...(href && getLinkProps(href, target)),
              ...(!href &&
                onClick &&
                getButtonProps(onClickHandler, isDisabled)),
              ...(testId && getTestId(testId, children)),
              children: (
                <AvatarImage
                  alt={name}
                  appearance={appearance!}
                  size={size!}
                  src={src}
                />
              ),
              ref,
            };

            return children
              ? children(props)
              : createElement(getCustomElement(href, onClick), props);
          }}
        </ClassNames>
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
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
