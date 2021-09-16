import React from 'react';

import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';

import Drawer from '../src';

export default () => {
  return (
    <div>
      <Drawer testId="menu" isOpen={true}>
        <div>
          <MenuGroup>
            <Section title="Starred">
              <ButtonItem description="Next-gen software project">
                Navigation System
              </ButtonItem>
              <ButtonItem description="Next-gen service desk">
                Analytics Platform
              </ButtonItem>
            </Section>
            <Section title="Recent">
              <ButtonItem description="Next-gen software project">
                Fabric Editor
              </ButtonItem>
              <ButtonItem description="Classic business project">
                Content Services
              </ButtonItem>
              <ButtonItem description="Next-gen software project">
                Trinity Mobile
              </ButtonItem>
              <ButtonItem description="Classic service desk">
                Customer Feedback
              </ButtonItem>
              <ButtonItem description="Classic software project">
                Design System
              </ButtonItem>
            </Section>
            <Section hasSeparator>
              <ButtonItem>View all projects</ButtonItem>
              <ButtonItem>Create project</ButtonItem>
            </Section>
          </MenuGroup>
        </div>
      </Drawer>
    </div>
  );
};
