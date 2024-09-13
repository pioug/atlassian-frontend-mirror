/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { buttonGroupStyle, separatorStyles, wrapperStyle } from '@atlaskit/editor-common/styles';
import type { TOOLBAR_MENU_TYPE } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { MenuItem, ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { withReactEditorViewOuterListeners as withOuterListeners } from '@atlaskit/editor-common/ui-react';
import type { DropdownItem } from '@atlaskit/editor-plugin-block-type';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji/picker';
import type { EmojiId } from '@atlaskit/emoji/types';
import * as colors from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { toggleInsertMenuRightRail } from '../../pm-plugins/commands';
import type { OnInsert } from '../ElementBrowser/types';
import { RightRailIcon } from '../ElementRail/MainToolBarIcon';

import { BlockInsertMenu } from './block-insert-menu';
import type { BlockMenuItem } from './create-items';
import { createItems } from './create-items';
import { messages } from './messages';
import TableSelectorPopup from './table-selector-popup-with-listeners';
import type { Props, State } from './types';

/**
 * Checks if an element is detached (i.e. not in the current document)
 */
const isDetachedElement = (el: HTMLElement) => !document.body.contains(el);
const noop = () => {};

const EmojiPickerWithListeners = withOuterListeners(AkEmojiPicker);
const TABLE_SELECTOR_STRING = 'table selector';

// TODO: Jenga team will create a component for a split button using this css
const getHoverStyles = (selector: string) =>
	`&:hover ${selector} {
    background: ${token('color.background.neutral.subtle.hovered', colors.N20A)};

    &:hover {
      background: ${token('color.background.neutral.hovered', colors.N30A)};
    }
  }`;

export const tableButtonWrapper = ({
	isTableSelectorOpen,
	isButtonDisabled,
}: {
	isTableSelectorOpen: boolean;
	isButtonDisabled: boolean | undefined;
}) =>
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation due to mixins
	css`
		display: flex;
		${!isTableSelectorOpen && !isButtonDisabled && getHoverStyles('.table-selector-toolbar-btn')}
		${!isTableSelectorOpen && !isButtonDisabled && getHoverStyles('.table-toolbar-btn')}

  .table-toolbar-btn {
			border-top-right-radius: ${token('border.radius.200', '0px')};
			border-bottom-right-radius: ${token('border.radius.200', '0px')};
			margin-right: ${token('space.025', '1px')};
			padding: ${token('space.0', '0px')};
			& > span {
				min-width: 16px;
				margin: ${token('space.0', '0px')};
			}
		}
		.table-selector-toolbar-btn {
			padding: ${token('space.0', '0px')};
			& > span {
				margin: ${token('space.0', '0px')};
				width: 16px !important;
				display: flex;
				justify-content: center;
			}

			border-top-left-radius: ${token('border.radius.200', '0px')} !important;
			border-bottom-left-radius: ${token('border.radius.200', '0px')} !important;
		}
	`;

type InternalActions = {
	registerToggleDropdownMenuOptions?: (cb: () => void) => () => void;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class ToolbarInsertBlock extends React.PureComponent<
	Props & WrappedComponentProps & InternalActions,
	State
> {
	private dropdownButtonRef?: HTMLElement;
	private emojiButtonRef?: HTMLElement;
	private plusButtonRef?: HTMLElement;
	private tableButtonRef = React.createRef<HTMLElement>();
	private tableSelectorButtonRef = React.createRef<HTMLElement>();
	private unregisterToggleDropdownMenuOptions: null | (() => void) = null;

	state: State = {
		isPlusMenuOpen: false,
		emojiPickerOpen: false,
		isOpenedByKeyboard: false,
		buttons: [],
		dropdownItems: [],
		isTableSelectorOpen: false,
		isTableSelectorOpenedByKeyboard: false,
	};

	static getDerivedStateFromProps(
		props: Props & WrappedComponentProps,
		state: State,
	): State | null {
		const [buttons, dropdownItems] = createItems({
			isTypeAheadAllowed: props.isTypeAheadAllowed,
			tableSupported: props.tableSupported,
			tableSelectorSupported: props.tableSelectorSupported,
			mediaUploadsEnabled: props.mediaUploadsEnabled,
			mediaSupported: props.mediaSupported,
			imageUploadSupported: props.imageUploadSupported,
			imageUploadEnabled: props.imageUploadEnabled,
			mentionsSupported: props.mentionsSupported,
			mentionsDisabled: props.mentionsDisabled,
			actionSupported: props.actionSupported,
			decisionSupported: props.decisionSupported,
			linkSupported: props.linkSupported,
			linkDisabled: props.linkDisabled,
			emojiDisabled: props.emojiDisabled,
			nativeStatusSupported: props.nativeStatusSupported,
			dateEnabled: props.dateEnabled,
			placeholderTextEnabled: props.placeholderTextEnabled,
			horizontalRuleEnabled: props.horizontalRuleEnabled,
			layoutSectionEnabled: props.layoutSectionEnabled,
			expandEnabled: props.expandEnabled,
			showElementBrowserLink: props.showElementBrowserLink,
			emojiProvider: props.emojiProvider,
			availableWrapperBlockTypes: props.availableWrapperBlockTypes,
			insertMenuItems: props.insertMenuItems,
			schema: props.editorView.state.schema,
			numberOfButtons: props.buttons,
			formatMessage: props.intl.formatMessage,
			isNewMenuEnabled: props.replacePlusMenuWithElementBrowser,
		});

		return {
			...state,
			buttons,
			dropdownItems,
		};
	}

	componentDidUpdate(prevProps: Props) {
		// If number of visible buttons changed, close emoji picker and table selector
		if (prevProps.buttons !== this.props.buttons) {
			this.setState({ emojiPickerOpen: false, isTableSelectorOpen: false });
		}

		if (this.state.isOpenedByKeyboard) {
			const downArrowEvent = new KeyboardEvent('keydown', {
				bubbles: true,
				key: 'ArrowDown',
			});
			this.dropdownButtonRef?.dispatchEvent(downArrowEvent);
			this.setState({ ...this.state, isOpenedByKeyboard: false });
		}

		if (this.state.isTableSelectorOpen) {
			this.setState({ isTableSelectorOpenedByKeyboard: false });
		}
	}

	private onOpenChange = (attrs: { isPlusMenuOpen: boolean; open?: boolean }) => {
		const state = {
			isPlusMenuOpen: attrs.isPlusMenuOpen,
			emojiPickerOpen: this.state.emojiPickerOpen,
		};
		if (this.state.emojiPickerOpen && !attrs.open) {
			state.emojiPickerOpen = false;
		}
		this.setState(state, () => {
			const { dispatchAnalyticsEvent } = this.props;
			if (!dispatchAnalyticsEvent) {
				return;
			}

			const { isPlusMenuOpen } = this.state;

			if (isPlusMenuOpen) {
				return dispatchAnalyticsEvent({
					action: ACTION.OPENED,
					actionSubject: ACTION_SUBJECT.PLUS_MENU,
					eventType: EVENT_TYPE.UI,
				});
			}
			return dispatchAnalyticsEvent({
				action: ACTION.CLOSED,
				actionSubject: ACTION_SUBJECT.PLUS_MENU,
				eventType: EVENT_TYPE.UI,
			});
		});
	};

	private togglePlusMenuVisibility = (event?: KeyboardEvent) => {
		const { isPlusMenuOpen } = this.state;
		this.onOpenChange({ isPlusMenuOpen: !isPlusMenuOpen });
		if (event?.key === 'Escape') {
			(this.plusButtonRef || this.dropdownButtonRef)?.focus();
		}
	};

	private toggleEmojiPicker = (
		inputMethod: TOOLBAR_MENU_TYPE | INPUT_METHOD.KEYBOARD = INPUT_METHOD.TOOLBAR,
	) => {
		this.setState(
			(prevState) => ({ emojiPickerOpen: !prevState.emojiPickerOpen }),
			() => {
				if (this.state.emojiPickerOpen) {
					const { dispatchAnalyticsEvent } = this.props;
					if (dispatchAnalyticsEvent) {
						dispatchAnalyticsEvent({
							action: ACTION.OPENED,
							actionSubject: ACTION_SUBJECT.PICKER,
							actionSubjectId: ACTION_SUBJECT_ID.PICKER_EMOJI,
							attributes: { inputMethod },
							eventType: EVENT_TYPE.UI,
						});
					}
				}
			},
		);
	};

	private handleEmojiPressEscape = () => {
		this.toggleEmojiPicker(INPUT_METHOD.KEYBOARD);
		this.emojiButtonRef?.focus();
	};

	private handleEmojiClickOutside = (e: MouseEvent) => {
		// Ignore click events for detached elements.
		// Workaround for FS-1322 - where two onClicks fire - one when the upload button is
		// still in the document, and one once it's detached. Does not always occur, and
		// may be a side effect of a react render optimisation
		if (e.target && !isDetachedElement(e.target as HTMLElement)) {
			this.toggleEmojiPicker(INPUT_METHOD.TOOLBAR);
		}
	};

	private renderPopup() {
		const { emojiPickerOpen } = this.state;
		const {
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			emojiProvider,
			replacePlusMenuWithElementBrowser,
		} = this.props;
		const dropdownEmoji = this.state.dropdownItems.some(({ value: { name } }) => name === 'emoji');
		const dropDownButtonRef = replacePlusMenuWithElementBrowser
			? this.plusButtonRef
			: this.dropdownButtonRef;
		const ref = dropdownEmoji ? dropDownButtonRef : this.emojiButtonRef;

		if (!emojiPickerOpen || !ref || !emojiProvider) {
			return null;
		}
		const onUnmount = () => {
			requestAnimationFrame(() => this.props.pluginInjectionApi?.core?.actions?.focus());
		};

		return (
			<Popup
				target={ref}
				fitHeight={350}
				fitWidth={350}
				offset={[0, 3]}
				mountTo={popupsMountPoint}
				boundariesElement={popupsBoundariesElement}
				scrollableElement={popupsScrollableElement}
				onUnmount={onUnmount}
				focusTrap
				zIndex={akEditorMenuZIndex}
			>
				<EmojiPickerWithListeners
					emojiProvider={emojiProvider}
					onSelection={this.handleSelectedEmoji}
					handleClickOutside={this.handleEmojiClickOutside}
					handleEscapeKeydown={this.handleEmojiPressEscape}
				/>
			</Popup>
		);
	}

	private handleEmojiButtonRef = (ref: ToolbarButtonRef): void => {
		if (ref) {
			this.emojiButtonRef = ref;
		}
	};

	private handlePlusButtonRef = (ref: ToolbarButtonRef): void => {
		if (ref) {
			this.plusButtonRef = ref;
		}
	};

	private handleDropDownButtonRef = (ref: ToolbarButtonRef) => {
		if (ref) {
			this.dropdownButtonRef = ref;
		}
	};

	private toggleTableSelector = (
		inputMethod: TOOLBAR_MENU_TYPE | INPUT_METHOD.KEYBOARD = INPUT_METHOD.TOOLBAR,
	) => {
		this.setState((prevState) => ({
			isTableSelectorOpen: !prevState.isTableSelectorOpen,
		}));
	};

	private renderTableSelectorPopup() {
		const { isTableSelectorOpen, isTableSelectorOpenedByKeyboard } = this.state;

		const {
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			pluginInjectionApi,
		} = this.props;

		const ref = this.tableButtonRef.current ?? undefined;

		if (!isTableSelectorOpen) {
			return null;
		}

		// We use focusTrap in the Popup. When we insert a table via popup,
		// the popup closes, focusTrap gets destroyed and the popup detaches.
		// The focus gets set to the body element. onUnmount method sets focus on the editor right before the
		// Popup will be unmounted to ensure that the new table has a selection with a blinking cursor.
		// So we can start typing right away.
		const onUnmount = () => pluginInjectionApi?.core?.actions?.focus();

		return (
			<TableSelectorPopup
				target={ref}
				onUnmount={onUnmount}
				onSelection={this.handleSelectedTableSize}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				handleClickOutside={this.handleTableSelectorClickOutside}
				handleEscapeKeydown={this.handleTableSelectorPressEscape}
				isOpenedByKeyboard={isTableSelectorOpenedByKeyboard}
			/>
		);
	}

	private handleSelectedTableSize = (rowsCount: number, colsCount: number) => {
		this.insertTableWithSize(INPUT_METHOD.TOOLBAR, rowsCount, colsCount)();
		this.toggleTableSelector();
	};

	private handleTableSelectorPressEscape = () => {
		this.toggleTableSelector(INPUT_METHOD.KEYBOARD);
		this.tableSelectorButtonRef.current?.focus();
	};

	private handleTableSelectorClickOutside = (e: MouseEvent) => {
		// Ignore click events for detached elements.
		if (e.target && !isDetachedElement(e.target as HTMLElement)) {
			this.toggleTableSelector(INPUT_METHOD.TOOLBAR);
		}
	};

	componentDidMount = () => {
		this.unregisterToggleDropdownMenuOptions = this.props.registerToggleDropdownMenuOptions
			? this.props.registerToggleDropdownMenuOptions(this.handleClick)
			: null;
	};

	componentWillUnmount = () => {
		this.unregisterToggleDropdownMenuOptions?.();
	};

	render() {
		const { buttons, dropdownItems, emojiPickerOpen, isTableSelectorOpen } = this.state;
		const { isDisabled, isReducedSpacing, editorAppearance } = this.props;

		const isTableButtonVisible = buttons.some(({ value }) => value.name === 'table');

		const isTableSizeVisible = buttons.some(({ value }) => value.name === 'table selector');

		if (buttons.length === 0 && dropdownItems.length === 0) {
			return null;
		}

		let toolbarButtons: BlockMenuItem[] = [];
		let tableSelectorButton: BlockMenuItem | undefined;
		let tableButton: BlockMenuItem | undefined;

		// Seperate table buttons from toolbar buttons
		for (let btn of buttons) {
			if (btn.value.name === TABLE_SELECTOR_STRING) {
				tableSelectorButton = btn;
			} else if (btn.value.name === 'table' && this.props.tableSelectorSupported) {
				tableButton = btn;
			} else {
				toolbarButtons.push(btn);
			}
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<span css={buttonGroupStyle}>
				{toolbarButtons.map((btn) => {
					return (
						<ToolbarButton
							item={btn}
							testId={String(btn.content)}
							ref={btn.value.name === 'emoji' ? this.handleEmojiButtonRef : noop}
							key={btn.value.name}
							spacing={isReducedSpacing ? 'none' : 'default'}
							disabled={isDisabled || btn.isDisabled}
							iconBefore={btn.elemBefore}
							selected={(btn.value.name === 'emoji' && emojiPickerOpen) || btn.isActive}
							title={btn.title}
							aria-label={btn['aria-label']}
							aria-haspopup={btn['aria-haspopup']}
							aria-keyshortcuts={btn['aria-keyshortcuts']}
							onItemClick={this.insertToolbarMenuItem}
						/>
					);
				})}
				{this.props.tableSelectorSupported && (isTableButtonVisible || isTableSizeVisible) && (
					<div
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
						css={tableButtonWrapper({
							isTableSelectorOpen,
							isButtonDisabled: tableButton?.isDisabled,
						})}
					>
						{isTableButtonVisible && (
							<ToolbarButton
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className="table-toolbar-btn"
								item={tableButton}
								ref={this.tableButtonRef}
								testId={String(tableButton?.content)}
								key={tableButton?.value.name}
								spacing={isReducedSpacing ? 'none' : 'default'}
								disabled={isDisabled || tableButton?.isDisabled}
								iconBefore={tableButton?.elemBefore}
								selected={tableButton?.isActive || isTableSelectorOpen}
								title={tableButton?.title}
								aria-label={tableButton ? tableButton['aria-label'] : undefined}
								aria-haspopup={tableButton ? tableButton['aria-haspopup'] : undefined}
								aria-keyshortcuts={tableButton ? tableButton['aria-keyshortcuts'] : undefined}
								onItemClick={this.insertToolbarMenuItem}
							/>
						)}
						{isTableButtonVisible && (
							<ToolbarButton
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className="table-selector-toolbar-btn"
								item={tableSelectorButton}
								testId={String(tableSelectorButton?.content)}
								key={tableSelectorButton?.value.name}
								ref={this.tableSelectorButtonRef}
								spacing={isReducedSpacing ? 'none' : 'default'}
								disabled={isDisabled || tableSelectorButton?.isDisabled}
								iconBefore={tableSelectorButton?.elemBefore}
								selected={tableSelectorButton?.isActive || isTableSelectorOpen}
								title={tableSelectorButton?.title}
								aria-label={tableSelectorButton ? tableSelectorButton['aria-label'] : undefined}
								aria-haspopup={
									tableSelectorButton ? tableSelectorButton['aria-haspopup'] : undefined
								}
								aria-keyshortcuts={
									tableSelectorButton ? tableSelectorButton['aria-keyshortcuts'] : undefined
								}
								onItemClick={this.insertToolbarMenuItem}
								onKeyDown={this.handleTableSelectorOpenByKeyboard}
							/>
						)}
					</div>
				)}
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={wrapperStyle}>
					{this.renderPopup()}
					{this.renderTableSelectorPopup()}
					{editorExperiment('insert-menu-in-right-rail', true) &&
					['full-page', 'full-width'].includes(editorAppearance ?? '') ? (
						<RightRailIcon onClick={this.handleClick} />
					) : (
						<BlockInsertMenu
							popupsMountPoint={this.props.popupsMountPoint}
							popupsBoundariesElement={this.props.popupsBoundariesElement}
							popupsScrollableElement={this.props.popupsScrollableElement}
							disabled={this.props.isDisabled ?? false}
							editorView={this.props.editorView}
							spacing={this.props.isReducedSpacing ? 'none' : 'default'}
							label={this.props.intl.formatMessage(messages.insertMenu)}
							open={this.state.isPlusMenuOpen}
							plusButtonRef={this.plusButtonRef}
							items={this.state.dropdownItems}
							onRef={this.handleDropDownButtonRef}
							onPlusButtonRef={this.handlePlusButtonRef}
							onClick={this.handleClick}
							onKeyDown={this.handleOpenByKeyboard}
							onItemActivated={this.insertInsertMenuItem}
							onInsert={this.insertInsertMenuItem as OnInsert}
							onOpenChange={this.onOpenChange}
							togglePlusMenuVisibility={this.togglePlusMenuVisibility}
							replacePlusMenuWithElementBrowser={
								this.props.replacePlusMenuWithElementBrowser ?? false
							}
							showElementBrowserLink={this.props.showElementBrowserLink || false}
							pluginInjectionApi={this.props.pluginInjectionApi}
						/>
					)}
				</span>
				{!this.props.pluginInjectionApi?.primaryToolbar && this.props.showSeparator && (
					/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					<span css={separatorStyles} />
				)}
			</span>
		);
	}

	private handleClick = () => {
		/**
		 * For insert menu in right rail experiment
		 * - Clean up ticket ED-24801
		 */
		if (editorExperiment('insert-menu-in-right-rail', true, { exposure: true })) {
			const { pluginInjectionApi } = this.props;
			if (!pluginInjectionApi) {
				return;
			}
			pluginInjectionApi.core.actions.execute(({ tr }) => {
				toggleInsertMenuRightRail(tr);
				pluginInjectionApi.contextPanel?.actions.applyChange(tr);
				pluginInjectionApi.analytics?.actions.attachAnalyticsEvent({
					action: ACTION.CLICKED,
					// @ts-expect-error
					actionSubject: ACTION_SUBJECT.TOOLBAR_BUTTON,
					// @ts-expect-error
					actionSubjectId: INPUT_METHOD.INSERT_MENU_RIGHT_RAIL,
					eventType: EVENT_TYPE.UI,
				})(tr);
				return tr;
			});
			return;
		}

		this.togglePlusMenuVisibility();
	};

	private handleOpenByKeyboard = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			/**
			 * For insert menu in right rail experiment
			 * - Clean up ticket ED-24801
			 */
			if (editorExperiment('insert-menu-in-right-rail', true, { exposure: true })) {
				this.props.pluginInjectionApi?.core.actions.execute(({ tr }) => {
					toggleInsertMenuRightRail(tr);
					this.props.pluginInjectionApi?.contextPanel?.actions.applyChange(tr);
					return tr;
				});
				return;
			}

			this.setState({ ...this.state, isOpenedByKeyboard: true });
			event.preventDefault();
			this.togglePlusMenuVisibility();
		}
	};

	private handleTableSelectorOpenByKeyboard = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			this.setState({ isTableSelectorOpenedByKeyboard: true });
		}
	};

	private toggleLinkPanel = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
		const { pluginInjectionApi } = this.props;

		return (
			pluginInjectionApi?.core?.actions.execute(
				pluginInjectionApi?.hyperlink?.commands.showLinkToolbar(inputMethod),
			) ?? false
		);
	};

	private insertMention = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
		const { editorView, pluginInjectionApi } = this.props;
		if (!editorView) {
			return true;
		}
		const pluginState = pluginInjectionApi?.mention?.sharedState.currentState();
		if (pluginState && pluginState.canInsertMention === false) {
			return false;
		}
		return Boolean(pluginInjectionApi?.mention?.actions?.openTypeAhead(inputMethod));
	};

	private insertTable = (inputMethod: TOOLBAR_MENU_TYPE) => {
		const { pluginInjectionApi, editorView } = this.props;

		const { state, dispatch } = editorView;

		// workaround to solve race condition where cursor is not placed correctly inside table
		queueMicrotask(() => {
			pluginInjectionApi?.table?.actions.insertTable?.({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.TABLE,
				attributes: { inputMethod },
				eventType: EVENT_TYPE.TRACK,
			})(state, dispatch);
		});
	};

	private insertTableWithSize =
		(inputMethod: TOOLBAR_MENU_TYPE, rowsCount: number, colsCount: number) => () => {
			const { pluginInjectionApi } = this.props;

			// workaround to solve race condition where cursor is not placed correctly inside table
			queueMicrotask(() => {
				pluginInjectionApi?.core?.actions.execute(
					pluginInjectionApi?.table?.commands.insertTableWithSize(
						rowsCount,
						colsCount,
						INPUT_METHOD.PICKER,
					),
				);
			});
		};

	private createDate = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
		const { pluginInjectionApi } = this.props;
		pluginInjectionApi?.core?.actions.execute(
			pluginInjectionApi?.date?.commands?.insertDate({
				inputMethod,
			}),
		);

		return true;
	};

	private createPlaceholderText = (): boolean => {
		const { editorView, pluginInjectionApi } = this.props;
		pluginInjectionApi?.placeholderText?.actions.showPlaceholderFloatingToolbar(
			editorView.state,
			editorView.dispatch,
		);
		return true;
	};

	private insertLayoutColumns = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
		const { editorView, pluginInjectionApi } = this.props;
		pluginInjectionApi?.layout?.actions.insertLayoutColumns(inputMethod)(
			editorView.state,
			editorView.dispatch,
		);
		return true;
	};

	private createStatus = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
		const { pluginInjectionApi } = this.props;
		return Boolean(
			pluginInjectionApi?.core?.actions.execute(
				pluginInjectionApi?.status?.commands?.insertStatus(inputMethod),
			),
		);
	};

	private openMediaPicker = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
		const { onShowMediaPicker, dispatchAnalyticsEvent } = this.props;
		if (onShowMediaPicker) {
			onShowMediaPicker();
			if (dispatchAnalyticsEvent) {
				dispatchAnalyticsEvent({
					action: ACTION.OPENED,
					actionSubject: ACTION_SUBJECT.PICKER,
					actionSubjectId: ACTION_SUBJECT_ID.PICKER_CLOUD,
					attributes: { inputMethod },
					eventType: EVENT_TYPE.UI,
				});
			}
		}
		return true;
	};

	private insertTaskDecision =
		(name: 'action' | 'decision', inputMethod: TOOLBAR_MENU_TYPE) => (): boolean => {
			const {
				editorView: { state, dispatch },
				pluginInjectionApi,
			} = this.props;
			const listType = name === 'action' ? 'taskList' : 'decisionList';

			return (
				pluginInjectionApi?.taskDecision?.actions.insertTaskDecision(listType, inputMethod)(
					state,
					dispatch,
				) ?? false
			);
		};

	private insertHorizontalRule = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
		const {
			editorView: { state, dispatch },
			pluginInjectionApi,
		} = this.props;

		return (
			pluginInjectionApi?.rule?.actions.insertHorizontalRule(inputMethod)(state, dispatch) ?? false
		);
	};

	private insertExpand = (): boolean => {
		const {
			editorView: { state, dispatch },
			pluginInjectionApi,
		} = this.props;
		return pluginInjectionApi?.expand?.actions.insertExpand(state, dispatch) ?? false;
	};

	private insertBlockType = (itemName: string) => () => {
		const { editorView, onInsertBlockType } = this.props;
		const { state, dispatch } = editorView;

		onInsertBlockType!(itemName)(state, dispatch);
		return true;
	};

	private handleSelectedEmoji = (emojiId: EmojiId): boolean => {
		const { pluginInjectionApi } = this.props;
		this.props.editorView.focus();
		pluginInjectionApi?.core?.actions.execute(
			pluginInjectionApi.emoji?.commands.insertEmoji(emojiId, INPUT_METHOD.PICKER),
		);
		this.toggleEmojiPicker();
		return true;
	};

	private openElementBrowser = () => {
		const { pluginInjectionApi } = this.props;

		pluginInjectionApi?.core?.actions.execute(
			pluginInjectionApi?.quickInsert?.commands.openElementBrowserModal,
		);
	};

	private onItemActivated = ({
		item,
		inputMethod,
	}: {
		item: MenuItem;
		inputMethod: TOOLBAR_MENU_TYPE;
	}): void => {
		const { editorView, editorActions, handleImageUpload, expandEnabled } = this.props;

		// need to do this before inserting nodes so scrollIntoView works properly
		if (!editorView.hasFocus()) {
			editorView.focus();
		}

		switch (item.value.name) {
			case 'link':
				this.toggleLinkPanel(inputMethod);
				break;
			case 'table':
				this.insertTable(inputMethod);
				break;
			case 'table selector':
				this.toggleTableSelector(inputMethod);
				break;
			case 'image upload':
				if (handleImageUpload) {
					const { state, dispatch } = editorView;
					handleImageUpload()(state, dispatch);
				}
				break;
			case 'media':
				this.openMediaPicker(inputMethod);
				break;
			case 'mention':
				this.insertMention(inputMethod);
				break;
			case 'emoji':
				this.toggleEmojiPicker(inputMethod);
				break;
			case 'codeblock':
			case 'blockquote':
			case 'panel':
				this.insertBlockType(item.value.name)();
				break;
			case 'action':
			case 'decision':
				this.insertTaskDecision(item.value.name, inputMethod)();
				break;

			case 'horizontalrule':
				this.insertHorizontalRule(inputMethod);
				break;
			case 'macro':
				this.openElementBrowser();
				break;
			case 'date':
				this.createDate(inputMethod);
				break;
			case 'placeholder text':
				this.createPlaceholderText();
				break;
			case 'layout':
				this.insertLayoutColumns(inputMethod);
				break;
			case 'status':
				this.createStatus(inputMethod);
				break;

			// https://product-fabric.atlassian.net/browse/ED-8053
			// @ts-ignore: OK to fallthrough to default
			case 'expand':
				if (expandEnabled) {
					this.insertExpand();
					break;
				}

			// eslint-disable-next-line no-fallthrough
			default:
				if (item && item.onClick && editorActions) {
					item.onClick(editorActions);
					break;
				}
		}
		this.setState({ isPlusMenuOpen: false });
	};

	private insertToolbarMenuItem = (btn: MenuItem) =>
		this.onItemActivated({
			item: btn,
			inputMethod: INPUT_METHOD.TOOLBAR,
		});

	private insertInsertMenuItem = ({ item }: { item: DropdownItem }) =>
		this.onItemActivated({
			item,
			inputMethod: INPUT_METHOD.INSERT_MENU,
		});
}

export default injectIntl(ToolbarInsertBlock);
