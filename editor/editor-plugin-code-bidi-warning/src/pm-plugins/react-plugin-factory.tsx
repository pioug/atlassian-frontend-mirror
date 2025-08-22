import React from 'react';

import uuid from 'uuid/v4';

import CodeBidiWarning from '@atlaskit/code/bidi-warning';
import codeBidiWarningDecorator from '@atlaskit/code/bidi-warning-decorator';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { pluginFactory, stepHasSlice } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

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
	codeBidiWarningLabel: string;
	doc: PmNode;
	nodeViewPortalProviderAPI: PortalProviderAPI;
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

	const newBidiWarningsDecorationSet = DecorationSet.create(
		doc,
		bidiCharactersAndTheirPositions.map(({ position, bidiCharacter }) => {
			const renderKey = uuid();

			return Decoration.widget(
				position,
				(el) =>
					renderDOM({
						bidiCharacter,
						codeBidiWarningLabel,
						tooltipEnabled,
						nodeViewPortalProviderAPI,
						renderKey,
					}),
				{
					destroy: (el) => {
						// removing portalprovider clean up due to a rendering bug
						// with this plugin under React 18. This matches the previous
						// React 16 behaviour which never cleaned up rendering.
						//
						// This will mean CodeBidi instances are not cleaned up, but
						// this is expected to be minimal due to the low frequency of
						// bidi characters in code blocks.
						//
						// We will fix this in a follow up ticket to rewrite the plugin
						// to use pure toDOM -> ED-26540
						// nodeViewPortalProviderAPI.remove(renderKey);
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
	nodeViewPortalProviderAPI: PortalProviderAPI;
	renderKey: string;
	tooltipEnabled: boolean;
}) {
	const element = document.createElement('span');

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

	return element;
}
