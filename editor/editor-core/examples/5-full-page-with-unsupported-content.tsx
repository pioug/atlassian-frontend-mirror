import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/example-doc-with-unsupported';

export default function Example() {
  return FullPageExample({ defaultValue: exampleDocument });
}
