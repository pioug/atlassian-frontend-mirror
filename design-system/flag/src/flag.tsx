/** @jsx jsx */
import { FC, useCallback, useEffect, useState } from 'react';

import { jsx, css } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import Inline from '@atlaskit/primitives/inline';
import Stack from '@atlaskit/primitives/stack';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import noop from '@atlaskit/ds-lib/noop';
import FocusRing from '@atlaskit/focus-ring';

import { DEFAULT_APPEARANCE } from './constants';
import { flagTextColor, flagBackgroundColor, flagIconColor } from './theme';
import type { FlagProps } from './types';

import Actions from './flag-actions';
import { useFlagGroup } from './flag-group';
import { Expander, DismissButton } from './internal';

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
    <FocusRing>
      <Box
        display="block"
        backgroundColor={flagBackgroundColor[appearance]}
        shadow="overlay"
        padding="space.200"
        borderRadius="normal"
        overflow="hidden"
        layer="flag"
        UNSAFE_style={{
          width: '100%',
          transition: 'background-color 200ms',
        }}
        role="alert"
        tabIndex={0}
        testId={testId}
        {...autoDismissProps}
      >
        <Inline space="space.200">
          <Box
            alignItems="start"
            UNSAFE_style={{ color: iconColor, flexShrink: 0 }}
          >
            {icon}
          </Box>
          <span css={transitionStyles}>
            <Stack
              space={shouldRenderGap ? 'space.100' : 'space.0'} // Gap exists even when not expanded due to Expander internals always being in the DOM
            >
              <Inline space="space.100" spread="space-between">
                <Box display="block" UNSAFE_style={{ paddingTop: 2 }}>
                  <Text
                    color={textColor}
                    fontWeight="semibold"
                    UNSAFE_style={{
                      overflowWrap: 'anywhere', // For cases where a single word is longer than the container (e.g. filenames)
                    }}
                  >
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
                  <Text
                    as="div"
                    color={textColor}
                    UNSAFE_style={{
                      maxHeight: 100, // height is defined as 5 lines maximum by design
                      overflow: 'auto',
                      overflowWrap: 'anywhere', // For cases where a single word is longer than the container (e.g. filenames)
                    }}
                    testId={testId && `${testId}-description`}
                  >
                    {description}
                  </Text>
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
    </FocusRing>
  );
};

export default Flag;
