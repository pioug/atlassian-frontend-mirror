import React from 'react';

import Lozenge from '../src';

export default function Example() {
  return (
    <div>
      <p>
        default: <Lozenge>default</Lozenge>
      </p>
      <p>
        appearance: new <Lozenge appearance="new">New</Lozenge>
      </p>
      <p>
        style: {`{ backgroundColor: 'green' }`}{' '}
        <Lozenge style={{ backgroundColor: 'green' }}>Success</Lozenge>
      </p>
      <p>
        style: {`{ backgroundColor: 'yellow', color: 'blue' }`}{' '}
        <Lozenge style={{ backgroundColor: 'yellow', color: 'blue' }}>
          Custom
        </Lozenge>
      </p>
    </div>
  );
}
