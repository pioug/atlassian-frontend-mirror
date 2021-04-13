import React from 'react';
import { DocBuilder, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import Mobile from '../../Mobile';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import {
  createWidthContext,
  WidthContext,
} from '@atlaskit/editor-common/src/ui/WidthProvider';
import { render } from '@testing-library/react';
import widthPlugin, {
  pluginKey as widthPluginKey,
  WidthPluginState,
} from '../../../../plugins/width/index';

interface ExternalWidthUpdateProps {
  editorView: EditorView;
  width: number;
}

const MobileWithExternalWidth: React.FC<ExternalWidthUpdateProps> = ({
  editorView,
  width,
}) => {
  return (
    <WidthContext.Provider value={createWidthContext(width)}>
      <Mobile
        editorView={editorView}
        editorDOMElement={<span>Editor Slot</span>}
        providerFactory={{} as ProviderFactory}
      />
    </WidthContext.Provider>
  );
};

describe('mobile editor', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(widthPlugin),
    });
  it('should emit the initial width to width plugin', () => {
    const initialWidth = 500;
    const { editorView } = editor(doc(p('Hello world'), p('Hello world')));

    render(
      <MobileWithExternalWidth editorView={editorView} width={initialWidth} />,
    );

    const widthState = widthPluginKey.getState(
      editorView.state,
    ) as WidthPluginState;

    expect(widthState.width).toEqual(initialWidth);
  });
});
