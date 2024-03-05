import React from 'react';

import styled from '@emotion/styled';

import { ExampleIssueLikeTable } from '../../examples-helpers/buildIssueLikeTable';

const Container = styled.div({
  margin: '50px',
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
