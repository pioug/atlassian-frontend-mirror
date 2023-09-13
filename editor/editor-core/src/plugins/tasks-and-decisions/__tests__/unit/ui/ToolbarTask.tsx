import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '../../../../../__tests__/__helpers/enzyme';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';

import ToolbarTask from '../../../../../plugins/tasks-and-decisions/ui/ToolbarTask';
import ToolbarButton from '../../../../../ui/ToolbarButton';

describe('tasks and decisions - ToolbarTask', () => {
  const createEditor = createEditorFactory();

  const providerFactory = new ProviderFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTasksAndDecisions: true },
    });

  afterAll(() => {
    providerFactory.destroy();
  });

  it('should be disabled if isDisabled property is true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mountWithIntl(
      <ToolbarTask editorView={editorView} isDisabled={true} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
    toolbarOption.unmount();
  });
});
