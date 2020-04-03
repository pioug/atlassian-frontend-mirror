import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

export default md`
  This component displays content in a layer that sits above the rest of the page content. Users won't be able to interact with the page until the dialog is closed.

  ## Usage

  Below is an example of how to use the \`ModalDialog\` component.

${code`
  import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';

  const App = ({ isOpen, onClose }) => (
    <ModalTransition>
      {isOpen && <ModalDialog heading="Hi there 👋" onClose={onClose} />}
    </ModalTransition>
  );
`}

  The \`ModalDialog\` component will be visible if it is rendered. Predictably,
  \`ModalDialog\` will be hidden if it is not rendered. To show and hide a \`ModalDialog\`,
  we recommend conditionally rendering the component.

  A \`ModalTransition\` component must be rendered around each \`ModalDialog\` so that
  the animations run correctly. Place a \`ModalTransition\` around the conditional
  statement that controls the rendering of a \`ModalDialog\`. Take a look our other
  \`ModalDialog\` examples for more usages of this pattern.

  The example below controls the rendering of a \`ModalDialog\` based on component state.

  ${(
    <Example
      packageName="@atlaskit/modal-dialog"
      Component={require('../examples/00-defaultModal').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-defaultModal')}
    />
  )}

  The example below shows off some of the different appearances that \`ModalDialog\` comes
  with out of the box.

  ${(
    <Example
      packageName="@atlaskit/modal-dialog"
      Component={require('../examples/10-appearance').default}
      title="Appearance"
      source={require('!!raw-loader!../examples/10-appearance')}
    />
  )}

  The example below demonstrates how to toggle and replace the internal components of \`ModalDialog\`
  to achieve a more customised appearance. 
  
  Note that the ref of any custom Body components
  must resolve to a DOM node - this example uses \`React.forwardRef\` to support this behaviour.

  ${(
    <Example
      packageName="@atlaskit/modal-dialog"
      Component={require('../examples/15-custom').default}
      title="Custom"
      source={require('!!raw-loader!../examples/15-custom')}
    />
  )}

  The example below demonstrates how to wrap the internal components of \`ModalDialog\` to provide 
  support for forms.

  ${(
    <Example
      packageName="@atlaskit/modal-dialog"
      Component={require('../examples/45-form').default}
      title="Form"
      source={require('!!raw-loader!../examples/45-form')}
    />
  )}

  ${(
    <Props
      heading="ModalDialog Props"
      props={require('!!extract-react-types-loader!../src/components/ModalWrapper')}
    />
  )}

  ${(
    <Props
      heading="ModalTransition Props"
      props={require('!!extract-react-types-loader!../src/components/ModalTransition')}
    />
  )}
`;
