import { code, md } from '@atlaskit/docs';

export default md`
  ## 5.x - 6.x

  ### Adds the SpotlightTransition component

  Each \`Spotlight\` needs to be wrapped in a \`SpotlightTransition\` component. This
  enables the spotlight to correctly animate when it becomes hidden. This change was
  motivated by work done to upgrade \`Spotlight\` to use [React Portals](https://reactjs.org/docs/portals.html).

  In version 5.x we recommended rendering \`Spotlight\` in the following way:

  ${code`
import { Spotlight } from '@atlaskit/onboarding'

const App = ({ isOpen, onClose }) => (
  {isOpen && <Spotlight heading="Hi there 👋" />}
);
`}

In version 6.x we require wrapping the conditional render statement
to be wrapped in a \`SpotlightTransition\`.

  ${code`
import { Spotlight, SpotlightTransition } from '@atlaskit/onboarding';

const App = ({ isOpen, onClose }) => (
  <SpotlightTransition>
    {isOpen && <Spotlight heading="Hi there 👋" />}
  </SpotlightTransition>
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
