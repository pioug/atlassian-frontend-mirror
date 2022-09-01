/** @jsx jsx */
import { useContext } from 'react';

import { css, jsx } from '@emotion/react';

import {
  defaultGridColumnWidth,
  defaultLayout,
  spacingMapping,
  varColumnsNum,
  varGridSpacing,
} from './constants';
import { GridContext } from './grid-context';
import type { GridProps } from './types';

const gridStyles = css({
  display: 'flex',
  margin: '0 auto',
  padding: `0 calc(var(${varGridSpacing}) / 2)`,
  position: 'relative',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
});

const gridLayoutStyles = {
  fixed: css({
    maxWidth: `calc(var(${varColumnsNum}) * ${defaultGridColumnWidth}px)`,
  }),
  fluid: css({
    maxWidth: '100%',
  }),
};

const nestedGridStyles = css({
  margin: `0 calc(-1 * var(${varGridSpacing}))`,
});

/**
 * __Grid__
 *
 * A container for one or more `GridColumn`.
 *
 * This is the internal component, which relies on the context provided by the
 * grid wrapper.
 *
 * @internal
 */
export const Grid: React.FC<GridProps> = ({
  layout = defaultLayout,
  testId,
  children,
}) => {
  const { isNested, columns, spacing } = useContext(GridContext);

  return (
    <div
      css={[gridStyles, gridLayoutStyles[layout], isNested && nestedGridStyles]}
      style={
        {
          [varColumnsNum]: columns,
          [varGridSpacing]: `${spacingMapping[spacing]}px`,
        } as React.CSSProperties
      }
      data-testid={testId}
    >
      {children}
    </div>
  );
};
