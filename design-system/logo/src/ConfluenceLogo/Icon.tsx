/* eslint-disable max-len */
import React, { Component } from 'react';

import { uid } from 'react-uid';

import { DefaultProps, Props } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="60.6779047%" y1="137.626433%" x2="14.341981%" y2="112.08042%" id="${id}-1">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="12.3282701%" y1="-53.9760846%" x2="74.1300776%" y2="-33.2553066%" id="${id}-2">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M5.21454927,22.0245336 C4.97082816,22.4219865 4.69711061,22.8831818 4.46463817,23.2506383 C4.25655728,23.602269 4.36826343,24.0557627 4.71585838,24.2705174 L9.59028054,27.2701618 C9.76138278,27.3758032 9.96774369,27.4083016 10.1630326,27.3603607 C10.3583215,27.3124197 10.5261749,27.1880564 10.6289074,27.015192 C10.8238843,26.6889807 11.0751045,26.2652809 11.3488221,25.8115847 C13.2798432,22.6244625 15.2221129,23.0144163 18.7241978,24.686718 L23.5573748,26.9851956 C23.7404243,27.0723219 23.9509502,27.0816253 24.1409716,27.0109854 C24.3309931,26.9403455 24.4843191,26.7957811 24.5660052,26.61024 L26.8869801,21.3608623 C27.0509607,20.9859459 26.8841076,20.5487907 26.5120245,20.3784788 C25.4921454,19.8985357 23.4636359,18.942399 21.6376024,18.0612535 C15.0683811,14.8741313 9.48529299,15.0841064 5.21454927,22.0245336 Z" fill="url(#${id}-1)"></path>
      <path d="M27.0752616,9.74267061 C27.3190367,9.34512979 27.5928148,8.88383241 27.8253387,8.51629467 C28.0334656,8.1645861 27.9217347,7.71099215 27.5740629,7.4961899 L22.6985622,4.49588177 C22.5250856,4.3802891 22.3113292,4.3421035 22.1085604,4.39048341 C21.9057917,4.43886333 21.7323024,4.56944439 21.6297024,4.75090796 C21.4346824,5.07719147 21.1834066,5.50098499 20.9096284,5.9547816 C18.9781801,9.14260899 17.0354806,8.75256893 13.5326208,7.07989715 L8.71337588,4.78466143 C8.53028584,4.69751579 8.31971336,4.68821035 8.1296499,4.75886591 C7.93958645,4.82952147 7.78622651,4.97411777 7.70452227,5.15969994 L5.38303386,10.4102392 C5.21901692,10.7852385 5.38590698,11.2224905 5.75807237,11.3928401 C6.77817714,11.8728894 8.80713551,12.8292376 10.6335731,13.7105781 C17.2192494,16.8946551 22.8035729,16.6846336 27.0752616,9.74267061 Z" fill="url(#${id}-2)"></path>
    </g>
  </svg>`;
};

export class ConfluenceIcon extends Component<Props> {
  static defaultProps = { ...DefaultProps, label: 'Confluence' };

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
