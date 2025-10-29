/* eslint-disable @repo/internal/fs/filename-pattern-match */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { groupedCountries } from './data/countries';
import Select from './Select';
import { type FormatOptionLabelMeta, type SelectProps } from './types';

type Country = (typeof groupedCountries)[number]['options'][number];

// custom option renderer
const labelStyles = css({
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1.2,
});

const flagStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: '1.125rem', // emoji size
	marginInlineEnd: token('space.100', '8px'),
});

const Opt = ({ children, icon }: { icon: Country['icon']; children: string }) => (
	<div css={labelStyles}>
		<span aria-hidden="true" css={flagStyles}>
			{icon}
		</span>
		{children}
	</div>
);

// return the country name; used for searching
const getOptionLabel = ({ abbr, code, name }: Omit<Country, 'icon'>) =>
	`${name} (${abbr.toUpperCase()}) +${code}`;

// set the country's abbreviation for the option value, (also searchable)
const getOptionValue = (opt: Country) => opt.abbr;

// the text node of the control
const controlLabel = (opt: Country) => <Opt icon={opt.icon}>{opt.abbr.toUpperCase()}</Opt>;
// the text node for an option
const optionLabel = ({ abbr, code, icon, name }: Country) => (
	<Opt icon={icon}>{getOptionLabel({ abbr, code, name })}</Opt>
);

// switch formatters based on render context (menu | value)
const formatOptionLabel = (opt: Country, { context }: FormatOptionLabelMeta<Country>) =>
	context === 'value' ? controlLabel(opt) : optionLabel(opt);

// put it all together
const CountrySelect = (props: SelectProps<Country>) => {
	const { options } = props;
	const countryOptions = options || groupedCountries;

	return (
		<Select<Country, false>
			isClearable={false}
			formatOptionLabel={formatOptionLabel}
			getOptionLabel={getOptionLabel}
			getOptionValue={getOptionValue}
			isMulti={false}
			options={countryOptions}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		/>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default CountrySelect;
