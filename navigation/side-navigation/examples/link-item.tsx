import React, { MouseEvent } from 'react';

import Box from '@atlaskit/ds-explorations/box';
import BookIcon from '@atlaskit/icon/glyph/book';
import OpenIcon from '@atlaskit/icon/glyph/open';

import { LinkItem } from '../src';

const Example = () => (
  <Box display="block" onClick={(e: MouseEvent) => e.preventDefault()} as="div">
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
  </Box>
);

export default Example;
