import styled from 'styled-components';
import { N50A } from '@atlaskit/theme/colors';

export interface MutableCardContainerProps {
  mutable: boolean;
}

export const FilmstripContainer = styled.div`
  border: 1px dotted ${N50A};
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Code = styled.code`
  font-family: monospace;
  padding: 3px;
  border-radius: 5px;
`;

export const ExampleWrapper = styled.div``;

export const FilmstripWrapper = styled.div`
  border: 1px solid #ccc;
  width: 800px;
  margin-bottom: 20px;
`;
