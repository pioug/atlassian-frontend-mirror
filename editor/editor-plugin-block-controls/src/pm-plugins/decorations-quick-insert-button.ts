import { createElement } from 'react';

import { type IntlShape } from 'react-intl-next';
import uuid from 'uuid';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { QuickInsertWithVisibility, TypeAheadControl } from '../ui/quick-insert-button';

import { AnchorRectCache } from './utils/anchor-utils';
import { getActiveBlockMarks } from './utils/marks';
import { createVanillaButton } from './vanilla-quick-insert';

const TYPE_QUICK_INSERT = 'INSERT_BUTTON';

export const findQuickInsertInsertButtonDecoration = (
	decorations: DecorationSet,
	from?: number,
	to?: number,
) => {
	return decorations.find(from, to, (spec) => spec.type === TYPE_QUICK_INSERT);
};

type QuickInsertButtonDecorationParams = {
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	formatMessage: IntlShape['formatMessage'];
	rootPos: number;
	anchorName: string;
	nodeType: string;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	rootAnchorName?: string;
	rootNodeType?: string;
	anchorRectCache?: AnchorRectCache;
	editorState: EditorState;
};

export const quickInsertButtonDecoration = ({
	api,
	formatMessage,
	rootPos,
	anchorName,
	nodeType,
	nodeViewPortalProviderAPI,
	rootAnchorName,
	rootNodeType,
	anchorRectCache,
	editorState,
}: QuickInsertButtonDecorationParams) => {
	const key = uuid();
	const cleanupCallbacks: (() => void)[] = [];

	const widgetSpec = editorExperiment('platform_editor_breakout_resizing', true)
		? {
				side: -2,
				type: TYPE_QUICK_INSERT,
				/**
				 * sigh - `marks` influences the position that the widget is drawn (as described on the `side` property).
				 * Exclude 'breakout' on purpose, so the widgets render at the top of the document to avoid z-index issues
				 * Other block marks must be added, otherwise PM will split the DOM elements causing mutations and re-draws
				 */

				marks: fg('platform_editor_breakout_resizing_widget_fix')
					? getActiveBlockMarks(editorState, rootPos)
					: [],
				destroy: (_: Node) => {
					if (fg('platform_editor_fix_widget_destroy')) {
						nodeViewPortalProviderAPI.remove(key);
					}
					cleanupCallbacks.forEach((cb) => {
						cb();
					});
				},
			}
		: {
				side: -2,
				type: TYPE_QUICK_INSERT,
				destroy: (_: Node) => {
					if (fg('platform_editor_fix_widget_destroy')) {
						nodeViewPortalProviderAPI.remove(key);
					}
					cleanupCallbacks.forEach((cb) => {
						cb();
					});
				},
			};

	return Decoration.widget(
		rootPos,
		(view, getPos) => {
			const element = document.createElement('span');
			if (fg('platform_editor_controls_patch_15')) {
				// inline decoration causes cursor disappear when focusing editor at the first line (e.g. press Tab when title is focused)
				element.style.display = 'block';
			}
			element.contentEditable = 'false';
			element.setAttribute('data-blocks-quick-insert-container', 'true');
			element.setAttribute('data-testid', 'block-ctrl-quick-insert-button');
			if (
				editorExperiment('platform_editor_block_control_optimise_render', true, { exposure: true })
			) {
				const vanillaElement = createVanillaButton({
					formatMessage,
					api,
					view,
					getPos,
					cleanupCallbacks,
					rootAnchorName: rootAnchorName ?? nodeType,
					anchorName,
					rootNodeType: rootNodeType ?? nodeType,
					anchorRectCache,
				});
				element.appendChild(vanillaElement);
				return element;
			}

			// all changes already under experiment
			if (fg('platform_editor_controls_widget_visibility')) {
				nodeViewPortalProviderAPI.render(
					() =>
						createElement(QuickInsertWithVisibility, {
							api,
							getPos,
							formatMessage,
							view,
							nodeType,
							anchorName,
							rootAnchorName,
							rootNodeType: rootNodeType ?? nodeType,
							anchorRectCache,
						}),
					element,
					key,
				);
			} else {
				nodeViewPortalProviderAPI.render(
					() =>
						createElement(TypeAheadControl, {
							api,
							getPos,
							formatMessage,
							view,
							nodeType,
							anchorName,
							rootAnchorName,
							rootNodeType: rootNodeType ?? nodeType,
							anchorRectCache,
						}),
					element,
					key,
				);
			}

			return element;
		},
		widgetSpec,
	);
};
