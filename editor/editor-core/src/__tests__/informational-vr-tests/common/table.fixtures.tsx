import React from 'react';
import { Editor } from '../../../index';
import defaultTableAdf from '../../visual-regression/table/__fixtures__/default-table.adf.json';
import nestedTableAdf from '../../visual-regression/table/__fixtures__/nested-table-inside-columns.adf.json';

export function EditorWithTable() {
  return (
    <Editor
      appearance="full-page"
      allowBreakout
      allowTables={{ advanced: true }}
      defaultValue={defaultTableAdf}
    />
  );
}

export function EditorWithNestedTable() {
  return (
    <Editor
      appearance="full-page"
      allowBreakout
      allowLayouts
      allowTables={{ advanced: true }}
      defaultValue={nestedTableAdf}
    />
  );
}
