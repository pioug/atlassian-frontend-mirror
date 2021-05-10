/** @jsx jsx */
import React from 'react';

import { CSSObject, jsx } from '@emotion/core';

type BaseProps = React.AllHTMLAttributes<HTMLElement> & {
  before?: JSX.Element;
  contentElement: JSX.Element;
  after?: JSX.Element;
  testId?: string;
  tagCss: (CSSObject | (CSSObject | undefined)[] | undefined)[];
};

const BaseTag = React.forwardRef<HTMLDivElement, BaseProps>(function BaseTag(
  { before, contentElement, after, testId, tagCss, ...other }: BaseProps,
  ref,
) {
  return (
    <span {...other} ref={ref} css={tagCss} data-testid={testId}>
      {before}
      {contentElement}
      {after}
    </span>
  );
});

export default BaseTag;
