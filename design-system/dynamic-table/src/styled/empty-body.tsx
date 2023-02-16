/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';

const fixedHeightStyles = css({
  height: `${gridSize() * 18}px`,
});

export const EmptyViewWithFixedHeight: FC<{ testId?: string }> = ({
  children,
  testId,
}) => (
  <div
    css={fixedHeightStyles}
    data-testid={testId && `${testId}--empty-view-with-fixed-height`}
  >
    {children}
  </div>
);

const emptyViewContainerStyles = css({
  width: '50%',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  margin: 'auto',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  padding: '10px',
  textAlign: 'center',
});

export const EmptyViewContainer: FC<{ testId?: string }> = (props) => {
  const { children, testId } = props;
  return (
    <div
      css={emptyViewContainerStyles}
      data-testid={testId && `${testId}--empty-view-container`}
    >
      {children}
    </div>
  );
};
