import React from 'react';
import styled from 'styled-components';
import MultiSelect from '../src';

const selectItems = [
  {
    heading: 'Cities',
    items: [
      { content: 'Sydney', value: 'sydney' },
      { content: 'Canberra', value: 'canberra' },
    ],
  },
  {
    heading: 'Animals',
    items: [
      { content: 'Sheep', value: 'sheep' },
      { content: 'Cow', value: 'cow', isDisabled: true },
    ],
  },
  {
    items: [{ content: 'No Heading', value: 'headingless' }],
  },
  {
    items: [],
  },
];

const Vert = styled.div`
  display: flex;
  flex-direction: column;
`;

const PaginationExample = () => (
  <Vert>
    <MultiSelect
      items={selectItems}
      placeholder="Choose a City"
      label="Base use-case"
    />
    <MultiSelect
      items={selectItems}
      label="With more props provided"
      placeholder="Choose a City"
      noMatchesFound="Empty items"
      hasAutocomplete
      defaultSelected={[selectItems[0].items[0]]}
      onSelectedChange={e => console.log('select change', e)}
    />
    <MultiSelect
      items={selectItems}
      label="Disabled Select"
      placeholder="Choose a City"
      isDisabled
    />
    <MultiSelect
      items={selectItems}
      label="Invalid State"
      placeholder="Choose a City"
      isInvalid
      invalidMessage="City is unavailable"
    />
  </Vert>
);

export default PaginationExample;
