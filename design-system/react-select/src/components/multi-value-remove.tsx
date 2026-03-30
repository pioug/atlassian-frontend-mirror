/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { css, cssMap, cx, jsx, type XCSSProp } from '@compiled/react';

import type { XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
import { token } from '@atlaskit/tokens';

import type { SelectProps } from '../select';
import type { GroupBase } from '../types';

export interface MultiValueRemoveProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> {
	children?: ReactNode;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	innerProps: JSX.IntrinsicElements['div'];
	selectProps: SelectProps<Option, IsMulti, Group>;
	isDisabled: boolean;
	isFocused?: boolean;
	className?: string | undefined;
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos> | undefined;
}

const disabledStyles = css({
	display: 'none',
});

const enabledStyles = css({
	display: 'inherit',
});

const multiValueRemoveStyles = cssMap({
	focused: {
		backgroundColor: token('utility.UNSAFE.transparent'),
		fill: token('color.text.selected', '#000'),
	},
	root: {
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		appearance: 'none',
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text'),
		display: 'flex',
		fill: token('color.text', '#000'),
		paddingBlockStart: token('space.025'),
		paddingInlineEnd: token('space.025'),
		paddingBlockEnd: token('space.025'),
		paddingInlineStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		border: 'none',
		borderRadius: token('radius.small'),

		// DSP-6470 we should style like Tag once we have the :has selector
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			fill: token('color.text.danger', '#000'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			fill: token('color.text.danger', '#000'),
		},
		'&:focus-visible': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			outlineOffset: -2,
		},
	},
});

export function MultiValueRemove<Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
	isFocused,
	innerProps,
	className,
	xcss,
}: MultiValueRemoveProps<Option, IsMulti, Group>): JSX.Element {
	return (
		// The Remove button is intentionally excluded from the tab order, please avoid assigning a non-negative tabIndex to it. Context: https://hello.atlassian.net/wiki/spaces/A11YKB/pages/3031993460/Clear+Options+on+an+Input+Field
		<div
			css={[multiValueRemoveStyles.root, isFocused && multiValueRemoveStyles.focused]}
			{...innerProps}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-MultiValueRemove')}
		>
			<div
				css={[isDisabled && disabledStyles, !isDisabled && enabledStyles]}
				data-testid={isDisabled ? 'hide-clear-icon' : 'show-clear-icon'}
			>
				<CrossIcon label="" color="currentColor" size="small" />
			</div>
		</div>
	);
}
