import React from 'react';

import OpenIcon from '@atlaskit/icon/glyph/open';

import { ButtonItem, Section } from '../../src';

const ButtonItemExample = () => {
  return (
    <div>
      <Section>
        <ButtonItem>Create page</ButtonItem>
      </Section>
      <Section>
        <ButtonItem isSelected>Selected page</ButtonItem>
      </Section>
      <Section>
        <ButtonItem
          description="Opens in a new window"
          iconAfter={<OpenIcon label="" />}
        >
          Create article
        </ButtonItem>
      </Section>
    </div>
  );
};

export default ButtonItemExample;
