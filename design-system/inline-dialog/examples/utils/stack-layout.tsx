/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

const spacingScale = {
  SMALLEST: gridSize() * 0.5,
  SMALL: gridSize() * 1,
  MEDIUM: gridSize() * 2,
  LARGE: gridSize() * 3,
  XLARGE: gridSize() * 4,
  XXLARGE: gridSize() * 5,
  LARGEST: gridSize() * 20,
};

const CSS_SIZE_SPACING = '--size-spacing';

const stackLayoutStyles = css({
  display: 'grid',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  gap: `var(${CSS_SIZE_SPACING})`,
  gridAutoFlow: 'column',
});

const gridTemplateColumnStyles = css({
  gridTemplateColumns: '5fr',
});

const gridAutoFlowStyles = css({
  gridAutoFlow: 'row',
});

interface StackLayoutProps {
  direction: 'VERTICAL' | 'HORIZONTAL';
  size?:
    | 'SMALLEST'
    | 'SMALL'
    | 'MEDIUM'
    | 'LARGE'
    | 'XLARGE'
    | 'XXLARGE'
    | 'LARGEST';
  testId?: string;
  children: ReactNode;
}

/**
 * __Stack layout__
 *
 * A stack layout makes it easy to stack UI components together for VR tests.
 *
 */
const StackLayout = ({
  children,
  direction = 'VERTICAL',
  size = 'MEDIUM',
  testId,
}: StackLayoutProps) => {
  return (
    <div
      css={[
        stackLayoutStyles,
        direction === 'VERTICAL' && gridTemplateColumnStyles,
        direction === 'VERTICAL' && gridAutoFlowStyles,
      ]}
      data-testid={testId}
      style={
        { [CSS_SIZE_SPACING]: `${spacingScale[size]}px` } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default StackLayout;
