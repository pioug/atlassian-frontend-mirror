/** @jsx jsx */
import { forwardRef, Ref } from 'react';

import { jsx } from '@emotion/core';

import ChevronIcon from '@atlaskit/icon/glyph/chevron-down';

import { PrimaryButton } from '../PrimaryButton';

import { chevronIconCSS } from './styles';
import { PrimaryDropdownButtonProps } from './types';

export const PrimaryDropdownButton = forwardRef<
  HTMLElement,
  PrimaryDropdownButtonProps
>((props: PrimaryDropdownButtonProps, ref: Ref<HTMLElement>) => {
  return (
    <PrimaryButton
      iconAfter={
        <span css={chevronIconCSS}>
          <ChevronIcon label="" />
        </span>
      }
      ref={ref}
      {...props}
    />
  );
});

export default PrimaryDropdownButton;
