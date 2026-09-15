/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useRef } from 'react';

import { jsx } from '@compiled/react';

import { components } from '@atlaskit/react-select/components';
import type { MenuProps, OptionType } from '@atlaskit/select/types';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map/index';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

/**
 * Bottom-start placement: time options menu appears below and aligned to the
 * start edge of the trigger (the select input).
 */
const popupPlacement = fromLegacyPlacement({ legacy: 'bottom-start' });

/**
 * Top-layer version of the fixed layer menu used in the time picker.
 *
 * Uses `Popover` + `useAnchoredPopover` so the time options list renders
 * in the browser's top layer via the native Popover API and is positioned
 * via CSS Anchor Positioning. This avoids overflow clipping, z-index wars,
 * and portal-based layering.
 *
 * Gated behind the `platform-dst-top-layer` feature flag.
 */
export const FixedLayerMenuTopLayer: ({
	className,
	clearValue,
	cx,
	getStyles,
	getValue,
	hasValue,
	innerProps,
	innerRef,
	isLoading,
	isMulti,
	isRtl,
	maxMenuHeight,
	menuPlacement,
	menuPosition,
	menuShouldScrollIntoView,
	minMenuHeight,
	options,
	placement,
	selectOption,
	selectProps,
	setValue,
	children,
	...rest
}: MenuProps<OptionType>) => JSX.Element = ({
	className,
	clearValue,
	cx,
	getStyles,
	getValue,
	hasValue,
	innerProps,
	innerRef,
	isLoading,
	isMulti,
	isRtl,
	maxMenuHeight,
	menuPlacement,
	menuPosition,
	menuShouldScrollIntoView,
	minMenuHeight,
	options,
	placement,
	selectOption,
	selectProps,
	setValue,
	children,
	...rest
}: MenuProps<OptionType>) => {
	// The select's container element is the anchor for the popup.
	const triggerRef = useRef<HTMLElement | null>(selectProps.fixedLayerRef ?? null);
	triggerRef.current = selectProps.fixedLayerRef ?? null;

	const popoverRef = useRef<HTMLDivElement>(null);

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: popupPlacement,
		// The Popover is rendered with `isOpen` always true while this
		// component is mounted (react-select conditionally mounts/unmounts
		// the menu), so positioning is always active.
		isOpen: true,
	});

	return (
		<Popover
			ref={popoverRef}
			role="listbox"
			isOpen
			// `mode="manual"` opts out of the native popover light-dismiss
			// (Esc / click-outside). react-select already owns those: opening
			// the menu via a click on the input that lives outside the popover
			// element triggers the browser's auto-dismiss as that very click
			// bubbles, slamming the menu shut before the user sees it. With
			// `manual`, react-select's existing onMenuClose / outside-click
			// logic remains the single source of truth.
			mode="manual"
			placement={popupPlacement}
			shouldAnimate
			testId={selectProps.testId && `${selectProps.testId}--popup`}
		>
			<PopoverSurface>
				<components.Menu
					// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
					{...rest}
					// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop
					className={className}
					clearValue={clearValue}
					cx={cx}
					getStyles={getStyles}
					getValue={getValue}
					hasValue={hasValue}
					innerProps={innerProps}
					innerRef={innerRef}
					isLoading={isLoading}
					isMulti={isMulti}
					isRtl={isRtl}
					maxMenuHeight={maxMenuHeight}
					menuPlacement={menuPlacement}
					menuPosition={menuPosition}
					menuShouldScrollIntoView={false || menuShouldScrollIntoView}
					minMenuHeight={minMenuHeight}
					options={options}
					placement={placement}
					selectOption={selectOption}
					selectProps={selectProps}
					setValue={setValue}
				>
					{children}
				</components.Menu>
			</PopoverSurface>
		</Popover>
	);
};
