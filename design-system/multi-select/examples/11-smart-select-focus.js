import React, { PureComponent } from 'react';
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

export default class extends PureComponent {
  state = {
    focusedSelect: 1,
  };

  changeFocus = () => {
    const newValue =
      this.state.focusedSelect === 3 ? 1 : this.state.focusedSelect + 1;

    this.setState({ focusedSelect: newValue });
  };

  render() {
    return (
      <div>
        <Select
          id="cities_id"
          isFirstChild
          shouldFocus={this.state.focusedSelect === 1}
          isRequired
          items={cities}
          label="Required field"
          name="cities"
          shouldFitContainer
        />
        <Select
          id="colors_id"
          shouldFocus={this.state.focusedSelect === 2}
          isInvalid
          items={colors}
          label="Invalid field"
          name="colors"
          shouldFitContainer
        />
        <Select
          defaultSelected={[animals[0].items[0]]}
          id="animal_id"
          shouldFocus={this.state.focusedSelect === 3}
          items={animals}
          label="Disabled field"
          name="animal"
          shouldFitContainer
        />
        <div style={{ margin: '20px 0' }}>
          <Button type="button" onClick={this.changeFocus}>
            Change focus
          </Button>
        </div>
      </div>
    );
  }
}
