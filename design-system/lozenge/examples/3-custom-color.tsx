import React from 'react';

import Lozenge from '../src';

export default function Example() {
  return (
    <div data-testid="test-container">
      <p>
        default: <Lozenge>default</Lozenge>
      </p>
      <p>
        appearance: new <Lozenge appearance="new">New</Lozenge>
      </p>
      <p>
        style: {`{ backgroundColor: 'green' }`}{' '}
        <Lozenge
          testId="lozenge-custom-color1"
          /* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */
          style={{ backgroundColor: 'green' }}
        >
          Success
        </Lozenge>
      </p>
      <p>
        style: {`{ backgroundColor: 'yellow', color: 'blue' }`}{' '}
        <Lozenge
          testId="lozenge-custom-color2"
          /* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */
          style={{ backgroundColor: 'yellow', color: 'blue' }}
        >
          Custom
        </Lozenge>
      </p>
    </div>
  );
}
