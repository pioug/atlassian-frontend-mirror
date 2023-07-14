import React from 'react';

import { ButtonItem, HeadingItem, NavigationContent, Section } from '../src';

const Example = () => (
  <NavigationContent testId="navigation-content-for-sections">
    <Section title="Actions">
      <ButtonItem>Create issue</ButtonItem>
    </Section>
    <Section aria-labelledby="actions" hasSeparator>
      <HeadingItem id="actions">Actions</HeadingItem>
      <ButtonItem>Create issue</ButtonItem>
      <HeadingItem id="actions">Actions</HeadingItem>
      <ButtonItem>Create issue</ButtonItem>
    </Section>
  </NavigationContent>
);

export default Example;
