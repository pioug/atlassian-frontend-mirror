/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

type EmptyViewWithFixedHeightProps = {
  testId?: string;
  children?: ReactNode;
};

type EmptyViewContainerProps = {
  testId?: string;
  children: ReactNode;
};

const fixedHeightStyles = css({
  height: `${gridSize() * 18}px`,
});

export const EmptyViewWithFixedHeight: FC<EmptyViewWithFixedHeightProps> = ({
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
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  margin: 'auto',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  padding: '10px',
  textAlign: 'center',
});

export const EmptyViewContainer: FC<EmptyViewContainerProps> = (props) => {
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
