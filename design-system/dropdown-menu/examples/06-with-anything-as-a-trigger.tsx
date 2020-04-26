/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React from 'react';

import Avatar from '@atlaskit/avatar';
import Question from '@atlaskit/icon/glyph/question';

import Dropdown, { DropdownItem, DropdownItemGroup } from '../src';

const getDropDownData = () => (
  <DropdownItemGroup title="Heading">
    <DropdownItem>Hello it with some really quite long text here.</DropdownItem>
    <DropdownItem>Some text 2</DropdownItem>
    <DropdownItem isDisabled>Some disabled text</DropdownItem>
    <DropdownItem>Some more text</DropdownItem>
    <DropdownItem href="//atlassian.com" target="_new">
      A link item
    </DropdownItem>
  </DropdownItemGroup>
);

// added tabIndex in dropdown trigger for keyboard naviagtion support

export default () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 200,
      padding: '20px 0',
    }}
  >
    <Dropdown trigger={<span tabIndex={0}>click me</span>}>
      {getDropDownData()}
    </Dropdown>
    <Dropdown trigger={<span tabIndex={0}>{<Avatar />}</span>}>
      {getDropDownData()}
    </Dropdown>
    <Dropdown
      trigger={
        <span tabIndex={0}>
          <Question label="dropdown`s trigger" />
        </span>
      }
    >
      {getDropDownData()}
    </Dropdown>
  </div>
);
