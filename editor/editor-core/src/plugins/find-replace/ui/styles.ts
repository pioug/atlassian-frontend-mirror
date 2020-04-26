import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SectionWrapper = styled.div`
  display: flex;
  align-items: center;

  > * {
    flex: 0 0 auto;
    display: inline-flex;
    + * {
      margin-left: 4px;
    }
  }
`;

export const Count = styled.span`
  color: ${colors.N60};
  font-size: 12px;
  flex: 0 0 auto;
`;

export const Rule = styled.hr`
  width: calc(100% - 16px);
  border: none;
  background-color: ${colors.N30A};
  margin: 4px;
  height: 1px;
  border-radius: 1px;
`;
