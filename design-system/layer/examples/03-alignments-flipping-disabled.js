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

const ExampleAlignment = (props) => (
  <Layer
    {...props}
    content={<div style={{ background: '#fca' }}>{props.position}</div>}
  >
    <div style={alignmentContainer} />
  </Layer>
);

export default () => (
  <StyledRoot>
    <StyledRow>
      <ExampleAlignment autoFlip={false} position="left top" />
      <ExampleAlignment autoFlip={false} position="left middle" />
      <ExampleAlignment autoFlip={false} position="left bottom" />
    </StyledRow>

    <StyledRow>
      <ExampleAlignment autoFlip={false} position="right top" />
      <ExampleAlignment autoFlip={false} position="right middle" />
      <ExampleAlignment autoFlip={false} position="right bottom" />
    </StyledRow>

    <StyledRow>
      <ExampleAlignment autoFlip={false} position="top left" />
      <ExampleAlignment autoFlip={false} position="top center" />
      <ExampleAlignment autoFlip={false} position="top right" />
    </StyledRow>

    <StyledRow>
      <ExampleAlignment autoFlip={false} position="bottom left" />
      <ExampleAlignment autoFlip={false} position="bottom center" />
      <ExampleAlignment autoFlip={false} position="bottom right" />
    </StyledRow>
  </StyledRoot>
);
