import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { multiply } from '@atlaskit/theme/math';
import { R400, G400, N200 } from '@atlaskit/theme/colors';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import { FieldId } from './Field';

const Message = styled.div<{ error?: boolean; valid?: boolean }>`
  ${h200} font-weight: normal;
  color: ${props => {
    if (props.error) {
      return R400;
    }
    if (props.valid) {
      return G400;
    }
    return N200;
  }};
  margin-top: ${multiply(gridSize, 0.5)}px;
  display: flex;
  justify-content: baseline;
`;

const IconWrapper = styled.span`
  display: flex;
`;

interface Props {
  /** The content of the message */
  children: ReactNode;
}

export const HelperMessage = ({ children }: Props) => (
  <FieldId.Consumer>
    {fieldId => (
      <Message id={fieldId ? `${fieldId}-helper` : undefined}>
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);

export const ErrorMessage = ({ children }: Props) => (
  <FieldId.Consumer>
    {fieldId => (
      <Message error id={fieldId ? `${fieldId}-error` : undefined}>
        <IconWrapper>
          <ErrorIcon size="small" label="error" />
        </IconWrapper>
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);

export const ValidMessage = ({ children }: Props) => (
  <FieldId.Consumer>
    {fieldId => (
      <Message valid id={fieldId ? `${fieldId}-valid` : undefined}>
        <IconWrapper>
          <SuccessIcon size="small" label="success" />
        </IconWrapper>
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);
