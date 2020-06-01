import { default as FullPageExample } from './5-full-page';

export default function Example() {
  return FullPageExample({
    allowTables: {
      advanced: true,
      allowColumnSorting: true,
      allowAddColumnWithCustomStep: true,
    },
  });
}
