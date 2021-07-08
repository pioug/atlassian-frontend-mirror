import React, { Component } from 'react';

import { uid } from 'react-uid';

import { DefaultProps, Props } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
  <svg
  fill="none"
  viewBox="0 0 32 32"
  xmlns="http://www.w3.org/2000/svg"
  focusable="false"
  aria-hidden="true"
>
  <linearGradient
    id="${id}"
    gradientUnits="userSpaceOnUse"
    x1="20.8536"
    x2="11.8744"
    y1="11.2763"
    y2="20.2556"
  >
    <stop offset="20%" stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } />
    <stop offset="100%" stop-color="${iconGradientStop}" />
  </linearGradient>
  <path
    d="m16.4644 15.6278v5.309h-5.2337v-5.309h5.2337v-5.3059h-9.54745c-.12228.0008-.24319.0259-.3557.0738-.1125.048-.21436.1178-.29966.2054-.08529.0876-.15233.1914-.1972.3051-.04487.1138-.0667.2353-.0642.3576v14.0653c-.0025.1223.01933.2438.0642.3576.04487.1137.11191.2175.1972.3051.0853.0876.18716.1574.29966.2054.11251.0479.23342.073.3557.0738h13.85185c.1223-.0008.2432-.0259.3557-.0738.1125-.048.2144-.1178.2997-.2054s.1523-.1914.1972-.3051c.0449-.1138.0667-.2353.0642-.3576v-9.7013z"
    fill="url(#${id})"
  />
  <path
    d="m16.4636 5.01256v5.30904h5.2463v5.3059h5.218v-9.68562c.0025-.12227-.0194-.24381-.0642-.35757-.0449-.11376-.1119-.21747-.1972-.3051s-.1872-.15744-.2997-.20537c-.1125-.04794-.2334-.07303-.3557-.07384z"
    fill="${iconGradientStop}"
  />
</svg>`;
};

export class CompassIcon extends Component<Props> {
  static defaultProps = { ...DefaultProps, label: 'Compass' };

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
