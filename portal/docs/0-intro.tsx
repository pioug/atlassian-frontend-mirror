import React from 'react';
import { md, Props, code } from '@atlaskit/docs';

export default md`
  A best practice, server-side-render friendly wrapper on [React Portals](https://reactjs.org/docs/portals.html).

  Portals are used for rendering parts of a React component tree into a different
  part of the DOM. This is particularly useful for UI components that need
  to appear over the top of other components. Examples of these components are
  \`@atlaskit/modal-dialog\`, \`@atlaskit/flag\` and \`@atlaskit/tooltip\`.

  Mount and unmount events will be fired when portal elements are added or removed. These 
  events contain the type of element and its z-index. The events will be one of 
  \`akPortalMount\` or \`akPortalUnmount\`. These constants (\`PORTAL_MOUNT_EVENT\` and 
  \`PORTAL_UNMOUNT_EVENT\`) are exported from this package. The type of the event itself, 
  \`PortalEvent\` is also exported from the package. Due to custom events not being entirely 
  supported in IE11, we create a normal event and add a detail object manually to the event.

  Example PortalEvent:
  \`\`\`
  {
    type: "akPortalMount",
    detail: {
      layer: "modal"
      zIndex: 510
    }
    ...(Normal event properties)
  }
  \`\`\`

  ## Usage

  This example renders a \`<div />\` and \`<h2 />\` into a Portal.

  ${code`
import React from 'react';
import Portal from '@atlaskit/portal';

const Modal = () => (
  <Portal>
    <div>
      <h2>Modal dialog heading</h2>
    </div>
  </Portal>
)
`}

  ${(
    <Props
      heading="Portal Props"
      props={require('!!extract-react-types-loader!../src/components/Portal')}
    />
  )}
`;
