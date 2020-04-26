import React from 'react';

import { ButtonItem, HeadingItem, Section } from '../src';

export default () => (
  <>
    <Section title="Actions">
      <ButtonItem>Create article</ButtonItem>
    </Section>
    <Section aria-labelledby="actions" hasSeparator>
      <HeadingItem id="actions">Actions</HeadingItem>
      <ButtonItem>Create article</ButtonItem>
    </Section>
  </>
);
