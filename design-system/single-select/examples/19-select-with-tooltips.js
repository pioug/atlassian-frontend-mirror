import React from 'react';
import Select from '../src';

const selectItems = [
  {
    content: 'Admin',
    value: 'role1',
    tooltipDescription: 'Admin can do allthethings and even more',
  },
  {
    content: 'User',
    value: 'role2',
    tooltipDescription: 'User is a permanent slave of the Admin',
  },
  {
    content: 'Guest',
    value: 'role3',
    tooltipDescription: 'Guest can only admire Admin`s grandeur from far away',
  },
];

const SelectWithTooltips = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Select
      items={[
        {
          items: selectItems.map((i) => ({
            ...i,
            tooltipPosition: 'right',
          })),
        },
      ]}
      placeholder="Aligned to right"
    />
    <Select
      items={[
        {
          items: selectItems.map((i) => ({
            ...i,
            tooltipPosition: 'top',
          })),
        },
      ]}
      placeholder="Aligned to top"
    />
    <Select
      items={[
        {
          items: selectItems.map((i) => ({
            ...i,
            tooltipPosition: 'bottom',
          })),
        },
      ]}
      placeholder="Aligned to bottom"
    />
    <Select
      items={[
        {
          items: selectItems.map((i) => ({
            ...i,
            tooltipPosition: 'left',
          })),
        },
      ]}
      placeholder="Aligned to left"
    />
  </div>
);

export default SelectWithTooltips;
