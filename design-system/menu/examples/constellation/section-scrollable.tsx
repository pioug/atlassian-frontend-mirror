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
        <ButtonItem>Article #1</ButtonItem>
        <ButtonItem>Article #2</ButtonItem>
        <ButtonItem>Article #3</ButtonItem>
        <ButtonItem>Article #4</ButtonItem>
        <ButtonItem>Article #5</ButtonItem>
        <ButtonItem>Article #6</ButtonItem>
        <ButtonItem>Article #7</ButtonItem>
        <ButtonItem>Article #8</ButtonItem>
        <ButtonItem>Article #9</ButtonItem>
        <ButtonItem>Article #10</ButtonItem>
        <ButtonItem>Article #11</ButtonItem>
        <ButtonItem>Article #12</ButtonItem>
      </Section>
      <Section aria-labelledby="actions" hasSeparator>
        <HeadingItem id="actions">Actions</HeadingItem>
        <ButtonItem>Create article</ButtonItem>
      </Section>
    </MenuGroup>
  </div>
);
