import React from 'react';
import {
  md,
  code,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';

const helpPanelProps = require('!!extract-react-types-loader!../src/components/HelpLayout');

export default md`
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )}

  ## Usage

  ${code`
  import React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Page from '@atlaskit/page';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import HelpLayout from '../src/index';

import {
  ExampleWrapper,
  HelpWrapper,
  FooterContent,
  ExampleDefaultContent,
} from './utils/styled';

const handleEvent = (analyticsEvent: { payload: any; context: any }) => {
  const { payload, context } = analyticsEvent;
  console.log('Received event:', { payload, context });
};

const Example: React.FC = () => {
  return (
    <ExampleWrapper>
      <Page>
        <HelpWrapper>
          <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
            <LocaleIntlProvider locale={'en'}>
              <HelpLayout
                isBackbuttonVisible={true}
                footer={
                  <FooterContent>
                    <span>Footer</span>
                  </FooterContent>
                }
              >
                <ExampleDefaultContent>
                  <span>Default content</span>
                </ExampleDefaultContent>
              </HelpLayout>
            </LocaleIntlProvider>
          </AnalyticsListener>
        </HelpWrapper>
      </Page>
    </ExampleWrapper>
  );
};

export default Example;
  `}

  ${(<Props props={helpPanelProps} />)}
`;
