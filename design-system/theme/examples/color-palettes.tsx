import React from 'react';
import { ColorPill, Heading } from './colors';
import { colorPalettes } from '../src';

export default () => {
  return (
    <div>
      <Heading index={0}>8 colors (base)</Heading>
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
