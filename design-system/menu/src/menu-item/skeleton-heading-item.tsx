/** @jsx jsx */
import type { CSSProperties } from 'react';

import { css, jsx } from '@emotion/react';

import noop from '@atlaskit/ds-lib/noop';
import { N20A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import SkeletonShimmer from '../internal/components/skeleton-shimmer';
import type { SkeletonHeadingItemProps } from '../types';

const skeletonStyles = css({
  padding: `${token('spacing.scale.0', '0px')} ${token(
    'spacing.scale.250',
    '20px',
  )}`,
  '::after': {
    display: 'block',
    width: '30%',
    height: token('spacing.scale.100', '8px'),
    backgroundColor: token('color.skeleton', N20A),
    borderRadius: 100,
    content: '""',
  },
});

const defaultWidthStyles = css({
  '::after': {
    width: '30%',
  },
});

const customWidthStyles = css({
  '::after': {
    width: 'var(--width)',
  },
});

/**
 * __Skeleton heading item__
 *
 * A skeleton heading item is used in place of a heading item when its contents it not ready.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/skeleton-heading-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const SkeletonHeadingItem = ({
  isShimmering = false,
  testId,
  width,
  cssFn = noop as any,
}: SkeletonHeadingItemProps) => (
  <SkeletonShimmer isShimmering={isShimmering}>
    {({ className }) => (
      <div
        className={className}
        style={
          {
            '--width': width,
          } as CSSProperties
        }
        css={[
          skeletonStyles,
          width ? customWidthStyles : defaultWidthStyles,
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          css(cssFn(undefined)),
        ]}
        data-ds--menu--skeleton-heading-item
        data-testid={testId}
      />
    )}
  </SkeletonShimmer>
);

export default SkeletonHeadingItem;
