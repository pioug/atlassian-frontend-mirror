import { code, md } from '@atlaskit/docs';

export default md`
  ## 6.x - 7.x

  ### Adds the ModalTransition component

  Each \`ModalDialog\` needs to be wrapped in a \`ModalTransition\` component. This
  enables the modal to correctly animate when it becomes hidden. This change was
  motivated by work done to upgrade \`ModalDialog\` to use [React Portals](https://reactjs.org/docs/portals.html).

  In version 6.x we recommended rendering \`ModalDialog\` in the following way:

  ${code`
import ModalDialog from '@atlaskit/modal-dialog'

const App = ({ isOpen, onClose }) => (
  {isOpen && <ModalDialog heading="Hi there 👋" onClose={onClose} />}
);
`}

In version 7.x we require wrapping the conditional render statement
to be wrapped in a \`ModalTransition\`.

  ${code`
import ModalDialog { ModalTransition } from '@atlaskit/modal-dialog';

const App = ({ isOpen, onClose }) => (
  <ModalTransition>
    {isOpen && <ModalDialog heading="Hi there 👋" onClose={onClose} />}
  </ModalTransition>
);
`}

### Upgrade steps

We have created a codemod whichs aims to reduce the amount of busy work to upgrade
to this new pattern. Here is how to get up and running:

1. Clone the [Atlaskit Codemod repository](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/).
2. Follow the setup instructions on the [README](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/README.md).
3. The codemod created for this upgrade is the [wrap-conditional-render](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/src/wrap-conditional-render/README.md) codemod.
The README in that directory contains all the information about setting up and running the codemod.

`;
