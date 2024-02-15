/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { doc, indentation, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { indentationPlugin } from '../../index';

describe('indentation state', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>().add(indentationPlugin);

  it('should be able to outdent but not indent on text', () => {
    const { editorAPI } = createEditor({
      preset,
      doc: doc(p('text<{}>')),
    });
    expect(editorAPI?.indentation?.sharedState.currentState()).toEqual({
      indentDisabled: false,
      isIndentationAllowed: true,
      outdentDisabled: true,
    });
  });

  it('should be able to outdent if indented', () => {
    const { editorAPI } = createEditor({
      preset,
      doc: doc(indentation({ level: 1 })(p('text<{}>'))),
    });
    expect(editorAPI?.indentation?.sharedState.currentState()).toEqual({
      indentDisabled: false,
      isIndentationAllowed: true,
      outdentDisabled: false,
    });
  });

  it('should be able to outdent if indented at level 5', () => {
    const { editorAPI } = createEditor({
      preset,
      doc: doc(indentation({ level: 5 })(p('text<{}>'))),
    });
    expect(editorAPI?.indentation?.sharedState.currentState()).toEqual({
      indentDisabled: false,
      isIndentationAllowed: true,
      outdentDisabled: false,
    });
  });

  it('should not be able to indent if at level 6', () => {
    const { editorAPI } = createEditor({
      preset,
      doc: doc(indentation({ level: 6 })(p('text<{}>'))),
    });
    expect(editorAPI?.indentation?.sharedState.currentState()).toEqual({
      indentDisabled: true,
      isIndentationAllowed: true,
      outdentDisabled: false,
    });
  });
});
