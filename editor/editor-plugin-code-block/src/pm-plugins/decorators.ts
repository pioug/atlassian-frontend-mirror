import type { Node } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';

import type { CodeBlockLineAttributes } from '../types';
import { codeBlockClassNames } from '../ui/class-names';

const DECORATION_WIDGET_TYPE = 'decorationWidgetType';

export const generateLineAttributesFromNode = (pos: number, node: Node) => {
	// Get content node
	const contentNode = node.content;

	// Get node text content
	let lineAttributes: CodeBlockLineAttributes[] = [];
	contentNode.forEach((child) => {
		const nodeTextContent = child.textContent;
		const nodeStartPos = pos;

		let lineStartIndex = nodeStartPos;
		const newLineAttributes = nodeTextContent.split('\n').map((line, index) => {
			const lineLength = line.length;
			const lineStart = lineStartIndex + 1;
			const lineNumber = index + 1;

			// Include the newline character and increment to keep tabs on line position
			lineStartIndex += lineLength + 1;

			return { lineStart, lineNumber };
		});

		lineAttributes = [...lineAttributes, ...newLineAttributes];
	});

	return lineAttributes;
};

export const createDecorationSetFromLineAttributes = (
	lineAttributes: CodeBlockLineAttributes[],
) => {
	const widgetDecorations = lineAttributes.map((lineAttribute) => {
		const { lineStart, lineNumber } = lineAttribute;

		// Passing a function to create the widget rather than directly passing a widget, as per ProseMirror docs.
		const createLineNumberWidget = () => {
			const widget = document.createElement('span');
			widget.textContent = `${lineNumber}`;
			widget.classList.add(codeBlockClassNames.lineNumberWidget);
			return widget;
		};

		// side -1 is used so the line numbers are the first thing to the left of the lines of code.
		return Decoration.widget(lineStart, createLineNumberWidget, {
			type: DECORATION_WIDGET_TYPE,
			side: -1,
		});
	});

	return widgetDecorations;
};

export const createLineNumbersDecorations = (pos: number, node: Node) =>
	createDecorationSetFromLineAttributes(generateLineAttributesFromNode(pos, node));
