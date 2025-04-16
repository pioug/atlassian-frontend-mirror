/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ComponentType, type ReactNode } from 'react';

import { type XCSSProp } from '@compiled/react';

import type { XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';

import Compiled, {
	groupCSS as compiledGroupCSS,
	GroupHeading as CompiledGroupHeading,
	groupHeadingCSS as compiledGroupHeadingCSS,
} from '../compiled/components/group';
import Emotion, {
	groupCSS as emotionGroupCSS,
	GroupHeading as EmotionGroupHeading,
	groupHeadingCSS as emotionGroupHeadingCSS,
} from '../emotion/components/group';
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

export const groupCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupProps<Option, IsMulti, Group>,
) => (fg('compiled-react-select') ? compiledGroupCSS() : emotionGroupCSS(props));

const Group = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupProps<Option, IsMulti, Group>,
) => (fg('compiled-react-select') ? <Compiled {...props} /> : <Emotion {...props} />);

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

export const groupHeadingCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupHeadingProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? compiledGroupHeadingCSS() : emotionGroupHeadingCSS(props);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const GroupHeading = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: GroupHeadingProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledGroupHeading {...props} />
	) : (
		<EmotionGroupHeading {...props} />
	);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Group;
