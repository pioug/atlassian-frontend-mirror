/** @jsx jsx */
import { forwardRef, Ref } from 'react';

import { jsx } from '@emotion/react';

import ChevronIcon from '@atlaskit/icon/glyph/chevron-down';
import { Bleed, xcss } from '@atlaskit/primitives';

import { PrimaryButton } from '../PrimaryButton';

import { PrimaryDropdownButtonProps } from './types';

const chevronIconStylesWithSpacingFixStyles = xcss({
  marginInlineEnd: 'space.negative.050',
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
        <Bleed xcss={chevronIconStylesWithSpacingFixStyles} inline="space.100">
          <ChevronIcon label="" />
        </Bleed>
      }
      ref={ref}
      {...props}
    />
  );
});

export default PrimaryDropdownButton;
