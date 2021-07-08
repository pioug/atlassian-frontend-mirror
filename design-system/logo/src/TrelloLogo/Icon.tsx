/* eslint-disable max-len */
import React, { Component } from 'react';

import { uid } from 'react-uid';

import { DefaultProps, Props } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M23.4579 7H9.21854C8.63014 7 8.06585 7.23374 7.64979 7.64979C7.23374 8.06585 7 8.63014 7 9.21854V23.4669C7 24.0553 7.23374 24.6196 7.64979 25.0356C8.06585 25.4517 8.63014 25.6854 9.21854 25.6854H23.4579C24.0463 25.6854 24.6106 25.4517 25.0266 25.0356C25.4427 24.6196 25.6764 24.0553 25.6764 23.4669V9.22452C25.6772 8.93268 25.6204 8.64354 25.5093 8.37369C25.3981 8.10383 25.2348 7.85855 25.0287 7.65191C24.8227 7.44527 24.5778 7.28131 24.3083 7.16945C24.0387 7.05758 23.7497 7 23.4579 7V7ZM15.0448 20.4729C15.0448 20.6685 14.9673 20.8561 14.8293 20.9947C14.6912 21.1333 14.5039 21.2116 14.3083 21.2124H11.1856C10.9897 21.2116 10.802 21.1334 10.6635 20.9949C10.525 20.8564 10.4469 20.6688 10.4461 20.4729V11.1916C10.4469 10.9957 10.525 10.808 10.6635 10.6695C10.802 10.531 10.9897 10.4528 11.1856 10.4521H14.3083C14.5039 10.4528 14.6912 10.5311 14.8293 10.6697C14.9673 10.8083 15.0448 10.996 15.0448 11.1916V20.4729ZM22.2304 16.2185C22.2296 16.4143 22.1514 16.602 22.0129 16.7405C21.8744 16.879 21.6867 16.9572 21.4908 16.958H18.3681C18.1725 16.9572 17.9852 16.8789 17.8471 16.7403C17.7091 16.6017 17.6316 16.4141 17.6316 16.2185V11.1916C17.6316 10.996 17.7091 10.8083 17.8471 10.6697C17.9852 10.5311 18.1725 10.4528 18.3681 10.4521H21.4908C21.6867 10.4528 21.8744 10.531 22.0129 10.6695C22.1514 10.808 22.2296 10.9957 22.2304 11.1916V16.2185Z"
    fill="url(#${id})"
  />
  <defs>
    <linearGradient id="${id}" x1="16.3382" y1="25.6824" x2="16.3382" y2="7.00599" gradientUnits="userSpaceOnUse">
      <stop stop-color="${iconGradientStart} "${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
      <stop offset="100%" stop-color="${iconGradientStop}"/>
    </linearGradient>
  </defs>
</svg>
`;
};

export class TrelloIcon extends Component<Props> {
  static defaultProps = { ...DefaultProps, label: 'Trello' };

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
