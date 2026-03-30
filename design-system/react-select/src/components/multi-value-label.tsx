/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { GroupBase, MultiValueGenericProps } from '../types';

const multiValueLabelStyles = cssMap({
	root: {
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		borderRadius: token('radius.xsmall', '2px'),
		font: token('font.body'),
		paddingInlineEnd: token('space.025', '2px'),
		paddingInlineStart: token('space.050'),
		color: 'inherit',
	},
	disabled: {
		color: token('color.text.disabled'),
	},
	ellipsis: {
		textOverflow: 'ellipsis',
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueLabel: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	children,
	innerProps,
	isDisabled,
	hasEllipsis,
	className,
	xcss,
}: MultiValueGenericProps<Option, IsMulti, Group>) => JSX.Element = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	children,
	innerProps,
	isDisabled,
	hasEllipsis,
	className,
	xcss,
}: MultiValueGenericProps<Option, IsMulti, Group>) => {
	return (
		<div
			css={[
				multiValueLabelStyles.root,
				isDisabled && multiValueLabelStyles.disabled,
				hasEllipsis && multiValueLabelStyles.ellipsis,
			]}
			{...innerProps}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-MultiValueLabel')}
		>
			{children}
		</div>
	);
};
