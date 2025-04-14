/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';
import { getStyleProps } from '../utils';

export interface SingleValueProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * The data of the selected option rendered in the Single Value component.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	/**
	 * Props passed to the wrapping element for the group.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	/**
	 * Whether this is disabled.
	 */
	isDisabled: boolean;
}

export const css = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
}: SingleValueProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	label: 'singleValue',
	gridArea: '1 / 1 / 2 / 3',
	maxWidth: '100%',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	margin: `0 ${token('space.025')}`,
	color: isDisabled ? token('color.text.disabled') : token('color.text'),
});

const SingleValue = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: SingleValueProps<Option, IsMulti, Group>,
) => {
	const { children, isDisabled, innerProps } = props;
	return (
		<div
			{...getStyleProps(props, 'singleValue', {
				'single-value': true,
				'single-value--is-disabled': isDisabled,
			})}
			{...innerProps}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default SingleValue;
