/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
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
import { B300, N0, N70A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import AvatarImage from './AvatarImage';
import {
  ACTIVE_SCALE_FACTOR,
  AVATAR_RADIUS,
  AVATAR_SIZES,
  BORDER_WIDTH,
} from './constants';
import { PresenceWrapper } from './Presence';
import { StatusWrapper } from './Status';
import {
  AppearanceType,
  AvatarClickEventHandler,
  IndicatorSizeType,
  SizeType,
} from './types';
import { getButtonProps, getCustomElement, getLinkProps } from './utilities';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export interface CustomAvatarProps {
  /**
   * This is used in render props so is okay to be defined.
   * eslint-disable-next-line consistent-props-definitions
   */
  'aria-label'?: string;
  tabIndex?: number;
  testId?: string;
  onClick?: MouseEventHandler;
  className?: string;
  href?: string;
  children: ReactNode;
  ref: Ref<HTMLElement>;
}

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export interface AvatarPropTypes {
  /**
   * Indicates the shape of the avatar. Most avatars are circular, but square avatars
   * can be used for 'container' objects.
   */
  appearance?: AppearanceType;
  /**
   * Used to provide better content to screen readers when using presence/status. Rather
   * than a screen reader speaking "online, approved, John Smith", passing in an label
   * allows a custom message like "John Smith (approved and online)".
   */
  label?: string;
  /**
   * Used to override the default border color around the avatar body.
   * Accepts any color argument that the border-color CSS property accepts.
   */
  borderColor?: string;
  /**
   * Supply a custom avatar component instead of the default
   */
  children?: (props: CustomAvatarProps) => ReactNode;
  /**
   * Provides a url for avatars being used as a link.
   */
  href?: string;
  /**
   * Change the style to indicate the avatar is disabled.
   */
  isDisabled?: boolean;
  /**
   * Name will be displayed in a tooltip, also used by screen readers as fallback
   * content if the image fails to load.
   */
  name?: string;
  /**
   * Indicates a user's online status by showing a small icon on the avatar.
   * Refer to presence values on the Presence component.
   * Alternatively accepts any React element. For best results, it is recommended to
   * use square content with height and width of 100%.
   */
  presence?: ('online' | 'busy' | 'focus' | 'offline') | ReactNode;
  /**
   * Defines the size of the avatar
   */
  size?: SizeType;
  /**
   * A url to load an image from (this can also be a base64 encoded image).
   */
  src?: string;
  /**
   * Indicates contextual information by showing a small icon on the avatar.
   * Refer to status values on the Status component.
   */
  status?: ('approved' | 'declined' | 'locked') | ReactNode;
  /**
   * The index of where this avatar is in the group `stack`.
   */
  stackIndex?: number;
  /**
   * Assign specific tabIndex order to the underlying node.
   */
  tabIndex?: number;
  /**
   * Pass target down to the anchor, if href is provided.
   */
  target?: '_blank' | '_self' | '_top' | '_parent';
  /**
   * Handler to be called on click.
   */
  onClick?: AvatarClickEventHandler;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;
  /**
   * Analytics context meta data
   */
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
    borderColor = token('color.background.overlay', N0),
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
) =>
  //eslint-disable-next-line @repo/internal/react/no-css-string-literals
  css`
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

    /* Added font-size and font-family styles to fix alignment issue in firefox for interactive button avatar */
    font-size: inherit;
    font-family: inherit;

    &::-moz-focus-inner {
      border: 0;
      margin: 0;
      padding: 0;
    }

    &::after {
      background-color: transparent;
      bottom: 0px;

      /* Added border-radius style to fix hover issue in safari */
      border-radius: ${appearance === 'circle' ? '50%' : `${radius}px`};
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
        box-shadow: 0 0 0 ${BORDER_WIDTH}px ${token('color.border.focus', B300)}
      }

      :hover {
        &::after {
          background-color: ${token('color.overlay.hover', N70A)};
          opacity: 1;
        }
      }

      :active {
        &::after {
          background-color: ${token('color.overlay.pressed', N70A)};
          opacity: 1;
        }
      }

      :active {
        transform: scale(${ACTIVE_SCALE_FACTOR});
      }

      @media screen and (forced-colors: active) {
        &:focus-visible {
          outline: 1px solid
        }
      }
    `}

    ${isDisabled &&
    `
        cursor: not-allowed;

        &::after {
          opacity: 0.7;
          pointer-events: none;
          background-color: ${token('color.background.default', N0)};
        }
      `}
  `;

/**
 * __Avatar__
 *
 * An avatar is a visual representation of a user or entity.
 *
 * - [Examples](https://atlassian.design/components/avatar/examples)
 * - [Code](https://atlassian.design/components/avatar/code)
 * - [Usage](https://atlassian.design/components/avatar/usage)
 */
const Avatar = forwardRef<HTMLElement, AvatarPropTypes>(
  (
    {
      analyticsContext,
      appearance = 'circle' as AppearanceType,
      label,
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
         */
        const context: Record<string, any> = {
          componentName: 'avatar',
          packageName,
          packageVersion,
          ...lastAnalytics.current,
        };

        analyticsEvent.context.push(context);

        /**
         * Replicating the logic in the `withAnalyticsEvents` HOC
         */
        const clone: UIAnalyticsEvent | null = analyticsEvent.clone();
        if (clone) {
          clone.fire('atlaskit');
        }

        onClick(event, analyticsEvent);
      },
      [createAnalyticsEvent, isDisabled, onClick],
    );

    const getTestId = (testId?: string, children?: ReactNode) =>
      !children
        ? { 'data-testid': `${testId}--inner` }
        : { testId: `${testId}--inner` };

    const componentProps = () => {
      if (isDisabled) {
        return { disabled: true };
      }

      // return only relevant props for either anchor or button elements
      return {
        ...(href && getLinkProps(href, target)),
        ...(onClick && !href ? getButtonProps(onClickHandler) : { onClick }),
      };
    };

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
                isInteractive: Boolean(href || onClick) && !isDisabled,
                isDisabled,
              }),
              ...componentProps(),
              ...(testId && getTestId(testId, children)),
              ...((onClick || href) && { 'aria-label': label }),
              children: (
                <AvatarImage
                  alt={name}
                  appearance={appearance!}
                  size={size!}
                  src={src}
                  testId={testId}
                />
              ),
              ref,
            };

            return children
              ? children(props)
              : createElement(
                  getCustomElement(isDisabled, href, onClick),
                  props,
                );
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
