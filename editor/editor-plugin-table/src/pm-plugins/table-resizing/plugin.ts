import classnames from 'classnames';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { TableCssClassName as ClassName } from '../../types';
import type { ColumnResizingPluginState } from '../../types';
import { getPluginState as getTablePluginState } from '../plugin-factory';

import { setResizeHandlePos } from './commands';
import { handleMouseDown } from './event-handlers';
import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { getResizeCellPos } from './utils';

export function createPlugin(
	dispatch: Dispatch<ColumnResizingPluginState>,
	{ lastColumnResizable = true }: ColumnResizingPluginState,
	getEditorContainerWidth: GetEditorContainerWidth,
	getEditorFeatureFlags: GetEditorFeatureFlags,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	isTableScalingEnabled?: boolean,
) {
	return new SafePlugin({
		key: pluginKey,
		state: createPluginState(dispatch, {
			lastColumnResizable,
			resizeHandlePos: null,
			dragging: null,
			lastClick: null,
		}),

		props: {
			attributes(state) {
				const pluginState = getPluginState(state);

				return {
					class: classnames(ClassName.RESIZING_PLUGIN, {
						[ClassName.RESIZE_CURSOR]: pluginState.resizeHandlePos !== null,
						[ClassName.IS_RESIZING]: !!pluginState.dragging,
					}),
				};
			},

			handleDOMEvents: {
				mousedown(view, event) {
					const { state } = view;
					const resizeHandlePos =
						// we're setting `resizeHandlePos` via command in unit tests
						getPluginState(state).resizeHandlePos || getResizeCellPos(view, event as MouseEvent);

					const { dragging } = getPluginState(state);
					let isColumnKeyboardResizeStarted = false;
					if (getBooleanFF('platform.editor.a11y-column-resizing_emcvz')) {
						/*
              We need to start listening mouse events if column resize started from keyboard.
              This will allow continue resizing via mouse
            */
						const { isKeyboardResize } = getTablePluginState(state);
						if (isKeyboardResize) {
							isColumnKeyboardResizeStarted = isKeyboardResize;
						}
					}

					if (resizeHandlePos !== null && (!dragging || isColumnKeyboardResizeStarted)) {
						if (
							handleMouseDown(
								view,
								event as MouseEvent,
								resizeHandlePos,
								getEditorContainerWidth,
								getEditorFeatureFlags,
								isTableScalingEnabled || false,
								editorAnalyticsAPI,
							)
						) {
							const { state, dispatch } = view;
							return setResizeHandlePos(resizeHandlePos)(state, dispatch);
						}
					}

					return false;
				},
			},
		},
	});
}
