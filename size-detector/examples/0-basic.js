/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import SizeDetector from '../src';

const ResultBox = styled.div`
  align-items: center;
  background-color: rebeccapurple;
  color: white;
  display: flex;
  height: 100%;
  justify-content: center;
  white-space: nowrap;
`;

const ColourBox = styled(ResultBox)`
  background-color: ${p => (p.width >= 300 ? 'rebeccapurple' : 'red')};
`;

const displayResults = ({ width, height }) => (
  <ResultBox>
    {width} x {height}
  </ResultBox>
);

export default function Example() {
  return (
    <div>
      <p>Inside a parent with set height</p>
      <div style={{ height: 100 }}>
        <SizeDetector>{displayResults}</SizeDetector>
      </div>
      <p>
        The inner size should be 200px high, scrolling inside a 100px container
      </p>
      <div style={{ height: 100, overflow: 'auto' }}>
        <div style={{ height: 200 }}>
          <SizeDetector>{displayResults}</SizeDetector>
        </div>
      </div>
      <p>Changing colour based on width</p>
      <div style={{ height: 100 }}>
        <SizeDetector>
          {({ width }) => <ColourBox width={width} />}
        </SizeDetector>
      </div>
    </div>
  );
}
