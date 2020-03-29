import React from 'react';

import Avatar from '@atlaskit/avatar';
import UpArrow from '@atlaskit/icon/glyph/arrow-up';
import DownArrow from '@atlaskit/icon/glyph/arrow-down';
import LeftArrow from '@atlaskit/icon/glyph/arrow-left';
import RightArrow from '@atlaskit/icon/glyph/arrow-right';

import Select from '../src';

const size = 'small';

const UpIcon = <UpArrow label="up" size={size} />;
const DownIcon = <DownArrow label="down" size={size} />;
const LeftIcon = <LeftArrow label="left" size={size} />;
const RightIcon = <RightArrow label="right" size={size} />;
const SmallAvatar = <Avatar size="xsmall" />;

const selectItems = [
  {
    items: [
      { elemBefore: UpIcon, content: 'Up!', value: 'dir_1' },
      { elemBefore: DownIcon, content: 'Down!', value: 'dir_2' },
      { elemBefore: LeftIcon, content: 'Left!', value: 'dir_3' },
      {
        elemBefore: RightIcon,
        content: 'Right!',
        value: 'dir_4',
        isDisabled: true,
      },
      { elemBefore: SmallAvatar, content: 'Avatar?', value: 'dir_5' },
    ],
  },
];

const selectedItem = selectItems[0].items[0];

const SelectWithIcons = () => (
  <Select
    defaultSelected={selectedItem}
    items={selectItems}
    placeholder="Select all!"
  />
);

export default SelectWithIcons;
