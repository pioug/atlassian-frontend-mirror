import React from 'react';

import { B500, N0 } from '@atlaskit/theme/colors';

import { Container, Format } from '../../src';

const BadgeContainerTextColorExample = () => {
  return (
    <Container backgroundColor={B500} textColor={N0}>
      <Format>{8}</Format>
    </Container>
  );
};

export default BadgeContainerTextColorExample;
