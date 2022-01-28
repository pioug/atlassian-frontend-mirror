/** @jsx jsx */
import { memo } from 'react';

import { css, jsx } from '@emotion/core';

import noop from '@atlaskit/ds-lib/noop';
import { N200 } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import type { HeadingItemProps } from '../types';

const gridSize = gridSizeFn();
const itemSidePadding = gridSize * 2.5;
const itemHeadingContentHeight = headingSizes.h100.lineHeight;
const itemHeadingFontSize = headingSizes.h100.size;

const headingStyles = css({
  padding: `0 ${itemSidePadding}px`,
  color: token('color.text.subtlest', N200),
  fontSize: itemHeadingFontSize,
  fontWeight: 700,
  lineHeight: itemHeadingContentHeight / itemHeadingFontSize,
  textTransform: 'uppercase',
});

/**
 * __Heading item__
 *
 * A heading item is used to describe sibling menu items.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/heading-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const HeadingItem = memo(
  ({
    children,
    testId,
    id,
    cssFn = noop as any,
    ...rest
  }: HeadingItemProps) => {
    return (
      <div
        css={[
          headingStyles,
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          cssFn(undefined),
        ]}
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
