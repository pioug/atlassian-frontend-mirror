import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N800, N100A } from '@atlaskit/theme/colors';

const ThemeColor = {
  text: {
    default: N800, //akColorN800,
    disabled: N100A,
  },
};

export const Content = styled.div`
  color: ${(p: { isDisabled?: boolean }) =>
    p.isDisabled ? ThemeColor.text.disabled : ThemeColor.text.default};
  margin-top: ${gridSize() / 2}px;
`;
