import type { BreakoutEventPayload } from '@atlaskit/editor-common/analytics';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Mark, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorGutterPaddingDynamic,
	akEditorGutterPadding,
	akEditorGutterPaddingReduced,
	akEditorFullPageNarrowBreakout,
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorCalculatedWideLayoutWidth,
	akEditorMaxLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import type { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type {
	BaseEventPayload,
	DragLocationHistory,
	ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

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
	FULL: akEditorFullWidthLayoutWidth,
	MAX: akEditorMaxLayoutWidth,
};

export function getProposedWidth({
	initialWidth,
	location,
	api,
	source,
}: {
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined;
	initialWidth: number;
	location: DragLocationHistory;
	source: ElementDragPayload;
}): number {
	const directionMultiplier = source.data.handleSide === 'left' ? -1 : 1;
	const diffX =
		(location.current.input.clientX - location.initial.input.clientX) *
		RESIZE_RATIO *
		directionMultiplier;

	const width = api?.width.sharedState?.currentState()?.width || 0;
	const padding =
		width <= akEditorFullPageNarrowBreakout &&
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
			? akEditorGutterPaddingReduced
			: akEditorGutterPaddingDynamic();

	const containerWidth = width - 2 * padding - akEditorGutterPadding;

	// the node width may be greater than the container width so we resize using the smaller value
	const proposedWidth = Math.min(initialWidth, containerWidth) + diffX;

	const snapPoints = [WIDTHS.MIN, WIDTHS.WIDE, Math.min(containerWidth, WIDTHS.FULL)];

	if (
		expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) ||
		expValEquals('confluence_max_width_content_appearance', 'isEnabled', true)
	) {
		snapPoints.push(Math.min(containerWidth, WIDTHS.MAX));
	}

	for (const snapPoint of snapPoints) {
		if (snapPoint - SNAP_GAP < proposedWidth && snapPoint + SNAP_GAP > proposedWidth) {
			return snapPoint;
		}
	}

	const hardMax =
		expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) ||
		expValEquals('confluence_max_width_content_appearance', 'isEnabled', true)
			? Math.min(containerWidth, WIDTHS.MAX)
			: Math.min(containerWidth, WIDTHS.FULL);

	return Math.max(WIDTHS.MIN, Math.min(proposedWidth, hardMax));
}

export function createResizerCallbacks({
	dom,
	contentDOM,
	view,
	mark,
	api,
}: {
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined;
	contentDOM: HTMLElement;
	dom: HTMLElement;
	mark: Mark;
	view: EditorView;
}): {
	onDrag: (args: BaseEventPayload<ElementDragType>) => void;
	onDragStart: () => void;
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
			startMeasure();

			const pos = view.posAtDOM(dom, 0);
			node = view.state.doc.nodeAt(pos);

			api?.core.actions.execute(({ tr }) => {
				api.userIntent?.commands.setCurrentUserIntent('dragging')({ tr });
				tr.setMeta('is-resizer-resizing', true);
				tr.setMeta(resizingPluginKey, {
					type: 'UPDATE_BREAKOUT_NODE',
					data: {
						node,
						pos,
						start: pos,
						depth: 0,
					},
				});

				return tr;
			});
		},
		onDrag: ({ location, source }) => {
			countFrames();

			const initialWidth = mark.attrs.width;
			const newWidth = getProposedWidth({ initialWidth, location, api, source });

			guidelines = getGuidelines(true, newWidth, getEditorWidth, node?.type);
			api?.guideline?.actions?.displayGuideline(view)({ guidelines });

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

			if (fg('platform_editor_breakout_resizing_width_changes')) {
				// dom is used for width calculations
				dom.style.setProperty(LOCAL_RESIZE_PROPERTY, `${newWidth}px`);
			} else {
				contentDOM.style.setProperty(LOCAL_RESIZE_PROPERTY, `${newWidth}px`);
			}
		},
		onDrop({ location, source }) {
			let payloads: BreakoutEventPayload[] = [];

			const frameRateSamples = endMeasure();
			payloads = generateResizeFrameRatePayloads({
				docSize: view.state.doc.nodeSize,
				frameRateSamples: reduceResizeFrameRateSamples(frameRateSamples),
				originalNode: node as PMNode,
			});

			const isResizedToFullWidth = !!guidelines.find(
				(guideline) => guideline.key.startsWith('full_width') && guideline.active,
			);

			let isResizedToMaxWidth = false;
			if (
				expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) ||
				expValEquals('confluence_max_width_content_appearance', 'isEnabled', true)
			) {
				isResizedToMaxWidth = !!guidelines.find(
					(guideline) => guideline.key.startsWith('max_width') && guideline.active,
				);
			}

			guidelines = getGuidelines(false, 0, getEditorWidth);
			api?.guideline?.actions?.displayGuideline(view)({ guidelines });

			const pos = view.posAtDOM(dom, 0);
			const mode = mark.attrs.mode;
			const initialWidth = mark.attrs.width;
			let newWidth = isResizedToFullWidth
				? WIDTHS.FULL
				: getProposedWidth({ initialWidth, location, api, source });

			if (
				expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) ||
				expValEquals('confluence_max_width_content_appearance', 'isEnabled', true)
			) {
				if (isResizedToMaxWidth) {
					newWidth = WIDTHS.MAX;
				}
			}

			const isEditMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'edit';

			setBreakoutWidth(newWidth, mode, pos, isEditMode)(view.state, view.dispatch);

			if (fg('platform_editor_breakout_resizing_width_changes')) {
				dom.style.removeProperty(LOCAL_RESIZE_PROPERTY);
			} else {
				contentDOM.style.removeProperty(LOCAL_RESIZE_PROPERTY);
			}

			if (node) {
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
				tr.setMeta(resizingPluginKey, { type: 'RESET_STATE' });

				return tr;
			});
		},
	};
}
