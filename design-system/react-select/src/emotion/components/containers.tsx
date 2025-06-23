/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { media } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../../types';
import { getStyleProps } from '../../utils';

// ==============================
// Root Container
// ==============================

export interface ContainerProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Whether the select is disabled.
	 */
	isDisabled: boolean;
	isFocused: boolean;
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Inner props to be passed down to the container.
	 */
	innerProps: {};
}
export const containerCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
	isRtl,
}: ContainerProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	label: 'container',
	direction: isRtl ? 'rtl' : undefined,
	position: 'relative',
	font: fg('platform_design_system_team_safari_input_fix')
		? token('font.body.large')
		: token('font.body'),
	pointerEvents: 'all',
	cursor: isDisabled ? 'not-allowed' : undefined,
	[`${media.above.xs}`]: {
		font: fg('platform_design_system_team_safari_input_fix') ? token('font.body') : undefined,
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SelectContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ContainerProps<Option, IsMulti, Group>,
) => {
	const { children, innerProps, isDisabled, isRtl } = props;
	const styles = getStyleProps(props, 'container', {
		'--is-disabled': isDisabled,
		'--is-rtl': isRtl,
	});
	return (
		<div
			{...styles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={styles.className || '-container'}
			{...innerProps}
		>
			{children}
		</div>
	);
};

// ==============================
// Value Container
// ==============================

export interface ValueContainerProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Props to be passed to the value container element.
	 */
	innerProps?: {};
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	isDisabled: boolean;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
}
export const valueContainerCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	isMulti,
	hasValue,
	isCompact,
	selectProps: { controlShouldRenderValue },
}: ValueContainerProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	alignItems: 'center',
	display: isMulti && hasValue && controlShouldRenderValue ? 'flex' : 'grid',
	flex: 1,
	flexWrap: 'wrap',
	WebkitOverflowScrolling: 'touch',
	position: 'relative',
	overflow: 'hidden',
	padding: `${isCompact ? 0 : token('space.025')} ${token('space.075')}`,
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ValueContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ValueContainerProps<Option, IsMulti, Group>,
) => {
	const { children, innerProps, isMulti, hasValue } = props;

	const styles = getStyleProps(props, 'valueContainer', {
		'value-container': true,
		'value-container--is-multi': isMulti,
		'value-container--has-value': hasValue,
	});
	return (
		<div
			css={styles.css}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={styles.className || '-ValueContainer'}
			{...innerProps}
		>
			{children}
		</div>
	);
};

// ==============================
// Indicator Container
// ==============================

export interface IndicatorsContainerProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	isDisabled: boolean;
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Props to be passed to the indicators container element.
	 */
	innerProps?: {};
}

export const indicatorsContainerCSS = (): CSSObjectWithLabel => ({
	alignItems: 'center',
	alignSelf: 'stretch',
	display: 'flex',
	flexShrink: 0,
	paddingRight: token('space.050'),
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const IndicatorsContainer = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: IndicatorsContainerProps<Option, IsMulti, Group>,
) => {
	const { children, innerProps } = props;

	return (
		<div
			{...getStyleProps(props, 'indicatorsContainer', {
				indicators: true,
			})}
			{...innerProps}
		>
			{children}
		</div>
	);
};
