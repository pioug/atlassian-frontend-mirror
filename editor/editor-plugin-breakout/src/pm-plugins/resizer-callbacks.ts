import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Mark } from '@atlaskit/editor-prosemirror/model';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorGutterPaddingDynamic,
	akEditorGutterPadding,
} from '@atlaskit/editor-shared-styles';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import {
	BaseEventPayload,
	DragLocationHistory,
	ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/types';

import { BreakoutPlugin } from '../breakoutPluginType';
import { setBreakoutWidth } from '../editor-commands/set-breakout-width';

import { LOCAL_RESIZE_PROPERTY } from './resizing-mark-view';

const RESIZE_RATIO = 2;
const WIDTHS = {
	MIN: 760,
	MAX: 1800,
};

function getProposedWidth({
	initialWidth,
	location,
	api,
}: {
	initialWidth: number;
	location: DragLocationHistory;
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined;
}): number {
	const diffX = (location.current.input.clientX - location.initial.input.clientX) * RESIZE_RATIO;
	const proposedWidth = initialWidth + diffX;

	// TODO: ED-28024 - add snapping logic

	const containerWidth =
		(api?.width.sharedState?.currentState()?.width || 0) -
		2 * akEditorGutterPaddingDynamic() -
		akEditorGutterPadding;
	return Math.min(Math.max(WIDTHS.MIN, Math.min(proposedWidth, containerWidth)), WIDTHS.MAX);
}

export function createResizerCallbacks({
	dom,
	contentDOM,
	view,
	mark,
	api,
}: {
	dom: HTMLElement;
	contentDOM: HTMLElement;
	view: EditorView;
	mark: Mark;
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined;
}): {
	onDragStart: () => void;
	onDrag: (args: BaseEventPayload<ElementDragType>) => void;
	onDrop: (args: BaseEventPayload<ElementDragType>) => void;
} {
	return {
		onDragStart: () => {
			requestAnimationFrame(() => {
				// TODO: ED-28027 - add guidelines
				api?.core.actions.execute(api.userIntent?.commands.setCurrentUserIntent('dragging'));
			});

			view.dispatch(view.state.tr.setMeta('is-resizer-resizing', true));
		},
		onDrag: ({ location }) => {
			const initialWidth = mark.attrs.width;
			const newWidth = getProposedWidth({ initialWidth, location, api });
			contentDOM.style.setProperty(LOCAL_RESIZE_PROPERTY, `${newWidth}px`);
		},
		onDrop({ location }) {
			// TODO: ED-28027 - remove guidelines
			preventUnhandled.stop();
			const pos = view.posAtDOM(dom, 0);
			if (pos === undefined) {
				return;
			}

			const mode = mark.attrs.mode;
			const initialWidth = mark.attrs.width;
			const newWidth = getProposedWidth({ initialWidth, location, api });

			setBreakoutWidth(newWidth, mode, pos)(view.state, view.dispatch);
			contentDOM.style.removeProperty(LOCAL_RESIZE_PROPERTY);

			view.dispatch(
				view.state.tr.setMeta('is-resizer-resizing', false).setMeta('scrollIntoView', false),
			);
			api?.core.actions.execute(api.userIntent?.commands.setCurrentUserIntent('default'));
		},
	};
}
