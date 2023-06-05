import React from 'react';

import { N800, R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { HeadingItem, MenuGroup, Section } from '../../src';

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
      <Section>
        <HeadingItem testId="heading-item">This is a Heading Item</HeadingItem>
      </Section>
      <Section>
        <HeadingItem
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          cssFn={() => ({ color: token('color.text.danger', R300) })}
        >
          A custom Heading Item
        </HeadingItem>
      </Section>
    </MenuGroup>
  </div>
);
