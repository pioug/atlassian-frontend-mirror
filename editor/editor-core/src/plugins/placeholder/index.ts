import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { browser } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet, Decoration } from '@atlaskit/editor-prosemirror/view';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { isEmptyDocument, bracketTyped } from '@atlaskit/editor-common/utils';

export const pluginKey = new PluginKey('placeholderPlugin');
import { focusStateKey } from '../base/pm-plugins/focus-handler';
import { isTypeAheadOpen } from '../type-ahead/utils';
import { isComposing } from '../base/pm-plugins/composition';

interface PlaceHolderState {
  hasPlaceholder: boolean;
  placeholderText?: string;
  pos?: number;
}

function getPlaceholderState(editorState: EditorState): PlaceHolderState {
  return pluginKey.getState(editorState);
}
export const placeholderTestId = 'placeholder-test-id';

export function createPlaceholderDecoration(
  editorState: EditorState,
  placeholderText: string,
  pos: number = 1,
): DecorationSet {
  const placeholderDecoration = document.createElement('span');
  let placeholderNodeWithText = placeholderDecoration;

  placeholderDecoration.setAttribute('data-testid', placeholderTestId);
  placeholderDecoration.className = 'placeholder-decoration';

  // PM sets contenteditable to false on Decorations so Firefox doesn't display the flashing cursor
  // So adding an extra span which will contain the placeholder text
  if (browser.gecko) {
    const placeholderNode = document.createElement('span');
    placeholderNode.setAttribute('contenteditable', 'true'); // explicitly overriding the default Decoration behaviour
    placeholderDecoration.appendChild(placeholderNode);
    placeholderNodeWithText = placeholderNode;
  }

  placeholderNodeWithText.textContent = placeholderText || ' ';

  // ME-2289 Tapping on backspace in empty editor hides and displays the keyboard
  // Add a editable buff node as the cursor moving forward is inevitable
  // when backspace in GBoard composition
  if (browser.android && browser.chrome) {
    const buffNode = document.createElement('span');
    buffNode.setAttribute('class', 'placeholder-android');
    buffNode.setAttribute('contenteditable', 'true');
    buffNode.textContent = ' ';
    placeholderDecoration.appendChild(buffNode);
  }

  return DecorationSet.create(editorState.doc, [
    Decoration.widget(pos, placeholderDecoration, {
      side: 0,
      key: 'placeholder',
    }),
  ]);
}

function setPlaceHolderState(
  placeholderText: string,
  pos?: number,
): PlaceHolderState {
  return {
    hasPlaceholder: true,
    placeholderText,
    pos: pos ? pos : 1,
  };
}

const emptyPlaceholder: PlaceHolderState = { hasPlaceholder: false };

function createPlaceHolderStateFrom(
  editorState: EditorState,
  defaultPlaceholderText?: string,
  bracketPlaceholderText?: string,
): PlaceHolderState {
  const isEditorFocused = focusStateKey.getState(editorState);

  if (isTypeAheadOpen(editorState)) {
    return emptyPlaceholder;
  }

  if (defaultPlaceholderText && isEmptyDocument(editorState.doc)) {
    return setPlaceHolderState(defaultPlaceholderText);
  }

  if (bracketPlaceholderText && bracketTyped(editorState) && isEditorFocused) {
    const { $from } = editorState.selection;
    // Space is to account for positioning of the bracket
    const bracketHint = '  ' + bracketPlaceholderText;
    return setPlaceHolderState(bracketHint, $from.pos - 1);
  }
  return emptyPlaceholder;
}

export function createPlugin(
  defaultPlaceholderText?: string,
  bracketPlaceholderText?: string,
): SafePlugin | undefined {
  if (!defaultPlaceholderText && !bracketPlaceholderText) {
    return;
  }

  return new SafePlugin<PlaceHolderState>({
    key: pluginKey,
    state: {
      init: (_, state) =>
        createPlaceHolderStateFrom(
          state,
          defaultPlaceholderText,
          bracketPlaceholderText,
        ),
      apply: (tr, _oldPluginState, _oldEditorState, newEditorState) => {
        const meta = tr.getMeta(pluginKey);

        if (meta) {
          if (meta.removePlaceholder) {
            return emptyPlaceholder;
          }

          if (meta.applyPlaceholderIfEmpty) {
            return createPlaceHolderStateFrom(
              newEditorState,
              defaultPlaceholderText,
              bracketPlaceholderText,
            );
          }
        }

        return createPlaceHolderStateFrom(
          newEditorState,
          defaultPlaceholderText,
          bracketPlaceholderText,
        );
      },
    },
    props: {
      decorations(editorState): DecorationSet | undefined {
        const { hasPlaceholder, placeholderText, pos } =
          getPlaceholderState(editorState);

        if (
          hasPlaceholder &&
          placeholderText &&
          pos !== undefined &&
          !isComposing(editorState)
        ) {
          return createPlaceholderDecoration(editorState, placeholderText, pos);
        }
        return;
      },
    },
  });
}

export interface PlaceholderPluginOptions {
  placeholder?: string;
  placeholderBracketHint?: string;
}

const placeholderPlugin: NextEditorPlugin<
  'placeholder',
  {
    pluginConfiguration: PlaceholderPluginOptions | undefined;
  }
> = (options?) => ({
  name: 'placeholder',

  pmPlugins() {
    return [
      {
        name: 'placeholder',
        plugin: () =>
          createPlugin(
            options && options.placeholder,
            options && options.placeholderBracketHint,
          ),
      },
    ];
  },
});

export default placeholderPlugin;
