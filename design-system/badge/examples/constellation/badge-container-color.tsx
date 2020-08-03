import React from 'react';

import { B200 } from '@atlaskit/theme/colors';

import { Container, Format } from '../../src';

export default function Example() {
  return (
    <Container textColor="inherit" backgroundColor={B200}>
      <Format>{8}</Format>
    </Container>
  );
}
