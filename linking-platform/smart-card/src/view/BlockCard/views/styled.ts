import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// TODO: Replace overrides with proper AtlasKit solution.
export const LozengeBlockWrapper = styled.span({
  '& > span': {
    marginLeft: token('space.050', '4px'),
  },
});
