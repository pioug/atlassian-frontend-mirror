import React from 'react';

import styled from '@emotion/styled';

import { N200 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const LabelElement = styled.label`
  font-size: ${headingSizes.h200.size / fontSize()}em;
  font-style: inherit;
  line-height: ${headingSizes.h200.lineHeight / headingSizes.h200.size};
  color: ${token('color.text.subtle', N200)};
  font-weight: 600;
  display: inline-block;
  margin-bottom: 4px;
  margin-top: 0;
`;

export function Label(
  props: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >,
) {
  return (
    <div>
      {/* eslint-disable-next-line styled-components-a11y/label-has-associated-control,styled-components-a11y/label-has-for */}
      <LabelElement {...(props as any)} />
    </div>
  );
}
