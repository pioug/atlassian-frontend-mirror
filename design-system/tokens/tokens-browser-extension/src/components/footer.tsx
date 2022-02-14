import React from 'react';

import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

const ContentWrapper = ({ children }: any) => (
  <div style={{ padding: '16px 0 0 0' }}>{children}</div>
);

/**
 * __Footer__
 *
 * Footer containing information on the extension project status, support and documentation.
 *
 */
const Footer = () => {
  return (
    <Tabs id="default">
      <TabList>
        <Tab>Status</Tab>
        <Tab>Support</Tab>
        <Tab>Documentation</Tab>
      </TabList>
      <TabPanel>
        <ContentWrapper>
          <p>
            <strong>Disclaimer:</strong> This extension is still in alpha. Parts
            of pages may not respect the theme change as they are yet to be
            instrumented with tokens. Latest updates at:{' '}
            <a href="https://go.atlassian.com/tokens" target="_blank">
              go/tokens
            </a>
            .
          </p>
        </ContentWrapper>
      </TabPanel>
      <TabPanel>
        <ContentWrapper>
          <p>Slack support channels:</p>
          <ul>
            <li>
              <a
                href="https://atlassian.slack.com/archives/C0256AVSPHN"
                target="_blank"
              >
                Tokens early adopters
              </a>
            </li>
            <li>
              <a
                href="https://atlassian.slack.com/archives/CFJ9DU39U"
                target="_blank"
              >
                General design system queries
              </a>
            </li>
          </ul>
        </ContentWrapper>
      </TabPanel>
      <TabPanel>
        <ContentWrapper>
          <ul>
            <li>
              <a
                href="https://atlaskit.atlassian.com/packages/design-system/tokens"
                target="_blank"
              >
                About tokens
              </a>
            </li>
            <li>
              <a
                href="https://atlaskit.atlassian.com/packages/design-system/tokens/docs/tokens-reference"
                target="_blank"
              >
                Tokens reference
              </a>
            </li>
            <li>
              <a
                href="https://hello.atlassian.net/wiki/spaces/DST/pages/1368013124/Early+adopters+guide+Tokens+theming"
                target="_blank"
              >
                Early adopter onboarding
              </a>
            </li>
          </ul>
        </ContentWrapper>
      </TabPanel>
    </Tabs>
  );
};

export default Footer;
