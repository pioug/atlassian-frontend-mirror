import { AtlassianInternalWarning, code, Example, Props } from '@atlaskit/docs';
import React from 'react';
import customMd from './utils/custom-md';
import DocQuickLinks from './utils/doc-quick-links';

export default customMd`

${(<DocQuickLinks />)}

${(<AtlassianInternalWarning />)}

Turns a URL into a card with metadata sourced from either:

- a Client which communicates with Object Resolver Service;
- a Client which with a custom fetch function (defined by you!).

If you have any questions, you can reach out to [#help-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV) for help.

## Usage

Standalone smart links:

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Card } from '@atlaskit/smart-card';

<SmartCardProvider>
	<Card appearance="inline" url={url} />
	<Card appearance="block" url={url} />
	<Card appearance="embed" url={url} />
	<Card appearance="block" url={url} >
		<TitleBlock />
		<PreviewBlock />
	</Card>
</SmartCardProvider>
`}

In the Fabric Editor - wrap your instance of the Editor:

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';

<SmartCardProvider>
  <ComposableEditor />
</SmartCardProvider>
`}

In the Fabric Renderer - wrap your instance of the Renderer:

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Renderer } from '@atlaskit/renderer';

<SmartCardProvider>
  <Renderer />
</SmartCardProvider>
`}

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
