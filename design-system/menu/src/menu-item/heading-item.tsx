/** @jsx jsx */
import { memo } from 'react';

import { css, jsx } from '@emotion/react';

import noop from '@atlaskit/ds-lib/noop';
import { N300 } from '@atlaskit/theme/colors';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import type { HeadingItemProps } from '../types';

const itemHeadingContentHeight = headingSizes.h100.lineHeight;
const itemHeadingFontSize = headingSizes.h100.size;

const headingStyles = css({
  color: token('color.text.subtle', N300),
  fontSize: itemHeadingFontSize,
  fontWeight: token('font.weight.bold', '700'),
  lineHeight: itemHeadingContentHeight / itemHeadingFontSize,
  paddingBlock: token('space.0', '0px'),
  paddingInline: token('space.200', '16px'),
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
          css(cssFn(undefined)),
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
