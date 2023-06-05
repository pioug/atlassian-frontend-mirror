import React, { FC } from 'react';

import Select, {
  ActionMeta,
  OptionsType,
  OptionType,
  StylesConfig,
  ValueType,
} from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const styles: StylesConfig<OptionType> = {
  container: (base) => ({
    ...base,
    margin: token('space.100', '8px'),
    width: '160px',
    display: 'inline-block',
  }),
};

const options: OptionsType = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
];

interface BeforeItemsSelectProps {
  onChange: (newValue: ValueType<OptionType>, _actionMeta: ActionMeta) => void;
}

const BeforeItemsSelect: FC<BeforeItemsSelectProps> = ({ onChange }) => (
  <Select
    styles={styles}
    options={options}
    defaultValue={{ label: '2', value: 2 }}
    onChange={onChange}
    placeholder="Items Before Collapse"
  />
);

const AfterItemsSelect: FC<BeforeItemsSelectProps> = ({ onChange }) => (
  <Select
    styles={styles}
    options={options}
    defaultValue={{ label: '0', value: 0 }}
    onChange={onChange}
    placeholder="Items Before Collapse"
  />
);

export { AfterItemsSelect, BeforeItemsSelect };
