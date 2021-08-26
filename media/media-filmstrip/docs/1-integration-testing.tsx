import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

\`<Filmstrip />\` component has optional \`testId: string\` property that will be assigned to the top level DOM element as \`data-testid\` attribute.

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find useful to use in
integration/e2e tests available in media-filmstrip:

Following three \`data-testid\` attributes are default values in case \`testId\` prop is undefined.
Only one of these three can be found as a top DOM element:

- \`[data-testid="media-filmstrip"]\`: Root Filmstrip component
- \`[data-testid="media-filmstrip-list-item"]\`: Filmstrip item component
`;
