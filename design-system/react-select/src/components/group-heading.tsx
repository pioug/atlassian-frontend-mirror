/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties } from 'react';

import { css, cx, jsx, type XCSSProp } from '@compiled/react';

import type { XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../get-style-props';
import { cleanCommonProps } from '../internal/clean-common-props';
import { type SelectProps } from '../select';
import { type CommonProps, type CX, type GetStyles, type GroupBase } from '../types';

export interface ForwardedHeadingProps<Option, Group extends GroupBase<Option>> {
	id: string;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Group;
}

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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const GroupHeading: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupHeadingProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
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
