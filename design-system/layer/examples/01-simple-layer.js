import React from 'react';
import Layer from '../src';

const layerStyles = {
  background: 'green',
  padding: '5px',
};

const targetStyle = {
  display: 'block',
  position: 'relative',
  top: '100px',
  left: '150px',
  width: '100px',
  height: '100px',
  background: 'red',
  padding: '50px',
};

const content = <div style={layerStyles}>LayerContent</div>;

export default () => (
  <div
    style={{
      border: '1px solid black',
      height: '500px',
      width: '500px',
      overflow: 'scroll',
    }}
  >
    <div>Scroll right on the red box to see the effect</div>
    <div style={{ width: '800px', height: '800px' }}>
      <Layer
        content={content}
        position="left bottom"
        boundariesElement="scrollParent"
      >
        <div style={targetStyle}>Target</div>
      </Layer>
    </div>
  </div>
);
