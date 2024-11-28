/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';
import { getStyleProps } from '../utils';

export interface PlaceholderProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * props passed to the wrapping element for the group.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	isDisabled: boolean;
	isFocused: boolean;
}

export const placeholderCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
}: PlaceholderProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	label: 'placeholder',
	gridArea: '1 / 1 / 2 / 3',
	margin: `0 ${token('space.025')}`,
	color: isDisabled ? token('color.text.disabled') : token('color.text.subtlest'),
});

const Placeholder = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: PlaceholderProps<Option, IsMulti, Group>,
) => {
	const { children, innerProps } = props;
	return (
		<div
			{...getStyleProps(props, 'placeholder', {
				placeholder: true,
			})}
			{...innerProps}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Placeholder;
