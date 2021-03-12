/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/core';

import { headingItemCSS } from '../internal/styles/menu-item/heading-item';
import type { HeadingItemProps } from '../types';

const HeadingItem = memo(
  ({ children, testId, id, cssFn = () => ({}), ...rest }: HeadingItemProps) => {
    return (
      <div
        css={[headingItemCSS, cssFn(undefined)]}
        data-testid={testId}
        data-ds--menu--heading-item
        id={id}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export default HeadingItem;
