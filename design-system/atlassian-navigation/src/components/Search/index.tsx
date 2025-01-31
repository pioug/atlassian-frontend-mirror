/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import SearchIcon from '@atlaskit/icon/core/migration/search';
import { token } from '@atlaskit/tokens';

import {
	CREATE_BREAKPOINT,
	varSearchBackgroundColor,
	varSearchBorderColor,
	varSearchColor,
	varSearchFocusBorderColor,
	varSearchHoverBackgroundColor,
} from '../../common/constants';
import { useTheme } from '../../theme';
import { stripEmptyProperties } from '../../utils';
import { IconButton } from '../IconButton';

import { type SearchProps } from './types';

const searchInputContainerStyles = css({
	position: 'relative',
	marginInlineEnd: token('space.100', '8px'),
	marginInlineStart: token('space.250', '20px'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		display: 'none !important',
	},
});

const searchInputIconStyles = css({
	width: '20px',
	height: '20px',
	position: 'absolute',
	insetBlockStart: '5px',
	insetInlineStart: '10px',
	pointerEvents: 'none',
});

const newSearchBorderStyles = css({
	border: `${token('border.width', '1px')} solid`,
	'&:focus': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} var(${varSearchFocusBorderColor})`,
	},
});

const searchInputStyles = css({
	boxSizing: 'border-box',
	width: '220px',
	height: token('space.400', '32px'),
	padding: `0 ${token('space.100', '8px')} 0 ${token('space.500', '40px')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: `var(${varSearchBackgroundColor})`,
	border: '2px solid',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderColor: `var(${varSearchBorderColor})`,
	borderRadius: token('border.radius.200', '6px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: `var(${varSearchColor})`,
	font: token('font.body'),
	outline: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'::placeholder': {
		color: 'inherit',
	},
	'&:focus': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderColor: `var(${varSearchFocusBorderColor})`,
	},
	'&:hover': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: `var(${varSearchHoverBackgroundColor})`,
	},
});

const searchIconStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		display: 'none !important',
	},
});

type SearchComponentProps = {
	onClick: SearchProps['onClick'];
	placeholder: SearchProps['placeholder'];
	label: SearchProps['label'];
	value: SearchProps['value'];
};

const SearchComponent = (props: SearchComponentProps) => {
	const { onClick, placeholder, label, value } = props;
	const theme = useTheme();
	const search = theme.mode.search;

	const onChange = (...args: any[]) => {
		// @ts-expect-error
		onClick && onClick(...args);
	};

	const onInputClick = (...args: any[]) => {
		// @ts-expect-error
		onClick && onClick(...args);
	};

	const searchInputDynamicStyles = stripEmptyProperties({
		[varSearchBackgroundColor]: search.default.backgroundColor,
		[varSearchColor]: search.default.color,
		[varSearchBorderColor]: search.default.borderColor,
		[varSearchFocusBorderColor]: search.focus.borderColor,
		[varSearchHoverBackgroundColor]: search.hover.backgroundColor,
	});

	return (
		<div css={searchInputContainerStyles} role="search">
			<div css={searchInputIconStyles}>
				<SearchIcon color="currentColor" spacing="spacious" label="" />
			</div>
			<input
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={searchInputDynamicStyles as React.CSSProperties}
				css={[searchInputStyles, newSearchBorderStyles]}
				aria-label={label}
				placeholder={placeholder}
				onChange={onChange}
				onClick={onInputClick}
				value={value}
			/>
		</div>
	);
};

/**
 * __Search__
 *
 * A search input that can be passed into `AtlassianNavigation`'s `renderSearch` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#search)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Search = (props: SearchProps) => {
	const {
		component,
		href,
		id,
		isDisabled,
		isSelected,
		label,
		onBlur,
		onClick,
		onFocus,
		onMouseDown,
		onMouseEnter,
		onMouseLeave,
		onMouseUp,
		placeholder,
		target,
		testId,
		tooltip,
		value,
		...rest
	} = props;

	return (
		<Fragment>
			<SearchComponent
				onClick={onClick}
				placeholder={placeholder}
				label={label}
				value={value || ''}
			/>
			<IconButton
				component={component}
				// @ts-ignore Overriding styles is not supported.
				css={searchIconStyles}
				href={href}
				icon={<SearchIcon color="currentColor" spacing="spacious" label={label} />}
				id={id}
				isDisabled={isDisabled}
				isSelected={isSelected}
				onBlur={onBlur}
				onClick={onClick}
				onFocus={onFocus}
				onMouseDown={onMouseDown}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onMouseUp={onMouseUp}
				target={target}
				testId={testId}
				tooltip={tooltip}
				// Made all explicit, this is left just in case
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...rest}
			/>
		</Fragment>
	);
};
