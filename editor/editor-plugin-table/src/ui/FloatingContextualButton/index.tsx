/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect } from 'react';
import type { CSSProperties } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { focusToContextMenuTrigger } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { Popup } from '@atlaskit/editor-common/ui';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorSmallZIndex } from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/core/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { toggleActiveTableMenu, toggleContextualMenu } from '../../pm-plugins/commands';
import { getPluginState } from '../../pm-plugins/plugin-factory';
import type { RowStickyState } from '../../pm-plugins/sticky-headers/types';
import { isNativeStickySupported } from '../../pm-plugins/utils/sticky-header';
import {
	TableCssClassName as ClassName,
	type PluginInjectionAPI,
	type TableSharedStateInternal,
} from '../../types';

// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import FixedButton from './FixedButton';
import { tableFloatingCellButtonSelectedStyles, tableFloatingCellButtonStyles } from './styles';
export interface Props {
	api?: PluginInjectionAPI | null;
	boundariesElement?: HTMLElement;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorView: EditorView;
	isCellMenuOpenByKeyboard?: boolean;
	isContextualMenuOpen?: boolean;
	isDragAndDropEnabled?: boolean;
	isNumberColumnEnabled?: boolean;
	mountPoint?: HTMLElement;
	scrollableElement?: HTMLElement;
	stickyHeader?: RowStickyState;
	tableNode?: PMNode;
	tableWrapper?: HTMLElement;
	targetCellPosition: number;
}

const BUTTON_OFFSET = 3;
const CONTEXTUAL_MENU_BUTTON_Z_INDEX = 2;

const anchorStyles = css({
	position: 'absolute',
	positionVisibility: 'anchors-visible',
	zIndex: CONTEXTUAL_MENU_BUTTON_Z_INDEX,
});

const FloatingContextualButtonInner = React.memo((props: Props & WrappedComponentProps) => {
	const {
		api,
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
	const { activeTableMenu } = useSharedPluginStateWithSelector(api, ['table'], (states) => ({
		activeTableMenu: (states.tableState as TableSharedStateInternal | undefined)?.activeTableMenu,
	}));
	const isCellMenuOpen = expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)
		? activeTableMenu?.type === 'cell'
		: isContextualMenuOpen;

	const handleClick = () => {
		const { state, dispatch } = editorView;

		if (expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)) {
			if (!api) {
				return;
			}

			const { activeTableMenu: currentActiveTableMenu } = getPluginState(state);
			api.core.actions.execute(({ tr }) => {
				toggleActiveTableMenu(
					{ type: 'cell', openedBy: 'mouse' },
					currentActiveTableMenu,
					api,
				)({ tr });
				return tr;
			});

			return;
		}

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
	const targetCellRef: Node | undefined = findDomRefAtPos(targetCellPosition, domAtPos);

	useEffect(() => {
		if (isCellMenuOpenByKeyboard && !isCellMenuOpen) {
			const { state, dispatch } = editorView;
			// open the menu when the keyboard shortcut is pressed
			if (expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)) {
				if (!api) {
					return;
				}

				const { activeTableMenu: currentActiveTableMenu } = getPluginState(state);
				api.core.actions.execute(({ tr }) => {
					toggleActiveTableMenu(
						{ type: 'cell', openedBy: 'keyboard' },
						currentActiveTableMenu,
						api,
					)({ tr });
					return tr;
				});
				return;
			}
			toggleContextualMenu()(state, dispatch);
		}
	}, [isCellMenuOpenByKeyboard, isCellMenuOpen, editorView, api]);

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
				isCellMenuOpen && tableFloatingCellButtonSelectedStyles(),
			]}
		>
			<ToolbarButton
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={ClassName.CONTEXTUAL_MENU_BUTTON}
				selected={isCellMenuOpen}
				title={labelCellOptions}
				keymap={focusToContextMenuTrigger}
				onClick={handleClick}
				iconBefore={<ExpandIcon label="" color="currentColor" size="small" />}
				aria-label={labelCellOptions}
				aria-expanded={isCellMenuOpen}
			/>
		</div>
	);

	const parentSticky =
		targetCellRef.parentElement && targetCellRef.parentElement.className.indexOf('sticky') > -1;

	const parentStickyNative =
		targetCellRef.parentElement &&
		(fg('platform_editor_table_sticky_header_patch_4')
			? tableWrapper?.classList.contains(ClassName.TABLE_NODE_WRAPPER_NO_OVERFLOW)
			: targetCellRef.parentElement.classList.contains(ClassName.NATIVE_STICKY));

	if (
		parentStickyNative &&
		targetCellRef.nodeName === 'TH' &&
		isNativeStickySupported() &&
		expValEquals('platform_editor_table_sticky_header_improvements', 'cohort', 'test_with_overflow')
	) {
		/* We need to default to checking the anchor style because there may be a conflict with the block controls
		 plugin not using the data attribute value and setting the `anchor-name` style property independently of the data attribute.
		 */
		let rowAnchorName: string | undefined =
			targetCellRef.parentElement?.style.getPropertyValue('anchor-name');
		let colAnchorName: string | undefined = targetCellRef.style.getPropertyValue('anchor-name');

		if (rowAnchorName === '') {
			rowAnchorName = targetCellRef.parentElement?.dataset.nodeAnchor;
		}
		if (colAnchorName === '') {
			colAnchorName = targetCellRef?.dataset.nodeAnchor;
		}

		if (!expValEquals('platform_editor_table_sticky_header_patch_9', 'isEnabled', true)) {
			return (
				<div
					css={anchorStyles}
					style={
						{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							top: `calc(${BUTTON_OFFSET}px + anchor(${rowAnchorName} top))`,
							right: `calc(${BUTTON_OFFSET}px + anchor(${colAnchorName} right))`,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							positionAnchor: colAnchorName,
						} as CSSProperties
					} // need to do this because CSSProperties doesn't have positionAnchor property even though it's a valid CSS property
					data-testid="table-cell-options-anchor-wrapper"
				>
					{button}
				</div>
			);
		}

		if (rowAnchorName && colAnchorName) {
			return (
				<div
					css={anchorStyles}
					style={
						{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							top: `calc(${BUTTON_OFFSET}px + anchor(${rowAnchorName} top))`,
							right: `calc(${BUTTON_OFFSET}px + anchor(${colAnchorName} right))`,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							positionAnchor: colAnchorName,
						} as CSSProperties
					} // need to do this because CSSProperties doesn't have positionAnchor property even though it's a valid CSS property
					data-testid="table-cell-options-anchor-wrapper"
				>
					{button}
				</div>
			);
		}
	}

	if (stickyHeader && parentSticky && tableWrapper) {
		return (
			<FixedButton
				offset={BUTTON_OFFSET}
				stickyHeader={stickyHeader}
				tableWrapper={tableWrapper}
				targetCellPosition={targetCellPosition}
				targetCellRef={targetCellRef}
				mountTo={tableWrapper}
				isContextualMenuOpen={isCellMenuOpen}
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
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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

export default function (props: Props): JSX.Element {
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
