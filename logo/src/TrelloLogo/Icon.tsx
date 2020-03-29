/* eslint-disable max-len */
import React, { Component } from 'react';
import { uid } from 'react-uid';

import { Props, DefaultProps } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="50%" y1="100%" x2="50%" y2="58.85%" id="${id}">
          <stop stop-color="${iconGradientStart} "${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
          <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M24.9965006,4 L6.99950008,4 C5.34292193,4 4,5.34314812 4,7 L4,25 C4,26.6568519 5.34292193,28 6.99950008,28 L24.9965006,28 C25.7927102,28.0010591 26.5566726,27.6854575 27.1200533,27.1227333 C27.6834339,26.5600092 28,25.7963408 28,25 L28,7 C28,6.20365918 27.6834339,5.4399908 27.1200533,4.87726666 C26.5566726,4.31454253 25.7927102,3.99894088 24.9965006,4 Z M15,21.6181465 C14.988052,22.384452 14.2853671,23 13.4227198,23 L8.57291098,23 C7.70421623,23 7,22.3743717 7,21.6026201 L7,21.6026201 L7,8.39737991 C7,8.02677172 7.16571693,7.67134267 7.46069496,7.4092831 C7.75567299,7.14722353 8.15574905,7 8.57291098,7 L13.4227198,7 C14.2921242,7 14.9975917,7.62500084 15,8.39737991 L15,21.6181465 Z M25,16.492003 C25,16.8919487 24.8341925,17.2755136 24.5390533,17.5583179 C24.2439141,17.8411222 23.8436194,18 23.4262295,18 L18.5737705,18 C17.704601,18 17,17.3248468 17,16.492003 L17,8.50799695 C17,8.10805129 17.1658075,7.72448637 17.4609467,7.44168208 C17.7560859,7.15887779 18.1563806,7 18.5737705,7 L23.4262295,7 C23.8436194,7 24.2439141,7.15887779 24.5390533,7.44168208 C24.8341925,7.72448637 25,8.10805129 25,8.50799695 L25,8.50799695 L25,16.492003 Z" fill="url(#${id})" fill-rule="nonzero"></path>
    </g>
</svg>`;
};

export default class TrelloIcon extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
