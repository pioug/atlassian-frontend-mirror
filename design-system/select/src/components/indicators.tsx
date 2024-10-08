/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import DownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import CrossIcon from '@atlaskit/icon/utility/migration/cross-circle--select-clear';
import { Inline, Pressable, xcss } from '@atlaskit/primitives';
import { components } from '@atlaskit/react-select';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import {
	type ClearIndicatorProps,
	type DropdownIndicatorProps,
	type LoadingIndicatorProps,
} from '../types';

const iconContainerStyles = xcss({
	all: 'unset',
	outline: 'revert',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: 'space.025',
});

const dropdownWrapperStyles = xcss({
	padding: 'space.075',
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
			<CrossIcon
				label="clear"
				color="currentColor"
				LEGACY_size="small"
				LEGACY_margin={token('space.negative.025', '-0.125rem')}
			/>
		</Pressable>
	</components.ClearIndicator>
);

export const DropdownIndicator = <Option extends unknown, IsMulti extends boolean = false>(
	props: DropdownIndicatorProps<Option, IsMulti>,
) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<components.DropdownIndicator {...props}>
		<Inline as="span" xcss={dropdownWrapperStyles}>
			<DownIcon
				color="currentColor"
				label="open"
				LEGACY_margin={token('space.negative.075', '-0.375rem')}
			/>
		</Inline>
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
