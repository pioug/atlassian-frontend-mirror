/** @jsx jsx */
import React, { forwardRef, memo, MouseEvent, useCallback } from 'react';

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
  zIndex: layers.blanket(),
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  opacity: 1,
  overflowY: 'auto',
  pointerEvents: 'initial',
});

const shouldAllowClickThroughStyle = css({
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
      shouldAllowClickThrough = false,
      isTinted = false,
      onBlanketClicked = noop,
      testId,
      children,
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

    const blanketClickOutsideChildren = useCallback(
      (e: MouseEvent<HTMLDivElement>) =>
        e.currentTarget === e.target
          ? onBlanketClickedWithAnalytics(e)
          : undefined,
      [onBlanketClickedWithAnalytics],
    );

    const onClick = shouldAllowClickThrough
      ? undefined
      : blanketClickOutsideChildren;

    return (
      <div
        role="presentation"
        css={[
          baseStyle,
          !isTinted && invisible,
          shouldAllowClickThrough && shouldAllowClickThroughStyle,
          backgroundStyle[mode],
        ]}
        onClick={onClick}
        data-testid={testId}
        ref={ref}
      >
        {children}
      </div>
    );
  }),
);

Blanket.displayName = 'Blanket';

export default Blanket;
