import React from 'react';

import { EditorContext } from '../src';
import Editor from '../src/EditorWithActions';

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
