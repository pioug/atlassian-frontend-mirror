/** @jsx jsx */
import React from 'react';

import { CSSObject, jsx } from '@emotion/core';

type BaseProps = React.AllHTMLAttributes<HTMLElement> & {
  before?: JSX.Element;
  contentElement: JSX.Element;
  after?: JSX.Element;
  role?: string;
  testId?: string;
  tagCss: ((CSSObject | undefined)[] | undefined)[];
};

const BaseTag = React.forwardRef<HTMLDivElement, BaseProps>(function BaseTag(
  { before, contentElement, after, testId, role, tagCss, ...other }: BaseProps,
  ref,
) {
  return (
    <span {...other} role={role} ref={ref} css={tagCss} data-testid={testId}>
      {before}
      {contentElement}
      {after}
    </span>
  );
});

export default BaseTag;
