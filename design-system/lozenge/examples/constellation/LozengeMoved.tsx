import React from 'react';

import Lozenge from '../../src';

export default () => (
  <>
    <div>
      <Lozenge appearance="moved">Moved</Lozenge>
    </div>
    <div>
      <Lozenge appearance="moved" isBold>
        Moved bold
      </Lozenge>
    </div>
  </>
);
