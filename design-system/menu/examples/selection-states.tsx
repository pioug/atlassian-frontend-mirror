import React from 'react';

import { token } from '@atlaskit/tokens';

import {
  ButtonItem,
  CustomItem,
  CustomItemComponentProps,
  LinkItem,
  MenuGroup,
  Section,
  SELECTION_STYLE_CONTEXT_DO_NOT_USE,
} from '../src';

type LinkProps = CustomItemComponentProps & {
  href: string;
};

const Link = ({ children, href, className, onClick, tabIndex }: LinkProps) => {
  return (
    <a href={href} className={className} onClick={onClick} tabIndex={tabIndex}>
      {children}
    </a>
  );
};

export default function Example() {
  return (
    <div data-testid="example" style={{ padding: token('space.150', '12px') }}>
      <MenuGroup maxWidth={300}>
        <Section>
          <ButtonItem isSelected>Button</ButtonItem>
          <LinkItem
            href="http://www.atlassian.com"
            onClick={(e) => e.preventDefault()}
            isSelected
          >
            Link to Atlassian
          </LinkItem>
          <CustomItem
            component={Link}
            onClick={(e) => e.preventDefault()}
            href="http://www.atlassian.com"
            isSelected
          >
            Custom (Link to Atlassian)
          </CustomItem>
        </Section>
      </MenuGroup>

      <MenuGroup maxWidth={300}>
        <SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider value="notch">
          <Section>
            <ButtonItem isSelected>Button</ButtonItem>
            <ButtonItem description="Secondary text" isSelected>
              Primary text
            </ButtonItem>
            <LinkItem
              href="http://www.atlassian.com"
              onClick={(e) => e.preventDefault()}
              isSelected
            >
              Link to Atlassian
            </LinkItem>
            <CustomItem
              component={Link}
              onClick={(e) => e.preventDefault()}
              href="http://www.atlassian.com"
              isSelected
            >
              Custom (Link to Atlassian)
            </CustomItem>
          </Section>
        </SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider>
      </MenuGroup>
    </div>
  );
}
