import React from 'react';
import styled from 'styled-components';
import SingleSelect from '../src';

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
      { content: 'Cow (disabled)', value: 'cow', isDisabled: true },
    ],
  },
  {
    items: [{ content: 'Item without heading', value: 'headingless' }],
  },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.div`
  margin: 10px 0;
`;

const SingleSelectExample = () => (
  <Container>
    <Heading>Default</Heading>
    <SingleSelect items={selectItems} placeholder="Choose a City" />
    <Heading>With Autocomplete</Heading>
    <SingleSelect
      items={selectItems}
      placeholder="Choose a City"
      noMatchesFound="Empty items"
      hasAutocomplete
      appearance="subtle"
      defaultSelected={selectItems[0].items[0]}
    />
    <Heading>Invalid State</Heading>
    <SingleSelect items={selectItems} placeholder="Choose a City" isInvalid />
    <Heading>Disabled</Heading>
    <SingleSelect items={selectItems} placeholder="Choose a City" isDisabled />
  </Container>
);

export default SingleSelectExample;
