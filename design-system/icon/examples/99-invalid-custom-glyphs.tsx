import React from 'react';
import type { CustomGlyphProps } from '../src/types';
import Icon from '../src';

const dangerFlow = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<path style="fill:currentColor" d="M14.586 11l-2.293-2.293a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L14.586 13H10a1 1 0 0 0-1 1v7a1 1 0 0 1-2 0v-7a3 3 0 0 1 3-3h4.586z" />
</svg>
`;

const arrowRight = (props: CustomGlyphProps) => {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" version="1.1">
      <path
        style={{ fill: 'currentColor' }}
        d="M14.586 11l-2.293-2.293a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L14.586 13H10a1 1 0 0 0-1 1v7a1 1 0 0 1-2 0v-7a3 3 0 0 1 3-3h4.586z"
      />
    </svg>
  );
};

const IconCustomExample = () => (
  <div>
    <div style={{ display: 'inline-block' }} id="custom">
      <div id="one">
        <Icon dangerouslySetGlyph={dangerFlow} label="" />
        <Icon dangerouslySetGlyph={dangerFlow} size="large" label="" />
      </div>
      <div id="two">
        <Icon glyph={arrowRight} label="" />
        <Icon glyph={arrowRight} size="large" label="" />
      </div>
    </div>
  </div>
);

export default IconCustomExample;
