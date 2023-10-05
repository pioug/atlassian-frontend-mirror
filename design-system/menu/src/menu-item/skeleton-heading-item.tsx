/** @jsx jsx */
import type { CSSProperties } from 'react';

import { css, jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { N20A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import SkeletonShimmer from '../internal/components/skeleton-shimmer';
import type { SkeletonHeadingItemProps } from '../types';

const skeletonStyles = css({
  paddingBlock: token('space.0', '0px'),
  paddingInline: token('space.200', '16px'),
  '::after': {
    display: 'block',
    width: '30%',
    height: token('space.100', '8px'),
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
}: SkeletonHeadingItemProps) => {
  propDeprecationWarning(
    process.env._PACKAGE_NAME_ || '',
    'cssFn',
    cssFn !== (noop as any),
    '', // TODO: Create DAC post when primitives/xcss are available as alternatives
  );

  const UNSAFE_overrides = getBooleanFF(
    'platform.design-system-team.unsafe-overrides-killswitch_c8j9m',
  )
    ? undefined
    : css(cssFn(undefined));

  return (
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
            // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
            UNSAFE_overrides,
          ]}
          data-ds--menu--skeleton-heading-item
          data-testid={testId}
        />
      )}
    </SkeletonShimmer>
  );
};

export default SkeletonHeadingItem;
