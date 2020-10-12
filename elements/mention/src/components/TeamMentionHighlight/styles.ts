import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { P50 } from '@atlaskit/theme/colors';
import { h400 } from '@atlaskit/theme/typography';

export const Actions = styled.div`
  justify-content: flex-end;
  margin-top: -${gridSize() * 0.5}px; /* Negative margin is used to middle align x button with title*/
  margin-right: ${gridSize() * 0.5}px;
`;

export const Title = styled.div`
  ${h400};
  margin-top: 0px;
`;

export const Heading = styled.div`
  margin-left: ${gridSize() * 2}px;
  margin-bottom: ${gridSize() * 0.5}px;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${P50};
  overflow: hidden;
  line-height: 21px;
  padding-top: ${gridSize() * 2}px;
  padding-bottom: ${gridSize() * 2}px;
  padding-left: ${gridSize() * 2}px;
  padding-right: 0px;
  margin-top: -${gridSize() * 0.5}px; /* Negative margin is used to fill the entire top of the mention dropdown with background colour of highlight*/
`;

export const Content = styled.div`
  max-width: 290px;
  display: flex;
`;
export const Section = styled.div``;

export const Aside = styled.div`
  opacity: 0.8;
`;

export const Body = styled.div`
  margin-left: ${gridSize() * 2}px;
`;
