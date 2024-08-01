/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { groupedCountries } from './data/countries';
import Select from './Select';
import { type FormatOptionLabelMeta, type SelectProps } from './types';
import {
	type CountyGroupOptions,
	isCountryOptionsGrouped,
	onCountryOptionFocus,
} from './utils/country-groups-announcement';

type Country = (typeof groupedCountries)[number]['options'][number];

// custom option renderer
const labelStyles = css({
	display: 'flex',
	alignItems: 'center',
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
// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Country select__
 *
 * A country select {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
const CountrySelect = (props: SelectProps<Country>) => {
	const { ariaLiveMessages, options } = props;
	const countryOptions = options || groupedCountries;

	return (
		<Select
			isClearable={false}
			formatOptionLabel={formatOptionLabel}
			getOptionLabel={getOptionLabel}
			getOptionValue={getOptionValue}
			isMulti={false}
			options={countryOptions}
			ariaLiveMessages={
				isCountryOptionsGrouped(countryOptions)
					? {
							onFocus: (data) => onCountryOptionFocus(data, countryOptions as CountyGroupOptions[]),
							...ariaLiveMessages,
						}
					: { ...ariaLiveMessages }
			}
			{...props}
		/>
	);
};

export default CountrySelect;
