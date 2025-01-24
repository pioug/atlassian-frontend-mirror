import { createElement } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';
import ReactDOM from 'react-dom';
import { type IntlShape } from 'react-intl-next';
import uuid from 'uuid';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin, HandleOptions } from '../blockControlsPluginType';
import { DragHandle } from '../ui/drag-handle';

import { TYPE_HANDLE_DEC, TYPE_NODE_DEC, unmountDecorations } from './decorations-common';

export const emptyParagraphNodeDecorations = () => {
	const anchorName = `--node-anchor-paragraph-0`;
	const style = `anchor-name: ${anchorName}; margin-top: 0px;`;
	return Decoration.node(
		0,
		2,
		{
			style,
			['data-drag-handler-anchor-name']: anchorName,
		},
		{
			type: TYPE_NODE_DEC,
		},
	);
};

export const findHandleDec = (decorations: DecorationSet, from?: number, to?: number) => {
	return decorations.find(from, to, (spec) => spec.type === TYPE_HANDLE_DEC);
};

export const dragHandleDecoration = (
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage: IntlShape['formatMessage'],
	pos: number,
	anchorName: string,
	nodeType: string,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	handleOptions?: HandleOptions,
) => {
	unmountDecorations(
		nodeViewPortalProviderAPI,
		'data-blocks-drag-handle-container',
		'data-blocks-drag-handle-key',
	);

	let unbind: UnbindFn;
	const key = uuid();

	return Decoration.widget(
		pos,
		(view, getPosUnsafe) => {
			const element = document.createElement('span');
			// inline decoration causes focus issues when refocusing Editor into first line
			element.style.display = 'block';
			element.setAttribute('data-testid', 'block-ctrl-decorator-widget');
			element.setAttribute('data-blocks-drag-handle-container', 'true');
			element.setAttribute('data-blocks-drag-handle-key', key);
			let isTopLevelNode = true;

			const getPos = () => {
				try {
					return getPosUnsafe();
				} catch (e) {
					return undefined;
				}
			};

			if (editorExperiment('nested-dnd', true)) {
				const newPos = getPos();
				if (typeof newPos === 'number') {
					const $pos = view.state.doc.resolve(newPos);
					isTopLevelNode = $pos?.parent.type.name === 'doc';
				}
				/*
				 * We disable mouseover event to fix flickering issue on hover
				 * However, the tooltip for nested drag handle is no long working.
				 */
				if (newPos === undefined || !isTopLevelNode) {
					// This will also hide the tooltip.
					unbind = bind(element, {
						type: 'mouseover',
						listener: (e) => {
							e.stopPropagation();
						},
					});
				}
			}

			// There are times when global clear: "both" styles are applied to this decoration causing jumpiness
			// due to margins applied to other nodes eg. Headings
			element.style.clear = 'unset';

			if (fg('platform_editor_react18_plugin_portalprovider')) {
				nodeViewPortalProviderAPI.render(
					() =>
						createElement(DragHandle, {
							view,
							api,
							formatMessage,
							getPos,
							anchorName,
							nodeType,
							handleOptions,
							isTopLevelNode,
						}),
					element,
					key,
				);
			} else {
				ReactDOM.render(
					createElement(DragHandle, {
						view,
						api,
						formatMessage,
						getPos,
						anchorName,
						nodeType,
						handleOptions,
						isTopLevelNode,
					}),
					element,
				);
			}
			return element;
		},
		{
			side: -1,
			type: TYPE_HANDLE_DEC,
			testid: `${TYPE_HANDLE_DEC}-${uuid()}`,
			destroy: () => {
				if (editorExperiment('nested-dnd', true)) {
					unbind && unbind();
				}
			},
		},
	);
};
