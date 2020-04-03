import React from 'react';
import Layer from '../src';

const targetStyle = {
  display: 'inline-block',
  position: 'relative',
  top: '100px',
  left: '150px',
  background: 'red',
  padding: '50px',
};

const layerStyles = {
  background: 'green',
  padding: '5px',
};

const content = <div style={layerStyles}>LayerContent</div>;

export default () => (
  <div>
    <p>
      Layer with position={"'right middle'"} and autoFlip=
      {"['top', 'left', 'bottom']"}.
    </p>
    <p>
      This layer will try to position itself on the right. If there is no space,
      it will try to position itself at each of the positions specified in
      autoFlip, in order, until it fits.
    </p>
    <p>
      Scroll the red box to the sides of the container to flip the green box.
    </p>
    <div
      style={{
        border: '1px solid black',
        height: '300px',
        width: '300px',
        overflow: 'scroll',
      }}
    >
      <div style={{ width: '500px', height: '500px' }}>
        <Layer
          content={content}
          position="right middle"
          autoFlip={['top', 'left', 'bottom']}
          boundariesElement="scrollParent"
        >
          <div style={targetStyle}>Target</div>
        </Layer>
      </div>
    </div>
  </div>
);
