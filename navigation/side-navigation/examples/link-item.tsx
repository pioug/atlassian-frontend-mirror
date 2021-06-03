import React from 'react';

import BookIcon from '@atlaskit/icon/glyph/book';
import OpenIcon from '@atlaskit/icon/glyph/open';

import { LinkItem } from '../src';

const Example = () => (
  <div onClick={(e) => e.preventDefault()}>
    <LinkItem href="#">My articles</LinkItem>
    <LinkItem href="#" isDisabled>
      My articles
    </LinkItem>
    <LinkItem href="#" iconAfter={<OpenIcon label="" />}>
      My articles
    </LinkItem>
    <LinkItem href="#" description="Will create an article">
      My articles
    </LinkItem>
    <LinkItem href="#" iconBefore={<BookIcon label="" />}>
      My articles
    </LinkItem>
    <LinkItem
      href="#"
      iconBefore={<BookIcon label="" />}
      iconAfter={<OpenIcon label="" />}
    >
      My articles
    </LinkItem>
    <LinkItem
      href="#"
      description="Will create an article"
      iconBefore={<BookIcon label="" />}
    >
      My articles
    </LinkItem>
    <LinkItem
      href="#"
      description="Will create an article"
      iconBefore={<BookIcon label="" />}
      iconAfter={<OpenIcon label="" />}
    >
      My articles
    </LinkItem>
  </div>
);

export default Example;
