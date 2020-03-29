/** @jsx jsx */
import { jsx } from '@emotion/core';

import { groupedCountries } from './data/countries';
import Select from './Select';
import { FormatOptionLabelMeta } from './types';

// flow stuff
interface OptionType {
  abbr: string;
  code: number;
  icon: string;
  name: string;
}

// custom option renderer
const labelCSS = () => ({
  alignItems: 'center',
  display: 'flex',
  lineHeight: 1.2,
});

const flagCSS = () => ({
  fontSize: '18px',
  marginRight: '8px',
});

const Opt = ({ children, icon }: any) => (
  <div css={labelCSS()}>
    <span css={flagCSS()}>{icon}</span>
    {children}
  </div>
);

// return the country name; used for searching
const getOptionLabel = (opt: OptionType) => opt.name;

// set the country's abbreviation for the option value, (also searchable)
const getOptionValue = (opt: OptionType) => opt.abbr;

// the text node of the control
const controlLabel = (opt: OptionType) => (
  <Opt icon={opt.icon}>{opt.abbr.toUpperCase()}</Opt>
);
// the text node for an option
const optionLabel = ({ abbr, code, icon, name }: OptionType) => (
  <Opt icon={icon}>
    {name} ({abbr.toUpperCase()}) +{code}
  </Opt>
);

// switch formatters based on render context (menu | value)
const formatOptionLabel = (
  opt: OptionType,
  { context }: FormatOptionLabelMeta<OptionType>,
) => (context === 'value' ? controlLabel(opt) : optionLabel(opt));

// put it all together
const CountrySelect = (props: any) => (
  <Select
    isClearable={false}
    formatOptionLabel={formatOptionLabel}
    getOptionLabel={getOptionLabel}
    getOptionValue={getOptionValue}
    isMulti={false}
    options={groupedCountries}
    styles={{
      container: css => ({ ...css, width: 105 }),
      dropdownIndicator: css => ({ ...css, paddingLeft: 0 }),
      menu: css => ({ ...css, width: 300 }),
    }}
    {...props}
  />
);

export default CountrySelect;
