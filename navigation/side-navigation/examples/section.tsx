import React from 'react';

import { ButtonItem, HeadingItem, Section } from '../src';

const Example = () => (
  <>
    <Section title="Actions">
      <ButtonItem>Create issue</ButtonItem>
    </Section>
    <Section aria-labelledby="actions" hasSeparator>
      <HeadingItem id="actions">Actions</HeadingItem>
      <ButtonItem>Create issue</ButtonItem>
    </Section>
  </>
);

export default Example;
