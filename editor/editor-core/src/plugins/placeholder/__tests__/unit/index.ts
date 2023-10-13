import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { placeholderPlugin } from '@atlaskit/editor-plugin-placeholder';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
// ONCE WE DECOUPLE TYPE-AHEAD LET'S MOVE THIS TEST INTO @atlaskit/editor-plugin-placeholder
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { TypeAheadHandler } from '@atlaskit/editor-common/types';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';

const placeholderTestId = 'placeholder-test-id';

function expectNoPlaceholder(editorView: EditorView) {
  const placeholder = editorView.dom.querySelector(
    `[data-testid=${placeholderTestId}]`,
  );

  expect(placeholder).toBe(null);
}

function expectPlaceHolderWithText(editorView: EditorView, text: string) {
  editorView.focus();
  const placeholder = editorView.dom.querySelector(
    `[data-testid=${placeholderTestId}]`,
  );

  expect(placeholder).toBeDefined();
  expect(placeholder!.textContent).toEqual(text);
}

const defaultPlaceholder = 'defaultPlaceholder';

describe('placeholder', () => {
  const createProsemirrorEditor = createProsemirrorEditorFactory();

  describe('Empty placeholder', () => {
    const emptyPlaceholderEditor = (doc: DocBuilder) =>
      createProsemirrorEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add(focusPlugin)
          .add(compositionPlugin)
          .add(typeAheadPlugin)
          .add([placeholderPlugin, { placeholder: defaultPlaceholder }]),
      });

    it('renders a placeholder on a blank document', async () => {
      const { editorView } = await emptyPlaceholderEditor(doc(p()));

      expectPlaceHolderWithText(editorView, defaultPlaceholder);
    });

    it('disappears when content is added to document', async () => {
      const { editorView } = await emptyPlaceholderEditor(doc(p()));
      expectPlaceHolderWithText(editorView, defaultPlaceholder);

      insertText(editorView, 'a', 0);

      expectNoPlaceholder(editorView);
    });

    it('disappears when type-ahead handler is opened', async () => {
      const { editorView, editorAPI } = await emptyPlaceholderEditor(doc(p()));
      const fakeTriggerHandler: TypeAheadHandler = {
        id: TypeAheadAvailableNodes.QUICK_INSERT,
        trigger: '/',
        getItems: () => Promise.resolve([]),
        selectItem: () => false,
      };
      expectPlaceHolderWithText(editorView, defaultPlaceholder);

      editorAPI.typeAhead.actions.open({
        triggerHandler: fakeTriggerHandler,
        inputMethod: INPUT_METHOD.KEYBOARD,
      });
      expectNoPlaceholder(editorView);
    });
  });

  describe('Default and Hint placeholder', () => {
    const fullPlaceholderEditor = (doc: DocBuilder) =>
      createProsemirrorEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add(focusPlugin)
          .add(compositionPlugin)
          .add(typeAheadPlugin)
          .add([
            placeholderPlugin,
            {
              placeholder: defaultPlaceholder,
            },
          ]),
      });
    it('renders the default placeholder on a blank content', async () => {
      const { editorView } = await fullPlaceholderEditor(doc(p()));

      expectPlaceHolderWithText(editorView, defaultPlaceholder);
    });
  });
});
