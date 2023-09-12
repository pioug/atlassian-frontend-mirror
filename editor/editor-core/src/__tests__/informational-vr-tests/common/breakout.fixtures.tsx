import React from 'react';
import { Editor } from '../../../index';
import adf from '../../visual-regression/common/__fixtures__/layout-empty.adf.json';

export function EditorWithBeakout() {
  return (
    <Editor
      defaultValue={adf}
      allowLayouts
      allowBreakout
      appearance="full-page"
    />
  );
}
