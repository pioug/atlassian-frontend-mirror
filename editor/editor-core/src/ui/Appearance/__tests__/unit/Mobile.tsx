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
import {
  NextEditorPlugin,
  PluginDependenciesAPI,
} from '@atlaskit/editor-common/types';
import { render } from '@testing-library/react';
import { LightEditorConfig } from '../../../../test-utils';
import { widthPlugin } from '@atlaskit/editor-plugin-width';

interface ExternalWidthUpdateProps {
  editorView: EditorView;
  width: number;
  contentComponents: LightEditorConfig['contentComponents'];
}

const MobileWithExternalWidth: React.FC<ExternalWidthUpdateProps> = ({
  editorView,
  width,
  contentComponents,
}) => {
  return (
    <WidthContext.Provider value={createWidthContext(width)}>
      <Mobile
        editorView={editorView}
        editorDOMElement={<span>Editor Slot</span>}
        providerFactory={{} as ProviderFactory}
        featureFlags={{}}
        contentComponents={contentComponents}
      />
    </WidthContext.Provider>
  );
};

describe('mobile editor', () => {
  const createEditor = createProsemirrorEditorFactory();

  const widthStateRef: {
    current: PluginDependenciesAPI<typeof widthPlugin> | null;
  } = { current: null };

  const stateCheckerPlugin: NextEditorPlugin<
    'test',
    { dependencies: [typeof widthPlugin] }
  > = (_, api) => {
    widthStateRef.current = api?.dependencies.width ?? null;
    return { name: 'test' };
  };

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(widthPlugin)
        .add(stateCheckerPlugin),
    });
  it('should emit the initial width to width plugin', () => {
    const initialWidth = 500;
    const {
      editorView,
      editorConfig: { contentComponents },
    } = editor(doc(p('Hello world'), p('Hello world')));

    render(
      <MobileWithExternalWidth
        editorView={editorView}
        width={initialWidth}
        contentComponents={contentComponents}
      />,
    );

    const widthState = widthStateRef.current?.sharedState.currentState();

    expect(widthState?.width).toEqual(initialWidth);
  });
});
