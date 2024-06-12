/** @jsx jsx */
import { token } from '@atlaskit/tokens';
import { jsx, css } from '@emotion/react';

import { groupedCountries } from './data/countries';
import Select from './Select';
import { type FormatOptionLabelMeta, type SelectProps } from './types';

type Country = (typeof groupedCountries)[number]['options'][number];

// custom option renderer
const labelStyles = css({
	alignItems: 'center',
	display: 'flex',
	lineHeight: 1.2,
});

const flagStyles = css({
	fontSize: '1.125rem', // emoji size
	marginInlineEnd: token('space.100', '8px'),
});

const Opt = ({ children, icon }: { icon: Country['icon']; children: string }) => (
	<div css={labelStyles}>
		<span css={flagStyles}>{icon}</span>
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
const CountrySelect = (props: SelectProps<Country>) => (
	<Select
		isClearable={false}
		formatOptionLabel={formatOptionLabel}
		getOptionLabel={getOptionLabel}
		getOptionValue={getOptionValue}
		isMulti={false}
		options={groupedCountries}
		{...props}
	/>
);

export default CountrySelect;
