import React from 'react';
import Select, { StylesConfig } from '../src';

const customStyles: StylesConfig = {
  container(styles) {
    return { ...styles, width: '50%' };
  },
};

const SingleExample = () => (
  <Select
    options={[
      { label: 'Adelaide', value: 'adelaide' },
      { label: 'Brisbane', value: 'brisbane' },
      { label: 'Canberra', value: 'canberra' },
      { label: 'Darwin', value: 'darwin' },
      { label: 'Hobart', value: 'hobart' },
      { label: 'Melbourne', value: 'melbourne' },
      { label: 'Perth', value: 'perth' },
      { label: 'Sydney', value: 'sydney' },
    ]}
    placeholder="Choose a City"
    styles={customStyles}
  />
);

export default SingleExample;
