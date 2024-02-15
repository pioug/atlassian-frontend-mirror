import React from 'react';

import { exampleDocument } from '../example-helpers/example-doc-with-unsupported';

import { default as FullPageExample } from './5-full-page';

const editorProps = {
  defaultValue: exampleDocument,
};

export default function Example() {
  return <FullPageExample editorProps={editorProps} />;
}
