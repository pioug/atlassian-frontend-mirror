import React from 'react';

import { B300, R300, Y300 } from '@atlaskit/theme/colors';

import IconType from '../render-type/icon';

import { IssuePriority } from './types';

// https://stackoverflow.com/questions/61099149/svg-fill-color-not-working-with-hex-colors
const replaceHashInHex = (hex: string) => hex.replace('#', '%23');

const priorityToSVGPathMap: { [key in IssuePriority]: string } = {
  low: ` <path
  d="M12.5 6.1c.5-.3 1.1-.1 1.4.4.3.5.1 1.1-.3 1.3l-5 3c-.3.2-.7.2-1 0l-5-3c-.6-.2-.7-.9-.4-1.3.2-.5.9-.7 1.3-.4L8 8.8l4.5-2.7z"
  fill="${replaceHashInHex(B300)}"
/>`,
  medium: `<path
  fill="${replaceHashInHex(Y300)}"
  d="M3,4h10c0.6,0,1,0.4,1,1s-0.4,1-1,1H3C2.4,6,2,5.6,2,5S2.4,4,3,4z M3,10h10c0.6,0,1,0.4,1,1s-0.4,1-1,1H3
 c-0.6,0-1-0.4-1-1S2.4,10,3,10z"
/>`,
  high: `<path
  d="M3.5 9.9c-.5.3-1.1.1-1.4-.3s-.1-1.1.4-1.4l5-3c.3-.2.7-.2 1 0l5 3c.5.3.6.9.3 1.4-.3.5-.9.6-1.4.3L8 7.2 3.5 9.9z"
  fill="${replaceHashInHex(R300)}"
/>`,
  blocker: `<path
  d="M8 15c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7zM4 7c-.6 0-1 .4-1 1s.4 1 1 1h8c.6 0 1-.4 1-1s-.4-1-1-1H4z"
  fill="${replaceHashInHex(R300)}"
/>`,
};

export default ({ priority }: { priority: IssuePriority }) => {
  const image = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${priorityToSVGPathMap[priority]}</svg>`;
  return <IconType source={`data:image/svg+xml;utf8,${image}`} />;
};
