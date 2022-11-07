import React from 'react';
import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/example-doc-with-unsupported';

const editorProps = {
  defaultValue: exampleDocument,
};

export default function Example() {
  return <FullPageExample editorProps={editorProps} />;
}
