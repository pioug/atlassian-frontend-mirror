import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { WidthObserver } from '../src';

const startSize = 150;
const endSize = startSize * 3;

const growAndShrink = keyframes`
  0% {
    width: ${startSize}px;
    background: skyblue;
  }

  50% {
    width: ${endSize}px;
    background: #00ff0d2b;
  }

  100% {
    width: ${startSize}px;
    background: skyblue;
  }
`;

const ResizingBox = styled.div`
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  color: #333;
  animation: ${growAndShrink} 5s ease-in-out infinite;
  width: ${startSize}px;
  height: 250px;
`;

const RelativeWrapper = styled.div`
  position: relative;
`;

export default function Example() {
  const [width, setWidth] = useState(0);

  return (
    <div>
      <div
        style={{
          margin: '50px',
        }}
      >
        <ResizingBox>
          <p>
            I am resizing
            <br />
            <b> width: {width} </b>
          </p>
          <RelativeWrapper>
            <WidthObserver setWidth={setWidth} />
          </RelativeWrapper>
        </ResizingBox>
      </div>
    </div>
  );
}
