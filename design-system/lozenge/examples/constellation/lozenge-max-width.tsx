import React from 'react';

import Lozenge from '../../src';

export default () => (
  <div>
    <p>
      <Lozenge appearance="success">
        default max width with long text which truncates
      </Lozenge>
    </p>
    <p>
      <Lozenge appearance="success" maxWidth={100}>
        custom max width with long text which truncates
      </Lozenge>
    </p>
  </div>
);
