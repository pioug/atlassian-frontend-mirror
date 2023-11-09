import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { BlockTypeState } from '@atlaskit/editor-plugin-block-type';
// eslint-disable-next-line import/no-extraneous-dependencies
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, h1, h2, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('block-type setTextLevel command', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      // @ts-ignore Ignore no feature flags plugin (otherwise we have to move this out of the plugin package)
      .add([analyticsPlugin, {}])
      .add(blockTypePlugin);

    return createEditor<BlockTypeState, PluginKey, typeof preset>({
      doc,
      preset,
    });
  };

  it('should attach analytics event when changing to normal', () => {
    const { editorAPI, editorView } = editor(doc(h1('te{<>}xt')));
    const analyticsSpy = jest.spyOn(
      editorAPI?.analytics.actions,
      'attachAnalyticsEvent',
    );

    editorAPI?.core.actions.execute(
      editorAPI?.blockType.commands.setTextLevel(
        'normal',
        INPUT_METHOD.KEYBOARD,
      ),
    );

    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'formatted',
      actionSubject: 'text',
      actionSubjectId: 'heading',
      attributes: {
        inputMethod: 'keyboard',
        newHeadingLevel: 0,
        previousHeadingLevel: 1,
      },
      eventType: 'track',
    });
    expect(editorView.state.doc).toEqualDocument(doc(p('text')));
  });

  it('should attach analytics event when changing to heading from normal', () => {
    const { editorAPI, editorView } = editor(doc(p('te{<>}xt')));
    const analyticsSpy = jest.spyOn(
      editorAPI?.analytics.actions,
      'attachAnalyticsEvent',
    );

    editorAPI?.core.actions.execute(
      editorAPI?.blockType.commands.setTextLevel(
        'heading1',
        INPUT_METHOD.KEYBOARD,
      ),
    );

    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'formatted',
      actionSubject: 'text',
      actionSubjectId: 'heading',
      attributes: {
        inputMethod: 'keyboard',
        newHeadingLevel: 1,
        previousHeadingLevel: 0,
      },
      eventType: 'track',
    });
    expect(editorView.state.doc).toEqualDocument(doc(h1('text')));
  });

  it('should attach analytics event when changing between headings', () => {
    const { editorView, editorAPI } = editor(doc(h1('te{<>}xt')));
    const analyticsSpy = jest.spyOn(
      editorAPI?.analytics.actions,
      'attachAnalyticsEvent',
    );

    editorAPI?.core.actions.execute(
      editorAPI?.blockType.commands.setTextLevel(
        'heading2',
        INPUT_METHOD.KEYBOARD,
      ),
    );

    expect(editorView.state.doc).toEqualDocument(doc(h2('text')));
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'formatted',
      actionSubject: 'text',
      actionSubjectId: 'heading',
      attributes: {
        inputMethod: 'keyboard',
        newHeadingLevel: 2,
        previousHeadingLevel: 1,
      },
      eventType: 'track',
    });
  });
});
