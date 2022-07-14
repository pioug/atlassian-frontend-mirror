import React from 'react';
import { code } from '@atlaskit/docs';

import Editor from './../src/editor';

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
        {code`import { IntlProvider } from 'react-intl-next';
// ...

return (
  <IntlProvider locale="en">
    <Editor />
  </IntlProvider>
);`}
      </p>
      <br />
      <Editor />
    </div>
  );
}
