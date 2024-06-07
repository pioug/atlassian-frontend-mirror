import { md } from '@atlaskit/docs';

export default md`
# CSS Selectors to help integration testing

Here is the list of available css selectors (\`[data-test-...=""]\`) attributes that you might find
useful to use in integration/e2e tests available in media-picker:

- \`[data-testid="media-picker-file-input"]\`: \`<input type="file" />\` used to upload file from
  disk
`;
