import React, { useContext } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { cssMap, cx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingOverlapPanelZIndex } from '@atlaskit/editor-shared-styles';
import JiraIcon from '@atlaskit/icon-lab/core/jira';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import ChangesIcon from '@atlaskit/icon/core/changes';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import DeleteIcon from '@atlaskit/icon/core/delete';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';
import TaskIcon from '@atlaskit/icon/core/task';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

const styles = cssMap({
	base: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('border.radius'),
	},
});

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

type BlockMenuProps = {
	editorView: EditorView | undefined;
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	mountTo?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
};

const FormatDropdown = () => {
	return (
		<DropdownMenu
			placement="right-start"
			shouldFitContainer
			trigger={({
				triggerRef,
				'aria-controls': ariaControls,
				'aria-haspopup': ariaHasPopup,
				'aria-expanded': ariaExpanded,
			}) => (
				<DropdownItem
					aria-controls={ariaControls}
					aria-haspopup={ariaHasPopup}
					aria-expanded={ariaExpanded}
					ref={triggerRef}
					elemBefore={<ChangesIcon label="" />}
					elemAfter={<ChevronRightIcon label="" />}
				>
					Format
				</DropdownItem>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem elemBefore={<TaskIcon label="" />}>Action item</DropdownItem>
				<DropdownItem elemBefore={<ListBulletedIcon label="" />}>Bullet list</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

const BlockMenuContent = () => {
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);

	return (
		<Box testId="editor-block-menu" ref={setOutsideClickTargetRef} xcss={cx(styles.base)}>
			<DropdownItemGroup>
				<FormatDropdown />
				<DropdownItem elemBefore={<JiraIcon label="" />}>Create Jira work item</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem elemBefore={<ArrowUpIcon label="" />}>Move up</DropdownItem>
				<DropdownItem elemBefore={<ArrowDownIcon label="" />}>Move down</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem elemBefore={<DeleteIcon label="" />}>Delete</DropdownItem>
			</DropdownItemGroup>
		</Box>
	);
};

const BlockMenu = ({
	editorView,
	api,
	mountTo,
	boundariesElement,
	scrollableElement,
}: BlockMenuProps & WrappedComponentProps) => {
	const { menuTriggerBy, isSelectedViaDragHandle, isMenuOpen, currentUserIntent } =
		useSharedPluginStateWithSelector(api, ['blockControls', 'userIntent'], (states) => ({
			menuTriggerBy: states.blockControlsState?.menuTriggerBy,
			isSelectedViaDragHandle: states.blockControlsState?.isSelectedViaDragHandle,
			isMenuOpen: states.blockControlsState?.isMenuOpen,
			currentUserIntent: states.userIntentState?.currentUserIntent,
		}));

	const hasFocus = editorView?.hasFocus() ?? false;
	const hasSelection = !!editorView && !editorView.state.selection.empty;

	if (!isMenuOpen) {
		return null;
	}

	const closeMenu = () => {
		api?.core.actions.execute(api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true }));
	};

	if (
		!menuTriggerBy ||
		!isSelectedViaDragHandle ||
		!hasFocus ||
		!hasSelection ||
		currentUserIntent === 'dragging'
	) {
		closeMenu();
		return null;
	}

	const activeNodeSelector = menuTriggerBy && `[data-drag-handler-anchor-name=${menuTriggerBy}]`;
	const targetHandleRef = activeNodeSelector
		? document.querySelector<HTMLElement>(activeNodeSelector)
		: null;

	if (targetHandleRef instanceof HTMLElement) {
		return (
			<PopupWithListeners
				alignX={'left'}
				alignY={'start'}
				handleClickOutside={closeMenu}
				handleEscapeKeydown={closeMenu}
				mountTo={mountTo}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				target={targetHandleRef}
				zIndex={akEditorFloatingOverlapPanelZIndex}
				forcePlacement={true}
				stick={true}
				offset={[-6, 8]}
			>
				<BlockMenuContent />
			</PopupWithListeners>
		);
	} else {
		return null;
	}
};

export default injectIntl(BlockMenu);
