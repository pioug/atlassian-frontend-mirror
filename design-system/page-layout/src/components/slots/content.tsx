/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import { contentStyles } from './styles';

interface ContentProps {
  /** React children! */
  children: ReactNode;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   **/
  testId?: string;
}

const Content = (props: ContentProps) => {
  const { children, testId } = props;

  return (
    <div data-testid={testId} css={contentStyles}>
      {children}
    </div>
  );
};

export default Content;
