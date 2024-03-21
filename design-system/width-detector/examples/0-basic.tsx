import React from 'react';
import styled from '@emotion/styled';
import WidthDetector from '../src';

const containerDivStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  position: 'relative',
  width: '100%',
  height: 100,
  maxWidth: 800,
  margin: '10px 0',
  padding: 10,
  backgroundColor: '#333',
};

const ResultBox = styled.div({
  backgroundColor: 'rebeccapurple',
  color: 'white',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
});

let n = 0;

export default function Example() {
  return (
    <ResultBox>
      <p style={{ padding: 10 }}>Inside a parent with set height1</p>
      <p style={{ padding: 10 }}>Inside a parent with set height2</p>
      <div style={containerDivStyle}>
        <WidthDetector>
          {(width?: Number) => {
            n++;
            return (
              <>
                <p>This div has a max width of {containerDivStyle.maxWidth}</p>
                <p className="my-component-child">{width}</p>
                <p>This component has been rendered {n} times.</p>
              </>
            );
          }}
        </WidthDetector>
      </div>
    </ResultBox>
  );
}
