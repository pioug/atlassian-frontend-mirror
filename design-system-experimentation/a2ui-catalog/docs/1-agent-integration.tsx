import { md } from '@atlaskit/docs';

const agentIntegration: any = md`
# Build an agent that produces A2UI

Install the catalog in the service that calls your model. Pin the npm version and commit your
lockfile so upgrades can be checked against the catalogs supported by your host.

~~~sh
npm install --save-exact @atlaskit/a2ui-catalog
~~~

## Load the catalog from npm

Use the prebuilt JSON in your Node.js CommonJS service. There is no React or schema-generation step.
This example prepares instructions for your model API; send the user's request separately.

~~~js
const catalog = require('@atlaskit/a2ui-catalog/catalogs/ads-v0_9/catalog.json');

const systemPrompt = [
	'Produce A2UI v0.9 JSON messages, without Markdown, HTML, or React code.',
	'Use only the catalog and actions supported by this host.',
	catalog.instructions,
	JSON.stringify(catalog),
].join('\\n\\n');

// Pass systemPrompt as system/developer instructions in your model API call.
// Parse and validate the response before passing messages to your host.
~~~

For ESM Node.js, use \`createRequire\` from \`node:module\` with
\`const require = createRequire(import.meta.url)\` before loading the JSON. Other languages can read
the same files from an installed package or a versioned asset produced by your build.

The model does not import npm packages itself. Your integration must provide the actual catalog
content in the prompt, a schema-aware tool, or an agent-readable resource. Supplying only an npm
package name or catalog ID does not teach the model the component contracts.

## Choose a catalog supported by your host

- \`catalogs/ads-v0_9/catalog.json\`: ADS base components, including text, layout, cards, inputs,
  and forms. Wire ID: \`com.atlassian.ads/v0_9\`. (Stable — start here)
- \`catalogs/agentic-jira-v0_9-v1/catalog.json\`: ADS plus CodeDiff, MultipleChoiceQuestions,
  RepositoryPicker, and ToolApproval. Wire ID: \`com.atlassian.agentic-jira/v0_9/v1\`. (under active
  development; backward compatibility is a goal, not yet a guarantee)

Use the second catalog only when your host implements those additional components. Catalog IDs are
identifiers, not URLs to fetch. Keep the npm version compatible with the host; changing the npm
scope does not change either wire ID.

## Emit a surface

The agent first creates a surface using the selected catalog ID, then supplies components. These two
messages render a minimal text surface in a compatible host:

~~~json
[
	{
		"version": "v0.9",
		"createSurface": {
			"surfaceId": "answer",
			"catalogId": "com.atlassian.ads/v0_9"
		}
	},
	{
		"version": "v0.9",
		"updateComponents": {
			"surfaceId": "answer",
			"components": [{ "id": "root", "component": "Text", "text": "Hello from your agent" }]
		}
	}
]
~~~

The array illustrates ordering. Use the framing required by your host, such as individual streamed
JSON messages. Keep the same surfaceId, use unique component IDs, and include a root component.
Child slots refer to component IDs. For editable values, emit path bindings such as
\`{ "path": "/field" }\` and initialize them with \`updateDataModel\`.
`;

export default agentIntegration;
