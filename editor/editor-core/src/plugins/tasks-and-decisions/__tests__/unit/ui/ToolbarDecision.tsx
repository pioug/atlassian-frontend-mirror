import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import ToolbarDecision from '../../../../../plugins/tasks-and-decisions/ui/ToolbarDecision';

describe('ToolbarDecision', () => {
  const createEditor = createEditorFactory();

  const providerFactory = new ProviderFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowTasksAndDecisions: true,
      },
    });

  afterAll(() => {
    providerFactory.destroy();
  });

  it('should be disabled if isDisabled property is true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mountWithIntl(
      <ToolbarDecision editorView={editorView} isDisabled={true} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
    toolbarOption.unmount();
  });
});
