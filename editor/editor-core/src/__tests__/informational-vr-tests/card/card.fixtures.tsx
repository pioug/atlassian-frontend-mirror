import React from 'react';
import { Editor } from '../../../index';
import { SmartCardProvider } from '@atlaskit/link-provider';
// eslint-disable-next-line
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { cardClient } from '@atlaskit/media-integration-test-helpers/card-client';
import cardDatasourceAdf from '../../visual-regression/common/__fixtures__/card-datasource.adf.json';
import cardInlineAndBlock from '../../visual-regression/common/__fixtures__/card-inline-block-adf.json';
import {
  ForbiddenClient,
  NotFoundClient,
  ResolvingClient,
} from './card.customClient';
import {
  embedCardForbiddenAdf,
  embedCardNotFoundAdf,
  embedCardResolvingAdf,
} from './card.fixtures.adf';

export function EditorCardFullPageInlineAndBlock() {
  mockDatasourceFetchRequests({ shouldMockORSBatch: true });
  return (
    <SmartCardProvider client={cardClient}>
      <Editor
        defaultValue={cardInlineAndBlock}
        appearance="full-page"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        }}
      />
    </SmartCardProvider>
  );
}

export const EditorCardFullWidthInlineAndBlock = () => {
  mockDatasourceFetchRequests({ shouldMockORSBatch: true });
  return (
    <SmartCardProvider client={cardClient}>
      <Editor
        defaultValue={cardInlineAndBlock}
        appearance="full-width"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        }}
      />
    </SmartCardProvider>
  );
};
export const EditorCardCommentInlineAndBlock = () => {
  mockDatasourceFetchRequests({ shouldMockORSBatch: true });
  return (
    <SmartCardProvider client={cardClient}>
      <Editor
        defaultValue={cardInlineAndBlock}
        appearance="comment"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        }}
      />
    </SmartCardProvider>
  );
};
export const EditorCardChromelessInlineAndBlock = () => {
  mockDatasourceFetchRequests({ shouldMockORSBatch: true });
  return (
    <SmartCardProvider client={cardClient}>
      <Editor
        defaultValue={cardInlineAndBlock}
        appearance="chromeless"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        }}
      />
    </SmartCardProvider>
  );
};
export const EditorCardMobileInlineAndBlock = () => {
  mockDatasourceFetchRequests({ shouldMockORSBatch: true });
  return (
    <div data-testid="ak-editor-content-area">
      <SmartCardProvider client={cardClient}>
        <Editor
          defaultValue={cardInlineAndBlock}
          appearance="mobile"
          smartLinks={{
            resolveBeforeMacros: ['jira'],
            allowBlockCards: true,
            allowEmbeds: true,
          }}
        />
      </SmartCardProvider>
    </div>
  );
};
export const EditorCardFullPageWithDatasource = () => {
  mockDatasourceFetchRequests({
    shouldMockORSBatch: true,
    initialVisibleColumnKeys: ['type', 'assignee', 'summary', 'description'],
  });
  return (
    <SmartCardProvider client={cardClient}>
      <Editor
        defaultValue={cardDatasourceAdf}
        appearance="full-page"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
          allowDatasource: true,
        }}
        featureFlags={{
          'platform.linking-platform.datasource-jira_issues': true,
        }}
      />
    </SmartCardProvider>
  );
};
export const EditorCardFullWidthWithDatasource = () => {
  mockDatasourceFetchRequests({
    shouldMockORSBatch: true,
    initialVisibleColumnKeys: ['type', 'assignee', 'summary', 'description'],
  });
  return (
    <SmartCardProvider client={cardClient}>
      <Editor
        defaultValue={cardDatasourceAdf}
        appearance="full-width"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
          allowDatasource: true,
        }}
        featureFlags={{
          'platform.linking-platform.datasource-jira_issues': true,
        }}
      />
    </SmartCardProvider>
  );
};
export const EditorCardCommentWithDatasource = () => {
  mockDatasourceFetchRequests({
    shouldMockORSBatch: true,
    initialVisibleColumnKeys: ['type', 'assignee', 'summary', 'description'],
  });
  return (
    <SmartCardProvider client={cardClient}>
      <Editor
        defaultValue={cardDatasourceAdf}
        appearance="comment"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
          allowDatasource: true,
        }}
        featureFlags={{
          'platform.linking-platform.datasource-jira_issues': true,
        }}
      />
    </SmartCardProvider>
  );
};
export const EditorCardChromelessWithDatasource = () => {
  mockDatasourceFetchRequests({
    shouldMockORSBatch: true,
    initialVisibleColumnKeys: ['type', 'assignee', 'summary', 'description'],
  });
  return (
    <SmartCardProvider client={cardClient}>
      <Editor
        defaultValue={cardDatasourceAdf}
        appearance="chromeless"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
          allowDatasource: true,
        }}
        featureFlags={{
          'platform.linking-platform.datasource-jira_issues': true,
        }}
      />
    </SmartCardProvider>
  );
};
export const EditorCardMobileWithDatasource = () => {
  mockDatasourceFetchRequests({
    shouldMockORSBatch: true,
    initialVisibleColumnKeys: ['type', 'assignee', 'summary', 'description'],
  });
  return (
    <div data-testid="ak-editor-content-area">
      <SmartCardProvider client={cardClient}>
        <Editor
          defaultValue={cardDatasourceAdf}
          appearance="mobile"
          smartLinks={{
            resolveBeforeMacros: ['jira'],
            allowBlockCards: true,
            allowEmbeds: true,
            allowDatasource: true,
          }}
          featureFlags={{
            'platform.linking-platform.datasource-jira_issues': true,
          }}
        />
      </SmartCardProvider>
    </div>
  );
};

export function EditorCardFullPageEmbedNotFound() {
  return (
    <SmartCardProvider client={new NotFoundClient()}>
      <Editor
        defaultValue={embedCardNotFoundAdf}
        appearance="full-page"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        }}
      />
    </SmartCardProvider>
  );
}

export function EditorCardFullPageEmbedResolving() {
  return (
    <SmartCardProvider client={new ResolvingClient(1000000)}>
      <Editor
        defaultValue={embedCardResolvingAdf}
        appearance="full-page"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        }}
      />
    </SmartCardProvider>
  );
}

export function EditorCardFullPageEmbedForbidden() {
  return (
    <SmartCardProvider client={new ForbiddenClient()}>
      <Editor
        defaultValue={embedCardForbiddenAdf}
        appearance="full-page"
        smartLinks={{
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        }}
      />
    </SmartCardProvider>
  );
}
