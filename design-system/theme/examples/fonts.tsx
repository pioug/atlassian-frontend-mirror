import React from 'react';
import { fontSize, fontSizeSmall, fontFamily, codeFontFamily } from '../src';

export default () => {
  return (
    <div>
      <div style={{ fontSize: fontSize() }}>Standard font size</div>
      <div style={{ fontSize: fontSizeSmall() }}>Small font size</div>
      <div style={{ fontFamily: fontFamily() }}>OS specific font family</div>
      <div style={{ fontFamily: codeFontFamily() }}>
        OS specific code font size
      </div>
    </div>
  );
};
