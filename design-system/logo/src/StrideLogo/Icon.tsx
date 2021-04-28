/* eslint-disable max-len */
import React, { Component } from 'react';

import { uid } from 'react-uid';

import warnOnce from '@atlaskit/ds-lib/warn-once';

import { DefaultProps, Props } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
        <linearGradient x1="62.272%" x2="15.737%" y1="26.041%" y2="68.741%" id="${id}">
            <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="18%"></stop>
            <stop stop-color="${iconGradientStop}" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path fill-rule="nonzero" d="M10.6584152,4 L10.6584152,8.39679183 C10.6584152,14.48435 7.60464338,16.8346351 3.71947823,17.1903755 C3.30945638,17.231579 2.99793812,17.5777104 3.00000321,17.9897922 C3.00000321,19.6285964 3.00000321,23.5017703 3.00000321,25.1845425 C2.9996704,25.4044035 3.08990281,25.6146964 3.24947191,25.7659467 C3.40904102,25.9171971 3.62385939,25.9960518 3.84338782,25.9839592 C13.572289,25.4883208 19.4320134,18.3895005 19.4320134,9.57593146 L19.459993,9.57593146 L19.459993,4 L10.6584152,4 Z" fill="url(#${id})"></path>
      <path fill-rule="nonzero" d="M30.1816696,24.829953 L19.8806163,4 L10.6588351,4 L21.5394976,25.3336133 C21.7449071,25.7337742 22.1569759,25.9853368 22.6067778,25.9851739 L29.4741467,25.9851739 C29.7493704,25.982283 30.0037535,25.8380195 30.1475068,25.6033038 C30.29126,25.3685881 30.304166,25.0764302 30.1816696,24.829953 Z" fill="currentColor"></path>
    </g>
  </svg>`;
};

export class StrideIcon extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(
        'StrideIcon has been deprecated and will be removed from @atlaskit/logo after June 30 2021.',
      );
    }
    return <Wrapper {...this.props} svg={svg} />;
  }
}
