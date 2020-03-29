import React from 'react';
import { colors } from '@atlaskit/theme';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import IssuesIcon from '@atlaskit/icon/glyph/issues';

import { Item, MenuSection, Section } from '../../../src';

import { CONTENT_NAV_WIDTH } from '../../../src/common/constants';

const SectionExample = ({ component: SectionComponent }) => (
  <div
    css={{
      backgroundColor: colors.N20,
      boxSizing: 'border-box',
      width: `${CONTENT_NAV_WIDTH}px`,
    }}
  >
    <SectionComponent id="menu-section">
      {({ className }) => (
        <div className={className}>
          <Item
            before={DashboardIcon}
            text="Dashboards"
            testKey="product-item-dashboards"
          />
          <Item
            before={FolderIcon}
            text="Projects"
            testKey="product-item-projects"
          />
          <Item
            before={IssuesIcon}
            text="Issues"
            testKey="product-item-issues"
          />
        </div>
      )}
    </SectionComponent>
  </div>
);

export default () => (
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    <div>
      <h3>Menu section</h3>
      <SectionExample component={MenuSection} />
    </div>
    <div>
      <h3>Standard section</h3>
      <SectionExample component={Section} />
    </div>
  </div>
);
