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
      <linearGradient x1="40.063%" x2="69.955%" y1="0%" y2="50%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M18.4838727,13.07 L26.3504842,13.1005351 C26.8138769,13.102696 27.2364009,13.3661074 27.4423455,13.781227 C27.64829,14.1963467 27.6024124,14.6921363 27.3237913,15.0624169 L15.7128101,30.5666265 C13.9597489,29.2574035 12.7986975,27.3052951 12.485161,25.1398891 C12.1716246,22.974483 12.731296,20.7732253 14.041012,19.0205325 L18.4838727,13.07 Z" fill="url(#${id})"></path>
      <path d="M14.0396053,19.0156579 L6.22105263,18.9660526 C5.75779361,18.9638923 5.33539149,18.700557 5.12950634,18.2855571 C4.92362119,17.8705572 4.96948557,17.3749106 5.24802632,17.0047368 L16.7411842,1.65 C18.4937397,2.9588453 19.6544561,4.91039056 19.9679021,7.0751719 C20.2813481,9.23995324 19.7218382,11.4405759 18.4125,13.1927632 L14.0396053,19.0156579 Z" fill="currentColor"></path>
    </g>
  </svg>`;
};

export class JiraServiceDeskIcon extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(
        'JiraServiceDeskIcon has been deprecated and will be removed from @atlaskit/logo after June 30 2021, Please use JiraServiceManagementIcon instead.',
      );
    }
    return <Wrapper {...this.props} svg={svg} />;
  }
}
