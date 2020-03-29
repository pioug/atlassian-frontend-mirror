import React from 'react';
import Button from '@atlaskit/button';
import Select from '../src';

const cities = [
  {
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
    ],
  },
];
const colors = [
  {
    items: [
      { content: 'Orange', value: 'color_1' },
      { content: 'Blue', value: 'color_2' },
    ],
  },
];
const animals = [
  {
    items: [
      { content: 'Dog', value: 'animal_1' },
      { content: 'Cat', value: 'animal_2' },
    ],
  },
];
const formTestUrl = 'https://httpbin.org/post';

const SelectInForm = () => (
  <form
    action={formTestUrl}
    method="POST"
    style={{
      padding: '20px',
      background: '#fff',
      width: '500px',
      border: '1px solid #f0f0f0',
    }}
    target="myFrame"
  >
    <Select
      defaultSelected={cities[0].items[0]}
      id="cities_id"
      isFirstChild
      isRequired
      items={cities}
      label="Select city"
      name="city"
      placeholder="Select all!"
      shouldFitContainer
    />
    <Select
      id="colors_id"
      items={colors}
      label="Another form field"
      name="color"
      placeholder="Select color"
      shouldFitContainer
    />
    <Select
      defaultSelected={animals[0].items[0]}
      id="animal_id"
      isDisabled
      items={animals}
      label="Disabled field"
      name="animal"
      placeholder="Select animal"
      shouldFitContainer
    />
    <Select
      id="colors_id"
      items={colors}
      label="Autocomplete field"
      name="autocomplete"
      placeholder="Select color"
      shouldFitContainer
      hasAutocomplete
    />
    <Select
      id="invalid_id"
      invalidMessage="This is a error message"
      isInvalid
      items={colors}
      label="Invalid field"
      name="invalid"
      placeholder="Select color"
      shouldFitContainer
    />
    <Select
      id="colors_id"
      items={cities}
      label="Disabled autocomplete field"
      name="disabled-autocomplete"
      placeholder="Select city"
      shouldFitContainer
      hasAutocomplete
      isDisabled
    />
    <div style={{ margin: '20px 0' }}>
      <Button type="submit">Submit allthethings!</Button>
    </div>
    <iframe
      title="Select Iframe"
      src=""
      name="myFrame"
      style={{ width: '100%', height: '100px' }}
    />
  </form>
);

export default SelectInForm;
