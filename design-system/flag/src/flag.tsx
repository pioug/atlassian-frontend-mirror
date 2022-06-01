/** @jsx jsx */
import { useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  borderRadius,
  gridSize as getGridSize,
  layers,
} from '@atlaskit/theme/constants';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { token } from '@atlaskit/tokens';
import noop from '@atlaskit/ds-lib/noop';
import FocusRing from '@atlaskit/focus-ring';

import { DEFAULT_APPEARANCE } from './constants';
import {
  flagBorderColor,
  flagShadowColor,
  getFlagBackgroundColor,
  getFlagTextColor,
  getFlagIconColor,
} from './theme';
import type { FlagProps } from './types';

import Actions from './flag-actions';
import { useFlagGroup } from './flag-group';
import { Title, Description, Expander, DismissButton } from './internal';

const analyticsAttributes = {
  componentName: 'flag',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const gridSize = getGridSize();
const doubleGridSize = gridSize * 2;
const headerHeight = gridSize * 4;

const iconStyles = css({
  display: 'flex',
  height: headerHeight,
  alignItems: 'center',
});

const flagHeaderStyles = css({
  boxSizing: 'border-box',
  width: '100%',
  padding: doubleGridSize,
  borderRadius: borderRadius(),
});

const flagContainerStyles = css({
  width: '100%',
  zIndex: layers.flag(),
  borderRadius: borderRadius(),
  transition: 'background-color 200ms',
});

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

  let boxShadowValue = `0 20px 32px -8px ${flagShadowColor}`;
  if (!isBold) {
    boxShadowValue = `0 0 1px ${flagBorderColor}, ${boxShadowValue}`;
  }
  const boxShadow = token('elevation.shadow.overlay', boxShadowValue);

  const { mode } = useGlobalTheme();

  const textColor = getFlagTextColor(appearance, mode);
  const iconColor = getFlagIconColor(appearance, mode);
  const isDismissable = isBold || isDismissAllowed;

  return (
    <div
      style={{
        color: textColor,
        backgroundColor: getFlagBackgroundColor(appearance, mode),
        boxShadow,
      }}
      css={flagContainerStyles}
      role="alert"
      data-testid={testId}
      {...autoDismissProps}
    >
      <FocusRing>
        <div
          css={flagHeaderStyles}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <div style={{ color: iconColor }} css={iconStyles}>
            {icon}
            <Title color={textColor}>{title}</Title>
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
          </div>
          {/* Normal appearance can't be expanded so isExpanded is always true */}
          <Expander isExpanded={!isBold || isExpanded} testId={testId}>
            {description && (
              <Description
                testId={testId && `${testId}-description`}
                color={textColor}
              >
                {description}
              </Description>
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
      </FocusRing>
    </div>
  );
};

export default Flag;
