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
      <linearGradient x1="50%" x2="50%" y1="-17.724%" y2="85.598%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M15.3919738,2.47536112 C12.1140721,7.66880375 12.3303344,13.4206726 14.4894164,17.7389677 L18.4247607,25.6099185 C18.5435803,25.8472956 18.7860721,25.9971972 19.0515148,25.9971972 L27.2130885,25.9971972 C27.5999738,25.9971972 27.9136787,25.6836234 27.9136787,25.296607 C27.9136787,25.1878857 27.8883672,25.080607 27.8397115,24.9832956 C27.8397115,24.9832956 16.8599082,3.0204103 16.5835803,2.47090211 C16.3367607,1.97896768 15.7093508,1.97227916 15.3919738,2.47536112" fill="currentColor"></path>
      <path d="M9.93632602,13.3906651 L4.07411881,25.1153419 C4.02453136,25.214648 4.00065592,25.3199886 4,25.4238861 L4,25.4332001 C4.00183657,25.6884836 4.14338381,25.9335348 4.38738555,26.0555357 C4.48472387,26.1042049 4.59216334,26.1295233 4.70091465,26.1295233 L12.8650027,26.1295233 C13.132224,26.1358202 13.3779311,25.9840406 13.4917986,25.7420066 C15.2522842,22.1023141 14.1857605,16.5683286 11.0938912,13.2648599 C10.9303051,13.0902544 10.7250026,13 10.5271775,13 C10.2924898,13 10.0681657,13.1269858 9.93632602,13.3906651" fill="url(#${id})"></path>
    </g>
  </svg>`;
};

export default class AtlassianIcon extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
