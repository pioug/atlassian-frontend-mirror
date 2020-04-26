/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';

import { HeadingItemProps } from '../types';

import { itemHeadingCSS } from './styles';

const HeadingItem = ({
  children,
  testId,
  id,
  cssFn = (css: CSSObject) => css,
  ...rest
}: HeadingItemProps) => {
  return (
    <div
      css={cssFn(itemHeadingCSS, undefined)}
      data-testid={testId}
      id={id}
      {...rest}
    >
      {children}
    </div>
  );
};

export default HeadingItem;
