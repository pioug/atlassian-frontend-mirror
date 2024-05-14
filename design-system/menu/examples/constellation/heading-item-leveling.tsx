import React from 'react';

import { HeadingItem, MenuGroup, Section } from '../../src';
import MenuGroupContainer from '../common/menu-group-container';

export default () => (
  <MenuGroupContainer>
    <MenuGroup>
      <Section>
        <HeadingItem>Heading level 2(default)</HeadingItem>
      </Section>
      <Section>
        <HeadingItem headingLevel={3}>Heading level 3</HeadingItem>
      </Section>
      <Section>
        <HeadingItem headingLevel={4}>Heading level 4</HeadingItem>
      </Section>
      <Section>
        <HeadingItem headingLevel={5}>Heading level 5</HeadingItem>
      </Section>
      <Section>
        <HeadingItem headingLevel={6}>Heading level 6</HeadingItem>
      </Section>
    </MenuGroup>
  </MenuGroupContainer>
);
