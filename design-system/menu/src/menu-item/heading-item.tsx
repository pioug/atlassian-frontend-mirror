/** @jsx jsx */
import { memo } from 'react';

import { css, jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
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
    // Although this isn't defined on props it is available because we've used
    // Spread props below and on the jsx element. To forcibly block usage I've
    // picked it out and supressed the expected type error.
    // @ts-expect-error
    className: UNSAFE_className,
    ...rest
  }: HeadingItemProps) => {
    propDeprecationWarning(
      process.env._PACKAGE_NAME_,
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
      <div
        css={[
          headingStyles,
          // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
          UNSAFE_overrides,
        ]}
        data-testid={testId}
        data-ds--menu--heading-item
        id={id}
        className={
          getBooleanFF(
            'platform.design-system-team.unsafe-overrides-killswitch_c8j9m',
          )
            ? undefined
            : UNSAFE_className
        }
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export default HeadingItem;
