/** @jsx jsx */
import { useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/core';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import GlobalTheme from '@atlaskit/theme/components';
import {
  borderRadius,
  gridSize as getGridSize,
  layers,
} from '@atlaskit/theme/constants';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';

import { DEFAULT_APPEARANCE } from './constants';
import {
  flagBorderColor,
  flagShadowColor,
  getFlagBackgroundColor,
  getFlagFocusRingColor,
  getFlagTextColor,
} from './theme';
import { FlagProps } from './types';

import Expander from './expander';
import Actions from './flag-actions';
import { useFlagGroup } from './flag-group';

function noop() {}

const analyticsAttributes = {
  componentName: 'flag',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const gridSize = getGridSize();
const doubleGridSize = gridSize * 2;
const headerHeight = gridSize * 4;

const Flag = (props: FlagProps) => {
  const {
    actions = [],
    appearance = DEFAULT_APPEARANCE,
    icon,
    title,
    description,
    linkComponent,
    onMouseOver,
    onFocus = noop,
    onMouseOut,
    onBlur = noop,
    onDismissed: onDismissedProp = noop,
    testId,
    id,
    analyticsContext,
  } = props;

  const {
    onDismissed: onDismissedFromFlagGroup,
    isDismissAllowed,
  } = useFlagGroup();

  const onDismissed = useCallback(
    (id: string | number, analyticsEvent: UIAnalyticsEvent) => {
      onDismissedProp(id, analyticsEvent);
      onDismissedFromFlagGroup(id, analyticsEvent);
    },
    [onDismissedProp, onDismissedFromFlagGroup],
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const onDismissedAnalytics = usePlatformLeafEventHandler({
    fn: onDismissed,
    action: 'dismissed',
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

  const isBold = appearance !== DEFAULT_APPEARANCE;

  const renderToggleOrDismissButton = useCallback(
    ({ mode }: { mode: ThemeModes }) => {
      // If it is normal appearance a toggle button cannot be rendered
      // Ensure onDismissed is defined and isDismissAllowed is true to render
      // the dismiss button
      if (!isBold && !isDismissAllowed) {
        return null;
      }

      // If it is bold then ensure there is a description or actions to render
      // the toggle button
      if (isBold && !description && !actions.length) {
        return null;
      }

      let ButtonIcon = CrossIcon;
      let buttonLabel = 'Dismiss';
      let buttonAction = () => {
        if (isDismissAllowed) {
          onDismissedAnalytics(id);
        }
      };
      let size: 'small' | 'large' = 'small';
      let buttonTestId = testId && `${testId}-dismiss`;
      let a11yProps = {};
      if (isBold) {
        ButtonIcon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
        buttonLabel = isExpanded ? 'Collapse' : 'Expand';
        buttonAction = () => setIsExpanded(!isExpanded);
        size = 'large';
        buttonTestId = testId && `${testId}-toggle`;
        a11yProps = { 'aria-expanded': isExpanded };
      }
      return (
        <button
          css={css`
            appearance: none;
            background: none;
            border: none;
            border-radius: ${borderRadius()}px;
            color: ${getFlagTextColor(appearance, mode)};
            cursor: pointer;
            flex: 0 0 auto;
            line-height: 1;
            margin-left: ${gridSize}px;
            padding: 0;
            white-space: nowrap;
            &:focus {
              outline: none;
              box-shadow: 0 0 0 2px ${getFlagFocusRingColor(appearance, mode)};
            }
          `}
          onClick={buttonAction}
          data-testid={buttonTestId}
          type="button"
          {...a11yProps}
        >
          <ButtonIcon label={buttonLabel} size={size} />
        </button>
      );
    },
    [
      actions.length,
      appearance,
      description,
      id,
      isBold,
      isDismissAllowed,
      isExpanded,
      onDismissedAnalytics,
      testId,
    ],
  );

  useEffect(() => {
    // If buttons are removed as a prop, update isExpanded to be false
    if (isBold && isExpanded && !description && !actions.length) {
      setIsExpanded(false);
    }
  }, [actions.length, description, isBold, isExpanded]);

  const onFocusAnalytics = usePlatformLeafEventHandler({
    fn: onFocus,
    action: 'focused',
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

  const onBlurAnalytics = usePlatformLeafEventHandler({
    fn: onBlur,
    action: 'blurred',
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

  const autoDismissProps = {
    onMouseOver,
    onFocus: onFocusAnalytics,
    onMouseOut,
    onBlur: onBlurAnalytics,
  };
  const OptionalDismissButton = renderToggleOrDismissButton;

  let boxShadow = `0 20px 32px -8px ${flagShadowColor}`;
  if (!isBold) {
    boxShadow = `0 0 1px ${flagBorderColor}, ${boxShadow}`;
  }

  return (
    <GlobalTheme.Consumer>
      {(tokens: GlobalThemeTokens) => {
        const mode = tokens.mode;
        const textColour = getFlagTextColor(appearance, mode);
        return (
          <div
            css={css`
              background-color: ${getFlagBackgroundColor(appearance, mode)};
              border-radius: ${borderRadius()}px;
              box-shadow: ${boxShadow};
              color: ${textColour};
              transition: background-color 200ms;
              width: 100%;
              z-index: ${layers.flag()};
            `}
            role="alert"
            data-testid={testId}
            {...autoDismissProps}
          >
            <div
              css={css`
                width: 100%;
                padding: ${doubleGridSize}px;
                box-sizing: border-box;
                border-radius: ${borderRadius()}px;

                &:focus-visible {
                  outline: none;
                  box-shadow: 0 0 0 2px
                    ${getFlagFocusRingColor(appearance, mode)};
                }

                @supports not selector(*:focus-visible) {
                  &:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px
                      ${getFlagFocusRingColor(appearance, mode)};
                  }
                }

                @media screen and (forced-colors: active),
                  screen and (-ms-high-contrast: active) {
                  &:focus-visible {
                    outline: 1px solid;
                  }
                }
              `}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  height: ${headerHeight}px;
                `}
              >
                {icon}
                <span
                  css={css`
                    color: ${textColour};
                    font-weight: 600;
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding: 0 0 0 ${doubleGridSize}px;
                  `}
                >
                  {title}
                </span>
                <OptionalDismissButton mode={mode} />
              </div>
              {/* Normal appearance can't be expanded so isExpanded is always true */}
              <Expander isExpanded={!isBold || isExpanded} testId={testId}>
                {description && (
                  <div
                    css={css`
                      color: ${textColour};
                      word-wrap: break-word;
                      overflow: auto;
                      max-height: 100px; /* height is defined as 5 lines maximum by design */
                    `}
                    data-testid={testId && `${testId}-description`}
                  >
                    {description}
                  </div>
                )}
                <Actions
                  actions={actions}
                  appearance={appearance}
                  linkComponent={linkComponent}
                  testId={testId}
                  mode={mode}
                />
              </Expander>
            </div>
          </div>
        );
      }}
    </GlobalTheme.Consumer>
  );
};

export default Flag;
