import React, { useContext } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { cssMap, cx } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
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
		borderRadius: token('border.radius'),
	},
});

const DRAG_HANDLE_SELECTOR = '[data-editor-block-ctrl-drag-handle=true]';
const DRAG_HANDLE_WIDTH = 12;
const DRAG_HANDLE_PADDING = 5;

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

type BlockMenuProps = {
	editorView: EditorView | undefined;
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	mountTo?: HTMLElement;
	boundariesElement?: HTMLElement;
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

	const targetHandleRef = editorView.dom?.querySelector<HTMLElement>(DRAG_HANDLE_SELECTOR);

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
				offset={[DRAG_HANDLE_WIDTH + DRAG_HANDLE_PADDING, 0]}
			>
				<BlockMenuContent api={api} />
			</PopupWithListeners>
		);
	} else {
		return null;
	}
};

export default injectIntl(BlockMenu);
