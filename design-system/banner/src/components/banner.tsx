/** @jsx jsx */
import React, { FC, useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/core';

import { N0, N500, N700, R400, Y300 } from '@atlaskit/theme/colors';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gridSize = getGridSize();
const MAX_HEIGHT = gridSize * 6.5;

const iconStyles = css({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  flexDirection: 'column',
  '@media screen and (forced-colors: active)': {
    fill: 'CanvasText',
    filter: 'grayscale(100%)',
  },
});

const overflowStyles = css({
  overflow: 'hidden',
});

const contentStyles = css({
  display: 'flex',
  margin: 'auto',
  padding: gridSize * 1.5,
  alignItems: 'center',
  justifyContent: 'start',
  color: 'currentColor',
  fontWeight: 500,
  textAlign: 'center',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  'a, a:visited, a:hover, a:focus, a:active': {
    color: 'currentColor',
    textDecoration: 'underline',
  },
});

const childrenTextStyles = css({
  padding: gridSize / 2,
  flex: '0 1 auto',
  alignSelf: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const containerStyles = css({
  maxHeight: MAX_HEIGHT,
});

const appearanceStyles = {
  warning: {
    backgroundColor: token('color.background.warning.bold', Y300),
    color: token('color.text.warning.inverse', N700),
  },
  error: {
    backgroundColor: token('color.background.danger.bold', R400),
    color: token('color.text.inverse', N0),
  },
  announcement: {
    backgroundColor: token('color.background.neutral.bold', N500),
    color: token('color.text.inverse', N0),
  },
};

interface BannerProps {
  /**
   * Visual style to be used for the banner
   */
  appearance?: 'warning' | 'error' | 'announcement';
  /**
   * Content to be shown next to the icon. Typically text content but can contain links.
   */
  children?: React.ReactNode;
  /**
   * Icon to be shown left of the main content. Typically an Atlaskit [@atlaskit/icon](packages/design-system/icon)
   */
  icon?: React.ReactChild;
  /**
   * Defines whether the banner is shown. An animation is used when the value is changed.
   */
  isOpen?: boolean;
  /**
   * Returns the inner ref of the component. This is exposed so the height can be used in page.
   */
  innerRef?: (element: HTMLElement) => void;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;
}

const Banner: FC<BannerProps> = ({
  appearance = 'warning',
  children,
  icon,
  isOpen = false,
  innerRef,
  testId,
}) => {
  const [maxHeight, setMaxHeight] = useState(0);

  const bannerRef = useCallback(
    (ref: HTMLElement | null) => {
      if (!ref) {
        return;
      }

      if (innerRef) {
        innerRef(ref);
      }

      setMaxHeight(ref.clientHeight);
    },

    [innerRef],
  );

  const accessibilityProps = useMemo(() => {
    let baseProps = {
      'aria-hidden': !isOpen,
      role: 'alert',
    };

    if (appearance === 'announcement') {
      return {
        ...baseProps,
        'aria-label': 'announcement',
        tabIndex: 0,
        role: 'region',
      };
    }

    return baseProps;
  }, [isOpen, appearance]);

  return (
    <div
      css={overflowStyles}
      style={{ maxHeight: `${isOpen ? maxHeight : 0}px` }}
      data-testid={testId}
    >
      <div
        css={[containerStyles]}
        style={{
          ...appearanceStyles[appearance],
        }}
        ref={bannerRef}
        {...accessibilityProps}
      >
        <div css={[contentStyles]}>
          <span
            css={iconStyles}
            style={{
              fill: appearanceStyles[appearance].backgroundColor,
            }}
          >
            {icon}
          </span>
          <span css={[childrenTextStyles]}>{children}</span>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Banner;
