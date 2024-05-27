/** @jsx jsx */
import React, { type PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl-next';
import { css, Global, jsx } from '@emotion/react';

import Page from '@atlaskit/page';
import SectionMessage from '@atlaskit/section-message';
import { SmartLinkActionType } from '@atlaskit/linking-types';
import { token } from '@atlaskit/tokens';
import { exampleTokens } from './flexible-ui';
import { overrideEmbedContent } from './common';

const horizontalWrapperStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: token('space.050', '4px'),
  padding: token('space.050', '4px'),
});

const getTestWrapperStyles = (height?: number) =>
  css(
    {
      padding: token('space.400', '32px'),
      backgroundColor: exampleTokens.backgroundColor,
    },
    height ? `height: ${height}px` : '',
  );

export type VRTestWrapperOptions = {
  title: string;
  children: React.ReactNode;
  height?: number;
};

// Mocking Date.now for tests to be consistent
Date.now = () => new Date('2022-01-25T16:44:00.000+1000').getTime();

export const global = (
  <Global
    styles={css({
      '*': {
        animationTimingFunction: 'step-end !important',
        animationDuration: '0s !important',
        transitionTimingFunction: 'step-end !important',
        transitionDuration: '0s !important',
      },
    })}
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
          css={css({
            marginTop: token('space.300', '24px'),
            marginBottom: token('space.100', '8px'),
          })}
        >
          {title}
        </h6>
        {children}
      </div>
    </Page>
  </IntlProvider>
);

export const HorizontalWrapper = ({ children }: PropsWithChildren<{}>) => (
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
        providerName: 'Jira',
        title: 'This is a visual regression test for embed modal',
        src: overrideEmbedContent,
        url: 'link-url',
      },
    },
  },
};
