import React, { useState } from 'react';

import styled from 'styled-components';
import { N40 } from '@atlaskit/theme/colors';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme/constants';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';

export const ExpandContainer = styled.div`
  border-bottom: 1px solid ${N40};
`;

export const ExpandControl = styled.div`
  display: flex;
  height: 40px;
  justify-content: center;
  padding-right: ${gridSize()}px;
`;

const ChevronContainer = styled.div`
  display: flex;
  align-items: center;

  & > button {
    padding: 0;
    width: 24px;
    height: 24px;
  }
`;

const LabelContainer = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  font-weight: 500;
`;

const ExpandContentContainer = styled.div<{ isHidden: boolean }>`
  display: ${({ isHidden }) => (isHidden ? 'none' : 'block')};
`;

ExpandContentContainer.displayName = 'ExpandContentContainer';

function Expand({
  field,
  children,
  isExpanded = false,
}: {
  field: FieldDefinition;
  children: React.ReactNode;
  isExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(isExpanded);

  return (
    <ExpandContainer>
      <ExpandControl>
        <LabelContainer>{field.label}</LabelContainer>
        <ChevronContainer>
          <Button
            onClick={() => {
              setExpanded(!expanded);
            }}
            testId="form-expand-toggle"
          >
            {expanded ? (
              <ChevronDownIcon label="collapse" />
            ) : (
              <ChevronRightIcon label="expand" />
            )}
          </Button>
        </ChevronContainer>
      </ExpandControl>
      <ExpandContentContainer isHidden={!expanded}>
        {children}
      </ExpandContentContainer>
    </ExpandContainer>
  );
}

export default Expand;
