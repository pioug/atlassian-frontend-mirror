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
import { deleteSelectedRange } from '@atlaskit/editor-common/selection';
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
import { fg } from '@atlaskit/platform-feature-flags';
import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { Box } from '@atlaskit/primitives/compiled';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
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
const FALLBACK_MENU_HEIGHT = 300;

const PopupWithListeners = withReactEditorViewOuterListeners(Popup);

type BlockMenuEffectParams = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	currentUserIntent?: string | null | undefined;
	hasFocus: boolean;
	isMenuOpen: boolean | undefined;
	menuTriggerBy: string | undefined;
	openedViaKeyboard: boolean | undefined;
	prevIsMenuOpenRef: React.MutableRefObject<boolean>;
	selectedByShortcutOrDragHandle: boolean;
};

const useConditionalBlockMenuEffect = conditionalHooksFactory(
	() => fg('platform_editor_toolbar_aifc_user_intent_fix'),
	({
		api,
		isMenuOpen,
		menuTriggerBy,
		selectedByShortcutOrDragHandle,
		hasFocus,
		openedViaKeyboard,
		prevIsMenuOpenRef,
	}: BlockMenuEffectParams) => {
		/**
		 * NOTE: do not add `currentUserIntent` to dependency array as it causes unnecessary re-renders and messes with the user intent state
		 */
		useEffect(() => {
			if (!isMenuOpen || !menuTriggerBy || !selectedByShortcutOrDragHandle || !hasFocus) {
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
			openedViaKeyboard,
			prevIsMenuOpenRef,
		]);
	},

	({
		api,
		isMenuOpen,
		menuTriggerBy,
		selectedByShortcutOrDragHandle,
		hasFocus,
		currentUserIntent,
		openedViaKeyboard,
		prevIsMenuOpenRef,
	}: BlockMenuEffectParams) => {
		useEffect(() => {
			if (
				!isMenuOpen ||
				!menuTriggerBy ||
				!selectedByShortcutOrDragHandle ||
				!hasFocus ||
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
			currentUserIntent,
			openedViaKeyboard,
			prevIsMenuOpenRef,
		]);
	},
);

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
				editorExperiment('platform_synced_block', true) && styles.emptyMenuSectionStyles,
			)}
		>
			<BlockMenuRenderer
				components={blockMenuComponents || []}
				fallbacks={{
					nestedMenu: () => (
						<ToolbarNestedDropdownMenu elemBefore={undefined} elemAfter={undefined}>
							<ToolbarDropdownItemSection>
								{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
								<ToolbarDropdownItem>Block Menu Item</ToolbarDropdownItem>
							</ToolbarDropdownItemSection>
						</ToolbarNestedDropdownMenu>
					),
					section: () => (
						<ToolbarDropdownItemSection>
							{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
							<ToolbarDropdownItem>Block Menu Item</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					),
					// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
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

	const [menuHeight, setMenuHeight] = React.useState<number>(0);

	const targetHandleHeightOffset = -(targetHandleRef?.clientHeight || 0);

	React.useLayoutEffect(() => {
		if (!isMenuOpen) {
			return;
		}
		setMenuHeight(popupRef.current?.clientHeight || FALLBACK_MENU_HEIGHT);
	}, [isMenuOpen]);

	const hasFocus =
		(editorView?.hasFocus() ||
			document.activeElement === targetHandleRef ||
			(popupRef.current &&
				(popupRef.current.contains(document.activeElement) ||
					popupRef.current === document.activeElement))) ??
		false;

	const selectedByShortcutOrDragHandle = !!isSelectedViaDragHandle || !!openedViaKeyboard;

	// Use conditional hook based on feature flag
	useConditionalBlockMenuEffect({
		api,
		isMenuOpen,
		menuTriggerBy,
		selectedByShortcutOrDragHandle,
		hasFocus,
		currentUserIntent: fg('platform_editor_toolbar_aifc_user_intent_fix')
			? undefined
			: currentUserIntent,
		openedViaKeyboard,
		prevIsMenuOpenRef,
	});

	if (!isMenuOpen) {
		return null;
	}
	const handleBackspaceDeleteKeydown = () => {
		api?.core.actions.execute(({ tr }) => {
			deleteSelectedRange(tr);
			api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true })({ tr });

			return tr;
		});
	};

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
					alignY={'start'}
					handleClickOutside={closeMenu}
					handleEscapeKeydown={closeMenu}
					handleBackspaceDeleteKeydown={handleBackspaceDeleteKeydown}
					mountTo={mountTo}
					boundariesElement={boundariesElement}
					scrollableElement={scrollableElement}
					target={targetHandleRef}
					zIndex={akEditorFloatingOverlapPanelZIndex}
					fitWidth={DEFAULT_MENU_WIDTH}
					fitHeight={menuHeight}
					preventOverflow={true}
					stick={true}
					offset={[DRAG_HANDLE_WIDTH + DRAG_HANDLE_OFFSET_PADDING, targetHandleHeightOffset]}
					focusTrap={
						openedViaKeyboard
							? // Only enable focus trap when opened via keyboard to make sure the focus is on the first focusable menu item
								{ initialFocus: undefined }
							: undefined
					}
				>
					<BlockMenuContent api={api} setRef={setRef} />
				</PopupWithListeners>
			</ErrorBoundary>
		);
	} else {
		return null;
	}
};

export default injectIntl(BlockMenu);
