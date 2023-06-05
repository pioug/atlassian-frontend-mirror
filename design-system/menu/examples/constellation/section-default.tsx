import React from 'react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ButtonItem, HeadingItem, MenuGroup, Section } from '../../src';

export default () => (
  <div
    style={{
      color: token('color.text', N800),
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
      <Section title="Actions">
        <ButtonItem>Create article</ButtonItem>
      </Section>
      <Section aria-labelledby="actions" hasSeparator>
        <HeadingItem id="actions">Actions</HeadingItem>
        <ButtonItem>Create article</ButtonItem>
      </Section>
    </MenuGroup>
  </div>
);
