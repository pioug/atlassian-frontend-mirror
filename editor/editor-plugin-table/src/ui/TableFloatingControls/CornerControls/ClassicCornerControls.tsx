import React, { Component } from 'react';

import classnames from 'classnames';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable, isTableSelected, selectTable } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import { clearHoverSelection, hoverTable } from '../../../pm-plugins/commands';
import { TableCssClassName as ClassName } from '../../../types';

import type { CornerControlProps } from './types';

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, @typescript-eslint/no-explicit-any
class CornerControlComponent extends Component<CornerControlProps & WrappedComponentProps, any> {
	render() {
		const {
			isInDanger,
			tableRef,
			isHeaderColumnEnabled,
			isHeaderRowEnabled,
			intl: { formatMessage },
		} = this.props;
		if (!tableRef) {
			return null;
		}
		const isActive = this.isActive();

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classnames(ClassName.CORNER_CONTROLS, {
					active: isActive,
					sticky: this.props.stickyTop !== undefined,
				})}
				style={{
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
					top: fg('platform_editor_breakout_use_css')
						? this.props.stickyTop !== undefined
							? `0px`
							: undefined
						: this.props.stickyTop !== undefined
							? `${this.props.stickyTop}px`
							: undefined,
				}}
				contentEditable={false}
			>
				<button
					aria-label={formatMessage(messages.cornerControl)}
					type="button"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={classnames(ClassName.CONTROLS_CORNER_BUTTON, {
						danger: isActive && isInDanger,
					})}
					onClick={this.selectTable}
					// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
					onMouseOver={this.hoverTable}
					// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
					onMouseOut={this.clearHoverSelection}
				/>

				{!isHeaderRowEnabled && (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					<div className={ClassName.CORNER_CONTROLS_INSERT_ROW_MARKER}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<div className={ClassName.CONTROLS_INSERT_MARKER} />
					</div>
				)}
				{!isHeaderColumnEnabled && (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					<div className={ClassName.CORNER_CONTROLS_INSERT_COLUMN_MARKER}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<div className={ClassName.CONTROLS_INSERT_MARKER} />
					</div>
				)}
			</div>
		);
	}

	private isActive = () => {
		const { editorView, hoveredRows, isResizing } = this.props;
		const { selection } = editorView.state;
		const table = findTable(selection);
		if (!table) {
			return false;
		}
		return (
			isTableSelected(selection) ||
			(hoveredRows && hoveredRows.length === TableMap.get(table.node).height && !isResizing)
		);
	};

	private clearHoverSelection = () => {
		const { state, dispatch } = this.props.editorView;
		clearHoverSelection()(state, dispatch);
	};

	private selectTable = () => {
		const { state, dispatch } = this.props.editorView;
		dispatch(selectTable(state.tr).setMeta('addToHistory', false));
	};

	private hoverTable = () => {
		const { state, dispatch } = this.props.editorView;
		hoverTable()(state, dispatch);
	};
}

export const CornerControls = injectIntl(CornerControlComponent);
