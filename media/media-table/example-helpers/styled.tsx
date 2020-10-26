import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const ROW_HIGHLIGHT_CLASSNAME = 'media-table-row-highlighted';
export const ExampleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .${ROW_HIGHLIGHT_CLASSNAME} {
    background-color: ${colors.Y50};

    &:hover {
      background-color: ${colors.Y75};
    }
  }
`;
