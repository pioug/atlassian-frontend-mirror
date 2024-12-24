/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { focusToContextMenuTrigger } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { Popup } from '@atlaskit/editor-common/ui';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorSmallZIndex } from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/utility/migration/chevron-down';

import { toggleContextualMenu } from '../../pm-plugins/commands';
import type { RowStickyState } from '../../pm-plugins/sticky-headers/types';
import { TableCssClassName as ClassName } from '../../types';

// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import FixedButton from './FixedButton';
import { tableFloatingCellButtonSelectedStyles, tableFloatingCellButtonStyles } from './styles';

export interface Props {
	editorView: EditorView;
	tableWrapper?: HTMLElement;
	tableNode?: PMNode;
	targetCellPosition: number;
	isContextualMenuOpen?: boolean;
	mountPoint?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
	isNumberColumnEnabled?: boolean;
	stickyHeader?: RowStickyState;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	isCellMenuOpenByKeyboard?: boolean;
}

const BUTTON_OFFSET = 3;

const FloatingContextualButtonInner = React.memo((props: Props & WrappedComponentProps) => {
	const {
		editorView,
		isContextualMenuOpen,
		mountPoint,
		scrollableElement,
		stickyHeader,
		tableWrapper,
		targetCellPosition,
		isCellMenuOpenByKeyboard,
		intl: { formatMessage },
	} = props; //  : Props & WrappedComponentProps

	const handleClick = () => {
		const { state, dispatch } = editorView;
		// Clicking outside the dropdown handles toggling the menu closed
		// (otherwise these two toggles combat each other).
		// In the event a user clicks the chevron button again
		// That will count as clicking outside the dropdown and
		// will be toggled appropriately
		if (!isContextualMenuOpen) {
			toggleContextualMenu()(state, dispatch);
		}
	};

	const domAtPos = editorView.domAtPos.bind(editorView);
	let targetCellRef: Node | undefined;
	targetCellRef = findDomRefAtPos(targetCellPosition, domAtPos);

	useEffect(() => {
		if (isCellMenuOpenByKeyboard && !isContextualMenuOpen) {
			const { state, dispatch } = editorView;
			// open the menu when the keyboard shortcut is pressed
			toggleContextualMenu()(state, dispatch);
		}
	}, [isCellMenuOpenByKeyboard, isContextualMenuOpen, editorView]);

	if (!targetCellRef || !(targetCellRef instanceof HTMLElement)) {
		return null;
	}

	const labelCellOptions = formatMessage(messages.cellOptions);

	const button = (
		<div
			css={[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				tableFloatingCellButtonStyles(),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				isContextualMenuOpen && tableFloatingCellButtonSelectedStyles(),
			]}
		>
			<ToolbarButton
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={ClassName.CONTEXTUAL_MENU_BUTTON}
				selected={isContextualMenuOpen}
				title={labelCellOptions}
				keymap={focusToContextMenuTrigger}
				onClick={handleClick}
				iconBefore={<ExpandIcon label="" color="currentColor" />}
				aria-label={labelCellOptions}
				aria-expanded={isContextualMenuOpen}
			/>
		</div>
	);

	const parentSticky =
		targetCellRef.parentElement && targetCellRef.parentElement.className.indexOf('sticky') > -1;
	if (stickyHeader && parentSticky && tableWrapper) {
		return (
			<FixedButton
				offset={BUTTON_OFFSET}
				stickyHeader={stickyHeader}
				tableWrapper={tableWrapper}
				targetCellPosition={targetCellPosition}
				targetCellRef={targetCellRef}
				mountTo={tableWrapper}
				isContextualMenuOpen={isContextualMenuOpen}
			>
				{button}
			</FixedButton>
		);
	}

	return (
		<Popup
			alignX="right"
			alignY="start"
			target={targetCellRef}
			mountTo={tableWrapper || mountPoint}
			boundariesElement={targetCellRef}
			scrollableElement={scrollableElement}
			offset={[BUTTON_OFFSET, -BUTTON_OFFSET]}
			forcePlacement
			allowOutOfBounds
			zIndex={akEditorSmallZIndex}
		>
			{button}
		</Popup>
	);
});

const FloatingContextualButton = injectIntl(FloatingContextualButtonInner);

export default function (props: Props) {
	return (
		<ErrorBoundary
			component={ACTION_SUBJECT.FLOATING_CONTEXTUAL_BUTTON}
			dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
			fallbackComponent={null}
		>
			<FloatingContextualButton
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		</ErrorBoundary>
	);
}
