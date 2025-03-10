import { browser } from '@atlaskit/editor-common/browser';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { isTextSelection } from '@atlaskit/editor-common/utils';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

export const inlineCursorTargetStateKey = new PluginKey('inlineCursorTargetPlugin');

const isInlineNodeView = (node: Node | null | undefined) => {
	/**
	 * If inlineNodeView is a hardbreak we don't want to add decorations
	 * as it breaks soft line breaks for Japanese/Chinese keyboards.
	 */
	const isHardBreak = node?.type === node?.type.schema.nodes.hardBreak;
	return node && node.type.isInline && !node.type.isText && !isHardBreak;
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
				const safariShiftSelection = tr.getMeta(inlineCursorTargetStateKey) as boolean;

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
						node.setAttribute('aria-hidden', 'true');
						node.appendChild(document.createTextNode(ZERO_WIDTH_SPACE));
						node.className = 'cursor-target';

						const { $from } = selection;
						const rightPosition = $from.pos;
						const leftPosition = $from.posAtIndex(Math.max($from.index() - 1, 0));
						const widgetPos = side === 'left' ? leftPosition : rightPosition;

						return Decoration.widget(widgetPos, node, {
							raw: true,
							key: 'inlineCursor',
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
						} as any);
					};

					// Create editable decoration widgets around the current inline node to allow proper cursor navigation.
					if (
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
				// TODO: ED-26959 - We may be able to remove this when playing the following ticket:
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
	const potentiallyHandleByHandleTextInput = view.someProp('handleTextInput', (f) =>
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
