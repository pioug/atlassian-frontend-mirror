import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type BlockControlsPlugin } from '../blockControlsPluginType';

const isEmptyNestedParagraphOrHeading = (target: EventTarget | null) => {
	if (target instanceof HTMLHeadingElement || target instanceof HTMLParagraphElement) {
		return !target.parentElement?.classList.contains('ProseMirror') && target.textContent === '';
	}
	return false;
};

export const handleMouseOver = (
	view: EditorView,
	event: Event,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
) => {
	const {
		isDragging,
		activeNode,
		isMenuOpen,
		menuTriggerBy: originalAnchorName,
	} = api?.blockControls?.sharedState.currentState() || {};
	const { editorDisabled } = api?.editorDisabled?.sharedState.currentState() || {
		editorDisabled: false,
	};

	// We shouldn't be firing mouse over transactions when the editor is disabled
	if (editorDisabled && fg('platform_editor_ai_rovo_free_gen')) {
		return false;
	}

	// Most mouseover events don't fire during drag but some can slip through
	// when the drag begins. This prevents those.
	if (isDragging) {
		return false;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const target = event.target as HTMLElement;

	if (target?.classList?.contains('ProseMirror')) {
		return false;
	}

	let rootElement = target?.closest('[data-drag-handler-anchor-name]');
	if (rootElement) {
		// We want to exlude handles from showing for empty paragraph and heading nodes
		if (isEmptyNestedParagraphOrHeading(rootElement)) {
			return false;
		}

		if (
			rootElement.getAttribute('data-drag-handler-node-type') === 'media' &&
			editorExperiment('advanced_layouts', true)
		) {
			rootElement = rootElement.closest(
				'[data-drag-handler-anchor-name][data-drag-handler-node-type="mediaSingle"]',
			);

			if (!rootElement) {
				return false;
			}
		}

		const parentElement = rootElement.parentElement?.closest('[data-drag-handler-anchor-name]');
		const parentElementType = parentElement?.getAttribute('data-drag-handler-node-type');

		if (editorExperiment('advanced_layouts', true)) {
			// We want to exclude handles from showing for direct descendant of table nodes (i.e. nodes in cells)
			if (fg('platform_editor_table_drag_handle_shift_fix')) {
				if (parentElement && parentElementType === 'table') {
					rootElement = parentElement;
				} else if (parentElement && parentElementType === 'tableRow') {
					const grandparentElement = parentElement?.parentElement?.closest(
						'[data-drag-handler-anchor-name]',
					);
					const grandparentElementType = grandparentElement?.getAttribute(
						'data-drag-handler-node-type',
					);

					if (grandparentElement && grandparentElementType === 'table') {
						rootElement = grandparentElement;
					}
				}
			} else if (
				parentElement &&
				(parentElementType === 'table' || parentElementType === 'tableRow')
			) {
				rootElement = parentElement;
			}
		} else {
			// We want to exclude handles from showing for direct descendant of table nodes (i.e. nodes in cells)
			if (parentElement && parentElementType === 'table') {
				rootElement = parentElement;
			}
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const anchorName = rootElement.getAttribute('data-drag-handler-anchor-name')!;
		// No need to update handle position if its already there
		if (activeNode?.anchorName === anchorName) {
			return false;
		}

		// We want to exlude handles from showing for wrapped nodes
		// TODO: ED-26959 - We should be able remove these check if we decided to
		// go we not decoration for wrapped image solution.
		if (['wrap-right', 'wrap-left'].includes(rootElement.getAttribute('layout') || '')) {
			return false;
		}

		const parentRootElement = rootElement.parentElement;
		let pos: number;
		if (parentRootElement) {
			const childNodes = Array.from(parentRootElement.childNodes);
			const index = childNodes.indexOf(rootElement);
			pos = view.posAtDOM(parentRootElement, index);

			// We want to exlude handles showing for first element in a Panel, ignoring widgets like gapcursor
			const firstChildIsWidget =
				parentRootElement?.children[0]?.classList.contains('ProseMirror-widget');
			if (
				parentElement &&
				parentElementType === 'panel' &&
				!parentElement.classList.contains('ak-editor-panel__no-icon') &&
				(index === 0 || (firstChildIsWidget && index === 1))
			) {
				return false;
			}
		} else {
			pos = view.posAtDOM(rootElement, 0);
		}

		if (
			parentRootElement &&
			parentRootElement.getAttribute('data-layout-section') === 'true' &&
			parentRootElement.querySelectorAll('[data-layout-column]').length === 1 &&
			editorExperiment('advanced_layouts', true)
		) {
			// Don't show drag handle for layout column in a single column layout
			return false;
		}

		const targetPos = view.state.doc.resolve(pos).pos;

		let rootAnchorName;
		let rootNodeType;
		let rootPos;

		if (editorExperiment('platform_editor_controls', 'variant1')) {
			rootPos = view.state.doc.resolve(pos).before(1);
			if (targetPos !== rootPos) {
				const rootDOM = view.nodeDOM(rootPos);
				if (rootDOM instanceof HTMLElement) {
					rootAnchorName = rootDOM.getAttribute('data-drag-handler-anchor-name') ?? undefined;
					rootNodeType = rootDOM.getAttribute('data-drag-handler-node-type') ?? undefined;
				}
			}
		}

		const nodeType = rootElement.getAttribute('data-drag-handler-node-type');

		if (nodeType) {
			if (editorExperiment('platform_editor_controls', 'variant1')) {
				api?.core?.actions.execute(
					api?.blockControls?.commands.showDragHandleAt(
						targetPos,
						anchorName,
						nodeType,
						undefined,
						rootPos ?? targetPos,
						rootAnchorName ?? anchorName,
						rootNodeType ?? nodeType,
					),
				);
			} else {
				api?.core?.actions.execute(
					api?.blockControls?.commands.showDragHandleAt(targetPos, anchorName, nodeType),
				);
			}

			if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
				if (
					isMenuOpen &&
					originalAnchorName &&
					api?.userIntent?.sharedState.currentState()?.currentUserIntent === 'blockMenuOpen'
				) {
					api?.core?.actions.execute(api?.blockControls?.commands.toggleBlockMenu());
				}
			}
		}
	}
};
