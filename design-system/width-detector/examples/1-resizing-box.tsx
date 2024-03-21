import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import WidthDetector from '../src';

const startSize = 100;
const endSize = startSize * 2;

const growAndShrink = keyframes({
  '0%': {
    width: `${startSize}px`,
    height: `${startSize}px`,
  },
  '50%': {
    width: `${endSize}px`,
    height: `${endSize}px`,
  },
  '100%': {
    width: `${startSize}px`,
    height: `${startSize}px`,
  },
});

const ResizingBox = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.2)',
  color: '#333',
  animation: `${growAndShrink} 3s ease-in-out infinite`,
  width: `${startSize}px`,
  height: `${startSize}px`,
});

const ResultBox = styled.div({
  alignItems: 'center',
  backgroundColor: 'rebeccapurple',
  color: 'white',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
});

const displayResults = (width?: Number) => (
  <ResultBox>Width: {width}</ResultBox>
);

export default function Example() {
  return (
    <div>
      <p>
        The box on the left is the only thing causing resize. The purple box
        should update in response.
      </p>
      <div style={{ display: 'flex' }}>
        <ResizingBox>I am resizing</ResizingBox>
        <WidthDetector>{displayResults}</WidthDetector>
      </div>
    </div>
  );
}
