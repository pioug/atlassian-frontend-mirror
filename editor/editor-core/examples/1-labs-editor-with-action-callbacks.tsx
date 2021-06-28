import React from 'react';
import Editor from './../src/labs/EditorWithActions';
import { EditorContext } from '../src';

export default function Example() {
  return (
    <EditorContext>
      <Editor
        appearance="comment"
        quickInsert={true}
        onSave={(actions) =>
          actions
            .getValue()
            .then((value) => alert(JSON.stringify(value, null, 2)))
        }
        onCancel={(actions) => actions.clear()}
      />
    </EditorContext>
  );
}
