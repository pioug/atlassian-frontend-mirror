import React from 'react';

import { B200, N0 } from '@atlaskit/theme/colors';

import { Container, Format } from '../../src';

export default function Example() {
  return (
    <Container backgroundColor={B200} textColor={N0}>
      <Format>{8}</Format>
    </Container>
  );
}
