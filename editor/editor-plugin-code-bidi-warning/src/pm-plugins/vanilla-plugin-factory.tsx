import codeBidiWarningDecorator from '@atlaskit/code/bidi-warning-decorator';
import { pluginFactory, stepHasSlice } from '@atlaskit/editor-common/utils';
import { DOMSerializer, type Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { getCodeBidiWarningDomSpec } from './codeBidiWarningDomSpec';
import { codeBidiWarningPluginKey } from './plugin-key';
import reducer from './reducer';

export const pluginFactoryCreator = () =>
	pluginFactory(codeBidiWarningPluginKey, reducer, {
		onDocChanged: (tr, pluginState) => {
			if (!tr.steps.find(stepHasSlice)) {
				return pluginState;
			}

			const newBidiWarningsDecorationSet = createBidiWarningsDecorationSetFromDoc({
				doc: tr.doc,
				codeBidiWarningLabel: pluginState.codeBidiWarningLabel,
				tooltipEnabled: pluginState.tooltipEnabled,
			});

			return { ...pluginState, decorationSet: newBidiWarningsDecorationSet };
		},
	});

function assertIsElement(node: Node): asserts node is Element {
	// Using 1 instead of Node.ELEMENT_NODE just in case Node is not defined in some environments
	if (node.nodeType !== 1) {
		throw new Error('Code Bidi Warning DOM spec did not return an Element node');
	}
}

/**
 * Creates a DecorationSet containing widgets for each detected bidi character in code snippets within the document.
 * @param props - The properties for creating the decoration set.
 * @param props.doc - The ProseMirror document to scan for bidi characters.
 * @param props.codeBidiWarningLabel - The label to use for the warning tooltip.
 * @param props.tooltipEnabled - Whether tooltips are enabled for the warnings.
 * @returns A DecorationSet with widgets at the positions of detected bidi characters.
 */
export function createBidiWarningsDecorationSetFromDoc({
	doc,
	codeBidiWarningLabel,
	tooltipEnabled,
}: {
	codeBidiWarningLabel: string;
	doc: PmNode;
	tooltipEnabled: boolean;
}) {
	const bidiCharactersAndTheirPositions: {
		bidiCharacter: string;
		position: number;
	}[] = [];

	doc.descendants((node, pos) => {
		const isTextWithCodeMark =
			node.type.name === 'text' &&
			node.marks &&
			node.marks.some((mark) => mark.type.name === 'code');

		if (isTextWithCodeMark) {
			codeBidiWarningDecorator(node.textContent, ({ bidiCharacter, index }) => {
				bidiCharactersAndTheirPositions.push({
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					position: pos + index!,
					bidiCharacter,
				});
			});

			return false;
		}

		const isCodeBlock = node.type.name === 'codeBlock';

		if (isCodeBlock) {
			codeBidiWarningDecorator(node.textContent, ({ bidiCharacter, index }) => {
				bidiCharactersAndTheirPositions.push({
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					position: pos + index! + 1,
					bidiCharacter,
				});
			});
		}
	});

	// Bidi characters are not expected to commonly appear in code snippets, so recreating the decoration set
	// for documents rather than reusing existing decorations seems a reasonable performance/complexity tradeoff.

	if (bidiCharactersAndTheirPositions.length === 0) {
		return DecorationSet.empty;
	}

	return DecorationSet.create(
		doc,
		bidiCharactersAndTheirPositions.map(({ position, bidiCharacter }) => {
			return Decoration.widget(
				position,
				() => renderDOM(bidiCharacter, codeBidiWarningLabel, tooltipEnabled),
				{
					destroy: (node) => {
						assertIsElement(node);
						node.remove();
					},
				},
			);
		}),
	);
}

function renderDOM(
	bidiCharacter: string,
	codeBidiWarningLabel: string,
	tooltipEnabled: boolean,
): Element {
	const spec = getCodeBidiWarningDomSpec(bidiCharacter, codeBidiWarningLabel, tooltipEnabled);
	const { dom } = DOMSerializer.renderSpec(document, spec);
	// In SSR or non-browser DOM implementations, HTMLElement may not be present or cross-realm.
	// Accept any Element node (nodeType === Node.ELEMENT_NODE) instead of relying on instanceof checks.
	assertIsElement(dom);
	return dom;
}
