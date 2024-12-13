/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type SelectProps } from '../select';
import {
	type CommonProps,
	type CommonPropsAndClassName,
	type CSSObjectWithLabel,
	type CX,
	type GetStyles,
	type GroupBase,
	type Options,
} from '../types';
import { cleanCommonProps, getStyleProps } from '../utils';

export interface ForwardedHeadingProps<Option, Group extends GroupBase<Option>> {
	id: string;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Group;
}

export interface GroupProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Component to wrap the label, receives headingProps.
	 */
	Heading: ComponentType<GroupHeadingProps<Option, IsMulti, Group>>;
	/**
	 * Props to pass to Heading.
	 */
	headingProps: ForwardedHeadingProps<Option, Group>;
	/**
	 * Props to be passed to the group element.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	/**
	 * Label to be displayed in the heading component.
	 */
	label: ReactNode;
	/**
	 * The data of the group.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Group;
	options: Options<Option>;
}

export const groupCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({}: GroupProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	paddingBottom: token('space.100'),
	paddingTop: token('space.100'),
});

const Group = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupProps<Option, IsMulti, Group>,
) => {
	const {
		children,
		cx,
		getStyles,
		getClassNames,
		Heading,
		headingProps,
		innerProps,
		label,
		selectProps,
	} = props;
	return (
		<div {...getStyleProps(props, 'group', { group: true })} {...innerProps}>
			<Heading
				{...headingProps}
				selectProps={selectProps}
				getStyles={getStyles}
				getClassNames={getClassNames}
				cx={cx}
			>
				{label}
			</Heading>
			<div>{children}</div>
		</div>
	);
};

interface GroupHeadingPropsDefinedProps<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
> extends ForwardedHeadingProps<Option, Group> {
	className?: string | undefined;
	selectProps: SelectProps<Option, IsMulti, Group>;
	getStyles: GetStyles<Option, IsMulti, Group>;
	getClassNames: CommonProps<Option, IsMulti, Group>['getClassNames'];
	cx: CX;
}

export type GroupHeadingProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> = GroupHeadingPropsDefinedProps<Option, IsMulti, Group> & JSX.IntrinsicElements['div'];

export const groupHeadingCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({}: GroupHeadingProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	label: 'group',
	cursor: 'default',
	display: 'block',
	marginBottom: '0.25em',
	paddingLeft: token('space.150'),
	paddingRight: token('space.150'),
	font: token('font.body.small'),
	color: token('color.text.subtle'),
	fontWeight: token('font.weight.bold'),
	textTransform: 'none',
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const GroupHeading = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupHeadingProps<Option, IsMulti, Group>,
) => {
	const { data, ...innerProps } = cleanCommonProps(props);
	return (
		<div {...getStyleProps(props, 'groupHeading', { 'group-heading': true })} {...innerProps} />
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Group;
