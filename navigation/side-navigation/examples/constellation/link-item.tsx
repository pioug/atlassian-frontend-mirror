import React from 'react';

import BookIcon from '@atlaskit/icon/glyph/book';

import { LinkItem, Section } from '../../src';

const ButtonItemExample = () => {
  return (
    <div>
      <Section>
        <LinkItem href="#">My articles</LinkItem>
      </Section>
      <Section>
        <LinkItem
          href="#"
          description="All published articles"
          iconBefore={<BookIcon label="" />}
        >
          My articles
        </LinkItem>
      </Section>
    </div>
  );
};

export default ButtonItemExample;
