import type { SyntheticEvent } from 'react';
import React, { Component } from 'react';

import { createPortal } from 'react-dom';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { Popup } from '@atlaskit/editor-common/ui';
import { closestElement } from '@atlaskit/editor-common/utils';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { getSelectionRect, isTableSelected } from '@atlaskit/editor-tables/utils';

import { clearHoverSelection, hoverColumns, hoverRows } from '../../commands';
import { deleteColumnsWithAnalytics, deleteRowsWithAnalytics } from '../../commands-with-analytics';
import { getPluginState as getTablePluginState } from '../../pm-plugins/plugin-factory';
import type { RowStickyState } from '../../pm-plugins/sticky-headers';
import type { PluginInjectionAPI, TableDirection } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import {
	getColumnDeleteButtonParams,
	getColumnsWidths,
	getRowDeleteButtonParams,
	getRowHeights,
} from '../../utils';
import { stickyRowZIndex } from '../consts';

import DeleteButton from './DeleteButton';
import getPopupOptions from './getPopUpOptions';
import type { CellSelectionType } from './types';

export interface Props {
	editorView: EditorView;
	selection: Selection;
	api: PluginInjectionAPI | undefined | null;
	tableRef?: HTMLTableElement;
	mountPoint?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
	stickyHeaders?: RowStickyState;
	isNumberColumnEnabled?: boolean;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
}

export interface State {
	selectionType?: CellSelectionType;
	left: number;
	top: number;
	indexes: number[];
	position?: string;
	scrollLeft: number;
}

export function getSelectionType(selection: Selection): TableDirection | undefined {
	if (!isTableSelected(selection) && selection instanceof CellSelection) {
		if (selection.isRowSelection()) {
			return 'row';
		}
		if (selection.isColSelection()) {
			return 'column';
		}
	}

	return;
}

class FloatingDeleteButton extends Component<Props, State> {
	static displayName = 'FloatingDeleteButton';

	wrapper: HTMLElement | null = null;

	constructor(props: Props) {
		super(props);

		this.state = {
			selectionType: undefined,
			top: 0,
			left: 0,
			indexes: [],
			scrollLeft: 0,
		};
	}

	shouldComponentUpdate(_: Props, nextState: State) {
		return (
			this.state.selectionType !== nextState.selectionType ||
			this.state.left !== nextState.left ||
			this.state.top !== nextState.top ||
			this.state.scrollLeft !== nextState.scrollLeft
		);
	}

	componentDidMount() {
		this.updateWrapper();
	}

	componentDidUpdate() {
		this.updateWrapper();
	}

	updateWrapper = () => {
		const tableWrapper = closestElement(this.props.tableRef, `.${ClassName.TABLE_NODE_WRAPPER}`);
		if (tableWrapper) {
			this.wrapper = tableWrapper;
			this.wrapper.addEventListener('scroll', this.onWrapperScrolled);

			this.setState({
				scrollLeft: tableWrapper.scrollLeft,
			});
		} else {
			if (this.wrapper) {
				// unsubscribe if we previously had one and it just went away
				this.wrapper.removeEventListener('scroll', this.onWrapperScrolled);

				// and reset scroll position
				this.setState({
					scrollLeft: 0,
				});
			}

			this.wrapper = null;
		}
	};

	componentWillUnmount() {
		if (this.wrapper) {
			this.wrapper.removeEventListener('scroll', this.onWrapperScrolled);
		}
	}

	onWrapperScrolled = (e: Event) => {
		const wrapper = e.target as HTMLElement;
		this.setState({
			scrollLeft: wrapper.scrollLeft,
		});
	};

	/**
	 * We derivate the button state from the properties passed.
	 * We do this in here because we need this information in different places
	 * and this prevent to do multiple width calculations in the same component.
	 */
	static getDerivedStateFromProps(
		nextProps: Readonly<Props>,
		prevState: State,
	): Partial<State> | null {
		const selectionType = getSelectionType(nextProps.selection);

		const inStickyMode = nextProps.stickyHeaders && nextProps.stickyHeaders.sticky;

		const rect = getSelectionRect(nextProps.selection);

		// only tie row delete to sticky header if it's the only thing
		// in the selection, otherwise the row delete will hover around
		// the rest of the selection
		const firstRowInSelection = rect && rect.top === 0 && rect.bottom === 1;
		const shouldStickyButton = inStickyMode && firstRowInSelection;
		const stickyTop = nextProps.stickyHeaders
			? nextProps.stickyHeaders.top + nextProps.stickyHeaders.padding
			: 0;

		if (selectionType) {
			switch (selectionType) {
				case 'column': {
					// Calculate the button position and indexes for columns
					const columnsWidths = getColumnsWidths(nextProps.editorView);
					const deleteBtnParams = getColumnDeleteButtonParams(
						columnsWidths,
						nextProps.editorView.state.selection,
					);
					if (deleteBtnParams) {
						return {
							...deleteBtnParams,
							top: inStickyMode ? nextProps.stickyHeaders!.top : 0,
							position: inStickyMode ? 'sticky' : undefined,
							selectionType,
						};
					}
					return null;
				}
				case 'row': {
					// Calculate the button position and indexes for rows
					if (nextProps.tableRef) {
						const rowHeights = getRowHeights(nextProps.tableRef);
						const offsetTop = inStickyMode ? -rowHeights[0] : 0;

						const deleteBtnParams = getRowDeleteButtonParams(
							rowHeights,
							nextProps.editorView.state.selection,
							shouldStickyButton ? stickyTop : offsetTop,
						);

						if (deleteBtnParams) {
							return {
								...deleteBtnParams,
								position: shouldStickyButton ? 'sticky' : undefined,
								left: 0,
								selectionType: selectionType,
							};
						}
					}

					return null;
				}
			}
		}

		// Clean state if no type
		if (prevState.selectionType !== selectionType) {
			return {
				selectionType: undefined,
				top: 0,
				left: 0,
				indexes: [],
			};
		}

		// Do nothing if doesn't change anything
		return null;
	}

	private handleMouseEnter = () => {
		const { state, dispatch } = this.props.editorView;
		switch (this.state.selectionType) {
			case 'row': {
				return hoverRows(this.state.indexes!, true)(state, dispatch, this.props.editorView);
			}
			case 'column': {
				return hoverColumns(this.state.indexes!, true)(state, dispatch, this.props.editorView);
			}
		}
		return false;
	};

	private handleMouseLeave = () => {
		const { state, dispatch } = this.props.editorView;
		return clearHoverSelection()(state, dispatch);
	};

	/**
	 *
	 *
	 * @private
	 * @memberof FloatingDeleteButton
	 */
	private handleClick = (event: SyntheticEvent) => {
		event.preventDefault();
		const { editorAnalyticsAPI } = this.props;
		let { state, dispatch } = this.props.editorView;
		const {
			pluginConfig: { isHeaderRowRequired },
		} = getTablePluginState(state);

		const rect = getSelectionRect(state.selection);
		if (rect) {
			switch (this.state.selectionType) {
				case 'column': {
					deleteColumnsWithAnalytics(editorAnalyticsAPI, this.props.api)(INPUT_METHOD.BUTTON, rect)(
						state,
						dispatch,
						this.props.editorView,
					);
					return;
				}
				case 'row': {
					deleteRowsWithAnalytics(editorAnalyticsAPI)(
						INPUT_METHOD.BUTTON,
						rect,
						!!isHeaderRowRequired,
					)(state, dispatch);
					return;
				}
			}
		}
		({ state, dispatch } = this.props.editorView);
		clearHoverSelection()(state, dispatch);
	};

	render() {
		const { mountPoint, boundariesElement, tableRef } = this.props;
		const { selectionType } = this.state;

		if (!selectionType || !tableRef) {
			return null;
		}

		const tableContainerWrapper = closestElement(tableRef, `.${ClassName.TABLE_CONTAINER}`);

		const button = (
			<DeleteButton
				removeLabel={selectionType === 'column' ? messages.removeColumns : messages.removeRows}
				onClick={this.handleClick}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
			/>
		);

		const popupOpts = getPopupOptions({
			left: this.state.left,
			top: this.state.top,
			selectionType: this.state.selectionType,
			tableWrapper: this.wrapper,
		});

		const mountTo = tableContainerWrapper || mountPoint;
		if (this.state.position === 'sticky' && mountTo) {
			const headerRow = tableRef.querySelector('tr.sticky');
			if (headerRow) {
				const rect = headerRow!.getBoundingClientRect();

				const calculatePosition = popupOpts.onPositionCalculated || ((pos) => pos);
				const pos = calculatePosition({
					left: this.state.left,
					top: this.state.top,
				});

				return createPortal(
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							position: 'fixed',
							// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
							top: pos.top,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							zIndex: stickyRowZIndex,
							// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
							left:
								rect.left +
								(pos.left || 0) -
								(this.state.selectionType === 'column' ? this.state.scrollLeft : 0) -
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								(this.props.isNumberColumnEnabled ? akEditorTableNumberColumnWidth : 0),
						}}
					>
						{button}
					</div>,
					mountTo,
				);
			}
		}

		return (
			<Popup
				target={tableRef}
				mountTo={mountTo}
				boundariesElement={tableContainerWrapper || boundariesElement}
				scrollableElement={this.wrapper || undefined}
				forcePlacement={true}
				allowOutOfBounds
				{...popupOpts}
			>
				{button}
			</Popup>
		);
	}
}

export default FloatingDeleteButton;
