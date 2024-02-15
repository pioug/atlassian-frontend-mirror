import React from 'react';

import { ButtonItem, HeadingItem, NavigationContent, Section } from '../src';

const Example = () => (
  <NavigationContent testId="navigation-content-for-sections">
    <Section title="Primary actions">
      <ButtonItem>Create issue</ButtonItem>
    </Section>
    <Section aria-labelledby="secondary-actions" hasSeparator>
      <HeadingItem id="secondary-actions">Secondary actions</HeadingItem>
      <ButtonItem>Create issue</ButtonItem>
      <HeadingItem>More Actions</HeadingItem>
      <ButtonItem>Create issue</ButtonItem>
    </Section>
  </NavigationContent>
);

export default Example;
