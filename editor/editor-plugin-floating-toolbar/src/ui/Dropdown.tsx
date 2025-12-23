/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import type { ReactElement } from 'react';
import React, { Component } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type {
	CommandDispatch,
	DropdownOptions,
	DropdownOptionT,
	ExtensionDropdownOptions,
	FloatingToolbarButtonSpotlightConfig,
	FloatingToolbarOverflowDropdownOptions,
} from '@atlaskit/editor-common/types';
import type { OpenChangedEvent } from '@atlaskit/editor-common/ui';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import {
	ArrowKeyNavigationType,
	DropdownContainer as UiDropdown,
} from '@atlaskit/editor-common/ui-menu';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { token } from '@atlaskit/tokens';

import { Divider } from './Divider';
import DropdownMenu, { itemSpacing, menuItemDimensions } from './DropdownMenu';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const dropdownExpandContainer = css({
	margin: `0px ${token('space.negative.050', '-4px')}`,
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const iconGroup = css({
	display: 'flex',
});

const CompositeIcon = ({ icon }: { icon: React.ReactChild }) => (
	<div css={iconGroup}>
		{icon}
		<span css={dropdownExpandContainer}>
			<ChevronDownIcon
				color="currentColor"
				spacing="spacious"
				label="Expand dropdown menu"
				size="small"
			/>
		</span>
	</div>
);

export interface Props {
	// A prop to align the dropdown with the floating toolbar instead of the toolbar item
	alignDropdownWithToolbar?: boolean;
	alignX?: 'left' | 'right' | 'center';
	areAnyNewToolbarFlagsEnabled: boolean;
	boundariesElement?: HTMLElement;
	buttonTestId?: string;
	disabled?: boolean;
	dispatchCommand: (command: Function) => void;
	dropdownListId?: string;
	// Increased dropdown item width to prevent labels from being truncated
	dropdownWidth?: number;
	editorView?: EditorView;
	footer?: React.ReactNode;
	hideExpandIcon?: boolean;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: ReactElement<any>;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	iconBefore?: ReactElement<any>;
	mountPoint?: HTMLElement;
	onClick?: () => void;
	onMount?: () => void;
	onToggle?: (state: EditorState, dispatch: CommandDispatch | undefined) => boolean;
	options:
		| DropdownOptions<Function>
		| FloatingToolbarOverflowDropdownOptions<Function>
		| ExtensionDropdownOptions;
	/** If true, the component will have pulse onboarding effect around it. */
	pulse?: boolean;
	scrollableElement?: HTMLElement;
	setDisableParentScroll?: (disable: boolean) => void;
	shouldFitContainer?: boolean;
	// Show a check next to selected dropdown menu items (true by default)
	showSelected?: boolean;
	spotlightConfig?: FloatingToolbarButtonSpotlightConfig;
	title: string;
	tooltip?: string;
}

export interface State {
	isOpen: boolean;
	isOpenedByKeyboard: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Dropdown extends Component<Props, State> {
	state: State = { isOpen: false, isOpenedByKeyboard: false };
	triggerRef = React.createRef<HTMLDivElement>();

	render() {
		const { isOpen } = this.state;
		const {
			title,
			icon,
			iconBefore,
			options,
			dispatchCommand,
			mountPoint,
			boundariesElement,
			scrollableElement,
			hideExpandIcon,
			disabled,
			tooltip,
			buttonTestId,
			dropdownWidth,
			dropdownListId,
			alignDropdownWithToolbar,
			footer,
			onMount,
			pulse,
			spotlightConfig,
			shouldFitContainer,
			alignX,
			areAnyNewToolbarFlagsEnabled,
		} = this.props;

		let trigger;
		if (icon) {
			const TriggerIcon = hideExpandIcon ? icon : <CompositeIcon icon={icon} />;
			trigger = (
				<Button
					testId={buttonTestId}
					title={title}
					icon={TriggerIcon}
					onClick={this.toggleOpen}
					onKeyDown={this.toggleOpenByKeyboard}
					selected={isOpen}
					disabled={disabled}
					tooltipContent={tooltip}
					ariaHasPopup={areAnyNewToolbarFlagsEnabled ? true : undefined}
					onMount={onMount}
					pulse={pulse}
					spotlightConfig={spotlightConfig}
					areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
				/>
			);
		} else {
			trigger = (
				<Button
					testId={buttonTestId}
					iconAfter={
						<span css={dropdownExpandContainer}>
							<ChevronDownIcon
								color="currentColor"
								spacing="spacious"
								label="Expand dropdown menu"
								size="small"
							/>
						</span>
					}
					icon={iconBefore}
					onClick={this.toggleOpen}
					onKeyDown={this.toggleOpenByKeyboard}
					selected={isOpen}
					disabled={disabled}
					tooltipContent={tooltip}
					ariaHasPopup
					areaControls={dropdownListId}
					onMount={onMount}
					pulse={pulse}
					spotlightConfig={spotlightConfig}
					areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
				>
					{title}
				</Button>
			);
		}

		/**
		 * We want to change direction of our dropdowns a bit early,
		 * not exactly when it hits the boundary.
		 */
		const fitTolerance = 10;
		const fitWidth =
			Array.isArray(options) || typeof options === 'function'
				? dropdownWidth || menuItemDimensions.width
				: options.width;
		const fitHeight = Array.isArray(options)
			? options.length * menuItemDimensions.height + itemSpacing * 2
			: typeof options === 'function'
				? this.makeArrayOptionsFromCallback(options).length
				: options.height;

		return (
			/**
			 * At the moment footer diver is rendered along with footer, if it's provided
			 * This is to provide some level of consistency
			 * Refer to the PR for more details:
			 * https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/137394/overview?commentId=8130003
			 */
			<UiDropdown
				alignX={alignX}
				mountTo={mountPoint}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				isOpen={isOpen}
				handleClickOutside={this.hide}
				handleEscapeKeydown={this.hideOnEsc}
				onOpenChange={this.onOpenChanged}
				fitWidth={fitWidth + fitTolerance}
				fitHeight={fitHeight + fitTolerance}
				trigger={trigger}
				dropdownListId={dropdownListId}
				alignDropdownWithParentElement={alignDropdownWithToolbar}
				arrowKeyNavigationProviderOptions={{
					type: ArrowKeyNavigationType.MENU,
				}}
				shouldFitContainer={shouldFitContainer}
			>
				{Array.isArray(options)
					? this.renderArrayOptions(options)
					: typeof options === 'function'
						? this.renderArrayOptions(this.makeArrayOptionsFromCallback(options))
						: options.render({ hide: this.hide, dispatchCommand })}
				{footer && (
					<>
						<Divider />
						{footer}
					</>
				)}
			</UiDropdown>
		);
	}

	private makeArrayOptionsFromCallback = (makeOptions: () => DropdownOptions<Function>) => {
		const options = makeOptions();
		return options as Array<DropdownOptionT<Function>>;
	};

	private renderArrayOptions = (
		options: Array<DropdownOptionT<Function>> | FloatingToolbarOverflowDropdownOptions<Function>,
	) => {
		const { showSelected, dispatchCommand, editorView, areAnyNewToolbarFlagsEnabled } = this.props;
		return (
			<DropdownMenu
				hide={this.hide}
				dispatchCommand={dispatchCommand}
				items={options}
				showSelected={showSelected}
				editorView={editorView}
				areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
			/>
		);
	};

	private toggleOpen = () => {
		const onClick = this.props.onClick;
		if (onClick) {
			onClick();
		}

		this.setState({ isOpen: !this.state.isOpen, isOpenedByKeyboard: false });
		const onToggle = this.props.onToggle;
		if (!onToggle) {
			return;
		}
		requestAnimationFrame(() => {
			this.props.dispatchCommand(onToggle);
		});
	};

	private toggleOpenByKeyboard = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.setState({ isOpen: !this.state.isOpen, isOpenedByKeyboard: true });
		}
	};

	private hide = () => {
		this.setState({ ...this.state, isOpen: false });
	};

	private hideOnEsc = () => {
		// Focus the trigger button only on Escape
		// Focus is done before hiding to ensure onBlur is called
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		(document.querySelector(`[data-testid=${this.props.buttonTestId}]`) as HTMLElement)?.focus();
		this.hide();
	};

	private onOpenChanged = (openChangedEvent: OpenChangedEvent) => {
		if (!openChangedEvent.isOpen && openChangedEvent.event instanceof KeyboardEvent) {
			openChangedEvent.event?.key === 'Escape' ? this.hideOnEsc() : this.hide();
		}
	};

	componentDidUpdate(prevProps: Props, prevState: State): void {
		if (prevState.isOpen !== this.state.isOpen) {
			if (this.props.setDisableParentScroll) {
				this.props.setDisableParentScroll(this.state.isOpen);
			}

			// ECA11Y-235: no sense in sending keyboard event since the menu popup mounted to the custom element,
			// we will ensure first element focused asap as 'MenuArrowKeyNavigationProvider' is mounted
			if (this.props.mountPoint) {
				return;
			}

			if (this.state.isOpen && this.state.isOpenedByKeyboard) {
				const dropList = document.querySelector('[data-role="droplistContent"]');
				if (dropList) {
					// Add setTimeout so that if a dropdown item has tooltip,
					// the tooltip won't be rendered until next render cycle
					// when the droplist is correctly positioned.
					// This makes tooltip appears at the correct position for the first dropdown item.
					setTimeout(() => {
						const keyboardEvent = new KeyboardEvent('keydown', {
							bubbles: true,
							key: 'ArrowDown',
						});
						dropList.dispatchEvent(keyboardEvent);
					}, 0);
				}
			}
		}
	}
}
