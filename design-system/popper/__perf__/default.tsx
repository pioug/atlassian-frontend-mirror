import React from 'react';

import { Manager, Popper, Reference } from '../src';

export default () => (
  <Manager>
    <Reference>
      {({ ref }) => <button ref={ref}>Reference element</button>}
    </Reference>
    <Popper placement="right">
      {({ ref, style }) => (
        <div ref={ref} style={style}>
          ↔ This text is a popper placed to the right
        </div>
      )}
    </Popper>
  </Manager>
);
