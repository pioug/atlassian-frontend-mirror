import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { Label } from './styled/Field';

const FieldsetLabel = styled(Label)`
  margin-bottom: 0;
`;

const Fieldset = styled.fieldset`
  margin-top: ${gridSize}px;
`;

interface Props {
  /* Children to be rendered in the fieldset */
  children: ReactNode;
  /* Legend of the the fieldset */
  legend?: ReactNode;
}

export default ({ children, legend }: Props) => (
  <Fieldset>
    {legend && (
      <legend>
        <FieldsetLabel>{legend}</FieldsetLabel>
      </legend>
    )}
    {children}
  </Fieldset>
);
