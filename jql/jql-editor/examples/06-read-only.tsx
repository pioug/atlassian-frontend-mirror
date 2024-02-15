import React from 'react';

import { Container } from '../examples-utils/styled';
import { JQLEditorReadOnly } from '../src';

export default () => {
  return (
    <Container>
      <JQLEditorReadOnly query={'issuetype = bug order by rank'} />
    </Container>
  );
};
