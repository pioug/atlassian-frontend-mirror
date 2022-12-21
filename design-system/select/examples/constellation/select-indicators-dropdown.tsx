import React from 'react';
import EmojiIcon from '@atlaskit/icon/glyph/emoji';
import { cities } from '../common/data';
import Select, { components } from '../../src';
import { OptionType, DropdownIndicatorProps } from '../../src/types';

const DropdownIndicator = (props: DropdownIndicatorProps<OptionType, true>) => {
  return (
    <components.DropdownIndicator {...props}>
      <EmojiIcon label="Emoji" primaryColor={cities[2].color} />
    </components.DropdownIndicator>
  );
};

export default () => (
  <Select
    closeMenuOnSelect={false}
    components={{ DropdownIndicator }}
    defaultValue={[cities[4], cities[5]]}
    isMulti
    options={cities}
  />
);
