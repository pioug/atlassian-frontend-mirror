import React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import SectionMessage from '../src';

const CustomLink = styled.button`
  background-color: ${colors.P100} !important;
`;

const Example = () => (
  <SectionMessage
    title="The Modern Prometheus"
    linkComponent={CustomLink}
    actions={[
      {
        key: 'mary',
        href: 'https://en.wikipedia.org/wiki/Mary_Shelley',
        text: 'Mary',
      },
      {
        key: 'villa',
        href: 'https://en.wikipedia.org/wiki/Villa_Diodati',
        text: 'Villa Diodatti',
      },
    ]}
  >
    <p>
      The main use for passing a custom link component is to pass in a
      react-router-link component.
    </p>
  </SectionMessage>
);

export default Example;
