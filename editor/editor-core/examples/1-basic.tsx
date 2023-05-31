import React from 'react';
import { code } from '@atlaskit/docs';

import { Editor } from './../src';

export default function Example() {
  return (
    <div>
      <p>
        {
          'The most basic editor possible is to render the <Editor/> component with no props.'
        }
      </p>
      <p>
        {
          'Alternatively you can render <Editor /> wrapped with the <IntlProvider />. '
        }
      </p>
      {code`import { IntlProvider } from 'react-intl-next';
// ...

return (
  <IntlProvider locale="en">
    <Editor />
  </IntlProvider>
);`}

      <br />
      <Editor />
    </div>
  );
}
