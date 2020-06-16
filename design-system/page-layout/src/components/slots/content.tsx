/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import { contentStyles } from './styles';

const Content = (props: { children: ReactNode; testId?: string }) => {
  const { children, testId } = props;

  return (
    <div data-testid={testId} css={contentStyles}>
      {children}
    </div>
  );
};

export default Content;
