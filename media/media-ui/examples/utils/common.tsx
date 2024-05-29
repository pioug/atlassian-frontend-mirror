import React from 'react';
import { IntlProvider } from 'react-intl-next';
import Page from '@atlaskit/page';
import { token } from '@atlaskit/tokens';

interface VRTestCaseOpts {
  title: string;
  children: () => JSX.Element;
}

export const VRTestCase = ({ title, children }: VRTestCaseOpts) => {
  return (
    <IntlProvider locale={'en'}>
      <Page>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ padding: token('space.400', '32px') }}>
          <h6>{title}</h6>
          {children()}
        </div>
      </Page>
    </IntlProvider>
  );
};
