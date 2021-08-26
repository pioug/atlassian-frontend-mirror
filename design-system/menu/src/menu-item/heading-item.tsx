/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/core';

import { headingItemCSS } from '../internal/styles/menu-item/heading-item';
import type { HeadingItemProps } from '../types';

/**
 * __Heading item__
 *
 * A heading item is used to describe sibling menu items.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/heading-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const HeadingItem = memo(
  ({ children, testId, id, cssFn = () => ({}), ...rest }: HeadingItemProps) => {
    return (
      <div
        // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
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
