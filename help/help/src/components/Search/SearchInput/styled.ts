/** @jsx jsx */
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

export const SearchInputContainer = styled.div`
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
  width: 100%;
  box-sizing: border-box;
`;

export const SearchIconContainer = styled.div`
  width: ${token('space.300', '24px')};
  height: ${token('space.300', '24px')};
  padding-left: ${token('space.050', '4px')};

  & > span {
    padding-left: ${token('space.050', '4px')};
    height: ${token('space.300', '24px')};
    width: ${token('space.300', '24px')};
    box-sizing: border-box;
  }
`;

export const CloseButtonAndSpinnerContainer = styled.div`
  font-size: 0;
  padding-right: ${token('space.100', '8px')};
  position: relative;
  white-space: nowrap;

  & > span {
    padding-right: ${token('space.050', '4px')};
  }

  & > button,
  & > span {
    display: inline-block;
    vertical-align: middle;
  }
`;
