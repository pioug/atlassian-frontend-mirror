import React, { ReactNode } from 'react';

import styled from 'styled-components';

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { G400, N200, R400 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import { h200 } from '@atlaskit/theme/typography';

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
  /** A testId prop is provided for specified elements, which is a unique string
   *  that appears as a data attribute data-testid in the rendered code,
   *  serving as a hook for automated tests
   */
  testId?: string;
}

export const HelperMessage = ({ children, testId }: Props) => (
  <FieldId.Consumer>
    {fieldId => (
      <Message
        id={fieldId ? `${fieldId}-helper` : undefined}
        data-testid={testId}
      >
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);

export const ErrorMessage = ({ children, testId }: Props) => (
  <FieldId.Consumer>
    {fieldId => (
      <Message
        error
        id={fieldId ? `${fieldId}-error` : undefined}
        data-testid={testId}
      >
        <IconWrapper>
          <ErrorIcon size="small" label="error" />
        </IconWrapper>
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);

export const ValidMessage = ({ children, testId }: Props) => (
  <FieldId.Consumer>
    {fieldId => (
      <Message
        valid
        id={fieldId ? `${fieldId}-valid` : undefined}
        data-testid={testId}
      >
        <IconWrapper>
          <SuccessIcon size="small" label="success" />
        </IconWrapper>
        {children}
      </Message>
    )}
  </FieldId.Consumer>
);
