// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { type KeyboardEventHandler, PureComponent, type ReactNode } from 'react';

import { type Placement } from '@popperjs/core';
import { bind, type UnbindFn } from 'bind-event-listener';
import { createPortal } from 'react-dom';
import FocusLock from 'react-focus-lock';
import { Manager, type Modifier, Popper, type PopperProps, Reference } from 'react-popper';
import { shallowEqualObjects } from 'shallow-equal';

import { isAppleDevice } from '@atlaskit/ds-lib/device-check';
import { IdProvider } from '@atlaskit/ds-lib/use-id';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	type GroupBase,
	mergeStyles,
	type OptionsOrGroups,
	type components as RSComponents,
} from '@atlaskit/react-select';
import { N80 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Select from '../Select';
import {
	type ActionMeta,
	type AriaOnFocusProps,
	type AtlaskitSelectRefType,
	type GroupType,
	type OptionType,
	type ReactSelectProps,
	type StylesConfig,
	type ValidationState,
	type ValueType,
} from '../types';
import { countAllOptions, isOptionsGrouped, onFocus } from '../utils/grouped-options-announcement';

import { defaultComponents, DummyControl, MenuDialog } from './components';

type SelectComponents = typeof RSComponents;

/**
 * Are we rendering on the client or server?
 */
const canUseDOM = () =>
	Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);

// ==============================
// Types
// ==============================

type defaultModifiers = 'offset' | 'preventOverflow';

type PopperPropsNoChildren<Modifiers> = Omit<PopperProps<Modifiers>, 'children'>;

interface PopupSelectTriggerProps {
	ref: any;
	onKeyDown: KeyboardEventHandler<HTMLElement>;
	'aria-haspopup': 'true';
	'aria-expanded': boolean;
	'aria-controls'?: string;
}

export type ModifierList =
	| 'offset'
	| 'computeStyles'
	| 'preventOverflow'
	| 'handleFlipStyle'
	| 'flip'
	| 'popperOffsets'
	| 'arrow'
	| 'hide'
	| 'eventListeners'
	| 'applyStyles';
export interface PopupSelectProps<
	Option = OptionType,
	IsMulti extends boolean = false,
	Modifiers = ModifierList,
> extends ReactSelectProps<Option, IsMulti> {
	/**
	 * Defines whether the menu should close when selected. The default is `true`.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	closeMenuOnSelect?: boolean;
	/**
	 * Defines whether the menu should be closed by pressing the Tab key. The default is `true`.
	 */
	shouldCloseMenuOnTab?: boolean;
	/**
	 * The footer content shown at the bottom of the popup, underneath the select options.
	 */
	footer?: ReactNode;
	// eslint-disable-next-line jsdoc/require-asterisk-prefix, jsdoc/check-alignment
	/**
	 * The props passed down to React Popper.
	 *
	 * Use these to override the default positioning strategy, behaviour and placement used by this library.
	 * For more information, see the Popper Props section below, or [React Popper documentation](https://popper.js.org/react-popper/v2/render-props).
	 */
	popperProps?: PopperPropsNoChildren<Modifiers>;
	/**
	 * The maximum number of options the select can contain without rendering the search field. The default is `5`.
	 */
	searchThreshold?: number;
	/**
	 * If `false`, renders a select with no search field. If `true`, renders a search field in the select when the
	 * number of options exceeds the `searchThreshold`. The default is `true`.
	 */
	isSearchable?: boolean;
	/**
	 * The maximum width for the popup menu. Can be a number, representing the width in pixels,
	 * or a string containing a CSS length datatype.
	 */
	maxMenuWidth?: number | string;
	/**
	 * The maximum width for the popup menu. Can be a number, representing the width in pixels,
	 * or a string containing a CSS length datatype.
	 */
	minMenuWidth?: number | string;
	// eslint-disable-next-line jsdoc/require-asterisk-prefix, jsdoc/check-alignment
	/**
	 * Render props used to anchor the popup to your content.
	 *
	 * Make this an interactive element, such as an @atlaskit/button component.
	 *
	 * The provided render props in `options` are detailed below:
	 * - `isOpen`: The current state of the popup.
	 * 		Use this to change the appearance of your target based on the state of your component
	 * - `ref`: Pass this ref to the element the Popup should be attached to
	 * - `onKeyDown`: Pass this keydown handler to the element to allow keyboard users to access the element.
	 * - `aria-haspopup`, `aria-expanded`, `aria-controls`: Spread these onto a target element to
	 * 		ensure your experience is accessible
	 */
	target?: (options: PopupSelectTriggerProps & { isOpen: boolean }) => ReactNode;
	isOpen?: boolean;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	defaultIsOpen?: boolean;
	/**
	 * Use this to set whether the component uses compact or standard spacing.
	 */
	spacing?: 'default' | 'compact';
	/**
	 *  @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-14529 Internal documentation for deprecation (no external access)}
	 *  Use isInvalid instead. The state of validation if used in a form
	 */
	validationState?: ValidationState;
	/**
	 * This prop indicates if the component is in an error state.
	 */
	isInvalid?: boolean;
	/**
	 * This gives an accessible name to the input for people who use assistive technology.
	 */
	label?: string;
	/**
	 * The `testId` prop appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests. It will be set on the menu element when defined: `{testId}--menu`
	 */
	testId?: string;
}

interface State<Modifiers = string> {
	focusLockEnabled: boolean;
	isOpen: boolean;
	mergedComponents: Object; // This really should be `SelectComponentsConfig<…>`, but generics aren't compatible across all Selects as structured
	mergedPopperProps: PopperPropsNoChildren<defaultModifiers | Modifiers>;
}

// ==============================
// Class
// ==============================

const modifiers: Modifier<'offset' | 'preventOverflow'>[] = [
	{ name: 'offset', options: { offset: [0, 8] } },
	{
		name: 'preventOverflow',
		enabled: true,
		options: {
			padding: 5,
			boundary: 'clippingParents',
			altAxis: true,
			altBoundary: true,
		},
	},
];

const defaultPopperProps: PopperPropsNoChildren<defaultModifiers> = {
	modifiers,
	placement: 'bottom-start' as Placement,
};

const isEmpty = (obj: Object) => Object.keys(obj).length === 0;

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class PopupSelect<
	Option = OptionType,
	IsMulti extends boolean = false,
	Modifiers = ModifierList,
> extends PureComponent<PopupSelectProps<Option, IsMulti, Modifiers>, State> {
	menuRef: HTMLElement | null = null;
	selectRef: AtlaskitSelectRefType | null = null;
	targetRef: HTMLElement | null = null;
	unbindWindowClick: UnbindFn | null = null;
	unbindWindowKeydown: UnbindFn | null = null;

	defaultStyles: StylesConfig<Option, IsMulti> = {
		groupHeading: (provided) => ({
			...provided,
			color: token('color.text.subtlest', N80),
		}),
	};

	isOpenControlled = this.props.isOpen !== undefined;
	defaultOpenState = this.isOpenControlled ? this.props.isOpen : this.props.defaultIsOpen;

	state = {
		focusLockEnabled: false,
		isOpen: this.defaultOpenState ?? false,
		mergedComponents: defaultComponents,
		mergedPopperProps: defaultPopperProps as PopperPropsNoChildren<defaultModifiers | string>,
	};

	static defaultProps = {
		closeMenuOnSelect: true,
		shouldCloseMenuOnTab: true,
		components: {},
		maxMenuHeight: 300,
		maxMenuWidth: 440,
		minMenuWidth: 220,
		popperProps: {},
		isSearchable: true,
		searchThreshold: 5,
		styles: {},
		options: [],
	};

	static getDerivedStateFromProps(props: PopupSelectProps<OptionType>, state: State) {
		const newState: Partial<State> = {};

		// Merge consumer and default popper props
		const mergedPopperProps = { ...defaultPopperProps, ...props.popperProps };
		if (!shallowEqualObjects(mergedPopperProps, state.mergedPopperProps)) {
			newState.mergedPopperProps = mergedPopperProps;
		}

		// Merge consumer and default components
		const mergedComponents = { ...defaultComponents, ...props.components };
		if (!shallowEqualObjects(mergedComponents, state.mergedComponents)) {
			newState.mergedComponents = mergedComponents;
		}

		if (!isEmpty(newState)) {
			return newState;
		}

		return null;
	}

	componentDidMount() {
		if (typeof window === 'undefined') {
			return;
		}
		this.unbindWindowClick = bind(window, {
			type: 'click',
			listener: this.handleClick,
			options: { capture: true },
		});
	}

	componentWillUnmount() {
		if (typeof window === 'undefined') {
			return;
		}
		this.unbindWindowClick?.();
		this.unbindWindowClick = null;
		this.unbindWindowKeydown?.();
		this.unbindWindowKeydown = null;
	}

	componentDidUpdate(prevProps: PopupSelectProps<Option, IsMulti, Modifiers>) {
		const { isOpen } = this.props;

		if (prevProps.isOpen !== isOpen) {
			if (isOpen === true) {
				this.open({ controlOverride: true });
			} else if (isOpen === false) {
				this.close({ controlOverride: true });
			}
		}
	}

	// Event Handlers
	// ==============================

	handleTargetKeyDown = (event: React.KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowDown':
				this.open();
				break;
			default:
		}
	};

	handleKeyDown = (event: KeyboardEvent) => {
		//We shouldn't close PopupSelect on tab event if there are custom interactive element.
		const tabEvent = (event.key === 'Tab' && event.shiftKey) || event.key === 'Tab';
		if (this.props.shouldCloseMenuOnTab && tabEvent) {
			this.close();
		}

		switch (event.key) {
			case 'Escape':
			case 'Esc':
				this.close();
				break;
			default:
		}
		if (this.props.onKeyDown) {
			/* @ts-ignore - updating type of event React.KeyboardEvent effects the unbindWindowsKeyDown listener. Check if this can be fixed once the component gets refactor to functional */
			this.props.onKeyDown(event);
		}
	};

	handleClick = ({ target }: MouseEvent) => {
		const { isOpen } = this.state;
		// appease flow
		if (!(target instanceof Element)) {
			return;
		}

		// NOTE: Why not use the <Blanket /> component to close?
		// We don't want to interupt the user's flow. Taking this approach allows
		// user to click "through" to other elements and close the popout.
		if (isOpen && this.menuRef && !this.menuRef.contains(target)) {
			this.close();
		}

		// open on target click -- we can't trust consumers to spread the onClick
		// property to the target
		if (!isOpen && this.targetRef && this.targetRef.contains(target)) {
			this.open();
		}
	};

	handleSelectChange = (value: ValueType<Option, IsMulti>, actionMeta: ActionMeta<Option>) => {
		const { closeMenuOnSelect, onChange } = this.props;
		if (closeMenuOnSelect && actionMeta.action !== 'clear') {
			this.close();
		}
		if (onChange) {
			onChange(value, actionMeta);
		}
	};

	handleFirstPopperUpdate = () => {
		// When the popup opens it's focused into. Since the popup is inside a portal, it's position is
		// initially set to 0,0 - this causes the window scroll position to jump to the top. To prevent
		// this we defer enabling the focus-lock until after Popper has positioned the popup the first time.
		this.setState({ focusLockEnabled: true });
	};

	// Internal Lifecycle
	// ==============================

	/**
	 * Opens the popup
	 *
	 * @param options.controlOverride  - Force the popup to open when it's open state is being controlled
	 */
	open = (options?: { controlOverride?: boolean }) => {
		const { onOpen, onMenuOpen } = this.props;

		if (!options?.controlOverride && this.isOpenControlled) {
			// Prevent popup opening if it's open state is already being controlled
			return;
		}

		if (onOpen) {
			onOpen();
		}

		if (onMenuOpen) {
			onMenuOpen();
		}

		this.setState({ isOpen: true }, () => {
			if (this.selectRef) {
				this.selectRef.select?.openMenu('first');
			}
		});

		if (typeof window === 'undefined') {
			return;
		}
		this.unbindWindowKeydown = bind(window, {
			type: 'keydown',
			listener: this.handleKeyDown,
			options: { capture: true },
		});
	};

	/**
	 * Closes the popup
	 *
	 * @param options.controlOverride  - Force the popup to close when it's open state is being controlled
	 */
	close = (options?: { controlOverride?: boolean }) => {
		//@ts-ignore react-select unsupported props
		const { onClose, onMenuClose } = this.props;

		if (!options?.controlOverride && this.isOpenControlled) {
			// Prevent popup closing if it's open state is already being controlled
			return;
		}
		if (onClose) {
			onClose();
		}

		if (onMenuClose) {
			onMenuClose();
		}

		this.setState({ isOpen: false });
		this.setState({ focusLockEnabled: false });

		if (this.targetRef != null) {
			this.targetRef.focus();
		}

		if (typeof window === 'undefined') {
			return;
		}

		this.unbindWindowKeydown?.();
		this.unbindWindowKeydown = null;
	};

	// Refs
	// ==============================

	resolveTargetRef = (popperRef: React.Ref<HTMLElement>) => (ref: HTMLElement) => {
		// avoid thrashing fn calls
		if (!this.targetRef && popperRef && ref) {
			this.targetRef = ref;

			if (typeof popperRef === 'function') {
				popperRef(ref);
			} else {
				(popperRef as React.MutableRefObject<HTMLElement>).current = ref;
			}
		}
	};

	resolveMenuRef = (popperRef: React.Ref<HTMLElement>) => (ref: HTMLDivElement) => {
		this.menuRef = ref;

		if (typeof popperRef === 'function') {
			popperRef(ref);
		} else {
			(popperRef as React.MutableRefObject<HTMLElement>).current = ref;
		}
	};

	getSelectRef = (ref: AtlaskitSelectRefType) => {
		this.selectRef = ref;
	};

	// Utils
	// ==============================

	// account for groups when counting options
	// this may need to be recursive, right now it just counts one level
	getItemCount = () => {
		const { options } = this.props;
		let count = 0;

		options!.forEach((groupOrOption: Option | GroupBase<Option>) => {
			if ((groupOrOption as GroupBase<Option>).options) {
				(groupOrOption as GroupBase<Option>).options.forEach(() => count++);
			} else {
				count++;
			}
		});

		return count;
	};

	getMaxHeight = () => {
		const { maxMenuHeight } = this.props;

		if (!this.selectRef) {
			return maxMenuHeight;
		}

		// subtract the control height to maintain consistency
		const showSearchControl = this.showSearchControl();
		const controlRef = this.selectRef.select?.controlRef;

		const offsetHeight = showSearchControl && controlRef ? controlRef.offsetHeight : 0;
		const maxHeight = maxMenuHeight! - offsetHeight;

		return maxHeight;
	};

	// if the threshold is exceeded, AND isSearchable is true, then display the search control
	showSearchControl = () => {
		const { searchThreshold, isSearchable } = this.props;
		return isSearchable && this.getItemCount() > searchThreshold!;
	};

	// Renderers
	// ==============================

	renderSelect = (id: string) => {
		const {
			footer,
			label,
			maxMenuWidth,
			minMenuWidth,
			placeholder,
			target,
			testId,
			onMenuOpen,
			onMenuClose,
			...props
		} = this.props;

		const { focusLockEnabled, isOpen, mergedComponents, mergedPopperProps } = this.state;
		const showSearchControl = this.showSearchControl();
		const portalDestination = canUseDOM() ? document.body : null;

		if (!portalDestination || !isOpen) {
			return null;
		}

		const selectComponents = {
			...mergedComponents,
			Control: showSearchControl ? mergedComponents.Control : DummyControl,
		} as Partial<SelectComponents>;

		const getLabel: () => string | undefined = () => {
			if (label) {
				return label;
			} else if (typeof placeholder === 'string') {
				return placeholder;
			}
		};
		const providedAriaLabel = getLabel();

		const updateInputAriaLabel = (ariaLabelText: string) => {
			// Update aria-label to get first announcement when popup opened.
			if (this.selectRef?.select?.inputRef) {
				if (providedAriaLabel) {
					ariaLabelText = `${providedAriaLabel}. ${ariaLabelText}`;
				}

				this.selectRef?.select.inputRef?.setAttribute('aria-label', ariaLabelText);
			}
		};

		const generateNoGroupsAriaText = (
			onFocusProps: AriaOnFocusProps<OptionType, GroupBase<OptionType>>,
			ariaLabelSuffix: string,
		) => {
			const { focused } = onFocusProps;
			const options = props?.options || [];
			const totalLength = options?.length;
			const optionIndex = options?.findIndex((option) => option === focused) ?? 0;
			const optionName =
				typeof props?.getOptionLabel === 'function'
					? props.getOptionLabel(focused as Option)
					: focused.label;

			const ariaLabelText = fg('design_system_select-a11y-improvement')
				? `${optionName}`
				: `Option ${optionName} focused, ${optionIndex + 1} of ${totalLength}.
			${totalLength} results available.
			${ariaLabelSuffix}
			`;
			// Option LABEL focused, 1 of 8. 8 results available.
			// Use Up and Down to choose options, press Enter to select the currently focused option,
			// press Escape to exit the menu.
			return ariaLabelText;
		};

		const onReactSelectFocus = (onFocusProps: AriaOnFocusProps<Option, GroupBase<Option>>) => {
			const ariaLabelSuffix = fg('design_system_select-a11y-improvement')
				? ''
				: ' Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu.';
			let ariaLabelText = '';
			let ariaLiveMessage = '';
			if (props.options?.length) {
				if (isOptionsGrouped(props.options as OptionsOrGroups<OptionType, GroupType<OptionType>>)) {
					const totalLength = countAllOptions(props.options as readonly GroupBase<OptionType>[]);
					ariaLiveMessage = onFocus(
						onFocusProps as AriaOnFocusProps<OptionType, GroupBase<OptionType>>,
						props.options as OptionsOrGroups<OptionType, GroupType<OptionType>>,
					);
					ariaLabelText = `${ariaLiveMessage} ${totalLength} results available. ${ariaLabelSuffix}`;
				} else {
					ariaLabelText = generateNoGroupsAriaText(
						onFocusProps as AriaOnFocusProps<OptionType, GroupBase<OptionType>>,
						ariaLabelSuffix,
					);
					ariaLiveMessage = ariaLabelText;
				}
				updateInputAriaLabel(ariaLabelText);
				return ariaLiveMessage;
			}
			return ariaLiveMessage;
		};

		const popper = (
			<Popper
				{...mergedPopperProps}
				onFirstUpdate={(state) => {
					this.handleFirstPopperUpdate();
					mergedPopperProps.onFirstUpdate?.(state);
				}}
			>
				{({ placement, ref, style }) => (
					<MenuDialog
						// There is not a limited amount of values for the widths, so they need to remain dynamic.
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ ...style, maxWidth: maxMenuWidth, minWidth: minMenuWidth }}
						data-placement={placement}
						id={id}
						testId={testId}
						ref={this.resolveMenuRef(ref)}
					>
						<FocusLock disabled={!focusLockEnabled} returnFocus>
							<Select<Option, IsMulti>
								label={providedAriaLabel}
								// TODO: Popup Select does not work well with active-descendant
								aria-live={
									isAppleDevice() &&
									// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
									fg('design_system_select-a11y-improvement')
										? 'assertive' // only needed on Apple products
										: undefined
								}
								backspaceRemovesValue={false}
								controlShouldRenderValue={false}
								isClearable={false}
								tabSelectsValue={false}
								menuIsOpen
								placeholder={placeholder}
								ref={this.getSelectRef}
								{...props}
								isSearchable={showSearchControl}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								styles={mergeStyles(this.defaultStyles, props.styles || {})}
								maxMenuHeight={this.getMaxHeight()}
								components={selectComponents}
								onChange={this.handleSelectChange}
								testId={testId}
								ariaLiveMessages={{
									// Overwriting ariaLiveMessages builtin onFocus method to announce selected option when popup has been opened
									onFocus: onReactSelectFocus,
									...props.ariaLiveMessages, // priority to use user handlers if provided
								}}
							/>
							{footer}
						</FocusLock>
					</MenuDialog>
				)}
			</Popper>
		);

		return mergedPopperProps.strategy === 'fixed'
			? popper
			: createPortal(popper, portalDestination);
	};

	render() {
		const { target } = this.props;
		const { isOpen } = this.state;

		return (
			<Manager>
				<IdProvider postfix="-popup-select">
					{({ id }) => (
						<>
							<Reference>
								{({ ref }) =>
									target &&
									target({
										isOpen,
										onKeyDown: this.handleTargetKeyDown,
										ref: this.resolveTargetRef(ref),
										'aria-haspopup': 'true',
										'aria-expanded': isOpen,
										'aria-controls': isOpen ? id : undefined,
									})
								}
							</Reference>
							{this.renderSelect(id)}
						</>
					)}
				</IdProvider>
			</Manager>
		);
	}
}
