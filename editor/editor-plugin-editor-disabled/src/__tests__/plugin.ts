/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { replaceRaf } from 'raf-stub';

import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { editorDisabledPlugin } from '../plugin';

replaceRaf();

describe('editor plugin disabled', () => {
  const createEditor = createProsemirrorEditorFactory();

  it('should update to be true if the view is not editable', () => {
    const { editorView, editorAPI } = createEditor({
      preset: new Preset<LightEditorPlugin>().add(editorDisabledPlugin),
    });
    editorView.dispatch(editorView.state.tr.insertText('test'));
    editorView.editable = false;

    (requestAnimationFrame as any).step();

    expect(
      editorAPI.editorDisabled.sharedState.currentState()?.editorDisabled,
    ).toBe(true);
  });

  it('should update to be false if the view is editable', () => {
    const { editorView, editorAPI } = createEditor({
      preset: new Preset<LightEditorPlugin>().add(editorDisabledPlugin),
    });
    editorView.dispatch(editorView.state.tr.insertText('test'));
    editorView.editable = true;

    (requestAnimationFrame as any).step();

    expect(
      editorAPI.editorDisabled.sharedState.currentState()?.editorDisabled,
    ).toBe(false);
  });

  it('should not update without an animation frame (and by default is not disabled)', () => {
    const { editorView, editorAPI } = createEditor({
      preset: new Preset<LightEditorPlugin>().add(editorDisabledPlugin),
    });
    editorView.dispatch(editorView.state.tr.insertText('test'));
    editorView.editable = false;

    expect(
      editorAPI.editorDisabled.sharedState.currentState()?.editorDisabled,
    ).toBe(false);
  });
});
