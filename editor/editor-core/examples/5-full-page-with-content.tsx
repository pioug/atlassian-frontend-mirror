import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import { default as FullPageExample } from './5-full-page';

export default function Example() {
  const exampleDocument = useExampleDocument();

  return FullPageExample({ defaultValue: exampleDocument });
}
