/** @jsx jsx */
import { forwardRef, memo, MouseEvent, useCallback, useRef } from 'react';

import { css, jsx } from '@emotion/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import noop from '@atlaskit/ds-lib/noop';
import { DN90A, N100A } from '@atlaskit/theme/colors';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { layers } from '@atlaskit/theme/constants';
import type { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import type { BlanketProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const analyticsAttributes = {
  componentName: 'blanket',
  packageName,
  packageVersion,
};

const baseStyles = css({
  position: 'fixed',
  zIndex: layers.blanket(),
  inset: 0,
  overflowY: 'auto',
  pointerEvents: 'initial',
});

const shouldAllowClickThroughStyles = css({
  pointerEvents: 'none',
});

const invisibleStyles = css({
  backgroundColor: 'transparent',
});

const lightBgStyles = css({
  backgroundColor: token('color.blanket', N100A),
});

const darkBgStyles = css({
  backgroundColor: token('color.blanket', DN90A),
});

const backgroundStyle: { [index in ThemeModes]: ReturnType<typeof css> } = {
  light: lightBgStyles,
  dark: darkBgStyles,
};

/**
 * __Blanket__
 *
 * A Blanket provides the overlay layer for components such as a modal dialog or a tooltip
 *
 * - [Examples](https://atlaskit.atlassian.com/examples/design-system/blanket/basic-usage)
 */
const Blanket = memo(
  forwardRef<HTMLDivElement, BlanketProps>(function Blanket(
    {
      shouldAllowClickThrough = false,
      isTinted = false,
      onBlanketClicked = noop,
      testId,
      children,
      analyticsContext,
    },
    ref,
  ) {
    const { mode }: { mode: ThemeModes } = useGlobalTheme();
    const mouseDownTarget = useRef<EventTarget | null>(null);

    const onBlanketClickedWithAnalytics = usePlatformLeafEventHandler({
      fn: onBlanketClicked,
      action: 'clicked',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });

    const blanketClickOutsideChildren = useCallback(
      (e: MouseEvent<HTMLDivElement>) =>
        e.currentTarget === e.target && mouseDownTarget.current === e.target
          ? onBlanketClickedWithAnalytics(e)
          : undefined,
      [onBlanketClickedWithAnalytics],
    );

    const onClick = shouldAllowClickThrough
      ? undefined
      : blanketClickOutsideChildren;

    const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
      mouseDownTarget.current = e.target;
    }, []);

    return (
      <div
        role="presentation"
        css={[
          baseStyles,
          shouldAllowClickThrough && shouldAllowClickThroughStyles,
          backgroundStyle[mode],
          !isTinted && invisibleStyles,
        ]}
        onClick={onClick}
        onMouseDown={onMouseDown}
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
