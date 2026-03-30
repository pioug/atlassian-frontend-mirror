/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ComponentType, CSSProperties, ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../get-style-props';
import { type CommonPropsAndClassName, type GroupBase, type Options } from '../types';

import { type ForwardedHeadingProps, type GroupHeadingProps } from './group-heading';

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
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
	},
});

const Group = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupProps<Option, IsMulti, Group>,
): JSX.Element => {
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Group;
