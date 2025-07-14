import React, { useMemo } from 'react';

import classnames from 'classnames';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { findTable, isTableSelected, selectTable } from '@atlaskit/editor-tables/utils';

import { clearHoverSelection } from '../../../pm-plugins/commands';
import type { TablePlugin } from '../../../tablePluginType';
import { TableCssClassName as ClassName } from '../../../types';

import type { CornerControlProps } from './types';

const DragCornerControlsComponent = ({
	editorView,
	isInDanger,
	isResizing,
	intl: { formatMessage },
}: CornerControlProps & WrappedComponentProps) => {
	const handleOnClick = () => {
		const { state, dispatch } = editorView;
		dispatch(selectTable(state.tr).setMeta('addToHistory', false));
	};

	const handleMouseOut = () => {
		const { state, dispatch } = editorView;
		clearHoverSelection()(state, dispatch);
	};

	const isActive = useMemo(() => {
		const { selection } = editorView.state;
		const table = findTable(selection);
		if (!table) {
			return false;
		}
		return isTableSelected(selection);
	}, [editorView.state]);

	if (isResizing) {
		return null;
	}

	return (
		<button
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={classnames(ClassName.DRAG_CORNER_BUTTON, {
				active: isActive,
				danger: isActive && isInDanger,
			})}
			aria-label={formatMessage(messages.cornerControl)}
			type="button"
			onClick={handleOnClick}
			// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
			onMouseOut={handleMouseOut}
			contentEditable={false}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
			<div className={ClassName.DRAG_CORNER_BUTTON_INNER} />
		</button>
	);
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<TablePlugin> | undefined) => {
		const { selection } = useSharedPluginStateWithSelector(api, ['selection'], (states) => ({
			selection: states.selectionState?.selection,
		}));
		return {
			selection,
		};
	},
	(api: ExtractInjectionAPI<TablePlugin> | undefined) => {
		const { selectionState } = useSharedPluginState(api, ['selection']);
		return {
			selection: selectionState?.selection,
		};
	},
);

const DragCornerControlsComponentWithSelection = ({
	editorView,
	isInDanger,
	isResizing,
	intl: { formatMessage },
	api,
}: CornerControlProps & WrappedComponentProps & { api?: ExtractInjectionAPI<TablePlugin> }) => {
	const { selection } = useSharedState(api);

	const handleOnClick = () => {
		const { state, dispatch } = editorView;
		dispatch(selectTable(state.tr).setMeta('addToHistory', false));
	};

	const handleMouseOut = () => {
		const { state, dispatch } = editorView;
		clearHoverSelection()(state, dispatch);
	};
	const isActive = useMemo(() => {
		if (!selection) {
			return;
		}
		const table = findTable(selection);
		if (!table) {
			return false;
		}
		return isTableSelected(selection);
	}, [selection]);

	if (isResizing) {
		return null;
	}

	return (
		<button
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={classnames(ClassName.DRAG_CORNER_BUTTON, {
				active: isActive,
				danger: isActive && isInDanger,
			})}
			aria-label={formatMessage(messages.cornerControl)}
			type="button"
			onClick={handleOnClick}
			// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
			onMouseOut={handleMouseOut}
			contentEditable={false}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
			<div className={ClassName.DRAG_CORNER_BUTTON_INNER} />
		</button>
	);
};

export const DragCornerControlsWithSelection = injectIntl(DragCornerControlsComponentWithSelection);

export const DragCornerControls = injectIntl(DragCornerControlsComponent);
