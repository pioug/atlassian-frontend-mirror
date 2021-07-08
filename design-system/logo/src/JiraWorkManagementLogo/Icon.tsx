import React, { Component } from 'react';

import { uid } from 'react-uid';

import { DefaultProps, Props } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
    <svg
      fill="none"
      height="32"
      viewBox="0 0 32 32"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient
        id="${id}"
        gradientUnits="userSpaceOnUse"
        x1="13.9485"
        x2="20.7792"
        y1="20.2388"
        y2="11.8277"
      >
        <stop offset="0" stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
        <stop offset="100%" stop-color="${iconGradientStop}" />
      </linearGradient>
      <path
        d="m18.3893 7-3.4257 13.1867c4.3592 1.2052 7.8383-.3558 9.1709-5.4802l1.9988-7.6973z"
        fill="url(#${id})"
      />
      <path
      d="m13.7566 24.8265 3.4257-13.1866c-4.3623-1.196-7.8383.3649-9.17087 5.4985l-2.01143 7.6881z"
      />
    </svg>`;
};

export class JiraWorkManagementIcon extends Component<Props> {
  static defaultProps = { ...DefaultProps, label: 'Jira Work Management' };

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
