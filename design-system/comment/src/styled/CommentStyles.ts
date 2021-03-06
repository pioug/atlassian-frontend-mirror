import styled from '@emotion/styled';

import { N100A, N800 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

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
