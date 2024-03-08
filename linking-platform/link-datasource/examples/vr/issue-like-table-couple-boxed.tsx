import React from 'react';

import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { ExampleIssueLikeTable } from '../../examples-helpers/buildIssueLikeTable';

const Container = styled.div({
  margin: token('space.600', '48px'),
  height: '400px',
  width: '600px',
});

export default () => {
  return (
    <div>
      <Container>
        <ExampleIssueLikeTable />
      </Container>
      <Container>
        <ExampleIssueLikeTable />
      </Container>
    </div>
  );
};
