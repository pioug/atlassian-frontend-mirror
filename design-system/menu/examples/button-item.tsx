/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { B400, B50, N10, N30, N500 } from '@atlaskit/theme/colors';
import {
  borderRadius as borderRadiusFn,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';

import { ButtonItem, CSSFn, ItemState } from '../src';

import Yeti from './icons/yeti.png';

const ImgIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} height={24} width={24} alt={alt} style={{ borderRadius: 3 }} />
);

export default () => (
  <div data-testid="button-items">
    <ButtonItem isSelected>Activate</ButtonItem>
    <ButtonItem isDisabled>Activate</ButtonItem>
    <ButtonItem>Activate</ButtonItem>
    <ButtonItem description="Next-gen software project">Activate</ButtonItem>
    <ButtonItem
      iconBefore={<ImgIcon src={Yeti} alt={'Yeti'} />}
      description="Next-gen software project"
    >
      Activate
    </ButtonItem>
    <ButtonItem
      isSelected
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={styleOverrides}
      description="Style overrides via cssFn"
    >
      Activate
    </ButtonItem>
    <ButtonItem
      isDisabled
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={styleOverrides}
      description="Style overrides via cssFn"
    >
      Activate
    </ButtonItem>

    <ButtonItem
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={styleOverrides}
      description="Style overrides via cssFn"
    >
      Activate
    </ButtonItem>
  </div>
);

// Mimics overrides in side-navigation
const borderRadius = borderRadiusFn();
const gridSize = gridSizeFn();
const styleOverrides: CSSFn = ({ isSelected, isDisabled }: ItemState) => {
  return {
    padding: `${gridSize}px ${gridSize * 3}px`,
    borderRadius,
    backgroundColor: N10,
    color: N500,
    '&:hover': {
      backgroundColor: N30,
      textDecoration: 'none',
      color: N500,
    },
    '&:active': {
      color: B400,
      backgroundColor: B50,
      boxShadow: 'none',
    },
    ['& [data-item-elem-before]']: {
      display: 'flex',
      height: gridSize * 1.25,
      width: gridSize * 1.25,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: gridSize * 2,
    },
    ...(isSelected && {
      backgroundColor: N30,
      color: B400,
    }),
    ...(isDisabled && {
      backgroundColor: `${N10} !important`,
    }),
  };
};
