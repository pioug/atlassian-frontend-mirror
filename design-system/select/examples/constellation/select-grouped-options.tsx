import React from 'react';
import Select from '../../src';

const SelectGroupedOptionsExample = () => (
  <>
    <label htmlFor="grouped-options-example">What city do you live in?</label>
    <Select
      inputId="grouped-options-example"
      className="single-select"
      classNamePrefix="react-select"
      options={[
        {
          label: 'NSW',
          options: [
            { label: 'Sydney', value: 's' },
            { label: 'Newcastle', value: 'n' },
          ],
        },
        {
          label: 'QLD',
          options: [
            { label: 'Brisbane', value: 'b' },
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            { label: 'Gold coast', value: 'g' },
          ],
        },
        {
          label: 'Other',
          options: [
            { label: 'Canberra', value: 'c' },
            { label: 'Williamsdale', value: 'w' },
            { label: 'Darwin', value: 'd' },
            { label: 'Perth', value: 'p' },
          ],
        },
      ]}
      placeholder="Choose a city"
    />
  </>
);

export default SelectGroupedOptionsExample;
