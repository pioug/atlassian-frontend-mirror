import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

export const FormRowContainer = styled.div<{ isNarrowGap?: boolean }>`
  align-items: center;
  display: flex;
  gap: ${props =>
    props.isNarrowGap ? token('space.100', '8px') : token('space.200', '16px')};
  flex-grow: 1;
  width: 100%;
`;

export const FormContainer = styled.form`
  display: grid;
  row-gap: ${token('space.200', '16px')};
  width: 100%;
`;

// Override the top margin of fields
export const FieldContainer = styled.div`
  flex: 1;
  margin-top: ${token('space.negative.100', '-8px')};
`;

export const SchemaSelectContainer = styled.div`
  width: 200px;
`;
