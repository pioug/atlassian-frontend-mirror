/** @jsx jsx */
import { forwardRef, Ref } from 'react';

import { css, jsx } from '@emotion/core';

import ChevronIcon from '@atlaskit/icon/glyph/chevron-down';

import { PrimaryButton } from '../PrimaryButton';

import { PrimaryDropdownButtonProps } from './types';

const chevronIconStyles = css({
  marginRight: '-8px',
  marginLeft: '-8px',
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
