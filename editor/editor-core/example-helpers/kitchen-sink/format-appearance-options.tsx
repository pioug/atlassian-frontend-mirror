import React from 'react';
import styled from 'styled-components';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

const Option = styled.div`
  display: flex;
  flex-direction: column;
`;

const Description = styled.div`
  font-size: ${relativeFontSizeToBase16(12)};
  font-style: italic;
`;

export const formatAppearanceOption = (
  option: { label: string; description?: string },
  { context }: { context: string },
) => {
  if (context === 'menu') {
    return (
      <Option>
        <div>{option.label}</div>
        {option.description && <Description>{option.description}</Description>}
      </Option>
    );
  }

  return option.label;
};
