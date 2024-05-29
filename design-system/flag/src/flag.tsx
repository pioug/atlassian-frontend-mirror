/** @jsx jsx */
import { type FC, useCallback, useEffect, useState, type CSSProperties } from 'react';

import { jsx, css } from '@emotion/react';

import { Inline, Stack, Box, xcss, Text } from '@atlaskit/primitives';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import noop from '@atlaskit/ds-lib/noop';

import { DEFAULT_APPEARANCE } from './constants';
import {
  flagTextColor,
  flagBackgroundColor,
  flagIconColor,
  flagTextColorToken,
} from './theme';
import type { FlagProps } from './types';

import Actions from './flag-actions';
import { useFlagGroup } from './flag-group';
import { Expander, DismissButton } from './internal';

const CSS_VAR_ICON_COLOR = '--flag-icon-color';

// For cases where a single word is longer than the container (e.g. filenames)
const overflowWrapStyles = xcss({
  overflowWrap: 'anywhere',
});

const descriptionStyles = css({
  maxHeight: 100, // height is defined as 5 lines maximum by design
  overflow: 'auto',
  overflowWrap: 'anywhere', // For cases where a single word is longer than the container (e.g. filenames)
});

const iconWrapperStyles = css({
  display: 'flex',
  alignItems: 'start',
  flexShrink: 0,
  color: `var(${CSS_VAR_ICON_COLOR})`,
});

const flagStyles = xcss({
  boxShadow: 'elevation.shadow.overlay',
  borderRadius: 'border.radius.100',
  overflow: 'hidden',
  zIndex: 'flag',
  width: '100%',
  transition: 'background-color 200ms',
});

const flagWrapperStyles = css({
  width: '100%',
});

const analyticsAttributes = {
  componentName: 'flag',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const transitionStyles = css({
  flexGrow: 1,
  transition: `gap 0.3s`,
});

/**
 * __Flag__
 *
 * A flag is used for confirmations, alerts, and acknowledgments that require minimal user interaction,
 * often displayed using a flag group.
 *
 * - [Examples](https://atlassian.design/components/flag/examples)
 * - [Code](https://atlassian.design/components/flag/code)
 * - [Usage](https://atlassian.design/components/flag/usage)
 */
const Flag: FC<FlagProps> = (props) => {
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

  const { onDismissed: onDismissedFromFlagGroup, isDismissAllowed } =
    useFlagGroup();

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

  const toggleExpand = useCallback(() => {
    setIsExpanded((previous) => !previous);
  }, []);

  const buttonActionCallback = useCallback(() => {
    if (isDismissAllowed) {
      onDismissedAnalytics(id);
    }
  }, [onDismissedAnalytics, id, isDismissAllowed]);

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

  const textColor = flagTextColor[appearance];
  const iconColor = flagIconColor[appearance];
  const isDismissable = isBold || isDismissAllowed;
  const shouldRenderGap =
    (!isBold && (description || actions.length)) || isExpanded;

  return (
    <div
      role="alert"
      css={flagWrapperStyles}
      data-testid={testId}
      {...autoDismissProps}
    >
      <Box
        backgroundColor={flagBackgroundColor[appearance]}
        padding="space.200"
        xcss={flagStyles}
      >
        <Inline alignBlock="stretch" space="space.200">
          <div
            css={iconWrapperStyles}
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
            style={{ [CSS_VAR_ICON_COLOR]: iconColor } as CSSProperties}
          >
            {icon}
          </div>
          <span css={transitionStyles}>
            <Stack
              space={shouldRenderGap ? 'space.100' : 'space.0'} // Gap exists even when not expanded due to Expander internals always being in the DOM
            >
              <Inline
                alignBlock="stretch"
                space="space.100"
                spread="space-between"
              >
                <Box paddingBlockStart="space.025" xcss={overflowWrapStyles}>
                  <Text color={textColor} weight="semibold">
                    {title}
                  </Text>
                </Box>
                {isDismissable
                  ? !(isBold && !description && !actions.length) && (
                      <DismissButton
                        testId={testId}
                        appearance={appearance}
                        isBold={isBold}
                        isExpanded={isExpanded}
                        onClick={isBold ? toggleExpand : buttonActionCallback}
                      />
                    )
                  : null}
              </Inline>
              {/* Normal appearance can't be expanded so isExpanded is always true */}
              <Expander isExpanded={!isBold || isExpanded} testId={testId}>
                {description && (
                  <div
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
                    style={{ color: flagTextColorToken[appearance] }}
                    css={descriptionStyles}
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
                />
              </Expander>
            </Stack>
          </span>
        </Inline>
      </Box>
    </div>
  );
};

export default Flag;
