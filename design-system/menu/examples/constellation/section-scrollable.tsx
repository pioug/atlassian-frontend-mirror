import React from 'react';

import { token } from '@atlaskit/tokens';

import { ButtonItem, HeadingItem, MenuGroup, Section } from '../../src';

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
    <MenuGroup maxHeight={300}>
      <Section title="Articles" isScrollable>
        <ButtonItem>Get started</ButtonItem>
        <ButtonItem>Set up your environment</ButtonItem>
        <ButtonItem>Composing code</ButtonItem>
        <ButtonItem>Design tokens</ButtonItem>
        <ButtonItem>Components</ButtonItem>
        <ButtonItem>Patterns</ButtonItem>
        <ButtonItem>Foundations</ButtonItem>
        <ButtonItem>Accessibility</ButtonItem>
        <ButtonItem>Primitives</ButtonItem>
        <ButtonItem>What's new</ButtonItem>
        <ButtonItem>Contribution</ButtonItem>
        <ButtonItem>Contact us</ButtonItem>
      </Section>
      <Section aria-labelledby="actions" hasSeparator>
        <HeadingItem id="actions">Actions</HeadingItem>
        <ButtonItem>Create article</ButtonItem>
      </Section>
    </MenuGroup>
  </div>
);
