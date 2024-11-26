import React from 'react';

import ReactDOM from 'react-dom';
import uuid from 'uuid/v4';

import CodeBidiWarning from '@atlaskit/code/bidi-warning';
import codeBidiWarningDecorator from '@atlaskit/code/bidi-warning-decorator';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { pluginFactory, stepHasSlice } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { codeBidiWarningPluginKey } from './plugin-key';
import reducer from './reducer';

export const pluginFactoryCreator = (nodeViewPortalProviderAPI: PortalProviderAPI) =>
	pluginFactory(codeBidiWarningPluginKey, reducer, {
		onDocChanged: (tr, pluginState) => {
			if (!tr.steps.find(stepHasSlice)) {
				return pluginState;
			}

			const newBidiWarningsDecorationSet = createBidiWarningsDecorationSetFromDoc({
				doc: tr.doc,
				codeBidiWarningLabel: pluginState.codeBidiWarningLabel,
				tooltipEnabled: pluginState.tooltipEnabled,
				nodeViewPortalProviderAPI,
			});

			return { ...pluginState, decorationSet: newBidiWarningsDecorationSet };
		},
	});

export function createBidiWarningsDecorationSetFromDoc({
	doc,
	codeBidiWarningLabel,
	tooltipEnabled,
	nodeViewPortalProviderAPI,
}: {
	doc: PmNode;
	codeBidiWarningLabel: string;
	tooltipEnabled: boolean;
	nodeViewPortalProviderAPI: PortalProviderAPI;
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
			const renderKey = uuid();
			return Decoration.widget(
				position,
				() =>
					renderDOM({
						bidiCharacter,
						codeBidiWarningLabel,
						tooltipEnabled,
						nodeViewPortalProviderAPI,
						renderKey,
					}),
				{
					destroy: () => {
						if (fg('platform_editor_react18_plugin_portalprovider')) {
							nodeViewPortalProviderAPI.remove(renderKey);
						}
					},
				},
			);
		}),
	);

	return newBidiWarningsDecorationSet;
}

function renderDOM({
	bidiCharacter,
	codeBidiWarningLabel,
	tooltipEnabled,
	nodeViewPortalProviderAPI,
	renderKey,
}: {
	bidiCharacter: string;
	codeBidiWarningLabel: string;
	tooltipEnabled: boolean;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	renderKey: string;
}) {
	const element = document.createElement('span');

	if (fg('platform_editor_react18_plugin_portalprovider')) {
		nodeViewPortalProviderAPI.render(
			() => (
				<CodeBidiWarning
					bidiCharacter={bidiCharacter}
					skipChildren={true}
					label={codeBidiWarningLabel}
					tooltipEnabled={tooltipEnabled}
				/>
			),
			element,
			renderKey,
		);
	} else {
		// Note: we use this pattern elsewhere (see highlighting code block, and drop cursor widget decoration)
		// we should investigate if there is a memory leak with such usage.
		ReactDOM.render(
			<CodeBidiWarning
				bidiCharacter={bidiCharacter}
				skipChildren={true}
				label={codeBidiWarningLabel}
				tooltipEnabled={tooltipEnabled}
			/>,
			element,
		);
	}

	return element;
}
