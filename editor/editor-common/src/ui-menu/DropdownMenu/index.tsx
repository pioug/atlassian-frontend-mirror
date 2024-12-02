/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { PureComponent, useContext } from 'react';
import type { MouseEventHandler, PointerEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import type { CustomItemComponentProps } from '@atlaskit/menu';
import { CustomItem, MenuGroup, Section } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';
import type { PositionType } from '@atlaskit/tooltip';
import Tooltip from '@atlaskit/tooltip';

import { DropdownMenuSharedCssClassName } from '../../styles';
import { KeyDownHandlerContext } from '../../ui-menu/ToolbarArrowKeyNavigationProvider';
import { OutsideClickTargetRefContext, withReactEditorViewOuterListeners } from '../../ui-react';
import DropList, { type Props as DropListProps } from '../../ui/DropList';
import Popup from '../../ui/Popup';
import { ArrowKeyNavigationProvider } from '../ArrowKeyNavigationProvider';
import { ArrowKeyNavigationType } from '../ArrowKeyNavigationProvider/types';

import type { MenuItem, Props, State } from './types';

const wrapper = css({
	/* tooltip in ToolbarButton is display:block */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div > div': {
		display: 'flex',
	},
});

const focusedMenuItemStyle = css({
	boxShadow: `inset 0px 0px 0px 2px ${token('color.border.focused')}`,
	outline: 'none',
});

const buttonStyles = (isActive?: boolean, submenuActive?: boolean) => {
	if (isActive) {
		/**
		 * Hack for item to imitate old dropdown-menu selected styles
		 */
		// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
		return css`
			> span,
			> span:hover,
			> span:active {
				background: ${token('color.background.selected', '#6c798f')};
				color: ${token('color.text', '#fff')};
			}
			:focus > span[aria-disabled='false'] {
				${focusedMenuItemStyle};
			}
			:focus-visible,
			:focus-visible > span[aria-disabled='false'] {
				outline: none;
			}
		`;
	} else {
		// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
		return css`
			> span:hover[aria-disabled='false'] {
				color: ${token('color.text')};
				background-color: ${token('color.background.neutral.subtle.hovered', 'rgb(244, 245, 247)')};
			}
			${!submenuActive &&
			`
					> span:active[aria-disabled='false'] {
						background-color: ${token('color.background.neutral.subtle.pressed', 'rgb(179, 212, 255)')};
					}`}
			> span[aria-disabled='true'] {
				color: ${token('color.text.disabled')};
			}
			:focus > span[aria-disabled='false'] {
				${focusedMenuItemStyle};
			}
			:focus-visible,
			:focus-visible > span[aria-disabled='false'] {
				outline: none;
			}
		`; // The default focus-visible style is removed to ensure consistency across browsers
	}
};

const DropListWithOutsideClickTargetRef = (props: DropListProps) => {
	const setOutsideClickTargetRef = React.useContext(OutsideClickTargetRefContext);
	return <DropList onDroplistRef={setOutsideClickTargetRef} {...props} />;
};
const DropListWithOutsideListeners = withReactEditorViewOuterListeners(
	DropListWithOutsideClickTargetRef,
);

/**
 * Wrapper around @atlaskit/droplist which uses Popup and Portal to render
 * dropdown-menu outside of "overflow: hidden" containers when needed.
 *
 * Also it controls popper's placement.
 */
export default class DropdownMenuWrapper extends PureComponent<Props, State> {
	state: State = {
		popupPlacement: ['bottom', 'left'],
		selectionIndex: -1,
	};

	private popupRef = React.createRef<HTMLDivElement>();

	private handleRef = (target: HTMLElement | null) => {
		this.setState({ target: target || undefined });
	};

	private updatePopupPlacement = (placement: [string, string]) => {
		const { popupPlacement: previousPlacement } = this.state;
		if (placement[0] !== previousPlacement[0] || placement[1] !== previousPlacement[1]) {
			this.setState({ popupPlacement: placement });
		}
	};

	private handleCloseAndFocus = (event: PointerEvent | KeyboardEvent) => {
		this.state.target?.querySelector('button')?.focus();
		this.handleClose(event);
	};

	private handleClose = (event?: MouseEvent | PointerEvent | KeyboardEvent) => {
		const { onOpenChange } = this.props;
		if (onOpenChange) {
			onOpenChange({ isOpen: false, event: event });
		}
	};

	private renderDropdownMenu() {
		const { target, popupPlacement } = this.state;
		const {
			items,
			mountTo,
			boundariesElement,
			scrollableElement,
			offset,
			fitHeight,
			fitWidth,
			isOpen,
			zIndex,
			shouldUseDefaultRole,
			onItemActivated,
			arrowKeyNavigationProviderOptions,
			section,
			allowEnterDefaultBehavior,
			handleEscapeKeydown,
		} = this.props;
		// Note that this onSelection function can't be refactored to useMemo for
		// performance gains as it is being used as a dependency in a useEffect in
		// MenuArrowKeyNavigationProvider in order to check for re-renders to adjust
		// focus for accessibility. If this needs to be refactored in future refer
		// back to ED-16740 for context.
		const navigationProviderProps =
			arrowKeyNavigationProviderOptions.type === ArrowKeyNavigationType.COLOR
				? arrowKeyNavigationProviderOptions
				: {
						...arrowKeyNavigationProviderOptions,
						onSelection: (index: number) => {
							let result: MenuItem[] = [];
							if (typeof onItemActivated === 'function') {
								result = items.reduce((result, group) => {
									return result.concat(group.items);
								}, result);
								onItemActivated({
									item: result[index],
									shouldCloseMenu: false,
								});
							}
						},
					};

		return (
			<Popup
				target={isOpen ? target : undefined}
				mountTo={mountTo}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				onPlacementChanged={this.updatePopupPlacement}
				fitHeight={fitHeight}
				fitWidth={fitWidth}
				zIndex={zIndex || akEditorFloatingPanelZIndex}
				offset={offset}
			>
				<ArrowKeyNavigationProvider
					{...navigationProviderProps}
					handleClose={this.handleCloseAndFocus}
					closeOnTab={true}
				>
					<DropListWithOutsideListeners
						isOpen={true}
						position={popupPlacement.join(' ')}
						shouldFitContainer={true}
						handleClickOutside={this.handleClose}
						handleEscapeKeydown={handleEscapeKeydown || this.handleCloseAndFocus}
						handleEnterKeydown={(e: KeyboardEvent) => {
							if (!allowEnterDefaultBehavior) {
								e.preventDefault();
							}
							e.stopPropagation();
						}}
						targetRef={this.state.target}
					>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
						<div style={{ height: 0, minWidth: fitWidth || 0 }} />
						<div ref={this.popupRef}>
							<MenuGroup role={shouldUseDefaultRole ? 'group' : 'menu'}>
								{items.map((group, index) => (
									<Section
										hasSeparator={section?.hasSeparator && index > 0}
										title={section?.title}
										key={index}
									>
										{group.items.map((item) => (
											<DropdownMenuItem
												key={item.key ?? String(item.content)}
												item={item}
												onItemActivated={this.props.onItemActivated}
												shouldUseDefaultRole={this.props.shouldUseDefaultRole}
												onMouseEnter={this.props.onMouseEnter}
												onMouseLeave={this.props.onMouseLeave}
											/>
										))}
									</Section>
								))}
							</MenuGroup>
						</div>
					</DropListWithOutsideListeners>
				</ArrowKeyNavigationProvider>
			</Popup>
		);
	}

	render() {
		const { children, isOpen } = this.props;

		return (
			<div css={wrapper}>
				<div ref={this.handleRef}>{children}</div>
				{isOpen ? this.renderDropdownMenu() : null}
			</div>
		);
	}

	componentDidUpdate(previousProps: Props) {
		const { mountTo, isOpen } = this.props;

		const isOpenToggled = isOpen !== previousProps.isOpen;

		if (isOpen && isOpenToggled) {
			if (
				typeof this.props.shouldFocusFirstItem === 'function' &&
				this.props.shouldFocusFirstItem()
			) {
				const keyboardEvent = new KeyboardEvent('keydown', {
					key: 'ArrowDown',
					bubbles: true,
				});

				if (mountTo) {
					mountTo.dispatchEvent(keyboardEvent);
					return;
				}
				this.state.target?.dispatchEvent(keyboardEvent);
			}
		}
	}
}

type DropdownMenuItemCustomComponentProps = CustomItemComponentProps & {
	item: MenuItem;
} & React.ComponentProps<'span'>;

const DropdownMenuItemCustomComponent = React.forwardRef<
	HTMLAnchorElement,
	DropdownMenuItemCustomComponentProps
>((props: DropdownMenuItemCustomComponentProps, ref) => {
	const { children, ...rest } = props;

	return (
		<span
			ref={ref}
			{...rest}
			style={{
				// This forces the item container back to be `position: static`, the default value.
				// This ensures the custom nested menu for table color picker still works as now
				// menu items from @atlaskit/menu all have `position: relative` set for the selected borders.
				// The current implementation unfortunately is very brittle. Design System Team will
				// be prioritizing official support for accessible nested menus that we want you to move
				// to in the future.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				position: 'static',
			}}
		>
			{children}
		</span>
	);
});

export function DropdownMenuItem({
	item,
	onItemActivated,
	shouldUseDefaultRole,
	onMouseEnter,
	onMouseLeave,
}: {
	item: MenuItem;
} & Pick<Props, 'onItemActivated' | 'shouldUseDefaultRole' | 'onMouseEnter' | 'onMouseLeave'>) {
	const [submenuActive, setSubmenuActive] = React.useState(false);

	// onClick and value.name are the action indicators in the handlers
	// If neither are present, don't wrap in an Item.
	if (!item.onClick && !(item.value && item.value.name)) {
		return <span key={String(item.content)}>{item.content}</span>;
	}

	const _handleSubmenuActive: MouseEventHandler<HTMLDivElement> = (event) => {
		setSubmenuActive(
			Boolean(
				event.target instanceof HTMLElement &&
					event.target.closest(`.${DropdownMenuSharedCssClassName.SUBMENU}`),
			),
		);
	};

	const ariaLabel =
		item['aria-label'] === '' ? undefined : item['aria-label'] || String(item.content);
	const testId = item['data-testid'] || `dropdown-item__${item.content}`;

	// From time to time we don't want to have any tabIndex on item wrapper
	// especially when we pass any interactive element as a item.content
	const tabIndex = item.wrapperTabIndex === null ? undefined : item.wrapperTabIndex || -1;

	const dropListItem = (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			css={() => buttonStyles(item.isActive, submenuActive)}
			tabIndex={tabIndex}
			aria-disabled={item.isDisabled ? 'true' : 'false'}
			onMouseDown={_handleSubmenuActive}
		>
			<CustomItem
				item={item}
				key={item.key ?? String(item.content)}
				testId={testId}
				role={shouldUseDefaultRole ? 'button' : 'menuitem'}
				iconBefore={item.elemBefore}
				iconAfter={item.elemAfter}
				isDisabled={item.isDisabled}
				onClick={() => onItemActivated && onItemActivated({ item })}
				aria-label={ariaLabel}
				aria-pressed={shouldUseDefaultRole ? item.isActive : undefined}
				aria-keyshortcuts={item['aria-keyshortcuts']}
				onMouseDown={(e) => {
					e.preventDefault();
				}}
				component={DropdownMenuItemCustomComponent}
				onMouseEnter={() => onMouseEnter && onMouseEnter({ item })}
				onMouseLeave={() => onMouseLeave && onMouseLeave({ item })}
				aria-expanded={item['aria-expanded']}
			>
				{item.content}
			</CustomItem>
		</div>
	);

	if (item.tooltipDescription) {
		return (
			<Tooltip
				key={item.key ?? String(item.content)}
				content={item.tooltipDescription}
				position={item.tooltipPosition as PositionType}
			>
				{dropListItem}
			</Tooltip>
		);
	}

	return dropListItem;
}

export const DropdownMenuWithKeyboardNavigation = React.memo(
	({ ...props }: React.PropsWithChildren<any>) => {
		const keyDownHandlerContext = useContext(KeyDownHandlerContext);

		// This context is to handle the tab, Arrow Right/Left key events for dropdown.
		// Default context has the void callbacks for above key events
		return (
			<DropdownMenuWrapper
				arrowKeyNavigationProviderOptions={{
					...props.arrowKeyNavigationProviderOptions,
					keyDownHandlerContext,
				}}
				{...props}
			/>
		);
	},
);
