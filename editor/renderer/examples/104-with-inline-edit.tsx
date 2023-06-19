import React, { useState } from 'react';
import { default as Renderer } from '../src/ui/Renderer';
import codeBlockADF from './helper/codeblock.adf.json';

import InlineEdit from '@atlaskit/inline-edit';
import Textfield from '@atlaskit/textfield';

export default function InlineEditWithRenderer() {
  const [editValue, setEditValue] = useState('Field value');

  return (
    <InlineEdit
      defaultValue={editValue}
      label="Inline edit"
      editView={({ errorMessage, ...fieldProps }) => (
        <Textfield {...fieldProps} autoFocus />
      )}
      readView={() => (
        <Renderer
          appearance="full-width"
          document={codeBlockADF}
          allowWrapCodeBlock
          allowCopyToClipboard
        />
      )}
      onConfirm={(value) => setEditValue(value)}
    />
  );
}
