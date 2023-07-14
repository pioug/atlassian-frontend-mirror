import React, { useState } from 'react';
import styled from '@emotion/styled';
import { WidthObserver } from '../src';
import debounce from 'lodash/debounce';
import Button from '@atlaskit/button/standard-button';

const ResultBox = styled.div`
  align-items: center;
  background-color: black;
  color: white;
  display: flex;
  height: auto;
  min-height: 100px;
  justify-content: center;
  white-space: nowrap;
  transition: background-color 2s;
  padding: 10px;
`;

const ResultNumber = styled.div`
  background-color: rgb(0, 0, 0, 0.6);
  color: white;
  padding: 10px;
  border-radius: 3px;
`;

const RelativeWrapper = styled.div`
  position: relative;
`;

const sizes = ['100%', '75%', '50%', '25%'];

const OnResizeExample = () => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [bgColor, setBgColor] = useState('#fff');

  const [size, setSize] = useState(0);
  const sizeIndex = size % sizes.length;

  const onResize = debounce(
    (width: any) => {
      console.log('[onResize] width:', width);
      setBgColor(`#${(width + 255).toString(16)}`);
      setContainerWidth(width);
    },
    100,
    { leading: false },
  );

  return (
    <>
      <div
        style={{
          width: sizes[sizeIndex],
          minWidth: 180,
          margin: '0 auto',
        }}
      >
        <ResultBox style={{ backgroundColor: bgColor }}>
          <ResultNumber>{containerWidth}</ResultNumber>
        </ResultBox>
        <RelativeWrapper>
          <WidthObserver setWidth={onResize} />
        </RelativeWrapper>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ padding: '25px' }}>
          The area above will change color as the width of the container
          changes.
        </p>
        <Button
          onClick={() => setSize((prev) => prev + 1)}
          appearance="primary"
        >
          Set width to {sizes[(sizeIndex + 1) % sizes.length]}
        </Button>
      </div>
    </>
  );
};

export default OnResizeExample;
