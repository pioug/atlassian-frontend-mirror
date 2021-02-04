import { default as FullPageExample } from './5-full-page';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';

export default function Example() {
  const defaultValue = useExampleDocument();
  const collabEditProvider = createCollabEditProvider(undefined, {
    autoConnect: true,
  });

  return FullPageExample({
    defaultValue,
    collabEditProvider,
  });
}
