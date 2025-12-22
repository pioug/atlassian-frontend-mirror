import type { DocNode } from '@atlaskit/adf-schema';
import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { browser } from '@atlaskit/editor-common/utils';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { cycleThroughPlaceholderPrompts } from './animation';
import { placeholderTestId } from './constants';

export function createPlaceholderDecoration(
	editorState: EditorState,
	placeholderText: string,
	placeholderPrompts?: string[],
	activeTypewriterTimeouts?: (() => void)[],
	pos: number = 1,
	initialDelayWhenUserTypedAndDeleted: number = 0,
	placeholderADF?: DocNode,
	showOnEmptyParagraph?: boolean,
): DecorationSet {
	const placeholderDecoration = document.createElement('span');
	let placeholderNodeWithText = placeholderDecoration;

	placeholderDecoration.setAttribute('data-testid', placeholderTestId);
	const shouldFadeIn = showOnEmptyParagraph && fg('platform_editor_ai_aifc_patch_ga_blockers');
	placeholderDecoration.className = shouldFadeIn
		? 'placeholder-decoration placeholder-decoration-fade-in'
		: 'placeholder-decoration';
	placeholderDecoration.setAttribute('aria-hidden', 'true');

	// PM sets contenteditable to false on Decorations so Firefox doesn't display the flashing cursor
	// So adding an extra span which will contain the placeholder text
	if (browser.gecko) {
		const placeholderNode = document.createElement('span');
		placeholderNode.setAttribute('contenteditable', 'true'); // explicitly overriding the default Decoration behaviour
		placeholderDecoration.appendChild(placeholderNode);
		placeholderNodeWithText = placeholderNode;
	}
	if (placeholderText) {
		placeholderNodeWithText.textContent = placeholderText || ' ';
	} else if (placeholderADF) {
		const serializer = DOMSerializer.fromSchema(editorState.schema);
		// Get a PMNode from docnode
		const docNode = processRawValue(editorState.schema, placeholderADF);
		if (docNode) {
			// Extract only the inline content from paragraphs, avoiding block-level elements
			// that can interfere with cursor rendering

			docNode.children.forEach((node) => {
				// For paragraph nodes, serialize their content (inline elements) directly
				// without the wrapping <p> tag
				if (node.type.name === 'paragraph') {
					node.content.forEach((inlineNode) => {
						const inlineDOM = serializer.serializeNode(inlineNode);
						placeholderNodeWithText.append(inlineDOM);
					});
				} else {
					// For non-paragraph nodes, serialize normally
					const nodeDOM = serializer.serializeNode(node);
					placeholderNodeWithText.append(nodeDOM);
				}
			});
			const markElements = placeholderNodeWithText.querySelectorAll(
				'[data-prosemirror-content-type="mark"]',
			);

			markElements.forEach((markEl) => {
				if (markEl instanceof HTMLElement) {
					markEl.style.setProperty('color', token('color.text.subtlest'));
				}
			});
			// Ensure all child elements don't block pointer events or cursor
			const allElements = placeholderNodeWithText.querySelectorAll('*');

			allElements.forEach((el) => {
				if (el instanceof HTMLElement) {
					el.style.pointerEvents = 'none';
					el.style.userSelect = 'none';
				}
			});
		}
	} else if (placeholderPrompts) {
		cycleThroughPlaceholderPrompts(
			placeholderPrompts,
			activeTypewriterTimeouts,
			placeholderNodeWithText,
			initialDelayWhenUserTypedAndDeleted,
		);
	}

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

	const isTargetNested = editorState.doc.resolve(pos).depth > 1;

	// only truncate text for nested nodes, otherwise applying 'overflow: hidden;' to top level nodes
	// creates issues with quick insert button
	if (isTargetNested && editorExperiment('platform_editor_controls', 'variant1')) {
		placeholderDecoration.classList.add('placeholder-decoration-hide-overflow');
	}

	return DecorationSet.create(editorState.doc, [
		Decoration.widget(pos, placeholderDecoration, {
			side: 0,
			key: `placeholder ${placeholderText}`,
		}),
	]);
}
