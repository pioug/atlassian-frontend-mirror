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

export function createBidiWarningsDecorationSetFromDoc({
	doc,
	codeBidiWarningLabel,
	tooltipEnabled,
}: {
	doc: PmNode;
	codeBidiWarningLabel: string;
	tooltipEnabled: boolean;
}) {
	const bidiCharactersAndTheirPositions: {
		position: number;
		bidiCharacter: string;
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

	const newBidiWarningsDecorationSet = DecorationSet.create(
		doc,
		bidiCharactersAndTheirPositions.map(({ position, bidiCharacter }) => {
			return Decoration.widget(
				position,
				(el) => renderDOM(bidiCharacter, codeBidiWarningLabel, tooltipEnabled),
				{
					destroy: (el) => {
						if (!(el instanceof HTMLElement)) {
							throw new Error('Code Bidi Warning DOM spec did not return an HTMLElement');
						}
						el.remove();
					},
				},
			);
		}),
	);

	return newBidiWarningsDecorationSet;
}

function renderDOM(
	bidiCharacter: string,
	codeBidiWarningLabel: string,
	tooltipEnabled: boolean,
): HTMLElement {
	const spec = getCodeBidiWarningDomSpec(bidiCharacter, codeBidiWarningLabel, tooltipEnabled);
	const { dom } = DOMSerializer.renderSpec(document, spec);
	if (!(dom instanceof HTMLElement)) {
		throw new Error('Code Bidi Warning DOM spec did not return an HTMLElement');
	}
	return dom;
}
