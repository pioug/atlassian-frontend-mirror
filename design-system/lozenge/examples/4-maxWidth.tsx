import React from 'react';

import Lozenge from '../src';

export default () => (
  <div>
    <p>
      <Lozenge appearance="success">
        very very very wide text which truncates
      </Lozenge>
    </p>
    <p>
      <Lozenge appearance="success" maxWidth={100}>
        very very very wide text which truncates
      </Lozenge>
    </p>
  </div>
);
