/** @jsx jsx */
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { css, Global, jsx } from '@emotion/react';

import Page from '@atlaskit/page';
import SectionMessage from '@atlaskit/section-message';
import { SmartLinkActionType } from '@atlaskit/linking-types';
import { token } from '@atlaskit/tokens';
import { exampleTokens } from './flexible-ui';
import { overrideEmbedContent } from './common';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const horizontalWrapperStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 5px;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const getTestWrapperStyles = (height?: number) => css`
  padding: 30px;
  background-color: ${exampleTokens.backgroundColor};
  ${height ? `height: ${height}px` : ''}
`;

export type VRTestWrapperOptions = {
  title: string;
  children: React.ReactNode;
  height?: number;
};

// Mocking Date.now for tests to be consistent
Date.now = () => new Date('2022-01-25T16:44:00.000+1000').getTime();

export const global = (
  <Global
    styles={css`
      // For VR testing purposes we are overriding the animation timing
      // for both the fade-in and the rotating animations. This will
      // freeze animation avoiding potential for VR test flakiness.
      * {
        animation-timing-function: step-end !important;
        animation-duration: 0s !important;
        transition-timing-function: step-end !important;
        transition-duration: 0s !important;
      }
    `}
  />
);

/**
 * Test wrapper used with deprecated vr tests (puppeteer)
 * @deprecated Use ./vr-test-wrapper.tsx for gemini vr tests
 */
export const VRTestWrapper = ({
  title,
  children,
  height,
}: VRTestWrapperOptions) => (
  <IntlProvider locale={'en'}>
    <Page>
      <div css={getTestWrapperStyles(height)}>
        {global}
        <SectionMessage title="Visual regression test">
          <p>Following example is used in visual regression tests.</p>
        </SectionMessage>

        <h6
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          css={css`
            margin-top: 28px;
            margin-bottom: ${token('space.100', '8px')};
          `}
        >
          {title}
        </h6>
        {children}
      </div>
    </Page>
  </IntlProvider>
);

export const HorizontalWrapper: React.FC = ({ children }) => (
  <div css={horizontalWrapperStyles}>{children}</div>
);

export const LozengeActionExample = {
  read: {
    action: {
      actionType: SmartLinkActionType.GetStatusTransitionsAction,
      resourceIdentifiers: {
        issueKey: 'some-id',
        hostname: 'some-hostname',
      },
    },
    providerKey: 'object-provider',
  },
  update: {
    action: {
      actionType: SmartLinkActionType.StatusUpdateAction,
      resourceIdentifiers: {
        issueKey: 'some-id',
        hostname: 'some-hostname',
      },
    },
    providerKey: 'object-provider',
  },
};

export const LozengeActionWithPreviewExample = {
  read: {
    ...LozengeActionExample.read,
  },
  update: {
    action: { ...LozengeActionExample.update.action },
    providerKey: LozengeActionExample.update.providerKey,
    details: {
      id: 'some-link-id',
      url: 'some-link-url',
      previewData: {
        download: 'https://download-url',
        providerName: 'Jira',
        title: 'This is a visual regression test for embed modal',
        src: overrideEmbedContent,
        url: 'link-url',
      },
    },
  },
};
