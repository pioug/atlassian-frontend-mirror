import React from 'react';
import Select from '../src';

const SingleExample = () => (
  <>
    <p>
      Default
      <Select
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
    </p>
    <p>
      Subtle
      <Select
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
    </p>
    <p>
      None
      <Select
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
    </p>
  </>
);

export default SingleExample;
