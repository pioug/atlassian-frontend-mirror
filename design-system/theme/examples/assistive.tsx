import React from 'react';
import styled from 'styled-components';
import SectionMessage from '@atlaskit/section-message';
import { visuallyHidden } from '../src';

const AssitiveText = styled.span`
  ${visuallyHidden()};
`;

export default () => (
  <div>
    <SectionMessage>
      <p>
        To see the example please turn on the assistive technology in your
        machine. The text `TL;DR` is not read instead the text in AssitiveText
        span is read.
      </p>
    </SectionMessage>
    <div>
      <span aria-hidden="true">TL;DR</span>
      <AssitiveText>Too long; didn{"'"}t read</AssitiveText>
    </div>
  </div>
);
