import React from 'react';
import SectionMessage from '@atlaskit/section-message';

export default () => (
  <p style={{ paddingBottom: '8px' }}>
    <SectionMessage>
      <p>
        As this example is written in react, you will need to change{' '}
        <code>className</code> to <code>class</code> to render them in base
        html.
      </p>
    </SectionMessage>
  </p>
);
