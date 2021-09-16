/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import Lozenge from '../src';

export default () => (
  <div>
    <p>
      <h4>Constrained by maxWidth: </h4>
      <Lozenge
        appearance="success"
        maxWidth={150}
        testId="lozenge-truncated-by-maxWidth"
      >
        very very very wide text which truncates
      </Lozenge>

      <h4>Constrained by container size: </h4>
      <div style={{ width: 125, overflow: 'hidden', border: '1px solid red' }}>
        <Lozenge
          appearance="success"
          maxWidth={150}
          testId="lozenge-truncated-by-container-size"
        >
          very very very wide text which truncates
        </Lozenge>
      </div>
    </p>
  </div>
);
