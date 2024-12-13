/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { components, type MenuProps, type OptionType } from '@atlaskit/select';

import FixedLayer from '../internal/fixed-layer';

/**
 * This is the fixed layer menu used in the time picker.
 */
export const FixedLayerMenu = ({
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
}: MenuProps<OptionType>) => (
	<FixedLayer
		inputValue={selectProps.inputValue}
		//@ts-ignore react-select unsupported props
		containerRef={selectProps.fixedLayerRef}
		content={
			<components.Menu
				// We have to have this because `getClassNames` is missing. Can't define
				// it in here, for some reason.
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
		}
		//@ts-ignore react-select unsupported props
		testId={selectProps.testId}
	/>
);
