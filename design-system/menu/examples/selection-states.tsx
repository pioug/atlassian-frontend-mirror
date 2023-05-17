import React from 'react';

import {
  ButtonItem,
  CustomItem,
  CustomItemComponentProps,
  LinkItem,
  MenuGroup,
  Section,
  SELECTION_STYLE_CONTEXT_DO_NOT_USE,
} from '../src';

const Link: React.FC<
  CustomItemComponentProps & {
    href: string;
  }
> = ({ children, href, className, onClick, tabIndex }) => {
  return (
    <a href={href} className={className} onClick={onClick} tabIndex={tabIndex}>
      {children}
    </a>
  );
};

export default function Example() {
  return (
    <div data-testid="example" style={{ padding: 12 }}>
      <MenuGroup maxWidth={300}>
        <Section>
          <ButtonItem isSelected>Button</ButtonItem>
          <LinkItem href="#" onClick={(e) => e.preventDefault()} isSelected>
            Link
          </LinkItem>
          <CustomItem
            component={Link}
            onClick={(e) => e.preventDefault()}
            href="#"
            isSelected
          >
            Custom
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
            <LinkItem href="#" onClick={(e) => e.preventDefault()} isSelected>
              Link
            </LinkItem>
            <CustomItem
              component={Link}
              onClick={(e) => e.preventDefault()}
              href="#"
              isSelected
            >
              Custom
            </CustomItem>
          </Section>
        </SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider>
      </MenuGroup>
    </div>
  );
}
