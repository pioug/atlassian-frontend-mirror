import React from 'react';
import styled, { keyframes } from 'styled-components';
import SizeDetector from '../src';

const startSize = 50;
const endSize = startSize * 2;

const growAndShrink = keyframes`
  0% {
    width: ${startSize}px;
    height: ${startSize}px;
  }

  50% {
    width: ${endSize}px;
    height: ${endSize}px;
  }

  100% {
    width: ${startSize}px;
    height: ${startSize}px;
  }
`;

const ResizingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  color: #333;
  animation: ${growAndShrink} 3s ease-in-out infinite;
  width: ${startSize}px;
  height: ${startSize}px;
`;

const ResultBox = styled.div`
  align-items: center;
  background-color: rebeccapurple;
  color: white;
  display: flex;
  height: 100%;
  justify-content: center;
  white-space: nowrap;
`;

// eslint-disable-next-line react/prop-types
const displayResults = ({ width, height }) => {
  return width !== null ? (
    <ResultBox>
      {width} x {height}
    </ResultBox>
  ) : null;
};

export default function Example() {
  return (
    <div>
      <p>
        The box on the left is the only thing causing resize. The purple box
        should update in response.
      </p>
      <div style={{ display: 'flex' }}>
        <ResizingBox>I am resizing</ResizingBox>
        <SizeDetector containerStyle={{ height: 'auto' }}>
          {displayResults}
        </SizeDetector>
      </div>
    </div>
  );
}
