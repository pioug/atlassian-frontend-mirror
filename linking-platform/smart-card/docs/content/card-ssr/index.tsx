import { code } from '@atlaskit/docs';
import customMd from '../../utils/custom-md';
import prerequisites from '../prerequisites';

export default customMd`

Smart Link is lazy-loading by default. To bypass [React lazy(load)](https://react.dev/reference/react/lazy) in \`Card\`, use \`CardSSR\` from \`/ssr\` [entrypoint](https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/linking-platform/smart-card/src/ssr.tsx).
\`CardSSR\` has been fully integrated with \`inline\` appearance.

&nbsp;

${prerequisites}

### Installation

${code`yarn add @atlaskit/smart-card`}

### Usage

The following code example will render the inline Smart Link with no lazy-loading.

${code`
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { CardSSR } from '@atlaskit/smart-card/ssr';

// To use staging environment, you must be logged in at https://pug.jira-dev.com
<SmartCardProvider client={new CardClient('staging')}>
  <CardSSR appearance="inline" url="https://www.atlassian.com/" />
</SmartCardProvider>
`}


`;
