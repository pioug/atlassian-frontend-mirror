import React from 'react';

export const svg = `<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="16" height="15" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0" transform="translate(0 -0.0185185) scale(0.0138889 0.0148148)"/>
</pattern>
<image id="image0" width="72" height="70" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABGCAYAAABv59I3AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAs0lEQVR42u3b0QpGQBCA0Rl5bzz5/rcK2fxG0fmurTgNFzYZJ7XWWnSUmXmwfu5cP1es/7chBAhQYXn1nXNDS+mN3fROMkGAAAECBAgQIEACBAgQIECAAAHSqvFF1zp1Hrf7pfLq7ogJ8ogBKi2rTvyV3RETBAgQIECAAAECJECAAAECBAgQIK3a7Go89W+GCQIESBGR/s0wQYAAAQIECBAgAQIECBAgQIAACRAgQIAAvaIfCu0nh+lmem4AAAAASUVORK5CYII="/>
</defs>
</svg>
`;

export default function WhatsNewIcoExperiment() {
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}
