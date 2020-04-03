import React from 'react';
import Layer from '../src';

const fixedStyle = {
  position: 'fixed',
  top: '200px',
  left: '200px',
  background: 'grey',
};

const alignmentContainer = {
  height: '100px',
  width: '100px',
  backgroundColor: '#eee',
};

export default () => (
  <div style={fixedStyle}>
    <Layer
      position="bottom center"
      content={
        <div style={alignmentContainer}>
          When resizing window, flipped popper should not overflow off the top
        </div>
      }
      longContent
    >
      <div>This is target</div>
    </Layer>
  </div>
);
