import React from 'react';

import AddItemIcon from '@atlaskit/icon/glyph/add-item';
import OpenIcon from '@atlaskit/icon/glyph/open';

import { ButtonItem } from '../src';

const Example = () => (
  <>
    <ButtonItem>Create article</ButtonItem>
    <ButtonItem isSelected>Create article</ButtonItem>
    <ButtonItem isDisabled>Create article</ButtonItem>
    <ButtonItem iconAfter={<OpenIcon label="" />}>Create article</ButtonItem>
    <ButtonItem description="Will create an article">Create article</ButtonItem>
    <ButtonItem iconBefore={<AddItemIcon label="" />}>
      Create article
    </ButtonItem>
    <ButtonItem
      iconBefore={<AddItemIcon label="" />}
      iconAfter={<OpenIcon label="" />}
    >
      Create article
    </ButtonItem>
    <ButtonItem
      description="Will create an article"
      iconBefore={<AddItemIcon label="" />}
    >
      Create article
    </ButtonItem>
    <ButtonItem
      description="Will create an article"
      iconBefore={<AddItemIcon label="" />}
      iconAfter={<OpenIcon label="" />}
    >
      Create article
    </ButtonItem>
  </>
);

export default Example;
