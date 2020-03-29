/* eslint-disable react/prop-types */
import React from 'react';
import RouterLinkComponent from './RouterLinkComponent';
import { AkNavigationItem } from '../../../src';

const RouterLinkItem = ({ to, text, isSelected }) => (
  <AkNavigationItem
    href={to}
    isSelected={isSelected}
    linkComponent={RouterLinkComponent}
    text={text}
  />
);

export default RouterLinkItem;
