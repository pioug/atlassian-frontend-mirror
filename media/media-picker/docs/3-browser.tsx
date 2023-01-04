import React from 'react';
import { md } from '@atlaskit/docs';
import { DocsContentTabs } from '@atlaskit/media-test-helpers';
import example from './content/browser/example';
import props from './content/browser/props';
export default md`
### Browser

The \`Browser\` React component enables the user to select local files via the native browser file dialog.

There is two ways of integrating the \`Browser\` component:
- You can pass a children factory in a shape of **_(browse) => React.ReactChild_** function.
- Or by using **one** of control props
  - **isOpen?: _boolean_** - when true, the dialog will show when the component is rendered (NOTE: without this value, no dialog will appear unless you use the onBrowserFn hook)
  - **onBrowserFn?: _(browse: () => void) => void_** - provides a callback to manually invoke the dialog. This can be useful for cases where the action is required outside of React render lifecycle

  ${(
    <DocsContentTabs
      tabs={[
        {
          name: 'Usage',
          content: example,
        },
        { name: 'Props', content: props },
      ]}
    />
  )}
`;
