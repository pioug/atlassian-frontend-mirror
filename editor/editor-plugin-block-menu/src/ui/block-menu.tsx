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
import { BLOCK_MENU_TEST_ID } from '@atlaskit/editor-common/block-menu';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { DRAG_HANDLE_SELECTOR, DRAG_HANDLE_WIDTH } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	ArrowKeyNavigationProvider,
	ArrowKeyNavigationType,
} from '@atlaskit/editor-common/ui-menu';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingOverlapPanelZIndex } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { redo, undo } from '@atlaskit/prosemirror-history';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { useBlockMenu } from './block-menu-provider';
import { BlockMenuRenderer } from './block-menu-renderer/BlockMenuRenderer';

const styles = cssMap({
	base: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
	},
	maxWidthStyles: {
		maxWidth: '320px',
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

const useConditionalBlockMenuEffect = ({
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
};

export type BlockMenuProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	boundariesElement?: HTMLElement;
	editorView: EditorView | undefined;
	mountTo?: HTMLElement;
	scrollableElement?: HTMLElement;
};

const isSelectionWithinCodeBlock = (state: EditorState) => {
	const { $from, $to } = state.selection;
	return $from.sameParent($to) && $from.parent.type === state.schema.nodes.codeBlock;
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
	const shouldDisableArrowKeyNavigation = (event: KeyboardEvent) => {
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
			return false;
		}

		const target = event.target;
		if (!(target instanceof HTMLElement)) {
			return false;
		}

		return target.closest('[data-toolbar-nested-dropdown-menu]') !== null;
	};

	return (
		<Box
			testId={BLOCK_MENU_TEST_ID}
			role={
				expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
					? 'menu'
					: undefined
			}
			ref={ref}
			xcss={cx(
				styles.base,
				fg('platform_editor_block_menu_v2_patch_2') && styles.maxWidthStyles,
				editorExperiment('platform_synced_block', true) && styles.emptyMenuSectionStyles,
			)}
		>
			<ArrowKeyNavigationProvider
				type={ArrowKeyNavigationType.MENU}
				handleClose={(e) => e.preventDefault()}
				disableArrowKeyNavigation={shouldDisableArrowKeyNavigation}
			>
				<BlockMenuRenderer allRegisteredComponents={blockMenuComponents || []} />
			</ArrowKeyNavigationProvider>
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
		openedViaKeyboard,
		prevIsMenuOpenRef,
	});

	if (!isMenuOpen) {
		return null;
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		// When the editor view has focus, the keydown will be handled by the
		// selection preservation plugin – exit early to avoid double handling
		// Also exit if selection is within a code block to avoid double handling when code block got focus when the node after it is deleted
		if (!editorView || editorView?.hasFocus() || isSelectionWithinCodeBlock(editorView.state)) {
			return;
		}

		const key = event.key.toLowerCase();
		const isMetaCtrl = event.metaKey || event.ctrlKey;
		const isDelete = ['backspace', 'delete'].includes(key);
		const isUndo = isMetaCtrl && key === 'z' && !event.shiftKey;
		const isRedo = isMetaCtrl && (key === 'y' || (key === 'z' && event.shiftKey));

		// Necessary to prevent the editor from handling the delete natively
		if (isDelete || isUndo || isRedo) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (isUndo) {
			undo(editorView.state, editorView.dispatch);
		} else if (isRedo) {
			redo(editorView.state, editorView.dispatch);
		}

		api?.core?.actions.execute(
			api?.blockControls?.commands?.handleKeyDownWithPreservedSelection(event),
		);
	};

	const handleClickOutside = (e: MouseEvent) => {
		// check if the clicked element was another drag handle, if so don't close the menu
		if (e.target instanceof HTMLElement && e.target.closest(DRAG_HANDLE_SELECTOR)) {
			return;
		}

		closeMenu();
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

	if (!(targetHandleRef instanceof HTMLElement)) {
		return null;
	}

	return (
		<ErrorBoundary
			component={ACTION_SUBJECT.BLOCK_MENU}
			dispatchAnalyticsEvent={api?.analytics?.actions.fireAnalyticsEvent}
			fallbackComponent={null}
		>
			<PopupWithListeners
				alignX={'right'}
				alignY={'start'}
				handleClickOutside={handleClickOutside}
				handleEscapeKeydown={closeMenu}
				handleKeyDown={handleKeyDown}
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
};

export default injectIntl(BlockMenu);
