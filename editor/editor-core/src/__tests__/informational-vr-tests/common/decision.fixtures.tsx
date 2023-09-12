import React from 'react';
import { Editor } from '../../../index';
import adf from '../../visual-regression/common/__fixtures__/decision-adf.json';

export function EditorWithDecision() {
  return (
    <Editor defaultValue={adf} allowTasksAndDecisions appearance="full-page" />
  );
}
