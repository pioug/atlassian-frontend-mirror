import customMd from '../utils/custom-md';

export default customMd`

#### How to set the default appearance of Smart Links when pasting a URL in the editor?

By default, Smart Links are displayed with an inline appearance within the Editor.
Link providers who wish to specify a different appearance for certain links can achieve this by utilizing \`@atlaskit/editor-card-provider\`.
Please see [provider.ts](https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/linking-platform/editor-card-provider/src/provider.ts).

Things to consider:

* The appearance of Smart Links is configurable by products, and not all editors support block and/or embed appearances, such as Confluence inline comments.
* Smart Links that are initially set to default an embed appearance often experience a significant rate of reverting back to inline and/or URL display. See [Linking Platform dashboard on Amplitude](https://app.amplitude.com/analytics/atlassian/dashboard/0qaruj8).

#### Why is the embed appearance option unavailable for existing URL links but becomes available when converting that URL to an inline or block appearance?

In the editor, the editor card provider makes a request to get Smart Links' support patterns (\`/pattern\`).
These patterns are the first indication that the URL can be converted into Smart Links with inline and block appearance by matching the URL to the patterns.

The reason why embed appearance is not included is that not every link supports embed appearance,
and the only way to know is to request Smart Link data for that specific URL (\`/batch\` or \`/resolve\`).
This request happens when the editor renders Smart Links (inline, block, embed).

`;
