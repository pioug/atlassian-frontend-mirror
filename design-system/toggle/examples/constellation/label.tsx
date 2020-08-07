import React from 'react';

import styled from 'styled-components';

import { h200 } from '@atlaskit/theme/typography';

const LabelElement = styled.label`
  ${h200()};
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
      <LabelElement {...(props as any)} />
    </div>
  );
}
