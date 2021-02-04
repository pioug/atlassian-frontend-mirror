import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import { default as FullPageExample } from './5-full-page';

export default function Example() {
  const defaultValue = useExampleDocument('./adf/table.json');

  return FullPageExample({
    defaultValue,
    allowTables: {
      allowColumnResizing: true,
      allowMergeCells: true,
      allowNumberColumn: true,
      allowBackgroundColor: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts: 'all',
      stickToolbarToBottom: true,
    },
  });
}
