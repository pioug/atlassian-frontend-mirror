import React, { useState } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import styled from 'styled-components';
import { N40 } from '@atlaskit/theme/colors';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme/constants';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { messages } from '../messages';

export const ExpandContainer = styled.div`
  border-bottom: 1px solid ${N40};
`;

export const ExpandControl = styled.div`
  display: flex;
  height: ${gridSize() * 6}px;
  justify-content: center;
  padding-right: ${gridSize()}px;
`;

const ChevronContainer = styled.div`
  display: flex;
  align-items: center;

  & > button {
    width: ${gridSize() * 3}px;
    height: ${gridSize() * 3}px;
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
  margin-top: -${gridSize}px;
`;

ExpandContentContainer.displayName = 'ExpandContentContainer';

type Props = {
  field: FieldDefinition;
  children: React.ReactNode;
  isExpanded?: boolean;
} & InjectedIntlProps;

function Expand({ field, children, isExpanded = false, intl }: Props) {
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
            iconBefore={
              expanded ? (
                <ChevronDownIcon
                  label={intl.formatMessage(messages.collapse)}
                />
              ) : (
                <ChevronRightIcon label={intl.formatMessage(messages.expand)} />
              )
            }
          />
        </ChevronContainer>
      </ExpandControl>
      <ExpandContentContainer isHidden={!expanded}>
        {children}
      </ExpandContentContainer>
    </ExpandContainer>
  );
}

export default injectIntl(Expand);
