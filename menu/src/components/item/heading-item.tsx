/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';

import { itemHeadingCSS } from './styles';
import { HeadingItemProps } from '../types';

const HeadingItem = ({
  children,
  testId,
  id,
  cssFn = (currentStyles: CSSObject) => currentStyles,
  ...rest
}: HeadingItemProps) => (
  <div css={cssFn(itemHeadingCSS)} data-testid={testId} id={id} {...rest}>
    {children}
  </div>
);

export default HeadingItem;
