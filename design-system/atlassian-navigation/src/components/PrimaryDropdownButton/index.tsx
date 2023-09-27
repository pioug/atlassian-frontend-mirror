/** @jsx jsx */
import { forwardRef, Ref } from 'react';

import { jsx } from '@emotion/react';

import ChevronIcon from '@atlaskit/icon/glyph/chevron-down';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Bleed, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { PrimaryButton } from '../PrimaryButton';

import { PrimaryDropdownButtonProps } from './types';

const chevronIconStyles = xcss({
  opacity: 0.51,
});

const chevronIconStylesWithSpacingFixStyles = xcss({
  opacity: 0.51,
  marginInlineEnd: `${token('space.negative.050', '-0.25rem')}`,
});

/**
 * __Primary dropdown button__
 *
 * A primary dropdown button allows you to add dropdown menus to the navigation.
 * Should be passed into `AtlassianNavigation`'s `primaryItems` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const PrimaryDropdownButton = forwardRef<
  HTMLElement,
  PrimaryDropdownButtonProps
>((props: PrimaryDropdownButtonProps, ref: Ref<HTMLElement>) => {
  return (
    <PrimaryButton
      iconAfter={
        <Bleed
          xcss={
            getBooleanFF(
              'platform.design-system-team.icon-button-spacing-fix_o1zc5',
            )
              ? chevronIconStylesWithSpacingFixStyles
              : chevronIconStyles
          }
          inline="space.100"
        >
          <ChevronIcon label="" />
        </Bleed>
      }
      ref={ref}
      {...props}
    />
  );
});

export default PrimaryDropdownButton;
