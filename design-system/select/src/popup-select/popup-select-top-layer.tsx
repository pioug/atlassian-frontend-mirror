/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type KeyboardEventHandler,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { type GroupBase, mergeStyles } from '@atlaskit/react-select';
import { token } from '@atlaskit/tokens';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { fromLegacyPlacement, type TLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover';
import { Popup } from '@atlaskit/top-layer/popup';

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
import type { PopupSelectProps } from './popup-select';

const animation = slideAndFade();

// ── Styles ──

const menuDialogStyles = css({
	backgroundColor: token('elevation.surface.overlay'),
	borderRadius: token('radius.small'),
	boxShadow: token('elevation.shadow.overlay'),
});

const menuDialogStylesT26Shape = css({
	borderRadius: token('radius.large'),
});

/**
 * Top-layer implementation of PopupSelect.
 *
 * Replaces the legacy PopupSelect rendering pipeline
 * (react-popper + createPortal + react-focus-lock + @atlaskit/layering + z-index)
 * with the native Popover API + CSS Anchor Positioning via @atlaskit/top-layer.
 *
 * Gated behind the `platform-dst-top-layer` feature flag.
 */
export function PopupSelectTopLayer<
	Option = OptionType,
	IsMulti extends boolean = false,
	Modifiers = unknown,
>({
	// ── PopupSelect-specific props ──
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
	isOpen: controlledIsOpen,
	defaultIsOpen,
	spacing: _spacing,
	options = [],
	isSearchable = true,
	components: consumerComponents,
	styles: consumerStyles,
	onChange,
	onKeyDown,

	// ── Lifecycle callbacks ──
	// @ts-ignore react-select unsupported props
	onOpen,
	// @ts-ignore react-select unsupported props
	onClose,
	onMenuOpen,
	onMenuClose,

	// ── No-op props in top-layer path ──
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	popperProps,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	shouldPreventEscapePropagation: _shouldPreventEscapePropagation,

	// ── Remaining props spread to Select ──
	...selectProps
}: PopupSelectProps<Option, IsMulti, Modifiers>): ReactNode {
	// ── State ──
	const isControlled = controlledIsOpen !== undefined;
	const [internalIsOpen, setInternalIsOpen] = useState(
		isControlled ? Boolean(controlledIsOpen) : Boolean(defaultIsOpen),
	);

	const isOpen = isControlled ? Boolean(controlledIsOpen) : internalIsOpen;

	const selectRef = useRef<AtlaskitSelectRefType | null>(null);
	const triggerRef = useRef<HTMLElement | null>(null);

	// ── Placement ──
	const legacyPlacement = (popperProps?.placement ?? 'bottom-start') as string;
	// `popup-select` historically defaulted to an `[along, away] = [0, 8]` popper offset
	// modifier; consumers can override it via `popperProps.modifiers`. Honour both here so
	// the top-layer rendering matches the legacy popper output.
	const legacyOffset = useMemo<[number, number]>(() => {
		const modifiers = popperProps?.modifiers as
			| ReadonlyArray<{ name?: string; options?: { offset?: [number, number] } }>
			| undefined;
		const value = modifiers?.find((modifier) => modifier?.name === 'offset')?.options?.offset;
		if (Array.isArray(value) && value.length === 2) {
			return [Number(value[0]) || 0, Number(value[1]) || 0];
		}
		return [0, 8];
	}, [popperProps?.modifiers]);
	const topLayerPlacement = useMemo(
		() =>
			fromLegacyPlacement({
				legacy: legacyPlacement as TLegacyPlacement,
				offset: legacyOffset,
			}),
		[legacyPlacement, legacyOffset],
	);

	// ── Merged components ──
	const mergedComponents = useMemo(
		() => ({ ...defaultComponents, ...consumerComponents }),
		[consumerComponents],
	);

	// ── Default styles ──
	const defaultStyles: StylesConfig<Option, IsMulti> = useMemo(
		() => ({
			groupHeading: (provided) => ({
				...provided,
				color: token('color.text.subtlest'),
			}),
		}),
		[],
	);

	// ── Utils ──
	const getItemCount = useCallback((): number => {
		let count = 0;
		options.forEach((groupOrOption: Option | GroupBase<Option>) => {
			if ((groupOrOption as GroupBase<Option>).options) {
				(groupOrOption as GroupBase<Option>).options.forEach(() => count++);
			} else {
				count++;
			}
		});
		return count;
	}, [options]);

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

	// ── Open / Close ──
	const open = useCallback(() => {
		if (!isControlled) {
			setInternalIsOpen(true);
		}
		onOpen?.();
		onMenuOpen?.();
	}, [isControlled, onOpen, onMenuOpen]);

	const close = useCallback(() => {
		if (!isControlled) {
			setInternalIsOpen(false);
		}
		onClose?.();
		onMenuClose?.();
	}, [isControlled, onClose, onMenuClose]);

	// ── Sync controlled isOpen ──
	useEffect(() => {
		if (!isControlled) {
			return;
		}
		if (controlledIsOpen) {
			onOpen?.();
			onMenuOpen?.();
		} else {
			onClose?.();
			onMenuClose?.();
		}
		// Only react to changes in the controlled value
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [controlledIsOpen]);

	// ── Open the react-select menu when isOpen becomes true ──
	useEffect(() => {
		if (isOpen && selectRef.current) {
			selectRef.current.select?.openMenu('first');
		}
	}, [isOpen]);

	// ── Event Handlers ──
	const handleTargetKeyDown: KeyboardEventHandler<HTMLElement> = useCallback(
		(event) => {
			if (event.key === 'ArrowDown') {
				open();
			}
		},
		[open],
	);

	// Open the menu when the trigger is clicked. Mirrors the legacy
	// PopupSelect target-click behavior (popup-select.tsx -> handleClick).
	// We cannot trust consumers to spread `onClick` onto the target; the
	// legacy implementation listened on a global click handler, but here
	// we attach `onClick` directly via the triggerProps spread.
	const handleTargetClick = useCallback(() => {
		if (isOpen) {
			close();
		} else {
			open();
		}
	}, [isOpen, open, close]);

	// Focus restoration on close is handled automatically by top-layer's Popup
	// based on the content role (role="dialog" → auto-restore).
	const handleOnClose = useCallback(
		({ reason: _reason }: { reason: TPopoverCloseReason }) => {
			if (isControlled) {
				// For controlled mode, notify consumer but do not change internal state
				onClose?.();
				onMenuClose?.();
				return;
			}
			close();
		},
		[close, isControlled, onClose, onMenuClose],
	);

	const handleSelectChange = useCallback(
		(value: ValueType<Option, IsMulti>, actionMeta: ActionMeta<Option>) => {
			if (closeMenuOnSelect && actionMeta.action !== 'clear') {
				close();
				// Return focus to trigger after selection
				triggerRef.current?.focus();
			}
			onChange?.(value, actionMeta);
		},
		[closeMenuOnSelect, close, onChange],
	);

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
		(event) => {
			const tabEvent = event.key === 'Tab';
			if (shouldCloseMenuOnTab && tabEvent) {
				close();
				triggerRef.current?.focus();
			}
			// Escape closes the menu and returns focus to the trigger.
			// Top-layer's Popup auto-restores focus on Escape, but we close
			// explicitly here so isOpen state stays in sync with the popover.
			if (event.key === 'Escape') {
				close();
				triggerRef.current?.focus();
			}
			onKeyDown?.(event);
		},
		[shouldCloseMenuOnTab, close, onKeyDown],
	);

	// ── Select components ──
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

	return (
		<Popup placement={topLayerPlacement} onClose={handleOnClose} testId={testId}>
			<Popup.TriggerFunction>
				{({ ref, ariaAttributes: _ariaAttributes, popoverId }) => {
					const triggerProps = {
						ref: (node: HTMLElement | null) => {
							triggerRef.current = node;
							if (typeof ref === 'function') {
								ref(node);
							}
						},
						onClick: handleTargetClick,
						onKeyDown: handleTargetKeyDown,
						// Maintain existing aria attribute format for backwards compatibility
						// Should technically be 'dialog' instead of 'true', but preserving
						// legacy behavior. See go/DSP-22283
						'aria-haspopup': 'true' as const,
						'aria-expanded': isOpen,
						'aria-controls': isOpen ? popoverId : undefined,
						isOpen,
					};

					return target?.(triggerProps);
				}}
			</Popup.TriggerFunction>
			<Popup.Content
				role="dialog"
				label={getLabel() ?? 'Popup select'}
				isOpen={isOpen}
				animate={animation}
				testId={testId && `${testId}--content`}
			>
				<Popup.Surface>
					<div
						css={[
							menuDialogStyles,
							fg('platform-dst-shape-theme-default') && menuDialogStylesT26Shape,
						]}
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
							menuIsOpen
							placeholder={placeholder}
							ref={getSelectRef}
							// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- preserving legacy PopupSelect API during migration
							{...selectProps}
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
				</Popup.Surface>
			</Popup.Content>
		</Popup>
	);
}
