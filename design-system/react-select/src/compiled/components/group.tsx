/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type CSSProperties, type ReactNode } from 'react';

import { css, cssMap, cx, jsx, type XCSSProp } from '@compiled/react';

import type { XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { type SelectProps } from '../../select';
import {
	type CommonProps,
	type CommonPropsAndClassName,
	type CX,
	type GetStyles,
	type GroupBase,
	type Options,
} from '../../types';
import { cleanCommonProps, getStyleProps } from '../../utils';

interface ForwardedHeadingProps<Option, Group extends GroupBase<Option>> {
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

const styles = cssMap({
	root: {
		paddingBottom: token('space.100'),
		paddingTop: token('space.100'),
	},
});
export const groupCSS = () => ({});

const Group = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupProps<Option, IsMulti, Group>,
) => {
	const {
		children,
		cx: builtinCX,
		getStyles,
		getClassNames,
		Heading,
		headingProps,
		innerProps,
		label,
		selectProps,
		xcss,
	} = props;
	const { css, className } = getStyleProps(props, 'group', { group: true });
	return (
		<div
			css={styles.root}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			{...innerProps}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, innerProps?.className, '-Group')}
		>
			{label && (
				<Heading
					{...headingProps}
					selectProps={selectProps}
					getStyles={getStyles}
					getClassNames={getClassNames}
					cx={builtinCX}
				>
					{label}
				</Heading>
			)}
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
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos> | undefined;
}

export type GroupHeadingProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> = GroupHeadingPropsDefinedProps<Option, IsMulti, Group> & JSX.IntrinsicElements['div'];

const headingStyles = css({
	display: 'block',
	color: token('color.text.subtle'),
	cursor: 'default',
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	// https://product-fabric.atlassian.net/browse/DSP-22128
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginBlockEnd: '0.25em',
	paddingInlineEnd: token('space.150'),
	paddingInlineStart: token('space.150'),
	textTransform: 'none',
});

export const groupHeadingCSS = () => ({});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const GroupHeading = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupHeadingProps<Option, IsMulti, Group>,
) => {
	const { xcss } = props;
	const { data, ...innerProps } = cleanCommonProps(props);
	const { css, className } = getStyleProps(props, 'groupHeading', { 'group-heading': true });
	return (
		<div
			css={headingStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-group')}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			{...innerProps}
		/>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Group;
