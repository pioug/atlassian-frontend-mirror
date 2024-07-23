/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import { components } from 'react-select';
import {
	type ClearIndicatorProps,
	type DropdownIndicatorProps,
	type LoadingIndicatorProps,
} from '../types';
import { Pressable, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import DownIcon from '@atlaskit/icon/glyph/chevron-down';

const iconContainerStyles = xcss({
	all: 'unset',
	outline: 'revert',
	display: 'flex',
	alignItems: 'center',
});

export const ClearIndicator = <Option extends unknown, IsMulti extends boolean = false>(
	props: ClearIndicatorProps<Option, IsMulti>,
) => (
	<components.ClearIndicator
		{...{
			...props,
			innerProps: { ...props.innerProps, 'aria-hidden': 'false' },
		}}
	>
		<Pressable xcss={iconContainerStyles} tabIndex={-1}>
			<SelectClearIcon size="small" label="clear" />
		</Pressable>
	</components.ClearIndicator>
);

export const DropdownIndicator = <Option extends unknown, IsMulti extends boolean = false>(
	props: DropdownIndicatorProps<Option, IsMulti>,
) => (
	<components.DropdownIndicator {...props}>
		<DownIcon label="open" />
	</components.DropdownIndicator>
);

export const LoadingIndicator = <Option extends unknown, IsMulti extends boolean = false>(
	props: LoadingIndicatorProps<Option, IsMulti>,
) => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	const loadingStyles = css(props.getStyles('loadingIndicator', props));
	return (
		// This *must* be constructed this way because this is being consumed by
		// `react-select` and we don't control what it wants.
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<div css={loadingStyles} {...props.innerProps}>
			<Spinner size="small" />
		</div>
	);
};
