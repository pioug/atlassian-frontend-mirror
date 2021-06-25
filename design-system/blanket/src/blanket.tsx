/** @jsx jsx */
import React, { forwardRef, memo } from 'react';

import { css, jsx } from '@emotion/core';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import noop from '@atlaskit/ds-lib/noop';
import { DN90A, N100A } from '@atlaskit/theme/colors';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { layers } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';

import type { BlanketProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const analyticsAttributes = {
  componentName: 'blanket',
  packageName,
  packageVersion,
};

const baseStyle = css({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  pointerEvents: 'initial',
  opacity: 1,
  zIndex: layers.blanket(),
});

const canClickThroughStyle = css({
  pointerEvents: 'none',
});

const invisible = css({
  opacity: 0,
});

const lightBg = css({
  backgroundColor: N100A,
});

const darkBg = css({
  backgroundColor: DN90A,
});

const backgroundStyle: { [index in ThemeModes]: ReturnType<typeof css> } = {
  light: lightBg,
  dark: darkBg,
};

/**
 * __Blanket__
 *
 * A Blanket provides the overlay layer for components such as a modal dialog or a tooltip
 *
 * - [Examples](https://atlaskit.atlassian.com/examples/design-system/blanket/basic-usage)
 */
const Blanket = memo(
  forwardRef(function Blanket(
    {
      canClickThrough = false,
      isTinted = false,
      onBlanketClicked = noop,
      testId,
      analyticsContext,
    }: BlanketProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { mode }: { mode: ThemeModes } = useGlobalTheme();
    const onBlanketClickedWithAnalytics = usePlatformLeafEventHandler({
      fn: onBlanketClicked,
      action: 'clicked',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });
    const onClick = canClickThrough ? undefined : onBlanketClickedWithAnalytics;

    return (
      <div
        role="presentation"
        css={[
          baseStyle,
          !isTinted && invisible,
          canClickThrough && canClickThroughStyle,
          backgroundStyle[mode],
        ]}
        onClick={onClick}
        data-testid={testId}
        ref={ref}
      ></div>
    );
  }),
);

Blanket.displayName = 'Blanket';

export default Blanket;
