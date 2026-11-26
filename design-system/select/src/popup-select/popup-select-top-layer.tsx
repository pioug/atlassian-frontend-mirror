/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ForwardedRef,
	Fragment,
	type KeyboardEventHandler,
	type ReactNode,
	type Ref,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';

import { jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { mergeStyles } from '@atlaskit/react-select/styles';
import type { GroupBase } from '@atlaskit/react-select/types';
import { token } from '@atlaskit/tokens';
import type { TLegacyPlacement } from '@atlaskit/top-layer/legacy-placements';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map/index';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import type { TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useManualLightDismiss } from '@atlaskit/top-layer/use-manual-light-dismiss';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import Select from '../select';
import {
	type ActionMeta,
	type AtlaskitSelectRefType,
	type OptionType,
	type SelectComponentsConfig,
	type StylesConfig,
	type ValueType,
} from '../types';
import { defaultComponents } from './components';
import { DummyControl } from './dummy-control';
import type { PopupSelectHandle, PopupSelectProps } from './popup-select';

type TPopperOffsetModifier = { name?: string; options?: { offset?: unknown } };

/**
 * The `[along, away]` offset the legacy popper gave for `popperProps.modifiers`.
 *
 * Legacy PopupSelect spreads `popperProps` over its defaults, so a consumer `modifiers` value
 * replaces the default list, with its `[0, 8]` offset. Only a consumer offset modifier then sets
 * the offset. Popper ignores a popper v1 `modifiers` object, so that gives `[0, 0]` too.
 *
 * Exported for tests only.
 */
export function getLegacyOffset({ modifiers }: { modifiers: unknown }): [number, number] {
	if (modifiers == null) {
		return [0, 8];
	}
	const value = Array.isArray(modifiers)
		? (modifiers as ReadonlyArray<TPopperOffsetModifier | null | undefined>).find(
				(modifier) => modifier?.name === 'offset',
			)?.options?.offset
		: undefined;
	if (Array.isArray(value) && value.length === 2) {
		return [Number(value[0]) || 0, Number(value[1]) || 0];
	}
	return [0, 0];
}

/**
 * Top-layer implementation of PopupSelect.
 *
 * Replaces the legacy PopupSelect rendering pipeline
 * (react-popper + createPortal + react-focus-lock + @atlaskit/layering + z-index)
 * with the native Popover API + CSS Anchor Positioning via @atlaskit/top-layer.
 *
 * Gated behind the `platform-dst-top-layer` feature flag.
 */
function PopupSelectTopLayerInner<
	Option = OptionType,
	IsMulti extends boolean = false,
	Modifiers = unknown,
>(
	{
		// PopupSelect-specific props.
		closeMenuOnSelect = true,
		shouldCloseMenuOnTab = true,
		footer,
		searchThreshold = 5,
		maxMenuWidth = 440,
		minMenuWidth = 220,
		maxMenuHeight = 300,
		target,
		label,
		placeholder,
		testId,
		isOpen: isOpenProp,
		defaultIsOpen,
		spacing: _spacing,
		options = [],
		isSearchable = true,
		components: consumerComponents,
		styles: consumerStyles,
		onChange,
		onKeyDown,

		// Lifecycle callbacks.
		onOpen,
		onClose,
		onMenuOpen,
		onMenuClose,

		// No-op props in top-layer path.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		popperProps,
		// Escape closes only this popover: the top layer gives one Escape press to one layer.
		// `stopPropagation()` would hide Escape from document listeners, so this stays a no-op.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		shouldPreventEscapePropagation: _shouldPreventEscapePropagation,

		// Remaining props spread to Select.
		...selectProps
	}: PopupSelectProps<Option, IsMulti, Modifiers>,
	forwardedRef: ForwardedRef<PopupSelectHandle>,
): ReactNode {
	// State.
	// As on the legacy path, whether `isOpen` is controlled is decided once, at mount, and a new
	// `true` or `false` is copied into the open state (a new `undefined` keeps it). A controlled
	// popup does not close itself: an outside press and Escape ask through `onClose`, and a pick and
	// Tab leave it to the consumer (for example a multi-value picker stays open). A consumer that
	// passes `isOpen` only while open is not controlled: a pick, Tab, Escape and an outside press
	// close it.
	const [isControlledAtMount] = useState(isOpenProp !== undefined);
	const [isOpen, setIsOpen] = useState(isOpenProp ?? Boolean(defaultIsOpen));
	const [lastIsOpenProp, setLastIsOpenProp] = useState(isOpenProp);
	if (isOpenProp !== lastIsOpenProp) {
		setLastIsOpenProp(isOpenProp);
		if (isOpenProp !== undefined) {
			setIsOpen(isOpenProp);
		}
	}

	const selectRef = useRef<AtlaskitSelectRefType | null>(null);
	const triggerRef = useRef<HTMLElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	const popoverId = usePopoverId();

	// Placement.
	const legacyPlacement = (popperProps?.placement ?? 'bottom-start') as string;
	const legacyOffset = useMemo(
		() => getLegacyOffset({ modifiers: popperProps?.modifiers }),
		[popperProps?.modifiers],
	);
	const topLayerPlacement = useMemo(
		() =>
			fromLegacyPlacement({
				legacy: legacyPlacement as TLegacyPlacement,
				offset: legacyOffset,
			}),
		[legacyPlacement, legacyOffset],
	);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: topLayerPlacement,
		isOpen,
	});

	// Merged components.
	const mergedComponents = useMemo(
		() => ({ ...defaultComponents, ...consumerComponents }),
		[consumerComponents],
	);

	// Default styles.
	const defaultStyles: StylesConfig<Option, IsMulti> = useMemo(
		() => ({
			groupHeading: (provided) => ({
				...provided,
				color: token('color.text.subtlest'),
			}),
		}),
		[],
	);

	// Utils.
	const getItemCount = useCallback(
		(): number =>
			options.reduce((count, groupOrOption: Option | GroupBase<Option>) => {
				const group = groupOrOption as GroupBase<Option>;
				if (group.options) {
					return count + group.options.length;
				}
				return count + 1;
			}, 0),
		[options],
	);

	const showSearchControl = isSearchable && getItemCount() > searchThreshold;

	const getMaxHeight = useCallback((): number | undefined => {
		if (!selectRef.current) {
			return maxMenuHeight;
		}
		const controlRef = selectRef.current.select?.controlRef;
		const offsetHeight = showSearchControl && controlRef ? controlRef.offsetHeight : 0;
		return maxMenuHeight - offsetHeight;
	}, [maxMenuHeight, showSearchControl]);

	const getLabel = useCallback((): string | undefined => {
		if (label) {
			return label;
		}
		if (typeof placeholder === 'string') {
			return placeholder;
		}
		return undefined;
	}, [label, placeholder]);

	// Open / Close.
	const open = useCallback(() => {
		if (!isControlledAtMount) {
			setIsOpen(true);
		}
		onOpen?.();
		onMenuOpen?.();
	}, [isControlledAtMount, onOpen, onMenuOpen]);

	const close = useCallback(() => {
		if (!isControlledAtMount) {
			setIsOpen(false);
		}
		onClose?.();
		onMenuClose?.();
	}, [isControlledAtMount, onClose, onMenuClose]);

	/**
	 * For backwards compatibility
	 */
	useImperativeHandle(
		forwardedRef,
		() => ({
			open,
			close,
			get selectRef() {
				return selectRef.current;
			},
			get menuRef() {
				return menuRef.current;
			},
			get targetRef() {
				return triggerRef.current;
			},
		}),
		[close, open],
	);

	// Call the open or close callbacks when `isOpen` is `true` or `false` (at mount, and on a change).
	useEffect(() => {
		if (isOpenProp === undefined) {
			return;
		}
		if (isOpenProp) {
			onOpen?.();
			onMenuOpen?.();
		} else {
			onClose?.();
			onMenuClose?.();
		}
		// Only react to changes in the `isOpen` prop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpenProp]);

	// Open the react-select menu when isOpen becomes true.
	useEffect(() => {
		if (isOpen && selectRef.current) {
			selectRef.current.select?.openMenu('first');
		}
	}, [isOpen]);

	// Event Handlers.
	const handleTargetKeyDown: KeyboardEventHandler<HTMLElement> = useCallback(
		(event) => {
			if (event.key === 'ArrowDown') {
				open();
			}
		},
		[open],
	);

	// Open the menu when the trigger is clicked. Mirrors the legacy
	// `PopupSelect` global-click listener: consumers are not required to
	// spread an `onClick`, so we walk up from the event target to the
	// trigger ref instead.
	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}
		return bind(window, {
			type: 'click',
			listener: (event) => {
				const { target } = event;
				if (!(target instanceof Element)) {
					return;
				}
				const trigger = triggerRef.current;
				if (!trigger || !trigger.contains(target)) {
					return;
				}
				if (isOpen) {
					close();
					return;
				}
				open();
			},
			options: { capture: true },
		});
	}, [isOpen, open, close]);

	// Focus return: `Popover` returns focus to the opener as the popup hides after Escape or a
	// close from `isOpen`, as the browser does for an `auto` popover. An outside press leaves focus
	// where the user pressed.
	const handleOnClose = useCallback(
		(_args: { reason: TPopoverCloseReason }) => {
			if (isControlledAtMount) {
				// For controlled mode, notify consumer but do not change internal state
				onClose?.();
				onMenuClose?.();
				return;
			}
			close();
		},
		[close, isControlledAtMount, onClose, onMenuClose],
	);

	/**
	 * **Ask first, close second**
	 *
	 * A `manual` popover, so the browser never closes it. An outside press or Escape asks to close
	 * (with a controlled `isOpen`, through `onClose`), and the popup hides only when `isOpen` becomes
	 * `false`. A press on the trigger does not ask: the trigger click toggles the popup, as on the
	 * legacy path. See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
	 */
	const triggerRefs = useMemo(() => [triggerRef], []);
	useManualLightDismiss({
		isOpen,
		popoverRef,
		additionalInsideElementRefs: triggerRefs,
		onClose: handleOnClose,
	});

	// Counts the picks that leave a controlled popup to the consumer. It changes in the same commit as
	// the consumer's answer, so the effect below sees whether `onChange` closed the popup.
	const [controlledPickCount, setControlledPickCount] = useState(0);

	const handleSelectChange = useCallback(
		(value: ValueType<Option, IsMulti>, actionMeta: ActionMeta<Option>) => {
			if (closeMenuOnSelect && actionMeta.action !== 'clear') {
				if (isControlledAtMount) {
					setControlledPickCount((count) => count + 1);
				} else {
					close();
					// Return focus to trigger after selection
					triggerRef.current?.focus();
				}
			}
			onChange?.(value, actionMeta);
		},
		[closeMenuOnSelect, close, onChange, isControlledAtMount],
	);

	// When `onChange` closes a controlled popup, focus goes to the trigger, as after an uncontrolled
	// pick and on the legacy path. The `Popover` focus return is not enough: on a touch-capable device
	// `react-select` blurs the input on a pick, so no focus is left in the popup. Only the commit of a
	// pick acts, so a later close (for example an outside press) moves no focus.
	const handledPickCountRef = useRef(0);
	useEffect(() => {
		if (controlledPickCount === handledPickCountRef.current) {
			return;
		}
		handledPickCountRef.current = controlledPickCount;
		if (!isOpen) {
			triggerRef.current?.focus();
		}
	}, [controlledPickCount, isOpen]);

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
		(event) => {
			const tabEvent = event.key === 'Tab';
			if (shouldCloseMenuOnTab && tabEvent && !isControlledAtMount) {
				close();
				triggerRef.current?.focus();
			}
			onKeyDown?.(event);
		},
		[shouldCloseMenuOnTab, close, onKeyDown, isControlledAtMount],
	);

	// Select components.
	// Type assertion needed because defaultComponents uses concrete OptionType/boolean
	// but Select expects the generic Option/IsMulti parameters. The components are
	// structurally compatible regardless of the generic parameters.
	const selectComponentsMerged = useMemo(
		() =>
			({
				...mergedComponents,
				Control: showSearchControl ? mergedComponents.Control : DummyControl,
			}) as SelectComponentsConfig<Option, IsMulti>,
		[mergedComponents, showSearchControl],
	);

	const getSelectRef = useCallback((ref: AtlaskitSelectRefType) => {
		selectRef.current = ref;
	}, []);

	const triggerProps = {
		ref: (node: HTMLElement | null) => {
			triggerRef.current = node;
		},
		// No `onClick` on `triggerProps`: the trigger click is observed via
		// the capture-phase global `click` listener in the effect above,
		// matching the legacy `PopupSelect` contract for consumers that do
		// not spread `triggerProps` onto their target.
		onKeyDown: handleTargetKeyDown,
		// Maintain existing aria attribute format for backwards compatibility.
		// Should technically be 'dialog' instead of 'true', but preserving
		// legacy behavior. See go/DSP-22283
		'aria-haspopup': 'true' as const,
		'aria-expanded': isOpen,
		// The popover host is in the DOM only while open, so `aria-controls` is set only then.
		// Matches `getAriaForTrigger` (see
		// `top-layer/notes/decisions/aria-controls-trigger-contract.md`) and the legacy path.
		'aria-controls': isOpen ? popoverId : undefined,
		isOpen,
	};

	return (
		<Fragment>
			{target?.(triggerProps)}
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label={getLabel() ?? 'Popup select'}
				isOpen={isOpen}
				mode="manual"
				onClose={handleOnClose}
				shouldAnimate
				placement={topLayerPlacement}
				testId={testId && `${testId}--content`}
			>
				<PopoverSurface>
					<div
						ref={menuRef}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						style={{
							maxWidth: maxMenuWidth,
							minWidth: minMenuWidth,
						}}
						data-testid={testId && `${testId}--menu`}
					>
						<Select<Option, IsMulti>
							label={getLabel()}
							backspaceRemovesValue={false}
							controlShouldRenderValue={false}
							isClearable={false}
							tabSelectsValue={false}
							placeholder={placeholder}
							ref={getSelectRef}
							// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- preserving legacy PopupSelect API during migration
							{...selectProps}
							menuRenderMode="inline"
							options={options}
							isSearchable={showSearchControl}
							styles={mergeStyles(defaultStyles, consumerStyles || {})}
							maxMenuHeight={getMaxHeight()}
							components={selectComponentsMerged}
							onChange={handleSelectChange}
							onKeyDown={handleKeyDown}
							testId={testId}
						/>
						{footer}
					</div>
				</PopoverSurface>
			</Popover>
		</Fragment>
	);
}

export const PopupSelectTopLayer = forwardRef(PopupSelectTopLayerInner) as <
	Option = OptionType,
	IsMulti extends boolean = false,
	Modifiers = unknown,
>(
	props: PopupSelectProps<Option, IsMulti, Modifiers> & {
		ref?: Ref<PopupSelectHandle>;
	},
) => ReactNode;
