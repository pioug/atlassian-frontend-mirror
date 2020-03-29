/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import Layer from '../src';

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const alignmentContainer = {
  position: 'relative',
  height: '100px',
  width: '100px',
  backgroundColor: '#eee',
  display: 'inline-block',
  margin: '25px 0px',
};

const ExampleAlignment = ({ position }) => (
  <Layer
    position={position}
    content={<div style={{ background: '#fca' }}>{position}</div>}
  >
    <div style={alignmentContainer} />
  </Layer>
);

export default () => (
  <StyledRoot>
    <StyledRow>
      <ExampleAlignment position="left top" />
      <ExampleAlignment position="left middle" />
      <ExampleAlignment position="left bottom" />
    </StyledRow>

    <StyledRow>
      <ExampleAlignment position="right top" />
      <ExampleAlignment position="right middle" />
      <ExampleAlignment position="right bottom" />
    </StyledRow>

    <StyledRow>
      <ExampleAlignment position="top left" />
      <ExampleAlignment position="top center" />
      <ExampleAlignment position="top right" />
    </StyledRow>

    <StyledRow>
      <ExampleAlignment position="bottom left" />
      <ExampleAlignment position="bottom center" />
      <ExampleAlignment position="bottom right" />
    </StyledRow>
  </StyledRoot>
);
