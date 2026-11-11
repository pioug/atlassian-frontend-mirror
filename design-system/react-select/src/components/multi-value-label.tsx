/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import type { GroupBase, MultiValueGenericProps } from '../types';

const multiValueLabelStyles = cssMap({
	root: {
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		borderRadius: token('radius.xsmall', '2px'),
		font: token('font.body'),
		paddingInlineEnd: token('space.025'),
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

const semanticMultiValueLabelStyles = cssMap({
	root: {
		paddingInlineEnd: token('space.inset.xxsmall'),
		paddingInlineStart: token('space.inset.xsmall'),
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
				fg('platform-semantic-spacing') && semanticMultiValueLabelStyles.root,
			]}
			{...innerProps}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-MultiValueLabel')}
		>
			{children}
		</div>
	);
};
