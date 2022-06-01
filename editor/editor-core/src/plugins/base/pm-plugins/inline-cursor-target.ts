import { DecorationSet, Decoration, EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, EditorState } from 'prosemirror-state';
import { ZERO_WIDTH_SPACE, browser } from '@atlaskit/editor-common/utils';
import { isTextSelection } from '../../../utils';

export const inlineCursorTargetStateKey = new PluginKey(
  'inlineCursorTargetPlugin',
);

export const isInlineNodeView = (node: Node | null | undefined) => {
  return node && node.type.isInline && !node.type.isText;
};
export interface InlineCursorTargetState {
  cursorTarget?: {
    decorations: (Decoration | null)[];
    positions: { from: number; to: number };
  };
}

export default () => {
  return new SafePlugin<InlineCursorTargetState>({
    key: inlineCursorTargetStateKey,

    state: {
      init: () => ({ cursorTarget: undefined }),
      apply(tr) {
        const { selection, doc } = tr;
        const { $from, $to } = selection;
        // In Safari, if the cursor target is to the right of the cursor it will block selections
        // made with shift + arrowRight and vice versa for shift + arrowLeft. This is due to a
        // contenteditable bug in safari, where editable elements block the selection but we need
        // the cursor target to be editable for the following:
        // - Ability to navigate with down/up arrows when between inline nodes
        // - Ability to navigate with down/up arrows when between the start of a paragraph & an inline node
        // - Ability to click and drag to select an inline node if it is the first node
        // To prevent blocking the selection, we check handleDOMEvents and add meta to
        // the transaction to prevent the plugin from making cursor target decorations.
        const safariShiftSelection = tr.getMeta(
          inlineCursorTargetStateKey,
        ) as boolean;

        if (selection && isTextSelection(selection) && !safariShiftSelection) {
          const hasInlineNodeViewAfter = isInlineNodeView($from.nodeAfter);
          const hasInlineNodeViewBefore = isInlineNodeView($from.nodeBefore);

          const isAtStartAndInlineNodeViewAfter =
            $from.parentOffset === 0 && isInlineNodeView($from.nodeAfter);
          const isAtEndAndInlineNodeViewBefore =
            doc.resolve($from.pos).node().lastChild === $from.nodeBefore &&
            isInlineNodeView($from.nodeBefore);

          const createWidget = (side: 'left' | 'right') => {
            const node = document.createElement('span');
            node.contentEditable = 'true';
            node.appendChild(document.createTextNode(ZERO_WIDTH_SPACE));
            node.className = 'cursor-target';

            return Decoration.widget(selection.from, node, {
              raw: true,
              side: side === 'left' ? -1 : 1,
              key: 'inlineCursor',
            } as any);
          };

          // Create editable decoration widgets either side of the cursor to allow
          // text input.
          // We check beforeInput events below to prevent content
          // being added to the decorations.
          //
          // This prevents issues with the cursor disappearing
          // or appearing in the wrong place when;
          // - positioned between inline nodes (chrome + firefox)
          // - positioned between the beginning of another node and an inline node (firefox)
          // - positioned between an inline node and the end of a node (chrome)
          if (
            !browser.safari &&
            (hasInlineNodeViewAfter || isAtEndAndInlineNodeViewBefore) &&
            (hasInlineNodeViewBefore || isAtStartAndInlineNodeViewAfter)
          ) {
            return {
              cursorTarget: {
                decorations: [createWidget('left'), createWidget('right')],
                positions: { from: $from.pos, to: $to.pos },
              },
            };
          }

          // Only create one widget on the left or right of the cursor in Safari.
          // This is to prevent the left key from being blocked when at the start of a paragraph,
          // and the right key from being blocked when at the end of a paragraph. This also
          // improves click and drag selections, making it easier to select the first node.
          if (browser.safari) {
            if (
              isAtEndAndInlineNodeViewBefore ||
              (hasInlineNodeViewBefore && hasInlineNodeViewAfter)
            ) {
              return {
                cursorTarget: {
                  decorations: [createWidget('left')],
                  positions: { from: $from.pos, to: $to.pos },
                },
              };
            } else if (isAtStartAndInlineNodeViewAfter) {
              return {
                cursorTarget: {
                  decorations: [createWidget('right')],
                  positions: { from: $from.pos, to: $to.pos },
                },
              };
            }
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
        // Workaround to prevent the decorations created by the plugin from
        // blocking shift + arrow left/right selections in safari. When
        // a shift + arrow left/right event is detected, send meta data to the
        // plugin to prevent it from creating decorations.
        // TODO We may be able to remove this when playing the following ticket:
        // https://product-fabric.atlassian.net/browse/ED-14938
        keydown: (view: EditorView, event: Event) => {
          if (
            browser.safari &&
            event instanceof KeyboardEvent &&
            event.shiftKey &&
            (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
          ) {
            view.dispatch(
              view.state.tr.setMeta(inlineCursorTargetStateKey, {
                cursorTarget: undefined,
              }),
            );
          }
          return false;
        },
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
  decorations: Decoration[];
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
