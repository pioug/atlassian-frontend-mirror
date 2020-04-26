/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import { contentStyles } from './styles';

export default (props: { children: ReactNode; testId?: string }) => {
  const { children, testId } = props;

  return (
    <div data-testid={testId} css={contentStyles}>
      {children}
    </div>
  );
};
