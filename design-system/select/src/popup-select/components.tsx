/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC } from 'react';

import { css, jsx } from '@compiled/react';

import SearchIcon from '@atlaskit/icon/core/search';
import { components } from '@atlaskit/react-select';
import { token } from '@atlaskit/tokens';

import {
	type ClearIndicatorProps,
	type ControlProps,
	type MenuProps,
	type MultiValueRemoveProps,
	type OptionType,
} from '../types';

// ==============================
// Custom Components
// ==============================

const dropdownStyles = css({
	width: 32,
	marginInlineEnd: token('space.025'),
	textAlign: 'center',
});

const DropdownIndicator = (): JSX.Element => (
	<div css={dropdownStyles}>
		<SearchIcon color="currentColor" label="" />
	</div>
);

const controlStyles = css({
	paddingBlockEnd: token('space.050'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
});

const Control = <Option, IsMulti extends boolean>({
	innerRef,
	innerProps,
	...props
}: ControlProps<Option, IsMulti>) => (
	<div ref={innerRef} css={controlStyles}>
		<components.Control {...(props as ControlProps<Option, IsMulti>)} innerProps={innerProps} />
	</div>
);

// NOTE `props` intentionally omitted from `Fragment`
const Menu = ({ children, innerProps }: MenuProps<OptionType, boolean>): JSX.Element => (
	<div {...innerProps}>{children}</div>
);

const ClearIndicator = (props: ClearIndicatorProps): JSX.Element => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<components.ClearIndicator {...props} />
);

const MultiValueRemove = (props: MultiValueRemoveProps): JSX.Element => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<components.MultiValueRemove {...props} />
);

export const defaultComponents: {
	Control: FC<ControlProps<OptionType, boolean>>;
	DropdownIndicator: () => JSX.Element;
	Menu: ({ children, innerProps }: MenuProps<OptionType, boolean>) => JSX.Element;
	ClearIndicator: (props: ClearIndicatorProps) => JSX.Element;
	MultiValueRemove: (props: MultiValueRemoveProps) => JSX.Element;
} = {
	Control,
	DropdownIndicator,
	Menu,
	ClearIndicator,
	MultiValueRemove,
};
