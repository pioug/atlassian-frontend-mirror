import React from 'react';

import { Label } from '@atlaskit/form';

import Select from '../src';

const SingleExample = () => (
  <>
    <Label htmlFor="default">Default</Label>
    <Select
      inputId="default"
      className="single-select"
      classNamePrefix="react-select"
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
    />
    <Label htmlFor="subtle">Subtle</Label>
    <Select
      inputId="subtle"
      className="single-select"
      classNamePrefix="react-select"
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
      appearance="subtle"
    />
    <Label htmlFor="none">None</Label>
    <Select
      inputId="none"
      className="single-select"
      classNamePrefix="react-select"
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
      appearance="none"
    />
  </>
);

export default SingleExample;
