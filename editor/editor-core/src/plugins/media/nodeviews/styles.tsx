import React from 'react';
import styled from 'styled-components';
import { NumericalCardDimensions } from '@atlaskit/media-card';

export const FigureWrapper = styled.figure`
  margin: 0;
`;

FigureWrapper.displayName = 'FigureWrapper';

const AbsoluteDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

type ForcedDimensionsProps = {
  dimensions: NumericalCardDimensions;
};

const ForcedDimensions = styled.div<ForcedDimensionsProps>`
  width: 100%;
  position: relative;
  padding-bottom: ${(props) =>
    (props.dimensions.height / props.dimensions.width) * 100}%;
`;

type MediaCardWrapperProps = {
  dimensions: NumericalCardDimensions;
  children: React.ReactNode;
  onContextMenu?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

export const MediaCardWrapper = ({
  dimensions,
  children,
  onContextMenu,
}: MediaCardWrapperProps) => {
  return (
    <ForcedDimensions
      dimensions={dimensions}
      onContextMenuCapture={onContextMenu}
    >
      <AbsoluteDiv>{children}</AbsoluteDiv>
    </ForcedDimensions>
  );
};
