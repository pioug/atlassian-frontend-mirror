import { default as FullPageExample } from './5-full-page';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';

export default function Example() {
  const defaultValue = useExampleDocument('./adf/huge-table.adf.json');
  return FullPageExample({ defaultValue });
}
