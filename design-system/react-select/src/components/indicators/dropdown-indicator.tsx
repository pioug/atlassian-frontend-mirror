/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, type JSX, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { cssMap as strictCssMap } from '@atlaskit/css';
import DownIcon from '@atlaskit/icon/core/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../../types';

const dropdownWrapperStyles = cssMap({
	root: {
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
		paddingBlockEnd: token('space.075'),
		paddingInlineStart: token('space.075'),
	},
});

const semanticDropdownWrapperStyles = strictCssMap({
	root: {
		paddingBlockStart: token('space.inset.small'),
		paddingInlineEnd: token('space.inset.small'),
		paddingBlockEnd: token('space.inset.small'),
		paddingInlineStart: token('space.inset.small'),
	},
});

export interface DropdownIndicatorProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered inside the indicator.
	 */
	children?: ReactNode;
	/**
	 * Props that will be passed on to the children.
	 */
	innerProps: JSX.IntrinsicElements['div'] & { 'data-testid'?: string };
	/**
	 * The focused state of the select.
	 */
	isFocused: boolean;
	isDisabled: boolean;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
}

const dropdownStyles = cssMap({
	default: {
		display: 'flex',
		transition: 'color 150ms',
		color: token('color.text.subtle'),
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.025'),
		paddingBlockEnd: token('space.075'),
		paddingInlineStart: token('space.025'),
		'&:hover': {
			color: token('color.text.subtle'),
		},
	},
	compact: {
		paddingBlockStart: 0,
		paddingBlockEnd: 0,
	},
	disabled: {
		color: token('color.text.disabled'),
	},
	finesse: { color: token('color.icon.subtle') },
	finesseDisabled: { color: token('color.icon.disabled') },
});

const semanticDropdownStyles = strictCssMap({
	default: {
		paddingBlockStart: token('space.inset.small'),
		paddingInlineEnd: token('space.inset.xxsmall'),
		paddingBlockEnd: token('space.inset.small'),
		paddingInlineStart: token('space.inset.xxsmall'),
	},
	compact: {
		paddingBlockStart: 0,
		paddingBlockEnd: 0,
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const DropdownIndicator: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => {
	const { innerProps = {}, children, isDisabled, isCompact, xcss } = props;
	const { css, className } = getStyleProps(props, 'dropdownIndicator', {
		indicator: true,
		'dropdown-indicator': true,
	});

	return (
		<div
			css={[
				dropdownStyles.default,
				fg('platform-dst-tokens-finesse') && dropdownStyles.finesse,
				isDisabled && dropdownStyles.disabled,
				isDisabled && fg('platform-dst-tokens-finesse') && dropdownStyles.finesseDisabled,
				isCompact && dropdownStyles.compact,
				fg('platform-semantic-spacing') && semanticDropdownStyles.default,
				fg('platform-semantic-spacing') && isCompact && semanticDropdownStyles.compact,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-indicatorContainer')}
			{...innerProps}
		>
			{children ?? (
				<Inline
					as="span"
					xcss={cx(
						dropdownWrapperStyles.root,
						fg('platform-semantic-spacing') && semanticDropdownWrapperStyles.root,
					)}
				>
					<DownIcon color="currentColor" label="open" size="small" />
				</Inline>
			)}
		</div>
	);
};
