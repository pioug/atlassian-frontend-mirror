import React from 'react';
import Select from '../src';

const DisabledSelects = () => (
  <>
    <p>
      Disabled Single Select
      <Select
        isDisabled
        className="single-select"
        classNamePrefix="react-select"
        options={[
          { label: 'Brisbane', value: 'brisbane' },
          { label: 'Canberra', value: 'canberra' },
          { label: 'Melbourne', value: 'melbourne' },
          { label: 'Sydney', value: 'sydney' },
        ]}
        placeholder="Choose a City"
      />
    </p>
    <p>
      Disabled Multi Select
      <Select
        isDisabled
        className="multi-select"
        classNamePrefix="react-select"
        options={[
          { label: 'Brisbane', value: 'brisbane' },
          { label: 'Canberra', value: 'canberra' },
          { label: 'Melbourne', value: 'melbourne' },
          { label: 'Sydney', value: 'sydney' },
        ]}
        isMulti
        isSearchable={false}
        placeholder="Choose a City"
      />
    </p>
    <p data-test-id="vr-007">
      Single Select with disabled options
      <Select
        className="single-select"
        classNamePrefix="react-select"
        options={[
          { label: 'Brisbane', value: 'brisbane', isDisabled: true },
          { label: 'Canberra', value: 'canberra' },
          { label: 'Melbourne', value: 'melbourne' },
          { label: 'Sydney', value: 'sydney' },
        ]}
        placeholder="Choose a City"
      />
    </p>
    <p data-test-id="vr-007">
      Multi Select with disabled options
      <Select
        className="multi-select"
        classNamePrefix="react-select"
        options={[
          { label: 'Brisbane', value: 'brisbane' },
          { label: 'Canberra', value: 'canberra', isDisabled: true },
          { label: 'Melbourne', value: 'melbourne', isDisabled: true },
          { label: 'Sydney', value: 'sydney' },
        ]}
        isMulti
        isSearchable={false}
        placeholder="Choose a City"
      />
    </p>
  </>
);

export default DisabledSelects;
