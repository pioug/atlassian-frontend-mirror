import React from 'react';

import Lozenge from '../../src';

export default () => (
  <>
    <div>
      <Lozenge appearance="removed">Removed</Lozenge>
    </div>
    <div>
      <Lozenge appearance="removed" isBold>
        Removed bold
      </Lozenge>
    </div>
  </>
);
