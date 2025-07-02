import { createElement } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';
import ReactDOM from 'react-dom';
import { type IntlShape } from 'react-intl-next';
import uuid from 'uuid';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin, HandleOptions } from '../blockControlsPluginType';
import { DragHandle, DragHandleWithVisibility } from '../ui/drag-handle';

import { TYPE_HANDLE_DEC, TYPE_NODE_DEC, unmountDecorations } from './decorations-common';
import { AnchorRectCache } from './utils/anchor-utils';
import { getActiveBlockMarks } from './utils/marks';

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

type DragHandleDecorationParams = {
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	formatMessage: IntlShape['formatMessage'];
	pos: number;
	anchorName: string;
	nodeType: string;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	handleOptions?: HandleOptions;
	anchorRectCache?: AnchorRectCache;
	editorState: EditorState;
};

export const dragHandleDecoration = ({
	api,
	formatMessage,
	pos,
	anchorName,
	nodeType,
	nodeViewPortalProviderAPI,
	handleOptions,
	anchorRectCache,
	editorState,
}: DragHandleDecorationParams) => {
	if (
		!editorExperiment('platform_editor_block_control_optimise_render', true, {
			exposure: true,
		})
	) {
		unmountDecorations(
			nodeViewPortalProviderAPI,
			'data-blocks-drag-handle-container',
			'data-blocks-drag-handle-key',
		);
	}

	let unbind: UnbindFn;
	const key = uuid();

	const widgetSpec = editorExperiment('platform_editor_breakout_resizing', true)
		? {
				side: -1,
				type: TYPE_HANDLE_DEC,
				testid: `${TYPE_HANDLE_DEC}-${uuid()}`,
				/**
				 * sigh - `marks` influences the position that the widget is drawn (as described on the `side` property).
				 * Exclude 'breakout' on purpose, so the widgets render at the top of the document to avoid z-index issues
				 * Other block marks must be added, otherwise PM will split the DOM elements causing mutations and re-draws
				 */
				marks: fg('platform_editor_breakout_resizing_widget_fix')
					? getActiveBlockMarks(editorState, pos)
					: [],
				destroy: (node: Node) => {
					unbind && unbind();

					if (
						editorExperiment('platform_editor_block_control_optimise_render', true) &&
						node instanceof HTMLElement
					) {
						ReactDOM.unmountComponentAtNode(node);
					}
				},
			}
		: {
				side: -1,
				type: TYPE_HANDLE_DEC,
				testid: `${TYPE_HANDLE_DEC}-${uuid()}`,
				destroy: (node: Node) => {
					unbind && unbind();

					if (
						editorExperiment('platform_editor_block_control_optimise_render', true) &&
						node instanceof HTMLElement
					) {
						ReactDOM.unmountComponentAtNode(node);
					}
				},
			};

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
				if (fg('platform_editor_fix_widget_destroy')) {
					element.onmouseover = (e) => {
						e.stopPropagation();
					};
				} else {
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

			// temporarily re-instating ReactDOM.render to fix drag handle focus issue, fix to
			// follow via ED-26546

			// previous under platform_editor_react18_plugin_portalprovider
			// 	nodeViewPortalProviderAPI.render(
			// 		() =>
			// 			createElement(DragHandle, {
			// 				view,
			// 				api,
			// 				formatMessage,
			// 				getPos,
			// 				anchorName,
			// 				nodeType,
			// 				handleOptions,
			// 				isTopLevelNode,
			// 			}),
			// 		element,
			// 		key,
			// 	);

			if (
				editorExperiment('platform_editor_controls', 'variant1') &&
				fg('platform_editor_controls_widget_visibility')
			) {
				ReactDOM.render(
					createElement(DragHandleWithVisibility, {
						view,
						api,
						formatMessage,
						getPos,
						anchorName,
						nodeType,
						handleOptions,
						isTopLevelNode,
						anchorRectCache,
					}),
					element,
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
						anchorRectCache,
					}),
					element,
				);
			}

			return element;
		},
		widgetSpec,
	);
};
