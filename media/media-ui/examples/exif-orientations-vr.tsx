// eslint-disable-line no-console
import React from 'react';
import styled from 'styled-components';
import { MediaImage } from '../src';
import {
  orientation_1,
  orientation_2,
  orientation_3,
  orientation_4,
  orientation_5,
  orientation_6,
  orientation_7,
  orientation_8,
} from '../example-helpers/exif-dataUri';

const LONG = 80;
const SHORT = 60;

const StyledContainer = styled.div`
  display: flex;
  max-width: 600px;
  margin: 20px;
  align-items: center;
`;

const ItemWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  position: relative;

  label {
    position: absolute;
    top: 30%;
  }

  img {
    image-rendering: pixelated;
    border: 1px solid #fff;
  }
`;

const OuterBorder = styled.div`
  position: absolute;
  background-color: #ccc;
  left: -5px;
  top: -5px;
  width: calc(100% + 10px);
  height: calc(100% + 10px);
`;

const mediaImage = (dataUri: string, orientation: number) => (
  <ItemWrapper
    style={{
      minWidth: orientation < 5 ? LONG : SHORT,
      minHeight: orientation >= 5 ? LONG : SHORT,
    }}
  >
    <OuterBorder />
    <MediaImage
      dataURI={dataUri}
      alt={`orientation ${orientation}`}
      crop={false}
      stretch={true}
      previewOrientation={orientation}
    />
    <label>{`${orientation}.`}</label>
  </ItemWrapper>
);

const Example = () => {
  return (
    <StyledContainer>
      {mediaImage(orientation_1, 1)}
      {mediaImage(orientation_2, 2)}
      {mediaImage(orientation_3, 3)}
      {mediaImage(orientation_4, 4)}
      {mediaImage(orientation_5, 5)}
      {mediaImage(orientation_6, 6)}
      {mediaImage(orientation_7, 7)}
      {mediaImage(orientation_8, 8)}
    </StyledContainer>
  );
};

export default () => <Example />;
