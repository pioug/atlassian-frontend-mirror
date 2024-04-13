import React from 'react';

import styled from '@emotion/styled';

import { Box } from '@atlaskit/primitives';
import { N200 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const LabelElement = styled.label({
  fontSize: `${headingSizes.h200.size / fontSize()}em`,
  fontStyle: 'inherit',
  lineHeight: headingSizes.h200.lineHeight / headingSizes.h200.size,
  color: token('color.text.subtle', N200),
  fontWeight: 600,
  display: 'inline-block',
  marginBottom: token('space.050', '4px'),
  marginTop: 0,
});

export function Label(
  props: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >,
) {
  return (
    <Box>
      {/* eslint-disable-next-line styled-components-a11y/label-has-associated-control,styled-components-a11y/label-has-for */}
      <LabelElement {...(props as any)} />
    </Box>
  );
}
