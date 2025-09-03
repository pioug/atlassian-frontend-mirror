import React, { useContext, useEffect } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { cssMap, cx } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { DRAG_HANDLE_SELECTOR, DRAG_HANDLE_WIDTH } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingOverlapPanelZIndex } from '@atlaskit/editor-shared-styles';
import {
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { BlockMenuRenderer } from './block-menu-renderer';

const styles = cssMap({
	base: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
	},
});

const DEFAULT_MENU_WIDTH = 230;
const DRAG_HANDLE_OFFSET_PADDING = 5;

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

type BlockMenuProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorView: EditorView | undefined;
	mountTo?: HTMLElement;
	scrollableElement?: HTMLElement;
};

const BlockMenuContent = ({ api }: { api: ExtractInjectionAPI<BlockMenuPlugin> | undefined }) => {
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);
	const blockMenuComponents = api?.blockMenu?.actions.getBlockMenuComponents();

	return (
		<Box testId="editor-block-menu" ref={setOutsideClickTargetRef} xcss={cx(styles.base)}>
			<BlockMenuRenderer
				components={blockMenuComponents || []}
				fallbacks={{
					nestedMenu: () => (
						<ToolbarNestedDropdownMenu elemBefore={undefined} elemAfter={undefined}>
							<ToolbarDropdownItemSection>
								<ToolbarDropdownItem>Block Menu Item</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarNestedDropdownMenu>
					),
					section: () => (
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem>Block Menu Item</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					),
					item: () => <ToolbarDropdownItem>Block Menu Item</ToolbarDropdownItem>,
				}}
			/>
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

	useEffect(() => {
		if (
			!isMenuOpen ||
			!menuTriggerBy ||
			!isSelectedViaDragHandle ||
			!hasFocus ||
			!hasSelection ||
			['resizing', 'dragging'].includes(currentUserIntent || '')
		) {
			return;
		}

		api?.core.actions.execute(api?.userIntent?.commands.setCurrentUserIntent('blockMenuOpen'));
	}, [
		api,
		isMenuOpen,
		menuTriggerBy,
		isSelectedViaDragHandle,
		hasFocus,
		hasSelection,
		currentUserIntent,
	]);

	if (!isMenuOpen) {
		return null;
	}

	const closeMenu = () => {
		api?.core.actions.execute(({ tr }) => {
			api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true })({ tr });

			api?.userIntent?.commands.setCurrentUserIntent(
				currentUserIntent === 'blockMenuOpen' ? 'default' : currentUserIntent || 'default',
			)({ tr });

			return tr;
		});
	};

	if (
		!menuTriggerBy ||
		!isSelectedViaDragHandle ||
		!hasFocus ||
		!hasSelection ||
		['resizing', 'dragging'].includes(currentUserIntent || '')
	) {
		closeMenu();
		return null;
	}
	const targetHandleRef = editorView?.dom?.querySelector<HTMLElement>(DRAG_HANDLE_SELECTOR);

	if (targetHandleRef instanceof HTMLElement) {
		return (
			<PopupWithListeners
				alignX={'right'}
				alignY={'start'} // respected when forcePlacement is true
				handleClickOutside={closeMenu}
				handleEscapeKeydown={closeMenu}
				mountTo={mountTo}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				target={targetHandleRef}
				zIndex={akEditorFloatingOverlapPanelZIndex}
				fitWidth={DEFAULT_MENU_WIDTH}
				forcePlacement={true}
				preventOverflow={true} // disables forced horizontal placement when forcePlacement is on, so fitWidth controls flipping
				stick={true}
				offset={[DRAG_HANDLE_WIDTH + DRAG_HANDLE_OFFSET_PADDING, 0]}
			>
				<BlockMenuContent api={api} />
			</PopupWithListeners>
		);
	} else {
		return null;
	}
};

export default injectIntl(BlockMenu);
