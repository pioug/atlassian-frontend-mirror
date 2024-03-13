import React from 'react';

import { token } from '@atlaskit/tokens';

import { HeadingItem, MenuGroup, Section } from '../../src';

export default () => (
  <div
    style={{
      color: token('color.text'),
      backgroundColor: token('elevation.surface.overlay', '#fff'),
      boxShadow: token(
        'elevation.shadow.overlay',
        '0px 4px 8px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)',
      ),
      borderRadius: 4,
      maxWidth: 320,
      margin: `${token('space.200', '16px')} auto`,
    }}
  >
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
  </div>
);
