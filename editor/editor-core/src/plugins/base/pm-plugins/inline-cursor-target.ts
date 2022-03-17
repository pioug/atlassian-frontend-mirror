import { DecorationSet, Decoration, EditorView } from 'prosemirror-view';
import { ResolvedPos, Node } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, EditorState } from 'prosemirror-state';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';
import { isTextSelection } from '../../../utils';

export const inlineCursorTargetStateKey = new PluginKey(
  'inlineCursorTargetPlugin',
);

export const isInlineNodeView = (node: Node | null | undefined) => {
  return node && node.type.isInline && !node.type.isText;
};

export const findInlineNodeViewAfter = ($pos: ResolvedPos) =>
  isInlineNodeView($pos.nodeAfter);

export const findInlineNodeViewBefore = ($pos: ResolvedPos) =>
  isInlineNodeView($pos.nodeBefore) ||
  // This prevents the cursor from disappearing when at the beginning
  // of a paragraph and next to an inline node view.
  ($pos.parentOffset === 0 && isInlineNodeView($pos.nodeAfter));

export interface InlineCursorTargetState {
  cursorTarget?: {
    decorations: [Decoration | null, Decoration | null];
    positions: { from: number; to: number };
  };
}

export default () => {
  return new SafePlugin<InlineCursorTargetState>({
    key: inlineCursorTargetStateKey,

    state: {
      init: () => ({ cursorTarget: undefined }),
      apply(tr) {
        const { selection } = tr;
        const { $from, $to } = selection;

        if (selection && isTextSelection(selection)) {
          const hasInlineNodeViewAfter = findInlineNodeViewAfter($from);
          const hasInlineNodeViewBefore = findInlineNodeViewBefore($from);

          // Create editable widgets either side of the cursor to allow
          // text input. This prevents issues with the cursor disappearing
          // or apperaing in the wrong place when positioned between
          // non contenteditable nodes.
          // We check beforeInput events below to prevent content
          // being added to the decorations.
          if (hasInlineNodeViewAfter && hasInlineNodeViewBefore) {
            const createWidget = (side: 'left' | 'right') => {
              const node = document.createElement('span');
              node.contentEditable = 'true';
              node.appendChild(document.createTextNode(ZERO_WIDTH_SPACE));

              return Decoration.widget(selection.from, node, {
                raw: true,
                side: side === 'left' ? -1 : 1,
                key: 'inlineCursor',
              } as any);
            };

            return {
              cursorTarget: {
                decorations: [createWidget('left'), createWidget('right')],
                positions: { from: $from.pos, to: $to.pos },
              },
            };
          }
        }

        return { cursorTarget: undefined };
      },
    },
    props: {
      decorations(state: EditorState) {
        const { doc } = state;
        const { cursorTarget } = inlineCursorTargetStateKey.getState(
          state,
        ) as InlineCursorTargetState;

        if (cursorTargetHasValidDecorations(cursorTarget)) {
          return DecorationSet.create(doc, cursorTarget.decorations);
        }
        return null;
      },
      handleDOMEvents: {
        // Check the DOM to see if there are inline cursor targets
        // after a composition event ends. If so, manually insert the
        // event data in order to prevent contents ending up inside
        // of the cursor target decorations.
        compositionend: (view, incorrectlyTypedEvent) => {
          // This is typed by the prosemirror definitions as Event,
          // this type is incorrect, and it is actually an InputEvent
          const event = incorrectlyTypedEvent as CompositionEvent;
          const { state } = view;
          const { cursorTarget } = inlineCursorTargetStateKey.getState(
            state,
          ) as InlineCursorTargetState;
          if (cursorTarget !== undefined) {
            handleTextInputInsideCursorTargetDecoration({
              event,
              cursorTarget,
              view,
            });

            return true;
          }
          return false;
        },
        // Check the DOM to see if there are inline cursor targets
        // before any input event. If so, manually insert the
        // event data in order to prevent contents ending up inside
        // of the cursor target decorations.
        beforeinput: (view, incorrectlyTypedEvent) => {
          // This is typed by the prosemirror definitions as Event,
          // this type is incorrect, and it is actually an InputEvent
          const event = incorrectlyTypedEvent as InputEvent;
          const { state } = view;
          const { cursorTarget } = inlineCursorTargetStateKey.getState(
            state,
          ) as InlineCursorTargetState;

          if (!event.isComposing && cursorTarget !== undefined) {
            handleTextInputInsideCursorTargetDecoration({
              event,
              cursorTarget,
              view,
            });

            return true;
          }
          return false;
        },
      },
    },
  });
};

function cursorTargetHasValidDecorations(
  cursorTarget: InlineCursorTargetState['cursorTarget'],
): cursorTarget is {
  decorations: [Decoration, Decoration];
  positions: { from: number; to: number };
} {
  if (
    !cursorTarget ||
    // Decorations can end up as null when the decorations prop is
    // called after the decorations have been removed from the dom.
    // https://github.com/ProseMirror/prosemirror-view/blob/8f0d313a6389b86a335274fba36534ba1cb21f12/src/decoration.js#L30
    cursorTarget.decorations.includes(null)
  ) {
    return false;
  }
  return true;
}

function handleTextInputInsideCursorTargetDecoration({
  event,
  view,
  cursorTarget,
}: {
  event: InputEvent | CompositionEvent;
  view: EditorView;
  cursorTarget: NonNullable<InlineCursorTargetState['cursorTarget']>;
}) {
  event.stopPropagation();
  event.preventDefault();
  const content = event.data || '';
  const tr = view.state.tr;

  // ensure any custom handleTextInput handlers are called for the input event
  // ie. type ahead, emoji shortcuts.
  const potentiallyHandleByHandleTextInput = view.someProp(
    'handleTextInput',
    (f) =>
      f(view, cursorTarget.positions.from, cursorTarget.positions.to, content),
  );

  if (potentiallyHandleByHandleTextInput) {
    // if a handleTextInput handler has handled the event, we don't want to
    // manually update the document.
    return;
  }
  tr.insertText(content);
  view.dispatch(tr);
}
