import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { render } from '@testing-library/react';
import React from 'react';
import Mobile from '../../Mobile';

describe('mobile editor', () => {
  const createEditor = createProsemirrorEditorFactory();

  const widthSharedStateUpdate = jest.fn();

  const stateCheckerPlugin: NextEditorPlugin<
    'test',
    { dependencies: [typeof widthPlugin] }
  > = ({ api }) => {
    api?.width.sharedState.onChange((state) => {
      widthSharedStateUpdate(state);
    });
    return { name: 'test' };
  };

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(widthPlugin)
        .add(stateCheckerPlugin),
    });

  beforeEach(() => {
    widthSharedStateUpdate.mockReset();
  });

  it('should emit the initial width to width plugin', () => {
    expect(widthSharedStateUpdate).toBeCalledTimes(0);
    const {
      editorView,
      editorConfig: { pluginHooks },
    } = editor(doc(p('Hello world'), p('Hello world')));

    expect(widthSharedStateUpdate).toBeCalledTimes(1);

    render(
      <Mobile
        editorView={editorView}
        editorDOMElement={<span>Editor Slot</span>}
        providerFactory={{} as ProviderFactory}
        featureFlags={{}}
        pluginHooks={pluginHooks}
      />,
    );

    expect(widthSharedStateUpdate).toBeCalledTimes(2);
  });
});
