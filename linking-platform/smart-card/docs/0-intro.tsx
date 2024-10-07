import { AtlassianInternalWarning, Example, Props } from '@atlaskit/docs';
import React from 'react';
import customMd from './utils/custom-md';
import DocQuickLinks from './utils/doc-quick-links';
import InProgressMessage from './utils/in-progress-message';

export default customMd`


${(<AtlassianInternalWarning />)}

${(<DocQuickLinks />)}

${(<InProgressMessage />)}

- [Card](./card)
- [HoverCard](./hover-card)
- [LinkUrl](./link-url)
- [Hooks](./hooks)

## Examples

You must be logged in at [https://pug.jira-dev.com](https://pug.jira-dev.com) to load the examples.

${(
	<Example
		Component={require('../examples/02-basic-example').default}
		title="An editable example"
		source={require('!!raw-loader!../examples/02-basic-example')}
	/>
)}

${(
	<Props
		heading="Smart Link Props"
		props={require('!!extract-react-types-loader!../src/view/CardWithUrl/loader')}
	/>
)}

`;
