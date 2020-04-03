import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/example-document';

export default function Example() {
  return FullPageExample({
    defaultValue: exampleDocument,
    disabled: true,
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
