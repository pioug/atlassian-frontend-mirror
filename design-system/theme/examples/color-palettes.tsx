/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { colorPalettes } from '../src';

import { ColorPill, Heading } from './colors';

const firstHeadingStyles = css({
  marginTop: 0,
});

export default () => {
  return (
    <div id="colors">
      <Heading css={firstHeadingStyles}>8 colors (base)</Heading>
      {colorPalettes.colorPalette('8').map((color, index) => (
        <ColorPill
          primary={color.background}
          secondary={color.text}
          name={`colorPalette('8')[${index}]`}
          key={index}
        />
      ))}

      <Heading>16 colors</Heading>
      {colorPalettes.colorPalette('16').map((color, index) => (
        <ColorPill
          primary={color.background}
          secondary={color.text}
          name={`colorPalette('16')[${index}]`}
          key={index}
        />
      ))}

      <Heading>24 colors</Heading>
      {colorPalettes.colorPalette('24').map((color, index) => (
        <ColorPill
          primary={color.background}
          secondary={color.text}
          name={`colorPalette('24')[${index}]`}
          key={index}
        />
      ))}
    </div>
  );
};
