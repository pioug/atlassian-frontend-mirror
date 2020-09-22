import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/example-document';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';

export default function Example() {
  const collabProvider = createCollabEditProvider(undefined, {
    autoConnect: true,
  });

  return FullPageExample({
    defaultValue: exampleDocument,
    collabEditProvider: collabProvider,
  });
}
