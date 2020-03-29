import React, { ReactElement } from 'react';
import styled from 'styled-components';

export type EllipsisPropType = {
  key: string;
};

const StyledEllipsis = styled.span`
  display: inline-flex;
  text-align: center;
  align-items: center;
  padding: 0 8px;
`;

export default function renderEllipsis({
  key,
}: EllipsisPropType): ReactElement {
  return <StyledEllipsis key={key}>...</StyledEllipsis>;
}
