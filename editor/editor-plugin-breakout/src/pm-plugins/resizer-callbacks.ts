import type { BreakoutEventPayload } from '@atlaskit/editor-common/analytics';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorGutterPaddingDynamic,
	akEditorGutterPadding,
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorCalculatedWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import type { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type {
	BaseEventPayload,
	DragLocationHistory,
	ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/types';

import type { BreakoutPlugin } from '../breakoutPluginType';
import { setBreakoutWidth } from '../editor-commands/set-breakout-width';

import { getGuidelines } from './get-guidelines';
import { LOCAL_RESIZE_PROPERTY } from './resizing-mark-view';
import { resizingPluginKey } from './resizing-plugin';
import { generateResizeFrameRatePayloads, generateResizedEventPayload } from './utils/analytics';
import { measureFramerate, reduceResizeFrameRateSamples } from './utils/measure-framerate';

const RESIZE_RATIO = 2;
const SNAP_GAP = 10;

const WIDTHS = {
	MIN: akEditorDefaultLayoutWidth,
	WIDE: akEditorCalculatedWideLayoutWidth,
	MAX: akEditorFullWidthLayoutWidth,
};

export function getProposedWidth({
	initialWidth,
	location,
	api,
	source,
}: {
	initialWidth: number;
	location: DragLocationHistory;
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined;
	source: ElementDragPayload;
}): number {
	const directionMultiplier = source.data.handleSide === 'left' ? -1 : 1;
	const diffX =
		(location.current.input.clientX - location.initial.input.clientX) *
		RESIZE_RATIO *
		directionMultiplier;

	const containerWidth =
		(api?.width.sharedState?.currentState()?.width || 0) -
		2 * akEditorGutterPaddingDynamic() -
		akEditorGutterPadding;

	// the node width may be greater than the container width so we resize using the smaller value
	const proposedWidth = Math.min(initialWidth, containerWidth) + diffX;

	if (fg('platform_editor_breakout_resizing_hello_release')) {
		const snapPoints = [WIDTHS.MIN, WIDTHS.WIDE, Math.min(containerWidth, WIDTHS.MAX)];

		for (const snapPoint of snapPoints) {
			if (snapPoint - SNAP_GAP < proposedWidth && snapPoint + SNAP_GAP > proposedWidth) {
				return snapPoint;
			}
		}
	}

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
	let node: PMNode | null = null;
	let guidelines: GuidelineConfig[] = [];
	const { startMeasure, endMeasure, countFrames } = measureFramerate();

	const getEditorWidth = () => {
		return api?.width?.sharedState.currentState();
	};

	return {
		onDragStart: () => {
			if (fg('platform_editor_breakout_resizing_hello_release')) {
				startMeasure();
			}

			const pos = view.posAtDOM(dom, 0);
			node = view.state.doc.nodeAt(pos);

			api?.core.actions.execute(({ tr }) => {
				api.userIntent?.commands.setCurrentUserIntent('dragging')({ tr });
				tr.setMeta('is-resizer-resizing', true);
				if (fg('platform_editor_breakout_resizing_hello_release')) {
					tr.setMeta(resizingPluginKey, {
						type: 'UPDATE_BREAKOUT_NODE',
						data: {
							node,
							pos,
							start: pos,
							depth: 0,
						},
					});
				}
				return tr;
			});
		},
		onDrag: ({ location, source }) => {
			if (fg('platform_editor_breakout_resizing_hello_release')) {
				countFrames();
			}
			const initialWidth = mark.attrs.width;
			const newWidth = getProposedWidth({ initialWidth, location, api, source });

			guidelines = getGuidelines(true, newWidth, getEditorWidth, node?.type);
			api?.guideline?.actions?.displayGuideline(view)({ guidelines });

			if (fg('platform_editor_breakout_resizing_hello_release')) {
				const activeGuideline = guidelines.find(
					(guideline) => guideline.active && !guideline.key.startsWith('grid'),
				);

				if (activeGuideline) {
					api?.core.actions.execute(({ tr }) => {
						tr.setMeta(resizingPluginKey, {
							type: 'UPDATE_ACTIVE_GUIDELINE_KEY',
							data: { activeGuidelineKey: activeGuideline.key },
						});
						return tr;
					});
				}

				if (!activeGuideline && api?.breakout.sharedState.currentState()?.activeGuidelineKey) {
					api?.core.actions.execute(({ tr }) => {
						tr.setMeta(resizingPluginKey, {
							type: 'CLEAR_ACTIVE_GUIDELINE_KEY',
						});
						return tr;
					});
				}
			}

			contentDOM.style.setProperty(LOCAL_RESIZE_PROPERTY, `${newWidth}px`);
		},
		onDrop({ location, source }) {
			let payloads: BreakoutEventPayload[] = [];

			if (fg('platform_editor_breakout_resizing_hello_release')) {
				const frameRateSamples = endMeasure();
				payloads = generateResizeFrameRatePayloads({
					docSize: view.state.doc.nodeSize,
					frameRateSamples: reduceResizeFrameRateSamples(frameRateSamples),
					originalNode: node as PMNode,
				});
			}

			const isResizedToFullWidth = !!guidelines.find(
				(guideline) => guideline.key.startsWith('full_width') && guideline.active,
			);

			guidelines = getGuidelines(false, 0, getEditorWidth);
			api?.guideline?.actions?.displayGuideline(view)({ guidelines });

			const pos = view.posAtDOM(dom, 0);
			const mode = mark.attrs.mode;
			const initialWidth = mark.attrs.width;
			const newWidth = isResizedToFullWidth
				? WIDTHS.MAX
				: getProposedWidth({ initialWidth, location, api, source });

			let isEditMode;
			if (fg('platform_editor_breakout_resizing_hello_release')) {
				isEditMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'edit';
			}
			setBreakoutWidth(newWidth, mode, pos, isEditMode)(view.state, view.dispatch);

			contentDOM.style.removeProperty(LOCAL_RESIZE_PROPERTY);
			if (node && fg('platform_editor_breakout_resizing_hello_release')) {
				const resizedPayload = generateResizedEventPayload({
					node,
					prevWidth: initialWidth,
					newWidth,
				});
				payloads.push(resizedPayload);
			}

			api?.core.actions.execute(({ tr }) => {
				api.userIntent?.commands.setCurrentUserIntent('default')({ tr });
				payloads.forEach((payload) => {
					api.analytics?.actions?.attachAnalyticsEvent(payload)(tr);
				});

				tr.setMeta('is-resizer-resizing', false).setMeta('scrollIntoView', false);

				if (fg('platform_editor_breakout_resizing_hello_release')) {
					tr.setMeta(resizingPluginKey, { type: 'RESET_STATE' });
				}

				return tr;
			});
		},
	};
}
