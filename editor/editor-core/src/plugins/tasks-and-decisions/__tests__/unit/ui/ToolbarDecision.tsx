import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '../../../../../__tests__/__helpers/enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';

import ToolbarDecision from '../../../../../plugins/tasks-and-decisions/ui/ToolbarDecision';
import ToolbarButton from '../../../../../ui/ToolbarButton';

describe('ToolbarDecision', () => {
  const createEditor = createEditorFactory();

  const providerFactory = new ProviderFactory();
  const editor = (doc: DocBuilder) =>
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
      <ToolbarDecision
        editorView={editorView}
        isDisabled={true}
        editorAPI={undefined}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
    toolbarOption.unmount();
  });
});
