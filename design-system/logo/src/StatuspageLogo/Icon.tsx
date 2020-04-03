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
      <linearGradient id="${id}" x1="50%" x2="50%" y1="82.77%" y2="10.134%">
        <stop offset="0%" stop-color="${iconGradientStop}" />
        <stop offset="82%" stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
      </linearGradient>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <circle cx="16" cy="19.423" r="5.538" fill="url(#${id})" fill-rule="nonzero"/>
      <path fill="currentColor" fill-rule="nonzero" d="M4.14318325,11.970217 L7.17443341,15.5164923 C7.40520779,15.7738906 7.80165918,15.8034375 8.06900618,15.5831636 C12.9601954,11.2622319 19.0323494,11.2622319 23.9235386,15.5831636 C24.1908857,15.8034375 24.5873371,15.7738906 24.8181114,15.5164923 L27.8525794,11.970217 C28.0663737,11.714892 28.04536,11.3403265 27.8043112,11.1098404 C20.6927794,4.96338652 11.2997654,4.96338652 4.20110522,11.1098404 C3.95712825,11.3377486 3.93190106,11.7124749 4.14318325,11.970217 Z"/>
    </g>
  </svg>`;
};

export default class StatuspageIcon extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
