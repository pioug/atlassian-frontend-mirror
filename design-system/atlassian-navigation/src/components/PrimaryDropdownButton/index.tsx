/** @jsx jsx */
import { forwardRef, Ref } from 'react';

import { css, jsx } from '@emotion/react';

import ChevronIcon from '@atlaskit/icon/glyph/chevron-down';
import { token } from '@atlaskit/tokens';

import { PrimaryButton } from '../PrimaryButton';

import { PrimaryDropdownButtonProps } from './types';

const chevronIconStyles = css({
  marginRight: `calc(-1 * ${token('space.100', '8px')})`,
  marginLeft: `calc(-1 * ${token('space.100', '8px')})`,
  opacity: 0.51,
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
        <span css={chevronIconStyles}>
          <ChevronIcon label="" />
        </span>
      }
      ref={ref}
      {...props}
    />
  );
});

export default PrimaryDropdownButton;
