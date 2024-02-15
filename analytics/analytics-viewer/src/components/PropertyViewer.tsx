import React from 'react';
import styled from 'styled-components';
import { token } from '@atlaskit/tokens';

const PropertyViewerContainer = styled.span`
  display: inline-block;
  margin: ${token('space.025', '2px')};
  padding: 0 ${token('space.050', '4px')};
  border-radius: 5px;
  box-shadow: 1px 1px 2px #888;
  border: 1px solid #888;
`;

type Props<T extends {}> = {
  object: T;
  property: keyof T;
};

export const PropertyViewer = <T extends {}>({
  object,
  property,
}: Props<T>) => {
  if (object[property] !== undefined) {
    return (
      <PropertyViewerContainer>
        {property}: {JSON.stringify(object[property])}
      </PropertyViewerContainer>
    );
  }
  return null;
};
