import React, { useContext, useEffect, useRef } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { cssMap, cx } from '@atlaskit/css';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
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
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { useBlockMenu } from './block-menu-provider';
import { BlockMenuRenderer } from './block-menu-renderer';

const styles = cssMap({
	base: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
	},
	emptyMenuSectionStyles: {
		/*
		 * This is not great - but there is no way to know using React if a specific component returns null.
		 * This style hides a menu-section if there are no menu items inside of it
		 */
		// @ts-expect-error - nested selectors are not typed in cssMap
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[data-toolbar-component="menu-section"]:not(:has([data-toolbar-component="menu-item"]))': {
			display: 'none',
		},
		/*
		 * Hides the separator for any section that doesn't have any non-empty sections before it
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[data-toolbar-component="menu-section"]:not(:has([data-toolbar-component="menu-item"]) ~ *)': {
			borderBlockStart: 'none',
		},
	},
});

const DEFAULT_MENU_WIDTH = 230;
const DRAG_HANDLE_OFFSET_PADDING = 5;

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

export type BlockMenuProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorView: EditorView | undefined;
	mountTo?: HTMLElement;
	scrollableElement?: HTMLElement;
};

const BlockMenuContent = ({
	api,
	setRef,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	setRef?: (el: HTMLElement | null) => void;
}) => {
	const blockMenuComponents = api?.blockMenu?.actions.getBlockMenuComponents();
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);
	const ref = (el: HTMLElement | null) => {
		setOutsideClickTargetRef(el);
		setRef?.(el);
	};

	return (
		<Box
			testId="editor-block-menu"
			ref={ref}
			xcss={cx(
				styles.base,
				expValEqualsNoExposure('platform_synced_block', 'isEnabled', true) &&
					styles.emptyMenuSectionStyles,
			)}
		>
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
	const {
		menuTriggerBy,
		isSelectedViaDragHandle,
		isMenuOpen,
		currentUserIntent,
		openedViaKeyboard,
	} = useSharedPluginStateWithSelector(api, ['blockControls', 'userIntent'], (states) => ({
		menuTriggerBy: states.blockControlsState?.menuTriggerBy,
		isSelectedViaDragHandle: states.blockControlsState?.isSelectedViaDragHandle,
		isMenuOpen: states.blockControlsState?.isMenuOpen,
		currentUserIntent: states.userIntentState?.currentUserIntent,
		openedViaKeyboard: states.blockControlsState?.blockMenuOptions?.openedViaKeyboard,
	}));
	const { onDropdownOpenChanged } = useBlockMenu();
	const targetHandleRef = editorView?.dom?.querySelector<HTMLElement>(DRAG_HANDLE_SELECTOR);
	const prevIsMenuOpenRef = useRef(false);
	const popupRef = useRef<HTMLElement | undefined>(undefined);

	const hasFocus = expValEqualsNoExposure(
		'platform_editor_block_menu_keyboard_navigation',
		'isEnabled',
		true,
	)
		? ((editorView?.hasFocus() ||
				document.activeElement === targetHandleRef ||
				(popupRef.current &&
					(popupRef.current.contains(document.activeElement) ||
						popupRef.current === document.activeElement))) ??
			false)
		: (editorView?.hasFocus() ?? false);

	const hasSelection = !!editorView && !editorView.state.selection.empty;
	// hasSelection true, always show block menu
	// hasSelection false, only show block menu when empty line experiment is enabled
	const shouldShowBlockMenuForEmptyLine =
		hasSelection ||
		(!hasSelection &&
			expValEqualsNoExposure('platform_editor_block_menu_empty_line', 'isEnabled', true));

	const selectedByShortcutOrDragHandle =
		isSelectedViaDragHandle ||
		(openedViaKeyboard &&
			expValEqualsNoExposure('platform_editor_block_menu_keyboard_navigation', 'isEnabled', true));

	useEffect(() => {
		if (
			!isMenuOpen ||
			!menuTriggerBy ||
			!selectedByShortcutOrDragHandle ||
			!hasFocus ||
			!shouldShowBlockMenuForEmptyLine ||
			['resizing', 'dragging'].includes(currentUserIntent || '')
		) {
			return;
		}

		// Fire analytics event when block menu opens (only on first transition from closed to open)
		if (!prevIsMenuOpenRef.current && isMenuOpen) {
			api?.analytics?.actions.fireAnalyticsEvent({
				action: ACTION.OPENED,
				actionSubject: ACTION_SUBJECT.BLOCK_MENU,
				eventType: EVENT_TYPE.UI,
				attributes: {
					inputMethod: openedViaKeyboard ? INPUT_METHOD.KEYBOARD : INPUT_METHOD.MOUSE,
				},
			});
		}

		// Update the previous state
		prevIsMenuOpenRef.current = isMenuOpen;

		api?.core.actions.execute(api?.userIntent?.commands.setCurrentUserIntent('blockMenuOpen'));
	}, [
		api,
		isMenuOpen,
		menuTriggerBy,
		selectedByShortcutOrDragHandle,
		hasFocus,
		shouldShowBlockMenuForEmptyLine,
		currentUserIntent,
		openedViaKeyboard,
	]);

	if (!isMenuOpen) {
		return null;
	}

	const closeMenu = () => {
		api?.core.actions.execute(({ tr }) => {
			api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true })({ tr });
			onDropdownOpenChanged(false);
			api?.userIntent?.commands.setCurrentUserIntent(
				currentUserIntent === 'blockMenuOpen' ? 'default' : currentUserIntent || 'default',
			)({ tr });

			return tr;
		});
	};

	if (
		!menuTriggerBy ||
		!selectedByShortcutOrDragHandle ||
		!hasFocus ||
		!shouldShowBlockMenuForEmptyLine ||
		['resizing', 'dragging'].includes(currentUserIntent || '')
	) {
		closeMenu();
		return null;
	}

	const setRef = (el: HTMLElement | null) => {
		if (el) {
			popupRef.current = el;
		}
	};

	if (targetHandleRef instanceof HTMLElement) {
		return (
			<ErrorBoundary
				component={ACTION_SUBJECT.BLOCK_MENU}
				dispatchAnalyticsEvent={api?.analytics?.actions.fireAnalyticsEvent}
				fallbackComponent={null}
			>
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
					focusTrap={
						expValEqualsNoExposure(
							'platform_editor_block_menu_keyboard_navigation',
							'isEnabled',
							true,
						)
							? { initialFocus: openedViaKeyboard ? undefined : targetHandleRef }
							: undefined
					}
					offset={[DRAG_HANDLE_WIDTH + DRAG_HANDLE_OFFSET_PADDING, 0]}
				>
					<BlockMenuContent
						api={api}
						setRef={
							expValEqualsNoExposure(
								'platform_editor_block_menu_keyboard_navigation',
								'isEnabled',
								true,
							)
								? setRef
								: undefined
						}
					/>
				</PopupWithListeners>
			</ErrorBoundary>
		);
	} else {
		return null;
	}
};

export default injectIntl(BlockMenu);
