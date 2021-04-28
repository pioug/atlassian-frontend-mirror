import React from 'react';

import styled from 'styled-components';
import { N60, N30A } from '@atlaskit/theme/colors';

import Button, { ButtonProps } from '@atlaskit/button/standard-button';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

// This is a workaround because React.memo does not play well with styled-components
function StyledComponentsButton(props: ButtonProps) {
  return <Button {...props} />;
}

export const ReplaceSectionButton = styled(StyledComponentsButton)`
  /* increase specificity to override default Button styles */
  && {
    margin-left: 4px;
  }
`;

export const Rule = styled.hr`
  width: 100%;
  border: none;
  background-color: ${N30A};
  margin: 4px 0px;
  height: 1px;
  border-radius: 1px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  > *:not(${Rule}) {
    margin: 0px 4px;
  }
`;

export const SectionWrapper = styled.div`
  display: flex;
  align-items: center;

  > * {
    flex: 0 0 auto;
    display: inline-flex;
    height: 32px;
  }
`;

export const Count = styled.span`
  color: ${N60};
  font-size: ${relativeFontSizeToBase16(12)};
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  margin-right: 8px;
`;
