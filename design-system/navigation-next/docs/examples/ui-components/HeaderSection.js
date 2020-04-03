import React from 'react';
import { colors } from '@atlaskit/theme';
import { AtlassianWordmark } from '@atlaskit/logo';
import { HeaderSection, Section, Wordmark } from '../../../src';

import { CONTENT_NAV_WIDTH } from '../../../src/common/constants';

const SectionExample = ({ component: SectionComponent }) => (
  <div
    css={{
      backgroundColor: colors.N20,
      boxSizing: 'border-box',
      width: `${CONTENT_NAV_WIDTH}px`,
    }}
  >
    <SectionComponent id="header-section">
      {({ className }) => (
        <div className={className}>
          <Wordmark wordmark={AtlassianWordmark} />
        </div>
      )}
    </SectionComponent>
  </div>
);

export default () => (
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    <div>
      <h3>Header section</h3>
      <SectionExample component={HeaderSection} />
    </div>
    <div>
      <h3>Standard section</h3>
      <SectionExample component={Section} />
    </div>
  </div>
);
