import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

export const FormRowContainer = styled.div<{ isNarrowGap?: boolean }>(
  props => ({
    alignItems: 'center',
    display: 'flex',
    gap: props.isNarrowGap
      ? token('space.100', '8px')
      : token('space.200', '16px'),
    flexGrow: 1,
    width: '100%',
  }),
);

export const FormContainer = styled.form({
  display: 'grid',
  rowGap: token('space.200', '16px'),
  width: '100%',
});

// Override the top margin of fields
export const FieldContainer = styled.div({
  flex: 1,
  marginTop: token('space.negative.100', '-8px'),
});

export const SchemaSelectContainer = styled.div({
  width: '100%',
  maxWidth: '386px',
});
